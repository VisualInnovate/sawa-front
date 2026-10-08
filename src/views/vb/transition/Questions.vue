<script setup>
// Transition questions: an area (title), its place in the form and five answers (scores 1-5 in order); the title
// and each answer worded for a boy and a girl ({{name}} = the child's first name). The automatic ones (answered from Milestones / Barriers) are fixed: shown, never edited or deleted.
import { computed, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import axios from "axios";
import GenderTextField from "../../../components/GenderTextField.vue";
import NameTokenHint from "../../../components/NameTokenHint.vue";

const { t } = useI18n();
const toast = useToast();

const loading = ref(true);
const questions = ref([]);
const expanded = ref({});
const dialog = ref(false);
const saving = ref(false);
const form = ref(null);
const errors = ref({});
const deleteTarget = ref(null);

const titleHasError = computed(() => !!(errors.value.wording || errors.value["wording.male"] || errors.value["wording.female"]));
const titleError = computed(() => (errors.value.wording || errors.value["wording.male"] || errors.value["wording.female"])?.[0]);
const answerHasError = (i) => !!(errors.value[`answers.${i}`] || errors.value[`answers.${i}.male`] || errors.value[`answers.${i}.female`]);
const answersError = computed(() => (errors.value.answers
  || Object.entries(errors.value).find(([key]) => key.startsWith("answers."))?.[1])?.[0]);

const blankAnswer = () => ({ male: "", female: "" });
const blank = () => ({ id: null, title: blankAnswer(), display_order: nextOrder(), answers: [1, 2, 3, 4, 5].map(blankAnswer) });
// A title or answer saved before the boy/girl wording has only its text: both start from it.
const answerWording = (answer) => ({ male: answer?.wording?.male ?? answer?.text ?? "", female: answer?.wording?.female ?? answer?.text ?? "" });
const nextOrder = () => Math.max(0, ...questions.value.map((q) => Number(q.display_order) || 0)) + 1;

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get("/api/transition-questions");
    questions.value = data.data ?? [];
  } finally {
    loading.value = false;
  }
}

function openNew() {
  errors.value = {};
  form.value = blank();
  dialog.value = true;
}

function openEdit(question) {
  errors.value = {};
  form.value = {
    id: question.id,
    title: { male: question.wording?.male ?? question.title ?? "", female: question.wording?.female ?? question.title ?? "" },
    display_order: question.display_order,
    answers: [1, 2, 3, 4, 5].map((score) => answerWording(question.answers?.find((answer) => answer.score === score))),
  };
  dialog.value = true;
}

async function save() {
  saving.value = true;
  errors.value = {};
  const payload = { wording: form.value.title, display_order: form.value.display_order, answers: form.value.answers };
  try {
    if (form.value.id) await axios.put(`/api/transition-questions/${form.value.id}`, payload);
    else await axios.post("/api/transition-questions", payload);
    dialog.value = false;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("successful"), life: 3000 });
    load();
  } catch (error) {
    errors.value = error.response?.data?.errors ?? {};
    if (!Object.keys(errors.value).length) {
      toast.add({ severity: "error", summary: t("error"), detail: error.response?.data?.message || t("request_failed_retry"), life: 5000 });
    }
  } finally {
    saving.value = false;
  }
}

async function remove() {
  const question = deleteTarget.value;
  deleteTarget.value = null;
  try {
    await axios.delete(`/api/transition-questions/${question.id}`);
    toast.add({ severity: "success", summary: t("success_message"), detail: t("successful"), life: 3000 });
    load();
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: error.response?.data?.message || t("request_failed_retry"), life: 5000 });
  }
}

onMounted(load);
</script>

<template>
  <div class="page tq-page">
    <Toast />
    <header class="tq-head">
      <div>
        <h1 class="page-title">{{ $t("transition.questions_title") }}</h1>
        <p class="tq-hint"><i class="pi pi-lock" aria-hidden="true" /> {{ $t("transition.auto_hint") }}</p>
      </div>
      <Button v-can="'transition question create'" icon="pi pi-plus" :label="$t('transition.add')" @click="openNew" />
    </header>

    <DataTable :value="questions" :loading="loading" dataKey="id" v-model:expandedRows="expanded" responsiveLayout="scroll">
      <template #empty>{{ $t("transition.no_questions") }}</template>
      <Column expander style="width: 3rem" />
      <Column field="display_order" :header="$t('transition.display_order')" style="width: 7rem" />
      <Column field="title" :header="$t('transition.question_title')">
        <template #body="{ data }">
          <span v-if="data.wording" class="tq-title tq-wording">
            <span><em>{{ $t("male") }}:</em> {{ data.wording.male }}</span>
            <span><em>{{ $t("female") }}:</em> {{ data.wording.female }}</span>
          </span>
          <span v-else class="tq-title">{{ data.title }}</span>
          <Tag v-if="data.is_auto" class="tq-auto" icon="pi pi-lock" severity="secondary" :value="$t('transition.auto')" />
        </template>
      </Column>
      <Column style="width: 8rem">
        <template #body="{ data }">
          <div v-if="!data.is_auto" class="table-actions">
            <Button v-can="'transition question edit'" icon="pi pi-pencil" rounded severity="info" variant="outlined"
              v-tooltip.top="$t('edit')" :aria-label="$t('edit')" @click="openEdit(data)" />
            <Button v-can="'transition question delete'" icon="pi pi-trash" rounded severity="danger" variant="outlined"
              v-tooltip.top="$t('delete')" :aria-label="$t('delete')" @click="deleteTarget = data" />
          </div>
        </template>
      </Column>
      <template #expansion="{ data }">
        <ol class="tq-answers">
          <li v-for="answer in data.answers" :key="answer.id">
            <b>{{ answer.score }}</b>
            <span v-if="answer.wording" class="tq-wording">
              <span><em>{{ $t("male") }}:</em> {{ answer.wording.male }}</span>
              <span><em>{{ $t("female") }}:</em> {{ answer.wording.female }}</span>
            </span>
            <span v-else>{{ answer.text }}</span>
          </li>
        </ol>
      </template>
    </DataTable>

    <Dialog v-model:visible="dialog" :header="form?.id ? $t('transition.edit') : $t('transition.add')" modal :style="{ width: '640px' }" :breakpoints="{ '700px': '95vw' }">
      <form v-if="form" class="tq-form" @submit.prevent="save">
        <NameTokenHint :text="$t('barrier_wording.name_hint')" />
        <div class="tq-row">
          <div class="tq-field tq-grow">
            <GenderTextField v-model="form.title" :label="$t('transition.question_title')" inputId="tq-title" :rows="1"
              :showErrors="titleHasError" />
            <small v-if="titleError" class="tq-error">{{ titleError }}</small>
          </div>
          <div class="tq-field tq-order">
            <label for="tq-order">{{ $t("transition.display_order") }}</label>
            <InputNumber inputId="tq-order" v-model="form.display_order" :min="0" :useGrouping="false" required />
            <small v-if="errors.display_order" class="tq-error">{{ errors.display_order[0] }}</small>
          </div>
        </div>
        <fieldset class="tq-field">
          <legend>{{ $t("transition.answers") }}</legend>
          <small class="tq-hint">{{ $t("transition.answers_hint") }}</small>
          <div v-for="(answer, i) in form.answers" :key="i" class="tq-answer">
            <span class="tq-score">{{ i + 1 }}</span>
            <GenderTextField v-model="form.answers[i]" class="tq-answer-text" :label="$t('transition.answer_n', { n: i + 1 })"
              :inputId="'tq-answer-' + i" :rows="2" :showErrors="answerHasError(i)" />
          </div>
          <small v-if="answersError" class="tq-error">{{ answersError }}</small>
        </fieldset>
        <div class="tq-actions">
          <Button type="button" :label="$t('cancel')" severity="secondary" variant="text" @click="dialog = false" />
          <Button type="submit" :label="$t('submit')" icon="pi pi-check" :loading="saving" />
        </div>
      </form>
    </Dialog>

    <Dialog :visible="!!deleteTarget" :header="$t('submit')" modal :style="{ width: '420px' }" @update:visible="deleteTarget = null">
      <p>{{ $t("transition.delete_confirm") }} <b>{{ deleteTarget?.title }}</b></p>
      <template #footer>
        <Button :label="$t('no')" icon="pi pi-times" variant="text" severity="secondary" @click="deleteTarget = null" />
        <Button :label="$t('yes')" icon="pi pi-check" severity="danger" @click="remove" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.tq-page { display: grid; gap: 1rem; }
.tq-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; }
.tq-head h1 { margin: 0; }
.tq-hint { margin: .25rem 0 0; color: var(--sawa-muted); font-size: .85rem; }
.tq-title { font-weight: 600; }
.tq-auto { margin-inline-start: .5rem; }
.tq-answers { margin: 0; padding: .5rem 1rem; list-style: none; display: grid; gap: .35rem; }
.tq-answers b { display: inline-grid; place-items: center; width: 1.6rem; height: 1.6rem; margin-inline-end: .5rem; border-radius: 6px; background: #edf7f5; color: var(--sawa-primary); }
.tq-form { display: grid; gap: 1rem; }
.tq-row { display: flex; flex-wrap: wrap; gap: 1rem; }
.tq-field { display: grid; gap: .4rem; border: 0; padding: 0; margin: 0; }
.tq-field legend, .tq-field label { font-weight: 700; }
.tq-grow { flex: 1 1 16rem; }
.tq-order { width: 8rem; }
.tq-answer { display: flex; align-items: flex-start; gap: .5rem; }
.tq-answer-text { flex: 1; min-width: 0; }
.tq-wording { display: inline-grid; gap: .2rem; vertical-align: top; }
.tq-wording em { font-style: normal; color: var(--sawa-muted); }
.tq-score { display: grid; place-items: center; flex: none; width: 2rem; height: 2.4rem; border-radius: 8px; background: var(--sawa-primary, #135c65); color: #fff; font-weight: 800; }
.tq-error { color: #dc2626; }
.tq-actions { display: flex; justify-content: flex-end; gap: .5rem; }
</style>
