-- =====================================================================
-- graao club · funções auxiliares fora da API
-- Corrige o alerta "SECURITY DEFINER function executable" do Supabase Advisor:
-- as funções usadas pelas políticas RLS vão para o schema `private`,
-- que não é exposto pela API REST. As políticas continuam apontando para
-- as mesmas funções (referência por OID).
-- =====================================================================

create schema if not exists private;
grant usage on schema private to anon, authenticated, service_role;

alter function public.has_perm(text)          set schema private;
alter function public.is_team()               set schema private;
alter function public.my_plan()               set schema private;
alter function public.is_active_member()      set schema private;
alter function public.can_access_trail(uuid)  set schema private;
alter function public.trail_of_lesson(uuid)   set schema private;

-- Corpos que citavam public.* precisam apontar para private.*
create or replace function private.can_access_trail(t uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select private.has_perm('content.manage') or exists (
    select 1 from trails
    where id = t and status = 'publicado' and public.plan_rank(plan) <= public.plan_rank(private.my_plan())
  );
$$;

create or replace function public.guard_profile()
returns trigger language plpgsql set search_path = public as $$
begin
  if (new.plan is distinct from old.plan or new.banned is distinct from old.banned)
     and not private.has_perm('users.manage')
     and coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'Sem permissão para alterar plano ou bloqueio' using errcode = '42501';
  end if;
  return new;
end $$;

create or replace function public.guard_team()
returns trigger language plpgsql set search_path = public as $$
begin
  if not private.has_perm('roles.manage') and coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'Só o administrador muda papéis' using errcode = '42501';
  end if;
  return coalesce(new, old);
end $$;

create or replace function public.guard_post()
returns trigger language plpgsql set search_path = public as $$
begin
  if (new.pinned is distinct from old.pinned or new.hidden is distinct from old.hidden)
     and not private.has_perm('community.moderate') then
    raise exception 'Só a moderação fixa ou oculta posts' using errcode = '42501';
  end if;
  return new;
end $$;

-- Ranking: só para membros logados
revoke execute on function public.season_leaderboard(int) from public, anon;
grant execute on function public.season_leaderboard(int) to authenticated;

-- Permissões do usuário logado (para o front montar o menu do admin) — sem SECURITY DEFINER:
-- lê team_members/role_permissions respeitando as políticas RLS.
create or replace function public.my_permissions()
returns setof text language sql stable security invoker set search_path = public as $$
  select rp.permission from team_members tm join role_permissions rp on rp.role = tm.role where tm.user_id = auth.uid();
$$;
revoke execute on function public.my_permissions() from public, anon;
grant execute on function public.my_permissions() to authenticated;
