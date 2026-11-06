// permissions



const inputs = [
  {
    path: "/dashbord",
    name: "dashbord",
    meta: { permission: ["dashboard index"] },
    component: () => import("../views/home.vue"),
   
  },
  {
    path: "/notification",
    name: "notification",
    meta: { permission: ["notifications list"] },
    component: () => import("../views/notification/index.vue"),
   
  },

  //// area
   
    { 
      path: '/regin',
      name: 'regin',
      meta: { permission: ["region list"] },
    component: () => import("../views/inputs/areas/regin/index.vue")
  },
  

  ////// transportation
    {
      path: '/transportation', 
      name: 'transportation',
      meta: { permission: ["vehicle list"] },
      component: () => import("../views/inputs/vicales/index.vue")
    },
    {
      path: '/transportation-create', 
      name: 'transportation-create',
      meta: { permission: ["vehicle create"] },
      component: () => import("../views/inputs/vicales/create.vue")
    },
    {
    path: '/transportation-update/:id',
    name: 'transportation-update',
    meta: { permission: ["vehicle edit"] },
    component: () => import("../views/inputs/vicales/update.vue")
    },


    // «طلبات النقل» (phase 6b): no page permission — whom a request waits for opens it (the API checks).
    {
      path: '/transport-requests',
      name: 'transport-requests',
      component: () => import("../views/transport/TransportRequests.vue")
    },
    ////// student transportation
    {
      path: '/student-transportation', 
      name: 'student-transportation',
      meta: { permission: ["student transportation list"] },
      component: () => import("../views/inputs/studenttransportation/index.vue")
    },
    {
      path: '/student-transportation-create', 
      name: 'student-transportation-create',
      meta: { permission: ["student transportation create"] },
      component: () => import("../views/inputs/studenttransportation/create.vue")
    },
    {
    path: '/student-transportation-update/:id',
    name: 'student-transportation-update',
    meta: { permission: ["student transportation edit"] },
    component: () => import("../views/inputs/studenttransportation/update.vue")
    },

   ////// transportation-schedule
   {
    path: '/transportation-schedule', 
    name: 'transportation-schedule',
    meta: { permission: ["transportation schedule list"] },
    component: () => import("../views/inputs/transportationschedule/index.vue")
  },
  {
    path: '/transportation-schedule-create', 
    name: 'transportation-schedule-create',
    meta: { permission: ["transportation schedule create"] },
    component: () => import("../views/inputs/transportationschedule/create.vue")
  },
  {
  path: '/transportation-schedule-update/:id',
  name: 'transportation-schedule-update',
  meta: { permission: ["transportation schedule edit"] },
  component: () => import("../views/inputs/transportationschedule/update.vue")
  },
  // A route's fixed week days and times, from which each day's trips are made.
  {
    path: "/transport-weekly-trips",
    name: "transport-weekly-trips",
    meta: { permission: ["transportation schedule list"] },
    component: () => import("../views/transport/WeeklyTrips.vue"),
  },
  // «رحلاتي»: the bus supervisor's trips and their children.
  {
    path: "/bus-trips",
    name: "bus-trips",
    meta: { permission: ["bus supervisor list"] },
    component: () => import("../views/transport/BusTrips.vue"),
  },
  {
    path: "/bus-trips/:id(\\d+)",
    name: "bus-trip",
    meta: { permission: ["bus supervisor list"] },
    component: () => import("../views/transport/BusTrips.vue"),
  },
  // «سجل الرحلات»: the children's statuses on the trips, for the management.
  {
    path: "/transport-trip-log",
    name: "transport-trip-log",
    meta: { permission: ["child list", "parents list", "transportation schedule list"] },
    component: () => import("../views/transport/TripLog.vue"),
  },

];

export default {
  ...inputs,
};
