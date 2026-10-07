<script setup>
// Every chosen side-profile result in one table, as the centre's printed "Side Profile" sheet: a row per result
// (each dimension, each chosen date), then the delay percentage of all of them in one bar chart.
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { dmy } from "./reportUtils";

const props = defineProps({
  // [{ key, id, title (dimension), date, result: { child_age, grow_age, diff_age, late_percentage, created_at } }]
  tests: { type: Array, required: true },
});
const { t } = useI18n();

const percent = (value) => (value === null || value === undefined || value === "" ? null : Math.round(Number(value)));
const when = (test) => String(test.result?.created_at ?? test.date ?? "").replace("T", " ").slice(0, 19);

const chartData = computed(() => ({
  labels: props.tests.map((test) => `${test.title} (${dmy(test.date)})`),
  datasets: [{
    label: t("ereport.side.late_percentage"),
    data: props.tests.map((test) => percent(test.result?.late_percentage) ?? 0),
    backgroundColor: "#42A5F5",
    borderColor: "#1565C0",
    borderWidth: 1,
    maxBarThickness: 60,
  }],
}));

// No animation, so the chart is fully drawn when the page is printed.
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: { legend: { display: true, position: "top" } },
  scales: {
    x: { ticks: { color: "#475569", font: { size: 10 } } },
    y: { beginAtZero: true, suggestedMax: 100, ticks: { callback: (value) => `${value}%` } },
  },
};
</script>

<template>
  <div class="spt">
    <table class="spt-table">
      <thead>
        <tr>
          <th>id</th>
          <th>{{ $t("ereport.side.sub_name") }}</th>
          <th>{{ $t("ereport.side.main_name") }}</th>
          <th>{{ $t("ereport.side.child_age") }}</th>
          <th>{{ $t("ereport.side.diff_age") }}</th>
          <th>{{ $t("ereport.side.grow_age") }}</th>
          <th>{{ $t("ereport.side.late_percentage") }}</th>
          <th>{{ $t("ereport.test_date") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="test in tests" :key="test.key">
          <td>{{ test.id }}</td>
          <td>{{ test.title }}</td>
          <td class="ltr">Side Profile</td>
          <td>{{ test.result?.child_age ?? "—" }}</td>
          <td>{{ test.result?.diff_age ?? "—" }}</td>
          <td>{{ test.result?.grow_age ?? "—" }}</td>
          <td><span class="ltr">% {{ percent(test.result?.late_percentage) ?? "—" }}</span></td>
          <td><span class="ltr">{{ when(test) }}</span></td>
        </tr>
      </tbody>
    </table>

    <div class="spt-chart">
      <Chart type="bar" :data="chartData" :options="chartOptions" class="spt-canvas" />
    </div>
  </div>
</template>

<style scoped>
.spt { display: grid; gap: 8mm; }
.spt-table { width: 100%; border-collapse: collapse; border: 2px solid #475569; font-size: 10pt; }
.spt-table th, .spt-table td { padding: 8px 6px; border-bottom: 1px solid #cbd5e1; text-align: center; vertical-align: middle; }
.spt-table th { color: #475569; font-weight: 700; }
.spt-chart { position: relative; height: 75mm; padding: 8px; border: 1px solid #e5e7eb; border-radius: 10px; break-inside: avoid; }
.spt-canvas { height: 100%; width: 100%; }
.ltr { direction: ltr; unicode-bidi: isolate; }
</style>
