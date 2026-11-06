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
  // Phase 5: «مقترحات الإدخال» (programs manager → finance → parents sign → admitted) and «الاستقبال».
  {
    path: "admissions",
    name: "admissions",
    meta: { permission: ["admissions list", "parent contracts create"] },
    component: () => import("../views/admissions/Admissions.vue"),
  },
  {
    path: "reception",
    name: "reception",
    meta: { permission: ["parents create", "parent registration review edit"] },
    component: () => import("../views/admissions/Reception.vue"),
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
