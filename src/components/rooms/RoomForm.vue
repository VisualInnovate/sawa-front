<script setup>
// Adds or edits a room. The period(s) and the treatments come first: each period then suggests only the therapists
// of that work type who give one of the room's treatments at least, one admin or more per period. Each period may have
// the room's own from–to, which replaces «أوقات البرامج» for this room (empty = those hours); a room used by day and
// clinics together may have them overlap. Rooms no longer get appointments here; saved ones stay untouched.
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { ROOM_PERIODS, workTypeLabel } from "@/utils/employeeWorkTypes";
import AgeRangeField from "@/components/common/AgeRangeField.vue";
import { ROOM_CATEGORIES, SESSIONS_CATEGORY, roomCategoryLabel, savedCategories } from "@/utils/roomCategories";

const props = defineProps({
  roomId: { type: [Number, String], default: null },
});

const { t } = useI18n();
const toast = useToast();
const router = useRouter();

const emptyHours = () => Object.fromEntries(ROOM_PERIODS.map((period) => [period, { start: "", end: "" }]));
const room = ref({ categories: [], periods: [], treatments: [], day_admin_ids: [], clinics_admin_ids: [], period_hours: emptyHours(), age_from_months: null, age_to_months: null });
const programHours = ref([]);
const treatments = ref([]);
const admins = ref({ day: [], clinics: [] });
const loadingAdmins = ref({ day: false, clinics: false });
const savedType = ref(null);
const submitted = ref(false);
const saving = ref(false);
const error = ref({});

const periodOptions = computed(() => ROOM_PERIODS.map((value) => ({ value, label: workTypeLabel(t, value) })));
// «جلسات» goes alone: with it chosen the others are disabled, and with any other chosen it is.
const isSessions = computed(() => room.value.categories.includes(SESSIONS_CATEGORY));
const categoryOptions = computed(() => ROOM_CATEGORIES.map((value) => ({
  value, label: roomCategoryLabel(t, value),
  disabled: room.value.categories.length > 0 && (value === SESSIONS_CATEGORY) !== isSessions.value,
})));
// «فردية وجماعية» is no longer offered; a room saved with it keeps it.
const roomTypes = computed(() => [
  { name: t("typeroom2"), value: 0 },
  { name: t("typeroom1"), value: 1 },
  ...(savedType.value === 2 ? [{ name: t("typeroom3"), value: 2 }] : []),
]);
const hasPeriod = (period) => (room.value.periods ?? []).includes(period);
const ready = computed(() => (room.value.periods ?? []).length > 0 && (room.value.treatments ?? []).length > 0);
// As before: an administrative (only) or individual room has no capacity.
const showCapacity = computed(() => room.value.categories.length > 0 && !(room.value.categories.length === 1 && room.value.categories[0] === "admin")
  && (!isSessions.value || room.value.type != 0));
const adminsKey = (period) => `${period}_admin_ids`;
const adminsValid = computed(() => ROOM_PERIODS.every((period) => !hasPeriod(period) || room.value[adminsKey(period)].length > 0));
// A period's own hours: both ends or neither, the end after the start.
const hoursInvalid = (period) => {
  const { start, end } = room.value.period_hours[period];
  return !!(start || end) && (!start || !end || end <= start);
};
const hoursValid = computed(() => ROOM_PERIODS.every((period) => !hasPeriod(period) || !hoursInvalid(period)));
// The «أوقات البرامج» of a period, as its distinct from–to ranges.
const programHoursText = (period) => [...new Set(programHours.value.filter((row) => row.program === period).map((row) => `${row.start}–${row.end}`))].join("، ");

function adminPlaceholder(period) {
  if (!ready.value) return t("room_admin_pick_period_first");
  return !loadingAdmins.value[period] && !admins.value[period].length ? t("room_admin_none_for_period") : t(`room_admin_${period}_pick`);
}

const requests = { day: 0, clinics: 0 };
async function loadAdmins(period) {
  const current = ++requests[period];
  if (!hasPeriod(period) || !ready.value) {
    admins.value[period] = [];
    // Without treatments yet (rooms saved before them) the chosen admins wait for the list.
    if (!hasPeriod(period)) room.value[adminsKey(period)] = [];
    return;
  }
  loadingAdmins.value[period] = true;
  try {
    const { data } = await axios.get("api/room/admin-options", { params: { period, treatments: room.value.treatments.join(",") } });
    if (current !== requests[period]) return;
    admins.value[period] = data?.data ?? [];
    // An admin who no longer fits the period or the treatments is dropped.
    const ids = admins.value[period].map((admin) => Number(admin.id));
    room.value[adminsKey(period)] = room.value[adminsKey(period)].filter((id) => ids.includes(Number(id)));
  } finally {
    if (current === requests[period]) loadingAdmins.value[period] = false;
  }
}

watch(() => [[...(room.value.periods ?? [])].sort().join(","), [...(room.value.treatments ?? [])].sort().join(",")], () => {
  ROOM_PERIODS.forEach(loadAdmins);
});

onMounted(async () => {
  const [{ data: treatmentData }, { data: hoursData }] = await Promise.all([axios.get("api/treatment/all"), axios.get("api/room/program-hours")]);
  treatments.value = treatmentData.data ?? [];
  programHours.value = hoursData.data ?? [];
  if (!props.roomId) return;
  const { data } = await axios.get(`/api/room/${props.roomId}`);
  const { id, name, admin_id, type, capacity, periods, admins: roomAdmins = [], treatments: roomTreatments = [],
    period_hours: savedHours = null, age_from_months = null, age_to_months = null } = data.data;
  const of = (period) => roomAdmins.filter((admin) => admin.pivot?.period === period).map((admin) => admin.id);
  savedType.value = type;
  room.value = {
    id, name, type, capacity, periods: periods ?? [], age_from_months, age_to_months, categories: savedCategories(data.data),
    treatments: roomTreatments.map((row) => row.id),
    // Rooms saved before admins per period: their one admin.
    ...Object.fromEntries(ROOM_PERIODS.map((period) => [adminsKey(period), of(period).length ? of(period) : (periods?.includes(period) ? [admin_id] : [])])),
    period_hours: Object.fromEntries(ROOM_PERIODS.map((period) => [period, { start: savedHours?.[period]?.start ?? "", end: savedHours?.[period]?.end ?? "" }])),
  };
});

async function save() {
  submitted.value = true;
  if (!ready.value || !adminsValid.value || !hoursValid.value || !room.value.categories.length) return;
  saving.value = true;
  error.value = {};
  try {
    const body = {
      ...room.value,
      capacity: showCapacity.value ? room.value.capacity : undefined,
      ...Object.fromEntries(ROOM_PERIODS.map((period) => [adminsKey(period), hasPeriod(period) ? room.value[adminsKey(period)] : []])),
      period_hours: Object.fromEntries(ROOM_PERIODS.filter((period) => hasPeriod(period) && room.value.period_hours[period].start)
        .map((period) => [period, { ...room.value.period_hours[period] }])),
    };
    if (props.roomId) await axios.put(`/api/room/${props.roomId}`, body);
    else await axios.post("/api/room", body);
    toast.add({ severity: "success", summary: t("success_message"), detail: t("room_saved"), life: 3000 });
    router.push({ name: "Rooms" });
  } catch (e) {
    error.value = e.response?.data?.errors ?? {};
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message ?? t("mission_error"), life: 3000 });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div>
    <p class="text-xl p-4 text-[#135C65] font-bold">{{ $t("room") }}</p>
  </div>
  <div class="sawa-card">
    <form class="p-[2%] bg-[#FDFDFD] grid grid-cols-1 lg:grid-cols-2 gap-4" @submit.prevent="save">
      <div class="flex flex-column gap-2">
        <label for="room-periods">{{ $t("room_periods") }}</label>
        <MultiSelect v-model="room.periods" inputId="room-periods" :options="periodOptions" optionLabel="label"
          optionValue="value" display="chip" :showToggleAll="false" :placeholder="$t('room_periods_pick')"
          :invalid="submitted && !room.periods.length" class="w-full" />
        <small class="text-red-500" v-if="error?.periods">{{ error.periods[0] }}</small>
      </div>
      <div class="flex flex-column gap-2">
        <label for="room-treatments">{{ $t("room_treatments") }}</label>
        <MultiSelect v-model="room.treatments" inputId="room-treatments" :options="treatments" optionLabel="name"
          optionValue="id" display="chip" filter :placeholder="$t('room_treatments_pick')"
          :invalid="submitted && !room.treatments.length" class="w-full" />
        <small class="text-color-secondary">{{ $t("room_treatments_hint") }}</small>
        <small class="text-red-500" v-if="error?.treatments">{{ error.treatments[0] }}</small>
      </div>
      <template v-for="period in ROOM_PERIODS" :key="period">
        <div v-if="hasPeriod(period)" class="flex flex-column gap-2">
          <label :for="`room-admin-${period}`">{{ $t(`room_admin_${period}`) }}</label>
          <MultiSelect v-model="room[adminsKey(period)]" :inputId="`room-admin-${period}`" :options="admins[period]" optionLabel="name"
            optionValue="id" display="chip" filter :disabled="!ready" :loading="loadingAdmins[period]"
            :placeholder="adminPlaceholder(period)" :invalid="submitted && ready && !room[adminsKey(period)].length" class="w-full" />
          <small class="text-red-500" v-if="error?.[adminsKey(period)]">{{ error[adminsKey(period)][0] }}</small>
        </div>
        <!-- The room's own hours in this period; empty = «أوقات البرامج». -->
        <div v-if="hasPeriod(period)" class="flex flex-column gap-2">
          <label :for="`room-hours-${period}-from`">{{ $t("room_hours_label", { period: workTypeLabel(t, period) }) }}</label>
          <div class="flex items-center gap-2">
            <InputText v-model="room.period_hours[period].start" :id="`room-hours-${period}-from`" type="time" class="flex-1 min-w-0 max-w-[9rem]"
              :aria-label="$t('room_hours_from')" :invalid="submitted && hoursInvalid(period)" />
            <span>–</span>
            <InputText v-model="room.period_hours[period].end" :id="`room-hours-${period}-to`" type="time" class="flex-1 min-w-0 max-w-[9rem]"
              :aria-label="$t('room_hours_to')" :invalid="submitted && hoursInvalid(period)" />
            <Button v-if="room.period_hours[period].start || room.period_hours[period].end" type="button" icon="pi pi-times" text rounded
              severity="secondary" size="small" :aria-label="$t('room_hours_clear')" :title="$t('room_hours_clear')"
              @click="room.period_hours[period] = { start: '', end: '' }" />
          </div>
          <small class="text-color-secondary">{{ programHoursText(period)
            ? $t("room_hours_hint", { hours: programHoursText(period) }) : $t("room_hours_hint_none") }}</small>
          <small class="text-red-500" v-if="submitted && hoursInvalid(period)">{{ $t("room_hours_invalid") }}</small>
          <small class="text-red-500" v-else-if="error?.[`period_hours.${period}.end`] || error?.[`period_hours.${period}.start`]">
            {{ (error[`period_hours.${period}.end`] ?? error[`period_hours.${period}.start`])[0] }}</small>
        </div>
      </template>
      <div class="flex flex-column gap-2">
        <label for="room-name">{{ $t("roomnumber") }}</label>
        <InputText id="room-name" required v-model="room.name" :invalid="submitted && !room.name" />
        <small class="text-red-500" v-if="error?.name">{{ error.name[0] }}</small>
      </div>
      <div class="flex flex-column gap-2">
        <label for="room-category">{{ $t("typeroom") }}</label>
        <MultiSelect v-model="room.categories" inputId="room-category" :options="categoryOptions" optionLabel="label"
          optionValue="value" optionDisabled="disabled" display="chip" :showToggleAll="false" :placeholder="$t('room_cat_pick')"
          :invalid="submitted && !room.categories.length" class="w-full" />
        <small class="text-color-secondary">{{ $t("room_cat_hint") }}</small>
        <small class="text-red-500" v-if="error?.categories">{{ error.categories[0] }}</small>
      </div>
      <div v-if="isSessions" class="flex flex-column gap-2">
        <label for="room-type">{{ $t("typeroom") }}</label>
        <Select v-model="room.type" inputId="room-type" :options="roomTypes" optionLabel="name" optionValue="value"
          :invalid="submitted && room.type == null" class="w-full" />
        <small class="text-red-500" v-if="error?.type">{{ error.type[0] }}</small>
      </div>
      <div v-if="showCapacity" class="flex flex-column gap-2">
        <label for="room-capacity">{{ $t("roomsnumber") }}</label>
        <InputNumber v-model="room.capacity" inputId="room-capacity" :invalid="submitted && !room.capacity" />
      </div>
      <!-- The ages the room suits; placing a child outside them only warns. -->
      <div class="lg:col-span-2">
        <AgeRangeField v-model:from="room.age_from_months" v-model:to="room.age_to_months" :label="$t('age_ranges.room_label')" />
        <small class="text-red-500" v-if="error?.age_to_months">{{ error.age_to_months[0] }}</small>
      </div>
      <div class="lg:col-span-2 text-center">
        <Button type="submit" :loading="saving" class="w-full lg:w-[50%]" icon="pi pi-check" :label="$t('submit')" />
      </div>
    </form>
    <Toast />
  </div>
</template>
