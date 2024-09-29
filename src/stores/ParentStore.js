import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useStorage } from "@vueuse/core";
import { useAuthStore } from "../stores/Auth";
import Code from "../views/frontend/views/code.vue";
export const useParentStore = defineStore("parentStore", {
  state: () => ({
    parent: useStorage("parent", {}),
    parent_id: useStorage("parent_id", ''),

    token: useStorage("token", null),
    parentAuth: useStorage("parentAuth", false),

    showErrors: ref(false),
    authErrors: {},
  }),
  getters: {
    user: (state) => state.parent,
    errors: (state) => state.authErrors?.errors,
    errorMessage: (state) => state.authErrors?.message,
  },
  actions: {
    async login(parent) {
      this.authErrors = [];
      this.showErrors = false;
      await axios
        .post("api/parent/login", parent)
        .then((res) => {
          useAuthStore().resetAuthStore()
          this.parent = res.data.user;
          this.parent_id=res.data.user.parent_id
          this.token = res.data.token;
          this.parentAuth = true;

          // if (res.data.user.phone_verified_at == null) {
          //   console.log("asdf");
          //   this.router.push({ name: "code" });
          // } else {
          //   console.log(res);
          if(localStorage.getItem("lastRoute")){
            this.router.push(localStorage.getItem("lastRoute"));
          }
          else{
            
            this.router.push({name: 'home' });
          }
          // }
        })
        .catch((err) => {
          this.showErrors = true;
          this.authErrors = err.response.data;
          console.log(err);
        });
    },
    async register(parent) {
      console.log(parent);
      this.authErrors = [];
      this.showErrors = false;
      await axios
        .post("api/parent/verify-code",{
          email:localStorage.getItem("email_parent"),
          code:parent.num1+parent.num2+parent.num3+parent.num4

        } )
        .then((res) => {
          this.parent = res.data.user;
          this.token = res.data.token;
          this.parentAuth = true;
          console.log(res);
          this.router.push("/web");
        })
        .catch((err) => {
          this.showErrors = true;
          this.authErrors = err.response.data;
          console.log(err);
        });
    },
    getUser() {},
    logout() {
      axios
        .post("/api/parent/logout")
        .then((res) => {
          this.resetAuthStore();
          localStorage.removeItem("token");
          localStorage.removeItem("parent");
          localStorage.removeItem("parentAuth");
          this.router.push("/web/parent/login");
        })
        .catch((err) => {
          console.log(err);
        });
    },

    resetAuthStore() {
      this.token = null;
      this.parent = null;
      this.parent_id=null
      this.parentAuth = null;
      this.showErrors = null;
      this.authErrors = null;
    },
  },
});
