// permissions



const therapeutic = [
        {
        path: '/therapeutic/create', // must not collide with the public /therapeutic page
        name: 'Therapeutic',
        meta: { permission: ["program create"] },
        component: () => import("../views/Treatment/Treatment.vue")
      },
      {
        path: '/index/therapeutic', // Define the path for your Therapeutic route
        name: 'AllTherapeutic',
        meta: { permission: ["program list"] },
        component: () => import("../views/Treatment/IndexTreatment.vue")
      },
      {
        path: "therapeutic/:id",
        name: "therapeutic-update",
        meta: { permission: ["program edit"] },
        component: () => import("../views/Treatment/update.vue")
       
      },

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
