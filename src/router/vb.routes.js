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
      meta: { permission: ["milestone answer create", "milestone answer edit", "evaluation approval edit"] },
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
      meta: { permission: ["barrier answer create", "barrier answer edit", "evaluation approval edit"] },
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
      meta: { permission: ["transition answer create", "transition answer edit", "evaluation approval edit"] },
      component: () => import("../views/evaluation/transition-evaluation/index.vue")
    },
    {
      path: '/transition-result/:id/:evaluation',
      name: 'transition-result',
      meta: { permission: ["transition answer list", "transition answer create"] },
      component: () => import("../views/evaluation/transition-evaluation/result.vue")
    },
    // M-CHAT-R: its settings (questions, levels, instructions, ages), the parent's yes/no answers and the risk they give
    {
      path: '/mchat-settings',
      name: 'mchat-settings',
      meta: { permission: ["mchat question list", "mchat question edit"] },
      component: () => import("../views/evaluation/mchat/Settings.vue")
    },
    {
      path: '/mchat-evaluation/:id',
      name: 'mchat-evaluation',
      meta: { permission: ["mchat answer create", "mchat answer edit", "evaluation approval edit"] },
      component: () => import("../views/evaluation/mchat/index.vue")
    },
    {
      path: '/mchat-result/:id/:evaluation',
      name: 'mchat-result',
      meta: { permission: ["mchat answer list", "mchat answer create"] },
      component: () => import("../views/evaluation/mchat/result.vue")
    },
    // QFBA: its settings (questions, functions, scale, instructions — Arabic and English), the answers about one
    // target behaviour, and each function's endorsed questions and severity
    {
      path: '/qfba-settings',
      name: 'qfba-settings',
      meta: { permission: ["qfba question list", "qfba question edit"] },
      component: () => import("../views/evaluation/qfba/Settings.vue")
    },
    {
      path: '/qfba-evaluation/:id',
      name: 'qfba-evaluation',
      meta: { permission: ["qfba answer create", "qfba answer edit", "evaluation approval edit"] },
      component: () => import("../views/evaluation/qfba/index.vue")
    },
    {
      path: '/qfba-result/:id/:evaluation',
      name: 'qfba-result',
      meta: { permission: ["qfba answer list", "qfba answer create"] },
      component: () => import("../views/evaluation/qfba/result.vue")
    },
    //  sesions
    {
      path: '/sessions', 
      name: 'sessions',
      meta: { permission: ["sessions list"] },
      component: () => import("../views/evaluation/sessions/index.vue")
    },
    // «الفئات العمرية للتقييمات»: one age range per evaluation type.
    {
      path: '/evaluation-age-ranges',
      name: 'evaluation-age-ranges',
      meta: { permission: ["evaluation age ranges edit"] },
      component: () => import("../views/evaluationAges/Index.vue")
    },
    // «وصف التقييمات»: one description per evaluation type, printed in reports before its chart.
    {
      path: '/evaluation-descriptions',
      name: 'evaluation-descriptions',
      meta: { permission: ["evaluation descriptions edit"] },
      component: () => import("../views/evaluationAges/Descriptions.vue")
    },
    // «طلبات تعميم الأهداف»: the classes' generalization requests, approved or rejected by the management.
    {
      path: '/goal-generalizations',
      name: 'goal-generalizations',
      meta: { permission: ["goal generalization list", "goal generalization edit"] },
      component: () => import("../views/sessions/GoalGeneralizations.vue")
    },
    // «طلبات التعميم الواردة»: goals other therapists asked me to generalize (everyone sees their own).
    {
      path: '/my-generalizations',
      name: 'my-generalizations',
      component: () => import("../views/sessions/MyGeneralizations.vue")
    },
    // «طلبات اعتماد التراكنج»: the trackings sent to the management.
    {
      path: '/tracking-approvals',
      name: 'tracking-approvals',
      meta: { permission: ["tracking approval list", "tracking approval edit"] },
      component: () => import("../views/reports/TrackingApprovals.vue")
    },
    // «سجل الجلسات»: what ran, was missed (and what was done) or was postponed.
    {
      path: '/session-log',
      name: 'session-log',
      meta: { permission: ["session log list"] },
      component: () => import("../views/sessions/SessionLog.vue")
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

    // Before a session starts: its break schedule (two tables).
    {
      path: '/sessions/:id/break-schedule',
      name: 'session-break-schedule',
      meta: { permission: ["session break schedule edit"] },
      component: () => import("../views/sessions/BreakSchedule.vue")
    },
    // What happened in a session (break tables, reinforcer tests, DTT sheets).
    {
      path: '/sessions/:id/results',
      name: 'session-results',
      meta: { permission: ["sessions list"] },
      component: () => import("../views/sessions/SessionResults.vue")
    },




];


export default {
  ...vb,
};
