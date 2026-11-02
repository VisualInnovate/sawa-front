<script setup>
// Ablls OT / Ablls SP as on the paper "Skills Tracking System" flow chart: a column per domain (its name under it),
// its skills stacked from the first (bottom) up, each skill one row of boxes (one per score) colored by the answer.
// With several tests, each box takes the color of the first (oldest) test that reached it.
import { computed } from "vue";

const props = defineProps({
  // [{ result: [{ category, missions: [{ mission_key, mission_degree, mission_max, answer_score, answer_color }] }] }], oldest first
  tests: { type: Array, required: true },
});

const byKey = (a, b) => String(a.mission.mission_key ?? "").localeCompare(String(b.mission.mission_key ?? ""), undefined, { numeric: true });

// The paper's column order by the domain's letter (B1, B2 count as B); other letters follow in the order they came.
const LETTER_ORDER = ["S", "B", "U", "V", "W", "X", "Y", "Z"];
const letterOf = (category) =>
  String(category.symbol ?? String(category.category ?? "").split(" - ")[0]).trim().replace(/[\s.\-]*\d+$/u, "").toUpperCase();
const rank = (category) => {
  const i = LETTER_ORDER.indexOf(letterOf(category));
  return i < 0 ? LETTER_ORDER.length : i;
};

// Missions keep their index in the result (to find the same mission in the other tests); the column lists them top-down.
const columns = computed(() =>
  (props.tests[0]?.result ?? [])
    .map((category, c) => ({
      c,
      rank: rank(category),
      title: category.category,
      rows: (category.missions ?? []).map((mission, m) => ({ mission, m })).sort(byKey).reverse(),
    }))
    .filter((column) => column.rows.length)
    .sort((a, b) => a.rank - b.rank || a.c - b.c)
);

const boxes = (mission) => Math.max(1, Number(mission.mission_max) || String(mission.mission_degree ?? "").length - 1);

const boxColor = (categoryIndex, missionIndex, box) => {
  for (const test of props.tests) {
    const mission = test.result?.[categoryIndex]?.missions?.[missionIndex];
    if (mission?.answer_color && Number(mission.answer_score) >= box) return `#${mission.answer_color}`;
  }
  return "#fff";
};
</script>

<template>
  <div class="af">
    <section v-for="column in columns" :key="column.c" class="af-col">
      <div class="af-rows">
        <div v-for="row in column.rows" :key="row.m" class="af-row">
          <span class="af-key">{{ row.mission.mission_key }}</span>
          <span class="af-boxes" :title="row.mission.mission_name">
            <i v-for="box in boxes(row.mission)" :key="box" :style="{ background: boxColor(column.c, row.m, box) }" />
          </span>
        </div>
      </div>
      <h5 class="af-title">{{ column.title }}</h5>
    </section>
  </div>
</template>

<style scoped>
.af {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 8mm 6mm;
  padding: 4mm 2mm;
  direction: ltr;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.af-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  break-inside: avoid;
  page-break-inside: avoid;
}
.af-rows {
  display: flex;
  flex-direction: column;
}
.af-row {
  display: flex;
  align-items: center;
  gap: 4px;
}
.af-key {
  min-width: 30px;
  color: #1f2937;
  font-size: 7.5pt;
  text-align: right;
}
.af-boxes {
  display: flex;
  width: 52px;
  height: 17px;
  border: 1px solid #111827;
  border-top-width: 0;
}
.af-row:first-child .af-boxes {
  border-top-width: 1px;
}
.af-boxes i {
  flex: 1;
  border-inline-start: 1px solid #111827;
}
.af-boxes i:first-child {
  border-inline-start: 0;
}
.af-title {
  max-width: 110px;
  margin: 6px 0 0 34px;
  color: #111827;
  font-size: 8pt;
  font-weight: 600;
  text-align: center;
  direction: rtl;
}
</style>
