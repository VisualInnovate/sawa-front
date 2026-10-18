const vb = [
    {
        path: '/levels', // Define the path for your addRoom route
        name: 'levels',
        meta: { permission: ["milestone level list"] },
        component: () => import("../views/vb/levels/index.vue")
      },
      {
        path: '/milestone-domains',
        name: 'milestone-domains',
        meta: { permission: ["milestone domain list"] },
        component: () => import("../views/vb/Domains/index.vue")
      },
      {
        path: '/milestone-general-goals', // Define the path for your addRoom route
        name: 'milestone-general-goals',
        meta: { permission: ["milestone general goal list"] },
        component: () => import("../views/vb/MilestoneGeneralGoal/index.vue")
      },
      {
        path: '/milestone-sub-goals',
        name: 'milestone-sub-goals',
        meta: { permission: ["milestone sub goal list"] },
        component: () => import("../views/vb/SubGoals/index.vue")
      },
      {
        path: '/answer', // Define the path for your addRoom route
        name: 'answer',
        meta: { permission: ["milestone answer list"] },
        component: () => import("../views/vb/Answers/index.vue")
      },
      {
        path: '/answer-create', // Define the path for your addRoom route
        name: 'answer-create',
        meta: { permission: ["milestone answer create"] },
        component: () => import("../views/vb/Answers/create.vue")
      },
      {
        path: '/answer-update/:id', // Define the path for your addRoom route
        name: 'answer-update',
        meta: { permission: ["milestone answer edit"] },
        component: () => import("../views/vb/Answers/update.vue")
      },

      ////////////////////////barrier  barrier-subtest
      {
        path: '/barrier-subtest', 
        name: 'barrier-subtest',
        meta: { permission: ["barrier subtest list"] },
        component: () => import("../views/vb/barrier/subtest/index.vue")
      },
      {
        path: '/barrier-question', 
        name: 'barrier-question',
        meta: { permission: ["barrier question list"] },
        component: () => import("../views/vb/barrier/Question/index.vue")
      },
      {
        path: '/barrier-answer-type', 
        name: 'barrier-answer-type',
        meta: { permission: ["barrier answer type list"] },
        component: () => import("../views/vb/barrier/answer-type/index.vue")
      },
    /////////////////////////////////////////// evalution
    {
      path: '/milestone-evaluation/:id',
      name: 'milestone-evaluation',
      meta: { permission: ["milestone answer create"] },
      component: () => import("../views/evaluation/milestone-evalution/index.vue")
    },
    {
      path: '/milestone-resulte/:id/:evla_id', 
      name: 'milestone-resulte',
      meta: { permission: ["milestone answer list"] },
      component: () => import("../views/evaluation/milestone-evalution/resulte.vue")
    },
    {
      path: '/barrier-resulte/:id', 
      name: 'barrier-resulte',
      meta: { permission: ["barrier answer list"] },
      component: () => import("../views/evaluation/barrier-evalution/resulte.vue")
    },
    {
      path: '/barrier-evaluation/:id', 
      name: 'barrier-evaluation',
      meta: { permission: ["barrier answer create"] },
      component: () => import("../views/evaluation/barrier-evalution/index.vue")
    },
    // VB-MAPP Transition: its questions, the evaluation and its results
    {
      path: '/transition-questions',
      name: 'transition-questions',
      meta: { permission: ["transition question list"] },
      component: () => import("../views/vb/transition/Questions.vue")
    },
    {
      path: '/transition-evaluation/:id',
      name: 'transition-evaluation',
      meta: { permission: ["transition answer create"] },
      component: () => import("../views/evaluation/transition-evaluation/index.vue")
    },
    {
      path: '/transition-result/:id/:evaluation',
      name: 'transition-result',
      meta: { permission: ["transition answer list", "transition answer create"] },
      component: () => import("../views/evaluation/transition-evaluation/result.vue")
    },
    //  sesions
    {
      path: '/sessions', 
      name: 'sessions',
      meta: { permission: ["sessions list"] },
      component: () => import("../views/evaluation/sessions/index.vue")
    },
    // «رسوم البرامج»: the fee tables and the calculator
    {
      path: '/program-fees',
      name: 'program-fees',
      meta: { permission: ["program fees edit"] },
      component: () => import("../views/programFees/Index.vue")
    },
    // «أوقات البرامج»: the weekly hours of inclusion, day and clinics
    {
      path: '/program-hours',
      name: 'program-hours',
      meta: { permission: ["program hours edit"] },
      component: () => import("../views/programHours/Index.vue")
    },

    {
      path: '/sessions-create', 
      name: 'sessions-create',
      meta: { permission: ["sessions create"] },
      component: () => import("../views/evaluation/sessions/create.vue")
    },
    {
      path: '/sessions-update/:id/:program_id', 
      name: 'sessions-update',
      meta: { permission: ["sessions edit"] },
      component: () => import("../views/evaluation/sessions/update.vue")
    },




];


export default {
  ...vb,
};
