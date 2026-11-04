<script setup>
// Ablls SP as on the centre's paper: a column per type (its flow-chart name under it), its skills numbered upwards from
// the bottom, and the rows split into horizontal bands, one per level the staff added (each linked to its domains, the
// first level at the bottom) that line up across the columns; domains in no level form a band above them. Each skill is one
// row of boxes, one per score 0..max with the score written in it; the boxes up to the answer take the answer's color
// (so 0 colors the 0 box; an unanswered skill stays white). With several tests a box takes the color of the first
// (oldest) test that reached it.
import { computed } from "vue";
import { abllsSymbolOf } from "./reportUtils";

const props = defineProps({
  // [{ result: [{ category, symbol, type_id, type_title, type_chart_title, missions: [{ mission_key, mission_degree, mission_max, answer_score, answer_color }] }] }], oldest first
  tests: { type: Array, required: true },
});

const natural = (a, b) => String(a ?? "").localeCompare(String(b ?? ""), undefined, { numeric: true });

// The levels in the result (first = bottom), then a band for the domains in no level.
const NO_LEVEL = "none";
const levels = computed(() => {
  const found = new Map();
  for (const category of props.tests[0]?.result ?? []) {
    if (category.level_id != null && !found.has(category.level_id)) {
      found.set(category.level_id, { key: category.level_id, label: category.level_title ?? "", sort: category.level_sort ?? [0, category.level_id] });
    }
  }
  return [...found.values()].sort((a, b) => a.sort[0] - b.sort[0] || a.sort[1] - b.sort[1]);
});
const bandKeys = computed(() => [...levels.value.map((level) => level.key), NO_LEVEL]);

// Columns in the order the types were added; each row keeps its category / mission index (to find it in the other tests).
const columns = computed(() => {
  const groups = new Map();
  (props.tests[0]?.result ?? []).forEach((category, c) => {
    const missions = (category.missions ?? []).map((mission, m) => ({ mission, m })).sort((a, b) => natural(a.mission.mission_key, b.mission.mission_key));
    if (!missions.length) return;
    const key = category.type_id ?? category.type_title ?? `c${c}`;
    if (!groups.has(key)) groups.set(key, { key, typeId: Number(category.type_id) || 0, first: c, title: category.type_chart_title || category.type_title || "", skills: [] });
    groups.get(key).skills.push({ c, symbol: abllsSymbolOf(category), name: category.category, missions, level: category.level_id ?? NO_LEVEL });
  });
  return [...groups.values()]
    .sort((a, b) => a.typeId - b.typeId || a.first - b.first)
    .map((column) => {
      // Bottom-up inside each band: the first skill at the bottom.
      const rows = column.skills.sort((a, b) => natural(a.symbol, b.symbol)).flatMap((skill) =>
        skill.missions.map(({ mission, m }) => ({ c: skill.c, m, mission, name: skill.name, level: skill.level, label: skill.missions.length > 1 ? mission.mission_key : skill.symbol })));
      const bands = Object.fromEntries(bandKeys.value.map((key) => [key, rows.filter((row) => row.level === key)]));
      return { ...column, levels: bands };
    });
});

// The bands that have a skill in any column (top first: no level, then the last level … the first), each as tall as its fullest column.
const bands = computed(() => bandKeys.value
  .map((key) => ({ l: key, label: levels.value.find((level) => level.key === key)?.label ?? "", height: Math.max(0, ...columns.value.map((column) => column.levels[key].length)) }))
  .filter((band) => band.height > 0)
  .reverse());

const boxes = (mission) => Math.max(1, Number(mission.mission_max) || String(mission.mission_degree ?? "").length - 1) + 1;

const boxColor = (categoryIndex, missionIndex, box) => {
  for (const test of props.tests) {
    const mission = test.result?.[categoryIndex]?.missions?.[missionIndex];
    const score = mission?.answer_score;
    if (mission?.answer_color && score !== null && score !== undefined && score !== "" && Number(score) >= box) return `#${mission.answer_color}`;
  }
  return null;
};
// Top row of a band first (the band is drawn top-down, its skills go bottom-up).
const bandRows = (column, l) => [...column.levels[l]].reverse();
</script>

<template>
  <div class="asp">
    <div class="asp-levels">
      <div v-for="band in bands" :key="band.l" class="asp-level" :style="{ height: `calc(${band.height} * var(--asp-row))` }">
        <span v-if="band.label">{{ band.label }}</span>
      </div>
      <div class="asp-title-space" />
    </div>
    <section v-for="column in columns" :key="column.key" class="asp-col">
      <div v-for="band in bands" :key="band.l" class="asp-band" :style="{ height: `calc(${band.height} * var(--asp-row))` }">
        <div v-for="row in bandRows(column, band.l)" :key="`${row.c}-${row.m}`" class="asp-row" :title="row.name">
          <span class="asp-key">{{ row.label }}</span>
          <span class="asp-boxes">
            <i v-for="n in boxes(row.mission)" :key="n" :style="boxColor(row.c, row.m, n - 1) ? { background: boxColor(row.c, row.m, n - 1) } : null">
              <template v-if="!boxColor(row.c, row.m, n - 1)">{{ n - 1 }}</template>
            </i>
          </span>
        </div>
      </div>
      <h5 class="asp-title">{{ column.title }}</h5>
    </section>
  </div>
</template>

<style scoped>
.asp {
  --asp-row: 13px;
  --asp-gap: 3mm;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0 3mm;
  padding: 4mm 2mm;
  direction: ltr;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.asp-levels,
.asp-col {
  display: flex;
  flex-direction: column;
  gap: var(--asp-gap);
}
.asp-level {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 12mm;
}
.asp-level span {
  padding: 2px 4px;
  border: 1px solid #111827;
  color: #111827;
  font-size: 7.5pt;
  font-weight: 700;
  white-space: nowrap;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}
.asp-title-space {
  height: 0;
}
.asp-col {
  align-items: stretch;
  break-inside: avoid;
  page-break-inside: avoid;
}
.asp-band {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 12mm;
}
.asp-row {
  display: flex;
  align-items: center;
  gap: 3px;
  height: var(--asp-row);
}
.asp-key {
  min-width: 26px;
  color: #1f2937;
  font-size: 6pt;
  text-align: right;
  white-space: nowrap;
  direction: rtl;
}
.asp-boxes {
  display: flex;
  width: 56px;
  height: 100%;
  border: 1px solid #111827;
  border-top-width: 0;
}
.asp-row:first-child .asp-boxes {
  border-top-width: 1px;
}
.asp-boxes i {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  border-inline-start: 1px solid #111827;
  color: #111827;
  font-size: 6pt;
  font-style: normal;
  font-weight: 700;
}
.asp-boxes i:first-child {
  border-inline-start: 0;
}
.asp-title {
  width: 0;
  min-width: 100%;
  margin: 3px 0 0;
  padding-left: 29px;
  color: #111827;
  font-size: 8pt;
  font-weight: 600;
  text-align: center;
  direction: rtl;
}
</style>
