-- =====================================================================
-- graao club · teste de fumaça das regras de acesso (RLS + gatilhos)
-- Rode depois de cada migração (Supabase MCP execute_sql ou SQL Editor).
-- Tudo acontece numa transação que é DESFEITA no fim: a saída é um "erro"
-- proposital com a lista de resultados (PASSOU/FALHOU). Nada fica no banco.
-- Resultado em 2026-11-09 no graao-club-dev: 22/22 PASSOU.
-- =====================================================================
begin;
create temp table t_results(n serial, test text, ok boolean, detail text) on commit drop;
grant all on t_results to authenticated, anon;
grant usage on sequence t_results_n_seq to authenticated, anon;

insert into auth.users (id, email, raw_user_meta_data, aud, role) values
 ('11111111-1111-1111-1111-111111111111', 'ana@teste.dev', '{"name":"Ana"}', 'authenticated', 'authenticated'),
 ('22222222-2222-2222-2222-222222222222', 'edu@teste.dev', '{"name":"Edu"}', 'authenticated', 'authenticated');
insert into t_results(test, ok, detail) select 'gatilho cria perfis', count(*) = 2, string_agg(username || '/' || plan, ', ') from profiles where id in ('11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222');

set local request.jwt.claims = '{"role":"service_role"}';
insert into team_members (user_id, role) values ('22222222-2222-2222-2222-222222222222', 'EDITOR');
reset request.jwt.claims;

insert into trails (id, slug, name, plan, status) values
 ('aaaaaaaa-0000-0000-0000-000000000001', 'gratis', 'Grátis', 'semente', 'publicado'),
 ('aaaaaaaa-0000-0000-0000-000000000002', 'broto', 'Broto', 'broto', 'publicado'),
 ('aaaaaaaa-0000-0000-0000-000000000003', 'rascunho', 'Rascunho', 'semente', 'rascunho');
insert into modules (id, trail_id, title) values
 ('bbbbbbbb-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'M1'),
 ('bbbbbbbb-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000002', 'M2');
insert into lessons (id, module_id, title) values
 ('cccccccc-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Aula grátis'),
 ('cccccccc-0000-0000-0000-000000000002', 'bbbbbbbb-0000-0000-0000-000000000002', 'Aula Broto');

-- Ana: membro do plano Semente
set local role authenticated;
set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';
insert into t_results(test, ok, detail) select 'membro vê só trilhas publicadas', count(*) = 2, string_agg(slug, ',') from trails;
do $$ begin insert into lesson_progress (lesson_id) values ('cccccccc-0000-0000-0000-000000000001');
  insert into t_results(test, ok, detail) values ('concluir aula liberada', true, 'ok');
exception when others then insert into t_results(test, ok, detail) values ('concluir aula liberada', false, sqlerrm); end $$;
do $$ begin insert into lesson_progress (lesson_id) values ('cccccccc-0000-0000-0000-000000000002');
  insert into t_results(test, ok, detail) values ('bloqueia aula de plano superior', false, 'inseriu!');
exception when others then insert into t_results(test, ok, detail) values ('bloqueia aula de plano superior', true, sqlerrm); end $$;
insert into t_results(test, ok, detail) select 'aula gera pontos (2) no livro-razão', coalesce(sum(points), 0) = 2, coalesce(sum(points), 0)::text from point_events;
do $$ begin insert into lesson_progress (lesson_id) values ('cccccccc-0000-0000-0000-000000000001');
  insert into t_results(test, ok, detail) values ('mesma aula não pontua 2x', false, 'inseriu de novo');
exception when others then insert into t_results(test, ok, detail) values ('mesma aula não pontua 2x', true, sqlerrm); end $$;
do $$ begin update profiles set plan = 'colheita' where id = auth.uid();
  insert into t_results(test, ok, detail) values ('membro não se dá plano pago', false, 'atualizou!');
exception when others then insert into t_results(test, ok, detail) values ('membro não se dá plano pago', true, sqlerrm); end $$;
do $$ begin update profiles set bio = 'Olá!' where id = auth.uid();
  insert into t_results(test, ok, detail) values ('membro edita a própria bio', true, 'ok');
exception when others then insert into t_results(test, ok, detail) values ('membro edita a própria bio', false, sqlerrm); end $$;
insert into posts (id, text) values ('dddddddd-0000-0000-0000-000000000001', 'Meu primeiro post');
do $$ begin update posts set pinned = true where id = 'dddddddd-0000-0000-0000-000000000001';
  insert into t_results(test, ok, detail) values ('membro não fixa o próprio post', false, 'fixou!');
exception when others then insert into t_results(test, ok, detail) values ('membro não fixa o próprio post', true, sqlerrm); end $$;
do $$ begin insert into team_members (user_id, role) values (auth.uid(), 'ADMIN');
  insert into t_results(test, ok, detail) values ('membro não vira admin', false, 'virou admin!');
exception when others then insert into t_results(test, ok, detail) values ('membro não vira admin', true, sqlerrm); end $$;
do $$ begin perform public.award_points(auth.uid(), 'destaque', 'x');
  insert into t_results(test, ok, detail) values ('membro não chama award_points', false, 'chamou!');
exception when others then insert into t_results(test, ok, detail) values ('membro não chama award_points', true, sqlerrm); end $$;
insert into t_results(test, ok, detail) select 'membro não vê auditoria', count(*) = 0, count(*)::text from audit_log;

-- Edu: EDITOR
set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
insert into t_results(test, ok, detail) select 'editor vê rascunhos', count(*) = 3, string_agg(slug, ',') from trails;
insert into t_results(test, ok, detail) select 'my_permissions() do editor', count(*) = 5, string_agg(p, ',') from public.my_permissions() p;
do $$ declare n int; begin update posts set hidden = true where id = 'dddddddd-0000-0000-0000-000000000001'; get diagnostics n = row_count;
  insert into t_results(test, ok, detail) values ('editor oculta post (moderação)', n = 1, n || ' linha');
exception when others then insert into t_results(test, ok, detail) values ('editor oculta post (moderação)', false, sqlerrm); end $$;
do $$ declare n int; begin update profiles set plan = 'colheita' where id = '11111111-1111-1111-1111-111111111111'; get diagnostics n = row_count;
  insert into t_results(test, ok, detail) values ('editor não muda plano de membro', n = 0, n || ' linhas');
exception when others then insert into t_results(test, ok, detail) values ('editor não muda plano de membro', true, sqlerrm); end $$;
-- RLS bloqueia em silêncio (0 linhas) — por isso conferimos row_count
do $$ declare n int; begin update team_members set role = 'ADMIN' where user_id = auth.uid(); get diagnostics n = row_count;
  insert into t_results(test, ok, detail) values ('editor não se promove', n = 0, n || ' linhas');
exception when others then insert into t_results(test, ok, detail) values ('editor não se promove', true, sqlerrm); end $$;

set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';
insert into t_results(test, ok, detail) select 'autora ainda vê o próprio post oculto', count(*) = 1, count(*)::text from posts;

-- Visitante sem login
set local role anon;
set local request.jwt.claims = '{"role":"anon"}';
insert into t_results(test, ok, detail) select 'visitante vê trilhas publicadas', count(*) = 2, count(*)::text from trails;
insert into t_results(test, ok, detail) select 'visitante não vê perfis', count(*) = 0, count(*)::text from profiles;
insert into t_results(test, ok, detail) select 'visitante não vê posts', count(*) = 0, count(*)::text from posts;
do $$ begin perform * from public.season_leaderboard(10);
  insert into t_results(test, ok, detail) values ('visitante não vê ranking', false, 'viu!');
exception when others then insert into t_results(test, ok, detail) values ('visitante não vê ranking', true, sqlerrm); end $$;

reset role;
do $$ declare r text; begin
  select string_agg(n || '. ' || case when ok then 'PASSOU' else 'FALHOU' end || ' | ' || test || ' | ' || left(detail, 90), E'\n' order by n) into r from t_results;
  raise exception E'RESULTADOS (transação desfeita):\n%', r;
end $$;
