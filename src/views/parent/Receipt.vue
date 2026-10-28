<script setup>
// A receipt («سند قبض») of one of the parent's children, as a printable sheet: number, date, amount, method and
// what it paid (with each installment's discount). Printing hides the portal's frame.
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";
import PageHead from "@/components/parent/PageHead.vue";
import EmptyState from "@/components/parent/EmptyState.vue";
import { fmtDate, meta, money } from "@/utils/parentPortal";
import sawaLogo from "@/assets/img/sawa_logo.svg";

const props = defineProps({ child_id: { type: [String, Number], required: true }, payment_id: { type: [String, Number], required: true } });
const { t } = useI18n();
const loading = ref(true);
const receipt = ref(null);

onMounted(async () => {
  try {
    receipt.value = (await axios.get(`/api/parent/child/${props.child_id}/portal/receipts/${props.payment_id}`)).data.data;
  } catch {
    receipt.value = null;
  } finally {
    loading.value = false;
  }
});

const currency = computed(() => receipt.value?.currency || "JD");
const discounted = computed(() => (receipt.value?.lines ?? []).some((line) => Number(line.discount) > 0));
const lineTitle = (line) => {
  if (line.program) return `${t("pp.ch_program")} ${meta("programKind", line.program.kind).label} (${fmtDate(line.program.start_date)} — ${fmtDate(line.program.end_date)})`;
  if (line.source === "evaluation") return `${t("pp.ch_evaluation")}${line.description ? ` · ${line.description}` : ""}`;
  if (line.source === "consultation") return t("pp.ch_consultation");
  return line.description || t("pp.ch_other");
};
const METHODS = { cash: "pp.pm_cash", cliq: "pp.pm_cliq", bank: "pp.pm_bank", cheque: "pp.pm_cheque", card: "pp.pm_card", balance: "pp.pm_balance" };
const print = () => window.print();
const back = computed(() => ({ name: "parent-finances", query: { child: props.child_id } }));
</script>

<template>
  <div class="pp-page">
    <PageHead :title="$t('acc.receipt_title')" :back="back">
      <template v-if="receipt && !receipt.cancelled_at" #actions>
        <button type="button" class="pp-btn" @click="print"><i class="pi pi-print" /> {{ $t("acc.print") }}</button>
      </template>
    </PageHead>

    <div v-if="loading" class="pp-skeleton" style="height: 360px" />
    <EmptyState v-else-if="!receipt" icon="pi pi-receipt" :text="$t('request_failed_retry')" />

    <article v-else class="pp-card pp-receipt pp-in">
      <header class="pp-receipt__head">
        <img :src="$siteLogo(sawaLogo)" alt="Sawa" class="pp-receipt__logo" />
        <div class="text-center">
          <h2 class="pp-h2 m-0">{{ $t("acc.receipt_title") }}</h2>
          <span v-if="receipt.cancelled_at" class="pp-receipt__cancelled">{{ $t("pp.fin_receipt_cancelled") }}</span>
        </div>
        <dl class="pp-kv text-sm">
          <dt>{{ $t("acc.receipt_no") }}</dt><dd class="pp-num">{{ receipt.receipt_no }}</dd>
          <dt>{{ $t("acc.date") }}</dt><dd>{{ fmtDate(receipt.paid_on) }}</dd>
        </dl>
      </header>

      <dl class="pp-kv">
        <dt>{{ $t("acc.received_from") }}</dt><dd>{{ receipt.child?.name }}</dd>
        <dt>{{ $t("acc.amount") }}</dt><dd class="pp-num pp-receipt__amount">{{ money(receipt.amount, currency) }}</dd>
        <dt>{{ $t("acc.method") }}</dt><dd>{{ $t(METHODS[receipt.method] ?? receipt.method) }}<template v-if="receipt.reference"> · {{ receipt.reference }}</template></dd>
      </dl>

      <div class="pp-receipt__table-wrap">
        <table class="pp-receipt__table">
          <thead>
            <tr>
              <th>{{ $t("acc.for") }}</th><th>{{ $t("acc.due_date") }}</th>
              <template v-if="discounted"><th>{{ $t("pp.fin_before_discount") }}</th><th>{{ $t("pp.fin_discount") }}</th></template>
              <th>{{ $t("acc.amount") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(line, i) in receipt.lines" :key="i">
              <td>{{ lineTitle(line) }}</td><td>{{ fmtDate(line.due_date) }}</td>
              <template v-if="discounted"><td class="pp-num">{{ money(line.base, currency) }}</td><td class="pp-num">{{ line.discount > 0 ? `− ${money(line.discount, currency)}` : "" }}</td></template>
              <td class="pp-num">{{ money(line.amount, currency) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <dl class="pp-kv">
        <dt>{{ $t("pp.fin_remaining_now") }}</dt><dd class="pp-num">{{ money(receipt.remaining_now, currency) }}</dd>
      </dl>
      <footer class="pp-receipt__foot">
        <span v-if="receipt.received_by">{{ $t("pp.fin_received_by") }}: {{ receipt.received_by }}</span>
        <span>{{ $t("acc.signature") }}: ____________________</span>
      </footer>
    </article>
  </div>
</template>

<style scoped>
.pp-receipt {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
  max-width: 820px;
  margin-inline: auto;
  width: 100%;
}
.pp-receipt__head {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  padding-bottom: 0.9rem;
  border-bottom: 2px solid var(--pp-teal);
}
.pp-receipt__logo {
  max-height: 3.25rem;
  max-width: 8rem;
  object-fit: contain;
}
.pp-receipt__cancelled {
  display: inline-block;
  margin-top: 0.3rem;
  padding: 0 0.7rem;
  border: 2px solid var(--pp-danger);
  color: var(--pp-danger);
  font-weight: 700;
}
.pp-receipt__amount {
  font-size: 1.25rem;
}
.pp-receipt__table-wrap {
  overflow-x: auto;
}
.pp-receipt__table {
  width: 100%;
  min-width: 540px;
  border-collapse: collapse;
  font-size: 0.9rem;
}
.pp-receipt__table th,
.pp-receipt__table td {
  border: 1px solid var(--pp-sand-200);
  padding: 0.45rem 0.6rem;
  text-align: start;
}
.pp-receipt__table th {
  background: var(--pp-teal-50);
  color: var(--pp-teal-900);
}
.pp-receipt__foot {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
  font-size: 0.9rem;
}
@media (max-width: 560px) {
  .pp-receipt {
    padding: 1rem;
  }
  .pp-receipt__head {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }
}
@media print {
  .pp-receipt {
    box-shadow: none;
    border: 0;
    padding: 0;
    max-width: none;
  }
}
</style>
