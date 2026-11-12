// Conteúdo da recriação.
// Textos de marketing e estrutura seguem o site observado; depoimentos, usuários,
// posts, notícias e vídeos são FICTÍCIOS (placeholders) — substitua pelos seus.

export const BRAND = { first: "graao", second: "club", domain: "graao.club", full: "graao club" };

// Gera uma "arte" em gradiente a partir de um matiz (substitui thumbnails reais)
export const art = (h, v = 0) =>
  `radial-gradient(120% 90% at ${20 + v * 13 % 60}% ${10 + v * 7 % 40}%, hsl(${h} 95% 86% / .95), transparent 55%),` +
  `radial-gradient(90% 80% at 85% 90%, hsl(${(h + 30) % 360} 90% 74% / .9), transparent 60%),` +
  `linear-gradient(160deg, hsl(${(h + 20) % 360} 75% 72%), hsl(${(h + 340) % 360} 60% 58%))`;

export const AREAS = ["IA no dia a dia", "Foco e rotina", "Organização", "Criatividade", "E muito mais"];

export const PLANS = [
  {
    id: "free", name: "Semente", tag: "Experimentar", icon: "sprout", free: true,
    price: { monthly: { big: "0", pre: "R$", post: "/mês" }, yearly: { big: "0", pre: "R$", post: "/mês" } },
    note: { monthly: "Grátis. Módulo 01 · 4 aulas · 25 min.", yearly: "Grátis. Módulo 01 · 4 aulas · 25 min." },
    desc: "Descubra como a Inteligência Artificial pode ajudar você a dar o primeiro passo em uma tarefa que está adiando.",
    features: ["Módulo 01 — Comece aqui", "Guia de boas-vindas e mapa da formação", "Mapa das dificuldades de execução", "Prompt “Me ajude a começar”"],
    cta: "Começar grátis", href: "/cadastro",
  },
  {
    id: "start", name: "Broto", tag: "Organizar", icon: "zap",
    // [[definir preço]] — valores ainda não definidos pela equipe
    price: { yearly: { pre: "R$", big: "—", post: "/mês" }, monthly: { pre: "R$", big: "—", post: "/mês" } },
    note: { yearly: "Preço a definir. Módulos 01 a 04 · 31 aulas · ~4h38.", monthly: "Preço a definir. Módulos 01 a 04 · 31 aulas · ~4h38." },
    desc: "Aprenda a transformar suas ideias e tarefas em planos claros, pequenos passos e ações possíveis com ajuda da IA.",
    features: ["Módulos 01 a 04", "Biblioteca inicial de prompts para TDAH", "Template “Meu Copiloto de IA”", "Planejador diário e semanal", "Mapa e workbook do Método ÓRBITA"],
    cta: "Escolher Broto", href: "/planos?plano=start",
  },
  {
    id: "pro", name: "Colheita", tag: "Executar", icon: "crown", featured: true,
    price: { yearly: { pre: "R$", big: "—", post: "/mês" }, monthly: { pre: "R$", big: "—", post: "/mês" } },
    note: { yearly: "Preço a definir. Formação completa · 55 aulas · 8h30.", monthly: "Preço a definir. Formação completa · 55 aulas · 8h30." },
    desc: "Crie seu próprio sistema de IA para organizar, desenvolver e concluir projetos reais, respeitando seu jeito de funcionar.",
    features: ["Os 8 módulos e os 3 projetos práticos", "Tudo do Broto", "Workbook completo do Método ÓRBITA", "Assistentes especializados e guia de automações", "Plano de continuidade de 30 dias"],
    cta: "Escolher Colheita", href: "/planos?plano=pro",
  },
];

export const FAQ = [
  ["Preciso saber programar ou já usar IA?", "Não. O curso começa do zero: não é necessário saber programar nem ter experiência anterior com IA. Basta um computador ou smartphone, e dá para começar com versões gratuitas das ferramentas."],
  ["Preciso ter diagnóstico de TDAH?", "Não é necessário ter um diagnóstico formal para aprender as técnicas de uso de IA. O curso não realiza diagnóstico, não constitui tratamento e não substitui acompanhamento profissional de saúde."],
  ["Como é a formação?", "8 módulos, 55 aulas curtas e 3 projetos práticos, com cerca de 8h30 no total. Cada aula tem um objetivo principal, uma demonstração e uma ação prática."],
  ["O que é o Método ÓRBITA?", "Uma metodologia de seis etapas para levar uma ideia até a entrega: Orientar, Reduzir, Briefar, Iterar, Testar e Apresentar."],
  ["E se eu perder o ritmo?", "O progresso fica salvo e o curso foi pensado para retomar sem começar do zero. Existem aulas específicas sobre como recomeçar."],
  ["Como funcionam os planos?", "O Semente é grátis e libera o Módulo 01. O Broto libera os módulos 01 a 04 e o Colheita, a formação completa. Os preços ainda serão definidos."],
];

// Depoimentos de EXEMPLO — troque por relatos reais e autorizados.
export const TESTIMONIALS = [
  { name: "Aluna exemplo", handle: "@exemplo.um", hue: 265, short: "As aulas vão do básico ao avançado e o suporte responde rápido. Me senti acolhida desde o primeiro dia.", full: "Decidi mudar de carreira e não sabia por onde começar. As aulas vão do básico ao avançado e o suporte responde rápido. Me senti acolhida desde o primeiro dia e hoje já entrego meus primeiros projetos." },
  { name: "Aluno exemplo", handle: "@exemplo.dois", hue: 200, short: "Nunca tinha tido contato com design para web e as aulas são muito didáticas.", full: "Nunca tinha tido contato com design para web e as aulas são muito didáticas. A comunidade está sempre trazendo conteúdo novo e trocar ideia com quem está no mesmo caminho faz muita diferença." },
  { name: "Pessoa exemplo", handle: "@exemplo.tres", hue: 330, short: "O grupo é sensacional: todo mundo se ajuda e cria networking de verdade.", full: "Ainda não terminei todos os módulos, mas já estou aplicando o que aprendi. O grupo é sensacional: todo mundo se ajuda e cria networking de verdade. Fechei meu primeiro cliente poucos meses depois de começar." },
  { name: "Estudante exemplo", handle: "@exemplo.quatro", hue: 150, short: "Os desafios práticos me deram confiança para montar meu portfólio.", full: "Os desafios práticos me deram confiança para montar meu portfólio. Gosto de poder estudar no celular no caminho do trabalho e continuar no computador em casa." },
  { name: "Dev exemplo", handle: "@exemplo.cinco", hue: 30, short: "As notícias me mantêm atualizado sem precisar caçar em dez sites diferentes.", full: "As notícias me mantêm atualizado sem precisar caçar em dez sites diferentes, e as trilhas de IA foram direto ao ponto para o que eu uso no dia a dia." },
];

// ------------------------------------------------------------------------
// Conteúdos (trilhas → módulos → aulas)
// ------------------------------------------------------------------------
const L = (titles) => titles.map((t, i) => ({ id: `a${i + 1}`, title: t, min: 6 + ((t.length * 7) % 19) }));

import { COURSE_META, COURSE_MODULES } from "./course-ia-para-tdah.js";
export { COURSE_META, COURSE_MODULES };

export const COURSE = { ...COURSE_META, tagline: COURSE_META.headline, desc: COURSE_META.subheadline, hue: 158 };

// Planos → nível de acesso (tier dos módulos): Semente 0 · Broto 1 · Colheita 2
export const PLAN_TIER = { free: 0, start: 1, pro: 2 };

export const TRACKS = [{ id: COURSE_META.id, title: COURSE_META.title, modules: COURSE_MODULES }];

export const allModules = () => TRACKS.flatMap((t) => t.modules.map((m) => ({ ...m, track: t })));
export const findModule = (id) => allModules().find((m) => m.id === id);

// Vídeos do "canal" — títulos fictícios
export const CHANNEL = []; // vídeos do canal (vazio até existir)

// ------------------------------------------------------------------------
// Notícias — FICTÍCIAS
// ------------------------------------------------------------------------
export const NEWS_CATS = ["Carreira", "Desenvolvimento", "Design", "Inteligência Artificial", "Novidades", "Programação", "Tecnologia"];
const para = (...p) => p;
const now = Date.now();
const H = 3600e3;
export const NEWS = [
  { slug: "geradores-de-video-com-ia-comparativo", cat: "Inteligência Artificial", title: "Geradores de vídeo com IA: o que cada um entrega e quanto custa", ago: 0.5 * H, read: 6, hue: 270, hot: 14,
    body: para("O mercado de geração de vídeo por IA amadureceu rápido. Ferramentas que há um ano produziam clipes de poucos segundos agora entregam cenas mais longas, com controle de câmera e consistência de personagens.", "Para quem trabalha com conteúdo, a escolha passa por três critérios: qualidade de movimento, controle criativo e custo por minuto gerado. Planos de entrada costumam limitar resolução e marca d'água.", "A recomendação para quem está começando é testar com um roteiro curto, comparar o resultado em mais de uma ferramenta e só então investir em um plano pago.") },
  { slug: "design-systems-com-tokens", cat: "Design", title: "Design systems baseados em tokens viram padrão em times pequenos", ago: 2 * H, read: 3, hue: 320, hot: 6,
    body: para("Tokens de design — variáveis para cor, espaço e tipografia — deixaram de ser coisa de grandes empresas.", "Com ferramentas que exportam tokens direto para CSS, times de duas ou três pessoas conseguem manter consistência entre telas sem esforço extra.", "O ganho mais citado é a facilidade de oferecer tema claro e escuro sem duplicar componentes.") },
  { slug: "vagas-junior-portfolio", cat: "Carreira", title: "Vagas júnior pedem cada vez mais portfólio do que diploma", ago: 5 * H, read: 4, hue: 150, hot: 9,
    body: para("Recrutadores relatam que um portfólio com projetos reais pesa mais do que certificados isolados na hora de chamar alguém para entrevista.", "Projetos que mostram processo — problema, decisões e resultado — se destacam frente a vitrines só com imagens finais.", "Contribuições em comunidades e projetos open source também contam pontos.") },
  { slug: "css-anchor-positioning", cat: "Desenvolvimento", title: "Posicionamento por âncora no CSS chega aos principais navegadores", ago: 9 * H, read: 2, hue: 210, hot: 4,
    body: para("A nova especificação permite posicionar tooltips e menus em relação a outro elemento sem JavaScript.", "Isso simplifica componentes que antes dependiam de bibliotecas de posicionamento.", "Vale testar com fallback para navegadores mais antigos.") },
  { slug: "agentes-de-ia-no-dia-a-dia", cat: "Inteligência Artificial", title: "Agentes de IA saem do laboratório e entram na rotina de desenvolvimento", ago: 20 * H, read: 5, hue: 250, hot: 12,
    body: para("Ferramentas que executam tarefas em várias etapas — ler código, propor mudanças, rodar testes — já fazem parte do fluxo de muitos times.", "O papel de quem desenvolve muda: menos digitação, mais revisão e definição clara do que precisa ser feito.", "Boas práticas incluem tarefas pequenas, testes automatizados e revisão humana antes de publicar.") },
  { slug: "nova-api-de-transicoes", cat: "Programação", title: "API de transições de visualização simplifica animações entre páginas", ago: 23 * H, read: 3, hue: 190, hot: 5,
    body: para("Com poucas linhas, é possível animar a troca entre páginas de uma aplicação, inclusive em sites de múltiplas páginas.", "A técnica melhora a percepção de fluidez sem frameworks pesados.") },
  { slug: "notebooks-com-npu", cat: "Tecnologia", title: "Notebooks com NPU dedicada prometem IA local mais rápida", ago: 26 * H, read: 2, hue: 30, hot: 3,
    body: para("Fabricantes passaram a destacar unidades de processamento neural como diferencial.", "Na prática, o ganho aparece em tarefas como transcrição, remoção de fundo e modelos pequenos rodando offline.") },
  { slug: "tipografia-variavel", cat: "Design", title: "Fontes variáveis ganham espaço em identidades visuais digitais", ago: 30 * H, read: 2, hue: 340, hot: 2,
    body: para("Uma única fonte variável pode substituir vários arquivos de peso e largura, reduzindo o carregamento.", "Marcas exploram eixos de variação para criar animações tipográficas sutis.") },
  { slug: "novidades-da-plataforma", cat: "Novidades", title: "Novidades da plataforma: ranking por temporada e novos certificados", ago: 34 * H, read: 1, hue: 258, hot: 7,
    body: para("O ranking agora é dividido em temporadas, com pontos por aulas concluídas, posts e respostas úteis.", "Certificados ganharam verificação por QR Code.") },
  { slug: "acessibilidade-obrigatoria", cat: "Desenvolvimento", title: "Acessibilidade deixa de ser diferencial e vira requisito em contratos", ago: 50 * H, read: 4, hue: 120, hot: 3,
    body: para("Cada vez mais contratos incluem critérios de acessibilidade como requisito de entrega.", "Contraste, navegação por teclado e textos alternativos estão entre os itens mais cobrados.") },
  { slug: "home-office-hibrido", cat: "Carreira", title: "Modelo híbrido segue dominante entre vagas de tecnologia", ago: 70 * H, read: 3, hue: 60, hot: 1,
    body: para("Levantamentos de mercado mostram que o modelo híbrido continua sendo o mais oferecido em vagas de tecnologia.", "Vagas 100% remotas seguem disputadas e costumam exigir mais experiência.") },
].map((n) => ({ ...n, date: now - n.ago }));

// ------------------------------------------------------------------------
// Comunidade — usuários e posts FICTÍCIOS
// ------------------------------------------------------------------------
export const USERS = {
  equipe: { name: "Equipe graao", handle: "equipe", hue: 258, badge: "Equipe" },
  ana: { name: "Ana Torres", handle: "anatorres", hue: 330, badge: "Pro" },
  bruno: { name: "Bruno Lima", handle: "brunolima", hue: 200, badge: "Start" },
  carla: { name: "Carla Nunes", handle: "carladev", hue: 150 },
  diego: { name: "Diego Alves", handle: "diegoalves", hue: 24 },
  eva: { name: "Eva Prado", handle: "evaprado", hue: 280, badge: "Pro" },
  fabio: { name: "Fábio Rocha", handle: "fabiorocha", hue: 100 },
  gabi: { name: "Gabi Souza", handle: "gabisouza", hue: 0 },
};

Object.assign(USERS, {
  helio: { name: "Hélio Matos", handle: "heliomatos", hue: 45, role: "Desenvolvedor web" },
  iris: { name: "Íris Campos", handle: "iriscampos", hue: 300, role: "Designer de produto" },
  joao: { name: "João Reis", handle: "joaoreis", hue: 190, role: "Estudante de computação" },
  karen: { name: "Karen Lopes", handle: "karenlopes", hue: 350 },
  leo: { name: "Léo Martins", handle: "leomartins", hue: 120, role: "Front-end" },
  mara: { name: "Mara Duarte", handle: "maraduarte", hue: 210, role: "UX/UI" },
});
USERS.ana.role = "Engenheira de software"; USERS.bruno.role = "Desenvolvedor de automações"; USERS.eva.role = "Estudante de design";
USERS.carla.role = "Desenvolvedora front-end"; USERS.diego.role = "Criador de conteúdo";

export const RANKING = [
  ["ana", 148], ["bruno", 94], ["eva", 72], ["carla", 46], ["diego", 41], ["fabio", 33], ["gabi", 21],
  ["helio", 20], ["iris", 18], ["joao", 16], ["karen", 12], ["leo", 8], ["mara", 6],
];
export const LAST_SEASON = [["helio", 48], ["carla", 46], ["joao", 42]];
export const WHO_TO_FOLLOW = ["iris", "leo", "mara", "helio", "joao"];

export const SEASON_POINTS = [
  ["Concluir uma aula", 2], ["Publicação em alta", 25], ["Presença do dia", 2],
  ["Sequência de 7 dias", 10], ["Sequência de 30 dias", 25], ["Sequência de 100 dias", 50], ["Sequência de 365 dias", 100],
];

export const ONBOARDING = [
  ["perfil", "Complete seu perfil", "Adicione o que você faz e uma bio.", "/conta/perfil"],
  ["seguir", "Siga 3 pessoas", "Encontre pessoas da sua área.", "/comunidade"],
  ["noticia", "Interaja com uma notícia", "Salve ou comente uma notícia.", "/noticias"],
  ["post", "Interaja com um post", "Curta ou comente outro post.", "/comunidade"],
  ["publicar", "Faça sua primeira publicação", "Compartilhe uma ideia, dúvida ou projeto.", "/comunidade"],
];

export const HELP = [
  ["Conta e acesso", "user", [
    ["Como crio minha conta?", "É gratuito: clique em “Criar conta”, informe nome, e-mail e senha (ou entre com Google ou Apple) e pronto."],
    ["Esqueci minha senha", "Na tela de entrar, clique em “Esqueci minha senha” e siga o link enviado ao seu e-mail."],
    ["Como edito meu perfil?", "Em Configurações, abra Perfil para ajustar nome, o que você faz e bio."],
    ["Como excluo minha conta?", "Em Configurações, abra Privacidade e dados e use “Excluir meus dados”."],
  ]],
  ["Planos e pagamento", "layers", [
    ["Quais formas de pagamento vocês aceitam?", "Texto de exemplo: descreva aqui os meios de pagamento do seu provedor."],
    ["Como funciona a renovação?", "As assinaturas renovam ao fim de cada período e podem ser canceladas quando você quiser."],
    ["Como peço reembolso?", "Dentro do prazo de garantia, fale com a equipe pela área de chamados."],
    ["Posso trocar de plano?", "Sim, a qualquer momento em Planos."],
  ]],
  ["Cursos e conteúdos", "book", [
    ["Como acesso os cursos?", "Em Conteúdos, escolha uma trilha e um módulo. Aulas liberadas no seu plano abrem direto."],
    ["Meu progresso fica salvo?", "Sim. Cada aula marcada como vista conta para o progresso da trilha."],
    ["Posso comprar só uma trilha ou módulo?", "Algumas trilhas têm compra avulsa com acesso vitalício àquele conteúdo."],
  ]],
  ["Certificados", "award", [
    ["Como emito meu certificado?", "Ao concluir todas as aulas de um módulo, o certificado é liberado automaticamente."],
    ["O certificado é válido?", "Cada certificado tem um código público de validação."],
    ["Não recebi meu certificado", "Confira se todas as aulas foram marcadas como vistas. Se o problema continuar, abra um chamado."],
  ]],
];

export const SEED_POSTS = [
  { id: "p1", user: "equipe", ago: 0.8 * H, text: "Briga de gigantes: qual gerador de vídeo com IA vocês têm usado? Comenta aí 👇", tags: ["Notícia"], news: "geradores-de-video-com-ia-comparativo", likes: 6, comments: [{ user: "bruno", text: "Tenho testado dois e o controle de câmera faz muita diferença." }] },
  { id: "p2", user: "ana", ago: 3 * H, text: "Você sabe qual número aparece no console?\n\nconst a = [1, 2, 3];\nconsole.log(a.map(n => n * 2).at(-1));", tags: ["Dica", "JavaScript"], images: [200, 260], likes: 4, comments: [] },
  { id: "p3", user: "carla", ago: 7 * H, text: "Terminei o módulo de Grid do CSS e refiz minha página de portfólio. Feedbacks são bem-vindos! 🚀", tags: ["Projeto"], images: [150], likes: 9, comments: [{ user: "eva", text: "Ficou muito limpo! Só aumentaria o contraste dos links." }, { user: "fabio", text: "Curti o hover dos cards." }] },
  { id: "p4", user: "bruno", ago: 26 * H, text: "Aprendo muito com as aulas de prospecção. Fechei meu segundo cliente essa semana 🔥", tags: ["Carreira"], likes: 12, comments: [] },
  { id: "p5", user: "eva", ago: 30 * H, text: "Gerei essa arte com IA para um estudo de identidade visual. O que acham?", tags: ["Design", "IA"], images: [300, 320, 280], likes: 7, comments: [] },
  { id: "p6", user: "diego", ago: 74 * H, text: "Vídeo novo no meu canal explicando como organizar um projeto front-end do zero. Link no perfil!", tags: ["Tutorial", "Carreira"], likes: 3, comments: [] },
].map((p) => ({ ...p, date: now - p.ago }));
