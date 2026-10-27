// التقارير: صفحة «تقارير التقييم»، التقرير المطبوع، نقاط القوة والضعف، الخطة، التراكنج واعتماده — كما يبنيها
// ChildReportController / ReportSummaryController / MilestonePlanController / TrackingApprovalController.
import { HttpError, route } from "../backend";
import { ageMonths, type DB } from "../db";
import { flowChart, milestoneReport, progress } from "./evaluation";
import { scenario } from "../../scenario";

const day = (v: any) => (v ? String(v).slice(0, 10) : null);

/** التقييمات المنتهية (أو VB-MAPP الذي له إجابات) كما يسردها التقرير، الأحدث أولاً. */
export function finished(db: DB, childId: number) {
  return db.evaluations.filter((e) => e.child_id === childId && [2, 3, 4, 5, 6, 7, 8].includes(e.type) && (e.status === 1 || (e.type === 2 && db.milestoneAnswers.some((a) => a.evaluation_id === e.id))))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)) || b.id - a.id)
    .map((e) => ({ key: `e${e.id}`, group: `t${e.type}`, id: e.id, type: e.type, title: e.title, side_profile: null, date: day(e.date),
      specialist: { id: e.specialist_id, name: db.staffById(e.specialist_id)?.name }, complete: e.status === 1, approval: e.approval_status ?? "pending", approval_note: e.approval_note ?? null }));
}

export function childInfo(db: DB, child: any) {
  const booking = [...db.bookings].reverse().find((b) => b.child_id === child.id);
  return { id: child.id, name: child.name, gender: String(child.gender), birth_date: day(child.birth_date),
    parent: { name: booking?.details?.requester_name ?? `${db.parent?.fname} ${db.parent?.lname}`, relation: booking?.details?.relative_degree ?? null } };
}

function form(db: DB, child: any, item: any) {
  const e = db.evaluations.find((x) => x.id === item.id)!;
  const p = progress(db, e);
  const age = ageMonths(child.birth_date, new Date(`${item.date}T00:00:00`));
  const levels = p.levels.map((l) => ({ ...l, cumulative_score: l.done ? l.score : null }));
  return { testers: [item.specialist?.name].filter(Boolean), colors: e.color ? [e.color] : [], age_months: age, complete: p.complete, boxes_total: p.boxes_total, levels,
    tests: [{ n: 1, evaluation_id: e.id, date: item.date, testers: [item.specialist?.name].filter(Boolean), colors: e.color ? [e.color] : [], age_months: age, score: levels.reduce((s, l) => s + (l.score ?? 0), 0), boxes_total: p.boxes_total, complete: p.complete }] };
}

export function report(db: DB, childId: number, keys: string[]) {
  const child = db.child(childId)!;
  const items = finished(db, childId).filter((i) => keys.includes(i.key));
  if (!items.length) throw new HttpError(404, { message: "No finished evaluations were chosen." });
  if (items.some((i) => i.approval !== "approved")) throw new HttpError(422, { message: "لا يمكن عمل تقرير من تقييم غير معتمد.", errors: { items: ["لا يمكن عمل تقرير من تقييم غير معتمد."] } });
  const info = childInfo(db, child);
  const first = items[0];
  const consultant = db.staffById(11), therapist = db.staffById(first.specialist.id);
  return {
    child: info,
    team: { consultant: { name: consultant.name, specialty: [consultant.role] }, therapist: therapist ? { name: therapist.name, specialty: [therapist.role], treatments: ["تحليل السلوك التطبيقي"] } : null, parent: info.parent },
    items: items.map((item) => ({ ...item, form: form(db, child, item), result: { levels: flowChart(db, item.id), summary: milestoneReport(db, item.id) } })),
  };
}

const trackingData = (db: DB, t: any) => ({ id: t.id, status: t.status, note: t.note ?? null, goal_ids: t.goal_ids, evaluation_ids: t.evaluation_ids,
  requested_at: t.requested_at, decided_at: t.decided_at ?? null, requester: db.staffById(t.requested_by)?.name, approver: t.approved_by ? db.staffById(t.approved_by)?.name : null });

export const lockedGoalIds = (db: DB, childId: number) => db.trackings.filter((t) => t.child_id === childId && t.status === "approved").flatMap((t) => t.goal_ids as number[]);

export function goalData(db: DB, g: any, childId: number) {
  const gens = db.generalizations.filter((x) => x.goal_id === g.id);
  const latest = (type: string) => { const r = [...gens].reverse().find((x) => x.type === type); return r ? { id: r.id, status: r.status, note: r.note ?? null, created_at: r.created_at, decided_at: r.decided_at ?? null } : null; };
  return { id: g.id, level_id: g.level_id, general_goal_id: g.general_goal_id, general_goal: g.general_goal, domain: g.domain, domain_symbol: g.domain_symbol, symbol: g.symbol,
    weakness: g.weakness, goal: g.goal, cells: { ...(g.cells ?? {}) }, achieved_at: g.achieved_at ?? null, prop_start: g.prop_start ?? null,
    session_cells: [...(g.session_cells ?? []), ...(gens.length ? ["gen"] : [])], gen: { classes: latest("classes"), home: latest("home"), people: [] },
    locked: lockedGoalIds(db, childId).includes(g.id), attempts: (g.attempts ?? []).map((a: any) => ({ date: a.date, achieved: !!a.achieved })) };
}

export function numbered(db: DB, goals: any[], childId: number) {
  const counts: Record<string, number> = {};
  return goals.map((g) => { const k = String(g.general_goal_id ?? g.symbol ?? ""); counts[k] = (counts[k] ?? 0) + 1; return { ...goalData(db, g, childId), code: `${g.symbol}-${counts[k]}` }; });
}

export const planData = (db: DB, p: any) => ({ id: p.id, evaluation_id: p.evaluation_id, updated_at: p.updated_at, hidden: p.hidden ?? [], goals: numbered(db, p.goals, p.child_id) });

const mustBeApproved = (db: DB, ids: number[]) => { if (db.evaluations.some((e) => ids.includes(e.id) && e.approval_status !== "approved")) throw new HttpError(422, { message: "لا يمكن عمل خطة أو تراكنج من تقييم غير معتمد.", errors: { evaluations: ["لا يمكن عمل خطة أو تراكنج من تقييم غير معتمد."] } }); };

export const reportsRoutes = [
  route("GET", "api/reports/children", ({ db }) => ({ data: db.children.map((c) => { const rows = finished(db, c.id); return rows.length ? { id: c.id, name: c.name, gender: String(c.gender), birth_date: c.birth_date, parent_name: `${db.parent?.fname} ${db.parent?.lname}`, evaluations_count: rows.length, first_date: rows.at(-1)!.date, last_date: rows[0].date, types: [...new Set(rows.map((r) => r.type))].sort() } : null; }).filter(Boolean) })),
  route("GET", "api/reports/children/:id", ({ db, params }) => ({ child: childInfo(db, db.child(params.id)!), data: finished(db, Number(params.id)) })),
  route("GET", "api/reports/children/:id/report", ({ db, params, query }) => report(db, Number(params.id), ([] as string[]).concat(query.items ?? query["items[]"] ?? []))),
  route("GET", "api/parent/child/:id/portal/report", ({ db, params, query }) => report(db, Number(params.id), ([] as string[]).concat(query.items ?? query["items[]"] ?? []))),
  route("GET", "api/reports/children/:id/saved", ({ db, params }) => ({ data: (db as any).savedReports?.filter((r: any) => r.child_id === Number(params.id)) ?? [] })),
  route("POST", "api/reports/children/:id/saved", ({ db, params, body }) => {
    const me = db.currentStaff();
    const r = { id: db.id(), child_id: Number(params.id), items: body.items, types: body.types, edits: body.edits ?? null, printed_at: body.printed ? db.now() : null, created_at: db.now(), updated_at: db.now(), created_by: { id: me.id, name: me.name }, updated_by: { id: me.id, name: me.name } };
    ((db as any).savedReports ??= []).push(r);
    return { report: r };
  }),
  route("PUT", "api/reports/saved/:id", ({ db, params, body }) => { const r = (db as any).savedReports.find((x: any) => x.id === Number(params.id)); Object.assign(r, { items: body.items, types: body.types, edits: body.edits ?? null, updated_at: db.now(), printed_at: body.printed ? db.now() : r.printed_at }); return { report: r }; }),
  route("GET", "api/reports/saved/:id", ({ db, params }) => ({ report: (db as any).savedReports?.find((x: any) => x.id === Number(params.id)) ?? null })),

  route("GET", "api/reports/summaries/:id", ({ db, params }) => ({ summary: (db as any).summaries?.[params.id] ?? null })),
  route("PUT", "api/reports/summaries/:id", ({ db, params, body }) => { ((db as any).summaries ??= {})[params.id] = { evaluation_id: Number(params.id), tables: body.tables, updated_at: db.now() }; return { summary: (db as any).summaries[params.id] }; }),

  route("GET", "api/reports/plans/:id", ({ db, params }) => { mustBeApproved(db, [Number(params.id)]); const p = db.reportPlans.find((x) => x.evaluation_id === Number(params.id)); return { plan: p ? planData(db, p) : null }; }),
  route("PUT", "api/reports/plans/:id", ({ db, params, body }) => {
    const e = db.evaluations.find((x) => x.id === Number(params.id))!;
    mustBeApproved(db, [e.id]);
    let p = db.reportPlans.find((x) => x.evaluation_id === e.id);
    if (!p) { p = { id: db.id(), evaluation_id: e.id, child_id: e.child_id, hidden: [], goals: [], updated_at: db.now() }; db.reportPlans.push(p); }
    p.hidden = body.hidden ?? []; p.updated_at = db.now();
    p.goals = (body.goals ?? []).map((g: any, sort: number) => { const old = g.id ? p!.goals.find((x: any) => x.id === Number(g.id)) : null;
      return { ...(old ?? { id: db.id(), cells: {}, attempts: [], session_cells: [] }), level_id: g.level_id, general_goal_id: g.general_goal_id, general_goal: g.general_goal, domain: g.domain, domain_symbol: g.domain_symbol, symbol: g.symbol, weakness: g.weakness, goal: g.goal, sort }; });
    return { plan: planData(db, p) };
  }),

  route("GET", "api/reports/children/:id/tracking", ({ db, params, query }) => {
    const ids = ([] as any[]).concat(query.evaluations ?? query["evaluations[]"] ?? []).map(Number);
    mustBeApproved(db, ids);
    const childId = Number(params.id);
    const plans = db.reportPlans.filter((p) => p.child_id === childId && ids.includes(p.evaluation_id)).map((p) => ({ ...planData(db, p), goals: numbered(db, p.goals.filter((g: any) => !(p.hidden ?? []).some((h: string) => h === `level:${g.level_id}` || h === `group:${g.level_id}|${g.general_goal_id}`)), childId), evaluation_date: db.evaluations.find((e) => e.id === p.evaluation_id)?.date }));
    const wanted = [...ids].sort().join(",");
    const t = [...db.trackings].reverse().find((x) => x.child_id === childId && [...x.evaluation_ids].sort().join(",") === wanted);
    return { plans, request: t ? trackingData(db, t) : null };
  }),
  route("POST", "api/reports/children/:id/tracking", ({ db, params, body }) => {
    const childId = Number(params.id); const locked = lockedGoalIds(db, childId);
    const goals = db.reportPlans.filter((p) => p.child_id === childId).flatMap((p) => p.goals);
    for (const item of body.goals ?? []) { const g = goals.find((x: any) => x.id === Number(item.id)); if (!g || locked.includes(g.id)) continue;
      if (item.cells) g.cells = { ...(g.cells ?? {}), ...Object.fromEntries(Object.entries(item.cells).filter(([k]) => !(g.session_cells ?? []).includes(k)).map(([k, v]) => [k, String(v ?? "")])) };
      if ("prop_start" in item) g.prop_start = item.prop_start || null; if ("achieved_at" in item) g.achieved_at = item.achieved_at || null; }
    return { goals: (body.goals ?? []).map((i: any) => goalData(db, goals.find((x: any) => x.id === Number(i.id)), childId)) };
  }),
  route("POST", "api/reports/children/:id/tracking/approve", ({ db, params, body }) => {
    const childId = Number(params.id); mustBeApproved(db, body.evaluations.map(Number));
    const wanted = [...body.evaluations].map(Number).sort().join(",");
    let t = [...db.trackings].reverse().find((x) => x.child_id === childId && [...x.evaluation_ids].sort().join(",") === wanted);
    if (t?.status === "approved") throw new HttpError(422, { message: "This tracking is approved already and cannot change." });
    const values = { evaluation_ids: body.evaluations.map(Number), goal_ids: body.goals.map(Number), status: "pending", note: null, requested_by: db.currentStaffId, approved_by: null, decided_at: null, requested_at: db.now() };
    if (t?.status === "pending") Object.assign(t, values); else { t = { id: db.id(), child_id: childId, ...values }; db.trackings.push(t); }
    const child = db.child(childId)!;
    db.staff.filter((s) => s.perms.includes("tracking approval edit")).forEach((s) => db.notifyStaff(s.id, { kind: "tracking_approval", title: "تراكنج بانتظار الاعتماد", message: `تراكنج ${child.name} (${t!.goal_ids.length} هدفاً) بانتظار اعتماد الإدارة.`, url: "/tracking-approvals" }));
    return { tracking: trackingData(db, t) };
  }),
  route("GET", "api/reports/children/:id/tracking/approved", ({ db, params }) => { const t = [...db.trackings].reverse().find((x) => x.child_id === Number(params.id) && x.status === "approved"); return { tracking: t ? trackingData(db, t) : null }; }),

  route("GET", "api/tracking-approvals", ({ db, query }) => ({ data: db.trackings.filter((t) => !query.status || t.status === query.status).map((t) => ({ ...trackingData(db, t), child: { id: t.child_id, name: db.child(t.child_id)?.name } })), can_decide: db.permissionsOf(db.currentStaff()).includes("tracking approval edit") })),
  route("GET", "api/tracking-approvals/:id", ({ db, params }) => {
    const t = db.trackings.find((x) => x.id === Number(params.id))!;
    const goals = db.reportPlans.filter((p) => p.child_id === t.child_id).flatMap((p) => p.goals.map((g: any) => ({ ...g, plan_id: p.id }))).filter((g: any) => t.goal_ids.includes(g.id));
    const groups: Record<string, any> = {}; const counts: Record<string, number> = {};
    for (const g of goals) { const k = `${g.plan_id}-${g.general_goal_id ?? g.symbol}`; counts[k] = (counts[k] ?? 0) + 1;
      groups[k] ??= { key: k, domain: g.domain, domain_symbol: g.domain_symbol, general_goal: g.general_goal, symbol: g.symbol, goals: [] };
      groups[k].goals.push({ id: g.id, code: `${g.symbol}-${counts[k]}`, goal: g.goal || g.weakness, cells: { ...(g.cells ?? {}) }, prop_start: g.prop_start ?? null, achieved_at: g.achieved_at ?? null, gen: goalData(db, g, t.child_id).gen }); }
    return { data: { ...trackingData(db, t), child: { id: t.child_id, name: db.child(t.child_id)?.name }, groups: Object.values(groups) } };
  }),
  route("POST", "api/tracking-approvals/:id/decide", ({ db, params, body }) => {
    const t = db.trackings.find((x) => x.id === Number(params.id))!;
    if (t.status !== "pending") throw new HttpError(422, { message: "This tracking was already answered." });
    t.status = body.approved ? "approved" : "rejected"; t.note = body.approved ? null : body.note; t.approved_by = db.currentStaffId; t.decided_at = db.now();
    return { data: trackingData(db, t) };
  }),
];

export { scenario };
