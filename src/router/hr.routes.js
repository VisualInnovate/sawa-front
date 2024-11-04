// permissions

const Index = () => import("../views/calender/Index.vue");
const ShowBooking = () => import("../views/calender/ShowBooking.vue");
const BookingDetails = () => import("../views/calender/BookingDetails.vue");

const hr = [
 ////// Employees
 {
    path: '/Employees', 
    name: 'Employees',
    component: () => import("../views/hr/Employees/index.vue")
  },

  {
    path: '/Employees-create', 
    name: 'Employees-create',
    component: () => import("../views/hr/Employees/create.vue")
  },
  {
    path: '/Employee-update/:id', 
    name: 'Employee-update',
    component: () => import("../views/hr/Employees/update.vue")
  },


/////////////////////leave-balance
    {
      path: '/leave-balance', 
      name: 'leave-balance',
      component: () => import("../views/hr/leave/leave-balance/index.vue")
    },
    {
      path: '/balance-create', 
      name: 'balance-create',
      component: () => import("../views/hr/leave/leave-balance/create.vue")
    },
    {
      path: '/balance-update/:id', 
      name: 'balance-update',
      component: () => import("../views/hr/leave/leave-balance/update.vue")
    },
///////////////////// leave-setup
    {
      path: '/leave-setup', 
      name: 'leave-setup',
      component: () => import("../views/hr/leave/leave-setup/index.vue")
    },

/////////////////////////////leaves
      {
        path: '/leaves', 
        name: 'leaves',
        component: () => import("../views/hr/leave/Leaves/index.vue")
      },
      /////////////////////////////////////////// setting

   {
        path: '/setting', 
        name: 'setting',
        component: () => import("../views/hr/setting/index.vue")
      },


      ///////////////////////////////////////deductions
      {
        path: '/deduction-types', 
        name: 'deduction-types',
        component: () => import("../views/hr/deductions/deduction-types.vue")
      },
      {
        path: '/deduction', 
        name: 'deduction',
        component: () => import("../views/hr/deductions/deduction.vue")
      },

      /////////////////////////////////////////Holidays

 {
        path: '/holidays', 
        name: 'holidays',
        component: () => import("../views/hr/holidays/index.vue")
      },

///////////////////////////////////////////// payroll

{
  path: '/payroll', 
  name: 'payroll',
  component: () => import("../views/hr/PayRoll/index.vue")
},

///////////////////////////////////////////////bonus

{
  path: '/bonus', 
  name: 'bonus',
  component: () => import("../views/hr/bonus/index.vue")
},
////////////////////////////////////////////departments
{
  path: '/departments', 
  name: 'departments',
  component: () => import("../views/hr/departments/index.vue")
},
////////////////////////////////////////////postion
{
  path: '/posttion', 
  name: 'posttion',
  component: () => import("../views/hr/posttion/index.vue")
},
/////////////////////////////////// official-leaves
{
  path: '/official-leaves', 
  name: 'official-leaves',
  component: () => import("../views/hr/official-leaves/index.vue")
},
{
  path: '/event', 
  name: 'event',
  component: () => import("../views/hr/event/index.vue")
},


{
  path: '/shift', 
  name: 'shift',
  component: () => import("../views/hr/shift/index.vue")
},
{
  path: '/shift-create', 
  name: 'shift-create',
  component: () => import("../views/hr/shift/create.vue")
},
{
  path: '/shift-update/:id', 
  name: 'shift-update',
  component: () => import("../views/hr/shift/update.vue")
},
// Report

{
  path: '/reports', 
  name: 'reports',
  component: () => import("../views/hr/report/index.vue")
},
];

export default {
  ...hr,
};
