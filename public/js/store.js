// Estado persistido no navegador (localStorage). Não há backend:
// login, posts, curtidas e progresso são DEMO e ficam só neste navegador.
import { SEED_POSTS } from "./data.js";

const K = "rc:";
const read = (k, d) => { try { const v = localStorage.getItem(K + k); return v == null ? d : JSON.parse(v); } catch { return d; } };
const write = (k, v) => { try { localStorage.setItem(K + k, JSON.stringify(v)); } catch {} };

const listeners = new Set();
export const onChange = (fn) => (listeners.add(fn), () => listeners.delete(fn));
const emit = () => listeners.forEach((fn) => fn());

export const store = {
  // Sessão ------------------------------------------------------------
  get user() { return read("user", null); },
  login({ name, email, provider = "email" }) {
    const handle = (email || name || "voce").split("@")[0].toLowerCase().replace(/[^a-z0-9_.]/g, "").slice(0, 18) || "voce";
    const user = { name: name || handle.replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), email, handle, provider, plan: read("plan", "free"), since: Date.now(), hue: Math.floor(Math.random() * 360) };
    write("user", user); emit(); return user;
  },
  logout() { try { localStorage.removeItem(K + "user"); } catch {} emit(); },
  setPlan(plan) { write("plan", plan); const u = this.user; if (u) { u.plan = plan; write("user", u); } emit(); },

  // Tema / consentimento ---------------------------------------------
  get theme() { return document.documentElement.dataset.theme; },
  setTheme(t) { document.documentElement.dataset.theme = t; try { localStorage.setItem(K + "theme", t); } catch {} },
  get consent() { return read("consent", null); },
  setConsent(v) { write("consent", v); },

  // Comunidade --------------------------------------------------------
  get posts() {
    const mine = read("posts", []);
    const extraComments = read("comments", {});
    return [...mine, ...SEED_POSTS].map((p) => ({ ...p, comments: [...(p.comments || []), ...(extraComments[p.id] || [])] })).sort((a, b) => b.date - a.date);
  },
  addPost(text, tags) {
    const u = this.user; if (!u) return;
    const mine = read("posts", []);
    mine.unshift({ id: "u" + Date.now(), user: "me", me: { name: u.name, handle: u.handle, hue: u.hue }, date: Date.now(), text, tags, likes: 0, comments: [] });
    write("posts", mine); emit();
  },
  deletePost(id) { write("posts", read("posts", []).filter((p) => p.id !== id)); emit(); },
  addComment(postId, text) {
    const u = this.user; if (!u) return;
    const all = read("comments", {});
    (all[postId] ||= []).push({ user: "me", me: { name: u.name, handle: u.handle, hue: u.hue }, text });
    write("comments", all); emit();
  },
  commentsFor: (id) => read("comments", {})[id] || [],
  isLiked: (id) => read("likes", {})[id] === true,
  toggleLike(id) { const l = read("likes", {}); l[id] = !l[id]; write("likes", l); emit(); return l[id]; },
  isSaved: (slug) => read("saved", {})[slug] === true,
  toggleSaved(slug) { const s = read("saved", {}); s[slug] = !s[slug]; write("saved", s); emit(); return s[slug]; },

  // Progresso nos conteúdos ------------------------------------------
  progress: (moduleId) => read("progress", {})[moduleId] || [],
  toggleLesson(moduleId, lessonId) {
    const p = read("progress", {});
    const set = new Set(p[moduleId] || []);
    set.has(lessonId) ? set.delete(lessonId) : set.add(lessonId);
    p[moduleId] = [...set]; write("progress", p); emit();
  },
  lessonsDone() { return Object.values(read("progress", {})).reduce((s, a) => s + a.length, 0); },
  points() { return this.lessonsDone() * 2 + read("posts", []).length * 3 + (read("visited", null) ? 2 : 0); },
  markVisit() { const d = new Date().toDateString(); if (read("visited", null) !== d) write("visited", d); },

  // Perfil / social ---------------------------------------------------
  updateProfile(patch) { const u = this.user; if (!u) return; Object.assign(u, patch); write("user", u); emit(); },
  isFollowing: (k) => read("follows", []).includes(k),
  toggleFollow(k) { const f = new Set(read("follows", [])); f.has(k) ? f.delete(k) : f.add(k); write("follows", [...f]); emit(); return f.has(k); },
  get follows() { return read("follows", []); },
  get prefs() { return read("prefs", { replies: true, follows: true, news: false, email: true }); },
  setPref(k, v) { const p = this.prefs; p[k] = v; write("prefs", p); },
  get notifRead() { return read("notifRead", false); },
  readNotifs() { write("notifRead", true); },
  get sidebarCollapsed() { return read("collapsed", false); },
  setSidebarCollapsed(v) { write("collapsed", v); },
  externalCerts: () => read("extcerts", []),
  addExternalCert(c) { const all = read("extcerts", []); all.push(c); write("extcerts", all); emit(); },
  tickets: () => read("tickets", []),
  addTicket(t) { const all = read("tickets", []); all.unshift({ ...t, id: Date.now(), status: "Aberto" }); write("tickets", all); emit(); },

  onboarding() {
    const u = this.user || {};
    const likes = read("likes", {}), comments = read("comments", {}), saved = read("saved", {});
    const newsTouched = Object.values(saved).some(Boolean) || Object.keys(comments).some((k) => k.startsWith("news:") && comments[k].length);
    const postTouched = Object.entries(likes).some(([k, v]) => v && !k.startsWith("u")) || Object.keys(comments).some((k) => k.startsWith("p") && comments[k].length);
    return {
      perfil: !!(u.role && u.bio), seguir: read("follows", []).length >= 3, noticia: newsTouched,
      post: postTouched, publicar: read("posts", []).length > 0,
    };
  },
  exportData() { const out = {}; try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith(K)) out[k] = localStorage.getItem(k); } } catch {} return out; },
  wipe() { try { Object.keys(this.exportData()).forEach((k) => localStorage.removeItem(k)); } catch {} emit(); },
};
