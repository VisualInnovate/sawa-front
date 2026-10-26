<script setup>
// The money: what the child's programs, evaluations and consultations cost, what the accounting confirmed, what
// was paid (the receipts), what is still due and when, and what is late.
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";
import EmptyState from "@/components/parent/EmptyState.vue";
import { fmtDate, meta, money } from "@/utils/parentPortal";

const props = defineProps({ child: { type: Object, required: true }, childId: { type: [Number, String], required: true } });
const { t } = useI18n();

const loading = ref(true);
const data = ref(null);

onMounted(async () => {
  try {
    data.value = (await axios.get(`/api/parent/child/${props.childId}/portal/finance`)).data;
  } catch {
    data.value = null;
  } finally {
    loading.value = false;
  }
});

const currency = computed(() => data.value?.currency ?? "JD");
const totals = computed(() => data.value?.totals ?? null);
const charges = computed(() => data.value?.charges ?? []);
const payments = computed(() => (data.value?.payments ?? []).filter((payment) => !payment.cancelled_at));
const credits = computed(() => data.value?.credits ?? []);
const paidPercent = computed(() => (totals.value?.owed ? Math.min(100, Math.round((totals.value.paid / totals.value.owed) * 100)) : 0));

const title = (charge) => {
  if (charge.source === "program" && charge.program) {
    const kind = meta("programKind", charge.program.kind).label;
    return `${t("pp.ch_program")} ${kind} (${fmtDate(charge.program.start_date)} — ${fmtDate(charge.program.end_date)})`;
  }
  if (charge.source === "evaluation") return `${t("pp.ch_evaluation")}${charge.description ? ` · ${charge.description}` : ""}`;
  if (charge.source === "consultation") return `${t("pp.ch_consultation")}${charge.description ? ` · ${charge.description}` : ""}`;
  return charge.fee_type?.name || charge.description || t("pp.ch_other");
};
const METHODS = { cash: "pp.pm_cash", cliq: "pp.pm_cliq", bank: "pp.pm_bank", cheque: "pp.pm_cheque", card: "pp.pm_card", balance: "pp.pm_balance" };
</script>

<template>
  <div class="pp-stack">
    <div v-if="loading" class="pp-stack">
      <div class="pp-skeleton" style="height: 120px" />
      <div class="pp-skeleton" style="height: 240px" />
    </div>

    <EmptyState v-else-if="!data" icon="pi pi-wallet" :text="$t('request_failed_retry')" />

    <template v-else>
      <!-- Totals -->
      <section class="pp-card pp-card--pad pp-stack pp-in">
        <div class="pp-row pp-between">
          <h2 class="pp-h2"><i class="pi pi-wallet text-[var(--pp-teal)]" /> {{ $t("pp.fin_title") }}</h2>
          <span class="pp-tag pp-tag--teal">{{ $t("pp.fin_paid_percent", { n: paidPercent }) }}</span>
        </div>
        <div class="pp-bar"><span :style="{ width: `${paidPercent}%` }" /></div>
        <div class="pp-grid pp-grid--stats">
          <div class="pp-stat"><span class="pp-stat__icon"><i class="pi pi-file" /></span><div><div class="pp-stat__value pp-num">{{ money(totals.owed, currency) }}</div><div class="pp-stat__label">{{ $t("acc.owed") }}</div></div></div>
          <div class="pp-stat"><span class="pp-stat__icon" style="background: var(--pp-success-50); color: var(--pp-success)"><i class="pi pi-check" /></span><div><div class="pp-stat__value pp-num">{{ money(totals.paid, currency) }}</div><div class="pp-stat__label">{{ $t("acc.paid") }}</div></div></div>
          <div class="pp-stat"><span class="pp-stat__icon" style="background: var(--pp-warn-50); color: var(--pp-warn)"><i class="pi pi-hourglass" /></span><div><div class="pp-stat__value pp-num">{{ money(totals.remaining, currency) }}</div><div class="pp-stat__label">{{ $t("acc.remaining") }}</div></div></div>
          <div class="pp-stat"><span class="pp-stat__icon" :style="totals.late > 0 ? 'background: var(--pp-danger-50); color: var(--pp-danger)' : ''"><i class="pi pi-exclamation-triangle" /></span><div><div class="pp-stat__value pp-num" :class="{ 'text-[var(--pp-danger)]': totals.late > 0 }">{{ money(totals.late, currency) }}</div><div class="pp-stat__label">{{ $t("acc.late") }}</div></div></div>
        </div>
        <p v-if="totals.balance > 0" class="pp-item__meta"><i class="pi pi-info-circle" /> {{ $t("pp.fin_balance", { amount: money(totals.balance, currency) }) }}</p>
        <p class="pp-item__meta">{{ $t("pp.fin_pay_hint") }}</p>
      </section>

      <!-- Charges -->
      <section class="pp-stack pp-in" :style="{ '--i': 1 }">
        <h2 class="pp-h2"><i class="pi pi-list text-[var(--pp-teal)]" /> {{ $t("pp.fin_charges") }}</h2>
        <EmptyState v-if="!charges.length" icon="pi pi-wallet" :title="$t('pp.fin_none_title')" :text="$t('pp.fin_none_text')" />
        <article v-for="(charge, i) in charges" :key="charge.id" class="pp-card pp-card--pad pp-stack pp-in" :style="{ '--i': i + 2 }" :class="{ 'opacity-70': charge.status === 'cancelled' }">
          <div class="pp-row pp-between">
            <div>
              <p class="pp-item__title">{{ title(charge) }}</p>
              <p class="pp-item__meta">{{ fmtDate(charge.created_at) }}</p>
            </div>
            <div class="pp-row">
              <span v-if="charge.program?.accounting_status" class="pp-tag" :class="`pp-tag--${meta('programStatus', charge.program.accounting_status).severity}`">{{ meta("programStatus", charge.program.accounting_status).label }}</span>
              <span class="pp-tag" :class="`pp-tag--${meta('charge', charge.status).severity}`">{{ meta("charge", charge.status).label }}</span>
            </div>
          </div>

          <div class="pp-amounts">
            <div><span>{{ $t("acc.total") }}</span><b class="pp-num">{{ money(charge.amount, currency) }}</b></div>
            <div v-if="charge.discount > 0"><span>{{ $t("pp.fin_discount") }}</span><b class="pp-num text-[var(--pp-success)]">− {{ money(charge.discount, currency) }}<small v-if="charge.discount_reason" class="pp-muted block font-normal">{{ charge.discount_reason }}</small></b></div>
            <div><span>{{ $t("acc.paid") }}</span><b class="pp-num text-[var(--pp-success)]">{{ money(charge.paid, currency) }}</b></div>
            <div><span>{{ $t("acc.remaining") }}</span><b class="pp-num">{{ money(charge.remaining, currency) }}</b></div>
          </div>

          <div v-if="charge.lines?.length" class="pp-row">
            <span v-for="(line, n) in charge.lines" :key="n" class="pp-tag">{{ line.label || line.title || line.description }}<template v-if="line.amount"> · {{ money(line.amount, currency) }}</template></span>
          </div>

          <div v-if="charge.installments?.length" class="pp-installments">
            <div v-for="row in charge.installments" :key="row.id" class="pp-installment" :class="`is-${row.state}`">
              <span class="pp-installment__date">{{ fmtDate(row.due_date) }}</span>
              <b class="pp-num">{{ money(row.amount, currency) }}</b>
              <span class="pp-tag" :class="`pp-tag--${meta('installment', row.state).severity}`">
                {{ meta("installment", row.state).label }}<template v-if="row.state === 'paid' && row.paid_at"> · {{ fmtDate(row.paid_at) }}</template>
              </span>
            </div>
          </div>
          <p v-if="charge.cancel_reason" class="pp-item__meta">{{ $t("acc.reason") }}: {{ charge.cancel_reason }}</p>
        </article>
      </section>

      <!-- Receipts -->
      <section v-if="payments.length" class="pp-stack pp-in" :style="{ '--i': 3 }">
        <h2 class="pp-h2"><i class="pi pi-receipt text-[var(--pp-teal)]" /> {{ $t("pp.fin_receipts") }}</h2>
        <div class="pp-list">
          <div v-for="payment in payments" :key="payment.id" class="pp-item">
            <span class="pp-item__icon pp-item__icon--success"><i class="pi pi-check" /></span>
            <div class="pp-item__body">
              <p class="pp-item__title">{{ $t("pp.fin_receipt_no", { n: payment.receipt_no ?? payment.id }) }} · <span class="pp-num">{{ money(payment.amount, payment.currency || currency) }}</span></p>
              <p class="pp-item__meta">{{ fmtDate(payment.paid_on) }}<template v-if="payment.method"> · {{ $t(METHODS[payment.method] ?? payment.method) }}</template><template v-if="payment.reference"> · {{ payment.reference }}</template></p>
              <p v-if="payment.notes" class="pp-item__meta">{{ payment.notes }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Money back -->
      <section v-if="credits.length" class="pp-stack pp-in" :style="{ '--i': 4 }">
        <h2 class="pp-h2"><i class="pi pi-replay text-[var(--pp-teal)]" /> {{ $t("acc.credits") }}</h2>
        <div class="pp-list">
          <div v-for="credit in credits" :key="credit.id" class="pp-item">
            <span class="pp-item__icon pp-item__icon--info"><i class="pi pi-replay" /></span>
            <div class="pp-item__body">
              <p class="pp-item__title pp-num">{{ money(credit.amount ?? credit.suggested, currency) }}</p>
              <p class="pp-item__meta">{{ fmtDate(credit.created_at) }}<template v-if="credit.reason"> · {{ credit.reason }}</template><template v-if="credit.note"> · {{ credit.note }}</template></p>
            </div>
            <span class="pp-tag" :class="`pp-tag--${meta('credit', credit.status).severity}`">{{ meta("credit", credit.status).label }}</span>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.pp-amounts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem 1rem;
}
.pp-amounts > div {
  display: grid;
  padding: 0.6rem 0.75rem;
  border-radius: 12px;
  background: var(--pp-sand);
}
.pp-amounts span {
  font-size: 0.78rem;
  color: var(--pp-muted);
}
.pp-installments {
  display: grid;
  gap: 0.4rem;
}
.pp-installment {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.55rem 0.8rem;
  border-radius: 12px;
  border: 1px solid var(--pp-sand-200);
  font-size: 0.9rem;
}
.pp-installment.is-late {
  border-color: rgba(194, 40, 46, 0.35);
  background: var(--pp-danger-50);
}
.pp-installment.is-due {
  border-color: rgba(201, 106, 18, 0.35);
  background: var(--pp-warn-50);
}
.pp-installment.is-paid {
  opacity: 0.8;
}
@media (min-width: 640px) {
  .pp-amounts {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
