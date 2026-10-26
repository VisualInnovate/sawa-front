<script setup>
// The open installments of a charge: generated (count, every week / month / n days, from a date) then edited one by one;
// they must add up to what is still owed. Paid ones are shown above, fixed.
import { computed, ref } from "vue";
import { amount, generateInstallments, installmentSeverity, isoDate, today } from "@/utils/accounting";

const props = defineProps({
  owed: { type: Number, required: true },
  paidRows: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false },
});
const rows = defineModel({ type: Array, default: () => [] });

const generator = ref({ count: 1, every: "month", days: 30, start: new Date() });
const sum = computed(() => Math.round(rows.value.reduce((total, row) => total + Number(row.amount || 0), 0) * 100) / 100);
const matches = computed(() => Math.abs(sum.value - props.owed) < 0.01);
const everyOptions = ["month", "week", "days"];

function generate() {
  rows.value = generateInstallments(props.owed, generator.value.count, isoDate(generator.value.start), generator.value.every, generator.value.days);
}

function add() {
  rows.value = [...rows.value, { due_date: rows.value.at(-1)?.due_date ?? today(), amount: Math.max(0, Math.round((props.owed - sum.value) * 100) / 100) }];
}

function remove(index) {
  rows.value = rows.value.filter((_, i) => i !== index);
}

function setDate(row, value) {
  row.due_date = isoDate(value);
}

defineExpose({ matches });
</script>

<template>
  <div class="flex flex-column gap-3">
    <div v-if="paidRows.length" class="flex flex-wrap gap-2">
      <Tag v-for="row in paidRows" :key="row.id" :severity="installmentSeverity[row.state]"
        :value="`${row.due_date} · ${amount(row.amount)} · ${$t(`acc.installment_state.${row.state}`)}`" />
    </div>

    <div v-if="!disabled" class="flex flex-wrap items-end gap-2 p-3 border-round surface-50 border-1 surface-border">
      <span class="font-semibold w-full">{{ $t("acc.generator") }}</span>
      <div class="flex flex-column gap-1">
        <label for="gen-count">{{ $t("acc.count") }}</label>
        <InputNumber v-model="generator.count" inputId="gen-count" :min="1" :max="60" showButtons class="w-8rem" @input="(e) => (generator.count = e.value)" />
      </div>
      <div class="flex flex-column gap-1">
        <label for="gen-every">{{ $t("acc.every") }}</label>
        <Select v-model="generator.every" inputId="gen-every" :options="everyOptions" :optionLabel="(o) => $t(`acc.every_${o}`)" class="w-10rem" />
      </div>
      <div v-if="generator.every === 'days'" class="flex flex-column gap-1">
        <label for="gen-days">{{ $t("acc.days") }}</label>
        <InputNumber v-model="generator.days" inputId="gen-days" :min="1" class="w-7rem" />
      </div>
      <div class="flex flex-column gap-1">
        <label for="gen-start">{{ $t("acc.start_from") }}</label>
        <DatePicker v-model="generator.start" inputId="gen-start" dateFormat="yy-mm-dd" showIcon />
      </div>
      <Button icon="pi pi-bolt" :label="$t('acc.generate')" severity="secondary" @click="generate" />
    </div>

    <DataTable :value="rows" size="small">
      <Column :header="'#'" header-style="width:3rem">
        <template #body="{ index }">{{ paidRows.length + index + 1 }}</template>
      </Column>
      <Column :header="$t('acc.due_date')">
        <template #body="{ data }">
          <DatePicker :modelValue="data.due_date ? new Date(`${data.due_date}T00:00:00`) : null" dateFormat="yy-mm-dd" showIcon :disabled="disabled"
            :aria-label="$t('acc.due_date')" @update:modelValue="(value) => setDate(data, value)" />
        </template>
      </Column>
      <Column :header="$t('acc.amount')">
        <template #body="{ data }">
          <InputNumber v-model="data.amount" :min="0" :maxFractionDigits="2" :disabled="disabled" :aria-label="$t('acc.amount')" class="w-9rem" />
        </template>
      </Column>
      <Column v-if="!disabled" header-style="width:3rem">
        <template #body="{ index }">
          <Button icon="pi pi-times" text rounded severity="danger" :aria-label="$t('delete')" @click="remove(index)" />
        </template>
      </Column>
    </DataTable>

    <div class="flex flex-wrap items-center justify-between gap-2">
      <Button v-if="!disabled" icon="pi pi-plus" :label="$t('acc.add_installment')" text @click="add" />
      <span :class="matches ? 'text-green-700' : 'text-red-600'" class="font-semibold">
        {{ matches ? $t("acc.installments_sum", { sum: amount(sum), total: amount(owed) }) : $t("acc.installments_mismatch", { total: amount(owed) }) }}
      </span>
    </div>
  </div>
</template>
