<script setup>
// The floating «التواصل» button on every page (staff dashboard and parent portal), with the unread count; hidden on
// the communication page itself.
import { computed } from "vue";
import { useRoute } from "vue-router";
import { comm } from "@/utils/communication";

const props = defineProps({ side: { type: String, required: true } });
const route = useRoute();
const target = computed(() => ({ name: props.side === "parent" ? "parent-messages" : "communication" }));
const unread = computed(() => comm.conversations.reduce((n, c) => n + (Number(c.unread) || 0), 0));
const hidden = computed(() => route.name === target.value.name || !!comm.call);
</script>

<template>
  <router-link v-if="!hidden" :to="target" class="comm-fab" :aria-label="$t('comm.open_chat')" v-tooltip.top="$t('comm.open_chat')">
    <i class="pi pi-comments" aria-hidden="true" />
    <span v-if="unread" class="comm-fab__badge">{{ unread > 99 ? "99+" : unread }}</span>
  </router-link>
</template>

<style scoped>
.comm-fab {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #b21553;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgb(178 21 83 / 0.35);
  transition: transform 0.15s;
}
.comm-fab:hover { transform: scale(1.06); }
.comm-fab .pi { font-size: 1.5rem; }
.comm-fab__badge {
  position: absolute;
  top: -4px;
  inset-inline-end: -4px;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 999px;
  background: #22c55e;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
}
@media (max-width: 480px) {
  .comm-fab { right: 12px; bottom: 12px; }
}
@media (max-width: 1023px) {
  :global(body.pp-has-tabbar) .comm-fab { bottom: calc(var(--pp-tabbar-h, 68px) + 14px + env(safe-area-inset-bottom, 0px)); }
}
</style>
