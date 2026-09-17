<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import "@mdi/font/css/materialdesignicons.css";
import sawaLogo from "../assets/img/sawa_logo.svg";
import { useAuthStore } from "../stores/Auth";
import { canVisit, homeRoute } from "../utils/permissions";
import LocaleSelect from "./LocaleSelect.vue";
import UserProfileMenu from "./UserProfileMenu.vue";
import SideMenuItem from "./layout/SideMenuItem.vue";
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

    <div v-if="sidebarOpen && !isDesktop" class="admin-backdrop" @click="sidebarOpen = false" />

    <aside id="admin-sidebar" data-no-request-spinner class="admin-sidebar" :class="{ open: sidebarOpen }" :aria-hidden="!sidebarOpen">
      <nav :aria-label="$t('main_menu')">
        <ul class="side-menu">
          <SideMenuItem v-for="item in menu" :key="item.key" :item="item" @navigate="closeOnMobile" />
        </ul>
      </nav>
    </aside>

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
  --sidebar-w: 256px;
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

.admin-sidebar {
  position: fixed;
  inset-block: var(--header-h) 0;
  inset-inline-start: 0;
  z-index: 25;
  width: var(--sidebar-w);
  max-width: 85vw;
  overflow-y: auto;
  /* Original drawer: 46px top space, 8px list padding, hidden scrollbar. */
  padding: 54px 8px 8px;
  background: var(--sawa-primary);
  border-inline-end: 1px solid rgba(0, 0, 0, 0.12);
  transition: transform 0.2s ease;
  scrollbar-width: none;
}
.admin-sidebar::-webkit-scrollbar {
  display: none;
}
.admin-sidebar:not(.open) {
  transform: translateX(-100%);
  visibility: hidden;
}
[dir="rtl"] .admin-sidebar:not(.open) {
  transform: translateX(100%);
}
.side-menu {
  margin: 0;
  padding: 0;
  display: grid;
  gap: 19px;
}

.admin-backdrop {
  position: fixed;
  inset: var(--header-h) 0 0 0;
  z-index: 24;
  background: rgba(15, 23, 42, 0.4);
}

.admin-main {
  min-width: 0;
  padding-block-start: var(--header-h);
  padding-inline-start: var(--sidebar-w);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: padding 0.2s ease;
}
.sidebar-collapsed .admin-main {
  padding-inline-start: 0;
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
</style>
