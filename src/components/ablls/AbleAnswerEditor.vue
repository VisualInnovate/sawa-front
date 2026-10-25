<script setup>
// «تعديل الإجابات» of an ABLLS or Ablls OT evaluation that is not approved yet: each answered skill by domain with its
// score (0, or one of the skill's scores as the evaluation screen offers). Saving sends a rejected evaluation for
// approval again. `api` is the assessment's prefix: "able" or "skills".
import axios from "axios";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";

const props = defineProps({
  evaluationId: { type: [Number, String], required: true },
  api: { type: String, default: "able" },
});
const emit = defineEmits(["saved"]);
const { t } = useI18n();
const toast = useToast();

const open = ref(false);
const loading = ref(false);
const saving = ref(false);
const domains = ref([]);
const original = ref({});
const tab = ref(0);
const url = () => `api/${props.api}-answer/evaluation/${props.evaluationId}/edit`;

const skills = computed(() => domains.value.flatMap((domain) => domain.skills));
const changed = computed(() => skills.value.filter((skill) => skill.score !== original.value[skill.mission_id]));
const options = (skill) => skill.scores.map((value) => ({ value, label: String(value) }));
const domainChanged = (domain) => domain.skills.some((skill) => skill.score !== original.value[skill.mission_id]);

async function load() {
  loading.value = true;
  try {
    domains.value = (await axios.get(url())).data.data.domains;
    original.value = Object.fromEntries(skills.value.map((skill) => [skill.mission_id, skill.score]));
    tab.value = Math.min(tab.value, Math.max(0, domains.value.length - 1));
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
    await axios.put(url(), { answers: changed.value.map((skill) => ({ mission_id: skill.mission_id, score: skill.score })) });
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
  <Dialog v-model:visible="open" modal :header="$t('mae_title')" :style="{ width: '58rem' }" :breakpoints="{ '1000px': '96vw' }">
    <div v-if="loading" class="aae-loading"><i class="pi pi-spin pi-spinner" /></div>
    <template v-else-if="domains.length">
      <p class="aae-hint"><i class="pi pi-info-circle" /> {{ $t("aae_hint") }}</p>
      <div class="aae-tabs" role="tablist">
        <button v-for="(domain, i) in domains" :key="domain.id" type="button" role="tab" class="aae-tab"
          :class="{ 'is-active': tab === i, 'has-changes': domainChanged(domain) }" :aria-selected="tab === i" @click="tab = i">
          <span class="ltr">{{ domain.symbol }}</span> {{ domain.title }}
        </button>
      </div>
      <Transition name="aae-fade" mode="out-in">
        <div :key="tab" class="aae-body">
          <div v-for="skill in domains[tab].skills" :key="skill.mission_id" class="aae-row" :class="{ 'is-changed': skill.score !== original[skill.mission_id] }">
            <span class="aae-key ltr">{{ skill.key }}</span>
            <span class="aae-text">{{ skill.name }}</span>
            <SelectButton v-model="skill.score" :options="options(skill)" optionLabel="label" optionValue="value" :allowEmpty="false" :aria-label="skill.name" />
          </div>
        </div>
      </Transition>
    </template>
    <p v-else class="aae-empty">{{ $t("mae_empty") }}</p>
    <template #footer>
      <span class="aae-count">{{ $t("mae_changed", { n: changed.length }) }}</span>
      <Button :label="$t('cancel')" variant="text" severity="secondary" @click="open = false" />
      <Button icon="pi pi-save" :label="$t('save')" :loading="saving" :disabled="!changed.length" @click="save" />
    </template>
  </Dialog>
</template>

<style scoped>
.aae-loading { display: grid; place-items: center; min-height: 10rem; font-size: 1.6rem; color: #135c65; }
.aae-hint { display: flex; gap: .4rem; margin: 0 0 .7rem; color: #64748b; font-size: .85rem; }
.aae-tabs { display: flex; flex-wrap: wrap; gap: .4rem; margin-bottom: .7rem; max-height: 7.5rem; overflow: auto; }
.aae-tab { position: relative; padding: .3rem .8rem; border-radius: 999px; border: 1px solid #cbd5e1; background: #fff; cursor: pointer; font: inherit; font-size: .85rem; font-weight: 700; color: #475569; transition: all .2s; }
.aae-tab span { color: #0f8a7e; }
.aae-tab:hover { border-color: #0f8a7e; }
.aae-tab.is-active { background: #135c65; border-color: #135c65; color: #fff; }
.aae-tab.is-active span { color: #99f6e4; }
.aae-tab.has-changes::after { content: ""; position: absolute; top: -2px; inset-inline-end: -2px; width: .55rem; height: .55rem; border-radius: 50%; background: #f59e0b; }
.aae-body { display: grid; gap: .1rem; max-height: 58vh; overflow: auto; padding-inline-end: .3rem; }
.aae-row { display: grid; grid-template-columns: 3.5rem 1fr auto; align-items: center; gap: .6rem; padding: .4rem .5rem; border-bottom: 1px solid #f1f5f9; border-radius: 8px; transition: background .2s; }
.aae-row.is-changed { background: #fffbeb; }
.aae-key { font-weight: 800; color: #0f8a7e; text-align: center; }
.aae-text { line-height: 1.5; }
.aae-count { margin-inline-end: auto; color: #64748b; font-size: .85rem; }
.aae-empty { color: #94a3b8; text-align: center; }
.aae-fade-enter-active, .aae-fade-leave-active { transition: opacity .2s ease; }
.aae-fade-enter-from, .aae-fade-leave-to { opacity: 0; }
</style>
