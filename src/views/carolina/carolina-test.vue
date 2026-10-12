<script setup>
// The Carolina evaluation of one child (/carolina-test/:id). The evaluator picks the date and color, starts the
// evaluation, then gives every item (main section → general goal → age range → symbol and strength) a response,
// with an optional note.
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
const child = ref({ name: "", gender: "0" });
const loading = ref(true);
const loadError = ref("");
const sections = ref([]);
const responses = ref([]);
const date = ref(new Date());
const color = ref(COLOR_OPTIONS[0]);
const childAge = ref(null);
const evaluationId = ref(null);
const starting = ref(false);
const saving = ref(false);
const showMissing = ref(false);
const alertText = ref("");
// item id -> answer type id / note
const selected = ref({});
const notes = ref({});

// Main section → general goal → age range → items, each item worded for the child.
const tree = computed(() => sections.value.map((section) => ({
  ...section,
  goals: (section.children ?? []).map((goal) => {
    const ages = [];
    for (const item of goal.tests ?? []) {
      const key = item.age_group?.id ?? item.age_group_id ?? 0;
      let age = ages.find((entry) => entry.key === key);
      if (!age) ages.push((age = { key, name: item.age_group?.name ?? "", items: [] }));
      age.items.push({ ...item, text: carolinaText(item, "skill", child.value) });
    }
    return { ...goal, ages };
  }).filter((goal) => goal.ages.length),
})).filter((section) => section.goals.length));
const items = computed(() => tree.value.flatMap((section) => section.goals.flatMap((goal) => goal.ages.flatMap((age) => age.items))));
const answeredCount = computed(() => items.value.filter((item) => selected.value[item.id]).length);

async function load() {
  loading.value = true;
  loadError.value = "";
  try {
    const [tests, types, children] = await Promise.all([
      axios.get("api/carolina-category/list/tests"),
      axios.get("api/carolina-answer-type"),
      axios.get("api/child").catch(() => ({ data: {} })),
    ]);
    sections.value = tests.data.data ?? [];
    responses.value = types.data.data ?? [];
    const found = (children.data?.children ?? []).find((entry) => Number(entry.id) === childId.value);
    child.value = { name: found?.name ?? "", gender: found?.gender ?? "0" };
    await loadAge();
  } catch (error) {
    loadError.value = error.response?.data?.message || t("request_failed_retry");
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
    alertText.value = Object.values(error.response?.data?.errors ?? {}).flat().join(" ") || error.response?.data?.message || t("request_failed_retry");
  } finally {
    starting.value = false;
  }
}

function scrollTo(itemId) {
  document.getElementById("ci-" + itemId)?.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function save() {
  const missing = items.value.find((item) => !selected.value[item.id]);
  if (missing) {
    showMissing.value = true;
    alertText.value = t("answer_all_questions");
    scrollTo(missing.id);
    return;
  }
  saving.value = true;
  alertText.value = "";
  const common = { color: color.value, child_id: childId.value, date: toDateOnly(date.value), child_age: childAge.value, evaluation_id: evaluationId.value };
  // The request being closed: the one opened from the requests list (same id either way).
  const requestId = route.query.requestId || localStorage.getItem("eavl_id");
  try {
    await axios.post("api/carolina-answer", {
      answers: items.value.map((item) => ({
        ...common,
        test_id: item.id,
        answer_type_id: selected.value[item.id],
        note: notes.value[item.id]?.trim() || null,
      })),
    });
    if (requestId) axios.post(`api/evaluation-request/change-status/${requestId}`, { status: "1" }).catch(() => {});
    router.push({ name: "carolina-resulte", params: { id: evaluationId.value } });
  } catch (error) {
    alertText.value = Object.values(error.response?.data?.errors ?? {}).flat().join(" ") || error.response?.data?.message || t("request_failed_retry");
    window.scrollTo({ top: 0, behavior: "smooth" });
  } finally {
    saving.value = false;
  }
}

onMounted(load);
watch(date, () => { if (!evaluationId.value) loadAge(); });
// Another child on the same screen: start over.
watch(childId, (value, before) => {
  if (value && value !== before && route.name === "carolina-test") {
    evaluationId.value = null;
    selected.value = {};
    notes.value = {};
    showMissing.value = false;
    load();
  }
});
</script>

<template>
  <div class="ce-page">
    <header class="ce-hero">
      <div class="ce-hero-main">
        <span class="ce-hero-icon"><i class="pi pi-th-large" aria-hidden="true" /></span>
        <div>
          <h1>{{ $t("carolina_ui.title") }}</h1>
          <p v-if="child.name">{{ child.name }}</p>
        </div>
      </div>
      <div v-if="evaluationId" class="ce-hero-progress">
        <b>{{ answeredCount }}/{{ items.length }}</b>
        <span>{{ $t("carolina_ui.answered_of", { n: answeredCount, total: items.length }) }}</span>
      </div>
    </header>

    <div v-if="loading" class="ce-state"><ProgressSpinner style="width: 40px; height: 40px" /></div>
    <Message v-else-if="loadError" severity="error" :closable="false">{{ loadError }}</Message>

    <template v-else>
      <Message v-if="alertText" severity="error" :closable="false">{{ alertText }}</Message>

      <section class="ce-card">
        <div class="ce-card-head">
          <span class="ce-step">1</span>
          <div>
            <h2>{{ $t("carolina_ui.details") }}</h2>
            <p>{{ $t("carolina_ui.details_hint") }}</p>
          </div>
        </div>
        <div class="ce-grid">
          <div class="ce-field">
            <label for="ce-date">{{ $t("date") }}</label>
            <DatePicker v-model="date" inputId="ce-date" showIcon :maxDate="new Date()" :disabled="Boolean(evaluationId)" fluid />
          </div>
          <div class="ce-field">
            <label for="ce-age">{{ $t("age") }}</label>
            <InputText id="ce-age" :modelValue="childAge ?? ''" readonly fluid />
          </div>
          <div class="ce-field">
            <label>{{ $t("color") }}</label>
            <div class="ce-colors" role="radiogroup" :aria-label="$t('color')">
              <button v-for="value in COLOR_OPTIONS" :key="value" type="button" role="radio" :aria-checked="color === value"
                :class="{ selected: color === value }" :style="{ backgroundColor: '#' + value }" :aria-label="'#' + value"
                :disabled="Boolean(evaluationId)" @click="color = value" />
            </div>
          </div>
        </div>
        <div v-if="!evaluationId" class="ce-start">
          <Button :label="$t('strart_evaluate')" icon="pi pi-play" :loading="starting" :disabled="!date || !color || !items.length"
            data-no-request-spinner @click="start" />
        </div>
        <Message v-if="!items.length" severity="warn" :closable="false" class="mt-3">{{ $t("carolina_ui.no_items") }}</Message>
      </section>

      <template v-if="evaluationId">
        <section v-for="section in tree" :key="section.id" class="ce-section">
          <h2 class="ce-section-title">{{ section.title }}</h2>
          <article v-for="goal in section.goals" :key="goal.id" class="ce-card ce-goal">
            <header class="ce-goal-head">
              <span class="ce-goal-label">{{ $t("carolina_ui.general_goal") }}</span>
              <h3>{{ goal.title }}</h3>
            </header>
            <div v-for="age in goal.ages" :key="age.key" class="ce-age">
              <div class="ce-age-label"><i class="pi pi-calendar" aria-hidden="true" /> {{ $t("age_range") }}: <b dir="ltr">{{ age.name }}</b></div>
              <div v-for="item in age.items" :id="'ci-' + item.id" :key="item.id" class="ce-item"
                :class="{ 'is-missing': showMissing && !selected[item.id], 'is-done': selected[item.id] }"
                :style="{ '--pick': '#' + color }">
                <div class="ce-item-main">
                  <span class="ce-symbol" dir="ltr">{{ item.symbol }}</span>
                  <p class="ce-skill">{{ item.text }}</p>
                </div>
                <div class="ce-options" role="radiogroup" :aria-label="item.text">
                  <label v-for="response in responses" :key="response.id" class="ce-option" :class="{ 'is-picked': selected[item.id] === response.id }">
                    <input type="radio" class="ce-radio" :name="'ci-' + item.id" :value="response.id" :checked="selected[item.id] === response.id"
                      @change="selected = { ...selected, [item.id]: response.id }" />
                    {{ response.name }}
                  </label>
                </div>
                <InputText v-model="notes[item.id]" class="ce-note" :placeholder="$t('notes')" :aria-label="$t('notes')" />
              </div>
            </div>
          </article>
        </section>

        <footer class="ce-footer">
          <span><i class="pi pi-list-check" aria-hidden="true" /> {{ $t("carolina_ui.answered_of", { n: answeredCount, total: items.length }) }}</span>
          <Button :label="$t('submit')" icon="pi pi-check" :loading="saving" data-no-request-spinner @click="save" />
        </footer>
      </template>
    </template>
  </div>
</template>

<style scoped>
.ce-page { display: grid; gap: 1rem; }
.ce-hero { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.25rem 1.5rem; border-radius: var(--sawa-radius, 16px); background: linear-gradient(135deg, var(--sawa-primary, #135c65) 0%, #1b7c86 100%); color: #fff; }
.ce-hero-main { display: flex; align-items: center; gap: 1rem; }
.ce-hero-icon { display: grid; place-items: center; width: 3rem; height: 3rem; border-radius: 14px; background: rgba(255, 255, 255, .15); font-size: 1.4rem; }
.ce-hero h1 { margin: 0; font-size: 1.35rem; font-weight: 800; }
.ce-hero p { margin: .2rem 0 0; opacity: .85; }
.ce-hero-progress { display: grid; justify-items: end; }
.ce-hero-progress b { font-size: 1.4rem; }
.ce-state { display: grid; place-items: center; padding: 3rem; }
.ce-card { padding: 1.25rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 16px; background: #fff; }
.ce-card-head { display: flex; align-items: flex-start; gap: .75rem; margin-bottom: 1rem; }
.ce-card-head h2 { margin: 0; font-size: 1.1rem; font-weight: 800; }
.ce-card-head p { margin: .2rem 0 0; color: var(--sawa-muted, #64748b); }
.ce-step { display: grid; place-items: center; width: 2rem; height: 2rem; border-radius: 50%; background: var(--sawa-primary, #135c65); color: #fff; font-weight: 800; flex: none; }
.ce-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr)); gap: 1rem; }
.ce-field { display: grid; gap: .4rem; align-content: start; }
.ce-field label { font-weight: 700; }
.ce-colors { display: flex; flex-wrap: wrap; gap: .5rem; }
.ce-colors button { width: 2.2rem; height: 2.2rem; border-radius: 10px; border: 3px solid transparent; cursor: pointer; }
.ce-colors button.selected { border-color: #0f172a; box-shadow: inset 0 0 0 2px #fff; }
.ce-colors button:disabled { cursor: default; }
.ce-start { display: flex; justify-content: flex-end; margin-top: 1rem; }
.ce-section { display: grid; gap: .75rem; }
.ce-section-title { margin: .5rem .25rem 0; font-size: 1.15rem; font-weight: 800; color: var(--sawa-primary, #135c65); }
.ce-goal { display: grid; gap: 1rem; }
.ce-goal-head { display: grid; gap: .15rem; padding-bottom: .75rem; border-bottom: 1px solid var(--sawa-border, #e2e8f0); }
.ce-goal-label { color: var(--sawa-muted, #64748b); font-size: .8rem; font-weight: 700; }
.ce-goal-head h3 { margin: 0; font-size: 1.05rem; font-weight: 800; }
.ce-age { display: grid; gap: .5rem; }
.ce-age-label { display: inline-flex; align-items: center; gap: .4rem; width: fit-content; padding: .2rem .7rem; border-radius: 999px; background: #edf7f5; color: var(--sawa-primary, #135c65); font-size: .85rem; }
.ce-item { display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(10rem, 14rem); align-items: center; gap: .75rem; padding: .7rem .85rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 12px; }
.ce-item.is-done { border-inline-start: 4px solid var(--pick); }
.ce-item.is-missing { border-color: #f87171; box-shadow: 0 0 0 2px #fecaca; }
.ce-item-main { display: flex; align-items: flex-start; gap: .6rem; }
.ce-symbol { flex: none; min-width: 2.6rem; padding: .15rem .45rem; border-radius: 8px; background: #f1f5f9; font-weight: 800; text-align: center; }
.ce-skill { margin: 0; font-weight: 600; line-height: 1.6; }
.ce-options { display: flex; flex-wrap: wrap; gap: .4rem; }
.ce-option { position: relative; min-width: 2.6rem; padding: .35rem .75rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 999px; text-align: center; font-weight: 800; cursor: pointer; }
.ce-option.is-picked { border-color: var(--pick); background: var(--pick); color: #fff; }
.ce-option:focus-within { outline: 2px solid var(--sawa-primary, #135c65); outline-offset: 2px; }
.ce-radio { position: absolute; opacity: 0; pointer-events: none; }
.ce-footer { position: sticky; bottom: 0; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .85rem 1.25rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 14px; background: #fff; box-shadow: 0 -6px 20px -12px rgba(15, 23, 42, .25); }
@media (max-width: 900px) {
  .ce-item { grid-template-columns: 1fr; }
}
</style>
