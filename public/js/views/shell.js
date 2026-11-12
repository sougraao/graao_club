// Shell do app. Logado: sidebar + topbar (observado no app real).
// Visitante: header público com Notícias/Comunidade/Conteúdos (observado nas páginas bloqueadas).
import { icon } from "../icons.js";
import { BRAND, ONBOARDING } from "../data.js";
import { esc, brandHTML, avatar } from "../ui.js";
import { store } from "../store.js";
import { rb } from "../reactbits.js";

const NAV = [
  ["Principal", [["inicio", "/inicio", "Dashboard", "grid"], ["cursos", "/cursos", "Conteúdos", "play-outline"], ["comunidade", "/comunidade", "Comunidade", "message"], ["ranking", "/ranking", "Ranking", "star-outline"]]],
  ["Informação", [["noticias", "/noticias", "Novidades", "send"]]],
  ["Conta", [["certificados", "/conta/certificados", "Certificados", "award"], ["planos", "/planos", "Planos", "tag"], ["perfil", "/perfil", "Perfil", "user"], ["conta", "/conta", "Configurações", "settings"], ["ajuda", "/ajuda", "Ajuda", "help"]]],
];

export const NOTIFS = [
  ["sparkles", "Boas-vindas à comunidade! Complete os primeiros passos para ganhar pontos.", "agora"],
  ["newspaper", "Nova notícia em Inteligência Artificial.", "1 h"],
  ["book", "Novo módulo de boas-vindas em IA para TDAH.", "1 d"],
];

function publicShell(active, inner) {
  const link = (href, label, key) => `<a href="${href}" ${active === key ? 'aria-current="page"' : ""}>${label}</a>`;
  return `
  <div class="app">
    <header class="app-header">
      <div class="app-header-inner">
        <a href="/" aria-label="${BRAND.full}">${brandHTML("sm")}</a>
        <nav class="app-nav" aria-label="Principal">${link("/noticias", "Novidades", "noticias")}${link("/comunidade", "Comunidade", "comunidade")}${link("/cursos", "Conteúdos", "cursos")}</nav>
        <div class="app-actions">
          <button class="icon-btn" data-action="theme" aria-label="Alternar tema">${icon(store.theme === "dark" ? "sun" : "moon")}</button>
          <a class="ui-btn ghost sm" href="/entrar">Entrar</a><a class="ui-btn primary sm" href="/cadastro">Criar conta</a>
        </div>
      </div>
    </header>
    <main class="app-main" id="conteudo">${inner}</main>
  </div>`;
}

export function appShell(active, inner, { title = "", search = "" } = {}) {
  const u = store.user;
  if (!u) return publicShell(active, inner);
  const ob = store.onboarding();
  const obDone = ONBOARDING.filter(([k]) => ob[k]).length;
  const unread = store.notifRead ? 0 : NOTIFS.length;
  const collapsed = store.sidebarCollapsed;
  const pts = store.points();
  return `
  <div class="shell ${collapsed ? "is-collapsed" : ""}">
    <aside class="sidebar" aria-label="Menu">
      <div class="sidebar-top">
        <a href="/inicio" class="sidebar-brand" aria-label="${BRAND.full}">${brandHTML("sm")}</a>
        <button class="icon-btn sm collapse-btn" data-action="collapse" aria-label="Recolher menu">${icon("chevron-left")}</button>
      </div>
      <nav class="sidebar-nav mk-spotlight">
        ${NAV.map(([group, items]) => `
          <p class="nav-label">${group}</p>
          ${items.map(([key, href, label, ic]) => `<a href="${href}" class="nav-item" ${active === key ? 'aria-current="page"' : ""} title="${label}">${icon(ic)}<span>${label}</span></a>`).join("")}
        `).join("")}
      </nav>
      <a href="/ranking" class="points-card" title="${pts} pontos">
        <span class="points-ico">${icon("trophy")}</span>
        <span><b>${rb.counter(pts)} pontos</b><small>nesta temporada</small></span>
      </a>
    </aside>
    <div class="sidebar-scrim" data-action="close-drawer"></div>

    <div class="shell-main">
      <header class="topbar">
        <button class="icon-btn menu-btn" data-action="open-drawer" aria-label="Abrir menu">${icon("menu")}</button>
        <nav class="crumb" aria-label="Você está em"><a href="/inicio">${BRAND.first}<span>${BRAND.second}</span></a><span>/</span><b>${esc(title)}</b></nav>
        ${search}
        <div class="topbar-actions">
          <button class="icon-btn" data-action="theme" aria-label="Alternar tema">${icon(store.theme === "dark" ? "sun" : "moon")}</button>
          <div class="pop-wrap">
            <button class="icon-btn bell" data-pop="notifs" aria-label="Notificações" aria-expanded="false">${icon("bell")}${unread ? `<span class="dot">${unread}</span>` : ""}</button>
            <div class="pop notif-pop" data-pop-panel="notifs" hidden>
              <p class="pop-title">Notificações</p>
              ${NOTIFS.map(([ic, t, when]) => `<div class="notif">${icon(ic)}<p>${esc(t)}<small>${when}</small></p></div>`).join("")}
            </div>
          </div>
          <div class="pop-wrap">
            <button class="user-btn" data-pop="user" aria-expanded="false">${avatar(u, 30)}<span>${esc(u.name.split(" ")[0])}</span>${icon("chevron-down")}</button>
            <div class="pop user-pop" data-pop-panel="user" hidden>
              <div class="user-pop-head">${avatar(u, 38)}<div><b>${esc(u.name)}</b><small>@${esc(u.handle)}</small></div></div>
              <a href="/perfil">${icon("user")}Meu perfil</a>
              <a href="/conta">${icon("settings")}Configurações</a>
              <a href="/planos">${icon("tag")}Planos</a>
              <button data-action="logout">${icon("logout")}Sair</button>
            </div>
          </div>
        </div>
      </header>
      <main class="app-main" id="conteudo">${inner}</main>
      <footer class="app-footer"><span>© ${new Date().getFullYear()} ${BRAND.full}</span><nav><a href="/design-system">Design System</a><a href="/ajuda">Central de ajuda</a><a href="/termos">Termos</a><a href="/privacidade">Privacidade</a><a href="/reembolso">Reembolso</a><a href="/ajuda">Ajuda</a></nav></footer>
    </div>

    <nav class="app-tabbar mk-icon-tabs" aria-label="Navegação inferior">
      <a href="/comunidade" ${active === "comunidade" ? 'aria-current="page"' : ""}>${icon("message")}<span>Comunidade</span></a>
      <a href="/noticias" ${active === "noticias" ? 'aria-current="page"' : ""}>${icon("send")}<span>Novidades</span></a>
      <a href="/cursos" ${active === "cursos" ? 'aria-current="page"' : ""}>${icon("play-outline")}<span>Conteúdos</span></a>
      <a href="/perfil" ${active === "perfil" ? 'aria-current="page"' : ""}>${avatar(u, 22)}<span>Perfil</span></a>
    </nav>
    ${obDone < ONBOARDING.length ? `<a class="ob-fab" href="/inicio" aria-label="Primeiros passos: ${obDone} de ${ONBOARDING.length}">${obDone}/${ONBOARDING.length}</a>` : ""}
  </div>`;
}

// Comportamentos do shell (popovers, drawer, recolher)
export function mountShell(root, { navigate, rerender }) {
  root.addEventListener("click", (e) => {
    const t = e.target.closest("[data-pop]");
    const panels = root.querySelectorAll("[data-pop-panel]");
    if (t) {
      const p = root.querySelector(`[data-pop-panel="${t.dataset.pop}"]`);
      const open = p.hidden;
      panels.forEach((x) => (x.hidden = true));
      root.querySelectorAll("[data-pop]").forEach((x) => x.setAttribute("aria-expanded", "false"));
      p.hidden = !open; t.setAttribute("aria-expanded", String(open));
      if (open && t.dataset.pop === "notifs") { store.readNotifs(); t.querySelector(".dot")?.remove(); }
      return;
    }
    if (!e.target.closest(".pop")) panels.forEach((x) => (x.hidden = true));
    const a = e.target.closest("[data-action]");
    if (!a) return;
    if (a.dataset.action === "collapse") { store.setSidebarCollapsed(!store.sidebarCollapsed); root.querySelector(".shell")?.classList.toggle("is-collapsed"); }
    if (a.dataset.action === "open-drawer") root.querySelector(".shell")?.classList.add("drawer-open");
    if (a.dataset.action === "close-drawer") root.querySelector(".shell")?.classList.remove("drawer-open");
    if (a.dataset.action === "logout") { store.logout(); navigate("/", true); }
  });
}
