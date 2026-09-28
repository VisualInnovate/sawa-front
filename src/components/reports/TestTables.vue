<script setup>
// The two tables above every chart in the report: the child with the age at each test, and the tests
// (tester, colors, date, score, key). Rows are the chosen tests only, oldest first; unused rows stay empty.
import EditableText from "./EditableText.vue";
import { shortAge, ymd } from "./reportUtils";

defineProps({
  child: { type: Object, required: true },
  // [{ date, form: { testers, colors, age_months } }], oldest first, at most four
  tests: { type: Array, required: true },
  // The report's editable scores for this section (one per row).
  scores: { type: Array, required: true },
});

const KEYS = ["1st test", "2nd test", "3rd test", "4th test"];
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
        <tr v-for="(key, i) in KEYS" :key="key">
          <th v-if="i === 0" :rowspan="KEYS.length" class="tone-c">Age at testing</th>
          <th class="tone-c tt-n">{{ i + 1 }}</th>
          <td><span class="ltr">{{ tests[i] ? shortAge(tests[i].form?.age_months) : "" }}</span></td>
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
        <tr v-for="(key, i) in KEYS" :key="key">
          <td>{{ tests[i]?.form?.testers?.join(" / ") ?? "" }}</td>
          <td>
            <span class="tt-swatches">
              <i v-for="color in tests[i]?.form?.colors ?? []" :key="color" :style="{ background: '#' + color }" />
            </span>
          </td>
          <td><span class="ltr">{{ ymd(tests[i]?.date) }}</span></td>
          <td><EditableText v-if="tests[i]" v-model="scores[i]" block /></td>
          <th class="tone-e"><span class="ltr">{{ key }}</span></th>
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
.tone-a { background: #cfe8ea; }
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
