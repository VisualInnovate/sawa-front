// permissions



const inputs = [
  {
    path: "/dashbord",
    name: "dashbord",
    meta: { permission: ["dashboard index"] },
    component: () => import("../views/home.vue"),
   
  },
  {
    path: "/notification",
    name: "notification",
    meta: { permission: ["notifications list"] },
    component: () => import("../views/notification/index.vue"),
   
  },

  //// area
   
    { 
        path: '/area',
        name: 'area',
        meta: { permission: ["region list"] },
      component: () => import("../views/inputs/areas/area/index.vue")
    },
    { 
      path: '/regin',
      name: 'regin',
      meta: { permission: ["region list"] },
    component: () => import("../views/inputs/areas/regin/index.vue")
  },
  

  ////// transportation
    {
      path: '/transportation', 
      name: 'transportation',
      meta: { permission: ["vehicle list"] },
      component: () => import("../views/inputs/vicales/index.vue")
    },
    {
      path: '/transportation-create', 
      name: 'transportation-create',
      meta: { permission: ["vehicle create"] },
      component: () => import("../views/inputs/vicales/create.vue")
    },
    {
    path: '/transportation-update/:id',
    name: 'transportation-update',
    meta: { permission: ["vehicle edit"] },
    component: () => import("../views/inputs/vicales/update.vue")
    },


    ////// student transportation
    {
      path: '/student-transportation', 
      name: 'student-transportation',
      meta: { permission: ["student transportation list"] },
      component: () => import("../views/inputs/studenttransportation/index.vue")
    },
    {
      path: '/student-transportation-create', 
      name: 'student-transportation-create',
      meta: { permission: ["student transportation create"] },
      component: () => import("../views/inputs/studenttransportation/create.vue")
    },
    {
    path: '/student-transportation-update/:id',
    name: 'student-transportation-update',
    meta: { permission: ["student transportation edit"] },
    component: () => import("../views/inputs/studenttransportation/update.vue")
    },

   ////// transportation-schedule
   {
    path: '/transportation-schedule', 
    name: 'transportation-schedule',
    meta: { permission: ["transportation schedule list"] },
    component: () => import("../views/inputs/transportationschedule/index.vue")
  },
  {
    path: '/transportation-schedule-create', 
    name: 'transportation-schedule-create',
    meta: { permission: ["transportation schedule create"] },
    component: () => import("../views/inputs/transportationschedule/create.vue")
  },
  {
  path: '/transportation-schedule-update/:id',
  name: 'transportation-schedule-update',
  meta: { permission: ["transportation schedule edit"] },
  component: () => import("../views/inputs/transportationschedule/update.vue")
  },


  ///////
  {
    path: '/department', 
    name: 'department',
    meta: { permission: ["department list"] },
    component: () => import("../views/inputs/department/index.vue")
  },

  // custom-files
  {
    path: '/custom-files', 
    name: 'custom-files',
    meta: { permission: ["modules create"] },
    component: () => import("../views/custom-files/create.vue")
  },
  {
    path: '/module', 
    name: 'module',
    meta: { permission: ["modules list"] },
    component: () => import("../views/custom-files/module.vue")
  },
];

export default {
  ...inputs,
};
