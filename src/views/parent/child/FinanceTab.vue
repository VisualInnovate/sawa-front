<script setup>
// The money of one child: what is owed (the charges with their lines, discounts and installments, what is due and
// late), what was paid (the receipts, each printable) and what is owed back (the money compensations and refunds,
// the balance, and the new appointments given for missed sessions).
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";
import EmptyState from "@/components/parent/EmptyState.vue";
import { fmtDate, fmtDateTime, meta, money } from "@/utils/parentPortal";

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
const payments = computed(() => data.value?.payments ?? []);
const credits = computed(() => data.value?.credits ?? []);
const makeups = computed(() => data.value?.makeups ?? []);
const paidPercent = computed(() => (totals.value?.owed ? Math.min(100, Math.round((totals.value.paid / totals.value.owed) * 100)) : 0));
const owedBack = computed(() => (totals.value ? Number(totals.value.balance || 0) + Number(totals.value.pending_credits || 0) : 0));

const programTitle = (program) => `${t("pp.ch_program")} ${meta("programKind", program.kind).label} (${fmtDate(program.start_date)} — ${fmtDate(program.end_date)})`;
const title = (charge) => {
  if (charge.source === "program" && charge.program) return programTitle(charge.program);
  if (charge.source === "evaluation") return `${t("pp.ch_evaluation")}${charge.description ? ` · ${charge.description}` : ""}`;
  if (charge.source === "consultation") return t("pp.ch_consultation");
  return charge.fee_type || charge.description || t("pp.ch_other");
};
const lineLabel = (line) => {
  if (line.type === "program") return t("pp.fin_line_program");
  if (line.type === "transport") return `${t("pp.fin_line_transport")}${line.name ? ` · ${line.name}` : ""}`;
  return line.name || "";
};
// The before / discount columns only on a charge whose installments carry a discount.
const hasDiscounts = (charge) => (charge.installments ?? []).some((row) => Number(row.discount) > 0);

const creditTitle = (credit) => {
  const base = t(`pp.fin_cr_${credit.type}`);
  if (credit.type === "compensation" && credit.session) return `${base} · ${credit.session.treatment ?? ""} ${fmtDate(credit.session.starts_at)}`.trim();
  if (credit.type === "program_stop" && credit.program) return `${base} · ${meta("programKind", credit.program.kind).label}`;
  if (credit.for) return `${base} · ${credit.for}`;
  return base;
};
const METHODS = { cash: "pp.pm_cash", cliq: "pp.pm_cliq", bank: "pp.pm_bank", cheque: "pp.pm_cheque", card: "pp.pm_card", balance: "pp.pm_balance" };
const methodText = (method) => (method ? t(METHODS[method] ?? method) : "");
const receiptRoute = (payment) => ({ name: "parent-receipt", params: { child_id: props.childId, payment_id: payment.id } });
</script>

<template>
  <div class="pp-stack">
    <div v-if="loading" class="pp-stack">
      <div class="pp-skeleton" style="height: 120px" />
      <div class="pp-skeleton" style="height: 240px" />
    </div>

    <EmptyState v-else-if="!data" icon="pi pi-wallet" :text="$t('request_failed_retry')" />

    <template v-else>
      <!-- Totals: what is owed, what was paid, what is owed back -->
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
        <dl class="pp-kv">
          <dt>{{ $t("pp.fin_next_due") }}</dt>
          <dd>
            <template v-if="totals.next_due">
              <span class="pp-num">{{ $t("pp.fin_next_due_on", { amount: money(totals.next_due.amount, currency), date: fmtDate(totals.next_due.due_date) }) }}</span>
              <span class="pp-tag ms-2" :class="`pp-tag--${meta('installment', totals.next_due.state).severity}`">{{ meta("installment", totals.next_due.state).label }}</span>
            </template>
            <span v-else class="pp-muted">{{ $t("pp.fin_no_next") }}</span>
          </dd>
          <template v-if="totals.discount > 0"><dt>{{ $t("pp.fin_discounts") }}</dt><dd class="pp-num text-[var(--pp-success)]">− {{ money(totals.discount, currency) }}</dd></template>
          <template v-if="totals.balance > 0"><dt>{{ $t("pp.fin_balance_label") }}</dt><dd class="pp-num text-[var(--pp-success)]">{{ money(totals.balance, currency) }}</dd></template>
          <template v-if="totals.pending_credits > 0"><dt>{{ $t("pp.fin_pending_credits") }}</dt><dd class="pp-num">{{ money(totals.pending_credits, currency) }}</dd></template>
          <template v-if="totals.refunded > 0"><dt>{{ $t("pp.fin_refunded") }}</dt><dd class="pp-num">{{ money(totals.refunded, currency) }}</dd></template>
        </dl>
        <p v-if="totals.balance > 0" class="pp-item__meta"><i class="pi pi-info-circle" /> {{ $t("pp.fin_balance", { amount: money(totals.balance, currency) }) }}</p>
        <p class="pp-item__meta">{{ $t("pp.fin_pay_hint") }}</p>
      </section>

      <!-- What is owed: the charges -->
      <section class="pp-stack pp-in" :style="{ '--i': 1 }">
        <h2 class="pp-h2"><i class="pi pi-list text-[var(--pp-teal)]" /> {{ $t("pp.fin_owe") }}</h2>
        <EmptyState v-if="!charges.length" icon="pi pi-wallet" :title="$t('pp.fin_none_title')" :text="$t('pp.fin_none_text')" />
        <article v-for="(charge, i) in charges" :key="charge.id" class="pp-card pp-card--pad pp-stack pp-in" :style="{ '--i': i + 2 }" :class="{ 'opacity-70': charge.status === 'cancelled' }">
          <div class="pp-row pp-between">
            <div class="min-w-0">
              <p class="pp-item__title">{{ title(charge) }}</p>
              <p class="pp-item__meta">{{ fmtDate(charge.created_at) }}</p>
            </div>
            <div class="pp-row">
              <span v-if="charge.program?.accounting_status" class="pp-tag" :class="`pp-tag--${meta('programStatus', charge.program.accounting_status).severity}`">{{ meta("programStatus", charge.program.accounting_status).label }}</span>
              <span class="pp-tag" :class="`pp-tag--${meta('charge', charge.status).severity}`">{{ meta("charge", charge.status).label }}</span>
            </div>
          </div>

          <div v-if="charge.lines?.length > 1 || charge.discount > 0" class="pp-lines">
            <div v-for="(line, n) in charge.lines" :key="n" class="pp-lines__row"><span>{{ lineLabel(line) }}</span><b class="pp-num">{{ money(line.amount, currency) }}</b></div>
            <div v-if="charge.discount > 0" class="pp-lines__row text-[var(--pp-success)]">
              <span>{{ $t("pp.fin_discount") }}<small v-if="charge.discount_reason" class="pp-muted"> · {{ charge.discount_reason }}</small></span>
              <b class="pp-num">− {{ money(charge.discount, currency) }}</b>
            </div>
          </div>

          <div class="pp-amounts">
            <div><span>{{ $t("acc.total") }}</span><b class="pp-num">{{ money(charge.amount, currency) }}</b></div>
            <div><span>{{ $t("acc.paid") }}</span><b class="pp-num text-[var(--pp-success)]">{{ money(charge.paid, currency) }}</b></div>
            <div><span>{{ $t("acc.remaining") }}</span><b class="pp-num">{{ money(charge.remaining, currency) }}</b></div>
            <div><span>{{ $t("acc.late") }}</span><b class="pp-num" :class="{ 'text-[var(--pp-danger)]': charge.late > 0 }">{{ money(charge.late, currency) }}</b></div>
          </div>

          <div v-if="charge.installments?.length" class="pp-stack" style="gap: 0.4rem">
            <p class="pp-item__meta font-semibold">{{ $t("pp.fin_installments") }}</p>
            <div v-for="row in charge.installments" :key="row.id" class="pp-installment" :class="`is-${row.state}`">
              <span class="pp-installment__date">{{ fmtDate(row.due_date) }}</span>
              <span class="pp-installment__amount">
                <template v-if="hasDiscounts(charge) && row.discount > 0">
                  <s class="pp-muted pp-num">{{ money(row.base, currency) }}</s>
                  <small class="text-[var(--pp-success)] pp-num">− {{ money(row.discount, currency) }}</small>
                </template>
                <b class="pp-num">{{ money(row.amount, currency) }}</b>
              </span>
              <span class="pp-row pp-installment__state">
                <span class="pp-tag" :class="`pp-tag--${meta('installment', row.state).severity}`">
                  {{ meta("installment", row.state).label }}<template v-if="row.state === 'paid' && row.paid_at"> · {{ fmtDate(row.paid_at) }}</template>
                </span>
                <router-link v-if="row.payment_id" :to="{ name: 'parent-receipt', params: { child_id: childId, payment_id: row.payment_id } }" class="pp-link text-sm">
                  {{ $t("pp.fin_receipt_short", { n: row.receipt_no ?? row.payment_id }) }}
                </router-link>
              </span>
            </div>
          </div>
          <p v-if="charge.cancel_reason" class="pp-item__meta">{{ $t("acc.reason") }}: {{ charge.cancel_reason }}</p>
        </article>
      </section>

      <!-- What was paid: the receipts -->
      <section class="pp-stack pp-in" :style="{ '--i': 3 }">
        <h2 class="pp-h2"><i class="pi pi-receipt text-[var(--pp-teal)]" /> {{ $t("pp.fin_paid_block") }}</h2>
        <div v-if="payments.length" class="pp-list">
          <div v-for="payment in payments" :key="payment.id" class="pp-item" :class="{ 'opacity-60': payment.cancelled_at }">
            <span class="pp-item__icon" :class="payment.cancelled_at ? '' : 'pp-item__icon--success'"><i :class="payment.cancelled_at ? 'pi pi-times' : 'pi pi-check'" /></span>
            <div class="pp-item__body">
              <p class="pp-item__title">{{ $t("pp.fin_receipt_no", { n: payment.receipt_no ?? payment.id }) }} · <span class="pp-num">{{ money(payment.amount, payment.currency || currency) }}</span></p>
              <p class="pp-item__meta">{{ fmtDate(payment.paid_on) }}<template v-if="payment.method"> · {{ methodText(payment.method) }}</template><template v-if="payment.reference"> · {{ payment.reference }}</template></p>
              <p v-if="payment.lines?.length" class="pp-item__meta">
                {{ $t("pp.fin_for") }}: <template v-for="(line, n) in payment.lines" :key="n">{{ n ? "، " : "" }}{{ line.program ? programTitle(line.program) : line.description || $t(`pp.ch_${line.source === "manual" ? "other" : line.source}`) }} ({{ fmtDate(line.due_date) }})</template>
              </p>
            </div>
            <span v-if="payment.cancelled_at" class="pp-tag pp-tag--neutral">{{ $t("pp.fin_receipt_cancelled") }}</span>
            <router-link v-else :to="receiptRoute(payment)" class="pp-btn pp-btn--ghost pp-btn--sm"><i class="pi pi-print" /> {{ $t("pp.fin_print_receipt") }}</router-link>
          </div>
        </div>
        <EmptyState v-else icon="pi pi-receipt" :text="$t('pp.fin_receipts_none')" />
      </section>

      <!-- What is owed back: money compensations and refunds, and the new appointments for missed sessions -->
      <section class="pp-stack pp-in" :style="{ '--i': 4 }">
        <div>
          <h2 class="pp-h2"><i class="pi pi-replay text-[var(--pp-teal)]" /> {{ $t("pp.fin_credits_title") }}</h2>
          <p class="pp-lead text-sm mt-1">{{ $t("pp.fin_credits_lead") }}</p>
        </div>
        <div v-if="credits.length || owedBack > 0" class="pp-grid pp-grid--stats">
          <div class="pp-stat"><span class="pp-stat__icon" style="background: var(--pp-success-50); color: var(--pp-success)"><i class="pi pi-wallet" /></span><div><div class="pp-stat__value pp-num">{{ money(totals.balance, currency) }}</div><div class="pp-stat__label">{{ $t("pp.fin_balance_label") }}</div></div></div>
          <div class="pp-stat"><span class="pp-stat__icon" style="background: var(--pp-warn-50); color: var(--pp-warn)"><i class="pi pi-clock" /></span><div><div class="pp-stat__value pp-num">{{ money(totals.pending_credits, currency) }}</div><div class="pp-stat__label">{{ $t("pp.fin_pending_credits") }}</div></div></div>
          <div class="pp-stat"><span class="pp-stat__icon"><i class="pi pi-plus-circle" /></span><div><div class="pp-stat__value pp-num">{{ money(totals.credited, currency) }}</div><div class="pp-stat__label">{{ $t("pp.fin_credited") }}</div></div></div>
          <div class="pp-stat"><span class="pp-stat__icon"><i class="pi pi-money-bill" /></span><div><div class="pp-stat__value pp-num">{{ money(totals.refunded, currency) }}</div><div class="pp-stat__label">{{ $t("pp.fin_refunded") }}</div></div></div>
        </div>
        <div v-if="credits.length" class="pp-list">
          <div v-for="credit in credits" :key="credit.id" class="pp-item">
            <span class="pp-item__icon pp-item__icon--info"><i class="pi pi-replay" /></span>
            <div class="pp-item__body">
              <p class="pp-item__title">{{ creditTitle(credit) }}</p>
              <p class="pp-item__meta">
                <span class="pp-num">{{ money(credit.amount, currency) }}</span> · {{ fmtDate(credit.created_at) }}
                <template v-if="credit.status === 'refunded' && credit.refund_method"> · {{ $t("pp.fin_cr_refund_by", { method: methodText(credit.refund_method) }) }}</template>
                <template v-if="credit.decided_at && credit.status !== 'pending'"> · {{ fmtDate(credit.decided_at) }}</template>
              </p>
            </div>
            <span class="pp-tag" :class="`pp-tag--${meta('credit', credit.status).severity}`">{{ meta("credit", credit.status).label }}</span>
          </div>
        </div>
        <EmptyState v-else-if="!makeups.length" icon="pi pi-replay" :text="$t('pp.fin_credits_none')" />

        <template v-if="makeups.length">
          <h3 class="pp-h3"><i class="pi pi-calendar-plus text-[var(--pp-teal)]" /> {{ $t("pp.fin_makeups") }}</h3>
          <div class="pp-list">
            <div v-for="row in makeups" :key="row.id" class="pp-item">
              <span class="pp-item__icon"><i class="pi pi-calendar-plus" /></span>
              <div class="pp-item__body">
                <p class="pp-item__title">{{ row.treatment }}</p>
                <p class="pp-item__meta">{{ $t("pp.fin_makeup_missed") }}: {{ fmtDateTime(row.missed_at) }}</p>
                <p v-if="row.makeup" class="pp-item__meta">{{ $t("pp.fin_makeup_new") }}: {{ fmtDateTime(row.makeup.starts_at) }}<template v-if="row.makeup.therapist"> · {{ row.makeup.therapist }}</template></p>
              </div>
              <span v-if="row.makeup?.status" class="pp-tag" :class="`pp-tag--${meta('session', row.makeup.status).severity}`">{{ meta("session", row.makeup.status).label }}</span>
            </div>
          </div>
        </template>
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
.pp-lines {
  display: grid;
  gap: 0.3rem;
  padding: 0.6rem 0.8rem;
  border-radius: 12px;
  border: 1px dashed var(--pp-sand-200);
  font-size: 0.9rem;
}
.pp-lines__row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
.pp-installment {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 0.4rem 0.75rem;
  padding: 0.55rem 0.8rem;
  border-radius: 12px;
  border: 1px solid var(--pp-sand-200);
  font-size: 0.9rem;
}
.pp-installment__amount {
  display: inline-flex;
  align-items: baseline;
  gap: 0.4rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.pp-installment__state {
  grid-column: 1 / -1;
  gap: 0.5rem;
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
  opacity: 0.85;
}
@media (min-width: 640px) {
  .pp-amounts {
    grid-template-columns: repeat(4, 1fr);
  }
  .pp-installment {
    grid-template-columns: 1fr auto auto;
  }
  .pp-installment__state {
    grid-column: auto;
  }
}
</style>
