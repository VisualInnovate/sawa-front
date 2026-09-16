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
        path: '/edit-studentprograme/:id',
        name: 'update-studentprograme',
        meta: { permission: ["student program edit"] },
        component: () => import("../views/studentprogram/update.vue")
        },
    
];

export default {
  ...studentprograme,
};
