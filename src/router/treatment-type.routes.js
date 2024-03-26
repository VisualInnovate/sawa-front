// permissions



const treatment_type = [
   
    { 
        path: '/treatments-type',
        name: 'treatments-type',
      component: () => import("../views/inputs/treatementtype/index.vue")
    },
    {
      path: '/create-treatments-type', 
      name: 'createtreatments',
      component: () => import("../views/inputs/treatementtype/create.vue")
    },

];

export default {
  ...treatment_type,
};
