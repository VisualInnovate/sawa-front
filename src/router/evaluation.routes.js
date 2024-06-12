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

];

export default {
  ...evaluationRoutes,
};
