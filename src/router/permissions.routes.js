// permissions

const Index = () => import("@/views/permissions/index.vue");


const permissionsRoutes = [
  {
    path: "permissions",
    name: "permissions",
    meta: { permission: ["permissions list"] },
    component: Index,
   
  },
  // create
 
];

export default {
  ...permissionsRoutes,
};
