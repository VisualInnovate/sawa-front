<script setup>
// «العقود»: a contract for an approved candidate and a vacancy (draft), then «تعيين» turns the candidate into an
// employee (account with a temporary password shown once) and the contract active. Active contracts warn before
// they end and before the probation ends, and can be renewed or ended early.
import axios from "axios";
import moment from "moment";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { errorText } from "@/utils/accounting";
import { can } from "@/utils/permissions";

const { t, te, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const rows = ref([]);
const counts = ref({});
const profile = ref(null);
const options = ref({ vacancies: [], candidates: [], roles: [], shifts: [], positions: [], probation_days: 90 });
const loading = ref(false);
const filter = ref({ status: null, alert: null, search: "" });
const ar = computed(() => locale.value === "ar");
const currency = computed(() => (profile.value?.currency_code === "SAR" ? t("vac.sar") : t("vac.jod")));

const STATUS_SEVERITY = { draft: "warn", active: "success", ended: "secondary", cancelled: "danger" };
const msg = (error) => {
  const m = error.response?.data?.message;
  const first = Object.values(error.response?.data?.errors ?? {})[0]?.[0];
  const code = [m, first].find((x) => typeof x === "string" && x.startsWith("hr."));
  return code && te(`ctr.err.${code.slice(3)}`) ? t(`ctr.err.${code.slice(3)}`) : errorText(error);
};

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get("api/contracts", { params: { status: filter.value.status || undefined, alert: filter.value.alert || undefined, search: filter.value.search.trim() || undefined } });
    rows.value = data.data;
    counts.value = data.counts;
    profile.value = data.profile;
  } finally {
    loading.value = false;
  }
}
async function loadOptions() {
  if (!can("contracts create", "contracts edit")) return;
  options.value = (await axios.get("api/contracts/options")).data.data;
}
onMounted(async () => {
  await Promise.all([load(), loadOptions()]);
  // From the candidates' board: «إنشاء عقد» for this candidate.
  if (route.query.candidate && can("contracts create")) {
    openNew(Number(route.query.candidate));
    router.replace({ query: {} });
  }
});

const pick = (key, value) => {
  filter.value = { ...filter.value, status: null, alert: null, [key]: filter.value[key] === value ? null : value };
  load();
};
const money = (v, cur) => (v == null ? "—" : `${Number(v).toLocaleString(ar.value ? "ar" : "en")} ${cur === "SAR" ? t("vac.sar") : cur === "JOD" ? t("vac.jod") : cur}`);
const vacancyTitle = (v) => (v ? (ar.value ? v.title_ar : v.title_en || v.title_ar) : "—");
const date = (d) => (d ? moment(d).format("YYYY-MM-DD") : "—");
// Numbers and phones kept left-to-right inside Arabic text.
const ltr = (text) => `\u2066${text}\u2069`;

async function openFile(row) {
  const { data } = await axios.get(`api/contracts/${row.id}/file`, { responseType: "blob" });
  window.open(URL.createObjectURL(data), "_blank", "noopener");
}

// ---- New / edit ----
const dialog = ref(false);
const form = ref({});
const errors = ref({});
const saving = ref(false);
const candidateOptions = computed(() => {
  const list = [...options.value.candidates];
  if (form.value.candidate && !list.some((c) => c.id === form.value.candidate.id)) list.unshift(form.value.candidate);
  return list;
});
const vacancyOptions = computed(() => {
  const list = [...options.value.vacancies];
  if (form.value.vacancy && !list.some((v) => v.id === form.value.vacancy.id)) list.unshift(form.value.vacancy);
  return list;
});
function openNew(candidateId = null) {
  const candidate = options.value.candidates.find((c) => c.id === candidateId);
  const vacancy = options.value.vacancies.find((v) => v.id === candidate?.vacancy_id);
  form.value = { id: null, status: "draft", candidate_id: candidate?.id ?? null, vacancy_id: vacancy?.id ?? null, start_date: null, end_date: null,
    basic_salary: vacancy?.expected_salary ?? null, probation_days: options.value.probation_days, notes: "", file: null, file_name: null };
  errors.value = {};
  dialog.value = true;
}
function openEdit(row) {
  form.value = { ...row, candidate: row.candidate, vacancy: row.vacancy, start_date: row.start_date ? new Date(row.start_date) : null,
    end_date: row.end_date ? new Date(row.end_date) : null, file: null };
  errors.value = {};
  dialog.value = true;
}
// The candidate's vacancy and its salary come along when picked.
function onCandidate(id) {
  const c = options.value.candidates.find((x) => x.id === id);
  if (c?.vacancy_id && !form.value.vacancy_id) onVacancy((form.value.vacancy_id = c.vacancy_id));
}
function onVacancy(id) {
  const v = options.value.vacancies.find((x) => x.id === id);
  if (v && form.value.basic_salary == null) form.value.basic_salary = v.expected_salary;
}
function onFile(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  if (!/^(application\/pdf|image\/(png|jpe?g|webp))$/.test(file.type)) return (errors.value.file = t("ctr.err.file_type"));
  if (file.size > 10 * 1024 * 1024) return (errors.value.file = t("ctr.err.file_size_10"));
  delete errors.value.file;
  form.value.file = file;
}
function check() {
  const e = {};
  const draft = form.value.status === "draft";
  if (draft && !form.value.vacancy_id) e.vacancy_id = t("ctr.err.pick_vacancy");
  if (draft && !form.value.candidate_id) e.candidate_id = t("ctr.err.pick_candidate");
  if (draft && !form.value.start_date) e.start_date = t("ctr.err.required");
  if (form.value.end_date && form.value.start_date && moment(form.value.end_date).isBefore(form.value.start_date, "day")) e.end_date = t("ctr.err.end_before_start");
  if (draft && form.value.basic_salary != null && form.value.basic_salary < 0) e.basic_salary = t("vac.err_salary");
  errors.value = { ...e, ...(errors.value.file ? { file: errors.value.file } : {}) };
  return !Object.keys(errors.value).length;
}
async function save() {
  if (!check()) return;
  saving.value = true;
  const body = new FormData();
  const put = (k, v) => v !== null && v !== undefined && v !== "" && body.append(k, v);
  if (form.value.status === "draft") {
    put("vacancy_id", form.value.vacancy_id);
    put("candidate_id", form.value.candidate_id);
    put("start_date", moment(form.value.start_date).format("YYYY-MM-DD"));
    put("basic_salary", form.value.basic_salary);
    put("probation_days", form.value.probation_days);
  }
  put("end_date", form.value.end_date ? moment(form.value.end_date).format("YYYY-MM-DD") : null);
  put("notes", form.value.notes?.trim());
  put("file", form.value.file);
  try {
    await axios.post(form.value.id ? `api/contracts/${form.value.id}` : "api/contracts", body);
    dialog.value = false;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("ctr.saved"), life: 2500 });
    await Promise.all([load(), loadOptions()]);
  } catch (error) {
    errors.value = Object.fromEntries(Object.entries(error.response?.data?.errors ?? {}).map(([k, v]) => [k, te(`ctr.err.${String(v[0]).slice(3)}`) ? t(`ctr.err.${String(v[0]).slice(3)}`) : v[0]]));
    toast.add({ severity: "error", summary: t("error"), detail: msg(error), life: 5000 });
  } finally {
    saving.value = false;
  }
}

// ---- Hire ----
const hiring = ref(null);
const hireForm = ref({});
const hireErrors = ref({});
const hired = ref(null);
const TYPES = computed(() => [
  { id: 2, name: t("doctor") }, { id: 6, name: t("أداري") }, { id: 5, name: t("Evaluator") }, { id: 1, name: t("driver") },
]);
function openHire(row) {
  hiring.value = row;
  hireForm.value = { role: null, type: 2, shift_id: options.value.shifts[0]?.id ?? null, position_id: null };
  hireErrors.value = {};
}
async function hire() {
  const e = {};
  if (!hireForm.value.role) e.role = t("ctr.err.required");
  if (!hireForm.value.shift_id) e.shift_id = t("ctr.err.required");
  hireErrors.value = e;
  if (Object.keys(e).length) return;
  saving.value = true;
  try {
    const { data } = await axios.post(`api/contracts/${hiring.value.id}/hire`, hireForm.value);
    hired.value = { ...data.data, name: hiring.value.candidate?.name_ar };
    hiring.value = null;
    await Promise.all([load(), loadOptions()]);
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: msg(error), life: 6000 });
  } finally {
    saving.value = false;
  }
}
async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast.add({ severity: "success", summary: t("ctr.copied"), life: 1500 });
  } catch {
    // the text stays on screen to copy by hand
  }
}

// ---- Renew / end ----
const renewing = ref(null);
const renewForm = ref({});
function openRenew(row) {
  renewing.value = row;
  const start = row.end_date ? moment(row.end_date).add(1, "day") : moment().add(1, "day");
  renewForm.value = { start_date: start.toDate(), end_date: start.clone().add(1, "year").subtract(1, "day").toDate(), basic_salary: row.basic_salary, notes: "", file: null };
}
async function renew() {
  saving.value = true;
  const body = new FormData();
  body.append("start_date", moment(renewForm.value.start_date).format("YYYY-MM-DD"));
  if (renewForm.value.end_date) body.append("end_date", moment(renewForm.value.end_date).format("YYYY-MM-DD"));
  if (renewForm.value.basic_salary != null) body.append("basic_salary", renewForm.value.basic_salary);
  if (renewForm.value.notes?.trim()) body.append("notes", renewForm.value.notes.trim());
  if (renewForm.value.file) body.append("file", renewForm.value.file);
  try {
    await axios.post(`api/contracts/${renewing.value.id}/renew`, body);
    renewing.value = null;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("ctr.renewed"), life: 2500 });
    load();
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: msg(error), life: 6000 });
  } finally {
    saving.value = false;
  }
}

const ending = ref(null);
const endForm = ref({ reason: "", ended_on: null });
const endError = ref("");
function openEnd(row) {
  ending.value = row;
  endForm.value = { reason: "", ended_on: new Date() };
  endError.value = "";
}
async function end() {
  if (endForm.value.reason.trim().length < 3) return (endError.value = t("ctr.err.reason"));
  saving.value = true;
  try {
    await axios.post(`api/contracts/${ending.value.id}/end`, { reason: endForm.value.reason.trim(), ended_on: ending.value.status === "active" ? moment(endForm.value.ended_on).format("YYYY-MM-DD") : undefined });
    ending.value = null;
    await Promise.all([load(), loadOptions()]);
  } catch (error) {
    endError.value = msg(error);
  } finally {
    saving.value = false;
  }
}

const removing = ref(null);
async function remove() {
  try {
    await axios.delete(`api/contracts/${removing.value.id}`);
    removing.value = null;
    load();
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: msg(error), life: 5000 });
  }
}

const cards = computed(() => [
  { key: "status", value: "draft", label: t("ctr.count_draft"), n: counts.value.draft, icon: "pi pi-file-edit", tone: "#f59e0b" },
  { key: "status", value: "active", label: t("ctr.count_active"), n: counts.value.active, icon: "pi pi-check-circle", tone: "#10b981" },
  { key: "alert", value: "expiring", label: t("ctr.count_expiring"), n: counts.value.expiring, icon: "pi pi-clock", tone: "#f97316" },
  { key: "alert", value: "expired", label: t("ctr.count_expired"), n: counts.value.expired, icon: "pi pi-exclamation-triangle", tone: "#ef4444" },
  { key: "alert", value: "probation", label: t("ctr.count_probation"), n: counts.value.probation, icon: "pi pi-hourglass", tone: "#6366f1" },
]);
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-2 p-4">
      <p class="text-xl text-bp-135c65 font-bold m-0">{{ $t("ctr.title") }}</p>
      <Button v-if="can('contracts create')" icon="pi pi-plus" :label="$t('ctr.add')" @click="openNew()" />
    </div>
    <Toast />

    <div class="ctr-cards mb-3">
      <button v-for="c in cards" :key="c.value" type="button" class="ctr-card" :class="{ 'is-on': filter[c.key] === c.value }" :style="{ '--tone': c.tone }" @click="pick(c.key, c.value)">
        <i :class="c.icon" />
        <span class="ctr-card__n">{{ c.n ?? 0 }}</span>
        <span class="ctr-card__label">{{ c.label }}</span>
      </button>
    </div>

    <div class="flex flex-wrap items-center gap-2 mb-3">
      <IconField class="table-search">
        <InputIcon class="pi pi-search" />
        <InputText v-model="filter.search" :placeholder="$t('ctr.search')" @keyup.enter="load" />
      </IconField>
      <Select v-model="filter.status" :options="['draft', 'active', 'ended', 'cancelled']" :optionLabel="(s) => $t(`ctr.status_${s}`)" showClear :placeholder="$t('ctr.all_statuses')"
        class="w-12rem" @change="filter.alert = null; load()" />
    </div>

    <DataTable :value="rows" :loading="loading" dataKey="id" stripedRows size="small" responsiveLayout="scroll" paginator :rows="15">
      <template #empty>{{ $t("ctr.empty") }}</template>
      <Column :header="$t('ctr.candidate')">
        <template #body="{ data }">
          <div class="font-medium">{{ data.candidate?.name_ar || "—" }}</div>
          <small dir="ltr" class="text-color-secondary block text-start">{{ data.candidate?.phone }}</small>
        </template>
      </Column>
      <Column :header="$t('ctr.job')">
        <template #body="{ data }">{{ vacancyTitle(data.vacancy) }}</template>
      </Column>
      <Column :header="$t('ctr.period')">
        <template #body="{ data }">
          <bdi dir="ltr" class="whitespace-nowrap">{{ date(data.start_date) }} → {{ data.end_date ? date(data.end_date) : "∞" }}</bdi>
          <small v-if="data.probation_end && ['draft', 'active'].includes(data.status)" class="block text-color-secondary">{{ $t("ctr.probation_until", { date: ltr(date(data.probation_end)) }) }}</small>
        </template>
      </Column>
      <Column :header="$t('ctr.salary')">
        <template #body="{ data }">{{ money(data.basic_salary, data.currency) }}</template>
      </Column>
      <Column :header="$t('ctr.status')">
        <template #body="{ data }">
          <div class="flex flex-wrap gap-1">
            <Tag :severity="STATUS_SEVERITY[data.status]" :value="$t(`ctr.status_${data.status}`)" />
            <Tag v-for="a in data.alerts" :key="a" :severity="a === 'expired' ? 'danger' : a === 'expiring' ? 'warn' : 'info'" :value="$t(`ctr.alert_${a}`)" />
            <Tag v-if="data.end_reason === 'renewed'" severity="secondary" :value="$t('ctr.was_renewed')" />
          </div>
          <small v-if="data.end_reason && data.end_reason !== 'renewed'" class="block text-color-secondary">{{ te(`eos.type_${data.end_reason}`) ? $t(`eos.type_${data.end_reason}`) : data.end_reason }}</small>
        </template>
      </Column>
      <Column header-style="min-width:14rem">
        <template #body="{ data }">
          <div class="table-actions">
            <Button v-if="data.status === 'draft' && can('contracts edit') && can('employees create')" icon="pi pi-user-plus" :label="$t('ctr.hire')" size="small" severity="success" @click="openHire(data)" />
            <Button v-if="data.employee && can('employees list', 'employees edit')" icon="pi pi-id-card" rounded variant="outlined" severity="secondary" v-tooltip.top="$t('ctr.open_employee')" :aria-label="$t('ctr.open_employee')"
              @click="router.push({ name: 'employee-profile', params: { id: data.employee.user_id } })" />
            <Button v-if="data.file_name" icon="pi pi-paperclip" rounded variant="outlined" severity="secondary" v-tooltip.top="data.file_name" :aria-label="$t('ctr.open_file')" @click="openFile(data)" />
            <Button v-if="['draft', 'active'].includes(data.status) && can('contracts edit')" icon="pi pi-pencil" rounded variant="outlined" severity="info" v-tooltip.top="$t('edit')" :aria-label="$t('edit')" @click="openEdit(data)" />
            <Button v-if="data.status === 'active' && can('contracts create')" icon="pi pi-refresh" rounded variant="outlined" severity="help" v-tooltip.top="$t('ctr.renew')" :aria-label="$t('ctr.renew')" @click="openRenew(data)" />
            <Button v-if="['draft', 'active'].includes(data.status) && can('contracts edit')" icon="pi pi-ban" rounded variant="outlined" severity="warn"
              v-tooltip.top="data.status === 'draft' ? $t('ctr.cancel') : $t('ctr.end')" :aria-label="data.status === 'draft' ? $t('ctr.cancel') : $t('ctr.end')" @click="openEnd(data)" />
            <Button v-if="data.status !== 'active' && can('contracts delete')" icon="pi pi-box" rounded variant="outlined" severity="danger" v-tooltip.top="$t('ctr.archive')" :aria-label="$t('ctr.archive')" @click="removing = data" />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- New / edit -->
    <Dialog v-model:visible="dialog" modal :header="form.id ? $t('ctr.edit') : $t('ctr.add')" :style="{ width: '640px' }" :breakpoints="{ '680px': '95vw' }">
      <Message v-if="form.status === 'active'" severity="info" :closable="false" class="mb-3">{{ $t("ctr.active_edit_hint") }}</Message>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="flex flex-column gap-1 sm:col-span-2">
          <label for="ctr-candidate">{{ $t("ctr.candidate") }} <span class="text-red-500">*</span></label>
          <Select inputId="ctr-candidate" v-model="form.candidate_id" :options="candidateOptions" optionValue="id" :optionLabel="(c) => `${c.name_ar || $t('cand.unnamed')} · ${ltr(c.phone)}`"
            filter :filterFields="['name_ar', 'phone']" :disabled="form.status !== 'draft'" :invalid="!!errors.candidate_id" :placeholder="$t('ctr.pick_candidate')" @update:modelValue="onCandidate">
            <template #empty>{{ $t("ctr.no_candidates") }}</template>
          </Select>
          <small v-if="errors.candidate_id" class="text-red-500">{{ errors.candidate_id }}</small>
          <small v-else class="text-color-secondary">{{ $t("ctr.candidate_hint") }}</small>
        </div>
        <div class="flex flex-column gap-1 sm:col-span-2">
          <label for="ctr-vacancy">{{ $t("ctr.job") }} <span class="text-red-500">*</span></label>
          <Select inputId="ctr-vacancy" v-model="form.vacancy_id" :options="vacancyOptions" optionValue="id" :optionLabel="vacancyTitle" filter :filterFields="['title_ar', 'title_en']"
            :disabled="form.status !== 'draft'" :invalid="!!errors.vacancy_id" :placeholder="$t('ctr.pick_vacancy')" @update:modelValue="onVacancy" />
          <small v-if="errors.vacancy_id" class="text-red-500">{{ errors.vacancy_id }}</small>
        </div>
        <div class="flex flex-column gap-1">
          <label for="ctr-start">{{ $t("ctr.start_date") }} <span class="text-red-500">*</span></label>
          <DatePicker inputId="ctr-start" v-model="form.start_date" dateFormat="yy-mm-dd" showIcon :disabled="form.status !== 'draft'" :invalid="!!errors.start_date" />
          <small v-if="errors.start_date" class="text-red-500">{{ errors.start_date }}</small>
        </div>
        <div class="flex flex-column gap-1">
          <label for="ctr-end">{{ $t("ctr.end_date") }}</label>
          <DatePicker inputId="ctr-end" v-model="form.end_date" dateFormat="yy-mm-dd" showIcon showButtonBar :minDate="form.start_date || undefined" :invalid="!!errors.end_date" />
          <small v-if="errors.end_date" class="text-red-500">{{ errors.end_date }}</small>
          <small v-else class="text-color-secondary">{{ $t("ctr.end_hint") }}</small>
        </div>
        <div class="flex flex-column gap-1">
          <label for="ctr-salary">{{ $t("ctr.salary") }}</label>
          <InputNumber inputId="ctr-salary" v-model="form.basic_salary" :min="0" :maxFractionDigits="2" :disabled="form.status !== 'draft'"
            :suffix="` ${currency}`" :invalid="!!errors.basic_salary" />
          <small v-if="errors.basic_salary" class="text-red-500">{{ errors.basic_salary }}</small>
        </div>
        <div class="flex flex-column gap-1">
          <label for="ctr-probation">{{ $t("ctr.probation_days") }}</label>
          <InputNumber inputId="ctr-probation" v-model="form.probation_days" :min="0" :max="365" showButtons :disabled="form.status !== 'draft'" :suffix="` ${$t('ctr.days')}`" />
        </div>
        <div class="flex flex-column gap-1 sm:col-span-2">
          <label for="ctr-notes">{{ $t("ctr.notes") }}</label>
          <Textarea id="ctr-notes" v-model="form.notes" rows="3" autoResize maxlength="5000" />
        </div>
        <div class="flex flex-column gap-1 sm:col-span-2">
          <span class="font-medium">{{ $t("ctr.file") }}</span>
          <div class="flex flex-wrap items-center gap-2">
            <label class="p-button p-component p-button-outlined p-button-sm cursor-pointer">
              <i class="pi pi-upload me-2" />{{ form.file || form.file_name ? $t("ctr.replace_file") : $t("ctr.upload_file") }}
              <input type="file" class="sr-only" accept="application/pdf,image/png,image/jpeg,image/webp" @change="onFile" />
            </label>
            <span v-if="form.file" class="text-sm"><i class="pi pi-file me-1" />{{ form.file.name }}</span>
            <Button v-else-if="form.file_name" :label="form.file_name" icon="pi pi-paperclip" text size="small" @click="openFile(form)" />
          </div>
          <small v-if="errors.file" class="text-red-500">{{ errors.file }}</small>
          <small v-else class="text-color-secondary">{{ $t("ctr.file_hint") }}</small>
        </div>
      </div>
      <template #footer>
        <Button :label="$t('cancel')" text severity="secondary" @click="dialog = false" />
        <Button icon="pi pi-check" :label="$t('save')" :loading="saving" @click="save" />
      </template>
    </Dialog>

    <!-- Hire -->
    <Dialog :visible="!!hiring" modal :header="$t('ctr.hire_title', { name: hiring?.candidate?.name_ar })" :style="{ width: '520px' }" @update:visible="hiring = null">
      <p class="mt-0 mb-4 text-color-secondary">{{ $t("ctr.hire_hint") }}</p>
      <div class="flex flex-column gap-3">
        <div class="flex flex-column gap-1">
          <label for="hire-role">{{ $t("ctr.role") }} <span class="text-red-500">*</span></label>
          <Select inputId="hire-role" v-model="hireForm.role" :options="options.roles" optionLabel="name" optionValue="id" filter :invalid="!!hireErrors.role" />
          <small v-if="hireErrors.role" class="text-red-500">{{ hireErrors.role }}</small>
        </div>
        <div class="flex flex-column gap-1">
          <label for="hire-type">{{ $t("ctr.user_type") }} <span class="text-red-500">*</span></label>
          <Select inputId="hire-type" v-model="hireForm.type" :options="TYPES" optionLabel="name" optionValue="id" />
          <small v-if="hireForm.type === 2" class="text-color-secondary">{{ $t("ctr.therapist_hint") }}</small>
        </div>
        <div class="flex flex-column gap-1">
          <label for="hire-shift">{{ $t("ctr.shift") }} <span class="text-red-500">*</span></label>
          <Select inputId="hire-shift" v-model="hireForm.shift_id" :options="options.shifts" optionLabel="title" optionValue="id" :invalid="!!hireErrors.shift_id" />
          <small v-if="hireErrors.shift_id" class="text-red-500">{{ hireErrors.shift_id }}</small>
        </div>
        <div class="flex flex-column gap-1">
          <label for="hire-position">{{ $t("ctr.position") }}</label>
          <Select inputId="hire-position" v-model="hireForm.position_id" :options="options.positions" optionLabel="title" optionValue="id" showClear />
        </div>
      </div>
      <template #footer>
        <Button :label="$t('cancel')" text severity="secondary" @click="hiring = null" />
        <Button icon="pi pi-user-plus" :label="$t('ctr.confirm_hire')" severity="success" :loading="saving" @click="hire" />
      </template>
    </Dialog>

    <!-- Hired: the temporary password, once -->
    <Dialog :visible="!!hired" modal :header="$t('ctr.hired_title')" :style="{ width: '480px' }" :closable="true" @update:visible="hired = null">
      <div class="flex flex-column gap-3">
        <p class="m-0">{{ $t("ctr.hired_body", { name: hired?.name }) }}</p>
        <div class="ctr-secret">
          <div><small>{{ $t("ctr.login_email") }}</small><bdi dir="ltr">{{ hired?.employee.email }}</bdi></div>
          <Button icon="pi pi-copy" text rounded :aria-label="$t('ctr.copy')" @click="copy(hired?.employee.email)" />
        </div>
        <div class="ctr-secret">
          <div><small>{{ $t("ctr.temp_password") }}</small><bdi dir="ltr" class="font-mono">{{ hired?.password }}</bdi></div>
          <Button icon="pi pi-copy" text rounded :aria-label="$t('ctr.copy')" @click="copy(hired?.password)" />
        </div>
        <Message severity="warn" :closable="false">{{ $t("ctr.password_once") }}</Message>
      </div>
      <template #footer>
        <Button v-if="can('employees list', 'employees edit')" icon="pi pi-id-card" :label="$t('ctr.open_employee')" outlined
          @click="router.push({ name: 'employee-profile', params: { id: hired.employee.user_id } })" />
        <Button :label="$t('ctr.done')" @click="hired = null" />
      </template>
    </Dialog>

    <!-- Renew -->
    <Dialog :visible="!!renewing" modal :header="$t('ctr.renew_title')" :style="{ width: '520px' }" @update:visible="renewing = null">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="flex flex-column gap-1">
          <label for="ren-start">{{ $t("ctr.start_date") }}</label>
          <DatePicker inputId="ren-start" v-model="renewForm.start_date" dateFormat="yy-mm-dd" showIcon />
        </div>
        <div class="flex flex-column gap-1">
          <label for="ren-end">{{ $t("ctr.end_date") }}</label>
          <DatePicker inputId="ren-end" v-model="renewForm.end_date" dateFormat="yy-mm-dd" showIcon showButtonBar :minDate="renewForm.start_date" />
        </div>
        <div class="flex flex-column gap-1 sm:col-span-2">
          <label for="ren-salary">{{ $t("ctr.salary") }}</label>
          <InputNumber inputId="ren-salary" v-model="renewForm.basic_salary" :min="0" :maxFractionDigits="2" :suffix="` ${currency}`" />
          <small class="text-color-secondary">{{ $t("ctr.renew_salary_hint") }}</small>
        </div>
        <div class="flex flex-column gap-1 sm:col-span-2">
          <label for="ren-notes">{{ $t("ctr.notes") }}</label>
          <Textarea id="ren-notes" v-model="renewForm.notes" rows="2" autoResize />
        </div>
        <label class="p-button p-component p-button-outlined p-button-sm cursor-pointer sm:col-span-2 justify-center">
          <i class="pi pi-upload me-2" />{{ renewForm.file ? renewForm.file.name : $t("ctr.upload_file") }}
          <input type="file" class="sr-only" accept="application/pdf,image/png,image/jpeg,image/webp" @change="(e) => (renewForm.file = e.target.files?.[0] ?? null)" />
        </label>
      </div>
      <template #footer>
        <Button :label="$t('cancel')" text severity="secondary" @click="renewing = null" />
        <Button icon="pi pi-refresh" :label="$t('ctr.renew')" :loading="saving" @click="renew" />
      </template>
    </Dialog>

    <!-- End / cancel -->
    <Dialog :visible="!!ending" modal :header="ending?.status === 'draft' ? $t('ctr.cancel_title') : $t('ctr.end_title')" :style="{ width: '480px' }" @update:visible="ending = null">
      <div class="flex flex-column gap-3">
        <p class="m-0 text-color-secondary">{{ ending?.status === "draft" ? $t("ctr.cancel_hint") : $t("ctr.end_hint_text") }}</p>
        <div v-if="ending?.status === 'active'" class="flex flex-column gap-1">
          <label for="end-on">{{ $t("ctr.last_day") }}</label>
          <DatePicker inputId="end-on" v-model="endForm.ended_on" dateFormat="yy-mm-dd" showIcon />
        </div>
        <div class="flex flex-column gap-1">
          <label for="end-reason">{{ $t("ctr.reason") }} <span class="text-red-500">*</span></label>
          <Textarea id="end-reason" v-model="endForm.reason" rows="3" autoResize maxlength="500" :invalid="!!endError" />
          <small v-if="endError" class="text-red-500">{{ endError }}</small>
        </div>
      </div>
      <template #footer>
        <Button :label="$t('cancel')" text severity="secondary" @click="ending = null" />
        <Button icon="pi pi-ban" severity="warn" :label="ending?.status === 'draft' ? $t('ctr.cancel') : $t('ctr.end')" :loading="saving" @click="end" />
      </template>
    </Dialog>

    <Dialog :visible="!!removing" modal :header="$t('ctr.archive')" :style="{ width: '420px' }" @update:visible="removing = null">
      <p class="m-0">{{ $t("ctr.archive_confirm") }}</p>
      <template #footer>
        <Button :label="$t('cancel')" text severity="secondary" @click="removing = null" />
        <Button icon="pi pi-box" severity="danger" :label="$t('ctr.archive')" @click="remove" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.ctr-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.75rem; }
.ctr-card { display: grid; grid-template-columns: auto 1fr; grid-template-rows: auto auto; column-gap: 0.75rem; align-items: center; text-align: start;
  padding: 0.9rem 1rem; border-radius: 16px; border: 1px solid var(--p-content-border-color); background: var(--p-content-background, #fff); cursor: pointer; transition: box-shadow 0.15s, border-color 0.15s; }
.ctr-card i { grid-row: span 2; font-size: 1.4rem; color: var(--tone); background: color-mix(in srgb, var(--tone) 12%, transparent); width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center; }
.ctr-card__n { font-size: 1.4rem; font-weight: 800; }
.ctr-card__label { font-size: 0.82rem; color: var(--p-text-muted-color); }
.ctr-card.is-on { border-color: var(--tone); box-shadow: 0 0 0 3px color-mix(in srgb, var(--tone) 20%, transparent); }
.ctr-secret { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; background: var(--p-surface-100, #f1f5f9); border-radius: 12px; padding: 0.6rem 0.9rem; }
.ctr-secret div { display: grid; }
.ctr-secret small { color: var(--p-text-muted-color); }
</style>
