// «قوالب العقود»: the parents' contract templates, written with {{variables}}.
const contracts = [
  { path: "/contract-templates", name: "contract-templates", meta: { permission: ["contract templates list"] }, component: () => import("../views/contracts/Templates.vue") },
  { path: "/contract-templates/new", name: "contract-template-new", meta: { permission: ["contract templates create"] }, component: () => import("../views/contracts/TemplateEdit.vue") },
  { path: "/contract-templates/:id", name: "contract-template-edit", meta: { permission: ["contract templates edit"] }, component: () => import("../views/contracts/TemplateEdit.vue") },
  // «العقود»: contracts issued to parents from the templates.
  { path: "/parent-contracts", name: "parent-contracts", meta: { permission: ["parent contracts list"] }, component: () => import("../views/contracts/Contracts.vue") },
  { path: "/parent-contracts/:id", name: "parent-contract", meta: { permission: ["parent contracts list"] }, component: () => import("../views/contracts/Contract.vue") },
];

export default {
  ...contracts,
};
