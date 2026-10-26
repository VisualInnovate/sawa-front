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
  // «المساعد الذكي»: what the parent portal assistant may reach, its questions, rules, usage and conversations.
  {
    path: "ai-assistant",
    name: "ai-assistant",
    meta: { permission: ["ai assistant list", "ai assistant edit"] },
    component: () => import("@/views/assistant/Settings.vue"),
  },
];

export default {
  ...rolesRoutes,
};
