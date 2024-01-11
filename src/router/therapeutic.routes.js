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
];

export default {
  ...therapeutic,
};
