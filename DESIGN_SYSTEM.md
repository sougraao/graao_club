# Safra — Design System do graao club

> **Documento primordial.** Toda tela, componente, página, e-mail ou peça nova do graao club parte daqui.
> Se algo não está coberto, estenda o sistema seguindo estas regras e registre a adição neste arquivo.
> Vitrine viva: [`design-system.html`](design-system.html) · Código: [`assets/css/graao-ds.css`](assets/css/graao-ds.css), [`assets/js/graao-ds.js`](assets/js/graao-ds.js), [`assets/js/graao-icons.js`](assets/js/graao-icons.js)

---

## 1. Essência

**"Detalhe é colheita."** O graao club é premium pela precisão: superfícies grafite profundas, uma única cor de energia (o **Limão**, amarelo Limoncello), apoio pastel de verão (Menta, Lavanda, Céu), números grandes e leves, mídia vibrante e micro-interações que respondem a cada gesto.

Origem da linguagem:
| Referência | O que herdamos |
|---|---|
| Dashboard escuro (faturas) | Grafite em camadas, acento único, números em peso 300, tudo em pílula, botões circulares com borda fina, sheet clara encaixada com aba recortada, linha selecionada invertida, cartões empilhados com o ativo subindo |
| Loja VR (cards vibrantes) | Fundo névoa claro no modo Dia, gradientes saturados para mídia, objeto que "sai" do card, carrossel com foco central e leve perspectiva, widget em vidro |
| Paleta "Céu de verão" (Pantone 122 C, 317 C, 7443 C) | Limoncello como acento, Summer Green e Soft Lavender como apoio, o azul do céu para informação; pares pastel + tinta profunda |
| microkit.co (micro-interações) | Indicadores que deslizam, texto que rola, brilho que varre, segurar para confirmar, contador animado, checkbox com quique, número arrastável, menu com destaque que desliza, toast com pavio de desfazer |

### Os 6 princípios

1. **Noite com ilhas de luz.** O app vive no grafite (`--g-bg`, `--g-surface`). Destaque = superfície invertida (pílula branca, sheet clara) **ou** Limão. Nunca os dois competindo no mesmo bloco.
2. **Uma colheita por área.** No máximo **uma** ação amarela (Limão) por card/seção. Ações secundárias: `.g-btn` (contorno) ou `.g-btn--solid` (invertido).
3. **Números são protagonistas.** Valores em `.g-num`: grandes, peso 300, tabulares, unidade pequena e apagada (`<small>`).
4. **Tudo é macio.** Controles em pílula, cards 24px, seções 32–44px. Nada de canto vivo. Ícones de ação em círculo (`.g-icon-btn`).
5. **Todo gesto tem resposta.** Hover, foco e clique sempre produzem movimento curto e com desaceleração. Nada pisca, nada pula.
6. **Mídia é festa, interface é calma.** Gradientes Safra e objetos 3D **só** em conteúdo (capas, trilhas, destaques). A interface em volta fica neutra.

---

## 2. Instalação em qualquer página

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300..800&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/graao-ds.css">
<script src="assets/js/graao-icons.js" defer></script>
<script src="assets/js/graao-ds.js" defer></script>
```

- Modo: `<html data-theme="dark">` (Noite — padrão do app) ou `data-theme="light"` (Dia — padrão do site público). Um bloco isolado pode forçar o modo com `.g-noite` / `.g-dia`.
- Ícone: `<svg class="g-icon" aria-hidden="true"><use href="#i-arrow-right"/></svg>`.
- Conteúdo inserido via JS: chame `G.mount(elemento)` para ativar as micro-interações.

---

## 3. Tokens

**Regra de ouro:** componentes usam **somente tokens semânticos**. Primitivos (`--g-ink-*`, `--g-mist-*`, `--g-limao-*`, `--g-menta-*`, `--g-lavanda-*`, `--g-ceu-*`) só aparecem na definição dos semânticos. Proibido hex solto em página.

### 3.1 Paleta "Céu de verão"

A paleta nasce de uma referência de verão: tênis pastel e um limão flutuando num céu azul. Ela tem **quatro famílias de cor** sobre a base grafite (Noite) e névoa (Dia). Cada família tem uma rampa de 50 a 900 com três papéis fixos:

- **50–200 pastel** → superfícies e fundos suaves.
- **300–500 médio** → preenchimento.
- **600–900 profundo** → texto. É o par "pastel + tinta" da referência, como o lilás claro com o título roxo escuro.

| Família | Referência | Papel na marca | Âncora |
|---|---|---|---|
| **Limão** `--g-limao-*` | Limoncello · Pantone 122 C | **Acento único**: ação principal, foco, progresso, pontos, ativo | 500 `#FED141` |
| **Menta** `--g-menta-*` | Summer Green · Pantone 317 C | Crescimento, concluído, sucesso, "Comece Aqui" | 200 `#B1E4E3` |
| **Lavanda** `--g-lavanda-*` | Soft Lavender · Pantone 7443 C | Comunidade, premium, IA, eventos | 100 `#EBDEFC` |
| **Céu** `--g-ceu-*` | o azul das fotos | Informação, tecnologia, links de apoio | 500 `#2F88E6` |

Rampas completas, de 50 a 900:

- **Limão:** `#FFFAE6` `#FFF2C2` `#FFE68A` `#FFDD66` `#FFD84F` **`#FED141`** `#F2BC12` `#C99400` `#8A6200` `#3B2A12`
- **Menta:** `#EEFAF9` `#D6F3F2` **`#B1E4E3`** `#86D6D3` `#5BC4C0` `#2FAAA6` `#178C88` `#0E726E` `#0B5A57` `#08403E`
- **Lavanda:** `#F7F2FE` **`#EBDEFC`** `#DCC6FA` `#C3A2F6` `#A77CF0` `#8B57E8` `#7340D4` `#5C30B0` `#46248A` `#2F1860`
- **Céu:** `#EEF6FE` `#D7EAFC` `#B3D7F9` `#85BEF5` `#57A3F0` **`#2F88E6`** `#1F6ECB` `#1957A3` `#15437D` `#102F57`

Fora das famílias, só para status:

- **Laranja** `--g-laranja-400/700`, para alerta. Não pode ser o Limão, que é o acento.
- **Coral** `--g-coral-400/700`, para erro.

**Estratégia:**
1. **Um foco amarelo por área.** O Limão é energia: aparece uma vez por card ou seção, sempre como ação ou estado ativo.
2. **As cores de apoio nunca viram botão principal.** Menta, Lavanda e Céu marcam categoria e estado (badges, ícones, capas), nunca a ação da área.
3. **Pastel é fundo, profundo é texto.** O pastel não serve como texto no Dia, e o profundo não serve como fundo grande.
4. **A interface continua neutra.** Grafite e névoa ficam com 90% da tela. As cores aparecem em pontos de informação e em mídia.

### 3.2 Cor — semânticos

| Token | Noite | Dia | Uso |
|---|---|---|---|
| `--g-bg` | `#0B0D10` | `#EEF0F6` | Moldura / fundo da página |
| `--g-canvas` | `#111418` | `#F6F7FB` | Área de trabalho |
| `--g-surface` / `--g-surface-grad` | `#161A1F` | `#FFFFFF` | Card padrão |
| `--g-surface-raised` | `#1C2127` | `#F6F7FB` | Card dentro de card, inputs |
| `--g-inverse` / `--g-on-inverse` | branco / grafite | grafite / branco | Pílula de destaque, sheet, toast, linha selecionada |
| `--g-text` · `--g-text-2` · `--g-text-3` | `#F3F5F7` · `#8A929C` · `#6B737E` | `#0B0D10` · `#5C636D` · `#7D848E` | Texto principal · secundário · terciário |
| `--g-line` · `--g-line-strong` | branco 7% · 14% | grafite 7% · 13% | Bordas (sempre 1px) |
| `--g-accent` | `#FED141` | `#FED141` | **Preenchimento** de ação/estado ativo |
| `--g-accent-hover` / `--g-accent-press` | `#FFD84F` / `#F2BC12` | igual | Estados do preenchimento |
| `--g-on-accent` | `#0B0D10` | `#0B0D10` | Texto sobre o Limão (sempre grafite) |
| `--g-accent-text` | `#FED141` | `#8A6200` | Limão **como texto** (escurece no Dia para contraste) |
| `--g-accent-soft` | limão 12% | limão 28% | Fundo de badge/realce suave |
| `--g-accent-edge` | `#F2BC12` | `#C99400` | Luz na borda do botão principal |
| `--g-{menta,lavanda,ceu,limao}` | pastel 100–200 | pastel 100–200 | Preenchimento pastel (texto grafite por cima) |
| `--g-{…}-soft` | médio translúcido | pastel 50–100 | Fundo de badge/tag do tom |
| `--g-{…}-text` | médio 300–400 | profundo 600–800 | O tom como texto |
| `--g-success` | Menta `#86D6D3` | Menta `#0E726E` | Concluído, salvo, ativo |
| `--g-info` | Céu `#85BEF5` | Céu `#1957A3` | Informação neutra |
| `--g-warning` | Laranja `#FFA24C` | Laranja `#A8530A` | Atenção |
| `--g-danger` | Coral `#FF6B6B` | Coral `#C62A2F` | Erro, destrutivo |

Todo texto da tabela tem contraste **≥ 4,5:1** (WCAG AA) sobre `--g-canvas`/`--g-surface` do seu modo. O pior caso é `--g-accent-text` no Dia sobre `--g-bg`, com 4,8:1.

### 3.3 Safra — gradientes de mídia

As chaves (`lima`, `mar`, `sol`, `uva`, `brasa`, `noite`) são as mesmas gravadas no banco (`trails.safra`). O nome ficou, a cor seguiu a paleta.

| Token | Família | Uso sugerido | Texto por cima |
|---|---|---|---|
| `--g-safra-lima` | Menta | Comece Aqui, iniciante, crescimento | grafite |
| `--g-safra-mar` | Céu | Desenvolvimento, web, tecnologia | branco |
| `--g-safra-sol` | Limão | Design, criatividade, conquistas | grafite |
| `--g-safra-uva` | Lavanda | IA, premium, eventos | branco |
| `--g-safra-brasa` | Pôr do sol (coral) | Comunidade, ao vivo, urgência | branco |
| `--g-safra-ceu` | Céu aberto (azul → nuvem) | Assinatura da marca, lançamentos, hero | grafite |
| `--g-safra-noite` | Noite com toque lavanda | Destaque central, lançamento (com o grão-limão) | branco |

Os gradientes de texto branco escurecem embaixo, onde ficam título e preço, para manter ≥ 3:1 em texto grande.

### 3.4 Tipografia

Família única **Geist** (300–800) + **Geist Mono** para rótulos técnicos.

| Classe | Tamanho | Peso | Tracking | Uso |
|---|---|---|---|---|
| `.g-display` | 52→104px | 500 | −0.055em | Hero |
| `.g-h1` | 42→72px | 500 | −0.05em | Título de página pública |
| `.g-h2` | 34→48px | 500 | −0.045em | Seção |
| `.g-h3` | 24px | 600 | −0.03em | Título de página do app / modal |
| `.g-h4` | 17px | 600 | −0.015em | Título de card |
| `.g-body` / `.g-lead` | 15 / 17px | 400 | 0 | Texto corrido (cor `--g-text-2`) |
| `.g-caption` | 13px | 400 | 0 | Metadados |
| `.g-eyebrow` | 11px Mono | 500 | +0.14em, CAIXA ALTA | Sobretítulo |
| `.g-num` (`--sm/--lg/--xl`) | 20→72px | **300** | −0.035em | Valores; `<small>` para unidade/moeda |

Regras: títulos nunca em negrito 800+; nunca texto em CAIXA ALTA fora do `.g-eyebrow`; frases curtas.

### 3.5 Espaço, raio, elevação

- **Espaço:** base 4px → `4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96`. Gap entre cards: 16px. Padding de card: 24px (raised: 16px).
- **Raio:** `xs 8 · sm 12 · md 18 · lg 24 · xl 32 · 2xl 44 · pill`. Regra: raio interno = raio externo − padding.
- **Controles:** 32 (sm) · 40 (md, padrão) · 52px (lg).
- **Elevação:** no Noite, profundidade vem de **camadas de cor + brilho superior** (`--g-highlight`), não de sombra. Sombras (`--g-shadow-2/3`) só para flutuantes (menu, modal, toast, card em hover) e para mídia no Dia.

### 3.6 Movimento

| Token | Valor | Uso |
|---|---|---|
| `--g-ease-out` | `cubic-bezier(.16,1,.3,1)` | Padrão: deslizes, indicadores, reveals |
| `--g-ease-spring` | `cubic-bezier(.34,1.56,.64,1)` | Quiques pequenos: check, toast, carta que sobe |
| `--g-dur-1..5` | 120 · 200 · 320 · 560 · 900ms | Cor 200 · posição 320–560 · números/reveal 900 |

Sempre respeitar `prefers-reduced-motion` (já tratado no CSS e no JS). Nunca animar `width/height` de layout grande; prefira `transform`/`opacity`.

### 3.7 Rolagem

- **Barra personalizada** (automática em toda página que carrega `graao-ds.css`): fina, arredondada, nos tokens `--g-scrollbar` / `--g-scrollbar-hover`, e acende em amarelo (`--g-scrollbar-active`) ao arrastar. Funciona em Chrome/Edge/Safari (`::-webkit-scrollbar`) e Firefox (`scrollbar-color`).
- **Rolagem suave nativa:** âncoras e `scrollIntoView` deslizam (`scroll-behavior: smooth`, com `scroll-padding-top: 96px` para não esconder títulos sob o cabeçalho fixo).
- **Rolagem com inércia** (estilo premium): `<html data-g-smooth>` (opcional `data-g-smooth="0.1"`, de 0.04 = mais macio a 0.3 = mais firme). Só atua com mouse/trackpad no desktop; desliga sozinha em touch, com "reduzir movimento", dentro de áreas roláveis internas, com ctrl+roda (zoom) e com modal aberto. Via código: `G.smooth.to(y)`, `G.smooth.disable()`.
  - **Use** no site público e páginas longas de leitura. **Não use** em telas de trabalho densas do app.
- **Utilitários:** `.g-scroll` (área interna), `.g-scroll--x` (trilho horizontal com encaixe), `.g-scroll--fade` (bordas esmaecidas), `.g-scroll--hidden` (oculta a barra — só para trilhos com outra pista visual).
- **Progresso de leitura:** `<div class="g-scroll-progress" data-g-scroll-progress></div>` (linha amarela no topo; artigos e documentação).

---

## 4. Componentes

Todos vivos em `design-system.html`. Classe → quando usar.

### Botões
| Componente | Classe / atributo | Quando |
|---|---|---|
| Primário (luz na borda) | `.g-btn.g-btn--accent` | A ação principal da área (1 por área). Já vem com a **luz na borda**: a luz descansa à direita, segue o cursor no hover, acende a borda do lado mais próximo e pulsa no clique (`graao-ds.js › edge`, tokens `--ex`/`--eg`, cor `--g-accent-edge`). Sem JS ou com "reduzir movimento", fica parada no repouso. Para desligar num caso pontual, use `data-g-edge="off"`. Combinado com `--swap` ou `--hold` (que usam o próprio `::before`), a luz se desliga sozinha. |
| Invertido | `.g-btn--solid` | Ação forte secundária ("Selecionar plano") |
| Contorno | `.g-btn` | Ações neutras |
| Silencioso | `.g-btn--quiet` | Cancelar, voltar |
| Seta que avança | `+ .g-btn--arrow` (ícone por último) | CTAs que levam adiante |
| Circle swap | `.g-btn--swap` + `.g-btn__orb` | CTA hero/fechamento |
| Text roll | `.g-roll` com 2 `<span>` iguais | CTA de navegação em superfície invertida |
| Shine | `.g-btn--shine` | Assinatura/upgrade (no máx. 1 por página) |
| Segurar para confirmar | `.g-btn--hold` + `data-g-hold="1200"` + `[data-label]` | Ações destrutivas sem modal |
| Magnético / borda luminosa | `data-g-magnetic=".25"` / `data-g-glow` | Hero e CTAs de marketing (nunca dentro do app) |
| Ícone circular | `.g-icon-btn` (`--sm/--lg/--accent/--ghost`) + `.g-dot` | Ações de ícone, voltar, notificações |

### Formulários
`.g-field` (rótulo flutuante — exige `placeholder=" "`), `.g-pill-input` (filtros, busca, select, data), `.g-check` (quique + risco), `.g-switch`, `.g-scrub` (número arrastável/teclado).

### Navegação
`.g-segment[data-g-segment]` (pílula deslizante; `--inverse` para a barra flutuante branca), `.g-tabs[data-g-tabs]` (sublinhado deslizante), `.g-icon-tabs` (ícone expande rótulo), `.g-sidenav[data-g-spotlight]` (indicador com barra amarela), `.g-menu[data-g-glide]` + `.g-popover` (menus).

### Dados
`.g-stat` + `.g-num`, `.g-delta`, `.g-progress` (listrado; `--thin`), `.g-ring[data-g-ring]`, `[data-g-count]` (contador), `.g-row` (lista; selecionada = invertida), `.g-stack-cards` (opções empilhadas), `.g-badge` (neutro, `--inverse`, `--accent`, `--soft`, `--success`, `--warning`, `--danger`, `--info`; tons de apoio `--menta`, `--lavanda`, `--ceu`, `--limao`; `.g-pulse` para "ao vivo"), `.g-count`, `.g-avatar` / `.g-avatar-stack`.

### Superfícies
`.g-card` (`--flat`, `--raised`, `--inverse`, `--accent`, `--dashed`, `--interactive`), `.g-sheet` + `.g-notch` (painel claro com aba recortada), `.g-glass`, `.g-frame`, `.g-divider`.

### Mídia
`.g-cover--{lima|mar|brasa|sol|uva|ceu|noite}`, `.g-media-card` + `.g-media-card__figure` (objeto que sai do card), `.g-carousel[data-g-carousel]` (foco central), `.g-price`, `.g-stars`. Objetos 3D prontos em `assets/img/obj-*.svg` (grão-limão, broto em menta, orbe em céu, cubo em limão, balão em coral).

### Modo Noite ↔ Dia
`G.theme("light" | "dark", aplicar?)` troca o modo com uma **varredura diagonal**: a página nova entra por cima da antiga em 700ms (View Transitions). O Dia entra pelo canto inferior direito e a Noite pelo superior esquerdo. `aplicar(modo)` roda dentro da transição, para salvar a preferência e trocar ícones. O botão de tema do app (`[data-theme-toggle]`) e o seletor de Aparência já usam `G.theme` via `GRAAO.setTheme`; o ícone sol/lua gira ao trocar (`.g-icon--swap`). Sem suporte no navegador, com "reduzir movimento" ou com a aba em segundo plano, a troca é instantânea. Nunca troque `data-theme` direto num clique do usuário: use `G.theme`.

### Feedback
`G.toast(texto, { action, onAction, duration, iconId })` (com pavio), `G.modal(html, { label })`, `.g-tooltip[data-tip]`, `.g-skeleton`, `.g-empty`.

### Dados densos (admin)
| Componente | Classe | Quando |
|---|---|---|
| Tabela | `.g-table-wrap > .g-table` (+ `.g-table--stack` vira lista no celular; `td[data-label]` dá o rótulo) | Listas com várias colunas comparáveis (membros, cupons, permissões) |
| Status | `.g-status` + `--on` (amarelo) `--warn` `--off` `--info` | Estado de um registro em listas e tabelas — nunca só cor: sempre com o texto |
| Gráfico de barras | `.g-bars` (`--max`, `--h`) com `.g-bar` (`--v`, `data-label`, `data-value`; `.is-peak` destaca) dentro de `.g-bars-wrap` | Séries curtas (semanas, dias); tooltip no hover |
| Barra de ações em massa | `.g-actionbar` (+ `.is-open`) | Ações sobre itens selecionados numa lista |

### Mobile
| Componente | Classe / API | Quando |
|---|---|---|
| Barra de abas inferior | `.g-tabbar` (+ `data-g-autohide` para sumir ao rolar) com até 5 itens; o ativo (`aria-current="page"`) vira pílula amarela com rótulo (largura do conteúdo; em barras com menos de 260px, como mockups, mostra só o ícone; o `.g-dot` some no item ativo) | Navegação principal do app abaixo de 860px (oculta sozinha no desktop) |
| Botão flutuante | `.g-fab` | Uma única ação criadora por tela (publicar, nova meta) |
| Cabeçalho compacto | `.g-appbar` + `.g-appbar__title` | Telas internas com voltar + título + ação |
| Bottom sheet | `G.modal(html, { sheet: true })` — no celular todo modal já vira sheet | Ações rápidas, menus de compartilhar, confirmações; fecha arrastando para baixo |
| Carrossel com swipe | `.g-carousel` (automático ≤ 640px) | O card que encaixa no centro vira o foco |
| Utilitários | `.g-only-mobile`, `.g-hide-mobile`, `.g-safe-x`, `.g-safe-bottom` | Visibilidade por breakpoint e áreas seguras (notch/barra do sistema) |

---

## 5. Mobile (regras de plataforma)

O graao club é **mobile-first**: escreva o CSS para 375px e expanda. Todo componente da seção 4 já se adapta.

- **Breakpoints (valores exatos):** `sm 520px` · `md 860px` (troca de navegação: menu lateral → barra de abas) · `lg 1100px` (colunas laterais descem) · `xl 1360px` (largura máxima).
- **Toque** (`@media (pointer: coarse)`, já no CSS): alvos ≥ 44px, sem atraso de toque nem realce azul, `:hover` decorativo vira `:active` (leve escala).
- **Inputs** com 16px no mobile (evita o zoom automático do iOS) — já aplicado.
- **Áreas seguras:** use `--g-safe-top/bottom/left/right` (`env(safe-area-inset-*)`) em tudo que encosta nas bordas; páginas usam `viewport-fit=cover`.
- **Navegação:** no app, menu lateral vira gaveta + `.g-tabbar` inferior com Início, Aulas, Comunidade, Notícias, Perfil. Conteúdo ganha folga inferior para não ficar sob a barra.
- **Layout:** gutter lateral 16px; grades de 2–4 colunas viram 1 coluna; trilhos horizontais (`.g-scroll--x`) em vez de grades largas; tabelas viram listas `.g-row`.
- **Overlays:** modais viram bottom sheet; popovers longos viram sheet; toasts sobem acima da barra de abas.
- **Movimento:** rolagem com inércia e efeito magnético ficam desligados no toque (o JS já cuida disso); swipe nativo sempre preferido.
- **Teste obrigatório:** 375 × 812 (iPhone), 390 × 844 e 768 × 1024 (tablet), nos modos Noite e Dia, sem rolagem horizontal.

---

## 6. Padrões de tela

- **App (logado):** modo Noite. Menu lateral com spotlight · barra superior com breadcrumb, notificações (`.g-icon-btn` + `.g-dot`) e pílula de usuário · conteúdo máx. 1200px. Título da página em `.g-h3` com botão voltar circular quando houver hierarquia.
- **Painel de números:** card com 3–4 `.g-stat` em linha, números `.g-num--lg`, progresso amarelo abaixo, avatares empilhados como prova social.
- **Lista + detalhe:** `.g-sheet` clara com `.g-notch` de filtros; à esquerda `.g-row` (selecionada invertida), à direita card Noite com detalhes e ação amarela.
- **Filtros:** linha de `.g-pill-input` com rótulo "Filtros ativos" + `.g-count`.
- **Site público:** modo Dia, seções escuras pontuais (`.g-noite`) para ritmo. Hero com `.g-display` e carrossel de mídia.
- **Vazio:** sempre `.g-empty` com ícone, uma frase e uma ação.
- **Admin (painel da equipe):** mesmo shell do app com o selo "Painel administrativo" e menu agrupado por área (Visão geral, Conteúdo, Comunidade, Engajamento, Pessoas, Vendas, Sistema). Cada área exige uma permissão; o menu mostra só o que o papel (Administrador, Equipe, Editor) pode acessar, e uma rota sem permissão mostra `.g-empty` com cadeado.
  - **Lista + detalhe:** busca + filtros em `.g-segment` + ação "Novo" amarela → lista de `.g-row` à esquerda (selecionada invertida), formulário à direita. No celular o detalhe abre em bottom sheet.
  - **Formulário de edição:** `.g-field` empilhados, seções com `.g-eyebrow`, rodapé com "Ver no app" (quiet), excluir com **segurar para confirmar** e "Salvar" amarelo à direita.
  - **Ações destrutivas** sempre com `.g-btn--hold` ou desfazer no toast — nunca um clique só.
  - **Números do painel:** `.kpis` de `.g-stat` com `.g-num--lg`; tendências com `.g-delta`; filas (denúncias, chamados) com `.g-status`.

---

### E-mails transacionais (exceção documentada)

Clientes de e-mail (Gmail, Outlook, Apple Mail) **não suportam variáveis CSS, SVG nem fontes web confiáveis**. Por isso os e-mails são a única peça autorizada a usar cores escritas direto — sempre os valores dos tokens:

| Uso | Token | Valor |
|---|---|---|
| Faixa da marca, texto principal | `--g-ink-950` | `#0b0d10` |
| Botão / acento | `--g-limao-500` | `#fed141` (texto do botão `#0b0d10`) |
| Acento como texto, links | `--g-limao-800` | `#8a6200` |
| Fundo | `--g-mist-100` | `#eef0f6` |
| Texto secundário / terciário | `--g-text-2` / `--g-text-3` (Dia) | `#5c636d` / `#7d848e` |

Regras: layout em tabela, largura máx. 560px, raios 28px (cartão) e pílula (botão), uma única ação Limão, link de reserva abaixo do botão, aviso de segurança em faixa clara, assinatura "Plante. Cultive. Colha.". Todos os modelos saem de [`supabase/templates/_build.py`](supabase/templates/_build.py) — nunca edite o HTML gerado à mão.

## 7. Voz e conteúdo

- Português do Brasil, próximo e direto ("você"). Metáfora de cultivo com moderação: **Plante · Cultive · Colha**, Semente/Broto/Colheita para planos.
- Botões começam com verbo e têm até 3 palavras.
- Números sempre formatados em pt-BR (`48.290`, `R$ 29,90`).
- Nunca inventar depoimentos, clientes ou números reais: use marcadores claros até ter o dado.

---

## 8. Acessibilidade (não negociável)

- Contraste AA: texto `--g-text-2` ou mais forte para leitura; `--g-text-3` só para metadados ≥ 12px.
- Limão (e qualquer pastel) nunca como cor de texto no Dia → `--g-accent-text` / `--g-{tom}-text`.
- Foco visível em tudo (contorno do acento 2px, já no CSS base).
- Alvos de toque ≥ 40px no app, ≥ 44px no mobile.
- Ícone sozinho = `aria-label`. Abas = `role="tab"` + `aria-selected`. Menus = `role="menu"`.
- Movimento reduzido respeitado automaticamente.

---

## 9. Checklist antes de publicar qualquer tela

- [ ] Só tokens semânticos; nenhum hex solto, nenhuma fonte fora de Geist/Geist Mono.
- [ ] No máximo uma ação amarela por área; Menta/Lavanda/Céu só como tom de apoio, nunca como botão principal.
- [ ] Números em `.g-num`, peso 300, com unidade em `<small>`.
- [ ] Raios e espaços da escala; controles 32/40/52px.
- [ ] Hover, foco e clique com resposta; reduzir movimento testado.
- [ ] Nenhuma barra de rolagem padrão do navegador à mostra; páginas públicas longas com `data-g-smooth`.
- [ ] Funciona em Noite **e** Dia, em 375px e 768px sem rolagem horizontal, alvos de toque ≥ 44px e áreas seguras respeitadas.
- [ ] Gradientes Safra só em mídia/conteúdo.
- [ ] Componente novo? Adicionado ao `graao-ds.css`, à vitrine `design-system.html` e a este documento.

---

## 10. Evolução

Versão atual: **1.1 (Safra · Céu de verão)** — novembro de 2026.

- **1.1** (09/11/2026): paleta "Céu de verão". O acento passa do lima neon para o Limão (Limoncello `#FED141`). Entram Menta, Lavanda e Céu como apoio, com status re-harmonizados, gradientes Safra recoloridos (mesmas chaves) e `--g-safra-ceu`. Entram também a troca de tema com varredura diagonal (`G.theme`) e o botão principal com luz na borda.
- **1.0** (11/2026): versão inicial.
Para propor mudança: altere tokens/componentes no CSS, demonstre na vitrine e registre aqui (seção + data). Mudanças que quebram classes existentes exigem nova versão maior.
