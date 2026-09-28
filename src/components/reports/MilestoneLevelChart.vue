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
  grid-template-columns: 22px repeat(var(--cols), minmax(0, 1fr));
  gap: 2px;
  padding: 6px;
}
.mc-corner {
  min-height: 34px;
}
.mc-domain {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  min-height: 34px;
  padding: 0 1px 2px;
  font-size: 7.5pt;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
  color: #334155;
  overflow-wrap: anywhere;
}
.mc-num {
  display: grid;
  place-items: center;
  font-size: 8pt;
  font-weight: 700;
  color: #64748b;
}
.mc-cell {
  display: grid;
  grid-template-rows: 1fr 1fr;
  height: 22px;
  border: 1px solid #94a3b8;
  border-radius: 2px;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.mc-cell span:first-child {
  border-bottom: 1px dashed #cbd5e1;
}
.mc-cell.is-none {
  border-style: dashed;
  border-color: #e2e8f0;
}
</style>
