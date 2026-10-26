// Dashboard navigation. Sections in AdminSidebar group these permitted entries.
// `label` is an i18n key; `text` is shown as-is (evaluation names stay English).
// `perm` is one permission or a list (any of them); `to` may depend on the permissions the user has.
import { can, homeRoute } from "@/utils/permissions";

export const buildMenu = () => [
  {
    key: "home",
    icon: "mdi-home",
    label: homeRoute().name === "dashbord" ? "dashbored" : "home",
    to: homeRoute(),
  },
  {
    key: "admin",
    icon: "mdi-shield-account-outline",
    label: "Adminstration",
    children: [
      { label: "Employees", to: { name: "Employees" }, perm: "employees list" },
      { label: "sch.title", to: { name: "staff-schedules" }, perm: "staff schedules list" },
      { label: "doctors", to: { name: "doctors" }, perm: "doctor list" },
      { label: "permissions", to: { name: "permissions" }, perm: "permissions list" },
      { label: "roles", to: { name: "Roles" }, perm: "roles list" },
    ],
  },
  {
    key: "parents",
    icon: "mdi-human-male-boy",
    label: "parents",
    children: [
      { label: "parents", to: { name: "Parents" }, perm: "parents list" },
      { label: "meetings", to: { name: "parent-meeting" }, perm: "parent meetings list" },
      { label: "children", to: { name: "Children" }, perm: "child list" },
    ],
  },
  {
    key: "my-schedule",
    icon: "mdi-calendar-account-outline",
    label: "sch.my_title",
    to: { name: "my-schedule" },
  },
  {
    key: "my-evaluations",
    icon: "mdi-clipboard-list-outline",
    label: "evaluation_order",
    to: { name: "my-evaluations" },
  },
  {
    key: "my-evaluation-results",
    icon: "mdi-chart-box-outline",
    label: "evaluation_results",
    to: { name: "my-evaluation-results" },
    // My evaluations the management sent back (rejected with a reason).
    badge: "my_rejected_evaluations",
  },
  {
    key: "evaluations",
    icon: "mdi-help-box-multiple-outline",
    label: "evaluations",
    children: [
      { label: "ea_title", to: { name: "evaluation-approvals" }, perm: ["evaluation approval list", "evaluation approval edit"], badge: "evaluation_approvals" },
      { label: "age_ranges.evaluation_page", to: { name: "evaluation-age-ranges" }, perm: "evaluation age ranges edit" },
      { text: "Side profile", to: { name: "SideProfiles" }, perm: "side profiles list" },
      { text: "ABLLS Academy", to: { name: "ablls" }, perm: "able category list" },
      { text: "Ablls OT", to: { name: "ablls-skills" }, perm: "skills category list" },
      { text: "carolina", to: { name: "carolina-general-goals" }, perm: "carolina general goal list" },
      {
        key: "vb-mapp",
        text: "VB Mapp",
        children: [
          { text: "Milestones", to: { name: "levels" }, perm: "milestone level list" },
          { text: "Barriers", to: { name: "barrier-subtest" }, perm: "barrier subtest list" },
          { text: "Transition", to: { name: "transition-questions" }, perm: "transition question list" },
        ],
      },
    ],
  },
  {
    key: "evaluation-reports",
    icon: "mdi-file-chart-outline",
    label: "ereport.menu",
    to: { name: "evaluation-reports" },
    perm: "evaluation reports list",
  },
  {
    key: "therapeutic",
    icon: "mdi-doctor",
    label: "Therapeutic",
    children: [
      { label: "student_programe", to: { name: "student-programe" }, perm: "student program list" },
      { label: "sessions", to: { name: "sessions" }, perm: "sessions list" },
      { label: "session_log", to: { name: "session-log" }, perm: "session log list" },
      // `badge`: the pending count shown beside the entry (utils/pendingCounts.js).
      { label: "ereport.tracking_approvals", to: { name: "tracking-approvals" }, perm: ["tracking approval list", "tracking approval edit"], badge: "tracking_approvals" },
      { label: "gen_requests_title", to: { name: "goal-generalizations" }, perm: ["goal generalization list", "goal generalization edit"], badge: "goal_generalizations" },
      { label: "gen_inbox_title", to: { name: "my-generalizations" }, badge: "my_generalizations" },
      { label: "program_logs", to: { name: "student-program-logs" }, perm: "student program log list" },
      { label: "program_fees", to: { name: "program-fees" }, perm: "program fees edit" },
      { label: "program_hours", to: { name: "program-hours" }, perm: "program hours edit" },
    ],
  },
  {
    key: "accounting",
    icon: "mdi-cash-multiple",
    label: "acc.menu",
    children: [
      { label: "acc.dashboard", to: { name: "accounting" }, perm: "accounting list" },
      { label: "acc.programs", to: { name: "accounting-programs" }, perm: "accounting list" },
      { label: "acc.evaluations", to: { name: "accounting-evaluations" }, perm: "accounting list" },
      { label: "acc.accounts", to: { name: "accounting-accounts" }, perm: "accounting list" },
      { label: "acc.payments", to: { name: "accounting-payments" }, perm: "accounting list" },
      { label: "acc.charges", to: { name: "accounting-charges" }, perm: "accounting list" },
      { label: "acc.credits", to: { name: "accounting-credits" }, perm: "accounting list" },
      { label: "acc.reports.title", to: { name: "accounting-reports" }, perm: "accounting reports list" },
      { label: "acc.settings", to: { name: "accounting-settings" }, perm: "accounting settings edit" },
    ],
  },
  {
    key: "rooms",
    icon: "mdi-door-open",
    label: "room",
    children: [
      { label: "room", to: { name: "Rooms" }, perm: "room list" },
      { label: "activities.title", to: { name: "activities" }, perm: ["activities list", "room activities list", "room activities edit"] },
    ],
  },
  {
    key: "consulting",
    icon: "mdi-calendar",
    label: "consulting",
    children: [
      { label: "bookings", to: { name: "ShowBooking" }, perm: "bookings list" },
      { label: "required_evaluations", to: { name: "required-evaluations" }, perm: "required evaluations list" },
      { label: "consultant_children", to: { name: "consultant-children" }, perm: ["consultant children list", "child list"] },
      { label: "Consultation_Settings", to: { name: "recommendations" }, perm: "consultation settings list" },
      { label: "Working_hours", to: { name: "working-hours" }, perm: "working hours list" },
    ],
  },
  {
    key: "site",
    icon: "mdi-cog-outline",
    label: "Settings",
    children: [
      { label: "Pages", to: { name: "pages" }, perm: "pages list" },
      { label: "Settings", to: { name: "settings" }, perm: "settings list" },
      { label: "ai.menu", to: { name: "ai-assistant" }, perm: ["ai assistant list", "ai assistant edit"] },
    ],
  },
  {
    key: "custom-files",
    icon: "mdi-message-question-outline",
    label: "custom_files",
    children: [
      { label: "custom_files", to: { name: "custom-files" }, perm: "modules create" },
      { label: "module", to: { name: "module" }, perm: "modules list" },
    ],
  },
  {
    key: "inputs",
    icon: "mdi-apps",
    label: "inputs",
    children: [
      { label: "skills", to: { name: "skills" }, perm: "skills list" },
      { label: "area", to: { name: "regin" }, perm: "region list" },
      { label: "veciles", to: { name: "transportation" }, perm: "vehicle list" },
      { label: "student_tans", to: { name: "student-transportation" }, perm: "student transportation list" },
      { label: "transportation_schedule", to: { name: "transportation-schedule" }, perm: "transportation schedule list" },
      { label: "Typetreatment", to: { name: "treatments-type" }, perm: "treatment list" },
    ],
  },
  {
    key: "hr",
    icon: "mdi-account-group-outline",
    label: "hr",
    children: [
      {
        label: "leaves",
        perm: ["leaves list", "leave balance list", "leave setup list"],
        to: () => ({ name: can("leaves list") ? "leaves" : can("leave balance list") ? "leave-balance" : "leave-setup" }),
      },
      { label: "daily_attendance_report", to: { name: "daily-attendance" }, perm: "attendance list" },
      { label: "Settings", to: { name: "setting" }, perm: "hr settings list" },
      {
        label: "deductions",
        perm: ["deduction list", "deduction type list"],
        to: () => ({ name: can("deduction list") ? "deduction" : "deduction-types" }),
      },
      { label: "holidays", to: { name: "holidays" }, perm: "holidays list" },
      { label: "official_leaves", to: { name: "official-leaves" }, perm: "official leave list" },
      { label: "payroll", to: { name: "payroll" }, perm: "payroll list" },
      { label: "bonus", to: { name: "bonus" }, perm: "bonus list" },
      { label: "departments", to: { name: "departments" }, perm: "department list" },
      { label: "posttion", to: { name: "posttion" }, perm: "positions list" },
      { label: "events", to: { name: "event" }, perm: "events list" },
      { label: "shift", to: { name: "shift" }, perm: "shifts list" },
      { label: "advance", to: { name: "advance" }, perm: "financial advance list" },
      { label: "reports", to: { name: "reports" }, perm: "reports list" },
    ],
  },
  { key: "notifications", icon: "mdi-bell", label: "notification", to: { name: "notification" }, perm: "notifications list" },
];

/** Drops entries the user may not open, and groups left without any entry. */
export const visibleMenu = (items) =>
  items
    .map((item) => {
      if (item.children) {
        const children = visibleMenu(item.children);
        return children.length ? { ...item, children } : null;
      }
      if (item.perm && !can(item.perm)) return null;
      return { ...item, to: typeof item.to === "function" ? item.to() : item.to };
    })
    .filter(Boolean);
