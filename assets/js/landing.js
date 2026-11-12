/* =====================================================================
   IA para TDAH — comportamento do site público (index.html e descadastro.html)
   - Demonstração conceitual do hero (destaque que percorre as etapas)
   - Método ÓRBITA: abas acessíveis (toque, clique e teclado: setas, Home, End)
   - Cadastro de interesse: grava no Supabase via RPC register_interest.
     A confirmação SÓ aparece depois que o servidor responde ok.
     Sem servidor configurado (env.js vazio) → avisa que está indisponível; nada é "fingido".
   Sem dependências: usa fetch direto na API REST do Supabase com a chave PÚBLICA (anon).
   ===================================================================== */
(function () {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const ENV = window.GRAAO_ENV || {};
  const startedAt = Date.now();

  /* Chamada RPC pública (só funções liberadas para o papel anon) */
  async function rpc(fn, body) {
    if (!ENV.supabaseUrl || !ENV.supabaseKey) { const e = new Error("unavailable"); e.code = "unavailable"; throw e; }
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    try {
      const r = await fetch(`${ENV.supabaseUrl}/rest/v1/rpc/${fn}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: ENV.supabaseKey, Authorization: `Bearer ${ENV.supabaseKey}` },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      });
      const data = await r.json().catch(() => null);
      if (!r.ok) { const e = new Error(data?.message || `HTTP ${r.status}`); e.code = data?.message || "http"; throw e; }
      return data;
    } catch (e) {
      if (e.name === "AbortError" || e instanceof TypeError) { const n = new Error("network"); n.code = "network"; throw n; }
      throw e;
    } finally { clearTimeout(timer); }
  }

  const MESSAGES = {
    invalid_email: "Confira o e-mail: parece que falta alguma parte.",
    consent_required: "Para receber as novidades, marque a autorização.",
    too_fast: "Foi rápido demais. Confira os dados e envie de novo.",
    rate_limited: "Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo.",
    network: "Não conseguimos falar com o servidor. Verifique sua internet e tente de novo. Seu cadastro ainda não foi confirmado.",
    unavailable: "O cadastro está indisponível neste ambiente de demonstração. Nenhum dado foi enviado.",
  };
  const msgFor = (e) => MESSAGES[e?.code] || "Algo deu errado do nosso lado. Tente de novo em instantes. Seu cadastro ainda não foi confirmado.";

  /* ---------- Hero com vídeo: cabeçalho sobre o vídeo, pausa do vídeo e menu em tela cheia ---------- */
  const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.gMotion === "reduce";
  function initHero() {
    const hero = $("[data-hero]");
    const header = $("[data-hero-header]");
    if (!hero) return;
    const io = "IntersectionObserver" in window;

    // Cabeçalho em modo Noite só enquanto passa sobre o vídeo.
    if (header && io) new IntersectionObserver(([e]) => header.classList.toggle("g-noite", e.isIntersecting), { rootMargin: "-72px 0px 0px 0px" }).observe(hero);

    // Vídeo: respeita movimento reduzido, tem pausa manual e para fora da tela.
    const video = $("[data-hero-video]", hero);
    const btn = $("[data-hero-pause]", hero);
    if (video) {
      let userPaused = reduce();
      const play = () => { const p = video.play(); if (p && p.catch) p.catch(() => {}); };
      const sync = () => {
        if (!btn) return;
        const paused = video.paused;
        btn.setAttribute("aria-pressed", String(paused));
        btn.setAttribute("aria-label", paused ? "Reproduzir vídeo de fundo" : "Pausar vídeo de fundo");
        $("use", btn)?.setAttribute("href", paused ? "#i-play" : "#i-pause");
      };
      if (userPaused) { video.removeAttribute("autoplay"); video.pause(); }
      video.addEventListener("play", sync);
      video.addEventListener("pause", sync);
      btn?.addEventListener("click", () => { userPaused = !video.paused; if (userPaused) video.pause(); else play(); });
      if (io) new IntersectionObserver(([e]) => { if (!e.isIntersecting) video.pause(); else if (!userPaused) play(); }).observe(hero);
      sync();
    }

    // Menu em tela cheia (abaixo de 1100px).
    const menu = $("#site-menu");
    const opener = $("[data-menu-open]");
    if (!menu || !opener) return;
    const closer = $("[data-menu-close]", menu);
    let timer = 0, smooth = false;
    const open = () => {
      clearTimeout(timer);
      menu.hidden = false;
      void menu.offsetWidth; // aplica o estado inicial antes da transição
      menu.classList.add("is-open");
      opener.setAttribute("aria-expanded", "true");
      document.documentElement.style.overflow = "hidden";
      if (window.G?.smooth?.enabled) { smooth = true; G.smooth.disable(); }
      closer?.focus();
    };
    const close = (restoreFocus = true) => {
      if (!menu.classList.contains("is-open")) return;
      menu.classList.remove("is-open");
      opener.setAttribute("aria-expanded", "false");
      document.documentElement.style.overflow = "";
      if (smooth) { smooth = false; G.smooth.enable(document.documentElement.dataset.gSmooth); }
      timer = setTimeout(() => { menu.hidden = true; }, reduce() ? 0 : 560);
      if (restoreFocus) opener.focus();
    };
    opener.addEventListener("click", open);
    closer?.addEventListener("click", () => close());
    $$("a", menu).forEach((a) => a.addEventListener("click", () => close(false)));
    menu.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { e.preventDefault(); close(); return; }
      if (e.key !== "Tab") return;
      const items = $$("a[href], button", menu);
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    matchMedia("(min-width: 1100px)").addEventListener("change", (e) => { if (e.matches) close(false); });
  }

  /* ---------- Método ÓRBITA: abas (WAI-ARIA tabs, ativação manual por clique/toque/Enter e automática por setas) ---------- */
  function initOrbita() {
    const bar = $("[data-orbita]");
    if (!bar) return;
    const tabs = $$('[role="tab"]', bar);
    const select = (t, focus) => {
      tabs.forEach((x) => {
        const on = x === t;
        x.setAttribute("aria-selected", String(on));
        x.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(x.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
      if (focus) t.focus();
    };
    tabs.forEach((t, idx) => {
      t.addEventListener("click", () => select(t));
      t.addEventListener("keydown", (e) => {
        const map = { ArrowRight: idx + 1, ArrowDown: idx + 1, ArrowLeft: idx - 1, ArrowUp: idx - 1, Home: 0, End: tabs.length - 1 };
        if (!(e.key in map)) return;
        e.preventDefault();
        select(tabs[(map[e.key] + tabs.length) % tabs.length], true);
      });
    });
  }

  /* ---------- Cadastro de interesse ---------- */
  function initLeadForm() {
    const form = $("#lead-form");
    if (!form) return;
    const err = $("#lead-error"), btn = $("#lead-submit"), email = $("#lead-email"), consent = $("#lead-consent");
    const label = btn.querySelector("span");
    const original = label.textContent;
    const mark = (field, on) => field.closest(".g-field")?.classList.toggle("g-field--error", on);
    email.addEventListener("input", () => { mark(email, false); err.textContent = ""; });
    consent.addEventListener("change", () => { err.textContent = ""; });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      err.textContent = "";
      const value = email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) || value.length > 254) { mark(email, true); err.textContent = MESSAGES.invalid_email; email.focus(); return; }
      if (!consent.checked) { err.textContent = MESSAGES.consent_required; consent.focus(); return; }

      btn.disabled = true; btn.setAttribute("aria-busy", "true"); label.textContent = "Enviando…";
      try {
        const res = await rpc("register_interest", {
          p_email: value,
          p_name: $("#lead-name").value.trim() || null,
          p_area: $("#lead-area").value || null,
          p_consent: true,
          p_source: form.dataset.source || "landing",
          p_website: $("#lead-website").value || null,
          p_elapsed_ms: Date.now() - startedAt,
        });
        if (!res || res.ok !== true) throw Object.assign(new Error("unexpected"), { code: "unexpected" });
        form.hidden = true;
        const done = $("#lead-done");
        done.hidden = false;
        done.focus();
      } catch (ex) {
        err.textContent = msgFor(ex);
        if (ex.code === "invalid_email") { mark(email, true); email.focus(); }
      } finally {
        btn.disabled = false; btn.removeAttribute("aria-busy"); label.textContent = original;
      }
    });
  }

  /* ---------- Descadastro (descadastro.html?t=<token>) ---------- */
  function initUnsubscribe() {
    const box = $("#unsub");
    if (!box) return;
    const token = new URLSearchParams(location.search).get("t") || "";
    const out = $("#unsub-msg"), btn = $("#unsub-btn");
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token)) {
      btn.hidden = true;
      out.textContent = "Este link de descadastro está incompleto. Abra o link exatamente como veio no e-mail.";
      return;
    }
    btn.addEventListener("click", async () => {
      btn.disabled = true; btn.textContent = "Processando…"; out.textContent = "";
      try {
        const ok = await rpc("unsubscribe_interest", { p_token: token });
        if (ok === true) { btn.hidden = true; out.textContent = "Pronto. Você não vai mais receber comunicações sobre o programa."; }
        else { btn.disabled = false; btn.textContent = "Confirmar descadastro"; out.textContent = "Não encontramos este cadastro. Ele pode já ter sido removido."; }
      } catch (ex) {
        btn.disabled = false; btn.textContent = "Confirmar descadastro";
        out.textContent = msgFor(ex);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => { initHero(); initOrbita(); initLeadForm(); initUnsubscribe(); });
})();
