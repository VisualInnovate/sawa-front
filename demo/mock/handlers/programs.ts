// برامج الطلاب: النموذج (الأوقات، المعالجون، التوزيع الآلي، التسعير)، الحفظ، العرض؛ وبرنامج الطفل للأهل.
import { HttpError, route } from "../backend";
import { addDays, today, type DB, ymd } from "../db";
import { createCharge } from "./accounting";

export const TREATMENTS = [{ id: 1, name: "تحليل السلوك التطبيقي (ABA)" }, { id: 2, name: "علاج النطق واللغة" }, { id: 3, name: "العلاج الوظيفي" }];
export const ROOMS = [{ id: 1, name: "قاعة الأمل 1", type: 1 }, { id: 2, name: "قاعة الأمل 2", type: 1 }, { id: 3, name: "عيادة النطق", type: 2 }];
/** «أوقات البرامج»: النهاري 8:00–13:00 الأحد–الخميس، العيادات 15:00–19:00، الدمج 8:00–12:00. */
export const HOURS = [0, 1, 2, 3, 4].flatMap((day) => [
  { program: "day", day, start: "08:00", end: "13:00" }, { program: "clinics", day, start: "15:00", end: "19:00" }, { program: "inclusion", day, start: "08:00", end: "12:00" },
]);
const SKILLS = [{ id: 1, name: "تحليل السلوك" }, { id: 2, name: "النطق" }, { id: 3, name: "التكامل الحسي" }];
const CRITERIA = ["least_vacancy", "consecutive", "early_start", "age_group", "skills", "program_therapist"].map((key) => ({ key, enabled: true }));
/** أسعار «رسوم البرامج» الشهرية للنهاري حسب عدد الجلسات الأسبوعية (كما في جدول الرسوم). */
const DAY_TIERS: Record<number, number> = { 5: 800, 10: 1200, 15: 1500, 20: 1800, 25: 2000 };

const hh = (h: number) => `${String(h).padStart(2, "0")}:00`;
const dayOf = (d: Date) => d.getDay();

/** تسعير شهر بشهر (ProgramPricing): سعر الباقة الشهري مقسوماً بأيام الشهر، والجلسات فوق 4 أسابيع مجانية. */
export function priceFor(kind: string, start: string, end: string, weekly: number, slots: any[]) {
  const s = new Date(`${start}T00:00:00`), e = new Date(`${end}T00:00:00`);
  const monthly = kind === "day" ? (DAY_TIERS[weekly] ?? Math.round(weekly * 100)) : kind === "clinics" ? weekly * 4 * 30 : 885;
  const lines: any[] = [];
  let cursor = new Date(s.getFullYear(), s.getMonth(), 1);
  while (cursor <= e) {
    const monthStart = new Date(Math.max(cursor.getTime(), s.getTime()));
    const monthEnd = new Date(Math.min(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getTime(), e.getTime()));
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const days = Math.round((monthEnd.getTime() - monthStart.getTime()) / 86400000) + 1;
    const fraction = days / daysInMonth;
    let sessions = 0;
    for (let d = new Date(monthStart); d <= monthEnd; d = addDays(d, 1)) sessions += slots.filter((x) => x.day === dayOf(d)).length;
    const paid = Math.min(sessions, weekly * 4);
    const price = Math.round(monthly * fraction * 100) / 100;
    lines.push({ month: `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`, from: ymd(monthStart), to: ymd(monthEnd), days, days_in_month: daysInMonth,
      monthly_price: monthly, sessions, paid_sessions: paid, free_sessions: sessions - paid, sessions_a_month: weekly * 4, before_discount: price, discount: 0, price });
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }
  const r = (n: number) => Math.round(n * 100) / 100;
  return { kind, lines, free_sessions: lines.reduce((a, l) => a + l.free_sessions, 0), before_discount: r(lines.reduce((a, l) => a + l.before_discount, 0)), discount: 0, total: r(lines.reduce((a, l) => a + l.price, 0)) };
}

const therapistOptions = (db: DB, kind: string) => db.staff.filter((s) => s.type === 2).map((s, i) => ({
  id: s.id, name: s.name, available: true, available_from: null, age_warning: false, vacancy: 6 + i * 4, skills_matched: 1, skills_needed: 1, recommended: i === 0,
}));

/** التوزيع الآلي (ProgramPlanner::distribute + schedule): الجلسات الفردية أولاً ثم الجماعية، من أول ساعة فارغة في كل يوم. */
function plan(db: DB, body: any) {
  const rows: any[] = [];
  (body.individual_rows ?? []).forEach((r: any, i: number) => { if (r.sessions > 0) rows.push({ key: `i${i}`, session_kind: "individual", treatment_id: Number(r.treatment_id), sessions: Number(r.sessions), treatment_name: TREATMENTS.find((t) => t.id === Number(r.treatment_id))?.name }); });
  if (Number(body.group_sessions) > 0) rows.push({ key: "group", session_kind: "group", treatment_id: null, sessions: Number(body.group_sessions), treatment_name: null });
  const days: number[] = [...(body.days ?? [])].map(Number).sort();
  const total = rows.reduce((a, r) => a + r.sessions, 0);
  if (total !== Number(body.weekly_sessions)) throw new HttpError(422, { message: `The individual and group sessions make ${total}, not the weekly ${body.weekly_sessions}.`, errors: { group_sessions: ["mismatch"] } });
  // الخطة: توزيع متساوٍ على الأيام، صف بعد صف.
  const counts: Record<number, Record<string, number>> = body.plan ?? {};
  if (!body.plan) {
    for (const d of days) counts[d] = {};
    for (const r of rows) for (let k = 0; k < r.sessions; k++) { const d = days[k % days.length]; counts[d][r.key] = (counts[d][r.key] ?? 0) + 1; }
  }
  const hours = HOURS.filter((h) => h.program === body.kind);
  const therapist = db.staffById(Number(body.therapist_id));
  const slots: any[] = [];
  for (const d of days) {
    const open = hours.find((h) => h.day === d);
    let hour = Number(open?.start.slice(0, 2) ?? 8);
    for (const r of rows) for (let k = 0; k < (counts[d]?.[r.key] ?? 0); k++) {
      const room = r.session_kind === "individual" && r.treatment_id === 2 ? ROOMS[2] : ROOMS[(slots.length) % 2];
      slots.push({ day: d, start: hh(hour), end: hh(hour + 1), session_kind: r.session_kind, treatment_id: r.treatment_id, treatment_name: r.treatment_name,
        room_id: room.id, room_name: room.name, therapist_id: therapist.id, therapist_name: therapist.name, available: true, available_from: null, reason: null, room_age_warning: false, therapist_age_warning: false });
      hour++;
    }
  }
  if (body.slots) for (const s of body.slots) { const i = slots.findIndex((x) => x.day === s.day && x.start === s.start); if (i >= 0) { const room = ROOMS.find((x) => x.id === Number(s.room_id)); if (room) { slots[i].room_id = room.id; slots[i].room_name = room.name; } } }
  return { rows, plan: counts, slots, price: priceFor(body.kind, body.start_date, body.end_date, Number(body.weekly_sessions), slots), complete: true };
}

/** تفاصيل البرنامج كما يرجعها StudentProgramPlanService::details (وتقرؤها بوابة الأهل أيضاً). */
export function details(db: DB, p: any) {
  const child = db.child(p.student_id)!;
  const therapist = db.staffById(p.therapist_id);
  const charge = db.charges.find((c) => c.program_id === p.id);
  const paid = charge ? charge.installments.reduce((a: number, i: any) => a + i.paid_amount, 0) : 0;
  const now = db.now();
  const sessions = db.sessions.filter((s) => s.student_program_id === p.id);
  return {
    ...p, student: { id: child.id, name: child.name }, therapist: { id: therapist.id, name: therapist.name },
    student_program_details: p.rows.map((r: any, i: number) => ({ id: i + 1, treatment_id: r.treatment_id, sessions: r.sessions, session_kind: r.session_kind, treatment: r.treatment_id ? TREATMENTS.find((t) => t.id === r.treatment_id) : null })),
    charge: charge ? { id: charge.id, amount: charge.amount, paid, remaining: Math.round((charge.amount - paid) * 100) / 100, status: charge.status, late: 0 } : null,
    week: p.slots.map((s: any) => ({ ...s, room: { id: s.room_id, name: s.room_name }, therapist: { id: s.therapist_id, name: s.therapist_name }, treatment: s.treatment_id ? TREATMENTS.find((t) => t.id === s.treatment_id) : null })),
    sessions_count: sessions.length,
    next_session: sessions.filter((s) => s.starts_at >= now).sort((a, b) => a.starts_at.localeCompare(b.starts_at))[0] ?? null,
    plan_goals: [],
  };
}

/** يحفظ البرنامج ويولّد جلساته ورسمه بأقساط شهرية (ProgramBilling): مبدئي حتى يثبّته المحاسب خلال يومين. */
export function saveProgram(db: DB, body: any) {
  const preview = plan(db, body);
  const p: any = { id: db.id(), student_id: Number(body.child_id), kind: body.kind, therapist_id: Number(body.therapist_id), start_date: body.start_date, end_date: body.end_date,
    weekly_sessions: Number(body.weekly_sessions), days: [...new Set(preview.slots.map((s) => s.day))].sort(), inclusion_type: null, inclusion_english: false, inclusion_hours: null,
    price: preview.price.total, price_details: preview.price, scheduling: body.scheduling ?? {}, status: 1, accounting_status: "tentative",
    tentative_until: `${ymd(addDays(today(), 2))} ${db.now().slice(11)}`, confirmed_at: null, sessions_suspended_at: null, stopped_at: null, created_at: db.now(),
    rows: preview.rows, slots: preview.slots, name: body.kind === "day" ? "نهاري (الصفوف)" : body.kind };
  db.programs.push(p);
  const start = new Date(`${p.start_date}T00:00:00`), end = new Date(`${p.end_date}T00:00:00`);
  for (let d = new Date(start); d <= end; d = addDays(d, 1)) for (const s of preview.slots.filter((x) => x.day === dayOf(d))) {
    db.sessions.push({ id: db.id(), student_program_id: p.id, slot_day: s.day, child_id: p.student_id, therapist_id: s.therapist_id, room_id: s.room_id, room: s.room_name, treatment_id: s.treatment_id,
      treatment: s.treatment_name, session_kind: s.session_kind, starts_at: `${ymd(d)} ${s.start}:00`, ends_at: `${ymd(d)} ${s.end}:00`, started_at: null, ended_at: null, status: "closed", workspace: null, break_schedule: null, preference_tests: [] });
  }
  // الرسم: شهر بشهر، كل شهر قسط يستحق في يوم بداية البرنامج من ذلك الشهر.
  const months = preview.price.lines.map((l, i) => ({ month: l.month, from: l.from, to: l.to, due_date: i === 0 ? p.start_date : `${l.month}-${String(Math.min(start.getDate(), l.days_in_month)).padStart(2, "0")}`, parts: { program: l.price }, sessions: l.sessions, paid_sessions: l.paid_sessions, free_sessions: l.free_sessions }));
  const charge = createCharge(db, { child_id: p.student_id, source: "program", source_id: p.id, program_id: p.id, description: "برنامج نهاري", lines: [{ key: "program", type: "program", amount: p.price }], gross: p.price, amount: p.price }, p.start_date);
  charge.months = months; charge.discount_type = null; charge.discount_value = 0; charge.discount_reason = null; charge.discount_months = null;
  charge.installments = months.filter((m) => m.parts.program > 0).map((m) => ({ id: db.id(), charge_id: charge.id, description: `شهر ${m.month}`, due_date: m.due_date, base: m.parts.program, discount: 0, amount: m.parts.program, paid_amount: 0, status: "open" }));
  return p;
}

export const programRoutes = [
  route("GET", "api/treatment/all", () => ({ data: TREATMENTS })),
  route("GET", "api/student-program/hours", () => ({ data: HOURS, criteria: CRITERIA, skills: SKILLS })),
  route("GET", "api/student-program/child/:id/skills", () => ({ data: [1] })),
  route("POST", "api/student-program/therapists", ({ db, body }) => ({ data: therapistOptions(db, body.kind) })),
  route("POST", "api/student-program/preview", ({ db, body }) => ({ data: plan(db, body) })),
  route("POST", "api/student-program/room-options", ({ db, body }) => ({ data: ROOMS.map((r) => ({ room_id: r.id, room_name: r.name, room_type: r.type, therapist_id: Number(body.slot_therapist_id), therapist_name: db.staffById(Number(body.slot_therapist_id))?.name, source: "program", available: true, available_from: null, reason: null })) })),
  route("POST", "api/student-program", ({ db, body }) => ({ data: details(db, saveProgram(db, body)) })),
  route("GET", "api/student-program/logs", () => ({ data: [] })),
  route("GET", "api/student-program", ({ db }) => ({ data: db.programs.map((p) => details(db, p)) })),
  route("GET", "api/student-program/:id/logs", () => ({ data: [] })),
  route("GET", "api/student-program/:id", ({ db, params }) => { const p = db.programs.find((x) => x.id === Number(params.id)); if (!p) throw new HttpError(404, {}); return { data: details(db, p) }; }),
];
