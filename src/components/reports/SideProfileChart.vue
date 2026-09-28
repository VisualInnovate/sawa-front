<script setup>
// A side-profile dimension as on its results page: the bar chart of the delay percentage per test date
// (the page's default chart) and the results table below it.
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { dmy } from "./reportUtils";

const props = defineProps({
  // [{ date, result: { child_age, grow_age, diff_age, basal_age, late_percentage, description } }], oldest first
  tests: { type: Array, required: true },
});
const { t } = useI18n();

const percent = (value) => (value === null || value === undefined || value === "" ? null : Math.round(Number(value)));

const chartData = computed(() => ({
  labels: props.tests.map((test) => dmy(test.date)),
  datasets: [
    {
      label: t("ereport.side.late_percentage"),
      data: props.tests.map((test) => percent(test.result?.late_percentage) ?? 0),
      backgroundColor: "#42A5F5",
      borderColor: "#1565C0",
      borderWidth: 1,
      maxBarThickness: 70,
    },
  ],
}));

// No animation, so the chart is fully drawn when the page is printed.
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: { legend: { display: true, position: "top", labels: { color: "#495057", font: { weight: "600" } } } },
  scales: {
    x: { ticks: { color: "#6c757d" }, grid: { color: "#dfe7ef" }, title: { display: true, text: t("ereport.test_date"), color: "#495057", font: { weight: "bold" } } },
    y: {
      beginAtZero: true,
      suggestedMax: 100,
      ticks: { color: "#6c757d", callback: (value) => `${value}%` },
      grid: { color: "#dfe7ef" },
      title: { display: true, text: t("ereport.side.late_percentage"), color: "#495057", font: { weight: "bold" } },
    },
  },
};
</script>

<template>
  <div class="sp">
    <div class="sp-chart">
      <Chart type="bar" :data="chartData" :options="chartOptions" class="sp-canvas" />
    </div>

    <table class="sp-table">
      <thead>
        <tr>
          <th>#</th>
          <th>{{ $t("ereport.side.child_age") }}</th>
          <th>{{ $t("ereport.side.grow_age") }}</th>
          <th>{{ $t("ereport.side.diff_age") }}</th>
          <th>{{ $t("ereport.side.basal_age") }}</th>
          <th>{{ $t("ereport.side.late_percentage") }}</th>
          <th>{{ $t("ereport.test_date") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(test, i) in tests" :key="test.key">
          <td>{{ i + 1 }}</td>
          <td>{{ test.result?.child_age ?? "—" }}</td>
          <td>{{ test.result?.grow_age ?? "—" }}</td>
          <td>{{ test.result?.diff_age ?? "—" }}</td>
          <td>{{ test.result?.basal_age ?? "—" }}</td>
          <td><b>{{ percent(test.result?.late_percentage) ?? "—" }}<template v-if="percent(test.result?.late_percentage) !== null">%</template></b></td>
          <td><span class="ltr">{{ dmy(test.date) }}</span></td>
        </tr>
      </tbody>
    </table>

    <div v-for="test in tests.filter((item) => item.result?.description)" :key="'d' + test.key" class="sp-note">
      <strong>{{ $t("ereport.side.description") }} (<span class="ltr">{{ dmy(test.date) }}</span>)</strong>
      <p>{{ test.result.description }}</p>
    </div>
  </div>
</template>

<style scoped>
.sp {
  display: grid;
  gap: 6mm;
}
.sp-chart {
  position: relative;
  height: 72mm;
  padding: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  break-inside: avoid;
}
.sp-canvas {
  height: 100%;
  width: 100%;
}
.sp-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 9.5pt;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.sp-table th,
.sp-table td {
  padding: 5px 6px;
  border: 1px solid #cbd5e1;
  text-align: center;
}
.sp-table thead th {
  background: #f3f4f6;
  color: #374151;
  font-weight: 800;
}
.sp-note {
  padding: 8px 12px;
  border: 1px solid #d5e6e8;
  border-radius: 8px;
  font-size: 10pt;
}
.sp-note p {
  margin: 4px 0 0;
  white-space: pre-line;
}
</style>
