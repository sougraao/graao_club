# Academia com catálogo real

Desde 12/11/2026, a Academia consulta `GRAAO_API.academyCatalog()` → RPC `public.academy_catalog()` no projeto `graao-club` (`mevtbwrfdttwulskaspb`). Não usa trilhas fixas, `data.js` ou `graao:db` como alternativa. Inclui carregamento, erro com nova tentativa e catálogo vazio.

A RPC pública é SECURITY INVOKER. A implementação privada verifica `auth.uid()` e perfil não bloqueado, retornando apenas metadados da grade marcada como `em-preparacao`; visitantes não têm EXECUTE. Títulos, objetivos, descrições, durações e materiais vêm das tabelas normalizadas, enquanto público, projetos e pré-requisitos vêm de `trails.curriculum`. Não retorna `video_key`, dados pessoais, preços ou cobrança. Não libera conclusão de aulas nem muda RLS ou status do curso.

Migrações: `20261112193000_course_ia_para_tdah.sql` (importação) e `20261112192223_academy_catalog.sql` (RPC). A primeira versão foi registrada antes da segunda, com timestamp nominal posterior; em instalação limpa, ambas devem estar aplicadas antes de chamar a função. A função privada é PL/pgSQL, com resolução das tabelas na chamada. Arquivos SQL correspondem às versões registradas no servidor.

Validação: chamada SQL com papel authenticated retorna 1 curso, 8 módulos e 55 aulas, sem chaves de vídeo. Visitantes sem permissão de execução; curso continua rascunho. Interface testada em Chromium com o payload real da RPC (sessão de navegador isolada da autenticação), 320/375/390/768/1440px e temas dark/light/high-contrast; teclado, erro/nova tentativa e vazio. Cliente verificado para chamada RPC, erro de rede, resposta inválida e lista vazia. A conta de teste antiga não autentica neste projeto; não foi criada nem alterada uma conta para o teste. Advisors não apontaram novos alertas após a migração.

Publicação limitada aos arquivos da Academia e às migrações. O redesign em andamento no workspace não faz parte desta correção publicada.

## Cache dos scripts

As páginas que carregam a API usam `assets/js/api.js?v=20261112-academy-1`. A tela estava versionada enquanto a API não estava; isso permitia combinar a tela atual com uma cópia em cache da API anterior à criação de `academyCatalog`. Verificação em Chromium: a cópia sem versão foi simulada como antiga e não foi solicitada pela página atual. O script real da API expôs o método e o renderizador real exibiu os 8 módulos e as 55 aulas usando o payload obtido do banco. Autenticação isolada nesse teste; não substitui uma validação de sessão real.
