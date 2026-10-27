// الجلسات: القائمة، البدء، مساحة العمل (البريك، المعززات واختبار التفضيل، الأهداف وأوراق DTT، التعميم)، الإنهاء؛ وطلبات التعميم.
import { HttpError, route } from "../backend";
import type { DB } from "../db";
import { goalData as planGoalData, lockedGoalIds } from "./reports";
import { generalizationRow } from "./parent";

const blankRows = (cols: number) => Array.from({ length: 9 }, () => ({ date: "", session: "", place: "", marks: Array(cols).fill(false), breaks: 0 }));
export const blankSchedule = () => ({ trials: blankRows(14), minutes: blankRows(10) });

export function sessionRow(db: DB, s: any) {
  const child = db.child(s.child_id)!;
  const therapist = db.staffById(s.therapist_id);
  const program = db.programs.find((p) => p.id === s.student_program_id);
  return { ...s, child: { id: child.id, name: child.name, birth_date: child.birth_date }, therapist: { id: therapist.id, name: therapist.name }, room: { id: s.room_id, name: s.room },
    treatment: s.treatment_id ? { id: s.treatment_id, name: s.treatment } : null, program: program ? { id: program.id, kind: program.kind, sessions_suspended_at: null } : null,
    break_schedule: s.break_schedule ? { ready_at: s.break_schedule.ready_at ?? null } : null, makeup: null, makeup_of: null, holiday: null, resolution: null, original_starts_at: null,
    room_age_warning: false, therapist_age_warning: false };
}

/** حالة الجلسة بالساعة (ProgramSession::statusAt) — في الديمو تُفتح الجلسة في أي وقت (TEST_OPEN_ANYTIME كما في الخادم الآن). */
export function statusOf(db: DB, s: any) {
  if (s.ended_at) return "finished";
  if (s.started_at) return "ongoing";
  return "waiting";
}

const mt = (goal: any) => {
  const sheets: Record<number, any> = goal.dtt ?? {};
  const steps = [1, 2, 3].map((step) => ({ step, done: !!sheets[step], date: sheets[step]?.date ?? null }));
  return { steps, start: sheets[1]?.date ?? null, end: steps.every((x) => x.done) ? sheets[3].date : null };
};

/** هدف كما تعرضه الجلسة (SessionGoals::goalData). */
export function sessionGoal(db: DB, goal: any, childId: number) {
  const base = planGoalData(db, goal, childId);
  return { id: goal.id, goal: goal.goal || goal.weakness, achieved_at: goal.achieved_at ?? null, prop_start: goal.prop_start ?? null, cells: base.cells, mt: mt(goal), gen: base.gen };
}

export function goalsFor(db: DB, s: any) {
  const t = [...db.trackings].reverse().find((x) => x.child_id === s.child_id && x.status === "approved");
  if (!t) return { tracking: null, tables: [] };
  // prop يبدأ بأول جلسة بعد الاعتماد.
  const first = db.sessions.filter((x) => x.child_id === s.child_id && x.started_at).map((x) => x.started_at).sort()[0];
  const tables: Record<string, any> = {};
  for (const p of db.reportPlans.filter((x) => x.child_id === s.child_id && t.evaluation_ids.includes(x.evaluation_id))) {
    const counts: Record<string, number> = {};
    for (const g of p.goals) {
      const k = String(g.general_goal_id ?? g.symbol ?? ""); counts[k] = (counts[k] ?? 0) + 1;
      if (!t.goal_ids.includes(g.id)) continue;
      if (first && !g.prop_start) g.prop_start = first.slice(0, 10);
      const key = `${p.id}-${k}`;
      tables[key] ??= { key, domain: g.domain, domain_symbol: g.domain_symbol, general_goal: g.general_goal, symbol: g.symbol, goals: [] };
      tables[key].goals.push({ ...sessionGoal(db, g, s.child_id), code: `${g.symbol}-${counts[k]}`, milestone: true });
    }
  }
  return { tracking: { id: t.id, approved_at: t.decided_at ?? t.requested_at }, tables: Object.values(tables), kind: db.programs.find((p) => p.id === s.student_program_id)?.kind };
}

const findSession = (db: DB, id: string) => { const s = db.sessions.find((x) => x.id === Number(id)); if (!s) throw new HttpError(404, { message: "not found" }); return s; };
const findGoal = (db: DB, s: any, goalId: string) => { const g = db.reportPlans.filter((p) => p.child_id === s.child_id).flatMap((p) => p.goals).find((x: any) => x.id === Number(goalId)); if (!g) throw new HttpError(404, { message: "goal not found" }); return g; };

function scorePreference(type: string, items: string[], answers: number[]) {
  const n = items.length; const picks = Array(n).fill(0); const chances = Array(n).fill(0);
  if (type === "paired") { let k = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const a = answers[k++]; if (a === undefined) continue; chances[i]++; chances[j]++; picks[a]++; } }
  else if (type === "with_replacement") { for (const a of answers) { for (let i = 0; i < n; i++) chances[i]++; picks[a]++; } }
  else { const left = new Set(items.map((_, i) => i)); for (const a of answers) { for (const i of left) chances[i]++; picks[a]++; left.delete(a); } }
  const rows = items.map((name, i) => ({ index: i, letter: String.fromCharCode(65 + i), name, picks: picks[i], chances: chances[i], percent: chances[i] ? Math.round(picks[i] / chances[i] * 1000) / 10 : 0 }));
  rows.sort((a, b) => b.percent - a.percent || a.index - b.index);
  const third = Math.max(1, Math.round(n / 3));
  return { type, ranking: rows.map((r, rank) => ({ ...r, rank: rank + 1, tier: rank < third ? "highest" : rank >= n - third ? "lowest" : "moderate" })) };
}

export const sessionRoutes = [
  route("GET", "api/program-sessions", ({ db, query }) => {
    const me = db.currentStaff(); const perms = db.permissionsOf(me);
    const canManage = perms.includes("session break schedule edit"), canReschedule = perms.includes("session reschedule edit");
    const from = `${query.from ?? db.now().slice(0, 10)} 00:00`, to = `${query.to ?? query.from ?? db.now().slice(0, 10)} 23:59`;
    const rows = db.sessions.filter((s) => s.starts_at >= from && s.starts_at <= to && (canManage || canReschedule || s.therapist_id === me.id)).sort((a, b) => a.starts_at.localeCompare(b.starts_at));
    return { data: rows.map((s) => ({ ...sessionRow(db, s), status: statusOf(db, s) })), now: db.now(), can_manage: canManage, can_reschedule: canReschedule };
  }),
  route("GET", "api/program-sessions/:id/start-options", ({ db, params }) => { const s = findSession(db, params.id); const prev = db.sessions.filter((x) => x.child_id === s.child_id && x.started_at && x.id !== s.id).sort((a, b) => b.started_at.localeCompare(a.started_at))[0]; return { previous: prev ? { id: prev.id, starts_at: prev.starts_at.slice(0, 16) } : null }; }),
  route("POST", "api/program-sessions/:id/start", ({ db, params }) => {
    const s = findSession(db, params.id);
    // TEST_OPEN_ANYTIME: تُفتح الآن بطولها نفسه.
    const len = (new Date(s.ends_at.replace(" ", "T")).getTime() - new Date(s.starts_at.replace(" ", "T")).getTime()) / 1000;
    const now = new Date(); const end = new Date(now.getTime() + Math.max(60, len) * 1000);
    const f = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
    s.starts_at = f(now); s.ends_at = f(end); s.started_at = f(now); s.started_by = db.currentStaffId; s.status = "ongoing";
    return { data: sessionRow(db, s) };
  }),
  route("POST", "api/program-sessions/:id/end", ({ db, params }) => { const s = findSession(db, params.id); s.ended_at = db.now(); s.status = "finished"; return { data: sessionRow(db, s) }; }),
  route("GET", "api/program-sessions/:id/workspace", ({ db, params }) => {
    const s = findSession(db, params.id);
    const left = Math.max(0, Math.round((new Date(s.ends_at.replace(" ", "T")).getTime() - Date.now()) / 1000));
    return { data: {
      session: { ...sessionRow(db, s), status: statusOf(db, s) }, now: db.now(), seconds_left: left, can_edit: !!s.started_at && !s.ended_at && s.therapist_id === db.currentStaffId,
      break_schedule: s.break_schedule ? { ...s.break_schedule, saved: true } : { ...blankSchedule(), ready_at: null, updated_at: null, saved: false },
      reinforcers: (db as any).reinforcers?.filter((r: any) => r.child_id === s.child_id) ?? [], preference_tests: s.preference_tests ?? [], goals: goalsFor(db, s), activities: [],
    } };
  }),
  route("PUT", "api/program-sessions/:id/workspace", ({ db, params, body }) => { const s = findSession(db, params.id); s.workspace = { ...(s.workspace ?? {}), ...body }; return { data: s.workspace }; }),
  route("PUT", "api/program-sessions/:id/break-schedule", ({ db, params, body }) => { const s = findSession(db, params.id); s.break_schedule = { trials: body.trials, minutes: body.minutes, ready_at: body.ready ? db.now() : s.break_schedule?.ready_at ?? null, updated_at: db.now() }; return { data: { ...s.break_schedule, saved: true } }; }),
  route("GET", "api/program-sessions/:id/reinforcers/suggestions", () => ({ data: ["فقاعات الصابون", "المكعبات الملوّنة", "الأرجوحة", "الكرة", "التصفيق والتشجيع", "الرسم بالألوان", "لعبة السيارات"] })),
  route("POST", "api/program-sessions/:id/reinforcers", ({ db, params, body }) => { const s = findSession(db, params.id); ((db as any).reinforcers ??= []).push({ id: db.id(), child_id: s.child_id, name: String(body.name).trim() }); return { data: (db as any).reinforcers.filter((r: any) => r.child_id === s.child_id) }; }),
  route("PUT", "api/program-sessions/:id/reinforcers/:rid", ({ db, params, body }) => { const s = findSession(db, params.id); const r = (db as any).reinforcers.find((x: any) => x.id === Number(params.rid)); if (r) r.name = body.name; return { data: (db as any).reinforcers.filter((x: any) => x.child_id === s.child_id) }; }),
  route("DELETE", "api/program-sessions/:id/reinforcers/:rid", ({ db, params }) => { const s = findSession(db, params.id); (db as any).reinforcers = (db as any).reinforcers.filter((x: any) => x.id !== Number(params.rid)); return { data: (db as any).reinforcers.filter((x: any) => x.child_id === s.child_id) }; }),
  route("POST", "api/program-sessions/:id/preference-tests", ({ db, params, body }) => {
    const s = findSession(db, params.id);
    const test = { id: db.id(), program_session_id: s.id, child_id: s.child_id, type: body.type, items: body.items, answers: body.answers.map(Number), result: scorePreference(body.type, body.items, body.answers.map(Number)), created_by: db.currentStaffId, created_at: db.now() };
    (s.preference_tests ??= []).push(test);
    return { data: test };
  }),
  route("GET", "api/program-sessions/:id/goals/:goal/dtt/:step", ({ db, params }) => { const s = findSession(db, params.id); const g = findGoal(db, s, params.goal); return { data: g.dtt?.[params.step] ?? null, mt: mt(g), milestone: true }; }),
  route("PUT", "api/program-sessions/:id/goals/:goal/dtt/:step", ({ db, params, body }) => {
    const s = findSession(db, params.id); const g = findGoal(db, s, params.goal);
    (g.dtt ??= {})[params.step] = { ...body, step: Number(params.step), program_session_id: s.id, updated_at: db.now() };
    const m = mt(g); g.cells = { ...(g.cells ?? {}), mt_start: m.start ?? "", mt_end: m.end ?? "" }; g.session_cells = [...new Set([...(g.session_cells ?? []), ...(m.start ? ["mt_start"] : []), ...(m.end ? ["mt_end"] : [])])];
    return { data: g.dtt[params.step], mt: m };
  }),
  route("PUT", "api/program-sessions/:id/goals/:goal/achieved", ({ db, params, body }) => { const s = findSession(db, params.id); const g = findGoal(db, s, params.goal); g.achieved_at = body.achieved ? db.now().slice(0, 10) : null; return { data: sessionGoal(db, g, s.child_id) }; }),
  route("PUT", "api/program-sessions/:id/goals/:goal/cells", ({ db, params, body }) => {
    const s = findSession(db, params.id); const g = findGoal(db, s, params.goal);
    if (body.column === "prop") { g.prop_start = body.start ?? null; g.achieved_at = body.end ?? null; }
    else { g.cells = { ...(g.cells ?? {}), [`${body.column}_start`]: body.start ?? "", [`${body.column}_end`]: body.end ?? "" }; }
    return { data: sessionGoal(db, g, s.child_id) };
  }),
  route("POST", "api/program-sessions/:id/goals/:goal/generalizations", ({ db, params, body }) => {
    const s = findSession(db, params.id); const g = findGoal(db, s, params.goal);
    if (body.type !== "people" && db.generalizations.some((x) => x.goal_id === g.id && x.type === body.type && ["pending", "approved"].includes(x.status))) throw new HttpError(422, { message: "This generalization was already sent.", errors: { type: ["sent"] } });
    const child = db.child(s.child_id)!;
    const make = (recipient_id: number | null) => db.generalizations.push({ id: db.id(), goal_id: g.id, child_id: s.child_id, session_id: s.id, type: body.type, status: "pending", note: null, requested_by: db.currentStaffId, therapist_id: db.currentStaffId, recipient_id, created_at: db.now(), decided_at: null });
    if (body.type === "people") { db.staff.filter((x) => x.type === 2 && x.id !== s.therapist_id).forEach((x) => { make(x.id); db.notifyStaff(x.id, { title: "طلب تعميم هدف", message: `${db.staffById(db.currentStaffId).name} تطلب تعميم هدف ${child.name}: ${g.goal}`, url: "/sawa-admin/my-generalizations" }); }); }
    else { make(null); if (body.type === "home") db.notifyParent({ title: "طلب تعميم هدف في البيت", message: `${db.staffById(db.currentStaffId).name} تطلب تدريب ${child.name} في البيت على: ${g.goal}`, type: "goal_generalization" });
      else db.staff.filter((x) => x.perms.includes("goal generalization edit")).forEach((x) => db.notifyStaff(x.id, { title: "طلب تعميم في الصفوف", message: `${child.name}: ${g.goal}`, url: "/sawa-admin/goal-generalizations" })); }
    return { data: sessionGoal(db, g, s.child_id) };
  }),

  // طلبات التعميم (الإدارة: الصفوف؛ الأخصائيون: الأشخاص).
  route("GET", "api/goal-generalizations", ({ db, query }) => ({ data: db.generalizations.filter((g) => g.type === "classes" && (!query.status || g.status === query.status)).map((g) => staffRow(db, g)), can_decide: db.permissionsOf(db.currentStaff()).includes("goal generalization edit") })),
  route("POST", "api/goal-generalizations/:id/decide", ({ db, params, body }) => decide(db, params.id, body)),
  route("GET", "api/my-goal-generalizations", ({ db }) => ({ data: db.generalizations.filter((g) => g.type === "people" && g.recipient_id === db.currentStaffId).map((g) => staffRow(db, g)) })),
  route("POST", "api/my-goal-generalizations/:id/decide", ({ db, params, body }) => decide(db, params.id, body)),
];

function staffRow(db: DB, g: any) {
  const row = generalizationRow(db, g);
  return { ...row, requester: db.staffById(g.requested_by)?.name, decider: g.decided_by ? db.staffById(g.decided_by)?.name : null, goal: row.goal ? { ...row.goal, symbol: (row.goal as any).symbol, milestone: true, dtt: [] } : null };
}
function decide(db: DB, id: string, body: any) {
  const g = db.generalizations.find((x) => x.id === Number(id)); if (!g) throw new HttpError(404, {});
  if (g.status !== "pending") throw new HttpError(422, { message: "This request was already answered." });
  g.status = body.approved ? "approved" : "rejected"; g.note = body.approved ? null : body.note; g.decided_at = db.now(); g.decided_by = db.currentStaffId;
  return { data: staffRow(db, g) };
}

export { lockedGoalIds };
