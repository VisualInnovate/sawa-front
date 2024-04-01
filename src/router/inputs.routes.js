// permissions



const inputs = [
  {
    path: "/dashbord",
    name: "dashbord",
    component: () => import("../views/home.vue"),
   
  },
   
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
];

export default {
  ...inputs,
};
