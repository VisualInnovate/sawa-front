<script setup>
// An age range typed as from–to in months or years and kept in months (v-model:from / v-model:to, null = no limit).
import { computed, ref, watch } from "vue";

const from = defineModel("from", { default: null });
const to = defineModel("to", { default: null });
defineProps({ label: { type: String, default: "" }, invalid: { type: Boolean, default: false } });

const toNumber = (value) => (value === null || value === undefined || value === "" ? null : Number(value));
// Years when the saved ends are whole years, else months.
const unit = ref([from.value, to.value].every((value) => toNumber(value) === null || toNumber(value) % 12 === 0)
  && [from.value, to.value].some((value) => toNumber(value) !== null) ? "years" : "months");
const factor = computed(() => (unit.value === "years" ? 12 : 1));
const shown = (value) => (toNumber(value) === null ? null : Math.round((toNumber(value) / factor.value) * 10) / 10);
const fromShown = ref(shown(from.value));
const toShown = ref(shown(to.value));
const reversed = computed(() => fromShown.value !== null && toShown.value !== null && toShown.value < fromShown.value);

const keep = (value) => (value === null || value === undefined ? null : Math.round(value * factor.value));
watch([fromShown, toShown, unit], () => {
  from.value = keep(fromShown.value);
  to.value = keep(toShown.value);
});
// Loaded later (an edit form): show what came in.
watch([from, to], ([a, b]) => {
  if (keep(fromShown.value) !== toNumber(a)) fromShown.value = shown(a);
  if (keep(toShown.value) !== toNumber(b)) toShown.value = shown(b);
});
</script>

<template>
  <div class="arf">
    <label v-if="label" class="arf-label">{{ label }}</label>
    <div class="arf-row">
      <InputNumber v-model="fromShown" :min="0" :maxFractionDigits="1" :placeholder="$t('age_ranges.from')" :invalid="invalid || reversed" class="arf-num" :aria-label="$t('age_ranges.from')" />
      <span class="arf-dash">–</span>
      <InputNumber v-model="toShown" :min="0" :maxFractionDigits="1" :placeholder="$t('age_ranges.to')" :invalid="invalid || reversed" class="arf-num" :aria-label="$t('age_ranges.to')" />
      <SelectButton v-model="unit" :options="[{ value: 'months', label: $t('age_ranges.months') }, { value: 'years', label: $t('age_ranges.years') }]"
        optionLabel="label" optionValue="value" :allowEmpty="false" size="small" />
    </div>
    <small v-if="reversed" class="arf-error">{{ $t("age_ranges.reversed") }}</small>
    <small v-else class="arf-hint">{{ $t("age_ranges.hint") }}</small>
  </div>
</template>

<style scoped>
.arf { display: grid; gap: .35rem; }
.arf-label { font-weight: 600; }
.arf-row { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; }
.arf-num { width: 7rem; }
.arf-num :deep(input) { width: 100%; }
.arf-dash { color: #64748b; }
.arf-hint { color: #64748b; }
.arf-error { color: #dc2626; }
</style>
