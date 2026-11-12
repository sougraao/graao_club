// graao club × MicroKit — microinterações adaptadas de microkit.co (MIT),
// reescritas em JS puro. Use os helpers de markup + initMicrokit(root) após cada render.
import { icon } from "./icons.js";

const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// ---------------------------------------------------------------- markup
export const mk = {
  glow: (label, href, attrs = "") => href
    ? `<a class="mk-glow" href="${href}" ${attrs}>${esc(label)}${icon("arrow-right")}</a>`
    : `<button class="mk-glow" ${attrs}>${esc(label)}${icon("arrow-right")}</button>`,
  hold: (label, attrs = "") => `<button type="button" class="mk-hold" ${attrs} aria-label="${esc(label)} (segure para confirmar)">${icon("trash")}<span>${esc(label)}</span></button>`,
  check: (label, { checked = false, strike = false, attrs = "" } = {}) =>
    `<label class="mk-check ${strike ? "strike" : ""}"><input type="checkbox" ${checked ? "checked" : ""} ${attrs}><span class="box"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7"/></svg></span><span class="txt">${esc(label)}</span></label>`,
  ring: (state = "pending", p = 0) => `<svg class="mk-ring ${state === "done" ? "is-done" : state === "current" ? "is-current" : ""}" style="--p:${p}" viewBox="0 0 22 22" aria-hidden="true"><circle class="bg" cx="11" cy="11" r="9" fill="none"/><circle class="track" cx="11" cy="11" r="9"/><circle class="arc" cx="11" cy="11" r="9"/><path class="tick" d="M6.8 11.4l2.8 2.8 5.6-5.8"/></svg>`,
  count: (n, suffix = "") => `<span class="mk-count" data-count="${n}" data-suffix="${esc(suffix)}">${n}${esc(suffix)}</span>`,
  swap: (text) => `<span class="mk-swap" aria-label="${esc(text)}">${[...text].map((c, i) => `<span style="--i:${i}" aria-hidden="true"><i>${esc(c)}</i><i>${esc(c)}</i></span>`).join("")}</span>`,
  more: (label, href) => `<a class="mk-more" href="${href}">${icon("arrow-right", "icon lead")}<span>${esc(label)}</span>${icon("arrow-right", "icon trail")}</a>`,
};

// ---------------------------------------------------------------- behaviors
function glow(root) {
  root.querySelectorAll(".mk-glow").forEach((el) => {
    if (el._mk) return; el._mk = 1;
    let target = .5, x = .5, raf = 0;
    const tick = () => { x += (target - x) * .16; el.style.setProperty("--x", x.toFixed(3)); el.style.setProperty("--left", Math.max(0, 1 - x * 2).toFixed(3)); el.style.setProperty("--right", Math.max(0, x * 2 - 1).toFixed(3)); raf = Math.abs(target - x) > .002 ? requestAnimationFrame(tick) : 0; };
    el.addEventListener("pointermove", (e) => { const r = el.getBoundingClientRect(); target = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)); if (!raf && !reduce()) raf = requestAnimationFrame(tick); });
    el.addEventListener("pointerleave", () => { target = .5; if (!raf && !reduce()) raf = requestAnimationFrame(tick); });
  });
}

function magnetic(root) {
  root.querySelectorAll(".mk-magnetic").forEach((el) => {
    if (el._mk) return; el._mk = 1;
    el.addEventListener("pointermove", (e) => { if (reduce()) return; const r = el.getBoundingClientRect(); const dx = (e.clientX - r.left - r.width / 2) / r.width, dy = (e.clientY - r.top - r.height / 2) / r.height; el.style.transform = `translate(${dx * 10}px, ${dy * 8}px)`; });
    el.addEventListener("pointerleave", () => (el.style.transform = ""));
  });
}

function hold(root) {
  root.querySelectorAll(".mk-hold").forEach((el) => {
    if (el._mk) return; el._mk = 1;
    const ms = parseFloat(getComputedStyle(el).getPropertyValue("--hold")) * 1000 || 1200;
    let t;
    const start = (e) => { if (e.button > 0 || el.classList.contains("is-done")) return; el.classList.add("is-holding"); t = setTimeout(() => { el.classList.remove("is-holding"); el.classList.add("is-done"); el.querySelector("svg").outerHTML = icon("check"); el.dispatchEvent(new CustomEvent("mk:hold", { bubbles: true })); }, ms); };
    const stop = () => { clearTimeout(t); el.classList.remove("is-holding"); };
    el.addEventListener("pointerdown", start);
    ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => el.addEventListener(ev, stop));
    el.addEventListener("keydown", (e) => { if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); start(e); } });
    el.addEventListener("keyup", (e) => { if (e.key === " " || e.key === "Enter") stop(); });
  });
}

// Fuse Undo: transforma um botão em "Desfazer" com pavio; o pavio pausa no hover.
export function fuse(el, { seconds = 5, onExpire, onUndo } = {}) {
  el.className = "mk-fuse"; el.innerHTML = `${icon("arrow-left")}Desfazer`;
  let left = seconds * 1000, last = performance.now(), hovered = false, raf;
  el.addEventListener("pointerenter", () => (hovered = true));
  el.addEventListener("pointerleave", () => (hovered = false));
  const loop = (now) => { if (!hovered) left -= now - last; last = now; el.style.setProperty("--p", Math.max(0, left / (seconds * 1000))); if (left <= 0) { onExpire?.(); return; } raf = requestAnimationFrame(loop); };
  raf = requestAnimationFrame(loop);
  el.addEventListener("click", (e) => { e.stopPropagation(); cancelAnimationFrame(raf); onUndo?.(); }, { once: true });
}

function count(root) {
  const els = [...root.querySelectorAll(".mk-count:not([data-done])")];
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target; io.unobserve(el); el.dataset.done = 1;
    const to = Number(el.dataset.count), suf = el.dataset.suffix || "";
    el.style.minWidth = `${String(to).length + suf.length}ch`; // reserva a largura final
    if (reduce() || !to) { el.textContent = to + suf; return; }
    const t0 = performance.now(), dur = 1100;
    const step = (now) => { const k = Math.min(1, (now - t0) / dur); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 4))) + suf; if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .4 });
  els.forEach((el) => io.observe(el));
}

function tabs(root) {
  root.querySelectorAll(".mk-tabs").forEach((el) => {
    const set = (a) => { if (!a) return; el.style.setProperty("--l", a.offsetLeft + "px"); el.style.setProperty("--w", a.offsetWidth + "px"); };
    const active = () => el.querySelector('[aria-current="page"], [aria-selected="true"]');
    requestAnimationFrame(() => set(active()));
    if (el._mk) return; el._mk = 1;
    el.addEventListener("pointerover", (e) => set(e.target.closest("a, button")));
    el.addEventListener("pointerleave", () => set(active()));
  });
}

function spotlight(root) {
  root.querySelectorAll(".mk-spotlight").forEach((nav) => {
    let rail = nav.querySelector(".mk-spotlight-rail");
    if (!rail) { rail = document.createElement("span"); rail.className = "mk-spotlight-rail"; nav.prepend(rail); }
    const place = (a) => { if (!a) { rail.style.opacity = 0; return; } rail.style.opacity = 1; rail.style.setProperty("--y", a.offsetTop + (a.offsetHeight - 22) / 2 + "px"); };
    const cur = () => nav.querySelector('[aria-current="page"]');
    place(cur());
    if (nav._mk) return; nav._mk = 1;
    nav.addEventListener("pointerover", (e) => { const a = e.target.closest("a"); if (a) place(a); });
    nav.addEventListener("pointerleave", () => place(cur()));
  });
}

function glide(root) {
  root.querySelectorAll(".mk-glide").forEach((g) => {
    if (g._mk) return; g._mk = 1;
    g.addEventListener("pointermove", (e) => { for (const c of g.children) { const r = c.getBoundingClientRect(); c.style.setProperty("--mx", e.clientX - r.left + "px"); c.style.setProperty("--my", e.clientY - r.top + "px"); } });
  });
}

export function initMicrokit(root = document) {
  glow(root); magnetic(root); hold(root); count(root); tabs(root); spotlight(root); glide(root);
}
addEventListener("resize", () => { tabs(document); spotlight(document); });
