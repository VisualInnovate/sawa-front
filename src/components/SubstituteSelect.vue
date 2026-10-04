<script>
// One request per page load, shared by every picker on the page.
let cached = null;
</script>

<script setup>
// Picks the employee who stands in for another (information only): every employee, searchable by name.
// v-model is the substitute's user id (null = none); `exclude` hides the employee themself.
import axios from "axios";
import { computed, onMounted, ref } from "vue";

const props = defineProps({
  exclude: { type: [Number, String], default: null },
  inputId: { type: String, default: "substitute-employee" },
  disabled: Boolean,
});
const model = defineModel({ type: [Number, null], default: null });

const employees = ref([]);
const loading = ref(false);

const options = computed(() => employees.value
  .filter((employee) => props.exclude == null || Number(employee.id) !== Number(props.exclude))
  .map((employee) => ({ id: Number(employee.id), label: employee.title ? `${employee.name} — ${employee.title}` : employee.name })));

onMounted(async () => {
  loading.value = true;
  try {
    cached ??= axios.get("api/users/substitute-options").then(({ data }) => data?.data ?? []);
    employees.value = await cached;
  } catch {
    cached = null;
    employees.value = [];
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <Select v-model="model" :inputId="inputId" :options="options" optionLabel="label" optionValue="id" filter showClear
    :loading="loading" :disabled="disabled" :placeholder="$t('substitute_employee_pick')" :filterPlaceholder="$t('search')"
    :emptyFilterMessage="$t('no_records_found')" class="w-full" />
</template>
