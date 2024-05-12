const vb = [
    {
        path: '/levels', // Define the path for your addRoom route
        name: 'levels',
        component: () => import("../views/vb/levels/index.vue")
      },
      {
        path: '/question-types', // Define the path for your addRoom route
        name: 'question-types',
        component: () => import("../views/vb/QuestionTypes/index.vue")
      },
      {
        path: '/milestone-subtest', // Define the path for your addRoom route
        name: 'milestone-subtest',
        component: () => import("../views/vb/MilestoneSubtest/index.vue")
      },
      {
        path: '/question', // Define the path for your addRoom route
        name: 'question',
        component: () => import("../views/vb/Questions/index.vue")
      },
];


export default {
  ...vb,
};
