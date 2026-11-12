# Backend do IA para TDAH — plano

> Status: **planejado** · Stack decidida: **Supabase** (banco, login, arquivos, funções) + **Cloudflare R2** (vídeos das aulas) + **Vercel** (hospedagem do site) + **GitHub** [`holaluiz/graaoclub`](https://github.com/holaluiz/graaoclub) (versionamento).
> Migração inicial pronta em [`supabase/migrations/20261108000001_init.sql`](supabase/migrations/20261108000001_init.sql).

## 0. Estado atual (2026-11-09)

| Item | Valor |
|---|---|
| **Projeto Supabase em uso (desde 2026-11-11)** | `graao-club` · ref `mevtbwrfdttwulskaspb` · região **sa-east-1 (São Paulo)** · organização **sougraao's Org** (plano grátis). Criado pelo MCP; as 5 migrações do repositório aplicadas sem alteração; `rls_smoke.sql` **54/54**; Advisor igual ao do dev. `assets/js/env.js` aponta para ele |
| Projeto Supabase antigo (dev) | `graao-club-dev` · ref `luhjaekwowmzdzwukgdx` · us-east-1 · organização holaluiz. **Não é mais usado pelo `env.js`**, mas o site publicado continua nele até o próximo deploy. Ficou nele um cadastro de interesse de teste (`qa-prod@teste.dev`) a remover |
| URL da API | `https://mevtbwrfdttwulskaspb.supabase.co` (antigo: `https://luhjaekwowmzdzwukgdx.supabase.co`) |
| Chave pública | `env.js` usa a chave `anon` (JWT legado) do `graao-club`; existe também `sb_publishable_7w1xPqgcrn8oroKFK9LSXw_PRjSIcyT`. Públicas por design; a *service role* nunca sai do Supabase |
| Migrações aplicadas | `20261108000001_init` (35 tabelas, RLS em todas, gatilhos, dados iniciais) · `20261109000002_private_helpers` (funções de permissão no schema `private`, fora da API) · `20261109000003_rls_performance` (políticas com `(select auth.uid())`, uma política por ação, 27 índices de FK) |
| Migração IA para TDAH | `20261111000005_ia_para_tdah` **aplicada no dev em 2026-11-11**: `interest_leads` (escrita pública só via RPC `register_interest`, com armadilha anti-robô, limite por origem e sem duplicados), `unsubscribe_interest`, `creative_projects` + `project_steps` + `project_activity` (RLS só do dono; equipe sem acesso aos briefings), `admin_overview()` (agregados com permissão conferida no servidor), permissões `leads.view`/`leads.manage`. Rollback preparado (não aplicado) em `supabase/rollback/` |
| Teste de regras | [`supabase/tests/rls_smoke.sql`](supabase/tests/rls_smoke.sql) — **54/54 passou** em 2026-11-11 (22 anteriores + 32 do IA para TDAH: visitante, membro, editor e admin) |
| Supabase Advisor — segurança | 1 aviso intencional: `season_leaderboard` é `SECURITY DEFINER` para somar pontos de todos no ranking; devolve só nome/total e só para usuários logados |
| Supabase Advisor — desempenho | 0 avisos. Só a nota informativa "índice não usado", esperada com o banco vazio |
| Cloudflare R2 | bucket privado `graao-aulas` criado |
| Asaas | MCP de documentação em `.mcp.json`; integração (Edge Functions) ainda não implementada |
| Front-end | **Fase 1 concluída**: login/cadastro/recuperação de senha/sair reais, páginas do app exigem sessão, perfil salvo em `profiles`, admin usa papel e permissões do banco. Conteúdo, comunidade, ranking etc. ainda usam dados de demonstração (fases 2–4) |
| Configuração do front | [`assets/js/env.js`](assets/js/env.js) (URL + chave pública; vazio = modo demonstração) · [`assets/js/api.js`](assets/js/api.js) (supabase-js 2.49.4 via jsDelivr) |
| Domínio | **graao.com** — DNS no Google Cloud DNS (`ns-cloud-e1…e4.googledomains.com`). Sem MX: nenhum `@graao.com` recebe e-mail ainda (contato@ precisa de caixa de entrada ou encaminhamento) |
| Envio de e-mail | **Ativo desde 2026-11-09.** Resend (plano grátis: 3.000/mês, 100/dia), domínio `graao.com` **verificado** na região São Paulo (sa-east-1), sem rastreamento de cliques. Ligado ao Supabase `graao-club-dev` pela integração oficial *Resend → Settings → Integrations → Supabase* (a chave "Supabase Integration" foi criada e gravada pelo próprio Resend; ninguém a copiou). SMTP: `smtp.resend.com`, porta 465, usuário `resend` · remetente `IA para TDAH <nao-responda@graao.com>` · limites: 30 e-mails/h e 60 s entre e-mails para o mesmo usuário. Teste "redefinir senha" para o ADMIN entregue em 2026-11-09 |
| Site publicado | **https://www.graao.com** desde 2026-11-11 no projeto Vercel **`graao-club`** (equipe `graao`, ligado ao GitHub **`sougraao/graao_club`**: push na `main` = produção). `graao.com` redireciona 308 para o www. Também em https://graao-club.vercel.app. O projeto antigo (`graaoclub`, ligado a `holaluiz/graaoclub`) perdeu o domínio. `.vercelignore` impede publicar `supabase/`, documentação interna e configs |
| Equipe (dev) | `holaluiz.mail` = **ADMIN** (concedido em 2026-11-09 via SQL com papel de serviço; registrado no `audit_log`) |
| E-mails de autenticação | 6 modelos em português no visual graao (acento lima Broto) em [`supabase/templates/`](supabase/templates/README.md) — **instalados no `graao-club-dev` em 2026-11-09** com os assuntos do README. Ao mudar um modelo, regerar com `_build.py` e colar de novo. Os e-mails de aviso de segurança (senha trocada, e-mail trocado etc.) seguem com o texto padrão do Supabase |
| Editor de e-mails | Admin → **Sistema → E-mails** (`admin.html#/emails`, permissão `settings.manage`): edita os 6 e-mails com prévia ao vivo e exporta o HTML para colar no Supabase. Por enquanto salva no navegador; a sincronização automática (tabela `email_templates` + Edge Function `sync-auth-emails` via Management API) entra na fase 4 — ver [`supabase/templates/README.md`](supabase/templates/README.md) |
| Conta de teste (dev) | `membro.teste@graao.test`, plano Semente, sem papel de equipe — senha em `.env.test` (fora do Git). **Existe só no `graao-club-dev`**; no `graao-club` ainda não há nenhuma conta (nem ADMIN) |
| URLs de autenticação | **`graao-club` (desde 2026-11-11):** *Site URL* `https://www.graao.com` · *Redirect URLs* `https://www.graao.com/**`, `https://graao.com/**`, `https://graao-club.vercel.app/**`, `https://graao-club-*-graao.vercel.app/**` (prévias da Vercel), `http://localhost:5173/**`, `http://127.0.0.1:5173/**`. O `graao-club-dev` antigo segue com a configuração de 2026-11-09 |
| DNS (Squarespace) | Refeito em 2026-11-11 (a zona estava vazia): `graao.com` A → `216.198.79.1` · `www` CNAME → `cedf2ec14dc1df62.vercel-dns-017.com` · TXT `_vercel` com as duas verificações da Vercel (graao.com e www). **Os registros do Resend (DKIM `resend._domainkey`, `send`, `rsend`, `_dmarc`) não existem mais e precisam ser recriados** com os valores do painel do Resend. Sem MX |
| Variáveis de ambiente | **Nenhuma na Vercel, por desenho**: o site é estático e só usa valores públicos (`assets/js/env.js`). Segredos (R2, Asaas, Resend, service role) vão em **Supabase → Edge Functions → Secrets** quando as funções forem criadas — nunca na Vercel nem no front |

---

## 1. Objetivo

Trocar a camada de demonstração do front-end (dados em `assets/js/data.js` + `localStorage`) por um backend real, **sem mudar a interface**. Hoje o controle de acesso do admin só esconde telas; no backend ele passa a ser **imposto pelo banco** (Row Level Security), que é o requisito número 1 para ir ao ar.

### O que a referência usa (observado com o MCP REA nos scripts públicos)
| Área | Referência | IA para TDAH |
|---|---|---|
| Login | Auth.js | **Supabase Auth** (e-mail/senha + Google; sem Apple) |
| Banco | não exposto no cliente | **Supabase Postgres** (região São Paulo) |
| Vídeo | Vimeo / YouTube | **Cloudflare R2** (bucket privado) |
| Arquivos | R2 / S3 | **Supabase Storage** (imagens) |
| Pagamento | Stripe (cartão), Mercado Pago (Pix/parcelado), liberação manual | a decidir — ver §9 |
| Push / app | Firebase, Expo | fase posterior |
| Admin | 30 rotas `/admin` → 17 permissões → papéis ADMIN/STAFF/EDITOR | mesmo modelo, aplicado no banco |

---

## 2. Arquitetura

```
 GitHub holaluiz/graaoclub ──(push na main = deploy; PR = preview)──▶ Vercel
                                                                        │
 Navegador (HTML/CSS/JS estático servido pela Vercel) ◀─────────────────┘
   │  supabase-js (chave pública "anon" + sessão do usuário)
   ▼
 Supabase
   ├─ Auth ............ e-mail/senha, link mágico, Google OAuth
   ├─ Postgres + RLS .. todas as regras de acesso (plano, papel, dono, banido)
   ├─ Storage ......... avatares, capas, imagens de posts (buckets públicos/privados)
   ├─ Edge Functions .. URL assinada do R2, pagamentos, certificados, exportar/apagar conta
   ├─ Realtime ........ sino de notificações ao vivo
   └─ pg_cron ......... fechar temporadas, limpar dados expirados
   │
   ▼
 Cloudflare R2 (bucket privado "graao-aulas")
   └─ vídeos .mp4 (v1) → HLS via Worker (v2)
```

**Princípio:** o navegador nunca recebe segredo. Ele só usa a chave pública; o que exige segredo (R2, pagamentos, service role) roda em Edge Functions.

---

## 3. Modelo de dados

Mapeado 1:1 a partir de `data.js` e do admin. Tudo em `public`, com RLS ativado em **todas** as tabelas.

| Domínio | Tabelas |
|---|---|
| Pessoas | `profiles` (1:1 com `auth.users`, criado por gatilho), `team_members` (papel), `role_permissions` |
| Conteúdo | `trails` → `modules` → `lessons` (com `video_key` do R2), `lesson_progress`, `first_steps`, `certificates` |
| Comunidade | `posts`, `post_likes`, `comments`, `follows`, `reports` |
| Notícias | `news`, `news_likes`, `news_saves` |
| Ferramentas | `tools`, `tool_usage` |
| Engajamento | `point_rules`, `seasons`, `point_events` (livro-razão), função `season_leaderboard()`, `announcements`, `announcement_reads` |
| Suporte | `tickets`, `ticket_messages`, `ideas`, `idea_votes` |
| Vendas | `plans`, `coupons`, `subscriptions` |
| Sistema | `settings`, `audit_log` |
| IA para TDAH (2026-11-11) | `interest_leads` (+ `private.lead_hits`, hash da origem guardado por 1 dia), `creative_projects`, `project_steps` (microtarefas, `orbita` O/R/B/I/T/A, `is_next` único por projeto), `project_activity` (notas, microtarefas concluídas e mudanças de situação, gravadas por gatilho) |

Decisões importantes:
- **Pontos são um livro-razão** (`point_events`), nunca um número editável pelo cliente. Só funções do servidor inserem eventos, com `unique (user_id, rule_id, ref)` para impedir pontuar duas vezes a mesma aula.
- **Plano do membro** (`profiles.plan`) só muda pelo webhook de pagamento (service role) ou por quem tem `users.manage`. Um gatilho bloqueia qualquer outra tentativa.
- **Rascunho nunca vaza:** trilhas e notícias com `status = 'rascunho'` só são lidas por quem tem `content.manage` / `news.manage`.
- **Moderação não apaga por padrão:** `posts.hidden` tira do feed; exclusão definitiva fica registrada no `audit_log`.

---

## 4. Permissões (RLS)

Mesmo modelo do admin (`assets/js/admin.js`), agora no banco:

- `role_permissions` guarda a matriz papel × permissão (semeada na migração).
- `private.has_perm('content.manage')` → verdadeiro se o usuário logado tem um papel com essa permissão.
- `private.can_access_trail(trail_id)` → trilha publicada **e** plano do membro ≥ plano da trilha (ou equipe).
- As funções auxiliares ficam no schema `private` (não exposto pela API); o front usa `rpc('my_permissions')` para montar o menu do admin.
- **Atenção ao testar:** quando a RLS bloqueia um `update`/`delete`, ela não dá erro — afeta 0 linhas. Testes conferem `row_count`.
- **Padrão para novas políticas** (evita os avisos do Advisor): sempre `(select auth.uid())` e `(select private.has_perm('...'))` em vez da chamada direta; uma política por ação (`select` única + `insert`/`update`/`delete` separados, nunca `for all` junto de outra de leitura); índice em toda chave estrangeira nova. Depois de cada migração: `get_advisors` (segurança e desempenho) + `supabase/tests/rls_smoke.sql`.
- Padrão das políticas:
  - **ler conteúdo:** publicado e acessível, ou `has_perm(...)`.
  - **escrever conteúdo:** só `has_perm(...)`.
  - **dados pessoais:** só o dono (`user_id = auth.uid()`), e a equipe com a permissão da área.
  - **banido:** `is_active_member()` falso → não publica, não curte, não comenta.

| Permissão | ADMIN | STAFF | EDITOR |
|---|:-:|:-:|:-:|
| dashboard.view, content.manage, tools.manage, news.manage, community.moderate | ✓ | ✓ | ✓ |
| analytics.view, support.tickets, ranking.manage, push.send, users.view, users.manage | ✓ | ✓ | — |
| roles.manage, sales.manage, settings.manage | ✓ | — | — |
| leads.view (ver interessados) | ✓ | ✓ | — |
| leads.manage (situação, exclusão, exportação de interessados) | ✓ | — | — |

Projetos dos alunos (`creative_projects` e filhas) não têm política para a equipe: nenhum papel lê briefings. A equipe vê só agregados via `admin_overview()`.

---

## 5. Login

- **E-mail + senha** (atual) e **link mágico** opcional.
- **Google:** ativar o provedor no Supabase (Client ID + Secret do Google Cloud) e trocar o botão do `entrar.html` para `supabase.auth.signInWithOAuth({ provider: 'google' })`. O `googleClientId` do `app.js` deixa de ser usado no navegador.
- **Sem Apple.**
- Gatilho `handle_new_user` cria o `profile` com `username` único a partir do e-mail.
- E-mails de autenticação com remetente próprio (SMTP customizado no Supabase, ex.: Resend) e templates em português.

---

## 6. Vídeos no Cloudflare R2

- Bucket **privado** `graao-aulas`; chave do objeto = `trilhas/{trail_id}/{lesson_id}/video.mp4`, guardada em `lessons.video_key`.
- **Upload (admin):** Edge Function `r2-upload-url` → confere `has_perm('content.manage')` → devolve URL **pré-assinada de PUT** (S3 API do R2) válida por ~15 min. O navegador envia o arquivo direto ao R2 (não passa pelo Supabase).
- **Reprodução (membro):** Edge Function `lesson-video-url` → confere `can_access_trail` da aula → devolve URL **pré-assinada de GET** curta (~1 h). Quem não tem o plano não recebe URL.
- **v2 — streaming adaptativo (HLS):** URL pré-assinada por arquivo não serve para HLS (centenas de segmentos). Nessa fase, um **Cloudflare Worker** com binding do R2 valida um token assinado (emitido pela mesma Edge Function) e serve os segmentos. A conversão MP4 → HLS roda no upload (ffmpeg num job) ou via fila.
- Segredos (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`) ficam só nos *secrets* das Edge Functions.
- CORS do bucket liberado apenas para o domínio do IA para TDAH.

---

## 7. Edge Functions

| Função | Quem chama | O que faz |
|---|---|---|
| `r2-upload-url` | admin | URL pré-assinada de upload de vídeo |
| `lesson-video-url` | membro | URL pré-assinada de reprodução (se tiver acesso) |
| `checkout` | membro | cria cliente + assinatura no Asaas e devolve fatura/Pix |
| `asaas-webhook` | Asaas | ativa/cancela `subscriptions`, registra `payments` e atualiza `profiles.plan` |
| `billing-portal` | membro | faturas, cancelamento e troca de forma de pagamento |
| `issue-certificate` | membro | valida 100% da trilha, gera código verificável (+ PDF em fase posterior) |
| `verify-certificate` | público | confere um código de certificado |
| `account-export` / `account-delete` | membro | LGPD: exportar e apagar dados de verdade |
| `send-push` | equipe (`push.send`) | fase posterior (FCM / Web Push) |

---

## 8. Integração com o front-end

O front já separa dados (`data.js`) da interface. A troca é por camada:

1. Novo `assets/js/api.js` (supabase-js via CDN, versão fixa) expõe as mesmas operações que as páginas usam hoje (`listTrails`, `completeLesson`, `createPost`, `like`, `follow`, `saveTrail`…).
2. `CONFIG.supabase = { url, anonKey }` em `app.js`. **Vazio = modo demonstração** (comportamento atual); preenchido = backend real. Mesmo padrão já usado no Google.
3. `pages.js` e `admin.js` passam a chamar `api.*` (assíncrono) em vez de ler `GRAAO_DATA` / `GRAAO_DB.save`.
4. Sessão: `supabase.auth.onAuthStateChange` substitui o `graao:user` do `localStorage`; páginas do app redirecionam para `entrar.html?callbackUrl=` sem sessão.
5. O selo de papel do admin vem de `team_members` — o seletor "simular papel" some em produção.

---

## 9. Pagamentos — Asaas

**Decidido: Asaas**, usado para as **assinaturas dos membros** nos planos Broto e Colheita (Pix, boleto e cartão, com recorrência). A integração usa a **API REST v3** dentro de Edge Functions.

**MCP do Asaas:** configurado em [`.mcp.json`](.mcp.json) (`https://docs.asaas.com/mcp`). Ele consulta a documentação e a referência da API (endpoints, campos, eventos de webhook) para guiar a implementação. Operações reais exigem chave de API — **nunca colar a chave no chat**; ela vive só nos secrets do Supabase (e, se um dia o MCP for autenticado, numa variável de ambiente local com chave de **sandbox** e permissões mínimas).

**Ambientes:** começar no **sandbox** (`https://api-sandbox.asaas.com/v3`) e só depois produção (`https://api.asaas.com/v3`). Chaves diferentes para cada um.

**Segredos (Supabase → Edge Functions → Secrets — nunca no repositório):**
`ASAAS_API_KEY`, `ASAAS_BASE_URL`, `ASAAS_WEBHOOK_TOKEN` (um token longo e aleatório que você define).

**Fluxo de assinatura:**
1. Membro escolhe plano (Broto/Colheita, mensal ou anual) e a forma de pagamento.
2. `checkout` (Edge Function, usuário logado):
   - cria ou reaproveita o **cliente** no Asaas (`POST /customers`, com nome, e-mail e **CPF/CNPJ** — o documento é enviado direto ao Asaas e **não é guardado no nosso banco**);
   - guarda só o `customer_id` em `billing_customers`;
   - cria a **assinatura** (`POST /subscriptions`: `billingType` PIX | BOLETO | CREDIT_CARD | UNDEFINED, `value`, `cycle` MONTHLY | YEARLY, `nextDueDate`, `externalReference = user_id:plano`), aplicando o cupom como desconto;
   - registra `subscriptions` com status `pendente` e devolve ao front o link da fatura (`invoiceUrl`) ou o QR Code Pix.
3. `asaas-webhook` (Edge Function pública, sem login):
   - confere o cabeçalho `asaas-access-token` = `ASAAS_WEBHOOK_TOKEN` (senão 401);
   - é idempotente (guarda o `id` do evento em `payments`);
   - `PAYMENT_CONFIRMED` / `PAYMENT_RECEIVED` → assinatura `ativa`, `current_period_end` atualizado e `profiles.plan` = plano pago;
   - `PAYMENT_OVERDUE` → mantém acesso durante a carência configurada e avisa o membro;
   - `PAYMENT_REFUNDED` / `PAYMENT_DELETED` / `SUBSCRIPTION_DELETED` → assinatura `cancelada` e plano volta a `semente` quando o período acabar.
4. `billing-portal` (Edge Function): lista faturas e permite cancelar ou trocar a forma de pagamento.

**Configuração no painel do Asaas (feita por você, uma vez por ambiente):**
- Integrações → Webhooks → URL `https://<projeto>.supabase.co/functions/v1/asaas-webhook`, token = `ASAAS_WEBHOOK_TOKEN`, eventos de **Cobranças** e **Assinaturas**, fila ativa.
- Integrações → Chave de API → gerar a chave e salvá-la direto nos secrets do Supabase.

**Admin:** a área *Planos e cupons* define preços e cupons; *Membros* mostra a assinatura e permite liberação manual (`provider = 'manual'`), como a referência faz.

---

## 10. Segurança e LGPD

- RLS em todas as tabelas (a migração já ativa) + testes de política por papel antes de ir ao ar.
- `audit_log` para toda ação da equipe (quem, o quê, quando, antes/depois).
- Exportar e apagar conta de verdade (hoje é só local).
- Rate limit nas Edge Functions sensíveis; validação de tamanho/tipo de upload.
- Backups diários (plano pago do Supabase) e ponto de restauração antes de cada migração.
- Banner de cookies já existe; registrar o consentimento quando houver medição real.

---

## 11. Ambientes e fluxo

- Projetos **graao-dev** e **graao-prod** no Supabase, região **sa-east-1 (São Paulo)**.
- Migrações versionadas em `supabase/migrations/` (aplicadas pelo MCP ou pela CLI), nunca editadas à mão em produção.
- Tipos gerados do banco (`generate_typescript_types`) para referência dos campos.
- **Versionamento:** GitHub [`holaluiz/graaoclub`](https://github.com/holaluiz/graaoclub). `main` = produção; trabalho em branches com PR. Migrações SQL entram no mesmo PR da mudança de front que depende delas.
- **Hospedagem:** **Vercel** ligada ao repositório — cada push na `main` publica em produção e cada PR gera uma URL de preview. Site estático, sem build; `vercel.json` define URLs limpas e cabeçalhos de segurança/cache.
- A URL pública do Supabase e a chave **anon** podem ficar no front (são públicas por design). Nenhum segredo (service role, R2, pagamentos) vai para o repositório nem para a Vercel; ficam nos *secrets* das Edge Functions.
- Domínios de preview da Vercel entram na lista de *Redirect URLs* do Supabase Auth e no CORS do R2 (dev); produção usa só o domínio final.

---

## 12. Fases

| Fase | Entrega | Pronto quando |
|---|---|---|
| **0. Fundação** | Repositório no GitHub, projeto na Vercel, projeto Supabase (dev), migração inicial, seed, bucket R2 | tabelas + RLS criadas, advisor de segurança sem alertas |
| **1. Login e perfis** | `api.js`, sessão real, cadastro/login por e-mail, perfil e configurações | criar conta, entrar, editar perfil e sair funcionam com dados no banco |
| **2. Conteúdo** | trilhas/módulos/aulas do banco, progresso, upload e player de vídeo via R2, primeiros passos, pontos | membro assiste uma aula liberada e ganha pontos; aula de plano superior não abre |
| **3. Comunidade** | posts, curtidas, comentários, seguir, denúncias, moderação real | denúncia some da fila ao ocultar; banido não publica |
| **4. Admin completo** | todas as áreas do admin no banco, papéis reais, `audit_log` | Editor tenta acessar Membros e o banco recusa |
| **5. Pagamentos** | checkout, webhook, planos e cupons | pagamento aprovado muda o plano sozinho |
| **6. Extras** | certificados verificáveis, avisos em tempo real, Google login, temporadas automáticas | — |
| **7. Lançamento** | prod, domínio, SMTP, backups, testes de RLS, LGPD | checklist de segurança completo |

---

## 13. Decisões pendentes

1. **Carência** após atraso de pagamento (sugestão: 5 dias) e se o plano anual aceita parcelamento no cartão.
2. **Plano do Supabase:** o gratuito pausa projetos inativos e não tem backup diário — recomendado o pago para produção.
3. **Vídeo v1 em MP4 progressivo** (simples) ou já **HLS** (melhor em conexões ruins, exige Worker + conversão).
4. **Domínio** e remetente de e-mail.

Decididos: Supabase · Cloudflare R2 para vídeos (bucket `graao-aulas` criado) · Vercel para o site · GitHub `holaluiz/graaoclub` · Asaas para pagamentos.
