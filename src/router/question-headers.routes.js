// permissions

const Index = () => import("../views/QuestionHeaders/Index.vue");
const Show = () => import("../views/QuestionHeaders/Show.vue");
const Edit = () => import("../views/QuestionHeaders/Edit.vue");
const Create = () => import("../views/QuestionHeaders/Create.vue");

const headersRoutes = [
  {
    path: "headers",
    name: "Headers",
    meta: { permission: ["evaluation headers list"] },
    component: Index,
  },
  // create
  {
    path: "headers/create",
    name: "CreateHeaders",
    meta: { permission: ["evaluation headers create"] },
    component: Create,
  },
  // show
  {
    path: "headers/:id",
    name: "ShowHeaders",
    meta: { permission: ["evaluation headers list"] },
    component: Show,
  },
  // edit
  {
    path: "headers/:id/edit",
    name: "EditHeaders",
    meta: { permission: ["evaluation headers edit"] },
    component: Edit,
  },
];

export default {
  ...headersRoutes,
};
