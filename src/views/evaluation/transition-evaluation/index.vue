<script setup>
// The VB-MAPP Transition evaluation of one child (/transition-evaluation/:id). It opens only once the child has a
// finished Milestones and Barriers evaluation. The evaluator answers the ordinary questions; the automatic ones
// (from those two evaluations) come last, already answered and locked. Beside each question: the child's earlier
// Transition scores (up to three) and this one, as the four columns of the results.
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { toDateOnly } from "@/utils/childAge";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const COLOR_OPTIONS = ["00B8D9", "36B37E", "FFAB00", "FF5630", "6554C0"];
const COLUMNS = 4;

const childId = computed(() => Number(route.params.id) || Number(localStorage.getItem("child_id")) || null);
const childName = ref("");
const loading = ref(true);
const loadError = ref("");
const context = ref(null);
const started = ref(false);
const saving = ref(false);
const showMissing = ref(false);
const alertText = ref("");
const date = ref(new Date());
const color = ref(null);
// question id -> 1-5
const selected = ref({});

const questions = computed(() => context.value?.questions ?? []);
const manualQuestions = computed(() => questions.value.filter((question) => !question.is_auto));
const autoById = computed(() => Object.fromEntries((context.value?.auto?.answers ?? []).map((answer) => [answer.question_id, answer])));
const autoQuestions = computed(() => questions.value.filter((question) => question.is_auto));
const ready = computed(() => Boolean(context.value?.auto?.ready));
const lastColor = computed(() => String(context.value?.last_color ?? "").toUpperCase());
const previous = computed(() => context.value?.previous ?? []);
// This evaluation's column: right after the earlier ones.
const currentColumn = computed(() => Math.min(previous.value.length, COLUMNS - 1));
// 0 («not assessed») is an answer too.
const isAnswered = (question) => selected.value[question.id] !== undefined && selected.value[question.id] !== null;
const answeredCount = computed(() => manualQuestions.value.filter(isAnswered).length);
// The ordinary questions' answers, after their own five: 0 «not assessed» (the automatic ones have no 0).
const optionsOf = (question) => question.is_auto ? question.answers
  : [...question.answers, { id: "zero-" + question.id, score: 0, text: t("transition.not_assessed"), zero: true }];

const isBlocked = (value) => value.toUpperCase() === lastColor.value;
const scoreOf = (question, column) => {
  if (column === currentColumn.value) return question.is_auto ? autoById.value[question.id]?.score : selected.value[question.id];
  return previous.value[column]?.scores?.[question.id] ?? previous.value[column]?.scores?.[String(question.id)] ?? null;
};
const columnColor = (column) => (column === currentColumn.value ? color.value : previous.value[column]?.color);
const fmt = (value) => String(Math.round(Number(value) * 10) / 10);

async function load() {
  loading.value = true;
  loadError.value = "";
  started.value = false;
  showMissing.value = false;
  alertText.value = "";
  selected.value = {};
  date.value = new Date();
  try {
    const [{ data }, children] = await Promise.all([
      axios.get(`api/transition-answers/context/${childId.value}`),
      axios.get("api/child").catch(() => ({ data: {} })),
    ]);
    context.value = data;
    childName.value = (children.data?.children ?? []).find((child) => Number(child.id) === childId.value)?.name ?? "";
    color.value = COLOR_OPTIONS.find((value) => !isBlocked(value));
  } catch (error) {
    loadError.value = error.response?.data?.message || t("request_failed_retry");
  } finally {
    loading.value = false;
  }
}

function scrollTo(questionId) {
  document.getElementById("tq-" + questionId)?.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function save() {
  const missing = manualQuestions.value.find((question) => !isAnswered(question));
  if (missing) {
    showMissing.value = true;
    alertText.value = t("transition.answer_all");
    scrollTo(missing.id);
    return;
  }
  saving.value = true;
  alertText.value = "";
  try {
    const { data } = await axios.post("api/transition-answers", {
      child_id: childId.value,
      date: toDateOnly(date.value),
      color: color.value,
      request_id: route.query.requestId || null,
      answers: manualQuestions.value.map((question) => ({ question_id: question.id, score: selected.value[question.id] })),
    });
    router.push({ name: "transition-result", params: { id: childId.value, evaluation: data.evaluation_id } });
  } catch (error) {
    alertText.value = Object.values(error.response?.data?.errors ?? {}).flat().join(" ") || error.response?.data?.message || t("request_failed_retry");
    window.scrollTo({ top: 0, behavior: "smooth" });
  } finally {
    saving.value = false;
  }
}

onMounted(load);
// Another child on the same screen: start over.
watch(childId, (value, before) => {
  if (value && value !== before && route.name === "transition-evaluation") load();
});
</script>

<template>
  <div class="te-page">
    <header class="te-hero">
      <div class="te-hero-main">
        <span class="te-hero-icon"><i class="pi pi-directions" aria-hidden="true" /></span>
        <div>
          <h1>{{ $t("transition.title") }}</h1>
          <p v-if="childName">{{ childName }}</p>
        </div>
      </div>
      <div v-if="started" class="te-hero-progress">
        <b>{{ answeredCount }}/{{ manualQuestions.length }}</b>
        <span>{{ $t("transition.answered_of", { n: answeredCount, total: manualQuestions.length }) }}</span>
      </div>
    </header>

    <div v-if="loading" class="te-state"><ProgressSpinner style="width: 40px; height: 40px" /></div>
    <Message v-else-if="loadError" severity="error" :closable="false">{{ loadError }}</Message>

    <template v-else>
      <Message v-if="alertText" severity="error" :closable="false">{{ alertText }}</Message>

      <!-- Transition needs the child's finished Milestones and Barriers first. -->
      <Message v-if="!ready" severity="warn" :closable="false">
        <p class="m-0">{{ $t("transition.not_ready") }}</p>
        <ul class="te-missing">
          <li v-for="item in context.auto.missing" :key="item">{{ $t("transition.missing_" + item) }}</li>
        </ul>
      </Message>

      <section v-else class="te-card">
        <div class="te-card-head">
          <span class="te-step">1</span>
          <div>
            <h2>{{ $t("transition.details") }}</h2>
            <p>{{ $t("transition.details_hint") }}</p>
          </div>
        </div>
        <div class="te-grid">
          <div class="te-field">
            <label for="te-date">{{ $t("date") }}</label>
            <DatePicker v-model="date" inputId="te-date" showIcon :disabled="started" fluid />
          </div>
          <div class="te-field">
            <label>{{ $t("color") }}</label>
            <div class="te-colors" role="radiogroup" :aria-label="$t('color')">
              <button v-for="value in COLOR_OPTIONS" :key="value" type="button" role="radio" :aria-checked="color === value"
                :class="{ selected: color === value, blocked: isBlocked(value) }" :style="{ backgroundColor: '#' + value }"
                :disabled="started || isBlocked(value)" :title="isBlocked(value) ? $t('transition.color_used_last') : ''"
                :aria-label="'#' + value + (isBlocked(value) ? ' — ' + $t('transition.color_used_last') : '')" @click="color = value" />
            </div>
          </div>
        </div>
        <p class="te-sources">
          <i class="pi pi-link" aria-hidden="true" />
          {{ $t("transition.sources", { milestone: context.auto.milestone?.date, barrier: context.auto.barrier?.date }) }}
        </p>
        <div v-if="!started" class="te-start">
          <Button :label="$t('strart_evaluate')" icon="pi pi-play" :disabled="!date || !color" @click="started = true" />
        </div>
      </section>

      <template v-if="started">
        <!-- The evaluator's questions, then the automatic ones (locked). -->
        <template v-for="group in [{ key: 'manual', list: manualQuestions }, { key: 'auto', list: autoQuestions }]" :key="group.key">
          <header v-if="group.key === 'auto' && group.list.length" class="te-section">
            <h2><i class="pi pi-lock" aria-hidden="true" /> {{ $t("transition.auto_section") }}</h2>
            <p>{{ $t("transition.auto_section_hint") }}</p>
          </header>
          <section v-for="question in group.list" :id="'tq-' + question.id" :key="question.id" class="te-card te-question"
            :class="{ 'is-auto': question.is_auto, 'is-missing': showMissing && !question.is_auto && !isAnswered(question) }">
            <div class="te-question-main">
              <header class="te-question-head">
                <span class="te-num" :style="(question.is_auto || isAnswered(question)) ? { background: '#' + color, color: '#fff' } : null">{{ question.display_order }}</span>
                <h3>{{ question.title }}</h3>
              </header>
              <p v-if="question.is_auto && autoById[question.id]" class="te-auto-value">
                <i class="pi pi-calculator" aria-hidden="true" />
                {{ $t(autoById[question.id].source.type === 'barrier' ? 'transition.auto_value_barrier' : 'transition.auto_value_milestone', { value: fmt(autoById[question.id].value) }) }}
              </p>
              <div class="te-options" role="radiogroup" :aria-label="question.title">
                <label v-for="answer in optionsOf(question)" :key="answer.id" class="te-option"
                  :class="{ 'is-zero': answer.zero, 'is-picked': (question.is_auto ? autoById[question.id]?.score : selected[question.id]) === answer.score, 'is-locked': question.is_auto }"
                  :style="(question.is_auto ? autoById[question.id]?.score : selected[question.id]) === answer.score ? { '--pick': '#' + color } : null">
                  <input type="radio" class="te-radio" :name="'q-' + question.id" :value="answer.score" :disabled="question.is_auto"
                    :checked="(question.is_auto ? autoById[question.id]?.score : selected[question.id]) === answer.score"
                    @change="selected = { ...selected, [question.id]: answer.score }" />
                  <span class="te-option-score">{{ answer.score }}</span>
                  <span class="te-option-text">{{ answer.text }}</span>
                </label>
              </div>
            </div>
            <!-- The child's Transition scores: earlier ones and this one (its column highlighted). -->
            <table class="te-history">
              <thead>
                <tr><th :colspan="COLUMNS">{{ $t("transition.history") }}</th></tr>
                <tr>
                  <th v-for="column in COLUMNS" :key="column" :class="{ 'is-current': column - 1 === currentColumn }">
                    <span class="te-swatch" :style="{ background: columnColor(column - 1) ? '#' + columnColor(column - 1) : 'transparent' }" />
                    {{ $t("transition.col_" + column) }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td v-for="column in COLUMNS" :key="column" :class="{ 'is-current': column - 1 === currentColumn }">{{ scoreOf(question, column - 1) ?? "" }}</td>
                </tr>
              </tbody>
            </table>
          </section>
        </template>

        <footer class="te-footer">
          <span><i class="pi pi-list-check" aria-hidden="true" /> {{ $t("transition.answered_of", { n: answeredCount, total: manualQuestions.length }) }}</span>
          <Button :label="$t('transition.save')" icon="pi pi-check" :loading="saving" data-no-request-spinner @click="save" />
        </footer>
      </template>
    </template>
  </div>
</template>

<style scoped>
.te-page { display: grid; gap: 1rem; }
.te-hero { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.25rem 1.5rem; border-radius: var(--sawa-radius, 16px); background: linear-gradient(135deg, var(--sawa-primary, #135c65) 0%, #1b7c86 100%); color: #fff; }
.te-hero-main { display: flex; align-items: center; gap: 1rem; }
.te-hero-icon { display: grid; place-items: center; width: 3rem; height: 3rem; border-radius: 14px; background: rgba(255, 255, 255, .15); font-size: 1.4rem; }
.te-hero h1 { margin: 0; font-size: 1.35rem; font-weight: 800; }
.te-hero p { margin: .2rem 0 0; opacity: .85; }
.te-hero-progress { display: grid; justify-items: end; }
.te-hero-progress b { font-size: 1.4rem; }
.te-state { display: grid; place-items: center; padding: 3rem; }
.te-missing { margin: .5rem 0 0; padding-inline-start: 1.25rem; }
.te-card { padding: 1.25rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 16px; background: #fff; }
.te-card-head { display: flex; align-items: flex-start; gap: .75rem; margin-bottom: 1rem; }
.te-card-head h2 { margin: 0; font-size: 1.1rem; font-weight: 800; }
.te-card-head p { margin: .2rem 0 0; color: var(--sawa-muted, #64748b); }
.te-step { display: grid; place-items: center; width: 2rem; height: 2rem; border-radius: 50%; background: var(--sawa-primary, #135c65); color: #fff; font-weight: 800; flex: none; }
.te-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr)); gap: 1rem; }
.te-field { display: grid; gap: .4rem; }
.te-field label { font-weight: 700; }
.te-colors { display: flex; flex-wrap: wrap; gap: .5rem; }
.te-colors button { position: relative; width: 2.2rem; height: 2.2rem; border-radius: 10px; border: 3px solid transparent; cursor: pointer; }
.te-colors button.selected { border-color: #0f172a; box-shadow: inset 0 0 0 2px #fff; }
.te-colors button.blocked { cursor: not-allowed; opacity: .35; }
.te-colors button.blocked::after { content: ""; position: absolute; inset: 45% -3px auto; height: 2px; background: #0f172a; transform: rotate(-45deg); }
.te-colors button:disabled:not(.blocked) { cursor: default; }
.te-sources { margin: 1rem 0 0; color: var(--sawa-muted, #64748b); font-size: .9rem; }
.te-start { display: flex; justify-content: flex-end; margin-top: 1rem; }
.te-section { padding: .5rem .25rem 0; }
.te-section h2 { margin: 0; font-size: 1.1rem; font-weight: 800; color: var(--sawa-primary, #135c65); }
.te-section p { margin: .2rem 0 0; color: var(--sawa-muted, #64748b); }
.te-question { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 1rem; align-items: start; }
.te-question.is-auto { background: #f8fafc; }
.te-question.is-missing { border-color: #f87171; box-shadow: 0 0 0 2px #fecaca; }
.te-question-head { display: flex; align-items: center; gap: .6rem; margin-bottom: .75rem; }
.te-question-head h3 { margin: 0; font-size: 1rem; font-weight: 800; }
.te-num { display: grid; place-items: center; flex: none; min-width: 2rem; height: 2rem; padding: 0 .4rem; border-radius: 8px; background: #edf7f5; color: var(--sawa-primary, #135c65); font-weight: 800; }
.te-auto-value { margin: -.25rem 0 .75rem; color: #475569; font-weight: 600; }
.te-options { display: grid; gap: .45rem; }
.te-option { display: flex; align-items: flex-start; gap: .6rem; padding: .6rem .75rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 10px; cursor: pointer; }
.te-option.is-locked { cursor: default; }
/* 0 «not assessed»: set apart from the question's own five answers. */
.te-option.is-zero { border-style: dashed; color: var(--sawa-muted, #64748b); }
.te-option.is-picked { border-color: var(--pick); background: color-mix(in srgb, var(--pick) 12%, #fff); }
.te-radio { position: absolute; opacity: 0; pointer-events: none; }
.te-option:focus-within { outline: 2px solid var(--sawa-primary, #135c65); outline-offset: 2px; }
.te-option-score { display: grid; place-items: center; flex: none; width: 1.8rem; height: 1.8rem; border-radius: 6px; background: #f1f5f9; font-weight: 800; }
.te-option.is-picked .te-option-score { background: var(--pick); color: #fff; }
.te-history { border-collapse: collapse; font-size: .8rem; text-align: center; }
.te-history th, .te-history td { border: 1px solid #cbd5e1; padding: .35rem .5rem; min-width: 3.4rem; }
.te-history thead tr:first-child th { background: #e2e8f0; font-weight: 800; }
.te-history th { background: #f8fafc; font-weight: 700; }
.te-history .is-current { background: #ecfeff; font-weight: 800; }
.te-history td { height: 2.2rem; font-size: 1rem; font-weight: 800; }
.te-swatch { display: block; width: 14px; height: 6px; margin: 0 auto 3px; border-radius: 2px; }
.te-footer { position: sticky; bottom: 0; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .85rem 1.25rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 14px; background: #fff; box-shadow: 0 -6px 20px -12px rgba(15, 23, 42, .25); }
@media (max-width: 760px) {
  .te-question { grid-template-columns: 1fr; }
  .te-history { width: 100%; }
}
</style>
