const vb = [
    {
        path: '/levels', // Define the path for your addRoom route
        name: 'levels',
        component: () => import("../views/vb/levels/index.vue")
      },

];

export default {
  ...vb,
};
