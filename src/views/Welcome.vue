<template>
  <section class="welcome">
    <div class="welcome-card">
      <img :src="$siteLogo(sawaLogo)" alt="Sawa" class="welcome-logo" />
      <h1 class="welcome-title">{{ $t("welcome_title", { name: userName }) }}</h1>
      <p class="welcome-hint">{{ $t("welcome_hint") }}</p>
    </div>

    <!-- Evaluation coordinators start from the evaluations waiting for an appointment. -->
    <div v-if="seesRequiredEvaluations" class="pending-card">
      <RequiredEvaluationsBoard compact />
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

    <div v-if="seesPendingBookings && (loadingBookings || pendingBookings.length)" class="pending-card">
      <header class="bookings-header">
        <h2>{{ $t("pending_bookings_title") }}</h2>
        <p>{{ $t("pending_bookings_hint") }}</p>
      </header>
      <DataTable :value="pendingBookings" :loading="loadingBookings" dataKey="id" stripedRows responsiveLayout="scroll">
        <Column field="child_name" :header="$t('child_name')">
          <template #body="{ data }">
            <span class="font-semibold">{{ data.child_name }}</span>
          </template>
        </Column>
        <Column :header="$t('child_age')">
          <template #body="{ data }">{{ formatChildAge(data.child_birth_date, data.child_age, t) }}</template>
        </Column>
        <Column :header="$t('parent.phone')">
          <template #body="{ data }">
            <span dir="ltr">{{ data.details?.requester_phone || "—" }}</span>
          </template>
        </Column>
        <Column :header="$t('consultation_date')">
          <template #body="{ data }">
            <span dir="ltr">{{ data.event_date || "—" }}</span>
          </template>
        </Column>
        <Column :header="$t('booking_status_filter')">
          <template #body>
            <Tag :value="$t('Pending')" severity="warn" />
          </template>
        </Column>
        <Column :header="$t('actions')" style="width: 10rem">
          <template #body="{ data }">
            <Button icon="pi pi-eye" :label="$t('follow_details')" size="small"
              @click="router.push({ name: 'BookingDetails', params: { id: data.id } })" />
          </template>
        </Column>
      </DataTable>
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
import RequiredEvaluationsBoard from "../components/RequiredEvaluationsBoard.vue";
import { useAuthStore } from "../stores/Auth";
import { getEvaluationStartRoute } from "../utils/evaluationTypes";
import { isRequestOpen, startEvaluationRequest } from "../utils/evaluationRequestStatus";
import { formatChildAge } from "../utils/childAge";
import { can } from "../utils/permissions";

// Employee type 5 is the consultant ("Evaluator" in the employee form).
const CONSULTANT_TYPE = 5;
// The reception role, created from the roles screen, also follows up on bookings.
const RECEPTION_ROLE = "استقبال";
// Booking "accepted" values: -1 waiting, 1 accepted, 0 rejected.
const BOOKING_PENDING = -1;

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const pendingRequests = ref([]);
const startingId = ref(null);
const loadingRequests = ref(false);
const pendingBookings = ref([]);
const loadingBookings = ref(false);
const seesPendingBookings = computed(() =>
  Number(authStore.authUser?.type ?? authStore.type) === CONSULTANT_TYPE
  || String(authStore.authUser?.roles?.name ?? "").trim() === RECEPTION_ROLE);
const seesRequiredEvaluations = computed(() => {
  void authStore.userPermissions;
  return can("required evaluations list");
});
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

// Consultants and reception see every booking still waiting for a decision, and open its details to act on it.
const loadPendingBookings = async () => {
  if (!seesPendingBookings.value || !can("bookings list")) return;

  loadingBookings.value = true;
  try {
    const response = await axios.get("/api/calender/bookings", { params: { accepted: BOOKING_PENDING, _ts: Date.now() } });
    pendingBookings.value = Object.values(response.data.bookings ?? [])
      .filter((booking) => booking && String(booking.child_name ?? "").trim() !== "");
  } catch {
    pendingBookings.value = [];
  } finally {
    loadingBookings.value = false;
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
  await Promise.all([loadPendingRequests(), loadPendingBookings()]);
});
onActivated(() => Promise.all([loadPendingRequests(), loadPendingBookings()]));
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
  border-top: 4px solid rgb(var(--bp-135c65));
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
  padding: 2.5rem 1.5rem;
}

.pending-card {
  width: 100%;
  background: #ffffff;
  border: 1px solid rgb(var(--bp-135c65) / 0.14);
  border-radius: 18px;
  box-shadow: 0 8px 24px rgb(var(--bp-135c65) / 0.07);
  overflow: hidden;
}

.bookings-header {
  padding: 1.25rem 1.5rem 0.75rem;
}

.bookings-header h2 {
  margin: 0 0 0.25rem;
  font-size: 1.15rem;
  font-weight: 700;
  color: rgb(var(--bp-135c65));
}

.bookings-header p {
  margin: 0;
  font-size: 0.9rem;
  color: #6b7280;
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
  color: rgb(var(--bp-135c65));
}

.welcome-hint {
  margin: 0;
  font-size: 0.95rem;
  color: #6b7280;
}
</style>
