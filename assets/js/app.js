/* IA para TDAH — comportamento compartilhado (site, login, shell do app).
   Depende de graao-icons.js e graao-ds.js (design system). Ver DESIGN_SYSTEM.md.
   Páginas do app: <body data-app-page="id" data-app-title="Título"> + <main class="content">. */
(function () {
  "use strict";

  /* ---------- Config: edite aqui ---------- */
  const CONFIG = {
    plans: {
      // Valores de exemplo — ajuste para os preços reais do IA para TDAH.
      broto:    { monthly: 29.9, yearly: 249.9 },
      colheita: { monthly: 99.9, yearly: 875.8 },
    },
    points: { step: 10, lesson: 2 },
    storage: {
      theme: "graao:theme", cookies: "graao:cookies", user: "graao:user", steps: "graao:steps",
      sidebar: "graao:sidebar", lessons: "graao:lessons", posts: "graao:posts", likes: "graao:likes",
      follows: "graao:follows", prefs: "graao:prefs", saved: "graao:saved",
    },
  };

  const store = {
    get(k, fallback) { try { const v = localStorage.getItem(k); return v === null ? fallback : JSON.parse(v); } catch { return fallback; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage indisponível */ } },
    del(k) { try { localStorage.removeItem(k); } catch { /* */ } },
  };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const icon = (id, cls = "") => `<svg class="g-icon ${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const initials = (name) => String(name || "?").trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  const SAFRA = ["lima", "mar", "sol", "brasa", "uva"];
  const safraFor = (hue = 0) => SAFRA[Math.abs(Math.round(hue / 72)) % SAFRA.length];
  const avatar = (name, hue = 0, cls = "") => `<span class="g-avatar ${cls}" style="background:var(--g-safra-${safraFor(hue)})">${esc(initials(name))}</span>`;
  const fmtDate = (iso) => new Date(iso + "T12:00:00").toLocaleDateString("pt-BR");
  const toast = (msg, opts) => window.G?.toast(msg, opts);
  const modal = (html, opts) => window.G?.modal(html, opts);
  const mount = (el) => window.G?.mount(el);

  /* ---------- Usuário / progresso ---------- */
  function getUser() {
    const u = store.get(CONFIG.storage.user, null) || { name: "Visitante", email: "" };
    return {
      username: (u.email || u.name || "visitante").split("@")[0].toLowerCase().replace(/[^a-z0-9_.]/g, ""),
      plan: "semente", role: "", bio: "", city: "", company: "", skills: [], links: {}, hue: 0,
      ...u,
    };
  }
  const saveUser = (patch) => { const u = { ...getUser(), ...patch }; store.set(CONFIG.storage.user, u); return u; };
  const hasFullAccess = () => getUser().plan !== "semente";
  const points = () => store.get(CONFIG.storage.steps, []).length * CONFIG.points.step + store.get(CONFIG.storage.lessons, []).length * CONFIG.points.lesson;

  function completeStep(id) {
    const s = new Set(store.get(CONFIG.storage.steps, []));
    if (s.has(id)) return false;
    s.add(id); store.set(CONFIG.storage.steps, [...s]);
    refreshProgress();
    toast(`Primeiro passo concluído · +${CONFIG.points.step} pontos`, { iconId: "sparkles" });
    return true;
  }
  function refreshProgress() {
    const done = store.get(CONFIG.storage.steps, []);
    const total = 5, n = done.length, pct = Math.round((n / total) * 100);
    $$("[data-steps-count]").forEach((el) => (el.textContent = `${n}/${total}`));
    $$("[data-steps-bar]").forEach((el) => el.style.setProperty("--v", pct + "%"));
    const b = $(".bubble");
    if (b) { b.style.setProperty("--v", pct); b.hidden = n === total; }
    $$(".step").forEach((s) => s.classList.toggle("is-done", done.includes(s.dataset.step)));
    const pts = points();
    $$("[data-points]").forEach((el) => (el.textContent = pts));
    $$("[data-points-label]").forEach((el) => (el.textContent = `${pts} ${pts === 1 ? "ponto" : "pontos"}`));
  }

  /* ---------- Tema ---------- */
  function resolveTheme(pref) {
    const fallback = document.documentElement.dataset.defaultTheme || "dark";
    const sys = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    return pref === "light" || pref === "dark" ? pref : pref === "system" ? sys : fallback;
  }
  function applyTheme(pref, animate = false) {
    document.documentElement.dataset.theme = resolveTheme(pref);
    $$("[data-theme-toggle]").forEach((b) => {
      const dark = document.documentElement.dataset.theme === "dark";
      b.innerHTML = icon(dark ? "sun" : "moon", "g-icon--sm" + (animate ? " g-icon--swap" : ""));
      b.setAttribute("aria-label", dark ? "Usar modo Dia" : "Usar modo Noite");
    });
  }
  // troca com a varredura diagonal do design system (G.theme); sem ele, troca na hora
  function setTheme(pref) {
    store.set(CONFIG.storage.theme, pref);
    if (window.G && G.theme) G.theme(resolveTheme(pref), () => applyTheme(pref, true));
    else applyTheme(pref);
  }
  function initTheme() {
    if (!document.body.dataset.appPage && !document.getElementById("auth-form")) return; // o site público tem tema próprio
    applyTheme(store.get(CONFIG.storage.theme, null));
    $$("[data-theme-toggle]").forEach((b) => b.addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark")));
  }

  /* ---------- Shell do app ---------- */
  /* IA para TDAH: o caminho principal é Meu Dia → Projetos → Academia → Copiloto → Perfil.
     Áreas legadas continuam acessíveis (sem rotas quebradas), mas fora do caminho principal. */
  const NAV = [
    { group: "Principal", items: [
      ["dashboard", "inicio.html", "target", "Meu Dia"],
      ["projetos", "projetos.html", "folder", "Projetos"],
      ["conteudos", "conteudos.html", "book", "Academia"],
      ["ferramentas", "ferramentas.html", "sparkles", "Copiloto"],
      ["comunidade", "comunidade.html", "message", "Comunidade"],
      ["ranking", "ranking.html", "star", "Ranking"],
    ] },
    { group: "Informação", items: [
      ["noticias", "noticias.html", "news", "Notícias"],
    ] },
    { group: "Conta", items: [
      ["certificados", "certificados.html", "award", "Certificados"],
      ["perfil", "perfil.html", "user", "Perfil"],
      ["configuracoes", "configuracoes.html", "settings", "Configurações"],
      ["ajuda", "index.html#faq", "help", "Ajuda"],
    ] },
  ];
  const TABBAR = [["dashboard", "inicio.html", "target", "Meu Dia"], ["projetos", "projetos.html", "folder", "Projetos"], ["conteudos", "conteudos.html", "book", "Academia"], ["ferramentas", "ferramentas.html", "sparkles", "Copiloto"], ["perfil", "perfil.html", "user", "Perfil"]];

  function renderShell() {
    const realPage = document.body.dataset.appPage;
    if (!realPage) return;
    const page = { noticia: "noticias" }[realPage] || realPage;
    const title = document.body.dataset.appTitle || "";
    const back = document.body.dataset.appBack;
    const main = $("main.content");
    const user = getUser();

    const admin = document.body.dataset.appArea === "admin" ? window.GRAAO_ADMIN : null;
    const nav = admin ? admin.navHtml() : NAV.map((g) => `<span class="g-sidenav__label">${g.group}</span>${g.items.map(([id, href, ic, label]) =>
      `<a href="${href}" aria-label="${esc(label)}"${id === page ? ' aria-current="page"' : ""}>${icon(ic)}<span class="label">${label}</span></a>`).join("")}`).join("");
    const D = window.GRAAO_DATA;
    const ann = (D?.announcements || []).slice(0, 3);
    // só avisos reais cadastrados pela equipe (sem notificações de exemplo)
    const notifs = ann.map((a) => `<a class="g-menu__item notif-item" href="${esc(a.link || "inicio.html")}"><span class="g-avatar g-avatar--sm" style="background:var(--g-accent)">${icon("bell", "g-icon--sm")}</span><span>${esc(a.title)}<small>${esc(fmtDate(a.date))}</small></span></a>`).join("")
      || `<p class="g-caption" style="padding:8px 10px">Nenhum aviso por enquanto.</p>`;
    const corner = admin
      ? `<a class="points-card" href="inicio.html"><span class="g-icon-btn">${icon("arrow-left", "g-icon--sm")}</span><div><b>Voltar ao app</b><div class="g-caption">visão do membro</div></div></a>`
      : `<a class="points-card" href="projetos.html"><span class="g-icon-btn">${icon("folder", "g-icon--sm")}</span><div><b>Retomar projeto</b><div class="g-caption">continue de onde parou</div></div></a>`;

    const app = document.createElement("div");
    app.className = "app" + (admin ? "" : " g-club-shell");
    app.innerHTML = `
      <aside class="sidebar" aria-label="Navegação do app">
        <div class="sidebar-top">
          <a href="index.html" class="brand" aria-label="IA para TDAH — site"><img src="assets/img/graao-mark.svg?v=20261112-isotipo" alt=""><span class="brand-word"><b>IA</b><span class="brand-para">para</span><b>TDAH</b></span></a>
          <button class="g-icon-btn g-icon-btn--sm g-icon-btn--ghost" id="collapse" type="button" aria-label="Recolher menu">${icon("chevron-left", "g-icon--sm")}</button>
        </div>
        ${admin ? `<span class="g-badge g-badge--soft" style="margin:0 6px 6px">${icon("shield", "g-icon--sm")}Painel administrativo</span>` : ""}
        <nav class="g-sidenav" data-g-spotlight>${nav}</nav>
        ${corner}
      </aside>
      <div class="app-main">
        <div class="workspace">
          <header class="topbar">
            <div class="crumbs">
              <button class="g-icon-btn mobile-menu" id="open-drawer" type="button" aria-label="Abrir menu">${icon("menu", "g-icon--sm")}</button>
              ${back ? `<a class="g-icon-btn" href="${esc(back)}" aria-label="Voltar">${icon("arrow-left", "g-icon--sm")}</a>` : ""}
              ${admin ? "" : '<a class="g-club-crumb" href="inicio.html">IA para TDAH</a><span class="g-club-crumb-sep" aria-hidden="true">/</span>'}
              <h1 id="page-title">${esc(title)}</h1>
            </div>
            <div class="top-actions">
              <button class="g-icon-btn" data-theme-toggle type="button" aria-label="Alternar modo"></button>
              <div class="user-wrap">
                <button class="g-icon-btn" type="button" data-g-popover="notif-menu" aria-label="Avisos">${icon("bell", "g-icon--sm")}${ann.length ? `<span class="g-dot">${ann.length}</span>` : ""}</button>
                <div class="g-popover" id="notif-menu"><div class="g-menu" data-g-glide style="width:min(320px,calc(100vw - 24px))">
                  <p class="g-menu__title">Avisos</p>
                  ${notifs}
                </div></div>
              </div>
              <div class="user-wrap">
                <button class="user-pill" type="button" data-g-popover="user-menu" aria-label="Menu do usuário">${avatar(user.name, user.hue, "g-avatar--sm")}<span class="name">${esc(user.name.split(" ")[0])}</span>${icon("chevron-down", "g-icon--sm")}</button>
                <div class="g-popover" id="user-menu"><div class="g-menu" data-g-glide role="menu">
                  <a class="g-menu__item" href="perfil.html" role="menuitem">${icon("user", "g-icon--sm")}Meu perfil</a>
                  <a class="g-menu__item" href="configuracoes.html" role="menuitem">${icon("settings", "g-icon--sm")}Configurações</a>
                  ${admin || !window.GRAAO_API?.enabled || window.GRAAO_API.perms.length ? `<a class="g-menu__item" href="${admin ? "inicio.html" : "admin.html"}" role="menuitem">${icon(admin ? "grid" : "shield", "g-icon--sm")}${admin ? "Voltar ao app" : "Painel administrativo"}</a>` : ""}
                  <a class="g-menu__item" href="design-system.html" role="menuitem">${icon("palette", "g-icon--sm")}Design system</a>
                  <div class="g-menu__sep"></div>
                  <button class="g-menu__item" type="button" role="menuitem" id="logout">${icon("logout", "g-icon--sm")}Sair</button>
                </div></div>
              </div>
            </div>
          </header>
          <div class="main-slot"></div>
          <footer class="app-footer">
            <span>© ${new Date().getFullYear()} IA para TDAH</span>
            <nav aria-label="Rodapé"><a href="index.html#faq">Perguntas frequentes</a><a href="termos.html">Termos</a><a href="privacidade.html">Privacidade</a><a href="design-system.html">Design system</a></nav>
          </footer>
        </div>
      </div>`;
    main.replaceWith(app);
    $(".main-slot", app).replaceWith(main);

    const tabbar = document.createElement("nav");
    tabbar.className = "g-tabbar";
    tabbar.setAttribute("aria-label", "Navegação principal");
    tabbar.dataset.gAutohide = "";
    tabbar.innerHTML = (admin ? admin.tabbar : TABBAR)
      .map(([id, href, ic, label]) => `<a href="${href}" aria-label="${label}" data-tab="${id}"${id === page ? ' aria-current="page"' : ""}>${icon(ic)}<span>${label}</span></a>`).join("");
    document.body.append(tabbar);

    // (a bolha "primeiros passos" do IA para TDAH saiu: o Meu Dia agora mostra a próxima ação do projeto)
  }

  function initShell() {
    const app = $(".app");
    if (!app) return;
    if (store.get(CONFIG.storage.sidebar, false)) app.classList.add("collapsed");
    const collapse = $("#collapse");
    const phoneNav = matchMedia("(max-width: 860px)");
    const sidebar = $(".sidebar", app), drawerButton = $("#open-drawer");
    sidebar.id = "g-club-navigation";
    drawerButton.setAttribute("aria-controls", sidebar.id);
    const setDrawer = (open) => {
      app.classList.toggle("drawer", open);
      sidebar.inert = phoneNav.matches && !open;
      $(".app-main", app).inert = phoneNav.matches && open;
      const tabbar = $(".g-tabbar"); if (tabbar) tabbar.inert = phoneNav.matches && open;
      drawerButton.setAttribute("aria-expanded", String(open));
    };
    const updateCollapse = () => { collapse.setAttribute("aria-expanded", String(!app.classList.contains("collapsed"))); collapse.setAttribute("aria-label", phoneNav.matches ? "Fechar menu" : app.classList.contains("collapsed") ? "Expandir menu" : "Recolher menu"); };
    updateCollapse();
    setDrawer(false);
    phoneNav.addEventListener("change", () => { setDrawer(false); updateCollapse(); });
    collapse.addEventListener("click", () => { if (phoneNav.matches) { setDrawer(false); drawerButton.focus(); return; } store.set(CONFIG.storage.sidebar, app.classList.toggle("collapsed")); updateCollapse(); $(".g-sidenav").dispatchEvent(new Event("mouseleave")); });
    drawerButton.addEventListener("click", (e) => { e.stopPropagation(); setDrawer(true); collapse.focus(); });
    document.addEventListener("click", (e) => { if (app.classList.contains("drawer") && !e.target.closest(".sidebar")) setDrawer(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && app.classList.contains("drawer")) { setDrawer(false); drawerButton.focus(); } });
    $("[data-g-popover='notif-menu'] .g-dot")?.parentElement.addEventListener("click", (e) => e.currentTarget.querySelector(".g-dot")?.remove(), { once: true });
    $("#logout").addEventListener("click", async () => {
      if (window.GRAAO_API?.enabled) await window.GRAAO_API.signOut(); else store.del(CONFIG.storage.user);
      location.href = "entrar.html";
    });
    refreshProgress();
  }

  /* ---------- Site público ---------- */
  function initLanding() {
    const header = $(".site-header");
    if (header) {
      const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 10);
      addEventListener("scroll", onScroll, { passive: true }); onScroll();
      $(".menu-toggle", header)?.addEventListener("click", (e) => {
        e.stopPropagation();
        e.currentTarget.setAttribute("aria-expanded", String(header.classList.toggle("nav-open")));
      });
      $$("nav a", header).forEach((a) => a.addEventListener("click", () => header.classList.remove("nav-open")));
    }

    // carrossel do hero: o detalhe embaixo acompanha o card em foco
    const car = $("#hero-carousel");
    if (car) {
      const detail = $("#hero-detail");
      const sync = (el) => {
        const d = el.querySelector(".g-media-card")?.dataset;
        if (!d || !detail) return;
        $("[data-d-title]", detail).textContent = d.title;
        $("[data-d-desc]", detail).textContent = d.desc;
        $("[data-d-meta]", detail).textContent = d.meta;
      };
      car.addEventListener("g:change", (e) => sync(e.detail.el));
      sync($(".g-carousel__item[aria-current='true']", car) || $$(".g-carousel__item", car)[2]);
    }

    (window.GRAAO_DATA?.plans || []).forEach((p) => { if (CONFIG.plans[p.id]) CONFIG.plans[p.id] = { monthly: +p.monthly, yearly: +p.yearly }; });
    const fmt = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    const renderPrices = (mode) => $$("[data-plan]").forEach((card) => {
      const p = CONFIG.plans[card.dataset.plan];
      if (!p) return;
      const v = mode === "yearly" ? p.yearly / 12 : p.monthly;
      const [int, cents] = fmt(v).replace("R$", "").trim().split(",");
      $(".plan-value", card).innerHTML = `<small>R$</small>${int}<small>,${cents}/mês</small>`;
      $(".plan-note", card).textContent = mode === "yearly" ? `${fmt(p.yearly)} por ano, à vista` : "Cobrança mensal, cancele quando quiser";
    });
    const billing = $("#billing");
    if (billing) { billing.addEventListener("g:change", (e) => renderPrices(e.detail.value)); renderPrices("yearly"); }

    $$(".faq details").forEach((d) => d.addEventListener("toggle", () => { if (d.open) $$(".faq details").forEach((o) => o !== d && (o.open = false)); }));
    $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  }

  function initCookies() {
    const el = $(".cookie");
    if (!el) return;
    setTimeout(() => { if (!store.get(CONFIG.storage.cookies, null)) el.classList.add("show"); }, 900);
    $$("[data-cookie]", el).forEach((b) => b.addEventListener("click", () => { store.set(CONFIG.storage.cookies, b.dataset.cookie); el.classList.remove("show"); }));
  }

  /* ---------- Login (Supabase quando configurado; demonstração caso contrário) ---------- */
  const API = () => (window.GRAAO_API?.enabled ? window.GRAAO_API : null);
  // Só aceita destinos internos (evita redirecionamento para outro site)
  const safeNext = (v) => (v && /^[a-z0-9-]+(\.html)?([?#][^\s]*)?$/i.test(v) ? v : "inicio.html");

  function initAuth() {
    const form = $("#auth-form");
    if (!form) return;
    const api = API();
    const params = new URLSearchParams(location.search);
    const mode = params.get("modo");
    const signup = mode === "cadastro";
    const newPassword = mode === "nova-senha";
    const next = safeNext(params.get("callbackUrl"));
    const err = $(".form-error");
    const submit = $("#submit"), label = $("#submit-label");
    const pw = $("#password"), eye = $("#toggle-pw");
    const busy = (on, text) => { submit.disabled = on; submit.setAttribute("aria-busy", String(on)); if (text) label.textContent = text; };
    const fail = (msg, field) => { err.textContent = msg; if (field) field.closest(".g-field").classList.add("g-field--error"); };

    if (signup) {
      $("#auth-title").textContent = "Crie sua conta";
      $("#auth-sub").textContent = "Organize seus projetos e acompanhe as novidades da primeira turma.";
      $("#name-field").hidden = false;
      $("#art-title").textContent = "Suas ideias merecem chegar até a entrega.";
      $("#art-sub").textContent = "Sua mente cria. Seu sistema entrega.";
      label.textContent = "Criar conta";
      $("#forgot").hidden = true;
      $("#switch").innerHTML = 'Já tem conta? <a class="g-accent-text" href="entrar.html">Entrar</a>';
      pw.autocomplete = "new-password";
      document.title = "Criar conta · IA para TDAH";
    }
    if (newPassword) {
      $("#auth-title").textContent = "Defina uma nova senha";
      $("#auth-sub").textContent = "Escolha uma senha com pelo menos 6 caracteres.";
      $("#email").closest(".g-field").hidden = true;
      $("#forgot").hidden = true;
      $("#switch").hidden = true;
      label.textContent = "Salvar nova senha";
      pw.autocomplete = "new-password";
    }

    eye.addEventListener("click", () => {
      const show = pw.type === "password";
      pw.type = show ? "text" : "password";
      eye.innerHTML = icon(show ? "eye-off" : "eye", "g-icon--sm");
      eye.setAttribute("aria-label", show ? "Ocultar senha" : "Mostrar senha");
    });

    // Google via Supabase Auth (só aparece quando o provedor estiver configurado). Sem login com Apple.
    if (api && window.GRAAO_ENV?.googleAuth && !newPassword) {
      $("#social").hidden = false;
      $("#social-divider").hidden = false;
      $("#google-btn").addEventListener("click", async () => { const r = await api.signInWithGoogle(next); if (r.error) fail(r.error); });
    }

    $("#forgot")?.addEventListener("click", async (e) => {
      e.preventDefault();
      if (!api) return toast("Recuperação de senha disponível quando o backend estiver ativo", { iconId: "lock" });
      const email = $("#email").value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Digite seu e-mail acima e toque em “Esqueci minha senha” de novo.", $("#email"));
      const r = await api.resetPassword(email);
      if (r.error) return fail(r.error);
      err.textContent = "";
      toast("Se houver uma conta, enviamos um link para redefinir a senha.", { iconId: "send", duration: 5000 });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = $("#email").value.trim();
      $$(".g-field").forEach((f) => f.classList.remove("g-field--error"));
      err.textContent = "";
      if (!newPassword && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Informe um e-mail válido.", $("#email"));
      if (pw.value.length < 6) return fail("A senha precisa ter pelo menos 6 caracteres.", pw);
      const raw = (signup && $("#name").value.trim()) || email.split("@")[0];
      const name = raw.charAt(0).toUpperCase() + raw.slice(1);

      if (!api) { // modo demonstração
        const prev = store.get(CONFIG.storage.user, null);
        store.set(CONFIG.storage.user, prev && prev.email === email ? prev : { name, email });
        location.href = next;
        return;
      }

      const original = label.textContent;
      busy(true, newPassword ? "Salvando…" : signup ? "Criando conta…" : "Entrando…");
      const r = newPassword ? await api.updatePassword(pw.value)
        : signup ? await api.signUp({ name, email, password: pw.value })
        : await api.signIn({ email, password: pw.value });
      busy(false, original);
      if (r.error) return fail(r.error);
      if (newPassword) { toast("Senha atualizada"); setTimeout(() => (location.href = "inicio.html"), 700); return; }
      if (r.needsConfirmation) {
        form.innerHTML = `<span class="g-eyebrow">Quase lá</span><h1 class="g-h3">Confirme seu e-mail</h1>
          <p class="g-body">Enviamos um link para <b style="color:var(--g-text)">${esc(email)}</b>. Abra o e-mail e toque no link para ativar sua conta.</p>
          <a class="g-btn g-btn--lg g-btn--block" href="entrar.html">Voltar para entrar</a>`;
        return;
      }
      location.href = next;
    });
  }

  window.GRAAO = { CONFIG, store, $, $$, icon, esc, toast, modal, mount, avatar, safraFor, initials, fmtDate, getUser, saveUser, hasFullAccess, points, completeStep, refreshProgress, setTheme, applyTheme };

  document.addEventListener("DOMContentLoaded", async () => {
    const api = API();
    if (api) {
      let session = null;
      try { session = await api.ready(); } catch (e) { console.warn("graao: falha ao carregar sessão", e); }
      const isApp = !!document.body.dataset.appPage;
      const isAuth = !!document.getElementById("auth-form");
      const mode = new URLSearchParams(location.search).get("modo");
      if (isApp && !session) {
        const here = location.pathname.split("/").pop() + location.search + location.hash;
        location.replace("entrar.html?callbackUrl=" + encodeURIComponent(here || "inicio.html"));
        return;
      }
      if (isAuth && session && mode !== "nova-senha") {
        location.replace(safeNext(new URLSearchParams(location.search).get("callbackUrl")));
        return;
      }
    }
    renderShell();
    initTheme();
    mount(document);
    initShell();
    initLanding();
    initCookies();
    initAuth();
    document.dispatchEvent(new CustomEvent("graao:ready"));
  });
})();
