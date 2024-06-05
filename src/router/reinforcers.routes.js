const reinforcer = [
    {
        path: '/reinforcers', // Define the path for your addRoom route
        name: 'reinforcers',
        component: () => import("../views/Reinforcers/index.vue")
      },
      {
        path: '/pair', // Define the path for your addRoom route
        name: 'pair',
        component: () => import("../views/Reinforcers/pair.vue")
      },
      {
        path: '/return', // Define the path for your addRoom route
        name: 'return',
        component: () => import("../views/Reinforcers/return.vue")
      },




];


export default {
  ...reinforcer,
};
