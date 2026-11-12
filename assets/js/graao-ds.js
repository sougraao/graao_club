/* =====================================================================
   GRAAO DESIGN SYSTEM · comportamentos (micro-interações)
   Sem dependências. Tudo é ativado por atributos data-g-*.
   Chame G.mount(root) depois de inserir HTML novo dinamicamente.
   ===================================================================== */
(function () {
  "use strict";
  /* Movimento reduzido: preferência do sistema OU escolha da pessoa no app (G.motion("reduce")).
     A escolha fica em localStorage "g:motion" e marca <html data-g-motion="reduce"> (o CSS desliga animações). */
  const motionPref = (() => { try { return localStorage.getItem("g:motion"); } catch (e) { return null; } })();
  if (motionPref === "reduce") document.documentElement.dataset.gMotion = "reduce";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches || motionPref === "reduce";
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const once = (el, key) => (el.dataset[key] ? false : (el.dataset[key] = "1"));

  /* Segmento deslizante: <div class="g-segment" data-g-segment> com botões aria-selected/pressed */
  function segment(root) {
    if (!once(root, "gSeg")) return;
    const thumb = document.createElement("span");
    thumb.className = "g-segment__thumb";
    root.prepend(thumb);
    const items = $$("button, a", root);
    const sel = () => items.find((b) => ["aria-selected", "aria-pressed", "aria-current"].some((a) => b.getAttribute(a) === "true" || b.getAttribute(a) === "page"));
    const place = () => {
      const b = sel();
      if (!b) { thumb.style.width = "0"; return; }
      thumb.style.width = b.offsetWidth + "px";
      thumb.style.transform = `translateX(${b.offsetLeft}px)`;
    };
    items.forEach((b) => b.addEventListener("click", () => {
      if (root.dataset.gSegment === "static") return;
      const attr = b.hasAttribute("aria-pressed") ? "aria-pressed" : "aria-selected";
      items.forEach((o) => o.setAttribute(attr, String(o === b)));
      place();
      root.dispatchEvent(new CustomEvent("g:change", { detail: { value: b.dataset.value ?? b.textContent.trim(), el: b } }));
    }));
    new ResizeObserver(place).observe(root);
    place();
  }

  /* Tabs com sublinhado: <div class="g-tabs" data-g-tabs> */
  function tabs(root) {
    if (!once(root, "gTabs")) return;
    const bar = document.createElement("span");
    bar.className = "g-tabs__bar";
    root.append(bar);
    const items = $$("button, a", root);
    const place = () => {
      const b = items.find((x) => x.getAttribute("aria-selected") === "true" || x.getAttribute("aria-current") === "page");
      if (!b) return;
      bar.style.width = b.offsetWidth + "px";
      bar.style.transform = `translateX(${b.offsetLeft - root.scrollLeft}px)`;
    };
    items.forEach((b) => b.addEventListener("click", () => {
      if (b.tagName === "A" && b.getAttribute("href") && !b.getAttribute("href").startsWith("#")) return;
      items.forEach((o) => o.setAttribute("aria-selected", String(o === b)));
      place();
      root.dispatchEvent(new CustomEvent("g:change", { detail: { value: b.dataset.value ?? b.textContent.trim(), el: b } }));
    }));
    new ResizeObserver(place).observe(root);
    place();
  }

  /* Abas de ícone */
  function iconTabs(root) {
    if (!once(root, "gIt")) return;
    const items = $$("button", root);
    items.forEach((b) => b.addEventListener("click", () => {
      items.forEach((o) => o.setAttribute("aria-selected", String(o === b)));
      root.dispatchEvent(new CustomEvent("g:change", { detail: { value: b.dataset.value } }));
    }));
  }

  /* Spotlight da navegação lateral: segue o hover e volta para o item ativo */
  function spotlight(root) {
    if (!once(root, "gSpot")) return;
    const spot = document.createElement("span");
    spot.className = "g-sidenav__spot";
    root.prepend(spot);
    const links = $$("a", root);
    const active = () => links.find((a) => a.getAttribute("aria-current") === "page");
    const moveTo = (a) => {
      if (!a || !a.offsetParent) { spot.style.opacity = "0"; return; }
      spot.style.opacity = "1";
      spot.style.height = a.offsetHeight + "px";
      spot.style.transform = `translateY(${a.offsetTop}px)`;
    };
    links.forEach((a) => a.addEventListener("mouseenter", () => moveTo(a)));
    root.addEventListener("mouseleave", () => moveTo(active()));
    new ResizeObserver(() => moveTo(active())).observe(root);
    moveTo(active());
  }

  /* Menu com destaque deslizante: <div class="g-menu" data-g-glide> com .g-menu__item */
  function glide(root) {
    if (!once(root, "gGlide")) return;
    const hl = document.createElement("span");
    hl.className = "g-glide";
    root.prepend(hl);
    $$(".g-menu__item", root).forEach((it) => {
      const go = () => { hl.style.opacity = "1"; hl.style.height = it.offsetHeight + "px"; hl.style.transform = `translateY(${it.offsetTop}px)`; };
      it.addEventListener("mouseenter", go);
      it.addEventListener("focus", go);
    });
    root.addEventListener("mouseleave", () => (hl.style.opacity = "0"));
  }

  /* Segurar para confirmar: <button class="g-btn g-btn--hold" data-g-hold="1200"> */
  function hold(btn) {
    if (!once(btn, "gHold")) return;
    const ms = +btn.dataset.gHold || 1200;
    let raf, start;
    const label = btn.querySelector("[data-label]");
    const original = label?.textContent;
    const reset = () => { cancelAnimationFrame(raf); btn.style.setProperty("--p", 0); };
    const tick = (t) => {
      start ??= t;
      const p = Math.min(1, (t - start) / ms);
      btn.style.setProperty("--p", p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        btn.classList.add("is-done");
        if (label) label.textContent = btn.dataset.done || "Feito";
        btn.dispatchEvent(new CustomEvent("g:confirm"));
        setTimeout(() => { btn.classList.remove("is-done"); if (label) label.textContent = original; reset(); }, 1800);
      }
    };
    const down = (e) => { if (e.button > 0) return; start = undefined; raf = requestAnimationFrame(tick); };
    btn.addEventListener("pointerdown", down);
    ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => btn.addEventListener(ev, () => { if (!btn.classList.contains("is-done")) reset(); }));
    btn.addEventListener("keydown", (e) => { if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); down(e); } });
    btn.addEventListener("keyup", () => { if (!btn.classList.contains("is-done")) reset(); });
  }

  /* Magnético */
  function magnetic(el) {
    if (!once(el, "gMag") || reduce || matchMedia("(pointer: coarse)").matches) return;
    const k = +el.dataset.gMagnetic || .3;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * k}px, ${(e.clientY - r.top - r.height / 2) * k}px)`;
    });
    el.addEventListener("pointerleave", () => (el.style.transform = ""));
  }

  /* Borda que acende no cursor */
  function glow(el) {
    if (!once(el, "gGlowOn")) return;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--gx", e.clientX - r.left + "px");
      el.style.setProperty("--gy", e.clientY - r.top + "px");
    });
  }

  /* Número arrastável: <div class="g-scrub" data-g-scrub data-min data-max data-step> */
  function scrub(el) {
    if (!once(el, "gScrubOn")) return;
    const out = el.querySelector(".g-scrub__value");
    const min = +(el.dataset.min ?? 0), max = +(el.dataset.max ?? 100), step = +(el.dataset.step ?? 1);
    let v = +(out.textContent || min), x0, v0;
    el.tabIndex = 0;
    el.setAttribute("role", "spinbutton");
    const set = (n) => { v = Math.min(max, Math.max(min, Math.round(n / step) * step)); out.textContent = v; el.setAttribute("aria-valuenow", v); el.dispatchEvent(new CustomEvent("g:change", { detail: { value: v } })); };
    el.setAttribute("aria-valuemin", min); el.setAttribute("aria-valuemax", max);
    el.addEventListener("pointerdown", (e) => { x0 = e.clientX; v0 = v; el.setPointerCapture(e.pointerId); el.classList.add("is-dragging"); });
    el.addEventListener("pointermove", (e) => { if (x0 !== undefined) set(v0 + ((e.clientX - x0) / 4) * step); });
    el.addEventListener("pointerup", () => { x0 = undefined; el.classList.remove("is-dragging"); });
    el.addEventListener("keydown", (e) => { if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); set(v + step); } if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); set(v - step); } });
    set(v);
  }

  /* Contador animado: <span data-g-count="48290" data-decimals="0" data-prefix="" data-suffix=""> */
  const fmtNum = (n, d) => n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
  function countUp(el) {
    if (!once(el, "gCountOn")) return;
    const to = +el.dataset.gCount, d = +(el.dataset.decimals || 0);
    const render = (n) => (el.textContent = (el.dataset.prefix || "") + fmtNum(n, d) + (el.dataset.suffix || ""));
    if (reduce) { render(to); return; }
    render(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now(), dur = +(el.dataset.duration || 1400);
      const step = (t) => { const p = Math.min(1, (t - t0) / dur); render(to * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
    io.observe(el);
  }

  /* Anel: <div class="g-ring" data-g-ring="60"><span>60%</span></div> */
  function ring(el) {
    if (!once(el, "gRingOn")) return;
    requestAnimationFrame(() => el.style.setProperty("--v", el.dataset.gRing));
  }

  /* Cartões empilhados */
  function stackCards(root) {
    if (!once(root, "gStack")) return;
    const items = $$(".g-stack-card", root);
    items.forEach((c) => c.addEventListener("click", () => items.forEach((o) => o.setAttribute("aria-pressed", String(o === c)))));
  }

  /* Carrossel com foco: <div class="g-carousel" data-g-carousel> com .g-carousel__item */
  function carousel(root) {
    if (!once(root, "gCar")) return;
    const items = $$(".g-carousel__item", root);
    let i = +(root.dataset.start ?? Math.floor(items.length / 2));
    const render = () => items.forEach((it, k) => {
      const d = k - i;
      it.classList.toggle("is-focus", d === 0);
      it.classList.toggle("is-near", Math.abs(d) === 1);
      it.style.setProperty("--ry", d === 0 ? "0deg" : (d < 0 ? 14 : -14) + "deg");
      it.style.zIndex = String(10 - Math.abs(d));
      it.setAttribute("aria-current", d === 0 ? "true" : "false");
    });
    const centerOn = (it, smooth) => { if (isPhone()) root.scrollTo({ left: it.offsetLeft + it.offsetWidth / 2 - root.clientWidth / 2, behavior: smooth ? "smooth" : "auto" }); };
    items.forEach((it, k) => it.addEventListener("click", (e) => {
      if (k === i) return;
      e.preventDefault(); i = k; render();
      if (e.isTrusted) centerOn(it, true);
      root.dispatchEvent(new CustomEvent("g:change", { detail: { index: i, el: it, user: e.isTrusted } }));
    }));
    root.tabIndex = 0;
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { i = Math.min(items.length - 1, i + 1); render(); centerOn(items[i], true); }
      if (e.key === "ArrowLeft") { i = Math.max(0, i - 1); render(); centerOn(items[i], true); }
    });
    render();
    requestAnimationFrame(() => centerOn(items[i], false));
  }

  /* Popover genérico: <button data-g-popover="id"> + <div id="id" class="g-popover"> */
  function popover(btn) {
    if (!once(btn, "gPop")) return;
    const pop = document.getElementById(btn.dataset.gPopover);
    if (!pop) return;
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = !pop.classList.contains("is-open");
      $$(".g-popover.is-open").forEach((p) => p.classList.remove("is-open"));
      pop.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  }
  document.addEventListener("click", (e) => { if (!e.target.closest(".g-popover")) $$(".g-popover.is-open").forEach((p) => p.classList.remove("is-open")); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") $$(".g-popover.is-open").forEach((p) => p.classList.remove("is-open")); });

  /* Revelar ao rolar */
  const revealIO = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); revealIO.unobserve(e.target); }
  }), { rootMargin: "0px 0px -8% 0px" }) : null;

  /* Rolagem suave com inércia: ative com <html data-g-smooth> (opcional: data-g-smooth="0.1" = suavidade).
     Só roda com mouse/trackpad em desktop; respeita reduzir movimento, áreas roláveis internas,
     zoom (ctrl+roda) e âncoras. Teclado e barra continuam nativos. */
  const Smooth = (() => {
    let target = 0, current = 0, raf = 0, on = false, ease = .1;
    const max = () => document.documentElement.scrollHeight - innerHeight;
    const clamp = (v) => Math.max(0, Math.min(max(), v));
    const scrollableParent = (el) => {
      for (let n = el; n && n !== document.body && n !== document.documentElement; n = n.parentElement) {
        if (!(n instanceof Element)) continue;
        const s = getComputedStyle(n);
        if (/(auto|scroll)/.test(s.overflowY) && n.scrollHeight > n.clientHeight + 1) return n;
      }
      return null;
    };
    const loop = () => {
      current += (target - current) * ease;
      if (Math.abs(target - current) < .5) current = target;
      window.scrollTo(0, current);
      raf = current === target ? 0 : requestAnimationFrame(loop);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    const onWheel = (e) => {
      if (e.ctrlKey || e.defaultPrevented || scrollableParent(e.target) || document.querySelector(".g-modal")) return;
      e.preventDefault();
      if (!raf) current = scrollY;
      const unit = e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? innerHeight : 1;
      target = clamp((raf ? target : scrollY) + e.deltaY * unit);
      kick();
    };
    const sync = () => { if (!raf) { target = current = scrollY; } };
    const to = (y) => { current = scrollY; target = clamp(y); kick(); };
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute("href").length < 2) return;
      const el = document.getElementById(decodeURIComponent(a.getAttribute("href").slice(1)));
      if (!el) return;
      e.preventDefault();
      history.pushState(null, "", a.getAttribute("href"));
      const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      to(el.getBoundingClientRect().top + scrollY - pad);
    };
    function enable(strength) {
      if (on || reduce || matchMedia("(pointer: coarse)").matches) return false;
      ease = Math.min(.3, Math.max(.04, +strength || .1));
      on = true; target = current = scrollY;
      addEventListener("wheel", onWheel, { passive: false });
      addEventListener("scroll", sync, { passive: true });
      document.addEventListener("click", onClick);
      return true;
    }
    function disable() {
      if (!on) return; on = false; cancelAnimationFrame(raf); raf = 0;
      removeEventListener("wheel", onWheel); removeEventListener("scroll", sync); document.removeEventListener("click", onClick);
    }
    return { enable, disable, to, get enabled() { return on; } };
  })();

  /* Barra de progresso de leitura: <div class="g-scroll-progress" data-g-scroll-progress></div> */
  function scrollProgress(el) {
    if (!once(el, "gSp")) return;
    const upd = () => el.style.setProperty("--g-sp", Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)));
    addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();
  }

  /* Barra de abas some ao rolar para baixo e volta ao subir: <nav class="g-tabbar" data-g-autohide> */
  function tabbarAutohide(bar) {
    if (!once(bar, "gTb")) return;
    let last = scrollY;
    addEventListener("scroll", () => {
      const y = scrollY, down = y > last + 6, up = y < last - 6;
      if (down && y > 120) bar.classList.add("is-hidden");
      if (up || y < 60) bar.classList.remove("is-hidden");
      if (down || up) last = y;
    }, { passive: true });
  }

  /* Carrossel no celular: o card que encaixa no centro vira o foco */
  function carouselSwipe(root) {
    if (!once(root, "gCarSw")) return;
    let t;
    root.addEventListener("scroll", () => {
      if (!isPhone()) return;
      clearTimeout(t);
      t = setTimeout(() => {
        const mid = root.scrollLeft + root.clientWidth / 2;
        const items = $$(".g-carousel__item", root);
        let best = 0, bd = Infinity;
        items.forEach((it, k) => { const d = Math.abs(it.offsetLeft + it.offsetWidth / 2 - mid); if (d < bd) { bd = d; best = k; } });
        if (!items[best].classList.contains("is-focus")) items[best].dispatchEvent(new MouseEvent("click", { bubbles: true }));
      }, 90);
    }, { passive: true });
  }

  /* ---------- APIs imperativas ---------- */
  const icon = (id, cls = "") => `<svg class="g-icon ${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;

  function toast(text, { action, onAction, duration = 3200, iconId = "check" } = {}) {
    let region = document.querySelector(".g-toast-region");
    if (!region) { region = document.createElement("div"); region.className = "g-toast-region"; region.setAttribute("role", "status"); region.setAttribute("aria-live", "polite"); document.body.append(region); }
    const t = document.createElement("div");
    t.className = "g-toast";
    t.innerHTML = `<span class="g-toast__icon">${icon(iconId, "g-icon--sm")}</span><span class="g-toast__text"></span>${action ? `<button class="g-toast__action" type="button"></button>` : ""}<span class="g-toast__fuse" style="animation-duration:${duration}ms"></span>`;
    t.querySelector(".g-toast__text").textContent = text;
    const leave = () => { t.classList.add("is-leaving"); setTimeout(() => t.remove(), 320); };
    if (action) { const b = t.querySelector(".g-toast__action"); b.textContent = action; b.addEventListener("click", () => { onAction?.(); leave(); }); }
    region.append(t);
    setTimeout(leave, duration);
    return leave;
  }

  const isPhone = () => matchMedia("(max-width: 640px)").matches;
  /* Arrastar para fechar (bottom sheet) */
  function sheetDrag(wrap, card, close) {
    let y0 = null, dy = 0;
    card.addEventListener("pointerdown", (e) => {
      if (card.scrollTop > 0 || e.target.closest("input, textarea, select, button, a, label")) return;
      y0 = e.clientY; dy = 0; wrap.classList.add("is-dragging"); card.setPointerCapture(e.pointerId);
    });
    card.addEventListener("pointermove", (e) => { if (y0 === null) return; dy = Math.max(0, e.clientY - y0); card.style.setProperty("--drag", dy + "px"); });
    const end = () => {
      if (y0 === null) return; y0 = null; wrap.classList.remove("is-dragging");
      if (dy > 110) close(); else card.style.setProperty("--drag", "0px");
    };
    card.addEventListener("pointerup", end); card.addEventListener("pointercancel", end);
  }

  function modal(html, { onOpen, label = "Diálogo", sheet } = {}) {
    const wrap = document.createElement("dialog");
    const asSheet = sheet ?? isPhone();
    wrap.className = "g-modal" + (asSheet ? " g-modal--sheet" : "");
    wrap.setAttribute("aria-label", label);
    wrap.innerHTML = `<div class="g-modal__card"><button class="g-icon-btn g-icon-btn--sm g-modal__close" type="button" aria-label="Fechar">${icon("x", "g-icon--sm")}</button>${html}</div>`;
    const prev = document.activeElement;
    let closing = false;
    const close = () => { if (closing) return; closing = true; wrap.classList.remove("is-open"); setTimeout(() => { wrap.close(); wrap.remove(); prev?.focus?.(); }, 300); };
    wrap.addEventListener("cancel", (e) => { e.preventDefault(); close(); });
    wrap.addEventListener("click", (e) => { if (e.target === wrap || e.target.closest(".g-modal__close") || e.target.closest("[data-close]")) close(); });
    document.body.append(wrap);
    wrap.showModal();
    if (asSheet) sheetDrag(wrap, wrap.querySelector(".g-modal__card"), close);
    mount(wrap);
    requestAnimationFrame(() => requestAnimationFrame(() => wrap.classList.add("is-open")));
    onOpen?.(wrap, close);
    wrap.querySelector(".g-modal__close").focus();
    return close;
  }

  /* ---------- Botão principal: luz na borda (.g-btn--accent) ----------
     A luz segue o cursor com mola; a borda do lado mais próximo acende mais; o clique dá um pulso. */
  function edge(btn) {
    if (reduce || btn.dataset.gEdge === "off" || btn.matches(".g-btn--swap, .g-btn--hold") || !once(btn, "gEdgeOn")) return;
    const REST_X = 0.9, REST_G = 0.5;
    let x = REST_X, g = REST_G, tx = x, tg = g, raf = 0;
    const paint = () => { btn.style.setProperty("--ex", x.toFixed(3)); btn.style.setProperty("--eg", g.toFixed(3)); };
    const tick = () => {
      x += (tx - x) * 0.16;
      g += (tg - g) * 0.12;
      if (Math.abs(tx - x) < 0.002 && Math.abs(tg - g) < 0.002) { x = tx; g = tg; raf = 0; paint(); return; }
      paint();
      raf = requestAnimationFrame(tick);
    };
    const go = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const aim = (e) => {
      const r = btn.getBoundingClientRect();
      tx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      tg = 0.45 + Math.abs(tx - 0.5) * 1.1; // mais forte perto das pontas
      go();
    };
    btn.addEventListener("pointerenter", aim);
    btn.addEventListener("pointermove", aim);
    btn.addEventListener("pointerdown", (e) => { aim(e); g = 1.4; paint(); go(); });
    btn.addEventListener("pointerleave", () => { tx = REST_X; tg = REST_G; go(); });
  }

  /* ---------- Troca de modo Noite ↔ Dia ----------
     A página nova entra numa varredura diagonal por cima da antiga (View Transitions).
     Dia entra pelo canto inferior direito, Noite pelo superior esquerdo.
     G.theme("light" | "dark", aplicar?) — `aplicar` roda dentro da transição (salvar preferência, trocar ícones).
     Sem suporte ou com movimento reduzido: troca na hora. */
  let themeBusy = null;
  function theme(to, apply) {
    const html = document.documentElement;
    const next = to === "light" || to === "dark" ? to : html.dataset.theme === "dark" ? "light" : "dark";
    const swap = () => { html.dataset.theme = next; apply && apply(next); };
    if (themeBusy) themeBusy.skipTransition();
    if (reduce || !document.startViewTransition || html.dataset.theme === next || document.visibilityState !== "visible") {
      swap();
      return Promise.resolve();
    }
    html.dataset.gThemeTo = next;
    const t = (themeBusy = document.startViewTransition(swap));
    const done = () => { if (themeBusy === t) { themeBusy = null; delete html.dataset.gThemeTo; } };
    t.finished.then(done, done);
    return t.updateCallbackDone;
  }

  function mount(root = document) {
    // inclui o próprio elemento raiz quando ele também é um componente
    const $$ = (sel, r) => [...(r.matches?.(sel) ? [r] : []), ...r.querySelectorAll(sel)];
    $$("[data-g-segment]", root).forEach(segment);
    $$("[data-g-tabs]", root).forEach(tabs);
    $$(".g-icon-tabs", root).forEach(iconTabs);
    $$("[data-g-spotlight]", root).forEach(spotlight);
    $$("[data-g-glide]", root).forEach(glide);
    $$("[data-g-hold]", root).forEach(hold);
    $$("[data-g-magnetic]", root).forEach(magnetic);
    $$(".g-btn--accent", root).forEach(edge);
    $$("[data-g-glow]", root).forEach(glow);
    $$("[data-g-scrub]", root).forEach(scrub);
    $$("[data-g-count]", root).forEach(countUp);
    $$("[data-g-ring]", root).forEach(ring);
    $$(".g-stack-cards", root).forEach(stackCards);
    $$("[data-g-carousel]", root).forEach(carousel);
    $$("[data-g-carousel]", root).forEach(carouselSwipe);
    $$("[data-g-popover]", root).forEach(popover);
    $$(".g-reveal", root).forEach((el) => (revealIO ? revealIO.observe(el) : el.classList.add("is-in")));
    $$("[data-g-scroll-progress]", root).forEach(scrollProgress);
    $$(".g-tabbar[data-g-autohide]", root).forEach(tabbarAutohide);
    if (root === document && document.querySelector(".g-tabbar:not(.is-static)")) document.body.classList.add("has-tabbar");
    const html = document.documentElement;
    if (html.hasAttribute("data-g-smooth") && !Smooth.enabled) Smooth.enable(html.dataset.gSmooth);
  }

  /* G.motion("reduce" | "auto"): salva a escolha. O efeito completo vale a partir do próximo carregamento. */
  function motion(v) {
    try { v === "reduce" ? localStorage.setItem("g:motion", "reduce") : localStorage.removeItem("g:motion"); } catch (e) { /* storage indisponível */ }
    if (v === "reduce") document.documentElement.dataset.gMotion = "reduce"; else delete document.documentElement.dataset.gMotion;
    return v === "reduce";
  }
  motion.current = () => (document.documentElement.dataset.gMotion === "reduce" ? "reduce" : "auto");

  window.G = { mount, toast, modal, icon, smooth: Smooth, theme, motion };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => mount());
  else mount();
})();
