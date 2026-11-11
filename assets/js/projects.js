/* =====================================================================
   IA para TDAH — camada de dados dos Projetos (window.GRAAO_PROJECTS).
   - Com Supabase (GRAAO_API.enabled): tabelas creative_projects, project_steps,
     project_activity, protegidas por RLS (cada pessoa só vê o que é seu).
   - Sem backend (modo demonstração): localStorage "graao:projects", SÓ neste
     navegador. A interface avisa quando está nesse modo (live === false).
   Todas as funções devolvem Promise e lançam Error com mensagem amigável.
   ===================================================================== */
(function () {
  "use strict";
  const API = window.GRAAO_API?.enabled ? window.GRAAO_API : null;
  const db = API?.client || null;
  const KEY = "graao:projects";
  const PFIELDS = ["title", "description", "briefing", "objective", "deliverables", "resume_note", "orbita", "status", "is_main", "due_on"];
  const SFIELDS = ["title", "orbita", "is_next", "done", "position"];
  const pick = (o, keys) => Object.fromEntries(Object.entries(o || {}).filter(([k]) => keys.includes(k)));
  const fail = (e) => { throw new Error(API ? API.friendly(e) : String(e?.message || e)); };
  const now = () => new Date().toISOString();
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : "x" + Date.now().toString(36) + Math.random().toString(36).slice(2));

  /* ---------- modo demonstração (replica as regras dos gatilhos do banco) ---------- */
  const load = () => { try { return { projects: [], steps: [], activity: [], ...(JSON.parse(localStorage.getItem(KEY)) || {}) }; } catch (e) { return { projects: [], steps: [], activity: [] }; } };
  const persist = (s) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { throw new Error("Não foi possível salvar neste navegador (armazenamento indisponível)."); } };
  const log = (s, project_id, kind, text) => s.activity.unshift({ id: uid(), project_id, kind, text: String(text).slice(0, 1000), created_at: now() });
  const applyProject = (s, p, prev) => {
    if (p.status === "entregue") { if (!prev || prev.status !== "entregue") p.delivered_at = now(); } else p.delivered_at = null;
    if (p.is_main && (!prev || !prev.is_main)) s.projects.forEach((o) => { if (o.id !== p.id) o.is_main = false; });
    if (prev && prev.status !== p.status) log(s, p.id, "status", { entregue: "Entrega concluída", pausado: "Projeto pausado", arquivado: "Projeto arquivado" }[p.status] || "Projeto retomado");
  };
  const applyStep = (s, st, prev) => {
    if (st.done) { if (!prev || !prev.done) st.done_at = now(); st.is_next = false; } else st.done_at = null;
    if (st.is_next && (!prev || !prev.is_next)) s.steps.forEach((o) => { if (o.project_id === st.project_id && o.id !== st.id) o.is_next = false; });
    if (prev && st.done && !prev.done) log(s, st.project_id, "passo", st.title);
    const p = s.projects.find((x) => x.id === st.project_id); if (p) p.updated_at = now();
  };
  const len = (v, max, label) => { if (v != null && String(v).length > max) throw new Error(`${label}: no máximo ${max} caracteres.`); };
  const validateProject = (p) => {
    if (!String(p.title || "").trim()) throw new Error("Dê um título ao projeto.");
    len(p.title, 120, "Título"); len(p.description, 1000, "Descrição"); len(p.briefing, 8000, "Briefing");
    len(p.objective, 600, "Objetivo"); len(p.deliverables, 2000, "Entregáveis"); len(p.resume_note, 600, "Onde parei");
  };

  const local = {
    async list() { return load().projects.slice().sort((a, b) => b.updated_at.localeCompare(a.updated_at)); },
    async get(id) { return load().projects.find((p) => p.id === id) || null; },
    async create(fields) {
      const s = load(); const p = { id: uid(), title: "", description: "", briefing: "", objective: "", deliverables: "", resume_note: "", orbita: null, status: "ativo", is_main: false, due_on: null, delivered_at: null, created_at: now(), updated_at: now(), ...pick(fields, PFIELDS) };
      validateProject(p); applyProject(s, p, null); s.projects.push(p); persist(s); return p;
    },
    async update(id, patch) {
      const s = load(); const p = s.projects.find((x) => x.id === id); if (!p) throw new Error("Projeto não encontrado.");
      const prev = { ...p }; Object.assign(p, pick(patch, PFIELDS), { updated_at: now() });
      validateProject(p); applyProject(s, p, prev); persist(s); return p;
    },
    async remove(id) { const s = load(); s.projects = s.projects.filter((p) => p.id !== id); s.steps = s.steps.filter((x) => x.project_id !== id); s.activity = s.activity.filter((x) => x.project_id !== id); persist(s); },
    async steps(pid) { return load().steps.filter((x) => x.project_id === pid).sort((a, b) => a.position - b.position || a.created_at.localeCompare(b.created_at)); },
    async addStep(pid, f) {
      const s = load(); if (!String(f.title || "").trim()) throw new Error("Escreva a microtarefa."); len(f.title, 240, "Microtarefa");
      const st = { id: uid(), project_id: pid, title: "", orbita: null, is_next: false, done: false, done_at: null, position: s.steps.filter((x) => x.project_id === pid).length, created_at: now(), ...pick(f, SFIELDS) };
      applyStep(s, st, null); s.steps.push(st); persist(s); return st;
    },
    async updateStep(id, patch) {
      const s = load(); const st = s.steps.find((x) => x.id === id); if (!st) throw new Error("Microtarefa não encontrada.");
      const prev = { ...st }; Object.assign(st, pick(patch, SFIELDS)); len(st.title, 240, "Microtarefa"); applyStep(s, st, prev); persist(s); return st;
    },
    async removeStep(id) { const s = load(); s.steps = s.steps.filter((x) => x.id !== id); persist(s); },
    async activity(pid, limit = 20) { return load().activity.filter((x) => x.project_id === pid).slice(0, limit); },
    async addNote(pid, text) { const s = load(); if (!String(text || "").trim()) throw new Error("Escreva o registro."); len(text, 1000, "Registro"); log(s, pid, "nota", text.trim()); const p = s.projects.find((x) => x.id === pid); if (p) p.updated_at = now(); persist(s); },
    async stats() { const s = load(); return { projects: s.projects.length, delivered: s.projects.filter((p) => p.status === "entregue").length, stepsDone: s.steps.filter((x) => x.done).length }; },
    exportAll() { return load(); },
  };

  /* ---------- Supabase ---------- */
  const remote = {
    async list() { const { data, error } = await db.from("creative_projects").select("*").order("updated_at", { ascending: false }); if (error) fail(error); return data; },
    async get(id) { const { data, error } = await db.from("creative_projects").select("*").eq("id", id).maybeSingle(); if (error) fail(error); return data; },
    async create(fields) { validateProject(fields); const { data, error } = await db.from("creative_projects").insert(pick(fields, PFIELDS)).select().single(); if (error) fail(error); return data; },
    async update(id, patch) {
      const row = pick(patch, PFIELDS); if ("title" in row) validateProject(row);
      const { data, error } = await db.from("creative_projects").update(row).eq("id", id).select().single(); if (error) fail(error); return data;
    },
    async remove(id) { const { error } = await db.from("creative_projects").delete().eq("id", id); if (error) fail(error); },
    async steps(pid) { const { data, error } = await db.from("project_steps").select("*").eq("project_id", pid).order("position").order("created_at"); if (error) fail(error); return data; },
    async addStep(pid, f) {
      if (!String(f.title || "").trim()) throw new Error("Escreva a microtarefa."); len(f.title, 240, "Microtarefa");
      const { count } = await db.from("project_steps").select("id", { count: "exact", head: true }).eq("project_id", pid);
      const { data, error } = await db.from("project_steps").insert({ project_id: pid, position: count || 0, ...pick(f, SFIELDS) }).select().single(); if (error) fail(error); return data;
    },
    async updateStep(id, patch) { const { data, error } = await db.from("project_steps").update(pick(patch, SFIELDS)).eq("id", id).select().single(); if (error) fail(error); return data; },
    async removeStep(id) { const { error } = await db.from("project_steps").delete().eq("id", id); if (error) fail(error); },
    async activity(pid, limit = 20) { const { data, error } = await db.from("project_activity").select("*").eq("project_id", pid).order("created_at", { ascending: false }).limit(limit); if (error) fail(error); return data; },
    async addNote(pid, text) {
      if (!String(text || "").trim()) throw new Error("Escreva o registro."); len(text, 1000, "Registro");
      const { error } = await db.from("project_activity").insert({ project_id: pid, kind: "nota", text: text.trim() }); if (error) fail(error);
    },
    async stats() {
      const [p, d, s] = await Promise.all([
        db.from("creative_projects").select("id", { count: "exact", head: true }),
        db.from("creative_projects").select("id", { count: "exact", head: true }).eq("status", "entregue"),
        db.from("project_steps").select("id", { count: "exact", head: true }).eq("done", true),
      ]);
      const err = p.error || d.error || s.error; if (err) fail(err);
      return { projects: p.count || 0, delivered: d.count || 0, stepsDone: s.count || 0 };
    },
    async exportAll() {
      const [p, s, a] = await Promise.all([db.from("creative_projects").select("*"), db.from("project_steps").select("*"), db.from("project_activity").select("*")]);
      const err = p.error || s.error || a.error; if (err) fail(err);
      return { projects: p.data, steps: s.data, activity: a.data };
    },
  };

  window.GRAAO_PROJECTS = { live: !!db, ...(db ? remote : local) };
})();
