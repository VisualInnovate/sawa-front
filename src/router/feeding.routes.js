// «برنامج الطعام» of the class students: the daily meals, each child's month and the parents' questionnaire.
const feeding = [
  { path: "feeding", name: "feeding", meta: { permission: ["feeding list"] }, component: () => import("../views/feeding/Feeding.vue") },
  { path: "feeding/children/:id", name: "feeding-child", meta: { permission: ["feeding list"] }, component: () => import("../views/feeding/Child.vue") },
  { path: "feeding/surveys/new", name: "feeding-survey-new", meta: { permission: ["feeding create"] }, component: () => import("../views/feeding/Survey.vue") },
  { path: "feeding/surveys/:id", name: "feeding-survey", meta: { permission: ["feeding list"] }, component: () => import("../views/feeding/Survey.vue") },
];

export default {
  ...feeding,
};
