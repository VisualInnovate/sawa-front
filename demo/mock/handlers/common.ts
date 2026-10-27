// ما تطلبه كل صفحة في لوحة التحكم: المستخدم وصلاحياته، العدّادات، الإشعارات، العملة، القوائم المساعدة.
import { route } from "../backend";
import { ALL_PERMISSIONS } from "../permissions";

const COUNTRIES = ["السعودية", "الأردن", "الإمارات", "الكويت", "قطر", "البحرين", "عُمان", "مصر", "فلسطين", "سوريا", "لبنان", "العراق", "اليمن", "السودان", "المغرب", "تونس", "الجزائر", "ليبيا"]
  .map((country, i) => ({ id: i + 1, country }));
const LANGS = [{ id: 1, lang: "Arabic", native: "العربية" }, { id: 2, lang: "English", native: "English" }, { id: 3, lang: "French", native: "Français" }, { id: 4, lang: "Urdu", native: "اردو" }];

export const commonRoutes = [
  route("GET", "api/get-user", ({ db }) => ({ user: db.userResource(db.currentStaff()) })),
  route("POST", "api/login", ({ db }) => ({ tokens: "demo-token", user: db.userResource(db.currentStaff()) })),
  route("POST", "api/logout", () => ({ message: "ok" })),
  route("POST", "api/set-language", () => ({ message: "ok" })),
  route("GET", "api/accounting/currency", ({ db }) => ({ data: { currency_symbol: db.settings.currency, currency_name: "ريال", consultation_paid: "0", consultation_price: "0" } })),
  route("GET", "api/pending-counts", ({ db }) => {
    const me = db.currentStaff();
    const perms = db.permissionsOf(me);
    const sees = (r: string) => perms.includes(`${r} list`) || perms.includes(`${r} edit`);
    return { data: {
      tracking_approvals: sees("tracking approval") ? db.trackings.filter((t) => t.status === "pending").length : 0,
      goal_generalizations: sees("goal generalization") ? db.generalizations.filter((g) => g.type === "classes" && g.status === "pending").length : 0,
      my_generalizations: db.generalizations.filter((g) => g.type === "people" && g.recipient_id === me.id && g.status === "pending").length,
      evaluation_approvals: sees("evaluation approval") ? db.evaluations.filter((e) => e.type !== 1 && e.approval_status === "pending").length : 0,
      my_rejected_evaluations: db.evaluations.filter((e) => e.specialist_id === me.id && e.approval_status === "rejected").length,
    } };
  }),
  route("GET", "api/my-notifications", ({ db }) => {
    const list = db.notifications.staff[db.currentStaffId] ?? [];
    return { data: list.slice(0, 30), unread: list.filter((n) => !n.read_at).length };
  }),
  route("POST", "api/my-notifications/read", ({ db }) => {
    (db.notifications.staff[db.currentStaffId] ?? []).forEach((n) => (n.read_at = db.now()));
    return { unread: 0 };
  }),
  route("GET", "api/countries/:lang", () => ({ countries: COUNTRIES })),
  route("GET", "api/countries", () => ({ countries: COUNTRIES })),
  route("GET", "api/languages", () => ({ langs: { ar_en: LANGS.slice(0, 2), other: LANGS.slice(2) } })),
  // المساعد الذكي: معطّل في الديمو (الفقاعة لا تظهر).
  route("GET", "api/assistant/dashboard", () => ({ enabled: false })),
  route("GET", "api/parent/assistant", () => ({ enabled: false })),
  route("GET", "api/assistant/public", () => ({ enabled: false })),
  // الأطفال (لوحة التحكم).
  route("GET", "api/child", ({ db }) => ({ children: db.children })),
  route("GET", "api/permissions", () => ({ data: ALL_PERMISSIONS })),
];
