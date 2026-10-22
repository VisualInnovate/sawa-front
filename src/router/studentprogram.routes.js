// permissions



const studentprograme = [
   
    { 
        path: '/student-programe',
        name: 'student-programe',
        meta: { permission: ["student program list"] },
      component: () => import("../views/studentprogram/index.vue")
    },
    {
        path: '/create-studentprograme', 
        name: 'create-studentprograme',
        meta: { permission: ["student program create"] },
        component: () => import("../views/studentprogram/create.vue")
      },
      {
        path: '/student-programe/:id',
        name: 'show-studentprograme',
        meta: { permission: ["student program list"] },
        component: () => import("../views/studentprogram/show.vue")
      },
      {
        path: '/edit-studentprograme/:id',
        name: 'update-studentprograme',
        meta: { permission: ["student program edit"] },
        component: () => import("../views/studentprogram/update.vue")
        },
      // «سجل البرامج»: what was created and changed in every program.
      {
        path: '/student-programe-logs',
        name: 'student-program-logs',
        meta: { permission: ["student program log list"] },
        component: () => import("../views/studentprogram/ProgramLogs.vue")
      },
    
];

export default {
  ...studentprograme,
};
