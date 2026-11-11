-- =====================================================================
-- ROLLBACK da migração 20261111000005_ia_para_tdah — NÃO APLICAR SEM AUTORIZAÇÃO.
-- Remove SÓ os objetos criados por ela. ATENÇÃO: apaga os interessados e os
-- projetos dos alunos gravados desde então. Antes de rodar, exporte os dados:
--   select * from public.interest_leads;  select * from public.creative_projects; ...
-- Fica fora de supabase/migrations/ de propósito, para nunca rodar sozinho.
-- =====================================================================
begin;
drop function if exists public.admin_overview();
drop function if exists private.admin_overview();
drop function if exists public.register_interest(text, text, text, boolean, text, text, int);
drop function if exists private.register_interest(text, text, text, boolean, text, text, int);
drop function if exists public.unsubscribe_interest(uuid);
drop function if exists private.unsubscribe_interest(uuid);
drop table if exists public.project_activity;
drop table if exists public.project_steps;
drop table if exists public.creative_projects;
drop table if exists public.interest_leads;
drop table if exists private.lead_hits;
drop function if exists public.guard_lead();
drop function if exists public.projects_before();
drop function if exists public.projects_after();
drop function if exists public.steps_before();
drop function if exists public.steps_after();
delete from public.role_permissions where permission in ('leads.view', 'leads.manage');
commit;
