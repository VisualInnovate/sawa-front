<template>
  <div class="sawa-card">
    <!-- Opened from the result (?edit=): the same screen with the answers given, until the evaluation is approved. -->
    <EditModeBanner v-if="editing" class="mb-3" :status="editing.approval_status" :note="editing.approval_note" />
    <Message v-if="alertText" severity="error" class="mb-3">{{ alertText }}</Message>

    <form class="p-[2%] bg-[#FDFDFD] shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4" data-no-request-spinner @submit.prevent="save">
      <div class="flex flex-column gap-2">
        <label for="carolina-child">{{ $t("child_name") }}</label>
        <Select inputId="carolina-child" disabled :modelValue="childId" :options="children" optionValue="id" optionLabel="name"
          :placeholder="$t('child_name')" class="w-full" />
      </div>

      <div class="flex flex-column gap-2">
        <label for="carolina-date">{{ $t("date") }}</label>
        <DatePicker v-model="date" inputId="carolina-date" :disabled="started" :maxDate="new Date()" showIcon showButtonBar
          :placeholder="$t('date')" class="w-full" />
      </div>

      <div v-if="date" class="flex flex-column gap-2">
        <label for="carolina-age">{{ $t("age") }}</label>
        <InputText id="carolina-age" :modelValue="childAge ?? ''" readonly :placeholder="$t('age')" />
      </div>

      <!-- One color per evaluation (any color for a new one); continuing locks every color the evaluation used. -->
      <div v-if="date && mode" class="flex flex-column gap-2">
        <label>{{ $t("color") }}</label>
        <div class="carolina-colors">
          <button v-for="option in COLOR_OPTIONS" :key="option" type="button"
            :class="{ selected: color === option, blocked: isBlocked(option) }"
            :style="{ backgroundColor: '#' + option }" :disabled="isBlocked(option) || started"
            :title="isBlocked(option) ? $t('carolina_ui.color_used_in_evaluation') : ''"
            :aria-label="'#' + option + (isBlocked(option) ? ' — ' + $t('carolina_ui.color_used_in_evaluation') : '')"
            @click="color = option"></button>
        </div>
      </div>

      <!-- How this evaluation goes: new, or continuing the latest one on its weaknesses. -->
      <div v-if="last && mode" class="carolina-mode lg:col-span-2">
        <span><i :class="mode === 'continue' ? 'pi pi-replay' : 'pi pi-file-plus'" aria-hidden="true" />
          {{ mode === "continue" ? $t("carolina_ui.mode_continue_on", { date: last.date, n: last.weaknesses_count }) : $t("carolina_ui.mode_new") }}</span>
        <Button v-if="!started" type="button" :label="$t('carolina_ui.change_mode')" size="small" variant="text" @click="modeDialog = true" />
      </div>

      <Message v-if="loading" class="lg:col-span-2">{{ $t("loading") }}</Message>
      <Message v-else-if="loadError" severity="error" :closable="false" class="lg:col-span-2">{{ loadError }}</Message>
      <Message v-else-if="!tree.length" severity="warn" :closable="false" class="lg:col-span-2">{{ $t("carolina_ui.no_items") }}</Message>

      <!-- A new evaluation: the domains it covers, then their general goals (a goal can be left out). -->
      <fieldset v-if="!loading && tree.length && mode === 'new'" class="level-picker lg:col-span-2" :disabled="started || starting">
        <legend>{{ $t("carolina_ui.choose_domains") }}</legend>
        <p>{{ $t("carolina_ui.choose_domains_hint") }}</p>
        <div class="domain-picker">
          <div v-for="domain in domains" :key="domain.key" class="domain-option">
            <label class="domain-option-head">
              <Checkbox :modelValue="domainState(domain) === 'all'" :indeterminate="domainState(domain) === 'some'" binary
                @update:modelValue="toggleDomain(domain, $event)" />
              <b>{{ domain.title }}</b>
            </label>
            <div class="domain-option-goals">
              <label v-for="goal in domain.goals" :key="goal.id">
                <Checkbox v-model="selectedIds" :value="goal.id" />
                <span>{{ goal.title }}</span>
              </label>
            </div>
          </div>
        </div>
      </fieldset>

      <div v-if="date && mode" class="flex flex-column gap-2 lg:col-span-2 carolina-start">
        <Button v-if="!started" :loading="starting" :disabled="loading || !items.length || !color" class="carolina-start-button"
          :label="$t('strart_evaluate')" icon="pi pi-play" @click="start" />
      </div>

      <template v-if="started">
        <p v-if="mode === 'continue'" class="carolina-hint lg:col-span-2"><i class="pi pi-info-circle" aria-hidden="true" /> {{ $t("carolina_ui.continue_hint") }}</p>
        <!-- Domain above, then each general goal as a bar and a table: age range | symbol | skill | response. -->
        <section v-for="domain in shownDomains" :key="domain.key" class="carolina-domain lg:col-span-2" :style="{ '--level-color': '#' + color }">
          <h2 class="carolina-domain-title">{{ domain.title }}</h2>
          <article v-for="goal in domain.goals" :key="goal.id" class="carolina-goal">
            <header class="carolina-goal-title">{{ goal.title }}</header>
            <div class="carolina-table-wrap">
              <table class="carolina-table">
                <thead>
                  <tr>
                    <th>{{ $t("carolina_ui.age_range") }}</th>
                    <th>{{ $t("carolina_ui.symbol") }}</th>
                    <th>{{ $t("carolina_ui.skill") }}</th>
                    <th v-if="mode === 'continue'">{{ $t("carolina_ui.previous_response") }}</th>
                    <th>{{ $t("carolina_ui.response") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in goal.rows" :id="'ci-' + row.id" :key="row.id" :class="{ 'is-missing': showMissing && !selected[row.id] }">
                    <td v-if="row.first" :rowspan="row.span" class="carolina-age" dir="ltr">{{ row.age }}</td>
                    <td class="carolina-center" dir="ltr">{{ row.symbol }}</td>
                    <td>{{ row.text }}</td>
                    <td v-if="mode === 'continue'" class="carolina-center">
                      <span class="carolina-previous" dir="ltr">
                        <i v-if="previous[row.id]?.color" :style="{ background: '#' + previous[row.id].color }" />{{ previous[row.id]?.response }}
                      </span>
                    </td>
                    <td class="carolina-center">
                      <div class="carolina-responses" role="radiogroup" :aria-label="row.symbol">
                        <button v-for="response in RESPONSES" :key="response" type="button" role="radio" dir="ltr"
                          :aria-checked="selected[row.id] === response" :class="{ 'is-picked': selected[row.id] === response }"
                          :disabled="locked[row.id]" @click="selected = { ...selected, [row.id]: response }">{{ response }}</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>
        </section>

        <div class="flex flex-column gap-2 lg:col-span-2 carolina-submit">
          <span class="carolina-count">{{ $t("carolina_ui.answered_of", { n: answeredCount, total: items.length }) }}</span>
          <Button type="submit" :loading="saving" :disabled="saving" class="m-auto w-full" :label="editing ? $t('mae_save') : $t('submit')" />
        </div>
      </template>
    </form>

    <!-- The child has a Carolina evaluation: a new one, or continue the latest on its weaknesses. -->
    <Dialog v-model:visible="modeDialog" modal :closable="Boolean(mode)" :closeOnEscape="Boolean(mode)":header="$t('carolina_ui.mode_title')" :style="{ width: '520px', maxWidth: '95vw' }">
      <p class="m-0 mb-3">{{ $t("carolina_ui.mode_intro", { date: last?.date }) }}</p>
      <div class="carolina-mode-options">
        <button type="button" class="carolina-mode-option" @click="chooseMode('new')">
          <i class="pi pi-file-plus" aria-hidden="true" />
          <span><b>{{ $t("carolina_ui.mode_new") }}</b><small>{{ $t("carolina_ui.mode_new_hint") }}</small></span>
        </button>
        <button type="button" class="carolina-mode-option" :disabled="!last?.weaknesses_count" @click="chooseMode('continue')">
          <i class="pi pi-replay" aria-hidden="true" />
          <span>
            <b>{{ $t("carolina_ui.mode_continue") }}</b>
            <small>{{ last?.weaknesses_count ? $t("carolina_ui.mode_continue_hint", { n: last.weaknesses_count }) : $t("carolina_ui.mode_no_weaknesses") }}</small>
          </span>
        </button>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
// The Carolina evaluation of one child (/carolina-test/:id). Each skill is answered +, - or +-, in one color.
// A child with an earlier evaluation first chooses: a new evaluation (pick domains, then their general goals; any
// color), or continuing the latest one — only its weaknesses (- or +-) are asked again, in a color that evaluation
// has not used yet. Questions show by domain, then a table per general goal like the result page.
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { getEvaluationTypeLabel } from "@/utils/evaluationTypes";
import { toDateOnly } from "@/utils/childAge";
import { carolinaText } from "@/utils/carolina";
import EditModeBanner from "@/components/evaluations/EditModeBanner.vue";

const CAROLINA = 5;
// The colors every evaluation screen offers.
const COLOR_OPTIONS = ["00B8D9", "36B37E", "FFAB00", "FF5630", "6554C0"];
const RESPONSES = ["+", "-", "+-"];

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

// Editing a saved evaluation (?edit=id) before its approval: { id, approval_status, approval_note, ... }; its child
// comes with it (the route then holds the evaluation).
const editing = ref(null);
const editChildId = ref(null);
// skill id -> true: answered in an approved part (a new round waits), shown but not changed.
const locked = ref({});
const childId = computed(() => editChildId.value || Number(route.params.id) || Number(localStorage.getItem("child_id")) || null);
const children = ref([]);
const child = computed(() => children.value.find((entry) => Number(entry.id) === childId.value) ?? { name: "", gender: "0" });
const loading = ref(true);
const loadError = ref("");
const goals = ref([]);
const date = ref(new Date());
const childAge = ref(null);
const selectedIds = ref([]);
// The child's latest evaluation ({ id, date, colors, weaknesses: { skillId: { response, color } }, weaknesses_count }).
const last = ref(null);
// "new" | "continue"; null until chosen (a child without an evaluation starts a new one).
const mode = ref(null);
const modeDialog = ref(false);
const color = ref(null);
const evaluationId = ref(null);
const started = ref(false);
const starting = ref(false);
const saving = ref(false);
const showMissing = ref(false);
const alertText = ref("");
// skill id -> "+" | "-" | "+-"
const selected = ref({});

const previous = computed(() => (mode.value === "continue" ? last.value?.weaknesses ?? {} : {}));
// The general goals by domain (the goals without one last), each goal's skills worded for the child.
const tree = computed(() => goals.value.map((goal) => ({
  ...goal,
  ages: (goal.ages ?? []).map((age) => ({
    ...age,
    items: (age.skills ?? []).map((skill) => ({ ...skill, text: carolinaText(skill, "skill", child.value) })),
  })),
})));
const domains = computed(() => {
  const list = new Map();
  for (const goal of tree.value) {
    const key = goal.domain?.id ?? 0;
    if (!list.has(key)) list.set(key, { key, title: goal.domain?.title ?? t("carolina_ui.no_domain"), goals: [] });
    list.get(key).goals.push(goal);
  }
  return [...list.values()];
});
// Whether a skill is asked: a new evaluation asks the chosen goals' skills, continuing asks the weaknesses.
// Editing asks what the evaluation answered.
const isAsked = (goal, item) => (mode.value === "edit" ? item.id in editAnswers.value
  : mode.value === "continue" ? Boolean(previous.value[item.id]) : selectedIds.value.includes(goal.id));
// skill id -> the response saved in the evaluation being edited.
const editAnswers = ref({});
// The shown domains → goals → table rows (the age range cell spans its skills).
const shownDomains = computed(() => domains.value.map((domain) => ({
  ...domain,
  goals: domain.goals.map((goal) => ({
    ...goal,
    rows: goal.ages.flatMap((age) => {
      const asked = age.items.filter((item) => isAsked(goal, item));
      return asked.map((item, i) => ({ ...item, age: age.name, first: i === 0, span: asked.length }));
    }),
  })).filter((goal) => goal.rows.length),
})).filter((domain) => domain.goals.length));
const items = computed(() => shownDomains.value.flatMap((domain) => domain.goals.flatMap((goal) => goal.rows)));
const answeredCount = computed(() => items.value.filter((item) => selected.value[item.id]).length);

const lockedColors = computed(() => (mode.value === "continue" ? (last.value?.colors ?? []).map((value) => String(value).toUpperCase()) : []));
const isBlocked = (option) => lockedColors.value.includes(option);
const errorText = (error) => Object.values(error.response?.data?.errors ?? {}).flat().join(" ") || error.response?.data?.message || t("request_failed_retry");

const domainState = (domain) => {
  const picked = domain.goals.filter((goal) => selectedIds.value.includes(goal.id)).length;
  return picked === 0 ? "none" : picked === domain.goals.length ? "all" : "some";
};
function toggleDomain(domain, on) {
  const ids = domain.goals.map((goal) => goal.id);
  selectedIds.value = on ? [...new Set([...selectedIds.value, ...ids])] : selectedIds.value.filter((id) => !ids.includes(id));
}

function chooseMode(value) {
  mode.value = value;
  modeDialog.value = false;
  selected.value = {};
  showMissing.value = false;
  if (!color.value || isBlocked(color.value)) color.value = COLOR_OPTIONS.find((option) => !isBlocked(option)) ?? null;
}

async function load() {
  loading.value = true;
  loadError.value = "";
  last.value = null;
  mode.value = null;
  try {
    const [tests, context, list] = await Promise.all([
      axios.get("api/carolina-skills/evaluation-tree"),
      axios.get(`api/carolina-answer/context/${childId.value}`),
      axios.get("api/child").catch(() => ({ data: {} })),
    ]);
    goals.value = tests.data.data ?? [];
    children.value = list.data?.children ?? [];
    last.value = context.data.last;
    // A child evaluated before chooses how to go on; otherwise the evaluation is new.
    if (last.value) modeDialog.value = true;
    else chooseMode("new");
  } catch (error) {
    loadError.value = errorText(error);
  } finally {
    loading.value = false;
  }
}

async function loadAge() {
  childAge.value = null;
  if (!date.value || !childId.value) return;
  try {
    const { data } = await axios.post("api/milestone-answers/get-age-child", { date: toDateOnly(date.value), child_id: childId.value });
    childAge.value = data;
  } catch {
    childAge.value = null;
  }
}

// A new evaluation is created now; continuing answers the latest one.
async function start() {
  alertText.value = "";
  if (mode.value === "continue") {
    evaluationId.value = last.value.id;
    started.value = true;
    return;
  }
  starting.value = true;
  try {
    const { data } = await axios.post("api/evaluations/create", {
      type: CAROLINA,
      title: getEvaluationTypeLabel(CAROLINA, t, t("evaluation_results")),
      child_id: childId.value,
      specialist_id: localStorage.getItem("user_id"),
      date: toDateOnly(date.value),
    });
    evaluationId.value = data.evaluation.id;
    started.value = true;
  } catch (error) {
    alertText.value = errorText(error);
  } finally {
    starting.value = false;
  }
}

async function save() {
  const missing = items.value.find((item) => !selected.value[item.id]);
  if (missing) {
    showMissing.value = true;
    alertText.value = t("answer_all_questions");
    document.getElementById("ci-" + missing.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  saving.value = true;
  alertText.value = "";
  // The request being closed: the one opened from the requests list (same id either way).
  const requestId = route.query.requestId || localStorage.getItem("eavl_id");
  try {
    if (editing.value) {
      await axios.put(`api/carolina-answer/evaluation/${evaluationId.value}/edit`, {
        answers: items.value.filter((item) => !locked.value[item.id]).map((item) => ({ skill_id: item.id, response: selected.value[item.id] })),
      });
      router.push({ name: "carolina-resulte", params: { id: evaluationId.value } });
      return;
    }
    await axios.post("api/carolina-answer", {
      evaluation_id: evaluationId.value,
      child_id: childId.value,
      date: toDateOnly(date.value),
      child_age: childAge.value == null ? null : String(childAge.value),
      mode: mode.value,
      color: color.value,
      answers: items.value.map((item) => ({ skill_id: item.id, response: selected.value[item.id] })),
    });
    if (requestId) axios.post(`api/evaluation-request/change-status/${requestId}`, { status: "1" }).catch(() => {});
    router.push({ name: "carolina-resulte", params: { id: evaluationId.value } });
  } catch (error) {
    alertText.value = errorText(error);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } finally {
    saving.value = false;
  }
}

function reset() {
  evaluationId.value = null;
  started.value = false;
  selected.value = {};
  selectedIds.value = [];
  color.value = null;
  showMissing.value = false;
}

// The saved evaluation on this screen: the skills it answered (by domain and goal) with their responses.
async function loadEdit() {
  loading.value = true;
  loadError.value = "";
  try {
    const [tests, { data: edit }] = await Promise.all([
      axios.get("api/carolina-skills/evaluation-tree"),
      axios.get(`api/carolina-answer/evaluation/${route.query.edit}/edit`),
    ]);
    const { evaluation, child, domains: saved } = edit.data;
    const skills = saved.flatMap((domain) => domain.goals.flatMap((goal) => goal.skills));
    goals.value = tests.data.data ?? [];
    children.value = child ? [child] : [];
    editChildId.value = child?.id ?? null;
    editing.value = evaluation;
    evaluationId.value = evaluation.id;
    date.value = evaluation.date ? new Date(evaluation.date) : new Date();
    childAge.value = evaluation.child_age;
    color.value = evaluation.color || COLOR_OPTIONS[0];
    editAnswers.value = Object.fromEntries(skills.map((skill) => [skill.id, skill.response]));
    locked.value = Object.fromEntries(skills.filter((skill) => !skill.editable).map((skill) => [skill.id, true]));
    selected.value = { ...editAnswers.value };
    mode.value = "edit";
    started.value = true;
  } catch (error) {
    loadError.value = errorText(error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (route.query.edit) {
    loadEdit();
    return;
  }
  load();
  loadAge();
});
watch(date, () => { if (!started.value) loadAge(); });
// Another child on the same screen: start over.
watch(childId, (value, before) => {
  if (value && value !== before && route.name === "carolina-test" && !route.query.edit) {
    reset();
    load();
    loadAge();
  }
});
</script>

<style scoped>
.level-picker { border: 1px solid var(--sawa-border); border-radius: 12px; padding: 1rem; }
.level-picker legend { font-weight: 700; color: var(--sawa-primary); }
.level-picker p { margin: 0 0 .75rem; color: var(--sawa-muted); }
.domain-picker { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr)); gap: .75rem; }
.domain-option { padding: .75rem .9rem; border: 1px solid var(--sawa-border); border-radius: 10px; background: #fff; }
.domain-option-head { display: flex; align-items: center; gap: .5rem; cursor: pointer; }
.domain-option-goals { display: grid; gap: .35rem; margin-top: .55rem; padding-inline-start: 1.6rem; }
.domain-option-goals label { display: flex; align-items: center; gap: .5rem; cursor: pointer; font-size: .92rem; }
.level-picker:disabled label { cursor: default; }
.carolina-colors { display: flex; align-items: center; gap: .5rem; min-height: 2.6rem; }
.carolina-colors button { width: 30px; height: 30px; border-radius: 6px; border: 2px solid transparent; cursor: pointer; transition: transform .15s; }
.carolina-colors button:hover:not(:disabled) { transform: scale(1.1); }
.carolina-colors button.selected { border-color: #333; box-shadow: 0 0 0 2px #fff inset; }
.carolina-colors button:disabled:not(.selected) { opacity: .5; cursor: default; }
.carolina-colors button.blocked { position: relative; cursor: not-allowed; opacity: .35; }
.carolina-colors button.blocked::after { content: ""; position: absolute; inset: 45% -2px auto; height: 2px; background: #333; transform: rotate(-45deg); }
.carolina-mode { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .5rem; padding: .6rem .9rem; border-radius: 10px; background: #f1f5f9; color: #334155; font-weight: 600; }
.carolina-mode i { margin-inline-end: .35rem; color: var(--sawa-primary); }
.carolina-start { align-items: flex-end; }
.carolina-start-button { min-width: 14rem; }
.carolina-hint { margin: 0; padding: .55rem .8rem; border-radius: 8px; background: #fffbeb; color: #92400e; }
.carolina-domain { display: grid; gap: .9rem; }
.carolina-domain-title { margin: .5rem 0 0; padding: .55rem 1rem; border-inline-start: 6px solid var(--level-color); border-radius: 8px; background: #f8fafc; color: #0f172a; font-size: 1.2rem; font-weight: 800; }
.carolina-goal { overflow: hidden; border: 1px solid var(--sawa-border); border-radius: 14px; background: #fff; }
.carolina-goal-title { padding: .85rem 1.25rem; background: var(--level-color); color: #fff; font-size: 1.1rem; font-weight: 800; }
.carolina-table-wrap { overflow-x: auto; padding: 1rem 1.25rem; }
.carolina-table { width: 100%; border-collapse: collapse; font-size: .95rem; }
.carolina-table th, .carolina-table td { border: 1px solid #e2e8f0; padding: .55rem .75rem; vertical-align: middle; text-align: start; }
.carolina-table th { background: #f8fafc; color: #334155; font-weight: 700; text-align: center; }
.carolina-table tr.is-missing td:not(.carolina-age) { background: #fef2f2; }
.carolina-center, .carolina-age { text-align: center !important; white-space: nowrap; }
.carolina-age { background: #f8fafc; font-weight: 700; }
.carolina-responses { display: inline-flex; gap: .35rem; }
/* The signs in a plain font: Cairo draws "+-" as one glyph. */
.carolina-responses button, .carolina-previous { font-family: "Segoe UI", Tahoma, Arial, sans-serif; font-variant-ligatures: none; }
.carolina-responses button { min-width: 2.6rem; padding: .35rem .55rem; border: 1px solid var(--sawa-border); border-radius: 8px; background: #fff; font-size: 1.05rem; font-weight: 800; cursor: pointer; }
.carolina-responses button:hover { border-color: var(--level-color); }
.carolina-responses button:focus-visible { outline: 2px solid var(--level-color); outline-offset: 2px; }
.carolina-responses button.is-picked { border-color: var(--level-color); background: var(--level-color); color: #fff; }
.carolina-previous { display: inline-flex; align-items: center; gap: .35rem; font-weight: 800; }
.carolina-previous i { width: 10px; height: 10px; border-radius: 2px; }
.carolina-mode-options { display: grid; gap: .6rem; }
.carolina-mode-option { display: flex; align-items: center; gap: .8rem; padding: .85rem 1rem; border: 1px solid var(--sawa-border); border-radius: 12px; background: #fff; font: inherit; text-align: start; cursor: pointer; }
.carolina-mode-option:hover:not(:disabled) { border-color: var(--sawa-primary); background: #f0fdfa; }
.carolina-mode-option:disabled { opacity: .55; cursor: not-allowed; }
.carolina-mode-option i { font-size: 1.4rem; color: var(--sawa-primary); }
.carolina-mode-option span { display: grid; gap: .15rem; }
.carolina-mode-option small { color: var(--sawa-muted); }
.carolina-submit { align-items: center; }
.carolina-count { color: var(--sawa-muted); }
</style>
