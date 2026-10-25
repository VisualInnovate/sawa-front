<script setup>
// «تعديل الإجابات» of an M-CHAT-R evaluation that is not approved yet: the 20 yes/no answers (a risk answer marked as
// it is chosen), the respondent and the notes, with the total and the risk level scored again as they change.
// Saving sends a rejected evaluation for approval again.
import axios from "axios";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { RISK_SEVERITY, mchatPoint, mchatRisk } from "@/views/evaluation/mchat/mchat";

const props = defineProps({ evaluationId: { type: [Number, String], required: true } });
const emit = defineEmits(["saved"]);
const { t } = useI18n();
const toast = useToast();

const open = ref(false);
const loading = ref(false);
const saving = ref(false);
const questions = ref([]);
const respondent = ref("");
const notes = ref("");
const original = ref("");
const url = () => `api/mchat-answers/evaluation/${props.evaluationId}/edit`;
const YES_NO = computed(() => [{ value: true, label: t("mchat.yes") }, { value: false, label: t("mchat.no") }]);

const snapshot = () => JSON.stringify([questions.value.map((question) => question.yes), respondent.value ?? "", notes.value ?? ""]);
const dirty = computed(() => open.value && !loading.value && snapshot() !== original.value);
const total = computed(() => questions.value.reduce((sum, question) => sum + mchatPoint(question, question.yes), 0));
const risk = computed(() => mchatRisk(total.value));

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get(url());
    questions.value = data.data.questions;
    respondent.value = data.data.respondent ?? "";
    notes.value = data.data.notes ?? "";
    original.value = snapshot();
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
  if (!dirty.value) return;
  saving.value = true;
  try {
    await axios.put(url(), {
      answers: questions.value.map((question) => ({ question: question.number, yes: question.yes })),
      respondent: respondent.value || null,
      notes: notes.value || null,
    });
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
  <Dialog v-model:visible="open" modal :header="$t('mae_title')" :style="{ width: '52rem' }" :breakpoints="{ '1000px': '96vw' }">
    <div v-if="loading" class="mce-loading"><i class="pi pi-spin pi-spinner" /></div>
    <template v-else-if="questions.length">
      <div class="mce-score">
        <span>{{ $t("mchat.total") }}: <b class="ltr">{{ total }} / {{ questions.length }}</b></span>
        <Tag :severity="RISK_SEVERITY[risk]" :value="$t(`mchat.risk_${risk}`)" />
      </div>
      <div class="mce-body">
        <div v-for="question in questions" :key="question.number" class="mce-row" :class="{ 'is-point': mchatPoint(question, question.yes) }">
          <span class="mce-num ltr">{{ question.number }}</span>
          <span class="mce-text">{{ question.text }}</span>
          <SelectButton v-model="question.yes" :options="YES_NO" optionLabel="label" optionValue="value" :allowEmpty="false" :aria-label="question.text" />
        </div>
      </div>
      <div class="mce-extra">
        <label>{{ $t("mchat.respondent") }}<InputText v-model="respondent" :placeholder="$t('mchat.respondent_placeholder')" /></label>
        <label>{{ $t("mchat.notes") }}<Textarea v-model="notes" rows="2" autoResize /></label>
      </div>
    </template>
    <template #footer>
      <Button :label="$t('cancel')" variant="text" severity="secondary" @click="open = false" />
      <Button icon="pi pi-save" :label="$t('save')" :loading="saving" :disabled="!dirty" @click="save" />
    </template>
  </Dialog>
</template>

<style scoped>
.mce-loading { display: grid; place-items: center; min-height: 10rem; font-size: 1.6rem; color: #135c65; }
.mce-score { position: sticky; top: 0; z-index: 1; display: flex; align-items: center; justify-content: space-between; gap: .6rem; margin-bottom: .6rem;
  padding: .5rem .8rem; border-radius: 12px; background: #f0fdfa; color: #0f3d43; }
.mce-body { display: grid; gap: .1rem; max-height: 50vh; overflow: auto; padding-inline-end: .3rem; }
.mce-row { display: grid; grid-template-columns: 2rem 1fr auto; align-items: center; gap: .6rem; padding: .4rem .5rem; border-bottom: 1px solid #f1f5f9; border-radius: 8px; transition: background .2s; }
.mce-row.is-point { background: #fef2f2; }
.mce-num { font-weight: 800; color: #0f8a7e; text-align: center; }
.mce-text { line-height: 1.5; }
.mce-extra { display: grid; grid-template-columns: 1fr 2fr; gap: .8rem; margin-top: .8rem; }
.mce-extra label { display: grid; gap: .3rem; font-weight: 700; color: #334155; }
@media (max-width: 700px) { .mce-extra { grid-template-columns: 1fr; } .mce-row { grid-template-columns: 2rem 1fr; } .mce-row :deep(.p-selectbutton) { grid-column: 2; } }
</style>
