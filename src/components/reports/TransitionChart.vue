<script setup>
// Transition as on the VB-MAPP Transition scoring form: one small grid per question (in the form's order), a column
// per test (1-4, oldest first) filled from the bottom up to that test's score (1-5) in the test's color. A test
// without a score for a question (0) tints the number under its column instead.
import { computed } from "vue";

const props = defineProps({
  // [{ result: [{ id, title, display_order, score }], form: { colors: [] } }], oldest first
  tests: { type: Array, required: true },
});

const LEVELS = [5, 4, 3, 2, 1];
const COLUMNS = [0, 1, 2, 3];

// The questions of the newest test (every question that existed then), in the form's order.
const questions = computed(() => [...(props.tests[props.tests.length - 1]?.result ?? [])]
  .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0) || a.id - b.id));

const color = (column) => `#${String(props.tests[column]?.form?.colors?.[0] || "135c65").replace("#", "")}`;
const score = (column, question) => Number((props.tests[column]?.result ?? []).find((row) => row.id === question.id)?.score ?? 0);
const fill = (column, question, level) => (props.tests[column] && score(column, question) >= level ? color(column) : "transparent");
// A chosen test that gave this question no score.
const zero = (column, question) => Boolean(props.tests[column]) && score(column, question) === 0;
</script>

<template>
  <div class="trc">
    <section v-for="question in questions" :key="question.id" class="trc-item">
      <h5>{{ question.title }}</h5>
      <div class="trc-grid">
        <template v-for="level in LEVELS" :key="level">
          <span class="trc-level">{{ level }}</span>
          <span v-for="column in COLUMNS" :key="column" class="trc-cell" :style="{ background: fill(column, question, level) }" />
        </template>
        <span />
        <span v-for="column in COLUMNS" :key="'k' + column" class="trc-test">
          <i v-if="zero(column, question)" class="trc-zero" :style="{ background: color(column) }" />
          <b>{{ column + 1 }}</b>
        </span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.trc {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 4mm 4mm;
}
.trc-item {
  display: grid;
  align-content: start;
  gap: 4px;
  break-inside: avoid;
  page-break-inside: avoid;
}
.trc-item h5 {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  min-height: 3.6em;
  margin: 0;
  padding: 2px 4px;
  border-radius: 3px;
  background: #e2e8f0;
  font-size: 8pt;
  font-weight: 800;
  line-height: 1.35;
  text-align: center;
  color: #1e293b;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.trc-grid {
  display: grid;
  grid-template-columns: 16px repeat(4, 1fr);
  gap: 0;
  margin-inline: auto;
  width: 100%;
  max-width: 36mm;
  direction: ltr;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.trc-level,
.trc-test {
  display: grid;
  place-items: center;
  font-size: 7.5pt;
  font-weight: 700;
  color: #64748b;
}
.trc-cell {
  height: 5.5mm;
  border: 1px solid #1e293b;
  margin: 0 -1px -1px 0;
}
.trc-test {
  position: relative;
  padding-top: 2px;
}
.trc-test b {
  position: relative;
  font-weight: inherit;
}
.trc-zero {
  position: absolute;
  inset: 2px 1px 0;
  opacity: 0.4;
}
</style>
