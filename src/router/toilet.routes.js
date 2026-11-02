// «برنامج الحمام» of the class students, and the departments' recommendations before a program opens.
const toilet = [
  { path: "toilet-programs", name: "toilet-programs", meta: { permission: ["toilet program list"] }, component: () => import("../views/toilet/Programs.vue") },
  { path: "toilet-programs/:id", name: "toilet-program", meta: { permission: ["toilet program list"] }, component: () => import("../views/toilet/Program.vue") },
  { path: "toilet-consults", name: "toilet-consults", meta: { permission: ["toilet behavior consult edit", "toilet speech consult edit"] }, component: () => import("../views/toilet/Consults.vue") },
];

export default {
  ...toilet,
};
