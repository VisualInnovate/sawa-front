// Dashboard side menu (same groups, icons and titles as the original Vuetify drawer).
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
    icon: "mdi-shield-account",
    label: "Adminstration",
    children: [
      { label: "Employees", to: { name: "Employees" }, perm: "employees list" },
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
    key: "evaluations",
    icon: "mdi-help-box-multiple-outline",
    label: "evaluations",
    children: [
      { text: "Side profile", to: { name: "SideProfiles" }, perm: "side profiles list" },
      { text: "ablls", to: { name: "ablls" }, perm: "able category list" },
      { text: "carolina", to: { name: "agerange" }, perm: "carolina age range list" },
      {
        key: "vb-mapp",
        text: "VB Mapp",
        children: [
          { text: "Milestones", to: { name: "levels" }, perm: "milestone level list" },
          { text: "Barriers", to: { name: "barrier-subtest" }, perm: "barrier subtest list" },
        ],
      },
    ],
  },
  {
    key: "therapeutic",
    icon: "mdi-doctor",
    label: "Therapeutic",
    children: [
      { label: "addTherapeutic", to: { name: "AllTherapeutic" }, perm: "program list" },
      { label: "student_programe", to: { name: "student-programe" }, perm: "student program list" },
      { label: "sessions", to: { name: "sessions" }, perm: "sessions list" },
    ],
  },
  {
    key: "rooms",
    icon: "mdi-bed",
    label: "room",
    children: [{ label: "room", to: { name: "Rooms" }, perm: "room list" }],
  },
  {
    key: "consulting",
    icon: "mdi-calendar",
    label: "consulting",
    children: [
      { label: "bookings", to: { name: "ShowBooking" }, perm: "bookings list" },
      { label: "Consultation_Settings", to: { name: "recommendations" }, perm: "consultation settings list" },
      { label: "Working_hours", to: { name: "working-hours" }, perm: "working hours list" },
    ],
  },
  {
    key: "site",
    icon: "mdi-wrench",
    label: "Settings",
    children: [
      { label: "Pages", to: { name: "pages" }, perm: "pages list" },
      { label: "Settings", to: { name: "settings" }, perm: "settings list" },
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
    icon: "mdi-bed",
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
