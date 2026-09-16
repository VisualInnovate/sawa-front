// permissions

const Index = () => import("../views/calender/Index.vue");
const ShowBooking = () => import("../views/calender/ShowBooking.vue");
const BookingDetails = () => import("../views/calender/BookingDetails.vue");

const hr = [
 ////// Employees
 {
    path: '/Employees', 
    name: 'Employees',
    meta: { permission: ["employees list"] },
    component: () => import("../views/hr/Employees/index.vue")
  },
  {
    path: '/daily-attendance', 
    name: 'daily-attendance',
    meta: { permission: ["attendance list"] },
    component: () => import("../views/hr/Employees/daily_attendance.vue")
  },
  {
    path: '/Employees-create', 
    name: 'Employees-create',
    meta: { permission: ["employees create"] },
    component: () => import("../views/hr/Employees/create.vue")
  },
  {
    path: '/Employee-update/:id', 
    name: 'Employee-update',
    meta: { permission: ["employees edit"] },
    component: () => import("../views/hr/Employees/update.vue")
  },


/////////////////////leave-balance
    {
      path: '/leave-balance', 
      name: 'leave-balance',
      meta: { permission: ["leave balance list"] },
      component: () => import("../views/hr/leave/leave-balance/index.vue")
    },
    {
      path: '/balance-create', 
      name: 'balance-create',
      meta: { permission: ["leave balance create"] },
      component: () => import("../views/hr/leave/leave-balance/create.vue")
    },
    {
      path: '/balance-update/:id', 
      name: 'balance-update',
      meta: { permission: ["leave balance edit"] },
      component: () => import("../views/hr/leave/leave-balance/update.vue")
    },
///////////////////// leave-setup
    {
      path: '/leave-setup', 
      name: 'leave-setup',
      meta: { permission: ["leave setup list"] },
      component: () => import("../views/hr/leave/leave-setup/index.vue")
    },

/////////////////////////////leaves
      {
        path: '/leaves', 
        name: 'leaves',
        meta: { permission: ["leaves list"] },
        component: () => import("../views/hr/leave/Leaves/index.vue")
      },
      /////////////////////////////////////////// setting

   {
        path: '/setting', 
        name: 'setting',
        meta: { permission: ["hr settings list"] },
        component: () => import("../views/hr/setting/index.vue")
      },


      ///////////////////////////////////////deductions
      {
        path: '/deduction-types', 
        name: 'deduction-types',
        meta: { permission: ["deduction type list"] },
        component: () => import("../views/hr/deductions/deduction-types.vue")
      },
      {
        path: '/deduction', 
        name: 'deduction',
        meta: { permission: ["deduction list"] },
        component: () => import("../views/hr/deductions/deduction.vue")
      },

      /////////////////////////////////////////Holidays

 {
        path: '/holidays', 
        name: 'holidays',
        meta: { permission: ["holidays list"] },
        component: () => import("../views/hr/holidays/index.vue")
      },

///////////////////////////////////////////// payroll

{
  path: '/payroll', 
  name: 'payroll',
  meta: { permission: ["payroll list"] },
  component: () => import("../views/hr/PayRoll/index.vue")
},

///////////////////////////////////////////////bonus

{
  path: '/bonus', 
  name: 'bonus',
  meta: { permission: ["bonus list"] },
  component: () => import("../views/hr/bonus/index.vue")
},
////////////////////////////////////////////departments
{
  path: '/departments', 
  name: 'departments',
  meta: { permission: ["department list"] },
  component: () => import("../views/hr/departments/index.vue")
},
////////////////////////////////////////////postion
{
  path: '/posttion', 
  name: 'posttion',
  meta: { permission: ["positions list"] },
  component: () => import("../views/hr/posttion/index.vue")
},
/////////////////////////////////// official-leaves
{
  path: '/official-leaves', 
  name: 'official-leaves',
  meta: { permission: ["official leave list"] },
  component: () => import("../views/hr/official-leaves/index.vue")
},
{
  path: '/event', 
  name: 'event',
  meta: { permission: ["events list"] },
  component: () => import("../views/hr/event/index.vue")
},


{
  path: '/shift', 
  name: 'shift',
  meta: { permission: ["shifts list"] },
  component: () => import("../views/hr/shift/index.vue")
},
{
  path: '/shift-create', 
  name: 'shift-create',
  meta: { permission: ["shifts create"] },
  component: () => import("../views/hr/shift/create.vue")
},
{
  path: '/shift-update/:id', 
  name: 'shift-update',
  meta: { permission: ["shifts edit"] },
  component: () => import("../views/hr/shift/update.vue")
},
// Report

{
  path: '/reports', 
  name: 'reports',
  meta: { permission: ["reports list"] },
  component: () => import("../views/hr/report/index.vue")
},
// advance

{
  path: '/advance', 
  name: 'advance',
  meta: { permission: ["financial advance list"] },
  component: () => import("../views/hr/advance/index.vue")
},
];

export default {
  ...hr,
};
