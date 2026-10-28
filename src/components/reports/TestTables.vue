<script setup>
// The two tables above a VB-MAPP chart in the report (milestones and barriers only): the child with the age at
// each row, and the rows (tester, color, date, score, key). The score is computed: the colored boxes (½ counts
// half) out of all the boxes of the form.
import { shortAge, ymd } from "./reportUtils";

defineProps({
  child: { type: Object, required: true },
  // [{ n, key, age_months, testers: [], colors: [], date, score, boxes_total }]; a row without a date stays empty.
  rows: { type: Array, required: true },
});

const number = (value) => String(Math.round(Number(value) * 10) / 10);
const score = (row) => (row?.score === null || row?.score === undefined || !row?.boxes_total ? "" : `${number(row.score)} / ${row.boxes_total}`);
</script>

<template>
  <div class="tt">
    <table class="tt-table">
      <tbody>
        <tr>
          <th class="tone-a">Child name</th>
          <td colspan="2">{{ child.name }}</td>
        </tr>
        <tr>
          <th class="tone-b">Date of birth</th>
          <td colspan="2"><span class="ltr">{{ ymd(child.birth_date) }}</span></td>
        </tr>
        <tr v-for="(row, i) in rows" :key="row.key">
          <th v-if="i === 0" :rowspan="rows.length" class="tone-c">Age at testing</th>
          <th class="tone-c tt-n">{{ row.n }}</th>
          <td><span class="ltr">{{ row.date ? shortAge(row.age_months) : "" }}</span></td>
        </tr>
      </tbody>
    </table>

    <table class="tt-table">
      <thead>
        <tr>
          <th class="tone-a">Tester</th>
          <th class="tone-b">Color</th>
          <th class="tone-c">Date</th>
          <th class="tone-d">Score</th>
          <th class="tone-e">Key</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.key">
          <td>{{ row.date ? (row.testers ?? []).join(" / ") : "" }}</td>
          <td>
            <span v-if="row.date" class="tt-swatches">
              <i v-for="color in row.colors ?? []" :key="color" :style="{ background: '#' + color }" />
            </span>
          </td>
          <td><span class="ltr">{{ ymd(row.date) }}</span></td>
          <td><span class="ltr">{{ row.date ? score(row) : "" }}</span></td>
          <th class="tone-e"><span class="ltr">{{ row.key }}</span></th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.tt {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.25fr);
  gap: 8mm;
  align-items: start;
  margin-bottom: 7mm;
}
.tt-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 9pt;
  line-height: 1.4;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.tt-table th,
.tt-table td {
  padding: 4px 6px;
  border: 1px solid #94a3b8;
  text-align: center;
  vertical-align: middle;
}
.tt-table th {
  font-weight: 800;
  color: #1e293b;
  white-space: nowrap;
}
.tt-table td {
  height: 26px;
  background: #fff;
}
.tt-n {
  width: 26px;
}
.tone-a { background: rgb(var(--bp-cfe8ea)); }
.tone-b { background: #dcfce7; }
.tone-c { background: #fef3c7; }
.tone-d { background: #fce7f3; }
.tone-e { background: #e0e7ff; }
.tt-swatches {
  display: inline-flex;
}
.tt-swatches i {
  width: 16px;
  height: 16px;
  border: 1px solid rgba(15, 23, 42, 0.25);
}
</style>
