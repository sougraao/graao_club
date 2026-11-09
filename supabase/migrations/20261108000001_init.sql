-- =====================================================================
-- graao club · migração inicial
-- Esquema completo + Row Level Security + matriz de permissões.
-- Ver BACKEND.md. Aplicar com: Supabase MCP (apply_migration) ou `supabase db push`.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Tipos
-- ---------------------------------------------------------------------
create type public.plan_tier     as enum ('semente', 'broto', 'colheita');
create type public.team_role     as enum ('ADMIN', 'STAFF', 'EDITOR');
create type public.pub_status    as enum ('publicado', 'rascunho');
create type public.tool_status   as enum ('ativa', 'beta', 'desligada');
create type public.tool_kind     as enum ('interno', 'link');
create type public.report_status as enum ('pendente', 'resolvida');
create type public.ticket_status as enum ('aberto', 'em andamento', 'resolvido');
create type public.idea_status   as enum ('nova', 'em análise', 'planejada', 'lançada', 'recusada');
create type public.audience      as enum ('todos', 'semente', 'broto', 'colheita');
create type public.sub_status    as enum ('ativa', 'pendente', 'cancelada', 'expirada');

-- ---------------------------------------------------------------------
-- Pessoas
-- ---------------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  username    text not null unique check (username ~ '^[a-z0-9_.]{3,30}$'),
  name        text not null default '' check (char_length(name) <= 80),
  headline    text not null default '' check (char_length(headline) <= 80),
  bio         text not null default '' check (char_length(bio) <= 280),
  city        text not null default '' check (char_length(city) <= 80),
  company     text not null default '' check (char_length(company) <= 80),
  skills      text[] not null default '{}',
  links       jsonb not null default '{}'::jsonb,
  avatar_path text,
  plan        public.plan_tier not null default 'semente',
  banned      boolean not null default false,
  created_at  timestamptz not null default now()
);

create table public.team_members (
  user_id    uuid primary key references public.profiles on delete cascade,
  role       public.team_role not null,
  created_at timestamptz not null default now()
);

create table public.role_permissions (
  role       public.team_role not null,
  permission text not null,
  primary key (role, permission)
);

-- ---------------------------------------------------------------------
-- Funções auxiliares (usadas pelas políticas)
-- ---------------------------------------------------------------------
create or replace function public.has_perm(p text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from team_members tm
    join role_permissions rp on rp.role = tm.role
    where tm.user_id = auth.uid() and rp.permission = p
  );
$$;

create or replace function public.is_team()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from team_members where user_id = auth.uid());
$$;

create or replace function public.plan_rank(p public.plan_tier)
returns int language sql immutable set search_path = public as $$
  select case p when 'semente' then 0 when 'broto' then 1 else 2 end;
$$;

create or replace function public.my_plan()
returns public.plan_tier language sql stable security definer set search_path = public as $$
  select coalesce((select plan from profiles where id = auth.uid()), 'semente'::public.plan_tier);
$$;

create or replace function public.is_active_member()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and not banned);
$$;

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at := now(); return new; end $$;

-- Cria o perfil automaticamente no cadastro
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare base text; candidate text; n int := 0;
begin
  base := lower(regexp_replace(split_part(coalesce(new.email, 'membro'), '@', 1), '[^a-z0-9_.]', '', 'g'));
  if char_length(base) < 3 then base := base || 'membro'; end if;
  base := left(base, 24);
  candidate := base;
  while exists (select 1 from profiles where username = candidate) loop
    n := n + 1; candidate := base || n;
  end loop;
  insert into profiles (id, username, name, avatar_path)
  values (new.id, candidate,
          coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name', initcap(base)),
          new.raw_user_meta_data ->> 'avatar_url');
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

-- Plano e bloqueio só mudam por quem gerencia membros ou pelo servidor (webhook de pagamento)
create or replace function public.guard_profile()
returns trigger language plpgsql set search_path = public as $$
begin
  if (new.plan is distinct from old.plan or new.banned is distinct from old.banned)
     and not public.has_perm('users.manage')
     and coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'Sem permissão para alterar plano ou bloqueio' using errcode = '42501';
  end if;
  return new;
end $$;

create trigger profiles_guard before update on public.profiles
  for each row execute function public.guard_profile();

-- Só quem tem roles.manage altera a equipe
create or replace function public.guard_team()
returns trigger language plpgsql set search_path = public as $$
begin
  if not public.has_perm('roles.manage') and coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'Só o administrador muda papéis' using errcode = '42501';
  end if;
  return coalesce(new, old);
end $$;

create trigger team_guard before insert or update or delete on public.team_members
  for each row execute function public.guard_team();

-- ---------------------------------------------------------------------
-- Conteúdo
-- ---------------------------------------------------------------------
create table public.trails (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9-]{2,60}$'),
  name        text not null,
  description text not null default '',
  plan        public.plan_tier not null default 'broto',
  status      public.pub_status not null default 'rascunho',
  safra       text not null default 'noite' check (safra in ('lima', 'mar', 'sol', 'brasa', 'uva', 'noite')),
  object      text not null default 'obj-grao.svg',
  position    int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger trails_touch before update on public.trails for each row execute function public.touch_updated_at();

create table public.modules (
  id          uuid primary key default gen_random_uuid(),
  trail_id    uuid not null references public.trails on delete cascade,
  title       text not null,
  description text not null default '',
  position    int not null default 0,
  soon        boolean not null default false
);
create index on public.modules (trail_id, position);

create table public.lessons (
  id          uuid primary key default gen_random_uuid(),
  module_id   uuid not null references public.modules on delete cascade,
  title       text not null,
  position    int not null default 0,
  video_key   text,                 -- chave do objeto no bucket R2 privado
  duration_s  int,
  created_at  timestamptz not null default now()
);
create index on public.lessons (module_id, position);

create or replace function public.can_access_trail(t uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_perm('content.manage') or exists (
    select 1 from trails
    where id = t and status = 'publicado' and public.plan_rank(plan) <= public.plan_rank(public.my_plan())
  );
$$;

create or replace function public.trail_of_lesson(l uuid)
returns uuid language sql stable security definer set search_path = public as $$
  select m.trail_id from lessons le join modules m on m.id = le.module_id where le.id = l;
$$;

create table public.lesson_progress (
  user_id      uuid not null default auth.uid() references public.profiles on delete cascade,
  lesson_id    uuid not null references public.lessons on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table public.first_steps (
  user_id uuid not null default auth.uid() references public.profiles on delete cascade,
  step    text not null check (step in ('perfil', 'seguir', 'noticia', 'post', 'publicar')),
  done_at timestamptz not null default now(),
  primary key (user_id, step)
);

create table public.certificates (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references public.profiles on delete cascade,
  trail_id  uuid not null references public.trails on delete cascade,
  code      text not null unique default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12)),
  issued_at timestamptz not null default now(),
  unique (user_id, trail_id)
);

-- ---------------------------------------------------------------------
-- Comunidade
-- ---------------------------------------------------------------------
create table public.posts (
  id         uuid primary key default gen_random_uuid(),
  author_id  uuid not null default auth.uid() references public.profiles on delete cascade,
  text       text not null check (char_length(text) between 1 and 600),
  image_path text,
  pinned     boolean not null default false,
  hidden     boolean not null default false,
  created_at timestamptz not null default now()
);
create index on public.posts (created_at desc);

create table public.post_likes (
  post_id uuid not null references public.posts on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table public.comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.posts on delete cascade,
  author_id  uuid not null default auth.uid() references public.profiles on delete cascade,
  text       text not null check (char_length(text) between 1 and 600),
  hidden     boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.follows (
  follower_id uuid not null default auth.uid() references public.profiles on delete cascade,
  followee_id uuid not null references public.profiles on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (follower_id, followee_id),
  check (follower_id <> followee_id)
);

create table public.reports (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid references public.posts on delete set null,
  reporter_id uuid not null default auth.uid() references public.profiles on delete cascade,
  reason      text not null check (char_length(reason) <= 120),
  status      public.report_status not null default 'pendente',
  resolution  text check (resolution in ('mantido', 'ocultado', 'excluído')),
  resolved_by uuid references public.profiles,
  resolved_at timestamptz,
  created_at  timestamptz not null default now()
);

-- Membro comum só pode editar o texto do próprio post; fixar/ocultar é da moderação
create or replace function public.guard_post()
returns trigger language plpgsql set search_path = public as $$
begin
  if (new.pinned is distinct from old.pinned or new.hidden is distinct from old.hidden)
     and not public.has_perm('community.moderate') then
    raise exception 'Só a moderação fixa ou oculta posts' using errcode = '42501';
  end if;
  return new;
end $$;
create trigger posts_guard before update on public.posts for each row execute function public.guard_post();

-- ---------------------------------------------------------------------
-- Notícias e ferramentas
-- ---------------------------------------------------------------------
create table public.news (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  category     text not null,
  excerpt      text not null default '',
  body         text[] not null default '{}',
  cover_path   text,
  status       public.pub_status not null default 'rascunho',
  read_minutes int not null default 3,
  published_at date not null default current_date,
  created_at   timestamptz not null default now()
);

create table public.news_likes (news_id uuid references public.news on delete cascade, user_id uuid default auth.uid() references public.profiles on delete cascade, primary key (news_id, user_id));
create table public.news_saves (news_id uuid references public.news on delete cascade, user_id uuid default auth.uid() references public.profiles on delete cascade, primary key (news_id, user_id));

create table public.tools (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text not null default '',
  category    text not null,
  kind        public.tool_kind not null default 'link',
  app         text check (app in ('prompt', 'preco', 'paleta')),
  url         text check (url is null or url ~ '^https://'),
  icon        text not null default 'sparkles',
  safra       text not null default 'noite',
  plan        public.plan_tier not null default 'semente',
  status      public.tool_status not null default 'desligada',
  featured    boolean not null default false,
  created_at  timestamptz not null default now()
);

create table public.tool_usage (
  id      bigint generated always as identity primary key,
  tool_id uuid not null references public.tools on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles on delete cascade,
  used_at timestamptz not null default now()
);
create index on public.tool_usage (tool_id);

-- ---------------------------------------------------------------------
-- Engajamento: pontos (livro-razão), temporadas, avisos
-- ---------------------------------------------------------------------
create table public.point_rules (
  id     text primary key,
  label  text not null,
  points int not null check (points between 0 and 1000),
  active boolean not null default true
);

create table public.seasons (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  starts_on     date not null,
  ends_on       date not null check (ends_on >= starts_on),
  prize         text not null default '',
  prize_visible boolean not null default false
);

create table public.point_events (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references public.profiles on delete cascade,
  season_id  uuid references public.seasons on delete set null,
  rule_id    text references public.point_rules,
  points     int not null,
  ref        text not null default '',
  note       text,
  created_by uuid references public.profiles,
  created_at timestamptz not null default now(),
  unique (user_id, rule_id, ref)
);

create or replace function public.current_season()
returns uuid language sql stable set search_path = public as $$
  select id from public.seasons where current_date between starts_on and ends_on order by starts_on desc limit 1;
$$;

-- Única porta de entrada de pontos automáticos
create or replace function public.award_points(p_user uuid, p_rule text, p_ref text)
returns void language plpgsql security definer set search_path = public as $$
declare pts int;
begin
  select points into pts from point_rules where id = p_rule and active;
  if pts is null or pts = 0 then return; end if;
  insert into point_events (user_id, season_id, rule_id, points, ref)
  values (p_user, public.current_season(), p_rule, pts, coalesce(p_ref, ''))
  on conflict (user_id, rule_id, ref) do nothing;
end $$;
revoke execute on function public.award_points(uuid, text, text) from public, anon, authenticated;

create or replace function public.on_lesson_completed()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform public.award_points(new.user_id, 'aula', new.lesson_id::text);
  return new;
end $$;
create trigger lesson_progress_points after insert on public.lesson_progress
  for each row execute function public.on_lesson_completed();

-- Ranking público da temporada (função em vez de view para não expor point_events inteira)
create or replace function public.season_leaderboard(p_limit int default 50)
returns table (user_id uuid, name text, username text, avatar_path text, points int)
language sql stable security definer set search_path = public as $$
  select pe.user_id, p.name, p.username, p.avatar_path, sum(pe.points)::int as points
  from point_events pe
  join profiles p on p.id = pe.user_id and not p.banned
  where pe.season_id = public.current_season()
  group by pe.user_id, p.name, p.username, p.avatar_path
  order by points desc
  limit least(greatest(p_limit, 1), 200);
$$;

create table public.announcements (
  id         uuid primary key default gen_random_uuid(),
  title      text not null check (char_length(title) <= 120),
  body       text not null default '',
  audience   public.audience not null default 'todos',
  link       text not null default 'inicio',
  created_by uuid default auth.uid() references public.profiles,
  created_at timestamptz not null default now()
);

create table public.announcement_reads (
  announcement_id uuid references public.announcements on delete cascade,
  user_id         uuid default auth.uid() references public.profiles on delete cascade,
  read_at         timestamptz not null default now(),
  primary key (announcement_id, user_id)
);

-- ---------------------------------------------------------------------
-- Suporte
-- ---------------------------------------------------------------------
create table public.tickets (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references public.profiles on delete cascade,
  subject    text not null check (char_length(subject) <= 140),
  category   text not null default 'Outro',
  status     public.ticket_status not null default 'aberto',
  created_at timestamptz not null default now()
);

create table public.ticket_messages (
  id         bigint generated always as identity primary key,
  ticket_id  uuid not null references public.tickets on delete cascade,
  author_id  uuid not null default auth.uid() references public.profiles,
  from_team  boolean not null default false,
  text       text not null check (char_length(text) between 1 and 4000),
  created_at timestamptz not null default now()
);

create table public.ideas (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references public.profiles on delete cascade,
  text       text not null check (char_length(text) between 3 and 500),
  status     public.idea_status not null default 'nova',
  created_at timestamptz not null default now()
);
create table public.idea_votes (idea_id uuid references public.ideas on delete cascade, user_id uuid default auth.uid() references public.profiles on delete cascade, primary key (idea_id, user_id));

-- ---------------------------------------------------------------------
-- Vendas
-- ---------------------------------------------------------------------
create table public.plans (
  id      public.plan_tier primary key,
  name    text not null,
  monthly numeric(10, 2) not null default 0 check (monthly >= 0),
  yearly  numeric(10, 2) not null default 0 check (yearly >= 0),
  active  boolean not null default true
);

create table public.coupons (
  id         uuid primary key default gen_random_uuid(),
  code       text not null unique check (code ~ '^[A-Z0-9-]{3,30}$'),
  discount   int not null check (discount between 1 and 100),
  plan       public.plan_tier not null,
  max_uses   int not null default 100,
  uses       int not null default 0,
  active     boolean not null default false,
  ends_on    date
);

-- Cliente no provedor de pagamento (Asaas). CPF/CNPJ fica só no Asaas, nunca aqui.
create table public.billing_customers (
  user_id     uuid primary key references public.profiles on delete cascade,
  provider    text not null default 'asaas',
  customer_id text not null unique,
  created_at  timestamptz not null default now()
);

create table public.subscriptions (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.profiles on delete cascade,
  plan               public.plan_tier not null,
  cycle              text not null default 'MONTHLY' check (cycle in ('MONTHLY', 'YEARLY')),
  billing_type       text check (billing_type in ('PIX', 'BOLETO', 'CREDIT_CARD', 'UNDEFINED')),
  provider           text not null default 'asaas' check (provider in ('asaas', 'manual')),
  provider_ref       text,                    -- id da assinatura no Asaas (sub_...)
  coupon_id          uuid references public.coupons,
  status             public.sub_status not null default 'pendente',
  current_period_end timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (provider, provider_ref)
);
create trigger subscriptions_touch before update on public.subscriptions for each row execute function public.touch_updated_at();

-- Cobranças e eventos recebidos do Asaas (idempotência do webhook)
create table public.payments (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references public.profiles on delete set null,
  subscription_id uuid references public.subscriptions on delete set null,
  provider_ref    text not null,              -- id da cobrança no Asaas (pay_...)
  event_id        text unique,                -- id do evento do webhook
  event           text not null,              -- PAYMENT_CONFIRMED, PAYMENT_RECEIVED, ...
  status          text not null,
  billing_type    text,
  value           numeric(10, 2),
  due_date        date,
  paid_at         timestamptz,
  invoice_url     text,
  received_at     timestamptz not null default now()
);
create index on public.payments (provider_ref);

-- ---------------------------------------------------------------------
-- Sistema
-- ---------------------------------------------------------------------
create table public.settings (
  key   text primary key,
  value jsonb not null
);

create table public.audit_log (
  id         bigint generated always as identity primary key,
  actor_id   uuid default auth.uid(),
  action     text not null,
  entity     text not null,
  entity_id  text,
  data       jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.audit()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into audit_log (action, entity, entity_id, data)
  values (lower(tg_op), tg_table_name,
          coalesce((case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end) ->> 'id', ''),
          jsonb_build_object('old', case when tg_op <> 'INSERT' then to_jsonb(old) end,
                             'new', case when tg_op <> 'DELETE' then to_jsonb(new) end));
  return coalesce(new, old);
end $$;

do $$
declare t text;
begin
  foreach t in array array['trails', 'modules', 'lessons', 'news', 'tools', 'point_rules', 'seasons', 'announcements',
                           'plans', 'coupons', 'settings', 'team_members', 'reports'] loop
    execute format('create trigger %I_audit after insert or update or delete on public.%I for each row execute function public.audit()', t, t);
  end loop;
end $$;

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
do $$
declare t text;
begin
  foreach t in array array['profiles', 'team_members', 'role_permissions', 'trails', 'modules', 'lessons', 'lesson_progress',
    'first_steps', 'certificates', 'posts', 'post_likes', 'comments', 'follows', 'reports', 'news', 'news_likes', 'news_saves',
    'tools', 'tool_usage', 'point_rules', 'seasons', 'point_events', 'announcements', 'announcement_reads', 'tickets',
    'ticket_messages', 'ideas', 'idea_votes', 'plans', 'coupons', 'billing_customers', 'subscriptions', 'payments',
    'settings', 'audit_log'] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- Pessoas
create policy "perfis visíveis para membros" on public.profiles for select to authenticated using (true);
create policy "editar o próprio perfil" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "equipe edita membros" on public.profiles for update to authenticated using (public.has_perm('users.manage'));
create policy "equipe visível para a equipe" on public.team_members for select to authenticated using (public.is_team() or user_id = auth.uid());
create policy "admin gerencia equipe" on public.team_members for all to authenticated using (public.has_perm('roles.manage')) with check (public.has_perm('roles.manage'));
create policy "matriz de permissões legível" on public.role_permissions for select to authenticated using (true);

-- Conteúdo
create policy "trilhas publicadas" on public.trails for select using (status = 'publicado' or public.has_perm('content.manage'));
create policy "equipe gerencia trilhas" on public.trails for all to authenticated using (public.has_perm('content.manage')) with check (public.has_perm('content.manage'));
create policy "módulos de trilhas publicadas" on public.modules for select using (exists (select 1 from public.trails t where t.id = trail_id and (t.status = 'publicado' or public.has_perm('content.manage'))));
create policy "equipe gerencia módulos" on public.modules for all to authenticated using (public.has_perm('content.manage')) with check (public.has_perm('content.manage'));
create policy "aulas de trilhas publicadas" on public.lessons for select using (exists (select 1 from public.modules m join public.trails t on t.id = m.trail_id where m.id = module_id and (t.status = 'publicado' or public.has_perm('content.manage'))));
create policy "equipe gerencia aulas" on public.lessons for all to authenticated using (public.has_perm('content.manage')) with check (public.has_perm('content.manage'));

create policy "ver o próprio progresso" on public.lesson_progress for select to authenticated using (user_id = auth.uid() or public.has_perm('analytics.view'));
create policy "concluir aula acessível" on public.lesson_progress for insert to authenticated
  with check (user_id = auth.uid() and public.is_active_member() and public.can_access_trail(public.trail_of_lesson(lesson_id)));
create policy "desmarcar aula" on public.lesson_progress for delete to authenticated using (user_id = auth.uid());

create policy "primeiros passos próprios" on public.first_steps for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "certificados próprios" on public.certificates for select to authenticated using (user_id = auth.uid() or public.has_perm('users.view'));
-- certificados são emitidos só pela Edge Function issue-certificate (service role)

-- Comunidade
create policy "feed visível" on public.posts for select to authenticated using (not hidden or author_id = auth.uid() or public.has_perm('community.moderate'));
create policy "publicar" on public.posts for insert to authenticated with check (author_id = auth.uid() and public.is_active_member());
create policy "editar próprio post" on public.posts for update to authenticated using (author_id = auth.uid() or public.has_perm('community.moderate'));
create policy "apagar próprio post ou moderar" on public.posts for delete to authenticated using (author_id = auth.uid() or public.has_perm('community.moderate'));

create policy "curtidas visíveis" on public.post_likes for select to authenticated using (true);
create policy "curtir" on public.post_likes for insert to authenticated with check (user_id = auth.uid() and public.is_active_member());
create policy "descurtir" on public.post_likes for delete to authenticated using (user_id = auth.uid());

create policy "comentários visíveis" on public.comments for select to authenticated using (not hidden or author_id = auth.uid() or public.has_perm('community.moderate'));
create policy "comentar" on public.comments for insert to authenticated with check (author_id = auth.uid() and public.is_active_member());
create policy "moderar comentários" on public.comments for update to authenticated using (author_id = auth.uid() or public.has_perm('community.moderate'));
create policy "apagar comentário" on public.comments for delete to authenticated using (author_id = auth.uid() or public.has_perm('community.moderate'));

create policy "seguidores visíveis" on public.follows for select to authenticated using (true);
create policy "seguir" on public.follows for insert to authenticated with check (follower_id = auth.uid() and public.is_active_member());
create policy "deixar de seguir" on public.follows for delete to authenticated using (follower_id = auth.uid());

create policy "denunciar" on public.reports for insert to authenticated with check (reporter_id = auth.uid() and public.is_active_member());
create policy "moderação vê denúncias" on public.reports for select to authenticated using (reporter_id = auth.uid() or public.has_perm('community.moderate'));
create policy "moderação resolve" on public.reports for update to authenticated using (public.has_perm('community.moderate'));

-- Notícias e ferramentas
create policy "notícias publicadas" on public.news for select using (status = 'publicado' or public.has_perm('news.manage'));
create policy "equipe gerencia notícias" on public.news for all to authenticated using (public.has_perm('news.manage')) with check (public.has_perm('news.manage'));
create policy "curtidas de notícia" on public.news_likes for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "notícias salvas" on public.news_saves for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "ferramentas ativas" on public.tools for select using (status <> 'desligada' or public.has_perm('tools.manage'));
create policy "equipe gerencia ferramentas" on public.tools for all to authenticated using (public.has_perm('tools.manage')) with check (public.has_perm('tools.manage'));
create policy "registrar uso" on public.tool_usage for insert to authenticated with check (
  user_id = auth.uid() and exists (select 1 from public.tools t where t.id = tool_id and t.status <> 'desligada'
                                   and public.plan_rank(t.plan) <= public.plan_rank(public.my_plan())));
create policy "uso visível à equipe" on public.tool_usage for select to authenticated using (user_id = auth.uid() or public.has_perm('analytics.view'));

-- Engajamento
create policy "regras visíveis" on public.point_rules for select using (true);
create policy "equipe gerencia regras" on public.point_rules for all to authenticated using (public.has_perm('ranking.manage')) with check (public.has_perm('ranking.manage'));
create policy "temporadas visíveis" on public.seasons for select using (true);
create policy "equipe gerencia temporadas" on public.seasons for all to authenticated using (public.has_perm('ranking.manage')) with check (public.has_perm('ranking.manage'));
create policy "pontos próprios" on public.point_events for select to authenticated using (user_id = auth.uid() or public.has_perm('ranking.manage'));
create policy "ajuste manual de pontos" on public.point_events for insert to authenticated with check (public.has_perm('ranking.manage') and rule_id is null and created_by = auth.uid());

create policy "avisos do meu público" on public.announcements for select to authenticated
  using (audience = 'todos' or audience::text = public.my_plan()::text or public.has_perm('push.send'));
create policy "equipe envia avisos" on public.announcements for all to authenticated using (public.has_perm('push.send')) with check (public.has_perm('push.send'));
create policy "marcar aviso como lido" on public.announcement_reads for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Suporte
create policy "meus chamados" on public.tickets for select to authenticated using (user_id = auth.uid() or public.has_perm('support.tickets'));
create policy "abrir chamado" on public.tickets for insert to authenticated with check (user_id = auth.uid());
create policy "equipe atualiza chamado" on public.tickets for update to authenticated using (public.has_perm('support.tickets'));
create policy "mensagens do chamado" on public.ticket_messages for select to authenticated
  using (public.has_perm('support.tickets') or exists (select 1 from public.tickets t where t.id = ticket_id and t.user_id = auth.uid()));
create policy "responder chamado" on public.ticket_messages for insert to authenticated with check (
  author_id = auth.uid() and (
    (from_team and public.has_perm('support.tickets')) or
    (not from_team and exists (select 1 from public.tickets t where t.id = ticket_id and t.user_id = auth.uid()))));

create policy "ideias visíveis" on public.ideas for select to authenticated using (true);
create policy "enviar ideia" on public.ideas for insert to authenticated with check (user_id = auth.uid() and public.is_active_member());
create policy "equipe classifica ideias" on public.ideas for update to authenticated using (public.has_perm('support.tickets'));
create policy "votos visíveis" on public.idea_votes for select to authenticated using (true);
create policy "votar" on public.idea_votes for insert to authenticated with check (user_id = auth.uid());
create policy "tirar voto" on public.idea_votes for delete to authenticated using (user_id = auth.uid());

-- Vendas
create policy "planos públicos" on public.plans for select using (true);
create policy "equipe gerencia planos" on public.plans for all to authenticated using (public.has_perm('sales.manage')) with check (public.has_perm('sales.manage'));
create policy "equipe vê cupons" on public.coupons for select to authenticated using (public.has_perm('sales.manage'));
create policy "equipe gerencia cupons" on public.coupons for all to authenticated using (public.has_perm('sales.manage')) with check (public.has_perm('sales.manage'));
create policy "minhas assinaturas" on public.subscriptions for select to authenticated using (user_id = auth.uid() or public.has_perm('users.view'));
create policy "liberação manual" on public.subscriptions for insert to authenticated with check (provider = 'manual' and public.has_perm('users.manage'));
create policy "meus pagamentos" on public.payments for select to authenticated using (user_id = auth.uid() or public.has_perm('users.view'));
create policy "meu cliente de cobrança" on public.billing_customers for select to authenticated using (user_id = auth.uid());
-- billing_customers, subscriptions (Asaas) e payments são escritos só pelas Edge Functions (service role)

-- Sistema
create policy "configurações públicas" on public.settings for select using (true);
create policy "admin gerencia configurações" on public.settings for all to authenticated using (public.has_perm('settings.manage')) with check (public.has_perm('settings.manage'));
create policy "auditoria para o admin" on public.audit_log for select to authenticated using (public.has_perm('settings.manage'));

-- =====================================================================
-- DADOS INICIAIS
-- =====================================================================
insert into public.role_permissions (role, permission)
select r::public.team_role, p from (values
  ('ADMIN', 'dashboard.view'), ('ADMIN', 'analytics.view'), ('ADMIN', 'content.manage'), ('ADMIN', 'tools.manage'),
  ('ADMIN', 'news.manage'), ('ADMIN', 'community.moderate'), ('ADMIN', 'support.tickets'), ('ADMIN', 'ranking.manage'),
  ('ADMIN', 'push.send'), ('ADMIN', 'users.view'), ('ADMIN', 'users.manage'), ('ADMIN', 'roles.manage'),
  ('ADMIN', 'sales.manage'), ('ADMIN', 'settings.manage'),
  ('STAFF', 'dashboard.view'), ('STAFF', 'analytics.view'), ('STAFF', 'content.manage'), ('STAFF', 'tools.manage'),
  ('STAFF', 'news.manage'), ('STAFF', 'community.moderate'), ('STAFF', 'support.tickets'), ('STAFF', 'ranking.manage'),
  ('STAFF', 'push.send'), ('STAFF', 'users.view'), ('STAFF', 'users.manage'),
  ('EDITOR', 'dashboard.view'), ('EDITOR', 'content.manage'), ('EDITOR', 'tools.manage'), ('EDITOR', 'news.manage'),
  ('EDITOR', 'community.moderate')
) as v(r, p);

insert into public.point_rules (id, label, points) values
  ('aula', 'Concluir uma aula', 2), ('ajuda', 'Ajudar alguém com uma dúvida', 15), ('destaque', 'Post em destaque', 20),
  ('presenca', 'Presença do dia', 1), ('seq7', 'Sequência de 7 dias', 10), ('seq30', 'Sequência de 30 dias', 30),
  ('seq100', 'Sequência de 100 dias', 60), ('seq365', 'Sequência de 365 dias', 120),
  ('passo', 'Primeiro passo concluído', 10);

insert into public.plans (id, name, monthly, yearly) values
  ('semente', 'Semente', 0, 0), ('broto', 'Broto', 29.90, 249.90), ('colheita', 'Colheita', 99.90, 875.80);

insert into public.seasons (name, starts_on, ends_on) values ('Novembro', '2026-11-01', '2026-11-30');

insert into public.settings (key, value) values
  ('general', '{"name": "graao club", "supportEmail": "contato@graao.club", "signups": true, "maintenance": false}');

-- Pontos por primeiro passo
create or replace function public.on_first_step()
returns trigger language plpgsql security definer set search_path = public as $$
begin perform public.award_points(new.user_id, 'passo', new.step); return new; end $$;
create trigger first_steps_points after insert on public.first_steps for each row execute function public.on_first_step();

-- Funções de gatilho não devem ser chamadas pela API
revoke execute on function public.handle_new_user(), public.on_lesson_completed(), public.on_first_step(), public.audit(),
  public.guard_profile(), public.guard_team(), public.guard_post(), public.touch_updated_at() from public, anon, authenticated;
