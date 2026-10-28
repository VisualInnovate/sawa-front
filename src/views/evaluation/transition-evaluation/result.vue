<script setup>
// One Transition evaluation's results (/transition-result/:id/:evaluation), drawn as the printed report draws them:
// the chart (a grid per question, columns = the child's last four Transition evaluations up to this one, oldest
// first), what each answer means, and this evaluation's answers.
import ApprovalBanner from "@/components/evaluations/ApprovalBanner.vue";
import TransitionAnswerEditor from "@/components/transition/TransitionAnswerEditor.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import TransitionChart from "@/components/reports/TransitionChart.vue";
import ResultSheet from "@/components/reports/ResultSheet.vue";
import { TRANSITION, isFemale, typeLabel } from "@/components/reports/reportUtils";
import { useI18n } from "vue-i18n";
import DeleteEvaluationButton from "@/components/evaluation/DeleteEvaluationButton.vue";

const route = useRoute();
const { t } = useI18n();
const label = computed(() => typeLabel(TRANSITION, t));
const loading = ref(true);
const failed = ref(false);
const data = ref(null);

const questions = computed(() => data.value?.questions ?? []);
const columns = computed(() => data.value?.columns ?? []);
const answerText = (question) => question.answers?.find((answer) => answer.score === question.score)?.text ?? "";
const columnScore = (question, column) => columns.value[column]?.scores?.[question.id] ?? columns.value[column]?.scores?.[String(question.id)] ?? "";
// The chart's tests as the report gives them: [{ result: [{ id, title, display_order, score }], form: { colors } }].
const tests = computed(() => columns.value.map((column, i) => ({
  result: questions.value.map((question) => ({ id: question.id, title: question.title, display_order: question.display_order, score: columnScore(question, i) || 0 })),
  form: { colors: [column.color].filter(Boolean) },
})));
// The report's «تفسير النقاط»: "حصل في السؤال: الإجابة" for every answered question.
const points = computed(() => {
  const verb = isFemale(data.value?.child?.gender) ? "حصلت" : "حصل";
  return [...questions.value]
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0) || a.id - b.id)
    .filter((question) => answerText(question))
    .map((question) => `${verb} في ${question.title}: ${answerText(question)}`);
});
const fmt = (value) => String(Math.round(Number(value) * 10) / 10);
const printPage = () => window.print();
const approval = ref(null);
const approvalBanner = ref(null);
// Edited answers: the result and the approval state are read again.
function answersEdited() {
  approvalBanner.value?.reload();
  load();
}

async function load() {
  loading.value = true;
  failed.value = false;
  try {
    data.value = (await axios.get(`api/transition-answers/result/${route.params.evaluation}`)).data;
  } catch {
    failed.value = true;
  } finally {
    loading.value = false;
  }
}

onMounted(load);
watch(() => route.params.evaluation, (value, before) => {
  if (value && value !== before && route.name === "transition-result") load();
});
</script>

<template>
  <div class="tr-page">
    <!-- The result's approval by the management (pending / approved / rejected with the reason). -->
    <Toast />
    <ApprovalBanner ref="approvalBanner" :evaluation-id="$route.params.evaluation" @loaded="approval = $event" />
    <!-- Before approval the answers can still be edited (pending or rejected). -->
    <div v-if="approval && approval.status !== 'approved'" class="flex justify-end mb-3 print:hidden">
      <TransitionAnswerEditor :evaluation-id="$route.params.evaluation" @saved="answersEdited" />
    </div>
    <div v-if="loading" class="tr-state"><ProgressSpinner style="width: 40px; height: 40px" /></div>
    <Message v-else-if="failed" severity="error" :closable="false">{{ $t("request_failed_retry") }}</Message>

    <template v-else>
      <header class="tr-head">
        <div>
          <h1>{{ $t("transition.result_title") }}</h1>
          <p>
            <span v-if="data.child">{{ data.child.name }} · </span>
            <span>{{ $t("transition.result_meta", { date: data.evaluation.date }) }}</span>
            <span v-if="data.evaluation.specialist"> · <i class="pi pi-user" aria-hidden="true" /> {{ data.evaluation.specialist }}</span>
          </p>
        </div>
        <div class="flex gap-2 print:hidden">
          <Button icon="pi pi-print" :label="$t('print_report')" severity="secondary" variant="outlined" @click="printPage" />
          <DeleteEvaluationButton :evaluation-id="data.evaluation.id" />
        </div>
      </header>

      <div class="rxs-pages">
        <ResultSheet :label="label" :date="data.evaluation.date" :child-name="data.child?.name">
          <div class="tr-columns">
            <span v-for="(column, i) in columns" :key="column.evaluation_id" class="tr-column" :class="{ 'is-current': column.evaluation_id === data.evaluation.id }">
              <i :style="{ background: '#' + (column.color || '135c65') }" />
              <b>{{ i + 1 }}</b> <span class="ltr">{{ column.date }}</span>
            </span>
          </div>
          <TransitionChart :tests="tests" />
        </ResultSheet>

        <ResultSheet v-if="points.length" :label="label" :date="data.evaluation.date" :band="$t('ereport.transition_points')" :intro="false">
          <ul class="rx-plan-points tr-points">
            <li v-for="(point, p) in points" :key="p">{{ point }}</li>
          </ul>
        </ResultSheet>

        <ResultSheet :label="label" :date="data.evaluation.date" :band="$t('transition.answers_table')" :intro="false">
          <table class="rx-table rx-summary">
            <thead>
              <tr>
                <th rowspan="2" class="rx-sum-num">#</th>
                <th rowspan="2">{{ $t("transition.question_title") }}</th>
                <th rowspan="2">{{ $t("transition.answers") }}</th>
                <th :colspan="4">{{ $t("transition.history") }}</th>
              </tr>
              <tr>
                <th v-for="column in 4" :key="column">{{ $t("transition.col_" + column) }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="question in questions" :key="question.id">
                <td class="rx-sum-num">{{ question.display_order }}</td>
                <td>
                  <b>{{ question.title }}</b>
                  <Tag v-if="question.is_auto" class="tr-auto" icon="pi pi-lock" severity="secondary" :value="$t('transition.auto')" />
                  <small v-if="question.source" class="tr-source">{{ $t(question.source.type === 'barrier' ? 'transition.auto_value_barrier' : 'transition.auto_value_milestone', { value: fmt(question.source.value) }) }}</small>
                </td>
                <td>{{ answerText(question) }}</td>
                <td v-for="column in 4" :key="column" class="tr-score" :class="{ 'is-current': columns[column - 1]?.evaluation_id === data.evaluation.id }">{{ columnScore(question, column - 1) }}</td>
              </tr>
            </tbody>
          </table>
        </ResultSheet>
      </div>
    </template>
  </div>
</template>

<style scoped>
.tr-page { display: grid; gap: 1rem; }
.tr-state { display: grid; place-items: center; padding: 3rem; }
.tr-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; }
.tr-head h1 { margin: 0; font-size: 1.4rem; font-weight: 800; color: var(--sawa-primary, rgb(var(--bp-135c65))); }
.tr-head p { margin: .25rem 0 0; color: var(--sawa-muted, #64748b); }
/* Which test each chart column is (the report's test table gives it there). */
.tr-columns { display: flex; flex-wrap: wrap; gap: .4rem .8rem; margin-bottom: 5mm; font-size: 9pt; }
.tr-column { display: inline-flex; align-items: center; gap: .35rem; padding: .15rem .55rem; border: 1px solid #e2e8f0; border-radius: 999px; }
.tr-column.is-current { border-color: rgb(var(--bp-135c65)); font-weight: 700; }
.tr-column i { width: 12px; height: 12px; border-radius: 3px; }
.tr-points li { line-height: 1.8; }
.tr-score { text-align: center !important; font-weight: 800; }
.tr-score.is-current { background: rgb(var(--bp-ecfeff)); }
.tr-auto { margin-inline-start: .4rem; }
.tr-source { display: block; margin-top: .25rem; color: #64748b; }
</style>
