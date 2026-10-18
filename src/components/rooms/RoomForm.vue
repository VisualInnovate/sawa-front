<script setup>
// Adds or edits a room. The period comes first: the admin list then shows only the therapists whose work type
// matches it (day (classes) / clinics (evening)). Rooms no longer get appointments here; saved ones stay untouched.
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

const room = ref({ periods: [] });
const admins = ref([]);
const loadingAdmins = ref(false);
const submitted = ref(false);
const saving = ref(false);
const error = ref({});

const periodOptions = computed(() => ROOM_PERIODS.map((value) => ({ value, label: workTypeLabel(t, value) })));
const categories = computed(() => [
  { name: t("Administrative"), value: 0 },
  { name: t("social"), value: 1 },
  { name: t("Consultation_evaluation"), value: 2 },
]);
const roomTypes = computed(() => [
  { name: t("typeroom2"), value: 0 },
  { name: t("typeroom1"), value: 1 },
  { name: t("typeroom3"), value: 2 },
]);
const hasPeriod = computed(() => (room.value.periods ?? []).length > 0);
// As before: an administrative or individual room has no capacity.
const showCapacity = computed(() => room.value.type_tow != null && room.value.type_tow != 0 && room.value.type != 0);
const adminPlaceholder = computed(() => {
  if (!hasPeriod.value) return t("room_admin_pick_period_first");
  return !loadingAdmins.value && !admins.value.length ? t("room_admin_none_for_period") : t("roomdoctor");
});

let request = 0;
async function loadAdmins() {
  const current = ++request;
  if (!hasPeriod.value) {
    admins.value = [];
    room.value.admin_id = null;
    return;
  }
  loadingAdmins.value = true;
  try {
    const { data } = await axios.get("api/room/admin-options", { params: { periods: room.value.periods.join(",") } });
    if (current !== request) return;
    admins.value = data?.data ?? [];
    // An admin who does not work in the new period is dropped.
    if (!admins.value.some((admin) => Number(admin.id) === Number(room.value.admin_id))) room.value.admin_id = null;
  } finally {
    if (current === request) loadingAdmins.value = false;
  }
}

watch(() => [...(room.value.periods ?? [])].sort().join(","), loadAdmins);

onMounted(async () => {
  if (!props.roomId) return;
  const { data } = await axios.get(`/api/room/${props.roomId}`);
  const { id, name, admin_id, type, type_tow, capacity, periods } = data.data;
  room.value = { id, name, admin_id, type, type_tow, capacity, periods: periods ?? [] };
});

async function save() {
  submitted.value = true;
  if (!hasPeriod.value || !room.value.admin_id) return;
  saving.value = true;
  error.value = {};
  try {
    const body = { ...room.value, capacity: showCapacity.value ? room.value.capacity : undefined };
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
          :invalid="submitted && !hasPeriod" class="w-full" />
        <small class="text-red-500" v-if="error?.periods">{{ error.periods[0] }}</small>
      </div>
      <div class="flex flex-column gap-2">
        <label for="room-admin">{{ $t("roomdoctor") }}</label>
        <Select v-model="room.admin_id" inputId="room-admin" :options="admins" optionLabel="name" optionValue="id" filter
          :disabled="!hasPeriod" :loading="loadingAdmins" :placeholder="adminPlaceholder"
          :invalid="submitted && hasPeriod && !room.admin_id" class="w-full" />
        <small class="text-red-500" v-if="error?.admin_id">{{ error.admin_id[0] }}</small>
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
