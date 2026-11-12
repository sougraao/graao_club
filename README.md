# graao club

Plataforma de cursos e comunidade do **graao club**, construída sobre a recriação de estudo do riseclub.tech.
Primeiro curso: **IA para TDAH** (estrutura provisória em `public/js/data.js`: só o módulo de boas-vindas tem aulas, os demais aguardam o conteúdo).

- **Design system:** [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md) (regras) + página viva em `/design-system` + tokens em `public/css/base.css`
- **Componentes MicroKit adaptados:** `public/css/microkit.css` e `public/js/microkit.js` (microkit.co, MIT)
- **Preços dos planos:** marcados como "a definir" até você informar os valores

---

## Base técnica (recriação)

Recriação da plataforma https://riseclub.tech feita a partir de evidência capturada com o REA
(DOM, rede, CSS e screenshots do site publicado em 1440×900).

## Rodar

```bash
node server.mjs
```

Abra http://localhost:5173. Sem dependências: HTML/CSS/JS puro + um servidor Node com fallback de rotas.

## O que foi recriado

| Rota | Conteúdo |
|---|---|
| `/` | Landing: hero com palco animado (abas Conteúdos/Comunidade/Notícias), faixa de áreas, 3 seções de recurso, app, planos (anual/mensal), depoimentos, FAQ, CTA final, rodapé, banner de privacidade |
| `/entrar`, `/cadastro` | Login/cadastro com validação, botões Google/Apple (demo) |
| `/inicio` | Dashboard: primeiros passos (0/5), próximo passo, progresso/pontos/ranking, novas aulas, ranking e "Acontecendo na Rise" |
| `/cursos`, `/modulo/:id` → `/aula/:modulo/:aula` | Trilhas em prateleiras, busca, canal de vídeos; aula com player, anterior/próximo, comentários e progresso da trilha |
| `/comunidade` | Busca no topo, feed com mídia grande, curtir/comentar/salvar, "Quem seguir" e ranking |
| `/ranking` | Temporada/Histórico, pódio, lista, tabela de pontos, temporada anterior |
| `/noticias`, `/noticias/:slug` | Categorias, Recentes/Em alta, destaque + lista lateral, artigo com comentários |
| `/conta/certificados` | Certificados emitidos ao concluir módulos + credenciais externas |
| `/planos`, `/perfil` | Start/Pro com checkout de demonstração; perfil com capa e estatísticas |
| `/conta`, `/conta/:secao` | Configurações: perfil, plano, notificações, aparência, senha, exportar/excluir dados |
| `/ajuda` | Central de ajuda com busca, temas, FAQ e chamados |
| `/sobre`, `/termos`, `/privacidade`, `/reembolso` | Páginas de texto |

Logado, o app usa sidebar + topbar (como o app real). Visitantes que abrem `/cursos`, `/comunidade` ou `/noticias` veem a página desfocada com o modal de entrada; `/inicio`, `/ranking`, `/planos` e `/conta` redirecionam para `/entrar`.

## Observado x decidido

- **Tirado do site:** estrutura das seções, textos de marketing, planos e preços, FAQ, rotas, tokens de cor claro/escuro, fontes
  (Space Grotesk, Geist, Geist Mono) e a maior parte do CSS da landing (módulos `rise-landing` e `landing-button`).
- **Lido do app logado (navegador interno, só leitura):** estrutura da sidebar, rotas internas, medidas e estilos (sidebar 256px, itens 36px, cards r16) e o layout de cada página.
- **Inferido pela screenshot:** layout do hero (o CSS dele não veio na captura).
- **Placeholders:** logo, vídeos (trocados por mock UIs animadas), depoimentos, usuários, posts, notícias e vídeos do canal
  são **fictícios**. Troque tudo em `public/js/data.js`; o nome da marca fica em `BRAND`.
- **Sem backend:** a conta, os posts, o progresso e o plano ficam só no `localStorage` do navegador. Nenhum pagamento é processado.

## Estrutura

```
server.mjs              servidor estático + fallback SPA
public/index.html
public/css/base.css     tokens, botões, toasts, banner de privacidade
public/css/landing.css  landing (baseada no CSS publicado)
public/css/app.css      páginas internas, auth, modal
public/js/app.js        roteador e ações globais
public/js/data.js       todo o conteúdo editável
public/js/store.js      estado em localStorage
public/js/views/*.js    landing, auth, shell (sidebar/topbar), pages (conteúdo), account (conta)
```
