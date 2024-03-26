// permissions



const studentprograme = [
   
    { 
        path: '/student-programe',
        name: 'student-programe',
      component: () => import("../views/studentprogram/index.vue")
    },
    {
        path: '/create-studentprograme', 
        name: 'create-studentprograme',
        component: () => import("../views/studentprogram/create.vue")
      },
      {
        path: '/edit-studentprograme/:id',
        name: 'update-studentprograme',
        component: () => import("../views/studentprogram/update.vue")
        },
    
];

export default {
  ...studentprograme,
};
