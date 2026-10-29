<script setup>
// The QFBA evaluation of one child (/qfba-evaluation/:id): the evaluator picks the form's language (Arabic or English),
// names the target behaviour and who answers, then rates how often the behaviour happens in each situation (the scale
// from the QFBA settings, or «لا ينطبق»). Each function's endorsed questions and severity add up as they answer, and
// saving shows the result. ?edit=<evaluation id> opens a saved evaluation (before its approval) with its answers.
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { toDateOnly } from "@/utils/childAge";
import { childMonths, fitsAge, formatAgeRange } from "@/utils/ageRange";
import EditModeBanner from "@/components/evaluations/EditModeBanner.vue";
import {
  functionColor, functionName, instructionsOf, optionLabel, primaryOf, qt, questionText, scoresOf,
} from "./qfba";

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();

const childId = computed(() => Number(route.params.id) || Number(localStorage.getItem("child_id")) || null);
const loading = ref(true);
const loadError = ref("");
const context = ref(null);
const saving = ref(false);
const showMissing = ref(false);
const alertText = ref("");
const date = ref(new Date());
const lang = ref(locale.value === "en" ? "en" : "ar");
const interviewee = ref("");
const targetBehavior = ref("");
const notes = ref("");
// question id -> a scale value, or null («لا ينطبق»); a question not in it is not answered yet.
const answers = ref({});
const editing = ref(null);

const LANGUAGE_OPTIONS = [{ value: "ar", label: "العربية" }, { value: "en", label: "English" }];
const questions = computed(() => context.value?.questions ?? []);
const functions = computed(() => context.value?.functions ?? []);
const options = computed(() => context.value?.options ?? []);
const child = computed(() => context.value?.child ?? null);
const maxValue = computed(() => Math.max(0, ...options.value.map((option) => option.value)));
const functionOf = computed(() => Object.fromEntries(functions.value.map((fn) => [fn.id, fn])));
const isAnswered = (question) => Object.prototype.hasOwnProperty.call(answers.value, question.id);
const answeredCount = computed(() => questions.value.filter(isAnswered).length);
const done = computed(() => questions.value.length > 0 && answeredCount.value === questions.value.length);
const scores = computed(() => scoresOf(functions.value, questions.value, answers.value, maxValue.value));
const likely = computed(() => primaryOf(scores.value));

const ageMonths = computed(() => (child.value?.birth_date && date.value ? childMonths(child.value.birth_date, date.value) : null));
const range = computed(() => context.value?.age_range ?? {});
const ageWarning = computed(() => ageMonths.value !== null && !fitsAge(range.value.from_months, range.value.to_months, ageMonths.value));

function answer(question, value) {
  answers.value = { ...answers.value, [question.id]: value };
}

async function load() {
  loading.value = true;
  loadError.value = "";
  showMissing.value = false;
  alertText.value = "";
  answers.value = {};
  interviewee.value = "";
  targetBehavior.value = "";
  notes.value = "";
  date.value = new Date();
  editing.value = null;
  try {
    if (route.query.edit) {
      const { data } = (await axios.get(`api/qfba-answers/evaluation/${route.query.edit}/edit`)).data;
      context.value = { ...data.context, questions: data.questions };
      editing.value = data.evaluation;
      date.value = data.evaluation.date ? new Date(data.evaluation.date) : new Date();
      answers.value = Object.fromEntries(data.questions.filter((question) => question.answered).map((question) => [question.id, question.value]));
      lang.value = data.language === "en" ? "en" : "ar";
      interviewee.value = data.interviewee ?? "";
      targetBehavior.value = data.target_behavior ?? "";
      notes.value = data.notes ?? "";
      return;
    }
    context.value = (await axios.get(`api/qfba-answers/context/${childId.value}`)).data;
  } catch (error) {
    loadError.value = error.response?.data?.message || t("request_failed_retry");
  } finally {
    loading.value = false;
  }
}

const payload = () => ({
  language: lang.value,
  interviewee: interviewee.value.trim() || null,
  target_behavior: targetBehavior.value.trim() || null,
  notes: notes.value.trim() || null,
  answers: questions.value.map((question) => ({ question: question.id, value: answers.value[question.id] })),
});

async function save() {
  const missing = questions.value.find((question) => !isAnswered(question));
  if (missing) {
    showMissing.value = true;
    alertText.value = qt(lang.value, "answer_all");
    document.getElementById("qq-" + missing.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  saving.value = true;
  alertText.value = "";
  try {
    if (editing.value) {
      await axios.put(`api/qfba-answers/evaluation/${editing.value.id}/edit`, payload());
      router.push({ name: "qfba-result", params: { id: child.value?.id ?? childId.value, evaluation: editing.value.id } });
      return;
    }
    const { data } = await axios.post("api/qfba-answers", {
      child_id: childId.value,
      date: toDateOnly(date.value),
      request_id: route.query.requestId || null,
      ...payload(),
    });
    router.push({ name: "qfba-result", params: { id: childId.value, evaluation: data.evaluation_id } });
  } catch (error) {
    alertText.value = Object.values(error.response?.data?.errors ?? {}).flat().join(" ") || error.response?.data?.message || t("request_failed_retry");
    window.scrollTo({ top: 0, behavior: "smooth" });
  } finally {
    saving.value = false;
  }
}

onMounted(load);
watch(childId, (value, before) => {
  if (value && value !== before && route.name === "qfba-evaluation") load();
});
</script>

<template>
  <div class="qf-page">
    <header class="qf-hero">
      <div class="qf-hero-main">
        <span class="qf-hero-icon"><i class="pi pi-bolt" aria-hidden="true" /></span>
        <div>
          <h1>{{ qt(lang, "title") }}</h1>
          <p v-if="child">{{ child.name }}</p>
        </div>
      </div>
      <div v-if="context" class="qf-hero-progress">
        <b>{{ answeredCount }}/{{ questions.length }}</b>
        <span>{{ qt(lang, "answered") }}</span>
      </div>
    </header>

    <div v-if="loading" class="qf-state"><ProgressSpinner style="width: 40px; height: 40px" /></div>
    <Message v-else-if="loadError" severity="error" :closable="false">{{ loadError }}</Message>

    <template v-else>
      <EditModeBanner v-if="editing" :status="editing.approval_status" :note="editing.approval_note" />
      <Message v-if="alertText" severity="error" :closable="false">{{ alertText }}</Message>

      <section class="qf-card">
        <div class="qf-lang">
          <label>{{ $t("qfba.language") }}</label>
          <SelectButton v-model="lang" :options="LANGUAGE_OPTIONS" optionLabel="label" optionValue="value" :allowEmpty="false" />
        </div>
        <div class="qf-grid" :dir="lang === 'en' ? 'ltr' : 'rtl'">
          <div class="qf-field">
            <label for="qf-date">{{ qt(lang, "test_date") }}</label>
            <DatePicker v-model="date" inputId="qf-date" showIcon fluid :disabled="Boolean(editing)" />
          </div>
          <div class="qf-field">
            <label for="qf-interviewee">{{ qt(lang, "interviewee") }}</label>
            <InputText id="qf-interviewee" v-model="interviewee" :placeholder="qt(lang, 'interviewee_placeholder')" />
          </div>
          <div class="qf-field">
            <label for="qf-behavior">{{ qt(lang, "target_behavior") }}</label>
            <InputText id="qf-behavior" v-model="targetBehavior" :placeholder="qt(lang, 'target_behavior_placeholder')" />
          </div>
          <div class="qf-field">
            <label>{{ qt(lang, "child_age") }}</label>
            <p class="qf-age">{{ ageMonths === null ? "—" : qt(lang, "months", { n: ageMonths }) }}</p>
          </div>
        </div>
        <Message v-if="ageWarning" severity="warn" :closable="false" class="mt-3">
          {{ $t("mchat.age_warning", { age: $t("mchat.months", { n: ageMonths }), range: formatAgeRange($t, range.from_months, range.to_months) }) }}
        </Message>
        <p v-if="instructionsOf(context, lang)" class="qf-instructions" :dir="lang === 'en' ? 'ltr' : 'rtl'">
          <i class="pi pi-info-circle" aria-hidden="true" /> {{ instructionsOf(context, lang) }}
        </p>
      </section>

      <section v-for="question in questions" :id="'qq-' + question.id" :key="question.id" class="qf-card qf-question"
        :class="{ 'is-missing': showMissing && !isAnswered(question) }" :dir="lang === 'en' ? 'ltr' : 'rtl'">
        <span class="qf-num" :class="{ 'is-done': isAnswered(question) }">{{ question.number }}</span>
        <div class="qf-question-text">
          <h3>{{ questionText(question, lang) }}</h3>
          <small class="qf-fn" :style="{ color: functionColor(functionOf[question.function_id]?.key) }">
            {{ functionName(functionOf[question.function_id], lang) }}
          </small>
        </div>
        <div class="qf-choices" role="radiogroup" :aria-label="questionText(question, lang)">
          <button v-for="option in options" :key="option.value" type="button" role="radio" class="qf-choice"
            :class="{ 'is-picked': answers[question.id] === option.value && isAnswered(question) }"
            :aria-checked="answers[question.id] === option.value && isAnswered(question)" @click="answer(question, option.value)">
            <b class="ltr">{{ option.value }}</b> {{ optionLabel(option, lang) }}
          </button>
          <button type="button" role="radio" class="qf-choice is-na" :class="{ 'is-picked': isAnswered(question) && answers[question.id] === null }"
            :aria-checked="isAnswered(question) && answers[question.id] === null" @click="answer(question, null)">
            {{ qt(lang, "na") }}
          </button>
        </div>
      </section>

      <section class="qf-card" :dir="lang === 'en' ? 'ltr' : 'rtl'">
        <div class="qf-field">
          <label for="qf-notes">{{ qt(lang, "notes") }}</label>
          <Textarea id="qf-notes" v-model="notes" rows="3" autoResize />
        </div>
      </section>

      <footer class="qf-footer" :dir="lang === 'en' ? 'ltr' : 'rtl'">
        <div class="qf-tally">
          <span v-for="score in scores" :key="score.key" class="qf-tally-item" :class="{ 'is-likely': done && likely.includes(score.key) }"
            :style="{ '--tone': functionColor(score.key) }">
            {{ functionName(score, lang) }} <b class="ltr">{{ score.endorsed }}/{{ score.questions }} · {{ score.severity }}</b>
          </span>
        </div>
        <Button :label="editing ? $t('mae_save') : qt(lang, 'save')" icon="pi pi-check" :loading="saving" data-no-request-spinner @click="save" />
      </footer>
    </template>
  </div>
</template>

<style scoped>
.qf-page { display: grid; gap: 1rem; }
.qf-hero { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.25rem 1.5rem; border-radius: var(--sawa-radius, 16px); background: linear-gradient(135deg, var(--sawa-primary, rgb(var(--bp-135c65))) 0%, rgb(var(--bp-1b7c86)) 100%); color: #fff; }
.qf-hero-main { display: flex; align-items: center; gap: 1rem; }
.qf-hero-icon { display: grid; place-items: center; width: 3rem; height: 3rem; border-radius: 14px; background: rgba(255, 255, 255, .15); font-size: 1.4rem; }
.qf-hero h1 { margin: 0; font-size: 1.35rem; font-weight: 800; }
.qf-hero p { margin: .2rem 0 0; opacity: .85; }
.qf-hero-progress { display: grid; justify-items: end; }
.qf-hero-progress b { font-size: 1.4rem; }
.qf-state { display: grid; place-items: center; padding: 3rem; }
.qf-card { padding: 1.1rem 1.25rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 16px; background: #fff; }
.qf-lang { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; margin-bottom: 1rem; }
.qf-lang label { font-weight: 700; }
.qf-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 13rem), 1fr)); gap: 1rem; }
.qf-field { display: grid; gap: .4rem; }
.qf-field label { font-weight: 700; }
.qf-age { margin: 0; padding: .55rem 0; font-weight: 700; }
.qf-instructions { margin: 1rem 0 0; padding: .6rem .8rem; border-radius: 10px; background: #f1f5f9; color: #475569; font-size: .9rem; line-height: 1.7; }
.qf-question { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: start; gap: .6rem .9rem; }
.qf-question.is-missing { border-color: #f87171; box-shadow: 0 0 0 2px #fecaca; }
.qf-num { display: grid; place-items: center; width: 2.2rem; height: 2.2rem; border-radius: 10px; background: #edf7f5; color: var(--sawa-primary, rgb(var(--bp-135c65))); font-weight: 800; }
.qf-num.is-done { background: var(--sawa-primary, rgb(var(--bp-135c65))); color: #fff; }
.qf-question-text h3 { margin: 0; font-size: 1rem; font-weight: 700; line-height: 1.7; }
.qf-fn { font-weight: 700; }
.qf-choices { grid-column: 2; display: flex; flex-wrap: wrap; gap: .45rem; }
.qf-choice { display: inline-flex; align-items: center; gap: .35rem; padding: .45rem .8rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 10px; background: #fff; font: inherit; font-weight: 600; cursor: pointer; }
.qf-choice:hover { border-color: #94a3b8; }
.qf-choice:focus-visible { outline: 2px solid var(--sawa-primary, rgb(var(--bp-135c65))); outline-offset: 2px; }
.qf-choice.is-picked { border-color: var(--sawa-primary, rgb(var(--bp-135c65))); background: var(--sawa-primary, rgb(var(--bp-135c65))); color: #fff; }
.qf-choice.is-na.is-picked { border-color: #475569; background: #475569; }
.qf-footer { position: sticky; bottom: 0; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; padding: .85rem 1.25rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 14px; background: #fff; box-shadow: 0 -6px 20px -12px rgba(15, 23, 42, .25); }
.qf-tally { display: flex; flex-wrap: wrap; gap: .4rem; }
.qf-tally-item { padding: .2rem .6rem; border: 1px solid #e2e8f0; border-inline-start: 4px solid var(--tone); border-radius: 8px; font-size: .85rem; }
.qf-tally-item.is-likely { background: #fefce8; border-color: var(--tone); font-weight: 700; }
.ltr { direction: ltr; unicode-bidi: isolate; }
@media (max-width: 640px) {
  .qf-choices { grid-column: 1 / -1; }
  .qf-choice { flex: 1 1 40%; justify-content: center; }
}
</style>
