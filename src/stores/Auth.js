import { defineStore } from "pinia";
import axios from "axios";
import { useStorage } from "@vueuse/core";
import { ref } from "vue";
import { useParentStore } from "../stores/ParentStore";
import { homeRoute } from "@/utils/permissions";
import i18n from "@/plugins/i18n";
export const useAuthStore = defineStore("Auth", {
  state: () => ({
    authUser: useStorage("authUser", {}),
    authenticated: useStorage("authenticated", false),
    userPermissions: useStorage("userPermissions", []),
    type: useStorage("type", []),
    user_id: useStorage("user_id", []),
    authErrors: [],
    token: useStorage("token", null),
    msg: "",
    loading: ref(false),
  }),
  getters: {
    user: (state) => state.authUser,
    permissions: (state) => state.userPermissions,
    errors: (state) => state.authErrors,
    successMsg: (state) => state.msg,
  },
  actions: {
    // Refresh the user and their role permissions so role changes apply without signing in again.
    async getUser() {
      if (this.authenticated != true) return;
      const response = await axios.get("api/get-user");
      this.applyUser(response.data.user);
    },
    applyUser(user) {
      this.authUser = user;
      this.userPermissions = Array.isArray(user?.roles_permissions) ? user.roles_permissions : [];
      this.type = user?.type;
      this.user_id = user?.user_id;
    },
    async handleLogin(data) {
      if (this.loading) return;
      this.resetAuthStore();
      this.loading = true;
      try {
        const response = await axios.post("/api/login", {
          email: data.email,
          password: data.password,
        });
        useParentStore().resetAuthStore()
        
        this.authenticated = true;
        this.token = response.data.tokens;
        this.applyUser(response.data.user);
        this.router.push(homeRoute());
      } catch (error) {
        const errors = error.response?.data?.errors;
        if (error.response?.status === 422 && Array.isArray(errors)) {
          this.authErrors = errors;
        } else if (error.response?.status === 422) {
          // "Password mismatch" / "User doesn't exist": one message that doesn't reveal which.
          this.authErrors = [i18n.global.t("invalid_credentials")];
        } else {
          this.authErrors = [i18n.global.t("request_failed_retry")];
        }
      } finally {
        this.loading = false;
      }
    },
     handleLogout() {
      this.resetAuthStore();
      this.router.push({ name: "Login" });
       axios.post("/api/logout");
      
    
    },
    resetAuthStore() {
      this.authUser = null;
      this.token = null;
      this.authenticated = false;
      this.userPermissions = [];
      this.authErrors = [];
      this.msg = "";
      this.loading = false;
    },
  },
});