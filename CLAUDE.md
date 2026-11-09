# graao club

Plataforma de aprendizado e comunidade (site estático HTML/CSS/JS, sem build). Servir localmente com `python -m http.server 5173`.

## Design system — obrigatório

**Toda criação visual (página, componente, ajuste de UI) DEVE seguir [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).** Leia-o antes de escrever qualquer HTML/CSS.

- Use apenas classes `.g-*` e tokens `--g-*` de `assets/css/graao-ds.css`. Nada de cores hex soltas, fontes novas ou raios fora da escala.
- Micro-interações vêm de `assets/js/graao-ds.js` (atributos `data-g-*`); após inserir HTML dinâmico, chame `G.mount(el)`.
- Ícones: `assets/js/graao-icons.js` (`<use href="#i-nome"/>`). Ícone novo segue o mesmo traço (24×24, 1.7, arredondado).
- Componente novo → adicionar ao CSS do sistema, à vitrine `design-system.html` e ao `DESIGN_SYSTEM.md`.
- Rode o checklist da seção 9 do DESIGN_SYSTEM.md (inclui mobile 375px) antes de dar a tela como pronta.

## Estrutura

- `index.html` (site público, modo Dia), `entrar.html` (login/cadastro), páginas do app (`inicio.html` etc., modo Noite).
- Páginas do app declaram `<body data-app-page="id" data-app-title="Título">` e um `<main class="content">`; o shell (menu, topo, rodapé) é montado por `assets/js/app.js`.
- Dados de demonstração em `assets/js/data.js` (fictícios — substituir por API real). Edições do admin persistem em `localStorage["graao:db"]` via `GRAAO_DB.save(chave)` e o app inteiro lê de `GRAAO_DATA`.
- Admin: `admin.html#/rota`, código em `assets/js/admin.js`. Arquitetura rota → permissão → papel (ADMIN/STAFF/EDITOR), inspirada no mapeamento feito com o MCP REA. Nova área = entrada em `ROUTES` + permissão em `PERMS`/`ROLES` + função em `S`. O controle de acesso aqui é só de interface; em produção deve ser validado no servidor.
- Ferramentas dos membros: `ferramentas.html` (render em `pages.js`, apps internos em `TOOL_APPS`); cadastro no admin.
- Backend planejado em [BACKEND.md](BACKEND.md): Supabase (banco/login/arquivos/funções, região São Paulo) + Cloudflare R2 (vídeos, bucket privado) + Vercel (site) + GitHub `holaluiz/graaoclub` + Asaas (assinaturas dos membros nos planos Broto/Colheita, via API v3 em Edge Functions — sandbox primeiro). Migrações em `supabase/migrations/` — nunca alterar o banco de produção à mão. Nenhum segredo no repositório.
- Login real pelo Supabase Auth quando `assets/js/env.js` tem URL + chave pública (vazio = modo demonstração com localStorage). `assets/js/api.js` (`window.GRAAO_API`) concentra sessão, perfil e permissões e espelha o perfil em `localStorage["graao:user"]`, então `getUser()` continua valendo. Páginas do app sem sessão redirecionam para `entrar.html?callbackUrl=`. Google: `googleAuth: true` no env.js depois de configurar o provedor no Supabase. Não há login com Apple.
- Conta de teste do ambiente dev: credenciais em `.env.test` (fora do Git). Nunca usar senha real de pessoas em testes.
