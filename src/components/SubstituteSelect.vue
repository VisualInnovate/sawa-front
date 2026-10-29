<script>
// One request per page load, shared by every picker on the page.
let cached = null;
</script>

<script setup>
// Picks the employees who stand in for another, in order: the first free one takes the employee's sessions and
// appointments during a leave, then the second… Every employee, the same department first, each with their department.
// v-model is the substitutes' user ids in order ([] = none); `exclude` hides the employee themself.
import axios from "axios";
import { computed, onMounted, ref } from "vue";

const props = defineProps({
  exclude: { type: [Number, String], default: null },
  inputId: { type: String, default: "substitute-employee" },
  disabled: Boolean,
});
const model = defineModel({ type: Array, default: () => [] });

const employees = ref([]);
const loading = ref(false);

const options = computed(() => employees.value
  .filter((employee) => props.exclude == null || Number(employee.id) !== Number(props.exclude))
  .map((employee) => ({ id: Number(employee.id), label: [employee.name, employee.title, employee.department].filter(Boolean).join(" — ") })));
const byId = computed(() => Object.fromEntries(employees.value.map((employee) => [Number(employee.id), employee])));

const move = (index, step) => {
  const list = [...model.value];
  [list[index], list[index + step]] = [list[index + step], list[index]];
  model.value = list;
};
const remove = (index) => (model.value = model.value.filter((_, i) => i !== index));

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
  <div class="substitute-select">
    <MultiSelect v-model="model" :inputId="inputId" :options="options" optionLabel="label" optionValue="id" filter
      display="chip" :loading="loading" :disabled="disabled" :placeholder="$t('substitute_employee_pick')"
      :filterPlaceholder="$t('search')" :emptyFilterMessage="$t('no_records_found')" class="w-full" />
    <ol v-if="model.length > 1" class="substitute-order">
      <li v-for="(id, index) in model" :key="id">
        <Tag :value="String(index + 1)" severity="contrast" />
        <span class="flex-1">{{ byId[id]?.name ?? id }}</span>
        <Tag v-if="byId[id]?.department" :value="byId[id].department" severity="secondary" />
        <Button icon="pi pi-arrow-up" size="small" variant="text" rounded :disabled="disabled || index === 0" :aria-label="$t('lflow.move_up')" @click="move(index, -1)" />
        <Button icon="pi pi-arrow-down" size="small" variant="text" rounded :disabled="disabled || index === model.length - 1" :aria-label="$t('lflow.move_down')" @click="move(index, 1)" />
        <Button icon="pi pi-times" size="small" variant="text" rounded severity="danger" :disabled="disabled" :aria-label="$t('delete')" @click="remove(index)" />
      </li>
    </ol>
    <small v-if="model.length > 1" class="text-muted-color">{{ $t("lflow.substitutes_order") }}</small>
  </div>
</template>

<style scoped>
.substitute-select { display: flex; flex-direction: column; gap: .4rem; width: 100%; }
.substitute-order { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .25rem; }
.substitute-order li { display: flex; align-items: center; gap: .5rem; padding: .25rem .5rem; border-radius: 8px; background: var(--p-content-hover-background); }
</style>
