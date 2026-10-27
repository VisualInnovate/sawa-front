// الفصل 6 — الإدارة (الحاسوب): تعتمد نتيجة التقييم؛ الأهل يرون المخطط على الهاتف فور الاعتماد.
import type { Chapter } from "@demo/engine/actions";
import { desk, phone } from "@demo/engine/actions";
import { scenario } from "../../scenario";

export const approval: Chapter = {
  key: "approval",
  title: "اعتماد نتيجة التقييم",
  role: "الإدارة",
  device: "desktop",
  staff: "management",
  start: { phone: "/web/clidreen_parents", desktop: "/sawa-admin/evaluation-approvals" },
  apply(db) {
    const e = db.evaluations.find((x) => x.type === 2)!;
    e.approval_status = "approved"; e.approved_at = db.now();
    db.notifyStaff(e.specialist_id, { kind: "evaluation_approval", title: "اعتُمد التقييم", message: `اعتُمدت نتيجة تقييم VB-MAPP للطفل ${scenario.child.name}.`, url: "/my-evaluation-results", evaluation: `e${e.id}` });
  },
  timeline: (db) => {
    const childId = db.children[0].id;
    return [
      { type: "caption", text: "كل نتيجة تمرّ على الإدارة قبل أن تصل إلى التقرير أو الأهل" },
      { type: "waitFor", target: desk("td", scenario.child.firstName) },
      { type: "highlight", target: desk(".p-tag", "بانتظار الاعتماد") },
      { type: "click", target: desk("button", "الرد") },
      { type: "waitFor", target: desk(".p-dialog button", "موافقة") },
      { type: "click", target: desk(".p-dialog button", "موافقة") },
      { type: "waitFor", target: desk(".p-toast-message-success") },
      { type: "caption", text: "اعتُمد — الأخصائية تُشعَر، والنتيجة أصبحت متاحة للتقرير والخطة" },
      { type: "nav", frame: "phone", path: `/web/children/${childId}?tab=evaluations` },
      { type: "waitFor", target: phone(".pp-tag", "معتمد") },
      { type: "focus", frame: "phone" },
      { type: "fly", from: desk(".p-toast-message-success"), to: phone(".pp-tag", "معتمد"), label: "نتيجة معتمدة", counts: false },
      { type: "click", target: phone("button", "عرض الرسم") },
      { type: "waitFor", target: phone(".mc-box") },
      { type: "caption", text: "الأهل يرون مخطط VB-MAPP نفسه على الهاتف — لا نسخة مطبوعة ولا واتساب" },
      { type: "scroll", target: phone(".mc") },
      { type: "wait", ms: 1800 },
    ];
  },
  notes: {
    points: ["الاعتماد بوابة جودة: الإدارة تراجع كل نتيجة وترفض مع سبب يصل الأخصائية.", "قبل الاعتماد لا تقرير ولا خطة ولا يرى الأهل شيئاً.", "بعد الاعتماد يرى الأهل المخطط ذاته الذي يراه الفريق."],
    question: "هل يمكن تعديل الإجابات بعد الاعتماد؟",
    answer: "لا؛ التعديل متاح حتى الاعتماد فقط، وبعده يُفتح تقييم جديد أو مستوى إضافي يمرّ بالاعتماد مرة أخرى.",
  },
};
