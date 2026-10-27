// الفصل 8 — الخطة: أهداف الخطة مكتوبة من نقاط الضعف نفسها؛ الأخصائية تراجعها وتحفظها.
import type { Chapter } from "@demo/engine/actions";
import { desk } from "@demo/engine/actions";
import { milestoneReport } from "../../mock/handlers/evaluation";
import { editorPath } from "./07-report";

export function seedPlan(db: any) {
  const e = db.evaluations.find((x: any) => x.type === 2)!;
  if (db.reportPlans.some((p: any) => p.evaluation_id === e.id)) return;
  const goals = milestoneReport(db, e.id).flatMap((group: any) => group.weak.map((point: any, i: number) => ({
    id: db.id(), level_id: 1, general_goal_id: group.general_goal_id, general_goal: group.general_goal, domain: group.domain, domain_symbol: group.domain_symbol, symbol: group.symbol,
    weakness: point.question, goal: point.goal, sort: i, cells: {}, attempts: [], session_cells: [], prop_start: null, achieved_at: null,
  })));
  db.reportPlans.push({ id: db.id(), evaluation_id: e.id, child_id: e.child_id, hidden: [], goals, updated_at: db.now() });
}

export const plan: Chapter = {
  key: "plan",
  title: "الخطة",
  role: "الأخصائية",
  device: "desktop",
  staff: "therapist",
  start: { phone: "/web/clidreen_parents", desktop: "/sawa-admin/evaluation-reports" },
  apply: seedPlan,
  timeline: (db) => [
    { type: "nav", frame: "desktop", path: editorPath(db) },
    { type: "waitFor", target: desk(".rx-plan") },
    { type: "caption", text: "الخطة: لكل نقطة ضعف هدفٌ مكتوب بصيغة الطفل — من الإجابات نفسها" },
    { type: "scroll", target: desk(".rx-plan", "", 0) },
    { type: "fly", from: desk(".rx-plan tbody tr", "", 1), to: "counter", label: "أهداف الخطة من نقاط الضعف", counts: 20 },
    { type: "wait", ms: 1500 },
    { type: "scroll", target: desk(".rx-plan", "", 1) },
    { type: "wait", ms: 1200 },
    { type: "caption", text: "أي هدف يُعدَّل أو يُحذف في مكانه؛ ثم تُحفظ الخطة على الخادم" },
    { type: "scroll", target: desk(".rx-toolbar") },
    { type: "click", target: desk(".rx-save-groups > .rx-save-group:nth-child(3) button") },
    { type: "waitFor", target: desk(".rx-save-groups > .rx-save-group:nth-child(3).is-saved") },
    { type: "highlight", target: desk(".rx-save-groups > .rx-save-group:nth-child(3)") },
    { type: "wait", ms: 800 },
  ],
  notes: {
    points: ["الخطة ليست ملفاً منفصلاً: هي أهداف الضعف نفسها مرقّمة برموز VB-MAPP (M-1، T-2…).", "تُحفظ على الخادم فتقرأها الجلسات والتراكنج.", "رموز الأهداف نفسها ستظهر في الجلسة وفي صفحة الأهل."],
    question: "هل يمكن إضافة أهداف من خارج التقييم؟",
    answer: "نعم، زر «إضافة» في كل جدول يضيف هدفاً حراً داخل المجال نفسه.",
  },
};
