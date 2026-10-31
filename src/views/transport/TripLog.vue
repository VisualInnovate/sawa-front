<script setup>
// «سجل الرحلات»: every child on the bus trips of a period with its status and when the supervisor marked it.
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { STOP_SEVERITY, STOP_STATUSES, isoDate, dateOf } from "@/utils/transport";

const { t } = useI18n();
const from = ref(new Date());
const to = ref(new Date());
const status = ref(null);
const rows = ref([]);
const loading = ref(false);
const statuses = computed(() => STOP_STATUSES.map((value) => ({ value, name: t(`tr.status.${value}`) })));
const time = (value) => (value ? new Date(value).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) : "—");
const label = (row) => t(`tr.status.${row.direction === "to_home" && row.status === "arrived" ? "arrived_home" : row.status}`);

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get("api/transport-trip-log", { params: { from: isoDate(from.value), to: isoDate(to.value), status: status.value || undefined } });
    rows.value = data.data ?? [];
  } finally {
    loading.value = false;
  }
}

watch([from, to, status], () => {
  if (from.value && to.value && to.value < from.value) to.value = dateOf(isoDate(from.value));
  else load();
});
onMounted(load);
</script>

<template>
  <div class="sawa-card p-3">
    <div class="mb-3">
      <h1 class="text-xl text-bp-135c65 font-bold m-0">{{ $t("tr.log_title") }}</h1>
      <p class="text-sm text-color-secondary m-0">{{ $t("tr.log_lead") }}</p>
    </div>
    <div class="flex flex-wrap items-end gap-3 mb-3">
      <div class="flex flex-column gap-1">
        <label for="log-from" class="text-sm">{{ $t("tr.from_date") }}</label>
        <DatePicker inputId="log-from" v-model="from" dateFormat="yy-mm-dd" showIcon />
      </div>
      <div class="flex flex-column gap-1">
        <label for="log-to" class="text-sm">{{ $t("tr.to_date") }}</label>
        <DatePicker inputId="log-to" v-model="to" dateFormat="yy-mm-dd" showIcon :minDate="from" />
      </div>
      <div class="flex flex-column gap-1">
        <label for="log-status" class="text-sm">{{ $t("status") }}</label>
        <Select inputId="log-status" v-model="status" :options="statuses" optionValue="value" optionLabel="name" showClear :placeholder="$t('tr.all')" class="w-12rem" />
      </div>
      <Button icon="pi pi-refresh" variant="outlined" :aria-label="$t('tr.refresh')" :loading="loading" @click="load" />
    </div>

    <DataTable :value="rows" :loading="loading" dataKey="id" paginator :rows="25" responsiveLayout="scroll" stripedRows sortField="date" :sortOrder="-1">
      <template #empty>{{ $t("tr.log_empty") }}</template>
      <Column field="date" :header="$t('tr.date')" sortable><template #body="{ data }"><span dir="ltr">{{ data.date }}</span></template></Column>
      <Column field="child" :header="$t('child_name')" sortable />
      <Column field="direction" :header="$t('tr.direction')" sortable><template #body="{ data }">{{ $t(`tr.dir.${data.direction}`) }}</template></Column>
      <Column field="route" :header="$t('student_tans')" sortable />
      <Column field="plate_number" :header="$t('tr.bus')"><template #body="{ data }"><span dir="ltr">{{ data.plate_number }}</span></template></Column>
      <Column field="status" :header="$t('status')" sortable><template #body="{ data }"><Tag :severity="STOP_SEVERITY[data.status]" :value="label(data)" /></template></Column>
      <Column :header="$t('tr.status.approaching')"><template #body="{ data }"><span dir="ltr">{{ time(data.approaching_at) }}</span></template></Column>
      <Column :header="$t('tr.status.arrived')"><template #body="{ data }"><span dir="ltr">{{ time(data.arrived_at) }}</span></template></Column>
      <Column :header="$t('tr.status.absent')"><template #body="{ data }"><span dir="ltr">{{ time(data.absent_at) }}</span></template></Column>
      <Column field="by" :header="$t('tr.supervisor')"><template #body="{ data }">{{ data.by ?? "—" }}</template></Column>
    </DataTable>
  </div>
</template>
