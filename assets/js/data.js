/* IA para TDAH — conteúdo de demonstração.
   Tudo aqui é fictício: troque pelos dados reais (ou por chamadas à sua API). */
window.GRAAO_DATA = {
  trails: [
    {
      id: "comece-aqui", name: "Comece Aqui", plan: "semente", status: "publicado", safra: "lima", object: "obj-broto.svg",
      modules: [
        { id: "rotina", title: "Rotina de estudos", desc: "Monte um plano simples para aprender toda semana", lessons: ["Por que constância vence intensidade", "Montando sua semana", "Ferramentas para se organizar"] },
        { id: "mercado", title: "Mercado digital", desc: "Entenda o mercado e onde estão as oportunidades", lessons: ["Como o mercado digital funciona", "Profissões em alta", "Primeiros clientes"] },
        { id: "mapa", title: "Mapa das profissões", desc: "As principais carreiras digitais e como elas se conectam", lessons: ["Design", "Desenvolvimento", "Dados e IA", "Audiovisual"] },
      ],
    },
    {
      id: "web-start", name: "Web Start", plan: "broto", status: "publicado", safra: "mar", object: "obj-orbe.svg",
      modules: [
        { id: "intro", title: "Introdução", desc: "Do zero ao primeiro site publicado", lessons: ["Como a web funciona", "Seu ambiente de trabalho", "Primeira página"] },
        { id: "prospec", title: "Prospecção", desc: "Encontre, aborde e conquiste clientes", lessons: ["Onde estão os clientes", "Primeira abordagem", "Proposta que fecha"] },
        { id: "projeto", title: "Projeto completo", desc: "Planeje e construa um projeto do início ao fim", lessons: ["Briefing", "Estrutura", "Construção", "Revisão"] },
        { id: "deploy", title: "Deploy", desc: "Publique e mantenha seu projeto no ar", lessons: ["Domínio e hospedagem", "Publicando", "Monitorando"] },
        { id: "entrega", title: "Entrega", desc: "Apresente o projeto e encante o cliente", lessons: ["Apresentação", "Pós-entrega"] },
      ],
    },
    {
      id: "design", name: "Design", plan: "broto", status: "publicado", safra: "sol", object: "obj-cubo.svg",
      modules: [
        { id: "ux", title: "User Experience", desc: "Experiências intuitivas e eficientes", lessons: ["Pesquisa", "Jornadas", "Testes"] },
        { id: "ui", title: "User Interface", desc: "Princípios visuais para interfaces atraentes", lessons: ["Grid e espaço", "Tipografia", "Cor", "Componentes"] },
        { id: "figma", title: "Figma", desc: "Interfaces profissionais no Figma", lessons: ["Auto layout", "Componentes e variantes", "Protótipos"] },
        { id: "imagem", title: "Edição de imagem", desc: "Tratamento e composição com qualidade", lessons: ["Ajustes", "Recortes", "Composição"] },
        { id: "3d", title: "3D para web", desc: "Modelos 3D para projetos e visuais", lessons: [], soon: true },
      ],
    },
    {
      id: "ia", name: "Formação IA", plan: "colheita", status: "publicado", safra: "uva", object: "obj-grao.svg",
      modules: [
        { id: "oque", title: "O que é IA", desc: "Conceitos e tipos de inteligência artificial", lessons: ["Breve história", "Tipos de modelos", "Limites"] },
        { id: "modelos", title: "Anatomia dos modelos", desc: "Como a IA aprende e gera respostas", lessons: ["Treinamento", "Tokens", "Contexto"] },
        { id: "trabalho", title: "Trabalhando com IA", desc: "Prompts, contexto e memória na prática", lessons: ["Prompts claros", "Exemplos", "Iteração"] },
        { id: "gen", title: "Design generativo", desc: "Visuais que impressionam com IA", lessons: ["Direção de arte", "Refinamento"] },
        { id: "agentes", title: "Agentes de código", desc: "IA programando junto com você", lessons: ["Fluxo de trabalho", "Revisão", "Testes"] },
        { id: "projetos", title: "Projetos com IA", desc: "Do front-end ao servidor com ajuda da IA", lessons: ["Planejamento", "Construção", "Publicação"] },
      ],
    },
    {
      id: "nocode", name: "No-code", plan: "broto", status: "publicado", safra: "brasa", object: "obj-balao.svg",
      modules: [
        { id: "web", title: "Mundo web", desc: "Construa sites sem escrever código", lessons: ["Ferramentas", "Primeiro site"] },
        { id: "auto", title: "Automações", desc: "Conecte ferramentas e ganhe tempo", lessons: ["Gatilhos", "Fluxos"] },
        { id: "apps", title: "Apps sem código", desc: "Do protótipo ao app funcionando", lessons: [], soon: true },
      ],
    },
  ],

  categories: ["Carreira", "Desenvolvimento", "Design", "Inteligência Artificial", "Novidades", "Programação", "Tecnologia"],

  news: [
    { id: "n1", cat: "Design", hue: 300, date: "2026-11-07", read: 3, likes: 14, comments: 3, hot: 9,
      title: "Ferramentas de IA estão mudando o jeito de desenhar interfaces",
      excerpt: "Times de produto relatam ciclos de prototipação mais curtos e novas funções para quem desenha.",
      body: ["A chegada de assistentes de design dentro das ferramentas de prototipação está encurtando o caminho entre a ideia e a tela testável.", "Na prática, o papel de quem desenha se desloca: menos tempo empurrando pixels, mais tempo definindo critérios, revisando variações e garantindo consistência com o sistema de design.", "Para quem está começando, a recomendação é a mesma de sempre: fundamentos primeiro. Grid, tipografia e hierarquia continuam sendo o que separa uma interface boa de uma interface genérica."] },
    { id: "n2", cat: "Inteligência Artificial", hue: 180, date: "2026-11-06", read: 4, likes: 22, comments: 6, hot: 12,
      title: "Modelos menores ganham espaço em aplicações que rodam no próprio aparelho",
      excerpt: "Executar IA localmente reduz custo e latência e abre espaço para novos tipos de produto.",
      body: ["Modelos compactos, capazes de rodar no celular ou no navegador, estão saindo dos laboratórios e entrando em produtos.", "A vantagem é dupla: menos dependência de servidores e mais privacidade para quem usa.", "O desafio fica por conta de escolher bem a tarefa. Modelos pequenos brilham em funções específicas, não em conversas abertas."] },
    { id: "n3", cat: "Desenvolvimento", hue: 210, date: "2026-11-06", read: 2, likes: 9, comments: 1, hot: 5,
      title: "Frameworks web voltam a apostar na renderização no servidor",
      excerpt: "Menos JavaScript no navegador e páginas mais rápidas viram prioridade.",
      body: ["Depois de anos de aplicações pesadas no navegador, a tendência agora é mandar menos código para o cliente.", "Renderizar no servidor melhora o tempo até a primeira tela e ajuda a indexação.", "Para quem aprende, vale entender os dois modelos e quando cada um faz sentido."] },
    { id: "n4", cat: "Carreira", hue: 40, date: "2026-11-05", read: 5, likes: 31, comments: 11, hot: 15,
      title: "Portfólio com processo pesa mais que portfólio com só o resultado final",
      excerpt: "Recrutadores querem entender como você pensa, não apenas o que você entregou.",
      body: ["Mostrar o problema, as alternativas consideradas e o porquê das decisões faz o portfólio se destacar.", "Dois ou três projetos bem contados valem mais que dez telas soltas.", "Inclua números quando existirem e seja honesto sobre o que foi feito em equipe."] },
    { id: "n5", cat: "Tecnologia", hue: 20, date: "2026-11-05", read: 2, likes: 6, comments: 0, hot: 3,
      title: "Novos padrões de acessibilidade entram no radar das empresas",
      excerpt: "Requisitos legais e boas práticas aceleram a adoção de produtos mais inclusivos.",
      body: ["Acessibilidade deixa de ser detalhe e passa a ser requisito de projeto.", "Contraste, navegação por teclado e textos alternativos são o ponto de partida.", "Times que incorporam isso desde o começo gastam menos para corrigir depois."] },
    { id: "n6", cat: "Programação", hue: 230, date: "2026-11-04", read: 3, likes: 12, comments: 4, hot: 6,
      title: "Filas de mensagens: o que todo dev precisa saber antes de usar",
      excerpt: "Entrega duplicada, ordem e reprocessamento são as armadilhas mais comuns.",
      body: ["Colocar uma fila no meio do sistema resolve muitos problemas, mas cria outros.", "Idempotência é a palavra-chave: processar a mesma mensagem duas vezes não pode quebrar nada.", "Monitore filas mortas e tenha um plano para reprocessar mensagens com erro."] },
    { id: "n7", cat: "Novidades", hue: 262, date: "2026-11-03", read: 1, likes: 18, comments: 2, hot: 8,
      title: "IA para TDAH lança ranking por temporada",
      excerpt: "Pontue aprendendo, ajudando e mantendo a constância.",
      body: ["O novo ranking valoriza quem conclui aulas, ajuda outras pessoas e aparece todo dia.", "As temporadas são mensais e o histórico fica salvo no seu perfil.", "Confira a página de ranking para ver como ganhar pontos."] },
    { id: "n8", cat: "Inteligência Artificial", hue: 160, date: "2026-11-02", read: 4, likes: 10, comments: 2, hot: 4,
      title: "Como escrever prompts que funcionam no trabalho do dia a dia",
      excerpt: "Contexto, exemplo e critério de qualidade: a receita que mais dá certo.",
      body: ["Diga quem é o público, o que você quer e como vai avaliar o resultado.", "Um exemplo bom vale mais que três parágrafos de instrução.", "Itere: peça uma versão, critique e peça a próxima."] },
  ],

  users: [
    { id: "marina", name: "Marina Duarte", role: "Designer de produto", hue: 262, points: 96 },
    { id: "rafael", name: "Rafael Nunes", role: "Dev back-end", hue: 320, points: 54 },
    { id: "julia", name: "Júlia Campos", role: "Estudante de UX", hue: 200, points: 40 },
    { id: "thiago", name: "Thiago Prado", role: "Freelancer web", hue: 140, points: 31 },
    { id: "bianca", name: "Bianca Lopes", role: "Motion designer", hue: 20, points: 26 },
    { id: "caio", name: "Caio Martins", role: "Dev front-end", hue: 230, points: 22 },
    { id: "lia", name: "Lia Moreira", role: "Analista de dados", hue: 170, points: 19 },
    { id: "pedro", name: "Pedro Alves", role: "Editor de vídeo", hue: 40, points: 15 },
    { id: "nina", name: "Nina Rocha", role: "Product manager", hue: 290, points: 12 },
    { id: "otavio", name: "Otávio Lima", role: "Estudante", hue: 100, points: 9 },
    { id: "sofia", name: "Sofia Reis", role: "UI designer", hue: 350, points: 7 },
    { id: "gabriel", name: "Gabriel Souza", role: "Dev mobile", hue: 190, points: 4 },
  ],

  lastSeason: [
    { name: "Sofia Reis", points: 48 },
    { name: "Caio Martins", points: 46 },
    { name: "Lia Moreira", points: 42 },
  ],

  posts: [
    { id: "p1", user: "marina", time: "2 h", likes: 24, comments: 8, image: 262,
      text: "Terminei meu primeiro projeto de portfólio! Foram três semanas entre pesquisa, wireframes e o visual final. Feedbacks são muito bem-vindos 🌱" },
    { id: "p2", user: "rafael", time: "5 h", likes: 5, comments: 9,
      text: "Qual stack vocês recomendam para quem está começando em back-end em 2026? Estou entre aprender bem uma linguagem tipada ou ir direto para um framework completo." },
    { id: "p3", user: "bianca", time: "1 d", likes: 31, comments: 4, image: 20,
      text: "Testei animar a home do meu site só com CSS e ficou bem mais leve do que eu esperava. Depois mostro o passo a passo aqui." },
    { id: "p4", user: "julia", time: "2 d", likes: 12, comments: 3,
      text: "Dica rápida: antes de abrir o Figma, escreva em uma frase qual problema a tela resolve. Mudou meu jeito de trabalhar." },
  ],

  /* ---------- Ferramentas para os membros ---------- */
  toolCategories: ["IA", "Design", "Carreira", "Desenvolvimento"],
  tools: [
    { id: "prompt", name: "Gerador de prompts", desc: "Monte prompts claros com contexto, exemplo e critério de qualidade.", category: "IA", kind: "interno", app: "prompt", icon: "sparkles", safra: "uva", plan: "semente", status: "ativa", featured: true, uses: 1840 },
    { id: "preco", name: "Calculadora de projeto", desc: "Descubra quanto cobrar por um projeto com horas, custos e margem.", category: "Carreira", kind: "interno", app: "preco", icon: "tag", safra: "lima", plan: "broto", status: "ativa", featured: true, uses: 932 },
    { id: "paleta", name: "Gerador de paleta", desc: "Crie uma paleta harmônica a partir de uma cor base.", category: "Design", kind: "interno", app: "paleta", icon: "palette", safra: "sol", plan: "semente", status: "beta", featured: false, uses: 611 },
    { id: "regex", name: "Testador de regex", desc: "Teste expressões regulares direto no navegador.", category: "Desenvolvimento", kind: "link", url: "https://regex101.com", icon: "link", safra: "mar", plan: "colheita", status: "ativa", featured: false, uses: 204 },
  ],

  /* ---------- Operação (admin) ---------- */
  rules: [
    { id: "aula", label: "Concluir uma aula", points: 2 },
    { id: "ajuda", label: "Ajudar alguém com uma dúvida", points: 15 },
    { id: "destaque", label: "Post em destaque", points: 20 },
    { id: "presenca", label: "Presença do dia", points: 1 },
    { id: "seq7", label: "Sequência de 7 dias", points: 10 },
    { id: "seq30", label: "Sequência de 30 dias", points: 30 },
    { id: "seq100", label: "Sequência de 100 dias", points: 60 },
    { id: "seq365", label: "Sequência de 365 dias", points: 120 },
  ],
  season: { name: "Novembro", ends: "2026-11-30", prize: "", prizeVisible: false },
  reports: [
    { id: "r1", post: "p2", reason: "Spam ou divulgação", by: "julia", date: "2026-11-07", status: "pendente" },
    { id: "r2", post: "p3", reason: "Conteúdo fora do tema", by: "caio", date: "2026-11-06", status: "pendente" },
    { id: "r3", post: "p4", reason: "Informação incorreta", by: "pedro", date: "2026-11-03", status: "resolvida", resolution: "mantido" },
  ],
  tickets: [
    { id: "t1", user: "thiago", subject: "Não recebi o certificado", category: "Certificados", status: "aberto", date: "2026-11-07", messages: [{ from: "user", text: "Concluí a trilha Comece Aqui mas o certificado não apareceu." }] },
    { id: "t2", user: "nina", subject: "Dúvida sobre cobrança anual", category: "Pagamentos", status: "em andamento", date: "2026-11-06", messages: [{ from: "user", text: "O plano anual renova automaticamente?" }, { from: "team", text: "Oi, Nina! Renova sim, e avisamos 7 dias antes." }] },
    { id: "t3", user: "otavio", subject: "Vídeo não carrega no celular", category: "Problema técnico", status: "resolvido", date: "2026-11-02", messages: [{ from: "user", text: "A aula 2 fica carregando." }, { from: "team", text: "Corrigido, obrigado por avisar!" }] },
  ],
  ideas: [
    { id: "i1", user: "sofia", text: "Trilha de motion design para web.", votes: 34, status: "em análise" },
    { id: "i2", user: "gabriel", text: "Modo offline no aplicativo.", votes: 21, status: "planejada" },
    { id: "i3", user: "lia", text: "Desafios semanais com ranking próprio.", votes: 18, status: "nova" },
  ],
  // Avisos reais da equipe (admin › Avisos). Vazio por padrão: nada de aviso de exemplo para os membros.
  announcements: [],
  plans: [
    { id: "semente", name: "Semente", monthly: 0, yearly: 0, active: true },
    { id: "broto", name: "Broto", monthly: 29.9, yearly: 249.9, active: true },
    { id: "colheita", name: "Colheita", monthly: 99.9, yearly: 875.8, active: true },
  ],
  coupons: [
    { id: "c1", code: "BROTO20", discount: 20, plan: "broto", uses: 48, limit: 200, active: true, ends: "2026-12-31" },
    { id: "c2", code: "COLHEITA-BF", discount: 35, plan: "colheita", uses: 12, limit: 100, active: false, ends: "2026-11-30" },
  ],
  settings: { name: "IA para TDAH", supportEmail: "contato@graao.com", maintenance: false, signups: true },
  /* E-mails enviados aos membros (editados em admin.html#/emails).
     Marcadores: {nome} {, nome} {email} {novo_email} {link} {codigo} {site} — viram variáveis do Supabase ao exportar.
     **texto** = negrito. Mesmos textos de supabase/templates/_build.py. */
  emails: [
    { id: "confirmacao", slot: "Confirm signup", name: "Confirmação de cadastro", when: "Logo depois que a pessoa cria a conta",
      subject: "Confirme seu e-mail · IA para TDAH", preheader: "Falta um passo para começar.", eyebrow: "Boas-vindas",
      title: "Confirme seu e-mail{, nome}", body: "Você está a um toque de entrar no IA para TDAH. Confirme este endereço para ativar sua conta e começar pela trilha **Comece Aqui**.",
      cta: "Confirmar meu e-mail", note: "Se você não criou uma conta no IA para TDAH, ignore esta mensagem — nada vai acontecer." },
    { id: "convite", slot: "Invite user", name: "Convite", when: "Quando a equipe convida alguém pelo painel",
      subject: "Você foi convidado para o IA para TDAH", preheader: "Um lugar para aprender, compartilhar e crescer com quem vive tecnologia.", eyebrow: "Convite",
      title: "Seu lugar está reservado", body: "Alguém da equipe do IA para TDAH convidou você para entrar. Aceite o convite para criar sua senha e acessar a plataforma.",
      cta: "Aceitar convite", note: "Não esperava este convite? Pode ignorar este e-mail com tranquilidade." },
    { id: "link-magico", slot: "Magic Link", name: "Link de acesso", when: "Quando a pessoa pede para entrar sem senha",
      subject: "Seu link de acesso ao IA para TDAH", preheader: "Entre sem senha com um toque.", eyebrow: "Acesso rápido",
      title: "Entre no IA para TDAH", body: "Use o botão abaixo para entrar na sua conta sem digitar senha. O link funciona uma única vez.",
      cta: "Entrar agora", note: "Se não foi você que pediu este acesso, ignore este e-mail. Sua conta continua protegida." },
    { id: "troca-de-email", slot: "Change Email Address", name: "Troca de e-mail", when: "Quando a pessoa muda o e-mail da conta",
      subject: "Confirme seu novo e-mail · IA para TDAH", preheader: "Confirme a troca do e-mail da sua conta.", eyebrow: "Segurança da conta",
      title: "Confirme seu novo e-mail", body: "Recebemos um pedido para trocar o e-mail da sua conta de **{email}** para **{novo_email}**. Confirme para concluir a troca.",
      cta: "Confirmar novo e-mail", note: "Se você não pediu essa troca, não confirme e fale com a gente em contato@graao.com." },
    { id: "redefinir-senha", slot: "Reset Password", name: "Redefinir senha", when: "Quando a pessoa usa “Esqueci a senha”",
      subject: "Redefinir sua senha do IA para TDAH", preheader: "Crie uma nova senha para voltar aos seus projetos.", eyebrow: "Segurança da conta",
      title: "Vamos criar uma nova senha", body: "Recebemos um pedido para redefinir a senha da sua conta. Toque no botão abaixo e escolha uma nova senha.",
      cta: "Criar nova senha", note: "Se você não pediu para trocar a senha, ignore este e-mail — sua senha atual continua valendo." },
    { id: "reautenticacao", slot: "Reauthentication", name: "Código de verificação", when: "Antes de uma ação sensível na conta", code: true,
      subject: "Seu código de verificação · IA para TDAH", preheader: "Use este código para confirmar que é você.", eyebrow: "Verificação",
      title: "Confirme que é você", body: "Use o código abaixo para concluir a ação sensível que você começou no IA para TDAH.",
      cta: "", note: "Nunca compartilhe este código. A equipe do IA para TDAH jamais vai pedi-lo." },
  ],
  team: { julia: "EDITOR", rafael: "STAFF" },
};

/* =====================================================================
   Camada de dados de demonstração.
   As alterações feitas no painel admin ficam salvas neste navegador (localStorage "graao:db")
   e sobrepõem os padrões acima — o app inteiro lê daqui. Troque por uma API real em produção.
   ===================================================================== */
(function () {
  const KEY = "graao:db";
  const DEFAULTS = JSON.parse(JSON.stringify(window.GRAAO_DATA));
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { saved = {}; }
  Object.keys(saved).forEach((k) => { if (k in window.GRAAO_DATA) window.GRAAO_DATA[k] = saved[k]; });
  window.GRAAO_DB = {
    save(...keys) {
      keys.forEach((k) => (saved[k] = window.GRAAO_DATA[k]));
      try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) { /* storage indisponível */ }
    },
    reset() { try { localStorage.removeItem(KEY); } catch (e) { /* */ } },
    defaults: DEFAULTS,
    uid: (p = "x") => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
  };
})();
