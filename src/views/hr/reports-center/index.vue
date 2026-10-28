<script setup>
// «مركز التقارير»: the ready HR reports (attendance, leaves, payroll, deductions & bonuses, employees, recruitment)
// with their filters, totals, print in Sawa's look, PDF and Excel. Each report shows to whoever may see its data.
import axios from "axios";
import moment from "moment";
import html2pdf from "html2pdf.js";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { errorText } from "@/utils/accounting";
import { escapeHtml as esc, PRINT_STYLE, printHtml } from "@/utils/printHtml";
import { can } from "@/utils/permissions";

const { t, locale } = useI18n();
const router = useRouter();
const toast = useToast();

const ICONS = { attendance: "pi pi-clock", leaves: "pi pi-calendar", payroll: "pi pi-wallet", items: "pi pi-list", employees: "pi pi-users", recruitment: "pi pi-briefcase" };
const PERIOD = ["attendance", "leaves", "items", "recruitment"];
const KINDS = ["deduction", "bonus", "advance", "overtime"];

const available = ref([]);
const departments = ref([]);
const employees = ref([]);
const currency = ref("JOD");
const report = ref(null);
const filters = ref({ range: [moment().startOf("month").toDate(), new Date()], month: moment().subtract(1, "month").toDate(), department_id: null, employee_id: null, kinds: [...KINDS] });
const result = ref(null);
const loading = ref(false);
const rtl = computed(() => locale.value === "ar");
const cur = computed(() => (currency.value === "SAR" ? t("vac.sar") : t("vac.jod")));

onMounted(async () => {
  const { data } = await axios.get("api/hr-reports");
  available.value = data.data.reports;
  departments.value = data.data.departments;
  employees.value = data.data.employees;
  currency.value = data.data.currency;
  report.value = available.value[0] ?? null;
});

const employeeOptions = computed(() => employees.value.filter((e) => !filters.value.department_id || e.department_id === filters.value.department_id));
watch(() => filters.value.department_id, () => {
  if (filters.value.employee_id && !employeeOptions.value.some((e) => e.id === filters.value.employee_id)) filters.value.employee_id = null;
});

async function load() {
  if (!report.value) return;
  loading.value = true;
  const [from, to] = filters.value.range ?? [];
  try {
    const { data } = await axios.get(`api/hr-reports/${report.value}`, {
      params: {
        from: PERIOD.includes(report.value) && from ? moment(from).format("YYYY-MM-DD") : undefined,
        to: PERIOD.includes(report.value) && (to || from) ? moment(to || from).format("YYYY-MM-DD") : undefined,
        month: report.value === "payroll" && filters.value.month ? moment(filters.value.month).format("YYYY-MM") : undefined,
        department_id: filters.value.department_id || undefined,
        employee_id: filters.value.employee_id || undefined,
        kinds: report.value === "items" ? filters.value.kinds : undefined,
      },
    });
    result.value = data.data;
  } catch (error) {
    result.value = null;
    const code = error.response?.data?.message;
    toast.add({ severity: "error", summary: t("error"), detail: code === "hr.period_too_long" ? t("rep.period_too_long") : errorText(error), life: 5000 });
  } finally {
    loading.value = false;
  }
}
watch(report, () => {
  result.value = null;
  load();
});

// ---- Cells ----
const header = (col) => (col.label ? (col.key.startsWith("left_") ? t("rep.left", { title: col.label }) : col.label) : t(`rep.col_${col.key}`));
const number = (v, digits = 2) => Number(v ?? 0).toLocaleString("en", { maximumFractionDigits: digits });
function cell(col, row) {
  const v = row[col.key];
  switch (col.type) {
    case "money": return v == null ? "—" : number(v);
    case "minutes": return v ? t("prof.minutes", { n: v }) : "0";
    case "status": return row.paid_in ? t("hrpay.paid") : t(`rep.status_${v}`);
    case "kind": return t(`rep.kind_${v}`);
    case "alert": return v ? t(`ctr.alert_${v}`) : "—";
    case "yesno": return v ? t("rep.yes") : t("rep.no");
    case "number": return v == null ? "—" : number(v, 1);
    default: return v == null || v === "" ? "—" : String(v);
  }
}
const totalCell = (col) => {
  const v = result.value?.totals?.[col.key];
  return v == null ? "" : col.type === "money" ? number(v) : col.type === "minutes" ? t("prof.minutes", { n: v }) : number(v, 1);
};
const isNum = (col) => ["money", "number", "minutes"].includes(col.type);

// ---- Print, PDF, Excel ----
const title = computed(() => {
  if (!report.value) return "";
  const [from, to] = filters.value.range ?? [];
  const when = report.value === "payroll" ? result.value?.month
    : PERIOD.includes(report.value) && from ? `${moment(from).format("YYYY-MM-DD")} → ${moment(to || from).format("YYYY-MM-DD")}` : "";
  return `${t(`rep.r_${report.value}`)}${when ? " — " + when : ""}`;
});
const scope = computed(() => [
  filters.value.department_id && departments.value.find((d) => d.id === filters.value.department_id)?.title,
  filters.value.employee_id && employees.value.find((e) => e.id === filters.value.employee_id)?.name,
].filter(Boolean).join(" · "));
function documentHtml() {
  const cols = result.value.columns;
  const head = cols.map((c) => `<th${isNum(c) ? ' class="num"' : ""}>${esc(header(c))}</th>`).join("");
  const body = result.value.rows.map((r) => `<tr>${cols.map((c) => `<td${isNum(c) ? ' class="num"' : ""}>${esc(cell(c, r))}</td>`).join("")}</tr>`).join("");
  const totals = result.value.totals && Object.keys(result.value.totals).length
    ? `<tr class="total">${cols.map((c, i) => `<td${isNum(c) ? ' class="num"' : ""}>${i === 0 ? esc(t("rep.total")) : esc(totalCell(c))}</td>`).join("")}</tr>` : "";
  return `<!doctype html><html lang="${rtl.value ? "ar" : "en"}" dir="${rtl.value ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${esc(title.value)}</title>
<style>${PRINT_STYLE} table{font-size:12px} td,th{padding:6px} @page{size:A4 landscape}</style></head><body>
<h1>${esc(title.value)}</h1><div class="muted">${esc(scope.value || t("rep.all_staff"))} · ${esc(t("eos.printed_on"))} ${moment().format("YYYY-MM-DD")}${report.value === "payroll" || report.value === "items" ? " · " + esc(cur.value) : ""}</div>
<table><thead><tr>${head}</tr></thead><tbody>${body}${totals}</tbody></table></body></html>`;
}
const print = () => printHtml(documentHtml());
const pdfing = ref(false);
async function pdf() {
  pdfing.value = true;
  try {
    const html = documentHtml();
    const holder = document.createElement("div");
    holder.innerHTML = `<style>${PRINT_STYLE} table{font-size:11px} td,th{padding:5px} body,div{direction:${rtl.value ? "rtl" : "ltr"}}</style>` + html.slice(html.indexOf("<body>") + 6, html.indexOf("</body>"));
    holder.dir = rtl.value ? "rtl" : "ltr";
    holder.style.cssText = "font-family:Cairo,Tahoma,sans-serif;color:#1f2937;padding:8px";
    await html2pdf().set({ margin: 8, filename: `${report.value}-${moment().format("YYYY-MM-DD")}.pdf`, image: { type: "jpeg", quality: 0.95 },
      html2canvas: { scale: 2 }, jsPDF: { unit: "mm", format: "a4", orientation: "landscape" }, pagebreak: { mode: ["css", "legacy"] } }).from(holder).save();
  } finally {
    pdfing.value = false;
  }
}
const excelling = ref(false);
async function excel() {
  excelling.value = true;
  const cols = result.value.columns;
  // Numbers stay numbers in Excel; the rest as shown.
  const value = (c, r) => (isNum(c) && c.type !== "minutes" ? Number(r[c.key] ?? 0) : c.type === "minutes" ? Number(r[c.key] ?? 0) : cell(c, r));
  try {
    const { data } = await axios.post("api/hr-reports/xlsx", {
      title: title.value + (scope.value ? ` (${scope.value})` : ""), filename: `${report.value}-${moment().format("YYYY-MM-DD")}`, rtl: rtl.value,
      headers: cols.map((c) => header(c) + (c.type === "minutes" ? ` (${t("rep.min")})` : "")),
      rows: result.value.rows.map((r) => cols.map((c) => value(c, r))),
      totals: result.value.totals && Object.keys(result.value.totals).length ? cols.map((c, i) => (i === 0 ? t("rep.total") : result.value.totals[c.key] ?? "")) : null,
    }, { responseType: "blob" });
    const link = Object.assign(document.createElement("a"), { href: URL.createObjectURL(data), download: `${report.value}-${moment().format("YYYY-MM-DD")}.xlsx` });
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  } finally {
    excelling.value = false;
  }
}
</script>

<template>
  <div>
    <Toast />
    <div class="flex flex-wrap items-center justify-between gap-2 p-4">
      <p class="text-xl text-bp-135c65 font-bold m-0">{{ $t("rep.title") }}</p>
      <Button v-if="can('reports list')" icon="pi pi-sliders-h" :label="$t('rep.custom')" text @click="router.push({ name: 'reports' })" />
    </div>

    <p v-if="!available.length" class="sawa-card p-4 m-0 text-color-secondary">{{ $t("rep.none") }}</p>

    <div class="rep-cards mb-3">
      <button v-for="r in available" :key="r" type="button" class="rep-card" :class="{ 'is-on': report === r }" @click="report = r">
        <i :class="ICONS[r]" />
        <span class="font-bold">{{ $t(`rep.r_${r}`) }}</span>
        <small>{{ $t(`rep.d_${r}`) }}</small>
      </button>
    </div>

    <div v-if="report" class="sawa-card p-3 flex flex-wrap items-end gap-2 mb-3">
      <div v-if="PERIOD.includes(report)" class="flex flex-column gap-1">
        <label for="rep-range" class="text-sm">{{ $t("rep.period") }}</label>
        <DatePicker inputId="rep-range" v-model="filters.range" selectionMode="range" dateFormat="yy-mm-dd" showIcon class="w-16rem" />
      </div>
      <div v-if="report === 'payroll'" class="flex flex-column gap-1">
        <label for="rep-month" class="text-sm">{{ $t("hrpay.month") }}</label>
        <DatePicker inputId="rep-month" v-model="filters.month" view="month" dateFormat="yy-mm" showIcon class="w-12rem" />
      </div>
      <div v-if="report !== 'recruitment'" class="flex flex-column gap-1">
        <label for="rep-dep" class="text-sm">{{ $t("prof.department") }}</label>
        <Select inputId="rep-dep" v-model="filters.department_id" :options="departments" optionLabel="title" optionValue="id" showClear filter class="w-14rem" :placeholder="$t('rep.all')" />
      </div>
      <div v-if="report !== 'recruitment'" class="flex flex-column gap-1">
        <label for="rep-emp" class="text-sm">{{ $t("prof.employee") }}</label>
        <Select inputId="rep-emp" v-model="filters.employee_id" :options="employeeOptions" optionLabel="name" optionValue="id" showClear filter class="w-14rem" :placeholder="$t('rep.all')" />
      </div>
      <div v-if="report === 'items'" class="flex flex-column gap-1">
        <label for="rep-kinds" class="text-sm">{{ $t("rep.kinds") }}</label>
        <MultiSelect inputId="rep-kinds" v-model="filters.kinds" :options="KINDS" :optionLabel="(k) => $t(`rep.kind_${k}`)" class="w-14rem" />
      </div>
      <Button icon="pi pi-search" :label="$t('rep.show')" :loading="loading" @click="load" />
      <div class="flex-1" />
      <template v-if="result">
        <Button icon="pi pi-print" :label="$t('print')" outlined @click="print" />
        <Button icon="pi pi-file-pdf" label="PDF" outlined severity="danger" :loading="pdfing" @click="pdf" />
        <Button icon="pi pi-file-excel" label="Excel" outlined severity="success" :loading="excelling" @click="excel" />
      </template>
    </div>

    <div v-if="result" class="sawa-card p-3">
      <div class="flex flex-wrap items-baseline justify-between gap-2 mb-2">
        <p class="font-bold m-0">{{ title }}</p>
        <small class="text-color-secondary">{{ scope || $t("rep.all_staff") }} · {{ $t("rep.rows", { n: result.rows.length }) }}</small>
      </div>
      <DataTable :value="result.rows" size="small" stripedRows scrollable scrollHeight="60vh" :loading="loading" paginator :rows="50" :rowsPerPageOptions="[25, 50, 100, 500]">
        <template #empty>{{ $t("rep.empty") }}</template>
        <Column v-for="(col, i) in result.columns" :key="col.key" :header="header(col)" :sortable="true" :field="col.key"
          :headerClass="isNum(col) ? 'rep-num' : ''" :bodyClass="isNum(col) ? 'rep-num' : ''" :footerClass="isNum(col) ? 'rep-num' : ''">
          <template #body="{ data }">
            <Tag v-if="col.type === 'alert' && data[col.key]" :severity="data[col.key] === 'expired' ? 'danger' : data[col.key] === 'expiring' ? 'warn' : 'info'" :value="cell(col, data)" />
            <Tag v-else-if="col.type === 'status'" :severity="data.paid_in ? 'info' : data[col.key] === 1 ? 'success' : data[col.key] === -1 ? 'danger' : 'warn'" :value="cell(col, data)" />
            <span v-else :dir="col.type === 'date' ? 'ltr' : undefined">{{ cell(col, data) }}</span>
          </template>
          <template v-if="result.totals && Object.keys(result.totals).length" #footer>
            <b>{{ i === 0 ? $t("rep.total") : totalCell(col) }}</b>
          </template>
        </Column>
      </DataTable>
      <small v-if="report === 'items'" class="block mt-2 text-color-secondary">{{ $t("rep.items_total_hint") }}</small>
      <small v-if="report === 'attendance'" class="block mt-2 text-color-secondary">{{ $t("rep.attendance_hint") }}</small>
    </div>
  </div>
</template>

<style scoped>
.rep-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.75rem; }
.rep-card { display: grid; gap: 0.25rem; text-align: start; padding: 0.9rem 1rem; border-radius: 14px; border: 1px solid var(--p-content-border-color);
  background: var(--p-content-background, #fff); cursor: pointer; transition: border-color 0.15s, box-shadow 0.15s; }
.rep-card i { font-size: 1.3rem; color: var(--p-primary-color); }
.rep-card small { color: var(--p-text-muted-color); font-size: 0.8rem; }
.rep-card.is-on { border-color: var(--p-primary-color); box-shadow: 0 0 0 3px color-mix(in srgb, var(--p-primary-color) 18%, transparent); }
:deep(.rep-num) { text-align: end; }
</style>
