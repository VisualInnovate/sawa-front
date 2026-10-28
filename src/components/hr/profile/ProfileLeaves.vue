<script setup>
// The employee's leave balances and requests (profile tab).
import axios from "axios";
import { onMounted, ref } from "vue";

const props = defineProps({ userId: { type: Number, required: true } });

const balances = ref([]);
const leaves = ref([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const { data } = await axios.get(`api/employee-profile/${props.userId}/leaves`);
    balances.value = data.data.balances;
    leaves.value = data.data.leaves;
  } finally {
    loading.value = false;
  }
});

const STATUS = { 0: ["warn", "Pending"], 1: ["success", "Accepted"], "-1": ["danger", "Rejected"] };
const period = (l) => (l.leave_setup?.type === "hourly" ? `${l.off_date ?? l.start_date} ${String(l.start_time ?? "").slice(0, 5)}–${String(l.end_time ?? "").slice(0, 5)}` : `${l.start_date} → ${l.end_date}`);
</script>

<template>
  <div class="flex flex-column gap-3">
    <div class="prof-balances">
      <div v-for="b in balances" :key="b.id">
        <span class="text-sm text-color-secondary">{{ b.title }}</span>
        <b>{{ b.remaining }} <small>/ {{ b.allowance ?? "—" }}</small></b>
        <small class="text-color-secondary">{{ b.type === "hourly" ? $t("prof.hours_left") : $t("prof.days_left") }}</small>
      </div>
    </div>
    <DataTable :value="leaves" :loading="loading" dataKey="id" size="small" stripedRows responsiveLayout="scroll" paginator :rows="10">
      <template #empty>{{ $t("prof.leaves_empty") }}</template>
      <Column :header="$t('prof.leave_type')"><template #body="{ data }">{{ data.leave_setup?.title || "—" }}</template></Column>
      <Column :header="$t('prof.period')"><template #body="{ data }"><bdi dir="ltr" class="whitespace-nowrap">{{ period(data) }}</bdi></template></Column>
      <Column :header="$t('prof.duration')">
        <template #body="{ data }">{{ data.leave_setup?.type === "hourly" ? $t("prof.n_hours", { n: data.total_hours ?? 0 }) : $t("prof.n_days", { n: data.total_days ?? 0 }) }}</template>
      </Column>
      <Column :header="$t('prof.reason')">
        <template #body="{ data }">
          <small>{{ data.reason || "—" }}</small>
          <small v-if="data.rejected_reason" class="block text-red-600">{{ data.rejected_reason }}</small>
        </template>
      </Column>
      <Column :header="$t('prof.status')">
        <template #body="{ data }"><Tag :severity="(STATUS[data.status] ?? STATUS[0])[0]" :value="$t((STATUS[data.status] ?? STATUS[0])[1])" /></template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.prof-balances { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.75rem; }
.prof-balances div { display: grid; gap: 0.15rem; padding: 0.8rem 1rem; border: 1px solid var(--p-content-border-color); border-radius: 14px; background: var(--p-content-background, #fff); }
.prof-balances b { font-size: 1.35rem; }
.prof-balances b small { font-size: 0.85rem; font-weight: 500; color: var(--p-text-muted-color); }
</style>
