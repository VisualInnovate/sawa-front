<script setup>
// «تعديل الإجابات» of a Transition evaluation that is not approved yet: each ordinary question with its answers (0
// «لم يُقيّم», 1–5 in the child's wording); the automatic ones (from Milestones and Barriers) are shown locked. Saving
// sends a rejected evaluation for approval again.
import axios from "axios";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";

const props = defineProps({ evaluationId: { type: [Number, String], required: true } });
const emit = defineEmits(["saved"]);
const { t } = useI18n();
const toast = useToast();

const open = ref(false);
const loading = ref(false);
const saving = ref(false);
const questions = ref([]);
const original = ref({});
const url = () => `api/transition-answers/evaluation/${props.evaluationId}/edit`;

const changed = computed(() => questions.value.filter((question) => !question.automatic && question.score !== original.value[question.question_id]));
const optionsOf = (question) => question.answers.map((answer) => ({ value: answer.score, label: `${answer.score} — ${answer.text}` }));

async function load() {
  loading.value = true;
  try {
    questions.value = (await axios.get(url())).data.data.questions;
    original.value = Object.fromEntries(questions.value.map((question) => [question.question_id, question.score]));
  } catch (e) {
    open.value = false;
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message ?? t("mission_error"), life: 3000 });
  } finally {
    loading.value = false;
  }
}
function start() {
  open.value = true;
  load();
}
async function save() {
  if (!changed.value.length) return;
  saving.value = true;
  try {
    await axios.put(url(), { answers: changed.value.map((question) => ({ question_id: question.question_id, score: question.score })) });
    toast.add({ severity: "success", summary: t("success_message"), detail: t("mae_saved"), life: 2500 });
    open.value = false;
    emit("saved");
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message ?? t("mission_error"), life: 3500 });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <Button icon="pi pi-pencil" :label="$t('mae_edit')" severity="warn" variant="outlined" class="print:hidden" @click="start" />
  <Dialog v-model:visible="open" modal :header="$t('mae_title')" :style="{ width: '56rem' }" :breakpoints="{ '1000px': '96vw' }">
    <div v-if="loading" class="tae-loading"><i class="pi pi-spin pi-spinner" /></div>
    <template v-else-if="questions.length">
      <p class="tae-hint"><i class="pi pi-info-circle" /> {{ $t("tae_hint") }}</p>
      <div class="tae-body">
        <div v-for="(question, i) in questions" :key="question.question_id" class="tae-row"
          :class="{ 'is-locked': question.automatic, 'is-changed': !question.automatic && question.score !== original[question.question_id] }"
          :style="{ '--d': `${Math.min(i, 14) * 20}ms` }">
          <span class="tae-num ltr">{{ i + 1 }}</span>
          <span class="tae-text">{{ question.title }}</span>
          <template v-if="question.automatic">
            <span class="tae-auto"><i class="pi pi-lock" /> {{ $t("tae_automatic", { score: question.score }) }}</span>
          </template>
          <Select v-else v-model="question.score" :options="optionsOf(question)" optionLabel="label" optionValue="value" class="tae-select" :aria-label="question.title" />
        </div>
      </div>
    </template>
    <p v-else class="tae-empty">{{ $t("mae_empty") }}</p>
    <template #footer>
      <span class="tae-count">{{ $t("mae_changed", { n: changed.length }) }}</span>
      <Button :label="$t('cancel')" variant="text" severity="secondary" @click="open = false" />
      <Button icon="pi pi-save" :label="$t('save')" :loading="saving" :disabled="!changed.length" @click="save" />
    </template>
  </Dialog>
</template>

<style scoped>
.tae-loading { display: grid; place-items: center; min-height: 10rem; font-size: 1.6rem; color: #135c65; }
.tae-hint { display: flex; gap: .4rem; margin: 0 0 .7rem; color: #64748b; font-size: .85rem; }
.tae-body { display: grid; gap: .15rem; max-height: 62vh; overflow: auto; padding-inline-end: .3rem; }
.tae-row { display: grid; grid-template-columns: 2rem 1fr minmax(14rem, 22rem); align-items: center; gap: .6rem; padding: .45rem .5rem; border-bottom: 1px solid #f1f5f9;
  border-radius: 8px; transition: background .2s; animation: tae-in .3s var(--d) ease both; }
.tae-row.is-changed { background: #fffbeb; }
.tae-row.is-locked { color: #94a3b8; }
.tae-num { font-weight: 800; color: #0f8a7e; text-align: center; }
.tae-text { line-height: 1.5; }
.tae-select { width: 100%; }
.tae-auto { display: inline-flex; align-items: center; gap: .35rem; font-size: .85rem; }
.tae-count { margin-inline-end: auto; color: #64748b; font-size: .85rem; }
.tae-empty { color: #94a3b8; text-align: center; }
@keyframes tae-in { from { opacity: 0; transform: translateY(6px); } }
@media (max-width: 700px) { .tae-row { grid-template-columns: 2rem 1fr; } .tae-select, .tae-auto { grid-column: 1 / -1; } }
</style>
