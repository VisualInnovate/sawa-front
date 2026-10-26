<script setup>
// The student programs' sessions by day, with their status. A therapist sees their own sessions; whoever prepares
// sessions sees all, prepares the break schedule and may change the therapist to a substitute before the start.
// Only a session's therapist starts it (new, or continuing the child's previous session) and runs it on its own page.
// closed · waiting · late (5 minutes, not started) · ongoing · finished · missed (not started 45 minutes after its
// start, or on an official holiday). Whoever reschedules sessions sees all, postpones one before it starts, and gives
// a missed one a new appointment or a compensation, each with its reason.
import { amount as formatAmount } from "@/utils/accounting";
import axios from "axios";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useAuthStore } from "@/stores/Auth";
import { SESSION_STATUS_SEVERITY, isoDate, reasonText, sessionKindLabel, timeRange } from "@/utils/studentPrograms";
import SessionRescheduleDialog from "@/components/sessions/SessionRescheduleDialog.vue";
import moment from "moment";

const { t } = useI18n();
const toast = useToast();
const router = useRouter();
const auth = useAuthStore();

const range = ref([new Date(), new Date()]);
const sessions = ref([]);
const canManage = ref(false);
const canReschedule = ref(false);
const loading = ref(false);
const status = ref(null);
const busy = ref(null);

const statuses = computed(() => [
  { value: null, label: t("sp_all") },
  ...Object.keys(SESSION_STATUS_SEVERITY).map((value) => ({ value, label: t(`session_status_${value}`) })),
]);
const shown = computed(() => sessions.value.filter((session) => !status.value || session.status === status.value));
const counts = computed(() => sessions.value.reduce((all, session) => ({ ...all, [session.status]: (all[session.status] ?? 0) + 1 }), {}));

async function load() {
  const [from, to] = range.value ?? [];
  if (!from) return;
  loading.value = true;
  try {
    const { data } = await axios.get("api/program-sessions", { params: { from: isoDate(from), to: isoDate(to ?? from) } });
    sessions.value = data.data;
    canManage.value = !!data.can_manage;
    canReschedule.value = !!data.can_reschedule;
  } finally {
    loading.value = false;
  }
}

const isMine = (session) => Number(session.therapist_id) === Number(auth.user_id);
const beforeStart = (session) => ["closed", "waiting", "late"].includes(session.status);
const canStart = (session) => isMine(session) && ["waiting", "late"].includes(session.status);
const canEnter = (session) => isMine(session) && session.status === "ongoing";
const hasResults = (session) => ["ongoing", "finished"].includes(session.status);
const openMissed = (session) => session.status === "missed" && !session.resolution;
const dateTime = (value) => moment(value).format("YYYY-MM-DD HH:mm");

// Postponing / a missed session's new appointment or compensation.
const reschedule = ref({ session: null, mode: "postpone" });
const openReschedule = (session, mode) => { reschedule.value = { session, mode }; };
async function rescheduled() {
  reschedule.value = { session: null, mode: "postpone" };
  await load();
}

// Starting: when the child has an earlier session, the therapist chooses a new one or continuing it.
const startDialog = ref(null);
async function askStart(session) {
  busy.value = session.id;
  try {
    const { data } = await axios.get(`api/program-sessions/${session.id}/start-options`);
    if (data.previous) startDialog.value = { session, previous: data.previous };
    else await start(session, "new");
  } finally {
    busy.value = null;
  }
}
async function start(session, mode) {
  busy.value = session.id;
  try {
    await axios.post(`api/program-sessions/${session.id}/start`, { mode });
    startDialog.value = null;
    // The session page opens full screen from this click.
    document.documentElement.requestFullscreen?.().catch(() => {});
    router.push({ name: "session-run", params: { id: session.id } });
  } catch (e) {
    const detail = e.response?.data?.suspended ? t("acc.suspended") : e.response?.data?.message ?? t("session_not_started");
    toast.add({ severity: "error", summary: t("error"), detail, life: 3500 });
    await load();
  } finally {
    busy.value = null;
  }
}
function enter(session) {
  document.documentElement.requestFullscreen?.().catch(() => {});
  router.push({ name: "session-run", params: { id: session.id } });
}

// Changing the therapist (before the start): the original therapist or one of their substitutes.
const therapistDialog = ref(null);
async function openTherapist(session) {
  therapistDialog.value = { session, options: [], therapist_id: session.therapist_id, loading: true, saving: false };
  try {
    const { data } = await axios.get(`api/program-sessions/${session.id}/therapist-options`);
    therapistDialog.value.options = data.data;
  } finally {
    therapistDialog.value.loading = false;
  }
}
async function saveTherapist() {
  const dialog = therapistDialog.value;
  dialog.saving = true;
  try {
    await axios.put(`api/program-sessions/${dialog.session.id}/therapist`, { therapist_id: dialog.therapist_id });
    therapistDialog.value = null;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("session_therapist_changed"), life: 2500 });
    await load();
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message ?? t("mission_error"), life: 3500 });
    dialog.saving = false;
  }
}

watch(range, (value) => {
  if (value?.[0] && (value[1] || value.length === 1)) load();
});

// Statuses move with the clock: refresh every minute.
let timer = null;
onMounted(() => {
  load();
  timer = setInterval(load, 60000);
});
onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
  <div class="sawa-card p-3">
    <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
      <p class="text-xl text-[#135C65] font-bold">{{ $t("sessions") }}</p>
      <div class="flex flex-wrap items-center gap-2">
        <DatePicker v-model="range" selectionMode="range" dateFormat="yy-mm-dd" showIcon :manualInput="false" :aria-label="$t('sp_period')" />
        <Button icon="pi pi-refresh" variant="outlined" :loading="loading" v-tooltip.top="$t('refresh')" :aria-label="$t('refresh')" @click="load" />
      </div>
    </div>
    <div class="flex flex-wrap gap-2 mb-3">
      <Button v-for="option in statuses" :key="String(option.value)" size="small" :variant="status === option.value ? undefined : 'outlined'"
        :label="option.value ? `${option.label} (${counts[option.value] ?? 0})` : `${option.label} (${sessions.length})`" @click="status = option.value" />
    </div>
    <DataTable :value="shown" :loading="loading" dataKey="id" paginator :rows="20" stripedRows>
      <Column :header="$t('sp_date')">
        <template #body="{ data }"><span class="whitespace-nowrap">{{ moment(data.starts_at).format("YYYY-MM-DD") }}</span></template>
      </Column>
      <Column :header="$t('sp_hour')">
        <template #body="{ data }"><span class="whitespace-nowrap">{{ timeRange(moment(data.starts_at).format("HH:mm"), moment(data.ends_at).format("HH:mm")) }}</span></template>
      </Column>
      <Column :header="$t('sp_student')">
        <template #body="{ data }">{{ data.child?.name }}</template>
      </Column>
      <Column :header="$t('sp_treatment')">
        <template #body="{ data }">
          <template v-if="data.treatment">{{ data.treatment.name }} <span class="text-xs text-color-secondary">({{ sessionKindLabel(t, data.session_kind) }})</span></template>
          <template v-else>{{ sessionKindLabel(t, data.session_kind) }}</template>
        </template>
      </Column>
      <Column :header="$t('sp_room')">
        <template #body="{ data }">
          {{ data.room?.name }}
          <i v-if="data.room_age_warning" class="pi pi-exclamation-triangle text-orange-500 ms-1" v-tooltip.top="$t('age_ranges.room_warning')" :aria-label="$t('age_ranges.room_warning')" />
        </template>
      </Column>
      <Column :header="$t('sp_therapist')">
        <template #body="{ data }">{{ data.therapist?.name }}</template>
      </Column>
      <Column :header="$t('break_schedule')">
        <template #body="{ data }">
          <Tag v-if="data.break_schedule?.ready_at" severity="success" icon="pi pi-check" :value="$t('break_ready')" />
          <Tag v-else-if="data.break_schedule" severity="warn" :value="$t('break_draft')" />
          <span v-else class="text-xs text-color-secondary">{{ $t("break_none") }}</span>
        </template>
      </Column>
      <Column :header="$t('sp_status')">
        <template #body="{ data }">
          <Tag :severity="SESSION_STATUS_SEVERITY[data.status]" :value="$t(`session_status_${data.status}`)" class="whitespace-nowrap" />
          <Tag v-if="data.program?.sessions_suspended_at" severity="danger" icon="pi pi-pause" :value="$t('acc.suspended')" class="whitespace-nowrap ms-1" />
          <div v-if="data.started_at" class="text-xs text-color-secondary mt-1">{{ $t("session_started_at", { time: moment(data.started_at).format("HH:mm") }) }}</div>
          <div v-if="data.holiday && !data.reason_type" class="text-xs text-red-600 mt-1">{{ $t("session_reason_holiday") }}: {{ data.holiday.title }}</div>
          <div v-if="data.original_starts_at" class="text-xs text-color-secondary mt-1">
            <i class="pi pi-history" aria-hidden="true" /> {{ $t("session_postponed_from", { time: dateTime(data.original_starts_at) }) }}
          </div>
          <div v-if="data.makeup_of" class="text-xs text-color-secondary mt-1">
            <i class="pi pi-replay" aria-hidden="true" /> {{ $t("session_makeup_of", { time: dateTime(data.makeup_of.starts_at) }) }}
          </div>
          <template v-if="data.resolution">
            <div class="text-xs mt-1 font-semibold text-[#135C65]">
              <template v-if="data.resolution === 'rescheduled'">{{ $t("session_resolution_rescheduled", { time: data.makeup ? dateTime(data.makeup.starts_at) : "—" }) }}</template>
              <template v-else>{{ $t("session_resolution_compensated", { amount: formatAmount(data.compensation_amount) }) }}</template>
            </div>
            <div class="text-xs text-color-secondary">{{ reasonText($t, data.reason_type, data.reason_note) }}</div>
          </template>
        </template>
      </Column>
      <Column header-style="min-width:12rem">
        <template #body="{ data }">
          <div class="flex flex-wrap gap-1 justify-end">
            <Button v-if="canStart(data)" icon="pi pi-play" size="small" :label="$t('session_start')" :loading="busy === data.id" @click="askStart(data)" />
            <Button v-if="canEnter(data)" icon="pi pi-sign-in" size="small" severity="success" :label="$t('session_enter')" @click="enter(data)" />
            <Button v-if="canManage && beforeStart(data)" icon="pi pi-table" size="small" variant="outlined" v-tooltip.top="$t('break_schedule')"
              :aria-label="$t('break_schedule')" @click="router.push({ name: 'session-break-schedule', params: { id: data.id } })" />
            <Button v-if="canManage && beforeStart(data)" icon="pi pi-user-edit" size="small" variant="outlined" severity="secondary"
              v-tooltip.top="$t('session_change_therapist')" :aria-label="$t('session_change_therapist')" @click="openTherapist(data)" />
            <Button v-if="canReschedule && beforeStart(data)" icon="pi pi-calendar-clock" size="small" variant="outlined" severity="warn"
              v-tooltip.top="$t('session_postpone')" :aria-label="$t('session_postpone')" @click="openReschedule(data, 'postpone')" />
            <Button v-if="canReschedule && openMissed(data)" icon="pi pi-calendar-plus" size="small" :label="$t('session_reschedule')"
              @click="openReschedule(data, 'reschedule')" />
            <Button v-if="canReschedule && openMissed(data)" icon="pi pi-wallet" size="small" severity="secondary" variant="outlined"
              :label="$t('session_compensate')" @click="openReschedule(data, 'compensate')" />
            <Button v-if="hasResults(data)" icon="pi pi-chart-bar" size="small" variant="outlined" severity="help" v-tooltip.top="$t('session_results')"
              :aria-label="$t('session_results')" @click="router.push({ name: 'session-results', params: { id: data.id } })" />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog :visible="!!startDialog" modal :header="$t('session_start')" :style="{ width: '28rem' }" :breakpoints="{ '640px': '94vw' }"
      @update:visible="startDialog = null">
      <p v-if="startDialog" class="mb-4 text-color-secondary">{{ $t("session_previous_found", { date: startDialog.previous.starts_at }) }}</p>
      <div v-if="startDialog" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Button icon="pi pi-file" :label="$t('session_start_new')" variant="outlined" :loading="busy === startDialog.session.id" @click="start(startDialog.session, 'new')" />
        <Button icon="pi pi-replay" :label="$t('session_continue_previous')" :loading="busy === startDialog.session.id" @click="start(startDialog.session, 'continue')" />
      </div>
    </Dialog>

    <Dialog :visible="!!therapistDialog" modal :header="$t('session_change_therapist')" :style="{ width: '26rem' }" :breakpoints="{ '640px': '94vw' }"
      @update:visible="therapistDialog = null">
      <template v-if="therapistDialog">
        <p class="text-sm text-color-secondary mb-3">{{ $t("session_therapist_hint") }}</p>
        <Select v-model="therapistDialog.therapist_id" :options="therapistDialog.options" optionLabel="name" optionValue="id" filter
          :loading="therapistDialog.loading" class="w-full mb-3" :aria-label="$t('sp_therapist')">
          <template #option="{ option }">{{ option.name }} <span v-if="!option.original" class="text-xs text-color-secondary">({{ $t("substitute") }})</span>
            <i v-if="option.age_warning" class="pi pi-exclamation-triangle text-orange-500 ms-1" v-tooltip.top="$t('age_ranges.therapist_short')" /></template>
        </Select>
        <small v-if="!therapistDialog.loading && therapistDialog.options.length < 2" class="block text-orange-600 mb-3">{{ $t("session_no_substitutes") }}</small>
        <small v-if="therapistDialog.options.find((row) => row.id === therapistDialog.therapist_id)?.age_warning" class="block text-orange-600 mb-3">
          <i class="pi pi-exclamation-triangle" /> {{ $t("age_ranges.therapist_short") }}
        </small>
        <Button icon="pi pi-check" :label="$t('save')" class="w-full" :loading="therapistDialog.saving"
          :disabled="therapistDialog.therapist_id === therapistDialog.session.therapist_id" @click="saveTherapist" />
      </template>
    </Dialog>
    <SessionRescheduleDialog :session="reschedule.session" :mode="reschedule.mode" @close="reschedule = { session: null, mode: 'postpone' }"
      @saved="rescheduled" />
    <Toast />
  </div>
</template>
