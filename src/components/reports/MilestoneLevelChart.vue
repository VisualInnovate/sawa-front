<script setup>
// One VB-MAPP level as on the VB-MAPP master scoring form: a strip of stacked square boxes under each domain
// (its English symbol and Arabic name on top), milestone 1 at the bottom, the level drawn in its own color.
// A full score (1) fills a box's upper and lower half, a half score (0.5) the lower half only. Each half takes
// the color of the first test (oldest first) that reached it, so the strip shows what every test added; the
// legend numbers the colors 1-4 like the report's test table. Used by the report and the results page.
import { computed } from "vue";

const props = defineProps({
  // { level_id, level_name, level_age, subtests: [{ subtest_name, subtest_symbol, questions: [{ question, marks: [{ n, color, score }] }] }] }
  level: { type: Object, required: true },
  // The results page shows a single test: no legend.
  legend: { type: Boolean, default: true },
});

// The form's level colors: level 1 red, level 2 green, level 3 indigo.
const LEVEL_COLORS = { 1: "#d64545", 2: "#3f9b3f", 3: "#4b4fc4" };

const subtests = computed(() => props.level?.subtests ?? []);
const rows = computed(() => Math.max(1, ...subtests.value.map((s) => s.questions?.length || 0)));
const levelNumber = computed(() => Number(props.level?.level_age) || null);
const color = computed(() => LEVEL_COLORS[levelNumber.value] ?? "#135c65");

const firstReached = (question, threshold) =>
  [...(question?.marks ?? [])].sort((a, b) => a.n - b.n).find((mark) => mark.color && Number(mark.score) >= threshold) ?? null;
const halfColor = (question, threshold) => {
  const mark = firstReached(question, threshold);
  return mark ? "#" + mark.color : "";
};

// The tests' colors at this level.
const legendItems = computed(() => {
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
  <section class="mc" :style="{ '--level': color, '--rows': rows }">
    <header class="mc-head">
      <h4>
        <span v-if="levelNumber" class="mc-level ltr">LEVEL {{ levelNumber }}</span>
        <span class="mc-name">{{ level.level_name }}</span>
      </h4>
      <span v-if="legend && legendItems.length" class="mc-legend">
        <i v-for="item in legendItems" :key="item.n" :style="{ background: '#' + item.color }">{{ item.n }}</i>
      </span>
    </header>
    <div class="mc-columns">
      <div v-for="(subtest, i) in subtests" :key="i" class="mc-column">
        <span class="mc-symbol" :class="{ 'is-empty': !subtest.subtest_symbol }">{{ subtest.subtest_symbol || " " }}</span>
        <span class="mc-domain">{{ subtest.subtest_name }}</span>
        <!-- Milestone 1 at the bottom: the strip grows upwards. -->
        <div class="mc-strip">
          <span v-for="(question, q) in subtest.questions ?? []" :key="q" class="mc-box" :title="(q + 1) + ' - ' + (question.question ?? '')">
            <span class="mc-half" :style="{ background: halfColor(question, 1) }" />
            <span class="mc-half" :style="{ background: halfColor(question, 0.5) }" />
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mc {
  --box: 24px;
  border-inline-end: 2px solid var(--level);
  border-bottom: 2px solid var(--level);
  break-inside: avoid;
  page-break-inside: avoid;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.mc-head {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  padding: 2px 8px;
}
.mc-head h4 {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 0;
  color: var(--level);
}
.mc-level {
  font-size: 13pt;
  font-weight: 800;
  letter-spacing: 0.02em;
}
.mc-name {
  font-size: 8.5pt;
  font-weight: 700;
}
.mc-legend {
  position: absolute;
  inset-inline-start: 6px;
  display: flex;
  gap: 4px;
  direction: ltr;
}
.mc-legend i {
  display: grid;
  place-items: center;
  min-width: 15px;
  height: 15px;
  border-radius: 3px;
  color: #fff;
  font-size: 7.5pt;
  font-style: normal;
  font-weight: 800;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.45);
}
/* One column per domain from the right (Mand first); a level with fewer domains keeps them on the right. */
.mc-columns {
  display: flex;
  justify-content: flex-start;
  gap: 2px;
  padding: 2px 4px 6px;
}
.mc-column {
  flex: 1 1 0;
  min-width: 0;
  max-width: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.mc-symbol {
  max-width: 100%;
  padding: 0 4px;
  border: 1px solid var(--level);
  background: color-mix(in srgb, var(--level) 22%, #fff);
  color: #1f2937;
  font-size: 6.8pt;
  font-weight: 700;
  line-height: 1.5;
  direction: ltr;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mc-symbol.is-empty {
  visibility: hidden;
}
.mc-domain {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  height: 2.5em;
  margin: 1px 0 3px;
  font-size: 6.4pt;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
  color: #374151;
  overflow: hidden;
  overflow-wrap: anywhere;
}
.mc-strip {
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  height: calc(var(--rows) * var(--box));
}
.mc-box {
  display: grid;
  grid-template-rows: 1fr 1fr;
  width: var(--box);
  height: var(--box);
  border: 1px solid var(--level);
  border-top-width: 0;
  background: #fff;
}
.mc-box:last-child {
  border-top-width: 1px;
}
.mc-half + .mc-half {
  border-top: 1px dotted var(--level);
}
.ltr {
  direction: ltr;
  unicode-bidi: isolate;
}
</style>
