/* =====================================================================
   IA para TDAH — camada de dados (Supabase).
   Ativa quando env.js tem supabaseUrl + supabaseKey e o supabase-js carregou.
   Sem isso, GRAAO_API.enabled = false e o app segue em modo demonstração.
   A sessão real é espelhada em localStorage["graao:user"] para que a interface
   existente (getUser) continue funcionando sem mudanças.
   ===================================================================== */
(function () {
  "use strict";
  const ENV = window.GRAAO_ENV || {};
  const enabled = !!(ENV.supabaseUrl && ENV.supabaseKey && window.supabase?.createClient);
  const USER_KEY = "graao:user";
  const client = enabled ? window.supabase.createClient(ENV.supabaseUrl, ENV.supabaseKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "pkce" },
  }) : null;

  let session = null, profile = null, perms = [], teamRole = null;

  const ERRORS = [
    [/invalid login credentials/i, "E-mail ou senha incorretos."],
    [/email not confirmed/i, "Confirme seu e-mail antes de entrar — enviamos um link para a sua caixa de entrada."],
    [/user already registered|already been registered/i, "Este e-mail já tem conta. Entre com sua senha."],
    [/password should be at least|weak password/i, "A senha precisa ter pelo menos 6 caracteres."],
    [/rate limit|too many requests|security purposes/i, "Muitas tentativas seguidas. Aguarde um minuto e tente de novo."],
    [/not authorized|email address .* (is )?invalid/i, "Este e-mail não pode receber mensagens no ambiente de teste. Use um e-mail da equipe."],
    [/profiles_username_key|duplicate key.*username/i, "Esse nome de usuário já está em uso."],
    [/profiles_username_check/i, "Nome de usuário: 3 a 30 caracteres, só letras minúsculas, números, ponto ou _."],
    [/sem permissão/i, "Você não tem permissão para essa alteração."],
    [/row-level security|permission denied/i, "Você não tem permissão para essa ação."],
    [/violates check constraint/i, "Algum campo está vazio ou passou do limite de caracteres."],
    [/JWT expired|invalid jwt/i, "Sua sessão expirou. Entre de novo."],
    [/failed to fetch|network/i, "Sem conexão com o servidor. Verifique sua internet."],
  ];
  const friendly = (err) => {
    const msg = String(err?.message || err || "");
    const hit = ERRORS.find(([re]) => re.test(msg));
    return hit ? hit[1] : "Algo deu errado. Tente de novo em instantes.";
  };

  const toLocal = (p, email) => ({
    id: p.id, name: p.name || p.username, email, username: p.username, plan: p.plan,
    role: p.headline, bio: p.bio, city: p.city, company: p.company, skills: p.skills || [], links: p.links || {},
    avatar: p.avatar_path, banned: p.banned, teamRole,
  });
  const writeLocal = () => {
    try {
      if (profile) localStorage.setItem(USER_KEY, JSON.stringify(toLocal(profile, session?.user?.email || "")));
      else localStorage.removeItem(USER_KEY);
    } catch (e) { /* storage indisponível */ }
  };

  async function loadProfile() {
    if (!session) { profile = null; perms = []; teamRole = null; writeLocal(); return null; }
    const uid = session.user.id;
    const [p, pm, tm] = await Promise.all([
      client.from("profiles").select("*").eq("id", uid).single(),
      client.rpc("my_permissions"),
      client.from("team_members").select("role").eq("user_id", uid).maybeSingle(),
    ]);
    if (p.error) throw p.error;
    profile = p.data;
    perms = (pm.data || []).map((x) => (typeof x === "string" ? x : x.my_permissions)).filter(Boolean);
    teamRole = tm.data?.role || null;
    writeLocal();
    return profile;
  }

  const origin = () => location.origin + location.pathname.replace(/[^/]*$/, "");

  const API = {
    enabled,
    client,
    friendly,
    get session() { return session; },
    get profile() { return profile; },
    get perms() { return perms; },
    get teamRole() { return teamRole; },
    can: (perm) => perms.includes(perm),

    /* Catálogo real: nunca usa data.js ou localStorage como alternativa. */
    async academyCatalog() {
      if (!enabled) throw new Error("A Academia precisa de conexão com o servidor.");
      const { data, error } = await client.rpc("academy_catalog");
      if (error) throw new Error(friendly(error));
      if (!Array.isArray(data)) throw new Error("Não foi possível carregar o catálogo.");
      return data;
    },

    /* Resolve a sessão atual (e o perfil). Retorna null se não houver login. */
    async ready() {
      if (!enabled) return null;
      const { data } = await client.auth.getSession();
      session = data.session;
      if (session) await loadProfile();
      else writeLocal();
      return session;
    },

    async signUp({ name, email, password }) {
      const { data, error } = await client.auth.signUp({
        email, password, options: { data: { name }, emailRedirectTo: origin() + "inicio.html" },
      });
      if (error) return { error: friendly(error) };
      session = data.session;
      if (session) await loadProfile();
      return { session, needsConfirmation: !session };
    },

    async signIn({ email, password }) {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) return { error: friendly(error) };
      session = data.session;
      await loadProfile();
      if (profile?.banned) { await API.signOut(); return { error: "Seu acesso está bloqueado. Fale com o suporte." }; }
      return { session };
    },

    async signInWithGoogle(next = "inicio.html") {
      const { error } = await client.auth.signInWithOAuth({ provider: "google", options: { redirectTo: origin() + next } });
      return error ? { error: friendly(error) } : {};
    },

    async resetPassword(email) {
      const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: origin() + "entrar.html?modo=nova-senha" });
      return error ? { error: friendly(error) } : {};
    },

    async updatePassword(password) {
      const { error } = await client.auth.updateUser({ password });
      return error ? { error: friendly(error) } : {};
    },

    async signOut() {
      await client.auth.signOut().catch(() => {});
      session = null; profile = null; perms = []; teamRole = null;
      writeLocal();
    },

    /* Recebe campos no formato da interface (getUser) e grava em public.profiles */
    async updateProfile(patch) {
      if (!session) return { error: "Sua sessão expirou. Entre de novo." };
      const map = { name: "name", username: "username", role: "headline", company: "company", bio: "bio", city: "city", skills: "skills", links: "links" };
      const row = {};
      Object.entries(patch).forEach(([k, v]) => { if (map[k]) row[map[k]] = v; });
      if ("username" in row) row.username = String(row.username || "").toLowerCase();
      const { data, error } = await client.from("profiles").update(row).eq("id", session.user.id).select().single();
      if (error) return { error: friendly(error) };
      profile = data; writeLocal();
      return { profile };
    },
  };

  if (enabled) {
    client.auth.onAuthStateChange((event, s) => {
      session = s;
      if (event === "SIGNED_OUT") { profile = null; perms = []; teamRole = null; writeLocal(); }
      if (event === "PASSWORD_RECOVERY" && !/modo=nova-senha/.test(location.search)) location.href = "entrar.html?modo=nova-senha";
    });
  }

  window.GRAAO_API = API;
})();
