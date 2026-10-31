<script setup>
// One trip on one date (an extra one; the usual days come from «الرحلات الأسبوعية»): bus, route, direction, times,
// seats, driver and its supervisor (empty: the bus's).
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { DIRECTIONS, isoDate, dateOf, hm, fieldErrors } from "@/utils/transport";

const props = defineProps({ id: { type: [String, Number], default: null } });
const { t } = useI18n();
const toast = useToast();
const router = useRouter();

const form = ref({ vehicle_id: null, student_transportation_id: null, direction: "to_academy", date: new Date(), from: "07:00", to: "08:00",
  available_seats: null, driver_id: null, supervisor_id: null, is_active: true });
const vehicles = ref([]);
const routes = ref([]);
const drivers = ref([]);
const supervisors = ref([]);
const errors = ref({});
const saving = ref(false);
const directions = computed(() => DIRECTIONS.map((value) => ({ value, name: t(`tr.dir.${value}`) })));
const routeLabel = (route) => `${route.region?.name ?? ""} — ${t("tr.children_count", { n: (route.child ?? []).length })}`;
const bus = computed(() => vehicles.value.find((vehicle) => vehicle.id === form.value.vehicle_id));

onMounted(async () => {
  const [vehicleList, routeList, driverList, supervisorList] = await Promise.all([axios.get("api/vehicle"), axios.get("api/student-transportation"),
    axios.get("api/driver"), axios.get("api/bus-supervisors")]);
  vehicles.value = vehicleList.data.data ?? [];
  routes.value = (routeList.data.data ?? []).map((route) => ({ ...route, label: routeLabel(route) }));
  drivers.value = driverList.data.driver ?? [];
  supervisors.value = supervisorList.data.data ?? [];
  if (props.id) {
    const { data } = await axios.get(`api/transportation-schedule/${props.id}`);
    const s = data.data;
    form.value = { vehicle_id: s.vehicle_id, student_transportation_id: s.student_transportation_id, direction: s.direction ?? "to_academy",
      date: dateOf(s.date), from: hm(s.from), to: hm(s.to), available_seats: s.available_seats, driver_id: s.driver_id,
      supervisor_id: s.supervisor_id, is_active: Number(s.is_active) === 1 };
  }
});

// A new trip takes the bus's seats and driver.
function busPicked() {
  if (!bus.value) return;
  if (form.value.available_seats == null) form.value.available_seats = bus.value.seats;
  if (!form.value.driver_id) form.value.driver_id = bus.value.driver_id;
}

async function save() {
  saving.value = true;
  errors.value = {};
  const body = { ...form.value, date: isoDate(form.value.date), is_active: form.value.is_active ? 1 : 0 };
  try {
    if (props.id) await axios.post(`/api/transportation-schedule/${props.id}`, body);
    else await axios.post("/api/transportation-schedule", body);
    toast.add({ severity: "success", summary: t("success_message"), detail: t(props.id ? "element_update_success" : "element_add_success"), life: 3000 });
    router.push({ name: "transportation-schedule" });
  } catch (error) {
    errors.value = fieldErrors(error);
    toast.add({ severity: "error", summary: t("error"), detail: error?.response?.data?.message, life: 4000 });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div>
    <p class="text-xl p-4 text-bp-135c65 cursor-pointer font-bold" @click="router.push({ name: 'transportation-schedule' })">{{ $t("transportation_schedule") }}</p>
    <div class="sawa-card">
      <form class="p-3 grid grid-cols-1 lg:grid-cols-2 gap-4" @submit.prevent="save">
        <div class="flex flex-column gap-2">
          <label for="t-route">{{ $t("student_tans") }}</label>
          <Select inputId="t-route" v-model="form.student_transportation_id" :options="routes" optionValue="id" optionLabel="label" filter :placeholder="$t('student_tans')" :invalid="!!errors.student_transportation_id" />
          <small v-if="errors.student_transportation_id" class="text-red-500">{{ errors.student_transportation_id[0] }}</small>
        </div>
        <div class="flex flex-column gap-2">
          <label for="t-direction">{{ $t("tr.direction") }}</label>
          <SelectButton id="t-direction" v-model="form.direction" :options="directions" optionValue="value" optionLabel="name" :allowEmpty="false" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="t-bus">{{ $t("tr.bus") }}</label>
          <Select inputId="t-bus" v-model="form.vehicle_id" :options="vehicles" optionValue="id" optionLabel="plate_number" filter :placeholder="$t('tr.bus')" :invalid="!!errors.vehicle_id" @change="busPicked" />
          <small v-if="errors.vehicle_id" class="text-red-500">{{ errors.vehicle_id[0] }}</small>
        </div>
        <div class="flex flex-column gap-2">
          <label for="t-date">{{ $t("tr.date") }}</label>
          <DatePicker inputId="t-date" v-model="form.date" dateFormat="yy-mm-dd" showIcon showButtonBar :invalid="!!errors.date" />
          <small v-if="errors.date" class="text-red-500">{{ errors.date[0] }}</small>
        </div>
        <div class="flex flex-column gap-2">
          <label for="t-from">{{ $t("tr.from") }}</label>
          <InputText id="t-from" v-model="form.from" type="time" :invalid="!!errors.from" />
          <small v-if="errors.from" class="text-red-500">{{ errors.from[0] }}</small>
        </div>
        <div class="flex flex-column gap-2">
          <label for="t-to">{{ $t("tr.to") }}</label>
          <InputText id="t-to" v-model="form.to" type="time" :invalid="!!errors.to" />
          <small v-if="errors.to" class="text-red-500">{{ errors.to[0] }}</small>
        </div>
        <div class="flex flex-column gap-2">
          <label for="t-seats">{{ $t("seats_number") }}</label>
          <InputNumber inputId="t-seats" v-model="form.available_seats" :min="0" :max="bus?.seats ?? 100" :invalid="!!errors.available_seats" />
          <small :class="errors.available_seats ? 'text-red-500' : 'text-color-secondary'">{{ errors.available_seats?.[0] ?? (bus ? $t("tr.bus_seats", { n: bus.seats }) : "") }}</small>
        </div>
        <div class="flex flex-column gap-2">
          <label for="t-driver">{{ $t("driver_name") }}</label>
          <Select inputId="t-driver" v-model="form.driver_id" :options="drivers" optionValue="id" optionLabel="name" filter showClear :placeholder="$t('driver_name')" :invalid="!!errors.driver_id" />
          <small v-if="errors.driver_id" class="text-red-500">{{ errors.driver_id[0] }}</small>
        </div>
        <div class="flex flex-column gap-2">
          <label for="t-supervisor">{{ $t("tr.supervisor") }}</label>
          <Select inputId="t-supervisor" v-model="form.supervisor_id" :options="supervisors" optionValue="id" optionLabel="name" filter showClear :placeholder="bus?.supervisor?.name ? $t('tr.bus_supervisor', { name: bus.supervisor.name }) : $t('tr.supervisor')" />
          <small class="text-color-secondary">{{ $t("tr.trip_supervisor_hint") }}</small>
        </div>
        <div class="flex align-items-center gap-2">
          <ToggleSwitch inputId="t-active" v-model="form.is_active" />
          <label for="t-active">{{ $t("tr.active") }}</label>
        </div>
        <div class="lg:col-span-2">
          <Button type="submit" class="w-full" :loading="saving" :label="$t('submit')" />
        </div>
      </form>
    </div>
  </div>
</template>
