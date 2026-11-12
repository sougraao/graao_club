// Roteador da SPA + comportamentos globais
import { renderLanding, mountLanding } from "./views/landing.js";
import { renderAuth, mountAuth, gateHTML } from "./views/auth.js";
import { appShell, mountShell } from "./views/shell.js";
import { cursoPage, cursosPage, moduloRedirect, aulaPage, comunidadePage, noticiasPage, artigoPage, staticPage, notFound } from "./views/pages.js";
import { dashboardPage, rankingPage, certificadosPage, planosPage, perfilPage, contaPage, ajudaPage } from "./views/account.js";
import { store } from "./store.js";
import { BRAND } from "./data.js";
import { icon } from "./icons.js";
import { $, openModal, closeAllModals, toast } from "./ui.js";
import { initMicrokit } from "./microkit.js";
import { initReactbits } from "./reactbits.js";
import { designSystemPage } from "./views/designsystem.js";

const app = $("#app");
let cleanup = null;

// gated: visitante vê a página desfocada + modal de entrada (observado em /cursos, /comunidade, /noticias)
// requireLogin: visitante é redirecionado para /entrar?callbackUrl=… (observado em /planos)
function resolve(path, params) {
  const [a, b, c] = path.split("/").filter(Boolean);
  const R = (key, page, opts = {}) => ({ kind: "app", key, page, ...opts });
  if (!a) return { kind: "landing" };
  if (a === "entrar" || a === "cadastro") return { kind: "auth", mode: a };
  if (a === "inicio") return R("inicio", () => dashboardPage(), { requireLogin: true });
  if (a === "cursos") return R("cursos", () => cursosPage(), { gated: true });
  if (a === "curso" && b) return R("cursos", () => cursoPage(b));
  if (a === "modulo" && b) return { kind: "redirect", to: moduloRedirect(b) };
  if (a === "aula" && b && c) return R("cursos", () => aulaPage(b, c), { gated: true });
  if (a === "comunidade") return R("comunidade", () => comunidadePage(params), { gated: true });
  if (a === "ranking") return R("ranking", () => rankingPage(params), { requireLogin: true });
  if (a === "noticias" && b) return R("noticias", () => artigoPage(b), { gated: true });
  if (a === "noticias") return R("noticias", () => noticiasPage(params), { gated: true });
  if (a === "planos") return R("planos", () => planosPage(params), { requireLogin: true });
  if (a === "perfil" || (a === "u" && b === "me")) return R("perfil", () => perfilPage(), { requireLogin: true });
  if (a === "conta" && b === "certificados") return R("certificados", () => certificadosPage(), { requireLogin: true });
  if (a === "conta") return R("conta", () => contaPage(b || ""), { requireLogin: true });
  if (a === "ajuda" || a === "central-de-ajuda" || a === "contato") return R("ajuda", () => ajudaPage());
  if (a === "design-system") return R("design-system", () => designSystemPage());
  if (["sobre", "termos", "privacidade", "reembolso"].includes(a)) return R(a, () => staticPage(a));
  return R("404", () => notFound());
}

function render({ keepScroll = false } = {}) {
  cleanup?.(); cleanup = null;
  closeAllModals();
  const url = new URL(location.href);
  const params = url.searchParams;
  const route = resolve(url.pathname, params);
  const ctx = { params, navigate, rerender: () => render({ keepScroll: true }) };
  const y = scrollY;
  if (store.user) store.markVisit();

  if (route.kind === "redirect") return navigate(route.to || "/cursos", true);
  if (route.kind === "landing") {
    document.title = `${BRAND.full} — Aprenda. Compartilhe. Evolua.`;
    app.innerHTML = renderLanding();
    cleanup = mountLanding(app);
  } else if (route.kind === "auth") {
    if (store.user) return navigate(params.get("callbackUrl") || "/inicio", true);
    document.title = `${route.mode === "entrar" ? "Entrar" : "Criar conta"} · ${BRAND.full}`;
    app.innerHTML = renderAuth(route.mode, params);
    mountAuth(app, ctx);
  } else {
    if (route.requireLogin && !store.user) return navigate(`/entrar?callbackUrl=${encodeURIComponent(url.pathname + url.search)}`, true);
    const page = route.page();
    document.title = `${page.title || "Página"} · ${BRAND.full}`;
    app.innerHTML = appShell(route.key, page.html, { title: page.title, search: page.search });
    const main = $(".app-main", app);
    page.mount?.(main, ctx);
    if (route.gated && !store.user) {
      main.classList.add("is-gated");
      const m = openModal(gateHTML(url.pathname + url.search), { dismissible: false, cls: "gate" });
      m.el.addEventListener("click", (e) => {
        const p = e.target.closest("[data-gate-provider]");
        if (p) { store.login({ name: "Visitante", email: `visitante@${p.dataset.gateProvider.toLowerCase()}.demo`, provider: p.dataset.gateProvider }); toast("Bem-vindo!"); render(); }
      });
    }
  }
  initMicrokit(document);
  initReactbits(document);
  if (keepScroll) scrollTo(0, y);
  else if (location.hash) requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());
  else scrollTo(0, 0);
  maybeConsent();
}

export function navigate(to, replace = false) {
  const url = new URL(to, location.origin);
  if (url.origin !== location.origin) { location.href = to; return; }
  history[replace ? "replaceState" : "pushState"]({}, "", url.pathname + url.search + url.hash);
  render();
}

// Intercepta links internos e formulários GET internos (buscas)
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[href]");
  if (!a || a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  const href = a.getAttribute("href");
  if (href.startsWith("#")) {
    if (href === "#") return e.preventDefault();
    const el = document.getElementById(href.slice(1));
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth" }); history.replaceState({}, "", href); }
    return;
  }
  const url = new URL(href, location.href);
  if (url.origin !== location.origin) return;
  e.preventDefault();
  document.querySelector(".shell")?.classList.remove("drawer-open");
  navigate(url.pathname + url.search + url.hash);
});
document.addEventListener("submit", (e) => {
  const f = e.target;
  if ((f.getAttribute("method") || "get").toLowerCase() !== "get" || !f.getAttribute("action")) return;
  e.preventDefault();
  const qs = new URLSearchParams(new FormData(f));
  [...qs.keys()].forEach((k) => !qs.get(k) && qs.delete(k));
  navigate(f.getAttribute("action") + (qs.toString() ? "?" + qs : ""));
});

// Ações globais
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-action]");
  if (!t) return;
  if (t.dataset.action === "theme") {
    store.setTheme(store.theme === "dark" ? "light" : "dark");
    document.querySelectorAll('[data-action="theme"]').forEach((b) => (b.innerHTML = icon(store.theme === "dark" ? "sun" : "moon")));
  }
  if (t.dataset.action === "soon") { e.preventDefault(); toast("Disponível em breve.", "sparkles"); }
  if (t.dataset.action === "filters") toast("Filtros: use a busca ou as #tags dos posts.", "filter");
});
mountShell(document, { navigate, rerender: () => render({ keepScroll: true }) });

addEventListener("popstate", () => render());

// Banner de privacidade (observado no site): necessários x medição
function maybeConsent() {
  if (store.consent || document.querySelector(".consent")) return;
  const el = document.createElement("aside");
  el.className = "consent";
  el.setAttribute("aria-label", "Preferências de privacidade");
  el.innerHTML = `<div class="consent-body"><div class="consent-title"><span>${icon("lock")}</span><h2>Sua privacidade</h2></div>
    <p>Usamos cookies opcionais para medir visitas e compras e melhorar nossos anúncios. Isso não interfere no seu acesso à ${BRAND.full}. <a href="/privacidade">Saiba mais</a>.</p></div>
    <div class="consent-actions"><button class="ui-btn outline" data-c="necessary">Só os necessários</button><button class="ui-btn primary" data-c="all">Permitir medição</button></div>`;
  el.addEventListener("click", (e) => {
    const b = e.target.closest("[data-c]");
    if (!b) return;
    store.setConsent(b.dataset.c);
    el.style.transition = "opacity .25s, transform .25s"; el.style.opacity = 0; el.style.transform = "translateY(10px)";
    setTimeout(() => el.remove(), 260);
  });
  document.body.append(el);
}

render();
