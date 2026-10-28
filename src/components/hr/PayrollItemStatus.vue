<script setup>
// Status of a bonus, deduction, overtime amount or financial advance. Approved items go into the next payroll,
// which stamps them with its id: from then on they show as paid and can no longer change.
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  item: { type: Object, required: true },
  canEdit: { type: Boolean, default: false },
});
const emit = defineEmits(["change"]);
const { t } = useI18n();

const options = computed(() => [
  { name: t("Pending"), code: 0 },
  { name: t("Accept"), code: 1 },
  { name: t("Cancell"), code: -1 },
]);
const colors = { 1: "#10B981", 0: "#F59E0B", "-1": "#EF4444" };
</script>

<template>
  <Tag v-if="item.payroll_id" severity="info" :value="t('hrpay.paid')" v-tooltip.top="t('hrpay.paid_hint')" />
  <Select
    v-else
    :disabled="!canEdit"
    :model-value="item.status"
    :options="options"
    option-value="code"
    option-label="name"
    :style="{ backgroundColor: colors[item.status] ?? 'transparent' }"
    @update:model-value="emit('change', $event)"
  />
</template>
