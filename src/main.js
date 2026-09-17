import { createApp, markRaw, watch } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import i18n from "@/plugins/i18n";
import installPrimeVue, { setPrimeLocale } from "@/plugins/primevue";
import VueHtmlToPaper from "vue-html-to-paper";
import print from "vue3-print-nb";
import VOtpInput from "vue3-otp-input";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faUserSecret, faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import "primeicons/primeicons.css";
import "animate.css";
import "./main.css";
import "./style.css";
import "./views/frontend/assets/main.css";
import "./styles/app.css";

import resetStore from "@/plugins/reset-store";
import "./axios";
import { can, isAdmin } from "@/utils/permissions";
import { applyDirection } from "@/utils/direction";
import installButtonLoading from "@/plugins/button-loading";
import App from "@/App.vue";
import BackButton from "@/components/common/BackButton.vue";

installButtonLoading();
library.add(faUserSecret, faChevronLeft);

const pinia = createPinia();
// use router in pinia store
pinia.use(({ store }) => {
  store.router = markRaw(router);
});
pinia.use(resetStore);

const app = createApp(App);
app.use(pinia);
app.use(i18n);
app.use(router);
installPrimeVue(app, i18n.global.locale.value);
app.use(print);
app.use(VueHtmlToPaper);
app.component("v-otp-input", VOtpInput);
app.component("font-awesome-icon", FontAwesomeIcon);
app.component("BackButton", BackButton);

// v-can="'child create'" or v-can="['child create', 'child edit']" (any of them) — hides the element otherwise.
const applyCan = (el, binding) => {
  if (el.__canDisplay === undefined) el.__canDisplay = el.style.display;
  el.style.display = can(binding.value) ? el.__canDisplay : "none";
};
app.directive("can", { mounted: applyCan, updated: applyCan });
app.config.globalProperties.$can = can;
app.config.globalProperties.$isAdmin = isAdmin;

// One place decides the page direction: <html dir/lang> follow the app language, and so
// do PrimeVue's built-in texts (overlays are teleported to <body>, so <html> must carry dir).
watch(
  i18n.global.locale,
  (lang) => {
    applyDirection(lang);
    setPrimeLocale(app, lang);
    // Tables without their own #empty slot show this text (styles/app.css).
    document.documentElement.style.setProperty("--sawa-empty-text", JSON.stringify(i18n.global.t("no_data")));
  },
  { immediate: true }
);

app.mount("#app");
