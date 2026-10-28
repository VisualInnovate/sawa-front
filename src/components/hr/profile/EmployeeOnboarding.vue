<script setup>
// A new employee's onboarding checklist (profile tab): tick tasks off, give them to someone with a due date, add or
// remove tasks. An employee hired before onboarding existed gets the default checklist with «بدء التهيئة».
import axios from "axios";
import moment from "moment";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { errorText } from "@/utils/accounting";
import { can } from "@/utils/permissions";

const props = defineProps({ employeeId: { type: Number, required: true }, startDate: { type: String, default: null }, archived: { type: Boolean, default: false } });
const emit = defineEmits(["changed"]);
const { t } = useI18n();
const toast = useToast();

const tasks = ref([]);
const assignees = ref([]);
const loading = ref(false);
const canEdit = computed(() => can("onboarding edit") && !props.archived);
const me = Number(localStorage.getItem("user_id"));
const done = computed(() => tasks.value.filter((x) => x.done_at).length);
const percent = computed(() => (tasks.value.length ? Math.round((done.value / tasks.value.length) * 100) : 0));
const fail = (error) => toast.add({ severity: "error", summary: t("error"), detail: error.response?.data?.message === "hr.no_onboarding_tasks" ? t("onb.no_templates") : errorText(error), life: 5000 });

async function load() {
  loading.value = true;
  try {
    tasks.value = (await axios.get("api/onboarding", { params: { employee_id: props.employeeId } })).data.data;
  } finally {
    loading.value = false;
  }
}
onMounted(async () => {
  await load();
  if (can("onboarding edit")) assignees.value = (await axios.get("api/onboarding/assignees")).data.data;
});

const overdue = (task) => !task.done_at && task.due_date && moment(task.due_date).isBefore(moment(), "day");
const mayTick = (task) => !props.archived && (can("onboarding edit") || task.assignee_id === me);

async function toggle(task, value) {
  try {
    const { data } = await axios.post(`api/onboarding/${task.id}/done`, { done: value });
    Object.assign(task, data.data);
    emit("changed");
  } catch (error) {
    fail(error);
  }
}
async function patch(task, changes) {
  try {
    const { data } = await axios.post(`api/onboarding/${task.id}`, changes);
    Object.assign(task, data.data);
  } catch (error) {
    fail(error);
    load();
  }
}

// ---- Start ----
const startForm = ref({ from: props.startDate ? new Date(props.startDate) : new Date(), assignee_id: me || null });
const starting = ref(false);
async function start() {
  starting.value = true;
  try {
    await axios.post("api/onboarding/start", { employee_id: props.employeeId, from: moment(startForm.value.from).format("YYYY-MM-DD"), assignee_id: startForm.value.assignee_id });
    await load();
    emit("changed");
  } catch (error) {
    fail(error);
  } finally {
    starting.value = false;
  }
}

// ---- Add / remove ----
const adding = ref(false);
const newTask = ref({ title: "", assignee_id: null, due_date: null });
async function add() {
  if (!newTask.value.title.trim()) return;
  try {
    await axios.post("api/onboarding", { employee_id: props.employeeId, title: newTask.value.title.trim(), assignee_id: newTask.value.assignee_id,
      due_date: newTask.value.due_date ? moment(newTask.value.due_date).format("YYYY-MM-DD") : null });
    newTask.value = { title: "", assignee_id: newTask.value.assignee_id, due_date: null };
    adding.value = false;
    await load();
    emit("changed");
  } catch (error) {
    fail(error);
  }
}
async function remove(task) {
  try {
    await axios.delete(`api/onboarding/${task.id}`);
    await load();
    emit("changed");
  } catch (error) {
    fail(error);
  }
}
</script>

<template>
  <div class="flex flex-column gap-3">
    <ProgressSpinner v-if="loading && !tasks.length" class="w-3rem h-3rem" />

    <!-- No checklist yet -->
    <div v-else-if="!tasks.length" class="sawa-card p-4 flex flex-column gap-3 max-w-2xl">
      <p class="m-0">{{ $t("onb.none") }}</p>
      <div v-if="canEdit" class="flex flex-wrap items-end gap-3">
        <div class="flex flex-column gap-1">
          <label for="onb-from">{{ $t("onb.from") }}</label>
          <DatePicker inputId="onb-from" v-model="startForm.from" dateFormat="yy-mm-dd" showIcon class="w-12rem" />
        </div>
        <div class="flex flex-column gap-1">
          <label for="onb-assignee">{{ $t("onb.assignee") }}</label>
          <Select inputId="onb-assignee" v-model="startForm.assignee_id" :options="assignees" optionLabel="name" optionValue="id" filter showClear class="w-16rem" />
        </div>
        <Button icon="pi pi-play" :label="$t('onb.start')" :loading="starting" @click="start" />
      </div>
    </div>

    <template v-else>
      <div class="sawa-card p-3 flex flex-wrap items-center gap-3">
        <div class="flex-1 min-w-12rem">
          <div class="flex justify-between text-sm mb-1">
            <span class="font-medium">{{ percent === 100 ? $t("onb.complete") : $t("onb.in_progress") }}</span>
            <span class="text-color-secondary">{{ $t("onb.progress", { done, total: tasks.length }) }}</span>
          </div>
          <ProgressBar :value="percent" :showValue="false" style="height: 8px" />
        </div>
        <Button v-if="canEdit" icon="pi pi-plus" :label="$t('onb.add')" outlined size="small" @click="adding = !adding" />
      </div>

      <div v-if="adding" class="sawa-card p-3 flex flex-wrap items-end gap-2">
        <div class="flex flex-column gap-1 flex-1 min-w-14rem">
          <label for="onb-new">{{ $t("onb.task") }}</label>
          <InputText id="onb-new" v-model="newTask.title" maxlength="200" @keyup.enter="add" />
        </div>
        <Select v-model="newTask.assignee_id" :options="assignees" optionLabel="name" optionValue="id" filter showClear :placeholder="$t('onb.assignee')" class="w-14rem" />
        <DatePicker v-model="newTask.due_date" dateFormat="yy-mm-dd" showIcon :placeholder="$t('onb.due')" class="w-12rem" />
        <Button icon="pi pi-check" :label="$t('save')" :disabled="!newTask.title.trim()" @click="add" />
      </div>

      <div class="flex flex-column gap-2">
        <div v-for="task in tasks" :key="task.id" class="onb-task" :class="{ 'is-done': task.done_at, 'is-late': overdue(task) }">
          <Checkbox :modelValue="!!task.done_at" binary :inputId="`onb-${task.id}`" :disabled="!mayTick(task)" @update:modelValue="(v) => toggle(task, v)" />
          <div class="flex-1 min-w-0">
            <label :for="`onb-${task.id}`" class="font-medium onb-task__title">{{ task.title }}</label>
            <small v-if="task.done_at" class="block text-color-secondary">
              {{ $t("onb.done_by", { name: task.done_by?.name || "—", date: `\u2066${moment(task.done_at).format("YYYY-MM-DD")}\u2069` }) }}
            </small>
          </div>
          <Tag v-if="overdue(task)" severity="danger" :value="$t('onb.overdue')" />
          <template v-if="canEdit">
            <Select :modelValue="task.assignee_id" :options="assignees" optionLabel="name" optionValue="id" filter showClear :placeholder="$t('onb.assignee')" size="small"
              class="w-12rem" :aria-label="$t('onb.assignee')" @update:modelValue="(v) => patch(task, { assignee_id: v ?? null })" />
            <DatePicker :modelValue="task.due_date ? new Date(task.due_date) : null" dateFormat="yy-mm-dd" size="small" class="w-9rem" :aria-label="$t('onb.due')"
              @update:modelValue="(v) => patch(task, { due_date: v ? moment(v).format('YYYY-MM-DD') : null })" />
            <Button icon="pi pi-trash" text rounded severity="danger" size="small" :aria-label="$t('delete')" v-tooltip.top="$t('delete')" @click="remove(task)" />
          </template>
          <template v-else>
            <small class="text-color-secondary">{{ task.assignee?.name || "—" }}</small>
            <small class="text-color-secondary"><bdi dir="ltr">{{ task.due_date || "" }}</bdi></small>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.onb-task { display: flex; flex-wrap: wrap; align-items: center; gap: 0.6rem; padding: 0.6rem 0.9rem; border: 1px solid var(--p-content-border-color); border-radius: 12px;
  background: var(--p-content-background, #fff); }
.onb-task.is-done .onb-task__title { text-decoration: line-through; color: var(--p-text-muted-color); }
.onb-task.is-late { border-color: color-mix(in srgb, #ef4444 45%, transparent); }
</style>
