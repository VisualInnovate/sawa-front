import { createRouter, createWebHistory } from "vue-router";
import Home from "@/components/Home.vue";
import permissionsRoutes from "./permissions.routes";
import rolesRoutes from "./roles.routes";
import usersRoutes from "./users.routes";
import vb from "./vb.routes";
import hr from "./hr.routes";
import parentsRoutes from "./parents.routes";
import siteRoutes from "./settings.routes";
import rooms from "./room.routes";
import reinforcer from "./reinforcers.routes";
import childrenRoutes from "./children.routes";
import QuestionHeadersRoutes from "./question-headers.routes";
import EvaluationsRoutes from "./evaluation.routes";
import therapeutic from "./therapeutic.routes";
import appointment from "./appointment-type.routes";
import studentprogram from "./studentprogram.routes";
import treatment_type from "./treatment-type.routes";
import inputs from "./inputs.routes";
import sideProfileRoutes from "./side-profile.routes";
import calender from "./calender.routes";
import page_403 from "../views/pages/page_403.vue";
import HomeView from "../views/frontend/views/HomeView.vue";
import Login from "../views/frontend/views/Login.vue";
import AboutView from "../views/frontend/views/AboutView.vue";
import BookingTime from "../views/frontend/components/BookingTime.vue";
import Cursale from "../views/frontend/components/Cursale.vue";
import contactus from "../views/frontend/views/contactus.vue";
import { useParentStore } from "../stores/ParentStore";
import { useAuthStore } from "../stores/Auth";
import { canVisit, homeRoute } from "../utils/permissions";

function auth(to, from, next) {
  if (!useAuthStore().authenticated) {
    return next({ name: "Login" });
  }
  next();
}

function guest(to, from, next) {
  if (useAuthStore().authenticated) {
    return next({ name: "Home" });
  }
  next();
}

function authForNormalUser(to, from, next) {
  const parentStore = useParentStore();

  if (!parentStore.isAuthenticated) {
    localStorage.setItem("lastRoute", to.fullPath);
    return next({ name: "parentLogin" });
  }

  next();
}

function guestForNormalUser(to, from, next) {
  if (useParentStore().isAuthenticated) {
    return next({ name: "webHome" });
  }
  next();
}

const routes = [
  ///////////////Begin Front End Users Routes //////////////////
  {
    path: "/",
    name: "root",
    component: () => import("../layout/landingPage.vue"),
    beforeEnter: guestForNormalUser,
    children: [
      {
        path: "",
        name: "home",
        component: () => import("../views/frontend/views/main/index.vue"),
      },
      {
        path: "/about-us",
        name: "aboutUs",
        component: () => import("../views/frontend/views/main/aboutUs.vue"),
      },
      {
        path: "/programs",
        name: "programs",
        component: () => import("../views/frontend/views/main/programs.vue"),
      },
      {
        path: "/therapeutic",
        name: "therapeutic",
        component: () => import("../views/frontend/views/main/therapeutic.vue"),
      },
      {
        path: "/journey",
        name: "journey",
        component: () => import("../views/frontend/views/main/journey.vue"),
      },
      {
        path: "/integration",
        name: "integration",
        component: () => import("../views/frontend/views/main/integration.vue"),
      },
      {
        path: "/services",
        name: "services",
        component: () => import("../views/frontend/views/main/services.vue"),
      },
      {
        path: "/contact",
        name: "contact",
        component: () => import("../views/frontend/views/main/contact.vue"),
      },
    ],
  },
  {
    path: "/web/parent/register",
    name: "SingUp",
    component: () => import("../views/frontend/views/SingUp.vue"),
    beforeEnter: guestForNormalUser,
  },
  {
    path: "/web/parent/login",
    name: "parentLogin",
    component: Login,
    beforeEnter: guestForNormalUser,
  },

  {
    path: "/web/parent/forgetpassword",
    name: "forgetpassword",
    component: () => import("../views/frontend/views/forgetpassword.vue"),
    beforeEnter: guestForNormalUser,
  },
  {
    path: "/web/parent/restepassword",
    name: "restepassword",
    component: () => import("../views/frontend/views/resetpassword.vue"),
    beforeEnter: guestForNormalUser,
  },
  {
    path: "/web/code",
    name: "code",
    redirect: { name: "parentLogin" },
  },
  {
    path: "/web/contactus",
    name: "contactus",
    component: contactus,
  },
  {
    path: "/web",
    name: "webHome",
    component: HomeView,
    beforeEnter: authForNormalUser,
  },
  {
    path: "/request-meeting/:child_id",
    name: "request-meeting",
    component: () => import("../views/frontend/views/metting.vue"),
    beforeEnter: authForNormalUser,
  },
  {
    path: "/web/Cursale",
    name: "Cursale",
    component: Cursale,
  },
  {
    path: "/web/AboutView",
    name: "about",
    component: AboutView,
  },
  {
    path: "/web/Number",
    name: "Number",
    component: () => import("../views/frontend/views/Number.vue"),
  },
  {
    path: "/web/clidreen_parents",
    name: "clidreen_parents",
    component: () => import("../views/frontend/views/childreens.vue"),
    beforeEnter: [
      authForNormalUser,
    ],
  },
  {
    path: "/web/register-code",
    name: "register-code",
    redirect: { name: "parentLogin" },
  },
  {
    path: "/web/booking-time/:child_id",
    name: "BookingTime",
    component: BookingTime,
    beforeEnter: [
      authForNormalUser,
    ],
  },

  {
    path: "/web/notifications",
    name: "New",
    component: () => import("../views/frontend/views/New.vue"),
    beforeEnter: [
      authForNormalUser,
    ],
  },
  {
    path: "/web/more/:event_id/:child_id",
    name: "more",
    props: true,
    component: () => import("../views/frontend/views/more.vue"),
    beforeEnter: [
      authForNormalUser,
    ],
  },

  {
    path: "/web/add-child",
    name: "ReAction",
    component: () => import("../views/frontend/views/ReAction.vue"),
    beforeEnter: [
      authForNormalUser,
    ],
  },
  {
    path: "/web/evaluation",
    name: "Edit",
    component: () => import("../views/frontend/views/Edit.vue"),
    beforeEnter: [
      authForNormalUser,
    ],
  },
  {
    path: "/web/profile",
    name: "Profile",
    component: () => import("../views/frontend/views/Profile.vue"),
    beforeEnter: [
      authForNormalUser,
    ],
  },

  //start Treatment

  //

  {
    path: "/web/following",
    name: "Following",
    component: () => import("../views/frontend/views/Following.vue"),
    beforeEnter: [
      authForNormalUser,
    ],
  },

  {
    path: "/web/appointment",
    name: "Booking",
    component: () => import("../views/frontend/views/Booking.vue"),
    beforeEnter: [
      authForNormalUser,
    ],
  },
  ///////////////End Front End Users Routes //////////////////

  {
    path: "/sawa-admin",
    component: Home,
    name: "Home",
    beforeEnter: auth,
    children: [
      // /sawa-admin opens the statistics dashboard or, without "dashboard index", the welcome page.
      {
        path: "",
        name: "adminHome",
        redirect: () => homeRoute(),
      },
      {
        path: "welcome",
        name: "welcome",
        component: () => import("../views/Welcome.vue"),
      },
      ...Object.values(siteRoutes),
      ...Object.values(rooms),
      ...Object.values(vb),
      ...Object.values(rolesRoutes),
      ...Object.values(permissionsRoutes),
      ...Object.values(usersRoutes),
      ...Object.values(childrenRoutes),
      ...Object.values(QuestionHeadersRoutes),
      ...Object.values(EvaluationsRoutes),
      ...Object.values(therapeutic),
      ...Object.values(appointment),
      ...Object.values(studentprogram),
      ...Object.values(treatment_type),
      ...Object.values(inputs),
      ...Object.values(hr),
      ...Object.values(reinforcer),
      ...Object.values(sideProfileRoutes),
      ...Object.values(calender),
      ...Object.values(parentsRoutes),
    ],
  },
  {
    path: "/sawa-admin/login",
    name: "Login",
    beforeEnter: guest,
    component: () => import("@/components/Login.vue"),
  },

  {
    path: "/unauthorized",
    name: "unauthorized",
    component: page_403,
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: () => import("@/components/ForgotPassword.vue"),
  },
  {
    path: "/password-reset/:token",
    name: "ResetPassword",
    component: () => import("@/components/ResetPassword.vue"),
  },
  {
    path: "/print-child-result/:child_id/:sideProfile_id/:evaluation_id/:start/:end",
    name: "printChildResult",
    beforeEnter: auth,
    meta: { permission: ["evaluation results list"] },
    component: () => import("@/views/children/ChildResultPrint.vue"),
  },
  {
    path: "/print-child-result/:child_id/:sideProfile_id/:evaluation_id",
    name: "printChildResultfilter",
    beforeEnter: auth,
    meta: { permission: ["evaluation results list"] },
    component: () => import("@/views/children/ChildResultPrintflter.vue"),
  },
  {
    path: "/ResultPrint/:child_id/:sideProfile_id",
    name: "ResultPrint",
    beforeEnter: auth,
    meta: { permission: ["evaluation results list"] },
    component: () => import("../views/children/ResultPrint.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Dashboard pages need their permission; without it the user is sent home quietly.
router.beforeEach((to) => {
  if (!useAuthStore().authenticated) return true;
  if (to.matched.every((record) => canVisit(record))) return true;
  return homeRoute();
});

export default router;
