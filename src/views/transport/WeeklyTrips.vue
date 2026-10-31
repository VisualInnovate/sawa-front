<script setup>
// «الرحلات الأسبوعية»: each route's bus and times on fixed week days. Every day's trips are made from them (not on an
// official holiday); an extra trip on one date is added in «جدول النقل».
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { DIRECTIONS, WEEK_DAYS, isoDate, dateOf, hm, fieldErrors } from "@/utils/transport";

const { t } = useI18n();
const toast = useToast();

const rows = ref([]);
const loading = ref(true);
const vehicles = ref([]);
const routes = ref([]);
const drivers = ref([]);
const supervisors = ref([]);
const dialog = ref(false);
const form = ref({});
const errors = ref({});
const saving = ref(false);
const removing = ref(null);

const directions = computed(() => DIRECTIONS.map((value) => ({ value, name: t(`tr.dir.${value}`) })));
const days = computed(() => WEEK_DAYS.map((value) => ({ value, name: t(`tr.day.${value}`) })));
const dayNames = (list) => ((list ?? []).length === 7 ? t("tr.every_day") : [...(list ?? [])].sort().map((day) => t(`tr.day.${day}`)).join("، "));

async function load() {
  loading.value = true;
  try {
    rows.value = (await axios.get("api/transport-weekly-trips")).data.data ?? [];
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  load();
  const [vehicleList, routeList, driverList, supervisorList] = await Promise.all([axios.get("api/vehicle"), axios.get("api/student-transportation"),
    axios.get("api/driver"), axios.get("api/bus-supervisors")]);
  vehicles.value = vehicleList.data.data ?? [];
  routes.value = (routeList.data.data ?? []).map((route) => ({ ...route, label: `${route.region?.name ?? ""} — ${t("tr.children_count", { n: (route.child ?? []).length })}` }));
  drivers.value = driverList.data.driver ?? [];
  supervisors.value = supervisorList.data.data ?? [];
});

function open(row = null) {
  errors.value = {};
  form.value = row
    ? { id: row.id, student_transportation_id: row.student_transportation_id, vehicle_id: row.vehicle_id, driver_id: row.driver_id, supervisor_id: row.supervisor_id,
        direction: row.direction, days: [...(row.days ?? [])], from: hm(row.from), to: hm(row.to), starts_on: dateOf(row.starts_on), ends_on: dateOf(row.ends_on), is_active: !!row.is_active }
    : { student_transportation_id: null, vehicle_id: null, driver_id: null, supervisor_id: null, direction: "to_academy", days: [0, 1, 2, 3, 4],
        from: "07:00", to: "08:00", starts_on: new Date(), ends_on: null, is_active: true };
  dialog.value = true;
}

async function save() {
  saving.value = true;
  errors.value = {};
  const { id, ...rest } = form.value;
  const body = { ...rest, starts_on: isoDate(rest.starts_on), ends_on: isoDate(rest.ends_on) };
  try {
    if (id) await axios.put(`api/transport-weekly-trips/${id}`, body);
    else await axios.post("api/transport-weekly-trips", body);
    dialog.value = false;
    toast.add({ severity: "success", summary: t("success_message"), detail: t(id ? "element_update_success" : "element_add_success"), life: 3000 });
    load();
  } catch (error) {
    errors.value = fieldErrors(error);
    toast.add({ severity: "error", summary: t("error"), detail: error?.response?.data?.message, life: 4000 });
  } finally {
    saving.value = false;
  }
}

async function remove() {
  await axios.delete(`api/transport-weekly-trips/${removing.value.id}`);
  removing.value = null;
  load();
}
</script>

<template>
  <div class="sawa-card p-3">
    <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
      <div>
        <h1 class="text-xl text-bp-135c65 font-bold m-0">{{ $t("tr.weekly_title") }}</h1>
        <p class="text-sm text-color-secondary m-0">{{ $t("tr.weekly_lead") }}</p>
      </div>
      <Button v-can="'transportation schedule create'" icon="pi pi-plus" :label="$t('tr.weekly_add')" @click="open()" />
    </div>

    <DataTable :value="rows" :loading="loading" dataKey="id" responsiveLayout="scroll" stripedRows>
      <template #empty>{{ $t("tr.weekly_empty") }}</template>
      <Column :header="$t('student_tans')"><template #body="{ data }">{{ data.student_transportation?.region?.name ?? "—" }}</template></Column>
      <Column :header="$t('tr.direction')"><template #body="{ data }">{{ $t(`tr.dir.${data.direction}`) }}</template></Column>
      <Column :header="$t('tr.days')"><template #body="{ data }">{{ dayNames(data.days) }}</template></Column>
      <Column :header="$t('tr.time')"><template #body="{ data }"><span dir="ltr">{{ hm(data.from) }} – {{ hm(data.to) }}</span></template></Column>
      <Column :header="$t('tr.bus')"><template #body="{ data }"><span dir="ltr">{{ data.vehicle?.plate_number }}</span></template></Column>
      <Column :header="$t('tr.supervisor')"><template #body="{ data }">{{ data.supervisor?.name ?? data.vehicle?.supervisor?.name ?? "—" }}</template></Column>
      <Column :header="$t('tr.period')">
        <template #body="{ data }"><span dir="ltr">{{ String(data.starts_on).slice(0, 10) }}</span> → <span dir="ltr">{{ data.ends_on ? String(data.ends_on).slice(0, 10) : $t("tr.open_ended") }}</span></template>
      </Column>
      <Column :header="$t('status')">
        <template #body="{ data }"><Tag :severity="data.is_active ? 'success' : 'secondary'" :value="$t(data.is_active ? 'active' : 'inactive')" /></template>
      </Column>
      <Column header-style="min-width:7rem;">
        <template #body="{ data }">
          <div class="table-actions">
            <Button v-can="'transportation schedule edit'" icon="pi pi-pencil" rounded variant="outlined" severity="info" :aria-label="$t('edit')" v-tooltip.top="$t('edit')" @click="open(data)" />
            <Button v-can="'transportation schedule delete'" icon="pi pi-trash" rounded variant="outlined" severity="danger" :aria-label="$t('delete')" v-tooltip.top="$t('delete')" @click="removing = data" />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialog" modal :header="form.id ? $t('edit') : $t('tr.weekly_add')" :style="{ width: '42rem', maxWidth: '95vw' }">
      <form class="grid grid-cols-1 md:grid-cols-2 gap-3" @submit.prevent="save">
        <div class="flex flex-column gap-2 md:col-span-2">
          <label for="w-route">{{ $t("student_tans") }}</label>
          <Select inputId="w-route" v-model="form.student_transportation_id" :options="routes" optionValue="id" optionLabel="label" filter :invalid="!!errors.student_transportation_id" />
          <small v-if="errors.student_transportation_id" class="text-red-500">{{ errors.student_transportation_id[0] }}</small>
        </div>
        <div class="flex flex-column gap-2 md:col-span-2">
          <label for="w-direction">{{ $t("tr.direction") }}</label>
          <SelectButton id="w-direction" v-model="form.direction" :options="directions" optionValue="value" optionLabel="name" :allowEmpty="false" />
        </div>
        <div class="flex flex-column gap-2 md:col-span-2">
          <label for="w-days">{{ $t("tr.days") }}</label>
          <SelectButton id="w-days" v-model="form.days" :options="days" optionValue="value" optionLabel="name" multiple class="flex-wrap" />
          <small v-if="errors.days" class="text-red-500">{{ errors.days[0] }}</small>
        </div>
        <div class="flex flex-column gap-2">
          <label for="w-from">{{ $t("tr.from") }}</label>
          <InputText id="w-from" v-model="form.from" type="time" :invalid="!!errors.from" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="w-to">{{ $t("tr.to") }}</label>
          <InputText id="w-to" v-model="form.to" type="time" :invalid="!!errors.to" />
          <small v-if="errors.to" class="text-red-500">{{ errors.to[0] }}</small>
        </div>
        <div class="flex flex-column gap-2">
          <label for="w-bus">{{ $t("tr.bus") }}</label>
          <Select inputId="w-bus" v-model="form.vehicle_id" :options="vehicles" optionValue="id" optionLabel="plate_number" filter :invalid="!!errors.vehicle_id" />
          <small v-if="errors.vehicle_id" class="text-red-500">{{ errors.vehicle_id[0] }}</small>
        </div>
        <div class="flex flex-column gap-2">
          <label for="w-driver">{{ $t("driver_name") }}</label>
          <Select inputId="w-driver" v-model="form.driver_id" :options="drivers" optionValue="id" optionLabel="name" filter showClear :placeholder="$t('tr.bus_driver')" :invalid="!!errors.driver_id" />
          <small v-if="errors.driver_id" class="text-red-500">{{ errors.driver_id[0] }}</small>
        </div>
        <div class="flex flex-column gap-2 md:col-span-2">
          <label for="w-supervisor">{{ $t("tr.supervisor") }}</label>
          <Select inputId="w-supervisor" v-model="form.supervisor_id" :options="supervisors" optionValue="id" optionLabel="name" filter showClear :placeholder="$t('tr.bus_supervisor_default')" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="w-start">{{ $t("tr.starts_on") }}</label>
          <DatePicker inputId="w-start" v-model="form.starts_on" dateFormat="yy-mm-dd" showIcon :invalid="!!errors.starts_on" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="w-end">{{ $t("tr.ends_on") }}</label>
          <DatePicker inputId="w-end" v-model="form.ends_on" dateFormat="yy-mm-dd" showIcon showButtonBar :placeholder="$t('tr.open_ended')" :invalid="!!errors.ends_on" />
          <small v-if="errors.ends_on" class="text-red-500">{{ errors.ends_on[0] }}</small>
        </div>
        <div class="flex align-items-center gap-2 md:col-span-2">
          <ToggleSwitch inputId="w-active" v-model="form.is_active" />
          <label for="w-active">{{ $t("tr.active") }}</label>
        </div>
        <div class="md:col-span-2 flex justify-end gap-2">
          <Button type="button" variant="text" severity="secondary" :label="$t('cancel')" @click="dialog = false" />
          <Button type="submit" :loading="saving" :label="$t('submit')" />
        </div>
      </form>
    </Dialog>

    <Dialog :visible="!!removing" modal :header="$t('delete')" :style="{ width: '28rem', maxWidth: '95vw' }" @update:visible="removing = null">
      <p class="m-0">{{ $t("tr.weekly_delete") }}</p>
      <template #footer>
        <Button variant="text" severity="secondary" :label="$t('no')" @click="removing = null" />
        <Button severity="danger" :label="$t('yes')" @click="remove" />
      </template>
    </Dialog>
  </div>
</template>
