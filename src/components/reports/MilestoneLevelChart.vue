<script setup>
// One VB-MAPP level as the classic grid: a column per domain, milestone 1 at the bottom, with every chosen
// test drawn together. A full score (1) fills the box's upper and lower half, a half score (0.5) the lower
// half only; each test that reached a half gets its own segment there, in its color, with its number (1-4).
import { computed } from "vue";

const props = defineProps({
  // { level_id, level_name, subtests: [{ subtest_name, questions: [{ question, marks: [{ n, color, score }] }] }] }
  level: { type: Object, required: true },
});

const subtests = computed(() => props.level?.subtests ?? []);
const rows = computed(() => Math.max(0, ...subtests.value.map((s) => s.questions?.length || 0)));
// Row 1 is the bottom one.
const rowNumbers = computed(() => Array.from({ length: rows.value }, (_, i) => rows.value - i));
const cell = (subtest, number) => subtest.questions?.[number - 1] ?? null;
const reached = (question, threshold) => (question?.marks ?? []).filter((mark) => mark.color && Number(mark.score) >= threshold);

// The tests' colors at this level (the legend under the title).
const legend = computed(() => {
  const seen = new Map();
  for (const subtest of subtests.value) {
    for (const question of subtest.questions ?? []) {
      for (const mark of question.marks ?? []) if (mark.color && !seen.has(mark.n)) seen.set(mark.n, mark.color);
    }
  }
  return [...seen.entries()].sort((a, b) => a[0] - b[0]).map(([n, color]) => ({ n, color }));
});
</script>

<template>
  <section class="mc" :style="{ '--cols': subtests.length || 1 }">
    <header class="mc-head">
      <h4>{{ level.level_name }}</h4>
      <span class="mc-legend">
        <span v-for="item in legend" :key="item.n" class="mc-legend-item">
          <i :style="{ background: '#' + item.color }">{{ item.n }}</i>
        </span>
      </span>
    </header>
    <div class="mc-grid">
      <div class="mc-corner" />
      <div v-for="(subtest, i) in subtests" :key="'h' + i" class="mc-domain">{{ subtest.subtest_name }}</div>
      <template v-for="number in rowNumbers" :key="'r' + number">
        <div class="mc-num">{{ number }}</div>
        <div
          v-for="(subtest, i) in subtests"
          :key="number + '-' + i"
          class="mc-cell"
          :class="{ 'is-none': !cell(subtest, number) }"
          :title="cell(subtest, number)?.question"
        >
          <span v-for="threshold in [1, 0.5]" :key="threshold" class="mc-half">
            <i v-for="mark in reached(cell(subtest, number), threshold)" :key="mark.n" :style="{ background: '#' + mark.color }">{{ mark.n }}</i>
          </span>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.mc {
  border: 1.5px solid #135c65;
  border-radius: 8px;
  overflow: hidden;
  break-inside: avoid;
  page-break-inside: avoid;
}
.mc-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 5px 10px;
  background: #135c65;
  color: #fff;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.mc-legend {
  display: flex;
  gap: 4px;
  direction: ltr;
}
.mc-legend i,
.mc-half i {
  display: grid;
  place-items: center;
  color: #fff;
  font-style: normal;
  font-weight: 800;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.45);
}
.mc-legend i {
  min-width: 18px;
  height: 18px;
  border: 1.5px solid #fff;
  border-radius: 4px;
  font-size: 8pt;
}
.mc-head h4 {
  margin: 0;
  font-size: 11pt;
  font-weight: 800;
}
.mc-grid {
  display: grid;
  grid-template-columns: 26px repeat(var(--cols), minmax(0, 1fr));
  gap: 0 3px;
  padding: 6px;
  background: #fff;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
/* As on the results page: grey headings and row numbers, a column per domain, dotted halves. */
.mc-corner {
  min-height: 38px;
  background: #e5e7eb;
}
.mc-domain {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 2px;
  border-inline: 1px solid #e5e7eb;
  background: #f3f4f6;
  font-size: 7.5pt;
  font-weight: 700;
  line-height: 1.25;
  text-align: center;
  color: #374151;
  overflow-wrap: anywhere;
}
.mc-num {
  display: grid;
  place-items: center;
  border-top: 1px solid #e5e7eb;
  background: #f3f4f6;
  font-size: 8pt;
  font-weight: 700;
  color: #4b5563;
}
.mc-cell {
  display: grid;
  grid-template-rows: 1fr 1fr;
  height: 24px;
  border-top: 1px solid #e5e7eb;
  border-inline: 1px solid #e5e7eb;
}
.mc-half {
  display: flex;
  direction: ltr;
  border: 1px dotted #d1d5db;
  overflow: hidden;
}
.mc-half i {
  flex: 1;
  font-size: 6.5pt;
  line-height: 1;
}
.mc-cell.is-none {
  background: repeating-linear-gradient(45deg, #f8fafc, #f8fafc 4px, #f1f5f9 4px, #f1f5f9 8px);
}
.mc-cell.is-none .mc-half {
  border-color: transparent;
}
</style>
