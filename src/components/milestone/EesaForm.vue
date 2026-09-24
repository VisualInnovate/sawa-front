<script setup>
// The Early Echoic Skills Assessment as printed (VB-MAPP EESA), with a box to type 1, 0.5 or nothing next to
// each item. The sub-totals and the total fill the column of this assessment; earlier ones show theirs.
import { computed } from "vue";
import { EESA_GROUPS, EESA_SCORING_1_3, eesaRuns, eesaTotals, eesaValue } from "@/utils/eesa";

const props = defineProps({
  // { key: text typed in the box }
  modelValue: { type: Object, required: true },
  // The child's earlier assessments, oldest first: [{ assessment_number, group_totals, total }]
  previous: { type: Array, default: () => [] },
  disabled: Boolean,
});
const emit = defineEmits(["update:modelValue"]);

const totals = computed(() => eesaTotals(props.modelValue));
const set = (key, value) => emit("update:modelValue", { ...props.modelValue, [key]: value });
const invalid = (key, group) => eesaValue(props.modelValue[key], group.halfPoint) === undefined;

const ordinal = (n) => `${n}${[, "st", "nd", "rd"][n % 100 > 10 && n % 100 < 14 ? 0 : n % 10] || "th"}`;
const format = (value) => (value === null || value === undefined ? "" : Number(value).toLocaleString("en", { maximumFractionDigits: 1 }));

// Four assessment columns: the earlier ones and this one; up to four they are 1st-4th like the form, after that
// the last four assessments.
const columns = computed(() => {
  const current = (props.previous.at(-1)?.assessment_number ?? 0) + 1;
  const filled = [
    ...props.previous.map((row) => ({ number: row.assessment_number, groups: row.group_totals ?? {}, total: row.total })),
    { number: current, groups: totals.value.groups, total: totals.value.total, current: true },
  ].slice(-4);
  const start = current <= 4 ? 1 : current - 3;
  return [0, 1, 2, 3].map((offset) => filled.find((column) => column.number === start + offset) ?? { number: start + offset });
});
</script>

<template>
  <div class="eesa-scroll">
    <article class="eesa" dir="ltr" lang="en">
      <header class="eesa-banner">
        <h3>Early Echoic Skills Assessment (EESA)</h3>
        <p>Barbara E. Esch, Ph.D., BCBA-D, CCC-SLP</p>
      </header>

      <div class="eesa-top">
        <div class="eesa-scoring">
          <p><span class="eesa-heading">Scoring Groups 1-3:</span> For each item, score the best response of up to 3 trials</p>
          <p v-for="[mark, text] in EESA_SCORING_1_3" :key="mark" class="eesa-rule"><span class="eesa-mark">{{ mark }}</span>{{ text }}</p>
        </div>
        <div class="eesa-summary">
          <p class="eesa-total-label">TOTAL<br />RAW SCORE:<br /><i>(Groups 1-5)</i></p>
          <table class="eesa-assessment">
            <thead>
              <tr><th colspan="4">Assessment</th></tr>
              <tr><th v-for="column in columns" :key="column.number">{{ ordinal(column.number) }}</th></tr>
            </thead>
            <tbody>
              <tr><td v-for="column in columns" :key="column.number" :class="{ current: column.current }">{{ format(column.total) }}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <section v-for="group in EESA_GROUPS" :key="group.number" class="eesa-group">
        <div class="eesa-group-body">
          <h4 class="eesa-heading">
            {{ group.title }}
            <span v-if="group.model" class="eesa-model">
              <template v-for="(run, index) in eesaRuns(group.model)" :key="index"><b v-if="run.bold && run.italic"><i>{{ run.text }}</i></b><template v-else>{{ run.text }}</template></template>
            </span>
          </h4>
          <p v-if="group.targets" class="eesa-targets">{{ group.targets }}</p>
          <p v-for="[mark, text] in group.scoring ?? []" :key="mark" class="eesa-rule"><span class="eesa-mark">{{ mark }}</span>{{ text }}</p>

          <div v-if="group.columns" class="eesa-items" :class="{ prosody: group.number === 4 }">
            <div v-for="(column, c) in group.columns" :key="c" class="eesa-column">
              <label v-for="item in column" :key="item.key" class="eesa-item">
                <input :value="modelValue[item.key] ?? ''" :disabled="disabled" :class="{ invalid: invalid(item.key, group) }"
                  inputmode="decimal" maxlength="3" :aria-label="item.text.replaceAll('*', '')"
                  @input="set(item.key, $event.target.value)" />
                <span>
                  <template v-for="(run, index) in eesaRuns(item.text)" :key="index"><b v-if="run.bold && run.italic"><i>{{ run.text }}</i></b><b v-else-if="run.bold">{{ run.text }}</b><i v-else-if="run.italic">{{ run.text }}</i><template v-else>{{ run.text }}</template></template>
                </span>
              </label>
            </div>
          </div>

          <div v-else class="eesa-lines">
            <template v-for="section in group.sections" :key="section.heading">
              <p class="eesa-line-heading">{{ section.heading }}</p>
              <div class="eesa-line">
                <label v-for="item in section.items" :key="item.key" class="eesa-item">
                  <input :value="modelValue[item.key] ?? ''" :disabled="disabled" :class="{ invalid: invalid(item.key, group) }"
                    inputmode="decimal" maxlength="3" :aria-label="item.text.replaceAll('*', '')"
                    @input="set(item.key, $event.target.value)" />
                  <span>
                    <template v-for="(run, index) in eesaRuns(item.text)" :key="index"><b v-if="run.bold && run.italic"><i>{{ run.text }}</i></b><b v-else-if="run.bold">{{ run.text }}</b><i v-else-if="run.italic">{{ run.text }}</i><template v-else>{{ run.text }}</template></template>
                  </span>
                </label>
              </div>
            </template>
          </div>
        </div>

        <div class="eesa-subtotal">
          <p class="eesa-subtotal-label">Sub-total<br />Group {{ group.number }}</p>
          <table class="eesa-assessment">
            <thead>
              <tr><th colspan="4">Assessment</th></tr>
              <tr><th v-for="column in columns" :key="column.number">{{ ordinal(column.number) }}</th></tr>
            </thead>
            <tbody>
              <tr>
                <td v-for="column in columns" :key="column.number" :class="{ current: column.current }">
                  {{ format(column.groups?.[group.number]) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <footer class="eesa-footer">
        <span>The VB-MAPP Early Echoic Skills Assessment (EESA)</span>
        <i>Copyright © 2007-2015 Barbara E. Esch</i>
      </footer>
    </article>
  </div>
</template>

<style scoped>
/* Colours and type follow the printed form. */
/* The form reads left to right even on the Arabic page, so a narrow screen scrolls from its left edge. */
.eesa-scroll { overflow-x: auto; direction: ltr; }
.eesa {
  --eesa-orange: #ef8354;
  --eesa-orange-light: #f6b79b;
  min-width: 800px;
  max-width: 1000px;
  margin: 0 auto;
  padding-bottom: 1rem;
  background: #fff;
  color: #231f20;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  font-size: 13px;
  line-height: 1.35;
  text-align: left;
}
.eesa-banner { background: var(--eesa-orange); color: #fff; text-align: center; padding: 0.55rem 1rem 0.5rem; }
.eesa-banner h3 { margin: 0; font-size: 1.85rem; font-weight: 700; letter-spacing: 0.02em; }
.eesa-banner p { margin: 0.1rem 0 0; font-size: 1.1rem; font-weight: 700; letter-spacing: 0.08em; }
.eesa-top { display: flex; justify-content: space-between; gap: 1rem; padding: 0.75rem 1.25rem 0; }
.eesa-heading { color: var(--eesa-orange); font-weight: 700; font-size: 1.05rem; margin: 0; }
.eesa-scoring p { margin: 0; }
.eesa-scoring .eesa-heading { font-size: 1.05rem; }
.eesa-rule { margin: 0; font-size: 0.82rem; }
.eesa-mark { display: inline-block; min-width: 3.3rem; text-align: right; padding-right: 0.25rem; font-size: 0.95rem; }
.eesa-summary, .eesa-subtotal { display: flex; align-items: flex-end; gap: 0.6rem; flex-shrink: 0; }
.eesa-total-label { margin: 0; text-align: right; color: var(--eesa-orange); font-weight: 700; font-size: 0.98rem; line-height: 1.2; }
.eesa-total-label i { color: #231f20; font-weight: 400; }
.eesa-subtotal-label { margin: 0 0 0.2rem; text-align: right; color: var(--eesa-orange); font-weight: 700; font-size: 0.82rem; line-height: 1.2; }
.eesa-assessment { border-collapse: collapse; border: 1.5px solid var(--eesa-orange); }
.eesa-assessment th { background: var(--eesa-orange); color: #fff; font-weight: 700; font-variant: small-caps; font-size: 0.78rem; padding: 0.05rem 0; letter-spacing: 0.04em; }
.eesa-assessment thead tr:nth-child(2) th { background: #f9cdb9; color: #fff; font-size: 0.68rem; width: 2.6rem; }
.eesa-assessment td { height: 1.9rem; border: 1px solid var(--eesa-orange); text-align: center; font-weight: 700; font-size: 0.85rem; }
.eesa-assessment td.current { background: #fff4ee; }
.eesa-group { display: flex; justify-content: space-between; align-items: flex-end; gap: 1rem; padding: 0.7rem 1.25rem 0; }
.eesa-group-body { flex: 1; min-width: 0; }
.eesa-targets { margin: 0.1rem 0 0; font-style: italic; font-size: 0.85rem; }
.eesa-model { color: #231f20; font-weight: 400; font-size: 0.95rem; }
.eesa-items { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); column-gap: 0.4rem; margin-top: 0.55rem; }
.eesa-column { display: grid; gap: 0.18rem; align-content: start; }
.eesa-item { display: flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; cursor: text; white-space: nowrap; }
.eesa-items.prosody .eesa-item { font-size: 0.85rem; }
.eesa-items.prosody b { font-size: 1.05rem; }
.eesa-item input {
  width: 1.55rem; height: 1.45rem; flex-shrink: 0; padding: 0; text-align: center;
  border: 1px solid #231f20; border-radius: 0; background: #fff; font: inherit; font-weight: 700; font-size: 0.78rem;
}
.eesa-item input:focus { outline: 2px solid var(--eesa-orange); outline-offset: 0; }
.eesa-item input.invalid { border-color: #dc2626; background: #fee2e2; }
.eesa-lines { margin-top: 0.3rem; }
.eesa-line-heading { margin: 0.35rem 0 0.15rem 1.9rem; font-weight: 700; font-size: 0.85rem; }
.eesa-line { display: flex; flex-wrap: wrap; gap: 0.25rem 1.2rem; }
.eesa-lines .eesa-item { font-size: 0.72rem; }
.eesa-footer { display: flex; justify-content: space-between; padding: 1.1rem 1.25rem 0; color: var(--eesa-orange); font-size: 0.8rem; }
</style>
