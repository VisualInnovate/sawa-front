// الفصل 7 — الأخصائية (الحاسوب): تقرير التقييم يُبنى من النتيجة المعتمدة (غلاف، بيانات، وصف حالة، مخطط، قوة/ضعف) ويُحفظ.
import type { Chapter } from "@demo/engine/actions";
import { desk } from "@demo/engine/actions";
import { scenario } from "../../scenario";

export const editorPath = (db: any) => {
  const e = db.evaluations.find((x: any) => x.type === 2);
  return `/evaluation-report/${db.children[0].id}?items=e${e.id}&types=report,plan,tracking`;
};

export const report: Chapter = {
  key: "report",
  title: "التقرير",
  role: "الأخصائية",
  device: "desktop",
  staff: "therapist",
  start: { phone: "/web/clidreen_parents", desktop: "/sawa-admin/evaluation-reports" },
  apply(db) {
    const e = db.evaluations.find((x) => x.type === 2)!;
    const me = db.staffById(13);
    ((db as any).savedReports ??= []).push({ id: db.id(), child_id: e.child_id, items: [`e${e.id}`], types: ["report", "plan", "tracking"], edits: null, printed_at: null, created_at: db.now(), updated_at: db.now(), created_by: { id: me.id, name: me.name }, updated_by: { id: me.id, name: me.name } });
  },
  timeline: () => [
    { type: "caption", text: "صفحة التقارير: الأطفال الذين لهم تقييمات معتمدة" },
    { type: "waitFor", target: desk("td", scenario.child.firstName) },
    { type: "click", target: desk("td", scenario.child.firstName) },
    { type: "waitFor", target: desk(".rp-output-type") },
    { type: "caption", text: "تقييم واحد مختار؛ نطلب التقرير والخطة والتراكنج معاً" },
    { type: "click", target: desk(".rp-output-type .p-checkbox-input", "", 0) },
    { type: "click", target: desk(".rp-output-type .p-checkbox-input", "", 1) },
    { type: "click", target: desk(".rp-output-type .p-checkbox-input", "", 2) },
    { type: "click", target: desk("button", "إعداد التقرير") },
    { type: "waitFor", target: desk(".rx-cover-name", scenario.child.firstName) },
    { type: "caption", text: "التقرير جاهز: غلاف وبيانات وفريق ووصف حالة ومخطط ونقاط القوة والضعف — بلا كتابة" },
    { type: "fly", from: desk(".rx-cover-name"), to: "counter", label: "الاسم + الميلاد + الفريق + التواريخ", counts: 6 },
    { type: "scroll", target: desk(".rx-info") },
    { type: "wait", ms: 1200 },
    { type: "scroll", target: desk(".mc", "", 0) },
    { type: "wait", ms: 1200 },
    { type: "scroll", target: desk(".rx-summary", "", 0) },
    { type: "caption", text: "الحقول المظلّلة تُعدَّل على الصفحة نفسها إن لزم؛ ثم يُحفظ التقرير ويُطبع" },
    { type: "wait", ms: 1000 },
    { type: "scroll", target: desk(".rx-toolbar") },
    { type: "click", target: desk(".rx-save-groups > .rx-save-group:nth-child(1) button") },
    { type: "waitFor", target: desk(".rx-save-group.is-saved") },
    { type: "highlight", target: desk(".rx-save-groups > .rx-save-group:nth-child(1)") },
    { type: "wait", ms: 800 },
  ],
  notes: {
    points: ["التقرير صفحات A4 كما ستُطبع، تُبنى من التقييم المعتمد.", "وصف الحالة والمخطط ونقاط القوة والضعف تُكتب آلياً وتُعدَّل في مكانها.", "«من 150,000 ورقة في السنة إلى أقل من 1,000» — هذه هي الورقة التي بقيت."],
    question: "هل يمكن جمع عدة تقييمات في تقرير واحد؟",
    answer: "نعم، حتى أربعة اختبارات من النوع الواحد تُرسم معاً بألوانها، مع أنواع أخرى في التقرير نفسه.",
  },
};
