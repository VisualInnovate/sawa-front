// الاستشارات: حجوزات المستشارة، قبول الحجز، نتيجة الاستشارة والتقييمات المطلوبة، لوحة مدير البرامج، تقويم التقييم.
import { HttpError, route } from "../backend";
import { ageMonths, type DB, ymd, at, addDays, today } from "../db";
import { INSTRUCTIONS, TYPE_NAMES } from "./parent";
import { createCharge } from "./accounting";

const RECOMMENDATIONS = [
  { id: 1, display_order: 1, male: "تخصيص وقت يومي للعب التفاعلي مع {{name}} وجهاً لوجه لمدة 15 دقيقة.", female: "تخصيص وقت يومي للعب التفاعلي مع {{name}} وجهاً لوجه لمدة 15 دقيقة." },
  { id: 2, display_order: 2, male: "تقليل وقت الشاشات لـ{{name}} إلى أقل من ساعة يومياً.", female: "تقليل وقت الشاشات لـ{{name}} إلى أقل من ساعة يومياً." },
  { id: 3, display_order: 3, male: "تسمية الأشياء التي يطلبها {{name}} بكلمة واحدة واضحة قبل إعطائها له.", female: "تسمية الأشياء التي تطلبها {{name}} بكلمة واحدة واضحة قبل إعطائها لها." },
  { id: 4, display_order: 4, male: "الالتزام بروتين نوم ثابت.", female: "الالتزام بروتين نوم ثابت." },
];

const bookingBase = (db: DB, b: any) => {
  const ev = db.events.find((e) => e.id === b.event_id)!;
  const c = db.child(b.child_id)!;
  return { ev, c, row: {
    id: b.id, pre_evaluations: b.pre_evaluations, accepted: b.accepted, status: b.status, event_id: b.event_id, details: b.details, billing_status: b.billing_status,
    event_date: ev.start.slice(0, 10), child_name: c.name, child_age: ageMonths(c.birth_date), child_birth_date: c.birth_date,
  } };
};

/** التقييمات المطلوبة لاستشارة، كما يصفها RequiredEvaluationService::describe. */
export function describeRequired(db: DB, b: any) {
  const { ev, c } = bookingBase(db, b);
  const types: number[] = (b.pre_evaluations?.pre_evalutions ?? []).map((x: any) => Number(x.id)).filter((t: number) => t >= 1 && t <= 5);
  const requests = db.evaluationRequests.filter((r) => r.child_id === b.child_id && (r.booking_id === b.id || r.booking_id == null));
  const required = types.map((type) => {
    const codes = type === 1 ? [1, 101, 102, 103, 104, 105] : [type];
    const matching = requests.filter((r) => codes.includes(Number(r.evaluation_type)));
    return { type, booked: matching.length > 0, missing_dimensions: [], appointments: matching.map((r) => ({ id: r.id, evaluation_type: r.evaluation_type, date: r.date, start_time: r.start_time, end_time: r.end_time, status: r.status, specialist: db.staffById(r.employee_id)?.name })) };
  });
  return {
    booking_id: b.id, consultation_date: ev.start.slice(0, 10), consultant: db.staffById(ev.employee_id).name,
    child: { id: c.id, name: c.name, birth_date: c.birth_date, gender: c.gender },
    parent: { name: `${db.parent?.fname} ${db.parent?.lname}`, phone: db.parent?.phone },
    consultation_result: b.consultation_result, required, pending: required.filter((r) => !r.booked).length,
  };
}

/** أيام عمل الأخصائية للتقييم (النوع 1) خلال ثلاثة أسابيع: 9:00–14:00 في أيام العمل. */
function therapistDays(db: DB, userId: number) {
  const days: any[] = [];
  for (let n = 0; n <= 21; n++) {
    const d = addDays(today(), n);
    if ([5, 6].includes(d.getDay())) continue;
    days.push({ id: userId * 1000 + n, type: [1], start: `${ymd(d)} 09:00:00`, end: `${ymd(d)} 14:00:00` });
  }
  return days;
}

export const consultingRoutes = [
  route("GET", "api/calender/bookings", ({ db, query }) => {
    let rows = db.bookings;
    if (query.accepted !== undefined && query.accepted !== "") rows = rows.filter((b) => Number(b.accepted) === Number(query.accepted));
    if (query.status !== undefined && query.status !== "") rows = rows.filter((b) => Number(b.status) === Number(query.status));
    return { bookings: rows.map((b) => bookingBase(db, b).row) };
  }),
  route("GET", "api/calender/bookings/:id", ({ db, params }) => {
    const b = db.bookings.find((x) => x.id === Number(params.id));
    if (!b) throw new HttpError(404, { message: "Booking not found" });
    const { ev, c } = bookingBase(db, b);
    const s = db.staffById(ev.employee_id);
    const d = b.details ?? {};
    return { booking: { booking: {
      ...b, event_date: ev.start, child_name: c.name, child_birth_place: c.birth_place, child_birth_date: c.birth_date, child_lang: c.lang, child_gender: c.gender,
      child_nationalty: c.nationalty, child_national_id: c.national_id, child_address: c.address,
      requester_name: d.requester_name, requester_phone: d.requester_phone, relative_degree: d.relative_degree, addtional_phone: d.addtional_phone, addtional_phone_owner: d.addtional_phone_owner,
      addtional_phone_degree: d.addtional_phone_degree, conversion_type: d.conversion_type, child_aids: d.child_aids, doctor_code: b.doctor_code ?? null,
    }, doctor: { name: s.name, title: s.title, image: null, event_id: ev.id } } };
  }),
  route("POST", "api/calender/bookings/:id/accept", ({ db, params, body }) => {
    const b = db.bookings.find((x) => x.id === Number(params.id))!;
    b.accepted = Number(body.status); b.accepted_notes = body.accepted_notes ?? null;
    // الحقيقي: بريد للأهل بقبول الحجز وتعليمات الحضور.
    return { booking: { ...b }, message: "ok" };
  }),
  route("GET", "api/consultation-settings", () => ({ data: { id: 1, instructions: INSTRUCTIONS.male, instructions_wording: INSTRUCTIONS, recommendations: RECOMMENDATIONS } })),
  route("GET", "api/doctors", ({ db }) => ({ doctors: db.staff.filter((s) => s.type === 2).map((s) => ({ id: s.id, name: s.name, title: s.title, image: null })) })),
  route("POST", "api/booking/result", ({ db, body }) => {
    const b = db.bookings.find((x) => x.id === Number(body.booking_id))!;
    const before: number[] = (b.pre_evaluations?.pre_evalutions ?? []).map((x: any) => Number(x.id));
    b.consultation_result = body.consultation_result; b.status = 1;
    if (body.pre_evaluations) b.pre_evaluations = body.pre_evaluations;
    const added = ((b.pre_evaluations?.pre_evalutions ?? []) as any[]).map((x) => Number(x.id)).filter((t) => !before.includes(t));
    if (added.length) {
      const c = db.child(b.child_id)!;
      // EvaluationsRequired → لكل من يحمل «required evaluations list» (مدير البرامج).
      db.staff.filter((s) => s.perms.includes("required evaluations list")).forEach((s) => db.notifyStaff(s.id, {
        title: "تقييمات مطلوبة بحاجة إلى موعد", message: `${c.name}: ${added.map((t) => TYPE_NAMES[t]).join("، ")}`, url: "/sawa-admin/required-evaluations", type: "evaluations_required", booking_id: b.id,
      }));
    }
    return { message: "ok", status: 200 };
  }),

  // مدير البرامج.
  route("GET", "api/required-evaluations", ({ db, query }) => {
    const rows = db.bookings.filter((b) => b.pre_evaluations && b.accepted !== 0).map((b) => describeRequired(db, b));
    return { data: rows.filter((r) => (query.scope === "booked" ? r.pending === 0 : r.pending > 0)) };
  }),
  route("GET", "api/required-evaluations/:id", ({ db, params }) => ({ data: describeRequired(db, db.bookings.find((b) => b.id === Number(params.id))!) })),
  route("GET", "api/evaluation-type-ages", () => ({ data: [2, 3, 4, 5, 6, 7, 8, 101, 102, 103, 104, 105].map((type) => ({ type, from_months: type === 8 ? 16 : null, to_months: type === 8 ? 30 : null })) })),
  route("GET", "api/employees/get/with/:type", ({ db, params }) => {
    const type = Number(params.type);
    const users = db.staff.filter((s) => s.evaluationTypes?.includes(type));
    if (!users.length) throw new HttpError(404, { message: "Not found." });
    return { data: {
      employees: users.map((u) => ({ id: u.id, name: u.name, age_from_months: null, age_to_months: null })),
      days: users.map((u) => therapistDays(db, u.id)),
      booked: db.evaluationRequests.filter((r) => users.some((u) => u.id === r.employee_id) && r.start_time && r.status !== 3).map((r) => ({ id: r.id, date: r.date, start_time: r.start_time, end_time: r.end_time, title: r.title, color: r.color, evaluation_type: r.evaluation_type })),
    } };
  }),
  route("GET", "api/employees/get/with/calendar/:id", ({ db, params }) => {
    const id = Number(params.id);
    return { data: {
      id, name: db.staffById(id)?.name, days: therapistDays(db, id),
      booked: db.evaluationRequests.filter((r) => r.employee_id === id && r.start_time && r.status !== 3).map((r) => ({ id: r.id, child_id: r.child_id, date: r.date, start_time: r.start_time, end_time: r.end_time, title: r.title, notes: r.notes, color: r.color, evaluation_type: r.evaluation_type, child: { id: r.child_id, name: db.child(r.child_id)?.name } })),
      holidays: [],
    } };
  }),
  route("POST", "api/evaluation-request", ({ db, body }) => {
    const child = db.child(body.child_id)!;
    const booking = body.booking_id ? db.bookings.find((b) => b.id === Number(body.booking_id)) : null;
    const consultantId = booking ? db.events.find((e) => e.id === booking.event_id)!.employee_id : Number(body.consultant_id);
    const type = Number(body.evaluation_type);
    const r: any = { id: db.id(), booking_id: booking?.id ?? null, child_id: child.id, employee_id: Number(body.employee_id), consultant_id: consultantId, evaluation_type: type,
      title: TYPE_NAMES[type], date: body.date, start_time: body.start_time, end_time: body.end_time, notes: body.notes ?? null, color: body.color ?? "87ceeb", status: 0,
      billing_status: "free", billing_price: null, charge_id: null, created_at: db.now() };
    // «المحاسبة»: طفل بلا برنامج مثبَّت → تقييم مسعَّر ومقفل حتى يُدفع أو يؤكده المحاسب (تقييمات VB-MAPP تشترك في رسم واحد).
    const registered = db.programs.some((p) => p.student_id === child.id && p.accounting_status === "confirmed");
    const price = db.settings.evaluationPrices[type];
    if (!registered) {
      if (price == null) throw new HttpError(422, { message: "This evaluation has no price yet.", errors: { evaluation_type: ["closed"] } });
      const sibling = db.evaluationRequests.find((x) => x.child_id === child.id && [2, 3].includes(x.evaluation_type) && x.charge_id && [2, 3].includes(type));
      if (sibling) { r.charge_id = sibling.charge_id; r.billing_price = price; r.billing_status = sibling.billing_status === "paid" ? "paid" : "locked";
        const charge = db.charges.find((c) => c.id === sibling.charge_id)!; charge.lines.push({ key: "evaluation", type: "evaluation", evaluation_type: type, name: TYPE_NAMES[type], amount: price });
        charge.gross += price; charge.amount += price; charge.installments[0].amount += price; charge.description = "تقييم VB-MAPP"; }
      else { const charge = createCharge(db, { child_id: child.id, source: "evaluation", source_id: r.id, description: TYPE_NAMES[type], lines: [{ key: "evaluation", type: "evaluation", evaluation_type: type, name: TYPE_NAMES[type], amount: price }], gross: price, amount: price }, body.date);
        r.charge_id = charge.id; r.billing_price = price; r.billing_status = "locked"; }
    }
    db.evaluationRequests.push(r);
    const specialist = db.staffById(r.employee_id);
    // SpecialistAssigned → الأخصائية (قاعدة البيانات)، EvaluationBookedForChild → الأهل (قاعدة البيانات + بريد).
    db.notifyStaff(specialist.id, { title: "موعد تقييم جديد", message: `${TYPE_NAMES[type]} — ${child.name} · ${body.date} ${String(body.start_time).slice(0, 5)}`, url: "/my-evaluations", type: "specialist_assigned", request_id: r.id });
    db.notifyParent({ title: "تم تحديد موعد تقييم", message: `${TYPE_NAMES[type]} لـ${child.name} يوم ${body.date} الساعة ${String(body.start_time).slice(0, 5)} مع ${specialist.name}`, type: "evaluation_booked", request_id: r.id });
    return { data: { id: r.id, date: r.date, specialist: specialist.name, consultant: db.staffById(consultantId)?.name, child: child.name }, status: 201, message: "Evaluation Request created successfully" };
  }),
  route("DELETE", "api/evaluation-request/:id", ({ db, params }) => { db.evaluationRequests = db.evaluationRequests.filter((r) => r.id !== Number(params.id)); return { message: "ok" }; }),
  route("POST", "api/evaluation-request/:id/start", ({ db, params }) => {
    const r = db.evaluationRequests.find((x) => x.id === Number(params.id))!;
    if (["locked", "cancelled"].includes(r.billing_status)) throw new HttpError(422, { message: "This evaluation is closed until it is paid or the accounting confirms it.", data: { billing_status: r.billing_status } });
    if (r.status !== 2) r.status = 2;
    return { data: { id: r.id, status: r.status }, status: 200, message: "Evaluation started" };
  }),
];

export { at };
