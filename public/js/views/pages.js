import { icon } from "../icons.js";
import { BRAND, TRACKS, CHANNEL, COURSE, PLAN_TIER, PLANS, NEWS, NEWS_CATS, USERS, RANKING, WHO_TO_FOLLOW, art, findModule, allModules } from "../data.js";
import { esc, avatar, ago, $, $$, toast, openModal } from "../ui.js";
import { store } from "../store.js";
import { mk, fuse } from "../microkit.js";
import { rb } from "../reactbits.js";

import { fmtMin } from "../course-ia-para-tdah.js";
export const tierOf = (m) => m.tier ?? (m.free ? 0 : 1);
export const userTier = () => (store.user ? PLAN_TIER[store.user.plan] ?? 0 : 0);
export const canAccess = (m) => tierOf(m) <= userTier();
export const planForTier = (t) => PLANS.find((p) => PLAN_TIER[p.id] === t);
export { fmtMin };
export const me = () => { const u = store.user; return u ? { name: u.name, handle: u.handle, hue: u.hue } : null; };
export const who = (k) => (k === "me" ? { ...me(), name: me().name } : USERS[k]);

export function rankingWithMe() {
  const rank = RANKING.map(([k, p]) => [k, p]);
  const pts = store.points();
  if (store.user && pts > 0) rank.push(["me", pts]);
  return rank.sort((a, b) => b[1] - a[1]);
}

export const rankingCard = (n = 8) => `
  <div class="card side-card">
    <div class="side-head"><h2>${icon("trophy")}Ranking</h2>${mk.more("Ver tudo", "/ranking")}</div>
    <ol class="ranking">${rankingWithMe().slice(0, n).map(([k, pts], i) => { const w = who(k); return `<li class="${k === "me" ? "is-me" : ""}"><span class="pos p${i + 1}">${i + 1}</span>${avatar(w, 28)}<b>${esc(w.name)}${k === "me" ? " (você)" : ""}</b><span class="pts">${pts}</span></li>`; }).join("")}</ol>
  </div>`;

// =====================================================================
// /cursos
// =====================================================================
export function cursosPage() {
  const totalMin = allModules().reduce((s, m) => s + m.lessons.reduce((a, l) => a + l.min, 0), 0);
  const totalH = fmtMin(totalMin);
  const card = (m, i) => {
    const prog = store.progress(m.id).length, total = m.lessons.length || 1;
    const pct = Math.round((prog / total) * 100);
    const locked = !m.soon && !canAccess(m);
    const tag = m.soon ? `<span class="badge soon">Em breve</span>` : "";
    const inner = `<div class="module-art ${locked ? "is-locked" : ""}" style="background:${art(m.hue, i)}">${tag}${locked ? `<span class="lock-pill">${icon("lock")}</span>` : ""}<div class="module-copy"><small class="mod-n">Módulo ${String(m.n || i + 1).padStart(2, "0")} · ${m.lessons.length} aulas · ${fmtMin(m.lessons.reduce((a, l) => a + l.min, 0))}</small><h3>${esc(m.title)}</h3>${locked ? `<p class="mod-plan">${icon("lock")}A partir do ${planForTier(tierOf(m))?.name}</p>` : ""}</div></div>
      ${m.soon || !prog ? "" : `<div class="module-bar" aria-label="${pct}% concluído"><i style="width:${pct}%"></i></div>`}`;
    const s = esc((m.title + " " + m.desc + " " + m.lessons.map((l) => l.title).join(" ")).toLowerCase());
    return m.soon ? `<div class="module is-soon" data-search="${s}">${inner}</div>` : `<a class="module" href="/modulo/${m.id}" data-search="${s}">${inner}</a>`;
  };
  const row = (title, items, extra = "") => `
    <section class="shelf" ${extra}>
      <div class="shelf-head"><h2>${title}</h2><div class="shelf-nav"><button class="round-btn" data-scroll="-1" aria-label="Anterior">${icon("chevron-left")}</button><button class="round-btn" data-scroll="1" aria-label="Próximo">${icon("chevron-right")}</button></div></div>
      <div class="shelf-track mk-glide">${items}</div>
    </section>`;
  return {
    title: "Conteúdos",
    html: `
    <div class="page-head">
      <div><h1>Conteúdos</h1><p>Seu curso, no seu ritmo.</p></div>
      <div class="page-head-actions">
        <span class="chip">${icon("clock")}${totalH}</span>
        <button class="ui-btn outline sm" data-action="suggest">${icon("sparkles")}Sugerir conteúdo</button>
        <label class="search">${icon("search")}<input type="search" placeholder="Buscar trilha, módulo ou aula..." data-filter aria-label="Buscar conteúdos"></label>
      </div>
    </div>
    ${(() => {
      const mods = TRACKS[0].modules.filter((m) => m.lessons.length);
      const done = mods.reduce((s, m) => s + store.progress(m.id).length, 0), total = mods.reduce((s, m) => s + m.lessons.length, 0);
      const first = mods.find((m) => canAccess(m) && store.progress(m.id).length < m.lessons.length) || mods[0];
      const mins = mods.reduce((s, m) => s + m.lessons.reduce((a, l) => a + l.min, 0), 0);
      return `<section class="course-hero glass" style="--art:${art(COURSE.hue, 3).replace(/"/g, "'")}">
        <div class="course-hero-art rb-tilt rb-glare" aria-hidden="true"></div>
        <div class="course-hero-copy">
          <p class="eyebrow tx-brand">Primeiro curso</p>
          <h2>${esc(COURSE.title)}</h2>
          <p class="course-headline">${esc(COURSE.headline)}</p>
          <p>${esc(COURSE.subheadline)}</p>
          <div class="course-hero-meta"><span>${icon("layers")}${mods.length} módulos</span><span>${icon("play-outline")}${total} aulas</span><span>${icon("clock")}${fmtMin(mins)}</span><span>${icon("award")}${COURSE.projects.length} projetos</span></div>
          <div class="course-hero-actions">${mk.glow(done ? "Continuar curso" : "Começar curso", `/modulo/${first.id}`)}${mk.more("Sobre o curso", "/curso/" + COURSE.id)}<span class="muted sm">${done}/${total} aulas vistas</span></div>
        </div>
      </section>`;
    })()}
    <p class="empty" data-empty hidden>Nada encontrado para “<b></b>”. <button class="link" data-action="suggest">Sugerir conteúdo</button></p>
    ${!CHANNEL.length ? "" : row(`<span class="yt-dot">${icon("play")}</span>Canal no YouTube`, CHANNEL.map((v, i) => `
      <a class="video" href="#" data-action="video" data-title="${esc(v.title)}" data-search="${esc(v.title.toLowerCase())}">
        <div class="video-art" style="background:${art(v.hue, i)}"><span class="play">${icon("play")}</span></div><p>${esc(v.title)}</p></a>`).join(""), "data-channel")}
    ${TRACKS.map((t) => row(esc(t.title), t.modules.map(card).join(""))).join("")}`,
    mount(root) {
      root.addEventListener("click", (e) => {
        const s = e.target.closest("[data-scroll]");
        if (s) { const tr = s.closest(".shelf").querySelector(".shelf-track"); tr.scrollBy({ left: tr.clientWidth * 0.8 * Number(s.dataset.scroll), behavior: "smooth" }); }
        if (e.target.closest('[data-action="suggest"]')) suggestModal();
        const v = e.target.closest('[data-action="video"]');
        if (v) { e.preventDefault(); openModal(`<div class="player"><div class="player-art" style="background:${art(260, 3)}"><span class="play lg">${icon("play")}</span></div></div><h2 class="modal-title" style="margin-top:16px">${esc(v.dataset.title)}</h2><p class="modal-sub">Vídeo de exemplo — conecte aqui o embed do seu canal.</p>`, { cls: "wide" }); }
      });
      const input = $("[data-filter]", root), empty = $("[data-empty]", root);
      input.addEventListener("input", () => {
        const q = input.value.trim().toLowerCase();
        let any = false;
        $$(".shelf", root).forEach((sh) => {
          let n = 0;
          $$("[data-search]", sh).forEach((c) => { const ok = !q || c.dataset.search.includes(q); c.hidden = !ok; n += ok; });
          sh.hidden = n === 0; any ||= n > 0;
        });
        empty.hidden = any; $("b", empty).textContent = input.value;
      });
    },
  };
}

function suggestModal() {
  const m = openModal(`<h2 class="modal-title">Sugerir conteúdo</h2><p class="modal-sub">O que você gostaria de aprender por aqui?</p>
    <form class="stack" data-suggest><label class="field"><span>Tema</span><input name="t" required placeholder="Ex.: Animações com GSAP"></label>
    <label class="field"><span>Detalhes (opcional)</span><textarea name="d" rows="3"></textarea></label>
    <button class="ui-btn primary block">Enviar sugestão</button></form>`);
  $("[data-suggest]", m.el).addEventListener("submit", (e) => { e.preventDefault(); m.close(); toast("Sugestão enviada. Valeu!"); });
}

// /modulo/:id → primeira aula pendente (como no site real, que redireciona para /aula/…)
export function moduloRedirect(id) {
  const m = findModule(id);
  if (!m || !m.lessons.length) return null;
  const done = new Set(store.progress(m.id));
  const l = m.lessons.find((x) => !done.has(x.id)) || m.lessons[0];
  return `/aula/${m.id}/${l.id}`;
}

// =====================================================================
// /aula/:modulo/:aula — player, navegação, comentários e progresso da trilha
// =====================================================================
export function aulaPage(modId, lesId) {
  const m = findModule(modId);
  const lesson = m?.lessons.find((l) => l.id === lesId);
  if (!m || !lesson) return notFound();
  const access = canAccess(m);
  const track = m.track;
  const flat = track.modules.flatMap((mm) => mm.lessons.map((l) => ({ m: mm, l })));
  const idx = flat.findIndex((x) => x.m.id === m.id && x.l.id === lesson.id);
  const prev = flat[idx - 1], next = flat[idx + 1];
  const tDone = track.modules.reduce((s, mm) => s + store.progress(mm.id).length, 0);
  const tTotal = flat.length;
  const seen = store.progress(m.id).includes(lesson.id);
  const key = `lesson:${m.id}:${lesson.id}`;
  const comments = store.commentsFor(key);
  const href = (x) => `/aula/${x.m.id}/${x.l.id}`;
  return {
    title: "Conteúdos",
    html: `
    <div class="lesson-page">
      <div class="lesson-main">
        <div class="player"><div class="player-art" style="background:${art(m.hue, 4)}">
          ${access ? `<div class="video-pending glass">${icon("play")}<b>Vídeo em produção</b><small>Enquanto isso, o texto base e o material da aula estão abaixo.</small></div>` : `<div class="locked">${icon("lock")}<p>Esta aula faz parte do plano ${esc(planForTier(tierOf(m))?.name || "")}</p><a class="ui-btn primary" href="/planos?plano=${planForTier(tierOf(m))?.id}">Ver planos</a></div>`}
        </div></div>
        <div class="lesson-bar">
          ${access ? `<div class="seen-box glass">${mk.check("Marcar como vista", { checked: seen, attrs: "data-seen" })}</div>` : "<span></span>"}
          <div class="lesson-nav">
            ${prev ? `<a class="ui-btn ghost sm" href="${href(prev)}">${icon("arrow-left")}Anterior</a>` : `<span class="ui-btn ghost sm" aria-disabled="true">${icon("arrow-left")}Anterior</span>`}
            ${next ? `<a class="ui-btn outline sm" href="${href(next)}">Próximo${icon("arrow-right")}</a>` : ""}
          </div>
        </div>
        <p class="crumbs-sm"><a href="/curso/${COURSE.id}">${esc(track.title)}</a> · Módulo ${String(m.n).padStart(2, "0")} · Aula ${String(lesson.n || idx + 1).padStart(2, "0")} · ${lesson.min} min</p>
        <h1 class="lesson-title-h">${esc(lesson.title)}</h1>
        ${access ? `<div class="lesson-content">
          <section class="card lesson-text"><p class="eyebrow tx-brand">Nesta aula</p><p>${esc(lesson.text || "")}</p></section>
          ${lesson.material ? `<section class="card lesson-material"><span class="ico-box accent">${icon("download")}</span><div><small>Material de apoio</small><b>${esc(lesson.material)}</b></div><span class="pill">em produção</span></section>` : ""}
          ${m.objective ? `<p class="lesson-objective"><b>Objetivo do módulo:</b> ${esc(m.objective)}</p>` : ""}
        </div>` : ""}
        <section class="lesson-comments">
          <h2>Comentários</h2>
          <form class="comment-compose" data-lesson-comment>${avatar(me(), 34)}<input name="c" required placeholder="Comente esta aula..." aria-label="Comentário"><button class="send" aria-label="Enviar">${icon("send")}</button></form>
          ${comments.length ? comments.map((c) => `<div class="thread">${avatar(c.me, 34)}<div><b>${esc(c.me.name)}</b><small>@${esc(c.me.handle)}</small><p>${esc(c.text)}</p><span class="muted sm">agora · Responder</span></div></div>`).join("") : `<p class="muted">Seja a primeira pessoa a comentar esta aula.</p>`}
        </section>
      </div>
      <aside class="lesson-side">
        <div class="card progress-card"><b>Seu progresso</b><span>${tDone}/${tTotal} · ${Math.round((tDone / tTotal) * 100)}%</span></div>
        ${track.modules.filter((mm) => mm.lessons.length).map((mm) => {
          const d = new Set(store.progress(mm.id));
          const open = mm.id === m.id;
          return `<details class="card mod-acc" ${open ? "open" : ""}>
            <summary><b>${String(mm.n).padStart(2, "0")} · ${esc(mm.title)}</b><span>${d.size}/${mm.lessons.length}${icon("chevron-down")}</span></summary>
            <ol>${mm.lessons.map((l, i) => `<li><a href="/aula/${mm.id}/${l.id}" class="${open && l.id === lesson.id ? "is-current" : ""}">${mk.ring(d.has(l.id) ? "done" : open && l.id === lesson.id ? "current" : "pending", d.has(l.id) ? 1 : 0)}<span>${String(l.n || i + 1).padStart(2, "0")}. ${esc(l.title)}</span><small>${mm.tier > userTier() ? icon("lock") : l.min + " min"}</small></a></li>`).join("")}</ol>
          </details>`;
        }).join("")}
        ${store.progress(m.id).length === m.lessons.length ? `<button class="ui-btn primary block" data-action="certificate">${icon("award")}Ver certificado de ${esc(m.title)}</button>` : ""}
      </aside>
    </div>`,
    mount(root, { rerender, navigate }) {
      $("[data-seen]", root)?.addEventListener("change", () => {
        store.toggleLesson(m.id, lesson.id);
        const nowSeen = store.progress(m.id).includes(lesson.id);
        if (nowSeen) toast(store.progress(m.id).length === m.lessons.length ? "Módulo concluído! Certificado liberado." : "Aula marcada como vista. +2 pontos", "circle-check");
        // deixa a animação do checkbox terminar antes de seguir
        setTimeout(() => (nowSeen && next ? navigate(href(next)) : rerender()), nowSeen ? 650 : 0);
      });
      $("[data-lesson-comment]", root).addEventListener("submit", (e) => { e.preventDefault(); store.addComment(key, e.target.c.value.trim()); rerender(); });
      $('[data-action="certificate"]', root)?.addEventListener("click", () => certificateModal(m));
    },
  };
}

export function certificateModal(m) {
  const u = store.user;
  openModal(`<div class="certificate"><img src="/brand/mark.svg" alt=""><p class="eyebrow">Certificado de conclusão</p><h2>${esc(u.name)}</h2><p>concluiu o módulo <b>${esc(m.title)}</b> (${esc(m.track.title)}) com ${m.lessons.reduce((a, l) => a + l.min, 0)} minutos de conteúdo.</p><div class="qr" aria-hidden="true"></div><small>Código de validação: ${m.id.toUpperCase()}-${u.handle.toUpperCase()}</small></div>`, { cls: "wide" });
}

// =====================================================================
// /comunidade — feed no estilo observado (mídia grande, ações, legenda)
// =====================================================================
const authorOf = (p) => (p.user === "me" ? { ...p.me, badge: null } : USERS[p.user]);

function postHTML(p) {
  const a = authorOf(p);
  const liked = store.isLiked(p.id);
  const news = p.news && NEWS.find((n) => n.slug === p.news);
  const mine = p.user === "me";
  const textFirst = !news && !p.images;
  return `<article class="post" data-post="${p.id}">
    <header>${avatar(a, 38)}<div><p class="post-name">${esc(a.name)} ${a.badge ? `<span class="badge-user" title="${esc(a.badge)}">${icon("badge-check")}</span>` : ""}</p><p class="post-meta">@${esc(a.handle)} · ${ago(p.date)}</p></div>
      ${mine ? `<button class="icon-btn sm" data-delete aria-label="Excluir publicação" style="margin-left:auto">${icon("trash")}</button>` : `<button class="icon-btn sm" style="margin-left:auto" aria-label="Mais opções" data-action="soon">${icon("more")}</button>`}</header>
    ${textFirst ? `<div class="post-text big">${esc(p.text).replace(/\n/g, "<br>")}</div>` : ""}
    ${news ? `<a class="post-news" href="/noticias/${news.slug}"><div class="post-news-art" style="background:${art(news.hue, 1)}"></div><span><b>${esc(news.title)}</b><small>${icon("newspaper")}${esc(news.cat)}${icon("arrow-right", "icon end")}</small></span></a>` : ""}
    ${p.images ? `<div class="post-media" data-carousel><div class="post-media-track">${p.images.map((h, i) => `<div style="background:${art(h, i + 2)}"></div>`).join("")}</div>${p.images.length > 1 ? `<span class="post-media-count">1/${p.images.length}</span>` : ""}</div>` : ""}
    <div class="post-actions">
      <button class="act ${liked ? "on" : ""}" data-like aria-pressed="${liked}" aria-label="Curtir">${icon("heart")}<span>${p.likes + (liked ? 1 : 0)}</span></button>
      <button class="act" data-toggle-comments aria-label="Comentários">${icon("message")}${p.comments.length ? `<span>${p.comments.length}</span>` : ""}</button>
      <button class="act" data-share aria-label="Compartilhar">${icon("send")}</button>
      <button class="act end ${store.isSaved("post:" + p.id) ? "on" : ""}" data-save-post aria-label="Salvar">${icon("bookmark")}</button>
    </div>
    ${textFirst ? "" : `<div class="post-text">${esc(p.text).replace(/\n/g, "<br>")}</div>`}
    ${p.tags?.length ? `<div class="post-tags">${p.tags.map((t) => `<span>#${esc(t)}</span>`).join("")}</div>` : ""}
    ${p.comments.length ? `<button class="more-comments" data-toggle-comments>Ver ${p.comments.length} comentário${p.comments.length > 1 ? "s" : ""}</button>` : ""}
    <div class="comments" hidden>
      ${p.comments.map((c) => { const cu = c.user === "me" ? c.me : USERS[c.user]; return `<div class="comment">${avatar(cu, 28)}<div><b>${esc(cu.name)}</b><p>${esc(c.text)}</p></div></div>`; }).join("")}
      <form class="comment-form" data-comment><input name="c" placeholder="Escreva um comentário…" required aria-label="Comentário"><button class="icon-btn sm" aria-label="Enviar">${icon("send")}</button></form>
    </div>
  </article>`;
}

export const followCard = () => `
  <div class="card side-card">
    <div class="side-head"><h2>${icon("user-plus")}Quem seguir</h2></div>
    <ul class="follow-list">${WHO_TO_FOLLOW.filter((k) => !store.isFollowing(k)).slice(0, 3).map((k) => { const u = USERS[k]; return `<li>${avatar(u, 34)}<div><b>${esc(u.name)}</b><small>${esc(u.role || "@" + u.handle)}</small></div><button class="ui-btn outline xs" data-follow="${k}">Seguir</button></li>`; }).join("") || `<li class="muted">Você já segue todo mundo sugerido 🎉</li>`}</ul>
  </div>`;

export function comunidadePage(params) {
  const u = store.user;
  const q = (params.get("q") || "").toLowerCase();
  const posts = store.posts.filter((p) => !q || p.text.toLowerCase().includes(q) || (p.tags || []).join(" ").toLowerCase().includes(q));
  return {
    title: "Comunidade",
    search: `<form class="top-search" action="/comunidade">${icon("search")}<input type="search" name="q" value="${esc(params.get("q") || "")}" placeholder="Pesquisar na comunidade" aria-label="Pesquisar na comunidade"></form><button class="icon-btn boxed" data-action="filters" aria-label="Filtros">${icon("filter")}</button>`,
    html: `
    <div class="community">
      <section class="feed" aria-label="Publicações">
        ${u ? `<form class="composer" data-composer>
            ${avatar(u, 36)}
            <input name="text" placeholder="Compartilhe algo com a comunidade..." required maxlength="600" aria-label="Nova publicação" autocomplete="off">
            <button type="button" class="composer-media" data-action="expand-composer" aria-label="Mais opções">${icon("image")}</button>
            <div class="composer-extra" hidden>
              <textarea name="more" rows="3" placeholder="Detalhes (opcional)" aria-label="Detalhes"></textarea>
              <div class="composer-foot"><div class="tag-pick">${["Dúvida", "Projeto", "Dica", "Carreira", "IA"].map((t) => `<label><input type="checkbox" name="tag" value="${t}"><span>#${t}</span></label>`).join("")}</div>
              <button class="ui-btn primary sm">Publicar</button></div>
            </div>
          </form>`
        : `<div class="composer guest"><span>Entre para publicar.</span><a class="ui-btn primary sm" href="/entrar?callbackUrl=/comunidade">Entrar</a></div>`}
        ${q ? `<p class="muted">Resultados para “${esc(q)}” · <a class="link" href="/comunidade">limpar</a></p>` : ""}
        <div data-feed>${posts.map(postHTML).join("") || `<p class="empty">Nenhuma publicação encontrada.</p>`}</div>
      </section>
      <aside class="side">${u ? followCard() : ""}${rankingCard(8)}</aside>
    </div>`,
    mount(root, { rerender }) {
      const composer = $("[data-composer]", root);
      if (composer) {
        const extra = $(".composer-extra", composer);
        composer.text.addEventListener("focus", () => (extra.hidden = false));
        $('[data-action="expand-composer"]', composer).addEventListener("click", () => { extra.hidden = !extra.hidden; composer.text.focus(); });
        composer.addEventListener("submit", (e) => {
          e.preventDefault();
          const fd = new FormData(composer);
          const text = [fd.get("text"), fd.get("more")].map((s) => String(s || "").trim()).filter(Boolean).join("\n\n");
          if (!text) return;
          store.addPost(text, fd.getAll("tag"));
          toast("Publicado na comunidade! +3 pontos");
          rerender();
        });
      }
      root.addEventListener("click", (e) => {
        const f = e.target.closest("[data-follow]");
        if (f) { store.toggleFollow(f.dataset.follow); toast(`Agora você segue ${USERS[f.dataset.follow].name}.`, "user-plus"); rerender(); return; }
        const post = e.target.closest("[data-post]");
        if (!post) return;
        const id = post.dataset.post;
        if (e.target.closest("[data-like]")) {
          if (!store.user) return toast("Entre para curtir publicações.", "lock");
          const on = store.toggleLike(id);
          const btn = e.target.closest("[data-like]"); const n = btn.querySelector("span");
          btn.classList.toggle("on", on); btn.setAttribute("aria-pressed", on); n.textContent = Number(n.textContent) + (on ? 1 : -1);
        }
        if (e.target.closest("[data-save-post]")) { const on = store.toggleSaved("post:" + id); e.target.closest("[data-save-post]").classList.toggle("on", on); toast(on ? "Publicação salva." : "Removida dos salvos.", "bookmark"); }
        if (e.target.closest("[data-toggle-comments]")) { const c = $(".comments", post); c.hidden = !c.hidden; if (!c.hidden) $("input", c)?.focus(); }
        if (e.target.closest("[data-share]")) { navigator.clipboard?.writeText(location.origin + "/comunidade#" + id).catch(() => {}); toast("Link copiado."); }
        const del = e.target.closest("[data-delete]");
        if (del) {
          // Fuse Undo (microkit): 5s para desfazer; o pavio pausa no hover
          post.classList.add("is-removing");
          del.removeAttribute("data-delete");
          fuse(del, { seconds: 5, onExpire: () => { store.deletePost(id); if (del.isConnected) { toast("Publicação excluída.", "trash"); rerender(); } }, onUndo: () => rerender() });
        }
      });
      root.addEventListener("submit", (e) => {
        const f = e.target.closest("[data-comment]");
        if (!f) return;
        e.preventDefault();
        if (!store.user) return toast("Entre para comentar.", "lock");
        const id = f.closest("[data-post]").dataset.post;
        store.addComment(id, f.c.value.trim());
        rerender();
        const c = document.querySelector(`[data-post="${id}"] .comments`); if (c) c.hidden = false;
      });
      $$("[data-carousel]", root).forEach((c) => {
        const tr = $(".post-media-track", c), cnt = $(".post-media-count", c);
        tr.addEventListener("scroll", () => { if (cnt) cnt.textContent = `${Math.round(tr.scrollLeft / tr.clientWidth) + 1}/${tr.children.length}`; }, { passive: true });
      });
    },
  };
}

// =====================================================================
// /noticias e /noticias/:slug
// =====================================================================
export function noticiasPage(params) {
  const cat = params.get("cat");
  const sort = params.get("sort") === "alta" ? "alta" : "recentes";
  const q = (params.get("q") || "").toLowerCase();
  let items = NEWS.filter((n) => (!cat || n.cat === cat) && (!q || n.title.toLowerCase().includes(q) || n.cat.toLowerCase().includes(q)));
  items = sort === "alta" ? [...items].sort((a, b) => b.hot - a.hot) : [...items].sort((a, b) => b.date - a.date);
  const qs = (o) => { const p = new URLSearchParams(params); Object.entries(o).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k))); const s = p.toString(); return "/noticias" + (s ? "?" + s : ""); };
  const stats = (n) => `<span class="news-stats">${icon("heart")}${n.hot % 4}${icon("message")}${n.hot % 3}</span>`;
  const actions = (n) => `<div class="news-actions"><button class="act" data-like-news="${n.slug}" aria-label="Curtir">${icon("heart")}<span>${n.hot % 4}</span></button><a class="act" href="/noticias/${n.slug}#comentarios" aria-label="Comentários">${icon("message")}</a><button class="act" data-share="${n.slug}" aria-label="Compartilhar">${icon("send")}</button><button class="act end ${store.isSaved(n.slug) ? "on" : ""}" data-save="${n.slug}" aria-label="Salvar">${icon("bookmark")}</button></div>`;
  const card = (n, i) => `<article class="news-card"><a href="/noticias/${n.slug}" class="news-link"><div class="news-art" style="background:${art(n.hue, i)}"><span class="cat">${esc(n.cat)}</span></div>
    <div class="news-body"><h3>${esc(n.title)}</h3><p class="news-meta">${ago(n.date)} • ${n.read} min</p></div></a>${actions(n)}</article>`;
  const row = (n, i) => `<a class="news-row" href="/noticias/${n.slug}"><div class="thumb" style="background:${art(n.hue, i)}"></div><div><small>${esc(n.cat)}</small><b>${esc(n.title)}</b><span class="news-meta">${ago(n.date)} • ${n.read} min ${stats(n)}</span></div></a>`;
  const [feat, ...rest] = items;
  return {
    title: "Novidades",
    html: `
    <div class="page-head">
      <div><h1>Novidades</h1><p>Uma seleção curta sobre IA e ferramentas, sem sobrecarga.</p></div>
      <form class="search" action="/noticias">${icon("search")}<input type="search" name="q" value="${esc(params.get("q") || "")}" placeholder="Buscar notícia, tag ou assunto..." aria-label="Buscar notícias">${cat ? `<input type="hidden" name="cat" value="${esc(cat)}">` : ""}</form>
    </div>
    <nav class="chips" aria-label="Categorias">
      <a href="${qs({ cat: null })}" ${!cat ? 'aria-current="page"' : ""}>Todas</a>
      ${NEWS_CATS.map((c) => `<a href="${qs({ cat: c })}" ${cat === c ? 'aria-current="page"' : ""}>${c}</a>`).join("")}
    </nav>
    <div class="sortbar"><div class="mk-tabs"><a href="${qs({ sort: null })}" ${sort === "recentes" ? 'aria-current="page"' : ""}>${icon("clock")}Recentes</a><a href="${qs({ sort: "alta" })}" ${sort === "alta" ? 'aria-current="page"' : ""}>${icon("flame")}Em alta</a></div>
      <a class="ui-btn outline sm" href="/perfil#salvos">${icon("bookmark")}Salvos</a></div>
    ${!feat ? `<p class="empty">Nenhuma notícia encontrada.</p>` : `
    <section class="news-top">
      <a class="news-feature" href="/noticias/${feat.slug}" style="background:${art(feat.hue, 0)}"><div><span class="cat static">${esc(feat.cat)}</span><h2>${esc(feat.title)}</h2><span class="news-meta">${ago(feat.date)} • ${feat.read} min ${stats(feat)}</span></div></a>
      <div class="news-side">${rest.slice(0, 3).map((n, i) => row(n, i + 1)).join("")}</div>
    </section>
    <section class="news-grid">${rest.slice(3).map((n, i) => card(n, i + 4)).join("")}</section>`}`,
    mount: newsActions,
  };
}

function newsActions(root) {
  root.addEventListener("click", (e) => {
    const s = e.target.closest("[data-save]");
    if (s) { e.preventDefault(); if (!store.user) return toast("Entre para salvar.", "lock"); const on = store.toggleSaved(s.dataset.save); s.classList.toggle("on", on); toast(on ? "Notícia salva." : "Removida dos salvos.", "bookmark"); }
    const l = e.target.closest("[data-like-news]");
    if (l) { e.preventDefault(); const on = store.toggleSaved("like:" + l.dataset.likeNews); l.classList.toggle("on", on); const n = l.querySelector("span"); n.textContent = Number(n.textContent) + (on ? 1 : -1); }
    const sh = e.target.closest("[data-share]");
    if (sh) { e.preventDefault(); navigator.clipboard?.writeText(location.origin + "/noticias/" + sh.dataset.share).catch(() => {}); toast("Link copiado."); }
  });
}

export function artigoPage(slug) {
  const n = NEWS.find((x) => x.slug === slug);
  if (!n) return notFound();
  const related = NEWS.filter((x) => x.cat === n.cat && x.slug !== n.slug).slice(0, 3);
  const key = "news:" + n.slug;
  const comments = store.commentsFor(key);
  return {
    title: "Novidades",
    html: `
    <a class="back" href="/noticias">${icon("arrow-left")}Novidades</a>
    <article class="article">
      <p class="eyebrow"><a href="/noticias?cat=${encodeURIComponent(n.cat)}">${esc(n.cat)}</a></p>
      <h1>${esc(n.title)}</h1>
      <div class="article-meta"><span>${avatar(USERS.equipe, 28)}Equipe ${esc(BRAND.first)}</span><span>${ago(n.date)} atrás</span><span>${n.read} min de leitura</span>
        <span class="article-tools"><button class="act ${store.isSaved(n.slug) ? "on" : ""}" data-save="${n.slug}" aria-label="Salvar">${icon("bookmark")}</button><button class="act" data-share="${n.slug}" aria-label="Compartilhar">${icon("send")}</button></span></div>
      <div class="article-art" style="background:${art(n.hue, 2)}"></div>
      <div class="article-body">${n.body.map((p) => `<p>${esc(p)}</p>`).join("")}<p class="fine">Notícia fictícia para demonstração do layout.</p></div>
      <section id="comentarios" class="article-comments">
        <h2>Comentários (${comments.length})</h2>
        ${comments.map((c) => `<div class="comment">${avatar(c.me, 30)}<div><b>${esc(c.me.name)}</b><p>${esc(c.text)}</p></div></div>`).join("")}
        ${store.user ? `<form class="comment-form" data-article-comment><input name="c" required placeholder="O que você achou?" aria-label="Comentário"><button class="icon-btn sm" aria-label="Enviar">${icon("send")}</button></form>` : `<p class="muted"><a class="link" href="/entrar?callbackUrl=/noticias/${n.slug}">Entre</a> para comentar.</p>`}
      </section>
    </article>
    ${related.length ? `<section class="related"><h2>Mais em ${esc(n.cat)}</h2><div class="news-grid">${related.map((r, i) => `<article class="news-card"><a class="news-link" href="/noticias/${r.slug}"><div class="news-art" style="background:${art(r.hue, i)}"><span class="cat">${esc(r.cat)}</span></div><div class="news-body"><h3>${esc(r.title)}</h3><p class="news-meta">${ago(r.date)} • ${r.read} min</p></div></a></article>`).join("")}</div></section>` : ""}`,
    mount(root, { rerender }) {
      newsActions(root);
      $("[data-article-comment]", root)?.addEventListener("submit", (e) => { e.preventDefault(); store.addComment(key, e.target.c.value.trim()); rerender(); });
    },
  };
}

// =====================================================================
// Páginas institucionais
// =====================================================================
const STATIC = {
  sobre: ["Sobre o graao club", ["Uma plataforma de cursos e comunidade para aprender com IA de um jeito leve, no seu ritmo.", "[[Texto institucional a definir: história, missão e equipe.]]"]],
  termos: ["Termos de Uso", ["Texto de exemplo. Inclua aqui os termos de uso reais do seu serviço, revisados por um profissional."]],
  privacidade: ["Privacidade", ["Texto de exemplo. Nesta recriação, todos os dados (conta demo, posts, progresso) ficam apenas no localStorage do seu navegador e nada é enviado a servidores.", "Cookies de medição só seriam ativados com o seu consentimento no banner de privacidade."]],
  reembolso: ["Reembolso", ["Texto de exemplo. Descreva aqui a política de reembolso e o prazo de garantia aplicável."]],
};
export function staticPage(key) {
  const s = STATIC[key];
  return { title: s[0], html: `<section class="prose"><h1>${s[0]}</h1>${s[1].map((p) => `<p>${esc(p)}</p>`).join("")}</section>` };
}

export function notFound() {
  return { title: "404", html: `<section class="prose center"><p class="eyebrow">404</p><h1>Página não encontrada</h1><p>O link pode estar quebrado ou a página foi removida.</p><a class="ui-btn primary" href="/">Voltar ao início</a></section>` };
}

// =====================================================================
// /curso/:id — página do curso IA para TDAH
// =====================================================================
const md = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
export function cursoPage(id) {
  if (id !== COURSE.id) return notFound();
  const mods = TRACKS[0].modules;
  const total = mods.reduce((s, m) => s + m.lessons.length, 0);
  const mins = mods.reduce((s, m) => s + m.lessons.reduce((a, l) => a + l.min, 0), 0);
  const done = mods.reduce((s, m) => s + store.progress(m.id).length, 0);
  const start = mods.find((m) => canAccess(m) && store.progress(m.id).length < m.lessons.length) || mods[0];
  const tierName = (t) => planForTier(t)?.name || "";
  return {
    title: COURSE.title,
    html: `
    <article class="course-page">
      <header class="course-top glass">
        <div class="course-top-copy">
          <p class="eyebrow tx-brand">Formação prática · Método ÓRBITA</p>
          <h1>${rb.blur(COURSE.title)}</h1>
          <p class="course-headline big">${esc(COURSE.headline)}</p>
          <p class="course-rotate">Use a IA para ${rb.rotate(["começar", "organizar", "retomar", "entregar"])}</p>
          <p class="course-sub">${esc(COURSE.subheadline)}</p>
          <div class="course-hero-meta"><span>${icon("layers")}${mods.length} módulos</span><span>${icon("play-outline")}${total} aulas</span><span>${icon("clock")}${fmtMin(mins)}</span><span>${icon("award")}${COURSE.projects.length} projetos práticos</span></div>
          <div class="course-hero-actions">${mk.glow(done ? "Continuar curso" : "Começar grátis", store.user ? "/modulo/" + start.id : "/cadastro?callbackUrl=/curso/" + COURSE.id)}<span class="muted sm">${store.user ? `${done}/${total} aulas vistas` : "Módulo 01 liberado no plano Semente"}</span></div>
        </div>
        <div class="course-top-art rb-tilt rb-glare" style="--art:${art(COURSE.hue, 3).replace(/"/g, "'")}"><span>${esc(COURSE.headline)}</span></div>
      </header>

      <section class="course-sec two">
        <div class="course-story">${COURSE.short.map((p) => `<p>${md(p)}</p>`).join("")}
          <details class="more-story"><summary>Ler a descrição completa</summary>${COURSE.story.map((p) => `<p>${md(p)}</p>`).join("")}</details></div>
        <div class="card"><p class="eyebrow tx-brand">Ao longo do curso, você aprenderá a</p><ul class="check-list">${COURSE.youWill.map((t) => `<li>${icon("check")}${esc(t)}</li>`).join("")}</ul></div>
      </section>

      <section class="course-sec">
        <div class="sec-head"><p class="eyebrow tx-brand">Metodologia</p><h2>Método <span class="grad">ÓRBITA</span></h2><p class="muted">Seis etapas para levar uma ideia até a entrega.</p></div>
        ${rb.stepper(COURSE.orbita)}
      </section>

      <section class="course-sec">
        <div class="sec-head"><p class="eyebrow tx-brand">Grade</p><h2>${mods.length} módulos · ${total} aulas · ${fmtMin(mins)}</h2><p class="muted">Aulas curtas com um objetivo, uma demonstração e uma ação prática.</p></div>
        <div class="syllabus">${mods.map((m) => {
          const d = new Set(store.progress(m.id)); const mm = m.lessons.reduce((a, l) => a + l.min, 0); const ok = canAccess(m);
          return `<details class="card syl" ${m.n === 1 ? "open" : ""}>
            <summary><span class="syl-n">${String(m.n).padStart(2, "0")}</span><span class="syl-t"><b>${esc(m.title)}</b><small>${m.lessons.length} aulas · ${fmtMin(mm)} · ${esc(m.level)}</small></span><span class="pill ${ok ? "" : "lock"}">${ok ? (m.tier === 0 ? "Grátis" : "Liberado") : icon("lock") + tierName(m.tier)}</span>${icon("chevron-down")}</summary>
            <p class="syl-obj">${esc(m.objective)}</p>
            <ol class="rb-list">${m.lessons.map((l) => `<li><a href="/aula/${m.id}/${l.id}">${mk.ring(d.has(l.id) ? "done" : "pending", d.has(l.id) ? 1 : 0)}<span><b>${String(l.n).padStart(2, "0")} · ${esc(l.title)}</b><small>${esc(l.material)}</small></span><em>${l.min} min</em></a></li>`).join("")}</ol>
          </details>`;
        }).join("")}</div>
      </section>

      <section class="course-sec">
        <div class="sec-head"><p class="eyebrow tx-brand">Na prática</p><h2>3 projetos práticos</h2></div>
        <div class="projects">${COURSE.projects.map(([t, d], i) => `<div class="card rb-spotlight"><span class="ico-box accent">${icon(["sparkles", "layers", "settings"][i])}</span><b>${esc(t)}</b><p>${esc(d)}</p></div>`).join("")}</div>
      </section>

      <section class="course-sec two">
        <div class="card"><p class="eyebrow tx-brand">Para quem é</p><p class="lead">${esc(COURSE.audience.main)}</p><p class="mini-title">Especialmente</p><ul class="check-list">${COURSE.audience.especially.map((t) => `<li>${icon("check")}${esc(t)}</li>`).join("")}</ul><p class="mini-title">Também para</p><ul class="check-list soft">${COURSE.audience.secondary.map((t) => `<li>${icon("check")}${esc(t)}</li>`).join("")}</ul></div>
        <div class="card"><p class="eyebrow tx-brand">Ao concluir, você deverá conseguir</p><ol class="num-list">${COURSE.outcomes.map((t) => `<li>${esc(t)}</li>`).join("")}</ol></div>
      </section>

      <section class="course-sec two">
        <div class="card"><p class="eyebrow tx-brand">Pré-requisitos</p><ul class="check-list">${COURSE.prerequisites.map((t) => `<li>${icon("check")}${esc(t)}</li>`).join("")}</ul></div>
        <div class="card"><p class="eyebrow tx-brand">Planos</p><ul class="plan-access">${PLANS.map((p) => `<li><span class="ico-box ${p.featured ? "solid" : ""}">${icon(p.icon)}</span><div><b>${p.name} · ${p.tag}</b><small>${esc(p.note.yearly)}</small></div></li>`).join("")}</ul>${mk.more("Ver planos", "/planos")}</div>
      </section>

      <aside class="disclaimer glass">${icon("shield")}<p><b>Uso responsável.</b> ${esc(COURSE.disclaimer)}</p></aside>
      <p class="course-status muted sm">${esc(COURSE.status)}</p>
    </article>`,
  };
}
