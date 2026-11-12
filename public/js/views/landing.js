import { icon, btnArrow } from "../icons.js";
import { BRAND, AREAS, PLANS, FAQ, TESTIMONIALS, TRACKS, COURSE, NEWS, SEED_POSTS, USERS, art } from "../data.js";
import { esc, brandHTML, letters, avatar, $, $$, observeReveals } from "../ui.js";
import { store } from "../store.js";
import { mk } from "../microkit.js";
import { rb } from "../reactbits.js";

const A = (href, label, cls = "btn-primary", extra = "") => `<a class="btn ${cls}" href="${href}" ${extra}><span>${label}</span>${btnArrow()}</a>`;

// --- Mock UIs em vidro (no lugar de vídeos de demonstração) ---------------
const courseMock = () => {
  const mods = TRACKS[0].modules;
  const cards = mods.map((m, i) => `<div class="mock-card"><div class="art" style="background:${art(m.hue, i)}"><span>${esc(m.title)}</span>${m.soon ? '<em class="soon">em breve</em>' : ""}</div><div class="bar"><i style="width:${m.soon ? 0 : 35}%"></i></div></div>`).join("");
  return `<div class="mock"><div class="mock-top"><b>${esc(COURSE.title)}</b><span>${mods.length} módulos</span><span class="pill">Primeiro curso</span></div>
    <div class="mock-body"><div class="mock-scroll"><div><div class="mock-row-title"><span>Seu curso</span><span>0% concluído</span></div><div class="mock-cards">${cards}</div></div>
    <div class="mock-hero" style="background:${art(COURSE.hue, 3)}"><b>${esc(COURSE.title)}</b><span>${esc(COURSE.tagline)}</span></div>
    <div><div class="mock-row-title"><span>Seu curso</span><span>0% concluído</span></div><div class="mock-cards">${cards}</div></div>
    <div class="mock-hero" style="background:${art(COURSE.hue, 3)}"><b>${esc(COURSE.title)}</b><span>${esc(COURSE.tagline)}</span></div></div></div></div>`;
};
const communityMock = () => {
  const posts = SEED_POSTS.slice(0, 4).map((p, i) => {
    const u = USERS[p.user];
    return `<div class="mock-post"><header><i style="background:hsl(${u.hue} 70% 70%)"></i><b>${esc(u.name)}</b><small>@${u.handle}</small></header>
      <p>${esc(p.text.split("\n")[0])}</p>${p.images ? `<div class="img" style="background:${art(p.images[0], i)}"></div>` : ""}
      <footer><span>♥ ${p.likes}</span><span>💬 ${p.comments.length}</span><span>#${esc(p.tags[0])}</span></footer></div>`;
  }).join("");
  return `<div class="mock"><div class="mock-top"><b>Comunidade</b><span>O que está rolando</span><span class="pill">Ranking da temporada</span></div>
    <div class="mock-body"><div class="mock-scroll">${posts}${posts}</div></div></div>`;
};
const newsMock = () => {
  const [f, ...rest] = NEWS;
  const list = rest.slice(0, 6).map((n, i) => `<div class="mock-news"><div class="thumb" style="background:${art(n.hue, i)}"></div><div><small>${esc(n.cat)}</small><p>${esc(n.title)}</p><em>${n.read} min de leitura</em></div></div>`).join("");
  const feat = `<div class="mock-feature-news" style="background:${art(f.hue, 2)}"><p>${esc(f.title)}</p></div>`;
  return `<div class="mock"><div class="mock-top"><b>Novidades</b><span>Recentes · Em alta</span><span class="pill">Atualizado agora</span></div>
    <div class="mock-body"><div class="mock-scroll">${feat}${list}${feat}${list}</div></div></div>`;
};

const SCENES = [
  { id: "curso", label: "Curso", icon: "book", html: courseMock },
  { id: "comunidade", label: "Comunidade", icon: "users", html: communityMock },
  { id: "novidades", label: "Novidades", icon: "newspaper", html: newsMock },
];

const planCard = (p, billing) => {
  const pr = p.price[billing];
  return `<article class="plan rb-spotlight ${p.featured ? "featured rb-star" : ""}" data-reveal aria-labelledby="plan-${p.id}">
    <div class="plan-top"><span class="plan-icon ${p.free ? "free" : ""}" aria-hidden="true">${icon(p.icon)}</span><h3 id="plan-${p.id}">${p.name}</h3></div>
    <div class="price"><span>${pr.pre}</span><strong>${pr.big}</strong>${pr.post ? `<span>${pr.post}</span>` : ""}</div>
    <p class="price-note">${p.note[billing]}</p>
    <p class="plan-desc">${p.desc}</p>
    <ul class="plan-features">${p.features.map((f) => `<li><span class="check" aria-hidden="true">${icon("check")}</span>${f}</li>`).join("")}</ul>
    <div class="plan-action">${A(p.href, p.cta, `${p.featured ? "btn-primary" : "btn-secondary"} mk-shine`)}</div>
  </article>`;
};

export function renderLanding() {
  const user = store.user;
  const story = (t, i) => `<figure class="story">
      <figcaption>${avatar(t, 44)}<div><p>${esc(t.name)}</p><p>${esc(t.handle)}</p></div><div class="stars" aria-label="5 estrelas">${icon("star").repeat(5)}</div></figcaption>
      <blockquote>“${esc(t.short)}”</blockquote>
      <button type="button" class="more" aria-expanded="false" data-story="${i}">Ler relato completo</button>
      <div class="full" data-open="false" aria-hidden="true"><div><p class="body" style="font-size:15px">“${esc(t.full)}”</p></div></div>
    </figure>`;

  return `
  <div class="lp">
    <a class="skip" href="#conteudo">Pular para o conteúdo</a>
    <header class="lp-header">
      <a href="/" aria-label="${BRAND.full}, página inicial">${brandHTML()}</a>
      <nav class="lp-nav" aria-label="Navegação principal"><a href="#curso">${mk.swap("Curso")}</a><a href="#planos">${mk.swap("Planos")}</a><a href="#faq">${mk.swap("Dúvidas")}</a></nav>
      <div class="lp-header-actions">
        <button class="theme-toggle" data-action="theme" aria-label="Alternar tema">${icon(store.theme === "dark" ? "sun" : "moon")}</button>
        ${user
          ? `<a class="btn btn-quiet hello" href="/inicio"><span>Olá, ${esc(user.name.split(" ")[0])}</span></a>${A("/inicio", "Ir para a plataforma", "btn-secondary mk-magnetic")}`
          : `<a class="btn btn-quiet" href="/entrar"><span>Entrar</span></a>${A("/cadastro", "Criar conta", "btn-secondary mk-magnetic")}`}
      </div>
    </header>

    <main id="conteudo">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-grid">
          <div>
            <p class="hero-kicker" data-hero-copy><span class="dot"></span>${rb.shiny("Primeiro curso: " + COURSE.title)}</p>
            <h1 id="hero-title">
              <span class="line"><span style="--i:0">Aprenda.</span></span>
              <span class="line"><span style="--i:1">Organize.</span></span>
              <span class="line accent"><span style="--i:2">${rb.gradient("Floresça")}${icon("arrow-up-right", "hero-arrow")}</span></span>
              <span class="sr-only"> com IA e uma comunidade que entende o seu ritmo</span>
            </h1>
            <p class="hero-sub" data-hero-copy aria-hidden="true">com IA e uma comunidade<br><em>que entende o seu ritmo.</em></p>
            <p class="body" data-hero-copy>Cursos práticos, ferramentas de IA e pessoas para trocar ideias, num lugar leve, pensado para mentes inquietas.</p>
            <div class="hero-actions" data-hero-copy>${mk.glow("Criar conta grátis", "/cadastro")}${A("/curso/" + COURSE.id, "Conhecer o curso", "btn-secondary")}</div>
          </div>
          <div class="hero-visual" id="recursos">
            <div class="browser">
              <div class="browser-bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span>${BRAND.domain}</span><span></span></div>
              <div class="stage" data-stage>
                <div class="scene" data-scene="orb"><div class="orb" aria-hidden="true"><i></i><i></i><i></i></div><p class="stage-caption">APRENDA · ORGANIZE · FLORESÇA</p></div>
                ${SCENES.map((s) => `<div class="scene" data-scene="${s.id}" hidden>${s.html()}</div>`).join("")}
              </div>
              <nav class="browser-tabs" role="tablist" aria-label="Explore a plataforma">
                ${SCENES.map((s) => `<button role="tab" aria-selected="false" data-tab="${s.id}">${icon(s.icon)}<span>${s.label}</span></button>`).join("")}
              </nav>
            </div>
          </div>
        </div>
        <div class="areas"><ul aria-label="O que você encontra aqui">${AREAS.map((a) => `<li>${letters(a)}</li>`).join("")}</ul></div>
      </section>

      <section class="feature" id="curso" aria-labelledby="curso-title">
        <div class="feature-copy" data-reveal>
          <p class="label"><span>01</span>Primeiro curso · IA para TDAH</p>
          <h2 id="curso-title">Sua mente cria.<br><em>Seu sistema entrega.</em></h2>
          <p class="body">${esc(COURSE.subheadline)}</p>
          <div class="feature-cta">${A("/curso/" + COURSE.id, "Conhecer o curso", "btn-secondary mk-magnetic")}</div>
          <div class="benefits"><span>${icon("layers")}8 módulos · 55 aulas · 8h30</span><span>${icon("sparkles")}Método ÓRBITA</span><span>${icon("award")}3 projetos práticos</span></div>
        </div>
        <div class="media-stage" data-reveal>${courseMock()}</div>
      </section>

      <section class="feature flip" id="comunidade" aria-labelledby="comunidade-title">
        <div class="media-stage" data-reveal>${communityMock()}</div>
        <div class="feature-copy" data-reveal>
          <p class="label"><span>02</span>Comunidade</p>
          <h2 id="comunidade-title">Ninguém floresce<br><em>sozinho.</em></h2>
          <p class="body">Compartilhe dúvidas, descobertas e projetos com quem está no mesmo caminho, e acompanhe o que a comunidade está criando.</p>
          <div class="feature-cta">${A("/comunidade", "Ver comunidade", "btn-secondary")}</div>
          <div class="tags"><span>Troque ideias</span><span>Mostre seu processo</span><span>Crie conexões</span></div>
        </div>
      </section>

      <section class="feature" id="novidades" aria-labelledby="novidades-title">
        <div class="feature-copy" data-reveal>
          <p class="label"><span>03</span>Novidades</p>
          <h2 id="novidades-title">Novidades sem<br><em>sobrecarga.</em></h2>
          <p class="body">Uma seleção curta sobre IA e ferramentas, para ler sem se perder em vinte abas abertas.</p>
          <div class="feature-cta">${A("/noticias", "Ver novidades", "btn-secondary")}</div>
          <p class="small-note">Pouco ruído. Mais clareza.</p>
        </div>
        <div class="media-stage" data-reveal>${newsMock()}</div>
      </section>

      <section class="app-section" id="ritmo" aria-labelledby="app-title" data-reveal>
        <div class="app-copy">
          <p class="label"><span>04</span>No seu ritmo</p>
          <h2 id="app-title">No seu tempo.<br><em>${letters("Em qualquer tela.")}</em></h2>
          <p class="body">Comece no computador, continue no celular. Pare quando precisar e retome exatamente de onde parou.</p>
          <ul class="app-benefits">
            <li><span>${icon("circle-check")}</span>Progresso salvo em cada aula</li>
            <li><span>${icon("bell")}</span>Avisos que você escolhe receber</li>
            <li><span>${icon("sun")}</span>Tema claro ou escuro, do seu jeito</li>
          </ul>
          <div class="stores">${mk.glow("Criar conta grátis", "/cadastro")}</div>
          <p class="micro">Funciona no navegador, sem instalar nada.</p>
        </div>
        <div class="app-visual">
          <span class="app-orbit" aria-hidden="true"><i></i><i></i><i></i></span>
          <div class="app-backdrop" aria-hidden="true">${BRAND.first}<span>${BRAND.second}</span></div>
          <div class="phone" aria-label="graao club no celular" role="img" style="position:relative">
            ${courseMock()}
            <div class="phone-tabs" aria-hidden="true">${icon("home", "icon on")}${icon("book")}${icon("users")}${icon("newspaper")}${icon("user")}</div>
          </div>
        </div>
      </section>

      <section class="plans" id="planos" aria-labelledby="plans-title">
        <div class="section-heading">
          <div data-reveal><p class="label"><span>05</span>Planos</p><h2 id="plans-title">Plante hoje.<br><em>Colha no seu tempo.</em></h2></div>
          <div data-reveal style="display:grid;gap:18px;justify-items:start">
            <p class="body">Comece de graça com o Semente.<br>Evolua de plano quando fizer sentido.</p>
            <div class="mk-tabs" role="group" aria-label="Período de cobrança"><button data-billing="yearly" aria-selected="true">Anual</button><button data-billing="monthly" aria-selected="false">Mensal</button></div>
          </div>
        </div>
        <div class="plan-grid" data-plan-grid>${PLANS.map((p) => planCard(p, "yearly")).join("")}</div>
      </section>

      <section class="stories" id="relatos" aria-labelledby="stories-title">
        <div class="section-heading">
          <div data-reveal><p class="label"><span>06</span>Relatos</p><h2 id="stories-title">Quem já<br><em>está plantando.</em></h2></div>
          <p class="body" data-reveal>Espaço reservado para relatos reais de alunos. Os textos abaixo são exemplos.</p>
        </div>
        <div class="story-grid" data-stories>${TESTIMONIALS.slice(0, 3).map(story).join("")}</div>
        <div class="stories-foot">
          <button type="button" class="ui-btn outline" data-action="more-stories">Ver mais relatos (${TESTIMONIALS.length - 3})</button>
          <p>Relatos de exemplo. Resultados e experiências variam de pessoa para pessoa.</p>
        </div>
      </section>

      <section class="faq" id="faq" aria-labelledby="faq-title">
        <div data-reveal>
          <p class="label"><span>07</span>Dúvidas</p>
          <h2 id="faq-title">Alguma dúvida<br><em>antes de entrar?</em></h2>
          <p class="body">Se não estiver aqui, a gente responde.</p>
          ${A("/ajuda", "Fale com a gente", "btn-secondary")}
        </div>
        <div class="faq-list">${FAQ.map(([q, a], i) => `
          <details class="faq-item" ${i === 0 ? "open" : ""}>
            <summary><span class="faq-num">0${i + 1}</span><span>${q}</span><span class="faq-plus" aria-hidden="true"></span></summary>
            <div class="faq-answer"><p>${a}</p></div>
          </details>`).join("")}</div>
      </section>

      <section class="final" id="junte-se" aria-labelledby="junte-title" data-reveal>
        <div class="join-orbits" aria-hidden="true"><span></span><span></span><span></span></div>
        <div class="join-content">
          <div class="join-mark" aria-hidden="true"><img src="/brand/mark.svg" alt=""></div>
          <h2 id="junte-title">Plante a sua<br><em>primeira ideia.</em></h2>
          <p class="join-desc">Um curso, uma comunidade e o seu ritmo. É por aqui que começa.</p>
          ${mk.glow("Entrar no graao club", user ? "/inicio" : "/cadastro")}
        </div>
        <ul class="journey mk-glide">
          <li><span class="journey-icon">${icon("book")}</span><div><strong>${letters("Aprenda.")}</strong><p>Uma aula de cada vez.</p></div></li>
          <li><span class="journey-icon">${icon("users")}</span><div><strong>${letters("Compartilhe.")}</strong><p>Ideias crescem em grupo.</p></div></li>
          <li><span class="journey-icon">${icon("sprout")}</span><div><strong>${letters("Floresça.")}</strong><p>No seu próprio tempo.</p></div></li>
        </ul>
      </section>
    </main>
    ${footerHTML()}
  </div>`;
}

export function footerHTML() {
  return `<footer class="footer" id="rodape">
    <div class="footer-top">
      <div>
        <a href="/" aria-label="${BRAND.full}, início">${brandHTML()}</a>
        <p class="footer-statement">Feito para mentes<br>que nunca <em>param.</em></p>
        <p class="footer-desc">Aprenda com IA, organize suas ideias e cresça junto com uma comunidade que entende o seu ritmo.</p>
      </div>
      <nav aria-label="Navegação do rodapé"><h3>Explore</h3><a href="/cursos">Curso</a><a href="/comunidade">Comunidade</a><a href="/noticias">Novidades</a><a href="/planos">Planos</a></nav>
      <nav aria-label="Institucional"><h3>O graao</h3><a href="/sobre">Sobre</a><a href="/ajuda">Ajuda</a><a href="/design-system">Design System</a><a href="/termos">Termos de Uso</a><a href="/privacidade">Privacidade</a><a href="/reembolso">Reembolso</a></nav>
      <div class="footer-social"><h3>Continue por perto</h3>
        <span>${icon("instagram")}<span>Instagram</span><small>em breve</small></span>
        <span>${icon("youtube")}<span>YouTube</span><small>em breve</small></span>
        <span>${icon("linkedin")}<span>LinkedIn</span><small>em breve</small></span>
      </div>
    </div>
    <div class="footer-signature">
      <div class="signature-caption"><span><i aria-hidden="true"></i>Um grão de cada vez.</span><span>Clareza. Criatividade. Comunidade.</span></div>
      <div class="wordmark" aria-hidden="true">${BRAND.first}<span>${BRAND.second}</span></div>
    </div>
    <div class="footer-bottom"><span>© ${new Date().getFullYear()} ${BRAND.full}.</span><a class="back-top" href="#conteudo"><span>Voltar ao topo</span>${icon("arrow-right")}</a></div>
  </footer>`;
}

export function mountLanding(root) {
  observeReveals(root);
  const stage = $("[data-stage]", root);
  const tabs = $$("[data-tab]", root);
  let idx = -1;
  const show = (id) => {
    $$(".scene", stage).forEach((s) => (s.hidden = s.dataset.scene !== id));
    tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.tab === id)));
  };
  const timer = setInterval(() => { idx = (idx + 1) % (SCENES.length + 1); show(idx === SCENES.length ? "orb" : SCENES[idx].id); }, 4200);
  tabs.forEach((t) => t.addEventListener("click", () => { clearInterval(timer); show(t.dataset.tab); }));

  const items = $$(".areas li", root);
  let w = 0;
  const waveTimer = setInterval(() => { items.forEach((i) => i.classList.remove("wave")); void root.offsetWidth; items[w++ % items.length]?.classList.add("wave"); }, 1600);

  $$("[data-billing]", root).forEach((b) => b.addEventListener("click", () => {
    const billing = b.dataset.billing;
    $$("[data-billing]", root).forEach((x) => x.setAttribute("aria-selected", String(x === b)));
    b.closest(".mk-tabs").dispatchEvent(new PointerEvent("pointerleave"));
    $$("[data-plan-grid] .plan", root).forEach((el, i) => {
      const p = PLANS[i], pr = p.price[billing];
      el.querySelector(".price").outerHTML = `<div class="price"><span>${pr.pre}</span><strong>${pr.big}</strong>${pr.post ? `<span>${pr.post}</span>` : ""}</div>`;
      el.querySelector(".price-note").textContent = p.note[billing];
    });
  }));

  root.addEventListener("click", (e) => {
    const more = e.target.closest("[data-story]");
    if (more) {
      const full = more.nextElementSibling;
      const open = full.dataset.open !== "true";
      full.dataset.open = String(open); full.setAttribute("aria-hidden", String(!open));
      more.setAttribute("aria-expanded", String(open));
      more.textContent = open ? "Mostrar menos" : "Ler relato completo";
      more.previousElementSibling.hidden = open;
    }
    const ms = e.target.closest('[data-action="more-stories"]');
    if (ms) {
      const grid = $("[data-stories]", root);
      TESTIMONIALS.slice(3).forEach((t) => grid.insertAdjacentHTML("beforeend", `<figure class="story"><figcaption>${avatar(t, 44)}<div><p>${esc(t.name)}</p><p>${esc(t.handle)}</p></div><div class="stars">${icon("star").repeat(5)}</div></figcaption><blockquote>“${esc(t.full)}”</blockquote></figure>`));
      ms.remove();
    }
  });
  $$(".faq-item", root).forEach((d) => d.addEventListener("toggle", () => { if (d.open) $$(".faq-item", root).forEach((o) => o !== d && (o.open = false)); }));
  return () => { clearInterval(timer); clearInterval(waveTimer); };
}
