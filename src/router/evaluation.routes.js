// permissions

const Show = () => import("../views/evaluations/Show.vue");
const Edit = () => import("../views/evaluations/Edit.vue");
const Create = () => import("../views/evaluations/Create.vue");

// A copy of an ABLLS page for Ablls OT: a different component object, so moving between the two evaluations
// mounts the page again instead of reusing it with the other evaluation's settings.
const skillsPage = (load) => () => load().then((module) => ({ ...module.default }));

const evaluationRoutes = [
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
  // «طلبات اعتماد التقييمات»: every evaluation's result waits for the management.
  {
    path: 'evaluation-approvals',
    name: 'evaluation-approvals',
    meta: { permission: ["evaluation approval list", "evaluation approval edit"] },
    component: () => import("../views/evaluations/Approvals.vue")
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
  // Ablls OT: the ABLLS pages with meta.assessment "skills" (its own API, permissions and domain types).
  {
    path: '/ablls-skills',
    name: 'ablls-skills',
    meta: { permission: ["skills category list"], assessment: 'skills' },
    component: skillsPage(() => import("../views/ablls/index.vue"))
  },
  {
    path: '/ablls-skills/missions',
    name: 'skills-missions',
    meta: { permission: ["skills mission list"], assessment: 'skills' },
    component: skillsPage(() => import("../views/ablls/missions.vue"))
  },
  {
    path: '/ablls-skills/mission-create',
    name: 'skills-mission-create',
    meta: { permission: ["skills mission create"], assessment: 'skills' },
    component: skillsPage(() => import("../views/ablls/mission-create.vue"))
  },
  {
    path: '/ablls-skills/mission-update/:id',
    name: 'skills-mission-update',
    meta: { permission: ["skills mission edit"], assessment: 'skills' },
    component: skillsPage(() => import("../views/ablls/mission-update.vue"))
  },
  {
    path: '/ablls-skills/test/:id',
    name: 'skills-test',
    meta: { permission: ["skills answer create"], assessment: 'skills' },
    component: skillsPage(() => import("../views/ablls/mission-test.vue"))
  },
  {
    path: '/ablls-skills/result/:id',
    name: 'skills-result',
    meta: { permission: ["skills answer list"], assessment: 'skills' },
    component: skillsPage(() => import("../views/ablls/ablls-resulte.vue"))
  },
  {
    path: '/agerange', // Define the path for your addRoom route
    name: 'agerange',
    meta: { permission: ["carolina age range list"] },
    component: () => import("../views/carolina/agerange-index.vue")
  },
  {
    path: '/carolina-domains',
    name: 'carolina-domains',
    meta: { permission: ["carolina domain list"] },
    component: () => import("../views/carolina/domains.vue")
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
