// permissions

const Index = () => import("../views/calender/Index.vue");
const ShowBooking = () => import("../views/calender/ShowBooking.vue");
const BookingDetails = () => import("../views/calender/BookingDetails.vue");

const hr = [
 ////// Employees
 {
    path: '/Employees', // Define the path for your addRoom route
    name: 'Employees',
    component: () => import("../views/hr/Employees/index.vue")
  },
  {
    path: '/Employee-update/:id', // Define the path for your addRoom route
    name: 'Employee-update',
    component: () => import("../views/hr/Employees/update.vue")
  },


/////////////////////leave-balance
    {
      path: '/leave-balance', // Define the path for your addRoom route
      name: 'leave-balance',
      component: () => import("../views/hr/leave-balance/index.vue")
    },
///////////////////// leave-setup
    {
      path: '/leave-setup', // Define the path for your addRoom route
      name: 'leave-setup',
      component: () => import("../views/hr/leave-setup/index.vue")
    },

/////////////////////////////leaves
      {
        path: '/leaves', // Define the path for your addRoom route
        name: 'leaves',
        component: () => import("../views/hr/Leaves/index.vue")
      },

];

export default {
  ...hr,
};
