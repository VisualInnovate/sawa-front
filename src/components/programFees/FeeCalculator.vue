<script setup>
// Prices several lines at once with the fee tables. The backend does the calculation (nothing is stored);
// it runs again whenever a line changes.
import { amount as formatAmount } from "@/utils/accounting";
import axios from "axios";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { ITEM_CATEGORIES, TIER_PROGRAMS, money } from "@/utils/programFees";

const props = defineProps({
  items: { type: Array, default: () => [] },
});
const { t } = useI18n();

let nextKey = 1;
const lines = ref([{ key: nextKey++, choice: null, amount: null }]);
const registered = ref(false);
const result = ref(null);
const errors = ref({});
const loading = ref(false);

// One grouped list: the tier programs, then every item by category ("tier:day", "item:12").
const choices = computed(() => [
  { label: t("fees_monthly_programs"), items: TIER_PROGRAMS.map((program) => ({ value: `tier:${program}`, label: t(`fees_${program}`) })) },
  ...ITEM_CATEGORIES.map((category) => ({
    label: t(`fees_${category}`),
    items: props.items.filter((item) => item.category === category).map((item) => ({ value: `item:${item.id}`, label: item.name })),
  })).filter((group) => group.items.length),
]);
const itemsById = computed(() => Object.fromEntries(props.items.map((item) => [`item:${item.id}`, item])));

function amountLabel(choice) {
  if (choice === "tier:day") return t("fees_weekly_sessions");
  if (choice?.startsWith("tier:")) return t("fees_monthly_sessions");
  const item = itemsById.value[choice];
  return item ? `${t("fees_quantity")} (${t(`fees_unit_${item.unit}`)})` : t("fees_quantity");
}

function choose(line) {
  line.amount = line.choice?.startsWith("item:") ? 1 : null;
}

function addLine() {
  lines.value.push({ key: nextKey++, choice: null, amount: null });
}

function removeLine(index) {
  lines.value.splice(index, 1);
  if (!lines.value.length) addLine();
}

const ready = computed(() => lines.value.filter((line) => line.choice && line.amount > 0));

function payload(line) {
  const [kind, value] = line.choice.split(":");
  return kind === "tier" ? { type: value, sessions: line.amount } : { type: "item", item_id: Number(value), quantity: line.amount };
}

let request = 0;
let timer = null;
async function calculate() {
  const current = ++request;
  const valid = ready.value;
  if (!valid.length) {
    result.value = null;
    errors.value = {};
    return;
  }
  loading.value = true;
  try {
    const { data } = await axios.post("api/program-fees/calculate", { registered: registered.value, lines: valid.map(payload) });
    if (current !== request) return;
    result.value = { ...data.data, keys: valid.map((line) => line.key) };
    errors.value = {};
  } catch (e) {
    if (current !== request) return;
    result.value = null;
    // Map "lines.N.sessions" back to the line shown on screen.
    const byIndex = {};
    Object.entries(e.response?.data?.errors ?? {}).forEach(([field, messages]) => {
      const index = Number(field.split(".")[1]);
      if (valid[index]) byIndex[valid[index].key] = messages[0];
    });
    errors.value = byIndex;
  } finally {
    if (current === request) loading.value = false;
  }
}

watch([() => lines.value.map((line) => `${line.choice}|${line.amount}`).join(","), registered], () => {
  clearTimeout(timer);
  timer = setTimeout(calculate, 300);
});

function lineResult(line) {
  const index = result.value?.keys.indexOf(line.key) ?? -1;
  return index >= 0 ? result.value.lines[index] : null;
}

function detail(row) {
  if (!row) return "";
  if (row.type === "day") {
    const base = t("fees_day_detail", { monthly: row.monthly_sessions, daily: money(row.daily_sessions), tier: row.tier_sessions, price: money(row.tier_price) });
    return row.extra_sessions ? `${base} + ${t("fees_day_extra_detail", { extra: row.extra_sessions, price: money(row.extra_price) })}` : base;
  }
  if (row.type !== "item") {
    return t("fees_tier_detail", { tier: row.tier_sessions, before: money(row.session_price), after: money(row.session_price_after_discount) });
  }
  if (row.registered_free) return t("fees_registered_free");
  if (row.capped) return t("fees_capped_detail", { cap: money(row.monthly_cap) });
  return `${row.quantity} × ${money(row.unit_price)}`;
}
</script>

<template>
  <div class="flex flex-column gap-3">
    <div v-for="(line, index) in lines" :key="line.key" class="sawa-card p-3 flex flex-column gap-2">
      <div class="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-3 items-end">
        <div class="flex flex-column gap-1">
          <label :for="`fee-line-${line.key}`">{{ $t("fees_item") }}</label>
          <Select v-model="line.choice" :inputId="`fee-line-${line.key}`" :options="choices" optionGroupLabel="label"
            optionGroupChildren="items" optionLabel="label" optionValue="value" filter :placeholder="$t('fees_pick_item')"
            class="w-full" @change="choose(line)" />
        </div>
        <div class="flex flex-column gap-1">
          <label :for="`fee-amount-${line.key}`">{{ amountLabel(line.choice) }}</label>
          <InputNumber v-model="line.amount" :inputId="`fee-amount-${line.key}`" :min="1" :disabled="!line.choice"
            :invalid="!!errors[line.key]" />
        </div>
        <Button icon="pi pi-trash" severity="danger" variant="outlined" v-tooltip.top="$t('delete')" :aria-label="$t('delete')" @click="removeLine(index)" />
      </div>
      <small class="text-red-500" v-if="errors[line.key]">{{ errors[line.key] }}</small>
      <div v-if="lineResult(line)" class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span class="text-color-secondary">{{ detail(lineResult(line)) }}</span>
        <span v-if="lineResult(line).discount > 0" class="line-through text-color-secondary">{{ money(lineResult(line).before_discount) }}</span>
        <Tag v-if="lineResult(line).discount > 0" severity="success" :value="`${$t('fees_discount')} ${money(lineResult(line).discount)}`" />
        <span class="font-bold">{{ formatAmount(lineResult(line).price) }}</span>
        <span v-if="lineResult(line).type === 'clinics' && lineResult(line).usd != null" class="text-color-secondary">{{ money(lineResult(line).usd) }} $</span>
      </div>
      <Message v-for="warning in lineResult(line)?.warnings ?? []" :key="warning" severity="warn" size="small">
        {{ $t(`fees_warning_${warning}`) }}
      </Message>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3">
      <Button icon="pi pi-plus" :label="$t('fees_add_line')" variant="outlined" @click="addLine" />
      <div class="flex items-center gap-2">
        <Checkbox v-model="registered" inputId="fees-registered" binary />
        <label for="fees-registered">{{ $t("fees_registered") }}</label>
      </div>
    </div>

    <div v-if="result" class="sawa-card p-4 flex flex-wrap items-center justify-between gap-3">
      <span class="text-lg font-bold">{{ $t("fees_total") }}</span>
      <div class="flex flex-wrap items-center gap-4">
        <span v-if="result.discount > 0" class="text-color-secondary">
          {{ $t("fees_before_discount") }}: <span class="line-through">{{ money(result.before_discount) }}</span>
        </span>
        <Tag v-if="result.discount > 0" severity="success" :value="`${$t('fees_discount')} ${money(result.discount)}`" />
        <span class="text-xl font-bold text-bp-135c65">{{ formatAmount(result.total) }}</span>
        <span v-if="result.total_usd != null" class="text-color-secondary">{{ money(result.total_usd) }} $</span>
        <i v-if="loading" class="pi pi-spin pi-spinner" />
      </div>
    </div>
  </div>
</template>
