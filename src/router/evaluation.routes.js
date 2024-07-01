// permissions

const Index = () => import("../views/evaluations/Index.vue");
const Show = () => import("../views/evaluations/Show.vue");
const Edit = () => import("../views/evaluations/Edit.vue");
const Create = () => import("../views/evaluations/Create.vue");

const evaluationRoutes = [
  {
    path: "evaluations",
    name: "Evaluations",
    component: Index,
  },
  // create
  {
    path: "evaluations/create/:sideProfile_id",
    name: "CreateEvaluations",
    component: Create,
  },
  // show
  {
    path: "evaluations/:id",
    name: "ShowEvaluations",
    component: Show,
  },
  // edit
  {
    path: "evaluations/:id/edit",
    name: "EditEvaluations",
    component: Edit,
  },
  // ablls && missions
  {
    path: '/ablls', // Define the path for your addRoom route
    name: 'ablls',
    component: () => import("../views/ablls/index.vue")
  },
  {
    path: '/missions', // Define the path for your addRoom route
    name: 'missions',
    component: () => import("../views/ablls/missions.vue")
  },
  {
    path: '/mission-create', // Define the path for your addRoom route
    name: 'mission-create',
    component: () => import("../views/ablls/mission-create.vue")
  },
  {
    path: '/mission-update/:id', // Define the path for your addRoom route
    name: 'mission-update',
    component: () => import("../views/ablls/mission-update.vue")
  },
  {
    path: '/mission-test/:id', // Define the path for your addRoom route
    name: 'mission-test',
    component: () => import("../views/ablls/mission-test.vue")
  },
  {
    path: '/ablls-resulte/:id', // Define the path for your addRoom route
    name: 'ablls-resulte',
    component: () => import("../views/ablls/ablls-resulte.vue")
  },
  {
    path: '/agerange', // Define the path for your addRoom route
    name: 'agerange',
    component: () => import("../views/carolina/agerange-index.vue")
  },
  {
    path: '/agerange-update/:id', // Define the path for your addRoom route
    name: 'agerange-update',
    component: () => import("../views/carolina/agerange-update.vue")
  },
  {
    path: '/answer_type', // Define the path for your addRoom route
    name: 'answer_type',
    component: () => import("../views/carolina/answer-type.vue")
  },
  {
    path: '/agerange-create', // Define the path for your addRoom route
    name: 'agerange-create',
    component: () => import("../views/carolina/agerange-create.vue")
  },
  {
    path: '/category', // Define the path for your addRoom route
    name: 'category',
    component: () => import("../views/carolina/category-index.vue")
  },
  {
    path: '/test', // Define the path for your addRoom route
    name: 'test',
    component: () => import("../views/carolina/test-index.vue")
  },
  {
    path: '/carolina-test/:id', // Define the path for your addRoom route
    name: 'carolina-test',
    component: () => import("../views/carolina/carolina-test.vue")
  },
  {
    path: '/carolina-resulte/:id', // Define the path for your addRoom route
    name: 'carolina-resulte',
    component: () => import("../views/carolina/caroline-resulte.vue")
  },


];

export default {
  ...evaluationRoutes,
};
