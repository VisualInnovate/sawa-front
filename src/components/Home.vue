<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import "@mdi/font/css/materialdesignicons.css";
import sawaLogo from "../assets/img/sawa_logo.svg";
import { useAuthStore } from "../stores/Auth";
import { canVisit, homeRoute } from "../utils/permissions";
import LocaleSelect from "./LocaleSelect.vue";
import UserProfileMenu from "./UserProfileMenu.vue";
import AdminSidebar from "./layout/AdminSidebar.vue";
import { buildMenu, visibleMenu } from "./layout/menu";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// Rebuilt when the permissions change (they are refreshed from the API on load).
const menu = computed(() => {
  void authStore.userPermissions;
  return visibleMenu(buildMenu());
});

const desktopQuery = window.matchMedia("(min-width: 1024px)");
const isDesktop = ref(desktopQuery.matches);
const sidebarOpen = ref(isDesktop.value);
const menuToggle = ref(null);
const closeSidebar = () => {
  sidebarOpen.value = false;
  menuToggle.value?.$el?.focus();
};
const onMediaChange = (event) => {
  isDesktop.value = event.matches;
  sidebarOpen.value = event.matches;
};

const closeOnMobile = () => {
  if (!isDesktop.value) sidebarOpen.value = false;
};
watch(() => route.fullPath, closeOnMobile);

onMounted(async () => {
  desktopQuery.addEventListener("change", onMediaChange);
  await authStore.getUser();
  // The role may have changed since sign-in; leave a page it no longer allows.
  const current = router.currentRoute.value;
  if (!current.matched.every((record) => canVisit(record))) {
    router.replace(homeRoute());
  }
});
onBeforeUnmount(() => desktopQuery.removeEventListener("change", onMediaChange));
</script>

<template>
  <div class="admin-shell" :class="{ 'sidebar-collapsed': !sidebarOpen }">
    <header class="admin-header" data-no-request-spinner>
      <Button
        ref="menuToggle"
        type="button"
        icon="pi pi-bars"
        severity="secondary"
        variant="text"
        rounded
        :aria-label="$t('toggle_menu')"
        :aria-expanded="sidebarOpen"
        aria-controls="admin-sidebar"
        @click="sidebarOpen = !sidebarOpen" />
      <router-link :to="homeRoute()" class="admin-brand">
        <img :src="sawaLogo" alt="Sawa" />
      </router-link>
      <div class="admin-header-actions">
        <LocaleSelect />
        <UserProfileMenu v-if="authStore.authenticated" />
        <Button v-else as="router-link" :to="{ name: 'Login' }" :label="$t('sign_in')" />
      </div>
    </header>

    <div v-if="sidebarOpen && !isDesktop" class="admin-backdrop" @click="closeSidebar" />
    <AdminSidebar :items="menu" :compact="isDesktop && !sidebarOpen" :desktop="isDesktop"
      :visible="isDesktop || sidebarOpen" @toggle="sidebarOpen = !sidebarOpen"
      @close="closeSidebar" @expand="sidebarOpen = true" @navigate="closeOnMobile" />

    <main class="admin-main">
      <div class="admin-content">
        <RouterView />
      </div>
      <footer class="admin-footer">{{ $t("footer_text") }}</footer>
    </main>
  </div>
</template>

<style scoped>
.admin-shell {
  --header-h: 64px;
  --sidebar-w: 272px;
  --sidebar-gap: 16px;
  min-height: 100vh;
  background: var(--sawa-page-bg);
}

.admin-header {
  position: fixed;
  inset-block-start: 0;
  inset-inline: 0;
  z-index: 30;
  height: var(--header-h);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-inline: 0.75rem 1rem;
  background: #fff;
  border-bottom: 1px solid var(--sawa-border);
}
.admin-brand img {
  height: 44px;
  width: auto;
  display: block;
}
.admin-header-actions {
  margin-inline-start: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sidebar-collapsed { --sidebar-w: 80px; }

.admin-backdrop {
  position: fixed;
  inset: 0;
  z-index: 35;
  background: rgba(17, 47, 51, 0.38);
  backdrop-filter: blur(3px);
}

.admin-main {
  min-width: 0;
  padding-block-start: var(--header-h);
  padding-inline-start: calc(var(--sidebar-w) + var(--sidebar-gap));
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: padding 0.2s ease;
}
.admin-content {
  flex: 1;
  width: 100%;
  min-width: 0;
  max-width: 1400px;
  margin-inline: auto;
  padding: 1.25rem;
}
/* Pages wrap their content in Tailwind grids; let those columns shrink with the screen. */
.admin-content :deep(.grid > *) {
  min-width: 0;
}
.admin-footer {
  padding: 0.9rem 1rem;
  text-align: center;
  color: #fff;
  font-size: 0.875rem;
  background: var(--sawa-accent);
}

@media (max-width: 1023px) {
  .admin-main {
    padding-inline-start: 0;
  }
  .admin-content {
    padding: 1rem 0.75rem;
  }
}
@media print {
  .admin-header,
  .admin-sidebar,
  .admin-footer {
    display: none;
  }
  .admin-main {
    padding: 0;
  }
}
@media (prefers-reduced-motion: reduce) { .admin-main { transition: none; } }
</style>
