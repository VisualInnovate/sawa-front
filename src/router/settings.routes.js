const SiteSettings = () => import("@/views/site/Settings.vue");

const rolesRoutes = [
  {
    path: "settings",
    name: "settings",
    meta: { permission: ["settings list"] },
    component: SiteSettings,
  },
  // «المساعد الذكي»: what the parent portal assistant may reach, its questions, rules, usage and conversations.
  {
    path: "ai-assistant",
    name: "ai-assistant",
    meta: { permission: ["ai assistant list", "ai assistant edit"] },
    component: () => import("@/views/assistant/Settings.vue"),
  },
  // «تحليل النتائج»: the evaluations' outcomes across the academy (aggregates only).
  {
    path: "outcomes-analysis",
    name: "outcomes-analysis",
    meta: { permission: ["outcomes analysis list"] },
    component: () => import("@/views/analytics/Outcomes.vue"),
  },
  // «إعدادات التواصل»: the chat's and the calls' settings, the services' state and the month's use.
  {
    path: "communication-settings",
    name: "communication-settings",
    meta: { permission: ["communication settings list", "communication settings edit"] },
    component: () => import("@/views/communication/CommunicationSettings.vue"),
  },
  // «المهام التلقائية والتنبيهات»: the automatic tasks, the alerts, the WhatsApp connection and the system's health.
  {
    path: "system-automation",
    name: "system-automation",
    meta: { permission: ["system settings list", "system settings edit"] },
    component: () => import("@/views/system/SystemAutomation.vue"),
  },
];

export default {
  ...rolesRoutes,
};
