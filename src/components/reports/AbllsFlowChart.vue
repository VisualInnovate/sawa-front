<script setup>
// ABLLS Academy / Ablls OT / Ablls SP as on the paper "Skills Tracking System" flow chart: a column per domain type (OT/SP: its
// type; ABLLS Academy: its four fixed types, التمهيد الأكاديمي / الرياضيات / القراءة / التهجئة), the name under it,
// its skills (B1, B2...) stacked from the first (bottom) up, each skill one row of boxes (one per score) colored by the answer.
// With several tests, each box takes the color of the first (oldest) test that reached it.
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { abllsIsStrength, abllsRank, abllsSymbolOf, abllsTop } from "./reportUtils";
import { ABLLS_TYPES, typeOrder } from "@/components/ablls/abllsTypes";

const { t } = useI18n();

const props = defineProps({
  // [{ result: [{ category, symbol, type_id, type_title, missions: [{ mission_key, mission_degree, mission_max, answer_score, answer_color }] }] }], oldest first
  tests: { type: Array, required: true },
});

const natural = (a, b) => String(a ?? "").localeCompare(String(b ?? ""), undefined, { numeric: true });

// The paper's column order by the domain's letter (shared with the report's strengths/weaknesses).
const symbolOf = abllsSymbolOf;
const rank = abllsRank;

// Rows keep the category / mission index in the result (to find the same mission in the other tests); a column lists them top-down.
const columns = computed(() => {
  const groups = new Map();
  (props.tests[0]?.result ?? []).forEach((category, c) => {
    const missions = (category.missions ?? []).map((mission, m) => ({ mission, m })).sort((a, b) => natural(a.mission.mission_key, b.mission.mission_key));
    if (!missions.length) return;
    const own = category.type_id == null && !category.type_title;
    // ABLLS Academy: one column per fixed type (all its domains' skills in it); an older domain with no known type keeps its own.
    const fixed = own && ABLLS_TYPES.some((type) => type.value === (category.type || "academic"));
    const key = fixed ? `t-${category.type || "academic"}` : own ? `c${c}` : category.type_id ?? category.type_title;
    // OT / SP: the type's flow-chart name (set in the types dialog), else its title.
    const title = fixed
      ? t(`ablls_ui.types.${category.type || "academic"}`)
      : own ? String(category.category ?? "").split(" - ").slice(1).join(" - ") || symbolOf(category) : category.type_chart_title || category.type_title;
    const order = fixed ? typeOrder(category.type || "academic") : rank(category);
    if (!groups.has(key)) groups.set(key, { key, first: c, rank: order, title, skills: [] });
    // Ablls OT (a skill of a type): only a strength is colored; a weakness stays white.
    groups.get(key).skills.push({ c, symbol: symbolOf(category), name: category.category, missions, strengthsOnly: !own });
  });
  return [...groups.values()]
    .sort((a, b) => a.rank - b.rank || a.first - b.first)
    .map((column) => ({
      ...column,
      rows: column.skills
        .sort((a, b) => natural(a.symbol, b.symbol))
        // A skill with one goal shows as B1; with several, each goal is its own row (B1.1, B1.2).
        .flatMap((skill) =>
          skill.missions.map(({ mission, m }) => ({
            c: skill.c,
            m,
            mission,
            label: skill.missions.length > 1 ? mission.mission_key : skill.symbol,
            strengthsOnly: skill.strengthsOnly,
            name: skill.name,
          }))
        )
        .reverse(),
    }));
});

const boxes = abllsTop;

const boxColor = (categoryIndex, missionIndex, box, strengthsOnly = false) => {
  for (const test of props.tests) {
    const mission = test.result?.[categoryIndex]?.missions?.[missionIndex];
    if (strengthsOnly && !abllsIsStrength(mission)) continue;
    if (mission?.answer_color && Number(mission.answer_score) >= box) return `#${mission.answer_color}`;
  }
  return "#fff";
};
</script>

<template>
  <div class="af">
    <section v-for="column in columns" :key="column.key" class="af-col">
      <div class="af-rows">
        <div v-for="row in column.rows" :key="`${row.c}-${row.m}`" class="af-row" :title="row.name">
          <span class="af-key">{{ row.label }}</span>
          <span class="af-boxes">
            <i v-for="box in boxes(row.mission)" :key="box" :style="{ background: boxColor(row.c, row.m, box, row.strengthsOnly) }" />
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
  justify-content: center;
  gap: 8mm 3mm;
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
  min-width: 22px;
  color: #1f2937;
  font-size: 6.5pt;
  text-align: right;
}
.af-boxes {
  display: flex;
  width: 44px;
  height: 13px;
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
  /* As wide as its column (the names wrap) so the 8 columns fit on one line like the paper. */
  width: 0;
  min-width: 100%;
  /* The same height under every column (up to 3 lines), so all the columns' boxes end on one line, as the paper. */
  height: 3.9em;
  line-height: 1.3;
  overflow: visible;
  margin: 6px 0 0;
  padding-left: 26px;
  color: #111827;
  font-size: 8pt;
  font-weight: 600;
  text-align: center;
  direction: rtl;
}
</style>
