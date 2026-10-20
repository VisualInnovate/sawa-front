<script setup>
// Adds or edits a room. The period(s) and the treatments come first: each period then suggests only the therapists
// of that work type who give every one of the room's treatments. Day (classes) has one admin, clinics (evening)
// one or more. Rooms no longer get appointments here; saved ones stay untouched.
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { ROOM_PERIODS, workTypeLabel } from "@/utils/employeeWorkTypes";

const props = defineProps({
  roomId: { type: [Number, String], default: null },
});

const { t } = useI18n();
const toast = useToast();
const router = useRouter();

const room = ref({ periods: [], treatments: [], day_admin_id: null, clinics_admin_ids: [] });
const treatments = ref([]);
const admins = ref({ day: [], clinics: [] });
const loadingAdmins = ref({ day: false, clinics: false });
const savedType = ref(null);
const submitted = ref(false);
const saving = ref(false);
const error = ref({});

const periodOptions = computed(() => ROOM_PERIODS.map((value) => ({ value, label: workTypeLabel(t, value) })));
const categories = computed(() => [
  { name: t("Administrative"), value: 0 },
  { name: t("social"), value: 1 },
  { name: t("Consultation_evaluation"), value: 2 },
]);
// «فردية وجماعية» is no longer offered; a room saved with it keeps it.
const roomTypes = computed(() => [
  { name: t("typeroom2"), value: 0 },
  { name: t("typeroom1"), value: 1 },
  ...(savedType.value === 2 ? [{ name: t("typeroom3"), value: 2 }] : []),
]);
const hasPeriod = (period) => (room.value.periods ?? []).includes(period);
const ready = computed(() => (room.value.periods ?? []).length > 0 && (room.value.treatments ?? []).length > 0);
// As before: an administrative or individual room has no capacity.
const showCapacity = computed(() => room.value.type_tow != null && room.value.type_tow != 0 && room.value.type != 0);
const adminsValid = computed(() => (!hasPeriod("day") || !!room.value.day_admin_id)
  && (!hasPeriod("clinics") || room.value.clinics_admin_ids.length > 0));

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
    if (!hasPeriod(period) && period === "day") room.value.day_admin_id = null;
    if (!hasPeriod(period) && period === "clinics") room.value.clinics_admin_ids = [];
    return;
  }
  loadingAdmins.value[period] = true;
  try {
    const { data } = await axios.get("api/room/admin-options", { params: { period, treatments: room.value.treatments.join(",") } });
    if (current !== requests[period]) return;
    admins.value[period] = data?.data ?? [];
    // An admin who no longer fits the period or the treatments is dropped.
    const ids = admins.value[period].map((admin) => Number(admin.id));
    if (period === "day" && !ids.includes(Number(room.value.day_admin_id))) room.value.day_admin_id = null;
    if (period === "clinics") room.value.clinics_admin_ids = room.value.clinics_admin_ids.filter((id) => ids.includes(Number(id)));
  } finally {
    if (current === requests[period]) loadingAdmins.value[period] = false;
  }
}

watch(() => [[...(room.value.periods ?? [])].sort().join(","), [...(room.value.treatments ?? [])].sort().join(",")], () => {
  ROOM_PERIODS.forEach(loadAdmins);
});

onMounted(async () => {
  const { data: treatmentData } = await axios.get("api/treatment/all");
  treatments.value = treatmentData.data ?? [];
  if (!props.roomId) return;
  const { data } = await axios.get(`/api/room/${props.roomId}`);
  const { id, name, admin_id, type, type_tow, capacity, periods, admins: roomAdmins = [], treatments: roomTreatments = [] } = data.data;
  const of = (period) => roomAdmins.filter((admin) => admin.pivot?.period === period).map((admin) => admin.id);
  savedType.value = type;
  room.value = {
    id, name, type, type_tow, capacity, periods: periods ?? [],
    treatments: roomTreatments.map((row) => row.id),
    // Rooms saved before admins per period: their one admin.
    day_admin_id: of("day")[0] ?? (periods?.includes("day") ? admin_id : null),
    clinics_admin_ids: of("clinics").length ? of("clinics") : (periods?.includes("clinics") ? [admin_id] : []),
  };
});

async function save() {
  submitted.value = true;
  if (!ready.value || !adminsValid.value) return;
  saving.value = true;
  error.value = {};
  try {
    const body = {
      ...room.value,
      capacity: showCapacity.value ? room.value.capacity : undefined,
      day_admin_id: hasPeriod("day") ? room.value.day_admin_id : null,
      clinics_admin_ids: hasPeriod("clinics") ? room.value.clinics_admin_ids : [],
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
      <div v-if="hasPeriod('day')" class="flex flex-column gap-2">
        <label for="room-admin-day">{{ $t("room_admin_day") }}</label>
        <Select v-model="room.day_admin_id" inputId="room-admin-day" :options="admins.day" optionLabel="name" optionValue="id"
          filter :disabled="!ready" :loading="loadingAdmins.day" :placeholder="adminPlaceholder('day')"
          :invalid="submitted && ready && !room.day_admin_id" class="w-full" />
        <small class="text-red-500" v-if="error?.day_admin_id">{{ error.day_admin_id[0] }}</small>
      </div>
      <div v-if="hasPeriod('clinics')" class="flex flex-column gap-2">
        <label for="room-admin-clinics">{{ $t("room_admin_clinics") }}</label>
        <MultiSelect v-model="room.clinics_admin_ids" inputId="room-admin-clinics" :options="admins.clinics" optionLabel="name"
          optionValue="id" display="chip" filter :disabled="!ready" :loading="loadingAdmins.clinics"
          :placeholder="adminPlaceholder('clinics')" :invalid="submitted && ready && !room.clinics_admin_ids.length" class="w-full" />
        <small class="text-red-500" v-if="error?.clinics_admin_ids">{{ error.clinics_admin_ids[0] }}</small>
      </div>
      <div class="flex flex-column gap-2">
        <label for="room-name">{{ $t("roomnumber") }}</label>
        <InputText id="room-name" required v-model="room.name" :invalid="submitted && !room.name" />
        <small class="text-red-500" v-if="error?.name">{{ error.name[0] }}</small>
      </div>
      <div class="flex flex-column gap-2">
        <label for="room-category">{{ $t("typeroom") }}</label>
        <Select v-model="room.type_tow" inputId="room-category" :options="categories" optionLabel="name"
          optionValue="value" :invalid="submitted && room.type_tow == null" class="w-full" />
      </div>
      <div v-if="room.type_tow == 2" class="flex flex-column gap-2">
        <label for="room-type">{{ $t("typeroom") }}</label>
        <Select v-model="room.type" inputId="room-type" :options="roomTypes" optionLabel="name" optionValue="value"
          :invalid="submitted && room.type == null" class="w-full" />
        <small class="text-red-500" v-if="error?.type">{{ error.type[0] }}</small>
      </div>
      <div v-if="showCapacity" class="flex flex-column gap-2">
        <label for="room-capacity">{{ $t("roomsnumber") }}</label>
        <InputNumber v-model="room.capacity" inputId="room-capacity" :invalid="submitted && !room.capacity" />
      </div>
      <div class="lg:col-span-2 text-center">
        <Button type="submit" :loading="saving" class="w-full lg:w-[50%]" icon="pi pi-check" :label="$t('submit')" />
      </div>
    </form>
    <Toast />
  </div>
</template>
