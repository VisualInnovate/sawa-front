<script setup>
// One employee's week: count cards, then the week grid, the list, their children and their pending evaluations.
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { getEvaluationTypeLabel } from "@/utils/evaluationTypes";
import { formatMinutes } from "@/utils/schedules";
import { programName } from "@/utils/studentPrograms";
import ScheduleLegend from "@/components/schedules/ScheduleLegend.vue";
import ScheduleList from "@/components/schedules/ScheduleList.vue";
import WeekGrid from "@/components/schedules/WeekGrid.vue";

const props = defineProps({
  schedule: { type: Object, required: true },
  holidays: { type: Array, default: () => [] },
  now: { type: String, default: null },
  loading: { type: Boolean, default: false },
});

const { t } = useI18n();
const tab = ref("grid");

const cards = computed(() => {
  const summary = props.schedule.summary ?? {};
  return [
    { key: "children", icon: "pi pi-face-smile", value: summary.children, color: "#135c65" },
    { key: "programs", icon: "pi pi-briefcase", value: summary.programs, color: "#3aa39b" },
    { key: "sessions", icon: "pi pi-users", value: summary.sessions + (summary.inclusion ?? 0), color: "#135c65" },
    { key: "evaluations", icon: "pi pi-clipboard", value: summary.evaluations, color: "#d9822b" },
    { key: "consultations", icon: "pi pi-comments", value: summary.consultations + (summary.meetings ?? 0), color: "#2f6fcf" },
    { key: "busy", icon: "pi pi-clock", text: formatMinutes(t, summary.busy_minutes ?? 0), color: "#6a3fb5" },
  ];
});
const alerts = computed(() => {
  const summary = props.schedule.summary ?? {};
  return [
    { key: "conflicts", value: summary.conflicts, severity: "danger", icon: "pi pi-exclamation-circle" },
    { key: "outside_shift", value: summary.outside_shift, severity: "warn", icon: "pi pi-sign-out" },
    { key: "late", value: summary.late, severity: "danger", icon: "pi pi-exclamation-triangle" },
    { key: "crowded_days", value: summary.crowded_days, severity: "danger", icon: "pi pi-chart-bar" },
    { key: "pending_approvals", value: summary.pending_approvals, severity: "warn", icon: "pi pi-hourglass" },
  ].filter((alert) => alert.value);
});
const kindLabel = (kind) => programName(t, { kind });
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2">
      <div v-for="card in cards" :key="card.key" class="sch-card" :style="{ '--card': card.color }">
        <i :class="card.icon" aria-hidden="true" />
        <div>
          <div class="sch-card-value">{{ card.text ?? card.value ?? 0 }}</div>
          <div class="sch-card-label">{{ $t(`sch.count_${card.key}`) }}</div>
        </div>
      </div>
    </div>
    <div v-if="alerts.length" class="flex flex-wrap gap-2">
      <Tag v-for="alert in alerts" :key="alert.key" :severity="alert.severity" :icon="alert.icon" :value="$t(`sch.alert_${alert.key}`, { count: alert.value })" />
    </div>

    <Tabs v-model:value="tab">
      <TabList class="no-print">
        <Tab value="grid"><i class="pi pi-calendar mx-1" aria-hidden="true" />{{ $t("sch.tab_grid") }}</Tab>
        <Tab value="list"><i class="pi pi-list mx-1" aria-hidden="true" />{{ $t("sch.tab_list") }}</Tab>
        <Tab value="children"><i class="pi pi-face-smile mx-1" aria-hidden="true" />{{ $t("sch.tab_children") }} ({{ schedule.children?.length ?? 0 }})</Tab>
        <Tab value="tasks"><i class="pi pi-check-square mx-1" aria-hidden="true" />{{ $t("sch.tab_tasks") }}
          <Badge v-if="schedule.tasks?.length" :value="schedule.tasks.length" severity="warn" class="ms-1" /></Tab>
      </TabList>
      <TabPanels class="px-0">
        <TabPanel value="grid">
          <ScheduleLegend class="mb-3" />
          <WeekGrid :days="schedule.days" :items="schedule.items" :holidays="holidays" :now="now" />
        </TabPanel>
        <TabPanel value="list">
          <ScheduleList :items="schedule.items" :loading="loading" />
        </TabPanel>
        <TabPanel value="children">
          <DataTable :value="schedule.children" dataKey="id" size="small" stripedRows>
            <template #empty><div class="text-center text-color-secondary py-4">{{ $t("sch.empty") }}</div></template>
            <Column :header="$t('sp_student')"><template #body="{ data }"><b>{{ data.name }}</b></template></Column>
            <Column :header="$t('sch.programs')">
              <template #body="{ data }">
                <Tag v-for="kind in data.programs" :key="kind" :value="kindLabel(kind)" severity="info" class="me-1" />
                <span v-if="!data.programs.length" class="text-color-secondary">—</span>
              </template>
            </Column>
            <Column :header="$t('sch.count_sessions')" field="sessions" />
            <Column :header="$t('sch.count_evaluations')" field="evaluations" />
            <Column :header="$t('sch.count_consultations')" field="consultations" />
          </DataTable>
        </TabPanel>
        <TabPanel value="tasks">
          <DataTable :value="schedule.tasks" dataKey="id" size="small" stripedRows>
            <template #empty><div class="text-center text-color-secondary py-4">{{ $t("sch.no_tasks") }}</div></template>
            <Column :header="$t('sch.task_evaluation')">
              <template #body="{ data }"><b>{{ getEvaluationTypeLabel(data.type, t, data.title) }}</b></template>
            </Column>
            <Column :header="$t('sp_student')"><template #body="{ data }">{{ data.child?.name }}</template></Column>
            <Column :header="$t('sch.task_sent')" field="requested_at" />
            <Column :header="$t('sp_status')">
              <template #body="{ data }">
                <Tag :severity="data.status === 'rejected' ? 'danger' : 'warn'" :value="$t(`sch.approval_${data.status}`)" />
                <div v-if="data.note" class="text-xs text-red-700 mt-1">{{ data.note }}</div>
              </template>
            </Column>
          </DataTable>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<style scoped>
.sch-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background: #fff;
  border: 1px solid #e3ecec;
  border-inline-start: 4px solid var(--card);
}
.sch-card > i {
  font-size: 1.25rem;
  color: var(--card);
  background: color-mix(in srgb, var(--card) 12%, transparent);
  padding: 0.55rem;
  border-radius: 0.6rem;
}
.sch-card-value {
  font-size: 1.25rem;
  font-weight: 800;
  color: #1f2937;
  line-height: 1.2;
}
.sch-card-label {
  font-size: 0.75rem;
  color: #6b7280;
}
@media print {
  .sch-card { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
</style>
