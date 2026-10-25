// roles

const Index = () => import("@/views/roles/Index.vue");
const Show = () => import("@/views/roles/Show.vue");
const Create = () => import("@/views/roles/Create.vue");

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
];

export default {
  ...rolesRoutes,
};
