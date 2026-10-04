<script setup>
// The printable evaluation report: A4 pages shown as they will print. Highlighted fields are typed in
// directly on the page (kept as a draft on this device) and "Print" prints the pages only.
//
// Pages: 1 cover (logo, child, evaluations) · 2 personal info + team signatures (newest chosen evaluation)
// · then one section per evaluation type (at most four evaluations each): VB-MAPP = case description page
// and one VB-MAPP form page whose test columns are the chosen tests only, then a strengths/weaknesses table of the
// newest chosen test (the EESA form never appears in the report); any
// other type = its results,
// one block per chosen evaluation. The behaviour-problems table belongs to a behavioural evaluation only.
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import sawaLogo from "@/assets/img/sawa_logo.svg";
import EditableText from "@/components/reports/EditableText.vue";
import MilestoneLevelChart from "@/components/reports/MilestoneLevelChart.vue";
import TestTables from "@/components/reports/TestTables.vue";
import BarrierChart from "@/components/reports/BarrierChart.vue";
import AbllsChart from "@/components/reports/AbllsChart.vue";
import CarolinaChart from "@/components/reports/CarolinaChart.vue";
import SideProfileChart from "@/components/reports/SideProfileChart.vue";
import {
  ABLLS, BARRIER, CAROLINA, MAX_PER_GROUP, MILESTONE, SIDE_PROFILE, ageOn, ageWords, dateParts, dmy, firstName, groupItems,
  isBehavioural, isFemale, typeIcon, typeLabel,
} from "@/components/reports/reportUtils";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

// The child and the chosen evaluations come from the URL (a new selection reloads the report).
const childId = computed(() => String(route.params.childId));
const keys = computed(() => String(route.query.items ?? "").split(",").map((key) => key.trim()).filter(Boolean));
const draftKey = computed(() => `ereport-draft:${childId.value}:${[...keys.value].sort().join(",")}`);

const loading = ref(true);
const loadError = ref(false);
const report = ref(null);
const edits = ref(null);

const child = computed(() => report.value?.child ?? {});
const items = computed(() => report.value?.items ?? []);
const female = computed(() => isFemale(child.value.gender));
const shortName = computed(() => firstName(child.value.name));
const birth = computed(() => dateParts(child.value.birth_date));
const dates = computed(() => items.value.map((item) => item.date).filter(Boolean).sort());

// One section per evaluation type, newest type first; inside, oldest to newest (1st test ... 4th test).
const byDate = (a, b) => String(a.date).localeCompare(String(b.date)) || a.id - b.id;
const sections = computed(() =>
  groupItems(items.value, t).map((group) => {
    const tests = [...group.items].sort(byDate).slice(-MAX_PER_GROUP);
    return { ...group, tests, newest: tests[tests.length - 1], behavioural: isBehavioural(group.label) };
  })
);

// Cover: one card per evaluation family; side-profile dimensions are rows of one card.
const coverCards = computed(() => {
  const cards = new Map();
  for (const section of sections.value) {
    const family = section.type;
    if (!cards.has(family)) cards.set(family, { type: family, label: typeLabel(family, t), rows: [], count: 0 });
    const card = cards.get(family);
    card.rows.push({ label: family === SIDE_PROFILE ? section.label : null, tests: section.tests });
    card.count += section.tests.length;
  }
  return [...cards.values()].map((card) => ({
    ...card,
    evaluators: [...new Set(card.rows.flatMap((row) => row.tests).map((test) => test.specialist?.name).filter(Boolean))].join("، "),
  }));
});
const todayIso = (() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
})();

const behaviourColumns = ["behavior", "behavior_detail", "severity", "frequency", "duration"];

// ---- editable values -------------------------------------------------------------------------------

const list = (values) => (values ?? []).filter(Boolean).join("، ");

function defaults(data) {
  const team = data.team ?? {};
  const therapistSpecialty = [list(team.therapist?.specialty), list(team.therapist?.treatments)].filter(Boolean).join(" - ");
  return {
    team: [
      { name: team.consultant?.name ?? "", specialty: list(team.consultant?.specialty) },
      { name: team.therapist?.name ?? "", specialty: therapistSpecialty },
      { name: team.parent?.name ?? "", specialty: team.parent?.relation ?? "" },
    ],
    // Per section (evaluation type): the case-description blanks and VB-MAPP scores, and the behaviour table.
    // The case description page's two blanks (one page per report).
    caseText: { level: "", skills: "" },
    // VB-MAPP levels left out of the report (their charts and strengths/weaknesses tables), by level id.
    hiddenLevels: [],
    cases: Object.fromEntries(groupItems(data.items).map((group) => [group.group, { scores: ["", "", "", ""] }])),
    behaviors: Object.fromEntries(groupItems(data.items).map((group) => [group.group, Array.from({ length: 3 }, () => ["", "", "", "", ""])])),
  };
}

function readDraft() {
  try {
    const saved = JSON.parse(localStorage.getItem(draftKey.value) ?? "null");
    return saved && typeof saved === "object" ? saved : null;
  } catch {
    return null;
  }
}

function applyDraft(base, saved) {
  if (!saved) return base;
  if (Array.isArray(saved.team)) base.team = base.team.map((row, i) => ({ ...row, ...(saved.team[i] ?? {}) }));
  // Drafts from before the case page moved kept its blanks with the VB-MAPP section.
  const oldCase = Object.values(saved.cases ?? {}).find((value) => value?.level || value?.skills);
  base.caseText = { ...base.caseText, ...(oldCase ? { level: oldCase.level ?? "", skills: oldCase.skills ?? "" } : {}), ...(saved.caseText ?? {}) };
  if (Array.isArray(saved.hiddenLevels)) base.hiddenLevels = saved.hiddenLevels.map(String);
  for (const key of Object.keys(base.cases)) {
    if (Array.isArray(saved.cases?.[key]?.scores)) base.cases[key].scores = saved.cases[key].scores;
    if (Array.isArray(saved.behaviors?.[key])) base.behaviors[key] = saved.behaviors[key];
  }
  return base;
}

watch(edits, (value) => {
  if (!value) return;
  try {
    localStorage.setItem(draftKey.value, JSON.stringify(value));
  } catch {
    // Storage full or blocked: the edits still stay on the page.
  }
}, { deep: true });

function resetEdits() {
  try {
    localStorage.removeItem(draftKey.value);
  } catch {
    // ignore
  }
  edits.value = defaults(report.value);
}

// ---- data ------------------------------------------------------------------------------------------

async function load() {
  loading.value = true;
  loadError.value = false;
  try {
    const { data } = await axios.get(`api/reports/children/${childId.value}/report`, { params: { items: keys.value } });
    report.value = data;
    edits.value = applyDraft(defaults(data), readDraft());
    document.title = `${t("ereport.report_title")} - ${data.child?.name ?? ""}`;
  } catch {
    loadError.value = true;
  } finally {
    loading.value = false;
  }
}

const previousTitle = document.title;
function open() {
  window.scrollTo(0, 0);
  report.value = null;
  edits.value = null;
  if (!keys.value.length) {
    loading.value = false;
    loadError.value = true;
    return;
  }
  load();
}
onMounted(open);
watch(() => route.fullPath, (path, before) => {
  if (route.name === "evaluation-report" && path !== before) open();
});
onBeforeUnmount(() => {
  document.title = previousTitle;
});

// ---- VB-MAPP helpers -------------------------------------------------------------------------------

// All chosen tests on one chart per level, from the highest level down (3, 2, 1), without the levels hidden in
// the toolbar: each milestone box lists, per test (numbered 1-4 like the test table, oldest first), the score and
// color that test gave it.
const mergedLevels = (tests) => {
  const levels = new Map();
  tests.forEach((test, index) => {
    for (const level of test.result?.levels ?? []) {
      if (!levels.has(level.level_id)) {
        levels.set(level.level_id, { level_id: level.level_id, level_name: level.level_name, level_age: level.level_age, subtests: [] });
      }
      const target = levels.get(level.level_id);
      for (const subtest of level.subtests ?? []) {
        let domain = target.subtests.find((item) => item.subtest_name === subtest.subtest_name);
        if (!domain) target.subtests.push((domain = { subtest_name: subtest.subtest_name, subtest_symbol: subtest.subtest_symbol, questions: [] }));
        (subtest.questions ?? []).forEach((question, q) => {
          domain.questions[q] ??= { question: question.question, marks: [] };
          domain.questions[q].marks.push({ n: index + 1, color: question.answer_color, score: question.answer_score });
        });
      }
    }
  });
  return [...levels.values()]
    .filter((level) => isLevelShown(level.level_id))
    .sort((a, b) => (Number(b.level_age) || 0) - (Number(a.level_age) || 0) || Number(b.level_id) - Number(a.level_id));
};

// The VB-MAPP levels in the chosen tests (lowest first) for the toolbar's level picker.
const milestoneLevels = computed(() => {
  const levels = new Map();
  for (const section of sections.value.filter((item) => item.type === MILESTONE)) {
    for (const test of section.tests) {
      for (const level of test.result?.levels ?? []) {
        if (!levels.has(String(level.level_id))) levels.set(String(level.level_id), { id: String(level.level_id), name: level.level_name, age: level.level_age });
      }
    }
  }
  return [...levels.values()].sort((a, b) => (Number(a.age) || 0) - (Number(b.age) || 0) || Number(a.id) - Number(b.id));
});
const isLevelShown = (levelId) => !(edits.value?.hiddenLevels ?? []).includes(String(levelId));
function toggleLevel(levelId, shown) {
  const hidden = new Set(edits.value.hiddenLevels.map(String));
  if (shown) hidden.delete(String(levelId));
  else hidden.add(String(levelId));
  edits.value.hiddenLevels = [...hidden];
}
const caseAge = (item) => (item ? ageWords(ageOn(child.value.birth_date, item.date), t) : "");
// The age in the case description: at the newest chosen VB-MAPP test, or else the newest chosen evaluation.
const caseItem = computed(() => sections.value.find((section) => section.type === MILESTONE)?.newest ?? items.value[0] ?? null);

// The newest chosen test's strengths and weaknesses: one table per level (the first level first), one row per
// target symbol. Weaknesses are numbered inside their row: M-1, M-2...
const summaryRows = (goals) => {
  const rows = new Map();
  for (const goal of goals) {
    const key = goal.symbol || goal.general_goal;
    if (!rows.has(key)) rows.set(key, { symbol: goal.symbol ?? "", name: goal.general_goal ?? "", statuses: new Set(), strengths: [], weaknesses: [] });
    const row = rows.get(key);
    if (goal.status) row.statuses.add(goal.status);
    row.strengths.push(...(goal.strength ?? []).map((point) => point.question).filter(Boolean));
    row.weaknesses.push(...(goal.weak ?? []).map((point) => point.question).filter(Boolean));
  }
  return [...rows.values()].map((row) => ({
    ...row,
    status: [...row.statuses].join("، "),
    weaknesses: row.weaknesses.map((text, i) => ({ code: [row.symbol, i + 1].filter(Boolean).join("-"), text })),
  }));
};
const summaryTables = (section) => {
  const names = new Map((section.newest?.result?.levels ?? []).map((level) => [String(level.level_id), level.level_name]));
  const levels = new Map();
  for (const goal of section.newest?.result?.summary ?? []) {
    const key = String(goal.level_id ?? "");
    if (!levels.has(key)) levels.set(key, []);
    levels.get(key).push(goal);
  }
  return [...levels.entries()]
    .filter(([key]) => isLevelShown(key))
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([key, goals]) => ({ key, title: names.get(key) ?? "", rows: summaryRows(goals) }));
};

const milestoneExtras = computed(() => Object.fromEntries(sections.value
  .filter((section) => section.type === MILESTONE)
  .map((section) => [section.group, { summary: summaryTables(section) }])));

// ---- actions ---------------------------------------------------------------------------------------

function print() {
  document.activeElement?.blur?.();
  window.print();
}

function back() {
  router.push({ name: "evaluation-reports", query: { child: childId.value } });
}
</script>

<template>
  <div class="rx-root">
    <!-- toolbar (not printed) -->
    <header class="rx-toolbar">
      <Button :label="$t('ereport.back')" icon="pi pi-arrow-right" class="rx-back" severity="secondary" variant="outlined" @click="back" />
      <div class="rx-toolbar-title">
        <strong>{{ $t("ereport.report_title") }}<template v-if="child.name"> — {{ child.name }}</template></strong>
        <small><i class="pi pi-pencil" aria-hidden="true" /> {{ $t("ereport.editor_hint") }}</small>
      </div>
      <!-- Which VB-MAPP levels the report shows (charts and strengths/weaknesses); not printed. -->
      <fieldset v-if="report && milestoneLevels.length" class="rx-levels">
        <legend>{{ $t("ereport.levels_shown") }}</legend>
        <label v-for="level in milestoneLevels" :key="level.id" class="rx-level-option">
          <Checkbox :modelValue="isLevelShown(level.id)" binary :inputId="'rx-level-' + level.id"
            @update:modelValue="toggleLevel(level.id, $event)" />
          <span>{{ level.name || $t("level_n", { n: level.age || level.id }) }}</span>
        </label>
      </fieldset>
      <div class="rx-toolbar-actions">
        <Button v-if="report" :label="$t('ereport.reset')" icon="pi pi-refresh" severity="secondary" variant="text" @click="resetEdits" />
        <Button :label="$t('ereport.print')" icon="pi pi-print" :disabled="!report" data-no-request-spinner @click="print" />
      </div>
    </header>

    <div v-if="loading" class="rx-state">
      <ProgressSpinner style="width: 44px; height: 44px" />
      <p>{{ $t("ereport.loading") }}</p>
    </div>
    <div v-else-if="loadError || !report" class="rx-state">
      <i class="pi pi-exclamation-circle" aria-hidden="true" />
      <p>{{ $t("ereport.load_failed") }}</p>
      <Button :label="$t('ereport.back')" severity="secondary" @click="back" />
    </div>

    <main v-else class="rx-pages" :class="{ 'is-female': female }">
      <!-- 1. Cover -->
      <section class="rx-page rx-cover">
        <div class="rx-cover-top">
          <img :src="sawaLogo" alt="Sawa" class="rx-cover-logo" />
          <p class="rx-cover-academy">{{ $t("ereport.academy") }}</p>
        </div>

        <div class="rx-cover-center">
          <p class="rx-cover-kicker">{{ $t("ereport.report_title") }}</p>
          <h1 class="rx-cover-name">{{ child.name }}</h1>
          <div class="rx-cover-line" />
          <p class="rx-cover-facts">
            <span>{{ female ? $t("female") : $t("male") }}</span>
            <span v-if="birth">{{ $t("ereport.birth_date") }}: <b class="ltr">{{ dmy(child.birth_date) }}</b></span>
            <span>{{ $t("ereport.report_date") }}: <b class="ltr">{{ dmy(todayIso) }}</b></span>
          </p>
        </div>

        <div class="rx-cover-list">
          <h2>{{ $t("ereport.included") }}</h2>
          <div class="rx-cover-grid" :class="{ 'is-single': coverCards.length === 1 }">
            <article v-for="card in coverCards" :key="card.type" class="rx-cover-card">
              <header>
                <span class="rx-cover-icon"><i :class="typeIcon(card.type)" aria-hidden="true" /></span>
                <strong>{{ card.label }}</strong>
                <span class="rx-cover-count">{{ card.count }}</span>
              </header>
              <div v-for="(row, r) in card.rows" :key="r" class="rx-cover-row">
                <span v-if="row.label" class="rx-cover-dim">{{ row.label }}</span>
                <span class="rx-cover-dates">
                  <span v-for="test in row.tests" :key="test.key" class="ltr">{{ dmy(test.date) }}</span>
                </span>
              </div>
              <footer v-if="card.evaluators">
                <i class="pi pi-user" aria-hidden="true" /> {{ card.evaluators }}
              </footer>
            </article>
          </div>
        </div>

        <footer class="rx-cover-foot">{{ $t("ereport.academy") }}</footer>
      </section>

      <!-- 2. Personal information and team -->
      <section class="rx-page">
        <header class="rx-head">
          <img :src="sawaLogo" alt="Sawa" />
          <span>{{ $t("ereport.report_title") }} · {{ child.name }}</span>
        </header>

        <h2 class="rx-bullet">{{ $t("ereport.personal_info") }}</h2>
        <table class="rx-table rx-info">
          <tbody>
            <tr>
              <th>{{ $t("ereport.student_name") }}</th>
              <td><strong>{{ child.name }}</strong></td>
            </tr>
            <tr>
              <th>{{ $t("ereport.birth_date") }}</th>
              <td>
                <span class="rx-dob">
                  <span>{{ $t("ereport.day") }}: <b>{{ birth?.day ?? "" }}</b></span>
                  <span>{{ $t("ereport.month") }}: <b>{{ birth?.month ?? "" }}</b></span>
                  <span>{{ $t("ereport.year") }}: <b>{{ birth?.year ?? "" }}</b></span>
                </span>
              </td>
            </tr>
            <tr>
              <th>{{ $t("ereport.gender") }}</th>
              <td>
                <span class="rx-gender">
                  <span>{{ $t("male") }} <i class="rx-box" :class="{ 'is-on': !female }" /></span>
                  <span>{{ $t("female") }} <i class="rx-box" :class="{ 'is-on': female }" /></span>
                </span>
              </td>
            </tr>
            <tr>
              <th>{{ $t("ereport.first_evaluation") }}</th>
              <td class="ltr-cell"><span class="ltr">{{ dmy(dates[0]) }}</span></td>
            </tr>
            <tr>
              <th>{{ $t("ereport.last_evaluation_date") }}</th>
              <td class="ltr-cell"><span class="ltr">{{ dmy(dates[dates.length - 1]) }}</span></td>
            </tr>
          </tbody>
        </table>

        <h2 class="rx-bullet rx-space">{{ $t("ereport.team") }}</h2>
        <table class="rx-table rx-team">
          <thead>
            <tr>
              <th class="rx-col-num">{{ $t("ereport.number") }}</th>
              <th>{{ $t("ereport.name") }}</th>
              <th>{{ $t("ereport.specialty") }}</th>
              <th class="rx-col-sign">{{ $t("ereport.signature") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in edits.team" :key="i">
              <td class="rx-col-num">{{ i + 1 }}</td>
              <td><EditableText v-model="row.name" block :placeholder="$t('ereport.name')" /></td>
              <td><EditableText v-model="row.specialty" block :placeholder="$t('ereport.specialty')" /></td>
              <td class="rx-col-sign" />
            </tr>
          </tbody>
        </table>

        <footer class="rx-foot"><span>{{ $t("ereport.academy") }}</span><span class="rx-page-num" /></footer>
      </section>

      <!-- 3. Case description: always the third page, before any chart -->
      <section class="rx-page">
        <header class="rx-head">
          <img :src="sawaLogo" alt="Sawa" />
          <span>{{ $t("ereport.report_title") }} · {{ child.name }}</span>
        </header>

        <h2 class="rx-band">{{ $t("ereport.case_description", { name: shortName }) }}</h2>
        <p class="rx-case">
          {{ $t(female ? "ereport.case_text_female" : "ereport.case_text_male", { name: shortName, age: caseAge(caseItem) }) }}
          <EditableText v-model="edits.caseText.level" bold :placeholder="$t('ereport.blank')" />
          {{ $t(female ? "ereport.case_text_2_female" : "ereport.case_text_2_male") }}
          <EditableText v-model="edits.caseText.skills" :placeholder="$t('ereport.blank')" />.
        </p>

        <footer class="rx-foot"><span>{{ $t("ereport.academy") }}</span><span class="rx-page-num" /></footer>
      </section>

      <!-- 4+. One section per evaluation type -->
      <template v-for="section in sections" :key="section.group">
        <template v-if="section.type === MILESTONE">
          <!-- The VB-MAPP form: test columns = the chosen tests only; chart = the newest one -->
          <section class="rx-page">
            <header class="rx-head">
              <img :src="sawaLogo" alt="Sawa" />
              <span>VB-MAPP · <span class="ltr">{{ dmy(section.newest.date) }}</span></span>
            </header>

            <p class="rx-kicker">{{ $t("ereport.special_education") }}</p>
            <p class="rx-intro">{{ $t("ereport.form_intro", { name: child.name, evaluation: "VB-MAPP" }) }}</p>

            <TestTables :child="child" :tests="section.tests" :scores="edits.cases[section.group].scores" />

            <div class="vb-levels">
              <MilestoneLevelChart v-for="level in mergedLevels(section.tests)" :key="level.level_id" :level="level" />
              <p v-if="!mergedLevels(section.tests).length" class="rx-empty">{{ $t("ereport.no_result_data") }}</p>
            </div>

            <footer class="rx-foot"><span>{{ $t("ereport.academy") }}</span><span class="rx-page-num" /></footer>
          </section>

          <!-- Strengths and weaknesses of the newest chosen test: each level starts its own page -->
          <section
            v-for="(table, t) in milestoneExtras[section.group].summary.length ? milestoneExtras[section.group].summary : [null]"
            :key="'summary-' + (table?.key ?? 'none')"
            class="rx-page"
          >
            <header class="rx-head">
              <img :src="sawaLogo" alt="Sawa" />
              <span>VB-MAPP · <span class="ltr">{{ dmy(section.newest.date) }}</span></span>
            </header>

            <p v-if="t === 0" class="rx-summary-intro">{{ $t(female ? "ereport.summary_intro_female" : "ereport.summary_intro_male") }}</p>

            <template v-if="table">
            <h3 v-if="table.title" class="rx-summary-level">{{ table.title }}</h3>
            <table class="rx-table rx-summary">
              <thead>
                <tr>
                  <th class="rx-sum-num">{{ $t("ereport.number") }}</th>
                  <th>{{ $t("ereport.strengths") }}</th>
                  <th>{{ $t("ereport.weaknesses") }}</th>
                  <th class="rx-sum-status">{{ $t("ereport.goal_status") }}</th>
                  <th class="rx-sum-symbol">{{ $t("ereport.target_symbol") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, r) in table.rows" :key="r">
                  <td class="rx-sum-num">{{ r + 1 }}</td>
                  <td>
                    <ul v-if="row.strengths.length" class="rx-points">
                      <li v-for="(point, p) in row.strengths" :key="p">{{ point }}</li>
                    </ul>
                  </td>
                  <td>
                    <template v-if="row.weaknesses.length">
                      <strong class="rx-weak-name">{{ row.name }}:</strong>
                      <p v-for="point in row.weaknesses" :key="point.code" class="rx-weak">
                        <b class="ltr">{{ point.code }}</b> {{ point.text }}
                      </p>
                    </template>
                  </td>
                  <td class="rx-sum-status">{{ row.status }}</td>
                  <td class="rx-sum-symbol"><b class="ltr">{{ row.symbol }}</b></td>
                </tr>
              </tbody>
            </table>
            </template>
            <p v-else class="rx-empty">{{ $t("ereport.no_result_data") }}</p>

            <footer class="rx-foot"><span>{{ $t("ereport.academy") }}</span><span class="rx-page-num" /></footer>
          </section>
        </template>

        <!-- Any other type: the same test tables, then its chart as on its results page -->
        <section v-else class="rx-page">
          <header class="rx-head">
            <img :src="sawaLogo" alt="Sawa" />
            <span>{{ section.label }} · <span class="ltr">{{ dmy(section.newest.date) }}</span></span>
          </header>

          <h2 class="rx-band">{{ $t("ereport.results_of", { name: section.label }) }}</h2>
          <p class="rx-intro">{{ $t("ereport.form_intro", { name: child.name, evaluation: section.label }) }}</p>

          <TestTables :child="child" :tests="section.tests" :scores="edits.cases[section.group].scores" />

          <BarrierChart v-if="section.type === BARRIER" :tests="section.tests" />
          <AbllsChart v-else-if="section.type === ABLLS" :tests="section.tests" />
          <CarolinaChart v-else-if="section.type === CAROLINA" :tests="section.tests" />
          <SideProfileChart v-else-if="section.type === SIDE_PROFILE" :tests="section.tests" />

          <template v-if="section.behavioural">
            <h2 class="rx-band rx-band-soft rx-space">{{ $t("ereport.behaviors") }}</h2>
            <table class="rx-table rx-behaviours">
              <thead>
                <tr>
                  <th v-for="column in behaviourColumns" :key="column">{{ $t(`ereport.${column}`) }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, r) in edits.behaviors[section.group]" :key="r">
                  <td v-for="(value, c) in row" :key="c">
                    <EditableText v-model="row[c]" block multiline />
                  </td>
                </tr>
              </tbody>
            </table>
          </template>

          <footer class="rx-foot"><span>{{ $t("ereport.academy") }}</span><span class="rx-page-num" /></footer>
        </section>
      </template>
    </main>
  </div>
</template>

<style scoped>
.rx-root {
  min-height: 100vh;
  background: #e8edef;
  color: #1e293b;
}

/* toolbar */
.rx-toolbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1rem;
  padding: 0.7rem 1.25rem;
  background: #fff;
  border-bottom: 1px solid var(--sawa-border);
  box-shadow: 0 2px 10px -6px rgba(15, 23, 42, 0.25);
}
[dir="ltr"] .rx-back :deep(.pi-arrow-right) {
  transform: scaleX(-1);
}
.rx-toolbar-title {
  display: grid;
  flex: 1 1 18rem;
  min-width: 0;
}
.rx-toolbar-title strong {
  color: var(--sawa-primary);
  font-size: 1.05rem;
}
.rx-toolbar-title small {
  color: var(--sawa-muted);
}
.rx-toolbar-actions {
  display: flex;
  gap: 0.5rem;
}
.rx-levels {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 1rem;
  margin: 0;
  padding: 0.3rem 0.75rem;
  border: 1px solid var(--sawa-border);
  border-radius: 10px;
}
.rx-levels legend {
  float: inline-start;
  margin-inline-end: 0.25rem;
  padding: 0;
  color: var(--sawa-primary);
  font-size: 0.85rem;
  font-weight: 700;
}
.rx-level-option {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  cursor: pointer;
}
.rx-state {
  display: grid;
  justify-items: center;
  gap: 0.75rem;
  padding: 5rem 1rem;
  color: var(--sawa-muted);
}
.rx-state > .pi {
  font-size: 2.5rem;
  color: #94a3b8;
}

/* pages */
.rx-pages {
  display: grid;
  justify-content: center;
  gap: 24px;
  padding: 28px 12px 64px;
  overflow-x: auto;
  counter-reset: rx-page;
}
.rx-page {
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 210mm;
  min-height: 297mm;
  padding: 14mm 15mm 12mm;
  background: #fff;
  box-shadow: 0 10px 30px -12px rgba(15, 23, 42, 0.35);
  font-size: 11.5pt;
  line-height: 1.75;
  counter-increment: rx-page;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.rx-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8mm;
  padding-bottom: 8px;
  border-bottom: 2px solid #135c65;
  color: #64748b;
  font-size: 9.5pt;
  font-weight: 600;
}
.rx-head img {
  height: 38px;
}
.rx-foot {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px solid #e2e8f0;
  color: #94a3b8;
  font-size: 8.5pt;
}
/* Room between the content and the footer that is pushed to the bottom of the sheet. */
.rx-page > :not(.rx-foot):nth-last-child(2) {
  margin-bottom: 8mm;
}
.rx-page-num::after {
  content: counter(rx-page);
}

/* cover */
.rx-cover {
  padding: 0;
  overflow: hidden;
  background:
    radial-gradient(circle at 100% 0, rgba(19, 92, 101, 0.1) 0 150px, transparent 151px),
    radial-gradient(circle at 0 100%, rgba(169, 171, 127, 0.16) 0 170px, transparent 171px),
    #fff;
}
.rx-cover-top {
  display: grid;
  justify-items: center;
  gap: 4px;
  padding: 16mm 20mm 0;
}
.rx-cover-logo {
  height: 84px;
}
.rx-cover-academy {
  margin: 0;
  color: #135c65;
  font-size: 12pt;
  font-weight: 700;
}
.rx-cover-center {
  display: grid;
  justify-items: center;
  gap: 4px;
  margin: 10mm 20mm 9mm;
  padding: 8mm 10mm 7mm;
  border-radius: 16px;
  background: linear-gradient(135deg, #135c65 0%, #1b7c86 100%);
  color: #fff;
  text-align: center;
}
.rx-cover-kicker {
  margin: 0;
  font-size: 11.5pt;
  opacity: 0.85;
}
.rx-cover-name {
  margin: 0;
  font-size: 23pt;
  font-weight: 800;
  line-height: 1.35;
}
.rx-cover-line {
  width: 60px;
  height: 4px;
  margin: 2px 0 4px;
  border-radius: 4px;
  background: #a9ab7f;
}
.rx-cover-facts {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2px 18px;
  margin: 0;
  font-size: 10pt;
  opacity: 0.92;
}
.rx-cover-list {
  margin: 0 18mm;
}
.rx-cover-list h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 8px;
  color: #135c65;
  font-size: 12pt;
  font-weight: 800;
}
.rx-cover-list h2::before {
  content: "";
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #135c65;
}
.rx-cover-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
.rx-cover-grid.is-single {
  grid-template-columns: minmax(0, 1fr);
}
.rx-cover-card {
  display: grid;
  align-content: start;
  gap: 5px;
  padding: 8px 11px;
  border: 1px solid #d5e6e8;
  border-radius: 10px;
  background: #fff;
  font-size: 9.5pt;
  line-height: 1.5;
  break-inside: avoid;
}
.rx-cover-card header {
  display: flex;
  align-items: center;
  gap: 8px;
}
.rx-cover-card header strong {
  flex: 1;
  color: #0e464d;
  font-size: 11pt;
}
.rx-cover-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: #eef8f9;
  color: #135c65;
  font-size: 9pt;
}
.rx-cover-count {
  display: grid;
  place-items: center;
  min-width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #135c65;
  color: #fff;
  font-size: 9pt;
  font-weight: 800;
}
.rx-cover-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
}
.rx-cover-dim {
  color: #334155;
  font-weight: 700;
}
.rx-cover-dates {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.rx-cover-dates span {
  padding: 0 7px;
  border-radius: 999px;
  background: #f1f5f9;
  color: #334155;
  font-size: 9pt;
}
.rx-cover-card footer {
  color: #64748b;
  font-size: 8.5pt;
}
.rx-cover-foot {
  margin-top: auto;
  padding: 8mm 20mm 11mm;
  color: #94a3b8;
  font-size: 9.5pt;
  text-align: center;
}

/* headings */
.rx-bullet {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 12px;
  color: #135c65;
  font-size: 14pt;
  font-weight: 800;
}
.rx-bullet::before {
  content: "";
  flex: none;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #135c65;
  box-shadow: 0 0 0 4px #d7ecee;
}
.rx-band {
  margin: 0 0 12px;
  padding: 8px 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, #135c65 0%, #1b7c86 100%);
  color: #fff;
  font-size: 14pt;
  font-weight: 800;
}
.rx-band-soft {
  background: #eef8f9;
  color: #135c65;
  border-inline-start: 5px solid #135c65;
}
.rx-space {
  margin-top: 10mm;
}
.rx-kicker {
  margin: 0;
  color: #135c65;
  font-size: 13pt;
  font-weight: 800;
}
.rx-intro {
  margin: 2px 0 12px;
}
.rx-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 18px;
  margin: 0 0 12px;
  color: #475569;
  font-size: 10pt;
}
.rx-case {
  margin: 0;
  padding: 12px 16px;
  border: 1px solid #d5e6e8;
  border-radius: 10px;
  background: #fbfdfd;
  font-size: 12.5pt;
  line-height: 2.1;
  text-align: start;
  white-space: normal;
  overflow-wrap: anywhere;
}
.rx-empty {
  color: #64748b;
  text-align: center;
}


/* tables */
.rx-table {
  width: 100%;
  border-collapse: collapse;
}
.rx-table th,
.rx-table td {
  padding: 8px 12px;
  border: 1px solid #b7cdd0;
  text-align: start;
  vertical-align: middle;
}
.rx-table thead th {
  background: #135c65;
  color: #fff;
  font-weight: 700;
}
.rx-info th {
  width: 34%;
  background: #eef8f9;
  color: #0e464d;
  font-weight: 700;
}
.rx-dob {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 28px;
}
.rx-dob b {
  display: inline-block;
  min-width: 2.2em;
  text-align: center;
  border-bottom: 1px dotted #94a3b8;
}
.rx-gender {
  display: flex;
  gap: 36px;
}
.rx-gender > span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.rx-box {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 1.5px solid #0e464d;
  border-radius: 3px;
}
.rx-box.is-on {
  background: #135c65;
  box-shadow: inset 0 0 0 2px #fff;
}
.ltr-cell {
  text-align: start;
}
.rx-team td {
  height: 16mm;
}
.rx-col-num {
  width: 12%;
  text-align: center !important;
}
.rx-col-sign {
  width: 24%;
}
.rx-behaviours th {
  font-size: 10pt;
}
.rx-behaviours td {
  height: 22mm;
  vertical-align: top;
  font-size: 10pt;
}

/* Tighter rows than on screen so the whole form fits one sheet. */
.rx-summary-intro {
  margin: 0 0 10px;
  font-size: 12.5pt;
  font-weight: 700;
}
.rx-summary-level {
  margin: 14px 0 6px;
  padding-inline-start: 10px;
  border-inline-start: 4px solid #135c65;
  color: #135c65;
  font-size: 12pt;
  font-weight: 800;
  break-after: avoid;
  page-break-after: avoid;
}
.rx-head + .rx-summary-level,
.rx-summary-intro + .rx-summary-level {
  margin-top: 0;
}
.rx-summary th,
.rx-summary td {
  padding: 6px 8px;
  font-size: 10pt;
  line-height: 1.6;
  vertical-align: top;
}
.rx-summary thead th {
  text-align: center;
  vertical-align: middle;
}
.rx-summary tr {
  break-inside: avoid;
  page-break-inside: avoid;
}
.rx-sum-num {
  width: 7%;
  text-align: center !important;
}
.rx-sum-status {
  width: 12%;
  text-align: center !important;
}
.rx-sum-symbol {
  width: 11%;
  text-align: center !important;
}
.rx-points {
  margin: 0;
  padding-inline-start: 1.1em;
  list-style: disc;
}
.rx-points li::marker {
  color: #135c65;
}
.rx-weak-name {
  display: block;
  color: #0e464d;
}
.rx-weak {
  margin: 0;
}
.rx-weak b {
  display: inline-block;
  color: #b45309;
}
.vb-levels {
  display: grid;
  gap: 3mm;
}

@media (max-width: 860px) {
  .rx-pages {
    justify-content: start;
  }
}
</style>

<style>
/*
 * Printing: one report page per A4 sheet, edge to edge (the pages carry their own margins; margin 0 also keeps
 * the browser's date/URL header and footer off). A page fills the sheet's width rather than a fixed 210mm, so a
 * browser that still adds margins (Safari with "Print headers and footers") shrinks it instead of shifting it.
 */
@media print {
  @page {
    size: A4 portrait;
    margin: 0;
  }
  html,
  body {
    margin: 0 !important;
    padding: 0 !important;
    width: auto !important;
    min-width: 0 !important;
    background: #fff !important;
  }
  .rx-toolbar,
  .p-toast {
    display: none !important;
  }
  .rx-root {
    background: #fff !important;
    min-height: 0 !important;
  }
  .rx-pages {
    display: block !important;
    padding: 0 !important;
    margin: 0 !important;
    overflow: visible !important;
  }
  .rx-page {
    width: 100% !important;
    /* a hair under A4 so rounding never spills a blank sheet */
    min-height: 296mm !important;
    margin: 0 !important;
    box-shadow: none !important;
    break-after: page;
    page-break-after: always;
  }
  .rx-page:last-child {
    break-after: auto;
    page-break-after: auto;
  }
}
</style>
