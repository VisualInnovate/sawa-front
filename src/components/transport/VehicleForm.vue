<script setup>
// A bus: its driver, its «مشرف باص» (every trip of the bus is his unless a trip names another), plate, dates and seats.
import axios from "axios";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { VEHICLE_TYPES, vehicleTypeKey, isoDate, dateOf, fieldErrors } from "@/utils/transport";

const props = defineProps({ id: { type: [String, Number], default: null } });
const { t } = useI18n();
const toast = useToast();
const router = useRouter();

const form = ref({ driver_id: null, supervisor_id: null, type: null, plate_number: "", insurance_exp_date: null, insurance_company: "", license_exp_date: null, seats: null });
const drivers = ref([]);
const supervisors = ref([]);
const errors = ref({});
const saving = ref(false);
const types = VEHICLE_TYPES.map((value) => ({ value, name: t(vehicleTypeKey(value)) }));

onMounted(async () => {
  const [driverList, supervisorList] = await Promise.all([axios.get("api/driver"), axios.get("api/bus-supervisors")]);
  drivers.value = driverList.data.driver ?? [];
  supervisors.value = supervisorList.data.data ?? [];
  if (props.id) {
    const { data } = await axios.get(`api/vehicle/${props.id}`);
    const v = data.data;
    form.value = { driver_id: v.driver_id, supervisor_id: v.supervisor_id, type: v.type, plate_number: String(v.plate_number ?? ""),
      insurance_exp_date: dateOf(v.insurance_exp_date), insurance_company: v.insurance_company ?? "", license_exp_date: dateOf(v.license_exp_date), seats: v.seats };
  }
});

async function save() {
  saving.value = true;
  errors.value = {};
  const body = { ...form.value, insurance_exp_date: isoDate(form.value.insurance_exp_date), license_exp_date: isoDate(form.value.license_exp_date) };
  try {
    if (props.id) await axios.put(`/api/vehicle/${props.id}`, body);
    else await axios.post("/api/vehicle", body);
    toast.add({ severity: "success", summary: t("success_message"), detail: t(props.id ? "element_update_success" : "element_add_success"), life: 3000 });
    router.push({ name: "transportation" });
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
    <p class="text-xl p-4 text-bp-135c65 cursor-pointer font-bold" @click="router.push({ name: 'transportation' })">{{ $t("veciles") }}</p>
    <div class="sawa-card">
      <form class="p-3 grid grid-cols-1 lg:grid-cols-2 gap-4" @submit.prevent="save">
        <div class="flex flex-column gap-2">
          <label for="v-driver">{{ $t("driver_name") }}</label>
          <Select inputId="v-driver" v-model="form.driver_id" :options="drivers" optionValue="id" optionLabel="name" filter showClear :placeholder="$t('driver_name')" :invalid="!!errors.driver_id" />
          <small v-if="errors.driver_id" class="text-red-500">{{ errors.driver_id[0] }}</small>
        </div>
        <div class="flex flex-column gap-2">
          <label for="v-supervisor">{{ $t("tr.supervisor") }}</label>
          <Select inputId="v-supervisor" v-model="form.supervisor_id" :options="supervisors" optionValue="id" optionLabel="name" filter showClear :placeholder="$t('tr.supervisor')" :invalid="!!errors.supervisor_id" />
          <small class="text-color-secondary">{{ supervisors.length ? $t("tr.supervisor_hint") : $t("tr.no_supervisors") }}</small>
        </div>
        <div class="flex flex-column gap-2">
          <label for="v-type">{{ $t("vecile_type") }}</label>
          <Select inputId="v-type" v-model="form.type" :options="types" optionValue="value" optionLabel="name" :placeholder="$t('vecile_type')" :invalid="!!errors.type" />
          <small v-if="errors.type" class="text-red-500">{{ errors.type[0] }}</small>
        </div>
        <div class="flex flex-column gap-2">
          <label for="v-plate">{{ $t("Vehicle_ID") }}</label>
          <InputText id="v-plate" v-model.trim="form.plate_number" dir="ltr" maxlength="30" :placeholder="$t('Vehicle_ID')" :invalid="!!errors.plate_number" />
          <small v-if="errors.plate_number" class="text-red-500">{{ errors.plate_number[0] }}</small>
        </div>
        <div class="flex flex-column gap-2">
          <label for="v-insurance">{{ $t("Insurance_date") }}</label>
          <DatePicker inputId="v-insurance" v-model="form.insurance_exp_date" dateFormat="yy-mm-dd" showIcon showButtonBar :invalid="!!errors.insurance_exp_date" />
          <small v-if="errors.insurance_exp_date" class="text-red-500">{{ errors.insurance_exp_date[0] }}</small>
        </div>
        <div class="flex flex-column gap-2">
          <label for="v-company">{{ $t("insurance_company") }}</label>
          <InputText id="v-company" v-model="form.insurance_company" :placeholder="$t('insurance_company')" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="v-license">{{ $t("License_expiration") }}</label>
          <DatePicker inputId="v-license" v-model="form.license_exp_date" dateFormat="yy-mm-dd" showIcon showButtonBar :invalid="!!errors.license_exp_date" />
          <small v-if="errors.license_exp_date" class="text-red-500">{{ errors.license_exp_date[0] }}</small>
        </div>
        <div class="flex flex-column gap-2">
          <label for="v-seats">{{ $t("seats_number") }}</label>
          <InputNumber inputId="v-seats" v-model="form.seats" :min="1" :max="100" :invalid="!!errors.seats" />
          <small v-if="errors.seats" class="text-red-500">{{ errors.seats[0] }}</small>
        </div>
        <div class="lg:col-span-2">
          <Button type="submit" class="w-full" :loading="saving" :label="$t('submit')" />
        </div>
      </form>
    </div>
  </div>
</template>
