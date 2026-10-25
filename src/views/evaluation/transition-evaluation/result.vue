<script setup>
// One Transition evaluation's results (/transition-result/:id/:evaluation): the scoring form (a box per question,
// columns = the child's last four Transition evaluations up to this one, oldest first) and this evaluation's answers.
import ApprovalBanner from "@/components/evaluations/ApprovalBanner.vue";
import TransitionAnswerEditor from "@/components/transition/TransitionAnswerEditor.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import TransitionGrid from "@/components/transition/TransitionGrid.vue";
import DeleteEvaluationButton from "@/components/evaluation/DeleteEvaluationButton.vue";

const route = useRoute();
const loading = ref(true);
const failed = ref(false);
const data = ref(null);

const questions = computed(() => data.value?.questions ?? []);
const columns = computed(() => data.value?.columns ?? []);
const answerText = (question) => question.answers?.find((answer) => answer.score === question.score)?.text ?? "";
const columnScore = (question, column) => columns.value[column]?.scores?.[question.id] ?? columns.value[column]?.scores?.[String(question.id)] ?? "";
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

      <section class="tr-card">
        <div class="tr-columns">
          <span v-for="(column, i) in columns" :key="column.evaluation_id" class="tr-column" :class="{ 'is-current': column.evaluation_id === data.evaluation.id }">
            <i :style="{ background: '#' + (column.color || '135c65') }" />
            <b>{{ i + 1 }}</b> {{ column.date }}
          </span>
        </div>
        <p class="tr-legend">{{ $t("transition.legend") }}</p>
        <TransitionGrid :questions="questions" :columns="columns" />
      </section>

      <section class="tr-card">
        <h2>{{ $t("transition.answers_table") }}</h2>
        <div class="tr-table-wrap">
          <table class="tr-table">
            <thead>
              <tr>
                <th rowspan="2">#</th>
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
                <td class="tr-num">{{ question.display_order }}</td>
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
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.tr-page { display: grid; gap: 1rem; }
.tr-state { display: grid; place-items: center; padding: 3rem; }
.tr-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; }
.tr-head h1 { margin: 0; font-size: 1.4rem; font-weight: 800; color: var(--sawa-primary, #135c65); }
.tr-head p { margin: .25rem 0 0; color: var(--sawa-muted, #64748b); }
.tr-card { padding: 1.25rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 16px; background: #fff; }
.tr-card h2 { margin: 0 0 1rem; font-size: 1.1rem; font-weight: 800; }
.tr-columns { display: flex; flex-wrap: wrap; gap: .5rem 1rem; direction: ltr; justify-content: flex-start; }
.tr-column { display: inline-flex; align-items: center; gap: .35rem; padding: .25rem .6rem; border: 1px solid #e2e8f0; border-radius: 999px; font-size: .85rem; }
.tr-column.is-current { border-color: var(--sawa-primary, #135c65); font-weight: 700; }
.tr-column i { width: 14px; height: 14px; border-radius: 4px; }
.tr-legend { margin: .75rem 0 1.25rem; color: var(--sawa-muted, #64748b); font-size: .85rem; }
.tr-table-wrap { overflow-x: auto; }
.tr-table { width: 100%; border-collapse: collapse; font-size: .9rem; }
.tr-table th, .tr-table td { border: 1px solid #cbd5e1; padding: .5rem .6rem; vertical-align: top; }
.tr-table th { background: #f1f5f9; font-weight: 800; text-align: center; }
.tr-num, .tr-score { text-align: center; font-weight: 800; }
.tr-score.is-current { background: #ecfeff; }
.tr-auto { margin-inline-start: .4rem; }
.tr-source { display: block; margin-top: .25rem; color: #64748b; }
@media print {
  .tr-card { border: 0; padding: 0; }
}
</style>
