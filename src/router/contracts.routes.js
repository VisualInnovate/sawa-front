// «قوالب العقود»: the parents' contract templates, written with {{variables}}.
const contracts = [
  { path: "/contract-templates", name: "contract-templates", meta: { permission: ["contract templates list"] }, component: () => import("../views/contracts/Templates.vue") },
  { path: "/contract-templates/new", name: "contract-template-new", meta: { permission: ["contract templates create"] }, component: () => import("../views/contracts/TemplateEdit.vue") },
  { path: "/contract-templates/:id", name: "contract-template-edit", meta: { permission: ["contract templates edit"] }, component: () => import("../views/contracts/TemplateEdit.vue") },
  // «العقود»: contracts issued to parents from the templates.
  { path: "/parent-contracts", name: "parent-contracts", meta: { permission: ["parent contracts list"] }, component: () => import("../views/contracts/Contracts.vue") },
  { path: "/parent-contracts/:id", name: "parent-contract", meta: { permission: ["parent contracts list"] }, component: () => import("../views/contracts/Contract.vue") },
  // The employees' documents (offer letter, work contract, amendment) and their templates, on the same pages.
  { path: "/employee-contract-templates", name: "employee-contract-templates", meta: { permission: ["contracts list"], audience: "employee" }, component: () => import("../views/contracts/Templates.vue") },
  { path: "/employee-contract-templates/new", name: "employee-contract-template-new", meta: { permission: ["contracts create"], audience: "employee" }, component: () => import("../views/contracts/TemplateEdit.vue") },
  { path: "/employee-contract-templates/:id", name: "employee-contract-template-edit", meta: { permission: ["contracts edit"], audience: "employee" }, component: () => import("../views/contracts/TemplateEdit.vue") },
  { path: "/employee-contracts", name: "employee-contracts", meta: { permission: ["contracts list", "employee contract approval edit", "employee contract signing edit"] }, component: () => import("../views/hr/employee-contracts/index.vue") },
  { path: "/employee-contracts/:id", name: "employee-contract", meta: { permission: ["contracts list", "employee contract approval edit", "employee contract signing edit"], audience: "employee" }, component: () => import("../views/contracts/Contract.vue") },
];

export default {
  ...contracts,
};
