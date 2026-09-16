const reinforcer = [
    {
        path: '/reinforcers/:id', // Define the path for your addRoom route
        name: 'reinforcers',
        meta: { permission: ["stimulus list"] },
        component: () => import("../views/Reinforcers/index.vue")
      },
      {
        path: '/pair/:id', // Define the path for your addRoom route
        name: 'pair',
        meta: { permission: ["stimulus test create"] },
        component: () => import("../views/Reinforcers/pair.vue")
      },
      {
        path: '/return/:id', // Define the path for your addRoom route
        name: 'return',
        meta: { permission: ["stimulus test create"] },
        component: () => import("../views/Reinforcers/return.vue")
      },
      {
        path: '/without/:id', // Define the path for your addRoom route
        name: 'without',
        meta: { permission: ["stimulus test create"] },
        component: () => import("../views/Reinforcers/without.vue")
      },




];


export default {
  ...reinforcer,
};
