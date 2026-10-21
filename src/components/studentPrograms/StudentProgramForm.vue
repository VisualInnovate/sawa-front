<script setup>
// Adds or edits a student program:
// 1. the kind (دمج / نهاري (الصفوف) / عيادات), the student, a therapist of that kind and the dates;
// 2. day / clinics: the weekly quota split into individual rows (one treatment each) and group sessions (no
//    treatment), the days; «توزيع» spreads it, places every session in a room and prices it; counts per day and
//    rooms can change;
// 3. inclusion: supervision or inclusion (+ English), the student's from–to each day, a therapist free all that time.
// Nothing is saved until «حفظ»; the backend checks everything again.
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { WORK_TYPES, workTypeLabel } from "@/utils/employeeWorkTypes";
import { GROUP_KINDS, dayLabel, isoDate, sessionKindLabel, timeRange } from "@/utils/studentPrograms";
import WeekTimetable from "./WeekTimetable.vue";
import ProgramPrice from "./ProgramPrice.vue";

function endOfYear(date) {
  return new Date(new Date(date).getFullYear(), 11, 31);
}

const props = defineProps({
  programId: { type: [Number, String], default: null },
});
const { t } = useI18n();
const toast = useToast();
const router = useRouter();

const children = ref([]);
const treatments = ref([]);
const programHours = ref([]);
const therapists = ref([]);
const loading = ref(true);

const form = ref({
  // The end date starts at the end of the year; it follows the start date's year until changed by hand.
  child_id: null, kind: null, therapist_id: null, start_date: null, end_date: endOfYear(new Date()),
  weekly_sessions: null, individual_rows: [], group_sessions: 0, days: [],
  inclusion_type: "inclusion", inclusion_english: false, hours: {},
});
const endTouched = ref(!!props.programId);
watch(() => form.value.start_date, (start) => {
  if (start && !endTouched.value) form.value.end_date = endOfYear(start);
});
const preview = ref(null);
const plan = ref(null);
const errors = ref({});
const busy = ref(false);
const saving = ref(false);

const kinds = computed(() => WORK_TYPES.map((value) => ({ value, label: workTypeLabel(t, value) })));
const treatmentNames = computed(() => Object.fromEntries(treatments.value.map((row) => [row.id, row.name])));
const hoursOf = (kind) => programHours.value.filter((row) => row.program === kind);
const openDays = computed(() => hoursOf(form.value.kind).map((row) => row.day));
const isInclusion = computed(() => form.value.kind === "inclusion");
const inclusionTypes = computed(() => [
  { value: "supervision", label: t("sp_inclusion_supervision") },
  { value: "inclusion", label: t("sp_inclusion_program") },
]);

const remaining = computed(() => (form.value.weekly_sessions ?? 0) - (form.value.group_sessions ?? 0)
  - form.value.individual_rows.reduce((sum, row) => sum + (row.sessions ?? 0), 0));
// One row per treatment: a treatment already in another row is not offered again.
const treatmentOptions = (row) => treatments.value.filter((treatment) => treatment.id === row.treatment_id
  || !form.value.individual_rows.some((other) => other.treatment_id === treatment.id));

const basicsReady = computed(() => form.value.child_id && form.value.kind && form.value.therapist_id && form.value.start_date && form.value.end_date);
const quotaReady = computed(() => form.value.weekly_sessions > 0 && remaining.value === 0 && form.value.days.length > 0
  && form.value.individual_rows.every((row) => row.treatment_id && row.sessions > 0));
const inclusionHours = computed(() => Object.entries(form.value.hours).filter(([, row]) => row.on)
  .map(([day, row]) => ({ day: Number(day), start: row.start, end: row.end })));
const inclusionReady = computed(() => inclusionHours.value.length > 0 && inclusionHours.value.every((row) => row.start && row.end && row.end > row.start));

function body(extra = {}) {
  const base = {
    child_id: form.value.child_id, kind: form.value.kind, therapist_id: form.value.therapist_id,
    start_date: isoDate(form.value.start_date), end_date: isoDate(form.value.end_date),
    program_id: props.programId ?? undefined,
  };
  if (isInclusion.value) {
    return { ...base, inclusion_type: form.value.inclusion_type, inclusion_english: form.value.inclusion_type === "inclusion" && form.value.inclusion_english, hours: inclusionHours.value };
  }
  return {
    ...base, weekly_sessions: form.value.weekly_sessions, days: [...form.value.days].sort(),
    individual_rows: form.value.individual_rows, group_sessions: form.value.group_sessions ?? 0, ...extra,
  };
}

function fail(e) {
  errors.value = e.response?.data?.errors ?? {};
  const first = Object.values(errors.value)[0]?.[0];
  toast.add({ severity: "error", summary: t("error"), detail: first ?? e.response?.data?.message ?? t("sp_not_saved"), life: 4000 });
}

async function runPreview(extra = {}) {
  busy.value = true;
  errors.value = {};
  try {
    const { data } = await axios.post("api/student-program/preview", body(extra));
    preview.value = data.data;
    plan.value = data.data.plan ? JSON.parse(JSON.stringify(data.data.plan)) : null;
  } catch (e) {
    preview.value = null;
    fail(e);
  } finally {
    busy.value = false;
  }
}

// «توزيع»: a fresh even spread; a changed per-day count keeps the plan; a moved room keeps the slots.
const distribute = () => runPreview();
const applyPlan = () => runPreview({ plan: plan.value });
const keepSlots = (slots) => runPreview({ plan: preview.value.plan, slots });

async function loadTherapists() {
  if (!form.value.kind) return;
  const payload = { kind: form.value.kind, program_id: props.programId ?? undefined };
  if (isInclusion.value && inclusionReady.value && form.value.start_date && form.value.end_date) {
    Object.assign(payload, { child_id: form.value.child_id, start_date: isoDate(form.value.start_date), end_date: isoDate(form.value.end_date), hours: inclusionHours.value });
  }
  const { data } = await axios.post("api/student-program/therapists", payload);
  therapists.value = data.data;
}

const therapistOptions = computed(() => therapists.value.map((row) => ({
  ...row,
  label: row.available === false
    ? `${row.name} — ${row.available_from ? t("sp_free_from", { date: row.available_from }) : t("sp_not_free")}`
    : row.name,
  disabled: row.available === false,
})));

function defaultHours() {
  form.value.hours = Object.fromEntries(hoursOf("inclusion").map((row) => [row.day, { on: true, start: row.start, end: row.end }]));
}

watch(() => form.value.kind, (kind, old) => {
  if (loading.value || !kind) return;
  if (old) form.value.therapist_id = null;
  preview.value = null;
  form.value.days = [...openDays.value];
  if (kind === "inclusion") defaultHours();
  loadTherapists();
});

let timer = null;
watch(() => [JSON.stringify(inclusionHours.value), isoDate(form.value.start_date), isoDate(form.value.end_date), form.value.child_id], () => {
  if (loading.value || !isInclusion.value) return;
  clearTimeout(timer);
  timer = setTimeout(loadTherapists, 400);
});

// Inclusion previews itself; day / clinics wait for «توزيع».
watch(() => [JSON.stringify(body()), basicsReady.value], () => {
  if (loading.value || !isInclusion.value || !basicsReady.value || !inclusionReady.value) return;
  clearTimeout(timer);
  timer = setTimeout(() => runPreview(), 500);
});
// Changing the quota or the days makes the shown distribution stale.
watch(() => JSON.stringify([form.value.weekly_sessions, form.value.individual_rows, form.value.group_sessions, form.value.days, form.value.therapist_id, isoDate(form.value.start_date), isoDate(form.value.end_date)]), () => {
  if (!loading.value && !isInclusion.value) preview.value = null;
});

const addIndividualRow = () => form.value.individual_rows.push({ treatment_id: null, sessions: Math.max(remaining.value, 1) });
const restAsGroup = () => { form.value.group_sessions = (form.value.group_sessions ?? 0) + remaining.value; };
// A row or a session's treatment, or «جماعي» for group sessions (they have none).
const rowLabel = (row) => (row.session_kind === "individual" ? treatmentNames.value[row.treatment_id] ?? row.treatment_name : sessionKindLabel(t, "group"));

// Per-day counts the user may change: rows × days.
const planRows = computed(() => preview.value?.rows ?? []);
const planDays = computed(() => [...form.value.days].sort());
function rowTotal(key) {
  return planDays.value.reduce((sum, day) => sum + (Number(plan.value?.[day]?.[key]) || 0), 0);
}
function setCount(day, key, value) {
  plan.value[day] ??= {};
  plan.value[day][key] = value ?? 0;
}
const planChanged = computed(() => JSON.stringify(plan.value) !== JSON.stringify(preview.value?.plan));
const planValid = computed(() => planRows.value.every((row) => rowTotal(row.key) === row.sessions));

// Moving one session to another room.
const roomDialog = ref(null);
const roomOptions = ref([]);
async function openRooms(index) {
  const slot = preview.value.slots[index];
  roomDialog.value = { index, slot };
  roomOptions.value = [];
  const { data } = await axios.post("api/student-program/room-options", {
    ...body(), day: slot.day, start: slot.start, session_kind: slot.session_kind, treatment_id: slot.treatment_id ?? undefined,
    slot_therapist_id: slot.therapist_id ?? form.value.therapist_id,
  });
  roomOptions.value = data.data;
}
function chooseRoom(option) {
  const slots = preview.value.slots.map((slot, i) => (i === roomDialog.value.index ? { ...slot, room_id: option.room_id, therapist_id: option.therapist_id } : slot));
  roomDialog.value = null;
  keepSlots(slots);
}

async function save() {
  saving.value = true;
  const payload = isInclusion.value ? body() : body({ plan: preview.value.plan, slots: preview.value.slots });
  try {
    const { data } = props.programId
      ? await axios.put(`api/student-program/${props.programId}`, payload)
      : await axios.post("api/student-program", payload);
    toast.add({ severity: "success", summary: t("success_message"), detail: t("sp_saved"), life: 2500 });
    router.push({ name: "show-studentprograme", params: { id: data.data.id } });
  } catch (e) {
    fail(e);
  } finally {
    saving.value = false;
  }
}

// Editing: the saved program back into the form, then its current week checked again.
async function loadProgram() {
  const { data } = await axios.get(`api/student-program/${props.programId}`);
  const program = data.data;
  const details = program.student_program_details ?? [];

  Object.assign(form.value, {
    child_id: program.student_id, kind: program.kind, therapist_id: program.therapist_id,
    start_date: new Date(program.start_date), end_date: new Date(program.end_date),
    weekly_sessions: program.weekly_sessions,
    individual_rows: details.filter((row) => row.session_kind === "individual")
      .map((row) => ({ treatment_id: row.treatment_id, sessions: row.sessions })),
    // Saved «جماعي وفردي» rows count as group (that kind is gone).
    group_sessions: details.filter((row) => GROUP_KINDS.includes(row.session_kind)).reduce((sum, row) => sum + row.sessions, 0),
    days: program.days ?? [],
    inclusion_type: program.inclusion_type ?? "inclusion", inclusion_english: !!program.inclusion_english,
  });
  if (program.kind === "inclusion") {
    form.value.hours = Object.fromEntries((program.inclusion_hours ?? []).map((row) => [row.day, { on: true, start: row.start, end: row.end }]));
    hoursOf("inclusion").forEach((row) => { form.value.hours[row.day] ??= { on: false, start: row.start, end: row.end }; });
  }
  return program;
}

function planFromWeek(week) {
  // Rows: "i0", "i1"… in the form's order, then "group"; each saved slot goes to the first row with room left.
  const rows = form.value.individual_rows.map((row, i) => ({ key: `i${i}`, session_kind: "individual", treatment_id: row.treatment_id, left: row.sessions }));
  if (form.value.group_sessions > 0) rows.push({ key: "group", session_kind: "group", treatment_id: null, left: form.value.group_sessions });
  const result = {};
  week.forEach((slot) => {
    const row = rows.find((candidate) => candidate.left > 0 && candidate.session_kind === slot.session_kind
      && (slot.session_kind === "group" || candidate.treatment_id === slot.treatment_id));
    if (!row) return;
    row.left--;
    result[slot.day] ??= {};
    result[slot.day][row.key] = (result[slot.day][row.key] ?? 0) + 1;
  });
  return result;
}

onMounted(async () => {
  const [childRes, treatmentRes, hoursRes] = await Promise.all([
    axios.get("api/child"), axios.get("api/treatment/all"), axios.get("api/student-program/hours"),
  ]);
  children.value = childRes.data.children ?? [];
  treatments.value = treatmentRes.data.data ?? [];
  programHours.value = hoursRes.data.data ?? [];
  if (props.programId) {
    const program = await loadProgram();
    loading.value = false;
    await loadTherapists();
    if (program.kind === "inclusion") {
      await runPreview();
    } else {
      // Saved «جماعي وفردي» sessions come back as group ones without a treatment (their room may need changing).
      const week = (program.week ?? []).map((slot) => {
        const group = GROUP_KINDS.includes(slot.session_kind);
        return { day: slot.day, start: slot.start, session_kind: group ? "group" : slot.session_kind, treatment_id: group ? null : slot.treatment_id,
          room_id: slot.room_id, therapist_id: slot.therapist_id };
      });
      await runPreview({ plan: planFromWeek(week), slots: week });
    }
  } else {
    loading.value = false;
  }
});

function slotStatus(slot) {
  if (slot.available) return null;
  if (slot.reason === "no_room") return t("sp_no_room");
  if (slot.reason === "room_not_suitable") return t("sp_room_not_suitable");
  return slot.available_from ? t("sp_no_vacancy_from", { date: slot.available_from }) : t("sp_no_vacancy");
}
</script>

<template>
  <div>
    <p class="text-xl p-4 text-[#135C65] font-bold">{{ programId ? $t("sp_edit_title") : $t("sp_add_title") }}</p>
  </div>
  <div v-if="loading" class="flex justify-center p-5"><i class="pi pi-spin pi-spinner text-2xl" /></div>
  <div v-else class="flex flex-column gap-3">
    <!-- 1. Kind, student, therapist, dates -->
    <div class="sawa-card p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="flex flex-column gap-2 lg:col-span-2">
        <label>{{ $t("sp_kind") }}</label>
        <SelectButton v-model="form.kind" :options="kinds" optionLabel="label" optionValue="value" :allowEmpty="false" :disabled="!!programId" />
      </div>
      <div class="flex flex-column gap-2">
        <label for="sp-child">{{ $t("sp_student") }}</label>
        <Select v-model="form.child_id" inputId="sp-child" :options="children" optionLabel="name" optionValue="id" filter :disabled="!!programId"
          :invalid="!!errors.child_id" />
      </div>
      <div class="flex flex-column gap-2">
        <label for="sp-therapist">{{ $t("sp_therapist") }}</label>
        <Select v-model="form.therapist_id" inputId="sp-therapist" :options="therapistOptions" optionLabel="label" optionValue="id"
          optionDisabled="disabled" filter :disabled="!form.kind" :placeholder="form.kind ? $t('sp_pick_therapist') : $t('sp_pick_kind_first')"
          :invalid="!!errors.therapist_id" />
        <small v-if="isInclusion" class="text-color-secondary">{{ $t("sp_inclusion_therapist_hint") }}</small>
      </div>
      <div class="flex flex-column gap-2">
        <label for="sp-start">{{ $t("sp_start_date") }}</label>
        <DatePicker v-model="form.start_date" inputId="sp-start" dateFormat="yy-mm-dd" showIcon :invalid="!!errors.start_date" />
      </div>
      <div class="flex flex-column gap-2">
        <label for="sp-end">{{ $t("sp_end_date") }}</label>
        <DatePicker v-model="form.end_date" inputId="sp-end" dateFormat="yy-mm-dd" showIcon :minDate="form.start_date" :invalid="!!errors.end_date"
          @update:modelValue="endTouched = true" />
      </div>
    </div>

    <!-- 2a. Day / clinics: the weekly quota -->
    <div v-if="form.kind && !isInclusion" class="sawa-card p-4 flex flex-column gap-4">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div class="flex flex-column gap-2">
          <label for="sp-weekly">{{ $t("sp_weekly_sessions") }}</label>
          <InputNumber v-model="form.weekly_sessions" inputId="sp-weekly" :min="1" :max="100" :invalid="!!errors.weekly_sessions" />
          <small class="text-color-secondary">{{ $t("sp_session_hour") }}</small>
        </div>
        <div class="flex flex-column gap-2">
          <label for="sp-group-sessions">{{ $t("sp_group_sessions") }}</label>
          <InputNumber v-model="form.group_sessions" inputId="sp-group-sessions" :min="0" />
          <small class="text-color-secondary">{{ $t("sp_group_hint") }}</small>
        </div>
        <div class="flex flex-column gap-2 justify-center">
          <Tag :severity="remaining === 0 ? 'success' : remaining > 0 ? 'warn' : 'danger'"
            :value="remaining === 0 ? $t('sp_all_assigned') : remaining > 0 ? $t('sp_waiting_treatment', { count: remaining }) : $t('sp_over_quota', { count: -remaining })" />
          <Button v-if="remaining > 0" icon="pi pi-users" :label="$t('sp_rest_as_group')" variant="text" size="small" class="w-fit" @click="restAsGroup" />
        </div>
      </div>

      <div class="flex flex-column gap-2">
        <span class="font-semibold">{{ $t("sp_individual_sessions") }}</span>
        <small class="text-color-secondary">{{ $t("sp_individual_hint") }}</small>
        <div v-for="(row, index) in form.individual_rows" :key="index" class="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-2 items-end">
          <div class="flex flex-column gap-1">
            <label :for="`sp-individual-treatment-${index}`" class="text-sm">{{ $t("sp_treatment") }}</label>
            <Select v-model="row.treatment_id" :inputId="`sp-individual-treatment-${index}`" :options="treatmentOptions(row)" optionLabel="name" optionValue="id" filter
              :invalid="!row.treatment_id" />
          </div>
          <div class="flex flex-column gap-1">
            <label :for="`sp-individual-sessions-${index}`" class="text-sm">{{ $t("fees_sessions") }}</label>
            <InputNumber v-model="row.sessions" :inputId="`sp-individual-sessions-${index}`" :min="1" />
          </div>
          <Button icon="pi pi-trash" severity="danger" variant="outlined" v-tooltip.top="$t('delete')" :aria-label="$t('delete')" @click="form.individual_rows.splice(index, 1)" />
        </div>
        <Button icon="pi pi-plus" :label="$t('sp_add_individual_row')" variant="outlined" class="w-fit" :disabled="remaining <= 0" @click="addIndividualRow" />
      </div>

      <div class="flex flex-column gap-2">
        <span class="font-semibold">{{ $t("sp_days") }}</span>
        <div class="flex flex-wrap gap-3">
          <div v-for="day in openDays" :key="day" class="flex items-center gap-2">
            <Checkbox v-model="form.days" :inputId="`sp-day-${day}`" :value="day" />
            <label :for="`sp-day-${day}`">{{ dayLabel(t, day) }}
              <span class="text-xs text-color-secondary">({{ timeRange(hoursOf(form.kind).find((row) => row.day === day)?.start, hoursOf(form.kind).find((row) => row.day === day)?.end) }})</span>
            </label>
          </div>
        </div>
        <small v-if="!openDays.length" class="text-red-500">{{ $t("sp_no_hours") }}</small>
      </div>

      <Button icon="pi pi-th-large" :label="$t('sp_distribute')" :loading="busy" :disabled="!basicsReady || !quotaReady" class="w-full lg:w-[40%] m-auto" @click="distribute" />
    </div>

    <!-- 2b. Inclusion -->
    <div v-if="isInclusion" class="sawa-card p-4 flex flex-column gap-4">
      <div class="flex flex-wrap items-end gap-4">
        <div class="flex flex-column gap-2">
          <label>{{ $t("sp_inclusion_type") }}</label>
          <SelectButton v-model="form.inclusion_type" :options="inclusionTypes" optionLabel="label" optionValue="value" :allowEmpty="false" />
        </div>
        <div v-if="form.inclusion_type === 'inclusion'" class="flex items-center gap-2 pb-2">
          <Checkbox v-model="form.inclusion_english" inputId="sp-english" binary />
          <label for="sp-english">{{ $t("sp_english") }}</label>
        </div>
      </div>
      <div class="flex flex-column gap-2">
        <span class="font-semibold">{{ $t("sp_student_times") }}</span>
        <div v-for="(row, day) in form.hours" :key="day" class="flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-2 w-[9rem]">
            <Checkbox v-model="row.on" :inputId="`sp-inc-${day}`" binary />
            <label :for="`sp-inc-${day}`">{{ dayLabel(t, Number(day)) }}</label>
          </div>
          <template v-if="row.on">
            <label :for="`sp-inc-${day}-from`" class="text-sm text-color-secondary">{{ $t("hours_from") }}</label>
            <InputText v-model="row.start" :id="`sp-inc-${day}-from`" type="time" class="w-[8.5rem]" />
            <label :for="`sp-inc-${day}-to`" class="text-sm text-color-secondary">{{ $t("hours_to") }}</label>
            <InputText v-model="row.end" :id="`sp-inc-${day}-to`" type="time" class="w-[8.5rem]" :invalid="row.end <= row.start" />
          </template>
        </div>
        <small class="text-color-secondary">{{ $t("sp_inclusion_rule") }}</small>
      </div>
    </div>

    <!-- 3. Per-day counts (day / clinics) -->
    <div v-if="preview && !isInclusion && planRows.length" class="sawa-card p-4 flex flex-column gap-3">
      <span class="font-semibold">{{ $t("sp_plan_title") }}</span>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr class="bg-[#F4F7F8]">
              <th class="p-2 text-start">{{ $t("sp_treatment") }}</th>
              <th v-for="day in planDays" :key="day" class="p-2 text-start">{{ dayLabel(t, day) }}</th>
              <th class="p-2 text-start">{{ $t("fees_total") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in planRows" :key="row.key" class="border-b border-[#EEF1F2]">
              <td class="p-2">{{ rowLabel(row) }} <span v-if="row.session_kind === 'individual'" class="text-xs text-color-secondary">({{ sessionKindLabel(t, row.session_kind) }})</span></td>
              <td v-for="day in planDays" :key="day" class="p-1">
                <InputNumber :modelValue="plan?.[day]?.[row.key] ?? 0" :min="0" :max="10" inputClass="w-[4rem]"
                  :aria-label="`${rowLabel(row)} ${dayLabel(t, day)}`" @update:modelValue="setCount(day, row.key, $event)" />
              </td>
              <td class="p-2" :class="rowTotal(row.key) === row.sessions ? '' : 'text-red-500 font-semibold'">{{ rowTotal(row.key) }} / {{ row.sessions }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex flex-wrap gap-2">
        <Button icon="pi pi-refresh" :label="$t('sp_apply_plan')" :disabled="!planChanged || !planValid" :loading="busy" @click="applyPlan" />
        <small v-if="!planValid" class="text-red-500 self-center">{{ $t("sp_plan_invalid") }}</small>
      </div>
    </div>

    <!-- 4. The week, rooms and price -->
    <div v-if="preview" class="sawa-card p-4 flex flex-column gap-4">
      <span class="font-semibold">{{ $t("sp_week_title") }}</span>
      <WeekTimetable :slots="preview.slots.filter((slot) => slot.start)" :treatments="treatmentNames" />

      <DataTable v-if="!isInclusion" :value="preview.slots" size="small">
        <Column :header="$t('hours_day')">
          <template #body="{ data }">{{ dayLabel(t, data.day) }}</template>
        </Column>
        <Column :header="$t('sp_hour')">
          <template #body="{ data }">{{ data.start ? timeRange(data.start, data.end) : "—" }}</template>
        </Column>
        <Column :header="$t('sp_treatment')">
          <template #body="{ data }">{{ rowLabel(data) }} <span v-if="data.session_kind === 'individual'" class="text-xs text-color-secondary">({{ sessionKindLabel(t, data.session_kind) }})</span></template>
        </Column>
        <Column :header="$t('sp_room')">
          <template #body="{ data }">{{ data.room_name ?? "—" }}</template>
        </Column>
        <Column :header="$t('sp_therapist')">
          <template #body="{ data }">{{ data.therapist_name ?? "—" }}</template>
        </Column>
        <Column :header="$t('sp_status')">
          <template #body="{ data }">
            <Tag v-if="data.available" severity="success" :value="$t('sp_available')" />
            <Tag v-else severity="danger" :value="slotStatus(data)" />
          </template>
        </Column>
        <Column header-style="width:9rem">
          <template #body="{ data, index }">
            <Button v-if="data.start" icon="pi pi-arrow-right-arrow-left" size="small" variant="outlined" :label="$t('sp_change_room')" @click="openRooms(index)" />
          </template>
        </Column>
      </DataTable>

      <div v-if="isInclusion" class="flex flex-column gap-1">
        <div v-for="slot in preview.slots" :key="slot.day" class="flex flex-wrap items-center gap-2 text-sm">
          <span class="font-semibold w-[6rem]">{{ dayLabel(t, slot.day) }}</span>
          <span>{{ $t("sp_therapist_taken", { range: timeRange(slot.start, slot.end) }) }}</span>
          <Tag v-if="slot.available" severity="success" :value="$t('sp_available')" />
          <Tag v-else severity="danger" :value="slotStatus(slot)" />
        </div>
      </div>

      <div>
        <span class="font-semibold">{{ $t("sp_price") }}</span>
        <ProgramPrice :price="preview.price" />
      </div>

      <Message v-if="!preview.complete" severity="warn" size="small">{{ $t("sp_incomplete") }}</Message>
      <Button icon="pi pi-check" :label="$t('sp_save')" :loading="saving" :disabled="!preview.complete || busy" class="w-full lg:w-[40%] m-auto" @click="save" />
    </div>

    <Dialog :visible="!!roomDialog" modal :header="$t('sp_change_room')" :style="{ width: '36rem' }" :breakpoints="{ '640px': '94vw' }" @update:visible="roomDialog = null">
      <p v-if="roomDialog" class="text-sm text-color-secondary mb-3">
        {{ dayLabel(t, roomDialog.slot.day) }} {{ timeRange(roomDialog.slot.start, roomDialog.slot.end) }} — {{ rowLabel(roomDialog.slot) }}
      </p>
      <div v-if="!roomOptions.length" class="text-color-secondary">{{ $t("sp_no_rooms") }}</div>
      <div v-for="option in roomOptions" :key="`${option.room_id}-${option.therapist_id}`" class="flex flex-wrap items-center justify-between gap-2 border-b border-[#EEF1F2] py-2">
        <div class="flex flex-column">
          <span class="font-semibold">{{ $t("sp_room") }} {{ option.room_name }} — {{ option.therapist_name }}
            <span class="text-xs text-color-secondary">({{ option.room_type === 1 ? $t("typeroom1") : $t("typeroom2") }})</span></span>
          <span class="text-xs text-color-secondary">{{ $t(`sp_source_${option.source}`) }}</span>
        </div>
        <div class="flex items-center gap-2">
          <Tag v-if="option.available" severity="success" :value="$t('sp_available')" />
          <Tag v-else severity="danger" :value="option.available_from ? $t('sp_no_vacancy_from', { date: option.available_from }) : $t('sp_no_vacancy')" />
          <Button size="small" :label="$t('sp_choose')" :disabled="!option.available || (option.room_id === roomDialog?.slot.room_id && option.therapist_id === roomDialog?.slot.therapist_id)" @click="chooseRoom(option)" />
        </div>
      </div>
    </Dialog>
    <Toast />
  </div>
</template>
