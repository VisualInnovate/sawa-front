<script setup>
// «تعديل الإجابات» of a VB-MAPP evaluation that is not approved yet: every answered sub-goal by level and domain with
// its score (0 / ½ / 1). Saving sends a rejected evaluation for approval again. Answers carried from the previous
// evaluation, the EESA's and those of an approved part are shown locked.
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
const levels = ref([]);
const original = ref({});
const tab = ref(0);
const SCORES = [{ value: 0, label: "0" }, { value: 0.5, label: "½" }, { value: 1, label: "1" }];

const answers = computed(() => levels.value.flatMap((level) => level.domains.flatMap((domain) => domain.answers)));
const changed = computed(() => answers.value.filter((answer) => answer.editable && answer.score !== original.value[answer.id]));

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get(`api/milestone-answers/evaluation/${props.evaluationId}/edit`);
    levels.value = data.data.levels;
    original.value = Object.fromEntries(answers.value.map((answer) => [answer.id, answer.score]));
    tab.value = Math.min(tab.value, Math.max(0, levels.value.length - 1));
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
    await axios.put(`api/milestone-answers/evaluation/${props.evaluationId}/edit`, {
      answers: changed.value.map((answer) => ({ id: answer.id, score: answer.score })),
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
  <Dialog v-model:visible="open" modal :header="$t('mae_title')" :style="{ width: '60rem' }" :breakpoints="{ '1000px': '96vw' }">
    <div v-if="loading" class="mae-loading"><i class="pi pi-spin pi-spinner" /></div>
    <template v-else-if="levels.length">
      <p class="mae-hint"><i class="pi pi-info-circle" /> {{ $t("mae_hint") }}</p>
      <div class="mae-tabs" role="tablist">
        <button v-for="(level, i) in levels" :key="level.level_id" type="button" role="tab" class="mae-tab" :class="{ 'is-active': tab === i }"
          :aria-selected="tab === i" @click="tab = i">{{ level.level }}</button>
      </div>
      <Transition name="mae-fade" mode="out-in">
        <div :key="tab" class="mae-body">
          <section v-for="domain in levels[tab].domains" :key="domain.domain" class="mae-domain">
            <h3><span class="ltr">{{ domain.symbol }}</span> {{ domain.domain }}</h3>
            <div v-for="answer in domain.answers" :key="answer.id" class="mae-row" :class="{ 'is-locked': !answer.editable, 'is-changed': answer.editable && answer.score !== original[answer.id] }">
              <span class="mae-num ltr">{{ answer.number }}</span>
              <span class="mae-text">{{ answer.wording }}</span>
              <SelectButton v-model="answer.score" :options="SCORES" optionLabel="label" optionValue="value" :allowEmpty="false"
                :disabled="!answer.editable" :aria-label="answer.wording" />
              <i v-if="!answer.editable" class="pi pi-lock mae-lock" v-tooltip.top="$t('mae_locked')" />
            </div>
          </section>
        </div>
      </Transition>
    </template>
    <p v-else class="mae-empty">{{ $t("mae_empty") }}</p>
    <template #footer>
      <span class="mae-count">{{ $t("mae_changed", { n: changed.length }) }}</span>
      <Button :label="$t('cancel')" variant="text" severity="secondary" @click="open = false" />
      <Button icon="pi pi-save" :label="$t('save')" :loading="saving" :disabled="!changed.length" @click="save" />
    </template>
  </Dialog>
</template>

<style scoped>
.mae-loading { display: grid; place-items: center; min-height: 10rem; font-size: 1.6rem; color: #135c65; }
.mae-hint { display: flex; gap: .4rem; margin: 0 0 .7rem; color: #64748b; font-size: .85rem; }
.mae-tabs { display: flex; flex-wrap: wrap; gap: .4rem; margin-bottom: .7rem; }
.mae-tab { padding: .35rem .9rem; border-radius: 999px; border: 1px solid #cbd5e1; background: #fff; cursor: pointer; font: inherit; font-weight: 700; color: #475569; transition: all .2s; }
.mae-tab:hover { border-color: #0f8a7e; }
.mae-tab.is-active { background: #135c65; border-color: #135c65; color: #fff; }
.mae-body { display: grid; gap: .8rem; max-height: 60vh; overflow: auto; padding-inline-end: .3rem; }
.mae-domain h3 { margin: 0 0 .35rem; padding: .35rem .6rem; border-radius: 8px; background: #e0f2f1; color: #0f3d43; font-size: .95rem; }
.mae-row { display: grid; grid-template-columns: 2rem 1fr auto 1.2rem; align-items: center; gap: .6rem; padding: .4rem .5rem; border-bottom: 1px solid #f1f5f9; border-radius: 8px; transition: background .2s; }
.mae-row.is-changed { background: #fffbeb; }
.mae-row.is-locked { color: #94a3b8; }
.mae-num { font-weight: 800; color: #0f8a7e; text-align: center; }
.mae-text { line-height: 1.5; }
.mae-lock { color: #94a3b8; }
.mae-count { margin-inline-end: auto; color: #64748b; font-size: .85rem; }
.mae-empty { color: #94a3b8; text-align: center; }
.mae-fade-enter-active, .mae-fade-leave-active { transition: opacity .2s ease; }
.mae-fade-enter-from, .mae-fade-leave-to { opacity: 0; }
</style>
