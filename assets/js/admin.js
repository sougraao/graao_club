/* =====================================================================
   graao club — Painel administrativo (admin.html#/rota)
   Arquitetura: rotas → permissões → papéis (ADMIN / STAFF / EDITOR), prefixo mais específico vence.
   Tudo usa o design system Safra (DESIGN_SYSTEM.md). Dados: window.GRAAO_DATA + GRAAO_DB.save().
   ATENÇÃO: controle de acesso aqui é só demonstração no navegador — em produção, valide no servidor.
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- Permissões e papéis ---------- */
  const PERMS = {
    "dashboard.view": ["Visão geral", "Ver painel inicial"],
    "analytics.view": ["Visão geral", "Ver analytics"],
    "content.manage": ["Conteúdo", "Gerenciar trilhas, módulos e aulas"],
    "tools.manage": ["Conteúdo", "Gerenciar ferramentas"],
    "news.manage": ["Conteúdo", "Gerenciar notícias"],
    "community.moderate": ["Comunidade", "Moderar denúncias e posts"],
    "support.tickets": ["Comunidade", "Atender chamados e ideias"],
    "ranking.manage": ["Engajamento", "Regras de pontos e temporada"],
    "push.send": ["Engajamento", "Enviar avisos"],
    "users.view": ["Pessoas", "Ver membros"],
    "users.manage": ["Pessoas", "Editar membros, plano e bloqueio"],
    "roles.manage": ["Pessoas", "Mudar papéis da equipe"],
    "sales.manage": ["Vendas", "Planos, preços e cupons"],
    "settings.manage": ["Sistema", "Configurações da plataforma"],
  };
  const ROLES = {
    ADMIN: { label: "Administrador", perms: Object.keys(PERMS) },
    STAFF: { label: "Equipe", perms: ["dashboard.view", "analytics.view", "content.manage", "tools.manage", "news.manage", "community.moderate", "support.tickets", "ranking.manage", "push.send", "users.view", "users.manage"] },
    EDITOR: { label: "Editor", perms: ["dashboard.view", "content.manage", "tools.manage", "news.manage", "community.moderate"] },
  };
  const ROUTES = [
    ["painel", "Visão geral", "Painel", "grid", "dashboard.view"],
    ["analytics", "Visão geral", "Analytics", "activity", "analytics.view"],
    ["trilhas", "Conteúdo", "Trilhas e aulas", "play", "content.manage"],
    ["ferramentas", "Conteúdo", "Ferramentas", "sparkles", "tools.manage"],
    ["noticias", "Conteúdo", "Notícias", "news", "news.manage"],
    ["moderacao", "Comunidade", "Moderação", "shield", "community.moderate"],
    ["suporte", "Comunidade", "Chamados e ideias", "help", "support.tickets"],
    ["ranking", "Engajamento", "Ranking e pontos", "trophy", "ranking.manage"],
    ["avisos", "Engajamento", "Avisos", "bell", "push.send"],
    ["membros", "Pessoas", "Membros", "users", "users.view"],
    ["planos", "Vendas", "Planos e cupons", "tag", "sales.manage"],
    ["config", "Sistema", "Configurações", "settings", "settings.manage"],
  ].map(([id, group, label, icon, perm]) => ({ id, group, label, icon, perm }));

  const ROLE_KEY = "graao:admin-role";
  // Com backend: papel e permissões vêm do banco (team_members + my_permissions) e a RLS impõe as regras.
  // Sem backend (demonstração): o seletor "simular papel" escolhe o papel.
  const live = () => !!window.GRAAO_API?.enabled;
  const role = () => {
    if (live()) return window.GRAAO_API.teamRole || "MEMBER";
    try { const r = JSON.parse(localStorage.getItem(ROLE_KEY)); return ROLES[r] ? r : "ADMIN"; } catch (e) { return "ADMIN"; }
  };
  const roleLabel = () => ROLES[role()]?.label || "Membro";
  const can = (perm) => (live() ? window.GRAAO_API.can(perm) : ROLES[role()].perms.includes(perm));
  const routeOf = (id) => ROUTES.find((r) => r.id === id);
  const currentId = () => (location.hash.replace(/^#\/?/, "").split("?")[0] || "painel");

  window.GRAAO_ADMIN = {
    navHtml() {
      let last = "";
      return ROUTES.filter((r) => can(r.perm)).map((r) => {
        const head = r.group !== last ? `<span class="g-sidenav__label">${r.group}</span>` : "";
        last = r.group;
        return `${head}<a href="#/${r.id}" data-route="${r.id}"><svg class="g-icon" aria-hidden="true"><use href="#i-${r.icon}"/></svg><span class="label">${r.label}</span></a>`;
      }).join("");
    },
    tabbar: [["painel", "#/painel", "grid", "Painel"], ["trilhas", "#/trilhas", "play", "Trilhas"], ["moderacao", "#/moderacao", "shield", "Moderação"], ["membros", "#/membros", "users", "Membros"], ["mais", "#/mais", "menu", "Mais"]],
  };

  document.addEventListener("graao:ready", () => {
    if (document.body.dataset.appArea !== "admin") return;
    const { $, $$, icon, esc, toast, modal, mount, avatar, fmtDate } = window.GRAAO;
    const D = window.GRAAO_DATA, DB = window.GRAAO_DB;
    const main = document.querySelector("main.content");
    const fmtMoney = (v) => (+v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    const fmtInt = (v) => (+v || 0).toLocaleString("pt-BR");
    const userName = (id) => (D.users.find((u) => u.id === id) || { name: id }).name;
    const isPhone = () => matchMedia("(max-width: 860px)").matches;
    const SAFRAS = ["lima", "mar", "sol", "brasa", "uva", "noite"];
    const OBJECTS = ["obj-grao.svg", "obj-broto.svg", "obj-orbe.svg", "obj-cubo.svg", "obj-balao.svg"];
    const PLANS = [["semente", "Semente"], ["broto", "Broto"], ["colheita", "Colheita"]];
    const ICONS = ["sparkles", "tag", "palette", "link", "book", "activity", "layers", "qr", "image", "search"];

    /* Seletor de papel (demonstração) na barra superior */
    const roleSel = document.createElement("div");
    roleSel.className = "g-segment g-hide-mobile";
    roleSel.dataset.gSegment = "";
    roleSel.setAttribute("role", "tablist");
    roleSel.setAttribute("aria-label", "Simular papel");
    roleSel.innerHTML = Object.entries(ROLES).map(([k, r]) => `<button type="button" role="tab" data-value="${k}" aria-selected="${k === role()}">${r.label}</button>`).join("");
    if (!live()) $(".top-actions").prepend(roleSel); // só no modo demonstração
    roleSel.addEventListener("g:change", (e) => { localStorage.setItem(ROLE_KEY, JSON.stringify(e.detail.value)); location.reload(); });
    mount(roleSel);

    /* ---------- Formulários ---------- */
    let fid = 0;
    const field = (f, v) => {
      const id = "af" + (++fid);
      const val = v ?? f.value ?? "";
      if (f.type === "switch") return `<label class="g-row" style="grid-template-columns:1fr auto;cursor:pointer;padding:8px 4px"><span><span class="g-row__title">${f.label}</span>${f.hint ? `<br><span class="g-row__sub">${f.hint}</span>` : ""}</span><span class="g-switch"><input type="checkbox" data-k="${f.k}" ${val ? "checked" : ""} ${f.disabled ? "disabled" : ""}><span class="g-switch__track"></span></span></label>`;
      if (f.type === "select") return `<div class="g-field"><select id="${id}" data-k="${f.k}" ${f.disabled ? "disabled" : ""}>${f.options.map((o) => { const [ov, ol] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(ov)}" ${String(ov) === String(val) ? "selected" : ""}>${esc(ol)}</option>`; }).join("")}</select><label for="${id}" style="top:14px;font-size:11px">${f.label}</label>${f.hint ? `<p class="g-field__hint">${f.hint}</p>` : ""}</div>`;
      if (f.type === "textarea") return `<div class="g-field"><textarea id="${id}" data-k="${f.k}" placeholder=" " rows="${f.rows || 3}">${esc(val)}</textarea><label for="${id}">${f.label}</label>${f.hint ? `<p class="g-field__hint">${f.hint}</p>` : ""}</div>`;
      return `<div class="g-field"><input id="${id}" data-k="${f.k}" type="${f.type || "text"}" placeholder=" " value="${esc(val)}" ${f.step ? `step="${f.step}"` : ""} ${f.disabled ? "disabled" : ""}><label for="${id}">${f.label}</label>${f.hint ? `<p class="g-field__hint">${f.hint}</p>` : ""}</div>`;
    };
    const form = (fields, obj = {}) => fields.map((f) => (f.section ? `<span class="g-eyebrow" style="margin-top:6px">${f.section}</span>` : field(f, obj[f.k]))).join("");
    const read = (root, fields) => {
      const out = {};
      fields.filter((f) => f.k).forEach((f) => {
        const el = root.querySelector(`[data-k="${f.k}"]`);
        if (!el) return;
        out[f.k] = f.type === "switch" ? el.checked : f.type === "number" ? +el.value : el.value.trim();
      });
      return out;
    };
    const statusBadge = (s) => {
      const map = { publicado: "on", ativa: "on", ativo: "on", aberto: "warn", "em andamento": "info", pendente: "warn", beta: "info", rascunho: "", desligada: "off", resolvido: "on", resolvida: "on", banido: "off", nova: "info", "em análise": "warn", planejada: "on" };
      return `<span class="g-status g-status--${map[s] ?? ""}">${esc(s || "—")}</span>`;
    };
    const head = (desc, actions = "") => `<div class="page-head"><p class="g-body">${desc}</p><div class="toolbar">${actions}</div></div>`;
    const kpi = (label, value, meta = "", href = "") => `<${href ? `a href="${href}"` : "div"} class="g-card g-stat${href ? " g-card--interactive" : ""}"><span class="g-stat__label">${label}</span><span class="g-num g-num--lg">${value}</span>${meta ? `<span class="g-stat__meta">${meta}</span>` : ""}</${href ? "a" : "div"}>`;
    const save = (...k) => DB.save(...k);

    /* ---------- Lista + detalhe ---------- */
    function masterDetail(opts) {
      const st = { q: "", f: opts.filters?.[0]?.value ?? "all", sel: null };
      const root = opts.root || main;
      root.insertAdjacentHTML("beforeend", `
        <div class="toolbar admin-toolbar">
          <span class="g-pill-input"><input type="search" placeholder="Buscar…" aria-label="Buscar" data-md-q><span class="g-pill-input__end">${icon("search", "g-icon--sm")}</span></span>
          ${opts.filters ? `<div class="g-segment" data-g-segment data-md-f role="tablist">${opts.filters.map((f, i) => `<button role="tab" type="button" data-value="${f.value}" aria-selected="${i === 0}">${f.label}</button>`).join("")}</div>` : ""}
          <span style="flex:1"></span>${opts.onNew ? `<button class="g-btn g-btn--accent" type="button" data-md-new>${icon("plus", "g-icon--sm")}${opts.newLabel || "Novo"}</button>` : ""}
        </div>
        <div class="admin-md"><section class="g-card admin-list" data-md-list></section><section class="g-card admin-detail g-hide-mobile" data-md-detail></section></div>`);
      const list = $("[data-md-list]", root), detail = $("[data-md-detail]", root);
      const filtered = () => opts.items().filter((it) => (st.f === "all" || opts.filters.find((f) => f.value === st.f).test(it)) && (!st.q || opts.text(it).toLowerCase().includes(st.q)));
      const renderList = () => {
        const items = filtered();
        list.innerHTML = items.length ? items.map((it) => `<button type="button" class="g-row admin-row" data-id="${esc(it.id)}" aria-selected="${it.id === st.sel}">${opts.row(it)}</button>`).join("")
          : `<div class="g-empty" style="border:0;background:none"><span class="g-empty__icon">${icon("search")}</span><span class="g-caption">Nada por aqui.</span></div>`;
        $$(".admin-row", list).forEach((b) => b.addEventListener("click", () => open(b.dataset.id)));
      };
      const renderDetail = (it, host, close) => {
        host.innerHTML = it ? "" : `<div class="g-empty" style="border:0;background:none;height:100%"><span class="g-empty__icon">${icon("arrow-left")}</span><span class="g-caption">Selecione um item para editar.</span></div>`;
        if (!it) return;
        opts.detail(it, host, { refresh: () => { renderList(); if (st.sel) open(st.sel, true); }, close: () => { st.sel = null; close?.(); renderList(); renderDetail(null, detail); } });
        mount(host);
      };
      function open(id, keep) {
        st.sel = id;
        const it = opts.items().find((x) => x.id === id);
        renderList();
        if (isPhone() && !keep) {
          modal(`<div data-sheet></div>`, { sheet: true, label: "Editar", onOpen: (w, close) => renderDetail(it, $("[data-sheet]", w), close) });
        } else renderDetail(it, detail);
      }
      $("[data-md-q]", root).addEventListener("input", (e) => { st.q = e.target.value.trim().toLowerCase(); renderList(); });
      $("[data-md-f]", root)?.addEventListener("g:change", (e) => { st.f = e.detail.value; renderList(); });
      mount(root);
      $("[data-md-new]", root)?.addEventListener("click", () => { const it = opts.onNew(); renderList(); open(it.id); toast("Criado como rascunho", { iconId: "plus" }); });
      renderList(); renderDetail(null, detail);
      const first = filtered()[0];
      if (first && !isPhone()) open(first.id);
      return { open, renderList };
    }
    const detailActions = (extra = "") => `<div class="admin-actions">${extra}<span style="flex:1"></span><button class="g-btn g-btn--hold g-btn--danger" type="button" data-g-hold="1100" data-done="Excluído" data-del>${icon("trash", "g-icon--sm")}<span data-label>Segure para excluir</span></button><button class="g-btn g-btn--accent" type="button" data-save>${icon("check", "g-icon--sm")}Salvar</button></div>`;

    /* =================================================================
       SEÇÕES
       ================================================================= */
    const S = {};

    S.painel = () => {
      const pendingReports = D.reports.filter((r) => r.status === "pendente");
      const openTickets = D.tickets.filter((t) => t.status !== "resolvido");
      const series = [42, 58, 51, 73, 66, 88, 94, 81, 102, 97, 118, 126];
      const max = Math.max(...series);
      main.innerHTML = `
        ${head(`Olá, equipe. Você está como <b>${roleLabel()}</b> — o menu mostra só o que este papel pode acessar.`, `${can("push.send") ? `<a class="g-btn" href="#/avisos">${icon("bell", "g-icon--sm")}Novo aviso</a>` : ""}${can("content.manage") ? `<a class="g-btn g-btn--accent" href="#/trilhas">${icon("plus", "g-icon--sm")}Nova trilha</a>` : ""}`)}
        <div class="kpis">
          ${kpi("Membros", `<span data-g-count="${1284 + D.users.length}">0</span>`, `<span class="g-delta">+38 na semana</span>`, can("users.view") ? "#/membros" : "")}
          ${kpi("Trilhas publicadas", D.trails.filter((t) => t.status !== "rascunho").length + `<small>/ ${D.trails.length}</small>`, `${D.trails.reduce((n, t) => n + t.modules.reduce((m, md) => m + md.lessons.length, 0), 0)} aulas`, can("content.manage") ? "#/trilhas" : "")}
          ${kpi("Denúncias pendentes", pendingReports.length, pendingReports.length ? `<span class="g-status g-status--warn">precisa de atenção</span>` : `<span class="g-status g-status--on">tudo em dia</span>`, can("community.moderate") ? "#/moderacao" : "")}
          ${kpi("Chamados abertos", openTickets.length, `${D.ideas.length} ideias recebidas`, can("support.tickets") ? "#/suporte" : "")}
        </div>
        <div class="split">
          <section class="g-card"><div class="card-head"><div><h2 class="g-h4">Novos membros por semana</h2><p class="g-caption">Últimas 12 semanas · demonstração</p></div><span class="g-delta">+${Math.round((series[11] / series[0] - 1) * 100)}%</span></div>
            <div class="g-bars-wrap"><div class="g-bars" style="--max:${max};--h:200px">${series.map((v, i) => `<div class="g-bar${v === max ? " is-peak" : ""}" style="--v:${v}" data-label="S${i + 1}" data-value="${v}"></div>`).join("")}</div></div></section>
          <aside>
            <section class="g-card"><div class="card-head"><h2 class="g-h4">Fila de moderação</h2>${can("community.moderate") ? `<a class="link-more" href="#/moderacao">Abrir ${icon("arrow-up-right", "g-icon--sm")}</a>` : ""}</div>
              ${pendingReports.length ? pendingReports.slice(0, 3).map((r) => `<div class="g-row" style="grid-template-columns:auto 1fr;cursor:default"><span class="g-icon-btn g-icon-btn--sm">${icon("shield", "g-icon--sm")}</span><span><span class="g-row__title">${esc(r.reason)}</span><br><span class="g-row__sub">post de ${esc(userName((D.posts.find((p) => p.id === r.post) || {}).user))} · ${fmtDate(r.date)}</span></span></div>`).join("") : `<p class="g-caption">Nenhuma denúncia pendente.</p>`}</section>
            <section class="g-card"><div class="card-head"><h2 class="g-h4">Chamados</h2>${can("support.tickets") ? `<a class="link-more" href="#/suporte">Abrir ${icon("arrow-up-right", "g-icon--sm")}</a>` : ""}</div>
              ${openTickets.slice(0, 3).map((t) => `<div class="g-row" style="grid-template-columns:1fr auto;cursor:default"><span><span class="g-row__title">${esc(t.subject)}</span><br><span class="g-row__sub">${esc(userName(t.user))} · ${esc(t.category)}</span></span>${statusBadge(t.status)}</div>`).join("") || `<p class="g-caption">Nenhum chamado aberto.</p>`}</section>
          </aside>
        </div>`;
    };

    S.analytics = () => {
      const SERIES = { "7": [12, 18, 15, 22, 19, 27, 31], "30": [42, 58, 51, 73], "90": [140, 188, 212, 260, 244, 301, 322, 298, 340, 372, 390, 415] };
      main.innerHTML = `${head("Crescimento, engajamento e uso das ferramentas. Dados de demonstração.", `<div class="g-segment" data-g-segment id="period" role="tablist"><button role="tab" type="button" data-value="7" aria-selected="false">7 dias</button><button role="tab" type="button" data-value="30" aria-selected="true">30 dias</button><button role="tab" type="button" data-value="90" aria-selected="false">90 dias</button></div>`)}
        <div class="kpis">${kpi("Membros ativos", `<span data-g-count="842">0</span>`, `<span class="g-delta">+6,2%</span>`)}${kpi("Aulas concluídas", `<span data-g-count="3120">0</span>`, `<span class="g-delta">+11%</span>`)}${kpi("Retenção 30 dias", `64<small>%</small>`, `<div class="g-progress" style="width:100%"><div class="g-progress__fill" style="--v:64%"></div></div>`)}${kpi("Posts na comunidade", `<span data-g-count="1206">0</span>`, `<span class="g-delta g-delta--down">−2%</span>`)}</div>
        <div class="split">
          <section class="g-card"><div class="card-head"><h2 class="g-h4">Novos membros</h2></div><div class="g-bars-wrap" id="chart"></div></section>
          <aside><section class="g-card"><div class="card-head"><h2 class="g-h4">Uso das ferramentas</h2></div>${[...D.tools].sort((a, b) => b.uses - a.uses).map((t) => `<div style="display:grid;gap:6px;margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:14px"><span>${esc(t.name)}</span><span class="g-mono g-caption">${fmtInt(t.uses)}</span></div><div class="g-progress g-progress--thin"><div class="g-progress__fill" style="--v:${Math.round((t.uses / Math.max(...D.tools.map((x) => x.uses || 1))) * 100)}%"></div></div></div>`).join("")}</section></aside>
        </div>
        <section class="g-card"><div class="card-head"><h2 class="g-h4">Trilhas por conclusão</h2></div><div class="g-table-wrap" style="border:0"><table class="g-table g-table--stack"><thead><tr><th>Trilha</th><th>Plano</th><th class="g-table__num">Inscritos</th><th>Conclusão</th></tr></thead><tbody>
          ${D.trails.map((t, i) => { const pct = [72, 48, 55, 39, 30][i % 5]; return `<tr><td><b>${esc(t.name)}</b></td><td data-label="Plano">${esc(t.plan || (t.free ? "semente" : "broto"))}</td><td class="g-table__num" data-label="Inscritos">${fmtInt([980, 412, 388, 520, 160][i % 5])}</td><td data-label="Conclusão"><div style="display:flex;align-items:center;gap:10px;min-width:160px"><div class="g-progress g-progress--thin" style="flex:1"><div class="g-progress__fill" style="--v:${pct}%"></div></div><span class="g-mono g-caption">${pct}%</span></div></td></tr>`; }).join("")}
        </tbody></table></div></section>`;
      const draw = (k) => { const s = SERIES[k], max = Math.max(...s); $("#chart", main).innerHTML = `<div class="g-bars" style="--max:${max};--h:220px">${s.map((v, i) => `<div class="g-bar${v === max ? " is-peak" : ""}" style="--v:${v}" data-label="${k === "7" ? ["S", "T", "Q", "Q", "S", "S", "D"][i] : k === "30" ? "Sem " + (i + 1) : "S" + (i + 1)}" data-value="${v}"></div>`).join("")}</div>`; };
      $("#period", main).addEventListener("g:change", (e) => draw(e.detail.value));
      draw("30");
    };

    S.trilhas = () => {
      main.innerHTML = head("Crie trilhas, organize módulos e aulas, e publique quando estiver pronto. Rascunhos não aparecem para os membros.");
      const fields = [
        { section: "Trilha" }, { k: "name", label: "Nome" },
        { k: "plan", label: "Plano necessário", type: "select", options: PLANS },
        { k: "status", label: "Status", type: "select", options: [["publicado", "Publicado"], ["rascunho", "Rascunho"]] },
        { section: "Aparência" }, { k: "safra", label: "Capa (gradiente Safra)", type: "select", options: SAFRAS }, { k: "object", label: "Objeto 3D", type: "select", options: OBJECTS },
      ];
      masterDetail({
        items: () => D.trails, text: (t) => t.name, newLabel: "Nova trilha",
        filters: [{ value: "all", label: "Todas" }, { value: "pub", label: "Publicadas", test: (t) => t.status !== "rascunho" }, { value: "draft", label: "Rascunhos", test: (t) => t.status === "rascunho" }],
        row: (t) => `<span class="g-cover g-cover--${t.safra || "noite"}" style="width:40px;height:40px;border-radius:12px"></span><span><span class="g-row__title">${esc(t.name)}</span><br><span class="g-row__sub">${t.modules.length} módulos · ${esc(t.plan || (t.free ? "semente" : "broto"))}</span></span>${statusBadge(t.status || "publicado")}`,
        onNew: () => { const t = { id: DB.uid("t"), name: "Nova trilha", plan: "broto", status: "rascunho", safra: "noite", object: "obj-grao.svg", modules: [] }; D.trails.unshift(t); save("trails"); return t; },
        detail: (t, host, ctl) => {
          const look = { safra: t.safra || "noite", object: t.object || "obj-grao.svg", plan: t.plan || (t.free ? "semente" : "broto"), status: t.status || "publicado" };
          host.innerHTML = `
            <div class="g-cover g-cover--${look.safra} admin-cover"><img src="assets/img/${look.object}" alt=""><span class="g-badge g-badge--inverse g-badge--sm">${esc(look.plan)}</span></div>
            <div class="admin-form">${form(fields, { ...t, ...look })}</div>
            <div class="card-head" style="margin-top:18px"><h3 class="g-h4">Módulos</h3><button class="g-btn g-btn--sm" type="button" data-add-mod>${icon("plus", "g-icon--sm")}Módulo</button></div>
            <div class="mods">${t.modules.map((m, i) => `<div class="g-row" style="grid-template-columns:auto 1fr auto;cursor:default"><span class="g-mono g-caption">${String(i + 1).padStart(2, "0")}</span><span><span class="g-row__title">${esc(m.title)}</span><br><span class="g-row__sub">${m.soon ? "em breve" : m.lessons.length + " aulas"}</span></span>
              <span style="display:flex;gap:4px"><button class="g-icon-btn g-icon-btn--sm g-icon-btn--ghost" type="button" data-up="${i}" aria-label="Subir" ${i === 0 ? "disabled" : ""}>${icon("chevron-left", "g-icon--sm")}</button><button class="g-icon-btn g-icon-btn--sm" type="button" data-edit-mod="${i}" aria-label="Editar módulo">${icon("settings", "g-icon--sm")}</button></span></div>`).join("") || `<p class="g-caption">Nenhum módulo ainda.</p>`}</div>
            ${detailActions(`<a class="g-btn g-btn--quiet" href="conteudos.html#trilha-${t.id}" target="_blank" rel="noopener">${icon("eye", "g-icon--sm")}Ver no app</a>`)}`;
          $$("[data-up]", host).forEach((b) => (b.querySelector(".g-icon").style.transform = "rotate(90deg)"));
          const modFields = [{ k: "title", label: "Título" }, { k: "desc", label: "Descrição" }, { k: "lessons", label: "Aulas (uma por linha)", type: "textarea", rows: 6 }, { k: "soon", label: "Em breve", type: "switch", hint: "Mostra o módulo bloqueado como 'em breve'" }];
          const editMod = (i) => {
            const m = i === -1 ? { id: DB.uid("m"), title: "Novo módulo", desc: "", lessons: [], soon: false } : t.modules[i];
            modal(`<span class="g-eyebrow">${esc(t.name)}</span><h3 class="g-h3" style="margin:8px 0 16px">${i === -1 ? "Novo módulo" : "Editar módulo"}</h3><div class="admin-form" data-mf>${form(modFields, { ...m, lessons: m.lessons.join("\n") })}</div>
              <div class="admin-actions">${i === -1 ? "" : `<button class="g-btn g-btn--quiet" type="button" data-mdel style="color:var(--g-danger)">${icon("trash", "g-icon--sm")}Remover</button>`}<span style="flex:1"></span><button class="g-btn g-btn--accent" type="button" data-msave>Salvar módulo</button></div>`, {
              label: "Módulo",
              onOpen: (w, close) => {
                $("[data-msave]", w).addEventListener("click", () => {
                  const v = read($("[data-mf]", w), modFields);
                  Object.assign(m, { title: v.title || "Sem título", desc: v.desc, soon: v.soon, lessons: v.lessons.split("\n").map((s) => s.trim()).filter(Boolean) });
                  if (i === -1) t.modules.push(m);
                  save("trails"); close(); ctl.refresh(); toast("Módulo salvo");
                });
                $("[data-mdel]", w)?.addEventListener("click", () => { t.modules.splice(i, 1); save("trails"); close(); ctl.refresh(); toast("Módulo removido", { iconId: "trash" }); });
              },
            });
          };
          $("[data-add-mod]", host).addEventListener("click", () => editMod(-1));
          $$("[data-edit-mod]", host).forEach((b) => b.addEventListener("click", () => editMod(+b.dataset.editMod)));
          $$("[data-up]", host).forEach((b) => b.addEventListener("click", () => { const i = +b.dataset.up; [t.modules[i - 1], t.modules[i]] = [t.modules[i], t.modules[i - 1]]; save("trails"); ctl.refresh(); }));
          $$("[data-k='safra'], [data-k='object']", host).forEach((s) => s.addEventListener("change", () => { const c = $(".admin-cover", host); c.className = `g-cover g-cover--${$("[data-k='safra']", host).value} admin-cover`; $("img", c).src = "assets/img/" + $("[data-k='object']", host).value; }));
          $("[data-save]", host).addEventListener("click", () => { const v = read(host, fields); Object.assign(t, v, { name: v.name || "Sem nome" }); delete t.free; save("trails"); ctl.refresh(); toast(v.status === "publicado" ? "Trilha publicada" : "Rascunho salvo"); });
          $("[data-del]", host).addEventListener("g:confirm", () => { D.trails.splice(D.trails.indexOf(t), 1); save("trails"); ctl.close(); toast("Trilha excluída", { iconId: "trash" }); });
        },
      });
    };

    S.ferramentas = () => {
      main.innerHTML = head("Ferramentas que os membros usam dentro do graao. Internas rodam no app; links abrem um site externo.");
      const fields = [
        { section: "Ferramenta" }, { k: "name", label: "Nome" }, { k: "desc", label: "Descrição", type: "textarea", rows: 2 },
        { k: "category", label: "Categoria", type: "select", options: D.toolCategories },
        { k: "kind", label: "Tipo", type: "select", options: [["interno", "Interna (roda no app)"], ["link", "Link externo"]] },
        { k: "app", label: "Ferramenta interna", type: "select", options: [["prompt", "Gerador de prompts"], ["preco", "Calculadora de projeto"], ["paleta", "Gerador de paleta"]], hint: "Usado quando o tipo é Interna" },
        { k: "url", label: "URL externa", type: "url", hint: "Usado quando o tipo é Link externo" },
        { section: "Acesso e destaque" }, { k: "plan", label: "Plano necessário", type: "select", options: PLANS },
        { k: "status", label: "Status", type: "select", options: [["ativa", "Ativa"], ["beta", "Beta"], ["desligada", "Desligada"]] },
        { k: "featured", label: "Destaque", type: "switch", hint: "Aparece no topo da página de ferramentas" },
        { section: "Aparência" }, { k: "icon", label: "Ícone", type: "select", options: ICONS }, { k: "safra", label: "Cor (Safra)", type: "select", options: SAFRAS },
      ];
      masterDetail({
        items: () => D.tools, text: (t) => t.name + t.category, newLabel: "Nova ferramenta",
        filters: [{ value: "all", label: "Todas" }, ...["ativa", "beta", "desligada"].map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1), test: (t) => t.status === s }))],
        row: (t) => `<span class="g-cover g-cover--${t.safra}" style="width:40px;height:40px;border-radius:12px;display:grid;place-items:center">${icon(t.icon, "g-icon--sm")}</span><span><span class="g-row__title">${esc(t.name)}</span><br><span class="g-row__sub">${esc(t.category)} · ${fmtInt(t.uses)} usos</span></span>${statusBadge(t.status)}`,
        onNew: () => { const t = { id: DB.uid("f"), name: "Nova ferramenta", desc: "", category: D.toolCategories[0], kind: "link", url: "", app: "prompt", icon: "sparkles", safra: "noite", plan: "semente", status: "desligada", featured: false, uses: 0 }; D.tools.unshift(t); save("tools"); return t; },
        detail: (t, host, ctl) => {
          host.innerHTML = `<div class="admin-form">${form(fields, t)}</div>${detailActions(`<a class="g-btn g-btn--quiet" href="ferramentas.html" target="_blank" rel="noopener">${icon("eye", "g-icon--sm")}Ver no app</a>`)}`;
          $("[data-save]", host).addEventListener("click", () => {
            const v = read(host, fields);
            if (v.kind === "link" && v.url && !/^https?:\/\//.test(v.url)) return toast("A URL precisa começar com https://", { iconId: "link" });
            Object.assign(t, v); save("tools"); ctl.refresh(); toast("Ferramenta salva");
          });
          $("[data-del]", host).addEventListener("g:confirm", () => { D.tools.splice(D.tools.indexOf(t), 1); save("tools"); ctl.close(); toast("Ferramenta excluída", { iconId: "trash" }); });
        },
      });
    };

    S.noticias = () => {
      main.innerHTML = head("Curadoria de notícias. Separe os parágrafos do texto com uma linha em branco.");
      const fields = [{ k: "title", label: "Título" }, { k: "cat", label: "Categoria", type: "select", options: D.categories }, { k: "excerpt", label: "Resumo", type: "textarea", rows: 2 }, { k: "body", label: "Texto", type: "textarea", rows: 8 },
        { k: "status", label: "Status", type: "select", options: [["publicado", "Publicado"], ["rascunho", "Rascunho"]] }, { k: "date", label: "Data", type: "date" }, { k: "read", label: "Minutos de leitura", type: "number" }];
      masterDetail({
        items: () => D.news, text: (n) => n.title + n.cat, newLabel: "Nova notícia",
        filters: [{ value: "all", label: "Todas" }, { value: "pub", label: "Publicadas", test: (n) => n.status !== "rascunho" }, { value: "draft", label: "Rascunhos", test: (n) => n.status === "rascunho" }],
        row: (n) => `<span><span class="g-row__title" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${esc(n.title)}</span><span class="g-row__sub">${esc(n.cat)} · ${fmtDate(n.date)}</span></span>${statusBadge(n.status || "publicado")}`,
        onNew: () => { const n = { id: DB.uid("n"), cat: D.categories[0], hue: 262, date: new Date().toISOString().slice(0, 10), read: 3, likes: 0, comments: 0, hot: 0, title: "Nova notícia", excerpt: "", body: [], status: "rascunho" }; D.news.unshift(n); save("news"); return n; },
        detail: (n, host, ctl) => {
          host.innerHTML = `<div class="admin-form">${form(fields, { ...n, body: (n.body || []).join("\n\n"), status: n.status || "publicado" })}</div>${detailActions(`<a class="g-btn g-btn--quiet" href="noticia.html?id=${n.id}" target="_blank" rel="noopener">${icon("eye", "g-icon--sm")}Pré-visualizar</a>`)}`;
          $("[data-save]", host).addEventListener("click", () => { const v = read(host, fields); Object.assign(n, v, { body: v.body.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean) }); save("news"); ctl.refresh(); toast("Notícia salva"); });
          $("[data-del]", host).addEventListener("g:confirm", () => { D.news.splice(D.news.indexOf(n), 1); save("news"); ctl.close(); toast("Notícia excluída", { iconId: "trash" }); });
        },
      });
    };

    S.moderacao = () => {
      main.innerHTML = `${head("Revise denúncias e cuide dos posts da comunidade. Ocultar tira o post do feed sem apagá-lo.", `<div class="g-segment" data-g-segment id="mod-tab" role="tablist"><button role="tab" type="button" data-value="pend" aria-selected="true">Pendentes <span class="g-count">${D.reports.filter((r) => r.status === "pendente").length}</span></button><button role="tab" type="button" data-value="done" aria-selected="false">Resolvidas</button><button role="tab" type="button" data-value="posts" aria-selected="false">Todos os posts</button></div>`)}<div id="mod"></div>`;
      const box = $("#mod", main);
      const postOf = (id) => D.posts.find((p) => p.id === id);
      const resolve = (r, how) => { r.status = "resolvida"; r.resolution = how; save("reports"); };
      const render = (tab) => {
        if (tab === "posts") {
          box.innerHTML = `<div class="g-table-wrap"><table class="g-table g-table--stack"><thead><tr><th>Post</th><th>Autor</th><th class="g-table__num">Curtidas</th><th>Fixado</th><th>Visível</th></tr></thead><tbody>${D.posts.map((p) => `<tr><td style="max-width:420px"><span style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${esc(p.text)}</span></td><td data-label="Autor">${esc(userName(p.user))}</td><td class="g-table__num" data-label="Curtidas">${p.likes}</td>
            <td data-label="Fixado"><label class="g-switch"><input type="checkbox" data-pin="${p.id}" ${p.pinned ? "checked" : ""}><span class="g-switch__track"></span></label></td><td data-label="Visível"><label class="g-switch"><input type="checkbox" data-vis="${p.id}" ${p.hidden ? "" : "checked"}><span class="g-switch__track"></span></label></td></tr>`).join("")}</tbody></table></div>`;
          $$("[data-pin]", box).forEach((c) => c.addEventListener("change", () => { postOf(c.dataset.pin).pinned = c.checked; save("posts"); toast(c.checked ? "Post fixado no topo" : "Post desafixado", { iconId: "bookmark" }); }));
          $$("[data-vis]", box).forEach((c) => c.addEventListener("change", () => { postOf(c.dataset.vis).hidden = !c.checked; save("posts"); toast(c.checked ? "Post visível" : "Post ocultado", { iconId: "eye" }); }));
          return;
        }
        const items = D.reports.filter((r) => (tab === "pend" ? r.status === "pendente" : r.status !== "pendente"));
        box.innerHTML = items.length ? `<div class="report-grid">${items.map((r) => {
          const p = postOf(r.post);
          return `<article class="g-card" data-r="${r.id}" style="display:grid;gap:12px">
            <div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><span class="g-badge g-badge--sm">${icon("shield", "g-icon--sm")}${esc(r.reason)}</span><span class="g-caption g-mono">${fmtDate(r.date)}</span></div>
            <div class="g-card g-card--raised"><b style="font-size:13px">${esc(p ? userName(p.user) : "Post removido")}</b><p class="g-caption" style="margin-top:4px;color:var(--g-text-2)">${esc(p ? p.text : "—")}</p></div>
            <span class="g-caption">Denunciado por ${esc(userName(r.by))}${r.resolution ? ` · decisão: <b>${esc(r.resolution)}</b>` : ""}</span>
            ${r.status === "pendente" ? `<div class="admin-actions" style="margin:0;padding:0;border:0"><button class="g-btn g-btn--sm" type="button" data-keep>${icon("check", "g-icon--sm")}Manter</button><button class="g-btn g-btn--sm g-btn--solid" type="button" data-hide>${icon("eye-off", "g-icon--sm")}Ocultar post</button><span style="flex:1"></span><button class="g-btn g-btn--sm g-btn--hold g-btn--danger" type="button" data-g-hold="1000" data-done="Excluído" data-delpost>${icon("trash", "g-icon--sm")}<span data-label>Segure: excluir</span></button></div>` : ""}
          </article>`;
        }).join("")}</div>` : `<div class="g-empty"><span class="g-empty__icon">${icon("check")}</span><b style="color:var(--g-text)">${tab === "pend" ? "Nenhuma denúncia pendente" : "Nada resolvido ainda"}</b></div>`;
        mount(box);
        $$("[data-r]", box).forEach((card) => {
          const r = D.reports.find((x) => x.id === card.dataset.r);
          $("[data-keep]", card)?.addEventListener("click", () => { resolve(r, "mantido"); render(tab); toast("Denúncia resolvida: post mantido"); });
          $("[data-hide]", card)?.addEventListener("click", () => { const p = postOf(r.post); if (p) { p.hidden = true; save("posts"); } resolve(r, "ocultado"); render(tab); toast("Post ocultado do feed", { iconId: "eye-off", action: "Desfazer", onAction: () => { if (p) { p.hidden = false; save("posts"); } r.status = "pendente"; delete r.resolution; save("reports"); render(tab); } }); });
          $("[data-delpost]", card)?.addEventListener("g:confirm", () => { const i = D.posts.findIndex((x) => x.id === r.post); if (i > -1) D.posts.splice(i, 1); save("posts"); resolve(r, "excluído"); setTimeout(() => render(tab), 600); });
        });
      };
      $("#mod-tab", main).addEventListener("g:change", (e) => render(e.detail.value));
      render("pend");
    };

    S.suporte = () => {
      main.innerHTML = `${head("Responda os chamados dos membros e acompanhe as ideias enviadas.", `<div class="g-segment" data-g-segment id="sup-tab" role="tablist"><button role="tab" type="button" data-value="t" aria-selected="true">Chamados</button><button role="tab" type="button" data-value="i" aria-selected="false">Ideias</button></div>`)}<div id="sup"></div>`;
      const host = $("#sup", main);
      const tickets = () => {
        host.innerHTML = "";
        masterDetail({
          root: host,
          items: () => D.tickets, text: (t) => t.subject + userName(t.user) + t.category,
          filters: [{ value: "all", label: "Todos" }, ...["aberto", "em andamento", "resolvido"].map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1), test: (t) => t.status === s }))],
          row: (t) => `${avatar(userName(t.user), t.user.length * 40, "g-avatar--sm")}<span><span class="g-row__title">${esc(t.subject)}</span><br><span class="g-row__sub">${esc(userName(t.user))} · ${esc(t.category)}</span></span>${statusBadge(t.status)}`,
          detail: (t, h, ctl) => {
            h.innerHTML = `<div class="card-head"><div><h3 class="g-h4">${esc(t.subject)}</h3><p class="g-caption">${esc(userName(t.user))} · ${esc(t.category)} · ${fmtDate(t.date)}</p></div></div>
              <div class="thread">${t.messages.map((m) => `<div class="msg ${m.from === "team" ? "is-team" : ""}"><span class="g-caption">${m.from === "team" ? "Equipe graao" : esc(userName(t.user))}</span><p>${esc(m.text)}</p></div>`).join("")}</div>
              <div class="admin-form" style="margin-top:12px">${field({ k: "reply", label: "Responder como equipe", type: "textarea", rows: 3 })}${field({ k: "status", label: "Status", type: "select", options: ["aberto", "em andamento", "resolvido"] }, t.status)}</div>
              <div class="admin-actions"><span style="flex:1"></span><button class="g-btn g-btn--accent" type="button" data-send>${icon("send", "g-icon--sm")}Enviar</button></div>`;
            $("[data-send]", h).addEventListener("click", () => {
              const txt = $("[data-k='reply']", h).value.trim(), st = $("[data-k='status']", h).value;
              if (txt) t.messages.push({ from: "team", text: txt });
              t.status = txt && st === "aberto" ? "em andamento" : st;
              save("tickets"); ctl.refresh(); toast(txt ? "Resposta enviada" : "Status atualizado", { iconId: "send" });
            });
          },
        });
      };
      const ideas = () => {
        host.innerHTML = `<div class="g-table-wrap"><table class="g-table g-table--stack"><thead><tr><th>Ideia</th><th>Autor</th><th class="g-table__num">Votos</th><th>Status</th></tr></thead><tbody>${[...D.ideas].sort((a, b) => b.votes - a.votes).map((i) => `<tr><td><b>${esc(i.text)}</b></td><td data-label="Autor">${esc(userName(i.user))}</td><td class="g-table__num" data-label="Votos"><span class="g-num g-num--sm">${i.votes}</span></td>
          <td data-label="Status"><span class="g-pill-input" style="height:34px"><select data-idea="${i.id}" aria-label="Status da ideia">${["nova", "em análise", "planejada", "lançada", "recusada"].map((s) => `<option ${s === i.status ? "selected" : ""}>${s}</option>`).join("")}</select><span class="g-pill-input__end" style="width:24px;height:24px">${icon("chevron-down", "g-icon--sm")}</span></span></td></tr>`).join("")}</tbody></table></div>`;
        $$("[data-idea]", host).forEach((s) => s.addEventListener("change", () => { D.ideas.find((i) => i.id === s.dataset.idea).status = s.value; save("ideas"); toast("Status da ideia atualizado"); }));
      };
      $("#sup-tab", main).addEventListener("g:change", (e) => (e.detail.value === "t" ? tickets() : ideas()));
      tickets();
    };

    S.ranking = () => {
      const sorted = [...D.users].sort((a, b) => b.points - a.points);
      main.innerHTML = `${head("Defina quanto vale cada ação, a temporada atual e ajuste pontos manualmente quando preciso.")}
        <div class="split">
          <div style="display:grid;gap:16px">
            <section class="g-card"><div class="card-head"><h2 class="g-h4">Regras de pontuação</h2><button class="g-btn g-btn--accent g-btn--sm" type="button" id="save-rules">Salvar regras</button></div>
              ${D.rules.map((r) => `<div class="g-row" style="grid-template-columns:1fr auto;cursor:default"><span class="g-row__title">${esc(r.label)}</span><div class="g-scrub" data-g-scrub data-min="0" data-max="500" data-step="1" data-rule="${r.id}"><span class="g-scrub__label">+</span><span class="g-scrub__value">${r.points}</span><span class="g-scrub__label">pts</span></div></div>`).join("")}
              <p class="g-caption" style="margin-top:10px">Arraste os números para os lados ou use as setas do teclado.</p></section>
            <section class="g-card"><div class="card-head"><h2 class="g-h4">Ajuste manual de pontos</h2></div><div class="g-table-wrap" style="border:0"><table class="g-table"><thead><tr><th>Membro</th><th class="g-table__num">Pontos</th></tr></thead><tbody>
              ${sorted.map((u) => `<tr><td><div style="display:flex;align-items:center;gap:10px">${avatar(u.name, u.hue, "g-avatar--sm")}<b>${esc(u.name)}</b></div></td><td class="g-table__num"><input class="admin-num" type="number" min="0" value="${u.points}" data-pts="${u.id}" aria-label="Pontos de ${esc(u.name)}"></td></tr>`).join("")}
            </tbody></table></div></section>
          </div>
          <aside><section class="g-card"><h2 class="g-h4">Temporada</h2><div class="admin-form" id="season" style="margin-top:14px">${form([{ k: "name", label: "Nome da temporada" }, { k: "ends", label: "Termina em", type: "date" }, { k: "prize", label: "Prêmio do 1º lugar" }, { k: "prizeVisible", label: "Mostrar prêmio aos membros", type: "switch" }], D.season)}</div><div class="admin-actions"><span style="flex:1"></span><button class="g-btn g-btn--accent" type="button" id="save-season">Salvar temporada</button></div></section></aside>
        </div>`;
      $("#save-rules", main).addEventListener("click", () => { $$("[data-rule]", main).forEach((s) => (D.rules.find((r) => r.id === s.dataset.rule).points = +$(".g-scrub__value", s).textContent)); save("rules"); toast("Regras salvas · já valem no app"); });
      $$("[data-pts]", main).forEach((inp) => inp.addEventListener("change", () => { D.users.find((u) => u.id === inp.dataset.pts).points = Math.max(0, +inp.value || 0); save("users"); toast("Pontos ajustados", { iconId: "trophy" }); }));
      $("#save-season", main).addEventListener("click", () => { Object.assign(D.season, read($("#season", main), [{ k: "name" }, { k: "ends" }, { k: "prize" }, { k: "prizeVisible", type: "switch" }])); save("season"); toast("Temporada salva"); });
    };

    S.avisos = () => {
      const fields = [{ k: "title", label: "Título" }, { k: "body", label: "Mensagem", type: "textarea", rows: 3 }, { k: "audience", label: "Público", type: "select", options: [["todos", "Todos os membros"], ["semente", "Plano Semente"], ["broto", "Plano Broto"], ["colheita", "Plano Colheita"]] }, { k: "link", label: "Abrir ao tocar", type: "select", options: [["inicio.html", "Dashboard"], ["conteudos.html", "Conteúdos"], ["comunidade.html", "Comunidade"], ["ranking.html", "Ranking"], ["ferramentas.html", "Ferramentas"], ["noticias.html", "Notícias"]] }];
      main.innerHTML = `${head("Envie avisos que aparecem no sino de notificações do app.")}
        <div class="split">
          <section class="g-card"><h2 class="g-h4">Novo aviso</h2><div class="admin-form" id="ann" style="margin-top:14px">${form(fields)}</div>
            <div class="admin-actions"><span class="g-caption" id="reach"></span><span style="flex:1"></span><button class="g-btn g-btn--accent g-btn--arrow" type="button" id="send">Enviar aviso ${icon("send", "g-icon--sm")}</button></div></section>
          <aside><section class="g-card"><div class="card-head"><h2 class="g-h4">Enviados</h2></div><div id="sent" style="display:grid;gap:2px"></div></section></aside>
        </div>`;
      const reach = () => { const a = $("[data-k='audience']", main).value; $("#reach", main).textContent = `Alcance estimado: ${fmtInt(a === "todos" ? 1284 + D.users.length : { semente: 980, broto: 240, colheita: 76 }[a])} membros`; };
      const renderSent = () => {
        $("#sent", main).innerHTML = D.announcements.map((a) => `<div class="g-row" style="grid-template-columns:1fr auto;cursor:default"><span><span class="g-row__title">${esc(a.title)}</span><br><span class="g-row__sub">${esc(a.audience)} · ${fmtDate(a.date)}</span></span><button class="g-icon-btn g-icon-btn--sm g-icon-btn--ghost" type="button" data-del-ann="${a.id}" aria-label="Apagar aviso">${icon("trash", "g-icon--sm")}</button></div>`).join("") || `<p class="g-caption">Nenhum aviso enviado.</p>`;
        $$("[data-del-ann]", main).forEach((b) => b.addEventListener("click", () => { D.announcements.splice(D.announcements.findIndex((a) => a.id === b.dataset.delAnn), 1); save("announcements"); renderSent(); toast("Aviso apagado", { iconId: "trash" }); }));
      };
      $("[data-k='audience']", main).addEventListener("change", reach);
      $("#send", main).addEventListener("click", () => {
        const v = read($("#ann", main), fields);
        if (!v.title) return toast("Dê um título ao aviso", { iconId: "bell" });
        D.announcements.unshift({ id: DB.uid("a"), ...v, date: new Date().toISOString().slice(0, 10) });
        save("announcements"); renderSent(); $$("#ann input, #ann textarea", main).forEach((i) => (i.value = "")); toast("Aviso enviado · já aparece no sino", { iconId: "bell" });
      });
      reach(); renderSent();
    };

    S.membros = () => {
      main.innerHTML = head(`Membros da plataforma. ${can("users.manage") ? "Clique para editar plano, pontos e bloqueio." : "Seu papel tem acesso só de leitura."}`);
      const roleOf = (u) => D.team[u.id] || "MEMBER";
      const fields = () => [
        { section: "Acesso" }, { k: "plan", label: "Plano", type: "select", options: PLANS, disabled: !can("users.manage") },
        { k: "role", label: "Papel", type: "select", options: [["MEMBER", "Membro"], ...Object.entries(ROLES).map(([k, r]) => [k, r.label])], disabled: !can("roles.manage"), hint: can("roles.manage") ? "" : "Só o administrador muda papéis." },
        { k: "banned", label: "Bloquear acesso", type: "switch", hint: "O membro não consegue entrar nem publicar", disabled: !can("users.manage") },
        { section: "Engajamento" }, { k: "points", label: "Pontos na temporada", type: "number", disabled: !can("users.manage") },
      ];
      masterDetail({
        items: () => D.users, text: (u) => u.name + u.role,
        filters: [{ value: "all", label: "Todos" }, { value: "team", label: "Equipe", test: (u) => roleOf(u) !== "MEMBER" }, { value: "banned", label: "Bloqueados", test: (u) => u.banned }],
        row: (u) => `${avatar(u.name, u.hue, "g-avatar--sm")}<span><span class="g-row__title">${esc(u.name)}</span><br><span class="g-row__sub">${esc(u.role)} · ${esc(u.plan || "semente")}</span></span>${u.banned ? statusBadge("banido") : roleOf(u) !== "MEMBER" ? `<span class="g-badge g-badge--sm g-badge--soft">${ROLES[roleOf(u)].label}</span>` : `<span class="g-num g-num--sm">${u.points}<small>pts</small></span>`}`,
        detail: (u, host, ctl) => {
          host.innerHTML = `<div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">${avatar(u.name, u.hue, "g-avatar--lg")}<div><h3 class="g-h4">${esc(u.name)}</h3><p class="g-caption">${esc(u.role)} · @${esc(u.id)}</p></div></div>
            <div class="admin-form">${form(fields(), { plan: u.plan || "semente", role: roleOf(u), banned: !!u.banned, points: u.points })}</div>
            <div class="admin-actions"><a class="g-btn g-btn--quiet" href="perfil.html?u=${u.id}" target="_blank" rel="noopener">${icon("user", "g-icon--sm")}Ver perfil</a><span style="flex:1"></span>${can("users.manage") ? `<button class="g-btn g-btn--accent" type="button" data-save>Salvar</button>` : ""}</div>`;
          $("[data-save]", host)?.addEventListener("click", () => {
            const v = read(host, fields());
            Object.assign(u, { plan: v.plan, banned: v.banned, points: Math.max(0, v.points || 0) });
            if (can("roles.manage")) { if (v.role === "MEMBER") delete D.team[u.id]; else D.team[u.id] = v.role; }
            save("users", "team"); ctl.refresh(); toast("Membro atualizado", { iconId: "user" });
          });
        },
      });
    };

    S.planos = () => {
      main.innerHTML = `${head("Preços dos planos (refletem no site) e cupons de desconto.")}
        <section class="g-card"><div class="card-head"><h2 class="g-h4">Planos</h2><button class="g-btn g-btn--accent g-btn--sm" type="button" id="save-plans">Salvar preços</button></div>
          <div class="g-table-wrap" style="border:0"><table class="g-table g-table--stack"><thead><tr><th>Plano</th><th class="g-table__num">Mensal (R$)</th><th class="g-table__num">Anual (R$)</th><th>Ativo</th></tr></thead><tbody>
          ${D.plans.map((p) => `<tr data-plan-row="${p.id}"><td><b>${esc(p.name)}</b></td><td class="g-table__num" data-label="Mensal"><input class="admin-num" type="number" step="0.01" min="0" value="${p.monthly}" data-m ${p.id === "semente" ? "disabled" : ""}></td><td class="g-table__num" data-label="Anual"><input class="admin-num" type="number" step="0.01" min="0" value="${p.yearly}" data-y ${p.id === "semente" ? "disabled" : ""}></td><td data-label="Ativo"><label class="g-switch"><input type="checkbox" data-a ${p.active ? "checked" : ""} ${p.id === "semente" ? "disabled" : ""}><span class="g-switch__track"></span></label></td></tr>`).join("")}
          </tbody></table></div></section>
        <h2 class="g-h4" style="margin-top:8px">Cupons</h2>`;
      $("#save-plans", main).addEventListener("click", () => {
        $$("[data-plan-row]", main).forEach((tr) => { const p = D.plans.find((x) => x.id === tr.dataset.planRow); p.monthly = +$("[data-m]", tr).value; p.yearly = +$("[data-y]", tr).value; p.active = $("[data-a]", tr).checked; });
        save("plans"); toast(`Preços salvos · Broto agora ${fmtMoney(D.plans.find((p) => p.id === "broto").monthly)}/mês`, { iconId: "tag" });
      });
      const fields = [{ k: "code", label: "Código" }, { k: "discount", label: "Desconto (%)", type: "number" }, { k: "plan", label: "Plano", type: "select", options: PLANS.slice(1) }, { k: "limit", label: "Limite de usos", type: "number" }, { k: "ends", label: "Válido até", type: "date" }, { k: "active", label: "Ativo", type: "switch" }];
      masterDetail({
        items: () => D.coupons, text: (c) => c.code, newLabel: "Novo cupom",
        filters: [{ value: "all", label: "Todos" }, { value: "on", label: "Ativos", test: (c) => c.active }, { value: "off", label: "Inativos", test: (c) => !c.active }],
        row: (c) => `<span class="g-badge g-badge--inverse g-mono">${esc(c.code)}</span><span><span class="g-row__title">${c.discount}% no ${esc(c.plan)}</span><br><span class="g-row__sub">${c.uses}/${c.limit} usos · até ${fmtDate(c.ends)}</span></span>${statusBadge(c.active ? "ativo" : "desligada")}`,
        onNew: () => { const c = { id: DB.uid("c"), code: "NOVO" + Math.floor(Math.random() * 90 + 10), discount: 10, plan: "broto", uses: 0, limit: 100, active: false, ends: "2026-12-31" }; D.coupons.unshift(c); save("coupons"); return c; },
        detail: (c, host, ctl) => {
          host.innerHTML = `<div class="admin-form">${form(fields, c)}</div><div class="g-card g-card--raised" style="margin-top:12px"><span class="g-caption">Usos</span><div class="g-progress" style="margin-top:8px"><div class="g-progress__fill" style="--v:${Math.round((c.uses / Math.max(1, c.limit)) * 100)}%"></div></div></div>${detailActions()}`;
          $("[data-save]", host).addEventListener("click", () => { const v = read(host, fields); v.code = v.code.toUpperCase().replace(/[^A-Z0-9-]/g, ""); if (!v.code) return toast("Informe um código", { iconId: "tag" }); if (D.coupons.some((x) => x !== c && x.code === v.code)) return toast("Já existe um cupom com esse código", { iconId: "tag" }); Object.assign(c, v, { discount: Math.min(100, Math.max(1, v.discount)) }); save("coupons"); ctl.refresh(); toast("Cupom salvo", { iconId: "tag" }); });
          $("[data-del]", host).addEventListener("g:confirm", () => { D.coupons.splice(D.coupons.indexOf(c), 1); save("coupons"); ctl.close(); toast("Cupom excluído", { iconId: "trash" }); });
        },
      });
    };

    S.config = () => {
      const fields = [{ k: "name", label: "Nome da plataforma" }, { k: "supportEmail", label: "E-mail de suporte", type: "email" }, { k: "signups", label: "Novos cadastros abertos", type: "switch" }, { k: "maintenance", label: "Modo manutenção", type: "switch", hint: "Mostra um aviso para os membros" }];
      main.innerHTML = `${head("Configurações gerais, papéis da equipe e dados de demonstração.")}
        <div class="split">
          <div style="display:grid;gap:16px">
            <section class="g-card"><h2 class="g-h4">Geral</h2><div class="admin-form" id="cfg" style="margin-top:14px">${form(fields, D.settings)}</div><div class="admin-actions"><span style="flex:1"></span><button class="g-btn g-btn--accent" type="button" id="save-cfg">Salvar</button></div></section>
            <section class="g-card"><div class="card-head"><div><h2 class="g-h4">Papéis e permissões</h2><p class="g-caption">Cada área do painel exige uma permissão. Só o administrador muda papéis.</p></div></div>
              <div class="g-table-wrap" style="border:0"><table class="g-table"><thead><tr><th>Permissão</th>${Object.values(ROLES).map((r) => `<th style="text-align:center">${r.label}</th>`).join("")}</tr></thead><tbody>
              ${Object.entries(PERMS).map(([k, [g, l]]) => `<tr><td><b style="font-size:13.5px">${l}</b><br><span class="g-caption g-mono">${g} · ${k}</span></td>${Object.values(ROLES).map((r) => `<td style="text-align:center">${r.perms.includes(k) ? `<span class="g-accent-text">${icon("check", "g-icon--sm")}</span>` : `<span class="g-caption">—</span>`}</td>`).join("")}</tr>`).join("")}
              </tbody></table></div></section>
          </div>
          <aside><section class="g-card" style="border-color:color-mix(in srgb,var(--g-danger) 30%,transparent)"><h2 class="g-h4">Dados de demonstração</h2><p class="g-caption" style="margin-top:6px">Apaga tudo o que foi editado no painel e volta ao conteúdo original.</p><button class="g-btn g-btn--hold g-btn--danger g-btn--block" style="margin-top:16px" type="button" data-g-hold="1500" data-done="Restaurado" id="reset">${icon("trash", "g-icon--sm")}<span data-label>Segure para restaurar</span></button></section></aside>
        </div>`;
      $("#save-cfg", main).addEventListener("click", () => { Object.assign(D.settings, read($("#cfg", main), fields)); save("settings"); toast("Configurações salvas", { iconId: "settings" }); });
      $("#reset", main).addEventListener("g:confirm", () => { DB.reset(); setTimeout(() => location.reload(), 700); });
    };

    S.mais = () => {
      main.innerHTML = `${head("Todas as áreas do painel.")}<div class="kpis">${ROUTES.filter((r) => can(r.perm)).map((r) => `<a class="g-card g-card--interactive" href="#/${r.id}" style="display:grid;gap:12px"><span class="g-icon-btn">${icon(r.icon, "g-icon--sm")}</span><b>${r.label}</b><span class="g-caption">${r.group}</span></a>`).join("")}</div>`;
    };

    /* ---------- Roteador ---------- */
    function go() {
      let id = currentId();
      const r = routeOf(id);
      $$(".g-sidenav a[data-route]").forEach((a) => a.setAttribute("aria-current", a.dataset.route === id ? "page" : "false"));
      $$(".g-tabbar a").forEach((a) => (a.dataset.tab === id ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
      $(".g-sidenav")?.dispatchEvent(new Event("mouseleave"));
      document.querySelector(".app")?.classList.remove("drawer");
      const title = id === "mais" ? "Mais" : r?.label || "Painel";
      $("#page-title").textContent = title;
      document.title = `${title} · Admin · graao club`;
      if (id !== "mais" && (!r || !can(r.perm))) {
        main.innerHTML = `<div class="g-empty" style="margin-top:24px"><span class="g-empty__icon">${icon("lock")}</span><h3 class="g-h4" style="color:var(--g-text)">Sem permissão</h3><p class="g-caption">O papel ${roleLabel()} não acessa “${esc(r?.label || id)}”.</p><a class="g-btn g-btn--accent" href="#/painel">Ir para o painel</a></div>`;
        return;
      }
      main.innerHTML = "";
      S[id]();
      mount(main);
      scrollTo({ top: 0 });
    }
    addEventListener("hashchange", go);
    go();
  });
})();
