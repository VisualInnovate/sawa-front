<script setup>
// One tracking column's start and end dates, stacked and labelled (green start, blue end) so they read at a glance.
// Editable: each date is a chip that opens the date picker, with × to clear it; `#end-empty` replaces an empty end
// (the session's «تم تحقيق الهدف»). An older free-text value is shown as it is until a date is picked.
import { isDate, showDate } from "@/utils/trackingColumns";

const props = defineProps({
  start: { type: String, default: "" },
  end: { type: String, default: "" },
  editable: Boolean,
  disabled: Boolean,
});
const emit = defineEmits(["change"]); // (end: "start" | "end", value: "YYYY-MM-DD" | "")

const inputs = {}; // the hidden date inputs, by end
const value = (end) => props[end] ?? "";
function pick(end) {
  if (!props.editable || props.disabled) return;
  const input = inputs[end];
  try {
    input.showPicker();
  } catch {
    input.focus();
    input.click();
  }
}
function changed(end, event) {
  const picked = event.target.value;
  // Back to the shown date until the parent takes the new one (a refused date does not stay in the picker).
  event.target.value = isDate(value(end)) ? value(end) : "";
  if (picked !== value(end)) emit("change", end, picked);
}
</script>

<template>
  <div class="td-root">
    <div v-for="end in ['start', 'end']" :key="end" class="td-row" :class="`is-${end}`">
      <span class="td-label">{{ $t(`ereport.trial_${end}`) }}</span>
      <slot v-if="end === 'end' && !value('end') && $slots['end-empty']" name="end-empty" />
      <span v-else-if="editable" class="td-pick">
        <button type="button" class="td-date ltr" :class="{ 'is-empty': !value(end), 'is-text': value(end) && !isDate(value(end)) }"
          :disabled="disabled" @click="pick(end)">
          <i class="pi pi-calendar" aria-hidden="true" />{{ value(end) ? showDate(value(end)) : $t("ereport.pick_date") }}
        </button>
        <button v-if="value(end)" type="button" class="td-clear" :disabled="disabled" :aria-label="$t('ereport.clear_date')"
          @click="emit('change', end, '')"><i class="pi pi-times" /></button>
        <input :ref="(el) => (inputs[end] = el)" type="date" class="td-input" tabindex="-1" aria-hidden="true"
          :value="isDate(value(end)) ? value(end) : ''" :min="end === 'end' && isDate(start) ? start : undefined"
          :max="end === 'start' && isDate(props.end) ? props.end : undefined" @change="changed(end, $event)" />
      </span>
      <b v-else-if="value(end)" class="td-value ltr">{{ showDate(value(end)) }}</b>
      <span v-else class="td-empty">—</span>
    </div>
  </div>
</template>

<style scoped>
.td-root { display: grid; gap: 3px; }
.td-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 1px 4px; padding: 2px 4px; border-radius: 6px; line-height: 1.25; }
.td-row.is-start { background: #ecfdf5; }
.td-row.is-end { background: #eef2ff; }
.td-label { font-size: .72em; font-weight: 800; }
.is-start .td-label { color: #047857; }
.is-end .td-label { color: #4338ca; }
.td-value { font-size: .85em; color: #0f172a; white-space: nowrap; }
.td-empty { color: #64748b; }
.td-pick { position: relative; display: inline-flex; align-items: center; gap: 2px; }
.td-date { display: inline-flex; align-items: center; gap: 3px; padding: 1px 5px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff;
  color: #0f172a; font: inherit; font-size: .85em; font-weight: 700; white-space: nowrap; cursor: pointer; transition: border-color .15s, box-shadow .15s; }
.td-date i { font-size: .8em; color: #64748b; }
.td-date:hover:not(:disabled) { border-color: #0f8a7e; box-shadow: 0 0 0 2px #ccfbf1; }
.td-date.is-empty { border-style: dashed; color: #475569; font-weight: 600; }
.td-date.is-text { white-space: normal; font-weight: 600; color: #92400e; }
.td-date:disabled { cursor: default; }
.td-clear { border: 0; background: none; padding: 0 2px; color: #94a3b8; cursor: pointer; font-size: .7em; }
.td-clear:hover:not(:disabled) { color: #dc2626; }
.td-input { position: absolute; inset-inline-start: 0; bottom: 0; width: 1px; height: 1px; opacity: 0; pointer-events: none; border: 0; padding: 0; }
@media print {
  .td-row { background: none !important; padding: 0; }
  .td-date { border: 0; padding: 0; background: none; }
  .td-date i, .td-clear, .td-date.is-empty { display: none; }
}
</style>
