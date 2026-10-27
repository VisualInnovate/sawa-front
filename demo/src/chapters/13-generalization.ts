// الفصل 13 — ولي الأمر (الهاتف): يوافق على تعميم الهدف في البيت؛ الأخصائية ترى الموافقة في خانة GEN.
import type { Chapter } from "@demo/engine/actions";
import { desk, phone } from "@demo/engine/actions";
import { todaySession } from "./12-session";

export const generalization: Chapter = {
  key: "generalization",
  title: "التعميم في البيت",
  role: "ولي الأمر",
  device: "phone",
  staff: "therapist",
  start: { phone: "/web/generalizations", desktop: "/sessions" },
  apply(db) {
    const g = db.generalizations.find((x) => x.type === "home")!;
    g.status = "approved"; g.decided_at = db.now();
  },
  timeline: (db) => [
    { type: "caption", text: "على هاتف الأهل: طلب تعميم الهدف في البيت — بصيغة يوسف" },
    { type: "waitFor", target: phone(".pp-card", "الرد") },
    { type: "fly", from: desk("td", "يوسف"), to: phone(".pp-card", "الرد"), label: "طلب تعميم في البيت", counts: false },
    { type: "click", target: phone("button", "الرد") },
    { type: "waitFor", target: phone(".p-dialog button", "موافقة") },
    { type: "click", target: phone(".p-dialog button", "موافقة") },
    // الصفحة تبقى على تبويب «بانتظار» فتختفي البطاقة؛ تبويب «وافقت» يُظهرها بوسمها.
    { type: "waitFor", target: phone(".p-toast-message-success") },
    { type: "click", target: phone(".pp-tab", "وافقت") },
    { type: "waitFor", target: phone(".pp-tag", "وافقت") },
    { type: "caption", text: "وافق الأهل — الأخصائية ترى ذلك في خانة GEN للهدف نفسه" },
    { type: "focus", frame: "desktop" },
    { type: "nav", frame: "desktop", path: () => `/session-run/${todaySession(db).id}` },
    { type: "waitFor", target: desk(".rg-table tbody tr") },
    { type: "click", target: desk(".rg-cell.is-action", "", 1) },
    { type: "waitFor", target: desk(".gg-option") },
    { type: "click", target: desk(".gg-option", "بيئة") },
    { type: "waitFor", target: desk(".gg-row .p-tag", "وافق") },
    { type: "highlight", target: desk(".gg-row", "بيت") },
    { type: "wait", ms: 1200 },
    { type: "click", target: desk(".p-dialog-footer button", "إغلاق") },
    { type: "caption", text: "الأهل شريك في الخطة: يوافقون أو يرفضون مع سبب يصل الأخصائية" },
    { type: "wait", ms: 1200 },
  ],
  notes: {
    points: ["ثلاثة أنواع تعميم: الصفوف (تعتمدها الإدارة)، البيت (يوافق الأهل)، الأشخاص (يؤكد كل معالج).", "قرار الأهل يظهر في الجلسة وفي التراكنج دون مكالمة.", "رفضٌ بسبب = الأخصائية تعيد الطلب لاحقاً."],
    question: "هل يرى الأهل بيانات أطفال آخرين؟",
    answer: "لا؛ كل ولي أمر يرى أطفاله فقط، والحماية في الواجهة وفي الخادم معاً.",
  },
};
