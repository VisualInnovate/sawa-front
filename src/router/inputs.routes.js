// permissions



const inputs = [
   
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
    // {
    //   path: '/create-treatments-type', 
    //   name: 'createtreatments',
    //   component: () => import("../views/inputs/treatementtype/create.vue")
    // },
    // {
    //   path: '/test-room', 
    //   name: 'TestRoom',
    //   component: () => import("../views/rooms/Test.vue")
    // },
    // {
    // path: '/edit-room/:id',
    // name: 'EditRoom',
    // component: () => import("../views/rooms/Edit.vue")
    // },
];

export default {
  ...inputs,
};
