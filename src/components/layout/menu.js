// Dashboard navigation. Sections in AdminSidebar group these permitted entries.
// `label` is an i18n key; `text` is shown as-is (evaluation names stay English).
// `perm` is one permission or a list (any of them); `to` may depend on the permissions the user has.
import { can, homeRoute, onlyBusSupervisor } from "@/utils/permissions";
import { approver } from "@/utils/approver";
import { interviewer } from "@/utils/interviewer";

export const buildMenu = () => [
  {
    key: "home",
    icon: "mdi-home",
    label: { dashbord: "dashbored", "bus-trips": "tr.my_trips" }[homeRoute().name] ?? "home",
    to: homeRoute(),
    // «ما ينتظرك» (on the welcome page and on top of the dashboard): everything waiting for me.
    badge: "my_tasks",
  },

  // ===== «مساحتي»: the employee's own work =====
  // «التواصل»: chats, groups, voice and video calls.
  { key: "communication", icon: "mdi-forum-outline", label: "comm.menu", to: { name: "communication" }, badge: "unread_messages", show: () => !onlyBusSupervisor() },
  { key: "my-schedule", icon: "mdi-calendar-account-outline", label: "sch.my_title", to: { name: "my-schedule" }, show: () => !onlyBusSupervisor() },
  // «معاملاتي المعلّقة»: what waits for my approval in the approval flows, and my delegations.
  { key: "approvals-inbox", icon: "mdi-inbox-arrow-down-outline", label: "apf.inbox", to: { name: "approvals-inbox" }, show: () => !onlyBusSupervisor() },
  // The leaves waiting for a department head / HR (shown only to them).
  { key: "approvals", icon: "mdi-check-decagram-outline", label: "lflow.approvals", to: { name: "approvals" }, show: () => approver.is },
  { key: "my-evaluations", icon: "mdi-clipboard-list-outline", label: "evaluation_order", to: { name: "my-evaluations" }, show: () => !onlyBusSupervisor() },
  // My evaluations the management sent back (rejected with a reason).
  { key: "my-evaluation-results", icon: "mdi-chart-box-outline", label: "evaluation_results", to: { name: "my-evaluation-results" }, badge: "my_rejected_evaluations", show: () => !onlyBusSupervisor() },
  { key: "my-generalizations", icon: "mdi-share-variant-outline", label: "gen_inbox_title", to: { name: "my-generalizations" }, badge: "my_generalizations", show: () => !onlyBusSupervisor() },
  // The candidates sent to a department head for a decision and an interview (shown to HR and to the heads).
  { key: "my-interviews", icon: "mdi-account-tie-voice-outline", label: "crv.title", to: { name: "candidate-reviews" }, show: () => interviewer.is },
  // «رحلاتي»: the bus supervisor's trips (for him alone it is the home entry instead).
  { key: "bus-trips", icon: "mdi-bus-school", label: "tr.my_trips", to: { name: "bus-trips" }, perm: "bus supervisor list", show: () => !onlyBusSupervisor() },

  // ===== «الأطفال والبرامج»: the child's way through the academy =====
  {
    key: "parents",
    icon: "mdi-human-male-boy",
    label: "mnu.parents",
    children: [
      { label: "rcp.menu", to: { name: "reception" }, perm: ["parents create", "parent registration review edit"] },
      { label: "adm.menu", to: { name: "admissions" }, perm: ["admissions list", "parent contracts create"] },
      { label: "parents", to: { name: "Parents" }, perm: "parents list" },
      { label: "children", to: { name: "Children" }, perm: "child list" },
      { label: "meetings", to: { name: "parent-meeting" }, perm: "parent meetings list" },
      { label: "pfb.menu", to: { name: "admin-parent-feedback" }, perm: "parent feedback list" },
      { label: "con.menu", to: { name: "parent-contracts" }, perm: "parent contracts list" },
      { label: "ct.menu", to: { name: "contract-templates" }, perm: "contract templates list" },
    ],
  },
  {
    key: "consulting",
    icon: "mdi-calendar",
    label: "consulting",
    children: [
      { label: "bookings", to: { name: "ShowBooking" }, perm: "bookings list" },
      { label: "consultant_children", to: { name: "consultant-children" }, perm: ["consultant children list", "child list"] },
      { label: "required_evaluations", to: { name: "required-evaluations" }, perm: "required evaluations list" },
      { label: "Working_hours", to: { name: "working-hours" }, perm: "working hours list" },
      { label: "Consultation_Settings", to: { name: "recommendations" }, perm: "consultation settings list" },
    ],
  },
  {
    key: "evaluations",
    icon: "mdi-help-box-multiple-outline",
    label: "evaluations",
    children: [
      { label: "ea_title", to: { name: "evaluation-approvals" }, perm: ["evaluation approval list", "evaluation approval edit"], badge: "evaluation_approvals" },
      { label: "ewf.distribution", to: { name: "evaluation-distribution" }, perm: ["evaluation approval edit", "evaluation approval list"] },
      { label: "ereport.menu", to: { name: "evaluation-reports" }, perm: "evaluation reports list" },
      { label: "oa.title", to: { name: "outcomes-analysis" }, perm: "outcomes analysis list" },
      {
        key: "evaluation-tools",
        label: "mnu.eval_tools",
        children: [
          { text: "Side profile", to: { name: "SideProfiles" }, perm: "side profiles list" },
          { text: "ABLLS Academy", to: { name: "ablls" }, perm: "able category list" },
          { text: "Ablls OT", to: { name: "ablls-skills" }, perm: "skills category list" },
          { text: "Ablls SP", to: { name: "ablls-sp" }, perm: "sp category list" },
          { text: "carolina", to: { name: "carolina-general-goals" }, perm: "carolina general goal list" },
          { text: "VB-MAPP Milestones", to: { name: "levels" }, perm: "milestone level list" },
          { text: "VB-MAPP Barriers", to: { name: "barrier-subtest" }, perm: "barrier subtest list" },
          { text: "VB-MAPP Transition", to: { name: "transition-questions" }, perm: "transition question list" },
          { label: "mchat.menu", to: { name: "mchat-settings" }, perm: ["mchat question list", "mchat question edit"] },
          { label: "qfba.menu", to: { name: "qfba-settings" }, perm: ["qfba question list", "qfba question edit"] },
          { label: "sensory.menu", to: { name: "sensory-settings" }, perm: ["sensory question list", "sensory question edit"] },
          { label: "elm.menu", to: { name: "elm-settings" }, perm: ["elm question list", "elm question create", "elm question edit", "elm question delete"] },
        ],
      },
      {
        key: "evaluation-settings",
        label: "mnu.eval_settings",
        children: [
          { label: "eval_dept.page", to: { name: "evaluation-departments" }, perm: "evaluation departments edit" },
          { label: "age_ranges.evaluation_page", to: { name: "evaluation-age-ranges" }, perm: "evaluation age ranges edit" },
          { label: "eval_desc.page", to: { name: "evaluation-descriptions" }, perm: "evaluation descriptions edit" },
        ],
      },
    ],
  },
  {
    key: "therapeutic",
    icon: "mdi-doctor",
    label: "mnu.programs",
    children: [
      { label: "student_programe", to: { name: "student-programe" }, perm: "student program list" },
      { label: "sessions", to: { name: "sessions" }, perm: "sessions list" },
      { label: "session_log", to: { name: "session-log" }, perm: "session log list" },
      // `badge`: the pending count shown beside the entry (utils/pendingCounts.js).
      { label: "ereport.tracking_approvals", to: { name: "tracking-approvals" }, perm: ["tracking approval list", "tracking approval edit"], badge: "tracking_approvals" },
      { label: "gen_requests_title", to: { name: "goal-generalizations" }, perm: ["goal generalization list", "goal generalization edit"], badge: "goal_generalizations" },
      { label: "toilet.menu", to: { name: "toilet-programs" }, perm: "toilet program list" },
      { label: "toilet.consults_menu", to: { name: "toilet-consults" }, perm: ["toilet behavior consult edit", "toilet speech consult edit"], badge: "toilet_consults" },
      { label: "feeding.menu", to: { name: "feeding" }, perm: "feeding list" },
      { label: "cl.title", to: { name: "concepts-library" }, perm: "concepts library list" },
      { label: "program_logs", to: { name: "student-program-logs" }, perm: "student program log list" },
      {
        key: "program-settings",
        label: "mnu.program_settings",
        children: [
          { label: "program_fees", to: { name: "program-fees" }, perm: "program fees edit" },
          { label: "program_hours", to: { name: "program-hours" }, perm: "program hours edit" },
          { label: "Typetreatment", to: { name: "treatments-type" }, perm: "treatment list" },
          { label: "skills", to: { name: "skills" }, perm: "skills list" },
        ],
      },
    ],
  },
  {
    key: "rooms",
    icon: "mdi-door-open",
    label: "mnu.rooms",
    children: [
      { label: "room", to: { name: "Rooms" }, perm: "room list" },
      { label: "activities.title", to: { name: "activities" }, perm: ["activities list", "room activities list", "room activities edit"] },
    ],
  },
  {
    key: "transport",
    icon: "mdi-bus-multiple",
    label: "mnu.transport",
    children: [
      { label: "trq.menu", to: { name: "transport-requests" }, perm: ["transport requests list", "transport requests create"] },
      { label: "student_tans", to: { name: "student-transportation" }, perm: "student transportation list" },
      { label: "transportation_schedule", to: { name: "transportation-schedule" }, perm: "transportation schedule list" },
      { label: "tr.weekly_title", to: { name: "transport-weekly-trips" }, perm: "transportation schedule list" },
      { label: "tr.log_title", to: { name: "transport-trip-log" }, perm: ["child list", "parents list", "transportation schedule list"] },
      { label: "veciles", to: { name: "transportation" }, perm: "vehicle list" },
      { label: "area", to: { name: "regin" }, perm: "region list" },
    ],
  },

  // ===== «الإدارة»: money, people, structure, settings =====
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
      { label: "jr.title", to: { name: "accounting-journal" }, perm: "accounting journal list" },
      { label: "acc.settings", to: { name: "accounting-settings" }, perm: "accounting settings edit" },
    ],
  },
  {
    key: "hr",
    icon: "mdi-account-group-outline",
    label: "hr",
    children: [
      { label: "Employees", to: { name: "Employees" }, perm: "employees list" },
      { label: "sch.title", to: { name: "staff-schedules" }, perm: "staff schedules list" },
      { label: "doctors", to: { name: "doctors" }, perm: "doctor list" },
      {
        key: "hr-attendance",
        label: "mnu.hr_attendance",
        children: [
          { label: "daily_attendance_report", to: { name: "daily-attendance" }, perm: "attendance list" },
          {
            label: "leaves",
            perm: ["leaves list", "leave balance list", "leave setup list"],
            to: () => ({ name: can("leaves list") ? "leaves" : can("leave balance list") ? "leave-balance" : "leave-setup" }),
          },
          { label: "official_leaves", to: { name: "official-leaves" }, perm: "official leave list" },
          { label: "holidays", to: { name: "holidays" }, perm: "holidays list" },
          { label: "shift", to: { name: "shift" }, perm: "shifts list" },
          { label: "events", to: { name: "event" }, perm: "events list" },
        ],
      },
      {
        key: "hr-pay",
        label: "mnu.hr_pay",
        children: [
          { label: "payroll", to: { name: "payroll" }, perm: "payroll list" },
          { label: "hrpay.overtime", to: { name: "overtime" }, perm: "overtime list" },
          { label: "bonus", to: { name: "bonus" }, perm: "bonus list" },
          { label: "advance", to: { name: "advance" }, perm: "financial advance list" },
          {
            label: "deductions",
            perm: ["deduction list", "deduction type list", "deduction rules list"],
            to: () => ({ name: can("deduction list") ? "deduction" : can("deduction type list") ? "deduction-types" : "deduction-rules" }),
          },
          { label: "dobj.title", to: { name: "deduction-objections" }, perm: "deduction edit" },
        ],
      },
      {
        key: "hr-hiring",
        label: "mnu.hr_hiring",
        children: [
          { label: "vac.title", to: { name: "vacancies" }, perm: ["vacancies list", "vacancies create", "vacancies edit"] },
          { label: "cand.title", to: { name: "candidates" }, perm: "candidates list" },
          { label: "icr.title", to: { name: "interview-criteria" }, perm: ["hr lists list", "hr lists edit"] },
          { label: "onb.title", to: { name: "onboarding" }, perm: ["onboarding list", "onboarding edit"] },
        ],
      },
      {
        key: "hr-contracts",
        label: "mnu.hr_contracts",
        children: [
          { label: "ect.menu", to: { name: "employee-contracts" }, perm: ["contracts list", "employee contract approval edit", "employee contract signing edit"] },
          { label: "ctr.title", to: { name: "contracts" }, perm: "contracts list" },
          { label: "ect.templates", to: { name: "employee-contract-templates" }, perm: "contracts list" },
        ],
      },
      { label: "rep.title", to: { name: "hr-reports" }, perm: "reports list" },
      { label: "hrlog.title", to: { name: "hr-log" }, perm: "hr log list" },
      { label: "Settings", to: { name: "setting" }, perm: ["hr settings list", "hr settings edit", "hr country edit", "hr lists list"] },
    ],
  },
  {
    key: "admin",
    icon: "mdi-sitemap-outline",
    label: "mnu.structure",
    children: [
      { label: "org.menu", to: { name: "org-structure" }, perm: ["org structure list", "org structure edit"] },
      { label: "departments", to: { name: "departments" }, perm: "department list" },
      { label: "posttion", to: { name: "posttion" }, perm: "positions list" },
      { label: "roles", to: { name: "Roles" }, perm: "roles list" },
      { label: "permissions", to: { name: "permissions" }, perm: "permissions list" },
      { label: "apf.flows_title", to: { name: "approval-flows" }, perm: ["approval flows list", "approval flows edit", "org working hours edit"] },
      { label: "stc.menu", to: { name: "structure-conflicts" }, perm: ["org structure list", "org structure edit"] },
      { label: "org.log_menu", to: { name: "structure-log" }, perm: "structure log list" },
    ],
  },
  { key: "notifications", icon: "mdi-bell-ring-outline", label: "notification", to: { name: "notification" }, perm: "notifications list" },
  {
    key: "site",
    icon: "mdi-cog-outline",
    label: "Settings",
    children: [
      { label: "mnu.site_settings", to: { name: "settings" }, perm: "settings list" },
      { label: "ai.menu", to: { name: "ai-assistant" }, perm: ["ai assistant list", "ai assistant edit"] },
      { label: "cset.menu", to: { name: "communication-settings" }, perm: ["communication settings list", "communication settings edit"] },
    ],
  },
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
      if (item.show && !item.show()) return null;
      return { ...item, to: typeof item.to === "function" ? item.to() : item.to };
    })
    .filter(Boolean);
