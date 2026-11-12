// /design-system — documentação viva do design system do graao club.
import { icon, btnArrow } from "../icons.js";
import { esc, toast } from "../ui.js";
import { mk } from "../microkit.js";
import { rb } from "../reactbits.js";

const COLORS = [
  ["Neutros", [["--gc-white", "#FFFFFF", "Superfície"], ["--gc-bg", "#F7F9FB", "Fundo da página"], ["--gc-mist", "#EFF4F9", "Superfície suave"], ["--gc-border", "#D8DCE5", "Bordas e divisores"], ["--gc-muted", "#667071", "Texto secundário"], ["--gc-ink", "#1F212D", "Texto principal"], ["--gc-night", "#111516", "Fundo do tema escuro"]]],
  ["Verde-petróleo — primária", [["--gc-teal-soft", "#B7F2E0", "primary-soft · fundos de destaque"], ["--gc-teal", "#087158", "primary · botões e links (texto branco)"], ["--gc-teal-hover", "#065B4A", "primary-hover"]]],
  ["Azul e violeta — secundárias", [["--gc-blue-soft", "#CDE8FD", "info-soft"], ["--gc-blue", "#AAD1FC", "accent-sky"], ["--gc-violet-soft", "#F2DAFE", "Aurora, ilustração"], ["--gc-violet", "#918DE2", "secondary (texto tinta)"], ["--gc-violet-ink", "#5753B5", "Texto de acento *harmonizado"]]],
  ["Quentes — acentos", [["--gc-coral", "#F89777", "accent-coral · destaques pontuais"], ["--gc-yellow", "#FED74B", "accent-yellow · conquistas, estrelas"], ["--gc-danger-600", "#C4384A", "Erro e exclusão"]]],
];

const PRINCIPLES = [
  ["sun", "Suave", "Base clara e fria, verde-petróleo para ação. Coral e amarelo aparecem como calor pontual."],
  ["layers", "Leve", "Vidro translúcido sobre a aurora. Nada de blocos opacos pesados ou bordas escuras."],
  ["circle-check", "Claro", "Uma ação principal por tela, texto com contraste AA e movimento que explica, não distrai."],
  ["sparkles", "Criativo", "Gradientes em títulos, microinterações vivas e formas arredondadas, com moderação."],
];

const RULES = [
  ["Cor", ["Primária verde-petróleo (#087158) com texto branco (6,0:1). No escuro, primária #B7F2E0 com texto tinta.", "Texto sobre fundo claro: tinta #1F212D, muted #667071 (4,8:1), primária #087158 ou violeta-tinta #5753B5.", "Coral, amarelo, azul e violeta claro levam texto tinta, nunca branco. São acentos: no máximo um por componente.", "Vermelho só para erro e exclusão."]],
  ["Vidro", ["G1 — Todo vidro precisa da aurora atrás; sem fundo colorido o desfoque não aparece.", "G2 — Use os 3 níveis: --glass-bg (cards), --glass-bg-strong (popovers, modais, toasts), --chrome-glass (sidebar e topbar).", "G3 — Borda branca translúcida + realce interno (--glass-highlight). Nunca borda cinza escura.", "G4 — No máximo 2 camadas de vidro empilhadas; a 3ª fica sólida (--surface-solid)."]],
  ["Tipografia", ["Bricolage Grotesque só em títulos (h1–h3), peso 600–700, entrelinha 1,05–1,2.", "Geist para tudo de interface e texto corrido; corpo 15–18px, entrelinha 1,6–1,8.", "Gradiente de texto (--gc-grad-text) só na palavra de ênfase do título, uma vez por seção."]],
  ["Forma e espaço", ["Espaçamento em múltiplos de 4 (tokens --sp-*).", "Raios: 12 controles, 16 cards, 24 seções e modais, pill para CTAs e chips.", "Alvos de toque com no mínimo 40px de altura."]],
  ["Movimento", ["Curva padrão --ease-out; --ease-spring só para confirmações (check, toque).", "Durações: 180ms (hover), 300ms (estado), 600ms (entrada).", "Tudo respeita prefers-reduced-motion: os componentes caem para o estado final."]],
  ["Componentes", ["CTA principal por tela: Cursor Edge Glow. Demais ações: btn-secondary ou ui-btn.", "Ação destrutiva irreversível: Hold to Delete. Reversível: Fuse Undo.", "Concluir tarefa: Bounce Checkbox. Status de aula: Progress Ring.", "Números de destaque: Count Up. Navegação entre abas: Sliding Underline Tabs."]],
];

const COMPONENTS = [
  ["Cursor Edge Glow Button", "cursor-edge-glow-button", "CTA principal — uma por tela.", () => mk.glow("Começar curso")],
  ["Magnetic Fill Button", "magnetic-fill-button", "CTA secundário em cabeçalhos.", () => `<button class="btn btn-secondary mk-magnetic"><span>Criar conta</span>${btnArrow()}</button>`],
  ["Subscribe Shine Button", "subscribe-shine-button", "Assinar planos.", () => `<button class="ui-btn primary mk-shine">Escolher Colheita</button>`],
  ["Hold to Delete Button", "hold-to-delete-button", "Exclusão irreversível (segure 1,2 s).", () => mk.hold("Segure para excluir", "data-demo-hold")],
  ["Fuse Undo Button", "fuse-undo-button", "Exclusão reversível com 5 s para desfazer.", () => `<button class="ui-btn outline sm" data-demo-fuse>${icon("trash")}Excluir post</button>`],
  ["Bounce Checkbox", "bounce-checkbox", "Concluir aula ou tarefa.", () => `<div style="display:grid;gap:10px">${mk.check("Assistir à aula 1", { strike: true })}${mk.check("Marcar como vista", { checked: true, strike: true })}</div>`],
  ["Progress Ring Check", "progress-ring-check", "Status de aula: pendente, atual, concluída.", () => `<div class="ds-row">${mk.ring("pending")}${mk.ring("current", .4)}${mk.ring("done", 1)}</div>`],
  ["Count Up Number", "count-up-number", "Pontos, progresso, estatísticas.", () => `<b class="ds-big">${mk.count(148, " pts")}</b>`],
  ["Sliding Underline Tabs", "sliding-underline-tabs", "Alternar visões (Temporada/Histórico).", () => `<div class="mk-tabs" data-demo-tabs><button aria-selected="true">Temporada</button><button aria-selected="false">Histórico</button><button aria-selected="false">Amigos</button></div>`],
  ["Spotlight Indicator", "spotlight-indicator", "Item ativo da sidebar (veja o menu à esquerda).", () => `<nav class="mk-spotlight ds-spot"><a href="#" aria-current="page" onclick="return false">Dashboard</a><a href="#" onclick="return false">Curso</a><a href="#" onclick="return false">Comunidade</a></nav>`],
  ["Expanding Icon Tabs", "expanding-icon-tabs", "Barra inferior no celular.", () => `<nav class="mk-icon-tabs ds-icontabs" data-demo-icontabs><a href="#" aria-current="page">${icon("message")}<span>Comunidade</span></a><a href="#">${icon("send")}<span>Novidades</span></a><a href="#">${icon("play-outline")}<span>Curso</span></a></nav>`],
  ["Focus Field", "focus-input", "Todos os campos de texto.", () => `<label class="field" style="width:100%"><span>Nome do projeto</span><input placeholder="Clique para ver o foco"></label>`],
  ["Hover Glide Cards", "hover-glide-cards", "Grades de cards e atalhos.", () => `<div class="ds-glide mk-glide"><div class="card">Curso</div><div class="card">Ranking</div><div class="card">Ajuda</div></div>`],
  ["Staggered Letter Text Swap", "staggered-letter-text-swap", "Links do menu da landing.", () => `<a href="#" onclick="return false" class="ds-link">${mk.swap("Passe o mouse")}</a>`],
  ["Read More Swap", "read-more-swap", "Links \"Ver tudo\".", () => mk.more("Ver tudo", "#")],
];

const RB_COMPONENTS = [
  ["Blur Text", "text-animations/blur-text", "Títulos de página entrando palavra a palavra.", () => `<b class="ds-link" style="font-size:24px">${rb.blur("Sua mente cria.")}</b>`],
  ["Rotating Text", "text-animations/rotating-text", "Uma palavra que alterna (máx. 4 opções).", () => `<span style="font-size:18px;font-weight:600">Use a IA para ${rb.rotate(["começar", "organizar", "entregar"])}</span>`],
  ["Shiny Text", "text-animations/shiny-text", "Selos e destaques curtos.", () => `<span class="pill" style="height:30px;font-size:13px">${rb.shiny("Primeiro curso: IA para TDAH")}</span>`],
  ["Gradient Text", "text-animations/gradient-text", "Palavra de ênfase do hero (uma por página).", () => `<b style="font:700 34px var(--font-display)">${rb.gradient("Floresça")}</b>`],
  ["Spotlight Card", "components/spotlight-card", "Cards de planos, projetos e princípios.", () => `<div class="card rb-spotlight" style="width:100%;padding:22px;text-align:center">Passe o mouse</div>`],
  ["Tilted Card + Glare Hover", "components/tilted-card", "Capa do curso.", () => `<div class="rb-tilt rb-glare" style="width:160px;height:100px;border-radius:14px;background:var(--gc-grad-dream);box-shadow:var(--shadow-md)"></div>`],
  ["Stepper", "components/stepper", "Conteúdo em etapas (Método ÓRBITA).", () => `<span class="muted sm">Veja em /curso/ia-para-tdah</span>`],
  ["Animated List", "components/animated-list", "Listas de aulas entrando em cascata.", () => `<ul class="rb-list" style="display:grid;gap:6px;width:100%">${["Aula 01", "Aula 02", "Aula 03"].map((t) => `<li class="card" style="padding:8px 12px;font-size:13px">${t}</li>`).join("")}</ul>`],
  ["Click Spark", "animations/click-spark", "Faíscas ao clicar em CTAs primários.", () => `<button class="ui-btn primary">Clique aqui</button>`],
  ["Counter", "components/counter", "Pontos na sidebar (dígitos rolando).", () => `<b style="font:700 36px var(--font-display);color:var(--brand)">${rb.counter(148)}</b>`],
  ["Pulse Heart", "micro/pulse-heart", "Curtir posts e novidades.", () => `<button class="act" data-like-demo onclick="this.classList.toggle('on');this.setAttribute('data-like','')" aria-label="Curtir"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg><span>12</span></button>`],
  ["Squish Switch", "micro/squish-switch", "Interruptores em Configurações.", () => `<label class="toggle-row" style="width:100%"><span><b>Avisos</b></span><input type="checkbox" checked><span class="switch" aria-hidden="true"></span></label>`],
  ["Star Border", "animations/star-border", "Plano em destaque (Colheita).", () => `<div class="card rb-star" style="padding:18px 26px;font-weight:600">Colheita</div>`],
];

const swatch = ([token, hex, use]) => `<li class="ds-swatch"><span class="chip-color" style="background:${hex}"></span><div><b>${token.replace("--gc-", "")}</b><code>${hex}</code><small>${use}</small><span class="ds-contrast" data-hex="${hex}"></span></div></li>`;

export function designSystemPage() {
  return {
    title: "Design System",
    html: `
    <div class="ds">
      <header class="ds-hero glass">
        <p class="eyebrow tx-brand">Design System · v2.0</p>
        <h1>graao <em>club</em></h1>
        <p>Clean, criativo e suave. Vidro translúcido sobre uma aurora de verde-água, violeta e azul, com toques de coral e amarelo. Esta página é a referência viva; a fonte dos tokens é <code>css/base.css</code> e as regras completas estão em <code>DESIGN-SYSTEM.md</code>.</p>
        <nav class="ds-toc">${["Princípios", "Cores", "Gradientes", "Tipografia", "Vidro", "Forma", "Componentes", "React Bits", "Regras"].map((t) => `<a href="#ds-${t.toLowerCase().replace(/ /g, "-")}">${t}</a>`).join("")}</nav>
      </header>

      <section id="ds-princípios" class="ds-sec"><h2>Princípios</h2>
        <div class="ds-grid4">${PRINCIPLES.map(([ic, t, d]) => `<div class="card rb-spotlight"><span class="ico-box accent">${icon(ic)}</span><b>${t}</b><p>${d}</p></div>`).join("")}</div></section>

      <section id="ds-cores" class="ds-sec"><h2>Cores</h2><p class="muted">Paleta v2 enviada pelo time (“Moodboard — Design System Palette”). Itens marcados com * foram harmonizados. O contraste é calculado ao vivo contra o fundo #F7F9FB.</p>
        ${COLORS.map(([g, list]) => `<h3>${g}</h3><ul class="ds-swatches">${list.map(swatch).join("")}</ul>`).join("")}
      </section>

      <section id="ds-gradientes" class="ds-sec"><h2>Gradientes</h2>
        <div class="ds-grads">
          <div><span style="background:var(--gc-grad-brand)"></span><b>--gc-grad-brand</b><small>Botões primários, barras de progresso</small></div>
          <div><span style="background:var(--gc-grad-dream)"></span><b>--gc-grad-dream</b><small>Capas, ilustrações, vazios</small></div>
          <div><span style="background:var(--gc-grad-warm)"></span><b>--gc-grad-warm</b><small>Conquistas e celebração (pontual)</small></div>
          <div><span style="background:var(--gc-grad-text)"></span><b>--gc-grad-text</b><small>Palavra de ênfase em títulos</small></div>
        </div></section>

      <section id="ds-tipografia" class="ds-sec"><h2>Tipografia</h2>
        <div class="card ds-type">
          <div><small>Display · Bricolage Grotesque 600</small><p style="font:600 56px/1.05 var(--font-display);letter-spacing:-.05em">Aprenda. <em class="grad">Floresça.</em></p></div>
          <div><small>H2 · 32px</small><p style="font:600 32px/1.15 var(--font-display);letter-spacing:-.03em">IA para TDAH</p></div>
          <div><small>H3 · 20px</small><p style="font:650 20px/1.3 var(--font-display)">Primeiros passos</p></div>
          <div><small>Corpo · Geist 16px / 1,7</small><p style="font:400 16px/1.7 var(--font-ui)">Cursos práticos, ferramentas de IA e pessoas para trocar ideias, num lugar leve.</p></div>
          <div><small>Legenda · Geist 13px</small><p style="font:400 13px/1.5 var(--font-ui);color:var(--muted)">Progresso salvo em cada aula</p></div>
          <div><small>Rótulo · Geist 11.5px caixa-alta</small><p class="eyebrow">Seu próximo passo</p></div>
        </div></section>

      <section id="ds-vidro" class="ds-sec"><h2>Vidro</h2><p class="muted">Três níveis, sempre sobre a aurora (regra G1).</p>
        <div class="ds-glass-stage">
          <div class="ds-blob a"></div><div class="ds-blob b"></div><div class="ds-blob c"></div>
          <div class="ds-glass" style="background:var(--glass-bg)"><b>--glass-bg</b><small>Cards, painéis</small></div>
          <div class="ds-glass" style="background:var(--glass-bg-strong)"><b>--glass-bg-strong</b><small>Modais, popovers, toasts</small></div>
          <div class="ds-glass" style="background:var(--chrome-glass)"><b>--chrome-glass</b><small>Sidebar, topbar</small></div>
        </div>
        <pre class="ds-code">background: var(--glass-bg);
border: 1px solid var(--glass-border);
box-shadow: var(--glass-highlight), var(--shadow-md);
backdrop-filter: blur(var(--glass-blur)) saturate(160%);</pre></section>

      <section id="ds-forma" class="ds-sec"><h2>Forma, espaço e movimento</h2>
        <div class="ds-grid3">
          <div class="card"><b>Raios</b><div class="ds-radii">${[["xs", 8], ["sm", 12], ["md", 16], ["lg", 24], ["pill", 999]].map(([n, r]) => `<span style="border-radius:${r}px"><small>${n}</small></span>`).join("")}</div></div>
          <div class="card"><b>Espaço (base 4)</b><div class="ds-space">${[4, 8, 12, 16, 24, 32, 48, 64].map((n) => `<span><i style="width:${n}px"></i><small>${n}</small></span>`).join("")}</div></div>
          <div class="card"><b>Sombras e movimento</b><div class="ds-shadows"><span style="box-shadow:var(--shadow-sm)">sm</span><span style="box-shadow:var(--shadow-md)">md</span><span style="box-shadow:var(--shadow-lg)">lg</span></div><p class="muted sm">--ease-out · --ease-spring · 180 / 300 / 600ms</p></div>
        </div></section>

      <section id="ds-componentes" class="ds-sec"><h2>Componentes · MicroKit</h2><p class="muted">Microinterações de <a class="link" href="https://microkit.co" target="_blank" rel="noopener">microkit.co</a> (licença MIT), reescritas em HTML/CSS/JS sem dependências e com os tokens do graao club. Arquivos: <code>css/microkit.css</code> e <code>js/microkit.js</code>.</p>
        <div class="ds-comps">${COMPONENTS.map(([name, slug, use, demo]) => `<article class="card ds-comp"><div class="ds-demo">${demo()}</div><div class="ds-meta"><b>${name}</b><small>${use}</small><code>microkit/${slug}</code></div></article>`).join("")}</div></section>

      <section id="ds-react-bits" class="ds-sec" data-ds-rb><h2>Componentes · React Bits</h2><p class="muted">Inspirados em <a class="link" href="https://reactbits.dev" target="_blank" rel="noopener">reactbits.dev</a> (licença MIT + Commons Clause: uso no produto permitido; não redistribuir os componentes isoladamente), reescritos em HTML/CSS/JS. Arquivos: <code>css/reactbits.css</code> e <code>js/reactbits.js</code>. Só entraram componentes que ajudam a leitura e o feedback; cursores, glitch e partículas ficaram de fora.</p>
        <div class="ds-comps">${RB_COMPONENTS.map(([name, slug, use, demo]) => `<article class="card ds-comp"><div class="ds-demo">${demo()}</div><div class="ds-meta"><b>${name}</b><small>${use}</small><code>reactbits/${slug}</code></div></article>`).join("")}</div></section>

      <section id="ds-regras" class="ds-sec"><h2>Regras</h2>
        <div class="ds-rules">${RULES.map(([t, list]) => `<div class="card"><b>${t}</b><ul>${list.map((r) => `<li>${esc(r)}</li>`).join("")}</ul></div>`).join("")}</div></section>
    </div>`,
    mount(root) {
      // contraste ao vivo contra o fundo creme
      const L = (h) => { const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4)); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
      const ratio = (a, b) => { const [x, y] = [L(a), L(b)].sort((m, n) => n - m); return (x + .05) / (y + .05); };
      root.querySelectorAll(".ds-contrast").forEach((el) => {
        const hex = el.dataset.hex, onCream = ratio(hex, "#F7F9FB"), withInk = ratio(hex, "#1F212D");
        const best = onCream >= withInk ? `texto no fundo ${onCream.toFixed(1)}:1` : `com texto tinta ${withInk.toFixed(1)}:1`;
        el.textContent = best; el.classList.add(Math.max(onCream, withInk) >= 4.5 ? "ok" : "warn");
      });
      root.querySelector("[data-demo-hold]")?.addEventListener("mk:hold", (e) => { toast("Excluído (demo).", "trash"); setTimeout(() => { const b = e.target; b.classList.remove("is-done"); b.innerHTML = `${icon("trash")}<span>Segure para excluir</span>`; }, 1500); });
      root.querySelector("[data-demo-fuse]")?.addEventListener("click", function handler(e) {
        const b = e.currentTarget;
        import("../microkit.js").then(({ fuse }) => fuse(b, { seconds: 5, onExpire: () => { toast("Post excluído (demo).", "trash"); reset(); }, onUndo: () => { toast("Desfeito."); reset(); } }));
        function reset() { b.className = "ui-btn outline sm"; b.innerHTML = `${icon("trash")}Excluir post`; b.style.removeProperty("--p"); b.addEventListener("click", handler, { once: true }); }
      }, { once: true });
      root.querySelectorAll("[data-demo-tabs] button").forEach((b, _, all) => b.addEventListener("click", () => { all.forEach((x) => x.setAttribute("aria-selected", String(x === b))); b.parentElement.dispatchEvent(new PointerEvent("pointerleave")); }));
      root.querySelectorAll("[data-demo-icontabs] a").forEach((a, _, all) => a.addEventListener("click", (e) => { e.preventDefault(); all.forEach((x) => (x === a ? x.setAttribute("aria-current", "page") : x.removeAttribute("aria-current"))); }));
      root.querySelectorAll(".ds-spot a").forEach((a, _, all) => a.addEventListener("click", () => { all.forEach((x) => (x === a ? x.setAttribute("aria-current", "page") : x.removeAttribute("aria-current"))); a.parentElement.dispatchEvent(new PointerEvent("pointerleave")); }));
    },
  };
}
