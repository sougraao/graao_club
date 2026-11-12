# Glass Pop 2.0 — Registro de validação

Data: 12/11/2026. Ambiente: servidor estático local em 127.0.0.1:5173, navegador integrado do Codex. Não houve publicação.

## Executado

- HTTP da raiz retornou 200. Sem instalação ou build necessário.
- `python tools/check_glass_pop.py`: 19 páginas, referências locais existentes, IDs do piloto sem duplicidade, JSON parseável e JavaScript novo/alterado sem erro de sintaxe.
- 27 pares de cor semântica dos temas Dia, Noite e alto contraste passaram 4.5:1. Menor razão: Ink sobre pink, 5.43:1. Essa verificação não representa todas as composições translúcidas ou controles legados.
- Piloto `glass-pop.html`: 320,375,390,430,768,1024,1280,1440px nos três temas, sem overflow horizontal e sem imagem quebrada.
- Landing `index.html`: as oito larguras em Dia e Noite, sem overflow horizontal. Conteúdo, âncoras, formulários e scripts mantidos; nenhum cadastro real enviado.
- Vitrine `design-system.html`: correções de overflow em demonstrações, filtros e estatísticas. Reinspeção em 320,375,390,768,1440px sem overflow horizontal.
- Filtro Arte anunciou 1 item, com demais categorias ocultas. Lightbox abriu; Escape fechou.
- Plano: adicionar ação, concluir, remover, desfazer e recarregar com estado preservado. Exclusão tem 12 segundos para desfazer. Rótulo informa armazenamento local.
- Controle de reduzir animações marcou `data-g-motion=reduce`; alternância pessoal restaurada ao final do teste.
- Modal central atualizado para `dialog.showModal()` nativo, com cancelamento por Escape, fechamento explícito e restituição do foco. A revisão corrigiu a ausência anterior de isolamento nativo. Não equivale a auditoria de leitor de tela.
- Console consultado nas páginas piloto/landing/vitrine sem erros capturados na inspeção.
- Imagem WebP principal ~50KB, variante 768px ~16KB. Dimensões e srcset definidos. PNG fonte ~1.7MB não é carregado pelo HTML.

## Correções encontradas durante QA

Alturas HTML de imagem estavam prevalecendo sobre a proporção responsiva: adicionada altura CSS auto. Elementos com `hidden` recebiam display de componente: regra de ocultação explícita. Exemplos de estatísticas da vitrine agora empilham no mobile. Background de alto contraste substitui as superfícies decorativas dos exemplos. URLs de assets alterados recebem versão para evitar cache antigo durante revisão.

## Limites e revisão antes de produção

- Não foram executados login, permissões, RLS, envio de leads ou regressão autenticada completa.
- Não foram medidos LCP/CLS/INP em campo nem feito Lighthouse em dispositivo real. Os limites da documentação são metas.
- Zoom 200%, reflow equivalente a 400%, leitor de tela e emulação de reduced motion do sistema ainda exigem auditoria específica; controle pessoal foi testado.
- O suporte sem backdrop-filter tem fallback CSS; não foi validado em navegadores antigos.
- Liquid é aproximação CSS sem refração física. Galerias avançadas e integração de bibliotecas externas têm estado documentado nos contratos.
- Moodboard visual e fotografias humanas licenciadas não foram fornecidos.
- Alterações paralelas em arquivos do produto e `.claude/launch.json` foram preservadas; não fazem parte desta validação visual.
