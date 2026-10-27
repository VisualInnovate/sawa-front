// الفصل 14 — ولي الأمر (الهاتف): ملف يوسف كاملاً بعد الدورة: النتائج، الخطة والأهداف، البرنامج والأسبوع، الرسوم.
import type { Chapter } from "@demo/engine/actions";
import { phone } from "@demo/engine/actions";
import { scenario } from "../../scenario";

export const parent: Chapter = {
  key: "parent",
  title: "النتائج في صفحة ولي الأمر",
  role: "ولي الأمر",
  device: "phone",
  staff: "therapist",
  start: { phone: "/web", desktop: "/sessions" },
  apply() {},
  timeline: (db) => {
    const id = db.children[0].id;
    return [
      { type: "caption", text: "الدورة اكتملت: كل ما جرى يظهر للأهل على الهاتف — بلا ورقة واحدة" },
      { type: "waitFor", target: phone(".pp-hello") },
      { type: "scroll", target: phone(".pp-child") },
      { type: "wait", ms: 1200 },
      { type: "click", target: phone(".pp-child", scenario.child.firstName) },
      { type: "waitFor", target: phone(".pp-h1", scenario.child.firstName) },
      { type: "caption", text: "نظرة عامة: البرنامج، التقييمات المعتمدة، الجلسة القادمة، الرسوم" },
      { type: "wait", ms: 1800 },
      { type: "nav", frame: "phone", path: `/web/children/${id}?tab=plan` },
      { type: "waitFor", target: phone(".pp-goal") },
      { type: "caption", text: "الخطة والأهداف: ما تعمل عليه الجلسات الآن، وما تحقق، وطلبات البيت" },
      { type: "scroll", target: phone(".pp-goal", "", 0) },
      { type: "wait", ms: 1800 },
      { type: "nav", frame: "phone", path: `/web/children/${id}?tab=program` },
      { type: "waitFor", target: phone(".pp-timetable") },
      { type: "caption", text: "البرنامج: الأسبوع كما وُزّع، والجلسة القادمة والسابقة" },
      { type: "scroll", target: phone(".pp-timetable") },
      { type: "wait", ms: 1800 },
      { type: "nav", frame: "phone", path: `/web/children/${id}?tab=finance` },
      { type: "waitFor", target: phone(".pp-installment") },
      { type: "caption", text: "الرسوم: المدفوع والمتبقي وموعد كل قسط — نفس أرقام المحاسبة" },
      { type: "wait", ms: 1800 },
      { type: "nav", frame: "phone", path: `/web/children/${id}?tab=evaluations` },
      { type: "waitFor", target: phone(".pp-tag", "معتمد") },
      { type: "caption", text: "Enable 360 يعيد وقت الأخصائي إلى الطفل — وأسرع بنسبة 60% في كل محطة" },
      { type: "wait", ms: 2500 },
    ];
  },
  notes: {
    points: ["البوابة للقراءة: لا يغيّر الأهل أي إجراء، لكنهم يرون كل شيء لحظة حدوثه.", "81 طفلاً و65 موظفاً وسنة استخدام يومي.", "من 150,000 ورقة في السنة إلى أقل من 1,000."],
    question: "كيف نبدأ؟",
    answer: "ترخيص سنوي يشمل التركيب والتدريب والدعم؛ تواصل: 00966547161190 · 00962777593902 · Sales@360enable.com",
  },
};
