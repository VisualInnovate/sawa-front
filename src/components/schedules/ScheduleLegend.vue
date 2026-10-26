<script setup>
// What the colors and marks of the schedule grid mean.
import { ITEM_TYPES } from "@/utils/schedules";

defineProps({
  types: { type: Array, default: () => Object.keys(ITEM_TYPES) },
  // The employee marks (conflict, outside the shift, crowded day); the parent's grid has none of them.
  staffMarks: { type: Boolean, default: true },
});
</script>

<template>
  <div class="sch-legend">
    <span v-for="type in types" :key="type" class="sch-legend-item">
      <span class="sch-swatch" :style="{ background: ITEM_TYPES[type].bg, borderColor: ITEM_TYPES[type].border }" />{{ $t(`sch.type_${type}`) }}
    </span>
    <span class="sch-legend-item"><span class="sch-swatch is-late" />{{ $t("session_status_late") }}</span>
    <span class="sch-legend-item"><span class="sch-swatch is-missed" />{{ $t("session_status_missed") }}</span>
    <span class="sch-legend-item"><span class="sch-swatch is-ongoing" />{{ $t("session_status_ongoing") }}</span>
    <template v-if="staffMarks">
      <span class="sch-legend-item"><span class="sch-swatch is-conflict" />{{ $t("sch.flag_conflict") }}</span>
      <span class="sch-legend-item"><span class="sch-swatch is-outside" />{{ $t("sch.flag_outside_shift") }}</span>
      <span class="sch-legend-item"><span class="sch-swatch is-shift" />{{ $t("sch.shift") }}</span>
    </template>
    <span class="sch-legend-item"><span class="sch-swatch is-holiday" />{{ $t("sch.flag_holiday") }}</span>
  </div>
</template>

<style scoped>
.sch-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1rem;
  font-size: 0.75rem;
  color: #4b5563;
}
.sch-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}
.sch-swatch {
  width: 1rem;
  height: 0.75rem;
  border-radius: 0.2rem;
  border: 1px solid transparent;
  border-inline-start-width: 4px;
  display: inline-block;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.is-late { box-shadow: 0 0 0 2px #f59e0b; background: #fff; }
.is-missed { background: #fde8e8; border-color: #dc2626; }
.is-ongoing { box-shadow: 0 0 0 2px #22c55e; background: #fff; }
.is-conflict { box-shadow: 0 0 0 2px #dc2626; background: #fff; }
.is-outside { outline: 2px dashed #f59e0b; background: #fff; }
.is-shift { background: rgba(58, 163, 155, 0.15); border-color: rgba(58, 163, 155, 0.6); }
.is-holiday { background: repeating-linear-gradient(135deg, #fdecec, #fdecec 3px, #fff 3px, #fff 6px); border-color: #fca5a5; }
</style>
