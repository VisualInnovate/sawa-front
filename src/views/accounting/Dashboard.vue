<script setup>
// «لوحة المحاسبة»: what came in, what is due and late, and what waits for the accountant.
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { can } from "@/utils/permissions";
import { amount, loadCurrency } from "@/utils/accounting";
import AccountingTabs from "@/components/accounting/AccountingTabs.vue";
import PaymentDialog from "@/components/accounting/PaymentDialog.vue";

const router = useRouter();
const summary = ref(null);
const paying = ref(false);

async function load() {
  await loadCurrency();
  summary.value = (await axios.get("api/accounting/summary")).data.data;
}

const money = computed(() => summary.value ? [
  { key: "received_today", icon: "pi-wallet", value: summary.value.received_today, tone: "green" },
  { key: "received_month", icon: "pi-calendar", value: summary.value.received_month, tone: "green" },
  { key: "due_month", icon: "pi-clock", value: summary.value.due_month, tone: "blue" },
  { key: "total_remaining", icon: "pi-chart-bar", value: summary.value.remaining, tone: "blue" },
] : []);

// What waits for someone, each opening its page.
const waiting = computed(() => summary.value ? [
  { key: "total_late", count: summary.value.late_children, extra: amount(summary.value.late), to: { name: "accounting-programs", query: { status: "late" } }, tone: "red" },
  { key: "tentative_programs", count: summary.value.tentative_programs, to: { name: "accounting-programs", query: { status: "tentative" } }, tone: "orange" },
  { key: "price_changes", count: summary.value.price_changes, to: { name: "accounting-programs", query: { status: "price_change" } }, tone: "orange" },
  { key: "unconfirmed_programs", count: summary.value.unconfirmed_programs, to: { name: "accounting-programs", query: { status: "unconfirmed" } }, tone: "gray" },
  { key: "locked_evaluations", count: summary.value.locked_evaluations, to: { name: "accounting-evaluations" }, tone: "orange" },
  { key: "locked_consultations", count: summary.value.locked_consultations, to: { name: "accounting-evaluations", query: { tab: "consultations" } }, tone: "orange" },
  { key: "pending_credits", count: summary.value.pending_credits, to: { name: "accounting-credits" }, tone: "orange" },
] : []);

onMounted(load);
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-2 p-4">
      <p class="text-xl text-bp-135c65 font-bold m-0">{{ $t("acc.dashboard") }}</p>
      <Button v-if="can('accounting payments create')" icon="pi pi-wallet" :label="$t('acc.pay')" @click="paying = true" />
    </div>
    <AccountingTabs />
    <div v-if="!summary" class="flex justify-center p-5"><i class="pi pi-spin pi-spinner text-2xl" /></div>
    <template v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        <div v-for="card in money" :key="card.key" class="sawa-card p-4 flex items-center gap-3">
          <span class="acc-icon" :class="`tone-${card.tone}`"><i class="pi" :class="card.icon" aria-hidden="true" /></span>
          <div class="flex flex-column">
            <span class="text-sm text-color-secondary">{{ $t(`acc.${card.key}`) }}</span>
            <span class="text-xl font-bold">{{ amount(card.value) }}</span>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        <button v-for="item in waiting" :key="item.key" type="button" class="sawa-card p-4 flex items-center justify-between gap-3 acc-link text-start"
          :class="{ 'opacity-60': !item.count }" @click="router.push(item.to)">
          <div class="flex flex-column gap-1">
            <span class="font-semibold">{{ $t(`acc.${item.key}`) }}</span>
            <span v-if="item.extra" class="text-sm text-red-600">{{ item.extra }}</span>
          </div>
          <span class="acc-count" :class="`tone-${item.tone}`">{{ item.count }}</span>
        </button>
      </div>
    </template>
    <PaymentDialog v-model:visible="paying" @saved="(payment) => { load(); router.push({ name: 'accounting-receipt', params: { id: payment.id } }); }" />
    <Toast />
  </div>
</template>

<style scoped>
.acc-icon,
.acc-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  min-width: 2.75rem;
  height: 2.75rem;
  font-weight: 700;
  font-size: 1.1rem;
}
.acc-link {
  cursor: pointer;
  border: 1px solid var(--sawa-border);
  transition: box-shadow 0.15s;
}
.acc-link:hover,
.acc-link:focus-visible {
  box-shadow: 0 2px 10px rgb(19 92 101 / 0.15);
}
.tone-green { background: #e7f6ee; color: #1b7a46; }
.tone-blue { background: rgb(var(--bp-e6f1f3)); color: rgb(var(--bp-135c65)); }
.tone-red { background: #fdecec; color: #c62828; }
.tone-orange { background: #fff3e0; color: #b45309; }
.tone-gray { background: #f1f1f1; color: #555; }
</style>
