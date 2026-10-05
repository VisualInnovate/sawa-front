// permissions

const Index = () => import("../views/calender/Index.vue");
const ShowBooking = () => import("../views/calender/ShowBooking.vue");
const BookingDetails = () => import("../views/calender/BookingDetails.vue");
const BookingCreate = () => import("../views/calender/BookingCreate.vue");
const working = () => import("../views/calender/Working-hour.vue");
const Recommendations = () => import("../views/calender/recommendations.vue");
const RequiredEvaluations = () => import("../views/calender/RequiredEvaluations.vue");
const ConsultantChildren = () => import("../views/calender/ConsultantChildren.vue");

const calenderRoutes = [
  {
    path: "calender/:id",
    name: "Calender",
    meta: { permission: ["evaluation request create"] },
    component: Index,
  },
  {
    path: "required-evaluations",
    name: "required-evaluations",
    meta: { permission: ["required evaluations list"] },
    component: RequiredEvaluations,
  },
  {
    path: "consultant-children",
    name: "consultant-children",
    meta: { permission: ["consultant children list", "child list"] },
    component: ConsultantChildren,
  },
  {
    path: "recommendations",
    name: "recommendations",
    meta: { permission: ["consultation settings list"] },
    component: Recommendations,
  },
  {
    path: "bookings",
    name: "ShowBooking",
    meta: { permission: ["bookings list"] },
    component: ShowBooking,
  },
  {
    path: "bookings/create",
    name: "BookingCreate",
    meta: { permission: ["bookings create"] },
    component: BookingCreate,
  },
  {
    path: "bookings/:id/details",
    name: "BookingDetails",
    meta: { permission: ["bookings list", "bookings edit", "consultations edit"] },
    component: BookingDetails,
    props: true,
  },

  {
    path: "working-hours",
    name: "working-hours",
    meta: { permission: ["working hours list"] },
    component: working,
    props: true,
  },
];

export default {
  ...calenderRoutes,
};
