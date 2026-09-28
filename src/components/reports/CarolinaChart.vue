<script setup>
// Carolina as on its results page: domain, age, symbol, skill and the response — one response column per
// chosen test. Skills no chosen test answered are left out (the full list runs to many pages).
import { computed } from "vue";

const props = defineProps({
  // [{ result: [{ category, groups: [{ age, tests: [{ symbol, skill, response, note }] }] }] }], oldest first
  tests: { type: Array, required: true },
});

const NO_ANSWER = "لا توجد اجابه";
const KEYS = ["1st test", "2nd test", "3rd test", "4th test"];
const answered = (value) => value && value !== NO_ANSWER;

const rows = computed(() =>
  (props.tests[0]?.result ?? [])
    .map((category, c) => ({
      category: category.category,
      rows: (category.groups ?? []).flatMap((group, g) =>
        (group.tests ?? []).map((skill, s) => ({
          age: group.age,
          symbol: skill.symbol,
          skill: skill.skill,
          responses: props.tests.map((test) => test.result?.[c]?.groups?.[g]?.tests?.[s]?.response ?? ""),
        }))
      ).filter((row) => row.responses.some(answered)),
    }))
    .filter((category) => category.rows.length)
);
</script>

<template>
  <table class="cc">
    <thead>
      <tr>
        <th>{{ $t("ereport.carolina_category") }}</th>
        <th>{{ $t("ereport.carolina_age") }}</th>
        <th>{{ $t("ereport.carolina_symbol") }}</th>
        <th>{{ $t("ereport.carolina_skill") }}</th>
        <th v-for="(test, i) in tests" :key="i" class="cc-response">
          {{ $t("ereport.carolina_response") }}<small v-if="tests.length > 1" class="ltr">{{ KEYS[i] }}</small>
        </th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(category, c) in rows" :key="c">
        <tr v-for="(row, r) in category.rows" :key="c + '-' + r">
          <th v-if="r === 0" :rowspan="category.rows.length" class="cc-cat">{{ category.category }}</th>
          <td class="cc-nowrap">{{ row.age }}</td>
          <td class="cc-nowrap"><span class="ltr">{{ row.symbol }}</span></td>
          <td>{{ row.skill }}</td>
          <td v-for="(response, i) in row.responses" :key="i" class="cc-nowrap">{{ answered(response) ? response : "" }}</td>
        </tr>
      </template>
      <tr v-if="!rows.length">
        <td :colspan="4 + tests.length" class="cc-empty">{{ $t("ereport.no_result_data") }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.cc {
  width: 100%;
  border-collapse: collapse;
  font-size: 9.5pt;
  line-height: 1.5;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.cc th,
.cc td {
  padding: 4px 7px;
  border: 1px solid #1f2937;
  text-align: center;
  vertical-align: middle;
}
.cc thead th {
  background: #f3f4f6;
  color: #374151;
  font-weight: 800;
}
.cc thead small {
  display: block;
  font-weight: 600;
  color: #64748b;
}
.cc tr {
  break-inside: avoid;
}
.cc-cat {
  width: 20%;
  font-weight: 800;
  font-size: 10.5pt;
}
.cc-nowrap {
  white-space: nowrap;
}
.cc-response {
  width: 11%;
}
.cc-empty {
  padding: 14px;
  color: #64748b;
}
</style>
