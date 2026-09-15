import { defineStore } from "pinia";
import axios from "axios";
import { useStorage } from "@vueuse/core";
import { useAuthStore } from "../stores/Auth";

const getToken = (payload) =>
  payload?.token ??
  payload?.tokens ??
  payload?.access_token ??
  payload?.data?.token ??
  payload?.data?.tokens ??
  null;

const getUser = (payload) => payload?.user ?? payload?.data?.user ?? {};

// Server errors (5xx) can carry exception text such as SMTP details; never show it to parents.
export const SERVER_ERROR_MESSAGE =
  "تعذر إتمام الطلب بسبب خطأ في الخادم. حاول لاحقاً أو تواصل مع الأكاديمية.";

const toClientError = (error, fallbackMessage) => {
  const status = error.response?.status;
  if (!error.response || status >= 500) {
    return { message: error.response ? SERVER_ERROR_MESSAGE : fallbackMessage };
  }
  return error.response.data ?? { message: fallbackMessage };
};

export const useParentStore = defineStore("parentStore", {
  state: () => ({
    // The default must be an object so VueUse serializes the complete user as JSON.
    parent: useStorage("parent", {}),
    parent_id: useStorage("parent_id", null),
    // Keep the parent session separate from the administration session.
    parentToken: useStorage("parentToken", null),
    parentAuth: useStorage("parentAuth", false),
    showErrors: false,
    authErrors: {},
    loading: false,
  }),
  getters: {
    user: (state) => state.parent ?? {},
    errors: (state) => state.authErrors?.errors ?? {},
    errorMessage: (state) => state.authErrors?.message,
    isAuthenticated: (state) => Boolean(state.parentAuth && state.parentToken),
  },
  actions: {
    storeSession(payload) {
      const token = getToken(payload);

      if (!token) {
        return false;
      }

      const user = getUser(payload);
      this.parent = user && typeof user === "object" ? user : {};
      this.parent_id =
        user?.parent_id ??
        user?.id ??
        payload?.parent_id ??
        payload?.data?.parent_id ??
        null;
      this.parentToken = token;
      this.parentAuth = true;
      return true;
    },

    async redirectAfterLogin() {
      const lastRoute = localStorage.getItem("lastRoute");
      localStorage.removeItem("lastRoute");

      await this.router.replace(lastRoute || { name: "webHome" });
    },

    async login(parent) {
      if (this.loading) return;

      this.authErrors = {};
      this.showErrors = false;
      this.loading = true;

      try {
        const response = await axios.post("/api/parent/login", parent, {
          skipAuth: true,
          skipAuthRedirect: true,
        });

        if (!this.storeSession(response.data)) {
          this.showErrors = true;
          this.authErrors = {
            message: "تعذر إتمام تسجيل الدخول: لم يتم استلام رمز الجلسة.",
          };
          return;
        }

        // A parent session and an administration session must not share state.
        useAuthStore().resetAuthStore();
        await this.redirectAfterLogin();
      } catch (error) {
        const responseData = error.response?.data;

        if (responseData?.status === 401) {
          localStorage.setItem("email_parent", parent.email ?? "");
          await this.router.push({ name: "register-code" });
          return;
        }

        this.showErrors = true;
        this.authErrors = toClientError(
          error,
          "تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى."
        );
      } finally {
        this.loading = false;
      }
    },

    async register(parent) {
      if (this.loading) return;

      this.authErrors = {};
      this.showErrors = false;
      this.loading = true;

      try {
        const code = Array.isArray(parent.otp)
          ? parent.otp.join("")
          : parent.otp;
        const response = await axios.post(
          "/api/parent/verify-code",
          {
            email: localStorage.getItem("email_parent"),
            code,
          },
          {
            skipAuth: true,
            skipAuthRedirect: true,
          }
        );

        if (!this.storeSession(response.data)) {
          this.showErrors = true;
          this.authErrors = {
            message: "تعذر إتمام التحقق: لم يتم استلام رمز الجلسة.",
          };
          return;
        }

        useAuthStore().resetAuthStore();
        localStorage.removeItem("email_parent");
        await this.redirectAfterLogin();
      } catch (error) {
        this.showErrors = true;
        this.authErrors = toClientError(
          error,
          "تعذر التحقق من الرمز. يرجى المحاولة مرة أخرى."
        );
      } finally {
        this.loading = false;
      }
    },

    async getUser() {
      if (!this.isAuthenticated) return null;

      const response = await axios.get("/api/parent/user");
      const user = getUser(response.data);

      if (user && typeof user === "object") {
        this.parent = user;
        this.parent_id = user.parent_id ?? user.id ?? this.parent_id;
      }

      return user;
    },

    async logout() {
      try {
        await axios.post("/api/parent/logout");
      } finally {
        // Local logout must complete even if the server request fails or the token expired.
        this.resetAuthStore();
        await this.router.replace({ name: "parentLogin" });
      }
    },

    resetAuthStore() {
      this.parent = {};
      this.parent_id = null;
      this.parentToken = null;
      this.parentAuth = false;
      this.showErrors = false;
      this.authErrors = {};
      this.loading = false;

      ["parent", "parent_id", "parentToken", "parentAuth", "lastRoute"].forEach(
        (key) => localStorage.removeItem(key)
      );
    },
  },
});
