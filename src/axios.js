import axios from "axios";
import router from "@/router";
import { useAuthStore } from "@/stores/Auth";
import { useParentStore } from "@/stores/ParentStore";

const readStorageValue = (key) => {
  const value = localStorage.getItem(key);

  if (value == null) return null;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

axios.defaults.baseURL = "https://sys.sawa.sawa.academy/";

axios.interceptors.request.use((config) => {
  config.headers ??= {};
  config.headers.lang = localStorage.getItem("appLang");
  config.headers.Accept = "application/json";

  if (!config.skipAuth) {
    const isParentSession = Boolean(readStorageValue("parentAuth"));
    const token = isParentSession
      ? readStorageValue("parentToken")
      : readStorageValue("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
  }

  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.skipAuthRedirect) {
      const isParentRequest = error.config?.url?.includes("api/parent/");
      const isParentSession =
        Boolean(readStorageValue("parentAuth")) || isParentRequest;
      const routeName = isParentSession ? "parentLogin" : "Login";

      try {
        if (isParentSession) {
          useParentStore().resetAuthStore();
        } else {
          useAuthStore().resetAuthStore();
        }
      } catch {
        // The interceptor can run before Pinia is available; clear persisted state as a fallback.
        const keys = isParentSession
          ? ["parent", "parent_id", "parentToken", "parentAuth", "lastRoute"]
          : ["authUser", "authenticated", "userPermissions", "type", "user_id", "token"];
        keys.forEach((key) => localStorage.removeItem(key));
      }

      if (router.currentRoute.value.name !== routeName) {
        router.replace({ name: routeName }).catch(() => {});
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
