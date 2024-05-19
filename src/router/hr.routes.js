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
];

export default {
  ...hr,
};
