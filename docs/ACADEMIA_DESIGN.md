# Academia — catálogo visual

12/11/2026. Referência estrutural: [Rise Club / Conteúdos](https://riseclub.tech/cursos), observada na aba do navegador interno. Implementação e imagens próprias do graao club.

## Auditoria e direção

Antes: toda a grade do curso era exibida em sequência, com resumos e metadados competindo, módulos com texto e números encostados e duas pistas de expansão. A página funcionava como documento longo; faltavam capas, navegação pelo acervo e separação entre escolher um módulo e ler suas aulas. Os estados de preparação estavam corretos e precisavam ser preservados.

- **Produto:** formação em IA para apoiar o trabalho criativo de adultos com TDAH.
- **Caráter:** tátil, organizado, acolhedor.
- **Mundo:** mesa de criação, cadernos, papéis, referências e entregas.
- **Momentos:** capas editoriais por módulo; leitura calma no detalhe da aula.
- **Assinatura:** número do módulo e um objeto ligado à etapa de trabalho, em uma mesma família visual.

O usuário já indicou a direção Rise Club e pediu a alteração. O catálogo usa sua organização por capas e grupos; não copia textos, imagens, cursos, instrutores ou a identidade da referência.

## O que mudou

1. **Espaçamento:** gutters e gaps na escala de 4px, intervalos de 32–40px entre grupos, metadados separados do título; grades com trilhos internos no celular.
2. **Cor:** chrome discreto nos tokens existentes. Pink aparece na seleção e no foco. A riqueza de cores fica nos objetos das capas.
3. **Ícones:** conjunto existente, com clock, book, search e setas. Sem emojis, novos estilos de traço ou indicadores decorativos.
4. **Texto:** cabeçalho curto, aviso único do estado do acervo; nenhum vídeo anunciado como disponível. Objetivos, descrições, materiais, pré-requisitos e projetos preservados.
5. **Tipografia:** Sora nos títulos e Inter na interface; pesos 400–600, hierarquia curta, sem texto em imagem.
6. **Layout:** catálogo em grupos Comece por aqui, Método ÓRBITA e Aplique e evolua. Clicar em uma capa abre o módulo; o detalhe usa uma lista de aulas expansível. Informações gerais ficam em “Sobre o curso”.
7. **Detalhes:** busca por módulo ou título de aula, busca sem acentos, filtros com estado pressionado, vazio com ação de limpar e retorno do foco ao card.
8. **Imagens:** uma composição original de oito cenas, servida como atlas WebP de cerca de 148KB. Oito regiões CSS correspondem às oito capas; não há download repetido nem títulos rasterizados.
9. **Movimento:** feedback curto de superfície/borda, sem loops, parallax ou entrada que esconda conteúdo; respeita reduced motion.

## Dados, links e implementação

O catálogo continua consultando exclusivamente `GRAAO_API.academyCatalog()`. Não foram alterados banco, RPC, autenticação, RLS, permissões ou status dos cursos. Não existe catálogo fictício ou fallback de demonstração na Academia.

`assets/js/academy.js` contém o novo renderizador e a navegação por hash. `pages-ia.js` delega a renderização da Academia a ele; as outras páginas mantêm seus renderizadores. `conteudos.html` carrega o novo script e `assets/css/academy.css`. Classes `.g-academy-*`, tokens `--g-*`.

Os IDs de curso, módulo e aula continuam resolvidos. Hashes antigos de grade, público e projetos abrem a região correspondente do catálogo; hashes de módulos e aulas abrem o detalhe. Aulas e materiais mantêm “Em preparação” e durações estimadas.

## Arte e prompt

Ferramenta: imagegen integrado. Saída: 1536×1024px, oito painéis 3:4 em quatro colunas por duas linhas, sem texto. PNG original e WebP em `assets/img/academy/`. O enquadramento e os títulos são controlados pelo HTML/CSS. A arte é conceitual gerada por IA, sem representar alunos ou resultados reais.

Prompt utilizado:

> Create a single exact 4-column by 2-row contact sheet for eight course cover artworks, total landscape aspect ratio 3:2, eight perfectly equal rectangular panels each portrait 3:4, no gaps, no margins, no dividers, no text, no numbers, no symbols or logos. Each panel an exquisite editorial still-life photograph of tangible creative studio tools on matte near-black charcoal background. Consistent camera, controlled studio spotlight, rich tactile paper textures with soft shadows. Objects fill upper 65% of each panel, bottom 35% very dark quiet space for HTML titles later. Pink #FF3DA5 is signature accent, small egg yellow #FFCC00, restrained mint, ice blue, lavender secondary colors. Row 1 left-to-right: (1) open cream sketchbook with single folded pink page and small yellow bookmark, signifying beginning; (2) two tactile folded paper conversation shapes in blush and mint beside a short pencil, signifying a thinking partner; (3) orderly stack of cream index cards with a pink binder clip and yellow sticky note, signifying clarity; (4) an elegant desk planning board with three tiny brass pins connected by a pink thread, signifying a plan. Row 2 left-to-right: (5) a pristine pink envelope holding a finished cream art print, signifying delivery; (6) compact unbranded silver camera with pink and lavender color swatches, signifying creative practice; (7) minimalist unbranded black keyboard and three small connected mint and pink wooden blocks, signifying automation; (8) closed cream personal notebook with pink cloth spine and pencil in balanced composition, signifying a personal system. Realistic materials, purposeful objects, sophisticated publisher art direction, visually bold legible silhouettes, no glossy blobs, no neon fog, no robots, no brains, no UI. Each scene completely contained in its own equal cell. No text anywhere.

## Verificação

- Catálogo carregado na sessão existente: oito módulos e 55 aulas previstas.
- Todos os oito módulos abertos, com 4/9/11/7/6/6/5/7 aulas, total 55.
- Filtro ÓRBITA: dois módulos; busca sem resultado e limpar busca verificados.
- Enter abre um módulo e expande uma aula; material previsto visível.
- Link direto para uma aula abre o módulo correto com a aula expandida.
- Retorno ao catálogo restaura o foco no card; transições decorativas mediram 0s com reduced motion. Console inspecionado sem erros.
- Detalhe de módulo com 11 aulas em oito larguras entre 320–1440px: sem overflow horizontal.
- Catálogo em Dia e Noite, 320/375/390/430/768/1024/1280/1440px: sem overflow horizontal da página. O overflow inicial do grid mobile foi corrigido mantendo somente os trilhos internos roláveis.
- Sintaxe de JS e verificação de referências locais aprovadas. Estados de erro/nova tentativa e catálogo vazio preservados no código; não se provocou falha no backend para este ajuste visual.
- Nenhuma alteração de progresso, aula concluída, publicação ou chamada de escrita foi necessária para validar a nova Academia.

## Crédito do processo

Revisão orientada pelo workflow [unslop, de Damir Sokolovsky / @heydamir](https://heydamir.design/unslop), licença CC BY 4.0. Crédito mantido para a adaptação do processo; componentes e arte desta página foram produzidos para o graao club.
