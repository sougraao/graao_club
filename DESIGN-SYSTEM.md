# graao club — Design System v2.0

**Clean, criativo e suave.** Vidro translúcido sobre uma aurora de verde-água, violeta e azul, com toques de coral e amarelo.

- Referência viva: `/design-system`
- Fonte dos tokens: `public/css/base.css` (única fonte de verdade)
- Componentes: `public/css/microkit.css` + `public/js/microkit.js`

> **Regra zero:** nenhuma cor, raio, sombra ou duração "solta" no CSS. Tudo vem de um token.
> Se faltar um token, crie-o em `base.css` e documente aqui antes de usar.

---

## 1. Princípios

| Princípio | O que significa na prática |
|---|---|
| **Suave** | Base clara e fria, verde-petróleo para ação. Coral e amarelo aparecem como calor pontual. |
| **Leve** | Vidro translúcido sobre a aurora. Sem blocos opacos pesados nem bordas escuras. |
| **Claro** | Uma ação principal por tela, contraste AA e movimento que explica, não distrai. |
| **Criativo** | Gradiente em títulos, microinterações vivas e formas arredondadas, com moderação. |

## 2. Cores — paleta v2

Fonte: **"Moodboard — Design System Palette" v1.0** enviada pelo time. Itens marcados com \* foram harmonizados (não são amostras literais).

### Primitivos

| Token | Hex | Uso |
|---|---|---|
| `--gc-white` | `#FFFFFF` | Superfície |
| `--gc-bg` | `#F7F9FB` | Fundo da página |
| `--gc-mist` | `#EFF4F9` | Superfície suave |
| `--gc-border` | `#D8DCE5` | Bordas e divisores |
| `--gc-muted` | `#667071` | Texto secundário (4,8:1 no fundo) |
| `--gc-ink` | `#1F212D` | Texto principal |
| `--gc-night` | `#111516` | Fundo do tema escuro |
| `--gc-teal-soft` | `#B7F2E0` | primary-soft · primária no escuro |
| `--gc-teal` | `#087158` | **Primária** — botões e links (5,7:1 no fundo) |
| `--gc-teal-hover` | `#065B4A` | primary-hover |
| `--gc-blue-soft` / `--gc-blue` | `#CDE8FD` / `#AAD1FC` | info-soft / accent-sky |
| `--gc-violet-soft` / `--gc-violet` | `#F2DAFE` / `#918DE2` | aurora / secundária (texto tinta) |
| `--gc-violet-ink` \* | `#5753B5` | Texto de acento (6,0:1) |
| `--gc-coral` | `#F89777` | Acento quente pontual |
| `--gc-yellow` | `#FED74B` | Conquistas, estrelas |
| `--gc-danger-600` \* | `#C4384A` | Erro e exclusão |

### Semânticos (use estes no código)

| Papel | Claro | Escuro |
|---|---|---|
| `--background` | `#F7F9FB` | `#111516` |
| `--surface-solid` | `#FFFFFF` | `#1F212D` |
| `--surface-2` | `#EFF4F9` | `#2C303B` |
| `--foreground` | `#1F212D` | `#F7F9FB` |
| `--muted` | `#667071` | `#CFD3D9` |
| `--brand` (primary) | `#087158` | `#B7F2E0` |
| `--brand-strong` (hover) | `#065B4A` | `#D2F9ED` |
| `--on-fill` (on-primary) | `#FFFFFF` | `#1F212D` |
| `--accent-2` (secondary) | `#5753B5` | `#918DE2` |
| `--focus-ring` | `#087158` | `#B7F2E0` |
| `--glass-bg` | branco 62% | `#1F212D` 72% |
| `--glass-border` | branco 70% | branco 18% |

**Regras de cor**
1. Primária `#087158` sempre com **texto branco** (6,0:1). No tema escuro, primária `#B7F2E0` com **texto tinta**.
2. Texto sobre fundo claro: tinta, muted, primária ou violeta-tinta. Nunca texto coral, amarelo, azul ou violeta claro.
3. Coral, amarelo, azul e violeta são **acentos**: aurora, estados, ilustração e conquistas. No máximo um por componente, sempre com texto tinta.
4. Vermelho só para erro e exclusão.
5. Use os **semânticos** (`--brand`, `--fill`, `--on-fill`, `--muted`, `--surface`…), não os primitivos `--gc-*`. Os semânticos trocam sozinhos no tema escuro.
6. Os nomes antigos da v1 (`--gc-peach-*`, `--gc-terracota-700`…) continuam existindo só como apelidos para a paleta v2. Não use em código novo.

**Gradientes**: `--gc-grad-brand` (botões e progresso), `--gc-grad-dream` (capas e vazios), `--gc-grad-text` (palavra de ênfase do título), `--gc-grad-warm` (conquistas, uso pontual).

## 3. Vidro (glassmorphism)

| Nível | Token | Onde |
|---|---|---|
| 1 | `--glass-bg` (branco 62%) | Cards, painéis, campos |
| 2 | `--glass-bg-strong` (branco 82%) | Modais, popovers, toasts, item ativo |
| 3 | `--chrome-glass` (fundo 70%) | Sidebar, topbar, header |

```css
background: var(--glass-bg);
border: 1px solid var(--glass-border);
box-shadow: var(--glass-highlight), var(--shadow-md);
backdrop-filter: blur(var(--glass-blur)) saturate(160%);
```

- **G1** — Todo vidro precisa da `.aurora` atrás (já está no `index.html`). Sem fundo colorido, o desfoque não aparece.
- **G2** — Use só os 3 níveis acima.
- **G3** — Borda branca translúcida + realce interno (`--glass-highlight`). Nunca borda cinza escura.
- **G4** — No máximo 2 camadas de vidro empilhadas; a 3ª fica sólida (`--surface-solid`).
- Utilitário pronto: classe `.glass`.

## 4. Tipografia

| Papel | Fonte | Tamanho / peso | Entrelinha |
|---|---|---|---|
| Display (hero) | Bricolage Grotesque | 52–100px · 600 · tracking -0,055em | 0,97–1,05 |
| H1 de página | Bricolage Grotesque | 26–32px · 650 | 1,1 |
| H2 de seção | Bricolage Grotesque | 28–84px · 600 | 1,06–1,15 |
| H3 / card | Bricolage ou Geist | 15–20px · 600–650 | 1,3 |
| Corpo | Geist | 15–18px · 400 | 1,6–1,8 |
| Legenda | Geist | 12–13px · 400 | 1,5 |
| Rótulo | Geist | 11,5px · 600 · caixa-alta · tracking 0,12em | — |
| Código | Geist Mono | 12–13px | 1,7 |

Bricolage só em títulos. Gradiente de texto só na palavra de ênfase.

## 5. Forma, espaço e movimento

- **Espaço** (base 4): `--sp-1` 4 · `--sp-2` 8 · `--sp-3` 12 · `--sp-4` 16 · `--sp-6` 24 · `--sp-8` 32 · `--sp-12` 48 · `--sp-16` 64.
- **Raios**: `--r-sm` 12 (controles) · `--r-md` 16 (cards) · `--r-lg` 24 (seções, modais) · `--r-pill` (CTAs, chips, tags).
- **Sombras**: `--shadow-sm` (controles), `--shadow-md` (cards), `--shadow-lg` (modais, toasts), em tom azul-acinzentado.
- **Alvos de toque**: mínimo de 40px de altura.
- **Movimento**: `--ease-out` como padrão; `--ease-spring` só em confirmações. Durações de 180ms (hover), 300ms (estado) e 600ms (entrada).
- Tudo respeita `prefers-reduced-motion`.

## 6. Componentes — MicroKit

Microinterações de [microkit.co](https://microkit.co) (licença MIT), reescritas em HTML/CSS/JS sem dependências e com os tokens do graao club. Prefixo `.mk-*`. Os helpers ficam em `mk.*` (`js/microkit.js`), e `initMicrokit(root)` roda após cada render.

| Componente (microkit) | Classe / helper | Regra de uso no graao |
|---|---|---|
| Cursor Edge Glow Button | `mk.glow(label, href)` | **CTA principal, uma por tela** (Criar conta, Começar curso) |
| Magnetic Fill Button | `.btn.mk-magnetic` | CTA secundário em cabeçalhos |
| Subscribe Shine Button | `.mk-shine` | Botões de assinar plano |
| Hold to Delete Button | `mk.hold(label, attrs)` → evento `mk:hold` | Exclusão **irreversível** (excluir dados) |
| Fuse Undo Button | `fuse(el, {seconds, onExpire, onUndo})` | Exclusão **reversível** (excluir post: 5s para desfazer) |
| Bounce Checkbox | `mk.check(label, {checked, strike})` | Concluir aula ou tarefa |
| Progress Ring Check | `mk.ring(state, p)` | Status de aula e de primeiros passos |
| Count Up Number | `mk.count(n, sufixo)` | Pontos, progresso, estatísticas |
| Sliding Underline Tabs | `.mk-tabs` | Alternar visões (Temporada/Histórico, Recentes/Em alta, Anual/Mensal) |
| Spotlight Indicator | `.mk-spotlight` | Item ativo da sidebar |
| Expanding Icon Tabs | `.mk-icon-tabs` | Barra inferior no celular |
| Focus Field | automático em `.field`, `.search` | Todos os campos de texto |
| Hover Glide Cards | `.mk-glide` (no contêiner) | Grades de cards e atalhos |
| Staggered Letter Text Swap | `mk.swap(texto)` | Links do menu da landing |
| Read More Swap | `mk.more(label, href)` | Links "Ver tudo" |

**Não faça**: dois `mk.glow` na mesma tela, `mk.hold` para ações reversíveis, ou animação nova fora desta lista sem antes adicioná-la aqui.

## 7. Checklist de revisão (todo PR de UI)

- [ ] Só tokens; nenhum hex/raio/sombra solto.
- [ ] Texto passa em AA (4,5:1); primária com texto branco; acentos (coral, amarelo, azul, violeta) com texto tinta.
- [ ] Vidro com aurora atrás e no máximo 2 camadas.
- [ ] No máximo um CTA `mk.glow` por tela.
- [ ] Funciona no tema claro **e** no escuro.
- [ ] Funciona em 390px de largura, sem rolagem horizontal.
- [ ] Com `prefers-reduced-motion`, nada se move além do necessário.
