<template>
  <section class="welcome">
    <div class="welcome-card">
      <img :src="sawaLogo" alt="Sawa" class="welcome-logo" />
      <h1 class="welcome-title">{{ $t("welcome_title", { name: userName }) }}</h1>
      <p class="welcome-hint">{{ $t("welcome_hint") }}</p>
    </div>

    <div v-if="loadingRequests || pendingRequests.length" class="pending-card">
      <EvaluationRequestsBoard
        :requests="pendingRequests"
        :loading="loadingRequests"
        :allow-delete="false"
        title-key="pending_evaluations_title"
        hint-key="pending_evaluations_hint"
        :starting="startingId"
        @start="startEvaluation"
      />
    </div>
  </section>
</template>

<script setup>
import axios from "axios";
import { computed, onActivated, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import sawaLogo from "../assets/img/sawa_logo.svg";
import EvaluationRequestsBoard from "../components/EvaluationRequestsBoard.vue";
import { useAuthStore } from "../stores/Auth";
import { getEvaluationStartRoute } from "../utils/evaluationTypes";
import { isRequestOpen, startEvaluationRequest } from "../utils/evaluationRequestStatus";

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const pendingRequests = ref([]);
const startingId = ref(null);
const loadingRequests = ref(false);
const userName = computed(() => {
  const user = authStore.authUser ?? {};
  return String(user.name ?? "").trim() || String(user.email ?? "").split("@")[0];
});

const loadPendingRequests = async () => {
  const userId = Number(authStore.authUser?.user_id || authStore.user_id || localStorage.getItem("user_id"));
  if (!userId) return;

  loadingRequests.value = true;
  try {
    const response = await axios.get(`/api/users/${userId}/get/evaluations`);
    pendingRequests.value = (response.data.evaluation_requests ?? [])
      .filter(isRequestOpen);
  } catch {
    pendingRequests.value = [];
  } finally {
    loadingRequests.value = false;
  }
};

const startEvaluation = async (request) => {
  const childId = request.child_id ?? request.child?.id;
  const route = getEvaluationStartRoute(request.evaluation_type, childId, request.id);
  if (!route) return;

  startingId.value = request.id;
  try {
    await startEvaluationRequest(request.id);
  } catch {
    toast.add({ severity: "error", summary: t("error"), detail: t("start_evaluation_failed"), life: 4000 });
    return;
  } finally {
    startingId.value = null;
  }

  localStorage.setItem("child_id", childId);
  localStorage.setItem("eavl_id", request.id);
  localStorage.setItem("evalate_type", request.evaluation_type);
  router.push(route);
};

// A session saved by an older build may lack the user's name; reload it from the API.
onMounted(async () => {
  if (!String(authStore.authUser?.name ?? "").trim()) await authStore.getUser().catch(() => {});
  await loadPendingRequests();
});
onActivated(loadPendingRequests);
</script>

<style scoped>
.welcome {
  min-height: calc(100vh - 220px);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  gap: 1.25rem;
  padding: 1.25rem;
  max-width: 1120px;
  margin: 0 auto;
}

.welcome-card {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  text-align: center;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-top: 4px solid #135c65;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
  padding: 2.5rem 1.5rem;
}

.pending-card {
  width: 100%;
  background: #ffffff;
  border: 1px solid rgba(19, 92, 101, 0.14);
  border-radius: 18px;
  box-shadow: 0 8px 24px rgba(19, 92, 101, 0.07);
  overflow: hidden;
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
