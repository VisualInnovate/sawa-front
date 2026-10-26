<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useParentStore } from "@/stores/ParentStore";
import ParentAssistantChat from "@/components/assistant/ParentAssistantChat.vue";

const route = useRoute();
const parentStore = useParentStore();

// The parent assistant: on the parent portal pages of a signed-in parent (not the sign-in pages).
const signInPages = ["parentLogin", "SingUp", "forgetpassword", "restepassword"];
const showAssistant = computed(
  () => parentStore.isAuthenticated && /^\/(web|request-meeting)(\/|$)/.test(route.path) && !signInPages.includes(route.name)
);
</script>

<template>
  <RouterView />
  <ParentAssistantChat v-if="showAssistant" />
</template>
