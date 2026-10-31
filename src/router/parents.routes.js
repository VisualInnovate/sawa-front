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
  // «ملاحظات أولياء الأمور»: what parents send from the portal; answered and closed here.
  {
    path: "parent-feedback",
    name: "admin-parent-feedback",
    meta: { permission: ["parent feedback list"] },
    component: () => import("../views/parents/ParentFeedback.vue"),
  },
];

export default {
  ...parentsRoutes,
};
