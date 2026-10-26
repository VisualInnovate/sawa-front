<script setup>
// The results of the chosen evaluations drawn as the printed report draws them: one block per evaluation family,
// the newest tests of it side by side (VB-MAPP levels, barriers, ABLLS, Carolina, transition, M-CHAT, side
// profile). `report` is the answer of api/parent/child/{id}/portal/report.
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import MilestoneLevelChart from "@/components/reports/MilestoneLevelChart.vue";
import BarrierChart from "@/components/reports/BarrierChart.vue";
import AbllsChart from "@/components/reports/AbllsChart.vue";
import TransitionChart from "@/components/reports/TransitionChart.vue";
import SideProfileChart from "@/components/reports/SideProfileChart.vue";
import CarolinaGrid from "@/components/carolina/CarolinaGrid.vue";
import { ABLLS, ABLLS_SKILLS, BARRIER, CAROLINA, MAX_PER_GROUP, MCHAT, MILESTONE, SIDE_PROFILE, TRANSITION, groupItems, milestoneMarks, typeIcon } from "@/components/reports/reportUtils";
import { fmtDate } from "@/utils/parentPortal";

const props = defineProps({ report: { type: Object, required: true } });
const { t } = useI18n();

const byDate = (a, b) => String(a.date ?? "").localeCompare(String(b.date ?? "")) || a.id - b.id;

const sections = computed(() => groupItems(props.report.items ?? [], t).map((group) => {
  const tests = [...group.items].sort(byDate).slice(-MAX_PER_GROUP);
  return { ...group, tests, newest: tests[tests.length - 1] };
}));

// VB-MAPP: the chosen tests' levels drawn together, each test's marks in its own colour.
const mergedLevels = (tests) => {
  const levels = new Map();
  tests.forEach((test, index) => {
    for (const level of test.result?.levels ?? []) {
      if (!levels.has(level.level_id)) levels.set(level.level_id, { level_id: level.level_id, level_name: level.level_name, level_age: level.level_age, subtests: [] });
      const target = levels.get(level.level_id);
      for (const subtest of level.subtests ?? []) {
        let domain = target.subtests.find((item) => item.subtest_name === subtest.subtest_name);
        if (!domain) target.subtests.push((domain = { subtest_name: subtest.subtest_name, subtest_symbol: subtest.subtest_symbol, questions: [] }));
        (subtest.questions ?? []).forEach((question, q) => {
          domain.questions[q] ??= { question: question.question, marks: [] };
          domain.questions[q].marks.push(...milestoneMarks(question, index + 1));
        });
      }
    }
  });
  return [...levels.values()].sort((a, b) => (Number(a.level_age) || 0) - (Number(b.level_age) || 0) || Number(a.level_id) - Number(b.level_id));
};

const colorOf = (test) => `#${String(test.form?.colors?.[0] || "135c65").replace("#", "")}`;
const RISK = { low: ["success", "pp.risk_low"], medium: ["warn", "pp.risk_medium"], high: ["danger", "pp.risk_high"] };
const score = (test) => (test.form?.score === null || test.form?.score === undefined || !test.form?.boxes_total ? "" : `${Math.round(Number(test.form.score) * 10) / 10} / ${test.form.boxes_total}`);
</script>

<template>
  <div class="pp-stack">
    <section v-for="(section, i) in sections" :key="section.group" class="pp-card pp-card--pad pp-stack pp-in" :style="{ '--i': i }">
      <div class="pp-row pp-between">
        <h3 class="pp-h3"><i :class="typeIcon(section.type)" class="text-[var(--pp-teal)]" aria-hidden="true" /> {{ section.label }}</h3>
        <div class="pp-row">
          <span v-for="(test, n) in section.tests" :key="test.key" class="pp-tag" :style="{ background: colorOf(test) + '1f', color: colorOf(test) }">
            <span class="pp-dot" /> {{ $t("pp.test_n", { n: n + 1 }) }} · {{ fmtDate(test.date) }}<template v-if="score(test)"> · {{ score(test) }}</template>
          </span>
        </div>
      </div>

      <!-- VB-MAPP -->
      <template v-if="section.type === MILESTONE">
        <div class="pp-chart-scroll">
          <MilestoneLevelChart v-for="level in mergedLevels(section.tests)" :key="level.level_id" :level="level" :legend="section.tests.length > 1" />
        </div>
      </template>

      <!-- Barriers -->
      <div v-else-if="section.type === BARRIER" class="pp-chart-scroll"><BarrierChart :tests="section.tests" /></div>

      <!-- ABLLS -->
      <div v-else-if="section.type === ABLLS || section.type === ABLLS_SKILLS" class="pp-chart-scroll"><AbllsChart :tests="section.tests" /></div>

      <!-- Carolina -->
      <div v-else-if="section.type === CAROLINA" class="pp-chart-scroll"><CarolinaGrid :result="section.newest?.result" :per-table="4" compact /></div>

      <!-- Transition -->
      <div v-else-if="section.type === TRANSITION" class="pp-chart-scroll"><TransitionChart :tests="section.tests" /></div>

      <!-- M-CHAT-R -->
      <div v-else-if="section.type === MCHAT" class="pp-grid pp-grid--2">
        <div v-for="test in section.tests" :key="test.key" class="pp-soft p-4 pp-stack">
          <div class="pp-row pp-between">
            <b>{{ fmtDate(test.date) }}</b>
            <span class="pp-tag" :class="`pp-tag--${RISK[test.result?.risk]?.[0] ?? 'neutral'}`">{{ test.result?.total ?? "—" }}/20 · {{ RISK[test.result?.risk] ? $t(RISK[test.result.risk][1]) : test.result?.risk }}</span>
          </div>
          <p v-if="test.result?.recommendation" class="m-0 leading-7">{{ test.result.recommendation }}</p>
        </div>
      </div>

      <!-- Side profile -->
      <div v-else-if="section.type === SIDE_PROFILE" class="pp-chart-scroll"><SideProfileChart :tests="section.tests" /></div>

      <p v-else class="pp-muted m-0">{{ $t("pp.chart_unavailable") }}</p>
    </section>
  </div>
</template>

<style scoped>
.pp-chart-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 0.25rem;
}
.pp-chart-scroll > * {
  min-width: min(100%, 560px);
}
</style>
