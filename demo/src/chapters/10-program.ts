// الفصل 10 — مدير البرامج (الحاسوب): برنامج نهاري 10 جلسات أسبوعياً؛ التوزيع الآلي على الغرف والمعالج والتسعير شهراً بشهر.
import type { Chapter } from "@demo/engine/actions";
import { desk } from "@demo/engine/actions";
import { scenario, staffByKey, workDay, ymd } from "../../scenario";
import { saveProgram } from "../../mock/handlers/programs";

export const programStart = () => ymd(workDay(5));
export const programBody = (db: any) => ({
  child_id: db.children[0].id, kind: "day", therapist_id: staffByKey("therapist").id, start_date: programStart(), end_date: `${new Date().getFullYear()}-12-31`,
  weekly_sessions: 10, days: [0, 1, 2, 3, 4], individual_rows: [{ treatment_id: 1, sessions: 6 }], group_sessions: 4, scheduling: { criteria: null, skills: [1], window: null, treatment_windows: [] },
});

export const program: Chapter = {
  key: "program",
  title: "البرنامج العلاجي",
  role: "مدير البرامج",
  device: "desktop",
  staff: "manager",
  start: { phone: "/web/clidreen_parents", desktop: "/create-studentprograme" },
  apply(db) { saveProgram(db, programBody(db)); },
  timeline: () => [
    { type: "caption", text: "برنامج نهاري ليوسف: النوع، الطالب، المعالج المقترح، التاريخ" },
    { type: "waitFor", target: desk(".p-selectbutton") },
    { type: "click", target: desk(".p-togglebutton", "نهاري") },
    { type: "select", target: desk(".p-select", "", 0), option: scenario.child.firstName },
    { type: "waitFor", target: desk(".p-select", staffByKey("therapist").name) },
    { type: "caption", text: "المعالج يُقترح آلياً حسب الشواغر والمهارات والفئة العمرية — ويمكن تغييره" },
    { type: "fly", from: desk(".p-select", staffByKey("therapist").name), to: "counter", label: "المعالج المقترح", counts: 1 },
    { type: "type", target: desk("#sp-start"), text: programStart(), cps: 18 },
    { type: "caption", text: "النصاب: 10 جلسات في الأسبوع — 6 فردية تحليل سلوك والباقي جماعي تلقائياً" },
    { type: "type", target: desk("#sp-weekly"), text: "10" },
    { type: "click", target: desk("button", "إضافة نوع علاج فردي") },
    { type: "select", target: desk(".p-select", "", 2), option: "تحليل السلوك" },
    { type: "type", target: desk("#sp-individual-sessions-0"), text: "6" },
    { type: "wait", ms: 600 },
    { type: "click", target: desk("button", "توزيع الجلسات") },
    { type: "waitFor", target: desk(".p-datatable tbody tr") },
    { type: "caption", text: "لحظة الدهشة: 10 جلسات وُزّعت على الأيام والغرف والمعالج في ثانية، مع السعر شهراً بشهر" },
    { type: "fly", from: desk(".p-datatable tbody tr", "", 0), to: "counter", label: "10 جلسات × غرفة × معالج × ساعة", counts: 10 },
    { type: "scroll", target: desk(".p-datatable", "", 1) },
    { type: "wait", ms: 1800 },
    { type: "scroll", target: desk("button", "حفظ البرنامج") },
    { type: "click", target: desk("button", "حفظ البرنامج") },
    // الحفظ يفتح صفحة البرنامج (الحالة «بانتظار التثبيت» حتى تثبّته المحاسبة).
    { type: "waitFor", target: desk(".p-tag", "بانتظار التثبيت") },
    { type: "highlight", target: desk(".p-tag", "بانتظار التثبيت") },
    { type: "caption", text: "حُفظ البرنامج مبدئياً — جلسات العام كلها أُنشئت، ورسمه ذهب إلى المحاسبة" },
    { type: "wait", ms: 1500 },
  ],
  notes: {
    points: ["النصاب يُقسَّم فردياً/جماعياً، والتوزيع الآلي يحترم ساعات الغرف وورديات المعالجين والنشاطات.", "السعر من «رسوم البرامج»: باقة شهرية، والجلسات فوق 4 أسابيع مجانية.", "البرنامج يبقى مبدئياً يومين حتى تثبّته المحاسبة أو يُدفع قسطه الأول."],
    question: "ماذا لو كان المعالج في إجازة؟",
    answer: "الجلسة تُبدَّل إلى بديل معتمد قبل بدئها أو تُؤجَّل باقتراحات خلال 14 يوماً — بقرار بشري موثّق، لا آلياً.",
  },
};
