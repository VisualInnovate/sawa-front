<script setup>
// The HR lists: qualifications, specialties (a «specialist» needs a practice licence), banks and the documents
// candidates send (required or optional, for everyone, non-citizens only or specialists only) and the new employees'
// onboarding tasks (due some days after the first day). Each row belongs to
// one labour system or to both; a hidden row stays for the records that already use it.
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { errorText } from "@/utils/accounting";
import { can } from "@/utils/permissions";

const props = defineProps({
  country: { type: String, required: true },
  profiles: { type: Object, required: true },
});

const { t, locale } = useI18n();
const toast = useToast();

const TYPES = ["qualification", "specialty", "bank", "document", "onboarding"];
const type = ref("document");
const scope = ref("current");
const rows = ref([]);
const loading = ref(false);
const dialog = ref(false);
const form = ref({});
const saving = ref(false);
const removing = ref(null);

const ar = computed(() => locale.value === "ar");
const typeOptions = computed(() => TYPES.map((value) => ({ value, label: t(`hrset.list_${value}`) })));
const scopeOptions = computed(() => [
  { value: "current", label: t("hrset.scope_current") },
  { value: "all", label: t("hrset.scope_all") },
]);
const countryOptions = computed(() => [
  { value: null, label: t("hrset.both_systems") },
  ...Object.values(props.profiles).map((p) => ({ value: p.code, label: ar.value ? p.name_ar : p.name_en })),
]);
const forOptions = computed(() => ["all", "non_citizens", "specialists"].map((value) => ({ value, label: t(`hrset.for_${value}`) })));
const acceptOptions = computed(() => ["any", "image"].map((value) => ({ value, label: t(`hrset.accept_${value}`) })));

const visible = computed(() =>
  rows.value.filter((r) => r.type === type.value && (scope.value === "all" || r.country === null || r.country === props.country)),
);

// Short in the table: «سعودي» / «أردني» / «النظامان».
const systemLabel = (code) => (code ? (ar.value ? props.profiles[code].citizen_ar : props.profiles[code].citizen_en) : t("hrset.both_systems"));

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get("api/hr-lookups");
    rows.value = data.data;
  } finally {
    loading.value = false;
  }
}

function openNew() {
  form.value = {
    type: type.value, country: type.value === "bank" ? props.country : null, name_ar: "", name_en: "", is_active: true,
    meta: type.value === "document" ? { required: true, for: "all", accept: "any", multiple: false } : type.value === "specialty" ? { specialist: false }
      : type.value === "onboarding" ? { days: 0 } : type.value === "bank" ? { code: "" } : null,
  };
  dialog.value = true;
}

function openEdit(row) {
  form.value = JSON.parse(JSON.stringify(row));
  if (row.type === "document") form.value.meta = { required: false, for: "all", accept: "any", multiple: false, ...(row.meta ?? {}) };
  if (row.type === "specialty") form.value.meta = { specialist: false, ...(row.meta ?? {}) };
  if (row.type === "onboarding") form.value.meta = { days: 0, ...(row.meta ?? {}) };
  if (row.type === "bank") form.value.meta = { code: "", ...(row.meta ?? {}) };
  dialog.value = true;
}

const nameError = computed(() => (form.value.name_ar?.trim() ? "" : t("hrset.name_required")));

async function save() {
  if (nameError.value) return;
  saving.value = true;
  const body = { country: form.value.country, name_ar: form.value.name_ar.trim(), name_en: form.value.name_en?.trim() || null, is_active: form.value.is_active, meta: form.value.meta };
  try {
    if (form.value.id) await axios.put(`api/hr-lookups/${form.value.id}`, body);
    else await axios.post("api/hr-lookups", { ...body, type: form.value.type });
    dialog.value = false;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("hrset.saved"), life: 2500 });
    await load();
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  } finally {
    saving.value = false;
  }
}

// Showing or hiding a row saves at once.
async function toggle(row) {
  try {
    await axios.put(`api/hr-lookups/${row.id}`, { name_ar: row.name_ar, is_active: row.is_active });
  } catch (error) {
    row.is_active = !row.is_active;
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  }
}

async function remove() {
  try {
    await axios.delete(`api/hr-lookups/${removing.value.id}`);
    removing.value = null;
    await load();
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  }
}

onMounted(load);
</script>

<template>
  <div class="flex flex-column gap-3">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <SelectButton v-model="type" :options="typeOptions" optionLabel="label" optionValue="value" :allowEmpty="false" />
      <div class="flex flex-wrap items-center gap-2">
        <SelectButton v-model="scope" :options="scopeOptions" optionLabel="label" optionValue="value" :allowEmpty="false" />
        <Button v-if="can('hr lists create')" icon="pi pi-plus" :label="$t('hrset.add_row')" @click="openNew" />
      </div>
    </div>
    <small class="text-color-secondary">{{ $t(`hrset.list_${type}_hint`) }}</small>

    <DataTable :value="visible" :loading="loading" dataKey="id" size="small" stripedRows>
      <template #empty>{{ $t("no_data_found") }}</template>
      <Column :header="$t('hrset.name_ar')">
        <template #body="{ data }"><span class="font-medium" :class="{ 'opacity-50': !data.is_active }">{{ data.name_ar }}</span></template>
      </Column>
      <Column :header="$t('hrset.name_en')">
        <template #body="{ data }"><span dir="ltr" :class="{ 'opacity-50': !data.is_active }">{{ data.name_en || "—" }}</span></template>
      </Column>
      <Column :header="$t('hrset.system_col')">
        <template #body="{ data }"><Tag :severity="data.country ? 'info' : 'secondary'" :value="systemLabel(data.country)" /></template>
      </Column>
      <Column v-if="type === 'specialty'" :header="$t('hrset.specialist')">
        <template #body="{ data }"><i :class="data.meta?.specialist ? 'pi pi-check text-green-600' : 'pi pi-minus text-color-secondary'" /></template>
      </Column>
      <Column v-if="type === 'bank'" :header="$t('hrset.bank_code')">
        <template #body="{ data }"><bdi dir="ltr">{{ data.meta?.code || "—" }}</bdi></template>
      </Column>
      <Column v-if="type === 'onboarding'" :header="$t('hrset.onboarding_days')">
        <template #body="{ data }">{{ $t("hrset.after_days", { n: data.meta?.days ?? 0 }) }}</template>
      </Column>
      <template v-if="type === 'document'">
        <Column :header="$t('hrset.required')">
          <template #body="{ data }"><Tag :severity="data.meta?.required ? 'warn' : 'secondary'" :value="data.meta?.required ? $t('hrset.required_yes') : $t('hrset.required_no')" /></template>
        </Column>
        <Column :header="$t('hrset.for')">
          <template #body="{ data }">{{ $t(`hrset.for_${data.meta?.for || "all"}`) }}</template>
        </Column>
        <Column :header="$t('hrset.accept')">
          <template #body="{ data }">{{ $t(`hrset.accept_${data.meta?.accept || "any"}`) }}{{ data.meta?.multiple ? " · " + $t("hrset.multiple") : "" }}</template>
        </Column>
      </template>
      <Column :header="$t('hrset.shown')" header-style="width:6rem">
        <template #body="{ data }">
          <ToggleSwitch v-model="data.is_active" :disabled="!can('hr lists edit')" :aria-label="$t('hrset.shown')" @update:modelValue="toggle(data)" />
        </template>
      </Column>
      <Column header-style="width:7rem">
        <template #body="{ data }">
          <div class="table-actions">
            <Button v-if="can('hr lists edit')" icon="pi pi-pencil" rounded variant="outlined" severity="info" :aria-label="$t('edit')" v-tooltip.top="$t('edit')" @click="openEdit(data)" />
            <Button v-if="can('hr lists delete')" icon="pi pi-trash" rounded variant="outlined" severity="danger" :aria-label="$t('delete')" v-tooltip.top="$t('delete')" @click="removing = data" />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialog" modal :header="form.id ? $t('hrset.edit_row') : $t('hrset.add_row')" :style="{ width: '520px' }">
      <div class="flex flex-column gap-3">
        <div class="flex flex-column gap-1">
          <label for="lk-ar">{{ $t("hrset.name_ar") }} <span class="text-red-500">*</span></label>
          <InputText id="lk-ar" v-model="form.name_ar" :invalid="!!nameError" />
          <small v-if="nameError" class="text-red-500">{{ nameError }}</small>
        </div>
        <div class="flex flex-column gap-1">
          <label for="lk-en">{{ $t("hrset.name_en") }}</label>
          <InputText id="lk-en" v-model="form.name_en" dir="ltr" />
        </div>
        <div class="flex flex-column gap-1">
          <label for="lk-country">{{ $t("hrset.system_col") }}</label>
          <Select inputId="lk-country" v-model="form.country" :options="countryOptions" optionLabel="label" optionValue="value" />
        </div>
        <div v-if="form.type === 'specialty'" class="flex items-center gap-2">
          <Checkbox v-model="form.meta.specialist" inputId="lk-specialist" binary />
          <label for="lk-specialist">{{ $t("hrset.specialist_hint") }}</label>
        </div>
        <div v-if="form.type === 'bank'" class="flex flex-column gap-1">
          <label for="lk-code">{{ $t("hrset.bank_code") }}</label>
          <InputText v-model="form.meta.code" id="lk-code" dir="ltr" maxlength="20" class="w-12rem text-start" />
          <small class="text-color-secondary">{{ $t("hrset.bank_code_hint") }}</small>
        </div>
        <div v-if="form.type === 'onboarding'" class="flex flex-column gap-1">
          <label for="lk-days">{{ $t("hrset.onboarding_days") }}</label>
          <InputNumber v-model="form.meta.days" inputId="lk-days" :min="0" :max="365" showButtons :suffix="` ${$t('ctr.days')}`" class="w-12rem" />
          <small class="text-color-secondary">{{ $t("hrset.onboarding_days_hint") }}</small>
        </div>
        <template v-if="form.type === 'document'">
          <div class="flex items-center gap-2">
            <ToggleSwitch v-model="form.meta.required" inputId="lk-required" />
            <label for="lk-required">{{ form.meta.required ? $t("hrset.required_yes") : $t("hrset.required_no") }}</label>
          </div>
          <div class="flex flex-column gap-1">
            <label for="lk-for">{{ $t("hrset.for") }}</label>
            <Select inputId="lk-for" v-model="form.meta.for" :options="forOptions" optionLabel="label" optionValue="value" />
          </div>
          <div class="flex flex-wrap items-end gap-3">
            <div class="flex flex-column gap-1">
              <label for="lk-accept">{{ $t("hrset.accept") }}</label>
              <Select inputId="lk-accept" v-model="form.meta.accept" :options="acceptOptions" optionLabel="label" optionValue="value" class="w-12rem" />
            </div>
            <div class="flex items-center gap-2 pb-2">
              <Checkbox v-model="form.meta.multiple" inputId="lk-multiple" binary />
              <label for="lk-multiple">{{ $t("hrset.multiple_hint") }}</label>
            </div>
          </div>
        </template>
        <div class="flex items-center gap-2">
          <ToggleSwitch v-model="form.is_active" inputId="lk-active" />
          <label for="lk-active">{{ form.is_active ? $t("hrset.shown") : $t("hrset.hidden") }}</label>
        </div>
      </div>
      <template #footer>
        <Button :label="$t('cancel')" text severity="secondary" @click="dialog = false" />
        <Button icon="pi pi-check" :label="$t('save')" :loading="saving" :disabled="!!nameError" @click="save" />
      </template>
    </Dialog>

    <Dialog :visible="!!removing" modal :header="$t('delete')" :style="{ width: '420px' }" @update:visible="removing = null">
      <p class="m-0">{{ $t("hrset.delete_row", { name: removing?.name_ar }) }}</p>
      <template #footer>
        <Button :label="$t('cancel')" text severity="secondary" @click="removing = null" />
        <Button icon="pi pi-trash" severity="danger" :label="$t('delete')" @click="remove" />
      </template>
    </Dialog>
  </div>
</template>
