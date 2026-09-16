// permissions



const treatment_type = [
   
    { 
        path: '/treatments-type',
        name: 'treatments-type',
        meta: { permission: ["treatment list"] },
      component: () => import("../views/inputs/treatementtype/index.vue")
    },
    {
      path: '/create-treatments-type', 
      name: 'createtreatments',
      meta: { adminOnly: true },
      component: () => import("../views/inputs/treatementtype/create.vue")
    },

];

export default {
  ...treatment_type,
};
