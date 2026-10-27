<script setup>
// A student program's price month by month (from «رسوم البرامج»): the monthly package prorated by days; the
// sessions beyond a month's package (4 weeks) shown as free.
import { amount, currency } from "@/utils/accounting";
import { money } from "@/utils/programFees";

defineProps({
  price: { type: Object, default: null },
});
</script>

<template>
  <div v-if="price" class="flex flex-column gap-2">
    <DataTable :value="price.lines" size="small" dataKey="month">
      <Column field="month" :header="$t('sp_month')" />
      <Column :header="$t('sp_period')">
        <template #body="{ data }">{{ data.from }} → {{ data.to }}</template>
      </Column>
      <Column v-if="price.lines.some((line) => line.days)" :header="$t('sp_days_of_month')">
        <template #body="{ data }">{{ data.days }} / {{ data.days_in_month }}</template>
      </Column>
      <Column v-if="price.kind !== 'inclusion'" :header="$t('fees_sessions')">
        <template #body="{ data }">
          {{ data.paid_sessions ?? data.sessions }}
          <Tag v-if="data.free_sessions > 0" severity="success" class="ms-1" :value="$t('acc.month_free_sessions', { n: data.free_sessions })" />
        </template>
      </Column>
      <Column :header="$t('fees_discount')">
        <template #body="{ data }">{{ data.discount > 0 ? money(data.discount) : "" }}</template>
      </Column>
      <Column :header="$t('fees_price', { currency: currency.currency_name })">
        <template #body="{ data }"><span class="font-semibold">{{ money(data.price) }}</span></template>
      </Column>
    </DataTable>
    <div class="flex flex-wrap items-center justify-end gap-3">
      <span v-if="price.discount > 0" class="text-color-secondary">
        {{ $t("fees_before_discount") }}: <span class="line-through">{{ money(price.before_discount) }}</span>
      </span>
      <Tag v-if="price.discount > 0" severity="success" :value="`${$t('fees_discount')} ${money(price.discount)}`" />
      <span class="text-lg font-bold text-[#135C65]">{{ $t("fees_total") }}: {{ amount(price.total) }}</span>
    </div>
    <small v-if="price.free_sessions > 0" class="text-color-secondary"><i class="pi pi-gift" aria-hidden="true" /> {{ $t("acc.month_free_hint") }}</small>
  </div>
</template>
