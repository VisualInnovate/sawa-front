<script setup>
// One evaluation header (age band) of a side profile dimension on the edit page: its 2 or 3 questions,
// each with a boy's and a girl's title plus the wording kept with a "yes" and a "no" answer.
// Emits `question-inputs(headerId, questions)` whenever a question changes.
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { emptyWording, genders, questionWording } from "../utils/sideProfileWording";

const props = defineProps({
  header: { type: Object, required: true },
  questionsAndHeader: { type: Array, default: undefined },
  showErrors: Boolean,
});
const emit = defineEmits(["question-inputs"]);

const questions = ref(props.questionsAndHeader?.length
  ? props.questionsAndHeader.map((row) => questionWording(row.questions))
  : [emptyWording(), emptyWording()]);
// The gender shown for each question.
const shown = ref(questions.value.map(() => "male"));

const blank = (value) => !String(value ?? "").trim();
const touched = (question) => genders.some((gender) => Object.values(question[gender]).some((value) => !blank(value)));
// An untouched header is skipped; once one question is written, every title in the header is needed.
const started = computed(() => questions.value.some(touched));
const titleMissing = (question, gender) => props.showErrors && started.value && blank(question[gender].title);
const missing = computed(() => (started.value
  ? questions.value.filter((question) => genders.some((gender) => blank(question[gender].title))).length
  : 0));
const canAdd = computed(() => questions.value.length < 3);

const emitQuestions = () => emit("question-inputs", props.header.id, questions.value.map((question) => ({
  male: { ...question.male },
  female: { ...question.female },
})));

function setText(index, field, value) {
  questions.value[index][shown.value[index]][field] = value;
  emitQuestions();
}

function toggleThird() {
  if (canAdd.value) {
    questions.value.push(emptyWording());
    shown.value.push("male");
  } else {
    questions.value.splice(-1, 1);
    shown.value.splice(-1, 1);
    if (undo.value?.index === 2) undo.value = null;
  }
  emitQuestions();
}

// Show the gender that still needs a title once the form reports errors.
watch(() => props.showErrors, (showErrors) => {
  if (!showErrors) return;
  questions.value.forEach((question, index) => {
    if (titleMissing(question, shown.value[index])) return;
    const other = genders.find((gender) => titleMissing(question, gender));
    if (other) shown.value[index] = other;
  });
});

// Copy the other gender's title and wording into the one shown, with an undo while the notice is up.
const otherOf = (gender) => (gender === "male" ? "female" : "male");
const otherHasText = (index) => Object.values(questions.value[index][otherOf(shown.value[index])]).some((value) => !blank(value));
const undo = ref(null);
let undoTimer;
function copyFromOther(index) {
  const target = shown.value[index];
  undo.value = { index, gender: target, values: { ...questions.value[index][target] } };
  questions.value[index][target] = { ...questions.value[index][otherOf(target)] };
  emitQuestions();
  clearTimeout(undoTimer);
  undoTimer = setTimeout(() => { undo.value = null; }, 8000);
}
function undoCopy() {
  if (!undo.value) return;
  const { index, gender, values } = undo.value;
  questions.value[index][gender] = values;
  undo.value = null;
  emitQuestions();
}
function showGender(index, gender) {
  shown.value[index] = gender;
  if (undo.value?.index === index) undo.value = null;
}
onBeforeUnmount(() => clearTimeout(undoTimer));

emitQuestions();
</script>

<template>
  <AccordionPanel :value="header.id">
    <AccordionHeader>
      <span class="header-title">{{ header.title }}</span>
      <Tag v-if="showErrors && missing" severity="danger" :value="$t('questions_missing', { count: missing })" class="ms-2" />
    </AccordionHeader>
    <AccordionContent>
      <div class="questions">
        <section v-for="(question, index) in questions" :key="index" class="question-card">
          <header class="question-bar">
            <h3 class="question-number">{{ $t("question") }} {{ index + 1 }}</h3>
            <div class="question-tools">
              <SelectButton :modelValue="shown[index]" :options="genders" :allowEmpty="false"
                :aria-label="$t('side_profile_wording.gender_tabs')" @update:modelValue="showGender(index, $event)">
                <template #option="{ option }">
                  <span>{{ $t(option) }}</span>
                  <span v-if="titleMissing(question, option)" class="error-marker" :title="$t('side_profile_wording.title_missing')">!</span>
                </template>
              </SelectButton>
              <Button type="button" size="small" severity="secondary" variant="outlined" icon="pi pi-clone"
                :label="$t(`side_profile_wording.copy_from_${otherOf(shown[index])}`)" :disabled="!otherHasText(index)"
                v-tooltip.top="$t('side_profile_wording.copy_hint')" @click="copyFromOther(index)" />
            </div>
          </header>

          <Message v-if="undo?.index === index" severity="success" size="small" :closable="false" class="undo-note">
            <span>{{ $t(`side_profile_wording.copied_from_${otherOf(undo.gender)}`) }}</span>
            <Button type="button" size="small" variant="link" :label="$t('undo')" @click="undoCopy" />
          </Message>

          <div class="field">
            <label :for="`q-${header.id}-${index}-${shown[index]}-title`">{{ $t(`side_profile_wording.title_${shown[index]}`) }}</label>
            <Textarea :id="`q-${header.id}-${index}-${shown[index]}-title`" :modelValue="question[shown[index]].title"
              rows="1" autoResize fluid :invalid="titleMissing(question, shown[index])"
              @update:modelValue="setText(index, 'title', $event)" />
            <small v-if="titleMissing(question, shown[index])" class="field-error">{{ $t("field_required") }}</small>
          </div>
          <div class="answer-fields">
            <div v-for="answer in ['yes', 'no']" :key="answer" class="field">
              <label :for="`q-${header.id}-${index}-${shown[index]}-${answer}`">{{ $t(`side_profile_wording.answer_${answer}`) }}</label>
              <Textarea :id="`q-${header.id}-${index}-${shown[index]}-${answer}`" :modelValue="question[shown[index]][answer]"
                rows="2" autoResize fluid @update:modelValue="setText(index, answer, $event)" />
            </div>
          </div>
        </section>
        <div class="questions-actions">
          <Button type="button" size="small" variant="outlined" :severity="canAdd ? 'success' : 'danger'"
            :icon="canAdd ? 'pi pi-plus' : 'pi pi-minus'"
            :label="canAdd ? $t('add_third_question') : $t('remove_third_question')" @click="toggleThird" />
        </div>
      </div>
    </AccordionContent>
  </AccordionPanel>
</template>

<style scoped>
.header-title { font-size: 1.05rem; font-weight: 700; }
.questions { display: grid; gap: 1rem; }
.question-card { display: grid; gap: .75rem; padding: 1rem; border: 1px solid var(--sawa-border); border-radius: .75rem; background: #fff; }
.question-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .5rem; }
.question-number { margin: 0; font-size: 1rem; font-weight: 700; color: var(--sawa-primary); }
.question-tools { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; }
.error-marker { color: #fff; background: #dc2626; border-radius: 50%; width: 1.1rem; height: 1.1rem; display: inline-grid; place-items: center; font-size: .75rem; margin-inline-start: .4rem; }
.undo-note :deep(.p-message-text) { display: flex; align-items: center; gap: .5rem; }
.answer-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .75rem; }
.field { display: grid; gap: .35rem; }
.field label { font-weight: 600; text-align: start; }
.field-error { color: #dc2626; }
.questions-actions { display: flex; justify-content: flex-end; }
@media (max-width: 700px) { .answer-fields { grid-template-columns: 1fr; } }
</style>
