<template>
  <div class="sawa-card">
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

      <!-- One color for the whole evaluation, picked before it starts; the child's last Carolina evaluation's color is locked. -->
      <div v-if="date" class="flex flex-column gap-2">
        <label>{{ $t("color") }}</label>
        <div class="carolina-colors">
          <button v-for="option in COLOR_OPTIONS" :key="option" type="button"
            :class="{ selected: color === option, blocked: isBlocked(option) }"
            :style="{ backgroundColor: '#' + option }" :disabled="isBlocked(option) || started"
            :title="isBlocked(option) ? $t('carolina_ui.color_used_last') : ''"
            :aria-label="'#' + option + (isBlocked(option) ? ' — ' + $t('carolina_ui.color_used_last') : '')"
            @click="color = option"></button>
        </div>
        <small v-if="lastEvaluation?.color" class="text-gray-500">{{ $t("carolina_ui.color_last_hint", { date: lastEvaluation.date }) }}</small>
      </div>

      <div v-if="date" class="flex flex-column gap-2">
        <label style="visibility: hidden">{{ $t("strart_evaluate") }}</label>
        <Button :loading="starting" :disabled="loading || !selectedSections.length || started || !color" class="w-full"
          :label="$t('strart_evaluate')" @click="start" />
      </div>

      <Message v-if="loading" class="lg:col-span-2">{{ $t("loading") }}</Message>
      <Message v-else-if="loadError" severity="error" :closable="false" class="lg:col-span-2">{{ loadError }}</Message>
      <Message v-else-if="!tree.length" severity="warn" :closable="false" class="lg:col-span-2">{{ $t("carolina_ui.no_items") }}</Message>

      <!-- The general goals this evaluation covers. -->
      <fieldset v-if="!loading && tree.length" class="level-picker lg:col-span-2" :disabled="started || starting">
        <legend>{{ $t("carolina_ui.choose_sections") }}</legend>
        <p>{{ $t("carolina_ui.choose_sections_hint") }}</p>
        <div class="level-picker-options">
          <label v-for="section in tree" :key="section.id">
            <Checkbox v-model="selectedIds" :value="section.id" />
            <span>{{ section.title }}</span>
          </label>
        </div>
      </fieldset>

      <template v-if="started">
        <!-- Each general goal is its own card, all in the evaluation's color. -->
        <section v-for="section in selectedSections" :key="section.id" class="milestone-level lg:col-span-2"
          :style="{ '--level-color': '#' + color }">
          <header class="milestone-level-header">
            <h2>{{ section.title }}</h2>
          </header>
          <section v-for="age in section.ages" :key="age.id" class="milestone-domain">
            <h3 class="milestone-domain-title">{{ $t("carolina_ui.age_range") }}: <span dir="ltr">{{ age.name }}</span> {{ $t("carolina_ui.months") }}</h3>
            <div class="milestone-goal">
              <div v-for="item in age.items" :id="'ci-' + item.id" :key="item.id" class="milestone-question"
                :class="{ 'is-missing': showMissing && !selected[item.id] }">
                <p><span class="carolina-symbol" dir="ltr">{{ item.symbol }}</span>{{ item.text }}</p>
                <div class="milestone-scores">
                  <label v-for="response in responses" :key="response.id" :class="{ 'is-picked': selected[item.id] === response.id }">
                    <input type="radio" :name="'item-' + item.id" :value="response.id" :checked="selected[item.id] === response.id"
                      @change="selected = { ...selected, [item.id]: response.id }" />
                    <span>{{ response.name }}</span>
                  </label>
                </div>
              </div>
            </div>
          </section>
        </section>

        <div class="flex flex-column gap-2 lg:col-span-2 carolina-submit">
          <span class="carolina-count">{{ $t("carolina_ui.answered_of", { n: answeredCount, total: items.length }) }}</span>
          <Button type="submit" :loading="saving" :disabled="saving" class="m-auto w-full" :label="$t('submit')" />
        </div>
      </template>
    </form>
  </div>
</template>

<script setup>
// The Carolina evaluation of one child (/carolina-test/:id), laid out like the Milestones one: the child, date
// and age, the evaluation's one color (not the child's last Carolina evaluation's), the general goals to cover, then
// a card per general goal with its age ranges and skills, each answered with one of the responses.
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { getEvaluationTypeLabel } from "@/utils/evaluationTypes";
import { toDateOnly } from "@/utils/childAge";
import { carolinaText } from "@/utils/carolina";

const CAROLINA = 5;
// The colors every evaluation screen offers.
const COLOR_OPTIONS = ["00B8D9", "36B37E", "FFAB00", "FF5630", "6554C0"];

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const childId = computed(() => Number(route.params.id) || Number(localStorage.getItem("child_id")) || null);
const children = ref([]);
const child = computed(() => children.value.find((entry) => Number(entry.id) === childId.value) ?? { name: "", gender: "0" });
const loading = ref(true);
const loadError = ref("");
const sections = ref([]);
const responses = ref([]);
const date = ref(new Date());
const childAge = ref(null);
const selectedIds = ref([]);
// The evaluation's color (hex without #) and the child's last Carolina evaluation ({ id, date, color }).
const color = ref(null);
const lastEvaluation = ref(null);
const evaluationId = ref(null);
const started = computed(() => Boolean(evaluationId.value));
const starting = ref(false);
const saving = ref(false);
const showMissing = ref(false);
const alertText = ref("");
// item id -> answer type id
const selected = ref({});

// General goal → age range → skills, each skill worded for the child.
const tree = computed(() => sections.value.map((section) => ({
  ...section,
  ages: (section.ages ?? []).map((age) => ({
    ...age,
    items: (age.skills ?? []).map((skill) => ({ ...skill, section_id: section.id, text: carolinaText(skill, "skill", child.value) })),
  })),
})));
const selectedSections = computed(() => tree.value.filter((section) => selectedIds.value.includes(section.id)));
const items = computed(() => selectedSections.value.flatMap((section) => section.ages.flatMap((age) => age.items)));
const answeredCount = computed(() => items.value.filter((item) => selected.value[item.id]).length);

const isBlocked = (option) => String(lastEvaluation.value?.color ?? "").toUpperCase() === option;
const errorText = (error) => Object.values(error.response?.data?.errors ?? {}).flat().join(" ") || error.response?.data?.message || t("request_failed_retry");

async function load() {
  loading.value = true;
  loadError.value = "";
  try {
    const [tests, types, list] = await Promise.all([
      axios.get("api/carolina-skills/evaluation-tree"),
      axios.get("api/carolina-answer-type"),
      axios.get("api/child").catch(() => ({ data: {} })),
    ]);
    sections.value = tests.data.data ?? [];
    responses.value = types.data.data ?? [];
    children.value = list.data?.children ?? [];
    selectedIds.value = tree.value.map((section) => section.id);
  } catch (error) {
    loadError.value = errorText(error);
  } finally {
    loading.value = false;
  }
}

// The first free color is picked by default.
async function loadLastColor() {
  lastEvaluation.value = null;
  if (!childId.value) return;
  try {
    const { data } = await axios.get(`api/carolina-answer/last-color/${childId.value}`);
    lastEvaluation.value = data.last;
  } catch {
    lastEvaluation.value = null;
  }
  if (!color.value || isBlocked(color.value)) color.value = COLOR_OPTIONS.find((option) => !isBlocked(option)) ?? null;
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

async function start() {
  starting.value = true;
  alertText.value = "";
  try {
    const { data } = await axios.post("api/evaluations/create", {
      type: CAROLINA,
      title: getEvaluationTypeLabel(CAROLINA, t, t("evaluation_results")),
      child_id: childId.value,
      specialist_id: localStorage.getItem("user_id"),
      date: toDateOnly(date.value),
    });
    evaluationId.value = data.evaluation.id;
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
    await axios.post("api/carolina-answer", {
      evaluation_id: evaluationId.value,
      child_id: childId.value,
      date: toDateOnly(date.value),
      child_age: childAge.value == null ? null : String(childAge.value),
      color: color.value,
      answers: items.value.map((item) => ({ skill_id: item.id, answer_type_id: selected.value[item.id] })),
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

onMounted(() => {
  load();
  loadAge();
  loadLastColor();
});
watch(date, () => { if (!started.value) loadAge(); });
// Another child on the same screen: start over.
watch(childId, (value, before) => {
  if (value && value !== before && route.name === "carolina-test") {
    evaluationId.value = null;
    selected.value = {};
    color.value = null;
    showMissing.value = false;
    load();
    loadAge();
    loadLastColor();
  }
});
</script>

<style scoped>
.level-picker { border: 1px solid var(--sawa-border); border-radius: 12px; padding: 1rem; }
.level-picker legend { font-weight: 700; color: var(--sawa-primary); }
.level-picker p { margin: 0 0 .75rem; color: var(--sawa-muted); }
.level-picker-options { display: flex; flex-wrap: wrap; gap: 1rem; }
.level-picker-options label { display: flex; align-items: center; gap: .5rem; cursor: pointer; }
.level-picker:disabled .level-picker-options label { cursor: default; }
.milestone-level { border: 2px solid var(--level-color); border-radius: 16px; overflow: hidden; }
.milestone-level-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: .75rem; padding: 1rem 1.25rem; background: var(--level-color); color: #fff; }
.milestone-level-header h2 { margin: 0; font-weight: 700; font-size: 1.25rem; }
.carolina-colors { display: flex; align-items: center; gap: .5rem; min-height: 2.6rem; }
.carolina-colors button { width: 30px; height: 30px; border-radius: 6px; border: 2px solid transparent; cursor: pointer; transition: transform .15s; }
.carolina-colors button:hover:not(:disabled) { transform: scale(1.1); }
.carolina-colors button.selected { border-color: #333; box-shadow: 0 0 0 2px #fff inset; }
.carolina-colors button:disabled:not(.selected) { opacity: .5; cursor: default; }
.carolina-colors button.blocked { position: relative; cursor: not-allowed; opacity: .35; }
.carolina-colors button.blocked::after { content: ""; position: absolute; inset: 45% -2px auto; height: 2px; background: #333; transform: rotate(-45deg); }
.milestone-domain + .milestone-domain { border-top: 1px solid var(--sawa-border); }
.milestone-domain-title { margin: 0; padding: .85rem 1.25rem; color: var(--sawa-primary); background: #edf7f5; font-weight: 700; font-size: 1.1rem; }
.milestone-goal { padding: 1rem 1.25rem; }
.milestone-goal h4 { margin-bottom: .75rem; font-weight: 700; }
.milestone-question { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; border-top: 1px solid var(--sawa-border); padding: 1rem 0; }
.milestone-question.is-missing { margin: 0 -.75rem; padding-inline: .75rem; border-radius: 8px; background: #fef2f2; box-shadow: inset 0 0 0 1px #fca5a5; }
.milestone-question p { flex: 1 1 20rem; margin: 0; }
.carolina-symbol { display: inline-block; min-width: 2.6rem; margin-inline-end: .6rem; padding: .1rem .45rem; border-radius: 6px; background: #f1f5f9; font-weight: 700; text-align: center; }
.milestone-scores { display: flex; flex-wrap: wrap; gap: .6rem; }
.milestone-scores label { display: flex; align-items: center; gap: .4rem; padding: .5rem .8rem; border: 1px solid var(--sawa-border); border-radius: 8px; cursor: pointer; font-weight: 700; }
.milestone-scores label.is-picked { border-color: var(--level-color); background: color-mix(in srgb, var(--level-color) 12%, #fff); }
.milestone-scores input { accent-color: var(--level-color); }
.carolina-submit { align-items: center; }
.carolina-count { color: var(--sawa-muted); }
</style>
