// الفصل 5 — الأخصائية (الحاسوب): تبدأ طلب VB-MAPP من قائمتها وتجيب على المستوى الأول؛ النتيجة تُحسب وتُعرض ثم تنتظر الاعتماد.
import type { Action, Chapter } from "@demo/engine/actions";
import { desk } from "@demo/engine/actions";
import { scenario, staffByKey, ymd } from "../../scenario";
import { SUB_GOALS, demoScore } from "../../mock/vbmapp";
import { TYPE_NAMES } from "../../mock/handlers/parent";

export const EVAL_COLOR = "00B8D9";

export const evaluation: Chapter = {
  key: "evaluation",
  title: "إجراء تقييم VB-MAPP",
  role: "الأخصائية",
  device: "desktop",
  staff: "therapist",
  start: { phone: "/web/clidreen_parents", desktop: "/my-evaluations" },
  apply(db) {
    const child = db.children[0];
    const therapist = staffByKey("therapist");
    const request = db.evaluationRequests.find((r) => r.evaluation_type === 2)!;
    const today = ymd(new Date());
    const e = { id: db.id(), type: 2, title: TYPE_NAMES[2], child_id: child.id, specialist_id: therapist.id, date: today, status: 1,
      approval_status: "pending", approval_note: null, approval_requested_at: db.now(), approved_at: null, color: EVAL_COLOR, created_at: db.now() };
    db.evaluations.push(e);
    const age = Math.max(0, Math.floor((Date.now() - new Date(`${child.birth_date}T00:00:00`).getTime()) / (30.44 * 86400000)));
    for (const g of SUB_GOALS) db.milestoneAnswers.push({ id: db.id(), evaluation_id: e.id, child_id: child.id, question_id: g.id, score: demoScore(g), color: EVAL_COLOR, carried: false, date: today, child_age: age, specialist_id: therapist.id, student_program_id: null, notes: "" });
    request.status = 1;
    db.staff.filter((s) => s.perms.includes("evaluation approval edit")).forEach((s) => db.notifyStaff(s.id, { kind: "evaluation_approval", title: "تقييم بانتظار الاعتماد", message: `نتيجة تقييم VB-MAPP للطفل ${child.name} بانتظار الاعتماد.`, url: "/sawa-admin/evaluation-approvals", evaluation: `e${e.id}` }));
  },
  timeline: () => {
    const answers: Action[] = SUB_GOALS.map((g) => ({ type: "click", target: desk(`input[name="question-${g.id}"][value="${demoScore(g)}"]`), hold: 90 }));
    return [
      { type: "caption", text: "الأخصائية تجد طلبها في «طلبات التقييم» بلا بريد ولا ورقة" },
      { type: "waitFor", target: desk(".request-row") },
      { type: "fly", from: desk(".child-heading h3", scenario.child.firstName), to: "counter", label: "الطفل + نوع التقييم + الموعد", counts: 3 },
      { type: "click", target: desk(".request-row button", "بدء التقييم") },
      { type: "waitFor", target: desk(".milestone-colors button") },
      { type: "caption", text: "الطفل وتاريخه وعمره بالأشهر جاهزة؛ تختار لون التقييم والمستوى فقط" },
      { type: "fly", from: desk(".p-inputnumber"), to: "counter", label: "العمر بالأشهر من تاريخ الميلاد", counts: 1 },
      { type: "click", target: desk(".milestone-colors button", "", 0) },
      { type: "click", target: desk(".level-picker-options .p-checkbox-input", "", 0) },
      { type: "click", target: desk("button", "بدء التقييم") },
      { type: "waitFor", target: desk(".milestone-question") },
      { type: "caption", text: "40 هدفاً فرعياً بصيغة الطفل واسمه — كل إجابة تلوّن مربعها في التقرير فوراً" },
      ...answers,
      { type: "caption", text: "حفظ؛ النتيجة والدرجات ونقاط القوة والضعف تُحسب وتُكتب تلقائياً" },
      { type: "click", target: desk('form button[type="submit"]') },
      { type: "waitFor", target: desk(".mc-box") },
      { type: "scroll", target: desk(".ab-banner") },
      { type: "highlight", target: desk(".ab-banner") },
      { type: "fly", from: desk(".mc", "", 0), to: "counter", label: "40 إجابة → مخطط + قوة/ضعف + أهداف", counts: 40 },
      { type: "scroll", target: desk(".rx-summary") },
      { type: "wait", ms: 1500 },
    ];
  },
  notes: {
    points: ["لا تُكتب بيانات الطفل مرة ثانية: الاسم والعمر والمواعيد من الملف.", "صياغة الأهداف بجنس الطفل واسمه آلياً (ذكر/أنثى).", "النتيجة ترسم مربعات VB-MAPP وتكتب القوة والضعف وأهداف الخطة من الإجابات نفسها — ثم تنتظر اعتماد الإدارة."],
    question: "ماذا عن باقي أنواع التقييم؟",
    answer: "ثمانية أنواع في النظام (Side profile، VB-MAPP بمستوياته، العوائق، ABLLS، Ablls OT، كارولينا، Transition، M-CHAT-R) بالمنطق نفسه؛ عرضنا VB-MAPP لأنه الأشمل.",
  },
};
