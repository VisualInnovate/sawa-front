// permissions



const appointment = [
    
  {
    path: '/system-program',
    name: 'SystemProgram',
    meta: { adminOnly: true },
    component: () => import("../views/Treatment/ProgramSystem.vue")
  },
    {
        path: '/session-type',
        name: 'SessionType',
        meta: { adminOnly: true },
        component: () => import("../views/Treatment/SessionType.vue")
      },
    {
        path: '/program-type',
        name: 'ProgramType',
        meta: { adminOnly: true },
        component: () => import("../views/Treatment/TypeProgram.vue")
      },
    {
        path: '/appointment-type',
        name: 'AppointmentType',
        meta: { adminOnly: true },
        component: () => import("../views/Treatment/AppointmentType.vue")
      },
      {
        path: '/type-treatment',
        name: 'TypeTreatment',
        meta: { adminOnly: true },
        component: () => import("../views/Treatment/Typetreatment.vue")
      },
      {
        path: '/type-treatment/:id/edit',
        name: 'EditTreatment',
        meta: { adminOnly: true },
        component: () => import("../views/Treatment/EditTreatment.vue")
      },
];

export default {
  ...appointment,
};
