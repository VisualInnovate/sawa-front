// permissions



const treatment_type = [
   
    { 
        path: '/treatments-type',
        name: 'treatments-type',
        meta: { permission: ["treatment list"] },
      component: () => import("../views/inputs/treatementtype/index.vue")
    },

];

export default {
  ...treatment_type,
};
