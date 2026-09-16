// permissions



const rooms = [
    {
        path: '/add-room', // Define the path for your addRoom route
        name: 'addRoom',
        meta: { permission: ["room create"] },
        component: () => import("../views/rooms/Create.vue")
      },
    { 
        path: '/rooms',
        name: 'Rooms',
        meta: { permission: ["room list"] },
      component: () => import("../views/rooms/Index.vue")
    },
    {
      path: '/create-room', 
      name: 'CreateRoom',
      meta: { permission: ["room create"] },
      component: () => import("../views/rooms/Create.vue")
    },
    {
      path: '/test-room', 
      name: 'TestRoom',
      meta: { adminOnly: true },
      component: () => import("../views/rooms/Test.vue")
    },
    {
    path: '/edit-room/:id',
    name: 'EditRoom',
    meta: { permission: ["room edit"] },
    component: () => import("../views/rooms/Edit.vue")
    },
    //////// doctor
    {
      path: '/doctors',
      name: 'doctors',
      meta: { permission: ["doctor list"] },
      component: () => import("../views/doctors/index.vue")
      },
      {
        path: '/doctors-show',
        name: 'doctors-show',
        meta: { permission: ["doctor list"] },
        component: () => import("../views/doctors/show.vue")
        },
        {
          path: '/doctors-programe',
          name: 'doctors-programe',
          meta: { permission: ["doctor list"] },
          component: () => import("../views/doctors/programe.vue")
          },
          {
            path: '/doctors-evaluation',
            name: 'doctors-evaluation',
            meta: { permission: ["doctor list"] },
            component: () => import("../views/doctors/evaluation.vue")
            },


];

export default {
  ...rooms,
};
