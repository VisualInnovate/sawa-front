<script setup>
// A Carolina evaluation's result drawn like the paper form: left to right, the domain (written upwards), its general
// goals («المهارات»), then the age ranges (split into balanced tables when there are more than `perTable`). Each age
// cell is divided between that goal's skills there, one part per skill with its symbol: + plain, - filled red,
// +- crossed from the top-left to the bottom-right corner, not answered in grey; the small square in a part's
// top-right corner is the color of the round that gave the answer.
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  // { rounds: [{ round, color, date }], age_ranges: [{ id, name }], domains: [{ id, title, goals: [{ id, title, skills: [...] }] }] }
  result: { type: Object, default: null },
  perTable: { type: Number, default: 6 },
  // Smaller type for the printed report.
  compact: { type: Boolean, default: false },
});

const { t } = useI18n();

const ranges = computed(() => props.result?.age_ranges ?? []);
const domains = computed(() => (props.result?.domains ?? []).filter((domain) => domain.goals?.length));
// Tables of equal width: 8 ranges at 6 a table make two tables of 4, not 6 and 2.
const chunks = computed(() => {
  const count = Math.ceil(ranges.value.length / Math.max(1, props.perTable));
  const size = Math.ceil(ranges.value.length / Math.max(1, count));
  const list = [];
  for (let i = 0; i < ranges.value.length; i += size) list.push(ranges.value.slice(i, i + size));
  return list;
});
const skillsIn = (goal, range) => (goal.skills ?? []).filter((skill) => skill.age_range_id === range.id);
const partClass = (skill) => ({ "+": "is-plus", "-": "is-minus", "+-": "is-partial" })[skill.response] ?? "is-empty";
const partTitle = (skill) => [skill.symbol, skill.skill, skill.response ? `(${skill.response})` : t("carolina_ui.not_answered")].filter(Boolean).join(" — ");
</script>

<template>
  <div class="cg" :class="{ 'is-compact': compact }">
    <p v-if="!domains.length" class="cg-empty">{{ $t("carolina_ui.no_results") }}</p>
    <template v-else>
      <table v-for="(chunk, c) in chunks" :key="c" class="cg-table" dir="ltr">
        <colgroup>
          <col class="cg-domain-col" />
          <col class="cg-goal-col" />
          <col v-for="range in chunk" :key="range.id" />
        </colgroup>
        <thead>
          <tr>
            <th colspan="2" class="cg-head-skills" dir="rtl">{{ $t("carolina_ui.skills") }}</th>
            <th v-for="range in chunk" :key="range.id" class="cg-range" dir="rtl">
              {{ $t("carolina_ui.months") }} <b dir="ltr">{{ range.name }}</b>
            </th>
          </tr>
        </thead>
        <tbody v-for="domain in domains" :key="domain.id ?? 'none'" class="cg-domain-group">
          <tr v-for="(goal, g) in domain.goals" :key="goal.id">
            <th v-if="g === 0" :rowspan="domain.goals.length" class="cg-domain" :style="{ '--rows': domain.goals.length }" dir="rtl">
              <span>{{ domain.title || $t("carolina_ui.no_domain") }}</span>
            </th>
            <th class="cg-goal" dir="rtl">{{ goal.title }}</th>
            <td v-for="range in chunk" :key="range.id" class="cg-cell">
              <div class="cg-parts">
                <span v-for="skill in skillsIn(goal, range)" :key="skill.id" class="cg-part" :class="partClass(skill)" :title="partTitle(skill)">
                  <i v-if="skill.color" class="cg-color" :style="{ background: '#' + skill.color }" />
                  {{ skill.symbol }}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <p class="cg-legend">
        <span><span class="cg-part is-sample is-plus">a</span><span dir="ltr">+</span></span>
        <span><span class="cg-part is-sample is-minus">a</span><span dir="ltr">-</span></span>
        <span><span class="cg-part is-sample is-partial">a</span><span dir="ltr">+-</span></span>
        <span><span class="cg-part is-sample is-empty">a</span>{{ $t("carolina_ui.not_answered") }}</span>
        <span v-for="round in result?.rounds ?? []" :key="round.round">
          <i class="cg-swatch" :style="{ background: '#' + round.color }" />{{ $t("carolina_ui.round_n", { n: round.round }) }}
          <span dir="ltr">{{ round.date }}</span>
        </span>
      </p>
    </template>
  </div>
</template>

<style scoped>
.cg {
  --cg-line: #4b5563;
  --cg-red: #d9413f;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #111827;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.cg-empty { margin: 0; padding: 1.5rem; color: #6b7280; text-align: center; }

/* the paper form: white, thin dark lines, no ornament */
.cg-table { width: 100%; border-collapse: collapse; table-layout: fixed; background: #fff; font-size: .9rem; break-inside: avoid; }
.cg-table th, .cg-table td { border: 1px solid var(--cg-line); vertical-align: middle; }
.cg-domain-col { width: 3.4rem; }
.cg-goal-col { width: 15rem; }
.cg-table thead th { height: 2.6rem; padding: .3rem .4rem; background: #fff; font-weight: 700; text-align: center; }
.cg-head-skills { font-size: 1rem; }
.cg-range { font-size: .95rem; }
.cg-range b { font-size: 1.05rem; font-weight: 800; }
/* a heavier line under the header and between domains, as on the form */
.cg-table thead th { border-bottom-width: 2px; }
.cg-domain-group + .cg-domain-group tr:first-child > * { border-top: 2px solid #111827; }
.cg-domain { padding: .4rem .2rem; background: #fff; font-size: .92rem; font-weight: 800; text-align: center; }
/* Written upwards and kept within its rows' height: a long name wraps onto more lines rather than stretching them. */
.cg-domain span { display: inline-block; max-height: max(4.5rem, calc(var(--rows, 1) * 2.2rem - .5rem)); writing-mode: vertical-rl; transform: rotate(180deg); line-height: 1.25; }
.cg-goal { padding: .3rem .6rem; background: #fff; font-size: .92rem; font-weight: 600; line-height: 1.45; text-align: start; }

/* each age cell is split between its skills, edge to edge */
.cg-cell { height: 2.2rem; padding: 0; }
.cg-parts { display: flex; height: 100%; min-height: 2.2rem; }
.cg-part { position: relative; display: flex; flex: 1 1 0; align-items: center; justify-content: center; min-width: 0; padding: 0 .3rem; font-size: .88rem; font-weight: 600; direction: ltr; white-space: nowrap; }
.cg-part + .cg-part { border-left: 1px solid var(--cg-line); }
.cg-part.is-minus { background: var(--cg-red); color: #111827; }
/* +-: a line from the top-left corner to the bottom-right one */
.cg-part.is-partial { background: linear-gradient(to top right, transparent calc(50% - .6px), #374151 calc(50% - .6px), #374151 calc(50% + .6px), transparent calc(50% + .6px)); }
.cg-part.is-empty { color: #9ca3af; }
.cg-color { position: absolute; top: 2px; right: 2px; width: 7px; height: 7px; border: 1px solid rgba(17, 24, 39, .45); }

.cg-legend { display: flex; flex-wrap: wrap; align-items: center; gap: .4rem 1.1rem; margin: 0; color: #374151; font-size: .82rem; font-variant-ligatures: none; }
.cg-legend > span { display: inline-flex; align-items: center; gap: .35rem; }
.cg-part.is-sample { display: inline-flex; flex: none; width: 1.8rem; height: 1.3rem; border: 1px solid var(--cg-line); font-size: .75rem; }
.cg-swatch { width: 11px; height: 11px; border: 1px solid rgba(17, 24, 39, .45); }

/* the printed report */
.is-compact { gap: 3mm; }
.is-compact .cg-table { font-size: 8pt; }
.is-compact .cg-domain-col { width: 10mm; }
.is-compact .cg-domain span { max-height: max(16mm, calc(var(--rows, 1) * 6.5mm - 1mm)); }
.is-compact .cg-goal-col { width: 36mm; }
.is-compact .cg-table thead th { height: 7mm; padding: 1mm; }
.is-compact .cg-range b, .is-compact .cg-head-skills { font-size: 9pt; }
.is-compact .cg-domain, .is-compact .cg-goal { font-size: 8pt; }
.is-compact .cg-cell, .is-compact .cg-parts { height: 6.5mm; min-height: 6.5mm; }
.is-compact .cg-part { padding: 0 .5mm; font-size: 7.5pt; }
.is-compact .cg-color { width: 5px; height: 5px; top: 1px; right: 1px; }
.is-compact .cg-legend { font-size: 7.5pt; }
</style>
