// الفصل 2 — ولي الأمر يحجز استشارة: يوم ووقت متاحان عند المستشارة، واستمارة قصيرة تُملأ بما يعرفه النظام.
import type { Chapter } from "@demo/engine/actions";
import { phone, desk } from "@demo/engine/actions";
import { scenario, ymd } from "../../scenario";

const K = scenario.consultation;
const hour = String(K.chosenHour).padStart(2, "0");

export function bookingDetails() {
  return {
    requester_name: `${scenario.parent.fname} ${scenario.parent.lname}`, requester_phone: scenario.parent.phone, relative_degree: scenario.parent.relative,
    addtional_phone: "", addtional_phone_owner: "", addtional_phone_degree: "", conversion_type: "", child_doctor: "",
    child_problem: 4, problem: "", child_problems_notes: "", child_aids: 0, aids: "", child_parents_problems: K.parentsProblems, parents_priorities: K.priorities, child_aids_notes: "",
  };
}

export const booking: Chapter = {
  key: "booking",
  title: "حجز الاستشارة",
  role: "ولي الأمر",
  device: "phone",
  staff: "consultant",
  start: { phone: "/web", desktop: "/sawa-admin/welcome" },
  apply(db) {
    const event = db.events.find((e) => e.start === `${ymd(K.day)} ${hour}:00:00`)!;
    db.bookings.push({ id: db.id(), user_id: 1, event_id: event.id, child_id: db.children[0].id, details: bookingDetails(), accepted: -1, status: -1, accepted_notes: null, consultation_result: null, pre_evaluations: null, billing_status: "free", created_at: db.now() });
  },
  timeline: () => [
    { type: "caption", text: "من الصفحة الرئيسة: «احجز استشارة»" },
    { type: "click", target: phone(".pp-hello__actions a", "احجز استشارة") },
    { type: "waitFor", target: phone(".pp-pick") },
    { type: "caption", text: "لمن الاستشارة؟ يوسف — بضغطة" },
    { type: "click", target: phone("button.pp-pick", scenario.child.firstName) },
    { type: "waitFor", target: phone(".pp-day") },
    { type: "caption", text: "الأيام التي فيها مستشار متاح فقط — لا مكالمات ولا انتظار" },
    { type: "click", target: phone(`.pp-day`, String(K.day.getDate())) },
    { type: "waitFor", target: phone(".pp-slot") },
    { type: "click", target: phone(".pp-slot", `${K.chosenHour}:00`) },
    { type: "waitFor", target: phone("#b-rel") },
    { type: "caption", text: "اسم ولي الأمر ورقمه جاءا من الحساب — لم يُعاد إدخالهما" },
    { type: "fly", from: phone("#b-name"), to: "counter", label: "اسم ولي الأمر + الهاتف", counts: 2 },
    { type: "type", target: phone("#b-rel"), text: scenario.parent.relative },
    { type: "select", target: phone("#b-problem"), option: K.problem },
    { type: "select", target: phone("#b-aids"), option: "لا" },
    { type: "type", target: phone("#b-problems"), text: K.parentsProblems, cps: 60 },
    { type: "type", target: phone("#b-priorities"), text: K.priorities, cps: 60 },
    { type: "click", target: phone('button[type="submit"]', "احجز") },
    { type: "waitFor", target: phone(".pp-tag", "بانتظار القبول") },
    { type: "caption", text: "الحجز وصل إلى المستشارة فوراً — وبريد تأكيد للأهل" },
    { type: "focus", frame: "desktop" },
    { type: "nav", frame: "desktop", path: "/sawa-admin/welcome" },
    { type: "waitFor", target: desk(".pending-card td", scenario.child.firstName) },
    { type: "fly", from: phone(".pp-tag", "بانتظار القبول"), to: desk(".pending-card td", scenario.child.firstName), label: "طلب استشارة جديد", counts: false },
    { type: "highlight", target: desk(".pending-card tr", scenario.child.firstName) },
    { type: "wait", ms: 800 },
  ],
  notes: {
    points: ["الأيام المعروضة هي ساعات العمل الحقيقية للمستشار (صفحة ساعات العمل).", "استمارة الاستشارة تحمل اسم الأهل ورقمهم تلقائياً.", "المستشارة ترى الطلب في صفحتها لحظة إرساله، والأهل يتلقون بريداً."],
    question: "هل يستطيع الأهل إلغاء الحجز؟",
    answer: "نعم من البوابة ما لم يُقبل بعد؛ وبعد القبول يطلبون موعداً آخر من صفحة الاستشارات.",
  },
};
