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
        <span v-for="column in COLUMNS" :key="'k' + column" class="bc-test">{{ column + 1 }}</span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.bc {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 4mm 4mm;
}
.bc-item {
  display: grid;
  align-content: start;
  gap: 4px;
  break-inside: avoid;
  page-break-inside: avoid;
}
.bc-item h5 {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  min-height: 3.6em;
  margin: 0;
  font-size: 8pt;
  font-weight: 800;
  line-height: 1.35;
  text-align: center;
  color: #1e293b;
}
.bc-grid {
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
.bc-level,
.bc-test {
  display: grid;
  place-items: center;
  font-size: 7.5pt;
  font-weight: 700;
  color: #64748b;
}
.bc-cell {
  height: 6mm;
  border: 1px solid #1e293b;
  margin: 0 -1px -1px 0;
}
.bc-test {
  padding-top: 2px;
}
</style>
