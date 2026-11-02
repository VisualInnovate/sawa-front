<script setup>
// The Sensory Profile's score grid, drawn as the academy's scoring sheets draw it: one row per quadrant / section /
// factor with its raw score, then one column per classification (less than others … typical … more than others) holding
// the score range for the child's age. The band the score falls in is coloured and a dot marks the score inside it.
// A row with an X among its items, or without cut scores for this age, shows why it is not classified. The low threshold
// row is greyed when it does not count (quadrants 3 and 4 are not both outside typical).
import { computed } from "vue";
import { LEVEL_TONE, bandText, levelLabel, scaleName, sectionLetter } from "@/views/evaluation/sensory/sensory";

const props = defineProps({
  scores: { type: Array, default: () => [] },
  levelKeys: { type: Array, default: () => [] },
  levelLabels: { type: Object, default: () => ({}) },
  lang: { type: String, default: "ar" },
  // The first column's heading («الربع», «القسم», «العامل»).
  title: { type: String, default: "" },
  numbered: { type: Boolean, default: false },
});

const rows = computed(() => props.scores.filter((score) => score.status !== "not_scored" || score.kind !== "section"));

/** Where the dot sits inside its band, from the band's high end (the start side). */
const dotStart = (score, band) => {
  const [min, max] = [Math.min(band[0], band[1]), Math.max(band[0], band[1])];
  if (max === min) return 50;
  return Math.min(92, Math.max(8, ((max - score.raw) / (max - min)) * 84 + 8));
};

const reason = (score) => ({ incomplete: "sensory.incomplete", no_norms: "sensory.no_norms", out_of_range: "sensory.out_of_range", not_scored: "sensory.not_scored" })[score.status];
</script>

<template>
  <table class="sg-table" :dir="lang === 'en' ? 'ltr' : 'rtl'">
    <colgroup>
      <col class="sg-name-col" />
      <col class="sg-raw-col" />
      <col v-for="key in levelKeys" :key="key" />
    </colgroup>
    <thead>
      <tr>
        <th>{{ title }}</th>
        <th>{{ $t("sensory.raw_score") }}</th>
        <th v-for="key in levelKeys" :key="key" :class="'is-' + LEVEL_TONE[key] + '-head'">{{ levelLabel(levelLabels, key, lang) }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="score in rows" :key="score.code" :class="{ 'is-muted': score.kind === 'threshold' && !score.relevant }">
        <th scope="row" class="sg-name">
          <span v-if="numbered && score.number" class="sg-num">{{ score.number }}.</span>
          <span v-else-if="score.kind === 'section'" class="sg-num">{{ sectionLetter(score.code, lang) }}.</span>
          {{ scaleName(score, lang) }}
          <small v-if="score.kind === 'threshold'">{{ $t("sensory.threshold_note") }}</small>
        </th>
        <td class="sg-raw">
          <span class="ltr"><b>{{ score.raw }}</b><span class="sg-max"> / {{ score.max }}</span></span>
          <small v-if="score.missing" class="sg-x">X × {{ score.missing }}</small>
        </td>
        <template v-if="score.bands && score.status !== 'incomplete'">
          <td v-for="key in levelKeys" :key="key" class="sg-band"
            :class="score.level === key ? 'is-' + LEVEL_TONE[key] + ' is-hit' : ''">
            <span class="ltr">{{ bandText(score.bands[key]) }}</span>
            <i v-if="score.level === key" class="sg-dot" :style="{ insetInlineStart: dotStart(score, score.bands[key]) + '%' }" aria-hidden="true" />
          </td>
        </template>
        <td v-else :colspan="levelKeys.length" class="sg-reason">{{ $t(reason(score) || "sensory.no_norms") }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.sg-table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 11pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.sg-name-col { width: 24%; }
.sg-raw-col { width: 11%; }
.sg-table th, .sg-table td { padding: 2.2mm 1.5mm; border: 1px solid #94a3b8; text-align: center; vertical-align: middle; }
.sg-table thead th { background: #f1f5f9; font-size: 9.5pt; font-weight: 700; line-height: 1.35; }
.sg-table thead th.is-typical-head { background: #dcfce7; color: #14532d; }
.sg-name { text-align: start !important; font-weight: 700; line-height: 1.45; }
.sg-name small { display: block; margin-top: .5mm; color: #64748b; font-size: 8pt; font-weight: 400; }
.sg-num { margin-inline-end: .25rem; }
.sg-raw b { font-size: 12pt; }
.sg-max { color: #64748b; font-size: 9pt; }
.sg-x { display: block; color: #b91c1c; font-size: 8.5pt; font-weight: 700; }
.sg-band { position: relative; color: #475569; }
.sg-band.is-hit { color: #0f172a; font-weight: 800; }
.sg-band.is-typical { background: #bbf7d0; }
.sg-band.is-probable { background: #fde68a; }
.sg-band.is-definite { background: #fecaca; }
.sg-band.is-consult { background: #fed7aa; }
.sg-dot { position: absolute; bottom: 1mm; width: 2.4mm; height: 2.4mm; border-radius: 50%; background: #0f172a; transform: translateX(50%); }
[dir="ltr"] .sg-dot { transform: translateX(-50%); }
.sg-reason { color: #64748b; font-style: italic; }
tr.is-muted th, tr.is-muted td { color: #94a3b8; background: #f8fafc !important; }
tr.is-muted .sg-dot { background: #94a3b8; }
.ltr { direction: ltr; unicode-bidi: isolate; }
</style>
