<script setup>
// One VB-MAPP level as the classic grid: a column per domain, milestone 1 at the bottom.
// A full score (1) fills the whole box, a half score (0.5) its lower half, in the level's color.
import { computed } from "vue";

const props = defineProps({
  // { level_id, level_name, subtests: [{ subtest_name, questions: [{ question, answer_score, answer_color }] }] }
  level: { type: Object, required: true },
});

const subtests = computed(() => props.level?.subtests ?? []);
const rows = computed(() => Math.max(0, ...subtests.value.map((s) => s.questions?.length || 0)));
const color = computed(() => {
  for (const subtest of subtests.value) {
    const found = subtest.questions?.find((q) => q.answer_color);
    if (found) return `#${found.answer_color}`;
  }
  return "#135c65";
});
// Row 1 is the bottom one.
const rowNumbers = computed(() => Array.from({ length: rows.value }, (_, i) => rows.value - i));
const cell = (subtest, number) => subtest.questions?.[number - 1] ?? null;
const fill = (question, threshold) =>
  question?.answer_color && Number(question.answer_score) >= threshold ? `#${question.answer_color}` : "transparent";
</script>

<template>
  <section class="mc" :style="{ '--level': color, '--cols': subtests.length || 1 }">
    <header class="mc-head">
      <span class="mc-swatch" />
      <h4>{{ level.level_name }}</h4>
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
          <span :style="{ background: fill(cell(subtest, number), 1) }" />
          <span :style="{ background: fill(cell(subtest, number), 0.5) }" />
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.mc {
  border: 1.5px solid var(--level);
  border-radius: 8px;
  overflow: hidden;
  break-inside: avoid;
  page-break-inside: avoid;
}
.mc-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  background: var(--level);
  color: #fff;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.mc-swatch {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: #fff;
  box-shadow: inset 0 0 0 3px var(--level);
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
.mc-cell span {
  border: 1px dotted #d1d5db;
}
.mc-cell.is-none {
  background: repeating-linear-gradient(45deg, #f8fafc, #f8fafc 4px, #f1f5f9 4px, #f1f5f9 8px);
}
.mc-cell.is-none span {
  border-color: transparent;
}
</style>
