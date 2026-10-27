// بوابة الأهل: التسجيل، الصفحة الرئيسة، إضافة طفل، حجز الاستشارة، ملف الطفل.
import { HttpError, route, type Ctx } from "../backend";
import { ageMonths, type DB } from "../db";
import { scenario } from "../../scenario";
import { statementOf } from "./accounting";
import { details } from "./programs";

const parentResource = (p: Record<string, any>) => ({
  parent_id: p.id, fname: p.fname, lname: p.lname, email: p.email ?? null, phone: p.phone, image: null,
  roles: [], "roles.permissions": [], permissions: ["child create", "child edit", "child list"],
});

const needParent = (db: DB) => { if (!db.parent) throw new HttpError(401, { message: "Unauthenticated." }); return db.parent; };

/** الأسبوع القادم للطفل كما يبنيه StaffSchedule: الجلسات والتقييمات والاستشارات. */
export function childUpcoming(db: DB, childId: number, days: number) {
  const now = db.now();
  const limit = new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
  const items: any[] = [];
  for (const b of db.bookings.filter((x) => x.child_id === childId && x.accepted !== 0)) {
    const ev = db.events.find((e) => e.id === b.event_id)!;
    items.push({ key: `c${b.id}`, type: "consultation", date: ev.start.slice(0, 10), start: ev.start.slice(11, 16), end: ev.end.slice(11, 16), staff: db.staffById(ev.employee_id).name, room: null, status: null });
  }
  for (const r of db.evaluationRequests.filter((x) => x.child_id === childId && x.status !== 3 && x.start_time)) {
    items.push({ key: `e${r.id}`, type: "evaluation", title: TYPE_NAMES[r.evaluation_type] ?? "", date: r.date, start: r.start_time.slice(0, 5), end: r.end_time?.slice(0, 5), staff: db.staffById(r.employee_id)?.name, room: null, status: null });
  }
  for (const s of db.sessions.filter((x) => x.child_id === childId)) {
    items.push({ key: `s${s.id}`, type: "session", treatment: s.treatment, date: s.starts_at.slice(0, 10), start: s.starts_at.slice(11, 16), end: s.ends_at.slice(11, 16), staff: db.staffById(s.therapist_id)?.name, room: s.room, status: s.status });
  }
  return items
    .filter((i) => `${i.date} ${i.end ?? "23:59"}` >= now && i.date <= limit && i.status !== "missed")
    .sort((a, b) => `${a.date} ${a.start}`.localeCompare(`${b.date} ${b.start}`));
}

export const TYPE_NAMES: Record<number, string> = { 1: "تقييم الصورة الجانبية", 2: "المراحل (Milestones)", 3: "تقييم العوائق", 4: "ABLLS Academy", 5: "تقييم كارولينا", 6: "تقييم الانتقال (Transition)", 7: "Ablls OT", 8: "قائمة التوحد M-CHAT-R" };

function home({ db }: Ctx) {
  const parent = needParent(db);
  const children = db.children.filter((c) => c.parent_id === parent.id);
  const totals = children.map((c) => statementOf(db, c.id).totals);
  const sum = (k: string) => Math.round(totals.reduce((a, t) => a + Number(t[k] ?? 0), 0) * 100) / 100;
  return {
    parent: { name: `${parent.fname} ${parent.lname}`, fname: parent.fname, image: null },
    children: children.map((c) => ({ ...db.childCard(c), upcoming: childUpcoming(db, c.id, 7).slice(0, 4) })),
    pending: {
      generalizations: db.generalizations.filter((g) => g.type === "home" && g.status === "pending" && children.some((c) => c.id === g.child_id)).length,
      consultations_waiting: db.bookings.filter((b) => (b.accepted === null || b.accepted === -1) && children.some((c) => c.id === b.child_id)).length,
      evaluations_waiting: db.evaluations.filter((e) => e.status === 1 && e.approval_status !== "approved" && children.some((c) => c.id === e.child_id)).length,
    },
    finance: { owed: sum("owed"), paid: sum("paid"), remaining: sum("remaining"), late: sum("late"), currency: db.settings.currency },
    notifications: { unread: db.notifications.parent.filter((n) => !n.read_at).length, latest: db.notifications.parent.slice(0, 5) },
    now: db.now(),
  };
}

/** صفوف الحجوزات كما يرجعها getAllAcceptedBookingDoctors للأهل. */
export function parentBookingRows(db: DB, filter?: (b: any) => boolean) {
  return db.bookings.filter(filter ?? (() => true)).map((b) => {
    const ev = db.events.find((e) => e.id === b.event_id)!;
    const c = db.child(b.child_id)!;
    const s = db.staffById(ev.employee_id);
    return {
      booking_id: b.id, accepted_notes: b.accepted_notes ?? null, result: b.consultation_result ? JSON.stringify(b.consultation_result) : null,
      user_id: b.user_id, event_id: b.event_id, status: b.status, child_id: b.child_id, accepted: b.accepted,
      event_calendar_start_date: ev.start.slice(0, 10), event_calendar_start_time: ev.start.slice(11), event_date: ev.start,
      user_name: s.name, user_title: s.title, child_name: c.name, child_gender: c.gender, user_image: null,
      consultation_result: b.consultation_result ?? null,
      consultation_settings: b.accepted === 1 ? INSTRUCTIONS[c.gender === "1" ? "female" : "male"].replace(/\{\{name\}\}/g, c.name) : "",
      billing_status: b.billing_status ?? "free", price: null,
    };
  });
}

export const INSTRUCTIONS = {
  male: "نرجو الحضور قبل الموعد بعشر دقائق، وإحضار أي تقارير طبية أو تعليمية سابقة للطفل {{name}}. مدة الاستشارة ساعة واحدة بحضور أحد الوالدين.",
  female: "نرجو الحضور قبل الموعد بعشر دقائق، وإحضار أي تقارير طبية أو تعليمية سابقة للطفلة {{name}}. مدة الاستشارة ساعة واحدة بحضور أحد الوالدين.",
};

export const parentRoutes = [
  route("POST", "api/parent/register", ({ db, body }) => {
    db.parent = { id: 1, fname: body.fname, lname: body.lname, phone: body.phone, email: body.email ?? null };
    return { token: "demo-parent-token", user: parentResource(db.parent) };
  }),
  route("POST", "api/parent/login", ({ db }) => ({ token: "demo-parent-token", user: parentResource(needParent(db)) })),
  route("POST", "api/parent/logout", () => ({ message: "ok" })),
  route("GET", "api/parent/user", ({ db }) => ({ user: parentResource(needParent(db)) })),
  route("GET", "api/parent/home", home),
  route("GET", "api/parent/pending-counts", ({ db }) => ({ data: { generalizations: db.generalizations.filter((g) => g.type === "home" && g.status === "pending").length } })),
  route("GET", "api/parent/notification", ({ db }) => ({ notifications: db.notifications.parent })),
  route("POST", "api/parent/child/create", ({ db, body }) => {
    const parent = needParent(db);
    const child = { id: db.id(), parent_id: parent.id, name: body.name, birth_date: body.birth_date, birth_place: body.birth_place, address: body.address,
      national_id: body.national_id, gender: String(body.gender), nationalty: body.nationalty, lang: body.lang, created_at: db.now() };
    db.children.push(child);
    return { child, message: "success stored children", status: 200 };
  }),
  route("GET", "api/child/:id/check-active-booking", ({ db, params }) => ({ active: db.bookings.some((b) => b.child_id === Number(params.id) && b.accepted === 1) })),

  // حجز الاستشارة.
  route("GET", "api/event-calendar/get/front", ({ db }) => {
    const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const free = db.events.filter((e) => !db.bookings.some((b) => b.event_id === e.id));
    const result: Record<string, any> = {};
    for (const name of names) {
      const days = [...new Set(free.filter((e) => names[e.startAt.getDay()] === name).map((e) => e.start.slice(0, 10)))];
      result[name] = days.length ? days.map((start) => ({ title: "استشارة", start })) : null;
    }
    return { data: result, status: 200, message: "ok" };
  }),
  route("GET", "api/event-calendar/get/:date/slots", ({ db, params }) => {
    const slots = db.events.filter((e) => e.start.slice(0, 10) === params.date && !db.bookings.some((b) => b.event_id === e.id))
      .map((e) => ({ id: e.id, employee_id: e.employee_id, title: e.title, start: e.start.slice(11, 16), end: e.end.slice(11, 16) }));
    if (!slots.length) throw new HttpError(404, { message: "No slots found" });
    return { data: slots };
  }),
  route("GET", "api/event-calendar/front/slot/:id", ({ db, params }) => {
    const e = db.events.find((x) => x.id === Number(params.id));
    if (!e) throw new HttpError(404, { message: "No slot found" });
    return { data: { id: e.id, title: e.title, start: e.start, end: e.end } };
  }),
  route("POST", "api/calender/store-booking", ({ db, body }) => {
    const parent = needParent(db);
    const booking = { id: db.id(), user_id: parent.id, event_id: Number(body.event_id), child_id: Number(body.child_id), details: body.details ?? {},
      accepted: -1, status: -1, accepted_notes: null, consultation_result: null, pre_evaluations: null, billing_status: "free", created_at: db.now() };
    db.bookings.push(booking);
    // الحقيقي: بريد تأكيد للأهل وللمستشارة؛ المستشارة ترى الحجز في صفحتها.
    return { booking, message: "success stored booking and email sent", status: 200 };
  }),
  route("GET", "api/calender/appointments", ({ db }) => ({ bookings: parentBookingRows(db) })),
  route("DELETE", "api/calender/appointments/:id", ({ db, params }) => { db.bookings = db.bookings.filter((b) => b.id !== Number(params.id)); return { message: "ok" }; }),

  // ملف الطفل في البوابة.
  route("GET", "api/parent/child/:id/portal/overview", ({ db, params }) => {
    const c = db.child(params.id); if (!c) throw new HttpError(404, {});
    return { child: db.childCard(c), finance: { ...statementOf(db, c.id).totals, currency: db.settings.currency }, upcoming: childUpcoming(db, c.id, 14).slice(0, 8), home_mchat: null, now: db.now() };
  }),
  route("GET", "api/parent/child/:id/portal/consultations", ({ db, params }) => ({ bookings: parentBookingRows(db, (b) => b.child_id === Number(params.id)) })),
  route("GET", "api/parent/child/:id/portal/evaluations", ({ db, params }) => {
    const id = Number(params.id);
    return {
      child: db.childCard(db.child(id)!),
      items: db.evaluations.filter((e) => e.child_id === id && e.status === 1).map((e) => ({ key: `e${e.id}`, id: e.id, type: e.type, name: TYPE_NAMES[e.type], title: e.title, date: e.date, approval: e.approval_status ?? "pending", specialist: db.staffById(e.specialist_id)?.name })),
      requests: db.evaluationRequests.filter((r) => r.child_id === id).map((r) => ({ id: r.id, type: r.evaluation_type, name: TYPE_NAMES[r.evaluation_type], title: null, date: r.date, start: r.start_time, end: r.end_time, status: String(r.status), cancelled: false, billing_status: r.billing_status, price: r.billing_price, specialist: db.staffById(r.employee_id)?.name })),
    };
  }),
  // الخطة والأهداف كما يبنيها ParentPortalController::plan: أهداف التراكنج المعتمد، وخطط التقييمات المعتمدة فقط.
  route("GET", "api/parent/child/:id/portal/plan", ({ db, params }) => {
    const id = Number(params.id);
    const mine = db.trackings.filter((t) => t.child_id === id);
    const tracking = [...mine].reverse().find((t) => t.status === "approved");
    const pending = [...mine].reverse().find((t) => t.status === "pending");
    const allGoals = db.reportPlans.filter((p) => p.child_id === id).flatMap((p) => p.goals);
    const current = tracking ? portalGoals(db, allGoals.filter((g: any) => (tracking.goal_ids as number[]).includes(g.id))) : [];
    const plans = [...db.reportPlans].filter((p) => p.child_id === id).reverse().flatMap((p) => {
      const e = db.evaluations.find((x) => x.id === p.evaluation_id);
      if (!e || e.approval_status !== "approved") return [];
      return [{ id: p.id, evaluation_id: p.evaluation_id, evaluation: { title: e.title, date: e.date, name: TYPE_NAMES[e.type] }, updated_at: String(p.updated_at).slice(0, 10),
        goals: portalGoals(db, p.goals.filter((g: any) => !(p.hidden ?? []).includes(g.id))) }];
    });
    return {
      tracking: tracking ? { id: tracking.id, status: tracking.status, approver: tracking.approved_by ? db.staffById(tracking.approved_by)?.name : null, decided_at: tracking.decided_at ? String(tracking.decided_at).slice(0, 10) : null, goals_count: tracking.goal_ids.length } : null,
      pending_tracking: pending ? { id: pending.id, requested_at: String(pending.requested_at).slice(0, 10) } : null,
      current, plans,
    };
  }),
  route("GET", "api/parent/child/:id/portal/finance", ({ db, params }) => {
    const s = statementOf(db, Number(params.id));
    return { charges: s.charges, payments: s.payments, credits: [], totals: s.totals, currency: db.settings.currency };
  }),
  route("GET", "api/parent/child/:id/portal/programs", ({ db, params }) => {
    const id = Number(params.id);
    const now = db.now();
    const rows = db.sessions.filter((s) => s.child_id === id);
    return {
      programs: db.programs.filter((p) => p.student_id === id).map((p) => programPlan(db, p)),
      sessions: {
        upcoming: rows.filter((s) => s.starts_at >= now).sort((a, b) => a.starts_at.localeCompare(b.starts_at)).slice(0, 12).map((s) => db.sessionRow(s)),
        recent: rows.filter((s) => s.starts_at < now).sort((a, b) => b.starts_at.localeCompare(a.starts_at)).slice(0, 12).map((s) => db.sessionRow(s)),
      },
    };
  }),
  route("GET", "api/parent/programs", ({ db }) => ({ data: db.children.map((c) => ({ child: db.childCard(c), programs: db.programs.filter((p) => p.student_id === c.id).map((p) => programPlan(db, p)) })) })),
  route("GET", "api/parent/goal-generalizations", ({ db }) => ({ data: db.generalizations.filter((g) => g.type === "home").map((g) => generalizationRow(db, g)) })),
  route("POST", "api/parent/goal-generalizations/:id/decide", ({ db, params, body }) => {
    const g = db.generalizations.find((x) => x.id === Number(params.id))!;
    g.status = body.approved ? "approved" : "rejected"; g.note = body.note ?? null; g.decided_at = db.now();
    return { data: generalizationRow(db, g) };
  }),
  route("GET", "api/parent/schedule", ({ db }) => ({ data: { items: db.children.flatMap((c) => childUpcoming(db, c.id, 14).map((i) => ({ ...i, child: c.name }))) } })),
];

/** برنامج الطفل كما يعرضه StudentProgramPlanController::forChild (ما تقرأه بوابة الأهل). */
export function programPlan(db: DB, p: any) {
  return { ...details(db, p), plan_goals: [] };
}

/** الهدف كما تقرؤه بوابة الأهل (ParentPortalController::goals): الرمز المرقّم، المحاولات، التعميمات. */
function portalGoals(db: DB, goals: any[]) {
  const counts: Record<string, number> = {};
  return goals.map((g) => {
    const k = String(g.general_goal_id ?? g.symbol ?? ""); counts[k] = (counts[k] ?? 0) + 1;
    const attempts = [...(g.attempts ?? [])].sort((a: any, b: any) => String(a.date).localeCompare(String(b.date))).map((a: any) => ({ date: String(a.date).slice(0, 10), achieved: !!a.achieved }));
    const done = attempts.filter((a) => a.achieved).length;
    return {
      id: g.id, code: `${g.symbol ?? ""}-${counts[k]}`.replace(/^-|-$/g, ""), domain: g.domain, domain_symbol: g.domain_symbol, general_goal: g.general_goal, goal: g.goal, weakness: g.weakness,
      achieved_at: g.achieved_at ?? null, prop_start: g.prop_start ?? null, attempts,
      progress: { done, total: attempts.length, percent: attempts.length ? Math.round((done * 100) / attempts.length) : 0 },
      generalizations: db.generalizations.filter((x) => x.goal_id === g.id).map((x) => ({ id: x.id, type: x.type, status: x.status, note: x.note ?? null, recipient: x.recipient_id ? db.staffById(x.recipient_id)?.name : null, created_at: String(x.created_at).slice(0, 10), decided_at: x.decided_at ? String(x.decided_at).slice(0, 10) : null })),
    };
  });
}

export function generalizationRow(db: DB, g: any) {
  const goal = db.reportPlans.flatMap((p) => p.goals).find((x: any) => x.id === g.goal_id);
  const c = db.child(g.child_id)!;
  return {
    id: g.id, type: g.type, status: g.status, note: g.note ?? null, created_at: g.created_at, decided_at: g.decided_at ?? null,
    child: { id: c.id, name: c.name }, goal: goal ? { id: goal.id, code: goal.code, goal: goal.goal, domain: goal.domain, general_goal: goal.general_goal } : null,
    therapist: db.staffById(g.therapist_id)?.name, recipient: null, session_id: g.session_id ?? null,
  };
}

export { ageMonths, scenario };
