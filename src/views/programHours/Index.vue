<script setup>
// «أوقات البرامج»: each program's from–to hours per weekday. Day (classes) and clinics (evening) may not
// overlap on the same day (touching is fine); inclusion may overlap either. The whole week is saved at once.
// Below: the default priority order of the automatic scheduling criteria (a program may have its own).
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { WORK_TYPES, workTypeLabel } from "@/utils/employeeWorkTypes";
import SchedulingCriteria from "@/components/studentPrograms/SchedulingCriteria.vue";

const { t } = useI18n();
const toast = useToast();

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const EXCLUSIVE = ["day", "clinics"];

// cells[day][program] = { on, start, end }
const cells = ref({});
const loading = ref(true);
const saving = ref(false);
const serverErrors = ref({});

function fill(hours) {
  const next = {};
  DAYS.forEach((_, day) => {
    next[day] = {};
    WORK_TYPES.forEach((program) => {
      const hour = hours.find((row) => row.day === day && row.program === program);
      next[day][program] = hour ? { on: true, start: hour.start, end: hour.end } : { on: false, start: "", end: "" };
    });
  });
  cells.value = next;
}

async function load() {
  const [hours, defaults] = await Promise.all([axios.get("api/program-hours"), axios.get("api/program-hours/criteria")]);
  fill(hours.data.data);
  criteria.value = defaults.data.data;
  loading.value = false;
}

const criteria = ref([]);
const savingCriteria = ref(false);
async function saveCriteria() {
  savingCriteria.value = true;
  try {
    const { data } = await axios.put("api/program-hours/criteria", { criteria: criteria.value });
    criteria.value = data.data;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("sched.saved"), life: 2500 });
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message ?? t("sched.not_saved"), life: 3500 });
  } finally {
    savingCriteria.value = false;
  }
}

function toggle(cell) {
  if (cell.on && !cell.start && !cell.end) Object.assign(cell, { start: "08:00", end: "13:00" });
}

// The problems shown under each cell before saving; the backend checks the same rules.
const problems = computed(() => {
  const found = {};
  Object.entries(cells.value).forEach(([day, programs]) => {
    WORK_TYPES.forEach((program) => {
      const cell = programs[program];
      if (!cell.on) return;
      if (!cell.start || !cell.end) found[`${day}.${program}`] = t("hours_missing");
      else if (cell.end <= cell.start) found[`${day}.${program}`] = t("hours_end_after_start");
    });
    const [a, b] = EXCLUSIVE.map((program) => programs[program]);
    if (a.on && b.on && a.start && a.end && b.start && b.end && a.start < b.end && b.start < a.end) {
      found[`${day}.clinics`] ??= t("hours_overlap", { other: workTypeLabel(t, "day") });
    }
  });
  return found;
});
const hasProblems = computed(() => Object.keys(problems.value).length > 0);

function message(day, program) {
  return problems.value[`${day}.${program}`] ?? serverErrors.value[`${day}.${program}`];
}

async function save() {
  if (hasProblems.value) return;
  saving.value = true;
  serverErrors.value = {};
  const hours = [];
  Object.entries(cells.value).forEach(([day, programs]) => {
    WORK_TYPES.forEach((program) => {
      const cell = programs[program];
      if (cell.on) hours.push({ program, day: Number(day), start: cell.start, end: cell.end });
    });
  });
  try {
    const { data } = await axios.put("api/program-hours", { hours });
    fill(data.data);
    toast.add({ severity: "success", summary: t("success_message"), detail: t("hours_saved"), life: 2500 });
  } catch (e) {
    // "hours.N.start" -> the cell that line came from.
    const mapped = {};
    Object.entries(e.response?.data?.errors ?? {}).forEach(([field, messages]) => {
      const hour = hours[Number(field.split(".")[1])];
      if (hour) mapped[`${hour.day}.${hour.program}`] = messages[0];
    });
    serverErrors.value = mapped;
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message ?? t("hours_not_saved"), life: 3500 });
  } finally {
    saving.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div>
    <p class="text-xl p-4 text-bp-135c65 font-bold">{{ $t("program_hours") }}</p>
  </div>
  <div class="sawa-card p-3">
    <div v-if="loading" class="flex justify-center p-5"><i class="pi pi-spin pi-spinner text-2xl" /></div>
    <template v-else>
      <Message severity="info" size="small" class="mb-3">{{ $t("hours_rule") }}</Message>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[560px] border-collapse">
          <thead>
            <tr class="bg-[#F4F7F8]">
              <th class="p-2 text-start">{{ $t("hours_day") }}</th>
              <th v-for="program in WORK_TYPES" :key="program" class="p-2 text-start">{{ workTypeLabel(t, program) }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(name, day) in DAYS" :key="name" class="border-b border-[#EEF1F2] align-top">
              <td class="p-2 font-semibold whitespace-nowrap">{{ $t(`weekday.${name}`) }}</td>
              <td v-for="program in WORK_TYPES" :key="program" class="p-2">
                <div class="flex flex-column gap-2">
                  <div class="flex items-center gap-2">
                    <ToggleSwitch v-model="cells[day][program].on" :inputId="`hours-${day}-${program}`" @change="toggle(cells[day][program])" />
                    <label :for="`hours-${day}-${program}`" class="text-sm">{{ cells[day][program].on ? $t("hours_open") : $t("hours_closed") }}</label>
                  </div>
                  <div v-if="cells[day][program].on" class="grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-1">
                    <label :for="`hours-${day}-${program}-from`" class="text-sm text-color-secondary">{{ $t("hours_from") }}</label>
                    <InputText v-model="cells[day][program].start" :id="`hours-${day}-${program}-from`" type="time" class="w-full min-w-[8.5rem]"
                      :invalid="!!message(day, program)" />
                    <label :for="`hours-${day}-${program}-to`" class="text-sm text-color-secondary">{{ $t("hours_to") }}</label>
                    <InputText v-model="cells[day][program].end" :id="`hours-${day}-${program}-to`" type="time" class="w-full min-w-[8.5rem]"
                      :invalid="!!message(day, program)" />
                  </div>
                  <small v-if="message(day, program)" class="text-red-500">{{ message(day, program) }}</small>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="text-center mt-4">
        <Button icon="pi pi-check" :label="$t('submit')" :loading="saving" :disabled="hasProblems" class="w-full lg:w-[40%]" @click="save" />
      </div>
    </template>
    <Toast />
  </div>
  <div v-if="!loading" class="sawa-card p-3 mt-3 flex flex-column gap-3">
    <div class="flex flex-column gap-1">
      <span class="font-semibold text-bp-135c65">{{ $t("sched.default_title") }}</span>
      <small class="text-color-secondary">{{ $t("sched.hint") }} {{ $t("sched.default_hint") }}</small>
    </div>
    <SchedulingCriteria v-model="criteria" />
    <div class="text-center">
      <Button icon="pi pi-check" :label="$t('submit')" :loading="savingCriteria" class="w-full lg:w-[40%]" @click="saveCriteria" />
    </div>
  </div>
</template>
