<script setup>
// One VB-MAPP level's strengths and weaknesses as the report prints them (ReportEditor's summary page, read only):
// a table per kind, a row per target symbol with its points. The results page adds the level's plan goals the
// same way.
defineProps({
  // { title, rows: [{ symbol, strengths: [text], weaknesses: [text], plan: [text] }] }
  table: { type: Object, required: true },
  // The kinds shown, in order.
  kinds: { type: Array, default: () => ["strengths", "weaknesses"] },
});

const filled = (table, kind) => table.rows.filter((row) => row[kind]?.length);
const HEADINGS = { strengths: "ereport.strengths_intro", weaknesses: "ereport.weaknesses_intro", plan: "milestone_plan_goals" };
const COLUMNS = { strengths: "ereport.strengths", weaknesses: "ereport.weaknesses", plan: "milestone_plan_goal" };
</script>

<template>
  <div>
    <h3 v-if="table.title" class="rx-summary-level">{{ table.title }}</h3>
    <template v-for="kind in kinds" :key="kind">
      <h3 class="rx-summary-level">{{ $t(HEADINGS[kind]) }}</h3>
      <table class="rx-table rx-summary">
        <thead>
          <tr>
            <th class="rx-sum-num">{{ $t("ereport.number") }}</th>
            <th>{{ $t(COLUMNS[kind]) }}</th>
            <th class="rx-sum-symbol">{{ $t("ereport.target_symbol") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, r) in filled(table, kind)" :key="r">
            <td class="rx-sum-num">{{ r + 1 }}</td>
            <td>
              <ul class="rx-plan-points">
                <li v-for="(point, p) in row[kind]" :key="p">{{ point }}</li>
              </ul>
            </td>
            <td class="rx-sum-symbol"><b>{{ row.symbol }}</b></td>
          </tr>
          <tr v-if="!filled(table, kind).length">
            <td colspan="3" class="rx-empty">{{ $t("ereport.no_result_data") }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>
