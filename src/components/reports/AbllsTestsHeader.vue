<script setup>
// The table above the paper flow chart: who was tested, when, by whom, and the color each test is drawn in.
//  ot: "Assessment of Basic Language and Learning Skills / Skills Tracking System" with a block per test
//      (Student, Assessor, the date and the test's color in its small grid); three blocks at least, as on the paper.
//  sp: «اسم الطالب» then a row per test: «الرمز» (its color), «التاريخ», «اسم الفاحص»; four rows at least.
import { computed } from "vue";
import { dmy } from "./reportUtils";

const props = defineProps({
  variant: { type: String, default: "ot" },
  // [{ date, specialist: { name }, result: [{ missions: [{ answer_color }] }] }], oldest first
  tests: { type: Array, required: true },
  childName: { type: String, default: "" },
});

const colorOf = (test) => {
  for (const category of test?.result ?? []) {
    const color = (category.missions ?? []).find((mission) => mission.answer_color)?.answer_color;
    if (color) return `#${color}`;
  }
  return null;
};

const filled = (min) => {
  const rows = props.tests.map((test) => ({ date: dmy(test.date), assessor: test.specialist?.name ?? "", color: colorOf(test), empty: false }));
  while (rows.length < min) rows.push({ date: "", assessor: "", color: null, empty: true });
  return rows;
};
const blocks = computed(() => filled(3));
const rows = computed(() => filled(4));
</script>

<template>
  <div v-if="variant === 'sp'" class="ath-sp" dir="rtl">
    <table>
      <tbody>
        <tr>
          <th>اسم الطالب</th>
          <td colspan="2">{{ childName }}</td>
        </tr>
        <tr>
          <th>الرمز</th>
          <th>التاريخ</th>
          <th>اسم الفاحص</th>
        </tr>
        <tr v-for="(row, i) in rows" :key="i">
          <td class="ath-color" :style="row.color ? { background: row.color } : null" />
          <td class="ltr">{{ row.date }}</td>
          <td>{{ row.assessor }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-else class="ath-ot" dir="ltr">
    <div class="ath-title">
      <b>Assessment of Basic Language and Learning Skills</b>
      <span>Skills Tracking System</span>
    </div>
    <div class="ath-blocks">
      <div v-for="(block, i) in blocks" :key="i" class="ath-block">
        <div class="ath-fields">
          <p><span>Student</span><b dir="auto">{{ block.empty ? "" : childName }}</b></p>
          <p><span>Assessor</span><b dir="auto">{{ block.assessor }}</b></p>
          <p><span>Date</span><b>{{ block.date }}</b></p>
        </div>
        <span class="ath-grid" aria-hidden="true">
          <i v-for="n in 6" :key="n" :style="n === 1 && block.color ? { background: block.color } : null" />
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ath-sp,
.ath-ot {
  margin: 0 auto 4mm;
  color: #111827;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.ath-sp {
  display: flex;
  justify-content: flex-start;
}
.ath-sp table {
  width: 95mm;
  border-collapse: collapse;
  font-size: 8.5pt;
}
.ath-sp th,
.ath-sp td {
  height: 6mm;
  padding: 1mm 2mm;
  border: 1px solid #111827;
  text-align: center;
}
.ath-sp th {
  font-weight: 700;
}
.ath-sp .ath-color {
  width: 18mm;
}
.ath-ot {
  max-width: 170mm;
  border: 1px solid #111827;
  font-size: 7.5pt;
}
.ath-title {
  display: grid;
  justify-items: center;
  padding: 1.5mm;
  border-bottom: 1px solid #111827;
  font-family: "Times New Roman", serif;
}
.ath-title b {
  font-size: 9pt;
}
.ath-blocks {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(48mm, 1fr));
}
.ath-block {
  display: flex;
  align-items: center;
  gap: 2mm;
  padding: 1.5mm 2mm;
  border-inline-start: 1px solid #111827;
}
.ath-block:first-child {
  border-inline-start: 0;
}
.ath-fields {
  flex: 1;
  min-width: 0;
}
.ath-fields p {
  display: flex;
  gap: 1.5mm;
  margin: 0 0 1mm;
  font-family: "Times New Roman", serif;
}
.ath-fields span {
  flex: none;
  width: 13mm;
  font-weight: 700;
}
.ath-fields b {
  flex: 1;
  min-width: 0;
  min-height: 1.2em;
  border-bottom: 1px solid #111827;
  font-weight: 500;
  overflow-wrap: anywhere;
}
.ath-grid {
  display: grid;
  flex: none;
  grid-template-columns: repeat(2, 4mm);
  grid-template-rows: repeat(3, 4mm);
  border: 1px solid #111827;
}
.ath-grid i {
  border-inline-start: 1px solid #111827;
  border-top: 1px solid #111827;
}
.ath-grid i:nth-child(odd) {
  border-inline-start: 0;
}
.ath-grid i:nth-child(-n + 2) {
  border-top: 0;
}
</style>
