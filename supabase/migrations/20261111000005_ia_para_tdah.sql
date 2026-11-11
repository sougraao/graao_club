-- =====================================================================
-- graao club · IA para TDAH — cadastro de interesse + projetos criativos
-- Migração INCREMENTAL: só cria objetos novos e acrescenta permissões.
-- Nada existente é removido, renomeado ou alterado (sem DROP, sem limpeza).
--
--  1. interest_leads   → cadastro de interesse na primeira turma (landing)
--                        escrita pública SÓ pela função register_interest
--                        (validação, armadilha anti-robô, limite por origem,
--                        sem duplicados, sem revelar se o e-mail já existia)
--  2. creative_projects, project_steps, project_activity
--                      → área "Projetos" / "Meu Dia": dados privados de cada
--                        pessoa. A equipe NÃO lê briefings; vê só agregados.
--  3. admin_overview() → indicadores reais para o painel, com a permissão
--                        conferida no servidor.
-- Teste: supabase/tests/rls_smoke.sql
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0) Permissões novas (mesma matriz rota → permissão → papel do admin)
-- ---------------------------------------------------------------------
insert into public.role_permissions (role, permission) values
  ('ADMIN', 'leads.view'), ('ADMIN', 'leads.manage'),
  ('STAFF', 'leads.view')
on conflict do nothing;

-- ---------------------------------------------------------------------
-- 1) Cadastro de interesse
-- ---------------------------------------------------------------------
create table public.interest_leads (
  id                uuid primary key default gen_random_uuid(),
  email             text not null unique
                    check (char_length(email) between 6 and 254
                           and email = lower(email)
                           and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]{2,}$'),
  name              text check (name is null or char_length(name) between 1 and 80),
  area              text check (area is null or area in ('design', 'social-media', 'conteudo', 'edicao', 'audiovisual', 'comunicacao', 'outra')),
  source            text not null default 'landing' check (source ~ '^[a-z0-9-]{1,40}$'),
  consent_version   text not null check (char_length(consent_version) between 1 and 60),
  consent_at        timestamptz not null default now(),
  status            text not null default 'novo' check (status in ('novo', 'contatado', 'descadastrado')),
  unsubscribe_token uuid not null unique default gen_random_uuid(),
  unsubscribed_at   timestamptz,
  note              text not null default '' check (char_length(note) <= 500),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index interest_leads_created_idx on public.interest_leads (created_at desc);
comment on table public.interest_leads is 'Interessados na primeira turma do IA para TDAH. Sem dados de saúde. Escrita pública só via register_interest().';

-- Consentimento, e-mail e token não mudam pela API (nem pela equipe).
-- Funções do servidor (security definer, dono da tabela) podem.
create or replace function public.guard_lead()
returns trigger language plpgsql set search_path = public as $$
begin
  if current_user in ('anon', 'authenticated') and (
       new.email is distinct from old.email or new.consent_at is distinct from old.consent_at
    or new.consent_version is distinct from old.consent_version or new.unsubscribe_token is distinct from old.unsubscribe_token
    or new.created_at is distinct from old.created_at or new.source is distinct from old.source) then
    raise exception 'Dados de consentimento não podem ser alterados' using errcode = '42501';
  end if;
  if new.status = 'descadastrado' and old.status is distinct from 'descadastrado' then new.unsubscribed_at := now(); end if;
  if new.status <> 'descadastrado' then new.unsubscribed_at := null; end if;
  new.updated_at := now();
  return new;
end $$;
create trigger interest_leads_guard before update on public.interest_leads
  for each row execute function public.guard_lead();
-- auditoria só de alterações/remoções feitas pela equipe (inserções públicas não geram cópia do e-mail no log)
create trigger interest_leads_audit after update or delete on public.interest_leads
  for each row execute function public.audit();

-- Limite de tentativas por origem (só o hash da origem fica guardado, por 1 dia)
create table private.lead_hits (
  id         bigint generated always as identity primary key,
  bucket     text not null,
  created_at timestamptz not null default now()
);
create index lead_hits_bucket_idx on private.lead_hits (bucket, created_at);
alter table private.lead_hits enable row level security;
revoke all on private.lead_hits from public, anon, authenticated;

create or replace function private.register_interest(
  p_email text, p_name text default null, p_area text default null, p_consent boolean default false,
  p_source text default 'landing', p_website text default null, p_elapsed_ms int default null)
returns jsonb language plpgsql security definer set search_path = public, private as $$
declare
  v_email  text := lower(btrim(coalesce(p_email, '')));
  v_name   text := nullif(btrim(regexp_replace(coalesce(p_name, ''), '[[:space:]]+', ' ', 'g')), '');
  v_area   text := nullif(btrim(coalesce(p_area, '')), '');
  v_source text := coalesce(nullif(btrim(coalesce(p_source, '')), ''), 'landing');
  v_ip     text := '';
  v_bucket text;
begin
  -- 1. limite por origem (8 tentativas válidas / 10 min) e teto global (500 / hora)
  begin
    v_ip := btrim(split_part(coalesce(current_setting('request.headers', true)::json ->> 'x-forwarded-for', ''), ',', 1));
  exception when others then v_ip := '';
  end;
  v_bucket := encode(sha256(convert_to('graao-lead:' || coalesce(nullif(v_ip, ''), 'sem-origem'), 'UTF8')), 'hex');
  delete from private.lead_hits where created_at < now() - interval '1 day';
  if (select count(*) from private.lead_hits where bucket = v_bucket and created_at > now() - interval '10 minutes') >= 8
     or (select count(*) from private.lead_hits where created_at > now() - interval '1 hour') >= 500 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;
  insert into private.lead_hits (bucket) values (v_bucket);

  -- 2. armadilha anti-robô: campo invisível preenchido → responde ok e não grava nada
  if nullif(btrim(coalesce(p_website, '')), '') is not null then
    return jsonb_build_object('ok', true);
  end if;
  -- envio rápido demais para uma pessoa (formulário aberto há menos de 1,5 s)
  if p_elapsed_ms is not null and p_elapsed_ms < 1500 then
    raise exception 'too_fast' using errcode = 'P0001';
  end if;

  -- 3. validação
  if char_length(v_email) > 254 or v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]{2,}$' then
    raise exception 'invalid_email' using errcode = '22023';
  end if;
  if coalesce(p_consent, false) is not true then
    raise exception 'consent_required' using errcode = '22023';
  end if;
  v_name := left(v_name, 80);
  if v_area is not null and v_area not in ('design', 'social-media', 'conteudo', 'edicao', 'audiovisual', 'comunicacao', 'outra') then v_area := 'outra'; end if;
  if v_source !~ '^[a-z0-9-]{1,40}$' then v_source := 'landing'; end if;

  -- 4. grava sem duplicar. A resposta é sempre a mesma: não revela se o e-mail já existia.
  insert into public.interest_leads (email, name, area, source, consent_version)
  values (v_email, v_name, v_area, v_source, 'interesse-v1-2026-11')
  on conflict (email) do update set
    name            = coalesce(interest_leads.name, excluded.name),
    area            = coalesce(interest_leads.area, excluded.area),
    consent_version = excluded.consent_version,
    consent_at      = now(),
    status          = case when interest_leads.status = 'descadastrado' then 'novo' else interest_leads.status end;
  return jsonb_build_object('ok', true);
end $$;

create or replace function private.unsubscribe_interest(p_token uuid)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  update public.interest_leads set status = 'descadastrado'
  where unsubscribe_token = p_token and status <> 'descadastrado';
  return exists (select 1 from public.interest_leads where unsubscribe_token = p_token);
end $$;

-- Portas públicas da API (security invoker): só repassam para as funções privadas
create or replace function public.register_interest(
  p_email text, p_name text default null, p_area text default null, p_consent boolean default false,
  p_source text default 'landing', p_website text default null, p_elapsed_ms int default null)
returns jsonb language sql security invoker set search_path = '' as $$
  select private.register_interest(p_email, p_name, p_area, p_consent, p_source, p_website, p_elapsed_ms);
$$;
create or replace function public.unsubscribe_interest(p_token uuid)
returns boolean language sql security invoker set search_path = '' as $$
  select private.unsubscribe_interest(p_token);
$$;

revoke all on function private.register_interest(text, text, text, boolean, text, text, int) from public;
revoke all on function private.unsubscribe_interest(uuid) from public;
revoke all on function public.register_interest(text, text, text, boolean, text, text, int) from public;
revoke all on function public.unsubscribe_interest(uuid) from public;
grant execute on function private.register_interest(text, text, text, boolean, text, text, int) to anon, authenticated;
grant execute on function private.unsubscribe_interest(uuid) to anon, authenticated;
grant execute on function public.register_interest(text, text, text, boolean, text, text, int) to anon, authenticated;
grant execute on function public.unsubscribe_interest(uuid) to anon, authenticated;

-- RLS: ninguém insere direto; só a equipe com permissão lê/edita
alter table public.interest_leads enable row level security;
revoke insert on public.interest_leads from anon, authenticated;
revoke update, delete on public.interest_leads from anon;
create policy "leads: ler" on public.interest_leads for select to authenticated
  using ((select private.has_perm('leads.view')));
create policy "leads: editar" on public.interest_leads for update to authenticated
  using ((select private.has_perm('leads.manage'))) with check ((select private.has_perm('leads.manage')));
create policy "leads: apagar" on public.interest_leads for delete to authenticated
  using ((select private.has_perm('leads.manage')));

-- ---------------------------------------------------------------------
-- 2) Projetos criativos (privados de cada pessoa)
-- ---------------------------------------------------------------------
create table public.creative_projects (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references public.profiles on delete cascade,
  title        text not null check (char_length(btrim(title)) between 1 and 120),
  description  text not null default '' check (char_length(description) <= 1000),
  briefing     text not null default '' check (char_length(briefing) <= 8000),
  objective    text not null default '' check (char_length(objective) <= 600),
  deliverables text not null default '' check (char_length(deliverables) <= 2000),
  resume_note  text not null default '' check (char_length(resume_note) <= 600),
  orbita       text check (orbita in ('O', 'R', 'B', 'I', 'T', 'A')),
  status       text not null default 'ativo' check (status in ('ativo', 'pausado', 'entregue', 'arquivado')),
  is_main      boolean not null default false,
  due_on       date,
  delivered_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index creative_projects_user_idx on public.creative_projects (user_id, updated_at desc);
create unique index creative_projects_one_main on public.creative_projects (user_id) where is_main;
comment on table public.creative_projects is 'Projetos do aluno (IA para TDAH). Privados: só o dono lê. A equipe vê apenas agregados via admin_overview().';

create table public.project_steps (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.creative_projects on delete cascade,
  user_id    uuid not null default auth.uid() references public.profiles on delete cascade,
  title      text not null check (char_length(btrim(title)) between 1 and 240),
  orbita     text check (orbita in ('O', 'R', 'B', 'I', 'T', 'A')),
  is_next    boolean not null default false,
  done       boolean not null default false,
  done_at    timestamptz,
  position   int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index project_steps_project_idx on public.project_steps (project_id, position);
create index project_steps_user_idx on public.project_steps (user_id);
create unique index project_steps_one_next on public.project_steps (project_id) where is_next;

create table public.project_activity (
  id         bigint generated always as identity primary key,
  project_id uuid not null references public.creative_projects on delete cascade,
  user_id    uuid not null default auth.uid() references public.profiles on delete cascade,
  kind       text not null default 'nota' check (kind in ('nota', 'passo', 'status')),
  text       text not null check (char_length(btrim(text)) between 1 and 1000),
  created_at timestamptz not null default now()
);
create index project_activity_project_idx on public.project_activity (project_id, created_at desc);
create index project_activity_user_idx on public.project_activity (user_id);

-- Regras de consistência (rodam com os direitos de quem edita; a RLS continua valendo)
create or replace function public.projects_before()
returns trigger language plpgsql set search_path = public as $$
begin
  if tg_op = 'UPDATE' then
    new.user_id := old.user_id;            -- projeto não muda de dono
    new.created_at := old.created_at;
    new.updated_at := now();
  end if;
  if new.status = 'entregue' then
    if tg_op = 'INSERT' or old.status is distinct from 'entregue' then new.delivered_at := now(); end if;
  else
    new.delivered_at := null;
  end if;
  if new.is_main and (tg_op = 'INSERT' or not old.is_main) then
    update public.creative_projects set is_main = false where user_id = new.user_id and is_main and id <> new.id;
  end if;
  return new;
end $$;
create trigger creative_projects_before before insert or update on public.creative_projects
  for each row execute function public.projects_before();

create or replace function public.projects_after()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.status is distinct from old.status then
    insert into public.project_activity (project_id, user_id, kind, text)
    values (new.id, new.user_id, 'status', case new.status
      when 'entregue' then 'Entrega concluída' when 'pausado' then 'Projeto pausado'
      when 'arquivado' then 'Projeto arquivado' else 'Projeto retomado' end);
  end if;
  return null;
end $$;
create trigger creative_projects_after after update on public.creative_projects
  for each row execute function public.projects_after();

create or replace function public.steps_before()
returns trigger language plpgsql set search_path = public as $$
begin
  if tg_op = 'UPDATE' then
    new.user_id := old.user_id;
    new.project_id := old.project_id;      -- microtarefa não troca de projeto
    new.created_at := old.created_at;
    new.updated_at := now();
  end if;
  if new.done then
    if tg_op = 'INSERT' or not old.done then new.done_at := now(); end if;
    new.is_next := false;                  -- concluída deixa de ser a próxima ação
  else
    new.done_at := null;
  end if;
  if new.is_next and (tg_op = 'INSERT' or not old.is_next) then
    update public.project_steps set is_next = false where project_id = new.project_id and is_next and id <> new.id;
  end if;
  return new;
end $$;
create trigger project_steps_before before insert or update on public.project_steps
  for each row execute function public.steps_before();

create or replace function public.steps_after()
returns trigger language plpgsql set search_path = public as $$
begin
  if tg_op = 'UPDATE' and new.done and not old.done then
    insert into public.project_activity (project_id, user_id, kind, text)
    values (new.project_id, new.user_id, 'passo', left(new.title, 1000));
  end if;
  -- "último trabalho" do projeto, para o Meu Dia saber de onde retomar
  update public.creative_projects set updated_at = now() where id = new.project_id;
  return null;
end $$;
create trigger project_steps_after after insert or update on public.project_steps
  for each row execute function public.steps_after();

revoke execute on function public.guard_lead(), public.projects_before(), public.projects_after(),
  public.steps_before(), public.steps_after() from public, anon, authenticated;

-- RLS: cada pessoa só vê e mexe nos próprios projetos. Sem acesso da equipe.
alter table public.creative_projects enable row level security;
alter table public.project_steps enable row level security;
alter table public.project_activity enable row level security;

create policy "projetos: ler os meus" on public.creative_projects for select to authenticated
  using (user_id = (select auth.uid()));
create policy "projetos: criar" on public.creative_projects for insert to authenticated
  with check (user_id = (select auth.uid()) and (select private.is_active_member()));
create policy "projetos: editar os meus" on public.creative_projects for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "projetos: apagar os meus" on public.creative_projects for delete to authenticated
  using (user_id = (select auth.uid()));

create policy "microtarefas: ler as minhas" on public.project_steps for select to authenticated
  using (user_id = (select auth.uid()));
create policy "microtarefas: criar" on public.project_steps for insert to authenticated
  with check (user_id = (select auth.uid())
    and exists (select 1 from public.creative_projects p where p.id = project_id and p.user_id = (select auth.uid())));
create policy "microtarefas: editar as minhas" on public.project_steps for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "microtarefas: apagar as minhas" on public.project_steps for delete to authenticated
  using (user_id = (select auth.uid()));

create policy "histórico: ler o meu" on public.project_activity for select to authenticated
  using (user_id = (select auth.uid()));
create policy "histórico: registrar" on public.project_activity for insert to authenticated
  with check (user_id = (select auth.uid())
    and exists (select 1 from public.creative_projects p where p.id = project_id and p.user_id = (select auth.uid())));
create policy "histórico: apagar o meu" on public.project_activity for delete to authenticated
  using (user_id = (select auth.uid()));

revoke all on public.creative_projects, public.project_steps, public.project_activity from anon;

-- ---------------------------------------------------------------------
-- 3) Indicadores reais do painel (só agregados; permissão conferida aqui)
-- ---------------------------------------------------------------------
create or replace function private.admin_overview()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare r jsonb;
begin
  if not private.has_perm('dashboard.view') then
    raise exception 'Sem permissão' using errcode = '42501';
  end if;
  r := jsonb_build_object(
    'accounts',             (select count(*) from profiles),
    'members_with_project', (select count(distinct user_id) from creative_projects),
    'projects_total',       (select count(*) from creative_projects),
    'projects_active',      (select count(*) from creative_projects where status = 'ativo'),
    'projects_paused',      (select count(*) from creative_projects where status = 'pausado'),
    'projects_delivered',   (select count(*) from creative_projects where status = 'entregue'),
    'steps_total',          (select count(*) from project_steps),
    'steps_done',           (select count(*) from project_steps where done),
    'notes_total',          (select count(*) from project_activity where kind = 'nota'),
    'generated_at',         now());
  if private.has_perm('leads.view') then
    r := r || jsonb_build_object(
      'leads_active',       (select count(*) from interest_leads where status <> 'descadastrado'),
      'leads_7d',           (select count(*) from interest_leads where created_at > now() - interval '7 days'),
      'leads_unsubscribed', (select count(*) from interest_leads where status = 'descadastrado'),
      'leads_by_area',      (select coalesce(jsonb_object_agg(a, n), '{}'::jsonb) from (
                               select coalesce(area, 'nao-informada') a, count(*) n from interest_leads
                               where status <> 'descadastrado' group by 1) s),
      'leads_by_week',      (select coalesce(jsonb_agg(jsonb_build_object('week', to_char(w, 'DD/MM'), 'n', coalesce(c.n, 0)) order by w), '[]'::jsonb)
                             from generate_series(date_trunc('week', now()) - interval '7 weeks', date_trunc('week', now()), interval '1 week') w
                             left join (select date_trunc('week', created_at) wk, count(*) n from interest_leads group by 1) c on c.wk = w));
  end if;
  return r;
end $$;

create or replace function public.admin_overview()
returns jsonb language sql stable security invoker set search_path = '' as $$
  select private.admin_overview();
$$;
revoke all on function private.admin_overview() from public, anon;
revoke all on function public.admin_overview() from public, anon;
grant execute on function private.admin_overview() to authenticated;
grant execute on function public.admin_overview() to authenticated;
