<script setup>
// The employee's attendance for one month (profile tab): totals on top, then each day.
import axios from "axios";
import moment from "moment";
import { computed, onMounted, ref, watch } from "vue";

const props = defineProps({ userId: { type: Number, required: true } });

const month = ref(new Date());
const rows = ref([]);
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    rows.value = (await axios.get(`api/employee-profile/${props.userId}/attendance`, { params: { month: moment(month.value).format("YYYY-MM") } })).data.data.rows;
  } finally {
    loading.value = false;
  }
}
onMounted(load);
watch(month, load);

// late, early_leave and overtime are saved in hours.
const minutes = (h) => Math.round(Number(h || 0) * 60);
const totals = computed(() => ({
  present: rows.value.filter((r) => r.status !== "absent").length,
  absent: rows.value.filter((r) => r.status === "absent").length,
  lateDays: rows.value.filter((r) => Number(r.late) > 0).length,
  lateMinutes: rows.value.reduce((sum, r) => sum + minutes(r.late), 0),
  earlyMinutes: rows.value.reduce((sum, r) => sum + minutes(r.early_leave), 0),
  hours: rows.value.reduce((sum, r) => sum + Number(r.working_hours || 0), 0),
}));
const time = (v) => (v ? String(v).slice(0, 5) : "—");
</script>

<template>
  <div class="flex flex-column gap-3">
    <div class="flex flex-wrap items-center gap-3">
      <DatePicker v-model="month" view="month" dateFormat="yy-mm" showIcon class="w-12rem" :aria-label="$t('prof.month')" />
    </div>
    <div class="prof-stats">
      <div><b>{{ totals.present }}</b><span>{{ $t("prof.att_present") }}</span></div>
      <div><b>{{ totals.absent }}</b><span>{{ $t("prof.att_absent") }}</span></div>
      <div><b>{{ totals.lateDays }}</b><span>{{ $t("prof.att_late_days", { n: totals.lateMinutes }) }}</span></div>
      <div><b>{{ totals.earlyMinutes }}</b><span>{{ $t("prof.att_early") }}</span></div>
      <div><b>{{ totals.hours.toFixed(1) }}</b><span>{{ $t("prof.att_hours") }}</span></div>
    </div>
    <DataTable :value="rows" :loading="loading" dataKey="id" size="small" stripedRows responsiveLayout="scroll">
      <template #empty>{{ $t("prof.att_empty") }}</template>
      <Column :header="$t('prof.date')">
        <template #body="{ data }"><bdi dir="ltr">{{ data.date }}</bdi> <small class="text-color-secondary">{{ moment(data.date).format("dddd") }}</small></template>
      </Column>
      <Column :header="$t('prof.clock_in')"><template #body="{ data }"><bdi dir="ltr">{{ time(data.clock_in) }}</bdi></template></Column>
      <Column :header="$t('prof.clock_out')"><template #body="{ data }"><bdi dir="ltr">{{ time(data.clock_out) }}</bdi></template></Column>
      <Column :header="$t('prof.late')">
        <template #body="{ data }"><span :class="{ 'text-red-600 font-medium': minutes(data.late) > 0 }">{{ minutes(data.late) ? $t("prof.minutes", { n: minutes(data.late) }) : "—" }}</span></template>
      </Column>
      <Column :header="$t('prof.early')">
        <template #body="{ data }">{{ minutes(data.early_leave) ? $t("prof.minutes", { n: minutes(data.early_leave) }) : "—" }}</template>
      </Column>
      <Column :header="$t('prof.hours')"><template #body="{ data }">{{ data.working_hours ? Number(data.working_hours).toFixed(1) : "—" }}</template></Column>
      <Column :header="$t('prof.status')">
        <template #body="{ data }">
          <Tag :severity="data.status === 'absent' ? 'danger' : data.status === 'clocked_in' ? 'info' : 'success'" :value="$t(data.status === 'absent' ? 'prof.att_absent_tag' : `prof.att_${data.status || 'attend'}`)" />
          <Tag v-if="data.leave_type" severity="secondary" class="ms-1" :value="$t(`prof.leave_${data.leave_type}`)" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.prof-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; }
.prof-stats div { display: grid; gap: 0.15rem; padding: 0.8rem 1rem; border: 1px solid var(--p-content-border-color); border-radius: 14px; background: var(--p-content-background, #fff); }
.prof-stats b { font-size: 1.35rem; }
.prof-stats span { font-size: 0.8rem; color: var(--p-text-muted-color); }
</style>
