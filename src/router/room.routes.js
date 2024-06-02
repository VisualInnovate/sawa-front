// permissions



const rooms = [
    {
        path: '/add-room', // Define the path for your addRoom route
        name: 'addRoom',
        component: () => import("../views/rooms/Create.vue")
      },
    { 
        path: '/rooms',
        name: 'Rooms',
      component: () => import("../views/rooms/Index.vue")
    },
    {
      path: '/create-room', 
      name: 'CreateRoom',
      component: () => import("../views/rooms/Create.vue")
    },
    {
      path: '/test-room', 
      name: 'TestRoom',
      component: () => import("../views/rooms/Test.vue")
    },
    {
    path: '/edit-room/:id',
    name: 'EditRoom',
    component: () => import("../views/rooms/Edit.vue")
    },
    //////// doctor
    {
      path: '/doctors',
      name: 'doctors',
      component: () => import("../views/doctors/index.vue")
      },
      {
        path: '/doctors-show',
        name: 'doctors-show',
        component: () => import("../views/doctors/show.vue")
        },
        {
          path: '/doctors-programe',
          name: 'doctors-programe',
          component: () => import("../views/doctors/programe.vue")
          },
          {
            path: '/doctors-evaluation',
            name: 'doctors-evaluation',
            component: () => import("../views/doctors/evaluation.vue")
            },


];

export default {
  ...rooms,
};
