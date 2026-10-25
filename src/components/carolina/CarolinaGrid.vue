<script setup>
// A Carolina evaluation's result as the paper form: left to right, the domain, its general goals, then the age
// ranges (split into balanced tables when there are more than `perTable`). Each skill is a box with its symbol under
// its age range: + plain, - red, +- crossed from the top-left to the bottom-right corner, not answered faded; the
// small square in the top-right corner is the color of the round that gave the answer.
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
const boxClass = (skill) => ({ "+": "is-plus", "-": "is-minus", "+-": "is-partial" })[skill.response] ?? "is-empty";
const boxTitle = (skill) => [skill.symbol, skill.skill, skill.response ? `(${skill.response})` : t("carolina_ui.not_answered")].filter(Boolean).join(" — ");
const LEGEND = [
  { key: "is-plus", sign: "+" },
  { key: "is-minus", sign: "-" },
  { key: "is-partial", sign: "+-" },
];
</script>

<template>
  <div class="cg" :class="{ 'is-compact': compact }">
    <p v-if="!domains.length" class="cg-empty"><i class="pi pi-inbox" aria-hidden="true" /> {{ $t("carolina_ui.no_results") }}</p>
    <template v-else>
      <!-- The key: the three responses, not evaluated, and each round's color. -->
      <div class="cg-legend">
        <span v-for="item in LEGEND" :key="item.key" class="cg-chip">
          <span class="cg-box is-sample" :class="item.key"><b>a</b></span><span class="cg-sign" dir="ltr">{{ item.sign }}</span>
        </span>
        <span class="cg-chip"><span class="cg-box is-sample is-empty"><b>a</b></span>{{ $t("carolina_ui.not_answered") }}</span>
        <span v-for="round in result?.rounds ?? []" :key="round.round" class="cg-chip">
          <i class="cg-swatch" :style="{ background: '#' + round.color }" />
          {{ $t("carolina_ui.round_n", { n: round.round }) }} <span dir="ltr" class="cg-date">{{ round.date }}</span>
        </span>
      </div>

      <div v-for="(chunk, c) in chunks" :key="c" class="cg-sheet">
        <table class="cg-table" dir="ltr">
          <colgroup>
            <col class="cg-domain-col" />
            <col class="cg-goal-col" />
            <col v-for="range in chunk" :key="range.id" />
          </colgroup>
          <thead>
            <tr>
              <th class="cg-head-label" dir="rtl">{{ $t("carolina_ui.domain") }}</th>
              <th class="cg-head-label" dir="rtl">{{ $t("carolina_ui.general_goals") }}</th>
              <th v-for="range in chunk" :key="range.id" class="cg-range">
                <b>{{ range.name }}</b>
                <small dir="rtl">{{ $t("carolina_ui.months") }}</small>
              </th>
            </tr>
          </thead>
          <tbody v-for="domain in domains" :key="domain.id ?? 'none'" class="cg-domain-group">
            <tr v-for="(goal, g) in domain.goals" :key="goal.id">
              <th v-if="g === 0" :rowspan="domain.goals.length" class="cg-domain" :class="{ 'is-none': !domain.title }" dir="rtl">
                <span>{{ domain.title || $t("carolina_ui.no_domain") }}</span>
              </th>
              <th class="cg-goal" dir="rtl">{{ goal.title }}</th>
              <td v-for="range in chunk" :key="range.id" class="cg-cell">
                <div class="cg-boxes">
                  <span v-for="skill in skillsIn(goal, range)" :key="skill.id" class="cg-box" :class="boxClass(skill)" :title="boxTitle(skill)">
                    <i v-if="skill.color" class="cg-color" :style="{ background: '#' + skill.color }" />
                    <b>{{ skill.symbol }}</b>
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<style scoped>
.cg {
  --cg-primary: var(--sawa-primary, #135c65);
  --cg-line: #dbe5e7;
  --cg-soft: #eef7f8;
  display: grid;
  gap: 1rem;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.cg-empty { display: flex; align-items: center; justify-content: center; gap: .5rem; margin: 0; padding: 2rem; color: #64748b; }

/* key */
.cg-legend { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; }
.cg-chip { display: inline-flex; align-items: center; gap: .45rem; padding: .3rem .7rem .3rem .4rem; border: 1px solid var(--cg-line); border-radius: 999px; background: #fff; color: #334155; font-size: .82rem; font-weight: 600; }
.cg-sign { font-family: "Segoe UI", Tahoma, Arial, sans-serif; font-variant-ligatures: none; font-weight: 800; }
.cg-swatch { width: 14px; height: 14px; border-radius: 4px; box-shadow: inset 0 0 0 1px rgba(15, 23, 42, .15); }
.cg-date { color: #64748b; font-weight: 500; }

/* one table */
.cg-sheet { overflow-x: auto; border: 1px solid var(--cg-line); border-radius: 14px; background: #fff; box-shadow: 0 6px 18px -14px rgba(15, 23, 42, .45); }
.cg-table { width: 100%; min-width: 40rem; border-collapse: collapse; table-layout: fixed; font-size: .9rem; }
.cg-domain-col { width: 3.4rem; }
.cg-goal-col { width: 13rem; }
.cg-table th, .cg-table td { border: 1px solid var(--cg-line); vertical-align: middle; }
.cg-table tr:first-child > * { border-top: 0; }
.cg-table tr > :first-child { border-left: 0; }
.cg-table tr > :last-child { border-right: 0; }
.cg-table thead th { padding: .6rem .4rem; border-color: rgba(255, 255, 255, .18); background: var(--cg-primary); color: #fff; text-align: center; }
.cg-head-label { font-size: .82rem; font-weight: 700; }
.cg-range b { display: block; font-size: 1rem; font-weight: 800; letter-spacing: .02em; }
.cg-range small { display: block; font-size: .72rem; font-weight: 600; opacity: .8; }
/* each domain starts with a stronger line */
.cg-domain-group + .cg-domain-group tr:first-child > * { border-top: 2px solid #b9d3d7; }
.cg-domain { padding: .5rem .25rem; background: var(--cg-soft); color: #0e464d; font-size: .85rem; font-weight: 800; text-align: center; }
.cg-domain.is-none { background: #f8fafc; color: #64748b; }
.cg-domain span { display: inline-block; writing-mode: vertical-rl; transform: rotate(180deg); line-height: 1.35; }
.cg-goal { padding: .65rem .8rem; background: #fbfdfd; color: #1e293b; font-size: .88rem; font-weight: 700; line-height: 1.55; text-align: start; }
.cg-cell { padding: .55rem .4rem; }
.cg-table tbody tr:hover .cg-cell, .cg-table tbody tr:hover .cg-goal { background: #f6fbfb; }
.cg-boxes { display: flex; flex-wrap: wrap; justify-content: center; gap: .4rem; }

/* a skill */
.cg-box { position: relative; display: inline-grid; place-items: center; width: 3.4rem; height: 2.35rem; border: 1.5px solid #94a3b8; border-radius: 8px; background: #fff; color: #0f172a; direction: ltr; white-space: nowrap; box-shadow: 0 1px 2px rgba(15, 23, 42, .08); }
.cg-box b { position: relative; z-index: 1; font-size: .8rem; font-weight: 800; letter-spacing: .01em; }
.cg-box.is-minus { border-color: #c62828; background: linear-gradient(180deg, #f05252 0%, #dc2626 100%); color: #fff; }
/* +-: a line from the top-left corner to the bottom-right one; the symbol keeps a white backing to stay readable. */
.cg-box.is-partial { border-color: #475569; background: linear-gradient(to top right, #fff calc(50% - 1px), #334155 calc(50% - 1px), #334155 calc(50% + 1px), #fff calc(50% + 1px)); }
.cg-box.is-partial b { padding: 0 .2rem; border-radius: 3px; background: rgba(255, 255, 255, .92); }
.cg-box.is-empty { border-style: dashed; border-color: #cbd5e1; background: #f8fafc; color: #94a3b8; box-shadow: none; }
.cg-color { position: absolute; top: 3px; right: 3px; z-index: 2; width: 9px; height: 9px; border-radius: 3px; box-shadow: 0 0 0 1.5px #fff, 0 0 0 2.5px rgba(15, 23, 42, .18); }
.cg-box.is-sample { width: 1.9rem; height: 1.4rem; border-radius: 6px; }
.cg-box.is-sample b { font-size: .7rem; }

/* the printed report */
.is-compact { gap: 3mm; }
.is-compact .cg-sheet { border-radius: 8px; box-shadow: none; }
.is-compact .cg-table { min-width: 0; font-size: 8pt; }
.is-compact .cg-domain-col { width: 9mm; }
.is-compact .cg-goal-col { width: 34mm; }
.is-compact .cg-table thead th { padding: 2mm 1mm; }
.is-compact .cg-range b { font-size: 9pt; }
.is-compact .cg-goal { padding: 1.5mm 2mm; font-size: 8pt; }
.is-compact .cg-cell { padding: 1.5mm 1mm; }
.is-compact .cg-boxes { gap: 1.2mm; }
.is-compact .cg-box { width: 11mm; height: 7mm; border-radius: 5px; box-shadow: none; }
.is-compact .cg-box b { font-size: 7pt; }
.is-compact .cg-color { width: 6px; height: 6px; top: 2px; right: 2px; border-radius: 2px; }
.is-compact .cg-chip { padding: 1mm 2.5mm 1mm 1mm; font-size: 7.5pt; }
.is-compact .cg-box.is-sample { width: 7mm; height: 5mm; }
@media print {
  .cg-sheet { box-shadow: none; break-inside: avoid; }
  .cg-table tbody tr:hover .cg-cell, .cg-table tbody tr:hover .cg-goal { background: inherit; }
}
</style>
