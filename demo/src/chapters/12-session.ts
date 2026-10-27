// الفصل 12 — الأخصائية (الحاسوب): تبدأ جلسة يوسف: جدول البريك، المعززات واختبار التفضيل، الأهداف وورقة DTT، وطلب تعميم في البيت.
import type { Action, Chapter } from "@demo/engine/actions";
import { desk } from "@demo/engine/actions";
import { scenario, staffByKey, ymd } from "../../scenario";
import { blankSchedule } from "../../mock/handlers/sessions";

/** يمرّ الوقت: أول جلسة في البرنامج تصبح اليوم (الديمو لا ينتظر أياماً). */
export function shiftSessionsToToday(db: any) {
  const first = db.sessions.map((s: any) => s.starts_at.slice(0, 10)).sort()[0];
  if (!first) return;
  const diff = Math.round((new Date(`${first}T00:00:00`).getTime() - new Date(`${ymd(new Date())}T00:00:00`).getTime()) / 86400000);
  if (diff <= 0) return;
  const shift = (v: string) => { const d = new Date(v.replace(" ", "T")); d.setDate(d.getDate() - diff); return `${ymd(d)} ${v.slice(11)}`; };
  for (const s of db.sessions) { s.starts_at = shift(s.starts_at); s.ends_at = shift(s.ends_at); }
  for (const p of db.programs) { const d = new Date(`${p.start_date}T00:00:00`); d.setDate(d.getDate() - diff); p.start_date = ymd(d); }
}

export const REINFORCERS = ["فقاعات الصابون", "المكعبات الملوّنة", "الأرجوحة"];
export const todaySession = (db: any) => db.sessions.filter((s: any) => s.starts_at.slice(0, 10) === ymd(new Date())).sort((a: any, b: any) => a.starts_at.localeCompare(b.starts_at))[0];
export const firstGoal = (db: any) => { const t = db.trackings.find((x: any) => x.status === "approved"); return db.reportPlans.flatMap((p: any) => p.goals).find((g: any) => t.goal_ids.includes(g.id)); };

export const session: Chapter = {
  key: "session",
  title: "الجلسة",
  role: "الأخصائية",
  device: "desktop",
  staff: "therapist",
  start: { phone: "/web/clidreen_parents", desktop: "/sessions" },
  apply(db) {
    shiftSessionsToToday(db);
    const s = todaySession(db); const g = firstGoal(db); const t = staffByKey("therapist");
    s.started_at = db.now(); s.status = "ongoing"; s.workspace = { step: "goals" };
    const sched = blankSchedule(); sched.trials[0].date = ymd(new Date()); sched.trials[0].session = `1 / ${t.name}`; sched.trials[0].place = "inside"; sched.trials[0].marks[0] = true; sched.trials[0].marks[1] = true; sched.trials[0].breaks = 1;
    s.break_schedule = { ...sched, ready_at: null, updated_at: db.now() };
    (db as any).reinforcers = REINFORCERS.map((name) => ({ id: db.id(), child_id: s.child_id, name }));
    s.preference_tests = [{ id: db.id(), program_session_id: s.id, child_id: s.child_id, type: "paired", items: REINFORCERS, answers: [0, 0, 2], result: { type: "paired", ranking: [{ index: 0, letter: "A", name: REINFORCERS[0], picks: 2, chances: 2, percent: 100, rank: 1, tier: "highest" }, { index: 2, letter: "C", name: REINFORCERS[2], picks: 1, chances: 2, percent: 50, rank: 2, tier: "moderate" }, { index: 1, letter: "B", name: REINFORCERS[1], picks: 0, chances: 2, percent: 0, rank: 3, tier: "lowest" }] }, created_by: t.id, created_at: db.now() }];
    g.prop_start = ymd(new Date());
    g.dtt = { 1: { date: ymd(new Date()), trainer: t.name, phase: "MT", sd: "", percent_correct: "70%", next: "", trials: [1, 1, 1, 0, 1, 1, 0, 1, 0, 1].map((c) => ({ response: c ? "C" : "P", prompt: c ? "" : "جزئي", notes: "" })), approx: [], step: 1, program_session_id: s.id, updated_at: db.now() } };
    g.cells = { ...(g.cells ?? {}), mt_start: ymd(new Date()), mt_end: "" }; g.session_cells = ["mt_start"];
    db.generalizations.push({ id: db.id(), goal_id: g.id, child_id: s.child_id, session_id: s.id, type: "home", status: "pending", note: null, requested_by: t.id, therapist_id: t.id, recipient_id: null, created_at: db.now(), decided_at: null });
    db.notifyParent({ title: "طلب تعميم هدف في البيت", message: `${t.name} تطلب تدريب ${scenario.child.name} في البيت على: ${g.goal}`, type: "goal_generalization" });
  },
  timeline: () => {
    const chips: Action[] = [1, 1, 1, 0, 1, 1, 0, 1, 0, 1].map((c, i) => ({ type: "click", target: desk(c ? ".dtt-chip.is-c" : ".dtt-chip.is-p", "", i), hold: 90 }));
    return [
      { type: "db", run: shiftSessionsToToday },
      { type: "nav", frame: "desktop", path: "/sessions" },
      { type: "caption", text: "بعد أيام: جلسات اليوم في قائمة الأخصائية — تبدأ من هنا" },
      { type: "waitFor", target: desk("td", scenario.child.firstName) },
      { type: "click", target: desk("button", "بدء الجلسة") },
      { type: "waitFor", target: desk(".bt-grid") },
      { type: "caption", text: "1/3 جدول البريك — نموذج المركز نفسه، يُملأ بالضغط ويُحفظ وحده" },
      { type: "click", target: desk(".bt-mark-cell", "", 0) },
      { type: "click", target: desk(".bt-mark-cell", "", 1) },
      { type: "click", target: desk(".bt-breaks-cell", "", 0) },
      { type: "click", target: desk("button", "اعتماد والمتابعة") },
      { type: "waitFor", target: desk(".rr-add-input input") },
      { type: "caption", text: "2/3 معززات يوسف واختبار تفضيل بالأزواج — تُحفظ له للجلسات القادمة" },
      ...REINFORCERS.flatMap<Action>((name) => [{ type: "type", target: desk(".rr-add-input input"), text: name }, { type: "click", target: desk(".rr-add button") }, { type: "waitFor", target: desk(".rr-item", name) }]),
      { type: "click", target: desk(".rr-check", "", 0) },
      { type: "click", target: desk(".rr-check", "", 1) },
      { type: "click", target: desk(".rr-check", "", 2) },
      { type: "click", target: desk("button", "بدء الاختبار") },
      { type: "waitFor", target: desk(".rr-card") },
      { type: "click", target: desk(".rr-card", "", 0), hold: 500 },
      { type: "click", target: desk(".rr-card", "", 0), hold: 500 },
      { type: "click", target: desk(".rr-card", "", 1), hold: 500 },
      { type: "click", target: desk("button", "حفظ النتيجة") },
      { type: "waitFor", target: desk(".rr-ranking li") },
      { type: "caption", text: "الترتيب يُحسب فوراً: الأعلى تفضيلاً، المتوسط، الأدنى" },
      { type: "fly", from: desk(".rr-ranking li", "", 0), to: "counter", label: "نتيجة اختبار التفضيل", counts: 3 },
      { type: "wait", ms: 1200 },
      { type: "click", target: desk("button", "التالي: الأهداف") },
      { type: "waitFor", target: desk(".rg-table tbody tr") },
      { type: "caption", text: "3/3 الأهداف من التراكنج المعتمد — جدول لكل مجال، وprop بدأ بأول جلسة" },
      { type: "fly", from: desk(".rg-table tbody tr", "", 0), to: "counter", label: "أهداف الجلسة من التراكنج", counts: 20 },
      { type: "click", target: desk(".rg-cell.is-action", "", 0) },
      { type: "waitFor", target: desk(".rg-mt-step") },
      { type: "click", target: desk(".rg-mt-step", "", 0) },
      { type: "waitFor", target: desk(".dtt-chip") },
      { type: "caption", text: "ورقة DTT للمرحلة MT1 كما هي على الورق: 10 محاولات C/I/P/NR" },
      ...chips,
      { type: "type", target: desk('input[aria-label="% correct"]'), text: "70%" },
      { type: "click", target: desk("button", "حفظ والرجوع") },
      { type: "waitFor", target: desk(".rg-table tbody tr") },
      { type: "caption", text: "تاريخ MT1 انتقل إلى عمود MT في التراكنج تلقائياً" },
      { type: "highlight", target: desk(".rg-cell.is-action", "", 0) },
      { type: "click", target: desk(".rg-cell.is-action", "", 1) },
      { type: "waitFor", target: desk(".gg-option") },
      { type: "caption", text: "التعميم: بيئة (صفوف/بيت) أو أشخاص — طلب البيت يذهب إلى ولي الأمر" },
      { type: "click", target: desk(".gg-option", "بيئة") },
      { type: "waitFor", target: desk(".gg-row") },
      { type: "click", target: desk(".gg-row button", "", 1) },
      { type: "waitFor", target: desk(".p-toast-message-success") },
      { type: "wait", ms: 1200 },
      { type: "click", target: desk(".p-dialog-footer button", "إغلاق") },
      { type: "wait", ms: 600 },
    ];
  },
  notes: {
    points: ["الجلسة شاشة واحدة بلا تمرير: بريك → معززات → أهداف، مع عدّاد وقت الجلسة.", "كل ما تُسجّله الأخصائية يتدفق إلى التراكنج (MT من أوراق DTT، GEN من طلبات التعميم).", "المعززات ونتيجة التفضيل تُحفظ للطفل لا للجلسة."],
    question: "هل تُحسب نسبة الصواب تلقائياً؟",
    answer: "حالياً حقل حر كما في الورقة؛ ويمكن حسابها آلياً من المحاولات إذا رغب المركز.",
  },
};
