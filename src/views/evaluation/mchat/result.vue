<script setup>
// One M-CHAT-R evaluation's result (/mchat-result/:id/:evaluation): the risk points out of 20, the risk level with
// what to do next, the scale, every answer (risk points marked), and the child's other M-CHAT evaluations.
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import DeleteEvaluationButton from "@/components/evaluation/DeleteEvaluationButton.vue";
import { RISK_SEVERITY } from "./mchat";

const route = useRoute();
const loading = ref(true);
const failed = ref(false);
const data = ref(null);

const questions = computed(() => data.value?.questions ?? []);
const history = computed(() => data.value?.history ?? []);
const printPage = () => window.print();

async function load() {
  loading.value = true;
  failed.value = false;
  try {
    data.value = (await axios.get(`api/mchat-answers/result/${route.params.evaluation}`)).data;
  } catch {
    failed.value = true;
  } finally {
    loading.value = false;
  }
}

onMounted(load);
watch(() => route.params.evaluation, (value, before) => {
  if (value && value !== before && route.name === "mchat-result") load();
});
</script>

<template>
  <div class="mr-page">
    <div v-if="loading" class="mr-state"><ProgressSpinner style="width: 40px; height: 40px" /></div>
    <Message v-else-if="failed" severity="error" :closable="false">{{ $t("request_failed_retry") }}</Message>

    <template v-else>
      <header class="mr-head">
        <div>
          <h1>{{ $t("mchat.result_title") }}</h1>
          <p>
            <span v-if="data.child">{{ data.child.name }} · </span>
            <span class="ltr">{{ data.evaluation.date }}</span>
            <span v-if="data.child_age !== null"> · {{ $t("mchat.months", { n: data.child_age }) }}</span>
            <span v-if="data.evaluation.specialist"> · <i class="pi pi-user" aria-hidden="true" /> {{ data.evaluation.specialist }}</span>
            <span v-if="data.respondent"> · {{ $t("mchat.respondent") }}: {{ data.respondent }}</span>
          </p>
        </div>
        <div class="flex gap-2 print:hidden">
          <Button icon="pi pi-print" :label="$t('print_report')" severity="secondary" variant="outlined" @click="printPage" />
          <DeleteEvaluationButton :evaluation-id="data.evaluation.id" />
        </div>
      </header>

      <section class="mr-card mr-risk" :class="'is-' + data.risk">
        <div class="mr-score">
          <b>{{ data.total }}</b>
          <span>/ {{ questions.length }}</span>
        </div>
        <div class="mr-risk-text">
          <Tag :value="$t('mchat.risk_' + data.risk)" :severity="RISK_SEVERITY[data.risk]" />
          <p>{{ data.recommendation }}</p>
        </div>
      </section>

      <section class="mr-card">
        <h2>{{ $t("mchat.scale") }}</h2>
        <table class="mr-table">
          <thead>
            <tr>
              <th>{{ $t("mchat.total") }}</th>
              <th>{{ $t("mchat.meaning") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="level in data.levels" :key="level.key" :class="{ 'is-current': level.key === data.risk }">
              <td class="mr-range"><span class="ltr">{{ level.from }}–{{ level.to }}</span><br />{{ $t("mchat.risk_" + level.key) }}</td>
              <td>{{ level.recommendation }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="mr-card">
        <h2>{{ $t("mchat.answers") }}</h2>
        <p class="mr-hint">{{ $t("mchat.points_hint") }}</p>
        <table class="mr-table">
          <thead>
            <tr>
              <th class="mr-num">#</th>
              <th>{{ $t("mchat.question") }}</th>
              <th class="mr-answer">{{ $t("mchat.answer") }}</th>
              <th class="mr-answer">{{ $t("mchat.point") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="question in questions" :key="question.number" :class="{ 'is-risk': question.point === 1 }">
              <td class="mr-num">{{ question.number }}</td>
              <td>
                {{ question.text }}
                <small v-if="question.example">{{ question.example }}</small>
              </td>
              <td class="mr-answer">{{ question.yes === null ? "—" : question.yes ? $t("mchat.yes") : $t("mchat.no") }}</td>
              <td class="mr-answer">{{ question.point ?? "" }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section v-if="data.notes" class="mr-card">
        <h2>{{ $t("mchat.notes") }}</h2>
        <p class="mr-notes">{{ data.notes }}</p>
      </section>

      <section v-if="history.length > 1" class="mr-card print:hidden">
        <h2>{{ $t("mchat.history") }}</h2>
        <ul class="mr-history">
          <li v-for="row in history" :key="row.evaluation_id" :class="{ 'is-current': row.evaluation_id === data.evaluation.id }">
            <router-link :to="{ name: 'mchat-result', params: { id: route.params.id, evaluation: row.evaluation_id } }">
              <span class="ltr">{{ row.date }}</span>
              <b>{{ row.total }}</b>
              <Tag :value="$t('mchat.risk_' + row.risk)" :severity="RISK_SEVERITY[row.risk]" />
            </router-link>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>

<style scoped>
.mr-page { display: grid; gap: 1rem; }
.mr-state { display: grid; place-items: center; padding: 3rem; }
.mr-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; }
.mr-head h1 { margin: 0; font-size: 1.4rem; font-weight: 800; color: var(--sawa-primary, #135c65); }
.mr-head p { margin: .25rem 0 0; color: var(--sawa-muted, #64748b); }
.mr-card { padding: 1.25rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 16px; background: #fff; }
.mr-card h2 { margin: 0 0 .75rem; font-size: 1.1rem; font-weight: 800; }
.mr-risk { display: flex; flex-wrap: wrap; align-items: center; gap: 1.25rem; border-inline-start: 6px solid var(--tone); }
.mr-risk.is-low { --tone: #16a34a; }
.mr-risk.is-medium { --tone: #d97706; }
.mr-risk.is-high { --tone: #dc2626; }
.mr-score { display: flex; align-items: baseline; gap: .25rem; color: var(--tone); direction: ltr; }
.mr-score b { font-size: 3rem; font-weight: 800; line-height: 1; }
.mr-score span { font-size: 1.1rem; font-weight: 700; }
.mr-risk-text { flex: 1 1 18rem; }
.mr-risk-text p { margin: .5rem 0 0; line-height: 1.8; }
.mr-hint { margin: -.25rem 0 .75rem; color: var(--sawa-muted, #64748b); font-size: .88rem; }
.mr-table { width: 100%; border-collapse: collapse; font-size: .92rem; }
.mr-table th, .mr-table td { border: 1px solid #cbd5e1; padding: .5rem .6rem; vertical-align: top; }
.mr-table th { background: #f1f5f9; font-weight: 800; text-align: center; }
.mr-table td small { display: block; margin-top: .2rem; color: #64748b; }
.mr-table tr.is-current td { background: #fefce8; font-weight: 600; }
.mr-table tr.is-risk td { background: #fef2f2; }
.mr-num, .mr-answer { width: 4.5rem; text-align: center; font-weight: 800; }
.mr-range { width: 7rem; text-align: center; font-weight: 800; }
.mr-notes { margin: 0; white-space: pre-line; }
.mr-history { display: grid; gap: .4rem; margin: 0; padding: 0; list-style: none; }
.mr-history a { display: flex; align-items: center; gap: .75rem; padding: .45rem .75rem; border: 1px solid #e2e8f0; border-radius: 10px; color: inherit; text-decoration: none; }
.mr-history li.is-current a { border-color: var(--sawa-primary, #135c65); font-weight: 700; }
@media print {
  .mr-card { border: 0; padding: 0; break-inside: avoid; }
  .mr-table tr { break-inside: avoid; }
}
</style>
