<script setup>
// «معايير المقابلات»: the questions a department head answers at a candidate's interview, per department (or for all
// departments). One choice, several choices or text; each option may carry a score, and the interview shows the total
// as a percentage. A finished interview keeps its own copy, so editing here does not change past ones.
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { errorText } from "@/utils/accounting";
import { can } from "@/utils/permissions";

const { t } = useI18n();
const toast = useToast();

const rows = ref([]);
const departments = ref([]);
const department = ref("all");
const loading = ref(false);
const dialog = ref(false);
const form = ref({});
const saving = ref(false);
const removing = ref(null);
const tried = ref(false);

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get("api/interview-criteria");
    rows.value = data.data;
    departments.value = data.departments;
  } finally {
    loading.value = false;
  }
}
onMounted(load);

const filterOptions = computed(() => [
  { value: "all", label: t("icr.all_rows") },
  { value: null, label: t("icr.every_department") },
  ...departments.value.map((d) => ({ value: d.id, label: d.title })),
]);
const departmentOptions = computed(() => [{ value: null, label: t("icr.every_department") }, ...departments.value.map((d) => ({ value: d.id, label: d.title }))]);
const typeOptions = computed(() => ["single", "multiple", "text"].map((value) => ({ value, label: t(`icr.type_${value}`) })));
const visible = computed(() => (department.value === "all" ? rows.value : rows.value.filter((r) => r.department_id === department.value)));

function openNew() {
  tried.value = false;
  form.value = { department_id: department.value === "all" ? null : department.value, title: "", type: "single", required: true, is_active: true,
    options: [{ label: "", score: null }, { label: "", score: null }] };
  dialog.value = true;
}
function openEdit(row) {
  tried.value = false;
  form.value = JSON.parse(JSON.stringify(row));
  if (!form.value.options?.length) form.value.options = [{ label: "", score: null }, { label: "", score: null }];
  dialog.value = true;
}

const errors = computed(() => {
  const e = {};
  if (!form.value.title?.trim()) e.title = t("icr.title_required");
  if (form.value.type !== "text") {
    const labels = form.value.options.map((o) => o.label.trim());
    if (labels.filter(Boolean).length < 2) e.options = t("icr.options_min");
    else if (labels.some((l) => !l)) e.options = t("icr.option_empty");
    else if (new Set(labels).size !== labels.length) e.options = t("icr.option_repeat");
  }
  return e;
});

async function save() {
  tried.value = true;
  if (Object.keys(errors.value).length) return;
  saving.value = true;
  const body = { ...form.value, title: form.value.title.trim(),
    options: form.value.type === "text" ? undefined : form.value.options.map((o) => ({ label: o.label.trim(), score: o.score ?? null })) };
  try {
    if (form.value.id) await axios.put(`api/interview-criteria/${form.value.id}`, body);
    else await axios.post("api/interview-criteria", body);
    dialog.value = false;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("icr.saved"), life: 2500 });
    await load();
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  } finally {
    saving.value = false;
  }
}

async function toggle(row) {
  try {
    await axios.put(`api/interview-criteria/${row.id}`, { ...row, options: row.type === "text" ? undefined : row.options });
  } catch (error) {
    row.is_active = !row.is_active;
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  }
}

async function remove() {
  try {
    await axios.delete(`api/interview-criteria/${removing.value.id}`);
    removing.value = null;
    await load();
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  }
}

const maxOf = (row) => {
  const scores = (row.options ?? []).map((o) => o.score).filter((s) => s !== null && s !== undefined && s !== "");
  if (row.type === "text" || !scores.length) return null;
  return row.type === "multiple" ? scores.filter((s) => s > 0).reduce((a, b) => a + Number(b), 0) : Math.max(...scores);
};
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-2 p-4">
      <p class="text-xl text-bp-135c65 font-bold m-0">{{ $t("icr.title") }}</p>
      <Button v-if="can('hr lists create')" icon="pi pi-plus" :label="$t('icr.add')" @click="openNew" />
    </div>
    <Toast />

    <div class="sawa-card p-3 flex flex-column gap-3">
      <p class="m-0 text-color-secondary">{{ $t("icr.hint") }}</p>
      <Select v-model="department" :options="filterOptions" optionLabel="label" optionValue="value" filter class="w-18rem" :aria-label="$t('icr.department')" />

      <DataTable :value="visible" :loading="loading" dataKey="id" size="small" stripedRows>
        <template #empty>{{ $t("icr.empty") }}</template>
        <Column :header="$t('icr.question')">
          <template #body="{ data }">
            <div :class="{ 'opacity-50': !data.is_active }">
              <strong>{{ data.title }}</strong> <span v-if="data.required" class="text-red-500">*</span>
              <div v-if="data.options?.length" class="flex flex-wrap gap-1 mt-1">
                <Tag v-for="(o, i) in data.options" :key="i" severity="secondary" :value="o.score !== null && o.score !== undefined ? `${o.label} (${o.score})` : o.label" />
              </div>
            </div>
          </template>
        </Column>
        <Column :header="$t('icr.department')">
          <template #body="{ data }">{{ data.department?.title || $t("icr.every_department") }}</template>
        </Column>
        <Column :header="$t('icr.type')">
          <template #body="{ data }">{{ $t(`icr.type_${data.type}`) }}</template>
        </Column>
        <Column :header="$t('icr.max')">
          <template #body="{ data }">{{ maxOf(data) ?? "—" }}</template>
        </Column>
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
    </div>

    <Dialog v-model:visible="dialog" modal :header="form.id ? $t('icr.edit') : $t('icr.add')" :style="{ width: '600px' }" :breakpoints="{ '640px': '95vw' }">
      <div class="flex flex-column gap-3">
        <div class="flex flex-column gap-1">
          <label for="icr-title">{{ $t("icr.question") }} <span class="text-red-500">*</span></label>
          <InputText id="icr-title" v-model="form.title" maxlength="300" :invalid="tried && !!errors.title" />
          <small v-if="tried && errors.title" class="text-red-500">{{ errors.title }}</small>
        </div>
        <div class="flex flex-wrap gap-3">
          <div class="flex flex-column gap-1 flex-1">
            <label for="icr-dep">{{ $t("icr.department") }}</label>
            <Select inputId="icr-dep" v-model="form.department_id" :options="departmentOptions" optionLabel="label" optionValue="value" filter />
          </div>
          <div class="flex flex-column gap-1">
            <label for="icr-type">{{ $t("icr.type") }}</label>
            <Select inputId="icr-type" v-model="form.type" :options="typeOptions" optionLabel="label" optionValue="value" class="w-12rem" />
          </div>
        </div>
        <div v-if="form.type !== 'text'" class="flex flex-column gap-2">
          <div class="flex items-center justify-between">
            <label>{{ $t("icr.options") }}</label>
            <small class="text-color-secondary">{{ $t("icr.score_hint") }}</small>
          </div>
          <div v-for="(o, i) in form.options" :key="i" class="flex items-center gap-2">
            <InputText v-model="o.label" :placeholder="$t('icr.option_n', { n: i + 1 })" :aria-label="$t('icr.option_n', { n: i + 1 })" class="flex-1" maxlength="200" />
            <InputNumber v-model="o.score" :placeholder="$t('icr.score')" :aria-label="$t('icr.score')" :min="-100" :max="100" :maxFractionDigits="2" inputClass="w-6rem" />
            <Button icon="pi pi-times" text rounded severity="danger" :aria-label="$t('delete')" :disabled="form.options.length <= 2" @click="form.options.splice(i, 1)" />
          </div>
          <Button icon="pi pi-plus" :label="$t('icr.add_option')" size="small" text class="self-start" :disabled="form.options.length >= 20" @click="form.options.push({ label: '', score: null })" />
          <small v-if="tried && errors.options" class="text-red-500">{{ errors.options }}</small>
        </div>
        <div class="flex flex-wrap gap-4">
          <div class="flex items-center gap-2">
            <ToggleSwitch v-model="form.required" inputId="icr-req" />
            <label for="icr-req">{{ $t("icr.required") }}</label>
          </div>
          <div class="flex items-center gap-2">
            <ToggleSwitch v-model="form.is_active" inputId="icr-active" />
            <label for="icr-active">{{ form.is_active ? $t("hrset.shown") : $t("hrset.hidden") }}</label>
          </div>
        </div>
      </div>
      <template #footer>
        <Button :label="$t('cancel')" text severity="secondary" @click="dialog = false" />
        <Button icon="pi pi-check" :label="$t('save')" :loading="saving" @click="save" />
      </template>
    </Dialog>

    <Dialog :visible="!!removing" modal :header="$t('delete')" :style="{ width: '420px' }" @update:visible="removing = null">
      <p class="m-0">{{ $t("icr.delete_confirm", { name: removing?.title }) }}</p>
      <template #footer>
        <Button :label="$t('cancel')" text severity="secondary" @click="removing = null" />
        <Button icon="pi pi-trash" severity="danger" :label="$t('delete')" @click="remove" />
      </template>
    </Dialog>
  </div>
</template>
