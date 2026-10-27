<script setup>
// Barriers as on their results page: one small grid per barrier, a column per test (1-4, oldest first)
// filled from the bottom up to that test's score (0-4) in the test's color.
import { computed } from "vue";

const props = defineProps({
  // [{ result: [{ subtest, score, color }] }], oldest first
  tests: { type: Array, required: true },
});

const LEVELS = [4, 3, 2, 1];
const COLUMNS = [0, 1, 2, 3];

// Every barrier answered in any chosen test, in the order they first appear.
const barriers = computed(() => {
  const names = [];
  for (const test of props.tests) {
    for (const row of test.result ?? []) if (row.subtest && !names.includes(row.subtest)) names.push(row.subtest);
  }
  return names;
});

const answer = (column, barrier) => (props.tests[column]?.result ?? []).find((row) => row.subtest === barrier) ?? null;
const color = (column, row) => `#${String(row?.color || props.tests[column]?.form?.colors?.[0] || "135c65").replace("#", "")}`;
// A chosen test that scored this barrier 0: the number under its column is tinted (faded) in its color.
const zero = (column, barrier) => {
  const row = answer(column, barrier);
  return Boolean(row) && Number(row.score) === 0;
};
const fill = (column, barrier, level) => {
  const row = answer(column, barrier);
  return row && Number(row.score) >= level ? `#${row.color || props.tests[column]?.form?.colors?.[0] || "135c65"}` : "transparent";
};
</script>

<template>
  <div class="bc">
    <section v-for="barrier in barriers" :key="barrier" class="bc-item">
      <h5>{{ barrier }}</h5>
      <div class="bc-grid">
        <template v-for="level in LEVELS" :key="level">
          <span class="bc-level">{{ level }}</span>
          <span v-for="column in COLUMNS" :key="column" class="bc-cell" :style="{ background: fill(column, barrier, level) }" />
        </template>
        <span />
        <span v-for="column in COLUMNS" :key="'k' + column" class="bc-test">
          <i v-if="zero(column, barrier)" class="bc-zero" :style="{ background: color(column, answer(column, barrier)) }" />
          <b>{{ column + 1 }}</b>
        </span>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Six a row, small enough for the whole chart to print on one page, and never split between two. */
.bc {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 2.5mm 3mm;
  break-inside: avoid;
  page-break-inside: avoid;
}
.bc-item {
  display: grid;
  align-content: start;
  gap: 2px;
  break-inside: avoid;
  page-break-inside: avoid;
}
.bc-item h5 {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  min-height: 2.8em;
  margin: 0;
  font-size: 7pt;
  font-weight: 800;
  line-height: 1.35;
  text-align: center;
  color: #1e293b;
}
.bc-grid {
  display: grid;
  grid-template-columns: 12px repeat(4, 1fr);
  gap: 0;
  margin-inline: auto;
  width: 100%;
  max-width: 30mm;
  direction: ltr;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.bc-level,
.bc-test {
  display: grid;
  place-items: center;
  font-size: 6.5pt;
  font-weight: 700;
  color: #64748b;
}
.bc-cell {
  height: 4mm;
  border: 1px solid #1e293b;
  margin: 0 -1px -1px 0;
}
.bc-test {
  position: relative;
  padding-top: 2px;
}
.bc-test b {
  position: relative;
  font-weight: inherit;
}
.bc-zero {
  position: absolute;
  inset: 2px 1px 0;
  opacity: 0.4;
}
/* a phone screen (result pages, parents' portal) */
@media screen and (max-width: 640px) {
  .bc { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
</style>
