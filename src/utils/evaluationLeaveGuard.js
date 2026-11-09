// The evaluation answering screens keep every answer on the page and send them only at the end, so leaving by mistake
// (the back button, a tablet's back swipe, closing or refreshing the tab) loses them all. While a screen is answering,
// leaving asks first. Moving to a result page (after saving) or to the same screen (continuing an evaluation) never asks.
import { onBeforeUnmount, onMounted } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import i18n from "@/plugins/i18n";

const freeTarget = (to, from) => to.name === from.name || /result/i.test(String(to.name ?? ""));
const ask = () => window.confirm(i18n.global.t("eval_leave.confirm"));

// Closing or refreshing the tab: the browser shows its own "leave site?" message.
const onUnload = (active) => (event) => {
  if (!active()) return;
  event.preventDefault();
  event.returnValue = "";
};

/**
 * `<script setup>` screens. `active()`: whether leaving would lose answers (default: always on this screen).
 * Returns `allowLeave()`, for a screen that moves on by itself after saving to a page other than a result.
 */
export function useEvaluationLeaveGuard(active = () => true) {
  let allowed = false;
  const isActive = () => !allowed && active();
  onBeforeRouteLeave((to, from) => !isActive() || freeTarget(to, from) || ask());
  const unload = onUnload(isActive);
  onMounted(() => window.addEventListener("beforeunload", unload));
  onBeforeUnmount(() => window.removeEventListener("beforeunload", unload));
  return { allowLeave: () => { allowed = true; } };
}

/**
 * Options API screens: Vue Router reads `beforeRouteLeave` only from the component itself (not from a mixin), so each
 * screen sets `beforeRouteLeave: leaveEvaluation` and adds the mixin (closing / refreshing the tab). A screen may define
 * `leaveGuardActive()`.
 */
export function leaveEvaluation(to, from) {
  const active = typeof this.leaveGuardActive === "function" ? this.leaveGuardActive() : true;
  return !active || freeTarget(to, from) || ask();
}
export const evaluationLeaveGuard = {
  mounted() {
    this.$_leaveUnload = onUnload(() => (typeof this.leaveGuardActive === "function" ? this.leaveGuardActive() : true));
    window.addEventListener("beforeunload", this.$_leaveUnload);
  },
  beforeUnmount() {
    window.removeEventListener("beforeunload", this.$_leaveUnload);
  },
};
