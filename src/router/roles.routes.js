// roles

const Index = () => import("@/views/roles/Index.vue");
const Show = () => import("@/views/roles/Show.vue");
const Edit = () => import("@/views/roles/Edit.vue");
const Create = () => import("@/views/roles/Create.vue");
const UserRoles = () => import("@/views/roles/UserRoles.vue");
const RolesUsers = () => import("@/views/roles/RolesUsers.vue");
const UserRoleDelete = () => import("@/views/roles/UserRoleDelete.vue");

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
  // edit
  {
    path: "roles/:id/edit",
    name: "EditRole",
    meta: { permission: ["roles edit"] },
    component: Edit,
  },
  {
    path: "roles/users",
    name: "RolesUsers",
    meta: { adminOnly: true },
    component: RolesUsers,
  },
  {
    path: "roles/user/:id/roles",
    name: "UserRole",
    meta: { adminOnly: true },
    component: UserRoles,
    props: true,
  },
  {
    path: "roles/user/:id/roles/sync",
    name: "UserRoleDelete",
    meta: { adminOnly: true },
    component: UserRoleDelete,
    props: true,
  },
];

export default {
  ...rolesRoutes,
};
