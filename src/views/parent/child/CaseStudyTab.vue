<script setup>
// «دراسة حالة الطالب» in the parents' portal: the form the academy sent for this child, one part at a time. What is
// filled in is saved as a draft on every step; handing it in closes it and shows it on the child's file at the academy.
import { computed, onMounted, ref } from "vue";
import axios from "axios";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import CaseStudyAnswers from "@/components/caseStudy/CaseStudyAnswers.vue";
import CaseStudyField from "@/components/caseStudy/CaseStudyField.vue";
import EmptyState from "@/components/parent/EmptyState.vue";
import { isVisible, unanswered, visibleAnswers } from "@/utils/caseStudy";
import { fmtDate } from "@/utils/parentPortal";

const props = defineProps({ child: { type: Object, required: true }, childId: { type: [Number, String], required: true } });
const emit = defineEmits(["changed"]);
const toast = useToast();
const { t } = useI18n();

const loading = ref(true);
const failed = ref(false);
const sections = ref([]);
const study = ref(null);
const answers = ref({});
const step = ref(0);
const saving = ref(false);
const dirty = ref(false);
const confirming = ref(false);
const top = ref(null);

const open = computed(() => study.value?.status === "sent");
const section = computed(() => sections.value[step.value] ?? null);
const shown = computed(() => (section.value?.questions ?? []).filter((question) => isVisible(question, kept.value)));
const kept = computed(() => visibleAnswers(sections.value, answers.value));
const missing = computed(() => unanswered(sections.value, answers.value));
const missingIn = (item) => missing.value.filter((question) => item.questions.includes(question)).length;
const total = computed(() => sections.value.flatMap((item) => item.questions).filter((question) => isVisible(question, kept.value) && !question.optional).length);
const progress = computed(() => (total.value ? Math.round(((total.value - missing.value.length) / total.value) * 100) : 0));
// A heading above the first question of a group (the ways the child asks for things).
const startsGroup = (question, index) => question.group && shown.value[index - 1]?.group !== question.group;

async function load() {
  loading.value = true;
  failed.value = false;
  try {
    const { data } = await axios.get(`/api/parent/child/${props.childId}/case-study`);
    sections.value = data.form ?? [];
    study.value = data.data;
    answers.value = { ...(data.data?.answers ?? {}) };
    dirty.value = false;
  } catch {
    failed.value = true;
  } finally {
    loading.value = false;
  }
}
onMounted(load);

function setAnswer(key, value) {
  if (value === null) delete answers.value[key];
  else answers.value[key] = value;
  dirty.value = true;
  confirming.value = false;
}

async function save(submit = false) {
  if (saving.value) return false;
  saving.value = true;
  try {
    const { data } = await axios.put(`/api/parent/child/${props.childId}/case-study/${study.value.id}`, { answers: kept.value, submit });
    study.value = data.data;
    answers.value = { ...data.data.answers };
    dirty.value = false;
    if (submit) {
      toast.add({ severity: "success", summary: t("cs.submitted_toast"), life: 4000 });
      emit("changed");
    }
    return true;
  } catch (error) {
    toast.add({ severity: "error", summary: error.response?.data?.message || t("request_failed_retry"), life: 5000 });
    return false;
  } finally {
    saving.value = false;
  }
}

async function go(index) {
  if (index < 0 || index >= sections.value.length || index === step.value) return;
  if (dirty.value && !(await save())) return;
  step.value = index;
  confirming.value = false;
  top.value?.scrollIntoView({ behavior: "smooth", block: "start" });
}
async function saveDraft() {
  if (await save()) toast.add({ severity: "success", summary: t("cs.draft_saved"), life: 2500 });
}
function submit() {
  if (missing.value.length && !confirming.value) {
    confirming.value = true;
    return;
  }
  save(true);
}
</script>

<template>
  <div ref="top" class="cs-tab pp-stack">
    <div v-if="loading" class="pp-skeleton" style="height: 320px" />
    <EmptyState v-else-if="failed" icon="pi pi-exclamation-circle" :text="$t('request_failed_retry')">
      <button type="button" class="pp-btn pp-btn--soft" @click="load">{{ $t("cs.retry") }}</button>
    </EmptyState>
    <EmptyState v-else-if="!study" icon="pi pi-file-edit" :title="$t('cs.title')" :text="$t('cs.parent_none')" />

    <!-- Handed in: reading only -->
    <template v-else-if="!open">
      <section class="pp-card pp-card--pad pp-stack">
        <div class="pp-row pp-between">
          <h2 class="pp-h2"><i class="pi pi-file-edit text-[var(--pp-teal)]" /> {{ $t("cs.title") }}</h2>
          <span class="pp-tag pp-tag--success"><i class="pi pi-check-circle" /> {{ $t("cs.parent_done", { date: fmtDate(study.submitted_at) }) }}</span>
        </div>
        <p class="pp-lead m-0">{{ $t("cs.parent_done_hint") }}</p>
        <CaseStudyAnswers :sections="sections" :answers="study.answers" answered-only />
      </section>
    </template>

    <!-- Waiting for the parent -->
    <template v-else>
      <section class="pp-card pp-card--pad pp-stack">
        <h2 class="pp-h2"><i class="pi pi-file-edit text-[var(--pp-teal)]" /> {{ $t("cs.title") }}</h2>
        <p class="pp-lead m-0">{{ $t("cs.parent_lead", { name: child.name }) }}</p>
        <div class="cs-progress" role="progressbar" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100" :aria-label="$t('cs.progress', { n: progress })">
          <div class="pp-bar"><span :style="{ width: `${progress}%` }" /></div>
          <span class="pp-muted text-sm">{{ $t("cs.progress", { n: progress }) }}</span>
        </div>
        <nav class="cs-steps" :aria-label="$t('cs.parts')">
          <button v-for="(item, index) in sections" :key="item.key" type="button" class="cs-step" :class="{ 'is-active': index === step, 'is-done': !missingIn(item) }"
            :aria-current="index === step ? 'step' : undefined" @click="go(index)">
            <span class="cs-step__n"><i v-if="!missingIn(item)" class="pi pi-check" /><template v-else>{{ index + 1 }}</template></span>
            <span class="cs-step__t">{{ item.title }}</span>
          </button>
        </nav>
      </section>

      <section v-if="section" class="pp-card pp-card--pad cs-part">
        <header class="cs-part__head">
          <span class="pp-muted text-sm">{{ $t("cs.part_of", { n: step + 1, total: sections.length }) }}</span>
          <h3 class="pp-h2 m-0">{{ section.title }}</h3>
        </header>
        <template v-for="(question, index) in shown" :key="question.key">
          <h4 v-if="startsGroup(question, index)" class="cs-group">{{ question.group }}</h4>
          <CaseStudyField :question="question" :model-value="answers[question.key] ?? null" :class="{ 'cs-sub': question.show_if, 'cs-half': question.group }"
            @update:model-value="setAnswer(question.key, $event)" />
        </template>

        <div v-if="confirming" class="cs-confirm" role="alert">
          <i class="pi pi-info-circle" />
          <span>{{ $t("cs.confirm_missing", { n: missing.length }) }}</span>
        </div>
        <footer class="cs-actions">
          <button v-if="step > 0" type="button" class="pp-btn pp-btn--ghost" :disabled="saving" @click="go(step - 1)"><i class="pi pi-angle-right cs-flip" /> {{ $t("cs.prev") }}</button>
          <button type="button" class="pp-btn pp-btn--soft" :disabled="saving || !dirty" @click="saveDraft"><i class="pi pi-save" /> {{ $t("cs.save_draft") }}</button>
          <span class="cs-actions__gap" />
          <button v-if="step < sections.length - 1" type="button" class="pp-btn pp-btn--magenta" :disabled="saving" @click="go(step + 1)">{{ $t("cs.next") }} <i class="pi pi-angle-left cs-flip" /></button>
          <button v-else type="button" class="pp-btn pp-btn--magenta" :disabled="saving" @click="submit"><i class="pi pi-send" /> {{ confirming ? $t("cs.submit_anyway") : $t("cs.submit") }}</button>
        </footer>
        <p v-if="study.saved_at" class="pp-muted text-sm m-0">{{ $t("cs.last_saved", { date: study.saved_at }) }}</p>
      </section>
    </template>
  </div>
</template>

<style scoped>
.cs-tab {
  --cs-accent: var(--pp-teal);
  --cs-ink: var(--pp-ink);
  --cs-muted: var(--pp-muted);
  --cs-line: var(--pp-sand-200);
  --cs-soft: var(--pp-sand);
  scroll-margin-top: 90px;
}
.cs-progress {
  display: grid;
  gap: 0.35rem;
}
.cs-steps {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  scrollbar-width: thin;
}
.cs-step {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex: none;
  min-height: 44px;
  padding: 0.35rem 0.9rem 0.35rem 0.5rem;
  border: 1.5px solid var(--pp-sand-200);
  border-radius: 999px;
  background: #fff;
  color: var(--pp-text);
  font: inherit;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
}
[dir="rtl"] .cs-step {
  padding: 0.35rem 0.5rem 0.35rem 0.9rem;
}
.cs-step__n {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--pp-sand);
  font-size: 0.8rem;
}
.cs-step.is-done .cs-step__n {
  background: var(--pp-success-50);
  color: var(--pp-success);
}
.cs-step.is-active {
  border-color: var(--pp-teal);
  background: var(--pp-teal-50);
  color: var(--pp-teal-900);
}
.cs-step.is-active .cs-step__n {
  background: var(--pp-teal);
  color: #fff;
}
.cs-step:focus-visible {
  outline: 3px solid var(--pp-teal-100);
  outline-offset: 2px;
}
.cs-part {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.35rem 1rem;
}
.cs-part > * {
  grid-column: 1 / -1;
}
.cs-part > .cs-half {
  grid-column: auto;
}
.cs-part__head {
  display: grid;
  gap: 0.15rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid var(--pp-sand-200);
}
.cs-group {
  margin: 0.25rem 0 -0.5rem;
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--pp-teal-900);
}
.cs-sub {
  padding-inline-start: 1rem;
  border-inline-start: 3px solid var(--pp-teal-100);
}
.cs-confirm {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  padding: 0.8rem 1rem;
  border-radius: var(--pp-radius-sm);
  background: var(--pp-warn-50);
  color: var(--pp-warn);
  font-weight: 700;
}
.cs-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--pp-sand-200);
}
.cs-actions__gap {
  flex: 1;
}
[dir="ltr"] .cs-flip {
  transform: scaleX(-1);
}
@media (max-width: 640px) {
  .cs-part {
    grid-template-columns: 1fr;
  }
  .cs-step__t {
    display: none;
  }
  .cs-step.is-active .cs-step__t {
    display: inline;
  }
  .cs-actions .pp-btn {
    flex: 1;
    justify-content: center;
  }
  .cs-actions__gap {
    display: none;
  }
}
</style>
