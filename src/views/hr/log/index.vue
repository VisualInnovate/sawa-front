<script setup>
// «سجل العمليات»: every HR operation (who, when, on what, the values before and after), newest first; read only.
// Inside the employee's profile it shows only that employee's operations.
import axios from "axios";
import moment from "moment";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({ employeeId: { type: Number, default: null } });
const { t, te, locale } = useI18n();

const rows = ref([]);
const total = ref(0);
const loading = ref(false);
const options = ref({ users: [], employees: [], subject_types: [], actions: [] });
const filters = ref({ user_id: null, employee_id: null, action: null, subject_type: null, range: null, search: "" });
const page = ref({ first: 0, rows: 25 });
const expanded = ref({});

const severity = { created: "success", updated: "info", archived: "warn", deleted: "danger", restored: "success", approved: "success", rejected: "danger", status_changed: "info" };
const actionLabel = (a) => (te(`hrlog.action_${a}`) ? t(`hrlog.action_${a}`) : a);
const subjectLabel = (s) => (te(`hrlog.subject_${s}`) ? t(`hrlog.subject_${s}`) : s);
const fieldLabel = (f) => (te(`hrlog.field_${f}`) ? t(`hrlog.field_${f}`) : f);

const actionOptions = computed(() => options.value.actions.map((value) => ({ value, label: actionLabel(value) })));
const subjectOptions = computed(() => options.value.subject_types.map((value) => ({ value, label: subjectLabel(value) })));

const params = () => {
  const [from, to] = filters.value.range ?? [];
  return {
    employee_id: props.employeeId || filters.value.employee_id || undefined,
    user_id: filters.value.user_id || undefined,
    action: filters.value.action || undefined,
    subject_type: filters.value.subject_type || undefined,
    search: filters.value.search?.trim() || undefined,
    from: from ? moment(from).format("YYYY-MM-DD") : undefined,
    to: to ? moment(to).format("YYYY-MM-DD") : undefined,
  };
};

// The filtered entries as Excel, with the titles, actions and subjects in the reader's language.
const exporting = ref(false);
async function exportLog() {
  exporting.value = true;
  try {
    const { data } = await axios.get("api/hr-log/export", {
      responseType: "blob",
      params: {
        ...params(),
        title: t("hrlog.title"),
        rtl: locale.value === "ar" ? 1 : 0,
        headers: ["time", "user", "action", "subject", "subject_name", "employee", "changes"].map((k) => t(`hrlog.x_${k}`)).concat("IP"),
        actions: Object.fromEntries(options.value.actions.map((a) => [a, actionLabel(a)])),
        subjects: Object.fromEntries(options.value.subject_types.map((s) => [s, subjectLabel(s)])),
      },
    });
    const link = Object.assign(document.createElement("a"), { href: URL.createObjectURL(data), download: `hr-log-${moment().format("YYYY-MM-DD")}.xlsx` });
    link.click();
    URL.revokeObjectURL(link.href);
  } finally {
    exporting.value = false;
  }
}

async function load() {
  loading.value = true;
  const [from, to] = filters.value.range ?? [];
  try {
    const { data } = await axios.get("api/hr-log", {
      params: {
        employee_id: props.employeeId || filters.value.employee_id || undefined,
        user_id: filters.value.user_id || undefined,
        action: filters.value.action || undefined,
        subject_type: filters.value.subject_type || undefined,
        search: filters.value.search?.trim() || undefined,
        from: from ? moment(from).format("YYYY-MM-DD") : undefined,
        to: to ? moment(to).format("YYYY-MM-DD") : undefined,
        page: page.value.first / page.value.rows + 1,
        per_page: page.value.rows,
      },
    });
    rows.value = data.data;
    total.value = data.meta.total;
    options.value = data.options;
  } finally {
    loading.value = false;
  }
}

const applyFilters = () => {
  page.value.first = 0;
  load();
};
const onPage = (event) => {
  page.value = { first: event.first, rows: event.rows };
  load();
};

// One row per changed field: before → after.
const diff = (changes) => {
  const before = changes?.before ?? {};
  const after = changes?.after ?? {};
  return [...new Set([...Object.keys(before), ...Object.keys(after)])].map((field) => ({ field, before: before[field], after: after[field] }));
};
const show = (value) => (value === null || value === undefined || value === "" ? "—" : typeof value === "object" ? JSON.stringify(value) : String(value));

onMounted(load);
</script>

<template>
  <div>
    <p v-if="!employeeId" class="text-xl p-4 text-bp-135c65 font-bold m-0">{{ $t("hrlog.title") }}</p>
    <div class="sawa-card p-3 flex flex-wrap items-end gap-2 mb-3">
      <div class="flex flex-column gap-1">
        <label for="log-user" class="text-sm">{{ $t("hrlog.user") }}</label>
        <Select inputId="log-user" v-model="filters.user_id" :options="options.users" optionLabel="name" optionValue="id" filter showClear class="w-14rem" />
      </div>
      <div v-if="!employeeId" class="flex flex-column gap-1">
        <label for="log-employee" class="text-sm">{{ $t("hrlog.employee") }}</label>
        <Select inputId="log-employee" v-model="filters.employee_id" :options="options.employees" optionLabel="name" optionValue="id" filter showClear class="w-14rem" />
      </div>
      <div class="flex flex-column gap-1">
        <label for="log-action" class="text-sm">{{ $t("hrlog.action") }}</label>
        <Select inputId="log-action" v-model="filters.action" :options="actionOptions" optionLabel="label" optionValue="value" showClear class="w-12rem" />
      </div>
      <div class="flex flex-column gap-1">
        <label for="log-subject" class="text-sm">{{ $t("hrlog.subject") }}</label>
        <Select inputId="log-subject" v-model="filters.subject_type" :options="subjectOptions" optionLabel="label" optionValue="value" filter showClear class="w-14rem" />
      </div>
      <div class="flex flex-column gap-1">
        <label for="log-range" class="text-sm">{{ $t("hrlog.period") }}</label>
        <DatePicker inputId="log-range" v-model="filters.range" selectionMode="range" showButtonBar dateFormat="yy-mm-dd" class="w-14rem" />
      </div>
      <div class="flex flex-column gap-1">
        <label for="log-search" class="text-sm">{{ $t("hrlog.search") }}</label>
        <InputText id="log-search" v-model="filters.search" class="w-14rem" @keyup.enter="applyFilters" />
      </div>
      <Button icon="pi pi-search" :label="$t('hrlog.apply')" @click="applyFilters" />
      <Button icon="pi pi-file-excel" label="Excel" outlined severity="success" :loading="exporting" :disabled="!total" @click="exportLog" />
    </div>

    <DataTable :value="rows" :loading="loading" dataKey="id" lazy paginator :rows="page.rows" :first="page.first" :totalRecords="total"
      :rowsPerPageOptions="[25, 50, 100]" v-model:expandedRows="expanded" size="small" stripedRows @page="onPage">
      <template #empty>{{ $t("no_data_found") }}</template>
      <Column expander header-style="width:3rem" />
      <Column :header="$t('hrlog.time')">
        <template #body="{ data }"><span dir="ltr" class="whitespace-nowrap">{{ moment(data.created_at).format("YYYY-MM-DD HH:mm") }}</span></template>
      </Column>
      <Column :header="$t('hrlog.user')">
        <template #body="{ data }">{{ data.user?.name || $t("hrlog.system") }}</template>
      </Column>
      <Column :header="$t('hrlog.action')">
        <template #body="{ data }"><Tag :severity="severity[data.action] ?? 'secondary'" :value="actionLabel(data.action)" /></template>
      </Column>
      <Column :header="$t('hrlog.subject')">
        <template #body="{ data }">
          <div class="font-medium">{{ subjectLabel(data.subject_type) }} <span class="text-color-secondary">#{{ data.subject_id }}</span></div>
          <small v-if="data.subject_label" class="text-color-secondary">{{ data.subject_label }}</small>
        </template>
      </Column>
      <Column :header="$t('hrlog.changes')">
        <template #body="{ data }">{{ data.changes ? $t("hrlog.fields", { n: diff(data.changes).length }) : "—" }}</template>
      </Column>
      <Column header="IP">
        <template #body="{ data }"><span dir="ltr" class="text-color-secondary">{{ data.ip || "—" }}</span></template>
      </Column>
      <template #expansion="{ data }">
        <div class="p-2">
          <table v-if="data.changes" class="w-full text-sm border-collapse">
            <thead>
              <tr class="text-color-secondary">
                <th class="text-start p-1">{{ $t("hrlog.field") }}</th>
                <th class="text-start p-1">{{ $t("hrlog.before") }}</th>
                <th class="text-start p-1">{{ $t("hrlog.after") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in diff(data.changes)" :key="row.field" class="border-t border-surface-200">
                <td class="p-1 font-medium">{{ fieldLabel(row.field) }}</td>
                <td class="p-1 text-red-600 break-all">{{ show(row.before) }}</td>
                <td class="p-1 text-green-700 break-all">{{ show(row.after) }}</td>
              </tr>
            </tbody>
          </table>
          <small v-else class="text-color-secondary">{{ $t("hrlog.no_changes") }}</small>
          <small v-if="data.user_agent" class="block mt-2 text-color-secondary" dir="ltr">{{ data.user_agent }}</small>
        </div>
      </template>
    </DataTable>
  </div>
</template>
