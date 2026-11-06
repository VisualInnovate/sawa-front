// roles

const Index = () => import("@/views/roles/Index.vue");
const Show = () => import("@/views/roles/Show.vue");
const Create = () => import("@/views/roles/Create.vue");
const OrgStructure = () => import("@/views/org/OrgStructure.vue");
const StructureLog = () => import("@/views/org/StructureLog.vue");
const ApprovalFlows = () => import("@/views/approvals/ApprovalFlows.vue");
const ApprovalsInbox = () => import("@/views/approvals/ApprovalsInbox.vue");

const rolesRoutes = [
  {
    path: "roles",
    name: "Roles",
    meta: { permission: ["roles list"] },
    component: Index,
  },
  // create
  {
    path: "roles/create",
    name: "CreateRole",
    meta: { permission: ["roles create"] },
    component: Create,
  },
  // show
  {
    path: "roles/:id",
    name: "ShowRole",
    meta: { permission: ["roles edit"] },
    component: Show,
  },
  // The org tree (departments' heads and deputies, positions) and the structure's change log.
  {
    path: "org-structure",
    name: "org-structure",
    meta: { permission: ["org structure list", "org structure edit"] },
    component: OrgStructure,
  },
  {
    path: "structure-log",
    name: "structure-log",
    meta: { permission: ["structure log list"] },
    component: StructureLog,
  },
  // The approval flows (phase 3) and what waits for my approval (every signed-in user).
  {
    path: "approval-flows",
    name: "approval-flows",
    meta: { permission: ["approval flows list", "approval flows edit", "org working hours edit"] },
    component: ApprovalFlows,
  },
  {
    path: "approvals-inbox",
    name: "approvals-inbox",
    component: ApprovalsInbox,
  },
];

export default {
  ...rolesRoutes,
};
