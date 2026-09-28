<script setup>
// The results of one non-VB-MAPP evaluation on the printed report, in the same form as its results page.
import { computed } from "vue";
import { ABLLS, BARRIER, CAROLINA, SIDE_PROFILE } from "./reportUtils";

const props = defineProps({
  // { type, result }
  item: { type: Object, required: true },
});

const type = computed(() => Number(props.item.type));
const result = computed(() => props.item.result);

const sideRows = computed(() => {
  const r = result.value ?? {};
  return ["child_age", "grow_age", "diff_age", "basal_age", "late_percentage"]
    .filter((key) => r[key] !== null && r[key] !== undefined && r[key] !== "")
    .map((key) => ({ key, value: key === "late_percentage" ? `${Math.round(Number(r[key]))}%` : r[key] }));
});

// Barriers are scored 0-4.
const barriers = computed(() => (Array.isArray(result.value) ? result.value : []));

// ABLLS: [{ category, missions: [{ mission_key, mission_degree: "0123", answer_score, answer_color }] }]
const ablls = computed(() =>
  (Array.isArray(result.value) ? result.value : []).filter((category) => category.missions?.length)
);
const boxes = (mission) => Math.max(0, String(mission.mission_degree ?? "").length - 1);

// Carolina lists every test; only the answered ones are printed.
const carolina = computed(() =>
  (Array.isArray(result.value) ? result.value : [])
    .map((category) => ({
      category: category.category,
      rows: (category.groups ?? []).flatMap((group) =>
        (group.tests ?? [])
          .filter((test) => test.response && test.response !== "لا توجد اجابه")
          .map((test) => ({ age: group.age, ...test }))
      ),
    }))
    .filter((category) => category.rows.length)
);

const hasData = computed(() => {
  if (type.value === SIDE_PROFILE) return sideRows.value.length || result.value?.description;
  if (type.value === BARRIER) return barriers.value.length;
  if (type.value === ABLLS) return ablls.value.length;
  if (type.value === CAROLINA) return carolina.value.length;
  return false;
});
</script>

<template>
  <p v-if="!hasData" class="rr-empty">{{ $t("ereport.no_result_data") }}</p>

  <!-- Side profile -->
  <template v-else-if="type === SIDE_PROFILE">
    <table class="rr-table rr-kv">
      <tbody>
        <tr v-for="row in sideRows" :key="row.key">
          <th>{{ $t(`ereport.side.${row.key}`) }}</th>
          <td>{{ row.value }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="result?.description" class="rr-note">
      <strong>{{ $t("ereport.side.description") }}</strong>
      <p>{{ result.description }}</p>
    </div>
  </template>

  <!-- Barriers -->
  <table v-else-if="type === BARRIER" class="rr-table">
    <thead>
      <tr>
        <th>#</th>
        <th>{{ $t("ereport.barrier_subtest") }}</th>
        <th class="rr-score-head">{{ $t("ereport.barrier_score") }} (0-4)</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, i) in barriers" :key="i">
        <td class="rr-num">{{ i + 1 }}</td>
        <td>{{ row.subtest }}</td>
        <td>
          <div class="rr-bar">
            <span v-for="n in 4" :key="n" :style="{ background: n <= Number(row.score) ? `#${row.color || '135c65'}` : 'transparent' }" />
            <b>{{ row.score }}</b>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- ABLLS -->
  <div v-else-if="type === ABLLS" class="rr-ablls">
    <section v-for="(category, i) in ablls" :key="i" class="rr-ablls-cat">
      <h5>{{ category.category }}</h5>
      <div v-for="mission in category.missions" :key="mission.mission_key" class="rr-ablls-row">
        <span class="rr-key">{{ mission.mission_key }}</span>
        <span class="rr-boxes">
          <span
            v-for="n in boxes(mission)"
            :key="n"
            :style="{ background: n <= Number(mission.answer_score) ? `#${mission.answer_color}` : 'transparent' }"
          />
        </span>
      </div>
    </section>
  </div>

  <!-- Carolina -->
  <table v-else-if="type === CAROLINA" class="rr-table">
    <thead>
      <tr>
        <th>{{ $t("ereport.carolina_category") }}</th>
        <th>{{ $t("ereport.carolina_age") }}</th>
        <th>{{ $t("ereport.carolina_symbol") }}</th>
        <th>{{ $t("ereport.carolina_skill") }}</th>
        <th>{{ $t("ereport.carolina_response") }}</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(category, c) in carolina" :key="c">
        <tr v-for="(row, r) in category.rows" :key="c + '-' + r">
          <th v-if="r === 0" :rowspan="category.rows.length" class="rr-cat">{{ category.category }}</th>
          <td class="rr-nowrap">{{ row.age }}</td>
          <td class="rr-nowrap ltr">{{ row.symbol }}</td>
          <td>{{ row.skill }}</td>
          <td class="rr-nowrap">{{ row.response }}</td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<style scoped>
.rr-empty {
  padding: 18px;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  color: #64748b;
  text-align: center;
}
.rr-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 10pt;
}
.rr-table th,
.rr-table td {
  padding: 5px 8px;
  border: 1px solid #cbd5e1;
  text-align: start;
  vertical-align: middle;
}
.rr-table thead th {
  background: #e6f2f3;
  color: #0e464d;
  font-weight: 800;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.rr-table tr {
  break-inside: avoid;
}
.rr-kv th {
  width: 45%;
  background: #f3f9fa;
  color: #0e464d;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.rr-num {
  width: 32px;
  text-align: center !important;
  color: #64748b;
}
.rr-score-head {
  width: 38%;
}
.rr-cat {
  width: 22%;
  background: #f3f9fa;
  color: #0e464d;
  font-weight: 800;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.rr-nowrap {
  white-space: nowrap;
}
.rr-note {
  margin-top: 12px;
  padding: 10px 12px;
  border: 1px solid #d5e6e8;
  border-radius: 8px;
}
.rr-note p {
  margin: 4px 0 0;
  white-space: pre-line;
}
.rr-bar {
  display: flex;
  align-items: center;
  gap: 3px;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.rr-bar span {
  width: 26px;
  height: 14px;
  border: 1px solid #94a3b8;
  border-radius: 2px;
}
.rr-bar b {
  margin-inline-start: 6px;
}
.rr-ablls {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}
.rr-ablls-cat {
  padding: 8px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  break-inside: avoid;
}
.rr-ablls-cat h5 {
  margin: 0 0 6px;
  padding-bottom: 4px;
  border-bottom: 1px solid #e2e8f0;
  color: #0e464d;
  font-size: 9.5pt;
  font-weight: 800;
}
.rr-ablls-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 3px;
}
.rr-key {
  min-width: 34px;
  font-size: 8.5pt;
  font-weight: 700;
  direction: ltr;
}
.rr-boxes {
  display: flex;
  gap: 2px;
  direction: ltr;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.rr-boxes span {
  width: 14px;
  height: 12px;
  border: 1px solid #94a3b8;
}
</style>
