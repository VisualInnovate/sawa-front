import { useAuthStore } from "@/stores/Auth";

/** The one custom permission: the statistics dashboard. Everything else is "<module> <action>". */
export const DASHBOARD_PERMISSION = "dashboard index";

/** Permission names of the signed-in dashboard user (from the role, kept in the auth store). */
export function currentPermissions() {
  const list = useAuthStore().userPermissions;
  return Array.isArray(list) ? list : [];
}

/** True when the user has at least one of the given permissions. */
export function can(...names) {
  const owned = currentPermissions();
  return names.flat().some((name) => owned.includes(name));
}

/** The locked admin role (always holds every permission). */
export const ADMIN_ROLE = "admin";

export function isAdmin() {
  return useAuthStore().authUser?.roles?.name === ADMIN_ROLE;
}

/** Route meta: { permission: [...] } needs any of them, { adminOnly: true } needs the admin role. */
export function canVisit(route) {
  const meta = route.meta || {};
  if (meta.adminOnly) return isAdmin();
  if (meta.permission) return can(meta.permission);
  return true;
}

/** Where a dashboard user lands: the statistics dashboard if allowed, otherwise the welcome page. */
export function homeRoute() {
  return { name: can(DASHBOARD_PERMISSION) ? "dashbord" : "welcome" };
}
