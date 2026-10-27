// الفصل 3 — المستشارة (الحاسوب): تقبل الحجز، تكتب نتيجة الاستشارة وتختار التقييمات المطلوبة.
import type { Chapter } from "@demo/engine/actions";
import { desk, phone } from "@demo/engine/actions";
import { scenario } from "../../scenario";
import { TYPE_NAMES } from "../../mock/handlers/parent";

const K = scenario.consultation;
const PICKED = [1, 3];

export function consultationResult() {
  return {
    health: K.health, consultant_recommendations: K.recommendations, notes: K.notes,
    filed_value: PICKED.map((id, i) => ({ id, display_order: id, value: ["تخصيص وقت يومي للعب التفاعلي مع {{name}} وجهاً لوجه لمدة 15 دقيقة.", "", "تسمية الأشياء التي يطلبها {{name}} بكلمة واحدة واضحة قبل إعطائها له."][id - 1] })),
  };
}

export const consultant: Chapter = {
  key: "consultant",
  title: "نتيجة الاستشارة",
  role: "المستشارة",
  device: "desktop",
  staff: "consultant",
  start: { phone: "/web/appointment", desktop: "/sawa-admin/welcome" },
  apply(db) {
    const b = db.bookings[0];
    b.accepted = 1; b.accepted_notes = "أهلاً بكم، نراكم في الموعد.";
    b.consultation_result = consultationResult(); b.status = 1;
    b.pre_evaluations = { pre_evalutions: K.requiredTypes.map((id) => ({ id, name: ["", "side profile", "milestone", "barrier"][id] })) };
    db.staff.filter((s) => s.perms.includes("required evaluations list")).forEach((s) => db.notifyStaff(s.id, { title: "تقييمات مطلوبة بحاجة إلى موعد", message: `${scenario.child.name}: ${K.requiredTypes.map((t) => TYPE_NAMES[t]).join("، ")}`, url: "/sawa-admin/required-evaluations", type: "evaluations_required", booking_id: b.id }));
  },
  timeline: () => [
    { type: "caption", text: "المستشارة تفتح الطلب من صفحتها الرئيسة" },
    { type: "click", target: desk(".pending-card button", "متابعة التفاصيل") },
    { type: "waitFor", target: desk(".profile-name h2", scenario.child.firstName) },
    { type: "caption", text: "كل ما كتبه الأهل أمامها — بلا إعادة إدخال" },
    { type: "fly", from: desk(".answer-card", "تأخر"), to: "counter", label: "استمارة الأهل كاملة", counts: 4 },
    { type: "highlight", target: desk(".answers-block") },
    { type: "scroll", target: desk("#booking-status") },
    { type: "select", target: desk("#booking-status"), option: "مقبول" },
    { type: "type", target: desk("#notes"), text: "أهلاً بكم، نراكم في الموعد.", cps: 40 },
    { type: "click", target: desk('form button[type="submit"]', "تاكيد") },
    { type: "waitFor", target: desk(".p-toast-message-success") },
    { type: "caption", text: "قُبل الحجز — الأهل يرون ذلك فوراً وتصلهم تعليمات الحضور" },
    { type: "nav", frame: "phone", path: "/web/appointment" },
    { type: "waitFor", target: phone(".pp-tag", "مقبول") },
    { type: "fly", from: desk("#booking-status"), to: phone(".pp-tag", "مقبول"), label: "قبول الحجز + تعليمات الحضور", counts: false },
    { type: "wait", ms: 700 },
    { type: "caption", text: "بعد الجلسة: نتيجة الاستشارة والتوصيات المنزلية والتقييمات المطلوبة" },
    { type: "scroll", target: desk("textarea", "", 1) },
    // textarea 0 = ملاحظات القبول (أعلى الصفحة)؛ 1–3 = نموذج النتيجة.
    { type: "type", target: desk("form textarea", "", 1), text: K.health, cps: 70 },
    { type: "type", target: desk("form textarea", "", 2), text: K.recommendations, cps: 70 },
    { type: "select", target: desk(".p-multiselect", "", 0), option: "وقت يومي للعب", close: false },
    { type: "select", target: desk(".p-multiselect-overlay", "", 0), option: "تسمية الأشياء" },
    { type: "select", target: desk(".p-multiselect", "", 1), option: "المراحل", close: false },
    { type: "select", target: desk(".p-multiselect-overlay", "", 0), option: "العوائق" },
    { type: "type", target: desk("form textarea", "", 3), text: K.notes, cps: 60 },
    // بعد القبول يصبح زر الحجز «تعديل»، فيبقى زر النتيجة وحده بنص «تاكيد».
    { type: "click", target: desk("button", "تاكيد", 0) },
    { type: "waitFor", target: desk(".p-toast-message-success") },
    { type: "caption", text: "التوصيات ذهبت للأهل بصيغة الطفل، والتقييمات المطلوبة ذهبت لمدير البرامج" },
    { type: "nav", frame: "phone", path: "/web/appointment" },
    { type: "waitFor", target: phone("button", "نتيجة الاستشارة") },
    { type: "fly", from: desk(".p-multiselect", "", 1), to: phone("button", "نتيجة الاستشارة"), label: "نتيجة الاستشارة", counts: false },
    { type: "click", target: phone("button", "نتيجة الاستشارة") },
    { type: "waitFor", target: phone(".p-dialog") },
    { type: "wait", ms: 1600 },
  ],
  notes: {
    points: ["المستشارة لا تنسخ شيئاً: استمارة الأهل وبيانات الطفل أمامها.", "التوصيات المنزلية قوالب جاهزة تُكتب باسم الطفل وجنسه تلقائياً.", "اختيار التقييمات المطلوبة يفتح الحلقة التالية عند مدير البرامج دون بريد ولا اتصال."],
    question: "هل يمكن تعديل التوصيات القياسية؟",
    answer: "نعم من «إعدادات الاستشارة»: لكل توصية صيغة للذكر وللأنثى واسم الطفل يُستبدل تلقائياً.",
  },
};

