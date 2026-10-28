<script setup>
// «تقارير المحاسبة»: revenue, aging of what is owed, coming dues, discounts & money back, employees' receipts —
// each for a period (aging: on a date) and printable (the page prints the report alone).
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import sawaLogo from "@/assets/img/sawa_logo.svg";
import { amount, chargeTitle, creditSeverity, installmentSeverity, isoDate, loadCurrency, today } from "@/utils/accounting";
import AccountingTabs from "@/components/accounting/AccountingTabs.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const REPORTS = ["revenue", "aging", "upcoming", "discounts", "staff"];
const report = ref(REPORTS.includes(route.query.report) ? route.query.report : "revenue");
const monthStart = () => { const date = new Date(); date.setDate(1); return date; };
const inDays = (days) => { const date = new Date(); date.setDate(date.getDate() + days); return date; };
const range = ref([monthStart(), new Date()]);
const asOf = ref(new Date());
const data = ref(null);
const loading = ref(false);

const BUCKETS = ["not_due", "d1_30", "d31_60", "d61_90", "d90_plus"];
const periodText = computed(() => report.value === "aging"
  ? t("acc.reports.as_of", { date: isoDate(asOf.value) })
  : t("acc.reports.period", { from: data.value?.from ?? "", to: data.value?.to ?? "" }));

async function load() {
  loading.value = true;
  data.value = null;
  await loadCurrency();
  const [from, to] = range.value ?? [];
  const params = report.value === "aging" ? { as_of: isoDate(asOf.value) ?? today() } : { from: isoDate(from) ?? undefined, to: isoDate(to ?? from) ?? undefined };
  data.value = (await axios.get(`api/accounting/reports/${report.value}`, { params })).data.data;
  loading.value = false;
}

watch(report, (value) => {
  router.replace({ query: { report: value } });
  // The coming dues start today; the other reports look back over this month.
  range.value = value === "upcoming" ? [new Date(), inDays(30)] : [monthStart(), new Date()];
  load();
});
watch(range, (value) => { if (!value || value[1]) load(); });
watch(asOf, load);

const print = () => window.print();
onMounted(load);
</script>

<template>
  <div>
    <div class="no-print">
      <div class="flex flex-wrap items-center justify-between gap-2 p-4">
        <p class="text-xl text-bp-135c65 font-bold m-0">{{ $t("acc.reports.title") }}</p>
        <Button icon="pi pi-print" :label="$t('acc.print')" :disabled="!data" @click="print" />
      </div>
      <AccountingTabs />
      <div class="sawa-card p-3 flex flex-wrap items-end justify-between gap-3 mb-3">
        <SelectButton v-model="report" :options="REPORTS" :optionLabel="(r) => $t(`acc.reports.${r}`)" :allowEmpty="false" />
        <DatePicker v-if="report === 'aging'" v-model="asOf" dateFormat="yy-mm-dd" showIcon :aria-label="$t('acc.date')" />
        <DatePicker v-else v-model="range" selectionMode="range" dateFormat="yy-mm-dd" showIcon :manualInput="false" :aria-label="$t('acc.period')" class="w-16rem" />
      </div>
    </div>

    <div v-if="loading" class="flex justify-center p-5"><i class="pi pi-spin pi-spinner text-2xl" /></div>
    <div v-else-if="data" class="sawa-card p-4 acc-report">
      <!-- Shown on paper only. -->
      <div class="print-only report-head">
        <img :src="$siteLogo(sawaLogo)" alt="Sawa" class="report-logo" />
        <div class="text-end">
          <div class="text-lg font-bold">{{ $t(`acc.reports.${report}`) }}</div>
          <div class="text-sm" dir="ltr">{{ periodText }}</div>
        </div>
      </div>
      <p class="no-print text-sm text-color-secondary mt-0">{{ $t(`acc.reports.${report}_hint`) }} — {{ periodText }}</p>

      <!-- Revenue -->
      <template v-if="report === 'revenue'">
        <div class="report-stats">
          <div><span>{{ $t("acc.reports.received") }}</span><strong>{{ amount(data.total) }}</strong><small>{{ $t("acc.reports.receipts_count", { n: data.receipts }) }}</small></div>
          <div><span>{{ $t("acc.reports.refunded") }}</span><strong class="text-red-600">{{ amount(data.refunded) }}</strong></div>
          <div><span>{{ $t("acc.reports.net") }}</span><strong class="text-bp-135c65">{{ amount(data.net) }}</strong></div>
          <div><span>{{ $t("acc.reports.from_balance") }}</span><strong>{{ amount(data.from_balance) }}</strong></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <table class="report-table">
            <thead><tr><th>{{ $t("acc.reports.by_source") }}</th><th>{{ $t("acc.reports.receipts") }}</th><th>{{ $t("acc.amount") }}</th></tr></thead>
            <tbody>
              <tr v-for="row in data.by_source" :key="row.source"><td>{{ $t(`acc.source.${row.source}`) }}</td><td>{{ row.receipts }}</td><td>{{ amount(row.amount) }}</td></tr>
              <tr v-if="!data.by_source.length"><td colspan="3" class="text-center">{{ $t("acc.none") }}</td></tr>
            </tbody>
          </table>
          <table class="report-table">
            <thead><tr><th>{{ $t("acc.method") }}</th><th>{{ $t("acc.reports.receipts") }}</th><th>{{ $t("acc.amount") }}</th></tr></thead>
            <tbody>
              <tr v-for="row in data.by_method" :key="row.method"><td>{{ $t(`acc.methods.${row.method}`) }}</td><td>{{ row.receipts }}</td><td>{{ amount(row.amount) }}</td></tr>
              <tr v-if="!data.by_method.length"><td colspan="3" class="text-center">{{ $t("acc.none") }}</td></tr>
            </tbody>
          </table>
        </div>
        <table class="report-table mt-4">
          <thead><tr><th>{{ $t("acc.date") }}</th><th>{{ $t("acc.reports.receipts") }}</th><th>{{ $t("acc.amount") }}</th></tr></thead>
          <tbody>
            <tr v-for="row in data.by_day" :key="row.date"><td dir="ltr" class="text-end">{{ row.date }}</td><td>{{ row.receipts }}</td><td>{{ amount(row.amount) }}</td></tr>
            <tr v-if="!data.by_day.length"><td colspan="3" class="text-center">{{ $t("acc.none") }}</td></tr>
          </tbody>
          <tfoot><tr><th>{{ $t("acc.total") }}</th><th>{{ data.receipts }}</th><th>{{ amount(data.total) }}</th></tr></tfoot>
        </table>
      </template>

      <!-- Aging -->
      <table v-else-if="report === 'aging'" class="report-table">
        <thead>
          <tr><th>{{ $t("acc.child") }}</th><th v-for="bucket in BUCKETS" :key="bucket">{{ $t(`acc.reports.bucket.${bucket}`) }}</th><th>{{ $t("acc.total") }}</th><th>{{ $t("acc.reports.oldest") }}</th></tr>
        </thead>
        <tbody>
          <tr v-for="row in data.rows" :key="row.child?.id">
            <td>{{ row.child?.name }}</td>
            <td v-for="bucket in BUCKETS" :key="bucket" :class="{ 'text-red-600': bucket !== 'not_due' && row[bucket] > 0 }">{{ row[bucket] ? amount(row[bucket]) : "" }}</td>
            <td class="font-semibold">{{ amount(row.total) }}</td>
            <td>{{ row.oldest_days ? $t("acc.reports.days", { n: row.oldest_days }) : "" }}</td>
          </tr>
          <tr v-if="!data.rows.length"><td :colspan="BUCKETS.length + 3" class="text-center">{{ $t("acc.none") }}</td></tr>
        </tbody>
        <tfoot>
          <tr><th>{{ $t("acc.total") }}</th><th v-for="bucket in BUCKETS" :key="bucket">{{ amount(data.totals[bucket]) }}</th><th>{{ amount(data.totals.total) }}</th><th></th></tr>
        </tfoot>
      </table>

      <!-- Coming dues -->
      <table v-else-if="report === 'upcoming'" class="report-table">
        <thead><tr><th>{{ $t("acc.due_date") }}</th><th>{{ $t("acc.child") }}</th><th>{{ $t("acc.description") }}</th><th>{{ $t("acc.amount") }}</th><th class="no-print">{{ $t("acc.status") }}</th></tr></thead>
        <tbody>
          <tr v-for="row in data.rows" :key="row.id">
            <td dir="ltr" class="text-end">{{ row.due_date }}</td><td>{{ row.child?.name }}</td><td>{{ chargeTitle(t, row.charge) }}</td><td>{{ amount(row.amount) }}</td>
            <td class="no-print"><Tag :severity="installmentSeverity[row.state]" :value="$t(`acc.installment_state.${row.state}`)" /></td>
          </tr>
          <tr v-if="!data.rows.length"><td colspan="5" class="text-center">{{ $t("acc.none") }}</td></tr>
        </tbody>
        <tfoot><tr><th colspan="3">{{ $t("acc.total") }}</th><th>{{ amount(data.total) }}</th><th class="no-print"></th></tr></tfoot>
      </table>

      <!-- Discounts & money back -->
      <template v-else-if="report === 'discounts'">
        <h3 class="report-subtitle">{{ $t("acc.reports.discounts_given") }} — {{ amount(data.discount_total) }}</h3>
        <table class="report-table">
          <thead><tr><th>{{ $t("acc.date") }}</th><th>{{ $t("acc.child") }}</th><th>{{ $t("acc.description") }}</th><th>{{ $t("acc.before_discount") }}</th><th>{{ $t("acc.discount") }}</th><th>{{ $t("acc.discount_reason") }}</th><th>{{ $t("acc.created_by") }}</th></tr></thead>
          <tbody>
            <tr v-for="row in data.discounts" :key="row.id">
              <td dir="ltr" class="text-end">{{ String(row.created_at).slice(0, 10) }}</td><td>{{ row.child?.name }}</td><td>{{ chargeTitle(t, row) }}</td>
              <td>{{ amount(row.gross) }}</td><td>{{ amount(row.discount) }}<span v-if="row.discount_type === 'percent'"> ({{ row.discount_value }}%)</span></td>
              <td>{{ row.discount_reason }}</td><td>{{ row.creator?.name }}</td>
            </tr>
            <tr v-if="!data.discounts.length"><td colspan="7" class="text-center">{{ $t("acc.none") }}</td></tr>
          </tbody>
        </table>
        <h3 class="report-subtitle mt-4">{{ $t("acc.credits") }}</h3>
        <div class="report-stats">
          <div><span>{{ $t("acc.credit_status.credit") }}</span><strong>{{ amount(data.credit_totals.credit) }}</strong></div>
          <div><span>{{ $t("acc.credit_status.refunded") }}</span><strong>{{ amount(data.credit_totals.refunded) }}</strong></div>
          <div><span>{{ $t("acc.credit_status.pending") }}</span><strong>{{ amount(data.credit_totals.pending) }}</strong></div>
        </div>
        <table class="report-table">
          <thead><tr><th>{{ $t("acc.date") }}</th><th>{{ $t("acc.child") }}</th><th>{{ $t("acc.description") }}</th><th>{{ $t("acc.suggested") }}</th><th>{{ $t("acc.decided") }}</th><th>{{ $t("acc.status") }}</th><th>{{ $t("acc.created_by") }}</th></tr></thead>
          <tbody>
            <tr v-for="row in data.credits" :key="row.id">
              <td dir="ltr" class="text-end">{{ String(row.decided_at ?? row.created_at).slice(0, 10) }}</td><td>{{ row.child?.name }}</td>
              <td>{{ $t(`acc.credit_type.${row.type}`) }}</td><td>{{ amount(row.suggested) }}</td><td>{{ row.status === "pending" ? "" : amount(row.amount) }}</td>
              <td><Tag :severity="creditSeverity[row.status]" :value="$t(`acc.credit_status.${row.status}`)" /></td><td>{{ row.decider?.name }}</td>
            </tr>
            <tr v-if="!data.credits.length"><td colspan="7" class="text-center">{{ $t("acc.none") }}</td></tr>
          </tbody>
        </table>
      </template>

      <!-- Employees' receipts -->
      <table v-else-if="report === 'staff'" class="report-table">
        <thead><tr><th>{{ $t("acc.reports.employee") }}</th><th>{{ $t("acc.reports.receipts") }}</th><th>{{ $t("acc.reports.received") }}</th><th>{{ $t("acc.methods.cash") }}</th><th>{{ $t("acc.reports.from_balance") }}</th><th>{{ $t("acc.reports.cancelled_receipts") }}</th></tr></thead>
        <tbody>
          <tr v-for="row in data.rows" :key="row.user?.id">
            <td>{{ row.user?.name }}</td><td>{{ row.receipts }}</td><td>{{ amount(row.amount) }}</td><td>{{ amount(row.cash) }}</td><td>{{ amount(row.from_balance) }}</td>
            <td>{{ row.cancelled ? `${row.cancelled} · ${amount(row.cancelled_amount)}` : "" }}</td>
          </tr>
          <tr v-if="!data.rows.length"><td colspan="6" class="text-center">{{ $t("acc.none") }}</td></tr>
        </tbody>
        <tfoot><tr><th>{{ $t("acc.total") }}</th><th>{{ data.receipts }}</th><th>{{ amount(data.total) }}</th><th colspan="3"></th></tr></tfoot>
      </table>

      <p class="print-only text-xs mt-4">{{ $t("acc.reports.printed_on", { date: today() }) }}</p>
    </div>
  </div>
</template>

<style scoped>
.report-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.report-stats > div {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--sawa-border, #dce8e8);
  border-radius: 10px;
}
.report-stats span,
.report-stats small {
  font-size: 0.8rem;
  color: var(--p-text-muted-color, #64748b);
}
.report-stats strong {
  font-size: 1.15rem;
}
.report-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}
.report-table th,
.report-table td {
  border: 1px solid #cfd8dc;
  padding: 0.4rem 0.6rem;
  text-align: start;
}
.report-table thead th,
.report-table tfoot th {
  background: rgb(var(--bp-e6f1f3));
}
.report-subtitle {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
}
.report-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid rgb(var(--bp-135c65));
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}
.report-logo {
  height: 3rem;
}
.print-only {
  display: none;
}
@media print {
  /* Only the report goes on paper. */
  :global(body *) {
    visibility: hidden;
  }
  .acc-report,
  .acc-report * {
    visibility: visible;
  }
  .acc-report {
    position: absolute;
    inset: 0 auto auto 0;
    width: 100%;
    box-shadow: none;
    border: none;
  }
  .print-only {
    display: block;
  }
  .report-head.print-only {
    display: flex;
  }
  .no-print {
    display: none !important;
  }
}
</style>
