<script setup>
// «المالية»: the family's money at a glance — what is owed, paid, late and owed back for all the children — then
// each child's full account (charges, installments, discounts, receipts, compensations), one child at a time.
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import PageHead from "@/components/parent/PageHead.vue";
import ChildAvatar from "@/components/parent/ChildAvatar.vue";
import EmptyState from "@/components/parent/EmptyState.vue";
import FinanceTab from "./child/FinanceTab.vue";
import { fmtDate, meta, money } from "@/utils/parentPortal";

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const data = ref(null);

onMounted(async () => {
  try {
    data.value = (await axios.get("/api/parent/finances")).data;
  } catch {
    data.value = null;
  } finally {
    loading.value = false;
  }
});

const currency = computed(() => data.value?.currency ?? "JD");
const totals = computed(() => data.value?.totals ?? null);
const rows = computed(() => data.value?.children ?? []);
const paidPercent = computed(() => (totals.value?.owed ? Math.min(100, Math.round((totals.value.paid / totals.value.owed) * 100)) : 0));
const owedBack = computed(() => (totals.value ? Number(totals.value.balance || 0) + Number(totals.value.pending_credits || 0) : 0));
const nextChild = computed(() => rows.value.find((row) => row.child.id === totals.value?.next_due?.child_id)?.child ?? null);

// The child shown below: from the address (?child=), else the first one.
const selectedId = computed(() => {
  const wanted = String(route.query.child ?? "");
  return (rows.value.find((row) => String(row.child.id) === wanted) ?? rows.value[0])?.child.id ?? null;
});
const selected = computed(() => rows.value.find((row) => row.child.id === selectedId.value) ?? null);
const pick = (id) => router.replace({ query: { ...route.query, child: id } });
</script>

<template>
  <div class="pp-page">
    <PageHead :title="$t('pp.fin_page_title')" :lead="$t('pp.fin_page_lead')" :kicker="$t('pp.brand')" icon="pi pi-wallet" />

    <div v-if="loading" class="pp-stack">
      <div class="pp-skeleton" style="height: 180px" />
      <div class="pp-skeleton" style="height: 320px" />
    </div>

    <EmptyState v-else-if="!data" icon="pi pi-wallet" :text="$t('request_failed_retry')" />
    <EmptyState v-else-if="!rows.length" icon="pi pi-users" :text="$t('pp.fin_none_text')" />

    <template v-else>
      <!-- The family -->
      <section class="pp-card pp-card--pad pp-stack pp-in pp-family">
        <div class="pp-row pp-between">
          <div>
            <h2 class="pp-h2"><i class="pi pi-home text-[var(--pp-teal)]" /> {{ $t("pp.fin_family") }}</h2>
            <p class="pp-item__meta">{{ $t("pp.fin_family_hint") }}</p>
          </div>
          <span class="pp-tag pp-tag--teal">{{ $t("pp.fin_paid_percent", { n: paidPercent }) }}</span>
        </div>
        <div class="pp-bar"><span :style="{ width: `${paidPercent}%` }" /></div>

        <div class="pp-blocks">
          <div class="pp-block">
            <p class="pp-block__title"><i class="pi pi-file" /> {{ $t("pp.fin_owe") }}</p>
            <b class="pp-block__value pp-num">{{ money(totals.remaining, currency) }}</b>
            <dl class="pp-kv">
              <dt>{{ $t("acc.owed") }}</dt><dd class="pp-num">{{ money(totals.owed, currency) }}</dd>
              <template v-if="totals.discount > 0"><dt>{{ $t("pp.fin_discounts") }}</dt><dd class="pp-num text-[var(--pp-success)]">− {{ money(totals.discount, currency) }}</dd></template>
              <dt>{{ $t("acc.late") }}</dt><dd class="pp-num" :class="{ 'text-[var(--pp-danger)]': totals.late > 0 }">{{ money(totals.late, currency) }}</dd>
            </dl>
          </div>
          <div class="pp-block pp-block--paid">
            <p class="pp-block__title"><i class="pi pi-check-circle" /> {{ $t("pp.fin_paid_block") }}</p>
            <b class="pp-block__value pp-num">{{ money(totals.paid, currency) }}</b>
            <dl class="pp-kv">
              <dt>{{ $t("pp.fin_next_due") }}</dt>
              <dd>
                <template v-if="totals.next_due">
                  <span class="pp-num">{{ $t("pp.fin_next_due_on", { amount: money(totals.next_due.amount, currency), date: fmtDate(totals.next_due.due_date) }) }}</span>
                  <small v-if="nextChild && rows.length > 1" class="pp-muted block">{{ nextChild.name }}</small>
                </template>
                <span v-else class="pp-muted">{{ $t("pp.fin_no_next") }}</span>
              </dd>
            </dl>
          </div>
          <div class="pp-block pp-block--back">
            <p class="pp-block__title"><i class="pi pi-replay" /> {{ $t("pp.fin_back") }}</p>
            <b class="pp-block__value pp-num">{{ money(owedBack, currency) }}</b>
            <dl class="pp-kv">
              <dt>{{ $t("pp.fin_balance_label") }}</dt><dd class="pp-num">{{ money(totals.balance, currency) }}</dd>
              <dt>{{ $t("pp.fin_pending_credits") }}</dt><dd class="pp-num">{{ money(totals.pending_credits, currency) }}</dd>
              <template v-if="totals.refunded > 0"><dt>{{ $t("pp.fin_refunded") }}</dt><dd class="pp-num">{{ money(totals.refunded, currency) }}</dd></template>
            </dl>
          </div>
        </div>
      </section>

      <!-- Each child -->
      <section class="pp-stack">
        <h2 class="pp-h2 pp-in" :style="{ '--i': 1 }"><i class="pi pi-users text-[var(--pp-teal)]" /> {{ $t("pp.fin_children") }}</h2>
        <div class="pp-kids pp-in" :style="{ '--i': 2 }">
          <button v-for="row in rows" :key="row.child.id" type="button" class="pp-card pp-kid" :class="{ 'is-active': row.child.id === selectedId }" :aria-pressed="row.child.id === selectedId" @click="pick(row.child.id)">
            <ChildAvatar :child="row.child" :size="40" />
            <span class="pp-kid__body">
              <span class="pp-item__title">{{ row.child.name }}</span>
              <span class="pp-item__meta">{{ $t("acc.remaining") }}: <b class="pp-num">{{ money(row.totals.remaining, currency) }}</b></span>
            </span>
            <span v-if="row.totals.late > 0" class="pp-tag pp-tag--danger">{{ meta("installment", "late").label }}</span>
          </button>
        </div>

        <FinanceTab v-if="selected" :key="selected.child.id" :child="selected.child" :childId="selected.child.id" />
      </section>
    </template>
  </div>
</template>

<style scoped>
.pp-blocks {
  display: grid;
  gap: 0.75rem;
}
.pp-block {
  display: grid;
  gap: 0.4rem;
  align-content: start;
  padding: 0.9rem 1rem;
  border-radius: 14px;
  background: var(--pp-sand);
  border-top: 4px solid var(--pp-warn);
}
.pp-block--paid {
  border-top-color: var(--pp-success);
}
.pp-block--back {
  border-top-color: var(--pp-teal);
}
.pp-block__title {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 700;
  color: var(--pp-muted);
  font-size: 0.9rem;
}
.pp-block__value {
  font-size: 1.5rem;
  color: var(--pp-ink);
}
.pp-kids {
  display: flex;
  gap: 0.6rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
}
.pp-kid {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.9rem;
  min-width: 220px;
  text-align: start;
  border: 2px solid transparent;
  cursor: pointer;
  font: inherit;
  color: inherit;
}
.pp-kid.is-active {
  border-color: var(--pp-teal);
}
.pp-kid__body {
  display: grid;
  flex: 1;
}
@media (min-width: 768px) {
  .pp-blocks {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
