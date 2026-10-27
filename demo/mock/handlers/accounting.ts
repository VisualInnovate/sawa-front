// «المحاسبة»: الرسوم وأقساطها وسندات القبض وكشف الحساب، كما يحسبها AccountingService.
import { HttpError, route, type Ctx } from "../backend";
import type { DB } from "../db";
import { TYPE_NAMES } from "./parent";

/** حالة القسط كما في النموذج الحقيقي: status = open|paid|cancelled، وstate = paid|late|due|upcoming|cancelled. */
export function installmentState(db: DB, i: any) {
  if (i.status === "cancelled") return "cancelled";
  if (i.paid_amount >= i.amount - 0.001) return "paid";
  const today = db.now().slice(0, 10);
  if (i.due_date < today) return "late";
  if (i.due_date === today) return "due";
  return "upcoming";
}

export function chargeRow(db: DB, c: any) {
  const installments = c.installments.map((i: any) => {
    const state = installmentState(db, i);
    return { ...i, status: state === "paid" ? "paid" : i.status, state, remaining: Math.round((i.amount - i.paid_amount) * 100) / 100 };
  });
  const paid = installments.reduce((a: number, i: any) => a + i.paid_amount, 0);
  const late = installments.filter((i: any) => i.state === "late").reduce((a: number, i: any) => a + i.remaining, 0);
  return {
    id: c.id, child_id: c.child_id, child: db.child(c.child_id) ? { id: c.child_id, name: db.child(c.child_id)!.name } : null, source: c.source, source_id: c.source_id ?? null,
    description: c.description, lines: c.lines, gross: c.gross, discount: c.discount ?? 0, discount_note: c.discount_note ?? null, amount: c.amount,
    paid: Math.round(paid * 100) / 100, remaining: Math.round((c.amount - paid) * 100) / 100, late: Math.round(late * 100) / 100,
    next_installment: installments.find((i: any) => i.status === "open") ?? null,
    status: c.status, created_at: c.created_at, currency: db.settings.currency, installments,
    months: c.months ?? null, discount_type: c.discount_type ?? null, discount_value: c.discount_value ?? 0, discount_reason: c.discount_reason ?? null, discount_months: c.discount_months ?? null,
    discount_target: "total", pending_gross: null, pending_lines: null, pending_months: null,
    program_id: c.program_id ?? null, program: c.program_id ? programBrief(db, c.program_id) : null, fee_type: null, cancelled_at: null, cancel_reason: null,
  };
}

const programBrief = (db: DB, id: number) => { const p = db.programs.find((x) => x.id === id); return p ? { id: p.id, kind: p.kind, inclusion_type: p.inclusion_type ?? null, inclusion_english: !!p.inclusion_english, start_date: p.start_date, end_date: p.end_date, accounting_status: p.accounting_status } : null; };

/** صف البرنامج في «تثبيت البرامج» (AccountingProgramController::row). */
export function programAccountRow(db: DB, p: any) {
  const charge = db.charges.find((c) => c.program_id === p.id);
  return { id: p.id, student_id: p.student_id, kind: p.kind, therapist_id: p.therapist_id, weekly_sessions: p.weekly_sessions, inclusion_type: p.inclusion_type ?? null, inclusion_english: !!p.inclusion_english,
    price: p.price, accounting_status: p.accounting_status, tentative_until: p.tentative_until ?? null, confirmed_at: p.confirmed_at ?? null, sessions_suspended_at: null, stopped_at: null, created_at: p.created_at,
    start_date: p.start_date, end_date: p.end_date, student: { id: p.student_id, name: db.child(p.student_id)?.name }, therapist: { id: p.therapist_id, name: db.staffById(p.therapist_id)?.name },
    charge: charge ? chargeRow(db, charge) : null };
}

/** خطة الأقساط (AccountingService::savePlan): الأقساط المفتوحة تُستبدل بالصفوف المرسلة. */
function savePlan(db: DB, charge: any, body: any) {
  if (body.discount_type !== undefined) {
    charge.discount_type = body.discount_type ?? null; charge.discount_value = Number(body.discount_value ?? 0); charge.discount_reason = body.discount_reason ?? null; charge.discount_months = body.discount_months ?? null;
  }
  // الصفوف إمّا {due_date, base, discounted} (قبل أي دفع: يُحسب المبلغ من الأساس والخصم) أو {due_date, amount}.
  const rows = (body.installments ?? []).map((r: any) => {
    const base = Number(r.base ?? r.amount ?? 0);
    const discount = r.amount != null && r.base == null ? Number(r.discount ?? 0) : (r.discounted || charge.discount_type) && charge.discount_type ? (charge.discount_type === "percent" ? Math.round(base * Math.min(100, charge.discount_value) ) / 100 : Math.min(base, charge.discount_value)) : 0;
    const amount = r.amount != null && r.base == null ? Number(r.amount) : Math.round((base - discount) * 100) / 100;
    return { id: db.id(), charge_id: charge.id, description: r.month ? `شهر ${r.month}` : charge.description, due_date: r.due_date, base, discount, amount, paid_amount: 0, status: "open" };
  });
  charge.installments = [...charge.installments.filter((i: any) => i.status === "paid"), ...rows];
  charge.discount = rows.reduce((a: number, r: any) => a + (r.discount ?? 0), 0);
  charge.amount = Math.round((charge.gross - charge.discount) * 100) / 100;
}

export function statementOf(db: DB, childId: number) {
  const charges = db.charges.filter((c) => c.child_id === childId && c.status !== "cancelled").map((c) => chargeRow(db, c));
  const payments = db.payments.filter((p) => p.child_id === childId).map((p) => paymentRow(db, p));
  const owed = charges.reduce((a, c) => a + c.amount, 0);
  const paid = charges.reduce((a, c) => a + c.paid, 0);
  const late = charges.reduce((a, c) => a + c.late, 0);
  const r = (n: number) => Math.round(n * 100) / 100;
  return { charges, payments, credits: [], totals: { owed: r(owed), paid: r(paid), remaining: r(owed - paid), late: r(late), balance: 0, pending_credits: 0 } };
}

export function paymentRow(db: DB, p: any) {
  return {
    id: p.id, receipt_no: p.receipt_no, child_id: p.child_id, child: { id: p.child_id, name: db.child(p.child_id)?.name }, amount: p.amount, method: p.method,
    reference: p.reference ?? null, paid_on: p.paid_on, notes: p.notes ?? null, currency: db.settings.currency, cancelled_at: null, cancel_reason: null,
    created_by: db.staffById(p.created_by)?.name ?? null, creator: { id: p.created_by, name: db.staffById(p.created_by)?.name }, created_at: p.created_at, balance_after: 0,
    installments: p.installments.map((x: any) => ({ id: x.id, charge_id: x.charge_id, amount: x.amount, description: x.description, due_date: x.due_date, pivot: { amount: x.amount }, charge: x.charge ?? null })),
  };
}

/** رسم جديد (الاستشارة/التقييم/البرنامج) بقسط واحد مستحق يوم الموعد. */
export function createCharge(db: DB, data: any, dueDate: string) {
  const charge = { id: db.id(), child_id: data.child_id, source: data.source, source_id: data.source_id ?? null, program_id: data.program_id ?? null, description: data.description,
    lines: data.lines, gross: data.gross, discount: 0, amount: data.amount, status: "open", created_at: db.now(),
    installments: [{ id: db.id(), charge_id: 0, description: data.description, due_date: dueDate, amount: data.amount, paid_amount: 0, status: "open" }] };
  charge.installments[0].charge_id = charge.id;
  db.charges.push(charge);
  return charge;
}

/** سند قبض (AccountingService::pay): أقساط كاملة تُدفع، ودفع أول قسط يثبّت البرنامج المبدئي. */
export function pay(db: DB, body: any) {
    const ids = (body.installment_ids ?? []).map(Number);
    const rows = db.charges.flatMap((c) => c.installments.filter((i: any) => ids.includes(i.id)).map((i: any) => ({ i, c })));
    if (!rows.length) throw new HttpError(422, { message: "no installments" });
    const amount = Math.round(rows.reduce((a, r) => a + r.i.amount, 0) * 100) / 100;
    const payment = { id: db.id(), receipt_no: db.payments.length + 1, child_id: Number(body.child_id), amount, method: body.method, reference: body.reference ?? null, paid_on: body.paid_on ?? db.now().slice(0, 10), notes: body.notes ?? null,
      currency: db.settings.currency, created_by: db.currentStaffId, created_at: db.now(), installments: rows.map((r) => ({ id: r.i.id, charge_id: r.c.id, amount: r.i.amount, description: r.i.description, due_date: r.i.due_date, pivot: { amount: r.i.amount }, charge: chargeRow(db, r.c) })) };
    for (const r of rows) { r.i.paid_amount = r.i.amount; r.i.status = "paid"; r.i.paid_at = db.now(); r.i.payment_id = payment.id; }
    for (const c of new Set(rows.map((r) => r.c))) {
      if (c.installments.every((i: any) => i.status === "paid")) { c.status = "paid"; db.evaluationRequests.filter((r) => r.charge_id === c.id && r.billing_status === "locked").forEach((r) => (r.billing_status = "paid")); }
      const p = c.program_id ? db.programs.find((x) => x.id === c.program_id) : null;
      if (p && p.accounting_status === "tentative") { p.accounting_status = "confirmed"; p.tentative_until = null; p.confirmed_at = db.now(); }
    }
    db.payments.push(payment);
    // الحقيقي: لا إشعار للأهل؛ السند يظهر في كشف الحساب على البوابة.
    return payment;
}

export const accountingRoutes = [
  route("GET", "api/accounting/settings", ({ db }) => ({ data: { currency_symbol: db.settings.currency, currency_name: "ريال", consultation_paid: "0", consultation_price: "0", fee_types: [] } })),
  route("GET", "api/accounting/summary", ({ db }) => {
    const all = db.children.map((c) => statementOf(db, c.id).totals);
    const sum = (k: string) => all.reduce((a, t) => a + Number(t[k] ?? 0), 0);
    return { data: { owed: sum("owed"), paid: sum("paid"), remaining: sum("remaining"), late: sum("late"), currency: db.settings.currency,
      programs: { tentative: db.programs.filter((p) => p.accounting_status === "tentative").length, confirmed: db.programs.filter((p) => p.accounting_status === "confirmed").length, unconfirmed: 0 },
      evaluations_locked: db.evaluationRequests.filter((r) => r.billing_status === "locked").length, credits_pending: 0, payments_today: db.payments.filter((p) => p.paid_on === db.now().slice(0, 10)).length } };
  }),
  route("GET", "api/accounting/evaluations", ({ db, query }) => ({ data: db.evaluationRequests.filter((r) => r.billing_status === (query.status ?? "locked")).map((r) => ({
    id: r.id, child_id: r.child_id, employee_id: r.employee_id, evaluation_type: r.evaluation_type, date: r.date, start_time: r.start_time, end_time: r.end_time, status: String(r.status),
    billing_status: r.billing_status, billing_price: r.billing_price, charge_id: r.charge_id, created_at: r.created_at,
    child: { id: r.child_id, name: db.child(r.child_id)?.name }, specialist: { id: r.employee_id, name: db.staffById(r.employee_id)?.name },
    charge: r.charge_id ? chargeRow(db, db.charges.find((c) => c.id === r.charge_id)) : null,
  })) })),
  route("GET", "api/accounting/consultations", () => ({ data: [] })),
  route("POST", "api/accounting/evaluations/:id/confirm", ({ db, params }) => {
    const r = db.evaluationRequests.find((x) => x.id === Number(params.id));
    if (!r || r.billing_status !== "locked") throw new HttpError(422, { message: "Only an evaluation waiting for its payment can be confirmed." });
    r.billing_status = "confirmed";
    // كل تقييمات VB-MAPP المربوطة بنفس الرسم تُفتح معاً.
    db.evaluationRequests.filter((x) => x.charge_id && x.charge_id === r.charge_id && x.billing_status === "locked").forEach((x) => (x.billing_status = "confirmed"));
    return { data: { id: r.id, billing_status: r.billing_status } };
  }),
  route("GET", "api/accounting/accounts", ({ db }) => ({ data: db.children.map((c) => ({ child: { id: c.id, name: c.name }, child_id: c.id, ...statementOf(db, c.id).totals, currency: db.settings.currency })) })),
  route("GET", "api/accounting/accounts/:child", ({ db, params }) => ({ data: { child: db.childCard(db.child(params.child)!), ...statementOf(db, Number(params.child)), currency: db.settings.currency } })),
  route("GET", "api/accounting/charges", ({ db }) => ({ data: db.charges.map((c) => chargeRow(db, c)) })),
  route("GET", "api/accounting/payments", ({ db }) => ({ data: db.payments.map((p) => paymentRow(db, p)) })),
  route("GET", "api/accounting/payments/:id", ({ db, params }) => ({ data: paymentRow(db, db.payments.find((p) => p.id === Number(params.id))) })),
  route("GET", "api/accounting/credits", () => ({ data: [] })),
  route("GET", "api/accounting/programs", ({ db, query }) => ({ data: db.programs.filter((p) => !query.status || ["tentative", "confirmed", "unconfirmed", "stopped"].includes(query.status) ? !query.status || p.accounting_status === query.status : false).map((p) => programAccountRow(db, p)) })),
  route("GET", "api/accounting/programs/:id", ({ db, params }) => { const p = db.programs.find((x) => x.id === Number(params.id)); if (!p) throw new HttpError(404, {}); return { data: { ...programAccountRow(db, p), price_details: p.price_details, pending: null, stop: null, balance: 0 } }; }),
  route("POST", "api/accounting/programs/:id/confirm", ({ db, params, body }) => {
    const p = db.programs.find((x) => x.id === Number(params.id)); if (!p || p.accounting_status !== "tentative") throw new HttpError(422, { message: "Only a program waiting for confirmation can be confirmed." });
    const charge = db.charges.find((c) => c.program_id === p.id); if (charge) savePlan(db, charge, body);
    p.accounting_status = "confirmed"; p.tentative_until = null; p.confirmed_at = db.now(); p.confirmed_by = db.currentStaffId;
    return { data: programAccountRow(db, p) };
  }),
  route("PUT", "api/accounting/charges/:id/plan", ({ db, params, body }) => { const c = db.charges.find((x) => x.id === Number(params.id)); if (!c) throw new HttpError(404, {}); savePlan(db, c, body); return { data: chargeRow(db, c) }; }),
  route("POST", "api/accounting/payments", ({ db, body }) => ({ data: paymentRow(db, pay(db, body)) })),
  route("GET", "api/evaluation-request/pricing/:child", ({ db, params }) => ({ data: { registered: db.programs.some((p) => p.student_id === Number(params.child) && p.accounting_status === "confirmed"), prices: db.settings.evaluationPrices } })),
];

export { TYPE_NAMES };
export type { Ctx };
