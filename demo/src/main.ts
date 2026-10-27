import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./styles/tokens.css";
import "./engine/backend";

createApp(App).use(createPinia()).mount("#demo");
