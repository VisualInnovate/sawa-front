<script setup>
// «سجل البرامج»: every student program's creation and changes (before → after), newest first, by period and child.
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import { isoDate } from "@/utils/studentPrograms";
import ProgramChangeLog from "@/components/studentPrograms/ProgramChangeLog.vue";

const logs = ref([]);
const total = ref(0);
const page = ref(1);
const loading = ref(false);
const range = ref(null);
const action = ref(null);
const child = ref(null);
const children = ref([]);

async function load() {
  loading.value = true;
  try {
    const [from, to] = range.value ?? [];
    const { data } = await axios.get("api/student-program/logs", { params: {
      page: page.value, from: isoDate(from), to: isoDate(to ?? from), action: action.value, child_id: child.value,
    } });
    logs.value = data.data;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
}

// The children who have programs, for the filter.
async function loadChildren() {
  const { data } = await axios.get("api/student-program");
  const seen = new Map();
  for (const program of data.data ?? []) if (program.student) seen.set(program.student.id, program.student);
  children.value = [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
}

watch([action, child], () => { page.value = 1; load(); });
watch(range, (value) => {
  if (!value || (value[0] && value[1])) { page.value = 1; load(); }
});
onMounted(() => {
  load();
  loadChildren().catch(() => {});
});
</script>

<template>
  <div class="sawa-card p-3">
    <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
      <p class="text-xl text-[#135C65] font-bold"><i class="pi pi-history" aria-hidden="true" /> {{ $t("program_logs") }}</p>
      <div class="flex flex-wrap items-center gap-2">
        <Select v-model="child" :options="children" optionLabel="name" optionValue="id" filter showClear :placeholder="$t('sp_student')" class="w-14rem" />
        <Select v-model="action" :options="[{ value: 'created', label: $t('program_log_created') }, { value: 'updated', label: $t('program_log_updated') }]"
          optionLabel="label" optionValue="value" showClear :placeholder="$t('program_log_action')" />
        <DatePicker v-model="range" selectionMode="range" dateFormat="yy-mm-dd" showIcon showButtonBar :manualInput="false" :placeholder="$t('sp_period')" />
        <Button icon="pi pi-refresh" variant="outlined" :loading="loading" v-tooltip.top="$t('refresh')" :aria-label="$t('refresh')" @click="load" />
      </div>
    </div>
    <div v-if="loading && !logs.length" class="flex justify-center p-5"><i class="pi pi-spin pi-spinner text-2xl" /></div>
    <ProgramChangeLog v-else :logs="logs" show-program />
    <Paginator v-if="total > 20" :rows="20" :totalRecords="total" :first="(page - 1) * 20" class="mt-3"
      @page="(event) => { page = event.page + 1; load(); }" />
  </div>
</template>
