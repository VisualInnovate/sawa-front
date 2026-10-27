<script setup>
// The open installments of a charge: generated (count, every week / month / n days, from a date) then edited one by one.
// mode "amount": each row is what is to be paid and they add up to what is still owed; mode "base": each row is its
// value before the discount and they add up to the lines (the discount is being set). `discounts` is each row's
// discount, shown beside it with its value before and after. Paid ones are shown above, fixed.
import { computed, ref } from "vue";
import { amount, generateInstallments, installmentSeverity, installmentText, isoDate, today } from "@/utils/accounting";

const props = defineProps({
  owed: { type: Number, required: true },
  paidRows: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false },
  mode: { type: String, default: "amount" },
  discounts: { type: Array, default: () => [] },
});
const emit = defineEmits(["generated"]);
const rows = defineModel({ type: Array, default: () => [] });

const cents = (value) => Math.round(Number(value) * 100) / 100;
const field = computed(() => (props.mode === "base" ? "base" : "amount"));
const generator = ref({ count: 1, every: "month", days: 30, start: new Date() });
const sum = computed(() => cents(rows.value.reduce((total, row) => total + Number(row[field.value] || 0), 0)));
const matches = computed(() => Math.abs(sum.value - props.owed) < 0.01);
const byMonth = computed(() => rows.value.some((row) => row.month));
const discountOf = (index) => props.discounts[index] ?? 0;
const hasDiscount = computed(() => props.discounts.some((value) => value > 0) || props.paidRows.some((row) => row.discount > 0));
// Each row before and after its discount.
const before = (row, index) => (props.mode === "base" ? Number(row.base || 0) : cents(Number(row.amount || 0) + discountOf(index)));
const after = (row, index) => (props.mode === "base" ? cents(Number(row.base || 0) - discountOf(index)) : Number(row.amount || 0));
const everyOptions = ["month", "week", "days"];

function generate() {
  rows.value = generateInstallments(props.owed, generator.value.count, isoDate(generator.value.start), generator.value.every, generator.value.days)
    .map((row) => ({ due_date: row.due_date, [field.value]: row.amount, discounted: false }));
  emit("generated");
}

function add() {
  rows.value = [...rows.value, { due_date: rows.value.at(-1)?.due_date ?? today(), [field.value]: Math.max(0, cents(props.owed - sum.value)), discounted: false }];
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
        :value="`${installmentText(row)} · ${$t(`acc.installment_state.${row.state}`)}`" />
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
      <Column v-if="byMonth" field="month" :header="$t('acc.month')" />
      <Column :header="$t('acc.due_date')">
        <template #body="{ data }">
          <DatePicker :modelValue="data.due_date ? new Date(`${data.due_date}T00:00:00`) : null" dateFormat="yy-mm-dd" showIcon :disabled="disabled"
            :aria-label="$t('acc.due_date')" @update:modelValue="(value) => setDate(data, value)" />
        </template>
      </Column>
      <Column v-if="hasDiscount" :header="$t('acc.before_discount')">
        <template #body="{ data, index }">
          <InputNumber v-if="mode === 'base'" v-model="data.base" :min="0" :maxFractionDigits="2" :disabled="disabled" :aria-label="$t('acc.before_discount')" class="w-9rem" />
          <span v-else>{{ amount(before(data, index)) }}</span>
        </template>
      </Column>
      <Column v-if="hasDiscount" :header="$t('acc.discount')">
        <template #body="{ index }"><span v-if="discountOf(index) > 0" class="text-green-700 font-semibold">− {{ amount(discountOf(index)) }}</span></template>
      </Column>
      <Column :header="hasDiscount ? $t('acc.after_discount') : $t('acc.amount')">
        <template #body="{ data, index }">
          <InputNumber v-if="mode === 'amount' || !hasDiscount" v-model="data[field]" :min="0" :maxFractionDigits="2" :disabled="disabled"
            :aria-label="$t('acc.amount')" class="w-9rem" />
          <strong v-else :class="{ 'text-red-600': after(data, index) <= 0 }">{{ amount(after(data, index)) }}</strong>
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
        <template v-if="mode === 'base' && hasDiscount">{{ $t("acc.before_discount") }}: </template>
        {{ matches ? $t("acc.installments_sum", { sum: amount(sum), total: amount(owed) }) : $t("acc.installments_mismatch", { total: amount(owed) }) }}
      </span>
    </div>
  </div>
</template>
