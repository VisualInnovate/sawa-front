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
import childrenRoutes from "./children.routes";
import QuestionHeadersRoutes from "./question-headers.routes";
import EvaluationsRoutes from "./evaluation.routes";
import therapeutic from "./therapeutic.routes";
import studentprogram from "./studentprogram.routes";
import treatment_type from "./treatment-type.routes";
import inputs from "./inputs.routes";
import sideProfileRoutes from "./side-profile.routes";
import calender from "./calender.routes";
import accounting from "./accounting.routes";
import page_403 from "../views/pages/page_403.vue";
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
  // ---- The parents' portal: the sign-in pages, then everything under /web inside the portal frame. ----
  {
    path: "/web/parent/register",
    name: "SingUp",
    component: () => import("../views/parent/auth/Register.vue"),
    beforeEnter: guestForNormalUser,
  },
  {
    path: "/web/parent/login",
    name: "parentLogin",
    component: () => import("../views/parent/auth/Login.vue"),
    beforeEnter: guestForNormalUser,
  },
  {
    path: "/web/parent/forgetpassword",
    name: "forgetpassword",
    component: () => import("../views/parent/auth/Forgot.vue"),
    beforeEnter: guestForNormalUser,
  },
  {
    path: "/web/parent/restepassword",
    name: "restepassword",
    component: () => import("../views/parent/auth/Reset.vue"),
    beforeEnter: guestForNormalUser,
  },
  { path: "/web/code", name: "code", redirect: { name: "parentLogin" } },
  { path: "/web/register-code", name: "register-code", redirect: { name: "parentLogin" } },
  // Open to visitors too (the public pages link here); a signed-in parent sees it inside the portal.
  {
    path: "/web/contactus",
    name: "contactus",
    component: () => import("../views/parent/Contact.vue"),
  },
  {
    path: "/web",
    component: () => import("../views/parent/ParentShell.vue"),
    beforeEnter: authForNormalUser,
    children: [
      { path: "", name: "webHome", component: () => import("../views/parent/Home.vue") },
      { path: "clidreen_parents", name: "clidreen_parents", component: () => import("../views/parent/Children.vue") },
      { path: "children/:child_id(\\d+)", name: "parent-child", component: () => import("../views/parent/ChildDetails.vue"), props: true },
      { path: "programs", name: "parent-programs", component: () => import("../views/parent/Programs.vue") },
      // «المالية»: the family's and each child's dues, discounts, receipts and compensations (reading only).
      { path: "finances", name: "parent-finances", component: () => import("../views/parent/Finances.vue") },
      { path: "receipts/:child_id(\\d+)/:payment_id(\\d+)", name: "parent-receipt", component: () => import("../views/parent/Receipt.vue"), props: true },
      { path: "appointment", name: "Booking", component: () => import("../views/parent/Consultations.vue") },
      // «احجز تقييماً»: the public pages' button; the parent picks the child, then the day and the time.
      { path: "evaluation", name: "Edit", component: () => import("../views/parent/BookEvaluation.vue") },
      { path: "booking-time/:child_id", name: "BookingTime", component: () => import("../views/parent/BookSlot.vue"), props: true },
      { path: "more/:event_id/:child_id", name: "more", component: () => import("../views/parent/BookingDetails.vue"), props: true },
      { path: "/request-meeting/:child_id", name: "request-meeting", component: () => import("../views/parent/Meeting.vue"), props: true },
      { path: "add-child", name: "ReAction", component: () => import("../views/parent/AddChild.vue") },
      { path: "following", name: "Following", redirect: { name: "clidreen_parents" } },
      { path: "notifications", name: "New", component: () => import("../views/parent/Notifications.vue") },
      // The free M-CHAT-R at home (kept for the parent only); opened on a child or with the child picker.
      { path: "mchat/:child_id?", name: "parent-mchat", component: () => import("../views/parent/Mchat.vue") },
      { path: "generalizations", name: "parent-generalizations", component: () => import("../views/parent/Generalizations.vue") },
      { path: "profile", name: "Profile", component: () => import("../views/parent/Profile.vue") },
      // The weekly schedule of the parent's children (sessions, inclusion, evaluations, consultations).
      { path: "schedule", name: "parent-schedule", component: () => import("../views/parent/Schedule.vue") },
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
      ...Object.values(studentprogram),
      ...Object.values(treatment_type),
      ...Object.values(inputs),
      ...Object.values(hr),
      ...Object.values(sideProfileRoutes),
      ...Object.values(calender),
      ...Object.values(parentsRoutes),
      ...Object.values(accounting),
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
    // A running session, full screen, outside the dashboard layout.
    path: "/session-run/:id",
    name: "session-run",
    beforeEnter: auth,
    meta: { permission: ["sessions list"] },
    component: () => import("@/views/sessions/SessionRun.vue"),
  },
  {
    // A receipt («سند قبض») as a printable sheet, outside the dashboard layout.
    path: "/accounting-receipt/:id",
    name: "accounting-receipt",
    beforeEnter: auth,
    meta: { permission: ["accounting list", "accounting payments create"] },
    component: () => import("@/views/accounting/ReceiptPrint.vue"),
  },
  {
    // A room's weekly activities as a printable sheet, outside the dashboard layout.
    path: "/room-activities-print/:roomId",
    name: "room-activities-print",
    beforeEnter: auth,
    meta: { permission: ["room activities list", "room activities edit"] },
    component: () => import("@/views/activities/RoomActivitiesPrint.vue"),
  },
  {
    // The printable evaluation report (A4 pages with editable fields), outside the dashboard layout.
    path: "/evaluation-report/:childId",
    name: "evaluation-report",
    beforeEnter: auth,
    meta: { permission: ["evaluation reports list"] },
    component: () => import("@/views/reports/ReportEditor.vue"),
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
