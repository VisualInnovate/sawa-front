<script setup>
// A receipt («سند قبض») as a printable sheet: number, date, child, amount, method and what it paid.
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { amount, chargeTitle, loadCurrency } from "@/utils/accounting";
import sawaLogo from "@/assets/img/sawa_logo.svg";

const { t } = useI18n();
const route = useRoute();
const payment = ref(null);
const print = () => window.print();

const lines = computed(() => (payment.value?.installments ?? []).map((row) => ({
  id: row.id, title: chargeTitle(t, row.charge ?? {}), due: row.due_date, amount: row.pivot?.amount ?? row.amount,
  discount: Number(row.discount || 0), base: row.base ?? row.amount,
})));
// The before / discount columns only when an installment it paid had a discount.
const discounted = computed(() => lines.value.some((line) => line.discount > 0));

onMounted(async () => {
  await loadCurrency();
  payment.value = (await axios.get(`api/accounting/payments/${route.params.id}`)).data.data;
});
</script>

<template>
  <div class="receipt-page">
    <div class="no-print flex justify-center gap-2 p-3">
      <Button icon="pi pi-print" :label="$t('acc.print')" @click="print" />
    </div>
    <div v-if="!payment" class="flex justify-center p-5"><i class="pi pi-spin pi-spinner text-2xl" /></div>
    <div v-else class="receipt">
      <div class="flex justify-between items-start gap-3 receipt-head">
        <div class="flex flex-column">
          <img :src="sawaLogo" alt="Sawa" class="receipt-logo" />
        </div>
        <div class="text-center">
          <h1 class="m-0 text-2xl">{{ $t("acc.receipt_title") }}</h1>
          <div v-if="payment.cancelled_at" class="receipt-cancelled">{{ $t("acc.cancelled") }}</div>
        </div>
        <div class="flex flex-column text-end text-sm">
          <span>{{ $t("acc.receipt_no") }}: <strong>{{ payment.receipt_no }}</strong></span>
          <span>{{ $t("acc.date") }}: <strong dir="ltr">{{ payment.paid_on }}</strong></span>
        </div>
      </div>

      <div class="receipt-row"><span>{{ $t("acc.received_from") }}:</span><strong>{{ payment.child?.name }}</strong></div>
      <div class="receipt-row"><span>{{ $t("acc.amount") }}:</span><strong class="text-xl">{{ amount(payment.amount) }}</strong></div>
      <div class="receipt-row">
        <span>{{ $t("acc.method") }}:</span>
        <strong>{{ $t(`acc.methods.${payment.method}`) }}<span v-if="payment.reference"> · {{ payment.reference }}</span></strong>
      </div>

      <table class="receipt-table">
        <thead>
          <tr>
            <th>{{ $t("acc.for") }}</th><th>{{ $t("acc.due_date") }}</th>
            <template v-if="discounted"><th>{{ $t("acc.before_discount") }}</th><th>{{ $t("acc.discount") }}</th></template>
            <th>{{ $t("acc.amount") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="line in lines" :key="line.id">
            <td>{{ line.title }}</td><td dir="ltr" class="text-end">{{ line.due }}</td>
            <template v-if="discounted"><td>{{ amount(line.base) }}</td><td>{{ line.discount > 0 ? `− ${amount(line.discount)}` : "" }}</td></template>
            <td>{{ amount(line.amount) }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="payment.notes" class="receipt-row"><span>{{ $t("acc.notes") }}:</span><span>{{ payment.notes }}</span></div>
      <div v-if="payment.balance_after" class="receipt-row"><span>{{ $t("acc.balance_now") }}:</span><span>{{ amount(payment.balance_after) }}</span></div>
      <div class="flex justify-between mt-6 text-sm">
        <span>{{ $t("acc.created_by") }}: {{ payment.creator?.name }}</span>
        <span>{{ $t("acc.signature") }}: ____________________</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.receipt-page {
  background: #f3f5f6;
  min-height: 100vh;
}
.receipt {
  max-width: 190mm;
  margin: 0 auto 2rem;
  background: #fff;
  padding: 12mm;
  border: 1px solid #d7dde0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  color: #1f2a2e;
}
.receipt-head {
  border-bottom: 2px solid #135c65;
  padding-bottom: 0.75rem;
}
.receipt-logo {
  max-height: 3.5rem;
  max-width: 9rem;
  object-fit: contain;
}
.receipt-cancelled {
  margin-top: 0.25rem;
  color: #c62828;
  border: 2px solid #c62828;
  padding: 0 0.75rem;
  font-weight: 700;
}
.receipt-row {
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
}
.receipt-table {
  width: 100%;
  border-collapse: collapse;
}
.receipt-table th,
.receipt-table td {
  border: 1px solid #cfd8dc;
  padding: 0.4rem 0.6rem;
  text-align: start;
}
.receipt-table th {
  background: #e6f1f3;
}
@media print {
  .no-print {
    display: none !important;
  }
  .receipt-page {
    background: #fff;
  }
  .receipt {
    border: none;
    margin: 0;
    padding: 0;
  }
}
</style>
