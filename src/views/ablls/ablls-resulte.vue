<template>
  <div class="ab-page">
    <!-- The result's approval by the management (pending / approved / rejected with the reason). -->
    <Toast />
    <ApprovalBanner ref="approvalBanner" :evaluation-id="$route.params.id" @loaded="approval = $event" />
    <div class="flex justify-end gap-2 print:hidden">
      <!-- Before approval the answers can still be edited (pending or rejected). -->
      <AbleAnswerEditor v-if="approval && approval.status !== 'approved'" :evaluation-id="$route.params.id"
        :api="assessmentOf($route).api" @saved="answersEdited" />
      <DeleteEvaluationButton :evaluation-id="$route.params.id" />
    </div>
    <!-- As in the printed report: a card per category, a row of boxes per mission. -->
    <div class="rxs-pages">
      <ResultSheet :label="label" :date="approval?.date" :child-name="approval?.child?.name">
        <AbllsChart v-if="mainSquares.length" :tests="[{ result: mainSquares }]" />
        <p v-else class="rx-empty">{{ loading ? $t("loading") : $t("ereport.no_result_data") }}</p>
      </ResultSheet>
    </div>
  </div>
</template>

<script>
import ApprovalBanner from "@/components/evaluations/ApprovalBanner.vue";
import axios from "axios";
import { apiOf, assessmentOf } from "@/components/ablls/assessment";
import DeleteEvaluationButton from "@/components/evaluation/DeleteEvaluationButton.vue";
import AbleAnswerEditor from "@/components/ablls/AbleAnswerEditor.vue";
import AbllsChart from "@/components/reports/AbllsChart.vue";
import ResultSheet from "@/components/reports/ResultSheet.vue";
import { ABLLS, ABLLS_SKILLS, typeLabel } from "@/components/reports/reportUtils";
export default {
  name: 'SquareGrid',
  components: { ApprovalBanner, AbleAnswerEditor, AbllsChart, DeleteEvaluationButton, ResultSheet },
  data() {
    return {
      mainSquares: [],
      approval: null,
      loading: true,
    };
  },
  computed: {
    label() {
      return typeLabel(assessmentOf(this.$route).evaluationType === 7 ? ABLLS_SKILLS : ABLLS, this.$t);
    },
  },
  methods: {
    assessmentOf,
    // Edited answers: the result and the approval state are read again.
    answersEdited() {
      this.$refs.approvalBanner?.reload();
      this.getresulte();
    },
    async getresulte() {
      try {
        // allSettled: a failing report request must not hide the flow chart.
        const [response1, response2] = await Promise.allSettled([
          axios.get(`${apiOf(assessmentOf(this.$route), "category")}/flow-chart/${this.$route.params.id}`),
          axios.get(`api/evaluations/report/${this.$route.params.id}`)
        ]);

        this.mainSquares =
          (response1.status === "fulfilled" && response1.value.data?.data) ||
          (response2.status === "fulfilled" && response2.value.data?.data) ||
          [];
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    }
  },
  beforeMount() {
    setTimeout(() => {
      this.getresulte();
    }, 500);
  },
  mounted() {
    setTimeout(() => {
      this.getresulte();
    }, 500);
  }
};
</script>

<style scoped>
.ab-page { display: grid; gap: 1rem; }
</style>
