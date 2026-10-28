<script setup>
// «سجل الجلسات»: the program sessions of a period that ran (started → ended), are running, or were missed (why, and
// what was done: a new appointment or a compensation), and the postponed ones — each with its history.
import { amount as formatAmount } from "@/utils/accounting";
import axios from "axios";
import moment from "moment";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { SESSION_STATUS_SEVERITY, isoDate, reasonText, sessionKindLabel, timeRange } from "@/utils/studentPrograms";

const { t } = useI18n();

const today = new Date();
const range = ref([moment().subtract(6, "days").toDate(), today]);
const status = ref(null);
const search = ref("");
const rows = ref([]);
const counts = ref({});
const loading = ref(false);
const expanded = ref({});

const statuses = computed(() => [
  { value: null, label: t("sp_all") },
  { value: "ongoing", label: t("session_status_ongoing"), count: counts.value.ongoing },
  { value: "finished", label: t("session_status_finished"), count: counts.value.finished },
  { value: "missed", label: t("session_status_missed"), count: counts.value.missed },
  { value: "postponed", label: t("session_log_postponed"), count: counts.value.postponed },
]);
const shown = computed(() => {
  const q = search.value.trim().toLowerCase();
  return rows.value.filter((row) => (!status.value || (status.value === "postponed" ? row.postponed : row.status === status.value))
    && (!q || [row.child?.name, row.therapist?.name, row.room?.name].some((value) => String(value ?? "").toLowerCase().includes(q))));
});

const hm = (value) => (value ? moment(value).format("HH:mm") : "—");
const dateTime = (value) => (value ? moment(value).format("YYYY-MM-DD HH:mm") : "—");

// What a log line says about the action.
function actionDetail(log) {
  switch (log.action) {
    case "started": return log.data?.late_minutes ? t("session_log_late_by", { minutes: log.data.late_minutes }) : "";
    case "ended": return `${hm(log.from_at)} → ${hm(log.to_at)}`;
    case "postponed":
    case "rescheduled": return `${dateTime(log.from_at)} → ${dateTime(log.to_at)}${log.data?.room ? ` · ${log.data.room}` : ""}`;
    case "compensated": return formatAmount(log.amount);
    case "therapist_changed": return `${log.data?.from ?? "—"} → ${log.data?.to ?? "—"}`;
    default: return "";
  }
}

async function load() {
  const [from, to] = range.value ?? [];
  if (!from) return;
  loading.value = true;
  try {
    const { data } = await axios.get("api/program-session-log", { params: { from: isoDate(from), to: isoDate(to ?? from) } });
    rows.value = data.data;
    counts.value = data.counts ?? {};
  } finally {
    loading.value = false;
  }
}

watch(range, (value) => {
  if (value?.[0] && (value[1] || value.length === 1)) load();
});
onMounted(load);
</script>

<template>
  <div class="sawa-card p-3">
    <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
      <p class="text-xl text-bp-135c65 font-bold"><i class="pi pi-history" aria-hidden="true" /> {{ $t("session_log") }}</p>
      <div class="flex flex-wrap items-center gap-2">
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText v-model="search" :placeholder="$t('session_log_search')" />
        </IconField>
        <DatePicker v-model="range" selectionMode="range" dateFormat="yy-mm-dd" showIcon :manualInput="false" :aria-label="$t('sp_period')" />
        <Button icon="pi pi-refresh" variant="outlined" :loading="loading" v-tooltip.top="$t('refresh')" :aria-label="$t('refresh')" @click="load" />
      </div>
    </div>

    <div class="sl-cards">
      <div class="sl-card is-ongoing"><span>{{ $t("session_status_ongoing") }}</span><strong>{{ counts.ongoing ?? 0 }}</strong></div>
      <div class="sl-card is-finished"><span>{{ $t("session_status_finished") }}</span><strong>{{ counts.finished ?? 0 }}</strong></div>
      <div class="sl-card is-missed"><span>{{ $t("session_status_missed") }}</span><strong>{{ counts.missed ?? 0 }}</strong>
        <small v-if="counts.missed_open">{{ $t("session_log_missed_open", { n: counts.missed_open }) }}</small></div>
      <div class="sl-card is-postponed"><span>{{ $t("session_log_postponed") }}</span><strong>{{ counts.postponed ?? 0 }}</strong></div>
    </div>

    <div class="flex flex-wrap gap-2 mb-3">
      <Button v-for="option in statuses" :key="String(option.value)" size="small" :variant="status === option.value ? undefined : 'outlined'"
        :label="option.value ? `${option.label} (${option.count ?? 0})` : `${option.label} (${rows.length})`" @click="status = option.value" />
    </div>

    <DataTable v-model:expandedRows="expanded" :value="shown" :loading="loading" dataKey="id" paginator :rows="20" stripedRows>
      <Column expander style="width: 3rem" />
      <Column :header="$t('sp_date')">
        <template #body="{ data }"><span class="whitespace-nowrap">{{ moment(data.starts_at).format("YYYY-MM-DD") }}</span></template>
      </Column>
      <Column :header="$t('sp_hour')">
        <template #body="{ data }"><span class="whitespace-nowrap" dir="ltr">{{ timeRange(hm(data.starts_at), hm(data.ends_at)) }}</span></template>
      </Column>
      <Column :header="$t('sp_student')">
        <template #body="{ data }">{{ data.child?.name }}</template>
      </Column>
      <Column :header="$t('sp_treatment')">
        <template #body="{ data }">{{ [data.treatment?.name, sessionKindLabel(t, data.session_kind)].filter(Boolean).join(" · ") }}</template>
      </Column>
      <Column :header="$t('sp_therapist')">
        <template #body="{ data }">{{ data.therapist?.name }}<div class="text-xs text-color-secondary">{{ data.room?.name }}</div></template>
      </Column>
      <Column :header="$t('sp_status')">
        <template #body="{ data }">
          <Tag :severity="SESSION_STATUS_SEVERITY[data.status]" :value="$t(`session_status_${data.status}`)" class="whitespace-nowrap" />
          <Tag v-if="data.postponed" severity="warn" :value="$t('session_log_postponed')" class="whitespace-nowrap ms-1" />
        </template>
      </Column>
      <Column :header="$t('session_log_started_ended')">
        <template #body="{ data }">
          <span v-if="data.started_at" class="whitespace-nowrap" dir="ltr">{{ hm(data.started_at) }} → {{ data.ended_at ? hm(data.ended_at) : data.status === "ongoing" ? "…" : hm(data.ends_at) }}</span>
          <span v-else class="text-color-secondary">—</span>
        </template>
      </Column>
      <Column :header="$t('session_log_reason_action')">
        <template #body="{ data }">
          <div v-if="data.reason_type || (data.holiday && data.status === 'missed')" class="text-sm">
            {{ data.reason_type ? reasonText($t, data.reason_type, data.reason_note) : `${$t("session_reason_holiday")}: ${data.holiday.title}` }}
          </div>
          <div v-if="data.resolution === 'rescheduled'" class="text-xs font-semibold text-bp-135c65">
            {{ $t("session_resolution_rescheduled", { time: data.makeup ? dateTime(data.makeup.starts_at) : "—" }) }}
          </div>
          <div v-else-if="data.resolution === 'compensated'" class="text-xs font-semibold text-bp-135c65">
            {{ $t("session_resolution_compensated", { amount: formatAmount(data.compensation_amount) }) }}
          </div>
          <div v-else-if="data.status === 'missed'" class="text-xs text-orange-600">{{ $t("session_log_no_action") }}</div>
          <div v-if="data.original_starts_at" class="text-xs text-color-secondary">{{ $t("session_postponed_from", { time: dateTime(data.original_starts_at) }) }}</div>
          <div v-if="data.makeup_of" class="text-xs text-color-secondary">{{ $t("session_makeup_of", { time: dateTime(data.makeup_of.starts_at) }) }}</div>
        </template>
      </Column>
      <template #expansion="{ data }">
        <div class="sl-history">
          <p class="font-semibold mb-2">{{ $t("session_log_history") }}</p>
          <p v-if="!data.logs?.length" class="text-color-secondary m-0">{{ $t("session_log_no_history") }}</p>
          <ol v-else>
            <li v-for="log in data.logs" :key="log.id">
              <Tag severity="secondary" :value="$t(`session_log_action_${log.action}`)" />
              <span dir="ltr" class="text-color-secondary">{{ dateTime(log.created_at) }}</span>
              <span>{{ log.user?.name }}</span>
              <span v-if="actionDetail(log)" dir="auto">{{ actionDetail(log) }}</span>
              <span v-if="log.reason_type" class="text-color-secondary">({{ reasonText($t, log.reason_type, log.reason_note) }})</span>
            </li>
          </ol>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<style scoped>
.sl-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr)); gap: .6rem; margin-bottom: 1rem; }
.sl-card { display: grid; gap: .15rem; padding: .7rem .9rem; border-radius: 12px; border: 1px solid #e2e8f0; border-top: 4px solid var(--c); background: #fff; }
.sl-card span { color: #64748b; font-size: .85rem; }
.sl-card strong { font-size: 1.5rem; color: #0f172a; }
.sl-card small { color: #b45309; }
.sl-card.is-ongoing { --c: #16a34a; }
.sl-card.is-finished { --c: #334155; }
.sl-card.is-missed { --c: #dc2626; }
.sl-card.is-postponed { --c: #f59e0b; }
.sl-history { padding: .5rem 1rem; }
.sl-history ol { display: grid; gap: .45rem; margin: 0; padding: 0; list-style: none; }
.sl-history li { display: flex; flex-wrap: wrap; align-items: center; gap: .6rem; font-size: .9rem; }
</style>
