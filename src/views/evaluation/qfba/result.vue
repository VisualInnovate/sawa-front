<script setup>
// One QFBA evaluation's result (/qfba-result/:id/:evaluation), drawn as the printed report draws it: the test row
// (date, age, evaluator, who answered, target behaviour), the severity chart, each function's endorsed questions and
// severity with the likely function and what it means, then every answer. Shown in the language the form was filled
// in; the switch redraws it in the other one (for viewing or printing).
import ApprovalBanner from "@/components/evaluations/ApprovalBanner.vue";
import EditAnswersButton from "@/components/evaluations/EditAnswersButton.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import DeleteEvaluationButton from "@/components/evaluation/DeleteEvaluationButton.vue";
import ResultSheet from "@/components/reports/ResultSheet.vue";
import QfbaChart from "@/components/reports/QfbaChart.vue";
import QfbaSummary from "@/components/reports/QfbaSummary.vue";
import { dmy } from "@/components/reports/reportUtils";
import { functionColor, functionName, optionLabel, qt, questionText } from "./qfba";

const route = useRoute();
const loading = ref(true);
const failed = ref(false);
const data = ref(null);
const lang = ref("ar");
const LANGUAGE_OPTIONS = [{ value: "ar", label: "العربية" }, { value: "en", label: "English" }];

const questions = computed(() => data.value?.questions ?? []);
const history = computed(() => data.value?.history ?? []);
const functionByKey = computed(() => Object.fromEntries((data.value?.scores ?? []).map((score) => [score.function_id, score])));
const tests = computed(() => (data.value ? [{ key: data.value.evaluation.id, date: data.value.evaluation.date, result: data.value }] : []));
const intro = computed(() => (data.value?.target_behavior
  ? qt(lang.value, "intro", { name: data.value.child?.name ?? "", behavior: data.value.target_behavior })
  : qt(lang.value, "intro_plain", { name: data.value?.child?.name ?? "" })));
const printPage = () => window.print();
const approval = ref(null);

async function load() {
  loading.value = true;
  failed.value = false;
  try {
    data.value = (await axios.get(`api/qfba-answers/result/${route.params.evaluation}`)).data;
    lang.value = data.value.language === "en" ? "en" : "ar";
  } catch {
    failed.value = true;
  } finally {
    loading.value = false;
  }
}

onMounted(load);
watch(() => route.params.evaluation, (value, before) => {
  if (value && value !== before && route.name === "qfba-result") load();
});
</script>

<template>
  <div class="qr-page">
    <Toast />
    <ApprovalBanner :evaluation-id="$route.params.evaluation" @loaded="approval = $event" />
    <div v-if="approval && approval.status !== 'approved'" class="flex justify-end mb-3 print:hidden">
      <EditAnswersButton :to="{ name: 'qfba-evaluation', params: { id: $route.params.id }, query: { edit: $route.params.evaluation } }" />
    </div>
    <div v-if="loading" class="qr-state"><ProgressSpinner style="width: 40px; height: 40px" /></div>
    <Message v-else-if="failed" severity="error" :closable="false">{{ $t("request_failed_retry") }}</Message>

    <template v-else>
      <header class="qr-head">
        <div>
          <h1>{{ qt(lang, "result_title") }}</h1>
          <p>
            <span v-if="data.child">{{ data.child.name }} · </span>
            <span class="ltr">{{ data.evaluation.date }}</span>
            <span v-if="data.evaluation.specialist"> · <i class="pi pi-user" aria-hidden="true" /> {{ data.evaluation.specialist }}</span>
          </p>
        </div>
        <div class="flex flex-wrap gap-2 items-center print:hidden">
          <SelectButton v-model="lang" :options="LANGUAGE_OPTIONS" optionLabel="label" optionValue="value" :allowEmpty="false"
            :aria-label="$t('qfba.language')" />
          <Button icon="pi pi-print" :label="$t('print_report')" severity="secondary" variant="outlined" @click="printPage" />
          <DeleteEvaluationButton :evaluation-id="data.evaluation.id" />
        </div>
      </header>

      <div class="rxs-pages">
        <ResultSheet label="QFBA" :date="data.evaluation.date" :band="qt(lang, 'result_title')" :intro="false">
          <div :dir="lang === 'en' ? 'ltr' : 'rtl'" class="qr-sheet">
            <p class="rx-intro">{{ intro }}</p>
            <table class="rx-table qr-info">
              <thead>
                <tr>
                  <th>{{ qt(lang, "test_date") }}</th>
                  <th>{{ qt(lang, "child_age") }}</th>
                  <th>{{ qt(lang, "tester") }}</th>
                  <th>{{ qt(lang, "interviewee") }}</th>
                  <th>{{ qt(lang, "target_behavior") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span class="ltr">{{ dmy(data.evaluation.date) }}</span></td>
                  <td>{{ data.child_age == null ? "" : qt(lang, "months", { n: data.child_age }) }}</td>
                  <td>{{ data.evaluation.specialist ?? "" }}</td>
                  <td>{{ data.interviewee ?? "" }}</td>
                  <td><b>{{ data.target_behavior ?? "" }}</b></td>
                </tr>
              </tbody>
            </table>
            <QfbaChart :tests="tests" :lang="lang" />
            <QfbaSummary :result="data" :lang="lang" />
          </div>
        </ResultSheet>

        <ResultSheet label="QFBA" :date="data.evaluation.date" :band="qt(lang, 'answers')" :intro="false">
          <div :dir="lang === 'en' ? 'ltr' : 'rtl'" class="qr-sheet">
            <table class="rx-table qr-answers">
              <thead>
                <tr>
                  <th class="rx-sum-num">#</th>
                  <th>{{ qt(lang, "question") }}</th>
                  <th>{{ qt(lang, "function") }}</th>
                  <th>{{ qt(lang, "response") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="question in questions" :key="question.id">
                  <td class="rx-sum-num">{{ question.number }}</td>
                  <td class="qr-q">{{ questionText(question, lang) }}</td>
                  <td class="qr-fn" :style="{ color: functionColor(functionByKey[question.function_id]?.key) }">
                    {{ functionName(functionByKey[question.function_id], lang) }}
                  </td>
                  <td :class="{ 'is-endorsed': question.value > 0 }">
                    <template v-if="question.value === null">{{ question.answered ? qt(lang, "na") : "" }}</template>
                    <template v-else><b class="ltr">{{ question.value }}</b> {{ optionLabel(question, lang) }}</template>
                  </td>
                </tr>
              </tbody>
            </table>
            <p class="qr-scale">
              <b>{{ qt(lang, "scale") }}:</b>
              <span v-for="option in data.options" :key="option.value"> <span class="ltr">{{ option.value }}</span> = {{ optionLabel(option, lang) }} ·</span>
              {{ qt(lang, "na") }}
            </p>
            <template v-if="data.notes">
              <h2 class="rx-band rx-band-soft rx-space">{{ qt(lang, "notes") }}</h2>
              <p class="qr-notes">{{ data.notes }}</p>
            </template>
          </div>
        </ResultSheet>
      </div>

      <section v-if="history.length > 1" class="qr-card print:hidden">
        <h2>{{ $t("qfba.history") }}</h2>
        <ul class="qr-history">
          <li v-for="row in history" :key="row.evaluation_id" :class="{ 'is-current': row.evaluation_id === data.evaluation.id }">
            <router-link :to="{ name: 'qfba-result', params: { id: route.params.id, evaluation: row.evaluation_id } }">
              <span class="ltr">{{ row.date }}</span>
              <span>{{ row.target_behavior }}</span>
            </router-link>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>

<style scoped>
.qr-page { display: grid; gap: 1rem; }
.qr-state { display: grid; place-items: center; padding: 3rem; }
.qr-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; }
.qr-head h1 { margin: 0; font-size: 1.4rem; font-weight: 800; color: var(--sawa-primary, rgb(var(--bp-135c65))); }
.qr-head p { margin: .25rem 0 0; color: var(--sawa-muted, #64748b); }
.qr-sheet { display: grid; gap: 5mm; text-align: start; }
.qr-sheet .rx-intro { margin: 0; }
.qr-info th, .qr-info td { text-align: center; }
.qr-answers { font-size: 9pt; line-height: 1.45; }
.qr-answers th, .qr-answers td { padding: 4px 6px; text-align: center; }
.qr-answers td.qr-q { text-align: start; }
.qr-answers td.qr-fn { font-size: 8pt; font-weight: 700; }
.qr-answers td.is-endorsed { background: #fef3c7; font-weight: 700; }
.qr-scale { margin: 0; color: #475569; font-size: 8.5pt; }
.qr-notes { margin: 0; white-space: pre-line; }
.qr-card { padding: 1.25rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 16px; background: #fff; }
.qr-card h2 { margin: 0 0 .75rem; font-size: 1.1rem; font-weight: 800; }
.qr-history { display: grid; gap: .4rem; margin: 0; padding: 0; list-style: none; }
.qr-history a { display: flex; align-items: center; gap: .75rem; padding: .45rem .75rem; border: 1px solid #e2e8f0; border-radius: 10px; color: inherit; text-decoration: none; }
.qr-history li.is-current a { border-color: var(--sawa-primary, rgb(var(--bp-135c65))); font-weight: 700; }
.ltr { direction: ltr; unicode-bidi: isolate; }
</style>
