<script setup>
// «مسير الرواتب»: the month's run like Sawa's payroll sheet. A row per employee filled from the employee's payroll
// file and the month's approved items; every number can change while the month is a draft. Approving locks it and
// makes the accounting entry; then the salaries and the separate extras are marked paid. Three sheets: salaries,
// the extras paid separately, and the social insurance; the bank files and the cheques list come from the server.
import axios from "axios";
import moment from "moment";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { errorText } from "@/utils/accounting";
import { can } from "@/utils/permissions";
import { escapeHtml as esc, PRINT_STYLE, printHtml } from "@/utils/printHtml";
import { printPayslip } from "@/components/hr/payslip";

const { t, te, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const months = ref([]);
const month = ref(route.query.month || moment().subtract(1, "month").format("YYYY-MM"));
const run = ref(null);
const loading = ref(false);
const tab = ref("salaries");
const busy = ref(false);

const saudi = computed(() => run.value?.country === "SA");
const taxOn = computed(() => !!run.value?.income_tax);
const currency = computed(() => (run.value?.currency === "SAR" ? t("vac.sar") : t("vac.jod")));
const draft = computed(() => (run.value?.status ?? "draft") === "draft");
const rows = computed(() => run.value?.rows ?? []);
const money = (v) => Number(v ?? 0).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const STATUS_SEVERITY = { draft: "warn", approved: "info", paid: "success" };
// Months and dates stay left-to-right inside Arabic sentences.
const ltr = (s) => String.fromCharCode(0x2066) + s + String.fromCharCode(0x2069);

const msg = (error) => {
  const code = error.response?.data?.message;
  return typeof code === "string" && code.startsWith("hr.") && te(`run.err.${code.slice(3)}`) ? t(`run.err.${code.slice(3)}`) : errorText(error);
};
const fail = (error) => toast.add({ severity: "error", summary: t("error"), detail: msg(error), life: 5000 });

// The salary sheet's columns: the extras columns count only what is paid with the salary.
const inSalary = (r, key) => (["fixed_extra", "variable_extra"].includes(key) && r.extra_paid === "separate" ? 0 : Number(r[key] ?? 0));
const salaryColumns = computed(() => [
  { key: "base_salary" },
  ...(saudi.value ? [{ key: "housing" }, { key: "transport" }, { key: "other_allowance" }] : []),
  { key: "insurance_salary" },
  { key: "fixed_extra", note: "fixed_extra_note" },
  { key: "variable_extra", note: "variable_extra_note" },
  { key: "deduction", note: "deduction_note", minus: true },
  { key: "before_insurance", calc: true },
  { key: "insurance", minus: true },
  { key: "health_insurance", minus: true },
  { key: "life_fund", minus: true },
  ...(taxOn.value ? [{ key: "income_tax", minus: true }] : []),
  { key: "after_insurance", calc: true },
  { key: "financial_advance", minus: true },
  { key: "total_salary", calc: true, strong: true },
  { key: "insurance_employer" },
  ...(saudi.value ? [{ key: "eos_provision" }] : []),
  ...(taxOn.value ? [{ key: "tax_estimate", calc: true }, { key: "salary_and_extras", calc: true }] : []),
]);
const totals = computed(() => Object.fromEntries(salaryColumns.value.map((c) => [c.key, rows.value.reduce((s, r) => s + inSalary(r, c.key), 0)])));

const extraRows = computed(() => rows.value.filter((r) => r.extra_paid === "separate" && (Number(r.fixed_extra) || Number(r.variable_extra))));
const extraTotals = computed(() => ({
  fixed_extra: extraRows.value.reduce((s, r) => s + Number(r.fixed_extra), 0),
  variable_extra: extraRows.value.reduce((s, r) => s + Number(r.variable_extra), 0),
  separate_extras: extraRows.value.reduce((s, r) => s + Number(r.separate_extras), 0),
}));
const insuredRows = computed(() => rows.value.filter((r) => Number(r.insurance) || Number(r.insurance_employer)));
const sum = (list, key) => list.reduce((s, r) => s + Number(r[key] ?? 0), 0);

async function loadMonths() {
  try {
    months.value = (await axios.get("api/payroll/months")).data.data;
  } catch {
    months.value = [];
  }
}
async function load() {
  loading.value = true;
  try {
    run.value = (await axios.get(`api/payroll/runs/${month.value}`)).data.data;
  } catch (error) {
    fail(error);
  } finally {
    loading.value = false;
  }
}
onMounted(() => {
  loadMonths();
  load();
});
watch(month, (m) => {
  router.replace({ query: { ...route.query, month: m } });
  load();
});
const pickerMonth = computed({
  get: () => moment(month.value, "YYYY-MM").toDate(),
  set: (d) => d && (month.value = moment(d).format("YYYY-MM")),
});

// Starting (or completing) the month: a row for every active employee with a salary who has none yet.
const startResult = ref(null);
async function start() {
  busy.value = true;
  try {
    const { data } = await axios.post(`api/payroll/runs/${month.value}`);
    startResult.value = data.data;
    if (!Object.keys(data.data.no_salary ?? {}).length) {
      startResult.value = null;
      toast.add({ severity: "success", summary: t("run.started", { n: data.data.created }), life: 3000 });
    }
    await Promise.all([load(), loadMonths()]);
  } catch (error) {
    fail(error);
  } finally {
    busy.value = false;
  }
}

// Approve / take back / paid / extras paid.
const action = ref(null); // { kind, date }
const ACTIONS = { approve: "approve", unapprove: "unapprove", pay: "pay", extras: "pay-extras" };
function ask(kind) {
  action.value = { kind, date: new Date() };
}
async function confirmAction() {
  const { kind, date } = action.value;
  busy.value = true;
  try {
    await axios.post(`api/payroll/runs/${month.value}/${ACTIONS[kind]}`, ["pay", "extras"].includes(kind) ? { date: moment(date).format("YYYY-MM-DD") } : {});
    toast.add({ severity: "success", summary: t(`run.done_${kind}`), life: 3000 });
    action.value = null;
    await Promise.all([load(), loadMonths()]);
  } catch (error) {
    fail(error);
  } finally {
    busy.value = false;
  }
}

// Editing a row: the numbers, where the extras go, bank or cheque, the notes; the totals follow as you type.
const editing = ref(null);
const EDIT_FIELDS = computed(() => [
  "base_salary",
  ...(saudi.value ? ["housing", "transport", "other_allowance"] : []),
  "insurance_salary",
  "fixed_extra",
  "variable_extra",
  "deduction",
  "insurance",
  "insurance_employer",
  "health_insurance",
  "life_fund",
  ...(taxOn.value ? ["income_tax"] : []),
  "financial_advance",
  ...(saudi.value ? ["eos_provision"] : []),
]);
function edit(row) {
  editing.value = { ...row };
}
const preview = computed(() => {
  const r = editing.value;
  if (!r) return {};
  const n = (k) => Number(r[k] ?? 0);
  const extras = r.extra_paid === "separate" ? 0 : n("fixed_extra") + n("variable_extra");
  const before = n("base_salary") + n("housing") + n("transport") + n("other_allowance") + extras - n("deduction");
  const after = before - n("insurance") - n("health_insurance") - n("life_fund") - n("income_tax");
  return { before, after, net: after - n("financial_advance"), separate: r.extra_paid === "separate" ? n("fixed_extra") + n("variable_extra") : 0 };
});
async function saveRow() {
  const r = editing.value;
  busy.value = true;
  try {
    const body = Object.fromEntries(EDIT_FIELDS.value.map((k) => [k, Number(r[k] ?? 0)]));
    Object.assign(body, { extra_paid: r.extra_paid, payment_method: r.payment_method, fixed_extra_note: r.fixed_extra_note, variable_extra_note: r.variable_extra_note, deduction_note: r.deduction_note, notes: r.notes });
    const { data } = await axios.put(`api/payroll/rows/${r.id}`, body);
    if (Math.abs(Number(data.data.financial_advance) - body.financial_advance) > 0.004) {
      toast.add({ severity: "warn", summary: t("run.advance_capped", { amount: money(data.data.financial_advance) }), life: 5000 });
    }
    editing.value = null;
    toast.add({ severity: "success", summary: t("successful"), life: 2000 });
    load();
  } catch (error) {
    fail(error);
  } finally {
    busy.value = false;
  }
}
async function refreshRow() {
  busy.value = true;
  try {
    await axios.post(`api/payroll/rows/${editing.value.id}/refresh`);
    editing.value = null;
    toast.add({ severity: "success", summary: t("run.refreshed"), life: 2500 });
    load();
  } catch (error) {
    fail(error);
  } finally {
    busy.value = false;
  }
}
const removing = ref(null);
async function removeRow() {
  busy.value = true;
  try {
    await axios.delete(`api/payroll/${removing.value.id}`);
    removing.value = null;
    editing.value = null;
    load();
    loadMonths();
  } catch (error) {
    fail(error);
  } finally {
    busy.value = false;
  }
}
const slip = (id) => printPayslip(t, id, locale.value).catch(fail);

// Files from the server: the sheet (titles in the reader's language), the bank transfers, the cheques.
async function download(kind) {
  const params = { kind, title: `${t(kind === "extras" ? "run.extras_sheet" : kind === "cheques" ? "run.cheques" : "run.title")} ${month.value}` };
  if (kind === "sheet") {
    params.headers = Object.fromEntries([["employee", t("run.employee")], ["national_id", t("prof.national_id")],
      ...salaryColumns.value.map((c) => [c.key, t(`run.c.${c.key}`)]), ["payment_method", t("run.payment_method")], ["deduction_note", t("run.deduction_note")], ["notes", t("run.notes")]]);
  }
  try {
    const { data, headers } = await axios.get(`api/payroll/runs/${month.value}/export`, { params, responseType: "blob" });
    const name = /filename="?([^";]+)/.exec(headers["content-disposition"] ?? "")?.[1] ?? `${kind}-${month.value}.xlsx`;
    const link = Object.assign(document.createElement("a"), { href: URL.createObjectURL(data), download: name });
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    fail(error);
  }
}
const fileMenu = ref();
const fileItems = computed(() => [
  { label: t("run.file_sheet"), icon: "pi pi-file-excel", command: () => download("sheet") },
  { label: saudi.value ? t("run.file_wps") : t("run.file_salaries"), icon: "pi pi-building-columns", command: () => download("salaries") },
  { label: t("run.file_extras"), icon: "pi pi-plus-circle", command: () => download("extras") },
  { label: t("run.file_cheques"), icon: "pi pi-wallet", command: () => download("cheques") },
  { separator: true },
  { label: t("run.print"), icon: "pi pi-print", command: print },
]);

function print() {
  const rtl = locale.value === "ar";
  const cols = tab.value === "extras"
    ? [["fixed_extra"], ["fixed_extra_note", true], ["variable_extra"], ["variable_extra_note", true], ["separate_extras"]]
    : tab.value === "insurance" ? [["insurance_salary"], ["insurance"], ["insurance_employer"]] : salaryColumns.value.map((c) => [c.key]);
  const list = tab.value === "extras" ? extraRows.value : tab.value === "insurance" ? insuredRows.value : rows.value;
  const label = (k) => (["fixed_extra_note", "variable_extra_note"].includes(k) ? t("run.note") : t(`run.c.${k}`));
  const cell = (r, [k, text]) => (text ? `<td>${esc(r[k] ?? "")}</td>` : `<td class="num">${money(tab.value === "salaries" ? inSalary(r, k) : r[k])}</td>`);
  const head = `<tr><th>#</th><th>${esc(t("run.employee"))}</th>${cols.map(([k]) => `<th>${esc(label(k))}</th>`).join("")}</tr>`;
  const body = list.map((r, i) => `<tr><td>${i + 1}</td><td>${esc(r.employee)}</td>${cols.map((c) => cell(r, c)).join("")}</tr>`).join("");
  const foot = `<tr class="total"><td></td><td>${esc(t("run.total"))}</td>${cols.map(([k, text]) => (text ? "<td></td>" : `<td class="num">${money(list.reduce((s, r) => s + (tab.value === "salaries" ? inSalary(r, k) : Number(r[k] ?? 0)), 0))}</td>`)).join("")}</tr>`;
  const title = { salaries: t("run.title"), extras: t("run.extras_sheet"), insurance: t(saudi.value ? "run.gosi_sheet" : "run.ssc_sheet") }[tab.value];
  printHtml(`<!doctype html><html lang="${rtl ? "ar" : "en"}" dir="${rtl ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${esc(title)}</title>
<style>${PRINT_STYLE} @page{size:A4 landscape;margin:10mm} body{margin:12px} table{font-size:10px} th,td{padding:4px 5px}</style></head><body>
<h1>${esc(title)} — <span dir="ltr">${esc(month.value)}</span></h1><div class="muted">${esc(currency.value)} · ${esc(t(`run.status_${run.value?.status ?? "draft"}`))}</div>
<table><thead>${head}</thead><tbody>${body}${foot}</tbody></table></body></html>`);
}

const statusOf = (m) => months.value.find((x) => x.month === m)?.status;
</script>

<template>
  <div>
    <Toast />
    <div class="flex flex-wrap items-center justify-between gap-2 p-4">
      <p class="text-xl text-bp-135c65 font-bold m-0">{{ $t("run.title") }}</p>
      <div class="flex flex-wrap items-center gap-2">
        <DatePicker v-model="pickerMonth" view="month" dateFormat="yy-mm" showIcon class="w-11rem" />
        <Button icon="pi pi-download" :label="$t('run.files')" outlined :disabled="!rows.length" @click="fileMenu.toggle($event)" />
        <Menu ref="fileMenu" :model="fileItems" popup />
      </div>
    </div>

    <div v-if="months.length" class="run-months mb-3">
      <button v-for="m in months.slice(0, 8)" :key="m.month" type="button" class="run-month" :class="{ 'is-on': m.month === month }" @click="month = m.month">
        <bdi dir="ltr" class="font-bold">{{ m.month }}</bdi>
        <Tag :severity="STATUS_SEVERITY[m.status]" :value="$t(`run.status_${m.status}`)" class="text-xs" />
        <small class="text-color-secondary">{{ money(m.net) }}</small>
      </button>
    </div>

    <div class="run-bar mb-3">
      <div class="flex flex-wrap items-center gap-2">
        <Tag :severity="STATUS_SEVERITY[run?.status ?? 'draft']" :value="$t(`run.status_${run?.status ?? 'draft'}`)" />
        <small v-if="run?.paid_on" class="text-color-secondary">{{ $t("run.paid_on", { date: ltr(run.paid_on) }) }}</small>
        <small v-if="run?.extras_paid_on" class="text-color-secondary">· {{ $t("run.extras_paid_on", { date: ltr(run.extras_paid_on) }) }}</small>
        <small v-if="draft && rows.length" class="text-color-secondary">{{ $t("run.draft_hint") }}</small>
      </div>
      <div class="flex flex-wrap gap-2">
        <Button v-if="draft && can('payroll create')" icon="pi pi-users" :label="rows.length ? $t('run.complete') : $t('run.start')" :outlined="!!rows.length" :loading="busy" @click="start" />
        <Button v-if="draft && rows.length && can('payroll approval edit')" icon="pi pi-check-circle" :label="$t('run.approve')" severity="success" @click="ask('approve')" />
        <Button v-if="run?.status === 'approved' && can('payroll approval edit')" icon="pi pi-wallet" :label="$t('run.pay')" @click="ask('pay')" />
        <Button v-if="['approved', 'paid'].includes(run?.status) && !run?.extras_paid_on && extraRows.length && can('payroll approval edit')" icon="pi pi-plus-circle"
          :label="$t('run.pay_extras')" outlined @click="ask('extras')" />
        <Button v-if="run?.status === 'approved' && !run?.extras_paid_on && can('payroll approval edit')" icon="pi pi-undo" :label="$t('run.unapprove')" text severity="secondary" @click="ask('unapprove')" />
      </div>
    </div>

    <div v-if="rows.length" class="run-kpis mb-3">
      <div><span>{{ $t("run.k_employees") }}</span><b>{{ rows.length }}</b></div>
      <div><span>{{ $t("run.c.before_insurance") }}</span><b>{{ money(totals.before_insurance) }}</b></div>
      <div><span>{{ $t("run.c.total_salary") }}</span><b>{{ money(totals.total_salary) }} <small>{{ currency }}</small></b></div>
      <div><span>{{ $t("run.extras_sheet") }}</span><b>{{ money(extraTotals.separate_extras) }}</b></div>
      <div><span>{{ $t(saudi ? "run.k_gosi" : "run.k_ssc") }}</span><b>{{ money(sum(rows, "insurance") + sum(rows, "insurance_employer")) }}</b></div>
    </div>

    <Tabs v-model:value="tab">
      <TabList>
        <Tab value="salaries">{{ $t("run.title") }}</Tab>
        <Tab value="extras">{{ $t("run.extras_sheet") }} <Badge v-if="extraRows.length" :value="extraRows.length" severity="secondary" class="ms-1" /></Tab>
        <Tab value="insurance">{{ $t(saudi ? "run.gosi_sheet" : "run.ssc_sheet") }}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="salaries">
          <DataTable :value="rows" :loading="loading" dataKey="id" size="small" stripedRows scrollable scrollHeight="65vh" class="run-table" @row-click="(e) => edit(e.data)"
            :rowClass="() => 'cursor-pointer'">
            <template #empty>
              <div class="py-5 text-center text-color-secondary">{{ $t("run.empty", { month: ltr(month) }) }}</div>
            </template>
            <Column :header="$t('run.employee')" frozen class="run-name" :footer="$t('run.total')">
              <template #body="{ data }">
                <div class="flex items-center gap-1">
                  <i v-if="data.flagged" class="pi pi-flag-fill text-red-500" v-tooltip.top="data.payroll_notes || $t('run.flagged')" />
                  <span class="font-medium">{{ data.employee }}</span>
                  <Tag v-if="data.payment_method === 'cheque'" :value="$t('run.cheque')" severity="warn" class="text-xs" />
                  <i v-if="data.notes" class="pi pi-comment text-primary" v-tooltip.top="data.notes" />
                </div>
              </template>
            </Column>
            <Column v-for="c in salaryColumns" :key="c.key" :header="$t(`run.c.${c.key}`)" :class="{ 'run-calc': c.calc, 'run-strong': c.strong }"
              :footer="money(totals[c.key])">
              <template #body="{ data }">
                <span v-if="['fixed_extra', 'variable_extra'].includes(c.key) && data.extra_paid === 'separate'" class="text-color-secondary text-xs"
                  v-tooltip.top="$t('run.separate_hint', { amount: money(data[c.key]) })">{{ Number(data[c.key]) ? $t("run.separate") : "—" }}</span>
                <span v-else :class="{ 'text-red-500': c.key === 'total_salary' && data[c.key] < 0 }" v-tooltip.top="c.note && data[c.note] ? data[c.note] : null">
                  {{ money(data[c.key]) }}<i v-if="c.note && data[c.note] && inSalary(data, c.key)" class="pi pi-info-circle text-xs ms-1 text-color-secondary" />
                </span>
              </template>
            </Column>
          </DataTable>
        </TabPanel>

        <TabPanel value="extras">
          <p class="text-sm text-color-secondary mt-0">{{ $t("run.extras_hint") }}</p>
          <DataTable :value="extraRows" dataKey="id" size="small" stripedRows @row-click="(e) => edit(e.data)" :rowClass="() => 'cursor-pointer'">
            <template #empty>{{ $t("run.extras_empty") }}</template>
            <Column :header="$t('run.employee')" field="employee" :footer="$t('run.total')" />
            <Column :header="$t('run.c.fixed_extra')" :footer="money(extraTotals.fixed_extra)"><template #body="{ data }">{{ money(data.fixed_extra) }}</template></Column>
            <Column :header="$t('run.note')" field="fixed_extra_note" />
            <Column :header="$t('run.c.variable_extra')" :footer="money(extraTotals.variable_extra)"><template #body="{ data }">{{ money(data.variable_extra) }}</template></Column>
            <Column :header="$t('run.note')" field="variable_extra_note" />
            <Column :header="$t('run.extras_net')" :footer="money(extraTotals.separate_extras)" class="run-strong"><template #body="{ data }">{{ money(data.separate_extras) }}</template></Column>
            <Column :header="$t('run.payment_method')"><template #body="{ data }">{{ $t(`run.pm_${data.payment_method}`) }}</template></Column>
          </DataTable>
        </TabPanel>

        <TabPanel value="insurance">
          <DataTable :value="insuredRows" dataKey="id" size="small" stripedRows>
            <template #empty>{{ $t("run.insurance_empty") }}</template>
            <Column :header="$t('run.employee')" field="employee" :footer="$t('run.total')" />
            <Column :header="$t('prof.national_id')"><template #body="{ data }"><bdi dir="ltr">{{ data.national_id }}</bdi></template></Column>
            <Column :header="$t('run.c.insurance_salary')" :footer="money(sum(insuredRows, 'insurance_salary'))"><template #body="{ data }">{{ money(data.insurance_salary) }}</template></Column>
            <Column :header="$t('run.c.insurance')" :footer="money(sum(insuredRows, 'insurance'))"><template #body="{ data }">{{ money(data.insurance) }}</template></Column>
            <Column :header="$t('run.c.insurance_employer')" :footer="money(sum(insuredRows, 'insurance_employer'))"><template #body="{ data }">{{ money(data.insurance_employer) }}</template></Column>
            <Column :header="$t('run.insurance_total')" :footer="money(sum(insuredRows, 'insurance') + sum(insuredRows, 'insurance_employer'))" class="run-strong">
              <template #body="{ data }">{{ money(Number(data.insurance) + Number(data.insurance_employer)) }}</template>
            </Column>
          </DataTable>
        </TabPanel>
      </TabPanels>
    </Tabs>

    <!-- A row -->
    <Dialog :visible="!!editing" modal :header="editing?.employee" :style="{ width: '760px' }" :breakpoints="{ '820px': '96vw' }" @update:visible="editing = null">
      <template v-if="editing">
        <Message v-if="!draft" severity="info" :closable="false" class="mb-3">{{ $t("run.locked_hint") }}</Message>
        <Message v-if="editing.payroll_notes" severity="warn" :closable="false" class="mb-3">{{ editing.payroll_notes }}</Message>
        <div class="run-form">
          <div v-for="k in EDIT_FIELDS" :key="k" class="flex flex-column gap-1">
            <label :for="`f-${k}`" class="text-sm">{{ $t(`run.c.${k}`) }}</label>
            <InputNumber v-model="editing[k]" :inputId="`f-${k}`" :minFractionDigits="0" :maxFractionDigits="2" :disabled="!draft || !can('payroll edit')" fluid />
          </div>
          <div class="flex flex-column gap-1">
            <label class="text-sm">{{ $t("run.extra_paid") }}</label>
            <SelectButton v-model="editing.extra_paid" :options="['salary', 'separate']" :optionLabel="(o) => $t(`run.ep_${o}`)" :allowEmpty="false" :disabled="!draft || !can('payroll edit')" />
          </div>
          <div class="flex flex-column gap-1">
            <label class="text-sm">{{ $t("run.payment_method") }}</label>
            <SelectButton v-model="editing.payment_method" :options="['bank', 'cheque']" :optionLabel="(o) => $t(`run.pm_${o}`)" :allowEmpty="false" :disabled="!draft || !can('payroll edit')" />
          </div>
        </div>
        <div class="run-form mt-3">
          <div v-for="k in ['fixed_extra_note', 'variable_extra_note', 'deduction_note', 'notes']" :key="k" class="flex flex-column gap-1">
            <label :for="`f-${k}`" class="text-sm">{{ $t(`run.${k}`) }}</label>
            <Textarea v-model="editing[k]" :id="`f-${k}`" rows="2" autoResize :disabled="!draft || !can('payroll edit')" />
          </div>
        </div>
        <div class="run-preview mt-3">
          <div><span>{{ $t("run.c.before_insurance") }}</span><b>{{ money(preview.before) }}</b></div>
          <div><span>{{ $t("run.c.after_insurance") }}</span><b>{{ money(preview.after) }}</b></div>
          <div class="is-net"><span>{{ $t("run.c.total_salary") }}</span><b>{{ money(preview.net) }} <small>{{ currency }}</small></b></div>
          <div v-if="preview.separate"><span>{{ $t("run.extras_net") }}</span><b>{{ money(preview.separate) }}</b></div>
        </div>
      </template>
      <template #footer>
        <div class="flex flex-wrap justify-between gap-2 w-full">
          <div class="flex gap-2">
            <Button icon="pi pi-print" :label="$t('run.payslip')" text @click="slip(editing.id)" />
            <Button v-if="draft && can('payroll edit')" icon="pi pi-refresh" :label="$t('run.refresh')" text severity="secondary" v-tooltip.top="$t('run.refresh_hint')" @click="refreshRow" />
            <Button v-if="draft && can('payroll delete')" icon="pi pi-trash" text severity="danger" :aria-label="$t('delete')" @click="removing = editing" />
          </div>
          <div class="flex gap-2">
            <Button :label="$t('cancel')" text severity="secondary" @click="editing = null" />
            <Button v-if="draft && can('payroll edit')" icon="pi pi-check" :label="$t('save')" :loading="busy" @click="saveRow" />
          </div>
        </div>
      </template>
    </Dialog>

    <Dialog :visible="!!action" modal :header="action && $t(`run.${action.kind === 'extras' ? 'pay_extras' : action.kind}`)" :style="{ width: '460px' }" @update:visible="action = null">
      <template v-if="action">
        <p class="mt-0">{{ $t(`run.confirm_${action.kind}`, { month: ltr(month) }) }}</p>
        <div v-if="['pay', 'extras'].includes(action.kind)" class="flex flex-column gap-1">
          <label for="act-date" class="text-sm">{{ $t("run.pay_date") }}</label>
          <DatePicker v-model="action.date" inputId="act-date" dateFormat="yy-mm-dd" showIcon />
        </div>
      </template>
      <template #footer>
        <Button :label="$t('cancel')" text severity="secondary" @click="action = null" />
        <Button icon="pi pi-check" :label="$t('confirm')" :loading="busy" @click="confirmAction" />
      </template>
    </Dialog>

    <Dialog :visible="!!startResult" modal :header="$t('run.started', { n: startResult?.created ?? 0 })" :style="{ width: '460px' }" @update:visible="startResult = null">
      <p class="mt-0">{{ $t("run.no_salary") }}</p>
      <ul class="m-0 ps-4"><li v-for="(name, id) in startResult?.no_salary ?? {}" :key="id">{{ name }}</li></ul>
      <template #footer><Button :label="$t('close')" @click="startResult = null" /></template>
    </Dialog>

    <Dialog :visible="!!removing" modal :header="$t('delete')" :style="{ width: '420px' }" @update:visible="removing = null">
      <p class="m-0">{{ $t("run.remove_confirm", { name: removing?.employee }) }}</p>
      <template #footer>
        <Button :label="$t('cancel')" text severity="secondary" @click="removing = null" />
        <Button icon="pi pi-trash" :label="$t('delete')" severity="danger" :loading="busy" @click="removeRow" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.run-months { display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.25rem; }
.run-month { display: grid; justify-items: start; gap: 0.2rem; padding: 0.55rem 0.8rem; min-width: 120px; border-radius: 12px; border: 1px solid var(--p-content-border-color);
  background: var(--p-content-background, #fff); cursor: pointer; }
.run-month.is-on { border-color: var(--p-primary-color); box-shadow: 0 0 0 3px color-mix(in srgb, var(--p-primary-color) 18%, transparent); }
.run-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: 14px;
  background: var(--p-surface-50, #f8fafc); border: 1px solid var(--p-content-border-color); }
.run-kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem; }
.run-kpis > div, .run-preview > div { display: grid; gap: 0.15rem; padding: 0.7rem 0.9rem; border-radius: 12px; border: 1px solid var(--p-content-border-color); background: var(--p-content-background, #fff); }
.run-kpis span, .run-preview span { font-size: 0.8rem; color: var(--p-text-muted-color); }
.run-kpis b, .run-preview b { font-size: 1.1rem; }
.run-table :deep(td), .run-table :deep(th) { white-space: nowrap; }
.run-table :deep(.run-calc) { background: color-mix(in srgb, var(--p-primary-color) 5%, transparent); }
.run-table :deep(.run-strong), :deep(.run-strong) { font-weight: 800; }
.run-table :deep(tfoot td) { font-weight: 800; }
.run-form { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 0.75rem; }
.run-preview { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.6rem; }
.run-preview .is-net { border-color: var(--p-primary-color); }
</style>
