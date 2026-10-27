// التقييم: طلبات الأخصائية، إجراء VB-MAPP (المستوى الأول)، النتيجة، الاعتماد — بالأشكال التي يرجعها الخادم الحقيقي.
import { HttpError, route } from "../backend";
import { ageMonths, type DB } from "../db";
import { TYPE_NAMES } from "./parent";
import { DOMAINS, GENERAL_GOALS, LEVELS, SUB_GOALS, wordingFor, type SubGoal } from "../vbmapp";

export function requestRow(db: DB, r: any) {
  const c = db.child(r.child_id)!;
  return { ...r, child: { id: c.id, name: c.name, birth_date: c.birth_date, gender: c.gender }, specialist: { id: r.employee_id, name: db.staffById(r.employee_id)?.name }, title: TYPE_NAMES[r.evaluation_type] };
}

export function evaluationRow(db: DB, e: any) {
  const c = db.child(e.child_id)!;
  return { ...e, child_name: c.name, kid: { id: c.id, name: c.name }, specialist: { id: e.specialist_id, name: db.staffById(e.specialist_id)?.name } };
}

const goalRow = (db: DB, g: SubGoal, child: any) => {
  const w = wordingFor(g, child.gender, child.name);
  const subtest = GENERAL_GOALS.find((s) => s.id === g.subtest_id)!;
  const domain = DOMAINS.find((d) => d.id === g.question_type_id)!;
  return { id: g.id, subtest_id: g.subtest_id, question_type_id: g.question_type_id, display_order: g.display_order, ...w,
    subtest, question_type: domain, previous: null, carried: false, options: [0, 0.5, 1] };
};

const firstName = (name: string) => String(name).trim().split(/\s+/)[0];

/** حالة الاعتماد كما يقرؤها شريط النتيجة وقائمة الاعتمادات. */
export function approvalState(db: DB, e: any) {
  const c = db.child(e.child_id)!;
  return { key: `e${e.id}`, id: e.id, type: e.type, title: e.title, status: e.approval_status, note: e.approval_note ?? null,
    requested_at: e.approval_requested_at ?? null, approved_at: e.approved_at ?? null, extension: false,
    child: { id: c.id, name: c.name }, specialist: db.staffById(e.specialist_id)?.name, date: e.date, side_profile_id: null };
}

/** الأجوبة مرتّبة كما في النموذج (المجال ثم الترتيب). */
const answersOf = (db: DB, evaluationId: number) =>
  db.milestoneAnswers.filter((a) => a.evaluation_id === evaluationId)
    .map((a) => ({ a, g: SUB_GOALS.find((s) => s.id === a.question_id)! }))
    .sort((x, y) => x.g.question_type_id - y.g.question_type_id || x.g.display_order - y.g.display_order);

export function progress(db: DB, e: any) {
  const rows = answersOf(db, e.id);
  const done = rows.length > 0;
  return {
    evaluation_id: e.id, start_age: ageMonths(db.child(e.child_id)!.birth_date, new Date(`${e.date}T00:00:00`)), color: e.color ?? null, based_on_evaluation_id: null,
    levels: [{ level_id: 1, title: LEVELS[0].title, age: 1, required: true, done, boxes: SUB_GOALS.length, date: done ? e.date : null, color: done ? e.color : null,
      tester: done ? db.staffById(e.specialist_id)?.name : null, age_months: done ? rows[0].a.child_age : null, score: done ? rows.reduce((s, r) => s + Number(r.a.score), 0) : null }],
    missing_level_ids: done ? [] : [1], complete: done, boxes_total: SUB_GOALS.length, child_id: e.child_id, date: e.date, status: e.status,
  };
}

/** نتيجة التقرير (EvaluationService::mileStoneReport): لكل هدف عام قوة وضعف وأهداف خطة. */
export function milestoneReport(db: DB, evaluationId: number) {
  const e = db.evaluations.find((x) => x.id === evaluationId)!;
  const child = db.child(e.child_id)!;
  const groups: Record<number, any> = {};
  for (const { a, g } of answersOf(db, evaluationId)) {
    const w = wordingFor(g, child.gender, firstName(child.name));
    const subtest = GENERAL_GOALS.find((s) => s.id === g.subtest_id)!;
    const domain = DOMAINS.find((d) => d.id === g.question_type_id)!;
    groups[g.subtest_id] ??= { index: Object.keys(groups).length + 1, general_goal: subtest.title, general_goal_id: subtest.id, domain: domain.title, domain_symbol: domain.sympol,
      strength: [], weak: [], plan_goals: [], status: "مستهدف", symbol: subtest.symbol, level_id: 1 };
    const score = Number(a.score);
    const strength = score === 1 ? w.title : score === 0.5 ? w.half_strength : "";
    const weakness = score === 0 ? w.zero_weakness : score === 0.5 ? w.half_weakness : "";
    const plan = score === 0.5 ? w.half_plan_goal : score === 0 ? w.zero_plan_goal : "";
    if (strength) groups[g.subtest_id].strength.push({ question: strength });
    if (weakness) groups[g.subtest_id].weak.push({ question: weakness, goal: plan });
    if (plan) groups[g.subtest_id].plan_goals.push({ question: plan, student_program_id: a.student_program_id ?? null, question_id: g.id });
  }
  return Object.values(groups);
}

/** مخطط المربعات (MilestonLevelService::flowChartData). */
export function flowChart(db: DB, evaluationId: number) {
  const e = db.evaluations.find((x) => x.id === evaluationId)!;
  const child = db.child(e.child_id)!;
  const rows = answersOf(db, evaluationId);
  if (!rows.length) return [];
  const subtests: Record<number, any> = {};
  for (const { a, g } of rows) {
    const domain = DOMAINS.find((d) => d.id === g.question_type_id)!;
    subtests[g.subtest_id] ??= { subtest_name: domain.title, subtest_symbol: domain.sympol, questions: [] };
    subtests[g.subtest_id].questions.push({ question: wordingFor(g, child.gender, firstName(child.name)).title, answer_score: a.score, answer_color: a.color, carried: false, previous_score: null, previous_color: null });
  }
  return [{ level_id: 1, level_name: LEVELS[0].title, level_age: 1, subtests: Object.values(subtests) }];
}

export const evaluationRoutes = [
  // ملف الموظف (components/profile/userProfile.js): البيانات + طلباته وتقييماته.
  route("GET", "api/users/:id", ({ db, params }) => {
    const id = Number(params.id);
    const s = db.staffById(id);
    return { ...db.userResource(s), evaluation_requests: db.evaluationRequests.filter((r) => r.employee_id === id).map((r) => requestRow(db, r)),
      evaluations: db.evaluations.filter((e) => e.specialist_id === id).map((e) => evaluationRow(db, e)), stimulus_test: [], children: db.children, substitutes: [] };
  }),
  route("GET", "api/users/:id/get/evaluations", ({ db, params }) => {
    const id = Number(params.id);
    return { evaluation_requests: db.evaluationRequests.filter((r) => r.employee_id === id).map((r) => requestRow(db, r)),
      evaluations: db.evaluations.filter((e) => e.specialist_id === id).map((e) => evaluationRow(db, e)), stimulus_test: [], children: db.children };
  }),

  // إجراء VB-MAPP.
  route("POST", "api/evaluations/create", ({ db, body }) => {
    const e = { id: db.id(), type: Number(body.type), title: body.title, child_id: Number(body.child_id), specialist_id: Number(body.specialist_id), date: body.date,
      status: 0, approval_status: null, approval_note: null, approval_requested_at: null, approved_at: null, color: null, created_at: db.now() };
    db.evaluations.push(e);
    return { message: "Evaluation created successfully", evaluation: e };
  }),
  route("POST", "api/milestone-answers/get-age-child", ({ db, body }) => ageMonths(db.child(body.child_id)!.birth_date, new Date(`${body.date}T00:00:00`))),
  route("GET", "api/milestone-answers/sub-goals/:age", ({ db, query }) => SUB_GOALS.map((g) => goalRow(db, g, db.child(query.child_id)!))),
  route("GET", "api/milestone-answers/eesa/result/:id", () => ({ domain: null, results: [], result: null, previous: [] })),
  route("GET", "api/milestone-answers/eesa/:age", () => ({ show: false, domain: null, levels: [] })),
  route("GET", "api/milestone-answers/last-colors/:child", ({ db, params }) => {
    const last = db.evaluations.filter((e) => e.child_id === Number(params.child) && e.type === 2 && e.color).at(-1);
    return { color: last?.color ?? null, last: last ? { id: last.id, date: last.date, status: last.status } : null };
  }),
  route("GET", "api/milestone-answers/pending/:child", () => ({ data: [] })),
  route("GET", "api/milestone-answers/programs/:child", ({ db, params }) => db.programs.filter((p) => p.student_id === Number(params.child)).map((p) => ({ id: p.id, name: `${p.name} — #${p.id}` }))),
  route("GET", "api/mileston-levels", () => ({ data: LEVELS })),
  route("GET", "api/milestone-answers/progress/:id", ({ db, params }) => progress(db, db.evaluations.find((e) => e.id === Number(params.id))!)),
  route("POST", "api/milestone-answers", ({ db, body }) => {
    const answers = (body.answers ?? []).filter(Boolean);
    const e = db.evaluations.find((x) => x.id === Number(answers[0]?.evaluation_id));
    if (!e) throw new HttpError(404, { message: "evaluation not found" });
    const color = String(answers[0]?.color ?? "00B8D9").toUpperCase();
    const missing = SUB_GOALS.filter((g) => !answers.some((a: any) => Number(a.question_id) === g.id));
    if (missing.length) throw new HttpError(400, { message: "Not all questions were answered", not_answered_ids: missing.map((g) => g.id) });
    for (const a of answers) {
      db.milestoneAnswers.push({ id: db.id(), evaluation_id: e.id, child_id: e.child_id, question_id: Number(a.question_id), score: Number(a.score), color, carried: false,
        date: a.date ?? e.date, child_age: Number(a.child_age), specialist_id: e.specialist_id, student_program_id: body.student_program_id ?? null, notes: "" });
    }
    e.color = color; e.status = 1;
    // EvaluationApproval::submit: بانتظار اعتماد الإدارة + إشعار من يحمل «evaluation approval edit» (غير الإدارة العليا).
    e.approval_status = "pending"; e.approval_requested_at = db.now();
    const child = db.child(e.child_id)!;
    db.staff.filter((s) => s.perms.includes("evaluation approval edit")).forEach((s) => db.notifyStaff(s.id, { kind: "evaluation_approval", title: "تقييم بانتظار الاعتماد", message: `نتيجة تقييم VB-MAPP للطفل ${child.name} بانتظار الاعتماد.`, url: "/sawa-admin/evaluation-approvals", evaluation: `e${e.id}` }));
    if (body.request_id) { const r = db.evaluationRequests.find((x) => x.id === Number(body.request_id)); if (r) r.status = 1; }
    return { data: answers, status: 201, message: "Milestone Answers created successfully" };
  }),

  // النتيجة.
  route("GET", "api/mileston-levels/flow-chart/:id", ({ db, params }) => ({ data: flowChart(db, Number(params.id)), status: 200, message: "ok" })),
  route("GET", "api/evaluations/report/:id", ({ db, params }) => milestoneReport(db, Number(params.id))),

  // الاعتماد.
  route("GET", "api/evaluation-approvals/lookup", ({ db, query }) => {
    const e = db.evaluations.find((x) => x.id === Number(query.evaluation));
    return { data: e && e.approval_status ? { ...approvalState(db, e), can_decide: db.permissionsOf(db.currentStaff()).includes("evaluation approval edit") } : null };
  }),
  route("GET", "api/evaluation-approvals/mine", ({ db }) => ({ data: db.evaluations.filter((e) => e.specialist_id === db.currentStaffId && ["pending", "rejected"].includes(e.approval_status)).map((e) => approvalState(db, e)) })),
  route("GET", "api/evaluation-approvals", ({ db, query }) => ({
    data: db.evaluations.filter((e) => e.approval_status && (!query.status || e.approval_status === query.status)).map((e) => approvalState(db, e)),
    can_decide: db.permissionsOf(db.currentStaff()).includes("evaluation approval edit"),
  })),
  route("POST", "api/evaluation-approvals/:key/decide", ({ db, params, body }) => {
    const e = db.evaluations.find((x) => `e${x.id}` === params.key);
    if (!e || e.approval_status !== "pending") throw new HttpError(422, { message: "This evaluation is not waiting for approval." });
    e.approval_status = body.approved ? "approved" : "rejected"; e.approval_note = body.approved ? null : body.note; e.approved_at = body.approved ? db.now() : e.approved_at;
    const child = db.child(e.child_id)!;
    db.notifyStaff(e.specialist_id, { kind: "evaluation_approval", title: body.approved ? "اعتُمد التقييم" : "رُفض التقييم", message: body.approved ? `اعتُمدت نتيجة تقييم VB-MAPP للطفل ${child.name}.` : `رُفضت نتيجة تقييم VB-MAPP للطفل ${child.name}: ${body.note}`, url: "/my-evaluation-results", evaluation: `e${e.id}` });
    return { data: approvalState(db, e) };
  }),
];
