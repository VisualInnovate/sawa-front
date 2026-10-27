// قاعدة بيانات الخادم الوهمي: جداول بسيطة في الذاكرة تُبذر من السيناريو، وتتغيّر مع كل فصل كما يغيّرها الخادم الحقيقي.
import { scenario, staff, type Staff, ymd, ymdhm, at, addDays, today, workDay } from "../scenario";
import { ALL_PERMISSIONS } from "./permissions";

export type Row = Record<string, any>;

export interface Notification extends Row { id: string; data: Row; read_at: string | null; created_at: string }

export class DB {
  seq = 100;
  now = () => ymdhm(new Date());
  staff: Staff[] = staff;
  /** الموظف الذي يحمل جلسة الحاسوب الآن (يبدّله الشِّل مع كل فصل). */
  currentStaffId = 11;
  parent: Row | null = null;
  children: Row[] = [];
  /** مواعيد الاستشارة المفتوحة (event_calendars من النوع 3). */
  events: Row[] = [];
  bookings: Row[] = [];
  evaluationRequests: Row[] = [];
  evaluations: Row[] = [];
  milestoneAnswers: Row[] = [];
  reportPlans: Row[] = [];
  trackings: Row[] = [];
  programs: Row[] = [];
  sessions: Row[] = [];
  charges: Row[] = [];
  payments: Row[] = [];
  generalizations: Row[] = [];
  notifications: { parent: Notification[]; staff: Record<number, Notification[]> } = { parent: [], staff: {} };
  settings = { currency: scenario.center.currency, evaluationPrices: { 2: 300, 3: 250 } as Record<number, number> };

  constructor() { this.reset(); }

  reset() {
    this.seq = 100;
    this.parent = null;
    this.children = [];
    this.bookings = [];
    this.evaluationRequests = [];
    this.evaluations = [];
    this.milestoneAnswers = [];
    this.reportPlans = [];
    this.trackings = [];
    this.programs = [];
    this.sessions = [];
    this.charges = [];
    this.payments = [];
    this.generalizations = [];
    this.notifications = { parent: [], staff: {} };
    this.currentStaffId = 11;
    this.seedEvents();
  }

  id() { return ++this.seq; }

  /** مواعيد المستشارة المفتوحة خلال أسبوعَين: ساعة واحدة لكل موعد في أيام العمل. */
  private seedEvents() {
    this.events = [];
    let id = 1;
    for (let n = 1; n <= 14; n++) {
      const d = addDays(today(), n);
      if ([5, 6].includes(d.getDay())) continue;
      for (const h of scenario.consultation.slots) {
        const start = at(d, h);
        this.events.push({ id: id++, employee_id: 11, title: "استشارة", start: `${ymd(d)} ${String(h).padStart(2, "0")}:00:00`, end: `${ymd(d)} ${String(h + 1).padStart(2, "0")}:00:00`, type: [3], startAt: start });
      }
    }
  }

  staffById(id: number) { return this.staff.find((s) => s.id === id)!; }
  currentStaff() { return this.staffById(this.currentStaffId); }

  permissionsOf(s: Staff) { return s.perms[0] === "ALL" ? ALL_PERMISSIONS : s.perms; }

  /** مستخدم لوحة التحكم كما يرجعه api/get-user. */
  userResource(s: Staff) {
    return {
      id: s.id, user_id: s.id, employee_id: s.id, name: s.name, email: s.email, title: s.title, type: s.type, image: null,
      phone: s.phone ?? null, status: 1,
      roles: { id: s.id, name: s.role },
      roles_permissions: this.permissionsOf(s),
      permissions: [],
    };
  }

  notifyParent(data: Row) {
    this.notifications.parent.unshift({ id: `n${this.id()}`, data, read_at: null, created_at: this.now() });
  }
  notifyStaff(userId: number, data: Row) {
    (this.notifications.staff[userId] ??= []).unshift({ id: `n${this.id()}`, data, read_at: null, created_at: this.now() });
  }

  child(id: number | string) { return this.children.find((c) => c.id === Number(id)); }
  childCard(child: Row) {
    const programs = this.programs.filter((p) => p.student_id === child.id && !p.stopped_at);
    const next = this.sessions.filter((s) => s.child_id === child.id && s.starts_at >= this.now()).sort((a, b) => a.starts_at.localeCompare(b.starts_at))[0];
    const evaluations = this.evaluations.filter((e) => e.child_id === child.id && e.status === 1);
    const bookings = this.bookings.filter((b) => b.child_id === child.id);
    return {
      id: child.id, name: child.name, gender: child.gender, birth_date: child.birth_date, age_months: ageMonths(child.birth_date),
      programs: programs.map((p) => ({ id: p.id, kind: p.kind, inclusion_type: p.inclusion_type ?? null, status: p.stopped_at ? "stopped" : p.accounting_status, start_date: p.start_date, end_date: p.end_date, weekly_sessions: p.weekly_sessions, therapist: this.staffById(p.therapist_id)?.name })),
      next_session: next ? this.sessionRow(next) : null,
      evaluations: { approved: evaluations.filter((e) => e.approval_status === "approved").length, waiting: evaluations.filter((e) => e.approval_status !== "approved").length },
      consultations: { waiting: bookings.filter((b) => b.accepted === null || b.accepted === -1).length, accepted: bookings.filter((b) => b.accepted === 1).length },
      pending_generalizations: this.generalizations.filter((g) => g.child_id === child.id && g.type === "home" && g.status === "pending").length,
    };
  }
  sessionRow(s: Row) {
    return {
      id: s.id, starts_at: s.starts_at, ends_at: s.ends_at, status: s.status, kind: s.session_kind ?? "individual",
      treatment: s.treatment, therapist: this.staffById(s.therapist_id)?.name, room: s.room, postponed: false, makeup: false, holiday: null,
    };
  }
}

export function ageMonths(birth: string, on = new Date()) {
  const b = new Date(`${birth}T00:00:00`);
  let months = (on.getFullYear() - b.getFullYear()) * 12 + (on.getMonth() - b.getMonth());
  if (on.getDate() < b.getDate()) months -= 1;
  return Math.max(0, months);
}

export { ymd, ymdhm, at, addDays, today, workDay };
