// الفصل 9 — التراكنج: نموذج متابعة الأهداف يُبنى من الخطة ويُرسل للإدارة؛ الإدارة تعتمده فتعمل الجلسات عليه.
import type { Chapter } from "@demo/engine/actions";
import { desk } from "@demo/engine/actions";
import { scenario } from "../../scenario";
import { editorPath } from "./07-report";
import { seedPlan } from "./08-plan";

export function seedTracking(db: any, status: "pending" | "approved") {
  seedPlan(db);
  const e = db.evaluations.find((x: any) => x.type === 2)!;
  const p = db.reportPlans.find((x: any) => x.evaluation_id === e.id)!;
  let t = db.trackings.find((x: any) => x.child_id === e.child_id);
  if (!t) { t = { id: db.id(), child_id: e.child_id, evaluation_ids: [e.id], goal_ids: p.goals.map((g: any) => g.id), status: "pending", note: null, requested_by: 13, approved_by: null, decided_at: null, requested_at: db.now() }; db.trackings.push(t); }
  if (status === "approved") { t.status = "approved"; t.approved_by = 15; t.decided_at = db.now(); }
}

export const tracking: Chapter = {
  key: "tracking",
  title: "التراكنج واعتماده",
  role: "الأخصائية ← الإدارة",
  device: "desktop",
  staff: "therapist",
  start: { phone: "/web/clidreen_parents", desktop: "/sawa-admin/evaluation-reports" },
  apply: (db) => seedTracking(db, "approved"),
  timeline: (db) => [
    { type: "nav", frame: "desktop", path: editorPath(db) },
    { type: "waitFor", target: desk(".rx-track") },
    { type: "caption", text: "التراكنج: نموذج المركز لمتابعة كل هدف (prop · MT · EXP · RR · GEN) — من الخطة مباشرة" },
    { type: "scroll", target: desk(".rx-track", "", 0) },
    { type: "fly", from: desk(".rx-track tbody tr", "", 0), to: "counter", label: "أهداف التراكنج من الخطة", counts: 20 },
    { type: "wait", ms: 1500 },
    { type: "caption", text: "يُرسل للاعتماد؛ الجلسات تعمل على آخر تراكنج معتمد" },
    { type: "scroll", target: desk(".rx-toolbar") },
    { type: "click", target: desk(".rx-save-groups > .rx-save-group:nth-child(4) button", "إرسال") },
    { type: "waitFor", target: desk(".rx-save-group.is-pending") },
    { type: "highlight", target: desk(".rx-save-group.is-pending") },
    { type: "role", staff: "management", path: "/sawa-admin/tracking-approvals" },
    { type: "caption", text: "الإدارة: «طلبات اعتماد التراكنج» — تعرض الأهداف كما ستُطبع وتعتمد" },
    { type: "waitFor", target: desk("td", scenario.child.firstName) },
    { type: "click", target: desk("button", "عرض") },
    { type: "waitFor", target: desk(".ta-table") },
    { type: "wait", ms: 1500 },
    { type: "click", target: desk(".p-dialog-footer button", "الرد") },
    { type: "waitFor", target: desk(".p-dialog button", "موافقة") },
    { type: "click", target: desk(".p-dialog button", "موافقة") },
    { type: "waitFor", target: desk(".p-toast-message-success") },
    { type: "caption", text: "اعتُمد التراكنج — من الآن كل جلسة تفتح على هذه الأهداف" },
    { type: "wait", ms: 1200 },
  ],
  notes: {
    points: ["التراكنج هو نموذج المتابعة الورقي للمركز، لكنه يُبنى من الخطة ويُملأ من الجلسات.", "أعمدة التواريخ تضعها الجلسة بنفسها: prop يبدأ بأول جلسة وينتهي بـ«تم تحقيق الهدف».", "اعتماد الإدارة يحدّد أي نسخة من الأهداف تعمل عليها الجلسات."],
    question: "ماذا لو عُدّلت الخطة بعد الاعتماد؟",
    answer: "التراكنج المعتمد يبقى كما هو ويُقرأ فقط؛ تعديل الخطة يُرسل تراكنجاً جديداً للاعتماد.",
  },
};
