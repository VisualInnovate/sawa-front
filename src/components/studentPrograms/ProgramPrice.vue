<script setup>
// A student program's price month by month (from «رسوم البرامج»): prorated by days, or by the clinics sessions.
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
      <Column v-if="price.kind === 'clinics'" field="sessions" :header="$t('fees_sessions')" />
      <Column v-else :header="$t('sp_days_of_month')">
        <template #body="{ data }">{{ data.days }} / {{ data.days_in_month }}</template>
      </Column>
      <Column :header="$t('fees_discount')">
        <template #body="{ data }">{{ data.discount > 0 ? money(data.discount) : "" }}</template>
      </Column>
      <Column :header="$t('fees_price')">
        <template #body="{ data }"><span class="font-semibold">{{ money(data.price) }}</span></template>
      </Column>
    </DataTable>
    <div class="flex flex-wrap items-center justify-end gap-3">
      <span v-if="price.discount > 0" class="text-color-secondary">
        {{ $t("fees_before_discount") }}: <span class="line-through">{{ money(price.before_discount) }}</span>
      </span>
      <Tag v-if="price.discount > 0" severity="success" :value="`${$t('fees_discount')} ${money(price.discount)}`" />
      <span class="text-lg font-bold text-[#135C65]">{{ $t("fees_total") }}: {{ money(price.total) }} JD</span>
    </div>
  </div>
</template>
