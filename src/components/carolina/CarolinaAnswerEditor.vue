<script setup>
// «تعديل الإجابات» of a Carolina evaluation that is not approved yet: each answered skill, by domain and general goal,
// with its response (+, -, +-). Saving sends a rejected evaluation for approval again. While a new round of an
// approved evaluation waits, only that round's skills change; the others are shown locked.
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
const domains = ref([]);
const ranges = ref({});
const original = ref({});
const tab = ref(0);
const RESPONSES = [{ value: "+", label: "+" }, { value: "-", label: "−" }, { value: "+-", label: "±" }];

const skills = computed(() => domains.value.flatMap((domain) => domain.goals.flatMap((goal) => goal.skills)));
const changed = computed(() => skills.value.filter((skill) => skill.editable && skill.response !== original.value[skill.id]));
const domainTitle = (domain) => domain.title || t("carolina_ui.no_domain");

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get(`api/carolina-answer/evaluation/${props.evaluationId}/edit`);
    domains.value = data.data.domains;
    ranges.value = Object.fromEntries((data.data.age_ranges ?? []).map((range) => [range.id, range.name]));
    original.value = Object.fromEntries(skills.value.map((skill) => [skill.id, skill.response]));
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
    await axios.put(`api/carolina-answer/evaluation/${props.evaluationId}/edit`, {
      answers: changed.value.map((skill) => ({ skill_id: skill.id, response: skill.response })),
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
    <div v-if="loading" class="cae-loading"><i class="pi pi-spin pi-spinner" /></div>
    <template v-else-if="domains.length">
      <p class="cae-hint"><i class="pi pi-info-circle" /> {{ $t("cae_hint") }}</p>
      <div v-if="domains.length > 1" class="cae-tabs" role="tablist">
        <button v-for="(domain, i) in domains" :key="domain.id ?? 'none'" type="button" role="tab" class="cae-tab" :class="{ 'is-active': tab === i }"
          :aria-selected="tab === i" @click="tab = i">{{ domainTitle(domain) }}</button>
      </div>
      <Transition name="cae-fade" mode="out-in">
        <div :key="tab" class="cae-body">
          <section v-for="goal in domains[tab].goals" :key="goal.id" class="cae-goal">
            <h3>{{ goal.title }}</h3>
            <div v-for="skill in goal.skills" :key="skill.id" class="cae-row"
              :class="{ 'is-locked': !skill.editable, 'is-changed': skill.editable && skill.response !== original[skill.id] }">
              <span class="cae-range ltr">{{ ranges[skill.age_range_id] }}</span>
              <span class="cae-symbol ltr" :style="skill.color ? { '--round': `#${skill.color}` } : null">{{ skill.symbol }}</span>
              <span class="cae-text">{{ skill.skill }}</span>
              <SelectButton v-model="skill.response" :options="RESPONSES" optionLabel="label" optionValue="value" :allowEmpty="false"
                :disabled="!skill.editable" :aria-label="skill.skill" />
              <i v-if="!skill.editable" class="pi pi-lock cae-lock" v-tooltip.top="$t('mae_locked')" />
            </div>
          </section>
        </div>
      </Transition>
    </template>
    <p v-else class="cae-empty">{{ $t("mae_empty") }}</p>
    <template #footer>
      <span class="cae-count">{{ $t("mae_changed", { n: changed.length }) }}</span>
      <Button :label="$t('cancel')" variant="text" severity="secondary" @click="open = false" />
      <Button icon="pi pi-save" :label="$t('save')" :loading="saving" :disabled="!changed.length" @click="save" />
    </template>
  </Dialog>
</template>

<style scoped>
.cae-loading { display: grid; place-items: center; min-height: 10rem; font-size: 1.6rem; color: #135c65; }
.cae-hint { display: flex; gap: .4rem; margin: 0 0 .7rem; color: #64748b; font-size: .85rem; }
.cae-tabs { display: flex; flex-wrap: wrap; gap: .4rem; margin-bottom: .7rem; }
.cae-tab { padding: .35rem .9rem; border-radius: 999px; border: 1px solid #cbd5e1; background: #fff; cursor: pointer; font: inherit; font-weight: 700; color: #475569; transition: all .2s; }
.cae-tab:hover { border-color: #0f8a7e; }
.cae-tab.is-active { background: #135c65; border-color: #135c65; color: #fff; }
.cae-body { display: grid; gap: .8rem; max-height: 60vh; overflow: auto; padding-inline-end: .3rem; }
.cae-goal h3 { margin: 0 0 .35rem; padding: .35rem .6rem; border-radius: 8px; background: #e0f2f1; color: #0f3d43; font-size: .95rem; }
.cae-row { display: grid; grid-template-columns: 4.5rem 3rem 1fr auto 1.2rem; align-items: center; gap: .6rem; padding: .4rem .5rem; border-bottom: 1px solid #f1f5f9; border-radius: 8px; transition: background .2s; }
.cae-row.is-changed { background: #fffbeb; }
.cae-row.is-locked { color: #94a3b8; }
.cae-range { font-size: .78rem; color: #64748b; text-align: center; }
.cae-symbol { justify-self: center; padding: .1rem .45rem; border-radius: 6px; border: 1px solid #cbd5e1; font-weight: 800; color: #0f3d43; box-shadow: inset 4px 0 0 var(--round, transparent); }
.cae-text { line-height: 1.5; }
.cae-lock { color: #94a3b8; }
.cae-count { margin-inline-end: auto; color: #64748b; font-size: .85rem; }
.cae-empty { color: #94a3b8; text-align: center; }
.cae-fade-enter-active, .cae-fade-leave-active { transition: opacity .2s ease; }
.cae-fade-enter-from, .cae-fade-leave-to { opacity: 0; }
</style>
