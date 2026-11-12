import { icon } from "./icons.js";
import { BRAND } from "./data.js";

export const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export const brandHTML = (cls = "") =>
  `<span class="brand ${cls}"><img src="/brand/mark.svg" alt="" aria-hidden="true"><span>${BRAND.first}<span>${BRAND.second}</span></span></span>`;

// Divide uma palavra em letras animáveis (equivalente ao data-letter-reveal)
export const letters = (text) =>
  `<span class="letters" data-letters><span class="sr-only">${esc(text)}</span>${[...text].map((ch, i) =>
    `<span aria-hidden="true" style="--i:${i}">${ch === " " ? "&nbsp;" : esc(ch)}</span>`).join("")}</span>`;

export function ago(ts) {
  const s = Math.max(1, (Date.now() - ts) / 1000);
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))} min`;
  if (s < 86400) return `${Math.round(s / 3600)} h`;
  return `${Math.round(s / 86400)} d`;
}

export const initials = (name = "?") => name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
export const avatar = (u, size = 40) =>
  `<span class="avatar" style="width:${size}px;height:${size}px;font-size:${Math.round(size * .36)}px;background:linear-gradient(140deg,hsl(${u.hue} 70% 62%),hsl(${(u.hue + 40) % 360} 65% 42%))">${esc(initials(u.name))}</span>`;

// Toast ---------------------------------------------------------------
export function toast(msg, ico = "circle-check") {
  const root = $("#toast-root");
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `${icon(ico)}<span>${esc(msg)}</span>`;
  root.append(el);
  setTimeout(() => { el.classList.add("out"); el.addEventListener("animationend", () => el.remove(), { once: true }); }, 2600);
}

// Modal ---------------------------------------------------------------
export function openModal(html, { dismissible = true, onClose, cls = "" } = {}) {
  const root = $("#overlay-root");
  const wrap = document.createElement("div");
  wrap.className = "modal-backdrop";
  wrap.innerHTML = `<div class="modal ${cls}" role="dialog" aria-modal="true">${dismissible ? `<button class="modal-close" data-close aria-label="Fechar">${icon("x")}</button>` : ""}${html}</div>`;
  const close = () => { wrap.classList.add("out"); setTimeout(() => wrap.remove(), 200); document.removeEventListener("keydown", onKey); onClose?.(); };
  const onKey = (e) => { if (e.key === "Escape" && dismissible) close(); };
  wrap.addEventListener("click", (e) => { if (dismissible && (e.target === wrap || e.target.closest("[data-close]"))) close(); });
  document.addEventListener("keydown", onKey);
  root.append(wrap);
  const dlg = wrap.querySelector(".modal");
  dlg.tabIndex = -1;
  setTimeout(() => (wrap.querySelector("input") || dlg).focus({ preventScroll: true }), 30);
  return { el: wrap, close };
}
export const closeAllModals = () => $$("#overlay-root .modal-backdrop").forEach((m) => m.remove());

// Animações de entrada ao rolar -------------------------------------
let io;
export function observeReveals(root = document) {
  io?.disconnect();
  io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add("is-in");
      e.target.querySelectorAll?.("[data-letters]").forEach((l) => l.classList.add("is-running"));
      if (e.target.matches("[data-letters]")) e.target.classList.add("is-running");
      io.unobserve(e.target);
    }
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
  $$("[data-reveal], [data-letters]", root).forEach((el) => io.observe(el));
}
