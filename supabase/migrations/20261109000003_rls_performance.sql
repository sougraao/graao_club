-- =====================================================================
-- graao club · desempenho das políticas RLS + índices de chaves estrangeiras
-- Corrige os avisos do Supabase Advisor:
--   auth_rls_initplan            → auth.uid()/has_perm() avaliados 1x por consulta via (select ...)
--   multiple_permissive_policies → uma política por ação (gerenciar = insert/update/delete separados)
--   unindexed_foreign_keys       → índices nas FKs
-- As REGRAS de acesso são as mesmas da migração inicial (validado com supabase/tests/rls_smoke.sql).
-- =====================================================================

-- 1) Remove todas as políticas atuais do schema public
do $$
declare r record;
begin
  for r in select policyname, tablename from pg_policies where schemaname = 'public' loop
    execute format('drop policy %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

-- 2) Recria, otimizadas
-- Pessoas
create policy "perfis: ler" on public.profiles for select to authenticated using (true);
create policy "perfis: editar" on public.profiles for update to authenticated
  using (id = (select auth.uid()) or (select private.has_perm('users.manage')))
  with check (id = (select auth.uid()) or (select private.has_perm('users.manage')));

create policy "equipe: ler" on public.team_members for select to authenticated
  using ((select private.is_team()) or user_id = (select auth.uid()));
create policy "equipe: incluir" on public.team_members for insert to authenticated with check ((select private.has_perm('roles.manage')));
create policy "equipe: alterar" on public.team_members for update to authenticated
  using ((select private.has_perm('roles.manage'))) with check ((select private.has_perm('roles.manage')));
create policy "equipe: remover" on public.team_members for delete to authenticated using ((select private.has_perm('roles.manage')));

create policy "permissões: ler" on public.role_permissions for select to authenticated using (true);

-- Conteúdo
create policy "trilhas: ler" on public.trails for select using (status = 'publicado' or (select private.has_perm('content.manage')));
create policy "trilhas: criar" on public.trails for insert to authenticated with check ((select private.has_perm('content.manage')));
create policy "trilhas: editar" on public.trails for update to authenticated
  using ((select private.has_perm('content.manage'))) with check ((select private.has_perm('content.manage')));
create policy "trilhas: apagar" on public.trails for delete to authenticated using ((select private.has_perm('content.manage')));

create policy "módulos: ler" on public.modules for select using (
  (select private.has_perm('content.manage')) or exists (select 1 from public.trails t where t.id = trail_id and t.status = 'publicado'));
create policy "módulos: criar" on public.modules for insert to authenticated with check ((select private.has_perm('content.manage')));
create policy "módulos: editar" on public.modules for update to authenticated
  using ((select private.has_perm('content.manage'))) with check ((select private.has_perm('content.manage')));
create policy "módulos: apagar" on public.modules for delete to authenticated using ((select private.has_perm('content.manage')));

create policy "aulas: ler" on public.lessons for select using (
  (select private.has_perm('content.manage')) or exists (
    select 1 from public.modules m join public.trails t on t.id = m.trail_id where m.id = module_id and t.status = 'publicado'));
create policy "aulas: criar" on public.lessons for insert to authenticated with check ((select private.has_perm('content.manage')));
create policy "aulas: editar" on public.lessons for update to authenticated
  using ((select private.has_perm('content.manage'))) with check ((select private.has_perm('content.manage')));
create policy "aulas: apagar" on public.lessons for delete to authenticated using ((select private.has_perm('content.manage')));

create policy "progresso: ler" on public.lesson_progress for select to authenticated
  using (user_id = (select auth.uid()) or (select private.has_perm('analytics.view')));
create policy "progresso: concluir aula acessível" on public.lesson_progress for insert to authenticated
  with check (user_id = (select auth.uid()) and (select private.is_active_member())
              and private.can_access_trail(private.trail_of_lesson(lesson_id)));
create policy "progresso: desmarcar" on public.lesson_progress for delete to authenticated using (user_id = (select auth.uid()));

create policy "primeiros passos: próprios" on public.first_steps for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "certificados: ler" on public.certificates for select to authenticated
  using (user_id = (select auth.uid()) or (select private.has_perm('users.view')));

-- Comunidade
create policy "posts: ler" on public.posts for select to authenticated
  using (not hidden or author_id = (select auth.uid()) or (select private.has_perm('community.moderate')));
create policy "posts: publicar" on public.posts for insert to authenticated
  with check (author_id = (select auth.uid()) and (select private.is_active_member()));
create policy "posts: editar" on public.posts for update to authenticated
  using (author_id = (select auth.uid()) or (select private.has_perm('community.moderate')))
  with check (author_id = (select auth.uid()) or (select private.has_perm('community.moderate')));
create policy "posts: apagar" on public.posts for delete to authenticated
  using (author_id = (select auth.uid()) or (select private.has_perm('community.moderate')));

create policy "curtidas: ler" on public.post_likes for select to authenticated using (true);
create policy "curtidas: curtir" on public.post_likes for insert to authenticated
  with check (user_id = (select auth.uid()) and (select private.is_active_member()));
create policy "curtidas: descurtir" on public.post_likes for delete to authenticated using (user_id = (select auth.uid()));

create policy "comentários: ler" on public.comments for select to authenticated
  using (not hidden or author_id = (select auth.uid()) or (select private.has_perm('community.moderate')));
create policy "comentários: comentar" on public.comments for insert to authenticated
  with check (author_id = (select auth.uid()) and (select private.is_active_member()));
create policy "comentários: editar" on public.comments for update to authenticated
  using (author_id = (select auth.uid()) or (select private.has_perm('community.moderate')))
  with check (author_id = (select auth.uid()) or (select private.has_perm('community.moderate')));
create policy "comentários: apagar" on public.comments for delete to authenticated
  using (author_id = (select auth.uid()) or (select private.has_perm('community.moderate')));

create policy "seguir: ler" on public.follows for select to authenticated using (true);
create policy "seguir: seguir" on public.follows for insert to authenticated
  with check (follower_id = (select auth.uid()) and (select private.is_active_member()));
create policy "seguir: deixar" on public.follows for delete to authenticated using (follower_id = (select auth.uid()));

create policy "denúncias: denunciar" on public.reports for insert to authenticated
  with check (reporter_id = (select auth.uid()) and (select private.is_active_member()));
create policy "denúncias: ler" on public.reports for select to authenticated
  using (reporter_id = (select auth.uid()) or (select private.has_perm('community.moderate')));
create policy "denúncias: resolver" on public.reports for update to authenticated
  using ((select private.has_perm('community.moderate'))) with check ((select private.has_perm('community.moderate')));

-- Notícias e ferramentas
create policy "notícias: ler" on public.news for select using (status = 'publicado' or (select private.has_perm('news.manage')));
create policy "notícias: criar" on public.news for insert to authenticated with check ((select private.has_perm('news.manage')));
create policy "notícias: editar" on public.news for update to authenticated
  using ((select private.has_perm('news.manage'))) with check ((select private.has_perm('news.manage')));
create policy "notícias: apagar" on public.news for delete to authenticated using ((select private.has_perm('news.manage')));
create policy "notícias: curtidas próprias" on public.news_likes for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "notícias: salvas próprias" on public.news_saves for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "ferramentas: ler" on public.tools for select using (status <> 'desligada' or (select private.has_perm('tools.manage')));
create policy "ferramentas: criar" on public.tools for insert to authenticated with check ((select private.has_perm('tools.manage')));
create policy "ferramentas: editar" on public.tools for update to authenticated
  using ((select private.has_perm('tools.manage'))) with check ((select private.has_perm('tools.manage')));
create policy "ferramentas: apagar" on public.tools for delete to authenticated using ((select private.has_perm('tools.manage')));

create policy "uso de ferramenta: registrar" on public.tool_usage for insert to authenticated with check (
  user_id = (select auth.uid()) and exists (
    select 1 from public.tools t where t.id = tool_id and t.status <> 'desligada'
      and public.plan_rank(t.plan) <= public.plan_rank((select private.my_plan()))));
create policy "uso de ferramenta: ler" on public.tool_usage for select to authenticated
  using (user_id = (select auth.uid()) or (select private.has_perm('analytics.view')));

-- Engajamento
create policy "regras: ler" on public.point_rules for select using (true);
create policy "regras: criar" on public.point_rules for insert to authenticated with check ((select private.has_perm('ranking.manage')));
create policy "regras: editar" on public.point_rules for update to authenticated
  using ((select private.has_perm('ranking.manage'))) with check ((select private.has_perm('ranking.manage')));
create policy "regras: apagar" on public.point_rules for delete to authenticated using ((select private.has_perm('ranking.manage')));

create policy "temporadas: ler" on public.seasons for select using (true);
create policy "temporadas: criar" on public.seasons for insert to authenticated with check ((select private.has_perm('ranking.manage')));
create policy "temporadas: editar" on public.seasons for update to authenticated
  using ((select private.has_perm('ranking.manage'))) with check ((select private.has_perm('ranking.manage')));
create policy "temporadas: apagar" on public.seasons for delete to authenticated using ((select private.has_perm('ranking.manage')));

create policy "pontos: ler" on public.point_events for select to authenticated
  using (user_id = (select auth.uid()) or (select private.has_perm('ranking.manage')));
create policy "pontos: ajuste manual" on public.point_events for insert to authenticated
  with check ((select private.has_perm('ranking.manage')) and rule_id is null and created_by = (select auth.uid()));

create policy "avisos: ler" on public.announcements for select to authenticated using (
  audience = 'todos' or audience::text = (select private.my_plan())::text or (select private.has_perm('push.send')));
create policy "avisos: enviar" on public.announcements for insert to authenticated with check ((select private.has_perm('push.send')));
create policy "avisos: editar" on public.announcements for update to authenticated
  using ((select private.has_perm('push.send'))) with check ((select private.has_perm('push.send')));
create policy "avisos: apagar" on public.announcements for delete to authenticated using ((select private.has_perm('push.send')));
create policy "avisos: lidos próprios" on public.announcement_reads for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Suporte
create policy "chamados: ler" on public.tickets for select to authenticated
  using (user_id = (select auth.uid()) or (select private.has_perm('support.tickets')));
create policy "chamados: abrir" on public.tickets for insert to authenticated with check (user_id = (select auth.uid()));
create policy "chamados: atualizar" on public.tickets for update to authenticated
  using ((select private.has_perm('support.tickets'))) with check ((select private.has_perm('support.tickets')));

create policy "mensagens: ler" on public.ticket_messages for select to authenticated using (
  (select private.has_perm('support.tickets'))
  or exists (select 1 from public.tickets t where t.id = ticket_id and t.user_id = (select auth.uid())));
create policy "mensagens: responder" on public.ticket_messages for insert to authenticated with check (
  author_id = (select auth.uid()) and (
    (from_team and (select private.has_perm('support.tickets')))
    or (not from_team and exists (select 1 from public.tickets t where t.id = ticket_id and t.user_id = (select auth.uid())))));

create policy "ideias: ler" on public.ideas for select to authenticated using (true);
create policy "ideias: enviar" on public.ideas for insert to authenticated
  with check (user_id = (select auth.uid()) and (select private.is_active_member()));
create policy "ideias: classificar" on public.ideas for update to authenticated
  using ((select private.has_perm('support.tickets'))) with check ((select private.has_perm('support.tickets')));
create policy "votos: ler" on public.idea_votes for select to authenticated using (true);
create policy "votos: votar" on public.idea_votes for insert to authenticated with check (user_id = (select auth.uid()));
create policy "votos: tirar" on public.idea_votes for delete to authenticated using (user_id = (select auth.uid()));

-- Vendas
create policy "planos: ler" on public.plans for select using (true);
create policy "planos: criar" on public.plans for insert to authenticated with check ((select private.has_perm('sales.manage')));
create policy "planos: editar" on public.plans for update to authenticated
  using ((select private.has_perm('sales.manage'))) with check ((select private.has_perm('sales.manage')));
create policy "planos: apagar" on public.plans for delete to authenticated using ((select private.has_perm('sales.manage')));

create policy "cupons: ler" on public.coupons for select to authenticated using ((select private.has_perm('sales.manage')));
create policy "cupons: criar" on public.coupons for insert to authenticated with check ((select private.has_perm('sales.manage')));
create policy "cupons: editar" on public.coupons for update to authenticated
  using ((select private.has_perm('sales.manage'))) with check ((select private.has_perm('sales.manage')));
create policy "cupons: apagar" on public.coupons for delete to authenticated using ((select private.has_perm('sales.manage')));

create policy "assinaturas: ler" on public.subscriptions for select to authenticated
  using (user_id = (select auth.uid()) or (select private.has_perm('users.view')));
create policy "assinaturas: liberação manual" on public.subscriptions for insert to authenticated
  with check (provider = 'manual' and (select private.has_perm('users.manage')));
create policy "pagamentos: ler" on public.payments for select to authenticated
  using (user_id = (select auth.uid()) or (select private.has_perm('users.view')));
create policy "cobrança: meu cliente" on public.billing_customers for select to authenticated
  using (user_id = (select auth.uid()));

-- Sistema
create policy "configurações: ler" on public.settings for select using (true);
create policy "configurações: criar" on public.settings for insert to authenticated with check ((select private.has_perm('settings.manage')));
create policy "configurações: editar" on public.settings for update to authenticated
  using ((select private.has_perm('settings.manage'))) with check ((select private.has_perm('settings.manage')));
create policy "configurações: apagar" on public.settings for delete to authenticated using ((select private.has_perm('settings.manage')));
create policy "auditoria: ler" on public.audit_log for select to authenticated using ((select private.has_perm('settings.manage')));

-- 3) Índices das chaves estrangeiras
create index if not exists announcement_reads_user_id_idx on public.announcement_reads (user_id);
create index if not exists announcements_created_by_idx  on public.announcements (created_by);
create index if not exists certificates_trail_id_idx      on public.certificates (trail_id);
create index if not exists comments_author_id_idx         on public.comments (author_id);
create index if not exists comments_post_id_idx           on public.comments (post_id);
create index if not exists follows_followee_id_idx        on public.follows (followee_id);
create index if not exists idea_votes_user_id_idx         on public.idea_votes (user_id);
create index if not exists ideas_user_id_idx              on public.ideas (user_id);
create index if not exists lesson_progress_lesson_id_idx  on public.lesson_progress (lesson_id);
create index if not exists news_likes_user_id_idx         on public.news_likes (user_id);
create index if not exists news_saves_user_id_idx         on public.news_saves (user_id);
create index if not exists payments_subscription_id_idx   on public.payments (subscription_id);
create index if not exists payments_user_id_idx           on public.payments (user_id);
create index if not exists point_events_created_by_idx    on public.point_events (created_by);
create index if not exists point_events_rule_id_idx       on public.point_events (rule_id);
create index if not exists point_events_season_id_idx     on public.point_events (season_id);
create index if not exists post_likes_user_id_idx         on public.post_likes (user_id);
create index if not exists posts_author_id_idx            on public.posts (author_id);
create index if not exists reports_post_id_idx            on public.reports (post_id);
create index if not exists reports_reporter_id_idx        on public.reports (reporter_id);
create index if not exists reports_resolved_by_idx        on public.reports (resolved_by);
create index if not exists subscriptions_coupon_id_idx    on public.subscriptions (coupon_id);
create index if not exists subscriptions_user_id_idx      on public.subscriptions (user_id);
create index if not exists ticket_messages_author_id_idx  on public.ticket_messages (author_id);
create index if not exists ticket_messages_ticket_id_idx  on public.ticket_messages (ticket_id);
create index if not exists tickets_user_id_idx            on public.tickets (user_id);
create index if not exists tool_usage_user_id_idx         on public.tool_usage (user_id);
