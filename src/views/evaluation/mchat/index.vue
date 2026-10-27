<script setup>
// The M-CHAT-R evaluation of one child (/mchat-evaluation/:id): a parent answers yes/no questions about the
// child's usual behaviour, with the evaluator. The risk points add up as they answer (every «لا» is one, except
// the questions marked yes_is_risk where «نعم» is) and saving gives the risk level. The questions, levels,
// instructions and ages (16-30 months on the form; outside them only warns) come from the M-CHAT settings page.
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { toDateOnly } from "@/utils/childAge";
import { childMonths, fitsAge, formatAgeRange } from "@/utils/ageRange";
import { RISK_SEVERITY, mchatPoint, mchatRisk } from "./mchat";
import EditModeBanner from "@/components/evaluations/EditModeBanner.vue";

const { t } = useI18n();
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
const respondent = ref("");
const notes = ref("");
// question id -> true («نعم») | false («لا»)
const answers = ref({});
// Editing a saved evaluation (?edit=id) before its approval: { id, approval_status, approval_note, ... }.
const editing = ref(null);

const questions = computed(() => context.value?.questions ?? []);
const child = computed(() => context.value?.child ?? null);
const isAnswered = (question) => typeof answers.value[question.id] === "boolean";
const answeredCount = computed(() => questions.value.filter(isAnswered).length);
const total = computed(() => questions.value.filter(isAnswered).reduce((sum, question) => sum + mchatPoint(question, answers.value[question.id]), 0));
const risk = computed(() => mchatRisk(total.value, context.value?.levels));
const done = computed(() => questions.value.length > 0 && answeredCount.value === questions.value.length);

// The child's age on the evaluation day, and a warning outside the form's ages.
const ageMonths = computed(() => (child.value?.birth_date && date.value ? childMonths(child.value.birth_date, date.value) : null));
const range = computed(() => context.value?.age_range ?? {});
const ageWarning = computed(() => ageMonths.value !== null && !fitsAge(range.value.from_months, range.value.to_months, ageMonths.value));

function answer(question, yes) {
  answers.value = { ...answers.value, [question.id]: yes };
}

async function load() {
  loading.value = true;
  loadError.value = "";
  showMissing.value = false;
  alertText.value = "";
  answers.value = {};
  respondent.value = "";
  notes.value = "";
  date.value = new Date();
  editing.value = null;
  try {
    // The saved evaluation (?edit=id): the same screen with its answers, respondent and notes.
    if (route.query.edit) {
      const { data } = (await axios.get(`api/mchat-answers/evaluation/${route.query.edit}/edit`)).data;
      context.value = { ...data.context, questions: data.questions, levels: data.levels };
      editing.value = data.evaluation;
      date.value = data.evaluation.date ? new Date(data.evaluation.date) : new Date();
      answers.value = Object.fromEntries(data.questions.map((question) => [question.id, Boolean(question.yes)]));
      respondent.value = data.respondent ?? "";
      notes.value = data.notes ?? "";
      return;
    }
    context.value = (await axios.get(`api/mchat-answers/context/${childId.value}`)).data;
  } catch (error) {
    loadError.value = error.response?.data?.message || t("request_failed_retry");
  } finally {
    loading.value = false;
  }
}

async function save() {
  const missing = questions.value.find((question) => !isAnswered(question));
  if (missing) {
    showMissing.value = true;
    alertText.value = t("mchat.answer_all");
    document.getElementById("mq-" + missing.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  saving.value = true;
  alertText.value = "";
  try {
    if (editing.value) {
      await axios.put(`api/mchat-answers/evaluation/${editing.value.id}/edit`, {
        respondent: respondent.value.trim() || null,
        notes: notes.value.trim() || null,
        answers: questions.value.map((question) => ({ question: question.id, yes: answers.value[question.id] })),
      });
      router.push({ name: "mchat-result", params: { id: child.value?.id ?? childId.value, evaluation: editing.value.id } });
      return;
    }
    const { data } = await axios.post("api/mchat-answers", {
      child_id: childId.value,
      date: toDateOnly(date.value),
      request_id: route.query.requestId || null,
      respondent: respondent.value.trim() || null,
      notes: notes.value.trim() || null,
      answers: questions.value.map((question) => ({ question: question.id, yes: answers.value[question.id] })),
    });
    router.push({ name: "mchat-result", params: { id: childId.value, evaluation: data.evaluation_id } });
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
  if (value && value !== before && route.name === "mchat-evaluation") load();
});
</script>

<template>
  <div class="mc-page">
    <header class="mc-hero">
      <div class="mc-hero-main">
        <span class="mc-hero-icon"><i class="pi pi-list-check" aria-hidden="true" /></span>
        <div>
          <h1>{{ $t("mchat.title") }}</h1>
          <p v-if="child">{{ child.name }}</p>
        </div>
      </div>
      <div v-if="context" class="mc-hero-progress">
        <b>{{ answeredCount }}/{{ questions.length }}</b>
        <span>{{ $t("mchat.answered") }}</span>
      </div>
    </header>

    <div v-if="loading" class="mc-state"><ProgressSpinner style="width: 40px; height: 40px" /></div>
    <Message v-else-if="loadError" severity="error" :closable="false">{{ loadError }}</Message>

    <template v-else>
      <!-- Opened from the result (?edit=): the same screen with the answers given, until the evaluation is approved. -->
      <EditModeBanner v-if="editing" :status="editing.approval_status" :note="editing.approval_note" />
      <Message v-if="alertText" severity="error" :closable="false">{{ alertText }}</Message>

      <section class="mc-card">
        <div class="mc-grid">
          <div class="mc-field">
            <label for="mc-date">{{ $t("date") }}</label>
            <DatePicker v-model="date" inputId="mc-date" showIcon fluid :disabled="Boolean(editing)" />
          </div>
          <div class="mc-field">
            <label for="mc-respondent">{{ $t("mchat.respondent") }}</label>
            <InputText id="mc-respondent" v-model="respondent" :placeholder="$t('mchat.respondent_placeholder')" />
          </div>
          <div class="mc-field">
            <label>{{ $t("mchat.child_age") }}</label>
            <p class="mc-age">{{ ageMonths === null ? "—" : $t("mchat.months", { n: ageMonths }) }}</p>
          </div>
        </div>
        <Message v-if="ageWarning" severity="warn" :closable="false" class="mt-3">
          {{ $t("mchat.age_warning", { age: $t("mchat.months", { n: ageMonths }), range: formatAgeRange($t, range.from_months, range.to_months) }) }}
        </Message>
        <p class="mc-instructions"><i class="pi pi-info-circle" aria-hidden="true" /> {{ context.instructions || $t("mchat.instructions") }}</p>
      </section>

      <section v-for="question in questions" :id="'mq-' + question.id" :key="question.id" class="mc-card mc-question"
        :class="{ 'is-missing': showMissing && !isAnswered(question) }">
        <span class="mc-num" :class="{ 'is-done': isAnswered(question) }">{{ question.number }}</span>
        <div class="mc-question-text">
          <h3>{{ question.text }}</h3>
          <p v-if="question.example">{{ question.example }}</p>
        </div>
        <div class="mc-choices" role="radiogroup" :aria-label="question.text">
          <button v-for="option in [true, false]" :key="String(option)" type="button" role="radio" class="mc-choice"
            :class="{ 'is-picked': answers[question.id] === option, 'is-yes': option }" :aria-checked="answers[question.id] === option"
            @click="answer(question, option)">
            <i :class="option ? 'pi pi-check' : 'pi pi-times'" aria-hidden="true" />
            {{ option ? $t("mchat.yes") : $t("mchat.no") }}
          </button>
        </div>
      </section>

      <section class="mc-card">
        <div class="mc-field">
          <label for="mc-notes">{{ $t("mchat.notes") }}</label>
          <Textarea id="mc-notes" v-model="notes" rows="3" autoResize />
        </div>
      </section>

      <footer class="mc-footer">
        <span class="mc-total">
          {{ $t("mchat.total") }}: <b>{{ total }}</b>
          <Tag v-if="done" :value="$t('mchat.risk_' + risk)" :severity="RISK_SEVERITY[risk]" />
        </span>
        <Button :label="editing ? $t('mae_save') : $t('mchat.save')" icon="pi pi-check" :loading="saving" data-no-request-spinner @click="save" />
      </footer>
    </template>
  </div>
</template>

<style scoped>
.mc-page { display: grid; gap: 1rem; }
.mc-hero { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.25rem 1.5rem; border-radius: var(--sawa-radius, 16px); background: linear-gradient(135deg, var(--sawa-primary, #135c65) 0%, #1b7c86 100%); color: #fff; }
.mc-hero-main { display: flex; align-items: center; gap: 1rem; }
.mc-hero-icon { display: grid; place-items: center; width: 3rem; height: 3rem; border-radius: 14px; background: rgba(255, 255, 255, .15); font-size: 1.4rem; }
.mc-hero h1 { margin: 0; font-size: 1.35rem; font-weight: 800; }
.mc-hero p { margin: .2rem 0 0; opacity: .85; }
.mc-hero-progress { display: grid; justify-items: end; }
.mc-hero-progress b { font-size: 1.4rem; }
.mc-state { display: grid; place-items: center; padding: 3rem; }
.mc-card { padding: 1.1rem 1.25rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 16px; background: #fff; }
.mc-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr)); gap: 1rem; }
.mc-field { display: grid; gap: .4rem; }
.mc-field label { font-weight: 700; }
.mc-age { margin: 0; padding: .55rem 0; font-weight: 700; }
.mc-instructions { margin: 1rem 0 0; padding: .6rem .8rem; border-radius: 10px; background: #f1f5f9; color: #475569; font-size: .9rem; line-height: 1.7; }
.mc-question { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: .9rem; }
.mc-question.is-missing { border-color: #f87171; box-shadow: 0 0 0 2px #fecaca; }
.mc-num { display: grid; place-items: center; width: 2.2rem; height: 2.2rem; border-radius: 10px; background: #edf7f5; color: var(--sawa-primary, #135c65); font-weight: 800; }
.mc-num.is-done { background: var(--sawa-primary, #135c65); color: #fff; }
.mc-question-text h3 { margin: 0; font-size: 1rem; font-weight: 700; line-height: 1.7; }
.mc-question-text p { margin: .2rem 0 0; color: var(--sawa-muted, #64748b); font-size: .88rem; }
.mc-choices { display: flex; gap: .5rem; }
.mc-choice { display: inline-flex; align-items: center; gap: .4rem; min-width: 5.5rem; justify-content: center; padding: .55rem .9rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 10px; background: #fff; font: inherit; font-weight: 700; cursor: pointer; }
.mc-choice:hover { border-color: #94a3b8; }
.mc-choice:focus-visible { outline: 2px solid var(--sawa-primary, #135c65); outline-offset: 2px; }
.mc-choice.is-picked { border-color: var(--sawa-primary, #135c65); background: var(--sawa-primary, #135c65); color: #fff; }
.mc-choice.is-picked:not(.is-yes) { border-color: #475569; background: #475569; }
.mc-footer { position: sticky; bottom: 0; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; padding: .85rem 1.25rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 14px; background: #fff; box-shadow: 0 -6px 20px -12px rgba(15, 23, 42, .25); }
.mc-total { display: inline-flex; align-items: center; gap: .5rem; font-weight: 600; }
.mc-total b { font-size: 1.2rem; }
@media (max-width: 640px) {
  .mc-question { grid-template-columns: auto minmax(0, 1fr); }
  .mc-choices { grid-column: 1 / -1; }
  .mc-choice { flex: 1; }
}
</style>
