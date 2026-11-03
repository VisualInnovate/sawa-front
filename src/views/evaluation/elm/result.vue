<script setup>
// One ELM evaluation's result (/elm-result/:id/:evaluation), drawn as the printed report draws it: the tests (this one and
// the child's earlier ones) with each part's percentage, «مجموع النتائج» (every test's X in its color), every item's
// (+)/(−) with the caregiver and with the therapist, then the basic needs, toilet, behaviour problems and recommendations.
import ApprovalBanner from "@/components/evaluations/ApprovalBanner.vue";
import ElmAnswerEditor from "@/components/elm/ElmAnswerEditor.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "axios";
import DeleteEvaluationButton from "@/components/evaluation/DeleteEvaluationButton.vue";
import ResultSheet from "@/components/reports/ResultSheet.vue";
import ElmChart from "@/components/reports/ElmChart.vue";
import ElmSummary from "@/components/reports/ElmSummary.vue";
import { ELM, MAX_PER_GROUP, dmy, typeLabel } from "@/components/reports/reportUtils";
import { PEOPLE, colorOf, itemText, percentOf } from "./elm";

const route = useRoute();
const { t } = useI18n();
const label = computed(() => typeLabel(ELM, t));
const loading = ref(true);
const failed = ref(false);
const data = ref(null);
const approval = ref(null);
const approvalBanner = ref(null);

// The chart's tests: this one and the child's earlier ELM tests (at most four, the newest last).
const tests = computed(() => {
  const history = data.value?.history ?? [];
  const upTo = history.findIndex((row) => row.evaluation_id === data.value?.evaluation?.id);
  const rows = upTo >= 0 ? history.slice(0, upTo + 1) : history;
  return rows.slice(-MAX_PER_GROUP).map((row) => ({
    key: row.evaluation_id, date: row.date, specialist: row.specialist, child_age: row.child_age,
    result: { color: row.color, scores: row.scores },
  }));
});
const codes = computed(() => (data.value?.scores ?? []).map((row) => row.code));
const mark = (value) => (value === true ? "+" : value === false ? "−" : "");
const columnsOf = (section) => ["material", "tool"].map((column) => ({ column, items: section.items.filter((item) => item.column === column) })).filter((group) => group.items.length);
const scoreOf = (code) => (data.value?.scores ?? []).find((row) => row.code === code);
const printPage = () => window.print();

function answersEdited() {
  approvalBanner.value?.reload();
  load();
}

async function load() {
  loading.value = true;
  failed.value = false;
  try {
    data.value = (await axios.get(`api/elm-answers/result/${route.params.evaluation}`)).data;
  } catch {
    failed.value = true;
  } finally {
    loading.value = false;
  }
}

onMounted(load);
watch(() => route.params.evaluation, (value, before) => {
  if (value && value !== before && route.name === "elm-result") load();
});
</script>

<template>
  <div class="er-page">
    <Toast />
    <ApprovalBanner ref="approvalBanner" :evaluation-id="$route.params.evaluation" @loaded="approval = $event" />
    <div v-if="approval && approval.status !== 'approved'" class="flex justify-end mb-3 print:hidden">
      <ElmAnswerEditor :evaluation-id="$route.params.evaluation" @saved="answersEdited" />
    </div>
    <div v-if="loading" class="er-state"><ProgressSpinner style="width: 40px; height: 40px" /></div>
    <Message v-else-if="failed" severity="error" :closable="false">{{ $t("request_failed_retry") }}</Message>

    <template v-else>
      <header class="er-head">
        <div>
          <h1>{{ $t("elm.result_title") }}</h1>
          <p>
            <span v-if="data.child">{{ data.child.name }} · </span>
            <span class="ltr">{{ data.evaluation.date }}</span>
            <span v-if="data.child_age !== null"> · {{ $t("elm.months", { n: data.child_age }) }}</span>
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
          <table class="rx-table er-tests">
            <thead>
              <tr>
                <th rowspan="2" class="rx-sum-num">#</th>
                <th rowspan="2">{{ $t("elm.test_date") }}</th>
                <th rowspan="2">{{ $t("elm.child_age") }}</th>
                <th rowspan="2">{{ $t("elm.tester") }}</th>
                <th v-for="person in PEOPLE" :key="person" :colspan="codes.length">{{ $t(`elm.with_${person}`) }}</th>
              </tr>
              <tr>
                <template v-for="person in PEOPLE" :key="person">
                  <th v-for="code in codes" :key="person + code" class="ltr">{{ code }}</th>
                </template>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(test, i) in tests" :key="test.key">
                <td class="rx-sum-num"><b :style="{ color: colorOf(test.result.color, i) }">{{ i + 1 }}</b></td>
                <td><span class="ltr">{{ dmy(test.date) }}</span></td>
                <td>{{ test.child_age == null ? "" : $t("elm.months", { n: test.child_age }) }}</td>
                <td>{{ test.specialist ?? "" }}</td>
                <template v-for="person in PEOPLE" :key="person">
                  <td v-for="code in codes" :key="person + code" class="ltr">
                    {{ percentOf(test.result.scores, code, person) === null ? "—" : percentOf(test.result.scores, code, person) + "%" }}
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
          <h2 class="rx-band rx-band-soft rx-space">{{ $t("elm.chart_title") }}</h2>
          <ElmChart :tests="tests" />
        </ResultSheet>

        <ResultSheet v-for="section in data.sections" :key="section.id" :label="label" :date="data.evaluation.date"
          :band="`${section.name} (${section.code})`" :intro="false">
          <p v-if="section.instructions" class="er-instructions">{{ section.instructions }}</p>
          <div class="er-columns">
            <table v-for="group in columnsOf(section)" :key="group.column" class="rx-table er-items">
              <thead>
                <tr>
                  <th>{{ $t(`elm.column_${group.column}`) }}</th>
                  <th v-for="person in PEOPLE" :key="person">{{ $t(`elm.with_${person}`) }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in group.items" :key="item.id" :class="{ 'is-deleted': item.deleted }">
                  <td>{{ itemText(item.text, data.child?.name) }}</td>
                  <td v-for="person in PEOPLE" :key="person" class="er-sign" :class="{ 'is-plus': item[person] === true, 'is-minus': item[person] === false }">
                    {{ mark(item[person]) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <table class="rx-table er-results">
            <tbody>
              <tr>
                <th>RESULTS</th>
                <td v-for="person in PEOPLE" :key="person">
                  {{ $t(`elm.with_${person}`) }}:
                  <b class="ltr">{{ scoreOf(section.code)?.[person]?.percent == null ? "—" : scoreOf(section.code)[person].percent + "%" }}</b>
                  <small v-if="scoreOf(section.code)?.[person]?.answered" class="ltr">
                    ({{ scoreOf(section.code)[person].plus }}/{{ scoreOf(section.code)[person].answered }})
                  </small>
                </td>
              </tr>
            </tbody>
          </table>
        </ResultSheet>

        <ResultSheet :label="label" :date="data.evaluation.date" :band="$t('elm.other_pages')" :intro="false">
          <ElmSummary :result="data" />
          <p v-if="!Object.keys(data.info ?? {}).length && !data.notes" class="er-empty">{{ $t("elm.nothing_written") }}</p>
        </ResultSheet>
      </div>
    </template>
  </div>
</template>

<style scoped>
.er-page { display: grid; gap: 1rem; }
.er-state { display: grid; place-items: center; padding: 3rem; }
.er-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; }
.er-head h1 { margin: 0; font-size: 1.4rem; font-weight: 800; color: var(--sawa-primary, rgb(var(--bp-135c65))); }
.er-head p { margin: .25rem 0 0; color: var(--sawa-muted, #64748b); }
.er-tests th, .er-tests td { text-align: center; }
.er-instructions { margin: 0 0 .75rem; color: #475569; font-size: .9rem; line-height: 1.7; }
.er-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; }
.er-items td:first-child { font-weight: 600; }
.er-sign { width: 5.5rem; text-align: center; font-size: 1.1rem; font-weight: 800; }
.er-sign.is-plus { color: #15803d; }
.er-sign.is-minus { color: #b91c1c; }
tr.is-deleted td:first-child { color: #94a3b8; text-decoration: line-through; }
.er-results { margin-top: 3mm; }
.er-results th { width: 7rem; }
.er-results td { text-align: center; }
.er-empty { color: #64748b; }
@media (max-width: 720px) { .er-columns { grid-template-columns: 1fr; } }
</style>
