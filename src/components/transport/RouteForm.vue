<script setup>
// A transport route: its children, region, vehicle kind, one or both ways, monthly price (added to the children's
// programs in «المحاسبة») and the pick-up location.
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { VEHICLE_TYPES, TRIP_TYPES, vehicleTypeKey, tripTypeKey, fieldErrors } from "@/utils/transport";

const props = defineProps({ id: { type: [String, Number], default: null } });
const { t } = useI18n();
const toast = useToast();
const router = useRouter();

const form = ref({ child_ids: [], region_id: null, type: null, trip_type: null, price: null, location_url: "" });
const children = ref([]);
const regions = ref([]);
const errors = ref({});
const saving = ref(false);
const types = computed(() => VEHICLE_TYPES.map((value) => ({ value, name: t(vehicleTypeKey(value)) })));
const tripTypes = computed(() => TRIP_TYPES.map((value) => ({ value, name: t(tripTypeKey(value)) })));

onMounted(async () => {
  const [childList, regionList] = await Promise.all([axios.get("api/child"), axios.get("api/region")]);
  children.value = childList.data.children ?? [];
  regions.value = regionList.data.data ?? [];
  if (props.id) {
    const { data } = await axios.get(`api/student-transportation/${props.id}`);
    const r = data.data;
    form.value = { child_ids: (r.child ?? []).map((child) => child.id), region_id: r.region_id, type: r.type, trip_type: r.trip_type,
      price: Number(r.price), location_url: r.location_url ?? "" };
  }
});

async function save() {
  saving.value = true;
  errors.value = {};
  try {
    if (props.id) await axios.post(`/api/student-transportation/${props.id}`, form.value);
    else await axios.post("/api/student-transportation", form.value);
    toast.add({ severity: "success", summary: t("success_message"), detail: t(props.id ? "element_update_success" : "element_add_success"), life: 3000 });
    router.push({ name: "student-transportation" });
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
    <p class="text-xl p-4 text-bp-135c65 cursor-pointer font-bold" @click="router.push({ name: 'student-transportation' })">{{ $t("student_tans") }}</p>
    <div class="sawa-card">
      <form class="p-3 grid grid-cols-1 lg:grid-cols-2 gap-4" @submit.prevent="save">
        <div class="flex flex-column gap-2 lg:col-span-2">
          <label for="r-children">{{ $t("child_name") }}</label>
          <MultiSelect inputId="r-children" v-model="form.child_ids" :options="children" optionValue="id" optionLabel="name" filter display="chip" :placeholder="$t('child_name')" :invalid="!!errors.child_ids" />
          <small class="text-color-secondary">{{ $t("tr.children_hint") }}</small>
        </div>
        <div class="flex flex-column gap-2">
          <label for="r-region">{{ $t("area_name") }}</label>
          <Select inputId="r-region" v-model="form.region_id" :options="regions" optionValue="id" optionLabel="name" filter :placeholder="$t('area_name')" :invalid="!!errors.region_id" />
          <small v-if="errors.region_id" class="text-red-500">{{ errors.region_id[0] }}</small>
        </div>
        <div class="flex flex-column gap-2">
          <label for="r-type">{{ $t("vecile_type") }}</label>
          <Select inputId="r-type" v-model="form.type" :options="types" optionValue="value" optionLabel="name" :placeholder="$t('vecile_type')" :invalid="!!errors.type" />
          <small v-if="errors.type" class="text-red-500">{{ errors.type[0] }}</small>
        </div>
        <div class="flex flex-column gap-2">
          <label for="r-trip">{{ $t("trip_type") }}</label>
          <Select inputId="r-trip" v-model="form.trip_type" :options="tripTypes" optionValue="value" optionLabel="name" :placeholder="$t('trip_type')" :invalid="!!errors.trip_type" />
          <small v-if="errors.trip_type" class="text-red-500">{{ errors.trip_type[0] }}</small>
        </div>
        <div class="flex flex-column gap-2">
          <label for="r-price">{{ $t("tr.monthly_price") }}</label>
          <InputNumber inputId="r-price" v-model="form.price" :min="0" :maxFractionDigits="2" :invalid="!!errors.price" />
          <small :class="errors.price ? 'text-red-500' : 'text-color-secondary'">{{ errors.price?.[0] ?? $t("tr.price_hint") }}</small>
        </div>
        <div class="flex flex-column gap-2 lg:col-span-2">
          <label for="r-location">{{ $t("student_location") }}</label>
          <InputText id="r-location" v-model.trim="form.location_url" dir="ltr" :placeholder="$t('student_location')" :invalid="!!errors.location_url" />
          <small v-if="errors.location_url" class="text-red-500">{{ errors.location_url[0] }}</small>
        </div>
        <div class="lg:col-span-2">
          <Button type="submit" class="w-full" :loading="saving" :label="$t('submit')" />
        </div>
      </form>
    </div>
  </div>
</template>
