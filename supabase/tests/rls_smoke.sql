-- =====================================================================
-- IA para TDAH · teste de fumaça das regras de acesso (RLS + gatilhos)
-- Rode depois de cada migração (Supabase MCP execute_sql ou SQL Editor).
-- Tudo acontece numa transação que é DESFEITA no fim: a saída é um "erro"
-- proposital com a lista de resultados (PASSOU/FALHOU). Nada fica no banco.
-- Resultado em 2026-11-09 no graao-club-dev: 22/22 PASSOU.
-- Resultado em 2026-11-11 (com a migração 20261111000005 · IA para TDAH): 54/54 PASSOU.
-- =====================================================================
begin;
create temp table t_results(n serial, test text, ok boolean, detail text) on commit drop;
grant all on t_results to authenticated, anon;
grant usage on sequence t_results_n_seq to authenticated, anon;

insert into auth.users (id, email, raw_user_meta_data, aud, role) values
 ('11111111-1111-1111-1111-111111111111', 'ana@teste.dev', '{"name":"Ana"}', 'authenticated', 'authenticated'),
 ('22222222-2222-2222-2222-222222222222', 'edu@teste.dev', '{"name":"Edu"}', 'authenticated', 'authenticated'),
 ('33333333-3333-3333-3333-333333333333', 'caio@teste.dev', '{"name":"Caio"}', 'authenticated', 'authenticated');
insert into t_results(test, ok, detail) select 'gatilho cria perfis', count(*) = 2, string_agg(username || '/' || plan, ', ') from profiles where id in ('11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222');

set local request.jwt.claims = '{"role":"service_role"}';
insert into team_members (user_id, role) values ('22222222-2222-2222-2222-222222222222', 'EDITOR'), ('33333333-3333-3333-3333-333333333333', 'ADMIN');
reset request.jwt.claims;
create temp table t_tok(token uuid) on commit drop;
grant all on t_tok to authenticated, anon;

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

-- =====================================================================
-- IA para TDAH (migração 20261111000005): cadastro de interesse
-- =====================================================================
do $$ declare r jsonb; begin r := public.register_interest('  Lead@Teste.dev ', 'Lia', 'design', true, 'landing', null, 4000);
  insert into t_results(test, ok, detail) values ('visitante cadastra interesse', r ->> 'ok' = 'true', r::text);
exception when others then insert into t_results(test, ok, detail) values ('visitante cadastra interesse', false, sqlerrm); end $$;
do $$ declare r jsonb; begin r := public.register_interest('lead@teste.dev', 'Outro nome', 'edicao', true, 'cta-final', null, 4000);
  insert into t_results(test, ok, detail) values ('cadastro repetido responde igual (não revela)', r ->> 'ok' = 'true', r::text);
exception when others then insert into t_results(test, ok, detail) values ('cadastro repetido responde igual (não revela)', false, sqlerrm); end $$;
do $$ declare r jsonb; begin r := public.register_interest('robo@teste.dev', 'Bot', null, true, 'landing', 'http://spam', 4000);
  insert into t_results(test, ok, detail) values ('armadilha anti-robô responde ok', r ->> 'ok' = 'true', r::text);
exception when others then insert into t_results(test, ok, detail) values ('armadilha anti-robô responde ok', false, sqlerrm); end $$;
do $$ begin perform public.register_interest('sem-arroba', null, null, true, 'landing', null, 4000);
  insert into t_results(test, ok, detail) values ('rejeita e-mail inválido', false, 'aceitou!');
exception when others then insert into t_results(test, ok, detail) values ('rejeita e-mail inválido', sqlerrm = 'invalid_email', sqlerrm); end $$;
do $$ begin perform public.register_interest('semconsent@teste.dev', null, null, false, 'landing', null, 4000);
  insert into t_results(test, ok, detail) values ('exige consentimento', false, 'aceitou!');
exception when others then insert into t_results(test, ok, detail) values ('exige consentimento', sqlerrm = 'consent_required', sqlerrm); end $$;
do $$ begin perform public.register_interest('rapido@teste.dev', null, null, true, 'landing', null, 200);
  insert into t_results(test, ok, detail) values ('rejeita envio instantâneo', false, 'aceitou!');
exception when others then insert into t_results(test, ok, detail) values ('rejeita envio instantâneo', sqlerrm = 'too_fast', sqlerrm); end $$;
do $$ declare n int; begin select count(*) into n from interest_leads;
  insert into t_results(test, ok, detail) values ('visitante não lê interessados', n = 0, n || ' linhas');
exception when others then insert into t_results(test, ok, detail) values ('visitante não lê interessados', true, sqlerrm); end $$;
do $$ begin insert into interest_leads (email, consent_version) values ('direto@teste.dev', 'x');
  insert into t_results(test, ok, detail) values ('visitante não insere direto na tabela', false, 'inseriu!');
exception when others then insert into t_results(test, ok, detail) values ('visitante não insere direto na tabela', true, sqlerrm); end $$;
do $$ begin perform public.admin_overview();
  insert into t_results(test, ok, detail) values ('visitante não vê indicadores', false, 'viu!');
exception when others then insert into t_results(test, ok, detail) values ('visitante não vê indicadores', true, sqlerrm); end $$;
do $$ declare n int; begin select count(*) into n from creative_projects;
  insert into t_results(test, ok, detail) values ('visitante não lê projetos', n = 0, n || ' linhas');
exception when others then insert into t_results(test, ok, detail) values ('visitante não lê projetos', true, sqlerrm); end $$;

reset role;
insert into t_results(test, ok, detail)
  select 'lead gravado 1x, normalizado, nome/área do 1º envio, robô e inválidos fora', count(*) = 1 and min(email) = 'lead@teste.dev' and min(name) = 'Lia' and min(area) = 'design',
         count(*) || ' · ' || coalesce(string_agg(email || '/' || coalesce(name, '-') || '/' || coalesce(area, '-'), ', '), '')
  from interest_leads where email like '%@teste.dev';
insert into t_tok select unsubscribe_token from interest_leads where email = 'lead@teste.dev';

-- Projetos: Ana (membro)
set local role authenticated;
set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';
insert into t_results(test, ok, detail) select 'membro não lê interessados', count(*) = 0, count(*)::text from interest_leads;
do $$ begin perform public.admin_overview();
  insert into t_results(test, ok, detail) values ('membro não vê indicadores', false, 'viu!');
exception when others then insert into t_results(test, ok, detail) values ('membro não vê indicadores', true, sqlerrm); end $$;
insert into creative_projects (id, title, briefing, is_main) values
  ('eeeeeeee-0000-0000-0000-000000000001', 'Campanha de lançamento', 'Briefing privado do cliente', true);
insert into project_steps (id, project_id, title, orbita, is_next) values
  ('ffffffff-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000001', 'Listar 3 referências', 'O', true),
  ('ffffffff-0000-0000-0000-000000000002', 'eeeeeeee-0000-0000-0000-000000000001', 'Rascunhar a peça 1', 'I', false);
update project_steps set is_next = true where id = 'ffffffff-0000-0000-0000-000000000002';
insert into t_results(test, ok, detail) select 'só uma próxima ação por projeto', count(*) = 1, string_agg(title, ',') from project_steps where is_next;
update project_steps set done = true where id = 'ffffffff-0000-0000-0000-000000000001';
insert into t_results(test, ok, detail) select 'concluir microtarefa registra no histórico', count(*) = 1, count(*)::text from project_activity where kind = 'passo';
insert into creative_projects (id, title, is_main) values ('eeeeeeee-0000-0000-0000-000000000002', 'Portfólio', true);
insert into t_results(test, ok, detail) select 'só um projeto principal', count(*) = 1, string_agg(title, ',') from creative_projects where is_main;
update creative_projects set status = 'entregue' where id = 'eeeeeeee-0000-0000-0000-000000000002';
insert into t_results(test, ok, detail) select 'entrega marca a data', delivered_at is not null, coalesce(delivered_at::text, 'sem data') from creative_projects where id = 'eeeeeeee-0000-0000-0000-000000000002';
do $$ begin insert into creative_projects (title, user_id) values ('Projeto alheio', '22222222-2222-2222-2222-222222222222');
  insert into t_results(test, ok, detail) values ('membro não cria projeto em nome de outro', false, 'criou!');
exception when others then insert into t_results(test, ok, detail) values ('membro não cria projeto em nome de outro', true, sqlerrm); end $$;

-- Edu (EDITOR) não enxerga nem mexe nos projetos da Ana
set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
insert into t_results(test, ok, detail) select 'outra pessoa (mesmo da equipe) não lê projetos alheios', count(*) = 0, count(*)::text from creative_projects;
insert into t_results(test, ok, detail) select 'outra pessoa não lê microtarefas/histórico alheios', (select count(*) from project_steps) + (select count(*) from project_activity) = 0, 'ok';
do $$ begin insert into project_steps (project_id, title) values ('eeeeeeee-0000-0000-0000-000000000001', 'Intrusa');
  insert into t_results(test, ok, detail) values ('não cria microtarefa em projeto alheio', false, 'criou!');
exception when others then insert into t_results(test, ok, detail) values ('não cria microtarefa em projeto alheio', true, sqlerrm); end $$;
do $$ declare n int; begin update creative_projects set title = 'Hackeado' where id = 'eeeeeeee-0000-0000-0000-000000000001'; get diagnostics n = row_count;
  insert into t_results(test, ok, detail) values ('não edita projeto alheio', n = 0, n || ' linhas');
exception when others then insert into t_results(test, ok, detail) values ('não edita projeto alheio', true, sqlerrm); end $$;
insert into t_results(test, ok, detail) select 'editor não lê interessados', count(*) = 0, count(*)::text from interest_leads;
do $$ declare r jsonb; begin r := public.admin_overview();
  insert into t_results(test, ok, detail) values ('editor vê indicadores sem dados de interessados', r ? 'projects_total' and not (r ? 'leads_active'), left(r::text, 90));
exception when others then insert into t_results(test, ok, detail) values ('editor vê indicadores sem dados de interessados', false, sqlerrm); end $$;

-- Caio (ADMIN)
set local request.jwt.claims = '{"sub":"33333333-3333-3333-3333-333333333333","role":"authenticated"}';
insert into t_results(test, ok, detail) select 'admin lê interessados', count(*) = 1, count(*)::text from interest_leads where email like '%@teste.dev';
do $$ declare r jsonb; begin r := public.admin_overview();
  insert into t_results(test, ok, detail) values ('admin vê indicadores reais', (r ->> 'leads_active')::int >= 1 and (r ->> 'projects_total')::int >= 2 and (r ->> 'steps_done')::int >= 1, left(r::text, 90));
exception when others then insert into t_results(test, ok, detail) values ('admin vê indicadores reais', false, sqlerrm); end $$;
do $$ begin update interest_leads set email = 'trocado@teste.dev' where email = 'lead@teste.dev';
  insert into t_results(test, ok, detail) values ('admin não altera e-mail/consentimento', false, 'alterou!');
exception when others then insert into t_results(test, ok, detail) values ('admin não altera e-mail/consentimento', true, sqlerrm); end $$;
do $$ declare n int; begin update interest_leads set status = 'contatado' where email = 'lead@teste.dev'; get diagnostics n = row_count;
  insert into t_results(test, ok, detail) values ('admin muda situação do interessado', n = 1, n || ' linha');
exception when others then insert into t_results(test, ok, detail) values ('admin muda situação do interessado', false, sqlerrm); end $$;
insert into t_results(test, ok, detail) select 'admin não lê briefings dos alunos', count(*) = 0, count(*)::text from creative_projects;

-- Descadastro e limite de tentativas (visitante)
set local role anon;
set local request.jwt.claims = '{"role":"anon"}';
do $$ declare v boolean; begin select public.unsubscribe_interest(token) into v from t_tok;
  insert into t_results(test, ok, detail) values ('descadastro pelo link funciona', v, v::text);
exception when others then insert into t_results(test, ok, detail) values ('descadastro pelo link funciona', false, sqlerrm); end $$;
do $$ declare i int; begin
  for i in 1..12 loop perform public.register_interest('robo' || i || '@teste.dev', null, null, true, 'landing', 'x', 4000); end loop;
  insert into t_results(test, ok, detail) values ('limite de tentativas por origem', false, 'aceitou 12 seguidas');
exception when others then insert into t_results(test, ok, detail) values ('limite de tentativas por origem', sqlerrm = 'rate_limited', sqlerrm); end $$;

reset role;
insert into t_results(test, ok, detail) select 'descadastro grava situação e data', status = 'descadastrado' and unsubscribed_at is not null, status from interest_leads where email = 'lead@teste.dev';
do $$ declare r text; begin
  select string_agg(n || '. ' || case when ok then 'PASSOU' else 'FALHOU' end || ' | ' || test || ' | ' || left(detail, 90), E'\n' order by n) into r from t_results;
  raise exception E'RESULTADOS (transação desfeita):\n%', r;
end $$;
