// users


const usersRoutes = [
  {
    path: "/profile",
    name: "profile-deltails",
    component: ()=>import("../views/users/proflie.vue"),

  },
  // The former profile tabs keep their existing access and data scope.
  {
    path: "/my-evaluations",
    name: "my-evaluations",
    component: () => import("../views/users/Evaluations.vue"),
  },
  {
    path: "/my-evaluation-results",
    name: "my-evaluation-results",
    component: () => import("../views/users/EvaluationResults.vue"),
  },
  // «جدولي»: every employee's own week, no permission needed.
  {
    path: "/my-schedule",
    name: "my-schedule",
    component: () => import("../views/schedules/MySchedule.vue"),
  },
  // «جداول الموظفين»: every employee's week.
  {
    path: "/staff-schedules",
    name: "staff-schedules",
    meta: { permission: ["staff schedules list"] },
    component: () => import("../views/schedules/StaffSchedules.vue"),
  },
];

export default {
  ...usersRoutes,
};
