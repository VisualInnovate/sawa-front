<script setup>
// The parents' portal frame: the top bar (desktop), the tab bar (phones), the "more" sheet, the profile menu,
// and the page inside with a soft transition. Everything under /web for a signed-in parent renders here.
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { onClickOutside } from "@vueuse/core";
import { useParentStore } from "@/stores/ParentStore";
import { useParentPortalStore } from "@/stores/ParentPortal";
import { pendingCounts, watchPendingCounts } from "@/utils/pendingCounts";
import LocaleSelect from "@/components/LocaleSelect.vue";
import logo from "@/views/frontend/views/main/images/logo.png";

const route = useRoute();
const router = useRouter();
const parentStore = useParentStore();
const portal = useParentPortalStore();

const NAV = [
  { name: "webHome", icon: "pi pi-home", label: "pp.nav_home" },
  { name: "clidreen_parents", icon: "pi pi-users", label: "pp.nav_children", also: ["parent-child", "ReAction", "Following"] },
  { name: "parent-programs", icon: "pi pi-book", label: "pp.nav_programs" },
  { name: "Booking", icon: "pi pi-comments", label: "pp.nav_consultations", also: ["BookingTime", "more", "request-meeting", "Edit"] },
  { name: "parent-schedule", icon: "pi pi-calendar", label: "pp.nav_schedule" },
];
const MORE = [
  { name: "parent-generalizations", icon: "pi pi-home", label: "pp.nav_generalizations", badge: "generalizations" },
  { name: "New", icon: "pi pi-bell", label: "pp.nav_notifications", badge: "unread" },
  { name: "parent-mchat", icon: "pi pi-heart", label: "pp.nav_mchat" },
  { name: "Profile", icon: "pi pi-user", label: "pp.nav_profile" },
  { name: "contactus", icon: "pi pi-phone", label: "pp.nav_contact" },
];

const sheetOpen = ref(false);
const profileOpen = ref(false);
const profileMenu = ref(null);
onClickOutside(profileMenu, () => (profileOpen.value = false));

const isActive = (item) => route.name === item.name || (item.also ?? []).includes(route.name);
const moreActive = computed(() => MORE.some((item) => item.name === route.name));

const counts = computed(() => ({
  generalizations: Number(pendingCounts.parent.generalizations ?? portal.pending.generalizations ?? 0),
  unread: portal.unread,
}));
const badgeOf = (item) => (item.badge ? counts.value[item.badge] : 0);
const moreBadge = computed(() => MORE.reduce((sum, item) => sum + badgeOf(item), 0));

const firstName = computed(() => parentStore.user?.fname || portal.home?.parent?.fname || "");
const avatar = computed(() => parentStore.user?.image || portal.home?.parent?.image || null);

const go = (name) => {
  sheetOpen.value = false;
  profileOpen.value = false;
  router.push({ name });
};
const logout = async () => {
  sheetOpen.value = false;
  profileOpen.value = false;
  portal.reset();
  await parentStore.logout();
};

let stopCounts = null;
onMounted(() => {
  document.body.classList.add("pp-has-tabbar");
  stopCounts = watchPendingCounts("parent");
  portal.load();
  parentStore.getUser().catch(() => {});
});
onBeforeUnmount(() => {
  document.body.classList.remove("pp-has-tabbar");
  stopCounts?.();
});
// A new page starts at its top; the counters are read again (a page may have changed them).
watch(() => route.fullPath, () => {
  window.scrollTo({ top: 0, behavior: "auto" });
  sheetOpen.value = false;
});
</script>

<template>
  <div class="pp-shell">
    <!-- ===== Top bar ===== -->
    <header class="pp-topbar">
      <div class="pp-container pp-topbar__row">
        <router-link :to="{ name: 'webHome' }" class="pp-topbar__brand" :aria-label="$t('pp.brand')">
          <img :src="logo" alt="" class="pp-topbar__logo" />
        </router-link>

        <nav class="pp-topbar__nav" :aria-label="$t('main_menu')">
          <router-link v-for="item in NAV" :key="item.name" :to="{ name: item.name }" class="pp-nav-link" :class="{ 'is-active': isActive(item) }">
            <i :class="item.icon" aria-hidden="true" />
            <span>{{ $t(item.label) }}</span>
          </router-link>
          <router-link :to="{ name: 'parent-generalizations' }" class="pp-nav-link" :class="{ 'is-active': route.name === 'parent-generalizations' }">
            <i class="pi pi-home" aria-hidden="true" />
            <span>{{ $t("pp.nav_generalizations") }}</span>
            <span v-if="counts.generalizations" class="pp-nav-link__count">{{ counts.generalizations }}</span>
          </router-link>
        </nav>

        <div class="pp-topbar__tools">
          <LocaleSelect class="pp-topbar__lang" />
          <router-link :to="{ name: 'New' }" class="pp-icon-btn" :aria-label="$t('pp.nav_notifications')" :title="$t('pp.nav_notifications')">
            <i class="pi pi-bell" aria-hidden="true" />
            <span v-if="counts.unread" class="pp-badge">{{ counts.unread > 9 ? "9+" : counts.unread }}</span>
          </router-link>

          <div ref="profileMenu" class="pp-profile">
            <button type="button" class="pp-profile__btn" :aria-expanded="profileOpen" @click="profileOpen = !profileOpen">
              <img v-if="avatar" :src="avatar" alt="" class="pp-profile__img" />
              <span v-else class="pp-profile__initial" aria-hidden="true">{{ firstName.slice(0, 1) }}</span>
              <span class="pp-profile__name">{{ firstName }}</span>
              <i class="pi pi-angle-down" aria-hidden="true" />
            </button>
            <Transition name="pp-fade">
              <div v-if="profileOpen" class="pp-profile__menu" role="menu">
                <button type="button" role="menuitem" @click="go('Profile')"><i class="pi pi-user" /> {{ $t("pp.nav_profile") }}</button>
                <button type="button" role="menuitem" @click="go('parent-mchat')"><i class="pi pi-heart" /> {{ $t("pp.nav_mchat") }}</button>
                <button type="button" role="menuitem" @click="go('contactus')"><i class="pi pi-phone" /> {{ $t("pp.nav_contact") }}</button>
                <div class="pp-divider" />
                <button type="button" role="menuitem" class="is-danger" @click="logout"><i class="pi pi-sign-out" /> {{ $t("pp.logout") }}</button>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Phones: the bell and the language next to the logo. -->
        <div class="pp-topbar__mobile">
          <LocaleSelect />
          <router-link :to="{ name: 'New' }" class="pp-icon-btn" :aria-label="$t('pp.nav_notifications')">
            <i class="pi pi-bell" aria-hidden="true" />
            <span v-if="counts.unread" class="pp-badge">{{ counts.unread > 9 ? "9+" : counts.unread }}</span>
          </router-link>
        </div>
      </div>
    </header>

    <!-- ===== Page ===== -->
    <main class="pp-main">
      <div class="pp-container">
        <RouterView v-slot="{ Component }">
          <Transition name="pp-page" mode="out-in">
            <component :is="Component" :key="route.fullPath" />
          </Transition>
        </RouterView>
      </div>
    </main>

    <footer class="pp-footer pp-no-print">
      <div class="pp-container pp-footer__row">
        <span>{{ $t("pp.footer_line") }}</span>
        <a href="/" class="pp-link">{{ $t("pp.public_site") }}</a>
      </div>
    </footer>

    <!-- ===== Phone tab bar ===== -->
    <nav class="pp-tabbar" :aria-label="$t('main_menu')">
      <router-link v-for="item in NAV.slice(0, 4)" :key="item.name" :to="{ name: item.name }" :class="{ 'is-active': isActive(item) }">
        <i :class="item.icon" aria-hidden="true" />
        <span>{{ $t(item.label) }}</span>
      </router-link>
      <button type="button" :class="{ 'is-active': moreActive || sheetOpen }" @click="sheetOpen = true">
        <i class="pi pi-th-large" aria-hidden="true" />
        <span>{{ $t("pp.nav_more") }}</span>
        <span v-if="moreBadge" class="pp-tabbar__badge">{{ moreBadge }}</span>
      </button>
    </nav>

    <Drawer v-model:visible="sheetOpen" position="bottom" class="pp-sheet pp-overlay" :header="$t('pp.nav_more')" style="height: auto">
      <div class="pp-sheet__grid">
        <button v-for="item in [{ name: 'parent-schedule', icon: 'pi pi-calendar', label: 'pp.nav_schedule' }, ...MORE]" :key="item.name" type="button" class="pp-sheet__item" @click="go(item.name)">
          <span class="pp-item__icon"><i :class="item.icon" aria-hidden="true" /><span v-if="badgeOf(item)" class="pp-badge">{{ badgeOf(item) }}</span></span>
          <span>{{ $t(item.label) }}</span>
        </button>
        <button type="button" class="pp-sheet__item is-danger" @click="logout">
          <span class="pp-item__icon pp-item__icon--magenta"><i class="pi pi-sign-out" aria-hidden="true" /></span>
          <span>{{ $t("pp.logout") }}</span>
        </button>
      </div>
    </Drawer>
  </div>
</template>

<style scoped>
.pp-topbar {
  position: sticky;
  top: 0;
  z-index: 60;
  background: rgba(252, 249, 248, 0.85);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(28, 103, 114, 0.08);
}
.pp-topbar__row {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: var(--pp-nav-h);
}
.pp-topbar__brand {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}
.pp-topbar__logo {
  height: 44px;
  width: auto;
}
.pp-topbar__nav {
  display: none;
  align-items: center;
  gap: 0.25rem;
  flex: 1;
  justify-content: center;
}
.pp-nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  color: var(--pp-text);
  font-weight: 800;
  font-size: 0.92rem;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
  position: relative;
}
.pp-nav-link .pi {
  font-size: 0.95rem;
  color: var(--pp-teal);
}
.pp-nav-link:hover {
  background: var(--pp-teal-50);
  color: var(--pp-teal-900);
}
.pp-nav-link.is-active {
  background: var(--pp-teal-900);
  color: #fff;
}
.pp-nav-link.is-active .pi {
  color: var(--pp-cyan);
}
.pp-nav-link__count {
  min-width: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: var(--pp-magenta);
  color: #fff;
  font-size: 0.72rem;
  text-align: center;
  line-height: 20px;
}
.pp-topbar__tools {
  display: none;
  align-items: center;
  gap: 0.5rem;
}
.pp-topbar__mobile {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-inline-start: auto;
}
.pp-profile {
  position: relative;
}
.pp-profile__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.75rem 0.3rem 0.35rem;
  border-radius: 999px;
  border: 1px solid rgba(28, 103, 114, 0.12);
  background: #fff;
  font: inherit;
  font-weight: 800;
  color: var(--pp-teal-900);
  cursor: pointer;
}
[dir="ltr"] .pp-profile__btn {
  padding: 0.3rem 0.35rem 0.3rem 0.75rem;
}
.pp-profile__img,
.pp-profile__initial {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
}
.pp-profile__initial {
  display: grid;
  place-items: center;
  background: var(--pp-magenta-100);
  color: var(--pp-magenta);
}
.pp-profile__menu {
  position: absolute;
  inset-inline-end: 0;
  top: calc(100% + 8px);
  min-width: 220px;
  padding: 0.5rem;
  border-radius: 18px;
  background: #fff;
  box-shadow: var(--pp-shadow-lg);
  border: 1px solid rgba(28, 103, 114, 0.1);
  display: grid;
  gap: 0.15rem;
  z-index: 70;
}
.pp-profile__menu button {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.65rem 0.8rem;
  border: 0;
  border-radius: 12px;
  background: transparent;
  font: inherit;
  font-weight: 700;
  color: var(--pp-text);
  cursor: pointer;
  text-align: start;
}
.pp-profile__menu button:hover {
  background: var(--pp-teal-50);
}
.pp-profile__menu button.is-danger {
  color: var(--pp-danger);
}
.pp-main {
  padding-bottom: calc(var(--pp-tabbar-h) + env(safe-area-inset-bottom, 0px));
}
.pp-footer {
  display: none;
  padding: 1.5rem 0 2rem;
  color: var(--pp-muted);
  font-size: 0.85rem;
}
.pp-footer__row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

/* ---- phone tab bar ---- */
.pp-tabbar {
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: 60;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  min-height: var(--pp-tabbar-h);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-top: 1px solid rgba(28, 103, 114, 0.1);
  box-shadow: 0 -8px 24px -20px rgba(28, 103, 114, 0.5);
}
.pp-tabbar > a,
.pp-tabbar > button {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  min-height: var(--pp-tabbar-h);
  border: 0;
  background: transparent;
  color: var(--pp-muted);
  font: inherit;
  font-size: 0.7rem;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;
}
.pp-tabbar .pi {
  font-size: 1.25rem;
  transition: transform 0.25s var(--pp-spring);
}
.pp-tabbar .is-active {
  color: var(--pp-teal-900);
}
.pp-tabbar .is-active .pi {
  transform: translateY(-2px) scale(1.12);
  color: var(--pp-magenta);
}
.pp-tabbar .is-active::after {
  content: "";
  position: absolute;
  top: 0;
  width: 28px;
  height: 3px;
  border-radius: 0 0 4px 4px;
  background: var(--pp-magenta);
}
.pp-tabbar__badge {
  position: absolute;
  top: 8px;
  inset-inline-end: calc(50% - 22px);
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: var(--pp-magenta);
  color: #fff;
  font-size: 0.68rem;
  line-height: 18px;
  text-align: center;
}
.pp-sheet__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  padding-bottom: 0.5rem;
}
.pp-sheet__item {
  display: grid;
  justify-items: center;
  gap: 0.45rem;
  padding: 0.75rem 0.25rem;
  border: 0;
  border-radius: 16px;
  background: var(--pp-sand);
  font: inherit;
  font-size: 0.82rem;
  font-weight: 800;
  color: var(--pp-text);
  cursor: pointer;
}
.pp-sheet__item .pp-item__icon {
  position: relative;
  background: #fff;
}
.pp-sheet__item.is-danger {
  color: var(--pp-danger);
}

@media (min-width: 1024px) {
  .pp-topbar__nav,
  .pp-topbar__tools,
  .pp-footer {
    display: flex;
  }
  .pp-topbar__mobile,
  .pp-tabbar {
    display: none;
  }
  .pp-main {
    padding-bottom: 0;
    min-height: calc(100dvh - var(--pp-nav-h) - 80px);
  }
}
@media (max-width: 1279px) and (min-width: 1024px) {
  .pp-nav-link span {
    font-size: 0.85rem;
  }
  .pp-profile__name {
    display: none;
  }
}
</style>
