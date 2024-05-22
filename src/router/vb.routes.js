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
      {
        path: '/answer', // Define the path for your addRoom route
        name: 'answer',
        component: () => import("../views/vb/Answers/index.vue")
      },
      {
        path: '/answer-create', // Define the path for your addRoom route
        name: 'answer-create',
        component: () => import("../views/vb/Answers/create.vue")
      },
      {
        path: '/answer-update/:id', // Define the path for your addRoom route
        name: 'answer-update',
        component: () => import("../views/vb/Answers/update.vue")
      },

      ////////////////////////barrier  barrier-subtest
      {
        path: '/barrier-subtest', // Define the path for your addRoom route
        name: 'barrier-subtest',
        component: () => import("../views/vb/barrier/subtest/index.vue")
      },
      {
        path: '/barrier-question', // Define the path for your addRoom route
        name: 'barrier-question',
        component: () => import("../views/vb/barrier/Question/index.vue")
      },
      {
        path: '/barrier-answer-type', // Define the path for your addRoom route
        name: 'barrier-answer-type',
        component: () => import("../views/vb/barrier/answer-type/index.vue")
      },
    /////////////////////////////////////////// evalution
    {
      path: '/milestone-evaluation', // Define the path for your addRoom route
      name: 'milestone-evaluation',
      component: () => import("../views/evaluation/milestone-evalution/index.vue")
    },
    {
      path: '/barrier-evaluation', // Define the path for your addRoom route
      name: 'barrier-evaluation',
      component: () => import("../views/evaluation/barrier-evalution/index.vue")
    },
     




];


export default {
  ...vb,
};
