# IA para TDAH sobre o graao club — auditoria, decisões e rollback

> Reposicionamento feito em 2026-11-11 sobre a base existente (sem refazer do zero).
> Fonte da verdade: o "Prompt mestre" do usuário. Os documentos estratégicos citados nele
> (`sougraao/IA_para_TDAH` › `IA_PARA_TDAH_MASTER.md` e `TEAM_CONTRACT.md`) **não puderam ser conferidos**:
> o GitHub respondeu 404 para esta conta. Nenhuma decisão comercial foi tirada deles.

## 1. Auditoria da base (Fase A)

| Área | O que existe | Real ou simulado |
|---|---|---|
| Hospedagem | Site estático na Vercel (`www.graao.com`), push na `main` = produção | Real |
| Login | Supabase Auth (e-mail/senha, recuperação, sessão PKCE), `entrar.html` + `api.js` | Real |
| Banco | Projeto `graao-club-dev` (35 tabelas, RLS em todas). **O site em produção usa este mesmo projeto** (`env.js`) | Real |
| Perfil | `profiles` lido e gravado no Supabase | Real |
| Permissões do admin | `team_members` + `role_permissions` + `my_permissions()`; RLS no banco | Real |
| Trilhas, notícias, comunidade, ranking, ferramentas, certificados, chamados, planos, cupons | Tabelas existem mas estão **vazias**; a interface lê `assets/js/data.js` + `localStorage["graao:db"]` | Simulado |
| Progresso de aulas, pontos, curtidas, posts do membro | `localStorage` | Simulado |
| Indicadores do admin (1.284 membros, séries, retenção, conclusão) | Números fixos no código | Fictício |
| Landing antiga | Contador "1.284 pessoas", estrelas, "Mais escolhido", preços, seção de app (App Store/Google Play), placeholders de depoimento, links institucionais apontando para o FAQ, banner de cookies citando medição e anúncios inexistentes | Fictício |
| E-mail | Envio via Resend (transacional). `contato@graao.com` **não recebe** (sem MX) | Envio real · recebimento inexistente |
| Pagamentos (Asaas) | Tabelas e plano no `BACKEND.md`; nada implementado | Planejado |

Rotas mapeadas: `index`, `entrar`, `inicio`, `conteudos`, `ferramentas`, `comunidade`, `noticias`, `noticia`, `ranking`, `certificados`, `perfil`, `configuracoes`, `admin#/…`, `design-system`. Todas continuam respondendo.

### Riscos registrados
1. **Banco único para dev e produção.** Migrações aplicadas no "dev" valem para o site publicado assim que o front for publicado. A migração nova é só aditiva; mesmo assim, crie o projeto de produção (`sa-east-1`) antes de abrir a turma.
2. **Escrita pública** (cadastro de interesse) é o primeiro ponto em que visitantes gravam no banco: protegido por RPC com validação, armadilha anti-robô, tempo mínimo, limite por origem (8/10 min) e teto global (500/h). Não há confirmação por e-mail (double opt-in): alguém pode cadastrar o e-mail de outra pessoa. Mitigação futura: e-mail de confirmação.
3. **localStorage do admin** (`graao:db`) pode sobrescrever padrões novos de `data.js` em navegadores que já editaram dados no admin (ex.: avisos antigos).
4. **Briefings privados**: dados de clientes podem ser colados nos projetos. A equipe não tem política de leitura; os avisos na interface pedem para evitar dados pessoais e de saúde.
5. **Marca**: e-mails transacionais, logo e domínio seguem "graao club" até a decisão de marca.

### Estratégia de rollback
- **Front-end:** todas as mudanças estão em arquivos versionados a partir de `e286b12`. Para voltar: reverter o commit (ou `git checkout e286b12 -- <arquivos>`). As telas antigas continuam no código (`pages.js`) e a versão anterior das áreas legadas abre em `?legado=1`.
- **Banco:** a migração `20261111000005_ia_para_tdah` só **cria** objetos. O script `supabase/rollback/20261111000005_ia_para_tdah_down.sql` remove apenas esses objetos. Ele **apaga interessados e projetos gravados desde então**: exporte antes e rode só com autorização.
- **Design system:** a versão 1.2 só acrescenta (nenhuma classe mudou).

## 2. O que foi implementado

### Landing (Fase B)
Seções 05.1 a 05.13 com a copy do prompt; ÓRBITA em abas acessíveis (toque, clique, setas, Home/End); demonstração conceitual rotulada; plataforma com status "Disponível na versão inicial" / "Em preparação"; formato de seis semanas marcado como "Proposta inicial · formato em validação"; FAQ novo; SEO (title, description, canonical, Open Graph, Twitter). Sem dados estruturados (nada verdadeiro o bastante para marcar). Removidos: contador, estrelas, "Mais escolhido", planos e preços, seção de app, placeholders de depoimento, banner de cookies (não há cookies opcionais), links de redes "em breve" e `mailto:contato@` (caixa não recebe).

### Cadastro de interesse
`index.html#primeira-turma` → `landing.js` → `POST /rest/v1/rpc/register_interest` com a chave pública. A tela de sucesso só aparece com `{"ok": true}` do servidor; sem servidor, avisa que está indisponível. Descadastro por token em `descadastro.html?t=<uuid>` (confirmação por clique, para leitores de link não descadastrarem sozinhos).

### Área do aluno (Fase C)
- **Meu Dia:** próxima ação (concluir ou definir), projeto principal (trocar), "continuar de onde parei" com estado salvo/não salvo, últimos registros, progresso privado, aprendizado relacionado (marcado como em preparação).
- **Projetos:** criar, editar briefing/objetivo/entregáveis/prazo/movimento em foco, microtarefas com movimento ÓRBITA opcional e filtro (sem ordem obrigatória), próxima ação única, concluir, excluir com desfazer, notas de progresso, "onde parei", pausar/retomar/arquivar/entregar (com desfazer), excluir projeto segurando o botão.
- **Academia:** seis trilhas planejadas, todas "Em preparação", sem aulas anunciadas.
- **Copiloto:** seis apoios (briefing, escopo, próximas ações, prompt contextualizado, revisão, entrega). Monta o texto no navegador, com contexto opcional do projeto escolhido campo a campo. O conteúdo da pessoa vai delimitado como dado, não como instrução. Não executa IA nem simula respostas.
- **Navegação:** Meu Dia, Projetos, Academia, Copiloto, Perfil (menu lateral e barra inferior). Comunidade, notícias, ranking e certificados em "Outras áreas", com tela de pausa explicativa.
- **Perfil e Configurações:** números privados de projetos; "Acesso e turma" no lugar de planos; avisos honestos (ainda não há envio); Acessibilidade (reduzir animações); exportação inclui projetos; apagar todos os projetos; troca de senha real quando há backend.

### Admin (Fase D)
Painel e Indicadores com `admin_overview()` (agregados reais; sem backend, aviso em vez de números de exemplo). Rota **Interessados** (`leads.view` para ver, `leads.manage` para editar situação/anotação, excluir e exportar CSV com proteção contra injeção de fórmula). Aviso "Dados de demonstração" nas rotas que ainda leem `data.js`.

## 3. Decisões de comunicação
- A marca visível segue "graao club" no logo; "IA para TDAH" é a oferta (títulos, hero, seções). Sem migração de marca.
- ÓRBITA é usado sem ® ou ™ (nome de trabalho).
- Os exemplos e o conteúdo dos movimentos ÓRBITA (objetivo, exemplo, como a IA ajuda, resultado) foram escritos nesta etapa: revisar com o dono do método.
- O texto "Por que existimos" usa só o texto-base do prompt; nada sobre o fundador foi inventado.
- Nada indica que a plataforma exige diagnóstico. Não pedimos dados de saúde.

## 4. Pendências que dependem de aprovação
| Item | Situação |
|---|---|
| Preço, condições, datas, vagas, parcelamento | Não publicados. Hipótese R$ 297–497 do documento mestre **não** usada |
| Formato de seis semanas | Marcado como proposta em validação |
| Relação de marca graao club × IA para TDAH (logo, domínio, e-mails transacionais) | Mantido como está |
| ÓRBITA como marca definitiva/registrada | Pendente |
| Política de Privacidade e Termos | Rascunhos com faixa "pendente de aprovação jurídica", `noindex`; faltam controlador, CNPJ, operadores, retenção, canal de direitos, foro |
| Canal de contato | `contato@graao.com` sem caixa (sem MX). Nenhum canal público foi anunciado |
| Confirmação de e-mail do cadastro (double opt-in) e e-mails de marketing com link de descadastro | Não implementado (o descadastro por token já existe) |
| Fotos/vídeo/história do fundador | Só com material real autorizado |
| Imagem Open Graph | Não criada |
| Projeto Supabase de produção | **Criado em 2026-11-11**: `graao-club` (sa-east-1), migrações aplicadas, 54/54. Falta configurar no painel: URLs de autenticação, SMTP do Resend, modelos de e-mail, Google; criar a conta ADMIN |
| Conteúdo real da Academia | A produzir |
| Exclusão automática de conta (Edge Function) | Pendente; hoje é manual |
