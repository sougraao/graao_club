// graao club × React Bits — componentes inspirados em reactbits.dev
// (MIT + Commons Clause), reescritos em JS puro. Helpers de markup + initReactbits(root).
const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export const rb = {
  blur: (text) => `<span class="rb-blur" aria-label="${esc(text)}">${text.split(/(\s+)/).filter(Boolean).map((w, i) => `<span aria-hidden="true" style="--i:${i}">${esc(w)}</span>`).join("")}</span>`,
  rotate: (words) => `<span class="rb-rotate" data-rb-rotate aria-label="${esc(words.join(", "))}">${words.map((w, k) => `<span class="${k ? "" : "on"}" aria-hidden="true">${[...w].map((c, i) => `<i style="--i:${i}">${esc(c)}</i>`).join("")}</span>`).join("")}</span>`,
  shiny: (text) => `<span class="rb-shiny">${esc(text)}</span>`,
  gradient: (text) => `<span class="rb-gradient">${esc(text)}</span>`,
  counter: (n) => `<span class="rb-counter" aria-label="${n}">${String(n).split("").map((d) => `<span style="--d:0" data-d="${d}" aria-hidden="true">${"0123456789".split("").map((x) => `<i>${x}</i>`).join("")}</span>`).join("")}</span>`,
  stepper: (steps) => `<div class="card rb-stepper" data-rb-stepper>
      <div class="rb-steps">${steps.map(([l], i) => `${i ? `<span class="rb-step-line"><i></i></span>` : ""}<button class="rb-step-dot" data-step="${i}" ${i ? "" : 'aria-current="step"'} aria-label="Etapa ${i + 1}">${esc(l)}</button>`).join("")}</div>
      <div class="rb-step-body">${steps.map(([, t, d], i) => `<div class="rb-step-panel ${i ? "" : "on"}" data-panel="${i}"><small>Etapa ${i + 1} de ${steps.length}</small><b>${esc(t)}</b><p>${esc(d)}</p></div>`).join("")}</div>
      <div class="rb-step-actions"><button class="ui-btn ghost sm" data-step-prev disabled>Voltar</button><button class="ui-btn primary sm" data-step-next>Próxima etapa</button></div>
    </div>`,
};

function observeIn(sel, root) {
  const els = [...root.querySelectorAll(sel + ":not(.is-in)")];
  if (!els.length) return;
  if (reduce()) { els.forEach((e) => e.classList.add("is-in")); return; }
  const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add("is-in"); io.unobserve(x.target); } }), { threshold: .2 });
  els.forEach((e) => { [...e.children].forEach((c, i) => c.style.setProperty("--i", i)); io.observe(e); });
}

const timers = new Set();
function rotate(root) {
  root.querySelectorAll("[data-rb-rotate]").forEach((el) => {
    if (el._rb || reduce()) return; el._rb = 1;
    const items = [...el.children]; let k = 0;
    const t = setInterval(() => {
      if (!el.isConnected) { clearInterval(t); timers.delete(t); return; }
      const cur = items[k]; k = (k + 1) % items.length; const nx = items[k];
      cur.classList.add("out"); cur.classList.remove("on");
      setTimeout(() => cur.classList.remove("out"), 500);
      nx.classList.add("on");
    }, 2400);
    timers.add(t);
  });
}

function spotlight(root) {
  root.querySelectorAll(".rb-spotlight").forEach((el) => {
    if (el._rb) return; el._rb = 1;
    el.addEventListener("pointermove", (e) => { const r = el.getBoundingClientRect(); el.style.setProperty("--sx", e.clientX - r.left + "px"); el.style.setProperty("--sy", e.clientY - r.top + "px"); });
  });
}

function tilt(root) {
  root.querySelectorAll(".rb-tilt").forEach((el) => {
    if (el._rb) return; el._rb = 1;
    el.addEventListener("pointermove", (e) => {
      if (reduce() || e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.classList.add("is-moving"); el.style.setProperty("--rx", (-y * 10).toFixed(2) + "deg"); el.style.setProperty("--ry", (x * 12).toFixed(2) + "deg"); el.style.setProperty("--ts", 1.02);
    });
    el.addEventListener("pointerleave", () => { el.classList.remove("is-moving"); el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); el.style.setProperty("--ts", 1); });
  });
}

function stepper(root) {
  root.querySelectorAll("[data-rb-stepper]").forEach((el) => {
    if (el._rb) return; el._rb = 1;
    const dots = [...el.querySelectorAll(".rb-step-dot")], lines = [...el.querySelectorAll(".rb-step-line")], panels = [...el.querySelectorAll(".rb-step-panel")];
    const prev = el.querySelector("[data-step-prev]"), next = el.querySelector("[data-step-next]");
    let cur = 0;
    const go = (n) => {
      n = Math.max(0, Math.min(panels.length - 1, n));
      panels.forEach((p, i) => { p.classList.toggle("on", i === n); p.classList.toggle("left", i < n); });
      dots.forEach((d, i) => { d.classList.toggle("done", i < n); i === n ? d.setAttribute("aria-current", "step") : d.removeAttribute("aria-current"); });
      lines.forEach((l, i) => l.classList.toggle("done", i < n));
      prev.disabled = n === 0; next.textContent = n === panels.length - 1 ? "Recomeçar" : "Próxima etapa";
      cur = n;
    };
    dots.forEach((d) => d.addEventListener("click", () => go(Number(d.dataset.step))));
    prev.addEventListener("click", () => go(cur - 1));
    next.addEventListener("click", () => go(cur === panels.length - 1 ? 0 : cur + 1));
  });
}

function counter(root) {
  root.querySelectorAll(".rb-counter:not([data-done])").forEach((el) => {
    el.dataset.done = 1;
    requestAnimationFrame(() => requestAnimationFrame(() => el.querySelectorAll("[data-d]").forEach((s) => s.style.setProperty("--d", s.dataset.d))));
  });
}

let sparkReady = false;
function sparks() {
  if (sparkReady) return; sparkReady = true;
  document.addEventListener("click", (e) => {
    const t = e.target.closest(".mk-glow, .ui-btn.primary, .btn-primary, [data-rb-spark]");
    if (!t || reduce()) return;
    const layer = document.createElement("div"); layer.className = "rb-spark-layer";
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2, s = document.createElement("span");
      s.className = "rb-spark"; s.style.left = e.clientX + "px"; s.style.top = e.clientY + "px";
      s.style.rotate = a + Math.PI / 2 + "rad"; s.style.setProperty("--dx", Math.cos(a) * 26 + "px"); s.style.setProperty("--dy", Math.sin(a) * 26 + "px");
      layer.append(s);
    }
    document.body.append(layer); setTimeout(() => layer.remove(), 550);
  }, true);
}

let heartReady = false;
function hearts() {
  if (heartReady) return; heartReady = true;
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-like], [data-like-news]");
    if (!b || reduce()) return;
    requestAnimationFrame(() => { if (b.classList.contains("on")) { b.classList.remove("rb-pulse"); void b.offsetWidth; b.classList.add("rb-pulse"); setTimeout(() => b.classList.remove("rb-pulse"), 600); } });
  });
}

export function initReactbits(root = document) {
  observeIn(".rb-blur", root); observeIn(".rb-list", root);
  rotate(root); spotlight(root); tilt(root); stepper(root); counter(root); sparks(); hearts();
}
