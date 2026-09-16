// permissions

const Index = () => import("../views/parents/index.vue");
const mettins = () => import("../views/parents/parent-meeting.vue");

const parentsRoutes = [
  {
    path: "parents",
    name: "Parents",
    meta: { permission: ["parents list"] },
    component: Index,
   
  },
  {
    path: "parent-meeting",
    name: "parent-meeting",
    meta: { permission: ["parent meetings list"] },
    component: mettins,
   
  },
];

export default {
  ...parentsRoutes,
};
