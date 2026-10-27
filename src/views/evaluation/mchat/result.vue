<script setup>
// One M-CHAT-R evaluation's result (/mchat-result/:id/:evaluation), drawn as the printed report draws it: the risk points out
// of its questions with the risk level and what to do next, every answer (risk points marked), then the scale, the notes
// and the child's other M-CHAT evaluations.
import ApprovalBanner from "@/components/evaluations/ApprovalBanner.vue";
import MchatAnswerEditor from "@/components/mchat/MchatAnswerEditor.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import DeleteEvaluationButton from "@/components/evaluation/DeleteEvaluationButton.vue";
import ResultSheet from "@/components/reports/ResultSheet.vue";
import { MCHAT, dmy, typeLabel } from "@/components/reports/reportUtils";
import { useI18n } from "vue-i18n";
import { RISK_SEVERITY, levelRange } from "./mchat";

const route = useRoute();
const { t } = useI18n();
const label = computed(() => typeLabel(MCHAT, t));
const loading = ref(true);
const failed = ref(false);
const data = ref(null);

const questions = computed(() => data.value?.questions ?? []);
const history = computed(() => data.value?.history ?? []);
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
    <!-- The result's approval by the management (pending / approved / rejected with the reason). -->
    <Toast />
    <ApprovalBanner ref="approvalBanner" :evaluation-id="$route.params.evaluation" @loaded="approval = $event" />
    <!-- Before approval the answers can still be edited (pending or rejected). -->
    <div v-if="approval && approval.status !== 'approved'" class="flex justify-end mb-3 print:hidden">
      <MchatAnswerEditor :evaluation-id="$route.params.evaluation" @saved="answersEdited" />
    </div>
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

      <div class="rxs-pages">
        <ResultSheet :label="label" :date="data.evaluation.date" :child-name="data.child?.name">
          <table class="rx-table rx-mchat">
            <thead>
              <tr>
                <th class="rx-sum-num">{{ $t("ereport.number") }}</th>
                <th>{{ $t("mchat.test_date") }}</th>
                <th>{{ $t("mchat.child_age") }}</th>
                <th>{{ $t("mchat.tester") }}</th>
                <th>{{ $t("mchat.total") }}</th>
                <th>{{ $t("mchat.risk") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="rx-sum-num">1</td>
                <td><span class="ltr">{{ dmy(data.evaluation.date) }}</span></td>
                <td>{{ data.child_age == null ? "" : $t("mchat.months", { n: data.child_age }) }}</td>
                <td>{{ data.evaluation.specialist ?? "" }}</td>
                <td><b class="ltr">{{ data.total }} / {{ questions.length }}</b></td>
                <td><span v-if="data.risk" class="rx-mchat-risk" :class="'is-' + data.risk">{{ $t("mchat.risk_" + data.risk) }}</span></td>
              </tr>
            </tbody>
          </table>
          <div v-if="data.risk" class="rx-mchat-meaning" :class="'is-' + data.risk">
            <h3>{{ $t("mchat.risk_" + data.risk) }} — <span class="ltr">{{ data.total }} / {{ questions.length }}</span></h3>
            <p>{{ data.recommendation }}</p>
          </div>
        </ResultSheet>

        <ResultSheet :label="label" :date="data.evaluation.date" :band="$t('mchat.answers')" :intro="false">
          <table class="rx-table rx-mchat rx-mchat-answers">
            <thead>
              <tr>
                <th class="rx-sum-num">#</th>
                <th>{{ $t("mchat.question") }}</th>
                <th class="rx-mchat-col"><span class="ltr">{{ dmy(data.evaluation.date) }}</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="question in questions" :key="question.id">
                <td class="rx-sum-num">{{ question.number }}<span v-if="question.yes_is_risk" class="mr-star" v-tooltip.top="$t('mchat.yes_is_risk')">★</span></td>
                <td>
                  {{ question.text }}
                  <small v-if="question.example" class="mr-example">{{ question.example }}</small>
                </td>
                <td class="rx-mchat-col" :class="{ 'is-point': question.point === 1 }">
                  {{ question.yes == null ? "" : question.yes ? $t("mchat.yes") : $t("mchat.no") }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th colspan="2">{{ $t("mchat.total") }}</th>
                <th class="rx-mchat-col">{{ data.total }}</th>
              </tr>
            </tfoot>
          </table>
          <p class="rx-mchat-hint">{{ $t("mchat.points_hint") }}</p>
        </ResultSheet>

        <!-- Not in the report: the scale and the evaluator's notes. -->
        <ResultSheet :label="label" :date="data.evaluation.date" :band="$t('mchat.scale')" :intro="false">
          <table class="rx-table rx-summary">
            <thead>
              <tr>
                <th>{{ $t("mchat.total") }}</th>
                <th>{{ $t("mchat.meaning") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="level in data.levels" :key="level.key" :class="{ 'is-current': level.key === data.risk }">
                <td class="mr-range"><span class="ltr">{{ levelRange(level) }}</span><br />{{ $t("mchat.risk_" + level.key) }}</td>
                <td>{{ level.recommendation }}</td>
              </tr>
            </tbody>
          </table>
          <template v-if="data.notes">
            <h2 class="rx-band rx-band-soft rx-space">{{ $t("mchat.notes") }}</h2>
            <p class="mr-notes">{{ data.notes }}</p>
          </template>
        </ResultSheet>
      </div>

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
.mr-example { display: block; margin-top: .2rem; color: #64748b; }
.mr-star { margin-inline-start: .15rem; color: #d97706; }
.mr-range { width: 7rem; text-align: center !important; font-weight: 800; }
tr.is-current td { background: #fefce8; font-weight: 600; }
.mr-notes { margin: 0; white-space: pre-line; }
.mr-history { display: grid; gap: .4rem; margin: 0; padding: 0; list-style: none; }
.mr-history a { display: flex; align-items: center; gap: .75rem; padding: .45rem .75rem; border: 1px solid #e2e8f0; border-radius: 10px; color: inherit; text-decoration: none; }
.mr-history li.is-current a { border-color: var(--sawa-primary, #135c65); font-weight: 700; }
</style>
