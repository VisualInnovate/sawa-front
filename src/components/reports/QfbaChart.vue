<script setup>
// QFBA as the form's «Graph» sheet: a column per function, as high as its severity out of the highest possible, with
// the severity on top and the number of endorsed questions under it. One test: each function in its own color; several
// (the report, oldest first): a bar per test in that test's color, with a legend. Texts follow the form's language.
import { computed } from "vue";
import { dmy } from "./reportUtils";
import { functionColor, functionName, qt } from "@/views/evaluation/qfba/qfba";

const props = defineProps({
  // [{ key, date, result: { scores: [{ key, name, name_en, questions, endorsed, severity, max_severity }] } }], oldest first
  tests: { type: Array, required: true },
  lang: { type: String, default: "ar" },
});

const TEST_COLORS = ["#94a3b8", "#0ea5e9", "#f59e0b", "#135c65"];
const single = computed(() => props.tests.length === 1);
const testColor = (index) => TEST_COLORS[TEST_COLORS.length - props.tests.length + index] ?? TEST_COLORS[3];

// The functions of the newest test, each with every test's score.
const rows = computed(() => {
  const newest = props.tests[props.tests.length - 1]?.result?.scores ?? [];
  return newest.map((fn) => ({
    ...fn,
    bars: props.tests.map((test, index) => {
      const score = (test.result?.scores ?? []).find((row) => row.key === fn.key) ?? null;
      return { index, score, color: single.value ? functionColor(fn.key) : testColor(index) };
    }),
  }));
});
const top = computed(() => Math.max(1, ...rows.value.flatMap((row) => row.bars.map((bar) => bar.score?.max_severity ?? 0))));
const ticks = computed(() => {
  const step = top.value > 12 ? 5 : top.value > 6 ? 2 : 1;
  const list = [];
  for (let value = 0; value <= top.value; value += step) list.push(value);
  if (list[list.length - 1] !== top.value) list.push(top.value);
  return list.reverse();
});
const height = (score) => `${Math.min(100, ((score?.severity ?? 0) / top.value) * 100)}%`;
</script>

<template>
  <div class="qc" :dir="lang === 'en' ? 'ltr' : 'rtl'">
    <h4 class="qc-title">{{ qt(lang, "chart_title") }}</h4>
    <div class="qc-plot">
      <div class="qc-axis">
        <span v-for="tick in ticks" :key="tick" :style="{ bottom: (tick / top) * 100 + '%' }">{{ tick }}</span>
      </div>
      <div class="qc-area">
        <span v-for="tick in ticks" :key="'g' + tick" class="qc-grid" :style="{ bottom: (tick / top) * 100 + '%' }" />
        <div v-for="row in rows" :key="row.key" class="qc-group">
          <div v-for="bar in row.bars" :key="bar.index" class="qc-bar" :style="{ height: height(bar.score), background: bar.color }">
            <b>{{ bar.score?.severity ?? "" }}</b>
          </div>
        </div>
      </div>
    </div>
    <div class="qc-labels">
      <span />
      <div class="qc-label-row">
        <div v-for="row in rows" :key="row.key" class="qc-label">
          <b>{{ functionName(row, lang) }}</b>
          <small v-for="bar in row.bars" :key="bar.index" :style="!single ? { color: bar.color } : null">
            {{ qt(lang, "endorsed") }}: <span class="ltr">{{ bar.score?.endorsed ?? 0 }}/{{ bar.score?.questions ?? 0 }}</span>
          </small>
        </div>
      </div>
    </div>
    <div v-if="!single" class="qc-legend">
      <span v-for="(test, index) in tests" :key="test.key ?? index"><i :style="{ background: testColor(index) }" /> <span class="ltr">{{ dmy(test.date) }}</span></span>
    </div>
  </div>
</template>

<style scoped>
.qc { display: grid; gap: 2mm; break-inside: avoid; page-break-inside: avoid; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.qc-title { margin: 0; color: rgb(var(--bp-0e464d, 14 70 77)); font-size: 11pt; font-weight: 800; text-align: center; }
.qc-plot { display: grid; grid-template-columns: 8mm 1fr; height: 70mm; }
.qc-axis { position: relative; }
.qc-axis span { position: absolute; inset-inline-end: 1.5mm; transform: translateY(50%); color: #64748b; font-size: 7.5pt; }
.qc-area { position: relative; display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 4mm; align-items: end; padding: 0 2mm; border-inline-start: 1px solid #94a3b8; border-bottom: 1px solid #94a3b8; }
.qc-grid { position: absolute; inset-inline: 0; border-top: 1px dashed #e2e8f0; }
.qc-group { position: relative; display: flex; align-items: flex-end; justify-content: center; gap: 1mm; height: 100%; }
.qc-bar { position: relative; flex: 1 1 0; max-width: 16mm; min-height: 1px; border-radius: 3px 3px 0 0; }
.qc-bar b { position: absolute; bottom: 100%; inset-inline: 0; color: #1e293b; font-size: 8.5pt; text-align: center; }
.qc-labels { display: grid; grid-template-columns: 8mm 1fr; }
.qc-label-row { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 4mm; padding: 0 2mm; }
.qc-label { display: grid; justify-items: center; gap: .3mm; text-align: center; }
.qc-label b { font-size: 9pt; line-height: 1.3; }
.qc-label small { color: #475569; font-size: 7.5pt; }
.qc-legend { display: flex; flex-wrap: wrap; justify-content: center; gap: 4mm; font-size: 8.5pt; }
.qc-legend i { display: inline-block; width: 3mm; height: 3mm; border-radius: 1px; vertical-align: middle; }
.qc .ltr { direction: ltr; unicode-bidi: isolate; }
</style>
