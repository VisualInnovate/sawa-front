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
];

export default {
  ...usersRoutes,
};
