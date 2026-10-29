<script setup>
// One QFBA's results as the form's «Results» table: each function's endorsed questions and severity (the likely
// function(s) highlighted, a function at the «likely» threshold marked), then what the likely function means.
// Texts follow the form's language.
import { computed } from "vue";
import { functionColor, functionDescription, functionName, qt } from "@/views/evaluation/qfba/qfba";

const props = defineProps({
  // The server's resultData: { scores, primary, clear_function_from, target_behavior }
  result: { type: Object, required: true },
  lang: { type: String, default: "ar" },
  meaning: { type: Boolean, default: true },
});

const scores = computed(() => props.result?.scores ?? []);
const primary = computed(() => props.result?.primary ?? []);
const likely = computed(() => scores.value.filter((score) => primary.value.includes(score.key)));
</script>

<template>
  <div class="qs" :dir="lang === 'en' ? 'ltr' : 'rtl'">
    <table class="rx-table qs-table">
      <thead>
        <tr>
          <th>{{ qt(lang, "function") }}</th>
          <th>{{ qt(lang, "endorsed") }}</th>
          <th>{{ qt(lang, "severity") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="score in scores" :key="score.key" :class="{ 'is-primary': primary.includes(score.key) }">
          <td class="qs-name">
            <i class="qs-dot" :style="{ background: functionColor(score.key) }" />
            {{ functionName(score, lang) }}
            <span v-if="score.clear" class="qs-clear">{{ qt(lang, "clear") }}</span>
          </td>
          <td><b class="ltr">{{ score.endorsed }} / {{ score.questions }}</b></td>
          <td><b class="ltr">{{ score.severity }} / {{ score.max_severity }}</b></td>
        </tr>
      </tbody>
    </table>
    <p class="qs-hint">{{ qt(lang, "clear_hint", { n: result.clear_function_from ?? 4 }) }}</p>

    <div v-if="meaning" class="qs-likely">
      <h3>{{ qt(lang, "likely") }}</h3>
      <p v-if="!likely.length">{{ qt(lang, "no_function") }}</p>
      <div v-for="score in likely" :key="score.key" class="qs-fn" :style="{ '--tone': functionColor(score.key) }">
        <b>{{ functionName(score, lang) }}</b>
        <span> ({{ qt(lang, "endorsed") }} <span class="ltr">{{ score.endorsed }}/{{ score.questions }}</span> · {{ qt(lang, "severity") }} <span class="ltr">{{ score.severity }}/{{ score.max_severity }}</span>)</span>
        <p v-if="functionDescription(score, lang)">{{ functionDescription(score, lang) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qs { display: grid; gap: 3mm; }
/* Its own table look: the report's styles are scoped to the report page and do not reach inside this component. */
.qs-table { width: 100%; border-collapse: collapse; }
.qs-table th, .qs-table td { padding: 6px 10px; border: 1px solid #b7cdd0; text-align: center; vertical-align: middle; }
.qs-table thead th { background: rgb(var(--bp-135c65, 19 92 101)); color: #fff; font-weight: 700; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.qs-table td.qs-name { text-align: start; font-weight: 700; }
.qs-dot { display: inline-block; width: 3mm; height: 3mm; margin-inline-end: 1.5mm; border-radius: 50%; vertical-align: middle; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.qs-clear { margin-inline-start: 2mm; padding: 0 2mm; border-radius: 999px; background: #fef3c7; color: #92400e; font-size: 8pt; font-weight: 800; }
.qs-table tr.is-primary td { background: #fefce8; }
.qs-hint { margin: 0; color: #64748b; font-size: 8.5pt; }
.qs-likely h3 { margin: 0 0 2mm; color: rgb(var(--bp-0e464d, 14 70 77)); font-size: 12pt; font-weight: 800; }
.qs-likely > p { margin: 0; }
.qs-fn { margin-bottom: 2mm; padding: 2.5mm 4mm; border-inline-start: 5px solid var(--tone); border-radius: 8px; background: #f8fafc; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.qs-fn b { color: var(--tone); font-size: 11.5pt; }
.qs-fn span { color: #475569; font-size: 9pt; }
.qs-fn p { margin: 1mm 0 0; line-height: 1.8; }
.qs .ltr { direction: ltr; unicode-bidi: isolate; }
</style>
