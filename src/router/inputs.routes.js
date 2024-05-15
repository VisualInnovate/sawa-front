// permissions



const inputs = [
  {
    path: "/dashbord",
    name: "dashbord",
    component: () => import("../views/home.vue"),
   
  },

  //// area
   
    { 
        path: '/area',
        name: 'area',
      component: () => import("../views/inputs/areas/area/index.vue")
    },
    { 
      path: '/regin',
      name: 'regin',
    component: () => import("../views/inputs/areas/regin/index.vue")
  },
  

  ////// transportation
    {
      path: '/transportation', 
      name: 'transportation',
      component: () => import("../views/inputs/vicales/index.vue")
    },
    {
      path: '/transportation-create', 
      name: 'transportation-create',
      component: () => import("../views/inputs/vicales/create.vue")
    },
    {
    path: '/transportation-update/:id',
    name: 'transportation-update',
    component: () => import("../views/inputs/vicales/update.vue")
    },


    ////// student transportation
    {
      path: '/student-transportation', 
      name: 'student-transportation',
      component: () => import("../views/inputs/studenttransportation/index.vue")
    },
    {
      path: '/student-transportation-create', 
      name: 'student-transportation-create',
      component: () => import("../views/inputs/studenttransportation/create.vue")
    },
    {
    path: '/student-transportation-update/:id',
    name: 'student-transportation-update',
    component: () => import("../views/inputs/studenttransportation/update.vue")
    },

   ////// transportation-schedule
   {
    path: '/transportation-schedule', 
    name: 'transportation-schedule',
    component: () => import("../views/inputs/transportationschedule/index.vue")
  },
  {
    path: '/transportation-schedule-create', 
    name: 'transportation-schedule-create',
    component: () => import("../views/inputs/transportationschedule/create.vue")
  },
  {
  path: '/transportation-schedule-update/:id',
  name: 'transportation-schedule-update',
  component: () => import("../views/inputs/transportationschedule/update.vue")
  },


  ///////
  {
    path: '/department', 
    name: 'department',
    component: () => import("../views/inputs/department/index.vue")
  },
];

export default {
  ...inputs,
};
