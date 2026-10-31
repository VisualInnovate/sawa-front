<script setup>
// QFBA as the form's «Graph» sheet: per function a wide grey column for the number of endorsed questions (left axis) with a
// narrow black column for the severity (right axis) drawn over it, functions in the form's order, titled
// «QFBA - child - target behaviour», with the two axis titles and a legend. One chart per test (oldest first, each dated
// when there are several). The plot keeps the form's layout (left to right) in both languages; the texts follow the form's.
import { computed } from "vue";
import { dmy } from "./reportUtils";
import { functionName, qt } from "@/views/evaluation/qfba/qfba";

const props = defineProps({
  // [{ key, date, result: { target_behavior, scores: [{ key, name, name_en, questions, endorsed, severity, max_severity }] } }], oldest first
  tests: { type: Array, required: true },
  lang: { type: String, default: "ar" },
  // The child's name for the title (as the form's «QABF - name - behaviour»).
  childName: { type: String, default: "" },
});

const W = 640;
const H = 300;
const PLOT = { left: 62, right: 62, top: 14, bottom: 62 };
const plotWidth = W - PLOT.left - PLOT.right;
const plotHeight = H - PLOT.top - PLOT.bottom;
const base = PLOT.top + plotHeight;
const ENDORSED_COLOR = "#c0c0c0";
const SEVERITY_COLOR = "#000000";

// A function's name on as many lines as its column's width needs (about 7px a letter).
function wrap(text, width) {
  const most = Math.max(6, Math.floor(width / 7));
  const lines = [];
  for (const word of String(text).split(/\s+/).filter(Boolean)) {
    const last = lines[lines.length - 1];
    if (last && (last + " " + word).length <= most) lines[lines.length - 1] = last + " " + word;
    else lines.push(word);
  }
  return lines.slice(0, 3);
}

// Scales: endorsed 0 … the most questions a function has; severity 0 … the highest severity possible. The grid lines
// are the endorsed axis's whole numbers, and the severity axis is split into as many steps so both share them.
function chartOf(test) {
  const scores = test.result?.scores ?? [];
  const endorsedTop = Math.max(1, ...scores.map((score) => score.questions ?? 0), ...scores.map((score) => score.endorsed ?? 0));
  const steps = endorsedTop <= 10 ? endorsedTop : 5;
  const severityTop = Math.max(steps, ...scores.map((score) => score.max_severity ?? 0), ...scores.map((score) => score.severity ?? 0));
  const slot = plotWidth / Math.max(1, scores.length);
  const y = (value, top) => PLOT.top + plotHeight - (Math.min(value, top) / top) * plotHeight;
  const round = (value) => Math.round(value * 10) / 10;
  return {
    key: test.key ?? test.date,
    date: test.date,
    title: ["QFBA", props.childName, test.result?.target_behavior].filter(Boolean).join(" - "),
    ticks: Array.from({ length: steps + 1 }, (_, i) => ({
      y: y((endorsedTop / steps) * i, endorsedTop),
      endorsed: round((endorsedTop / steps) * i),
      severity: round((severityTop / steps) * i),
    })),
    bars: scores.map((score, i) => {
      const center = PLOT.left + slot * i + slot / 2;
      const wide = slot * 0.56;
      const narrow = slot * 0.2;
      const endorsedY = y(score.endorsed ?? 0, endorsedTop);
      const severityY = y(score.severity ?? 0, severityTop);
      const label = functionName(score, props.lang);
      return {
        key: score.key, center, label, lines: wrap(label, slot - 6), endorsed: score.endorsed ?? 0, severity: score.severity ?? 0,
        endorsedRect: { x: center - wide / 2, y: endorsedY, width: wide, height: base - endorsedY },
        severityRect: { x: center - narrow / 2, y: severityY, width: narrow, height: base - severityY },
      };
    }),
  };
}

const charts = computed(() => props.tests.map(chartOf));
const several = computed(() => props.tests.length > 1);
</script>

<template>
  <div class="qc" :class="{ 'is-several': several }" :dir="lang === 'en' ? 'ltr' : 'rtl'">
    <figure v-for="chart in charts" :key="chart.key" class="qc-chart">
      <figcaption class="qc-title">
        <b>{{ chart.title }}</b>
        <small v-if="several" class="ltr">{{ dmy(chart.date) }}</small>
      </figcaption>
      <svg :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="chart.title" xmlns="http://www.w3.org/2000/svg">
        <!-- grid and the two axes' numbers -->
        <g v-for="tick in chart.ticks" :key="tick.endorsed">
          <line :x1="PLOT.left" :x2="W - PLOT.right" :y1="tick.y" :y2="tick.y" class="qc-grid" />
          <text :x="PLOT.left - 7" :y="tick.y + 4" class="qc-num" text-anchor="end">{{ tick.endorsed }}</text>
          <text :x="W - PLOT.right + 7" :y="tick.y + 4" class="qc-num" text-anchor="start">{{ tick.severity }}</text>
        </g>
        <line :x1="PLOT.left" :x2="PLOT.left" :y1="PLOT.top" :y2="base" class="qc-axis" />
        <line :x1="W - PLOT.right" :x2="W - PLOT.right" :y1="PLOT.top" :y2="base" class="qc-axis" />
        <line :x1="PLOT.left" :x2="W - PLOT.right" :y1="base" :y2="base" class="qc-axis" />
        <text :transform="`translate(16 ${PLOT.top + plotHeight / 2}) rotate(-90)`" class="qc-axis-title" text-anchor="middle">{{ qt(lang, "endorsed") }}</text>
        <text :transform="`translate(${W - 14} ${PLOT.top + plotHeight / 2}) rotate(90)`" class="qc-axis-title" text-anchor="middle">{{ qt(lang, "severity") }}</text>

        <!-- per function: the endorsed column, the severity column over it, the name under them -->
        <g v-for="bar in chart.bars" :key="bar.key">
          <title>{{ bar.label }}: {{ qt(lang, "endorsed") }} {{ bar.endorsed }} · {{ qt(lang, "severity") }} {{ bar.severity }}</title>
          <rect v-bind="bar.endorsedRect" :fill="ENDORSED_COLOR" stroke="#000" stroke-width="0.6" />
          <rect v-bind="bar.severityRect" :fill="SEVERITY_COLOR" />
          <text v-for="(line, l) in bar.lines" :key="l" :x="bar.center" :y="base + 17 + l * 14" class="qc-cat" text-anchor="middle">{{ line }}</text>
        </g>
      </svg>
      <div class="qc-legend">
        <span><i :style="{ background: ENDORSED_COLOR }" /> {{ qt(lang, "endorsed") }}</span>
        <span><i :style="{ background: SEVERITY_COLOR }" /> {{ qt(lang, "severity") }}</span>
      </div>
    </figure>
  </div>
</template>

<style scoped>
.qc { display: grid; gap: 3mm; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.qc.is-several { grid-template-columns: repeat(auto-fit, minmax(80mm, 1fr)); }
.qc-chart { display: grid; gap: 1mm; margin: 0; break-inside: avoid; page-break-inside: avoid; }
.qc-title { display: grid; justify-items: center; color: #0f172a; text-align: center; }
.qc-title b { font-size: 11.5pt; font-weight: 800; }
.qc-title small { color: #475569; font-size: 9pt; }
/* The plot is drawn left to right as on the form; an Arabic word inside a label still reads right to left. */
.qc-chart svg { display: block; width: 100%; height: auto; max-height: 78mm; direction: ltr; font-family: inherit; }
.qc.is-several .qc-chart svg { max-height: 58mm; }
.qc-grid { stroke: #e2e8f0; stroke-width: 1; }
.qc-axis { stroke: #64748b; stroke-width: 1; }
.qc-num { fill: #334155; font-size: 11px; }
.qc-axis-title { fill: #0f172a; font-size: 12px; font-weight: 700; }
.qc-cat { fill: #0f172a; font-size: 11.5px; font-weight: 700; }
.qc-legend { display: flex; flex-wrap: wrap; justify-content: center; gap: 6mm; color: #0f172a; font-size: 9pt; }
.qc-legend i { display: inline-block; width: 3.2mm; height: 3.2mm; margin-inline-end: 1.5mm; border: 0.6px solid #000; vertical-align: middle; }
.qc .ltr { direction: ltr; unicode-bidi: isolate; }
</style>
