# Glass Pop 2.0 — Iridescent Editorial Glass

Versão 2.0.0 · 12/11/2026 · Fonte central para a evolução visual do IA para TDAH.

[Experiências-piloto](../glass-pop.html) · [Biblioteca viva](../design-system.html) · [Contratos de componentes](GLASS_POP_COMPONENTS.md) · [Tokens JSON](../assets/tokens/glass-pop.json) · [CSS](../assets/css/glass-pop.css)

## 1. Audit e Moodboard Decode

Nenhum moodboard visual acompanhou o briefing. Esta interpretação é provisória e deriva do texto recebido; não representa análise de referências ausentes.

O projeto tem 18 páginas HTML preexistentes (19 com o piloto), CSS/JS sem build, biblioteca Safra 1.2, microinterações em `G`, ícones SVG, autenticação Supabase, projetos com RLS e cadastro de interesse via RPC. A identidade anterior usa Geist e verde-lima, não existe uma implementação anterior denominada Glass Pop no checkout. A evolução para pink/amarelo é uma mudança explícita de direção, não uma suposta continuação de tokens já existentes.

Preservados: rotas, conteúdo aprovado, métodos ÓRBITA, estado do produto, rótulos de demonstração, login, cadastro de interesse, permissões, dados, scripts, contratos `G.mount` e componentes existentes. Nenhuma migração de banco ou implantação foi executada. A alteração preexistente em `.claude/launch.json` pertence ao usuário.

Tradução visual: branco e pearl criam respiro; blush e mint sugerem proximidade; refrações conectam as cores sem multiplicar acentos; fotografia e matéria trazem escala humana; títulos Sora introduzem personalidade; uma seção escura pontual marca mudança de ritmo. A imagem conceitual da órbita representa a transformação de ideias em um processo, sem fazer promessas clínicas ou de resultado.

## 2. Creative Direction

**Luz, matéria e intenção.** Toda superfície precisa melhorar a compreensão. Pink identifica a ação principal; amarelo pontua uma decisão; a atmosfera pertence à mídia. O material não substitui a hierarquia. A tipografia organiza o tempo da leitura. O movimento responde ao gesto.

Regras: light-first; uma ação pink dominante por área; amarelo em detalhes ou CTA pontual; fundos atmosféricos em mídia, nunca em todas as áreas de trabalho; no máximo duas camadas de vidro sobrepostas; nenhuma animação contínua em formulários; ícones existentes com traço 1.7. Não usar a geração de imagem para fabricar clientes, depoimentos ou resultados reais.

## 3. Color System e tokens

Os 19 grupos de cores fornecidos têm escalas 50–950 em `glass-pop.json` e `glass-pop-tokens.css`. O passo 500 conserva o valor de origem, inclusive nas cores pastéis. Os passos são misturas sRGB com branco/preto; não são uniformes perceptualmente. Para dataviz ou interpolação perceptual, validar em OKLCH antes de ampliar o uso. A geração é reproduzível com `python tools/build_glass_pop.py`.

| Papel | Dia | Noite | Alto contraste |
|---|---|---|---|
| Fundo | Cloud #F9FAFC | Midnight #11131D | Branco |
| Superfície | Branco | #211E30 | Branco sólido |
| Texto | Ink #181820 | Pearl #FCF8FF | Preto |
| Secundário | #505260 | #D2CEDE | Preto |
| Metadados | #666879 | #AAA6BB | Preto |
| Ação | Pink #FF3DA5 / Ink | Pink / Ink | #A8005B / branco |
| Pink como texto | #A8005B | #FF8BCA | #8E004B |
| Destaque | Amarelo #FFCC00 / Ink | Idem | Contorno preto |

Pink puro com texto branco não é o par padrão: usar Ink sobre o pink. Texto corrido usa tokens semânticos; as escalas primitivas não devem aparecer diretamente nas páginas. Success, warning, danger e info têm equivalentes por tema no JSON; mensagens incluem ícone ou palavra de estado.

## 4. Gradientes

| Nome / token | Direção e stops | Intensidade / opacidade | Uso e movimento | Custo |
|---|---|---|---|---|
| Aurora Soft | 125°; blush 0, lavender 35, sky 70, mint 100% | Suave / 100% em mídia | Palco e composição; estático padrão | Baixo, CSS |
| Holographic | 120°; pink 0, peach 20, yellow 38, mint 58, sky 78, lilac 100% | Alta / 100%; reduzir na composição, não no texto | Capa pontual; opcional transform 640ms ao entrar | Baixo estático; evitar background-position por frame |
| Ice Glow | 135°; branco 0, ice 55, lavender 100% | Suave / 100% | Mockups e respiro; estático | Baixo |
| Pink Bloom | Elipse 80% 20%; blush até transparente 65% | Suave / alfa do stop | Luz localizada em superfície; estático | Baixo |
| Dark Prism | 140°; midnight 10, plum 55, azul profundo 100% | Média / 100% | Momento editorial escuro; estático | Baixo |

Todos têm versão estática implementada. Animação é opcional, decorativa e desativada em reduced motion. Não animar blur ou filtros de grandes áreas.

## 5. Glass Material System

| Material | Classe | Blur | Opacidade base | Contexto |
|---|---|---|---|---|
| Clear | `.g-glass--clear` | 8px | .68 | Fundo calmo e conhecido |
| Frosted | `.g-glass--frosted` | 20px | .82 | Overlay curto e navegação |
| Milk | `.g-glass--milk` | 32px | .94 | Leitura e formulários |
| Dark | `.g-glass--dark` | 24px | .92 | Mídia e contraste |
| Liquid | `.g-glass--liquid` | 40px | .82 | Interpretação visual CSS; não refração física |

Tokens por material no JSON: background, opacity, blur, saturation, border, highlight, shadow, radius, noise, elevation. CSS usa `--g-glass`, `--g-glass-blur`, `--g-glass-saturation`, `--g-glass-border`, `--g-glass-highlight`, `--g-glass-shadow`, `--g-glass-radius`, `--g-glass-noise`, `--g-glass-elevation` e `--g-glass-opacity` (metadado; alfa está no background). Noise é zero por padrão. Bordas 1px, raio 32px, saturação 135%, elevação 2. Clear/Liquid devem ter o contraste testado no fundo final. Milk e Dark têm pares de leitura definidos. Sem backdrop-filter, usar superfície sólida; alto contraste remove transparência.

## 6. Image Art Direction

| Família | Luz / cor | Enquadramento / textura | Profundidade / pós |
|---|---|---|---|
| Editorial Photography | Janela lateral, pele natural, branco neutro com acento pink pontual | Pessoas em prática criativa; 3:2 ou 4:5, espaço para título | Lente 35–50mm, grão mínimo, sem suavização artificial de pele |
| Soft 3D Objects | Softbox amplo, blush/lavanda | Objeto único, cantos macios, argila acetinada | Sombra de contato, render tátil, sem plástico excessivamente brilhante |
| Iridescent Art | Luz branca atravessando mint/ice/lilac | Faixas e superfícies translúcidas, sem ruído ornamental | Reflexos controlados, preservar highlights |
| Product Mockups | Luz funcional, UI fiel ao produto | 16:10 ou 3:2, perspectiva pequena | Texto da UI legível, nada de funções fictícias |
| Layered Photography | Temperatura e exposição consistentes | 2–3 fotos relacionadas, escalas diferentes | Sobreposição máxima de 15%, sombra leve, sem ocultar rostos |
| Atmospheric Concept Art | Difusa e contemplativa, pearl com acentos | Objeto ou escultura com muito espaço negativo | Névoa discreta, cores com saturação controlada |

Asset implementado: `assets/img/glass-pop/orbit.webp`, derivado do PNG gerado nesta sessão. Derivado 768px para telas menores. PNG fonte preservado. Não é fotografia documental; a legenda informa arte conceitual por IA. Não foi verificada exclusividade jurídica da imagem. Fotografia humana ainda requer acervo aprovado e liberação de uso; não se apresenta imagem gerada como participante real.

Contrato de mídia: `width`/`height` obrigatórios; `srcset` e `sizes` nas imagens protagonistas; `fetchpriority=high` somente na LCP; lazy abaixo da dobra. WebP com qualidade 82–85 no asset atual; preferir AVIF quando o pipeline justificar. Hero 3:2 ou 4:5; cards 4:3; objeto focal central ou `object-position` por asset; mobile revê o corte. Alt descreve função/assunto, decorativa recebe alt vazio. Legenda dá contexto e crédito. Registrar origem, direitos, autor e expiração de licença no inventário antes de publicar fotos de terceiros.

Os 16 padrões de mídia têm contratos no catálogo. Masonry, circular e before/after são especificações para futura implementação, sem afirmar controladores prontos. Image Gallery, overlay, palco e lightbox estão funcionais no piloto; stacks, carrossel e frames vêm do sistema existente.

## 7. Typography System

Sora 400–600 para títulos, Inter 400–700 para corpo e interface; Anton só em headlines editoriais excepcionais e nunca em texto corrido. Fallback system-ui. Fontes remotas com display=swap; quando offline, usar fallback. Auto-hospedagem com subset e licença registrada é etapa recomendada antes de publicação de tráfego alto.

JSON/CSS exportam Display XL/L/M (56–104 / 48–88 / 40–72), H1–H6 (40–72 / 34–48 / 24–32 / 18–24 / 16–20 / 14–16), Body XL/L/M/S (20–24 / 17–20 / 15–16 / 14), labels 13–14, buttons 14–15, eyebrows 12–13, captions 12–13, números 24–72, microcopy 12. Tamanhos em clamp; títulos line-height 1.04–1.15, corpo 1.5–1.65, tracking de títulos −.03 a −.065em. Números tabulares; microcopy nunca esconde informação essencial. Preservar zoom até 200% e reflow equivalente a 400%.

## 8. Layout System

12 colunas no desktop, 8 no tablet e 4 no mobile, gutter fluido 16–40px, container 1240px, espaços 4/8/12/16/20/24/32/40/48/64/80/96px. Breakpoints herdados: 520/860/1100/1360px. `--g-layout-columns` documenta a malha de página; composições usam spans, não 12 cards por linha. Container queries são opt-in: declarar `container-type:inline-size` no contêiner do componente antes de usar a regra compartilhada.

| Padrão | Estrutura | Mobile |
|---|---|---|
| Editorial Hero | copy 6 colunas + mídia 6 | Texto seguido de mídia |
| Image + Typography Split | imagem 7 + texto 5 | Ordem semântica permanece |
| Asymmetric Bento | 6/3/3 ou 8/4 | Uma coluna, sem ordem visual divergente |
| Overlapping Collage | 2–3 figuras | Sequência sem sobreposição |
| Full-Bleed Photography | figura ampla, legenda sólida | Corte preserva assunto |
| Floating Glass Overlay | figcaption dentro de figure | Legenda abaixo quando apertado |
| Dark Contrast Section | `.g-noite`, heading e ação | Uma coluna com respiro |
| Horizontal Visual Story | trilho nativo scroll-snap | Swipe + controles visíveis |
| Layered Product Showcase | frame com até dois planos | Mockup frontal |
| Minimal Content Section | coluna 60–72ch | Padding 16px |

## 9. Component Library

Organização: primitives (tokens, type, botão, input), composites (card, field, navigation item), patterns (galeria, formulário, lista e detalhe), templates (editorial, catálogo, workspace). Fichas completas e estado real de implementação em [GLASS_POP_COMPONENTS.md](GLASS_POP_COMPONENTS.md). A biblioteca herdada foi preservada; composições não ganham dependências React implicitamente.

## 10. React Bits Integration Map

Consulta: [site oficial](https://reactbits.dev/), 12/11/2026. Nenhum pacote React Bits foi instalado. O site atual não usa React. Antes de adotar um componente, abrir a documentação e o código oficial da versão selecionada, conferir props, licença e dependências e registrar commit. Não tratar os nomes abaixo como APIs verificadas ou dependências existentes.

| Candidatos | Aplicação | Decisão / alternativa atual |
|---|---|---|
| Split Text, Blur Text, Masked Heading, Scroll Reveal | Revelação de heading | Preferir heading intacto para leitores de tela e `.g-reveal` existente |
| Gradient Text | Expressão pontual | Evitar texto com contraste variável; texto sólido atual |
| Iridescence, Aurora, Soft Aurora, Color Bends | Arte e fundos | CSS estático atual; WebGL adiado por GPU/mobile |
| Glass Surface, Fluid Glass | Material especial | `.g-glass` com fallback; refração física adiada |
| Masonry, Circular Gallery | Acervo visual | Masonry por CSS após acervo; circular adiada por teclado e leitura |
| Carousel, Stack | História visual | Carrossel e stack existentes, sem autoplay |
| Scroll Expand, Scroll Stack | Narrativa editorial | Opcional; preservar fluxo e rolagem nativa |
| Tilted Card, Spotlight Card, Magic Bento | Cards em marketing | Sem tilt touch; não usar em workspace |
| Animated Content | Entrada de seção | IntersectionObserver existente, reduced motion |

Gate para adoção: orçamento de JS medido, sem dependência por efeito isolado, mobile de baixo desempenho, equivalente por teclado/touch, modo estático, reduced motion e desmontagem de observers/listeners. Props e versões ficam pendentes até uma integração real; não inventar snippets de API.

## 11. MicroKit Integration Map

Consulta: [MicroKit oficial](https://microkit.co/), 12/11/2026. O catálogo oferece fontes copiáveis React/CSS e instruções por componente. O projeto mantém adaptações vanilla anteriores, não importa código novo nem declara dependências inexistentes.

| Referência | Implementação equivalente / adaptação |
|---|---|
| Cursor Edge Glow Button | `.g-btn--accent`, handler `edge`; pink, foco visível |
| Next Dot Fill / Next Reveal | `.g-btn--swap` / `.g-btn--arrow`; texto sempre visível |
| Sliding Content Tabs | `.g-segment`; controles nativos e painel associado pelo consumidor |
| Sliding Underline Tabs | `.g-tabs`; teclado e associação tab/panel precisam ser conferidos por instância |
| Focus Field | `.g-field`; rótulo persistente |
| Bounce Checkbox | `.g-check`; quique desativado em reduced motion |
| Progress Ring Check | `.g-ring`; texto numérico acessível |
| Count Up Number | `[data-g-count]`; valor final sem animação |
| Blur Glide Menu | `.g-menu[data-g-glide]`; foco e semântica por instância |
| Expanding Icon Tabs | `.g-icon-tabs`; nome acessível mesmo fechado |
| Hold to Delete | `.g-btn--hold`; manter alternativa de confirmação/desfazer |

Referências avaliam comportamento, não autorizam remover acessibilidade. Revisar dependências e licença da fonte específica antes de copiar. Piloto usa feedback, campos e desfazer da biblioteca existente.

## 12. Motion System

Feedback 140ms; hover/press 200ms; troca de interface 320ms; reveal 640ms; editorial excepcional 800ms. Delay zero, stagger 60ms (máximo 5 elementos). Ease out cubic-bezier(.16,1,.3,1); spring .34,1.56,.64,1 para feedback pequeno. Entrada opacity + translateY até 16px; saída opacity em 140ms; press scale .98. Não animar dimensões grandes, backdrop blur ou efeitos que bloqueiem clique. Parallax e card stacking são opcionais, não implementados no piloto. Refração é estática.

`prefers-reduced-motion` e `G.motion('reduce')` removem animações decorativas. O piloto não depende de movimento para revelar conteúdo. Preferência pessoal é persistida pela API existente; alguns handlers herdados só consultam a preferência ao carregar, exigindo recarga para desligar integralmente.

## 13. UX Patterns e escrita

Editorial: entender proposta → explorar sistema → testar experiência. Catálogo: escolher categoria → ler resultado anunciado → abrir imagem → Escape retorna ao acionador. Produto: escrever ação → adicionar → concluir → remover com desfazer. Sem API do produto no piloto; chave separada `graao:glass-pop:tasks:v2`; storage bloqueado vira sessão com aviso.

Botões começam com verbo e descrevem o resultado. Erros indicam como corrigir; labels não dependem de placeholder. Empty state sugere uma ação concreta. Não simular loading quando não há espera. Recurso indisponível recebe “Em preparação”. Nenhum dado de demonstração vira prova social. Aplicação de IA para TDAH mantém a linguagem aprovada e não promete cura.

## 14. Page Templates

Os três pilotos estão em seções independentes de `glass-pop.html`: editorial (`#editorial`), catálogo (`#catalogo`) e produto (`#produto`). Cada um reutiliza classes do sistema; o piloto de produto cria um plano funcional local e explicita esse limite. A landing existente recebe a camada visual compartilhada e uma figura conceitual, sem reescrever o conteúdo. App e admin recebem tokens por compatibilidade, mantendo seu padrão de tema e rotas.

## 15. Implementation Architecture

Ordem de carregamento: `graao-ds.css` → `styles.css` quando existente → `glass-pop-tokens.css` → `glass-pop.css`. A camada 2.0 usa classes `.g-*` e tokens `--g-*`, sem alterar as assinaturas antigas. O comportamento central fica em `graao-ds.js`; conteúdo dinâmico chama `G.mount`. Controlador isolado do piloto: `glass-pop.js`. Exportador: `tools/build_glass_pop.py`. JSON é o inventário para ferramentas; semânticos CSS são a camada de compatibilidade e devem ser revisados junto ao JSON.

Não migrar para React/TypeScript apenas por estilo. Para uma migração futura, mapear contratos para props tipadas, tokens gerados e Storybook; realizar por rota após testes de autenticação/RLS. Storybook não foi instalado no projeto sem build. Nenhuma dependência de runtime nova. Google Fonts é uma dependência de rede preexistente com famílias atualizadas.

## 16. QA e critérios de aprovação

Checklist executado e limites ficam em [GLASS_POP_QA.md](GLASS_POP_QA.md). Meta WCAG 2.2 AA; não se declara certificação a partir de inspeção visual. Testar a composição final de cada vidro, não só a cor isolada.

- Validar 320,375,390,430,768,1024,1280,1440px; Dia, Noite, alto contraste; sem overflow horizontal.
- Teclado: nomes, ordem, foco visível, acionamento Enter/Space, Escape e retorno do foco em overlays.
- Reflow 400%, zoom 200%, textos longos e storage indisponível; toque ≥44px.
- Reduced motion do sistema e escolha pessoal; nenhum conteúdo depende de reveal.
- LCP ≤2.5s, CLS ≤.1 e INP ≤200ms como metas de campo p75. Medir em dispositivo/rede real; não são resultados obtidos.
- Verificar recursos e links locais, dimensões de imagens, scripts válidos, JSON parseável, ausência de novas chamadas ao backend.
- Login, cadastro e fluxos autenticados exigem regressão no ambiente de teste; não criar contas ou usar produção para validar CSS.

## 17. Governance e handoff

SemVer: breaking visual identity = 2.0.0; novo componente compatível = minor; correção de contraste = patch. Proposta inclui motivo, contrato, token, exemplo, comportamento mobile, acessibilidade e custo. Mudanças são revisadas por quem mantém produto/design antes de publicação. Registrar data, versão e decisão neste documento; não duplicar tokens avulsos em páginas.

Rollback: remover os links `glass-pop-tokens.css`/`glass-pop.css`, restaurar URLs de fontes pelo Git e retirar figuras/painel adicionados. Dados e integrações não dependem da camada visual. Não restaurar ou descartar arquivos do usuário para isso. Para uma reversão exata, usar o diff específico desta alteração.

## 18. Pendências explícitas

Moodboard visual ausente; acervo fotográfico humano/licenciado não fornecido; API/props e código de componentes externos ainda não integrados; Liquid Glass é aproximação CSS; contratos Masonry/Circular/Before-After e formulários multietapas requerem implementação dedicada; regressão autenticada, auditoria com leitor de tela, métricas de campo e revisão jurídica de mídia não concluídas. A documentação diferencia o catálogo herdado, exemplos funcionais e especificações futuras.
