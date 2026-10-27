<template>
  <div class="ba-page">
    <!-- The result's approval by the management (pending / approved / rejected with the reason). -->
    <Toast />
    <ApprovalBanner ref="approvalBanner" :child-id="$route.params.id" :type="3" @loaded="approval = $event" />
    <div class="flex flex-wrap justify-end gap-2 print:hidden">
      <!-- Before approval the answers can still be edited (pending or rejected). -->
      <BarrierAnswerEditor v-if="approval && approval.status !== 'approved'" :evaluation-id="approval.key.slice(1)" @saved="answersEdited" />
      <!-- Deletes the child's latest barriers evaluation (the table's); the chart then shows the others. -->
      <DeleteEvaluationButton v-if="answersTable.evaluation?.id" :evaluation-id="answersTable.evaluation.id" @deleted="reload" />
    </div>

    <!-- As in the printed report: the barriers chart (a column per test, the last four, oldest first) and the latest
         test's answers. -->
    <div class="rxs-pages">
      <ResultSheet :label="label" :date="answersTable.evaluation?.date ?? approval?.date" :child-name="approval?.child?.name">
        <BarrierChart v-if="tests.length" :tests="tests" />
        <p v-else class="rx-empty">{{ loading ? $t("loading") : $t("ereport.no_result_data") }}</p>

        <table v-if="answersTable.rows.length" class="rx-table rx-barrier-answers">
          <thead>
            <tr>
              <th>{{ $t("ereport.barrier_domain") }}</th>
              <th>{{ $t("ereport.barrier_answer") }}</th>
              <th class="rx-sum-num">{{ $t("ereport.barrier_answer_number") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in answersTable.rows" :key="row.subtest_id ?? row.number">
              <td><b>{{ row.subtest }}</b></td>
              <td>{{ row.answer }}</td>
              <td class="rx-sum-num">{{ row.score }}</td>
            </tr>
          </tbody>
        </table>
      </ResultSheet>
    </div>
  </div>
</template>

<script>
import ApprovalBanner from "@/components/evaluations/ApprovalBanner.vue";
import BarrierAnswerEditor from "@/components/barrier/BarrierAnswerEditor.vue";
import axios from "axios";
import DeleteEvaluationButton from "@/components/evaluation/DeleteEvaluationButton.vue";
import BarrierChart from "@/components/reports/BarrierChart.vue";
import ResultSheet from "@/components/reports/ResultSheet.vue";
import { BARRIER, MAX_PER_GROUP, typeLabel } from "@/components/reports/reportUtils";

export default {
  name: "BarrierResult",
  components: { ApprovalBanner, BarrierAnswerEditor, BarrierChart, DeleteEvaluationButton, ResultSheet },
  data() {
    return {
      // [{ subtest, questions: [{ score, color }] }]: each barrier's answers, one per test (oldest first).
      mainSquares: [],
      answersTable: { evaluation: null, rows: [] },
      approval: null,
      loading: true,
    };
  },
  computed: {
    label() {
      return typeLabel(BARRIER, this.$t);
    },
    // The chart's tests as the report gives them: [{ result: [{ subtest, score, color }] }], the last four.
    tests() {
      const count = Math.max(0, ...this.mainSquares.map((barrier) => barrier.questions?.length ?? 0));
      return Array.from({ length: count }, (_, n) => ({
        result: this.mainSquares.filter((barrier) => barrier.questions?.[n])
          .map((barrier) => ({ subtest: barrier.subtest, score: barrier.questions[n].score, color: barrier.questions[n].color })),
      })).slice(-MAX_PER_GROUP);
    },
  },
  methods: {
    // Edited answers: the result and the approval state are read again.
    answersEdited() {
      this.$refs.approvalBanner?.reload();
      this.reload();
    },
    reload() {
      this.loading = true;
      axios.get(`api/barrier-subtest/result/${this.$route.params.id}`)
        .then(({ data }) => { this.mainSquares = Array.isArray(data) ? data : []; })
        .catch(() => { this.mainSquares = []; })
        .finally(() => { this.loading = false; });
      // Without the endpoint (older server) the page shows the chart only.
      this.answersTable = { evaluation: null, rows: [] };
      axios.get(`api/barrier-subtest/latest-answers/${this.$route.params.id}`)
        .then(({ data }) => { this.answersTable = { evaluation: data?.evaluation ?? null, rows: data?.rows ?? [] }; })
        .catch(() => {});
    },
  },
  mounted() {
    this.reload();
  },
};
</script>

<style scoped>
.ba-page { display: grid; gap: 1rem; }
</style>
