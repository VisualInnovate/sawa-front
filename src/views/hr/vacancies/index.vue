<script setup>
// «الوظائف الشاغرة»: the jobs offered on the careers page (open) or kept for the record (closed). The expected
// salary is in the labour system's currency; departments can be added right from the form.
import axios from "axios";
import moment from "moment";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { errorText } from "@/utils/accounting";
import { can } from "@/utils/permissions";

const { t, locale } = useI18n();
const toast = useToast();

const rows = ref([]);
const departments = ref([]);
const profile = ref(null);
const loading = ref(false);
const search = ref("");
const status = ref("open");
const dialog = ref(false);
const form = ref({});
const errors = ref({});
const saving = ref(false);
const removing = ref(null);
const newDepartment = ref(null);

const ar = computed(() => locale.value === "ar");
const statusOptions = computed(() => [
  { value: "open", label: t("vac.open") },
  { value: "closed", label: t("vac.closed") },
  { value: "all", label: t("vac.all") },
]);
const visible = computed(() => {
  const q = search.value.trim().toLowerCase();
  return rows.value.filter((r) => (status.value === "all" || r.status === status.value)
    && (!q || [r.title_ar, r.title_en, r.department?.title].some((v) => v?.toLowerCase().includes(q))));
});
const money = (value, currency) => (value == null ? "—" : `${Number(value).toLocaleString(ar.value ? "ar" : "en")} ${currencyLabel(currency)}`);
const currencyLabel = (code) => ({ SAR: t("vac.sar"), JOD: t("vac.jod") })[code] ?? code;

async function load() {
  loading.value = true;
  try {
    const [vac, dep] = await Promise.all([axios.get("api/vacancies"), axios.get("api/department")]);
    rows.value = vac.data.data;
    profile.value = vac.data.profile;
    departments.value = dep.data.data ?? [];
  } finally {
    loading.value = false;
  }
}

function openNew() {
  form.value = { title_ar: "", title_en: "", department_id: null, start_date: null, description: "", expected_salary: null, status: "open" };
  errors.value = {};
  dialog.value = true;
}

function openEdit(row) {
  form.value = { ...row, start_date: row.start_date ? new Date(row.start_date) : null };
  errors.value = {};
  dialog.value = true;
}

// The form's own checks, with the messages next to each field.
function check() {
  const e = {};
  if (!form.value.title_ar?.trim()) e.title_ar = t("vac.err_title_ar");
  else if (form.value.title_ar.trim().length < 2) e.title_ar = t("vac.err_short");
  if (form.value.title_en && !/^[A-Za-z0-9 .,&()/-]+$/.test(form.value.title_en.trim())) e.title_en = t("vac.err_title_en");
  if (form.value.expected_salary != null && form.value.expected_salary < 0) e.expected_salary = t("vac.err_salary");
  errors.value = e;
  return !Object.keys(e).length;
}

async function save() {
  if (!check()) return;
  saving.value = true;
  const body = {
    title_ar: form.value.title_ar.trim(), title_en: form.value.title_en?.trim() || null, department_id: form.value.department_id,
    start_date: form.value.start_date ? moment(form.value.start_date).format("YYYY-MM-DD") : null,
    description: form.value.description?.trim() || null, expected_salary: form.value.expected_salary, status: form.value.status,
  };
  try {
    if (form.value.id) await axios.put(`api/vacancies/${form.value.id}`, body);
    else await axios.post("api/vacancies", body);
    dialog.value = false;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("vac.saved"), life: 2500 });
    await load();
  } catch (error) {
    errors.value = Object.fromEntries(Object.entries(error.response?.data?.errors ?? {}).map(([k, v]) => [k, v[0]]));
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  } finally {
    saving.value = false;
  }
}

async function toggleStatus(row) {
  try {
    await axios.put(`api/vacancies/${row.id}`, { title_ar: row.title_ar, status: row.status === "open" ? "closed" : "open" });
    await load();
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  }
}

async function remove() {
  try {
    await axios.delete(`api/vacancies/${removing.value.id}`);
    removing.value = null;
    await load();
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  }
}

// A department added from the form is picked at once.
async function addDepartment() {
  const title = newDepartment.value?.trim();
  if (!title) return;
  try {
    const { data } = await axios.post("api/department", { title, description: "" });
    newDepartment.value = null;
    const dep = await axios.get("api/department");
    departments.value = dep.data.data ?? [];
    form.value.department_id = data.data?.id ?? form.value.department_id;
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  }
}

onMounted(load);
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-2 p-4">
      <p class="text-xl text-bp-135c65 font-bold m-0">{{ $t("vac.title") }}</p>
      <div class="flex gap-2">
        <router-link v-if="can('department list')" :to="{ name: 'departments' }">
          <Button icon="pi pi-sitemap" :label="$t('vac.departments')" severity="secondary" variant="outlined" />
        </router-link>
        <Button v-if="can('vacancies create')" icon="pi pi-plus" :label="$t('vac.add')" @click="openNew" />
      </div>
    </div>
    <Toast />

    <div class="flex flex-wrap items-center gap-2 mb-3">
      <IconField class="table-search">
        <InputIcon class="pi pi-search" />
        <InputText v-model="search" :placeholder="$t('search')" />
      </IconField>
      <SelectButton v-model="status" :options="statusOptions" optionLabel="label" optionValue="value" :allowEmpty="false" />
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      <Skeleton v-for="n in 3" :key="n" height="11rem" />
    </div>
    <div v-else-if="!visible.length" class="sawa-card p-5 text-center text-color-secondary">
      <i class="pi pi-briefcase text-3xl mb-2 block" />{{ $t("vac.empty") }}
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      <div v-for="row in visible" :key="row.id" class="sawa-card p-4 flex flex-column gap-2" :class="{ 'opacity-70': row.status === 'closed' }">
        <div class="flex items-start justify-between gap-2">
          <div>
            <div class="text-lg font-bold">{{ row.title_ar }}</div>
            <div v-if="row.title_en" dir="ltr" class="text-sm text-color-secondary text-start">{{ row.title_en }}</div>
          </div>
          <Tag :severity="row.status === 'open' ? 'success' : 'secondary'" :value="row.status === 'open' ? $t('vac.open') : $t('vac.closed')" />
        </div>
        <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-color-secondary">
          <span><i class="pi pi-sitemap me-1" />{{ row.department?.title || $t("vac.no_department") }}</span>
          <span><i class="pi pi-calendar me-1" /><bdi :dir="row.start_date ? 'ltr' : undefined">{{ row.start_date || $t("vac.no_date") }}</bdi></span>
          <span><i class="pi pi-wallet me-1" />{{ money(row.expected_salary, row.currency) }}</span>
        </div>
        <p v-if="row.description" class="m-0 text-sm line-clamp-3 whitespace-pre-line">{{ row.description }}</p>
        <div class="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-surface-200">
          <router-link v-if="can('candidates list')" :to="{ name: 'candidates', query: { vacancy: row.id } }" class="text-sm font-medium">
            <i class="pi pi-users me-1" />{{ $t("vac.candidates", { n: row.candidates_count }) }}
          </router-link>
          <span v-else class="text-sm"><i class="pi pi-users me-1" />{{ $t("vac.candidates", { n: row.candidates_count }) }}</span>
          <div class="table-actions">
            <Button v-if="can('vacancies edit')" :icon="row.status === 'open' ? 'pi pi-lock' : 'pi pi-lock-open'" rounded variant="outlined" severity="secondary"
              v-tooltip.top="row.status === 'open' ? $t('vac.close') : $t('vac.reopen')" :aria-label="row.status === 'open' ? $t('vac.close') : $t('vac.reopen')" @click="toggleStatus(row)" />
            <Button v-if="can('vacancies edit')" icon="pi pi-pencil" rounded variant="outlined" severity="info" v-tooltip.top="$t('edit')" :aria-label="$t('edit')" @click="openEdit(row)" />
            <Button v-if="can('vacancies delete')" icon="pi pi-trash" rounded variant="outlined" severity="danger" v-tooltip.top="$t('delete')" :aria-label="$t('delete')" @click="removing = row" />
          </div>
        </div>
      </div>
    </div>

    <Dialog v-model:visible="dialog" modal :header="form.id ? $t('vac.edit') : $t('vac.add')" :style="{ width: '620px' }" :breakpoints="{ '640px': '95vw' }">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="flex flex-column gap-1">
          <label for="vac-ar">{{ $t("vac.title_ar") }} <span class="text-red-500">*</span></label>
          <InputText id="vac-ar" v-model="form.title_ar" :invalid="!!errors.title_ar" @blur="check" />
          <small v-if="errors.title_ar" class="text-red-500">{{ errors.title_ar }}</small>
        </div>
        <div class="flex flex-column gap-1">
          <label for="vac-en">{{ $t("vac.title_en") }}</label>
          <InputText id="vac-en" v-model="form.title_en" dir="ltr" :invalid="!!errors.title_en" @blur="check" />
          <small v-if="errors.title_en" class="text-red-500">{{ errors.title_en }}</small>
        </div>
        <div class="flex flex-column gap-1 sm:col-span-2">
          <label for="vac-dep">{{ $t("vac.department") }}</label>
          <Select inputId="vac-dep" v-model="form.department_id" :options="departments" optionLabel="title" optionValue="id" filter showClear
            :placeholder="$t('vac.pick_department')" :invalid="!!errors.department_id" />
          <div v-if="can('department create')" class="flex gap-2 mt-1">
            <InputText v-model="newDepartment" :placeholder="$t('vac.new_department')" class="flex-1" :aria-label="$t('vac.new_department')" @keyup.enter="addDepartment" />
            <Button icon="pi pi-plus" :label="$t('vac.add_department')" severity="secondary" :disabled="!newDepartment?.trim()" @click="addDepartment" />
          </div>
        </div>
        <div class="flex flex-column gap-1">
          <label for="vac-start">{{ $t("vac.start_date") }}</label>
          <DatePicker inputId="vac-start" v-model="form.start_date" dateFormat="yy-mm-dd" showIcon showButtonBar />
        </div>
        <div class="flex flex-column gap-1">
          <label for="vac-salary">{{ $t("vac.expected_salary") }}</label>
          <InputNumber inputId="vac-salary" v-model="form.expected_salary" :min="0" :maxFractionDigits="2"
            :suffix="` ${currencyLabel(form.currency || profile?.currency_code)}`" :invalid="!!errors.expected_salary" />
          <small v-if="errors.expected_salary" class="text-red-500">{{ errors.expected_salary }}</small>
          <small v-else class="text-color-secondary">{{ $t("vac.salary_hint") }}</small>
        </div>
        <div class="flex flex-column gap-1 sm:col-span-2">
          <label for="vac-desc">{{ $t("vac.description") }}</label>
          <Textarea id="vac-desc" v-model="form.description" rows="6" autoResize maxlength="5000" />
          <small class="text-color-secondary text-end">{{ (form.description || "").length }} / 5000</small>
        </div>
        <div class="flex items-center gap-2 sm:col-span-2">
          <ToggleSwitch :modelValue="form.status === 'open'" inputId="vac-open" @update:modelValue="(v) => (form.status = v ? 'open' : 'closed')" />
          <label for="vac-open">{{ form.status === "open" ? $t("vac.open_hint") : $t("vac.closed_hint") }}</label>
        </div>
      </div>
      <template #footer>
        <Button :label="$t('cancel')" text severity="secondary" @click="dialog = false" />
        <Button icon="pi pi-check" :label="$t('save')" :loading="saving" @click="save" />
      </template>
    </Dialog>

    <Dialog :visible="!!removing" modal :header="$t('delete')" :style="{ width: '440px' }" @update:visible="removing = null">
      <p class="m-0">{{ $t("vac.delete_confirm", { name: removing?.title_ar }) }}</p>
      <template #footer>
        <Button :label="$t('cancel')" text severity="secondary" @click="removing = null" />
        <Button icon="pi pi-trash" severity="danger" :label="$t('delete')" @click="remove" />
      </template>
    </Dialog>
  </div>
</template>
