import { icon } from "../icons.js";
import { BRAND } from "../data.js";
import { esc, brandHTML, $, toast } from "../ui.js";
import { store } from "../store.js";

const pwdField = (id, label, autocomplete) => `
  <label class="field"><span>${label}</span>
    <span class="input-wrap"><input id="${id}" name="${id}" type="password" autocomplete="${autocomplete}" required minlength="6">
    <button type="button" class="eye" data-eye="${id}" aria-label="Mostrar senha">${icon("eye")}</button></span>
  </label>`;

export function renderAuth(mode, params) {
  const isLogin = mode === "entrar";
  const cb = params.get("callbackUrl") || "";
  const cbq = cb ? `?callbackUrl=${encodeURIComponent(cb)}` : "";
  return `
  <div class="auth">
    <div class="auth-frame">
      <aside class="auth-art" aria-hidden="true">
        <a href="/" class="auth-brand">${brandHTML("sm")}</a>
        <div class="auth-glow"></div>
        <div class="auth-art-copy">
          <h1>${isLogin ? "Seja bem-vindo de volta." : "Crie a sua conta<br>gratuitamente."}</h1>
          <p>${isLogin ? "Continue aprendendo e compartilhando com a sua comunidade." : "Seu próximo passo começa aqui."}</p>
        </div>
      </aside>
      <main class="auth-main">
        <form class="auth-form" data-auth="${mode}" novalidate>
          <a href="/" class="auth-mobile-brand">${brandHTML("sm")}</a>
          <h1 class="sr-only">${isLogin ? "Entrar" : "Criar conta"}</h1>
          <button type="button" class="ui-btn outline lg block" data-provider="Google">${icon("google")}Entrar com Google</button>
          <button type="button" class="ui-btn outline lg block" data-provider="Apple">${icon("apple")}Entrar com Apple</button>
          <div class="divider"><span>ou com e-mail</span></div>
          ${isLogin ? "" : `<label class="field"><span>Nome completo</span><input id="name" name="name" autocomplete="name" required minlength="3"></label>`}
          <label class="field"><span>E-mail</span><input id="email" name="email" type="email" autocomplete="email" required></label>
          ${pwdField("password", "Senha", isLogin ? "current-password" : "new-password")}
          ${isLogin ? `<a class="forgot" href="#" data-action="forgot">Esqueci minha senha</a>` : pwdField("confirm", "Confirmar senha", "new-password")}
          <p class="form-error" role="alert" hidden></p>
          <button class="ui-btn primary lg block" type="submit">${isLogin ? "Entrar" : "Criar conta grátis"}</button>
          ${isLogin ? "" : `<p class="legal">Ao criar sua conta, você concorda com os <a href="/termos">Termos de Uso</a> e com a <a href="/privacidade">Política de Privacidade</a>.</p>`}
          <p class="switch">${isLogin ? `Ainda não tem conta? <a href="/cadastro${cbq}">Crie a sua grátis</a>` : `Já tem conta? <a href="/entrar${cbq}">Entrar</a>`}</p>
          <p class="demo-note">${icon("lock")}<span>Demonstração: nenhum dado sai deste navegador. Qualquer e-mail e senha (6+ caracteres) funcionam.</span></p>
        </form>
      </main>
    </div>
  </div>`;
}

export function mountAuth(root, { params, navigate }) {
  const form = $("form[data-auth]", root);
  const mode = form.dataset.auth;
  const err = $(".form-error", form);
  const done = (user) => {
    toast(`Bem-vindo${mode === "cadastro" ? "" : " de volta"}, ${user.name.split(" ")[0]}!`);
    const cb = params.get("callbackUrl");
    let dest = "/inicio";
    try { if (cb) { const u = new URL(cb, location.origin); if (u.origin === location.origin) dest = u.pathname + u.search; } } catch {}
    navigate(dest, true);
  };
  const fail = (msg, field) => { err.textContent = msg; err.hidden = false; field?.focus(); field?.setAttribute("aria-invalid", "true"); };

  root.addEventListener("click", (e) => {
    const eye = e.target.closest("[data-eye]");
    if (eye) {
      const input = $("#" + eye.dataset.eye, form);
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      eye.innerHTML = icon(show ? "eye-off" : "eye");
      eye.setAttribute("aria-label", show ? "Ocultar senha" : "Mostrar senha");
    }
    const prov = e.target.closest("[data-provider]");
    if (prov) done(store.login({ name: "Visitante", email: `visitante@${prov.dataset.provider.toLowerCase()}.demo`, provider: prov.dataset.provider }));
    if (e.target.closest('[data-action="forgot"]')) { e.preventDefault(); toast("Na versão real, enviaríamos um link de redefinição.", "send"); }
  });

  form.addEventListener("input", (e) => { e.target.removeAttribute("aria-invalid"); err.hidden = true; });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(form));
    if (mode === "cadastro" && (!f.name || f.name.trim().length < 3)) return fail("Informe seu nome completo.", form.name);
    if (!/^\S+@\S+\.\S+$/.test(f.email || "")) return fail("Digite um e-mail válido.", form.email);
    if ((f.password || "").length < 6) return fail("A senha precisa ter pelo menos 6 caracteres.", form.password);
    if (mode === "cadastro" && f.password !== f.confirm) return fail("As senhas não conferem.", form.confirm);
    done(store.login({ name: f.name?.trim(), email: f.email.trim() }));
  });
}

// Modal que bloqueia páginas internas para visitantes (comportamento observado)
export function gateHTML(path) {
  const cb = encodeURIComponent(path);
  return `
    ${brandHTML("sm")}
    <h2 class="gate-title">Entre no ${esc(BRAND.full)}</h2>
    <p class="gate-sub">Aprenda, compartilhe e evolua com pessoas que vivem tecnologia e criatividade</p>
    <ul class="gate-list">
      ${["Notícias e novidades da área", "Comunidade ativa pra tirar dúvidas e trocar ideias", "Conteúdos e trilhas pra se profissionalizar", "Ranking, recompensas e muito mais"].map((t) => `<li>${icon("check")}${t}</li>`).join("")}
    </ul>
    <div class="gate-actions">
      <button class="ui-btn outline lg block" data-gate-provider="Google">${icon("google")}Entrar com Google</button>
      <button class="ui-btn outline lg block" data-gate-provider="Apple">${icon("apple")}Entrar com Apple</button>
      <a class="ui-btn primary block" href="/entrar?callbackUrl=${cb}">Entrar</a>
    </div>
    <p class="gate-foot">Ainda não tem uma conta? <a href="/cadastro?callbackUrl=${cb}">Crie gratuitamente</a></p>`;
}
