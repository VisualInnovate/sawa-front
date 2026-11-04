<script setup>
// ELM's «مجموع النتائج» as on the paper form: a grid with the parts RA, NVI, EL, VI with the caregiver, then the same
// parts with the therapist (a thick line between them), rows 0-100 by tens, and an X where each part's percentage of
// (+) falls (rounded to the nearest ten), with a bar from the bottom of the grid up to it in the part's color (the same part has the
// same color with the caregiver and the therapist). Each chosen test draws its bar and X (X in the test's color) side by side, oldest first.
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { colorOf, percentOf } from "@/views/evaluation/elm/elm";
import { dmy } from "./reportUtils";

const props = defineProps({
  // [{ key, date, result: { color, scores: [{ code, caregiver: { percent }, therapist: { percent } }] } }], oldest first
  tests: { type: Array, required: true },
});
const { t } = useI18n();

const ROWS = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0];
const AXIS = 70; // the rotated title and the 0-100 labels
const COL = 62;
const ROW = 26;
const HEAD = 58; // the two header rows
const PEOPLE_ORDER = ["caregiver", "therapist"];
// Each part's bar color.
const PART_COLORS = { RA: "#F97316", NVI: "#22C55E", EL: "#EC4899", VI: "#0EA5E9" };
const EXTRA_COLORS = ["#8B5CF6", "#EAB308", "#14B8A6", "#64748B"];
const partColor = (code, i) => PART_COLORS[String(code).toUpperCase()] ?? EXTRA_COLORS[i % EXTRA_COLORS.length];
const BOTTOM = HEAD + ROWS.length * ROW;

// The parts' codes in the form's order (from the newest test, which has every part).
const codes = computed(() => {
  const scores = props.tests[props.tests.length - 1]?.result?.scores ?? [];
  return scores.length ? scores.map((row) => row.code) : ["RA", "NVI", "EL", "VI"];
});
const columns = computed(() => PEOPLE_ORDER.flatMap((person) => codes.value.map((code) => ({ person, code }))));
const width = computed(() => AXIS + columns.value.length * COL + 2);
const height = HEAD + ROWS.length * ROW + 2;
const x = (i) => AXIS + i * COL;
const yOf = (percent) => HEAD + ROWS.indexOf(Math.round(percent / 10) * 10) * ROW + ROW / 2;

// Every X: its column, row and the test's color, spread across the column when several tests are drawn.
const marks = computed(() => {
  const count = props.tests.length;
  return props.tests.flatMap((test, t) => columns.value.map((column, i) => {
    const percent = percentOf(test.result?.scores, column.code, column.person);
    if (percent === null) return null;
    const offset = count > 1 ? ((t + 0.5) / count - 0.5) * (COL - 18) : 0;
    const barWidth = Math.min(30, (COL - 12) / count - 3);
    const y = yOf(percent);
    // The bar reaches the X (its middle); a 0% still shows a short bar.
    const top = Math.min(y, BOTTOM - 4);
    return { key: `${test.key ?? t}-${i}`, x: x(i) + COL / 2 + offset, y, color: colorOf(test.result?.color, t), percent,
      bar: { x: x(i) + COL / 2 + offset - barWidth / 2, y: top, width: barWidth, height: BOTTOM - top, color: partColor(column.code, i % codes.value.length) } };
  })).filter(Boolean);
});

const personLabel = (person) => t(`elm.with_${person}`);
</script>

<template>
  <div class="ec">
    <svg :viewBox="`0 0 ${width} ${height}`" :width="width" class="ec-svg" role="img" :aria-label="$t('elm.chart_title')">
      <!-- header: who, then the parts -->
      <rect :x="AXIS" y="1" :width="columns.length * COL" :height="HEAD - 1" fill="#fff" stroke="#111827" />
      <line :x1="AXIS" :x2="AXIS + columns.length * COL" :y1="HEAD / 2" :y2="HEAD / 2" stroke="#111827" />
      <text v-for="(person, p) in PEOPLE_ORDER" :key="person" :x="x(p * codes.length) + (codes.length * COL) / 2" :y="HEAD / 4 + 5"
        text-anchor="middle" class="ec-head">{{ personLabel(person) }}</text>
      <text v-for="(column, i) in columns" :key="`h${i}`" :x="x(i) + COL / 2" :y="(HEAD * 3) / 4 + 5" text-anchor="middle" class="ec-code">{{ column.code }}</text>

      <!-- the axis: its title and 100 ... 0 -->
      <rect x="1" :y="HEAD" :width="AXIS - 1" :height="ROWS.length * ROW" fill="#fff" stroke="#111827" />
      <line :x1="AXIS / 2" :x2="AXIS / 2" :y1="HEAD" :y2="HEAD + ROWS.length * ROW" stroke="#111827" />
      <text :x="AXIS / 4" :y="HEAD + (ROWS.length * ROW) / 2" text-anchor="middle" class="ec-axis-title"
        :transform="`rotate(-90 ${AXIS / 4} ${HEAD + (ROWS.length * ROW) / 2})`">{{ $t("elm.chart_axis") }}</text>
      <text v-for="(value, r) in ROWS" :key="`r${value}`" :x="(AXIS * 3) / 4" :y="HEAD + r * ROW + ROW / 2 + 4" text-anchor="middle" class="ec-num">{{ value }}</text>

      <!-- the grid -->
      <rect :x="AXIS" :y="HEAD" :width="columns.length * COL" :height="ROWS.length * ROW" fill="#fff" stroke="#111827" />
      <line v-for="r in ROWS.length - 1" :key="`gr${r}`" :x1="AXIS" :x2="AXIS + columns.length * COL" :y1="HEAD + r * ROW" :y2="HEAD + r * ROW" stroke="#111827" stroke-width=".6" />
      <line v-for="i in columns.length - 1" :key="`gc${i}`" :x1="x(i)" :x2="x(i)" :y1="i === codes.length ? 1 : HEAD / 2" :y2="HEAD + ROWS.length * ROW"
        stroke="#111827" :stroke-width="i === codes.length ? 2.4 : .6" />

      <!-- each test's bar (the part's color) up to its X (the test's color) -->
      <g v-for="mark in marks" :key="mark.key">
        <title>{{ mark.percent }}%</title>
        <rect :x="mark.bar.x" :y="mark.bar.y" :width="mark.bar.width" :height="mark.bar.height" :fill="mark.bar.color" rx="2" />
        <text :x="mark.x" :y="mark.y + 6" text-anchor="middle" class="ec-x" :fill="mark.color">X</text>
      </g>
    </svg>
    <ul v-if="tests.length" class="ec-legend">
      <li v-for="(test, i) in tests" :key="test.key ?? i">
        <b :style="{ color: colorOf(test.result?.color, i) }">X</b>
        <span class="ltr">{{ dmy(test.date) }}</span>
      </li>
      <li v-for="(code, i) in codes" :key="`p-${code}`">
        <i class="ec-swatch" :style="{ background: partColor(code, i) }" />
        <span>{{ code }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.ec { display: grid; justify-items: center; gap: .5rem; direction: ltr; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.ec-svg { max-width: 100%; height: auto; font-family: inherit; }
.ec-head { font-size: 12px; font-weight: 700; fill: #111827; direction: rtl; }
.ec-code { font-size: 12px; font-weight: 700; fill: #111827; }
.ec-axis-title { font-size: 11px; font-weight: 700; fill: #111827; direction: rtl; }
.ec-num { font-size: 11px; fill: #111827; }
.ec-x { font-size: 17px; font-weight: 800; }
.ec-legend { display: flex; flex-wrap: wrap; justify-content: center; gap: .35rem 1rem; margin: 0; padding: 0; list-style: none; font-size: .85rem; direction: rtl; }
.ec-swatch { display: inline-block; width: .8rem; height: .8rem; border-radius: 2px; }
.ec-legend li { display: inline-flex; align-items: center; gap: .35rem; }
</style>
