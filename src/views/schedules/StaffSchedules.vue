<script setup>
// «جداول الموظفين» (permission «staff schedules list»): every employee's week from their sessions, inclusion time,
// evaluations, consultations and calendar over their HR shift and the official holidays.
// Overview: one row per employee with each day's load and what needs attention; one employee's week (grid, list,
// children, pending evaluations); and every item of the week as one list. Printable.
import axios from "axios";
import moment from "moment";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import sawaLogo from "@/assets/img/sawa_logo.svg";
import { dayLabel } from "@/utils/studentPrograms";
import { formatMinutes, weekRange, weekStart } from "@/utils/schedules";
import EmployeeSchedule from "@/components/schedules/EmployeeSchedule.vue";
import ScheduleList from "@/components/schedules/ScheduleList.vue";
import WeekNav from "@/components/schedules/WeekNav.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const week = ref(weekStart(route.query.from ? new Date(route.query.from) : new Date()));
const tab = ref(["overview", "employee", "list"].includes(route.query.tab) ? route.query.tab : "overview");
const rows = ref([]);
const holidays = ref([]);
const now = ref(null);
const loading = ref(false);
const search = ref("");
const selectedId = ref(route.query.user ? Number(route.query.user) : null);
const onlyBusy = ref(true);

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get("api/staff-schedules", { params: weekRange(week.value) });
    rows.value = data.data;
    holidays.value = data.holidays;
    now.value = data.now;
    if (!rows.value.some((row) => row.user.id === selectedId.value)) selectedId.value = rows.value.find((row) => row.items.length)?.user.id ?? rows.value[0]?.user.id ?? null;
  } finally {
    loading.value = false;
  }
}

const days = computed(() => rows.value[0]?.days ?? []);
const filtered = computed(() => {
  const term = search.value.trim().toLowerCase();
  return rows.value.filter((row) => (!onlyBusy.value || row.items.length || row.tasks.length) && (!term || row.user.name.toLowerCase().includes(term)));
});
const selected = computed(() => rows.value.find((row) => row.user.id === selectedId.value) ?? null);
const allItems = computed(() => rows.value.flatMap((row) => row.items.map((item) => ({ ...item, staff: item.staff ?? row.user.name }))));
const totals = computed(() => rows.value.reduce((sum, row) => {
  Object.entries(row.summary).forEach(([key, value]) => { sum[key] = (sum[key] ?? 0) + value; });
  return sum;
}, { employees: rows.value.filter((row) => row.items.length).length }));
const totalCards = computed(() => [
  { key: "employees", icon: "pi pi-id-card", value: totals.value.employees, color: "#135c65" },
  { key: "sessions", icon: "pi pi-users", value: (totals.value.sessions ?? 0) + (totals.value.inclusion ?? 0), color: "#3aa39b" },
  { key: "evaluations", icon: "pi pi-clipboard", value: totals.value.evaluations ?? 0, color: "#d9822b" },
  { key: "consultations", icon: "pi pi-comments", value: (totals.value.consultations ?? 0) + (totals.value.meetings ?? 0), color: "#2f6fcf" },
  { key: "conflicts", icon: "pi pi-exclamation-circle", value: totals.value.conflicts ?? 0, color: "#dc2626" },
  { key: "pending_approvals", icon: "pi pi-hourglass", value: totals.value.pending_approvals ?? 0, color: "#b45309" },
]);

// A day cell of the overview: how full the day is (busy time over the shift), as a color.
function heat(day) {
  if (day.holiday) return { background: "repeating-linear-gradient(135deg,#fdecec,#fdecec 4px,#fff 4px,#fff 8px)", color: "#9b1c1c" };
  if (!day.busy_minutes) return { background: "#f7f9f9", color: "#9ca3af" };
  const load = Math.min(1, day.load ?? 0);
  if (day.crowded) return { background: "#fde2e2", color: "#991b1b" };
  return { background: `rgba(19, 92, 101, ${0.1 + load * 0.5})`, color: load > 0.6 ? "#fff" : "#0b3f45" };
}
const dayItems = (row, date) => row.items.filter((item) => item.date === date && item.type !== "availability");
const dayAttention = (row, date) => dayItems(row, date).some((item) => ["late", "missed"].includes(item.status) || item.flags?.some((flag) => ["conflict", "outside_shift"].includes(flag)));

function openEmployee(row) {
  selectedId.value = row.user.id;
  tab.value = "employee";
}

watch([week, tab, selectedId], () => {
  router.replace({ query: { from: weekRange(week.value).from, tab: tab.value, ...(selectedId.value ? { user: selectedId.value } : {}) } });
});
watch(week, load);
const print = () => window.print();
onMounted(load);
</script>

<template>
  <div class="sawa-card p-3 staff-schedules">
    <div class="flex flex-wrap items-center justify-between gap-3 mb-3 no-print">
      <div>
        <p class="text-xl text-[#135C65] font-bold m-0">{{ $t("sch.title") }}</p>
        <p class="text-sm text-color-secondary m-0">{{ $t("sch.subtitle") }}</p>
      </div>
      <WeekNav v-model="week" :loading="loading" @refresh="load" @print="print" />
    </div>

    <div class="report-head print-only">
      <img :src="sawaLogo" alt="" class="report-logo" />
      <div class="text-center">
        <div class="text-lg font-bold">{{ $t("sch.title") }}<template v-if="tab === 'employee' && selected"> — {{ selected.user.name }}</template></div>
        <div class="text-sm">{{ weekRange(week).from }} – {{ weekRange(week).to }}</div>
      </div>
      <div class="text-xs">{{ moment().format("YYYY-MM-DD HH:mm") }}</div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 mb-3">
      <div v-for="card in totalCards" :key="card.key" class="sch-total" :style="{ '--card': card.color }">
        <i :class="card.icon" aria-hidden="true" />
        <div><div class="sch-total-value">{{ card.value }}</div><div class="sch-total-label">{{ $t(`sch.total_${card.key}`) }}</div></div>
      </div>
    </div>

    <Tabs v-model:value="tab">
      <TabList class="no-print">
        <Tab value="overview"><i class="pi pi-table mx-1" aria-hidden="true" />{{ $t("sch.tab_overview") }}</Tab>
        <Tab value="employee"><i class="pi pi-user mx-1" aria-hidden="true" />{{ $t("sch.tab_employee") }}</Tab>
        <Tab value="list"><i class="pi pi-list mx-1" aria-hidden="true" />{{ $t("sch.tab_all_items") }}</Tab>
      </TabList>
      <TabPanels class="px-0">
        <TabPanel value="overview">
          <div class="flex flex-wrap items-center gap-3 mb-3 no-print">
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText v-model="search" :placeholder="$t('sch.search_employee')" :aria-label="$t('sch.search_employee')" />
            </IconField>
            <label class="flex items-center gap-2 text-sm">
              <ToggleSwitch v-model="onlyBusy" inputId="sch-only-busy" />
              <span>{{ $t("sch.only_busy") }}</span>
            </label>
          </div>
          <div class="overflow-x-auto">
            <table class="sch-overview">
              <thead>
                <tr>
                  <th class="text-start">{{ $t("sch.employee") }}</th>
                  <th v-for="day in days" :key="day.date">
                    {{ dayLabel(t, day.weekday) }}<div class="text-xs font-normal opacity-75">{{ moment(day.date).format("DD/MM") }}</div>
                  </th>
                  <th>{{ $t("sch.count_children") }}</th>
                  <th>{{ $t("sch.count_programs") }}</th>
                  <th>{{ $t("sch.count_sessions") }}</th>
                  <th>{{ $t("sch.count_evaluations") }}</th>
                  <th>{{ $t("sch.count_consultations") }}</th>
                  <th>{{ $t("sch.count_busy") }}</th>
                  <th>{{ $t("sch.needs_attention") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!filtered.length"><td :colspan="days.length + 8" class="text-center text-color-secondary py-4">{{ loading ? $t("loading") : $t("sch.empty") }}</td></tr>
                <tr v-for="row in filtered" :key="row.user.id" class="cursor-pointer" @click="openEmployee(row)">
                  <td class="text-start">
                    <div class="font-bold text-[#135C65]">{{ row.user.name }}</div>
                    <div v-if="row.user.job_title" class="text-xs text-color-secondary">{{ row.user.job_title }}</div>
                  </td>
                  <td v-for="day in row.days" :key="day.date" class="sch-heat" :style="heat(day)"
                    :title="day.holiday ? day.holiday.title : $t('sch.load_title', { value: Math.round((day.load ?? 0) * 100) })">
                    <template v-if="day.holiday"><i class="pi pi-sun" aria-hidden="true" /></template>
                    <template v-else-if="dayItems(row, day.date).length">
                      <b>{{ dayItems(row, day.date).length }}</b>
                      <i v-if="dayAttention(row, day.date)" class="pi pi-exclamation-triangle sch-heat-warn" aria-hidden="true" />
                      <div class="text-[0.65rem] opacity-80">{{ formatMinutes(t, day.busy_minutes) }}</div>
                    </template>
                    <template v-else>—</template>
                  </td>
                  <td>{{ row.summary.children }}</td>
                  <td>{{ row.summary.programs }}</td>
                  <td>{{ row.summary.sessions + row.summary.inclusion }}</td>
                  <td>{{ row.summary.evaluations }}</td>
                  <td>{{ row.summary.consultations + row.summary.meetings }}</td>
                  <td class="whitespace-nowrap">{{ formatMinutes(t, row.summary.busy_minutes) }}</td>
                  <td>
                    <div class="flex flex-wrap gap-1 justify-center">
                      <Tag v-if="row.summary.conflicts" severity="danger" icon="pi pi-exclamation-circle" :value="row.summary.conflicts" v-tooltip.top="$t('sch.flag_conflict')" />
                      <Tag v-if="row.summary.outside_shift" severity="warn" icon="pi pi-sign-out" :value="row.summary.outside_shift" v-tooltip.top="$t('sch.flag_outside_shift')" />
                      <Tag v-if="row.summary.late" severity="danger" icon="pi pi-exclamation-triangle" :value="row.summary.late" v-tooltip.top="$t('sch.late_missed')" />
                      <Tag v-if="row.summary.crowded_days" severity="danger" icon="pi pi-chart-bar" :value="row.summary.crowded_days" v-tooltip.top="$t('sch.crowded_days')" />
                      <Tag v-if="row.summary.pending_approvals" severity="warn" icon="pi pi-hourglass" :value="row.summary.pending_approvals" v-tooltip.top="$t('sch.pending_approvals')" />
                      <i v-if="!row.summary.conflicts && !row.summary.outside_shift && !row.summary.late && !row.summary.crowded_days && !row.summary.pending_approvals"
                        class="pi pi-check-circle text-green-600" :aria-label="$t('sch.all_good')" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabPanel>
        <TabPanel value="employee">
          <div class="flex flex-wrap items-center gap-2 mb-3 no-print">
            <Select v-model="selectedId" :options="rows.map((row) => ({ id: row.user.id, name: row.user.name, count: row.items.length }))" optionLabel="name" optionValue="id"
              filter class="w-full sm:w-72" :placeholder="$t('sch.pick_employee')" :aria-label="$t('sch.pick_employee')">
              <template #option="{ option }">{{ option.name }} <span class="text-xs text-color-secondary ms-1">({{ option.count }})</span></template>
            </Select>
          </div>
          <EmployeeSchedule v-if="selected" :key="selected.user.id" :schedule="selected" :holidays="holidays" :now="now" :loading="loading" />
          <p v-else class="text-center text-color-secondary py-4">{{ $t("sch.pick_employee") }}</p>
        </TabPanel>
        <TabPanel value="list">
          <ScheduleList :items="allItems" showStaff :loading="loading" />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<style scoped>
.sch-total {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, color-mix(in srgb, var(--card) 10%, #fff), #fff);
  border: 1px solid color-mix(in srgb, var(--card) 25%, #fff);
}
.sch-total > i {
  font-size: 1.3rem;
  color: #fff;
  background: var(--card);
  padding: 0.6rem;
  border-radius: 0.65rem;
}
.sch-total-value {
  font-size: 1.35rem;
  font-weight: 800;
  line-height: 1.15;
  color: #1f2937;
}
.sch-total-label {
  font-size: 0.75rem;
  color: #6b7280;
}
.sch-overview {
  width: 100%;
  min-width: 60rem;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.85rem;
}
.sch-overview th {
  background: #135c65;
  color: #fff;
  padding: 0.5rem 0.4rem;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
}
.sch-overview th:first-child { border-start-start-radius: 0.6rem; }
.sch-overview th:last-child { border-start-end-radius: 0.6rem; }
.sch-overview td {
  padding: 0.45rem 0.4rem;
  border-bottom: 1px solid #e6eded;
  text-align: center;
}
.sch-overview tbody tr:hover td:not(.sch-heat) {
  background: #f3f8f8;
}
.sch-heat {
  position: relative;
  min-width: 4.5rem;
  border-inline-start: 2px solid #fff;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.sch-heat-warn {
  position: absolute;
  top: 0.2rem;
  inset-inline-end: 0.25rem;
  font-size: 0.65rem;
  color: #f59e0b;
}
.report-head {
  display: none;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #135c65;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}
.report-logo { height: 3rem; }
@media print {
  :global(body *) { visibility: hidden; }
  .staff-schedules, .staff-schedules * { visibility: visible; }
  .staff-schedules { position: absolute; inset: 0 auto auto 0; width: 100%; box-shadow: none; border: none; }
  .report-head.print-only { display: flex; }
  :global(.no-print) { display: none !important; }
  .sch-overview { min-width: 0; font-size: 0.7rem; }
  .sch-overview th, .sch-total { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  @page { size: landscape; margin: 8mm; }
}
</style>
