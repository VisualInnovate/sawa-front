<script setup>
// The student programs' sessions by day, with their status; only a session's own therapist starts it.
// closed: its time has not come · waiting: it began, not started · late: 5 minutes and not started ·
// ongoing: started · missed: it ended without being started.
import axios from "axios";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { useAuthStore } from "@/stores/Auth";
import { SESSION_STATUS_SEVERITY, isoDate, sessionKindLabel, timeRange } from "@/utils/studentPrograms";
import moment from "moment";

const { t } = useI18n();
const toast = useToast();
const auth = useAuthStore();

const range = ref([new Date(), new Date()]);
const sessions = ref([]);
const loading = ref(false);
const status = ref(null);
const starting = ref(null);

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
  } finally {
    loading.value = false;
  }
}

const canStart = (session) => Number(session.therapist_id) === Number(auth.user_id) && ["waiting", "late"].includes(session.status);

async function start(session) {
  starting.value = session.id;
  try {
    await axios.post(`api/program-sessions/${session.id}/start`);
    toast.add({ severity: "success", summary: t("success_message"), detail: t("session_started"), life: 2500 });
    await load();
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message ?? t("session_not_started"), life: 3500 });
  } finally {
    starting.value = null;
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
        <template #body="{ data }">{{ data.room?.name }}</template>
      </Column>
      <Column :header="$t('sp_therapist')">
        <template #body="{ data }">{{ data.therapist?.name }}</template>
      </Column>
      <Column :header="$t('sp_status')">
        <template #body="{ data }">
          <Tag :severity="SESSION_STATUS_SEVERITY[data.status]" :value="$t(`session_status_${data.status}`)" class="whitespace-nowrap" />
          <div v-if="data.started_at" class="text-xs text-color-secondary mt-1">{{ $t("session_started_at", { time: moment(data.started_at).format("HH:mm") }) }}</div>
        </template>
      </Column>
      <Column header-style="width:8rem">
        <template #body="{ data }">
          <Button v-if="canStart(data)" icon="pi pi-play" size="small" :label="$t('session_start')" :loading="starting === data.id" @click="start(data)" />
        </template>
      </Column>
    </DataTable>
    <Toast />
  </div>
</template>
