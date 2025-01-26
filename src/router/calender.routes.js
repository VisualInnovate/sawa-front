// permissions

const Index = () => import("../views/calender/Index.vue");
const ShowBooking = () => import("../views/calender/ShowBooking.vue");
const BookingDetails = () => import("../views/calender/BookingDetails.vue");
const working = () => import("../views/calender/Working-hour.vue");

const calenderRoutes = [
  {
    path: "calender/:id",
    name: "Calender",
    component: Index,
  },
  {
    path: "bookings",
    name: "ShowBooking",
    component: ShowBooking,
  },
  {
    path: "bookings/:id/details",
    name: "BookingDetails",
    component: BookingDetails,
    props: true,
  },

  {
    path: "working-hours",
    name: "working-hours",
    component: working,
    props: true,
  },
];

export default {
  ...calenderRoutes,
};
