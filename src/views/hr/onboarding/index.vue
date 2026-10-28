<script setup>
// «التهيئة»: the new employees' checklists, one card per employee. With «onboarding list» everyone's (or only mine);
// without it, the tasks given to the signed-in user, who ticks them off.
import axios from "axios";
import moment from "moment";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { errorText } from "@/utils/accounting";
import { can } from "@/utils/permissions";

const { t } = useI18n();
const router = useRouter();
const toast = useToast();

const tasks = ref([]);
const loading = ref(false);
const seeAll = can("onboarding list");
const filter = ref({ mine: !seeAll, open: true });
const me = Number(localStorage.getItem("user_id"));

async function load() {
  loading.value = true;
  try {
    tasks.value = (await axios.get("api/onboarding", { params: { mine: filter.value.mine ? 1 : undefined, open: filter.value.open ? 1 : undefined } })).data.data;
  } finally {
    loading.value = false;
  }
}
onMounted(load);

const groups = computed(() => {
  const map = new Map();
  for (const task of tasks.value) {
    if (!map.has(task.employee_id)) map.set(task.employee_id, { employee: task.employee, tasks: [] });
    map.get(task.employee_id).tasks.push(task);
  }
  return [...map.values()];
});
const overdue = (task) => !task.done_at && task.due_date && moment(task.due_date).isBefore(moment(), "day");
const mayTick = (task) => can("onboarding edit") || task.assignee_id === me;

async function toggle(task, value) {
  try {
    Object.assign(task, (await axios.post(`api/onboarding/${task.id}/done`, { done: value })).data.data);
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  }
}
const openProfile = (employee) => router.push({ name: "employee-profile", params: { id: employee.user_id }, query: { tab: "onboarding" } });
</script>

<template>
  <div>
    <Toast />
    <div class="flex flex-wrap items-center justify-between gap-2 p-4">
      <p class="text-xl text-bp-135c65 font-bold m-0">{{ $t("onb.title") }}</p>
      <div class="flex flex-wrap items-center gap-3">
        <div v-if="seeAll" class="flex items-center gap-2">
          <ToggleSwitch v-model="filter.mine" inputId="onb-mine" @update:modelValue="load" />
          <label for="onb-mine">{{ $t("onb.only_mine") }}</label>
        </div>
        <div class="flex items-center gap-2">
          <ToggleSwitch v-model="filter.open" inputId="onb-open" @update:modelValue="load" />
          <label for="onb-open">{{ $t("onb.only_open") }}</label>
        </div>
      </div>
    </div>

    <ProgressSpinner v-if="loading && !tasks.length" class="w-3rem h-3rem" />
    <p v-else-if="!groups.length" class="sawa-card p-4 m-0 text-color-secondary">{{ $t("onb.page_empty") }}</p>

    <div class="onb-groups">
      <section v-for="g in groups" :key="g.employee.id" class="sawa-card p-4 flex flex-column gap-2">
        <div class="flex items-center justify-between gap-2">
          <button type="button" class="onb-name" @click="openProfile(g.employee)">{{ g.employee.name }}</button>
          <Tag v-if="g.employee.onboarded_at" severity="success" :value="$t('onb.complete')" />
          <small v-else class="text-color-secondary">{{ $t("onb.progress", { done: g.tasks.filter((x) => x.done_at).length, total: g.tasks.length }) }}</small>
        </div>
        <ProgressBar :value="Math.round((g.tasks.filter((x) => x.done_at).length / g.tasks.length) * 100)" :showValue="false" style="height: 6px" />
        <div v-for="task in g.tasks" :key="task.id" class="onb-row" :class="{ 'is-done': task.done_at }">
          <Checkbox :modelValue="!!task.done_at" binary :inputId="`onbp-${task.id}`" :disabled="!mayTick(task)" @update:modelValue="(v) => toggle(task, v)" />
          <label :for="`onbp-${task.id}`" class="flex-1">{{ task.title }}</label>
          <Tag v-if="overdue(task)" severity="danger" :value="$t('onb.overdue')" />
          <small class="text-color-secondary">{{ task.assignee?.name || "—" }}</small>
          <small v-if="task.due_date" class="text-color-secondary"><bdi dir="ltr">{{ task.due_date }}</bdi></small>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.onb-groups { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1rem; }
@media (max-width: 420px) { .onb-groups { grid-template-columns: minmax(0, 1fr); } }
.onb-name { background: none; border: 0; padding: 0; font: inherit; font-weight: 700; font-size: 1.05rem; color: var(--p-primary-color); cursor: pointer; text-align: start; }
.onb-row { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; padding: 0.35rem 0; border-top: 1px solid var(--p-content-border-color); }
.onb-row.is-done label { text-decoration: line-through; color: var(--p-text-muted-color); }
</style>
