// «المحاسبة»: «accounting list» opens every page; the actions inside check their own permissions.
const view = ["accounting list"];

const accounting = [
  { path: "/accounting", name: "accounting", meta: { permission: view }, component: () => import("../views/accounting/Dashboard.vue") },
  { path: "/accounting/programs", name: "accounting-programs", meta: { permission: view }, component: () => import("../views/accounting/Programs.vue") },
  { path: "/accounting/evaluations", name: "accounting-evaluations", meta: { permission: view }, component: () => import("../views/accounting/Evaluations.vue") },
  { path: "/accounting/accounts", name: "accounting-accounts", meta: { permission: view }, component: () => import("../views/accounting/Accounts.vue") },
  { path: "/accounting/accounts/:child", name: "accounting-statement", meta: { permission: view }, component: () => import("../views/accounting/Statement.vue") },
  { path: "/accounting/payments", name: "accounting-payments", meta: { permission: view }, component: () => import("../views/accounting/Payments.vue") },
  { path: "/accounting/charges", name: "accounting-charges", meta: { permission: view }, component: () => import("../views/accounting/Charges.vue") },
  { path: "/accounting/credits", name: "accounting-credits", meta: { permission: view }, component: () => import("../views/accounting/Credits.vue") },
  { path: "/accounting/settings", name: "accounting-settings", meta: { permission: ["accounting settings edit"] }, component: () => import("../views/accounting/Settings.vue") },
];

export default {
  ...accounting,
};
