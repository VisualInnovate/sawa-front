// permissions



const therapeutic = [
        {
        path: '/therapeutic', // Define the path for your Therapeutic route
        name: 'Therapeutic',
        component: () => import("../views/Treatment/Treatment.vue")
      },
      {
        path: '/index/therapeutic', // Define the path for your Therapeutic route
        name: 'AllTherapeutic',
        component: () => import("../views/Treatment/IndexTreatment.vue")
      },
      {
        path: "therapeutic/:id",
        name: "therapeutic-update",
        component: () => import("../views/Treatment/update.vue")
       
      },
];

export default {
  ...therapeutic,
};
