<script setup>
// ABLLS as on its results page: a card per category, a row of boxes per mission (one box per degree).
// With several tests, each box takes the color of the first (oldest) test that reached it, so later
// tests show as the new boxes they added.
import { computed } from "vue";

const props = defineProps({
  // [{ result: [{ category, missions: [{ mission_key, mission_degree, answer_score, answer_color }] }] }], oldest first
  tests: { type: Array, required: true },
});

const categories = computed(() => (props.tests[0]?.result ?? []).filter((category) => category.missions?.length));

const boxes = (mission) => Number(mission.mission_max) || Math.max(0, String(mission.mission_degree ?? "").length - 1);

const boxColor = (categoryIndex, missionIndex, box) => {
  for (const test of props.tests) {
    const mission = test.result?.[categoryIndex]?.missions?.[missionIndex];
    if (mission?.answer_color && Number(mission.answer_score) >= box) return `#${mission.answer_color}`;
  }
  return "#f8fafc";
};
</script>

<template>
  <div class="ac">
    <section v-for="(category, c) in categories" :key="c" class="ac-card">
      <h5>{{ category.category }}</h5>
      <div class="ac-body">
        <div v-for="(mission, m) in category.missions" :key="mission.mission_key" class="ac-row">
          <span class="ac-key">{{ mission.mission_key }}</span>
          <span class="ac-boxes">
            <i v-for="box in boxes(mission)" :key="box" :style="{ background: boxColor(c, m, box) }" />
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.ac {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 5mm;
}
.ac-card {
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12);
  break-inside: avoid;
  page-break-inside: avoid;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.ac-card h5 {
  margin: 0;
  padding: 6px 8px;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  color: #fff;
  font-size: 9pt;
  font-weight: 700;
  text-align: center;
}
.ac-body {
  display: grid;
  gap: 5px;
  padding: 8px;
}
.ac-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.ac-key {
  min-width: 34px;
  color: #374151;
  font-size: 8.5pt;
  font-weight: 600;
  direction: ltr;
}
.ac-boxes {
  display: flex;
  overflow: hidden;
  border-radius: 4px;
  direction: ltr;
}
.ac-boxes i {
  width: 22px;
  height: 18px;
  border: 1px solid #e2e8f0;
}
</style>
