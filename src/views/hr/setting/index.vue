<script setup>
// «إعدادات الموارد البشرية»: the labour system (Saudi or Jordanian, its own permission), the rules of that system
// (attendance, overtime, recruitment), the company location and the HR lists.
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { GoogleMap, Marker, Circle } from "vue3-google-map";
import { mapPoint } from "@/utils/mapPoint";
import { errorText, loadCurrency } from "@/utils/accounting";
import { can } from "@/utils/permissions";
import HrLookups from "@/components/hr/HrLookups.vue";

const { t, locale } = useI18n();
const toast = useToast();

const settings = ref(null);
const form = ref(null);
const tab = ref("system");
const saving = ref(false);
const switchTo = ref(null);

const canEdit = computed(() => can("hr settings edit"));
const canCountry = computed(() => can("hr country edit"));
const canLists = computed(() => can("hr lists list", "hr lists create", "hr lists edit"));
const ar = computed(() => locale.value === "ar");

async function load() {
  const { data } = await axios.get("api/settings");
  settings.value = data.data;
  form.value = {
    rules: JSON.parse(JSON.stringify(data.data.rules)),
    company_lat: data.data.company_lat,
    company_long: data.data.company_long,
  };
}

async function save() {
  saving.value = true;
  try {
    await axios.put("api/settings", form.value);
    toast.add({ severity: "success", summary: t("success_message"), detail: t("hrset.saved"), life: 2500 });
    await load();
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  } finally {
    saving.value = false;
  }
}

async function switchCountry() {
  saving.value = true;
  try {
    await axios.put("api/settings/country", { country: switchTo.value });
    switchTo.value = null;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("hrset.switched"), life: 3000 });
    await load();
    await loadCurrency(true);
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  } finally {
    saving.value = false;
  }
}

function pickLocation(event) {
  if (!canEdit.value) return;
  form.value.company_lat = Number(event.latLng.lat().toFixed(7));
  form.value.company_long = Number(event.latLng.lng().toFixed(7));
}

// The values that differ from the system's defaults, so HR sees what it changed.
const changed = (group, key) => settings.value && form.value.rules[group][key] !== settings.value.defaults[group][key];
const reset = (group, key) => (form.value.rules[group][key] = settings.value.defaults[group][key]);

const profileRows = computed(() => {
  if (!settings.value) return [];
  return Object.values(settings.value.profiles).map((p) => ({
    ...p,
    // Codes and numbers stay left-to-right inside the Arabic lines.
    lines: [
      { label: t("hrset.currency"), value: `${p.currency_name} (${p.currency_symbol})` },
      { label: t("hrset.phone_code"), value: p.phone_code, ltr: true },
      { label: t("hrset.iban"), value: t("hrset.iban_value", { prefix: p.iban_prefix, n: p.iban_length }) },
      { label: null, value: p.national_address ? t("hrset.with_national_address") : t("hrset.no_national_address") },
    ],
  }));
});

onMounted(load);
</script>

<template>
  <div>
    <p class="text-xl p-4 text-bp-135c65 font-bold m-0">{{ $t("hrset.title") }}</p>
    <Toast />
    <div v-if="!settings" class="flex justify-center p-5"><i class="pi pi-spin pi-spinner text-2xl" /></div>

    <Tabs v-else v-model:value="tab">
      <TabList>
        <Tab value="system">{{ $t("hrset.system") }}</Tab>
        <Tab value="attendance">{{ $t("hrset.attendance") }}</Tab>
        <Tab value="overtime">{{ $t("hrset.overtime") }}</Tab>
        <Tab value="recruitment">{{ $t("hrset.recruitment") }}</Tab>
        <Tab value="employees">{{ $t("hrset.employees") }}</Tab>
        <Tab value="leaves">{{ $t("hrset.leaves") }}</Tab>
        <Tab value="payroll">{{ $t("hrset.payroll") }}</Tab>
        <Tab v-if="canLists" value="lists">{{ $t("hrset.lists") }}</Tab>
      </TabList>
      <TabPanels>
        <!-- Labour system -->
        <TabPanel value="system">
          <p class="text-color-secondary mt-0">{{ $t("hrset.system_hint") }}</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div v-for="p in profileRows" :key="p.code" class="sawa-card p-4 flex flex-column gap-2"
              :class="p.code === settings.country ? 'border-2 border-primary' : ''">
              <div class="flex items-center justify-between gap-2">
                <span class="text-lg font-bold">{{ ar ? p.name_ar : p.name_en }}</span>
                <Tag v-if="p.code === settings.country" severity="success" :value="$t('hrset.current')" />
              </div>
              <ul class="m-0 ps-4 flex flex-column gap-1 text-color-secondary">
                <li v-for="line in p.lines" :key="line.value">
                  <template v-if="line.label">{{ line.label }}: </template>
                  <bdi :dir="line.ltr ? 'ltr' : undefined">{{ line.value }}</bdi>
                </li>
              </ul>
              <Button v-if="p.code !== settings.country" :disabled="!canCountry" icon="pi pi-sync"
                :label="$t('hrset.switch_to', { name: ar ? p.name_ar : p.name_en })" class="self-start" @click="switchTo = p.code" />
            </div>
          </div>
          <small v-if="!canCountry" class="text-color-secondary block mt-2">{{ $t("hrset.no_country_permission") }}</small>
        </TabPanel>

        <!-- Attendance -->
        <TabPanel value="attendance">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div class="sawa-card p-4 flex flex-column gap-4">
              <div v-for="key in ['grace_minutes', 'early_clock_in_minutes']" :key="key" class="flex flex-column gap-1">
                <label :for="`att-${key}`" class="font-semibold">{{ $t(`hrset.${key}`) }}</label>
                <div class="flex items-center gap-2">
                  <InputNumber v-model="form.rules.attendance[key]" :inputId="`att-${key}`" :min="0" :max="240" showButtons :disabled="!canEdit"
                    :suffix="` ${$t('hrset.minutes')}`" class="w-12rem" />
                  <Button v-if="changed('attendance', key)" icon="pi pi-undo" text rounded :aria-label="$t('hrset.reset')" v-tooltip.top="$t('hrset.reset')"
                    :disabled="!canEdit" @click="reset('attendance', key)" />
                </div>
                <small class="text-color-secondary">{{ $t(`hrset.${key}_hint`) }}</small>
              </div>
              <div class="flex flex-column gap-1">
                <label for="att-radius" class="font-semibold">{{ $t("hrset.location_radius_meters") }}</label>
                <InputNumber v-model="form.rules.attendance.location_radius_meters" inputId="att-radius" :min="0" :max="100000" :step="50" showButtons
                  :disabled="!canEdit" :suffix="` ${$t('hrset.meters')}`" class="w-12rem self-start" />
                <small class="text-color-secondary">{{ $t("hrset.location_radius_hint") }}</small>
                <Message v-if="form.rules.attendance.location_radius_meters > 0 && !form.company_lat" severity="warn" size="small">
                  {{ $t("hrset.pick_location_first") }}
                </Message>
              </div>
              <Divider class="my-0" />
              <div class="flex flex-column gap-1">
                <label for="att-absent-after" class="font-semibold">{{ $t("hrset.absent_after_minutes") }}</label>
                <InputNumber v-model="form.rules.attendance.absent_after_minutes" inputId="att-absent-after" :min="0" :max="600" :step="15" showButtons
                  :disabled="!canEdit" :suffix="` ${$t('hrset.minutes')}`" class="w-12rem self-start" />
                <small class="text-color-secondary">{{ $t("hrset.absent_after_minutes_hint") }}</small>
              </div>
              <div class="flex flex-column gap-1">
                <label for="att-absence-days" class="font-semibold">{{ $t("hrset.absence_deduction_days") }}</label>
                <InputNumber v-model="form.rules.attendance.absence_deduction_days" inputId="att-absence-days" :min="0" :max="3" :step="0.5" :maxFractionDigits="1"
                  showButtons :disabled="!canEdit" :suffix="` ${$t('hrset.day_wage')}`" class="w-12rem self-start" />
                <small class="text-color-secondary">{{ $t("hrset.absence_deduction_days_hint") }}</small>
              </div>
            </div>
            <div class="sawa-card p-3 flex flex-column gap-2">
              <span class="font-semibold">{{ $t("hrset.company_location") }}</span>
              <small class="text-color-secondary">{{ $t("hrset.company_location_hint") }}</small>
              <GoogleMap api-key="AIzaSyDZnJeq94aaneiA3QWUZdWYV9uKDEjxjas" style="width: 100%; height: 340px"
                :center="mapPoint({ latitude: form.company_lat, longitude: form.company_long })" :zoom="15" @click="pickLocation">
                <Marker v-if="form.company_lat" :options="{ position: mapPoint({ latitude: form.company_lat, longitude: form.company_long }) }" />
                <Circle v-if="form.company_lat && form.rules.attendance.location_radius_meters > 0"
                  :options="{ center: mapPoint({ latitude: form.company_lat, longitude: form.company_long }), radius: form.rules.attendance.location_radius_meters,
                    strokeColor: '#135c65', strokeOpacity: 0.8, strokeWeight: 1, fillColor: '#135c65', fillOpacity: 0.12 }" />
              </GoogleMap>
              <small dir="ltr" class="text-color-secondary">{{ form.company_lat || "—" }}, {{ form.company_long || "—" }}</small>
            </div>
          </div>
        </TabPanel>

        <!-- Overtime -->
        <TabPanel value="overtime">
          <div class="sawa-card p-4 flex flex-column gap-4 max-w-2xl">
            <div v-for="key in ['rate', 'holiday_rate']" :key="key" class="flex flex-column gap-1">
              <label :for="`ot-${key}`" class="font-semibold">{{ $t(`hrset.${key}`) }}</label>
              <div class="flex items-center gap-2">
                <InputNumber v-model="form.rules.overtime[key]" :inputId="`ot-${key}`" :min="1" :max="5" :step="0.05" :minFractionDigits="2" :maxFractionDigits="2"
                  showButtons :disabled="!canEdit" prefix="× " class="w-12rem" />
                <span class="text-color-secondary">= {{ Math.round(form.rules.overtime[key] * 100) }}%</span>
                <Button v-if="changed('overtime', key)" icon="pi pi-undo" text rounded :aria-label="$t('hrset.reset')" v-tooltip.top="$t('hrset.reset')"
                  :disabled="!canEdit" @click="reset('overtime', key)" />
              </div>
              <small class="text-color-secondary">{{ $t(`hrset.${key}_hint`, { value: Math.round(settings.defaults.overtime[key] * 100) }) }}</small>
            </div>
            <div class="flex flex-column gap-1">
              <label for="ot-min" class="font-semibold">{{ $t("hrset.min_minutes") }}</label>
              <InputNumber v-model="form.rules.overtime.min_minutes" inputId="ot-min" :min="0" :max="600" showButtons :disabled="!canEdit"
                :suffix="` ${$t('hrset.minutes')}`" class="w-12rem" />
              <small class="text-color-secondary">{{ $t("hrset.min_minutes_hint") }}</small>
            </div>
          </div>
        </TabPanel>

        <!-- Recruitment -->
        <TabPanel value="recruitment">
          <div class="sawa-card p-4 flex flex-column gap-3 max-w-2xl">
            <div class="flex items-center gap-3">
              <ToggleSwitch v-model="form.rules.recruitment.application_open" inputId="rec-open" :disabled="!canEdit" />
              <label for="rec-open" class="font-semibold">
                {{ form.rules.recruitment.application_open ? $t("hrset.application_open") : $t("hrset.application_closed") }}
              </label>
            </div>
            <small class="text-color-secondary">{{ $t("hrset.application_hint") }}</small>
          </div>
          <div v-if="form.rules.contracts" class="sawa-card p-4 flex flex-column gap-4 max-w-2xl mt-3">
            <p class="font-bold m-0">{{ $t("hrset.contracts") }}</p>
            <div v-for="key in ['probation_days', 'expiry_alert_days', 'probation_alert_days']" :key="key" class="flex flex-column gap-1">
              <label :for="`ctr-${key}`" class="font-semibold">{{ $t(`hrset.${key}`) }}</label>
              <div class="flex items-center gap-2">
                <InputNumber v-model="form.rules.contracts[key]" :inputId="`ctr-${key}`" :min="key === 'probation_days' ? 0 : 1" :max="key === 'probation_alert_days' ? 180 : 365" showButtons :disabled="!canEdit"
                  :suffix="` ${$t('ctr.days')}`" class="w-12rem" />
                <Button v-if="changed('contracts', key)" icon="pi pi-undo" text rounded :aria-label="$t('hrset.reset')" v-tooltip.top="$t('hrset.reset')"
                  :disabled="!canEdit" @click="reset('contracts', key)" />
              </div>
              <small class="text-color-secondary">{{ $t(`hrset.${key}_hint`, { value: settings.defaults.contracts?.[key] }) }}</small>
            </div>
          </div>
        </TabPanel>

        <!-- Employees: documents and end of service -->
        <TabPanel value="employees">
          <div v-if="form.rules.documents && form.rules.end_of_service" class="sawa-card p-4 flex flex-column gap-4 max-w-2xl">
            <div class="flex flex-column gap-1">
              <label for="doc-alert" class="font-semibold">{{ $t("hrset.doc_alert_days") }}</label>
              <div class="flex items-center gap-2">
                <InputNumber v-model="form.rules.documents.expiry_alert_days" inputId="doc-alert" :min="1" :max="365" showButtons :disabled="!canEdit"
                  :suffix="` ${$t('ctr.days')}`" class="w-12rem" />
                <Button v-if="changed('documents', 'expiry_alert_days')" icon="pi pi-undo" text rounded :aria-label="$t('hrset.reset')" v-tooltip.top="$t('hrset.reset')"
                  :disabled="!canEdit" @click="reset('documents', 'expiry_alert_days')" />
              </div>
              <small class="text-color-secondary">{{ $t("hrset.doc_alert_days_hint", { value: settings.defaults.documents?.expiry_alert_days }) }}</small>
            </div>
            <Divider class="my-0" />
            <p class="font-bold m-0">{{ $t("eos.title") }}</p>
            <div class="flex flex-column gap-1">
              <div class="flex items-center gap-3">
                <ToggleSwitch v-model="form.rules.end_of_service.enabled" inputId="eos-enabled" :disabled="!canEdit" />
                <label for="eos-enabled" class="font-semibold">{{ $t("hrset.eos_enabled") }}</label>
              </div>
              <small class="text-color-secondary">{{ settings.country === "SA" ? $t("hrset.eos_sa_hint") : $t("hrset.eos_jo_hint") }}</small>
            </div>
            <div class="flex flex-column gap-1">
              <div class="flex items-center gap-3">
                <ToggleSwitch v-model="form.rules.end_of_service.leave_encashment" inputId="eos-leave" :disabled="!canEdit" />
                <label for="eos-leave" class="font-semibold">{{ $t("hrset.eos_leave") }}</label>
              </div>
              <small class="text-color-secondary">{{ $t("hrset.eos_leave_hint") }}</small>
            </div>
          </div>
        </TabPanel>

        <!-- Leaves: the yearly renewal -->
        <TabPanel value="leaves">
          <div v-if="form.rules.leaves" class="sawa-card p-4 flex flex-column gap-4 max-w-2xl">
            <div class="flex flex-column gap-1">
              <label for="lv-renewal" class="font-semibold">{{ $t("hrset.renewal") }}</label>
              <SelectButton v-model="form.rules.leaves.renewal" inputId="lv-renewal" :options="['january', 'anniversary']" :optionLabel="(x) => $t(`hrset.renewal_${x}`)"
                :allowEmpty="false" :disabled="!canEdit" class="self-start" />
              <small class="text-color-secondary">{{ $t("hrset.renewal_hint") }}</small>
            </div>
            <div class="flex flex-column gap-1">
              <label for="lv-carry" class="font-semibold">{{ $t("hrset.carry_over_days") }}</label>
              <InputNumber v-model="form.rules.leaves.carry_over_days" inputId="lv-carry" :min="0" :max="365" showButtons :disabled="!canEdit"
                :suffix="` ${$t('ctr.days')}`" class="w-12rem" />
              <small class="text-color-secondary">{{ $t("hrset.carry_over_days_hint") }}</small>
            </div>
          </div>
        </TabPanel>

        <!-- Payroll: social insurance -->
        <TabPanel value="payroll">
          <div v-if="form.rules.payroll" class="sawa-card p-4 flex flex-column gap-4 max-w-2xl">
            <div class="flex flex-column gap-1">
              <div class="flex items-center gap-3">
                <ToggleSwitch v-model="form.rules.payroll.insurance_enabled" inputId="pay-ins" :disabled="!canEdit" />
                <label for="pay-ins" class="font-semibold">{{ settings.country === "SA" ? $t("hrset.insurance_sa") : $t("hrset.insurance_jo") }}</label>
              </div>
              <small class="text-color-secondary">{{ $t("hrset.insurance_hint") }}</small>
            </div>
            <div v-for="key in ['insurance_rate', 'insurance_employer_rate']" :key="key" class="flex flex-column gap-1">
              <label :for="`pay-${key}`" class="font-semibold">{{ $t(`hrset.${key}`) }}</label>
              <div class="flex items-center gap-2">
                <InputNumber v-model="form.rules.payroll[key]" :inputId="`pay-${key}`" :min="0" :max="50" :step="0.25" :maxFractionDigits="2" showButtons
                  :disabled="!canEdit || !form.rules.payroll.insurance_enabled" suffix=" %" class="w-12rem" />
                <Button v-if="changed('payroll', key)" icon="pi pi-undo" text rounded :aria-label="$t('hrset.reset')" v-tooltip.top="$t('hrset.reset')"
                  :disabled="!canEdit" @click="reset('payroll', key)" />
              </div>
              <small class="text-color-secondary">{{ $t(`hrset.${key}_hint`, { value: settings.defaults.payroll?.[key] }) }}</small>
            </div>
          </div>
        </TabPanel>

        <TabPanel v-if="canLists" value="lists">
          <HrLookups :country="settings.country" :profiles="settings.profiles" />
        </TabPanel>
      </TabPanels>
    </Tabs>

    <!-- On the reading side, clear of the assistant's floating button. -->
    <div v-if="settings && tab !== 'system' && tab !== 'lists' && canEdit" class="flex justify-start mt-3">
      <Button icon="pi pi-check" :label="$t('save')" :loading="saving" @click="save" />
    </div>

    <Dialog :visible="!!switchTo" modal :header="$t('hrset.switch_title')" :style="{ width: '480px' }" @update:visible="switchTo = null">
      <p class="mt-0">{{ $t("hrset.switch_body", { name: switchTo ? (ar ? settings.profiles[switchTo].name_ar : settings.profiles[switchTo].name_en) : "" }) }}</p>
      <ul class="m-0 ps-4 flex flex-column gap-1 text-color-secondary">
        <li>{{ $t("hrset.switch_effect_currency") }}</li>
        <li>{{ $t("hrset.switch_effect_lists") }}</li>
        <li>{{ $t("hrset.switch_effect_rules") }}</li>
      </ul>
      <template #footer>
        <Button :label="$t('cancel')" text severity="secondary" @click="switchTo = null" />
        <Button icon="pi pi-sync" :label="$t('hrset.confirm_switch')" :loading="saving" @click="switchCountry" />
      </template>
    </Dialog>
  </div>
</template>
