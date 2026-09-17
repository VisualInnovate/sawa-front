<template>
  <section class="welcome">
    <div class="welcome-card">
      <img :src="sawaLogo" alt="Sawa" class="welcome-logo" />
      <h1 class="welcome-title">{{ $t("welcome_title", { name: userName }) }}</h1>
      <p class="welcome-hint">{{ $t("welcome_hint") }}</p>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from "vue";
import sawaLogo from "../assets/img/sawa_logo.svg";
import { useAuthStore } from "../stores/Auth";

const authStore = useAuthStore();
const userName = computed(() => {
  const user = authStore.authUser ?? {};
  return String(user.name ?? "").trim() || String(user.email ?? "").split("@")[0];
});

// A session saved by an older build may lack the user's name; reload it from the API.
onMounted(() => {
  if (!String(authStore.authUser?.name ?? "").trim()) authStore.getUser().catch(() => {});
});
</script>

<style scoped>
.welcome {
  min-height: calc(100vh - 220px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
}

.welcome-card {
  width: 100%;
  max-width: 520px;
  text-align: center;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-top: 4px solid #135c65;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
  padding: 2.5rem 1.5rem;
}

.welcome-logo {
  width: 140px;
  max-width: 60%;
  margin: 0 auto 1.5rem;
}

.welcome-title {
  margin: 0 0 0.5rem;
  font-size: 1.6rem;
  font-weight: 700;
  color: #135c65;
}

.welcome-hint {
  margin: 0;
  font-size: 0.95rem;
  color: #6b7280;
}
</style>
