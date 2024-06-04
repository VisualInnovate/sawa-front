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




];


export default {
  ...reinforcer,
};
