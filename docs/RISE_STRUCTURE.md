# Estrutura da área de membros — referência Rise Club

12/11/2026 · Escopo: adaptar a composição e a navegação da área do aluno à estrutura observada em [riseclub.tech/inicio](https://riseclub.tech/inicio), com a identidade Glass Pop e as funções do graao club.

## Evidência e método

A aba autenticada no navegador interno estava em Comunidade. A inspeção visual/DOM observou o shell compartilhado e depois navegou até Início; a primeira captura mostrou skeletons e a leitura seguinte confirmou o conteúdo carregado. Nenhum post, reação ou informação de conta foi alterado. O painel de tarefas que estava aberto foi fechado para permitir a leitura da página.

O REA exige um endpoint CDP loopback. A interface do navegador integrado fornece CDP por ferramenta, sem um endpoint direto para o REA. Por isso, o inventário de scripts foi obtido na aba via Debugger; dois chunks públicos carregados que continham os componentes de início/onboarding foram exportados para uma pasta temporária, fora do repositório, e analisados com o MCP REA.

- Operação: `analyze_javascript_application`, format directory, detail summary.
- Evidence principal: `ev_752167b261c7560c9cb4cdfe0e6e86a2a02aba76f76c912c51b8c840615a078c`.
- Projeção resumida: `ev_284edf4ff06990d727b70931049bef11f321359a020495a29091ea1462eb6496`.
- Digest do inventário temporário: `c8ffd67b1c16bd7fdc420d67bd8a2cd2b2fd9612091064194c07b882692d0c28`.
- Fontes selecionadas: `18fnu5t72cfks.js` (36.361 caracteres) e `0y00y8ozobxbf.js` (117.192 caracteres), de 15 scripts de origem inventariados naquela captura.
- REA: 2 arquivos JavaScript analisados, 26.473 nós AST visitados, 24 findings, zero parse failures.
- Limites: cobertura de aplicação parcial, cobertura semântica desconhecida, 5.543 unknowns semânticos. O parser estático não executou os chunks; os comportamentos visuais abaixo vêm da observação da aba, não de suposta equivalência de código.

Código, fotos, textos de membros, logotipo, artigos e ranking da referência não foram incorporados ao projeto. A implementação local é própria e usa os componentes e dados do graao club.

## O que foi observado

| Região | Estrutura observada | Aplicação no graao club |
|---|---|---|
| Shell | Sidebar esquerda persistente, botão recolher, grupos Principal/Informação/Conta | Sidebar de 256px, grupos equivalentes, navegação existente preservada |
| Cabeçalho | 64px, marca/breadcrumb à esquerda, notificações e usuário à direita | Breadcrumb graao club / página, tema, avisos, perfil |
| Primeiro acesso | Card amplo com cinco etapas, estado de conclusão, progresso e atalhos | Cinco passos ligados aos projetos e entregas reais |
| Saudação | Texto curto seguido de título pessoal | Saudação com nome quando disponível e orientação de próxima ação |
| Próxima ação | Card dominante e CTA explícito | Microtarefa do projeto principal, concluir/definir ação existentes |
| Indicadores | Três células em uma faixa | Projetos ativos, ações concluídas e entregas; sem ranking fictício |
| Conteúdo | Conteúdos recentes abaixo da próxima ação | Consulta existente do catálogo da Academia, com estado de preparação |
| Apoio lateral | Ranking e atividade/notícias/comunidade | Atalhos de trabalho, orientação pessoal e áreas pausadas identificadas |
| Rodapé | Links de ajuda e documentos | Ajuda, termos, privacidade e design system existentes |
| Atalho flutuante | Contador de primeiros passos | Contador e retorno ao checklist com foco no título |

Medição visual em viewport 1440px: sidebar 256px, cabeçalho 64px; área com padding 32px, coluna lateral 360px e gutter 32px. Esses valores orientam a composição local. Cores, tipografia e conteúdo continuam nos tokens Glass Pop.

## Decisões de produto

- Meu Dia, Projetos, Academia e Copiloto continuam como funções centrais. Reorganizar o menu não reativa Comunidade, Ranking ou Notícias: as telas existentes mantêm seu aviso de pausa.
- Não foi criado um plano comercial ou uma assinatura porque não há oferta aprovada para copiar.
- Os cinco passos usam o estado de projetos/ações/entregas; não se concede conclusão por clique de navegação.
- O resumo pessoal usa `GRAAO_PROJECTS.list/stats/steps`, já existentes. O catálogo chama `GRAAO_API.academyCatalog`, já existente. Nenhuma tabela, função SQL, permissão ou política RLS foi alterada.
- A tela com projeto mantém criação/conclusão de microtarefa, seleção do principal, nota de retomada e histórico. Os cards foram reorganizados sem substituir esses handlers.
- A coluna lateral acompanha a leitura em telas largas e passa para baixo no tablet. Mobile usa gaveta com Escape, foco de retorno e conteúdo fora da gaveta inerte enquanto ela está aberta. O menu recolhido tem nomes acessíveis.

## Arquivos e contratos

- `assets/css/club-layout.css`: shell, onboarding, coluna de apoio, indicadores e responsividade. Classes `.g-club-*` e tokens `--g-*`.
- `assets/js/app.js`: grupos de navegação, breadcrumb, nomes acessíveis e comportamento da gaveta.
- `assets/js/pages-ia.js`: composição do Meu Dia e consulta do resumo; implementações das outras telas foram preservadas.
- `inicio.html`: entrada real, autenticação mantida.
- `inicio-preview.html` + `assets/js/club-preview.js`: demonstração explícita, fixture exclusivamente em memória, sem env/API/Supabase no HTML. Não concede acesso ao app autenticado. Recarregar restaura o exemplo.
- Páginas da área do aluno carregam o novo stylesheet depois de Glass Pop; admin permanece na sua composição anterior.

## Validação

- Prévia isolada em 320,375,390,430,768,1024,1280,1440px em Dia e Noite: nenhum overflow horizontal.
- Recolher/expandir muda o estado e `aria-expanded` do botão. Concluir ação atualiza o contador de ações de 1 para 2 e mantém o resumo após a nova renderização.
- Definir nova microtarefa após concluir a anterior atualizou o título da próxima ação; salvar nota mostrou confirmação de horário. Testes executados na fixture em memória.
- Gaveta mobile: abrir/fechar/Escape verificados; após fechar, sidebar fora da tela e `inert`, conteúdo principal ativo e foco devolvido a “Abrir menu”.
- Consulta do catálogo indisponível na prévia mostra mensagem explícita, sem aulas fictícias.
- `node --check` nos scripts alterados e verificador de referências/tokens do projeto.
- Conta de teste configurada em `.env.test` foi recusada pelo servidor com mensagem de credenciais incorretas. Nenhuma senha foi alterada e nenhuma conta foi criada. A verificação autenticada completa continua pendente; o layout foi testado com fixture local identificada.
- O relatório não declara equivalência integral com o Rise Club, nem reconstrução de seu backend ou de suas permissões.
