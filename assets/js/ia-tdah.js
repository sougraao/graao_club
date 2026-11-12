/* =====================================================================
   IA para TDAH — conteúdo de produto compartilhado (landing + área do aluno).
   Definição do método e das áreas profissionais. Catálogo real via Supabase.
   - ÓRBITA é o NOME DE TRABALHO do método (pendente de aprovação como marca).
   - A Academia consulta academy_catalog; não mantém cursos fixos neste arquivo.
   ===================================================================== */
(function () {
  "use strict";

  const ORBITA = [
    { k: "O", name: "Orientar", short: "Entenda o objetivo e organize o contexto do projeto.",
      goal: "Saber para quem é o trabalho, o que precisa ser entregue e o que significa “pronto”.",
      example: "Um briefing de três páginas para uma campanha vira um resumo de cinco linhas: cliente, objetivo, público, entregáveis e prazo.",
      ai: "Resumir o briefing, destacar requisitos e listar as perguntas que ainda faltam fazer ao cliente.",
      result: "Um resumo do projeto que você consegue reler em um minuto." },
    { k: "R", name: "Reduzir", short: "Diminua a complexidade e identifique as ações prioritárias.",
      goal: "Transformar um trabalho grande em poucas ações claras e escolher por onde começar.",
      example: "“Fazer a identidade visual” vira: reunir referências, testar três direções de tipografia, montar a primeira prancha.",
      ai: "Sugerir divisões em etapas menores e apontar o que pode esperar. A ordem é você quem decide.",
      result: "Uma lista curta, com a próxima ação marcada." },
    { k: "B", name: "Briefar", short: "Estruture informações e prepare instruções claras para o trabalho e para a IA.",
      goal: "Deixar contexto, restrições e critérios por escrito antes de produzir.",
      example: "Antes de pedir ideias de legenda, você descreve a marca, o tom de voz, o público e o que não pode aparecer.",
      ai: "Organizar o contexto em um prompt com papel, tarefa, formato e critérios de qualidade.",
      result: "Um briefing interno ou um prompt reutilizável." },
    { k: "I", name: "Iterar", short: "Experimente, desenvolva alternativas e refine soluções.",
      goal: "Explorar caminhos diferentes sem abrir mão da autoria das decisões.",
      example: "Três direções de roteiro para um vídeo curto, cada uma com um gancho diferente, para você escolher e lapidar.",
      ai: "Gerar variações, comparar alternativas e sugerir ajustes a partir do seu rascunho.",
      result: "Uma versão escolhida e refinada, com o porquê da escolha." },
    { k: "T", name: "Testar", short: "Revise resultados, verifique critérios e identifique melhorias.",
      goal: "Conferir a entrega contra o que foi pedido antes de enviar.",
      example: "Antes de mandar as peças, você confere formatos, textos, marca e os pontos que o cliente pediu na última revisão.",
      ai: "Montar um checklist a partir do briefing e apontar inconsistências de texto. A avaliação final é sua.",
      result: "Ajustes feitos e uma entrega aprovada por você." },
    { k: "A", name: "Apresentar", short: "Prepare a entrega e comunique o resultado do projeto.",
      goal: "Entregar com contexto: o que foi feito, por quê e quais são os próximos passos.",
      example: "Uma mensagem curta para o cliente com os arquivos, as decisões principais e como pedir ajustes.",
      ai: "Rascunhar a mensagem de entrega, organizar a apresentação e registrar aprendizados para o próximo projeto.",
      result: "Entrega enviada e um registro do que funcionou." },
  ];

  // O catálogo da Academia vem do Supabase (GRAAO_API.academyCatalog).

  /* Áreas profissionais do cadastro de interesse (mesmos valores aceitos pelo banco) */
  const AREAS = [
    ["design", "Design"], ["social-media", "Social media"], ["conteudo", "Criação de conteúdo"], ["edicao", "Edição"],
    ["audiovisual", "Audiovisual"], ["comunicacao", "Comunicação"], ["outra", "Outra área criativa"],
  ];

  const STATUS = { ativo: "Em andamento", pausado: "Pausado", entregue: "Entregue", arquivado: "Arquivado" };

  window.GRAAO_PRODUCT = {
    name: "IA para TDAH",
    tagline: "Sua mente cria. Seu sistema entrega.",
    ORBITA, AREAS, STATUS,
    orbita: (k) => ORBITA.find((m) => m.k === k) || null,
  };
})();
