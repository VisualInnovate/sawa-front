<template>
  <div class="p-6 bg-gray-50 min-h-screen container mx-auto print:p-0 print:w-full print:max-w-full print:mx-0">
    <!-- The result's approval by the management (pending / approved / rejected with the reason). -->
    <Toast />
    <ApprovalBanner ref="approvalBanner" :evaluation-id="$route.params.evla_id" @loaded="approval = $event" />
    <!-- Before approval the answers can still be edited (pending or rejected). -->
    <div v-if="approval && approval.status !== 'approved'" class="flex justify-end mb-3 print:hidden">
      <MilestoneAnswerEditor :evaluation-id="$route.params.evla_id" @saved="answersEdited" />
    </div>
    <!-- Header with Print Button -->
    <div class="flex justify-between items-center mb-8 print:hidden">
      <h1 class="text-3xl font-bold text-gray-800">{{ $t("evaluation_report") }}</h1>
      <div class="flex items-center gap-2">
        <button
          @click="printReport"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
          </svg>
          {{ $t("print_report") }}
        </button>
        <DeleteEvaluationButton v-if="$route.params.evla_id" :evaluation-id="$route.params.evla_id" />
      </div>
    </div>

    <!-- Not every level of the evaluation is done yet: the missing ones can be completed later. -->
    <div v-if="missingLevels.length" class="incomplete-note print:hidden">
      <span><i class="pi pi-hourglass" aria-hidden="true"></i> {{ $t("milestone_incomplete_result", { levels: missingLevels.map(level => level.title).join("، ") }) }}</span>
      <Button v-can="'milestone answer create'" icon="pi pi-play" :label="$t('milestone_continue')" severity="warn" @click="continueEvaluation" />
    </div>

    <!-- As in the printed report: the VB-MAPP form page (the levels' charts, the highest level first), then a page of
         strengths and weaknesses per level (with this result's plan goals). -->
    <div class="rxs-pages">
      <ResultSheet label="VB-MAPP" :date="approval?.date" :child-name="approval?.child?.name" kicker>
        <div class="vb-levels">
          <MilestoneLevelChart v-for="level in mainSquares" :key="level.level_id" :level="chartLevel(level)" :legend="false" />
          <p v-if="!mainSquares.length" class="rx-empty">{{ loading ? $t("loading") : loadError ? $t("request_failed_retry") : $t("ereport.no_result_data") }}</p>
        </div>
      </ResultSheet>

      <ResultSheet v-for="table in summaryTables.length ? summaryTables : [null]" :key="'summary-' + (table?.key ?? 'none')"
        label="VB-MAPP" :date="approval?.date" :band="false" :intro="false">
        <ResultSummaryTables v-if="table" :table="table" :kinds="['strengths', 'weaknesses', 'plan']" />
        <p v-else class="rx-empty">{{ loading ? $t("loading") : loadError ? $t("request_failed_retry") : $t("ereport.no_result_data") }}</p>
      </ResultSheet>
    </div>

    <!-- The EESA filled in each level, as the form (read only); the report leaves it out. -->
    <div v-for="item in eesa.results" :key="'eesa-' + item.level_id" class="mt-8 bg-white rounded-xl shadow-md overflow-hidden print:shadow-none print:border">
      <h2 class="level-eesa-title">{{ eesa.domain?.title }}<template v-if="item.level_title"> — {{ item.level_title }}</template></h2>
      <div class="p-4 print:p-2">
        <EesaForm :modelValue="eesaBoxes(item)" :previous="item.previous" :number="item.result.assessment_number" readonly />
      </div>
    </div>
  </div>
</template>

<script>
import ApprovalBanner from "@/components/evaluations/ApprovalBanner.vue";
import MilestoneAnswerEditor from "@/components/milestone/MilestoneAnswerEditor.vue";
import axios from "axios";
import EesaForm from "../../../components/milestone/EesaForm.vue";
import DeleteEvaluationButton from "../../../components/evaluation/DeleteEvaluationButton.vue";
import MilestoneLevelChart from "../../../components/reports/MilestoneLevelChart.vue";
import ResultSheet from "../../../components/reports/ResultSheet.vue";
import ResultSummaryTables from "../../../components/reports/ResultSummaryTables.vue";
import { milestoneMarks } from "../../../components/reports/reportUtils";

export default {
  name: 'SquareGrid',
  components: { ApprovalBanner, MilestoneAnswerEditor, EesaForm, MilestoneLevelChart, DeleteEvaluationButton, ResultSheet, ResultSummaryTables },
  data() {
    return {
      approval: null,
      // { domain, result: { assessment_number, scores, ... } | null, previous }
      // results: [{ level_id, level_title, result: { assessment_number, scores, ... }, previous }]
      eesa: { domain: null, results: [] },
      mainSquares: [],
      table_resulte: [],
      // Level by level: done or still missing (api/milestone-answers/progress).
      progress: null,
      loading: true,
      loadError: false,
    };
  },
  computed: {
    missingLevels() {
      const missing = (this.progress?.missing_level_ids ?? []).map(String);
      return (this.progress?.levels ?? []).filter((level) => missing.includes(String(level.level_id)));
    },
    // The report's strengths/weaknesses pages: one per level (lowest first), a row per target symbol.
    summaryTables() {
      const names = new Map(this.mainSquares.map((level) => [String(level.level_id), level.level_name]));
      const levels = new Map();
      for (const goal of this.table_resulte) {
        const key = String(goal.level_id ?? "");
        if (!levels.has(key)) levels.set(key, new Map());
        const rows = levels.get(key);
        const symbol = goal.symbol || goal.general_goal || "";
        if (!rows.has(symbol)) rows.set(symbol, { symbol: goal.symbol ?? "", strengths: [], weaknesses: [], plan: [] });
        const row = rows.get(symbol);
        for (const [kind, source] of [["strengths", "strength"], ["weaknesses", "weak"], ["plan", "plan_goals"]]) {
          row[kind].push(...(goal[source] ?? []).map((point) => point.question).filter(Boolean));
        }
      }
      return [...levels.entries()].sort(([a], [b]) => Number(a) - Number(b))
        .map(([key, rows]) => ({ key, title: names.get(key) ?? "", rows: [...rows.values()] }));
    },
  },
  methods: {
    // Edited answers: the result and the approval state are read again.
    answersEdited() {
      this.$refs.approvalBanner?.reload();
      this.getresulte();
    },
    // The saved scores in the boxes: "1" or "0.5"; blank boxes scored 0.
    eesaBoxes(item) {
      return Object.fromEntries(Object.entries(item?.result?.scores ?? {}).map(([key, value]) => [key, String(value)]));
    },
    // This evaluation is the chart's only test: each answer is its single mark.
    chartLevel(level) {
      return {
        ...level,
        subtests: (level?.subtests || []).map((subtest) => ({
          ...subtest,
          questions: (subtest.questions || []).map((question) => ({
            question: question.question,
            marks: milestoneMarks(question, 1),
          })),
        })),
      };
    },
    continueEvaluation() {
      this.$router.push({ name: "milestone-evaluation", params: { id: this.$route.params.id }, query: { evaluation: this.$route.params.evla_id } });
    },
    async getresulte() {
      this.loading = true;
      this.loadError = false;

      const [levelsResult, reportResult, eesaResult] = await Promise.allSettled([
        axios.get(`api/mileston-levels/flow-chart/${this.$route.params.evla_id}`),
        axios.get(`api/evaluations/report/${this.$route.params.evla_id}`),
        axios.get(`api/milestone-answers/eesa/result/${this.$route.params.evla_id}`),
      ]);
      // Without the endpoint (older server) the page shows the results as before.
      axios.get(`api/milestone-answers/progress/${this.$route.params.evla_id}`)
        .then(({ data }) => { this.progress = data; })
        .catch(() => {});

      // An evaluation without the EESA (or an older server) simply shows no form.
      if (eesaResult.status === "fulfilled") {
        const { domain, results, result, previous } = eesaResult.value.data ?? {};
        this.eesa = {
          domain,
          results: Array.isArray(results) ? results : result ? [{ level_id: null, result, previous: previous ?? [] }] : [],
        };
      }

      if (levelsResult.status === "fulfilled") {
        // As on the VB-MAPP form: the highest level first (3, 2, 1).
        this.mainSquares = [...(levelsResult.value.data?.data || [])]
          .sort((a, b) => (Number(b.level_age) || 0) - (Number(a.level_age) || 0));
      } else {
        this.mainSquares = [];
        this.loadError = true;
        console.error("Error retrieving data:", levelsResult.reason);
      }

      if (reportResult.status === "fulfilled") {
        this.table_resulte = Array.isArray(reportResult.value.data) ? reportResult.value.data : [];
      } else {
        this.table_resulte = [];
        this.loadError = true;
        console.error("Error retrieving evaluation data:", reportResult.reason);
      }

      this.loading = false;
    },
    printReport() {
      // Add print-specific styles
      const style = document.createElement('style');
      style.innerHTML = `
        @page {
          size: auto;
          margin: 10mm;
        }
        body {
          padding: 0 !important;
          margin: 0 !important;
          background: white !important;
        }
        .sidebar {
          display: none !important;
        }
        .container {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .pageNumber:after {
          content: counter(page);
        }
        .print\\:break-inside-avoid {
          break-inside: avoid;
        }
      `;
      document.head.appendChild(style);
      
      window.print();
      
      // Clean up after printing
      setTimeout(() => {
        document.head.removeChild(style);
      }, 1000);
    }
  },
  mounted() {
    this.getresulte();
  },
};
</script>

<style>
.incomplete-note { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: .75rem; margin-bottom: 1.5rem; padding: .85rem 1rem; border: 1px solid #fcd34d; border-radius: 12px; background: #fffbeb; color: #92400e; font-weight: 600; }
.incomplete-note .pi { margin-inline-end: .35rem; }

.level-eesa-title {
  margin: 0;
  padding: 0.85rem 1.25rem;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 1.15rem;
  font-weight: 700;
}

@media print {
  .sidebar, .navigation, .no-print {
    display: none !important;
  }
}
</style>
