// permissions



const therapeutic = [
      // «البرامج العلاجية» (/index/therapeutic) was removed: student programs no longer use program templates.
      {
        path: '/skills', // Define the path for your Therapeutic route
        name: 'skills',
        meta: { permission: ["skills list"] },
        component: () => import("../views/skills/index.vue")
      },

];

export default {
  ...therapeutic,
};
