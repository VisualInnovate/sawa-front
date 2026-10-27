// الفصل 4 — مدير البرامج (الحاسوب): يحجز موعدَي التقييم من تقويم الأخصائية؛ المحاسبة تفتح التقييم؛ الأهل يُشعَرون.
import type { Chapter } from "@demo/engine/actions";
import { desk, phone } from "@demo/engine/actions";
import { scenario, staffByKey, ymd } from "../../scenario";
import { TYPE_NAMES } from "../../mock/handlers/parent";
import { createCharge } from "../../mock/handlers/accounting";

const E = scenario.evaluation;
const day = ymd(E.day);
const hh = (h: number) => `${String(h).padStart(2, "0")}:00:00`;

export const manager: Chapter = {
  key: "manager",
  title: "حجز مواعيد التقييم",
  role: "مدير البرامج",
  device: "desktop",
  staff: "manager",
  start: { phone: "/web", desktop: "/sawa-admin/welcome" },
  apply(db) {
    const child = db.children[0];
    const b = db.bookings[0];
    const therapist = staffByKey("therapist");
    const price = db.settings.evaluationPrices;
    const charge = createCharge(db, { child_id: child.id, source: "evaluation", description: "تقييم VB-MAPP", lines: [], gross: 0, amount: 0 }, day);
    charge.amount = 0; charge.gross = 0; charge.installments[0].amount = 0;
    for (const [type, h] of [[2, E.milestonesHour], [3, E.barriersHour]] as const) {
      const r = { id: db.id(), booking_id: b.id, child_id: child.id, employee_id: therapist.id, consultant_id: 11, evaluation_type: type, title: TYPE_NAMES[type], date: day, start_time: hh(h), end_time: hh(h + 1), notes: null, color: "87ceeb", status: 0, billing_status: "confirmed", billing_price: price[type], charge_id: charge.id, created_at: db.now() };
      charge.lines.push({ key: "evaluation", type: "evaluation", evaluation_type: type, name: TYPE_NAMES[type], amount: price[type] });
      charge.gross += price[type]; charge.amount += price[type]; charge.installments[0].amount += price[type];
      db.evaluationRequests.push(r);
      db.notifyStaff(therapist.id, { title: "موعد تقييم جديد", message: `${TYPE_NAMES[type]} — ${child.name} · ${day} ${hh(h).slice(0, 5)}`, url: "/my-evaluations", type: "specialist_assigned", request_id: r.id });
      db.notifyParent({ title: "تم تحديد موعد تقييم", message: `${TYPE_NAMES[type]} لـ${child.name} يوم ${day} الساعة ${hh(h).slice(0, 5)} مع ${therapist.name}`, type: "evaluation_booked", request_id: r.id });
    }
  },
  timeline: () => [
    { type: "caption", text: "مدير البرامج يرى الأطفال الذين تنتظر تقييماتهم موعداً — فور حفظ المستشارة" },
    { type: "waitFor", target: desk(".required-board td", scenario.child.firstName) },
    { type: "highlight", target: desk(".required-tags") },
    { type: "click", target: desk(".required-board button", "حجز موعد") },
    { type: "waitFor", target: desk(".fc-daygrid-day") },
    { type: "caption", text: "التقويم يفتح على التقييم المطلوب الأول، ويعرض أيام الأخصائية الفارغة فقط" },
    { type: "fly", from: desk(".required-strip"), to: "counter", label: "الطفل + التقييمات المطلوبة", counts: 2 },
    { type: "select", target: desk(".calendar-filters .p-select", "", 1), option: staffByKey("therapist").name },
    { type: "waitFor", target: desk(".fc-day-available") },
    { type: "click", target: desk(`.fc-daygrid-day[data-date="${day}"]`) },
    { type: "waitFor", target: desk(".fc-timegrid-slot-lane") },
    { type: "click", target: desk(`.fc-timegrid-slot-lane[data-time="${hh(E.milestonesHour)}"]`) },
    { type: "waitFor", target: desk(".p-dialog .slot-summary") },
    { type: "click", target: desk('.p-dialog button[type="submit"]') },
    { type: "waitFor", target: desk(".p-toast-message-success") },
    { type: "caption", text: "الموعد الأول حُفظ؛ الشريط يُحدَّث والتالي: العوائق" },
    { type: "wait", ms: 600 },
    { type: "select", target: desk(".calendar-filters .p-select", "", 0), option: "barrier" },
    { type: "select", target: desk(".calendar-filters .p-select", "", 1), option: staffByKey("therapist").name },
    // التقويم بقي على عرض اليوم بعد الحجز الأول؛ نعود إلى الشهر لاختيار اليوم.
    { type: "click", target: desk(".fc-dayGridMonth-button") },
    { type: "waitFor", target: desk(".fc-day-available") },
    { type: "click", target: desk(`.fc-daygrid-day[data-date="${day}"]`) },
    { type: "waitFor", target: desk(".fc-timegrid-slot-lane") },
    { type: "click", target: desk(`.fc-timegrid-slot-lane[data-time="${hh(E.barriersHour)}"]`) },
    { type: "waitFor", target: desk(".p-dialog .slot-summary") },
    { type: "click", target: desk('.p-dialog button[type="submit"]') },
    { type: "waitFor", target: desk(".p-toast-message-success") },
    { type: "caption", text: "إشعاران انطلقا تلقائياً: للأخصائية في لوحتها، وللأهل على الهاتف" },
    { type: "nav", frame: "phone", path: "/web/notifications" },
    { type: "waitFor", target: phone(".pp-page", "موعد تقييم") },
    { type: "fly", from: desk(".fc-timegrid-event, .fc-event", "", 0), to: phone(".pp-page", "موعد تقييم"), label: "تم تحديد موعد تقييم", counts: false },
    { type: "wait", ms: 900 },
    { type: "caption", text: "«المحاسبة»: التقييم لطفل بلا برنامج مُسعَّر ومقفل حتى يُسدَّد أو تؤكده المحاسبة" },
    { type: "role", staff: "accountant", path: "/accounting/evaluations" },
    { type: "waitFor", target: desk("td", scenario.child.firstName) },
    { type: "highlight", target: desk(".p-tag", "مغلق") },
    { type: "click", target: desk("button", "تأكيد بدون دفع") },
    { type: "waitFor", target: desk(".p-toast-message-success") },
    { type: "caption", text: "فُتح التقييم للأخصائية؛ الرسم يبقى في كشف حساب يوسف حتى يُسدَّد" },
    { type: "wait", ms: 1200 },
  ],
  notes: {
    points: ["لا طفل يضيع بين الاستشارة والتقييم: لوحة «التقييمات المطلوبة» تمتلئ وحدها.", "التقويم يعرض ساعات عمل الأخصائية الحقيقية ومواعيدها المحجوزة.", "المحاسبة تتحقق من كل تقييم مسعَّر؛ القفل يُفتح بالدفع أو بتأكيد المحاسب."],
    question: "ماذا لو لم تُسدَّد رسوم التقييم قبل موعده؟",
    answer: "يُلغى التقييم المقفل آلياً عند حلول موعده ويُحرَّر وقت الأخصائية، ويمكن للمحاسبة إعادة جدولته.",
  },
};
