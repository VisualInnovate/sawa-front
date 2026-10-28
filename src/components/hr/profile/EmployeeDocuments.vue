<script setup>
// The employee's documents (profile tab): type from the HR list or a free title, number, issue and expiry dates and
// the file. A document warns before it expires (alert days from the HR settings). Archived, never deleted.
import axios from "axios";
import moment from "moment";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { errorText } from "@/utils/accounting";
import { can } from "@/utils/permissions";

const props = defineProps({ employeeId: { type: Number, required: true }, archived: { type: Boolean, default: false } });
const emit = defineEmits(["changed"]);
const { t, te, locale } = useI18n();
const toast = useToast();

const rows = ref([]);
const types = ref([]);
const fromApplication = ref(false);
const alertDays = ref(30);
const loading = ref(false);
const ar = computed(() => locale.value === "ar");
const editable = computed(() => !props.archived);

const msg = (error) => {
  const first = Object.values(error.response?.data?.errors ?? {})[0]?.[0] ?? error.response?.data?.message;
  return typeof first === "string" && first.startsWith("hr.") && te(`edoc.err.${first.slice(3)}`) ? t(`edoc.err.${first.slice(3)}`) : errorText(error);
};
const date = (d) => (d ? moment(d).format("YYYY-MM-DD") : "—");
const daysLeft = (d) => moment(d).startOf("day").diff(moment().startOf("day"), "days");

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get("api/employee-documents", { params: { employee_id: props.employeeId } });
    rows.value = data.data;
    types.value = data.types;
    fromApplication.value = data.from_application;
    alertDays.value = data.alert_days;
  } finally {
    loading.value = false;
  }
}
onMounted(load);

async function openFile(row) {
  const { data } = await axios.get(`api/employee-documents/${row.id}/file`, { responseType: "blob" });
  window.open(URL.createObjectURL(data), "_blank", "noopener");
}

// ---- Add / edit ----
const OTHER = 0;
const dialog = ref(false);
const form = ref({});
const errors = ref({});
const saving = ref(false);
const typeOptions = computed(() => [...types.value.map((x) => ({ id: x.id, name: ar.value ? x.name_ar : x.name_en || x.name_ar })), { id: OTHER, name: t("edoc.other") }]);
function openNew() {
  form.value = { id: null, lookup_id: types.value[0]?.id ?? OTHER, title: "", number: "", issue_date: null, expiry_date: null, notes: "", file: null, file_name: null };
  errors.value = {};
  dialog.value = true;
}
function openEdit(row) {
  form.value = { ...row, lookup_id: row.lookup_id ?? OTHER, title: row.lookup_id ? "" : row.title, issue_date: row.issue_date ? new Date(row.issue_date) : null,
    expiry_date: row.expiry_date ? new Date(row.expiry_date) : null, file: null };
  errors.value = {};
  dialog.value = true;
}
function onFile(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  if (!/^(application\/pdf|image\/(png|jpe?g|webp))$/.test(file.type)) return (errors.value = { ...errors.value, file: t("edoc.err.file_type") });
  if (file.size > 10 * 1024 * 1024) return (errors.value = { ...errors.value, file: t("edoc.err.file_size_10") });
  const { file: _, ...rest } = errors.value;
  errors.value = rest;
  form.value.file = file;
}
function check() {
  const e = {};
  if (form.value.lookup_id === OTHER && !form.value.title?.trim()) e.title = t("edoc.err.document_title");
  if (form.value.issue_date && form.value.expiry_date && moment(form.value.expiry_date).isBefore(form.value.issue_date, "day")) e.expiry_date = t("edoc.err.expiry_before_issue");
  if (!form.value.id && !form.value.file) e.file = t("edoc.err.file_required");
  if (errors.value.file && form.value.file === null) e.file = errors.value.file;
  errors.value = e;
  return !Object.keys(e).length;
}
async function save() {
  if (!check()) return;
  saving.value = true;
  const body = new FormData();
  const put = (k, v) => v !== null && v !== undefined && v !== "" && body.append(k, v);
  if (!form.value.id) put("employee_id", props.employeeId);
  if (form.value.lookup_id !== OTHER) put("lookup_id", form.value.lookup_id);
  put("title", form.value.title?.trim());
  put("number", form.value.number?.trim());
  put("issue_date", form.value.issue_date ? moment(form.value.issue_date).format("YYYY-MM-DD") : null);
  put("expiry_date", form.value.expiry_date ? moment(form.value.expiry_date).format("YYYY-MM-DD") : null);
  put("notes", form.value.notes?.trim());
  put("file", form.value.file);
  try {
    await axios.post(form.value.id ? `api/employee-documents/${form.value.id}` : "api/employee-documents", body);
    dialog.value = false;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("edoc.saved"), life: 2500 });
    await load();
    emit("changed");
  } catch (error) {
    errors.value = Object.fromEntries(Object.entries(error.response?.data?.errors ?? {}).map(([k, v]) => [k, te(`edoc.err.${String(v[0]).slice(3)}`) ? t(`edoc.err.${String(v[0]).slice(3)}`) : v[0]]));
    toast.add({ severity: "error", summary: t("error"), detail: msg(error), life: 5000 });
  } finally {
    saving.value = false;
  }
}

const removing = ref(null);
async function remove() {
  try {
    await axios.delete(`api/employee-documents/${removing.value.id}`);
    removing.value = null;
    await load();
    emit("changed");
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: msg(error), life: 5000 });
  }
}

const importing = ref(false);
async function importFiles() {
  importing.value = true;
  try {
    const { data } = await axios.post(`api/employee-documents/import/${props.employeeId}`);
    toast.add({ severity: data.data.copied ? "success" : "info", summary: t("edoc.imported", { n: data.data.copied }), life: 3000 });
    await load();
    emit("changed");
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: msg(error), life: 5000 });
  } finally {
    importing.value = false;
  }
}
</script>

<template>
  <div class="flex flex-column gap-3">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <small class="text-color-secondary">{{ $t("edoc.hint", { n: alertDays }) }}</small>
      <div v-if="editable" class="flex flex-wrap gap-2">
        <Button v-if="fromApplication && can('employee documents create')" icon="pi pi-download" :label="$t('edoc.import')" outlined size="small" :loading="importing" @click="importFiles" />
        <Button v-if="can('employee documents create')" icon="pi pi-plus" :label="$t('edoc.add')" size="small" @click="openNew" />
      </div>
    </div>

    <DataTable :value="rows" :loading="loading" dataKey="id" size="small" stripedRows responsiveLayout="scroll">
      <template #empty>{{ $t("edoc.empty") }}</template>
      <Column :header="$t('edoc.document')">
        <template #body="{ data }">
          <div class="font-medium">{{ data.title }}</div>
          <small v-if="data.number" class="text-color-secondary"><bdi dir="ltr">{{ data.number }}</bdi></small>
        </template>
      </Column>
      <Column :header="$t('edoc.issue_date')">
        <template #body="{ data }"><bdi dir="ltr">{{ date(data.issue_date) }}</bdi></template>
      </Column>
      <Column :header="$t('edoc.expiry_date')">
        <template #body="{ data }">
          <div class="flex flex-wrap items-center gap-2">
            <bdi dir="ltr">{{ date(data.expiry_date) }}</bdi>
            <Tag v-if="data.alert === 'expired'" severity="danger" :value="$t('edoc.expired')" />
            <Tag v-else-if="data.alert === 'expiring'" severity="warn" :value="$t('edoc.expires_in', { n: daysLeft(data.expiry_date) })" />
          </div>
        </template>
      </Column>
      <Column :header="$t('edoc.notes')">
        <template #body="{ data }"><small class="text-color-secondary">{{ data.notes || "—" }}</small></template>
      </Column>
      <Column header-style="min-width:9rem">
        <template #body="{ data }">
          <div class="table-actions">
            <Button v-if="data.file_name" icon="pi pi-paperclip" rounded variant="outlined" severity="secondary" v-tooltip.top="data.file_name" :aria-label="$t('edoc.open_file')" @click="openFile(data)" />
            <Button v-if="editable && can('employee documents edit')" icon="pi pi-pencil" rounded variant="outlined" severity="info" v-tooltip.top="$t('edit')" :aria-label="$t('edit')" @click="openEdit(data)" />
            <Button v-if="editable && can('employee documents delete')" icon="pi pi-box" rounded variant="outlined" severity="danger" v-tooltip.top="$t('edoc.archive')" :aria-label="$t('edoc.archive')" @click="removing = data" />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialog" modal :header="form.id ? $t('edoc.edit') : $t('edoc.add')" :style="{ width: '560px' }" :breakpoints="{ '600px': '95vw' }">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="flex flex-column gap-1 sm:col-span-2">
          <label for="doc-type">{{ $t("edoc.type") }}</label>
          <Select inputId="doc-type" v-model="form.lookup_id" :options="typeOptions" optionLabel="name" optionValue="id" filter />
        </div>
        <div v-if="form.lookup_id === OTHER" class="flex flex-column gap-1 sm:col-span-2">
          <label for="doc-title">{{ $t("edoc.title") }} <span class="text-red-500">*</span></label>
          <InputText id="doc-title" v-model="form.title" maxlength="150" :invalid="!!errors.title" />
          <small v-if="errors.title" class="text-red-500">{{ errors.title }}</small>
        </div>
        <div class="flex flex-column gap-1 sm:col-span-2">
          <label for="doc-number">{{ $t("edoc.number") }}</label>
          <InputText id="doc-number" v-model="form.number" maxlength="100" dir="ltr" class="text-start" />
        </div>
        <div class="flex flex-column gap-1">
          <label for="doc-issue">{{ $t("edoc.issue_date") }}</label>
          <DatePicker inputId="doc-issue" v-model="form.issue_date" dateFormat="yy-mm-dd" showIcon showButtonBar />
        </div>
        <div class="flex flex-column gap-1">
          <label for="doc-expiry">{{ $t("edoc.expiry_date") }}</label>
          <DatePicker inputId="doc-expiry" v-model="form.expiry_date" dateFormat="yy-mm-dd" showIcon showButtonBar :minDate="form.issue_date || undefined" :invalid="!!errors.expiry_date" />
          <small v-if="errors.expiry_date" class="text-red-500">{{ errors.expiry_date }}</small>
          <small v-else class="text-color-secondary">{{ $t("edoc.expiry_hint") }}</small>
        </div>
        <div class="flex flex-column gap-1 sm:col-span-2">
          <label for="doc-notes">{{ $t("edoc.notes") }}</label>
          <Textarea id="doc-notes" v-model="form.notes" rows="2" autoResize maxlength="2000" />
        </div>
        <div class="flex flex-column gap-1 sm:col-span-2">
          <span class="font-medium">{{ $t("edoc.file") }} <span v-if="!form.id" class="text-red-500">*</span></span>
          <div class="flex flex-wrap items-center gap-2">
            <label class="p-button p-component p-button-outlined p-button-sm cursor-pointer">
              <i class="pi pi-upload me-2" />{{ form.file || form.file_name ? $t("edoc.replace_file") : $t("edoc.upload_file") }}
              <input type="file" class="sr-only" accept="application/pdf,image/png,image/jpeg,image/webp" @change="onFile" />
            </label>
            <span v-if="form.file" class="text-sm"><i class="pi pi-file me-1" />{{ form.file.name }}</span>
            <span v-else-if="form.file_name" class="text-sm text-color-secondary"><i class="pi pi-paperclip me-1" />{{ form.file_name }}</span>
          </div>
          <small v-if="errors.file" class="text-red-500">{{ errors.file }}</small>
          <small v-else class="text-color-secondary">{{ $t("edoc.file_hint") }}</small>
        </div>
      </div>
      <template #footer>
        <Button :label="$t('cancel')" text severity="secondary" @click="dialog = false" />
        <Button icon="pi pi-check" :label="$t('save')" :loading="saving" @click="save" />
      </template>
    </Dialog>

    <Dialog :visible="!!removing" modal :header="$t('edoc.archive')" :style="{ width: '420px' }" @update:visible="removing = null">
      <p class="m-0">{{ $t("edoc.archive_confirm", { name: removing?.title }) }}</p>
      <template #footer>
        <Button :label="$t('cancel')" text severity="secondary" @click="removing = null" />
        <Button icon="pi pi-box" severity="danger" :label="$t('edoc.archive')" @click="remove" />
      </template>
    </Dialog>
  </div>
</template>
