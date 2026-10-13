// permissions

const Index = () => import("../views/evaluations/Index.vue");
const Show = () => import("../views/evaluations/Show.vue");
const Edit = () => import("../views/evaluations/Edit.vue");
const Create = () => import("../views/evaluations/Create.vue");

const evaluationRoutes = [
  {
    path: "evaluations",
    name: "Evaluations",
    meta: { permission: ["evaluations list"] },
    component: Index,
  },
  // create
  {
    path: "evaluations/create/:sideProfile_id",
    name: "CreateEvaluations",
    meta: { permission: ["evaluations create"] },
    component: Create,
  },
  // show
  {
    path: "evaluations/:id",
    name: "ShowEvaluations",
    meta: { permission: ["evaluation results create"] },
    component: Show,
  },
  // edit
  {
    path: "evaluations/:id/edit",
    name: "EditEvaluations",
    meta: { permission: ["evaluations edit"] },
    component: Edit,
  },
  // Evaluation reports: children with finished evaluations -> choose evaluations -> report editor (full page, outside the layout).
  {
    path: 'evaluation-reports',
    name: 'evaluation-reports',
    meta: { permission: ["evaluation reports list"] },
    component: () => import("../views/reports/index.vue")
  },
  // ablls && missions
  {
    path: '/ablls', // Define the path for your addRoom route
    name: 'ablls',
    meta: { permission: ["able category list"] },
    component: () => import("../views/ablls/index.vue")
  },
  {
    path: '/missions', // Define the path for your addRoom route
    name: 'missions',
    meta: { permission: ["able mission list"] },
    component: () => import("../views/ablls/missions.vue")
  },
  {
    path: '/mission-create', // Define the path for your addRoom route
    name: 'mission-create',
    meta: { permission: ["able mission create"] },
    component: () => import("../views/ablls/mission-create.vue")
  },
  {
    path: '/mission-update/:id', // Define the path for your addRoom route
    name: 'mission-update',
    meta: { permission: ["able mission edit"] },
    component: () => import("../views/ablls/mission-update.vue")
  },
  {
    path: '/mission-test/:id', // Define the path for your addRoom route
    name: 'mission-test',
    meta: { permission: ["able answer create"] },
    component: () => import("../views/ablls/mission-test.vue")
  },
  {
    path: '/ablls-resulte/:id', // Define the path for your addRoom route
    name: 'ablls-resulte',
    meta: { permission: ["able answer list"] },
    component: () => import("../views/ablls/ablls-resulte.vue")
  },
  {
    path: '/agerange', // Define the path for your addRoom route
    name: 'agerange',
    meta: { permission: ["carolina age range list"] },
    component: () => import("../views/carolina/agerange-index.vue")
  },
  {
    path: '/answer_type', // Define the path for your addRoom route
    name: 'answer_type',
    meta: { permission: ["carolina answer type list"] },
    component: () => import("../views/carolina/answer-type.vue")
  },
  {
    path: '/carolina-symbols',
    name: 'carolina-symbols',
    meta: { permission: ["carolina symbol list"] },
    component: () => import("../views/carolina/symbols.vue")
  },
  {
    path: '/carolina-skills',
    name: 'carolina-skills',
    meta: { permission: ["carolina skill list"] },
    component: () => import("../views/carolina/skills.vue")
  },
  {
    path: '/carolina-general-goals',
    name: 'carolina-general-goals',
    meta: { permission: ["carolina general goal list"] },
    component: () => import("../views/carolina/general-goals.vue")
  },
  {
    path: '/carolina-test/:id', // Define the path for your addRoom route
    name: 'carolina-test',
    meta: { permission: ["carolina answer create"] },
    component: () => import("../views/carolina/carolina-test.vue")
  },
  {
    path: '/carolina-resulte/:id', // Define the path for your addRoom route
    name: 'carolina-resulte',
    meta: { permission: ["carolina answer list"] },
    component: () => import("../views/carolina/caroline-resulte.vue")
  },


];

export default {
  ...evaluationRoutes,
};
