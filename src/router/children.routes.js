// permissions

const Index = () => import("../views/children/Index.vue");
const Show = () => import("../views/children/Show.vue");
const Edit = () => import("../views/children/Edit.vue");
const Create = () => import("../views/children/Create.vue");
const evaluation = () => import("../views/children/ChildEvaluation.vue");
const result = () => import("../views/children/ChildResult.vue");
const editResult = () => import("../views/children/evaluationResultEdit.vue");
const res = () => import("../views/children/Resultr.vue");

const childrenRoutes = [
  {
    path: "children/:alert?",
    name: "Children",
    meta: { permission: ["child list"] },
    component: Index,
  },

  // create
  {
    path: "children/create",
    name: "CreateChildren",
    meta: { permission: ["child create"] },
    component: Create,
  },
  // show
  {
    path: "children/:id",
    name: "ShowChildren",
    meta: { permission: ["child list"] },
    component: Show,
  },
  // edit
  {
    path: "children/:id/edit",
    name: "EditChildren",
    meta: { permission: ["child edit"] },
    component: Edit,
  },
  {
    path: "children/Resultr/:child_id/:sideProfile_id",
    name: "resulte",
    meta: { permission: ["evaluation results list"] },
    component: res,
  },
  {
    path: "children/:child_id/:sideProfile_id",
    name: "showChildEvaluation",
    meta: { permission: ["evaluation results list"] },
    component: evaluation,
  },
  {
    path: "children/:child_id/:sideProfile_id/:evaluation_id",
    name: "showChildResult",
    meta: { permission: ["evaluation results list"] },
    component: result,
  },
  {
    path: 'children-detailes', // Define the path for your addRoom route
    name: 'children-detailes',
    meta: { permission: ["child list"] },
    component: () => import("../views/children/detailes.vue")
  },
  {
    path: 'children-programe', // Define the path for your addRoom route
    name: 'children-programe',
    meta: { permission: ["child list"] },
    component: () => import("../views/children/programe.vue")
  },
  {
    path: 'children-evaluate', // Define the path for your addRoom route
    name: 'children-evaluate',
    meta: { permission: ["child list"] },
    component: () => import("../views/children/evaluate.vue")
  },
  {
    path: 'children-request', // Define the path for your addRoom route
    name: 'children-request',
    meta: { permission: ["child list"] },
    component: () => import("../views/children/requests.vue")
  },
  {
    path: "children/evaluation/:evaluation_result_id",
    name: "editChildResult",
    meta: { permission: ["evaluation results edit"] },
    component: editResult,
  },
];

export default {
  ...childrenRoutes,
};
