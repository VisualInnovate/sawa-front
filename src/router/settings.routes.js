const SiteSettings = () => import("@/views/site/Settings.vue");
const SitePages = () => import("@/views/site/Pages.vue");

const rolesRoutes = [
  {
    path: "settings",
    name: "settings",
    meta: { permission: ["settings list"] },
    component: SiteSettings,
  },
  {
    path: "pages",
    name: "pages",
    meta: { permission: ["pages list"] },
    component: SitePages,
  },
];

export default {
  ...rolesRoutes,
};
