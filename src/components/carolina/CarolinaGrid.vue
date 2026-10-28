<script setup>
// A Carolina evaluation's result drawn like the paper form: left to right, the type (written upwards, over its
// domains), the domain (a row each, «المهارات»), then the age ranges (split into balanced tables when there are more
// than `perTable`). Each age cell is divided between that domain's skills there, one part per skill with its symbol:
// every answered part (+ or -) is filled with the color of the round that gave the answer, +- stays white and is
// crossed from the top-left to the bottom-right corner; not answered stays white with a grey symbol.
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  // { rounds: [{ round, color, date }], age_ranges: [{ id, name }], domains: [{ id, title, type, type_title, goals: [{ id, title, skills: [...] }] }] }
  result: { type: Object, default: null },
  perTable: { type: Number, default: 6 },
  // Smaller type for the printed report.
  compact: { type: Boolean, default: false },
});

const { t } = useI18n();

const ranges = computed(() => props.result?.age_ranges ?? []);
const domains = computed(() => (props.result?.domains ?? []).filter((domain) => domain.goals?.length));
// The domains under their type, in the order given (by type, then display order); those without a type last.
const types = computed(() => {
  const list = [];
  for (const domain of domains.value) {
    const key = domain.type ?? 0;
    if (list.at(-1)?.key !== key) list.push({ key, title: domain.type_title, domains: [] });
    list.at(-1).domains.push(domain);
  }
  return list;
});
// Tables of equal width: 8 ranges at 6 a table make two tables of 4, not 6 and 2.
const chunks = computed(() => {
  const count = Math.ceil(ranges.value.length / Math.max(1, props.perTable));
  const size = Math.ceil(ranges.value.length / Math.max(1, count));
  const list = [];
  for (let i = 0; i < ranges.value.length; i += size) list.push(ranges.value.slice(i, i + size));
  return list;
});
// A domain's skills in an age range, goal after goal.
const skillsIn = (domain, range) => domain.goals.flatMap((goal) => (goal.skills ?? []).filter((skill) => skill.age_range_id === range.id));
const partClass = (skill) => (skill.response ? ["is-answered", { "is-partial": skill.response === "+-" }] : "is-empty");
const partStyle = (skill) => (skill.response && skill.response !== "+-" && skill.color ? { backgroundColor: "#" + skill.color } : null);
const partTitle = (skill) => [skill.symbol, skill.skill, skill.response ? `(${skill.response})` : t("carolina_ui.not_answered")].filter(Boolean).join(" — ");
</script>

<template>
  <div class="cg" :class="{ 'is-compact': compact }">
    <p v-if="!domains.length" class="cg-empty">{{ $t("carolina_ui.no_results") }}</p>
    <template v-else>
      <table v-for="(chunk, c) in chunks" :key="c" class="cg-table" dir="ltr">
        <colgroup>
          <col class="cg-type-col" />
          <col class="cg-domain-name-col" />
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
        <tbody v-for="type in types" :key="type.key" class="cg-type-group">
          <tr v-for="(domain, d) in type.domains" :key="domain.id ?? 'none'">
            <th v-if="d === 0" :rowspan="type.domains.length" class="cg-type" :style="{ '--rows': type.domains.length }" dir="rtl">
              <span>{{ type.title || $t("carolina_ui.no_type") }}</span>
            </th>
            <th class="cg-domain-name" dir="rtl">{{ domain.title || $t("carolina_ui.no_domain") }}</th>
            <td v-for="range in chunk" :key="range.id" class="cg-cell">
              <div class="cg-parts">
                <span v-for="skill in skillsIn(domain, range)" :key="skill.id" class="cg-part" :class="partClass(skill)" :style="partStyle(skill)" :title="partTitle(skill)">
                  {{ skill.symbol }}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <p class="cg-legend">
        <span><span class="cg-part is-sample is-answered is-partial">a</span><span dir="ltr">+-</span></span>
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
.cg-type-col { width: 3.4rem; }
.cg-domain-name-col { width: 15rem; }
.cg-table thead th { height: 2.6rem; padding: .3rem .4rem; background: #fff; font-weight: 700; text-align: center; }
.cg-head-skills { font-size: 1rem; }
.cg-range { font-size: .95rem; }
.cg-range b { font-size: 1.05rem; font-weight: 800; }
/* a heavier line under the header and between types, as on the form */
.cg-table thead th { border-bottom-width: 2px; }
.cg-type-group + .cg-type-group tr:first-child > * { border-top: 2px solid #111827; }
.cg-type { padding: .4rem .2rem; background: #fff; font-size: .92rem; font-weight: 800; text-align: center; }
/* Written upwards and kept within its rows' height: a long name wraps onto more lines rather than stretching them. */
.cg-type span { display: inline-block; max-height: max(4.5rem, calc(var(--rows, 1) * 2.2rem - .5rem)); writing-mode: vertical-rl; transform: rotate(180deg); line-height: 1.25; }
.cg-domain-name { padding: .3rem .6rem; background: #fff; font-size: .92rem; font-weight: 600; line-height: 1.45; text-align: start; }

/* each age cell is split between its skills, edge to edge */
.cg-cell { height: 2.2rem; padding: 0; }
.cg-parts { display: flex; height: 100%; min-height: 2.2rem; }
.cg-part { position: relative; display: flex; flex: 1 1 0; align-items: center; justify-content: center; min-width: 0; padding: 0 .3rem; font-size: .88rem; font-weight: 600; direction: ltr; white-space: nowrap; }
.cg-part + .cg-part { border-left: 1px solid var(--cg-line); }
/* answered: the round's color (set inline); red when an old answer has no round */
.cg-part.is-answered { background-color: var(--cg-red); color: #111827; }
/* +-: no color, only a line from the top-left corner to the bottom-right one */
.cg-part.is-partial { background-color: #fff; background-image: linear-gradient(to top right, transparent calc(50% - .6px), #374151 calc(50% - .6px), #374151 calc(50% + .6px), transparent calc(50% + .6px)); }
.cg-part.is-empty { color: #9ca3af; }

.cg-legend { display: flex; flex-wrap: wrap; align-items: center; gap: .4rem 1.1rem; margin: 0; color: #374151; font-size: .82rem; font-variant-ligatures: none; }
.cg-legend > span { display: inline-flex; align-items: center; gap: .35rem; }
.cg-part.is-sample.is-answered { background-color: #fff; }
.cg-part.is-sample { display: inline-flex; flex: none; width: 1.8rem; height: 1.3rem; border: 1px solid var(--cg-line); font-size: .75rem; }
.cg-swatch { width: 11px; height: 11px; border: 1px solid rgba(17, 24, 39, .45); }

/* the printed report: small, so a whole age range fits */
.is-compact { gap: 2mm; }
.is-compact .cg-table { font-size: 6.5pt; }
.is-compact .cg-type-col { width: 7mm; }
.is-compact .cg-type span { max-height: max(12mm, calc(var(--rows, 1) * 4.6mm - 1mm)); }
.is-compact .cg-domain-name-col { width: 28mm; }
.is-compact .cg-table thead th { height: 5mm; padding: .5mm; }
.is-compact .cg-range b, .is-compact .cg-head-skills { font-size: 7pt; }
.is-compact .cg-range { font-size: 6.5pt; }
.is-compact .cg-type, .is-compact .cg-domain-name { padding: .3mm .8mm; font-size: 6.5pt; line-height: 1.25; }
.is-compact .cg-cell, .is-compact .cg-parts { height: 4.6mm; min-height: 4.6mm; }
.is-compact .cg-part { padding: 0 .3mm; font-size: 5.5pt; }
.is-compact .cg-legend { font-size: 6.5pt; }
.is-compact .cg-part.is-sample { width: 6mm; height: 4mm; font-size: 5.5pt; }
</style>
