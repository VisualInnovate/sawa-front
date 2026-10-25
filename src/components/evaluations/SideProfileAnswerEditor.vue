<script setup>
// «تعديل الإجابات» of a side-profile result that is not approved yet: the evaluation's questions by header with the
// child's yes / no (in their gender's wording). The growth age, the difference and the delay are worked out again on
// save. Saving sends a rejected result for approval again.
import axios from "axios";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";

const props = defineProps({ resultId: { type: [Number, String], required: true } });
const emit = defineEmits(["saved"]);
const { t } = useI18n();
const toast = useToast();

const open = ref(false);
const loading = ref(false);
const saving = ref(false);
const headers = ref([]);
const original = ref({});
const tab = ref(0);
const url = () => `api/side-profile-results/${props.resultId}/edit`;

const questions = computed(() => headers.value.flatMap((header) => header.questions));
const changed = computed(() => questions.value.filter((question) => question.value !== original.value[question.question_id]));
const optionsOf = (question) => [
  { value: true, label: question.yes || t("mchat.yes") },
  { value: false, label: question.no || t("mchat.no") },
];
const headerChanged = (header) => header.questions.some((question) => question.value !== original.value[question.question_id]);

async function load() {
  loading.value = true;
  try {
    headers.value = (await axios.get(url())).data.data.headers;
    original.value = Object.fromEntries(questions.value.map((question) => [question.question_id, question.value]));
    tab.value = Math.min(tab.value, Math.max(0, headers.value.length - 1));
  } catch (e) {
    open.value = false;
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message ?? t("mission_error"), life: 3500 });
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
    await axios.put(url(), { answers: changed.value.map((question) => ({ question_id: question.question_id, value: question.value })) });
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
    <div v-if="loading" class="spe-loading"><i class="pi pi-spin pi-spinner" /></div>
    <template v-else-if="headers.length">
      <p class="spe-hint"><i class="pi pi-info-circle" /> {{ $t("spe_hint") }}</p>
      <div v-if="headers.length > 1" class="spe-tabs" role="tablist">
        <button v-for="(header, i) in headers" :key="header.id" type="button" role="tab" class="spe-tab"
          :class="{ 'is-active': tab === i, 'has-changes': headerChanged(header) }" :aria-selected="tab === i" @click="tab = i">{{ header.title }}</button>
      </div>
      <Transition name="spe-fade" mode="out-in">
        <div :key="tab" class="spe-body">
          <div v-for="(question, i) in headers[tab].questions" :key="question.question_id" class="spe-row"
            :class="{ 'is-changed': question.value !== original[question.question_id] }">
            <span class="spe-num ltr">{{ i + 1 }}</span>
            <span class="spe-text">{{ question.title }}</span>
            <SelectButton v-model="question.value" :options="optionsOf(question)" optionLabel="label" optionValue="value" :allowEmpty="false" :aria-label="question.title" />
          </div>
        </div>
      </Transition>
    </template>
    <p v-else class="spe-empty">{{ $t("mae_empty") }}</p>
    <template #footer>
      <span class="spe-count">{{ $t("mae_changed", { n: changed.length }) }}</span>
      <Button :label="$t('cancel')" variant="text" severity="secondary" @click="open = false" />
      <Button icon="pi pi-save" :label="$t('save')" :loading="saving" :disabled="!changed.length" @click="save" />
    </template>
  </Dialog>
</template>

<style scoped>
.spe-loading { display: grid; place-items: center; min-height: 10rem; font-size: 1.6rem; color: #135c65; }
.spe-hint { display: flex; gap: .4rem; margin: 0 0 .7rem; color: #64748b; font-size: .85rem; }
.spe-tabs { display: flex; flex-wrap: wrap; gap: .4rem; margin-bottom: .7rem; }
.spe-tab { position: relative; padding: .3rem .8rem; border-radius: 999px; border: 1px solid #cbd5e1; background: #fff; cursor: pointer; font: inherit; font-size: .85rem; font-weight: 700; color: #475569; transition: all .2s; }
.spe-tab:hover { border-color: #0f8a7e; }
.spe-tab.is-active { background: #135c65; border-color: #135c65; color: #fff; }
.spe-tab.has-changes::after { content: ""; position: absolute; top: -2px; inset-inline-end: -2px; width: .55rem; height: .55rem; border-radius: 50%; background: #f59e0b; }
.spe-body { display: grid; gap: .1rem; max-height: 58vh; overflow: auto; padding-inline-end: .3rem; }
.spe-row { display: grid; grid-template-columns: 2rem 1fr auto; align-items: center; gap: .6rem; padding: .4rem .5rem; border-bottom: 1px solid #f1f5f9; border-radius: 8px; transition: background .2s; }
.spe-row.is-changed { background: #fffbeb; }
.spe-num { font-weight: 800; color: #0f8a7e; text-align: center; }
.spe-text { line-height: 1.5; }
.spe-count { margin-inline-end: auto; color: #64748b; font-size: .85rem; }
.spe-empty { color: #94a3b8; text-align: center; }
.spe-fade-enter-active, .spe-fade-leave-active { transition: opacity .2s ease; }
.spe-fade-enter-from, .spe-fade-leave-to { opacity: 0; }
@media (max-width: 700px) { .spe-row { grid-template-columns: 2rem 1fr; } .spe-row :deep(.p-selectbutton) { grid-column: 2; } }
</style>
