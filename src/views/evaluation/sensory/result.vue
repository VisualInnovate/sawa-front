<script setup>
// One Sensory Profile's result (/sensory-result/:id/:evaluation), drawn as the printed report draws it: the test row
// (date, age, form, evaluator, who answered), the quadrants' grid (the scoring sheet: the child's score in the band of
// its age) with what each one means, then the sections' grid, the factors' grid (3–10 years form), and every answer.
import ApprovalBanner from "@/components/evaluations/ApprovalBanner.vue";
import EditAnswersButton from "@/components/evaluations/EditAnswersButton.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import axios from "axios";
import DeleteEvaluationButton from "@/components/evaluation/DeleteEvaluationButton.vue";
import ResultSheet from "@/components/reports/ResultSheet.vue";
import SensoryGrid from "@/components/reports/SensoryGrid.vue";
import SensorySummary from "@/components/reports/SensorySummary.vue";
import SensoryAnswers from "@/components/reports/SensoryAnswers.vue";
import { dmy } from "@/components/reports/reportUtils";
import { ageText, formName, levelLabel, scoresOf } from "./sensory";

const { locale } = useI18n();
const route = useRoute();
const lang = computed(() => (locale.value === "en" ? "en" : "ar"));
const loading = ref(true);
const failed = ref(false);
const data = ref(null);
const approval = ref(null);

const history = computed(() => data.value?.history ?? []);
const levelKeys = computed(() => data.value?.form?.level_keys ?? []);
const quadrants = computed(() => scoresOf(data.value, "quadrant", "threshold"));
const sections = computed(() => scoresOf(data.value, "section"));
const factors = computed(() => scoresOf(data.value, "factor"));
const printPage = () => window.print();

async function load() {
  loading.value = true;
  failed.value = false;
  try {
    data.value = (await axios.get(`api/sensory-profile-answers/result/${route.params.evaluation}`)).data;
  } catch {
    failed.value = true;
  } finally {
    loading.value = false;
  }
}

onMounted(load);
watch(() => route.params.evaluation, (value, before) => {
  if (value && value !== before && route.name === "sensory-result") load();
});
</script>

<template>
  <div class="sr-page">
    <Toast />
    <ApprovalBanner :evaluation-id="$route.params.evaluation" @loaded="approval = $event" />
    <div v-if="approval && approval.status !== 'approved'" class="flex justify-end mb-3 print:hidden">
      <EditAnswersButton :to="{ name: 'sensory-evaluation', params: { id: $route.params.id }, query: { edit: $route.params.evaluation } }" />
    </div>
    <div v-if="loading" class="sr-state"><ProgressSpinner style="width: 40px; height: 40px" /></div>
    <Message v-else-if="failed" severity="error" :closable="false">{{ $t("request_failed_retry") }}</Message>

    <template v-else>
      <header class="sr-head">
        <div>
          <h1>{{ $t("sensory.result_title") }}</h1>
          <p>
            <span v-if="data.child">{{ data.child.name }} · </span>
            <span class="ltr">{{ data.evaluation.date }}</span>
            <span v-if="data.form"> · {{ formName(data.form, lang) }}</span>
            <span v-if="data.evaluation.specialist"> · <i class="pi pi-user" aria-hidden="true" /> {{ data.evaluation.specialist }}</span>
          </p>
        </div>
        <div class="flex flex-wrap gap-2 items-center print:hidden">
          <Button icon="pi pi-print" :label="$t('print_report')" severity="secondary" variant="outlined" @click="printPage" />
          <DeleteEvaluationButton :evaluation-id="data.evaluation.id" />
        </div>
      </header>

      <div class="rxs-pages">
        <ResultSheet :label="$t('evaluation_sensory')" :date="data.evaluation.date" :band="$t('sensory.result_title')" :intro="false">
          <div class="sr-sheet">
            <p class="rx-intro">{{ $t("sensory.intro", { name: data.child?.name ?? "", form: formName(data.form, lang) }) }}</p>
            <table class="rx-table sr-info">
              <thead>
                <tr>
                  <th>{{ $t("sensory.test_date") }}</th>
                  <th>{{ $t("sensory.child_age") }}</th>
                  <th>{{ $t("sensory.tester") }}</th>
                  <th>{{ $t("sensory.respondent") }}</th>
                  <th>{{ $t("sensory.relationship") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span class="ltr">{{ dmy(data.evaluation.date) }}</span></td>
                  <td>{{ ageText(data.child_age, $t) }}</td>
                  <td>{{ data.evaluation.specialist ?? "" }}</td>
                  <td>{{ data.info?.respondent ?? "" }}</td>
                  <td>{{ data.info?.relationship ?? "" }}</td>
                </tr>
              </tbody>
            </table>
            <h3 class="sr-sub">{{ $t("sensory.quadrant_summary") }}</h3>
            <SensoryGrid :scores="quadrants" :level-keys="levelKeys" :level-labels="data.level_labels" :lang="lang" :title="$t('sensory.quadrant')" numbered />
            <SensorySummary :result="data" :lang="lang" />
            <p class="sr-hint">{{ $t("sensory.score_hint") }}</p>
          </div>
        </ResultSheet>

        <ResultSheet v-if="sections.some((s) => s.status !== 'not_scored') || factors.length" :label="$t('evaluation_sensory')"
          :date="data.evaluation.date" :band="$t('sensory.section_summary')" :intro="false">
          <div class="sr-sheet">
            <SensoryGrid :scores="sections" :level-keys="levelKeys" :level-labels="data.level_labels" :lang="lang" :title="$t('sensory.section')" />
            <template v-if="factors.length">
              <h3 class="sr-sub">{{ $t("sensory.factor_summary") }}</h3>
              <SensoryGrid :scores="factors" :level-keys="levelKeys" :level-labels="data.level_labels" :lang="lang" :title="$t('sensory.factor')" />
            </template>
          </div>
        </ResultSheet>

        <ResultSheet :label="$t('evaluation_sensory')" :date="data.evaluation.date" :band="$t('sensory.answers')" :intro="false">
          <div class="sr-sheet">
            <SensoryAnswers :result="data" :lang="lang" />
            <template v-if="data.info?.strengths || data.info?.concerns || data.notes">
              <table class="rx-table sr-texts">
                <tbody>
                  <tr v-if="data.info?.strengths"><th>{{ $t("sensory.strengths") }}</th><td>{{ data.info.strengths }}</td></tr>
                  <tr v-if="data.info?.concerns"><th>{{ $t("sensory.concerns") }}</th><td>{{ data.info.concerns }}</td></tr>
                  <tr v-if="data.notes"><th>{{ $t("sensory.notes") }}</th><td>{{ data.notes }}</td></tr>
                </tbody>
              </table>
            </template>
          </div>
        </ResultSheet>
      </div>

      <section v-if="history.length > 1" class="sr-card print:hidden">
        <h2>{{ $t("sensory.history") }}</h2>
        <ul class="sr-history">
          <li v-for="row in history" :key="row.evaluation_id" :class="{ 'is-current': row.evaluation_id === data.evaluation.id }">
            <router-link :to="{ name: 'sensory-result', params: { id: route.params.id, evaluation: row.evaluation_id } }">
              <span class="ltr">{{ row.date }}</span>
              <span>{{ row.form }}</span>
              <span class="sr-history-levels">
                <span v-for="q in row.quadrants" :key="q.code">{{ q.name }}: {{ q.level ? levelLabel(data.level_labels, q.level, lang) : "—" }}</span>
              </span>
            </router-link>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>

<style scoped>
.sr-page { display: grid; gap: 1rem; }
.sr-state { display: grid; place-items: center; padding: 3rem; }
.sr-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; }
.sr-head h1 { margin: 0; font-size: 1.4rem; font-weight: 800; color: var(--sawa-primary, rgb(var(--bp-135c65))); }
.sr-head p { margin: .25rem 0 0; color: var(--sawa-muted, #64748b); }
.sr-sheet { display: grid; gap: 5mm; text-align: start; }
.sr-sheet .rx-intro { margin: 0; }
.sr-info th, .sr-info td { text-align: center; }
.sr-sub { margin: 0; font-size: 12pt; font-weight: 800; }
.sr-hint { margin: 0; color: #64748b; font-size: 9pt; line-height: 1.6; }
.sr-texts th { width: 25%; text-align: start; }
.sr-texts td { white-space: pre-line; text-align: start; }
.sr-card { padding: 1.25rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 16px; background: #fff; }
.sr-card h2 { margin: 0 0 .75rem; font-size: 1.1rem; font-weight: 800; }
.sr-history { display: grid; gap: .4rem; margin: 0; padding: 0; list-style: none; }
.sr-history a { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; padding: .45rem .75rem; border: 1px solid #e2e8f0; border-radius: 10px; color: inherit; text-decoration: none; }
.sr-history-levels { display: flex; flex-wrap: wrap; gap: .25rem .75rem; color: #475569; font-size: .85rem; }
.sr-history li.is-current a { border-color: var(--sawa-primary, rgb(var(--bp-135c65))); font-weight: 700; }
.ltr { direction: ltr; unicode-bidi: isolate; }
</style>
