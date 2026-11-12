import { icon, btnArrow } from "../icons.js";
import { BRAND, TRACKS, NEWS, USERS, PLANS, TESTIMONIALS, LAST_SEASON, SEASON_POINTS, ONBOARDING, HELP, art, allModules } from "../data.js";
import { esc, avatar, ago, $, $$, toast, openModal } from "../ui.js";
import { store } from "../store.js";
import { rankingWithMe, rankingCard, who, canAccess, moduloRedirect, certificateModal } from "./pages.js";
import { mk } from "../microkit.js";
import { COURSE } from "../data.js";

const planName = (p) => ({ free: "Semente", start: "Broto", pro: "Colheita" })[p] || p;
const seasonLabel = () => { const d = new Date(); const m = d.toLocaleDateString("pt-BR", { month: "long" }); const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); return `${m[0].toUpperCase() + m.slice(1)} · ${d.getFullYear()} · termina em ${last} de ${m}`; };

// =====================================================================
// /inicio — Dashboard
// =====================================================================
export function dashboardPage() {
  const u = store.user;
  const ob = store.onboarding();
  const obDone = ONBOARDING.filter(([k]) => ob[k]).length;
  const mods = allModules().filter((m) => m.lessons.length);
  const totalLessons = mods.reduce((s, m) => s + m.lessons.length, 0);
  const done = store.lessonsDone();
  const started = mods.filter((m) => store.progress(m.id).length && store.progress(m.id).length < m.lessons.length);
  const current = started[0];
  const rank = rankingWithMe();
  const myPos = rank.findIndex(([k]) => k === "me");
  const accessible = TRACKS.filter((t) => t.modules.some(canAccess)).length;
  const newLessons = mods.slice(0, 4).map((m, i) => ({ m, l: m.lessons[m.lessons.length - 1], date: Date.now() - (i + 1) * 86400e3 * 3 }));
  const posts = store.posts.slice(0, 2);
  return {
    title: "Dashboard",
    html: `
    ${obDone < ONBOARDING.length ? `<section class="card onboarding">
      <div class="card-head"><div><h2>Primeiros passos</h2><p>Complete seu perfil e conheça a comunidade.</p></div><span class="count">${obDone}/${ONBOARDING.length}</span></div>
      <div class="bar"><i style="width:${(obDone / ONBOARDING.length) * 100}%"></i></div>
      <ol class="steps">${ONBOARDING.map(([k, t, d, href], i) => `<li><a href="${href}" class="${ob[k] ? "is-done" : ""}"><span class="step-n">${mk.ring(ob[k] ? "done" : "pending", ob[k] ? 1 : 0)}</span><span><b>${t}</b><small>${d}</small></span>${icon("arrow-right")}</a></li>`).join("")}</ol>
    </section>` : ""}
    <div class="dash">
      <div class="dash-main">
        <div class="hello"><p>Bom te ver de volta</p><h1>Olá, ${esc(u.name.split(" ")[0])}!</h1></div>
        <section class="card next-step">
          <p class="eyebrow tx-brand">Seu próximo passo</p>
          ${current ? `<h2>Continue em ${esc(current.title)}</h2><p>${store.progress(current.id).length} de ${current.lessons.length} aulas concluídas em ${esc(current.track.title)}.</p>${mk.glow("Continuar aula", moduloRedirect(current.id))}`
          : `<h2>Comece por ${esc(COURSE.title)}</h2><p>${esc(COURSE.tagline)} Depois da primeira aula, o seu próximo passo fica sempre aqui.</p>${mk.glow("Começar curso", "/modulo/" + TRACKS[0].modules[0].id)}`}
        </section>
        <section class="card stats mk-glide">
          <div><small>Progresso</small><b>${mk.count(Math.round((done / totalLessons) * 100), "%")}</b><div class="bar"><i style="width:${(done / totalLessons) * 100}%"></i></div><small>${done}/${totalLessons} etapas</small></div>
          <div><small>Pontos</small><b class="tx-brand">${mk.count(store.points())}</b><a href="/ranking#pontos" class="small-link">Como ganhar</a></div>
          <div><small>Ranking</small><b>${myPos >= 0 ? myPos + 1 + "º lugar" : "Ainda não"}</b><a href="/ranking#pontos" class="small-link">${myPos >= 0 ? "Ver ranking" : "Como entrar"}</a></div>
        </section>
        <section class="card">
          <div class="card-head"><div><h2>Novas aulas</h2><p>Conteúdos adicionados recentemente.</p></div>${mk.more("Ver curso", "/cursos")}</div>
          <ul class="new-lessons">${newLessons.map(({ m, l, date }) => `<li><a href="/aula/${m.id}/${l.id}"><span class="badge-new">Nova</span><span><b>${esc(l.title)}</b><small>${esc(m.track.title)} · ${esc(m.title)}</small></span><small>${new Date(date).toLocaleDateString("pt-BR")}</small></a></li>`).join("")}</ul>
        </section>
        ${u.plan !== "pro" ? `<section class="card unlock"><div><h2>Desbloqueie todo o conteúdo</h2><p>Seu plano libera ${allModules().filter((m) => !m.soon && canAccess(m)).length} de ${allModules().filter((m) => !m.soon).length} módulos publicados.</p><div class="bar"><i style="width:${(allModules().filter((m) => !m.soon && canAccess(m)).length / Math.max(1, allModules().filter((m) => !m.soon).length)) * 100}%"></i></div></div><a class="ui-btn primary sm" href="/planos">Ver planos</a></section>` : ""}
      </div>
      <aside class="dash-side">
        ${rankingCard(5)}
        <div class="card side-card">
          <div class="side-head"><h2>${icon("sparkles")}Acontecendo no graao</h2></div>
          <div class="happening"><p class="mini-head">${icon("newspaper")}Novidades${mk.more("Ver tudo", "/noticias")}</p>
            ${NEWS.slice(0, 2).map((n) => `<a href="/noticias/${n.slug}"><b>${esc(n.title)}</b><small>${esc(n.cat)} · ${new Date(n.date).toLocaleDateString("pt-BR")}</small></a>`).join("")}</div>
          <div class="happening"><p class="mini-head">${icon("message")}Comunidade${mk.more("Ver tudo", "/comunidade")}</p>
            ${posts.map((p) => { const a = p.user === "me" ? p.me : USERS[p.user]; return `<a href="/comunidade#${p.id}"><b>${esc(p.text.split("\n")[0])}</b><small>${esc(a.name)} · ${icon("heart")}${p.likes} ${icon("message")}${p.comments.length}</small></a>`; }).join("")}</div>
        </div>
      </aside>
    </div>`,
  };
}

// =====================================================================
// /ranking
// =====================================================================
export function rankingPage(params) {
  const tab = params.get("tab") === "historico" ? "historico" : "temporada";
  const q = (params.get("q") || "").toLowerCase();
  const list = tab === "historico" ? LAST_SEASON : rankingWithMe();
  const filtered = list.map(([k, p], i) => [k, p, i + 1]).filter(([k]) => !q || who(k).name.toLowerCase().includes(q));
  const [first, second, third] = list;
  const pod = (entry, place) => { if (!entry) return "<div></div>"; const w = who(entry[0]); return `<div class="pod p${place}">${place === 1 ? `<span class="crown">${icon("crown")}</span>` : ""}${avatar(w, place === 1 ? 64 : 54)}<b>${esc(w.name)}</b><small>${esc(w.role || "@" + w.handle)}</small><span class="pod-pts">${entry[1]} <small>PTS</small></span><div class="pedestal">${place}</div></div>`; };
  const pts = store.points();
  return {
    title: "Ranking",
    html: `
    <div class="ranking-page">
      <div class="ranking-main">
        <div class="page-head tight">
          <div class="title-ico"><span class="ico-box">${icon("trophy")}</span><div><h1>Ranking</h1><p>Aprenda, contribua e avance nesta temporada.</p></div></div>
          <form class="search sm" action="/ranking">${icon("search")}<input type="search" name="q" value="${esc(params.get("q") || "")}" placeholder="Buscar aluno pelo nome..." aria-label="Buscar aluno">${tab === "historico" ? '<input type="hidden" name="tab" value="historico">' : ""}</form>
        </div>
        <div class="tabs-row"><div class="mk-tabs"><a href="/ranking" ${tab === "temporada" ? 'aria-current="page"' : ""}>Temporada</a><a href="/ranking?tab=historico" ${tab === "historico" ? 'aria-current="page"' : ""}>Histórico</a></div><small class="muted">${tab === "temporada" ? seasonLabel() : "Temporada anterior"}</small></div>
        ${tab === "temporada" && !pts ? `<div class="card notice">Você ainda não pontuou nesta temporada. Uma ação relevante hoje já coloca você no ranking.</div>` : ""}
        ${!q ? `<div class="card podium">${pod(second, 2)}${pod(first, 1)}${pod(third, 3)}</div>` : ""}
        <ol class="card rank-list">${filtered.slice(q ? 0 : 3).map(([k, p, pos]) => { const w = who(k); return `<li class="${k === "me" ? "is-me" : ""}"><span class="pos">${pos}</span>${avatar(w, 34)}<span class="who"><b>${esc(w.name)}${k === "me" ? " (você)" : ""}</b>${w.role ? `<small>${esc(w.role)}</small>` : ""}</span><span class="rpts">${p}<small>PTS</small></span></li>`; }).join("") || `<li class="muted">Ninguém encontrado.</li>`}</ol>
      </div>
      <aside class="ranking-side">
        <div class="card prize"><p class="side-title">${icon("gift")}Prêmios desta temporada</p><small class="muted">Válidos até o fim do mês.</small><div class="prize-item"><span class="prize-art"></span><div><span class="pill">1º lugar</span><b>Em breve</b><small>Em breve divulgaremos as premiações do ranking.</small></div></div></div>
        <div class="card" id="pontos"><p class="side-title">Pontos da temporada</p><small class="muted">A temporada valoriza aprendizado, ajuda e constância.</small>
          <ul class="points-table">${SEASON_POINTS.map(([t, p]) => `<li><span>${t}</span><b>+${p}</b></li>`).join("")}</ul>
          <small class="muted">Nesta recriação: aula concluída +2, publicação +3, presença do dia +2.</small></div>
        <div class="card"><p class="side-title">Temporada anterior</p><ol class="last-season">${LAST_SEASON.map(([k, p], i) => `<li><span>${i + 1}</span><b>${esc(USERS[k].name)}</b><span class="tx-brand">${p}</span></li>`).join("")}</ol></div>
      </aside>
    </div>`,
  };
}

// =====================================================================
// /conta/certificados
// =====================================================================
export function certificadosPage() {
  const issued = allModules().filter((m) => m.lessons.length && store.progress(m.id).length === m.lessons.length);
  const going = allModules().filter((m) => store.progress(m.id).length && store.progress(m.id).length < m.lessons.length);
  const ext = store.externalCerts();
  return {
    title: "Certificados",
    html: `
    <div class="narrow">
      <div class="page-head tight"><div><h1>Meus certificados</h1><p>Acompanhe sua evolução, valide suas conquistas e compartilhe suas credenciais.</p></div></div>
      <section class="card cert-hero">
        <div class="cert-hero-top"><div class="title-ico"><span class="ico-box accent">${icon("award")}</span><h2>Sua trajetória em credenciais</h2></div><a class="ui-btn outline sm" href="/cursos">Explorar conteúdos ${icon("arrow-right")}</a></div>
        <p class="muted">Certificados da ${BRAND.full} são emitidos automaticamente quando todas as aulas obrigatórias são concluídas.</p>
        <div class="cert-stats"><div><small>${BRAND.full}</small><b>${issued.length}</b></div><div><small>Em andamento</small><b>${going.length}</b></div><div><small>Outras</small><b>${ext.length}</b></div></div>
      </section>
      ${issued.length ? `<section class="card"><h2 class="card-h">Emitidos</h2><ul class="cert-list">${issued.map((m) => `<li><span class="ico-box accent sm">${icon("award")}</span><span><b>${esc(m.title)}</b><small>${esc(m.track.title)} · código ${m.id.toUpperCase()}</small></span><button class="ui-btn outline xs" data-cert="${m.id}">Ver</button></li>`).join("")}</ul></section>`
      : `<section class="card row-card"><span class="ico-box">${icon("award")}</span><div><b>Seu próximo certificado começa em Conteúdos</b><small>Procure uma trilha ou um módulo que tenha certificado disponível.</small></div><a class="ui-btn outline sm" href="/cursos">Explorar conteúdos</a></section>`}
      <section class="card">
        <div class="hint">${icon("check")}Quando uma credencial da ${BRAND.full} for emitida, ela aparecerá aqui com código público de validação.</div>
        <div class="card-head" style="margin-top:18px"><h2 class="card-h">Outras credenciais</h2><button class="ui-btn outline xs" data-add-cert>${icon("plus")}Adicionar certificado</button></div>
        ${ext.length ? `<ul class="cert-list">${ext.map((c) => `<li><span class="ico-box sm">${icon("award")}</span><span><b>${esc(c.name)}</b><small>${esc(c.org)}${c.year ? " · " + esc(c.year) : ""}</small></span></li>`).join("")}</ul>` : `<p class="empty-box">Nenhuma credencial externa adicionada</p>`}
      </section>
    </div>`,
    mount(root, { rerender }) {
      root.addEventListener("click", (e) => {
        const c = e.target.closest("[data-cert]");
        if (c) certificateModal(allModules().find((m) => m.id === c.dataset.cert));
        if (e.target.closest("[data-add-cert]")) {
          const m = openModal(`<h2 class="modal-title">Adicionar certificado</h2><p class="modal-sub">Cursos e credenciais de fora da plataforma.</p>
            <form class="stack" data-ext><label class="field"><span>Nome do certificado</span><input name="name" required></label><label class="field"><span>Instituição</span><input name="org" required></label><label class="field"><span>Ano</span><input name="year" inputmode="numeric" maxlength="4"></label><button class="ui-btn primary block">Adicionar</button></form>`);
          $("[data-ext]", m.el).addEventListener("submit", (ev) => { ev.preventDefault(); store.addExternalCert(Object.fromEntries(new FormData(ev.target))); m.close(); toast("Credencial adicionada."); rerender(); });
        }
      });
    },
  };
}

// =====================================================================
// /planos (logado)
// =====================================================================
export function planosPage(params) {
  const u = store.user;
  const pre = params.get("plano");
  const paid = PLANS.filter((p) => !p.free);
  return {
    title: "Planos",
    html: `
    <div class="plans-in">
      <div class="center-head"><h1>Escolha seu plano</h1><p>Descubra o melhor plano para a sua jornada.</p></div>
      <div class="card current-plan">${icon("check")}<div><b>Seu plano atual é o ${planName(u.plan)}</b><small>${u.plan === "free" ? "Compare abaixo o que muda ao assinar." : "Você pode trocar ou voltar ao gratuito quando quiser."}</small></div><a class="small-link tx-brand" href="/conta/plano">Ver situação da conta</a></div>
      <div class="plan-cards">${paid.map((p) => {
        const current = u.plan === p.id;
        return `<article class="card plan-card rb-spotlight ${p.featured ? "featured rb-star" : ""} ${pre === p.id ? "is-pre" : ""}">
          ${p.featured ? `<span class="most">Mais escolhido</span>` : ""}
          <div class="plan-card-top"><span class="ico-box ${p.featured ? "solid" : ""}">${icon(p.icon)}</span><div><b>${p.name}</b><small>${esc(p.desc)}</small></div></div>
          <div class="plan-price"><strong>R$ ${p.price.yearly.big}</strong><span>${p.price.yearly.post || ""}</span></div>
          <small class="muted">${p.note.yearly}</small>
          <ul class="plan-list">${p.features.map((f) => `<li>${icon("check")}${f}</li>`).join("")}</ul>
          ${p.featured ? "" : `<button class="small-link tx-brand" data-included>${icon("book")}Ver módulos incluídos</button>`}
          <button class="ui-btn ${p.featured ? "primary" : "outline"} block mk-shine" data-choose="${p.id}" ${current ? "disabled" : ""}>${current ? "Plano atual" : `Assinar ${p.name}`} ${current ? "" : icon("arrow-right")}</button>
          <small class="muted center">Acesso liberado na hora · 7 dias de garantia</small>
        </article>`;
      }).join("")}</div>
      ${u.plan !== "free" ? `<p class="center"><button class="link" data-choose="free">Voltar ao plano gratuito</button></p>` : ""}
      <section class="testimonials-in">
        <h2>Depoimentos de alunos</h2><p class="muted">Veja o que nossos alunos dizem sobre as aulas e os conhecimentos que levam para a prática.</p>
        <div class="t-grid">${TESTIMONIALS.slice(0, 3).map((t) => `<figure class="card t-card"><figcaption>${avatar(t, 36)}<div><b>${esc(t.name)}</b><small>${esc(t.handle)}</small></div><span class="stars">${icon("star").repeat(5)}</span></figcaption><blockquote>“${esc(t.full)}”</blockquote></figure>`).join("")}</div>
        <p class="muted small">Relatos de exemplo nesta recriação.</p>
      </section>
    </div>`,
    mount(root, { rerender }) {
      root.addEventListener("click", (e) => {
        if (e.target.closest("[data-included]")) {
          const mods = allModules().filter((m) => (m.tier ?? 0) <= 1);
          openModal(`<h2 class="modal-title">Módulos incluídos no Broto</h2><p class="modal-sub">Módulos 01 a 04 do IA para TDAH.</p><ul class="inc-list">${mods.map((m) => `<li>${icon("check")}${esc(m.title)} <small>${esc(m.track.title)}</small></li>`).join("")}</ul>`);
        }
        const b = e.target.closest("[data-choose]");
        if (!b) return;
        const p = PLANS.find((x) => x.id === b.dataset.choose);
        if (p.free) { store.setPlan("free"); rerender(); return toast("Você voltou para o plano gratuito."); }
        const m = openModal(`<h2 class="modal-title">Assinar ${p.name}</h2><p class="modal-sub">${p.note.yearly}</p>
          <div class="checkout-note">${icon("lock")}<p><b>Checkout de demonstração.</b> Nenhum pagamento é processado nesta recriação — integre aqui o seu provedor de pagamentos.</p></div>
          <button class="ui-btn primary block lg" data-confirm>Ativar ${p.name} (demo)</button>`);
        $("[data-confirm]", m.el).addEventListener("click", () => { store.setPlan(p.id); m.close(); toast(`Plano ${p.name} ativado!`, "crown"); rerender(); });
      });
    },
  };
}

// =====================================================================
// /perfil
// =====================================================================
export function perfilPage() {
  const u = store.user;
  const mine = store.posts.filter((p) => p.user === "me");
  const savedNews = NEWS.filter((n) => store.isSaved(n.slug));
  return {
    title: "Perfil",
    html: `
    <div class="narrow">
      <section class="card profile-card">
        <div class="cover" style="background:linear-gradient(120deg, hsl(${u.hue} 50% 18%), #1a1440 60%, #0e0d14)"></div>
        <div class="profile-body">
          <div class="profile-avatar">${avatar(u, 92)}</div>
          <a class="ui-btn outline sm edit" href="/conta/perfil">Editar perfil</a>
          <h1>${esc(u.name)}</h1><p class="muted">@${esc(u.handle)}</p>
          ${u.role ? `<p class="role">${esc(u.role)}</p>` : ""}${u.bio ? `<p class="bio">${esc(u.bio)}</p>` : ""}
          <p class="muted sm">${icon("clock")}Entrou em ${new Date(u.since || Date.now()).toLocaleDateString("pt-BR")}</p>
        </div>
        <div class="profile-stats"><div><b>${mk.count(mine.length)}</b><small>Publicações</small></div><div><b>${Math.min(3, store.follows.length)}</b><small>Seguidores</small></div><div><b>${store.follows.length}</b><small>Seguindo</small></div><div><b class="tx-brand">${mk.count(store.points())}</b><small>Pontos</small></div></div>
      </section>
      ${mine.length ? `<section class="card"><h2 class="card-h">Publicações</h2><ul class="my-posts">${mine.map((p) => `<li><p>${esc(p.text)}</p><small class="muted">${ago(p.date)} · ${p.likes} curtidas · ${p.comments.length} comentários</small></li>`).join("")}</ul></section>`
      : `<section class="card empty-card"><b>Você ainda não publicou</b><p class="muted">Compartilhe uma descoberta, dúvida ou projeto com a comunidade.</p><a class="ui-btn primary sm" href="/comunidade">Ir para a comunidade</a></section>`}
      <section class="card" id="salvos"><h2 class="card-h">Notícias salvas</h2>${savedNews.length ? `<ul class="saved">${savedNews.map((n) => `<li><a href="/noticias/${n.slug}">${esc(n.title)}</a><small>${esc(n.cat)}</small></li>`).join("")}</ul>` : `<p class="muted">Nada salvo ainda.</p>`}</section>
    </div>`,
  };
}

// =====================================================================
// /conta e /conta/:secao — Configurações
// =====================================================================
const SECTIONS = [
  ["Conta", [["perfil", "Perfil", "Foto, nome, bio e links", "user"], ["plano", "Plano e acessos", "Assinatura, trilhas e pagamentos", "tag"]]],
  ["Preferências", [["notificacoes", "Notificações", "Escolha quais avisos receber", "bell"], ["aparencia", "Aparência", "Sistema, tema claro ou escuro", "sun"]]],
  ["Privacidade e segurança", [["senha", "Senha e conta", "Senha e dados privados", "lock"], ["privacidade", "Privacidade e dados", "Bloqueios, exportação e exclusão", "shield"]]],
];

export function contaPage(section) {
  const u = store.user;
  const prefs = store.prefs;
  const themeChoice = (() => { try { return localStorage.getItem("rc:theme") || "system"; } catch { return "system"; } })();
  const toggle = (k, t, d) => `<label class="toggle-row"><span><b>${t}</b><small>${d}</small></span><input type="checkbox" data-pref="${k}" ${prefs[k] ? "checked" : ""}><span class="switch" aria-hidden="true"></span></label>`;
  const views = {
    "": `<h2 class="sec-title">Visão geral</h2><p class="muted">Consulte os pontos principais da sua conta e encontre cada ajuste rapidamente.</p>
      <div class="card me-card">${avatar(u, 48)}<div><b>${esc(u.name)}</b><small>${esc(u.email || "")}</small><span class="pill">${icon("check")}Plano ${planName(u.plan)}</span></div><a class="ui-btn outline sm" href="/conta/perfil">Editar perfil</a></div>
      <p class="sec-sub">Status da conta</p>
      <div class="status-grid mk-glide">
        <a class="card status" href="/perfil">${icon("user")}<small>Perfil público</small><b>@${esc(u.handle)}</b><span>Visível para a comunidade ${icon("chevron-right")}</span></a>
        <a class="card status" href="/conta/plano">${icon("tag")}<small>Plano e acessos</small><b>${planName(u.plan)}</b><span>Veja os acessos disponíveis ${icon("chevron-right")}</span></a>
        <a class="card status" href="/conta/senha">${icon("lock")}<small>Segurança</small><b>${u.provider && u.provider !== "email" ? "Acesso social" : "E-mail e senha"}</b><span>${u.provider && u.provider !== "email" ? "Defina uma senha opcional" : "Altere sua senha"} ${icon("chevron-right")}</span></a>
      </div>`,
    perfil: `<h2 class="sec-title">Perfil</h2><p class="muted">Como você aparece para a comunidade.</p>
      <form class="card stack" data-profile>
        <div class="me-row">${avatar(u, 56)}<small class="muted">A foto usa suas iniciais nesta recriação.</small></div>
        <label class="field"><span>Nome</span><input name="name" value="${esc(u.name)}" required minlength="2"></label>
        <label class="field"><span>O que você faz</span><input name="role" value="${esc(u.role || "")}" placeholder="Ex.: Designer, Dev front-end, Estudante"></label>
        <label class="field"><span>Bio</span><textarea name="bio" rows="3" maxlength="240" placeholder="Conte um pouco sobre você">${esc(u.bio || "")}</textarea></label>
        <button class="ui-btn primary">Salvar alterações</button>
      </form>`,
    plano: `<h2 class="sec-title">Plano e acessos</h2><p class="muted">Sua assinatura e o que ela libera.</p>
      <div class="card stack"><div class="me-row"><span class="ico-box accent">${icon("tag")}</span><div><b>Plano ${planName(u.plan)}</b><small class="muted">${u.plan === "free" ? "Notícias, posts da comunidade e conteúdos gratuitos." : "Assinatura de demonstração ativa."}</small></div></div>
      <p class="muted">Você tem acesso a ${TRACKS.filter((t) => t.modules.some(canAccess)).length} de ${TRACKS.length} trilhas.</p>
      <a class="ui-btn primary" href="/planos">${u.plan === "free" ? "Ver planos" : "Trocar de plano"}</a></div>`,
    notificacoes: `<h2 class="sec-title">Notificações</h2><p class="muted">Escolha quais avisos receber.</p>
      <div class="card toggles">${toggle("replies", "Respostas e menções", "Quando responderem ou mencionarem você")}${toggle("follows", "Novos seguidores", "Quando alguém começar a seguir você")}${toggle("news", "Notícias em alta", "Resumo das notícias mais lidas")}${toggle("email", "E-mails da plataforma", "Novidades e conteúdos novos")}</div>`,
    aparencia: `<h2 class="sec-title">Aparência</h2><p class="muted">Sistema, tema claro ou escuro.</p>
      <div class="theme-pick">${[["system", "Sistema", "monitor"], ["light", "Claro", "sun"], ["dark", "Escuro", "moon"]].map(([v, t, ic]) => `<label class="card theme-opt"><input type="radio" name="theme" value="${v}" ${themeChoice === v ? "checked" : ""}><span class="swatch ${v}"></span><span>${icon(ic)}${t}</span></label>`).join("")}</div>`,
    senha: `<h2 class="sec-title">Senha e conta</h2><p class="muted">Senha e dados privados.</p>
      <form class="card stack" data-password><label class="field"><span>E-mail</span><input value="${esc(u.email || "")}" disabled></label>
      <label class="field"><span>Nova senha</span><input type="password" name="p1" minlength="6" required autocomplete="new-password"></label>
      <label class="field"><span>Confirmar nova senha</span><input type="password" name="p2" minlength="6" required autocomplete="new-password"></label>
      <button class="ui-btn primary">Salvar senha</button><small class="muted">Demonstração: a senha não é armazenada.</small></form>`,
    privacidade: `<h2 class="sec-title">Privacidade e dados</h2><p class="muted">Bloqueios, exportação e exclusão.</p>
      <div class="card row-card">${icon("download")}<div><b>Exportar meus dados</b><small>Baixe tudo o que esta recriação guardou no seu navegador (JSON).</small></div><button class="ui-btn outline sm" data-export>Exportar</button></div>
      <div class="card row-card danger">${icon("trash")}<div><b>Excluir meus dados</b><small>Remove conta demo, posts, progresso e preferências deste navegador.</small></div>${mk.hold("Segure para excluir", "data-wipe")}</div>`,
  };
  const body = views[section] ?? views[""];
  return {
    title: "Configurações",
    html: `
    <div class="page-head tight"><div><h1>Configurações</h1><p>Gerencie sua conta e suas preferências.</p></div></div>
    <div class="settings">
      <nav class="settings-nav" aria-label="Seções">${SECTIONS.map(([g, items]) => `<p class="nav-label">${g}</p>${items.map(([k, t, d, ic]) => `<a href="/conta/${k}" class="card set-link" ${section === k ? 'aria-current="page"' : ""}><span class="ico-box sm">${icon(ic)}</span><span><b>${t}</b><small>${d}</small></span></a>`).join("")}`).join("")}</nav>
      <div class="settings-body">${body}</div>
    </div>`,
    mount(root, { rerender, navigate }) {
      $("[data-profile]", root)?.addEventListener("submit", (e) => { e.preventDefault(); const f = Object.fromEntries(new FormData(e.target)); store.updateProfile({ name: f.name.trim(), role: f.role.trim(), bio: f.bio.trim() }); toast("Perfil atualizado."); rerender(); });
      $$("[data-pref]", root).forEach((c) => c.addEventListener("change", () => { store.setPref(c.dataset.pref, c.checked); toast("Preferência salva."); }));
      $$('input[name="theme"]', root).forEach((r) => r.addEventListener("change", () => {
        if (r.value === "system") { try { localStorage.removeItem("rc:theme"); } catch {} document.documentElement.dataset.theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; }
        else store.setTheme(r.value);
        rerender();
      }));
      $("[data-password]", root)?.addEventListener("submit", (e) => { e.preventDefault(); if (e.target.p1.value !== e.target.p2.value) return toast("As senhas não conferem.", "x"); e.target.reset(); toast("Senha salva (demo)."); });
      $("[data-export]", root)?.addEventListener("click", () => {
        const blob = new Blob([JSON.stringify(store.exportData(), null, 2)], { type: "application/json" });
        const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "meus-dados-riseclub-demo.json" });
        a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      });
      $("[data-wipe]", root)?.addEventListener("mk:hold", () => { setTimeout(() => { store.wipe(); toast("Dados excluídos.", "trash"); navigate("/", true); }, 500); });
    },
  };
}

// =====================================================================
// /ajuda
// =====================================================================
export function ajudaPage() {
  const tickets = store.tickets();
  return {
    title: "Ajuda",
    html: `
    <div class="page-head tight"><div><h1>Ajuda</h1><p>Encontre uma resposta ou fale com a equipe sem sair da ${BRAND.full}.</p></div></div>
    <div class="help">
      <div class="help-main">
        <section class="card help-card">
          <p class="eyebrow tx-brand">Central de ajuda</p><h2>Como podemos ajudar?</h2><p class="muted">Busque por uma palavra ou escolha o assunto da sua dúvida.</p>
          <label class="search block">${icon("search")}<input type="search" placeholder="Busque sua dúvida..." data-help-search aria-label="Buscar na ajuda"></label>
          <p class="nav-label">Explore por tema</p>
          <div class="topics mk-glide">${HELP.map(([t, ic], i) => `<a class="topic" href="#tema-${i}">${icon(ic)}<span>${t}</span></a>`).join("")}</div>
          ${HELP.map(([t, , qs], i) => `<div class="help-group" id="tema-${i}"><p class="nav-label">${t}</p><div class="acc">${qs.map(([q, a]) => `<details data-q="${esc((q + " " + a).toLowerCase())}"><summary>${esc(q)}<span class="plus" aria-hidden="true">${icon("plus")}</span></summary><p>${esc(a)}</p></details>`).join("")}</div></div>`).join("")}
          <p class="empty" data-help-empty hidden>Nada encontrado. Fale com a equipe abaixo.</p>
        </section>
        <section class="card help-card" id="fale">
          <h2>Fale com a gente</h2><p class="muted">Problemas, dúvidas e pagamentos viram um chamado acompanhado por aqui.</p>
          <form class="stack" data-ticket>
            <label class="field"><span>Assunto</span><select name="topic" class="select">${HELP.map(([t]) => `<option>${t}</option>`).join("")}<option>Outro</option></select></label>
            <label class="field"><span>Mensagem</span><textarea name="msg" rows="4" required minlength="10" placeholder="Descreva o que aconteceu"></textarea></label>
            <button class="ui-btn primary">Abrir chamado</button>
          </form>
        </section>
      </div>
      <aside class="help-side">
        <div class="card"><div class="side-head"><h2>Meus chamados</h2>${icon("message")}</div>
          ${tickets.length ? `<ul class="tickets">${tickets.map((t) => `<li><b>${esc(t.topic)}</b><small>${esc(t.msg.slice(0, 60))}${t.msg.length > 60 ? "…" : ""}</small><span class="pill">${t.status}</span></li>`).join("")}</ul>` : `<p class="muted sm">Você ainda não precisou abrir um chamado.</p>`}
          <a class="ui-btn outline sm block" href="#fale">Falar com a equipe</a></div>
        <div class="card"><div class="side-head"><h2>Outros canais</h2></div><p class="muted sm">Atendimento de segunda a sexta, em horário comercial (exemplo).</p></div>
      </aside>
    </div>`,
    mount(root, { rerender }) {
      const input = $("[data-help-search]", root);
      input.addEventListener("input", () => {
        const q = input.value.trim().toLowerCase();
        let any = false;
        $$(".help-group", root).forEach((g) => { let n = 0; $$("details", g).forEach((d) => { const ok = !q || d.dataset.q.includes(q); d.hidden = !ok; if (q && ok) d.open = true; n += ok; }); g.hidden = !n; any ||= n > 0; });
        $("[data-help-empty]", root).hidden = any;
      });
      $("[data-ticket]", root).addEventListener("submit", (e) => { e.preventDefault(); const f = Object.fromEntries(new FormData(e.target)); store.addTicket(f); toast("Chamado aberto. Responderemos por aqui."); rerender(); });
    },
  };
}
