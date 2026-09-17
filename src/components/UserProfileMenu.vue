<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import Menu from "primevue/menu";
import { useAuthStore } from "../stores/Auth";

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const menu = ref();

const userName = computed(() => authStore.authUser?.name ?? "");
const userImage = computed(() => authStore.authUser?.image ?? null);
const initial = computed(() => userName.value.trim().charAt(0) || "?");

const items = computed(() => [
  {
    label: t("my_profile"),
    icon: "pi pi-user",
    command: () => router.push({ name: "profile-deltails" }),
  },
  { separator: true },
  {
    label: t("logout"),
    icon: "pi pi-sign-out",
    command: () => authStore.handleLogout(),
  },
]);
</script>

<template>
  <button
    type="button"
    class="profile-trigger"
    aria-haspopup="true"
    aria-controls="profile-menu"
    @click="menu.toggle($event)"
  >
    <Avatar v-if="userImage" :image="userImage" shape="circle" />
    <Avatar v-else :label="initial" shape="circle" class="profile-initial" />
    <span class="profile-name">{{ userName }}</span>
    <i class="pi pi-angle-down" aria-hidden="true" />
  </button>
  <Menu id="profile-menu" ref="menu" :model="items" popup />
</template>

<style scoped>
.profile-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  border: 1px solid var(--sawa-border);
  background: #fff;
  color: var(--sawa-text);
  cursor: pointer;
}
.profile-trigger:hover {
  background: var(--sawa-primary-soft);
}
.profile-initial {
  background: var(--sawa-primary);
  color: #fff;
}
.profile-name {
  font-weight: 600;
  max-width: 12rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@media (max-width: 640px) {
  .profile-name {
    display: none;
  }
}
</style>
