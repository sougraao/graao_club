/* graao club — renderização das páginas do app (dados de demonstração em data.js).
   Toda a UI usa componentes do design system (DESIGN_SYSTEM.md). */
(function () {
  "use strict";

  document.addEventListener("graao:ready", () => {
    const page = document.body.dataset.appPage;
    const R = RENDER[page];
    if (!R) return;
    const main = document.querySelector("main.content");
    R(main);
    GRAAO.mount(main);
    GRAAO.refreshProgress();
  });

  const D = window.GRAAO_DATA;
  const { $, $$, icon, esc, toast, modal, mount, avatar, store, CONFIG, getUser, saveUser, hasFullAccess, fmtDate, completeStep, refreshProgress } = window.GRAAO;
  const TRAIL_LOOK = {
    "comece-aqui": ["lima", "obj-broto.svg"], "web-start": ["mar", "obj-orbe.svg"], design: ["sol", "obj-cubo.svg"],
    ia: ["uva", "obj-grao.svg"], nocode: ["brasa", "obj-balao.svg"],
  };
  const CAT_LOOK = { Design: "sol", "Inteligência Artificial": "uva", Desenvolvimento: "mar", Carreira: "lima", Tecnologia: "brasa", "Programação": "mar", Novidades: "noite" };
  const LOOK = (t) => [t.safra || (TRAIL_LOOK[t.id] || [])[0] || "noite", t.object || (TRAIL_LOOK[t.id] || [])[1] || "obj-grao.svg"];
  /* Só o que está publicado no admin aparece para os membros */
  const TRAILS = () => D.trails.filter((t) => t.status !== "rascunho");
  const NEWS = () => D.news.filter((n) => n.status !== "rascunho");
  const PLAN_RANK = { semente: 0, broto: 1, colheita: 2 };
  const darkText = (s) => s === "lima" || s === "sol";
  const userById = (id) => D.users.find((u) => u.id === id) || { id, name: "Membro", role: "", hue: 0 };
  const lessonsDone = () => new Set(store.get(CONFIG.storage.lessons, []));
  const lessonKey = (t, m, i) => `${t}/${m}/${i}`;
  const trailPlan = (t) => t.plan || (t.free ? "semente" : "broto");
  const planName = (t) => ({ semente: "Semente", broto: "Broto", colheita: "Colheita" })[trailPlan(t)];
  const trailLocked = (t) => PLAN_RANK[trailPlan(t)] > PLAN_RANK[getUser().plan || "semente"];
  const trailProgress = (t) => {
    const done = lessonsDone();
    let total = 0, n = 0;
    t.modules.forEach((m) => m.lessons.forEach((_, i) => { total++; if (done.has(lessonKey(t.id, m.id, i))) n++; }));
    return { total, n, pct: total ? Math.round((n / total) * 100) : 0 };
  };
  const allPosts = () => [...store.get(CONFIG.storage.posts, []), ...D.posts].filter((p) => !p.hidden).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  const timeAgo = (iso) => { const d = Math.round((Date.now() - new Date(iso + "T12:00:00")) / 864e5); return d <= 0 ? "hoje" : d === 1 ? "1 d" : `${d} d`; };

  /* ---------- peças reutilizáveis ---------- */
  const trailCard = (t, extra = "") => {
    const [s, obj] = LOOK(t) || ["noite", "obj-grao.svg"];
    const p = trailProgress(t), ink = darkText(s) ? "color:#0b0d10" : "";
    return `<article class="g-media-card" data-trail="${t.id}" ${extra}>
      <div class="g-cover g-cover--${s}"></div>
      <img class="g-media-card__figure" src="assets/img/${obj}" alt="">
      ${trailLocked(t) ? `<span class="g-badge g-badge--sm" style="align-self:flex-start;background:#0b0d1055;color:#fff;border:0">${icon("lock", "g-icon--sm")}${planName(t)}</span>` : trailPlan(t) === "semente" ? `<span class="g-badge g-badge--sm g-badge--inverse" style="align-self:flex-start">Grátis</span>` : ""}
      <h3 class="g-media-card__title" style="${ink}">${esc(t.name)}</h3>
      <div class="g-media-card__meta" style="${ink}"><span>${t.modules.length} módulos</span><span class="g-price">${p.pct}%</span></div>
    </article>`;
  };

  const lessonModal = (t, m) => {
    const locked = trailLocked(t);
    if (m.soon) return toast("Este módulo chega em breve", { iconId: "clock" });
    if (locked) return upsell();
    const done = lessonsDone();
    const [s] = LOOK(t) || ["noite"];
    modal(`
      <div class="g-cover g-cover--${s}" style="height:120px;margin:-8px -8px 18px;border-radius:var(--g-radius-lg)"></div>
      <span class="g-eyebrow">${esc(t.name)}</span>
      <h3 class="g-h3" style="margin-top:8px">${esc(m.title)}</h3>
      <p class="g-body" style="margin-top:6px">${esc(m.desc)}</p>
      <div style="display:grid;gap:12px;margin-top:20px">${m.lessons.map((l, i) => `
        <label class="g-check"><input type="checkbox" data-lesson="${lessonKey(t.id, m.id, i)}" ${done.has(lessonKey(t.id, m.id, i)) ? "checked" : ""}><span class="g-check__box"><svg viewBox="0 0 24 24"><path d="M5 12.5 10 17 19 7"/></svg></span><span class="g-check__label">Aula ${i + 1} · ${esc(l)}</span></label>`).join("")}</div>
      <button class="g-btn g-btn--accent g-btn--lg g-btn--block g-btn--arrow" style="margin-top:24px" data-close>Continuar depois ${icon("arrow-right")}</button>`, {
      label: m.title,
      onOpen: (w) => $$("[data-lesson]", w).forEach((c) => c.addEventListener("change", () => {
        const set = lessonsDone();
        if (c.checked) { set.add(c.dataset.lesson); toast(`Aula concluída · +${CONFIG.points.lesson} pontos`); } else set.delete(c.dataset.lesson);
        store.set(CONFIG.storage.lessons, [...set]);
        refreshProgress();
        document.dispatchEvent(new CustomEvent("graao:progress"));
      })),
    });
  };

  const upsell = () => modal(`
    <img src="assets/img/obj-grao.svg" alt="" style="width:64px;margin-bottom:16px;filter:drop-shadow(0 16px 20px #0008)">
    <span class="g-eyebrow">Plano Broto</span>
    <h3 class="g-h3" style="margin-top:8px">Desbloqueie esta trilha</h3>
    <p class="g-body" style="margin-top:8px">Trilhas essenciais, interação na comunidade e certificados. Cancele quando quiser.</p>
    <div style="display:flex;gap:10px;margin-top:24px;flex-wrap:wrap"><a class="g-btn g-btn--accent g-btn--lg g-btn--shine" href="index.html#planos">Ver planos</a><a class="g-btn g-btn--lg" href="configuracoes.html#plano">Simular acesso</a></div>`, { label: "Desbloquear trilha" });

  const newsRow = (n) => `<a class="g-row" href="noticia.html?id=${n.id}" style="grid-template-columns:auto 1fr auto;border-radius:var(--g-radius-md)">
      <span class="g-cover g-cover--${CAT_LOOK[n.cat] || "noite"}" style="width:56px;height:56px;border-radius:14px"></span>
      <span style="min-width:0"><span class="g-row__title" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${esc(n.title)}</span><span class="g-row__sub">${esc(n.cat)} · ${fmtDate(n.date)}</span></span>
      ${icon("arrow-up-right", "g-icon--sm")}</a>`;

  const rankRow = (u, pos) => `<a class="g-row" href="perfil.html?u=${u.id}" style="grid-template-columns:28px auto 1fr auto">
      <span class="g-mono g-caption" style="text-align:center">${pos}</span>${avatar(u.name, u.hue, "g-avatar--sm")}
      <span><span class="g-row__title">${esc(u.name)}</span><br><span class="g-row__sub">${esc(u.role)}</span></span>
      <span class="g-num g-num--sm">${u.points}<small>pts</small></span></a>`;

  const postCard = (p) => {
    const u = p.mine ? getUser() : userById(p.user);
    const liked = store.get(CONFIG.storage.likes, []).includes(p.id);
    return `<article class="g-card post" data-post="${p.id}">
      <header style="display:flex;align-items:center;gap:12px">${avatar(u.name, u.hue)}<div style="flex:1;min-width:0"><b style="font-size:14px">${esc(u.name)}</b><div class="g-caption">${esc(u.role || "Membro")} · ${esc(p.time)}</div></div>
        <button class="g-icon-btn g-icon-btn--sm g-icon-btn--ghost" aria-label="Mais opções" data-more>${icon("more", "g-icon--sm")}</button></header>
      <p style="margin-top:14px;line-height:1.65;white-space:pre-line">${esc(p.text)}</p>
      ${p.image ? `<div class="g-cover g-cover--${GRAAO.safraFor(p.image)}" style="aspect-ratio:16/8;margin-top:14px;display:grid;place-items:center"><img src="assets/img/${["obj-grao.svg", "obj-orbe.svg", "obj-cubo.svg", "obj-broto.svg"][p.image % 4]}" alt="" style="width:22%;filter:drop-shadow(0 20px 20px #0007)"></div>` : ""}
      <footer style="display:flex;gap:6px;margin-top:14px">
        <button class="g-btn g-btn--sm ${liked ? "g-btn--accent" : "g-btn--soft"}" data-like aria-pressed="${liked}">${icon("heart", "g-icon--sm")}<span>${p.likes + (liked ? 1 : 0)}</span></button>
        <button class="g-btn g-btn--sm g-btn--soft" data-comment>${icon("message", "g-icon--sm")}${p.comments}</button>
        <button class="g-btn g-btn--sm g-btn--quiet" data-share style="margin-left:auto">${icon("share", "g-icon--sm")}Compartilhar</button>
      </footer></article>`;
  };
  const wirePosts = (root) => {
    $$("[data-post]", root).forEach((el) => {
      const id = el.dataset.post;
      $("[data-like]", el).addEventListener("click", (e) => {
        const b = e.currentTarget, likes = new Set(store.get(CONFIG.storage.likes, []));
        const on = !likes.has(id); on ? likes.add(id) : likes.delete(id);
        store.set(CONFIG.storage.likes, [...likes]);
        const n = $("span", b); n.textContent = +n.textContent + (on ? 1 : -1);
        b.classList.toggle("g-btn--accent", on); b.classList.toggle("g-btn--soft", !on); b.setAttribute("aria-pressed", on);
        if (on) completeStep("post");
      });
      $("[data-comment]", el).addEventListener("click", () => { completeStep("post"); toast("Comentários chegam em breve", { iconId: "message" }); });
      $("[data-share]", el).addEventListener("click", () => { navigator.clipboard?.writeText(location.href.split("#")[0] + "#" + id).catch(() => {}); toast("Link copiado", { iconId: "link" }); });
      $("[data-more]", el).addEventListener("click", () => toast("Mais opções em breve", { iconId: "more" }));
    });
  };

  /* =====================================================================
     PÁGINAS
     ===================================================================== */
  const RENDER = {};
  window.GRAAO_RENDER = RENDER; // pages-ia.js (IA para TDAH) acrescenta/substitui telas aqui

  /* ---------- Dashboard ---------- */
  RENDER.dashboard = (main) => {
    const user = getUser();
    const free = TRAILS().find((t) => trailPlan(t) === "semente") || TRAILS()[0];
    const p = trailProgress(free);
    const sorted = [...D.users].sort((a, b) => b.points - a.points);
    const steps = [
      ["perfil", "Complete seu perfil", "Adicione uma foto e conte o que você faz.", "configuracoes.html#perfil"],
      ["seguir", "Siga 3 pessoas", "Encontre gente da sua área.", "comunidade.html"],
      ["noticia", "Interaja com uma notícia", "Curta ou salve uma notícia.", "noticias.html"],
      ["post", "Interaja com um post", "Curta ou comente o post de alguém.", "comunidade.html"],
      ["publicar", "Faça sua primeira publicação", "Compartilhe uma ideia ou um projeto.", "comunidade.html#composer"],
    ];
    const unlocked = TRAILS().filter((t) => !trailLocked(t)).length;
    main.innerHTML = `
      <div class="page-head g-reveal">
        <div><span class="g-eyebrow">Bom te ver de volta</span><h2 class="g-h1" style="margin-top:8px">Olá, ${esc(user.name.split(" ")[0])}!</h2></div>
        <div class="toolbar"><a class="g-btn g-btn--solid g-btn--arrow" href="conteudos.html">Explorar conteúdos ${icon("arrow-right", "g-icon--sm")}</a></div>
      </div>

      <div class="dash-top">
        <section class="g-card dash-stats g-reveal" aria-label="Seu resumo">
          <div class="g-stat"><span class="g-stat__label">Progresso na trilha grátis</span><span class="g-num g-num--xl"><span data-dash-pct>${p.pct}</span><small>%</small></span><div class="g-progress"><div class="g-progress__fill" data-dash-bar style="--v:${p.pct}%"></div></div><span class="g-stat__meta"><span data-dash-steps>${p.n}/${p.total}</span> aulas · ${esc(free.name)}</span></div>
          <a class="g-stat" href="ranking.html"><span class="g-stat__label">Pontos na temporada</span><span class="g-num g-num--xl"><span data-points>0</span><small>pts</small></span><div class="g-progress g-progress--thin"><div class="g-progress__fill" style="--v:18%"></div></div><span class="g-stat__meta">Como ganhar ${icon("arrow-up-right", "g-icon--sm")}</span></a>
          <div class="g-stat"><span class="g-stat__label">Membros na comunidade</span><span class="g-num g-num--xl"><span data-g-count="1284">1.284</span></span><div class="g-avatar-stack">${sorted.slice(0, 5).map((u, i) => avatar(u.name, u.hue, "g-avatar--sm").replace('style="', `style="--i:${i};`)).join("")}</div><span class="g-stat__meta"><span class="g-delta">+38 esta semana</span></span></div>
        </section>
        <section class="g-card g-card--accent dash-next g-reveal">
          <div style="display:flex;justify-content:space-between;align-items:start"><span class="g-eyebrow" style="color:#0b0d10a0">Seu próximo passo</span><a class="g-icon-btn" style="border-color:#0b0d1033;color:#0b0d10" href="conteudos.html" aria-label="Ir para conteúdos">${icon("arrow-up-right", "g-icon--sm")}</a></div>
          <h3 class="g-h3" style="margin-top:14px">${p.n ? "Continue de onde parou" : "Comece sua primeira trilha"}</h3>
          <p style="margin-top:8px;color:#0b0d10b3;font-size:14px">${p.n ? `Você já fez ${p.n} de ${p.total} aulas de ${esc(free.name)}.` : "Escolha um conteúdo e aprenda no seu ritmo. Sua próxima aula fica sempre aqui."}</p>
          <button class="g-btn g-btn--solid g-btn--arrow" style="margin-top:18px" data-open-free>${p.n ? "Continuar" : "Começar agora"} ${icon("arrow-right", "g-icon--sm")}</button>
        </section>
      </div>

      <div class="split">
        <div style="display:grid;gap:16px">
          <section class="g-card g-reveal" id="first-steps">
            <div class="card-head"><div><h2 class="g-h4">Primeiros passos</h2><p class="g-caption" style="margin-top:2px">Complete seu perfil e conheça a comunidade.</p></div><span class="g-badge g-badge--inverse" data-steps-count>0/5</span></div>
            <div class="g-progress g-progress--thin"><div class="g-progress__fill" data-steps-bar></div></div>
            <div class="steps">${steps.map(([id, t, s, href], i) => `<a class="step" data-step="${id}" href="${href}"><span class="step-n">${i + 1}</span><span><b>${t}</b><small>${s}</small></span>${icon("arrow-right", "g-icon--sm")}</a>`).join("")}</div>
          </section>

          <section class="g-card g-reveal">
            <div class="card-head"><div><h2 class="g-h4">Novas aulas</h2><p class="g-caption" style="margin-top:2px">Conteúdos adicionados recentemente.</p></div><a class="link-more" href="conteudos.html">Ver conteúdos ${icon("arrow-up-right", "g-icon--sm")}</a></div>
            ${[[TRAILS()[0], TRAILS()[0].modules[0], "05/11/2026"], [TRAILS()[3], TRAILS()[3].modules[2], "02/11/2026"], [TRAILS()[2], TRAILS()[2].modules[2], "29/10/2026"]].map(([t, m, d]) => `
              <button class="g-row" data-lesson-open="${t.id}|${m.id}" style="grid-template-columns:auto 1fr auto auto">
                <span class="g-cover g-cover--${LOOK(t)[0]}" style="width:44px;height:44px;border-radius:12px"></span>
                <span><span class="g-row__title">${esc(m.title)}</span><br><span class="g-row__sub">${esc(t.name)} · ${m.lessons.length} aulas</span></span>
                ${trailLocked(t) ? `<span class="g-badge g-badge--sm">${icon("lock", "g-icon--sm")}${planName(t)}</span>` : `<span class="g-badge g-badge--sm g-badge--soft">Nova</span>`}
                <span class="g-caption g-mono">${d}</span></button>`).join("")}
          </section>

          <section class="g-card g-reveal" style="display:flex;flex-wrap:wrap;gap:20px;align-items:center;justify-content:space-between">
            <div style="flex:1 1 260px"><h2 class="g-h4">Desbloqueie todo o conteúdo</h2><p class="g-caption" style="margin-top:4px">Você tem acesso a ${unlocked} de ${TRAILS().length} trilhas.</p><div class="g-progress" style="margin-top:14px;max-width:320px"><div class="g-progress__fill" style="--v:${Math.round((unlocked / TRAILS().length) * 100)}%"></div></div></div>
            <a class="g-btn g-btn--accent g-btn--shine g-btn--lg" href="index.html#planos">Ver planos</a>
          </section>
        </div>

        <aside>
          <section class="g-card g-reveal">
            <div class="card-head"><h2 class="g-h4">${icon("trophy", "g-icon--sm")} Ranking</h2><a class="link-more" href="ranking.html">Ver tudo ${icon("arrow-up-right", "g-icon--sm")}</a></div>
            <div style="display:grid;gap:2px">${sorted.slice(0, 5).map((u, i) => rankRow(u, i + 1)).join("")}</div>
          </section>
          <section class="g-card g-reveal">
            <div class="card-head"><h2 class="g-h4">${icon("activity", "g-icon--sm")} Acontecendo</h2></div>
            <div class="g-segment" data-g-segment id="feed-seg" role="tablist" style="margin-bottom:10px"><button role="tab" aria-selected="true" data-value="news">Notícias</button><button role="tab" aria-selected="false" data-value="posts">Comunidade</button></div>
            <div id="feed-list" style="display:grid;gap:2px"></div>
          </section>
        </aside>
      </div>`;

    const feed = $("#feed-list", main);
    const renderFeed = (k) => {
      feed.innerHTML = k === "news" ? NEWS().slice(0, 3).map(newsRow).join("") : allPosts().slice(0, 3).map((p) => {
        const u = p.mine ? getUser() : userById(p.user);
        return `<a class="g-row" href="comunidade.html" style="grid-template-columns:auto 1fr;border-radius:var(--g-radius-md)">${avatar(u.name, u.hue, "g-avatar--sm")}<span style="min-width:0"><span class="g-row__title" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-weight:500">${esc(p.text)}</span><span class="g-row__sub">${esc(u.name)} · ${icon("heart", "g-icon--sm")} ${p.likes}</span></span></a>`;
      }).join("");
    };
    $("#feed-seg", main).addEventListener("g:change", (e) => renderFeed(e.detail.value));
    renderFeed("news");

    $$(".step", main).forEach((s) => s.addEventListener("click", (e) => {
      if (e.altKey) { e.preventDefault(); completeStep(s.dataset.step); }
    }));
    $("[data-open-free]", main).addEventListener("click", () => {
      const done = lessonsDone();
      const m = free.modules.find((mm) => mm.lessons.some((_, i) => !done.has(lessonKey(free.id, mm.id, i)))) || free.modules[0];
      lessonModal(free, m);
    });
    $$("[data-lesson-open]", main).forEach((b) => b.addEventListener("click", () => {
      const [tid, mid] = b.dataset.lessonOpen.split("|"); const t = TRAILS().find((x) => x.id === tid);
      lessonModal(t, t.modules.find((m) => m.id === mid));
    }));
    document.addEventListener("graao:progress", () => {
      const q = trailProgress(free);
      $("[data-dash-pct]", main).textContent = q.pct; $("[data-dash-steps]", main).textContent = `${q.n}/${q.total}`;
      $("[data-dash-bar]", main).style.setProperty("--v", q.pct + "%");
    });
    if (location.hash === "#first-steps") setTimeout(() => $("#first-steps").scrollIntoView({ block: "start" }), 50);
  };

  /* ---------- Conteúdos ---------- */
  RENDER.conteudos = (main) => {
    main.innerHTML = `
      <div class="page-head">
        <p class="g-body">Trilhas e módulos para evoluir no seu ritmo. Novidades toda semana.</p>
        <div class="toolbar">
          <span class="g-pill-input"><input type="search" id="q" placeholder="Buscar conteúdo…" aria-label="Buscar conteúdo"><span class="g-pill-input__end">${icon("search", "g-icon--sm")}</span></span>
          <div class="g-segment" data-g-segment id="filter" role="tablist"><button role="tab" aria-selected="true" data-value="all">Todos</button><button role="tab" aria-selected="false" data-value="free">Liberados</button><button role="tab" aria-selected="false" data-value="progress">Em andamento</button></div>
        </div>
      </div>
      <section class="g-card g-dia showcase g-reveal" style="background:var(--g-mist-50)">
        <div class="g-carousel" data-g-carousel id="trail-car">${TRAILS().map((t) => `<a class="g-carousel__item" href="#trilha-${t.id}">${trailCard(t)}</a>`).join("")}</div>
      </section>
      <div id="trails" style="display:grid;gap:12px"></div>`;

    const list = $("#trails", main);
    const render = () => {
      const q = $("#q", main).value.trim().toLowerCase();
      const f = $("#filter [aria-selected='true']", main).dataset.value;
      const html = TRAILS().filter((t) => f === "all" || (f === "free" && !trailLocked(t)) || (f === "progress" && trailProgress(t).n > 0)).map((t) => {
        const mods = t.modules.filter((m) => !q || (m.title + m.desc + t.name).toLowerCase().includes(q));
        if (!mods.length) return "";
        const [s] = LOOK(t), p = trailProgress(t), locked = trailLocked(t);
        return `<section class="g-card trail-row" id="trilha-${t.id}">
          <div class="card-head"><div style="display:flex;align-items:center;gap:12px"><span class="g-cover g-cover--${s}" style="width:36px;height:36px;border-radius:12px"></span><div><h2 class="g-h4">${esc(t.name)}</h2><p class="g-caption">${t.modules.length} módulos · ${p.n}/${p.total} aulas</p></div></div>
            ${locked ? `<button class="g-btn g-btn--sm" data-upsell>${icon("lock", "g-icon--sm")}Desbloquear</button>` : `<div class="g-ring" data-g-ring="${p.pct}" style="--_s:44px;font-size:11px"><span>${p.pct}%</span></div>`}</div>
          <div class="g-scroll--x g-scroll--fade module-rail">${mods.map((m) => `
            <button class="module ${locked ? "is-locked" : ""}" data-module="${t.id}|${m.id}">
              <span class="g-cover g-cover--${s} module-cover">${m.soon ? `<span class="g-badge g-badge--sm g-badge--inverse">Em breve</span>` : locked ? `<span class="g-icon-btn g-icon-btn--sm" style="background:#0b0d1055;border:0;color:#fff">${icon("lock", "g-icon--sm")}</span>` : `<span class="g-icon-btn g-icon-btn--sm g-icon-btn--accent">${icon("play", "g-icon--sm")}</span>`}</span>
              <b>${esc(m.title)}</b><small>${esc(m.desc)}</small><span class="g-caption g-mono">${m.lessons.length || "—"} aulas</span>
            </button>`).join("")}</div></section>`;
      }).join("");
      list.innerHTML = html || `<div class="g-empty"><span class="g-empty__icon">${icon("search")}</span><b style="color:var(--g-text)">Nada encontrado</b><p class="g-caption">Tente outro termo ou filtro.</p></div>`;
      mount(list);
      $$("[data-module]", list).forEach((b) => b.addEventListener("click", () => {
        const [tid, mid] = b.dataset.module.split("|"); const t = TRAILS().find((x) => x.id === tid);
        lessonModal(t, t.modules.find((m) => m.id === mid));
      }));
      $$("[data-upsell]", list).forEach((b) => b.addEventListener("click", upsell));
    };
    $("#q", main).addEventListener("input", render);
    $("#filter", main).addEventListener("g:change", render);
    $("#trail-car", main).addEventListener("g:change", (e) => { if (e.detail.user && !matchMedia("(max-width: 640px)").matches) setTimeout(() => $(e.detail.el.getAttribute("href"))?.scrollIntoView({ behavior: "smooth", block: "start" }), 250); });
    document.addEventListener("graao:progress", render);
    render();
  };

  /* ---------- Notícias ---------- */
  RENDER.noticias = (main) => {
    main.innerHTML = `
      <div class="page-head">
        <p class="g-body">Tecnologia, carreira e mercado selecionados para você evoluir.</p>
        <div class="toolbar">
          <span class="g-pill-input"><input type="search" id="q" placeholder="Buscar notícia…" aria-label="Buscar notícia"><span class="g-pill-input__end">${icon("search", "g-icon--sm")}</span></span>
          <div class="g-segment" data-g-segment id="sort" role="tablist"><button role="tab" aria-selected="true" data-value="recent">${icon("clock", "g-icon--sm")}Recentes</button><button role="tab" aria-selected="false" data-value="hot">${icon("flame", "g-icon--sm")}Em alta</button></div>
        </div>
      </div>
      <div class="g-tabs" data-g-tabs id="cats" role="tablist"><button role="tab" aria-selected="true" data-value="">Todas</button>${D.categories.map((c) => `<button role="tab" aria-selected="false" data-value="${esc(c)}">${esc(c)}</button>`).join("")}</div>
      <div id="news"></div>`;
    const box = $("#news", main);
    const saved = () => new Set(store.get(CONFIG.storage.saved, []));
    const render = () => {
      const q = $("#q", main).value.trim().toLowerCase();
      const cat = $("#cats [aria-selected='true']", main).dataset.value;
      const hot = $("#sort [aria-selected='true']", main).dataset.value === "hot";
      let items = NEWS().filter((n) => (!cat || n.cat === cat) && (!q || (n.title + n.excerpt).toLowerCase().includes(q)));
      items = items.sort((a, b) => hot ? b.hot - a.hot : b.date.localeCompare(a.date));
      if (!items.length) { box.innerHTML = `<div class="g-empty"><span class="g-empty__icon">${icon("news")}</span><b style="color:var(--g-text)">Nenhuma notícia por aqui</b><p class="g-caption">Tente outra categoria.</p></div>`; return; }
      const [top, ...rest] = items, sv = saved();
      const s = CAT_LOOK[top.cat] || "noite";
      box.innerHTML = `
        <div class="news-top">
          <a class="news-hero g-cover g-cover--${s}" href="noticia.html?id=${top.id}" style="${darkText(s) ? "color:#0b0d10" : ""}">
            <span class="g-badge g-badge--inverse">${esc(top.cat)}</span>
            <div><h2 class="g-h2" style="max-width:18ch">${esc(top.title)}</h2><p style="margin-top:12px;opacity:.85;max-width:52ch">${esc(top.excerpt)}</p>
            <div class="g-caption" style="margin-top:16px;color:inherit;opacity:.75;display:flex;gap:14px">${fmtDate(top.date)} · ${top.read} min ${icon("heart", "g-icon--sm")} ${top.likes} ${icon("message", "g-icon--sm")} ${top.comments}</div></div>
          </a>
          <div class="g-card" style="display:grid;gap:2px;align-content:start;padding:12px">${rest.slice(0, 4).map(newsRow).join("")}</div>
        </div>
        <div class="news-grid">${rest.slice(4).concat(rest.length <= 4 ? [] : []).map((n) => {
          const c = CAT_LOOK[n.cat] || "noite";
          return `<article class="g-card g-card--interactive news-card"><a href="noticia.html?id=${n.id}" class="g-cover g-cover--${c}" style="aspect-ratio:16/9;display:block"></a>
            <div style="display:grid;gap:8px;padding:16px 4px 0"><span class="g-badge g-badge--sm" style="justify-self:start">${esc(n.cat)}</span><a href="noticia.html?id=${n.id}" class="g-h4">${esc(n.title)}</a><p class="g-caption">${esc(n.excerpt)}</p>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-top:6px"><span class="g-caption g-mono">${fmtDate(n.date)} · ${n.read} min</span><button class="g-icon-btn g-icon-btn--sm ${sv.has(n.id) ? "g-icon-btn--accent" : ""}" data-save="${n.id}" aria-label="Salvar notícia" aria-pressed="${sv.has(n.id)}">${icon("bookmark", "g-icon--sm")}</button></div></div></article>`;
        }).join("")}</div>`;
      $$("[data-save]", box).forEach((b) => b.addEventListener("click", () => {
        const set = saved(), id = b.dataset.save, on = !set.has(id);
        on ? set.add(id) : set.delete(id); store.set(CONFIG.storage.saved, [...set]);
        b.classList.toggle("g-icon-btn--accent", on); b.setAttribute("aria-pressed", on);
        toast(on ? "Notícia salva" : "Removida dos salvos", { iconId: "bookmark" });
        if (on) completeStep("noticia");
      }));
    };
    $("#q", main).addEventListener("input", render);
    $("#cats", main).addEventListener("g:change", render);
    $("#sort", main).addEventListener("g:change", render);
    render();
  };

  /* ---------- Notícia (artigo) ---------- */
  RENDER.noticia = (main) => {
    const id = new URLSearchParams(location.search).get("id");
    const n = NEWS().find((x) => x.id === id) || NEWS()[0];
    const s = CAT_LOOK[n.cat] || "noite";
    document.title = `${n.title} · graao club`;
    const liked = store.get(CONFIG.storage.likes, []).includes(n.id), sv = store.get(CONFIG.storage.saved, []).includes(n.id);
    main.innerHTML = `
      <div class="g-scroll-progress" data-g-scroll-progress aria-hidden="true"></div>
      <article class="article">
        <div class="g-cover g-cover--${s} article-cover" style="${darkText(s) ? "color:#0b0d10" : ""}"><span class="g-badge g-badge--inverse">${esc(n.cat)}</span><img src="assets/img/${["obj-orbe.svg", "obj-grao.svg", "obj-cubo.svg", "obj-broto.svg"][n.id.charCodeAt(1) % 4]}" alt=""></div>
        <h2 class="g-h1" style="margin-top:28px">${esc(n.title)}</h2>
        <p class="g-lead" style="margin-top:14px">${esc(n.excerpt)}</p>
        <div style="display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin:24px 0;padding:14px 0;border-block:1px solid var(--g-line)">
          <span class="g-caption g-mono">${fmtDate(n.date)} · ${n.read} min de leitura</span>
          <span style="flex:1"></span>
          <button class="g-btn g-btn--sm ${liked ? "g-btn--accent" : ""}" id="like">${icon("heart", "g-icon--sm")}<span>${n.likes + (liked ? 1 : 0)}</span></button>
          <button class="g-btn g-btn--sm ${sv ? "g-btn--accent" : ""}" id="save">${icon("bookmark", "g-icon--sm")}${sv ? "Salva" : "Salvar"}</button>
          <button class="g-btn g-btn--sm" id="share">${icon("share", "g-icon--sm")}Compartilhar</button>
        </div>
        <div class="article-body">${n.body.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
        <p class="g-caption" style="margin-top:28px">Texto de demonstração do graao club.</p>
      </article>
      <section style="max-width:760px;margin:24px auto 0;width:100%"><div class="card-head"><h3 class="g-h4">Leia também</h3><a class="link-more" href="noticias.html">Todas ${icon("arrow-up-right", "g-icon--sm")}</a></div>
        <div class="g-card" style="display:grid;gap:2px;padding:12px">${NEWS().filter((x) => x.id !== n.id).slice(0, 3).map(newsRow).join("")}</div></section>`;
    $("#like", main).addEventListener("click", (e) => {
      const likes = new Set(store.get(CONFIG.storage.likes, [])), on = !likes.has(n.id);
      on ? likes.add(n.id) : likes.delete(n.id); store.set(CONFIG.storage.likes, [...likes]);
      e.currentTarget.classList.toggle("g-btn--accent", on); $("span", e.currentTarget).textContent = n.likes + (on ? 1 : 0);
      if (on) completeStep("noticia");
    });
    $("#save", main).addEventListener("click", (e) => {
      const set = new Set(store.get(CONFIG.storage.saved, [])), on = !set.has(n.id);
      on ? set.add(n.id) : set.delete(n.id); store.set(CONFIG.storage.saved, [...set]);
      e.currentTarget.classList.toggle("g-btn--accent", on); e.currentTarget.lastChild.textContent = on ? "Salva" : "Salvar";
      if (on) completeStep("noticia");
    });
    $("#share", main).addEventListener("click", () => { navigator.clipboard?.writeText(location.href).catch(() => {}); toast("Link copiado", { iconId: "link" }); });
  };

  /* ---------- Comunidade ---------- */
  RENDER.comunidade = (main) => {
    const user = getUser();
    const follows = () => new Set(store.get(CONFIG.storage.follows, []));
    main.innerHTML = `
      <div class="split">
        <div style="display:grid;gap:16px">
          <form class="g-card" id="composer" style="display:grid;gap:12px">
            <div style="display:flex;gap:12px;align-items:start">${avatar(user.name, user.hue)}<div class="g-field" style="flex:1"><textarea id="post-text" placeholder=" " maxlength="600" rows="2"></textarea><label for="post-text">Compartilhe algo com a comunidade…</label></div></div>
            <div style="display:flex;align-items:center;gap:8px"><button type="button" class="g-icon-btn g-tooltip" data-tip="Adicionar imagem" id="add-img" aria-label="Adicionar imagem" aria-pressed="false">${icon("image", "g-icon--sm")}</button><span class="g-caption g-mono" id="count">0/600</span><span style="flex:1"></span><button class="g-btn g-btn--accent g-btn--arrow" type="submit">Publicar ${icon("send", "g-icon--sm")}</button></div>
          </form>
          <div class="g-segment" data-g-segment id="feed-filter" role="tablist" style="justify-self:start"><button role="tab" aria-selected="true" data-value="all">Para você</button><button role="tab" aria-selected="false" data-value="following">Seguindo</button><button role="tab" aria-selected="false" data-value="mine">Minhas</button></div>
          <div id="feed" style="display:grid;gap:16px"></div>
        </div>
        <aside>
          <section class="g-card"><div class="card-head"><h2 class="g-h4">Quem seguir</h2><span class="g-caption">${icon("users", "g-icon--sm")}</span></div><div id="suggest" style="display:grid;gap:2px"></div></section>
          <section class="g-card"><div class="card-head"><h2 class="g-h4">${icon("trophy", "g-icon--sm")} Ranking</h2><a class="link-more" href="ranking.html">Ver tudo ${icon("arrow-up-right", "g-icon--sm")}</a></div>${[...D.users].sort((a, b) => b.points - a.points).slice(0, 5).map((u, i) => rankRow(u, i + 1)).join("")}</section>
        </aside>
      </div>`;
    let withImg = false;
    const feed = $("#feed", main);
    const renderFeed = () => {
      const f = $("#feed-filter [aria-selected='true']", main).dataset.value, fl = follows();
      const posts = allPosts().filter((p) => f === "all" || (f === "mine" && p.mine) || (f === "following" && fl.has(p.user)));
      feed.innerHTML = posts.length ? posts.map(postCard).join("") : `<div class="g-empty"><span class="g-empty__icon">${icon("message")}</span><b style="color:var(--g-text)">${f === "mine" ? "Você ainda não publicou" : "Siga pessoas para ver o que elas compartilham"}</b><p class="g-caption">${f === "mine" ? "Sua primeira publicação vale pontos." : "Veja sugestões ao lado."}</p></div>`;
      wirePosts(feed);
    };
    const renderSuggest = () => {
      const fl = follows();
      $("#suggest", main).innerHTML = D.users.slice(0, 6).map((u) => `<div class="g-row" style="grid-template-columns:auto 1fr auto;cursor:default">${avatar(u.name, u.hue, "g-avatar--sm")}<span><span class="g-row__title">${esc(u.name)}</span><br><span class="g-row__sub">${esc(u.role)}</span></span><button class="g-btn g-btn--sm ${fl.has(u.id) ? "" : "g-btn--solid"}" data-follow="${u.id}">${fl.has(u.id) ? "Seguindo" : "Seguir"}</button></div>`).join("");
      $$("[data-follow]", main).forEach((b) => b.addEventListener("click", () => {
        const set = follows(), id = b.dataset.follow, on = !set.has(id);
        on ? set.add(id) : set.delete(id); store.set(CONFIG.storage.follows, [...set]);
        if (set.size >= 3) completeStep("seguir");
        renderSuggest(); renderFeed();
      }));
    };
    $("#post-text", main).addEventListener("input", (e) => ($("#count", main).textContent = `${e.target.value.length}/600`));
    $("#add-img", main).addEventListener("click", (e) => { withImg = !withImg; e.currentTarget.classList.toggle("g-icon-btn--accent", withImg); e.currentTarget.setAttribute("aria-pressed", withImg); });
    $("#composer", main).addEventListener("submit", (e) => {
      e.preventDefault();
      const ta = $("#post-text", main), text = ta.value.trim();
      if (!text) { ta.focus(); return toast("Escreva algo antes de publicar", { iconId: "message" }); }
      const mine = store.get(CONFIG.storage.posts, []);
      mine.unshift({ id: "u" + Date.now(), mine: true, time: "agora", likes: 0, comments: 0, text, image: withImg ? Math.floor(Math.random() * 360) : 0 });
      store.set(CONFIG.storage.posts, mine);
      ta.value = ""; $("#count", main).textContent = "0/600"; withImg = false; $("#add-img", main).classList.remove("g-icon-btn--accent");
      renderFeed(); completeStep("publicar"); toast("Publicado na comunidade", { iconId: "send" });
    });
    $("#feed-filter", main).addEventListener("g:change", renderFeed);
    renderFeed(); renderSuggest();
    if (location.hash === "#composer") setTimeout(() => $("#post-text", main).focus(), 200);
  };

  /* ---------- Ranking ---------- */
  RENDER.ranking = (main) => {
    const me = getUser(), myPts = GRAAO.points();
    const all = [...D.users, ...(myPts ? [{ id: "me", name: me.name, role: "Você", hue: me.hue, points: myPts, me: true }] : [])].sort((a, b) => b.points - a.points);
    const RULES = D.rules.map((r) => [r.label, r.points]);
    const [a, b, c] = all;
    main.innerHTML = `
      <div class="page-head"><p class="g-body">Aprenda, contribua e suba na temporada de novembro.</p>
        <div class="toolbar"><span class="g-pill-input"><input type="search" id="q" placeholder="Buscar pessoa…" aria-label="Buscar pessoa"><span class="g-pill-input__end">${icon("search", "g-icon--sm")}</span></span>
        <div class="g-segment" data-g-segment id="season" role="tablist"><button role="tab" aria-selected="true" data-value="now">Temporada</button><button role="tab" aria-selected="false" data-value="past">Histórico</button></div></div></div>
      <div class="split">
        <div style="display:grid;gap:16px">
          ${myPts ? "" : `<div class="g-card g-card--raised" style="display:flex;gap:12px;align-items:center">${icon("sparkles")}<span class="g-caption" style="color:var(--g-text-2)">Você ainda não pontuou nesta temporada. Uma aula concluída hoje já coloca você no ranking.</span></div>`}
          <section class="g-card podium-wrap" id="podium">
            <div class="podium">
              ${[[b, 2], [a, 1], [c, 3]].map(([u, pos]) => `<a class="podium-col" href="perfil.html?u=${u.id}" data-pos="${pos}">
                <div class="podium-who">${pos === 1 ? `<span class="g-accent-text">${icon("trophy")}</span>` : ""}${avatar(u.name, u.hue, pos === 1 ? "g-avatar--lg g-avatar--ring" : "g-avatar--lg")}<b>${esc(u.name)}</b><span class="g-caption">${esc(u.role)}</span><span class="g-num g-num--sm">${u.points}<small>pts</small></span></div>
                <div class="podium-bar"><span class="g-num">${pos}</span></div></a>`).join("")}
            </div>
          </section>
          <section class="g-card" style="padding:12px"><div id="rank-list" style="display:grid;gap:2px"></div></section>
        </div>
        <aside>
          <section class="g-card g-cover g-cover--noite" style="padding:24px;border:0">
            <span class="g-eyebrow" style="color:var(--g-accent-text)">Prêmios da temporada</span>
            <img src="assets/img/obj-grao.svg" alt="" style="width:64px;margin:18px 0;filter:drop-shadow(0 16px 20px #000a)">
            <h3 class="g-h3">${D.season.prizeVisible && D.season.prize ? esc(D.season.prize) : "Em breve"}</h3><p class="g-caption" style="margin-top:6px;color:#ffffffaa">Temporada ${esc(D.season.name)} · válida até ${fmtDate(D.season.ends)}.</p>
          </section>
          <section class="g-card"><h2 class="g-h4">Como pontuar</h2><p class="g-caption" style="margin-top:4px">A temporada valoriza aprendizado, ajuda e constância.</p>
            <div style="display:grid;gap:8px;margin-top:14px">${RULES.map(([t, p]) => `<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:14px"><span>${t}</span><span class="g-badge g-badge--sm g-badge--soft">+${p}</span></div>`).join("")}</div>
            <p class="g-caption" style="margin-top:14px">Publicar muitas vezes sem qualidade não gera pontos. O plano amplia o estudo, mas não multiplica a pontuação.</p></section>
          <section class="g-card"><h2 class="g-h4">Temporada anterior</h2><p class="g-caption">Destaques de outubro</p><div style="display:grid;gap:2px;margin-top:10px">${D.lastSeason.map((u, i) => `<div class="g-row" style="grid-template-columns:24px 1fr auto;cursor:default"><span class="g-mono g-caption">${i + 1}</span><span class="g-row__title">${esc(u.name)}</span><span class="g-num g-num--sm">${u.points}<small>pts</small></span></div>`).join("")}</div></section>
        </aside>
      </div>`;
    const render = () => {
      const q = $("#q", main).value.trim().toLowerCase(), past = $("#season [aria-selected='true']", main).dataset.value === "past";
      const src = past ? D.lastSeason.map((u, i) => ({ ...u, id: "s" + i, role: "Outubro", hue: i * 90 })) : all;
      const rows = src.map((u, i) => [u, i + 1]).filter(([u]) => !q || u.name.toLowerCase().includes(q));
      $("#podium", main).hidden = past || !!q;
      $("#rank-list", main).innerHTML = rows.length ? rows.slice(past || q ? 0 : 3).map(([u, pos]) => rankRow(u, pos).replace('class="g-row"', `class="g-row${u.me ? " is-active" : ""}"`)).join("") : `<p class="g-caption" style="padding:16px">Ninguém encontrado.</p>`;
    };
    $("#q", main).addEventListener("input", render);
    $("#season", main).addEventListener("g:change", render);
    render();
  };

  /* ---------- Certificados ---------- */
  RENDER.certificados = (main) => {
    const user = getUser();
    const rows = TRAILS().map((t) => ({ t, p: trailProgress(t), locked: trailLocked(t) }));
    const done = rows.filter((r) => r.p.pct === 100 && r.p.total);
    main.innerHTML = `
      <div class="page-head"><p class="g-body">Conclua uma trilha para emitir um certificado verificável.</p></div>
      ${done.length ? `<div class="cert-grid">${done.map(({ t }) => `
        <article class="g-sheet cert"><div style="display:flex;justify-content:space-between;align-items:start"><img src="assets/img/graao-mark.svg?v=20261112-isotipo" alt="" style="width:36px"><span class="g-badge g-badge--sm">${icon("qr", "g-icon--sm")}Verificável</span></div>
          <span class="g-eyebrow" style="margin-top:28px;display:block">Certificado de conclusão</span><h3 class="g-h3" style="margin-top:8px">${esc(t.name)}</h3>
          <p class="g-caption" style="margin-top:4px">Concedido a <b style="color:var(--g-on-inverse)">${esc(user.name)}</b> · ${new Date().toLocaleDateString("pt-BR")}</p>
          <div style="display:flex;gap:8px;margin-top:20px"><button class="g-btn g-btn--sm g-btn--solid" data-dl>${icon("download", "g-icon--sm")}Baixar</button><button class="g-btn g-btn--sm" data-share style="color:var(--g-on-inverse);border-color:#0b0d1022">${icon("link", "g-icon--sm")}Copiar link</button></div></article>`).join("")}</div>`
        : `<div class="g-empty"><span class="g-empty__icon">${icon("award")}</span><h3 class="g-h4" style="color:var(--g-text)">Nenhum certificado ainda</h3><p class="g-caption">Conclua sua primeira trilha para colher o primeiro.</p><a class="g-btn g-btn--accent g-btn--arrow" href="conteudos.html">Explorar trilhas ${icon("arrow-right", "g-icon--sm")}</a></div>`}
      <section class="g-card"><div class="card-head"><h2 class="g-h4">Progresso por trilha</h2></div>
        <div style="display:grid;gap:2px">${rows.map(({ t, p, locked }) => `<a class="g-row" href="conteudos.html#trilha-${t.id}" style="grid-template-columns:auto 1fr auto">
          <div class="g-ring" data-g-ring="${p.pct}" style="--_s:44px;font-size:11px"><span>${p.pct}%</span></div>
          <span><span class="g-row__title">${esc(t.name)}</span><br><span class="g-row__sub">${p.n}/${p.total} aulas</span></span>
          ${locked ? `<span class="g-badge g-badge--sm">${icon("lock", "g-icon--sm")}${planName(t)}</span>` : p.pct === 100 ? `<span class="g-badge g-badge--sm g-badge--accent">Emitido</span>` : `<span class="g-badge g-badge--sm">Em andamento</span>`}</a>`).join("")}</div></section>`;
    $$("[data-dl]", main).forEach((b) => b.addEventListener("click", () => toast("Download do PDF chega em breve", { iconId: "download" })));
    $$("[data-share]", main).forEach((b) => b.addEventListener("click", () => toast("Link de verificação copiado", { iconId: "link" })));
  };

  /* ---------- Perfil ---------- */
  RENDER.perfil = (main) => {
    const uid = new URLSearchParams(location.search).get("u");
    const other = uid && uid !== "me" ? userById(uid) : null;
    const user = other ? { ...other, username: other.id, bio: "Membro do graao club.", skills: [], links: {} } : getUser();
    const posts = other ? D.posts.filter((p) => p.user === other.id) : store.get(CONFIG.storage.posts, []);
    const pts = other ? other.points : GRAAO.points();
    const certs = other ? 0 : TRAILS().filter((t) => trailProgress(t).pct === 100 && trailProgress(t).total).length;
    const fl = store.get(CONFIG.storage.follows, []);
    main.innerHTML = `
      <section class="profile-cover g-cover g-cover--noite"><img src="assets/img/obj-broto.svg" alt="" class="pc-1"><img src="assets/img/obj-orbe.svg" alt="" class="pc-2"></section>
      <section class="profile-head">
        ${avatar(user.name, user.hue, "g-avatar--xl g-avatar--ring")}
        <div style="flex:1;min-width:0"><h2 class="g-h2">${esc(user.name)}</h2><p class="g-caption" style="margin-top:4px">@${esc(user.username)}${user.role ? ` · ${esc(user.role)}` : ""}${user.city ? ` · ${icon("map-pin", "g-icon--sm")} ${esc(user.city)}` : ""}</p></div>
        ${other ? `<button class="g-btn ${fl.includes(other.id) ? "" : "g-btn--accent"}" id="follow">${fl.includes(other.id) ? "Seguindo" : "Seguir"}</button>` : `<a class="g-btn g-btn--solid" href="configuracoes.html#perfil">${icon("settings", "g-icon--sm")}Editar perfil</a>`}
      </section>
      <section class="g-card profile-stats">
        <div class="g-stat"><span class="g-stat__label">Publicações</span><span class="g-num g-num--lg">${posts.length}</span></div>
        <div class="g-stat"><span class="g-stat__label">Seguidores</span><span class="g-num g-num--lg">${other ? 120 + other.points : 0}</span></div>
        <div class="g-stat"><span class="g-stat__label">Seguindo</span><span class="g-num g-num--lg">${other ? 48 : fl.length}</span></div>
        <div class="g-stat"><span class="g-stat__label">Pontos</span><span class="g-num g-num--lg">${pts}<small>pts</small></span></div>
      </section>
      <div class="g-tabs" data-g-tabs id="ptabs" role="tablist"><button role="tab" aria-selected="true" data-value="posts">Publicações</button><button role="tab" aria-selected="false" data-value="certs">Certificados</button><button role="tab" aria-selected="false" data-value="about">Sobre</button></div>
      <div id="ptab"></div>`;
    const box = $("#ptab", main);
    const render = (k) => {
      if (k === "posts") {
        box.innerHTML = posts.length ? `<div style="display:grid;gap:16px;max-width:760px">${posts.map(postCard).join("")}</div>` : `<div class="g-empty"><span class="g-empty__icon">${icon("message")}</span><b style="color:var(--g-text)">Nenhuma publicação ainda</b>${other ? "" : `<a class="g-btn g-btn--accent" href="comunidade.html#composer">Publicar agora</a>`}</div>`;
        wirePosts(box);
      } else if (k === "certs") {
        box.innerHTML = certs ? `<div class="g-card">${certs} certificado(s) emitido(s). <a class="link-more" href="certificados.html">Ver ${icon("arrow-up-right", "g-icon--sm")}</a></div>` : `<div class="g-empty"><span class="g-empty__icon">${icon("award")}</span><b style="color:var(--g-text)">Nenhum certificado ainda</b></div>`;
      } else {
        const links = Object.entries(user.links || {}).filter(([, v]) => v);
        box.innerHTML = `<div class="g-card" style="display:grid;gap:18px;max-width:760px">
          <div><span class="g-eyebrow">Bio</span><p style="margin-top:6px;line-height:1.7">${esc(user.bio || "Ainda sem bio.")}</p></div>
          <div><span class="g-eyebrow">Competências</span><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">${(user.skills || []).length ? user.skills.map((s) => `<span class="g-badge">${esc(s)}</span>`).join("") : `<span class="g-caption">Nenhuma adicionada.</span>`}</div></div>
          <div><span class="g-eyebrow">Links</span><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">${links.length ? links.map(([k, v]) => `<a class="g-btn g-btn--sm" href="${esc(/^https?:/.test(v) ? v : "https://" + v)}" target="_blank" rel="noopener">${icon({ github: "github", linkedin: "linkedin", instagram: "instagram", youtube: "youtube" }[k] || "link", "g-icon--sm")}${esc(k)}</a>`).join("") : `<span class="g-caption">Nenhum link.</span>`}</div></div></div>`;
      }
    };
    $("#ptabs", main).addEventListener("g:change", (e) => render(e.detail.value));
    $("#follow", main)?.addEventListener("click", (e) => {
      const set = new Set(store.get(CONFIG.storage.follows, [])), on = !set.has(other.id);
      on ? set.add(other.id) : set.delete(other.id); store.set(CONFIG.storage.follows, [...set]);
      e.currentTarget.textContent = on ? "Seguindo" : "Seguir"; e.currentTarget.classList.toggle("g-btn--accent", !on);
      if (set.size >= 3) completeStep("seguir");
    });
    render("posts");
  };

  /* ---------- Ferramentas ---------- */
  const TOOL_APPS = {
    prompt: {
      html: () => `<div class="admin-form" style="display:grid;gap:12px">
        <div class="g-field"><textarea id="tp-goal" placeholder=" " rows="3"></textarea><label for="tp-goal">O que você quer que a IA faça?</label></div>
        <div class="g-field"><input id="tp-aud" placeholder=" "><label for="tp-aud">Para quem é o resultado?</label></div>
        <div class="g-segment" data-g-segment id="tp-fmt" role="tablist"><button type="button" role="tab" aria-selected="true" data-value="lista">Lista</button><button type="button" role="tab" aria-selected="false" data-value="texto">Texto</button><button type="button" role="tab" aria-selected="false" data-value="tabela">Tabela</button></div>
        <button class="g-btn g-btn--accent" type="button" id="tp-go">${icon("sparkles", "g-icon--sm")}Gerar prompt</button>
        <div class="tool-out" id="tp-out" hidden></div>
        <button class="g-btn g-btn--sm" type="button" id="tp-copy" hidden>${icon("copy", "g-icon--sm")}Copiar</button></div>`,
      wire: (w) => {
        $("#tp-go", w).addEventListener("click", () => {
          const goal = $("#tp-goal", w).value.trim();
          if (!goal) return toast("Descreva o que você quer", { iconId: "sparkles" });
          const aud = $("#tp-aud", w).value.trim() || "um público geral";
          const fmt = $("#tp-fmt [aria-selected='true']", w).dataset.value;
          const out = `Contexto: você é um especialista ajudando ${aud}.\n\nTarefa: ${goal}\n\nFormato: responda em ${fmt === "lista" ? "uma lista curta e numerada" : fmt === "tabela" ? "uma tabela com colunas claras" : "texto corrido, em até 3 parágrafos"}.\n\nCritérios de qualidade:\n- Seja específico e prático.\n- Se faltar informação, faça até 2 perguntas antes de responder.\n- Termine com o próximo passo recomendado.`;
          $("#tp-out", w).textContent = out; $("#tp-out", w).hidden = false; $("#tp-copy", w).hidden = false;
        });
        $("#tp-copy", w).addEventListener("click", () => { navigator.clipboard?.writeText($("#tp-out", w).textContent).catch(() => {}); toast("Prompt copiado", { iconId: "copy" }); });
      },
    },
    preco: {
      html: () => `<div class="admin-form" style="display:grid;gap:12px">
        <div class="form-2"><div class="g-field"><input id="pc-h" type="number" min="0" value="40" placeholder=" "><label for="pc-h">Horas estimadas</label></div><div class="g-field"><input id="pc-v" type="number" min="0" value="80" placeholder=" "><label for="pc-v">Valor da sua hora (R$)</label></div></div>
        <div class="form-2"><div class="g-field"><input id="pc-c" type="number" min="0" value="150" placeholder=" "><label for="pc-c">Custos (ferramentas, etc.)</label></div><div class="g-field"><input id="pc-m" type="number" min="0" max="200" value="20" placeholder=" "><label for="pc-m">Margem de segurança (%)</label></div></div>
        <div class="g-card g-card--accent" style="display:grid;gap:6px"><span style="font-size:13px;color:#0b0d10a0">Valor sugerido do projeto</span><span class="g-num g-num--xl" id="pc-out" style="color:#0b0d10"></span><span style="font-size:13px;color:#0b0d10a0" id="pc-split"></span></div></div>`,
      wire: (w) => {
        const calc = () => {
          const h = +$("#pc-h", w).value || 0, v = +$("#pc-v", w).value || 0, c = +$("#pc-c", w).value || 0, m = +$("#pc-m", w).value || 0;
          const total = (h * v + c) * (1 + m / 100);
          const [int, cents] = total.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split(",");
          $("#pc-out", w).innerHTML = `<small style="color:#0b0d1080">R$</small>${int}<small style="color:#0b0d1080">,${cents}</small>`;
          $("#pc-split", w).textContent = `ou 2× de ${(total / 2).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} · entrada de 50% recomendada`;
        };
        $$("input", w).forEach((i) => i.addEventListener("input", calc)); calc();
      },
    },
    paleta: {
      html: () => `<div style="display:grid;gap:14px">
        <div style="display:flex;gap:10px;align-items:center"><input type="color" id="pl-c" value="#c5f82a" aria-label="Cor base" style="width:52px;height:52px;border:0;border-radius:14px;background:none;cursor:pointer"><span class="g-pill-input" style="flex:1"><input id="pl-hex" value="#c5f82a" aria-label="Hex da cor base"></span></div>
        <div class="g-segment" data-g-segment id="pl-mode" role="tablist"><button type="button" role="tab" aria-selected="true" data-value="analoga">Análoga</button><button type="button" role="tab" aria-selected="false" data-value="complementar">Complementar</button><button type="button" role="tab" aria-selected="false" data-value="tons">Tons</button></div>
        <div class="swatches" id="pl-out"></div><p class="g-caption">Toque numa cor para copiar o código.</p></div>`,
      wire: (w) => {
        const toHsl = (hex) => { let [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255); const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2; if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; } return [h, s * 100, l * 100]; };
        const toHex = (h, s, l) => { s /= 100; l /= 100; const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return "#" + [f(0), f(8), f(4)].map((x) => Math.round(x * 255).toString(16).padStart(2, "0")).join(""); };
        const draw = () => {
          const hex = $("#pl-hex", w).value.trim();
          if (!/^#[0-9a-f]{6}$/i.test(hex)) return;
          const [h, s, l] = toHsl(hex), mode = $("#pl-mode [aria-selected='true']", w).dataset.value;
          const cols = mode === "tons" ? [92, 75, l, 35, 15].map((L) => toHex(h, s, L)) : mode === "complementar" ? [toHex(h, s, l), toHex(h, s * .6, Math.min(90, l + 20)), toHex((h + 180) % 360, s, l), toHex((h + 180) % 360, s * .6, Math.max(15, l - 25)), toHex(h, 10, 12)] : [-40, -20, 0, 20, 40].map((d) => toHex((h + d + 360) % 360, s, l));
          $("#pl-out", w).innerHTML = cols.map((c) => { const lum = toHsl(c)[2]; return `<button type="button" style="background:${c};color:${lum > 55 ? "#0b0d10" : "#fff"}" data-hex="${c}">${c}</button>`; }).join("");
          $$("[data-hex]", w).forEach((b) => b.addEventListener("click", () => { navigator.clipboard?.writeText(b.dataset.hex).catch(() => {}); toast(`${b.dataset.hex} copiado`, { iconId: "palette" }); }));
        };
        $("#pl-c", w).addEventListener("input", (e) => { $("#pl-hex", w).value = e.target.value; draw(); });
        $("#pl-hex", w).addEventListener("input", (e) => { if (/^#[0-9a-f]{6}$/i.test(e.target.value)) $("#pl-c", w).value = e.target.value; draw(); });
        $("#pl-mode", w).addEventListener("g:change", draw); draw();
      },
    },
  };

  window.GRAAO_TOOL_APPS = TOOL_APPS;

  RENDER.ferramentas = (main) => {
    const tools = () => D.tools.filter((t) => t.status !== "desligada");
    main.innerHTML = `
      <div class="page-head"><p class="g-body">Ferramentas para acelerar seus estudos e projetos — dentro do graao.</p>
        <div class="toolbar"><span class="g-pill-input"><input type="search" id="q" placeholder="Buscar ferramenta…" aria-label="Buscar ferramenta"><span class="g-pill-input__end">${icon("search", "g-icon--sm")}</span></span>
        <div class="g-segment" data-g-segment id="cat" role="tablist"><button type="button" role="tab" aria-selected="true" data-value="">Todas</button>${D.toolCategories.map((c) => `<button type="button" role="tab" aria-selected="false" data-value="${esc(c)}">${esc(c)}</button>`).join("")}</div></div></div>
      <div class="tools-grid" id="tools"></div>`;
    const grid = $("#tools", main);
    const render = () => {
      const q = $("#q", main).value.trim().toLowerCase(), cat = $("#cat [aria-selected='true']", main).dataset.value;
      const list = tools().filter((t) => (!cat || t.category === cat) && (!q || (t.name + t.desc).toLowerCase().includes(q))).sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      grid.innerHTML = list.length ? list.map((t) => {
        const locked = PLAN_RANK[t.plan || "semente"] > PLAN_RANK[getUser().plan || "semente"];
        return `<button type="button" class="g-card g-card--interactive tool-card" data-tool="${t.id}">
          <div style="display:flex;justify-content:space-between;align-items:start"><span class="g-cover g-cover--${t.safra} tool-icon">${icon(t.icon || "sparkles")}</span>
          <span style="display:flex;gap:6px">${t.featured ? `<span class="g-badge g-badge--sm g-badge--accent">Destaque</span>` : ""}${t.status === "beta" ? `<span class="g-badge g-badge--sm">Beta</span>` : ""}</span></div>
          <div><h3 class="g-h4">${esc(t.name)}</h3><p class="g-caption" style="margin-top:4px">${esc(t.desc)}</p></div>
          <div style="display:flex;justify-content:space-between;align-items:center"><span class="g-caption g-mono">${esc(t.category)} · ${(t.uses || 0).toLocaleString("pt-BR")} usos</span>
          ${locked ? `<span class="g-badge g-badge--sm">${icon("lock", "g-icon--sm")}${({ broto: "Broto", colheita: "Colheita" })[t.plan]}</span>` : `<span class="g-icon-btn g-icon-btn--sm g-icon-btn--accent">${icon(t.kind === "link" ? "arrow-up-right" : "arrow-right", "g-icon--sm")}</span>`}</div></button>`;
      }).join("") : `<div class="g-empty" style="grid-column:1/-1"><span class="g-empty__icon">${icon("sparkles")}</span><b style="color:var(--g-text)">Nenhuma ferramenta encontrada</b></div>`;
      $$("[data-tool]", grid).forEach((b) => b.addEventListener("click", () => openTool(D.tools.find((t) => t.id === b.dataset.tool))));
    };
    const openTool = (t) => {
      if (PLAN_RANK[t.plan || "semente"] > PLAN_RANK[getUser().plan || "semente"]) return upsell();
      t.uses = (t.uses || 0) + 1; window.GRAAO_DB?.save("tools");
      if (t.kind === "link") { if (/^https?:\/\//.test(t.url || "")) window.open(t.url, "_blank", "noopener"); else toast("Link ainda não configurado", { iconId: "link" }); return; }
      const appDef = TOOL_APPS[t.app];
      if (!appDef) return toast("Ferramenta em construção", { iconId: "clock" });
      modal(`<div style="display:flex;gap:12px;align-items:center;margin-bottom:18px"><span class="g-cover g-cover--${t.safra} tool-icon" style="width:44px;height:44px;border-radius:14px;display:grid;place-items:center">${icon(t.icon)}</span><div><span class="g-eyebrow">${esc(t.category)}</span><h3 class="g-h3">${esc(t.name)}</h3></div></div>${appDef.html()}`, { label: t.name, onOpen: (w) => { mount(w); appDef.wire(w); } });
    };
    $("#q", main).addEventListener("input", render);
    $("#cat", main).addEventListener("g:change", render);
    render();
  };

  /* ---------- Configurações ---------- */
  RENDER.configuracoes = (main) => {
    const SECTIONS = [
      ["Conta", [["geral", "grid", "Visão geral"], ["perfil", "user", "Perfil"], ["plano", "tag", "Acesso e turma"]]],
      ["Preferências", [["notificacoes", "bell", "Avisos"], ["aparencia", "palette", "Aparência"], ["acessibilidade", "eye", "Acessibilidade"]]],
      ["Privacidade e segurança", [["seguranca", "lock", "Senha e conta"], ["privacidade", "shield", "Privacidade e dados"]]],
    ];
    main.innerHTML = `<div class="settings">
      <aside class="g-card" style="padding:10px;align-self:start"><nav class="g-sidenav" data-g-spotlight id="snav">${SECTIONS.map(([g, items]) => `<span class="g-sidenav__label">${g}</span>${items.map(([id, ic, l]) => `<a href="#${id}" data-sec="${id}">${icon(ic)}<span>${l}</span></a>`).join("")}`).join("")}</nav></aside>
      <section id="panel" style="display:grid;gap:16px;align-content:start"></section></div>`;
    const panel = $("#panel", main);
    const field = (id, label, value = "", type = "text") => `<div class="g-field"><input id="${id}" type="${type}" placeholder=" " value="${esc(value)}"><label for="${id}">${label}</label></div>`;
    const P = {
      geral() {
        const u = getUser();
        return `<h2 class="g-h3">Visão geral</h2><p class="g-caption">Os pontos principais da sua conta.</p>
          <div class="g-card" style="display:flex;flex-wrap:wrap;gap:16px;align-items:center">${avatar(u.name, u.hue, "g-avatar--lg")}<div style="flex:1"><b>${esc(u.name)}</b><div class="g-caption">${esc(u.email || "sem e-mail")}</div>${u.role ? `<span class="g-badge g-badge--sm g-badge--soft" style="margin-top:6px">${esc(u.role)}</span>` : ""}</div><a class="g-btn" href="#perfil">Editar perfil</a></div>
          <div class="settings-cards">
            <a class="g-card g-card--interactive" href="perfil.html"><span class="g-icon-btn">${icon("user", "g-icon--sm")}</span><span class="g-caption" style="margin-top:14px;display:block">Seu perfil</span><b>@${esc(u.username)}</b></a>
            <a class="g-card g-card--interactive" href="#plano"><span class="g-icon-btn">${icon("tag", "g-icon--sm")}</span><span class="g-caption" style="margin-top:14px;display:block">Acesso e turma</span><b>Conta gratuita</b></a>
            <a class="g-card g-card--interactive" href="#privacidade"><span class="g-icon-btn">${icon("shield", "g-icon--sm")}</span><span class="g-caption" style="margin-top:14px;display:block">Privacidade</span><b>Exportar meus dados</b></a>
          </div>`;
      },
      perfil() {
        const u = getUser();
        return `<h2 class="g-h3">Perfil</h2><p class="g-caption">Seus dados de conta. Não pedimos nem guardamos informações de saúde. <a class="g-accent-text" href="perfil.html">Ver meu perfil</a></p>
          <form class="g-card" id="pf" style="display:grid;gap:12px">
            <span class="g-eyebrow">Identidade</span>
            <div class="form-2">${field("f-name", "Nome", u.name)}${field("f-user", "Nome de usuário", u.username)}</div>
            <div class="form-2">${field("f-role", "Área de atuação (ex.: designer, editor de vídeo)", u.role)}${field("f-company", "Empresa (opcional)", u.company)}</div>
            <span class="g-eyebrow" style="margin-top:8px">Sobre você</span>
            <div class="g-field"><textarea id="f-bio" placeholder=" " maxlength="280">${esc(u.bio)}</textarea><label for="f-bio">Bio</label></div>
            ${field("f-city", "Cidade", u.city)}
            ${field("f-skills", "Competências (separe por vírgula)", (u.skills || []).join(", "))}
            <span class="g-eyebrow" style="margin-top:8px">Redes e links</span>
            <div class="form-2">${field("l-site", "Site / portfólio", u.links?.site)}${field("l-github", "GitHub", u.links?.github)}</div>
            <div class="form-2">${field("l-linkedin", "LinkedIn", u.links?.linkedin)}${field("l-instagram", "Instagram", u.links?.instagram)}</div>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:6px"><a class="g-btn g-btn--quiet" href="#geral">Cancelar</a><button class="g-btn g-btn--accent" type="submit">Salvar alterações</button></div>
          </form>`;
      },
      plano() {
        return `<h2 class="g-h3">Acesso e turma</h2><p class="g-caption">O que a sua conta libera hoje.</p>
          <div class="g-card" style="display:grid;gap:14px">
            <div><span class="g-stat__label">Sua conta</span><div class="g-h4" style="margin-top:6px">Conta gratuita</div></div>
            <p class="g-body">Você já pode usar Meu Dia, Projetos e o Copiloto. A Academia está em preparação.</p>
            <p class="g-body">A primeira turma do programa <b>Da Ideia à Entrega</b> ainda não abriu inscrições. Datas e condições serão divulgadas quando estiverem confirmadas.</p>
            <a class="g-btn g-btn--accent g-btn--arrow" style="justify-self:start" href="index.html#primeira-turma">Conhecer a primeira turma ${icon("arrow-right", "g-icon--sm")}</a>
          </div>`;
      },
      notificacoes() {
        const prefs = store.get(CONFIG.storage.prefs, { turma: true, retomada: false, email: false });
        const items = [["turma", "Novidades da primeira turma", "Inscrições, datas e condições"], ["retomada", "Lembretes para retomar projetos", "No máximo um por semana. Desligado por padrão"], ["email", "Também por e-mail", "Além dos avisos dentro da plataforma"]];
        return `<h2 class="g-h3">Avisos</h2><p class="g-caption">Ainda não enviamos avisos automáticos. Suas escolhas ficam salvas neste navegador e serão respeitadas quando os avisos existirem.</p>
          <div class="g-card" style="display:grid;gap:4px">${items.map(([k, t, s]) => `<label class="g-row" style="grid-template-columns:1fr auto;cursor:pointer"><span><span class="g-row__title">${t}</span><br><span class="g-row__sub">${s}</span></span><span class="g-switch"><input type="checkbox" data-pref="${k}" ${prefs[k] ? "checked" : ""}><span class="g-switch__track"></span></span></label>`).join("")}</div>`;
      },
      aparencia() {
        const cur = store.get(CONFIG.storage.theme, null) || "dark";
        return `<h2 class="g-h3">Aparência</h2><p class="g-caption">Escolha como o graao club aparece para você.</p>
          <div class="g-card" style="display:grid;gap:18px">
            <div class="g-segment" data-g-segment id="theme" role="tablist" style="justify-self:start">${[["system", "monitor", "Sistema"], ["dark", "moon", "Noite"], ["light", "sun", "Dia"]].map(([v, ic, l]) => `<button role="tab" data-value="${v}" aria-selected="${cur === v}">${icon(ic, "g-icon--sm")}${l}</button>`).join("")}</div>
            <div class="theme-previews"><div class="g-noite tp"><span></span><i></i><i></i></div><div class="g-dia tp"><span></span><i></i><i></i></div></div>
          </div>`;
      },
      acessibilidade() {
        const on = window.G?.motion?.current() === "reduce";
        return `<h2 class="g-h3">Acessibilidade</h2><p class="g-caption">Ajuste estímulos e movimento ao seu jeito.</p>
          <div class="g-card" style="display:grid;gap:4px">
            <label class="g-row" style="grid-template-columns:1fr auto;cursor:pointer"><span><span class="g-row__title">Reduzir animações</span><br><span class="g-row__sub">Desliga transições, contadores e efeitos de movimento. Também seguimos a preferência do seu sistema.</span></span><span class="g-switch"><input type="checkbox" id="motion" ${on ? "checked" : ""}><span class="g-switch__track"></span></span></label>
            <a class="g-row" href="#aparencia" style="grid-template-columns:1fr auto"><span><span class="g-row__title">Modo Noite ou Dia</span><br><span class="g-row__sub">Escolha o contraste mais confortável</span></span>${icon("arrow-right", "g-icon--sm")}</a>
          </div>`;
      },
      seguranca() {
        const live = !!window.GRAAO_API?.enabled;
        return `<h2 class="g-h3">Senha e conta</h2><p class="g-caption">${live ? "Troque a senha da sua conta." : "Modo demonstração: nenhuma senha real é salva."}</p>
          <form class="g-card" id="pw" style="display:grid;gap:12px;max-width:520px">${field("pw1", "Nova senha", "", "password")}${field("pw2", "Confirmar senha", "", "password")}<p class="form-error" id="pw-err"></p><button class="g-btn g-btn--accent" type="submit" style="justify-self:start">Salvar senha</button></form>`;
      },
      privacidade() {
        const live = !!window.GRAAO_API?.enabled;
        return `<h2 class="g-h3">Privacidade e dados</h2><p class="g-caption">Seus projetos são privados: a equipe não lê seus briefings. <a class="g-accent-text" href="privacidade.html">Política de privacidade</a></p>
          <div class="g-card" style="display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between"><div><b>Exportar meus dados</b><p class="g-caption">Arquivo JSON com seu perfil, seus projetos, microtarefas e registros.</p></div><button class="g-btn" id="export">${icon("download", "g-icon--sm")}Exportar</button></div>
          <div class="g-card" style="display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between;border-color:color-mix(in srgb,var(--g-danger) 30%,transparent)"><div><b>Apagar todos os meus projetos</b><p class="g-caption">Remove projetos, microtarefas e registros${live ? " do servidor" : " deste navegador"}. Não dá para desfazer.</p></div><button class="g-btn g-btn--hold g-btn--danger" data-g-hold="1800" data-done="Apagado" id="wipe-projects">${icon("trash", "g-icon--sm")}<span data-label>Segure para apagar</span></button></div>
          <div class="g-card" style="display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between;border-color:color-mix(in srgb,var(--g-danger) 30%,transparent)"><div><b>Excluir conta</b><p class="g-caption">${live ? "A exclusão definitiva da conta ainda é feita manualmente pela equipe. O canal oficial para esse pedido está sendo configurado e será publicado na política de privacidade. Este botão encerra a sessão e limpa os dados deste navegador." : "Remove todos os dados deste navegador. Não dá para desfazer."}</p></div><button class="g-btn g-btn--hold g-btn--danger" data-g-hold="1500" data-done="Feito" id="wipe">${icon("logout", "g-icon--sm")}<span data-label>${live ? "Segure para sair e limpar" : "Segure para apagar"}</span></button></div>`;
      },
    };
    const show = () => {
      const id = (location.hash || "#geral").slice(1);
      const key = P[id] ? id : "geral";
      panel.innerHTML = P[key]();
      $$("#snav a", main).forEach((a) => a.setAttribute("aria-current", a.dataset.sec === key ? "page" : "false"));
      $("#snav", main).dispatchEvent(new Event("mouseleave"));
      mount(panel);
      wire(key);
    };
    const wire = (key) => {
      if (key === "perfil") $("#pf", panel).addEventListener("submit", async (e) => {
        e.preventDefault();
        const v = (id) => $("#" + id, panel).value.trim();
        const patch = { name: v("f-name") || "Membro", username: v("f-user").replace(/[^a-z0-9_.]/gi, "").toLowerCase(), role: v("f-role"), company: v("f-company"), bio: v("f-bio"), city: v("f-city"),
          skills: v("f-skills").split(",").map((s) => s.trim()).filter(Boolean), links: { site: v("l-site"), github: v("l-github"), linkedin: v("l-linkedin"), instagram: v("l-instagram") } };
        const api = window.GRAAO_API?.enabled ? window.GRAAO_API : null;
        if (api) {
          const btn = $("button[type=submit]", e.target);
          btn.disabled = true; btn.textContent = "Salvando…";
          const r = await api.updateProfile(patch);
          btn.disabled = false; btn.textContent = "Salvar alterações";
          if (r.error) return toast(r.error, { iconId: "x", duration: 5000 });
        } else saveUser(patch);
        toast("Perfil atualizado");
      });
      if (key === "acessibilidade") $("#motion", panel).addEventListener("change", (e) => {
        window.G?.motion?.(e.target.checked ? "reduce" : "auto");
        toast(e.target.checked ? "Animações reduzidas" : "Animações normais", { iconId: "eye", duration: 1800 });
      });
      if (key === "notificacoes") $$("[data-pref]", panel).forEach((c) => c.addEventListener("change", () => {
        const prefs = store.get(CONFIG.storage.prefs, {}); prefs[c.dataset.pref] = c.checked; store.set(CONFIG.storage.prefs, prefs);
        toast("Preferência salva", { iconId: "bell", duration: 1600 });
      }));
      if (key === "aparencia") $("#theme", panel).addEventListener("g:change", (e) => GRAAO.setTheme(e.detail.value));
      if (key === "seguranca") $("#pw", panel).addEventListener("submit", async (e) => {
        e.preventDefault();
        const a = $("#pw1", panel).value, b = $("#pw2", panel).value, err = $("#pw-err", panel);
        if (a.length < 6) return (err.textContent = "Use pelo menos 6 caracteres.");
        if (a !== b) return (err.textContent = "As senhas não conferem.");
        err.textContent = "";
        if (window.GRAAO_API?.enabled) {
          const btn = $("button[type=submit]", e.target); btn.disabled = true;
          const r = await window.GRAAO_API.updatePassword(a);
          btn.disabled = false;
          if (r.error) return (err.textContent = r.error);
          e.target.reset(); toast("Senha atualizada", { iconId: "lock" });
        } else { e.target.reset(); toast("Modo demonstração: nenhuma senha foi salva", { iconId: "lock" }); }
      });
      if (key === "privacidade") {
        $("#export", panel).addEventListener("click", async (e) => {
          const btn = e.currentTarget; btn.disabled = true;
          const data = { exportado_em: new Date().toISOString(), perfil: getUser(), navegador: {} };
          Object.values(CONFIG.storage).forEach((k) => (data.navegador[k] = store.get(k, null)));
          try { data.projetos = await window.GRAAO_PROJECTS?.exportAll(); }
          catch (err) { btn.disabled = false; return toast("Não foi possível exportar os projetos: " + err.message, { iconId: "x", duration: 5000 }); }
          const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
          const a = Object.assign(document.createElement("a"), { href: url, download: "ia-para-tdah-meus-dados.json" }); a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
          btn.disabled = false;
        });
        $("#wipe-projects", panel).addEventListener("g:confirm", async () => {
          try {
            const PR = window.GRAAO_PROJECTS, list = await PR.list();
            for (const p of list) await PR.remove(p.id);
            toast(`${list.length} projeto(s) apagado(s)`, { iconId: "trash" });
          } catch (err) { toast(err.message, { iconId: "x", duration: 5000 }); }
        });
        $("#wipe", panel).addEventListener("g:confirm", async () => {
          if (window.GRAAO_API?.enabled) {
            // Exclusão definitiva da conta exige a Edge Function account-delete (fase de LGPD). Por enquanto: sai e orienta.
            toast("Sessão encerrada. A exclusão definitiva da conta ainda é manual (ver política de privacidade).", { iconId: "shield", duration: 6000 });
            await window.GRAAO_API.signOut();
          }
          Object.values(CONFIG.storage).forEach((k) => store.del(k));
          setTimeout(() => (location.href = "entrar.html"), 1200);
        });
      }
    };
    addEventListener("hashchange", show);
    show();
  };
})();
