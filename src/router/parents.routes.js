// permissions

const Index = () => import("../views/parents/index.vue");
const mettins = () => import("../views/parents/parent-meeting.vue");

const parentsRoutes = [
  {
    path: "parents",
    name: "Parents",
    component: Index,
   
  },
  {
    path: "parent-meeting",
    name: "parent-meeting",
    component: mettins,
   
  },
];

export default {
  ...parentsRoutes,
};
