<script setup>
// The printable evaluation report: A4 pages shown as they will print. Highlighted fields are typed in
// directly on the page (kept as a draft on this device) and "Print" prints the pages only.
//
// Pages: 1 cover (logo, child, evaluations) · 2 personal info + team signatures (newest chosen evaluation)
// · then what the chosen outputs ask for:
//   report   = case description page (with VB-MAPP: the description of one level, picked on screen, plus free text;
//              otherwise free text), one VB-MAPP form page per chosen test (its tables, a row per level, and its own
//              level charts) with the newest test's strengths/weaknesses (read only), and the other types' charts
//              (barriers with their test tables). The behaviour-problems table belongs to a behavioural evaluation.
//   plan     = the newest chosen VB-MAPP test's weaknesses, each with its goal, edited here and saved on the server.
//   tracking = the goals of the chosen tests' saved plans, as the centre's tracking form: one table per general goal,
//              the days each goal was tried (prop) and the trial columns; saving (or printing) records today.
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import sawaLogo from "@/assets/img/sawa_logo.svg";
import { createSummaryTables } from "@/components/reports/summaryDraft";
import { CASE_LEVELS, caseDescription } from "@/components/reports/caseDescriptions";
import EditableText from "@/components/reports/EditableText.vue";
import MilestoneLevelChart from "@/components/reports/MilestoneLevelChart.vue";
import TestTables from "@/components/reports/TestTables.vue";
import BarrierChart from "@/components/reports/BarrierChart.vue";
import AbllsChart from "@/components/reports/AbllsChart.vue";
import CarolinaChart from "@/components/reports/CarolinaChart.vue";
import SideProfileTable from "@/components/reports/SideProfileTable.vue";
import {
  ABLLS, BARRIER, CAROLINA, MAX_PER_GROUP, MILESTONE, SIDE_PROFILE, ageOn, ageWords, dateParts, dmy, firstName, groupItems,
  isBehavioural, isFemale, typeIcon, typeLabel, ymd,
} from "@/components/reports/reportUtils";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

// The child and the chosen evaluations come from the URL (a new selection reloads the report).
const childId = computed(() => String(route.params.childId));
const keys = computed(() => String(route.query.items ?? "").split(",").map((key) => key.trim()).filter(Boolean));
// Older report links keep the report and the plan.
const outputTypes = computed(() => route.query.types === undefined
  ? ['report', 'plan']
  : String(route.query.types).split(',').filter(type => ['report', 'plan', 'tracking'].includes(type)));
const showCharts = computed(() => outputTypes.value.includes('report'));
const showPlan = computed(() => outputTypes.value.includes('plan'));
const showTracking = computed(() => outputTypes.value.includes('tracking'));
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
// A VB-MAPP test may have been completed level by level, on several days.
const dates = computed(() => items.value
  .flatMap((item) => [item.date, ...(item.form?.levels ?? []).map((level) => level.date)])
  .filter(Boolean).sort());

// One section per evaluation type, newest type first; inside, oldest to newest (1st test ... 4th test).
const byDate = (a, b) => String(a.date).localeCompare(String(b.date)) || a.id - b.id;
const sections = computed(() =>
  groupItems(items.value, t).map((group) => {
    const tests = [...group.items].sort(byDate).slice(-MAX_PER_GROUP);
    return { ...group, tests, newest: tests[tests.length - 1], behavioural: isBehavioural(group.label) };
  })
);

// Side profile: every chosen result of every dimension in one table (dimension order, then date), printed once
// where the first dimension's section would be.
const sideProfileTests = computed(() => sections.value
  .filter((section) => section.type === SIDE_PROFILE)
  .sort((a, b) => Number(String(a.group).slice(1)) - Number(String(b.group).slice(1)))
  .flatMap((section) => section.tests.map((test) => ({ ...test, title: section.label }))));
const firstSideProfile = computed(() => sections.value.find((section) => section.type === SIDE_PROFILE)?.group ?? null);

// Barriers: the newest chosen test's answers (barrier, chosen answer, its number) under the chart.
const barrierAnswers = (section) => [...(section.newest?.result ?? [])].sort((a, b) => (a.number ?? 0) - (b.number ?? 0));

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
    // The case description: the VB-MAPP level whose description prints (null = the highest level done), and free text.
    caseLevel: null,
    caseFree: "",
    // VB-MAPP levels left out of the report (their charts and strengths/weaknesses tables), by level id.
    hiddenLevels: [],
    // Tracking: the goals left out of the print, by goal id.
    trackingHidden: [],
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
  if (CASE_LEVELS.includes(Number(saved.caseLevel))) base.caseLevel = Number(saved.caseLevel);
  if (typeof saved.caseFree === "string") base.caseFree = saved.caseFree;
  if (Array.isArray(saved.hiddenLevels)) base.hiddenLevels = saved.hiddenLevels.map(String);
  if (Array.isArray(saved.trackingHidden)) base.trackingHidden = saved.trackingHidden.map(Number);
  for (const key of Object.keys(base.behaviors)) {
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
    if (showPlan.value) loadPlan();
    if (showTracking.value) loadTracking();
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
  plan.value = null;
  tracking.value = null;
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

// ---- test tables (VB-MAPP types only) ----------------------------------------------------------------

const TEST_KEYS = ["1st test", "2nd test", "3rd test", "4th test"];

// Barriers: one row per chosen test, oldest first (always four rows).
const barrierRows = (tests) => TEST_KEYS.map((key, i) => ({
  n: i + 1,
  key,
  date: tests[i]?.date ?? null,
  age_months: tests[i]?.form?.age_months,
  testers: tests[i]?.form?.testers ?? [],
  colors: tests[i]?.form?.colors ?? [],
  score: tests[i]?.form?.score,
  boxes_total: tests[i]?.form?.boxes_total,
}));

// One VB-MAPP test: one row per level (each may be evaluated on its own day); a missing level is an empty row.
// The score is the boxes colored up to that level out of all the form's boxes.
const milestoneRows = (test) => (test.form?.levels ?? []).map((level) => ({
  n: level.age || level.level_id,
  key: `Level ${level.age || level.level_id}`,
  date: level.date,
  age_months: level.age_months,
  testers: level.tester ? [level.tester] : [],
  colors: level.color ? [level.color] : [],
  score: level.cumulative_score,
  boxes_total: test.form?.boxes_total,
}));

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
const milestoneSection = computed(() => sections.value.find((section) => section.type === MILESTONE) ?? null);
// The age in the case description: at the newest chosen VB-MAPP test, or else the newest chosen evaluation.
const caseItem = computed(() => milestoneSection.value?.newest ?? items.value[0] ?? null);
// The case description's level: the one picked, or else the highest level the newest VB-MAPP test reached.
const highestLevel = computed(() => Math.min(3, Math.max(1, ...(milestoneSection.value?.newest?.result?.levels ?? [])
  .map((level) => Number(level.level_age) || 0))));
const caseLevel = computed(() => edits.value?.caseLevel ?? (milestoneSection.value?.newest?.result?.levels?.length ? highestLevel.value : 1));
const caseParagraphs = (level) => caseDescription(level, { female: female.value, name: shortName.value, age: caseAge(caseItem.value) });

// The report's strengths/weaknesses of the newest VB-MAPP test, as the evaluation gave them (read only).
const reportSummary = computed(() => milestoneSection.value
  ? createSummaryTables(milestoneSection.value.newest).filter((table) => isLevelShown(table.key)) : []);

// ---- plan (saved on the server, per VB-MAPP evaluation) --------------------------------------------

// { evaluationId, goals: [{ id?, level_id, general_goal_id, general_goal, domain, domain_symbol, symbol, weakness, goal }],
//   saved: bool (from the server), dirty, saving, error, savedAt }
const plan = ref(null);
let planKey = 0;
const planGoal = (goal) => ({ key: `g${planKey++}`, ...goal });

// The newest test's weaknesses, each with the goal written for the same answer.
function planFromSummary(test) {
  return (test?.result?.summary ?? []).flatMap((group) => (group.weak ?? []).filter((point) => point.question).map((point) => planGoal({
    level_id: group.level_id ?? null, general_goal_id: group.general_goal_id ?? null, general_goal: group.general_goal ?? "",
    domain: group.domain ?? "", domain_symbol: group.domain_symbol ?? "", symbol: group.symbol ?? "",
    weakness: point.question, goal: point.goal ?? "",
  })));
}

async function loadPlan() {
  const test = milestoneSection.value?.newest;
  if (!test) return;
  plan.value = { evaluationId: test.id, goals: [], saved: false, dirty: false, saving: false, error: false, loading: true };
  try {
    const { data } = await axios.get(`api/reports/plans/${test.id}`);
    plan.value.goals = data.plan ? data.plan.goals.map(planGoal) : planFromSummary(test);
    plan.value.saved = Boolean(data.plan);
    plan.value.savedAt = data.plan?.updated_at ?? null;
  } catch {
    plan.value.goals = planFromSummary(test);
  } finally {
    plan.value.loading = false;
  }
}

// The plan by level (lowest first), then by general goal, numbered inside it (M-1, M-2...).
const planLevels = computed(() => {
  if (!plan.value) return [];
  const names = new Map((milestoneSection.value?.newest?.result?.levels ?? []).map((level) => [String(level.level_id), level]));
  const levels = new Map();
  for (const goal of plan.value.goals) {
    const levelKey = String(goal.level_id ?? "");
    if (!levels.has(levelKey)) levels.set(levelKey, { key: levelKey, title: names.get(levelKey)?.level_name ?? "", age: Number(names.get(levelKey)?.level_age) || 0, groups: new Map() });
    const groups = levels.get(levelKey).groups;
    const groupKey = String(goal.general_goal_id ?? goal.symbol ?? "");
    if (!groups.has(groupKey)) groups.set(groupKey, { key: groupKey, general_goal: goal.general_goal, domain: goal.domain, symbol: goal.symbol, goals: [] });
    groups.get(groupKey).goals.push(goal);
  }
  return [...levels.values()].filter((level) => isLevelShown(level.key))
    .sort((a, b) => a.age - b.age || Number(a.key) - Number(b.key))
    .map((level) => ({ ...level, groups: [...level.groups.values()] }));
});
const goalCode = (group, index) => [group.symbol, index + 1].filter((part) => part !== "" && part !== null && part !== undefined).join("-");

function touchPlan() {
  if (plan.value) plan.value.dirty = true;
}
function addPlanGoal(group) {
  const last = group.goals[group.goals.length - 1];
  const at = plan.value.goals.indexOf(last) + 1;
  plan.value.goals.splice(at, 0, planGoal({ ...last, id: undefined, weakness: "", goal: "" }));
  touchPlan();
}
function removePlanGoal(goal) {
  plan.value.goals.splice(plan.value.goals.indexOf(goal), 1);
  touchPlan();
}

async function savePlan() {
  if (!plan.value || plan.value.saving) return;
  plan.value.saving = true;
  plan.value.error = false;
  try {
    const goals = plan.value.goals.filter((goal) => goal.weakness.trim()).map(({ key, code, attempts, cells, achieved_at, ...goal }) => goal);
    const { data } = await axios.put(`api/reports/plans/${plan.value.evaluationId}`, { goals });
    plan.value.goals = data.plan.goals.map(planGoal);
    plan.value.saved = true;
    plan.value.dirty = false;
    plan.value.savedAt = data.plan.updated_at;
    // The tracking reads the saved plans.
    if (showTracking.value) loadTracking();
  } catch {
    plan.value.error = true;
  } finally {
    plan.value.saving = false;
  }
}

// ---- tracking (the saved plans' goals of the chosen VB-MAPP tests) ---------------------------------

// { plans: [{ evaluation_id, evaluation_date, goals: [...] }], achieved: { [id]: bool }, cells: { [id]: {...} }, date,
//   saving, error, savedAt }
const tracking = ref(null);
const TRIAL_COLUMNS = ["mt", "sp", "rr", "ext"];

async function loadTracking() {
  const tests = milestoneSection.value?.tests ?? [];
  if (!tests.length) return;
  tracking.value = { plans: [], achieved: {}, cells: {}, date: todayIso, loading: true, saving: false, error: false };
  try {
    const { data } = await axios.get(`api/reports/children/${childId.value}/tracking`, { params: { evaluations: tests.map((test) => test.id) } });
    setTrackingPlans(data.plans ?? []);
  } catch {
    tracking.value.error = true;
  } finally {
    tracking.value.loading = false;
  }
}

function setTrackingPlans(plans) {
  tracking.value.plans = plans;
  for (const goal of plans.flatMap((item) => item.goals)) {
    tracking.value.achieved[goal.id] = Boolean(goal.achieved_at);
    tracking.value.cells[goal.id] = Object.fromEntries(TRIAL_COLUMNS.flatMap((column) => ["start", "end"].map((end) => [`${column}_${end}`, goal.cells?.[`${column}_${end}`] ?? ""])));
  }
}

// Each plan's goals by general goal (the centre's form has one table per goal), numbered inside it.
const trackingGroups = (item) => {
  const groups = new Map();
  for (const goal of item.goals) {
    const key = String(goal.general_goal_id ?? goal.symbol ?? "");
    if (!groups.has(key)) groups.set(key, { key, general_goal: goal.general_goal, domain: goal.domain, domain_symbol: goal.domain_symbol, symbol: goal.symbol, goals: [] });
    groups.get(key).goals.push(goal);
  }
  return [...groups.values()];
};
const isTracked = (goal) => !(edits.value?.trackingHidden ?? []).includes(Number(goal.id));
function toggleTracked(goal, shown) {
  const hidden = new Set((edits.value.trackingHidden ?? []).map(Number));
  if (shown) hidden.delete(Number(goal.id));
  else hidden.add(Number(goal.id));
  edits.value.trackingHidden = [...hidden];
}

// Records today for the goals that print: achieved or not, and their trial columns.
async function saveTracking() {
  if (!tracking.value || tracking.value.saving) return true;
  const goals = tracking.value.plans.flatMap((item) => item.goals).filter(isTracked);
  if (!goals.length) return true;
  tracking.value.saving = true;
  tracking.value.error = false;
  try {
    await axios.post(`api/reports/children/${childId.value}/tracking`, {
      date: tracking.value.date,
      goals: goals.map((goal) => ({ id: goal.id, achieved: Boolean(tracking.value.achieved[goal.id]), cells: tracking.value.cells[goal.id] })),
    });
    const { data } = await axios.get(`api/reports/children/${childId.value}/tracking`, { params: { evaluations: (milestoneSection.value?.tests ?? []).map((test) => test.id) } });
    setTrackingPlans(data.plans ?? []);
    tracking.value.savedAt = new Date().toLocaleTimeString();
    return true;
  } catch {
    tracking.value.error = true;
    return false;
  } finally {
    tracking.value.saving = false;
  }
}

// ---- actions ---------------------------------------------------------------------------------------

// Printing the tracking records today for the goals it shows.
async function print() {
  document.activeElement?.blur?.();
  if (showTracking.value) await saveTracking();
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
        <span v-if="plan && !plan.loading" class="rx-save-state" :class="{ 'is-dirty': plan.dirty || !plan.saved, 'is-error': plan.error }">
          {{ plan.error ? $t("ereport.save_failed") : plan.dirty || !plan.saved ? $t("ereport.plan_unsaved") : $t("ereport.plan_saved") }}
        </span>
        <Button v-if="plan && !plan.loading" :label="$t('ereport.save_plan')" icon="pi pi-save" :loading="plan.saving" data-no-request-spinner @click="savePlan" />
        <template v-if="tracking && !tracking.loading && tracking.plans.length">
          <label class="rx-track-date">{{ $t("date") }} <input v-model="tracking.date" type="date" /></label>
          <Button :label="$t('ereport.save_tracking')" icon="pi pi-save" :loading="tracking.saving" severity="secondary" data-no-request-spinner @click="saveTracking" />
        </template>
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

      <!-- Case description belongs to the report output. -->
      <section v-if="showCharts" class="rx-page">
        <header class="rx-head">
          <img :src="sawaLogo" alt="Sawa" />
          <span>{{ $t("ereport.report_title") }} · {{ child.name }}</span>
        </header>

        <h2 v-if="!milestoneSection" class="rx-band">{{ $t("ereport.case_description", { name: shortName }) }}</h2>
        <!-- With VB-MAPP: the three level descriptions; exactly one (picked here) prints, styled as the centre's form. -->
        <template v-if="milestoneSection">
          <p class="rx-case-hint rx-screen-only"><i class="pi pi-info-circle" aria-hidden="true" /> {{ $t("ereport.case_pick_hint") }}</p>
          <label v-for="level in CASE_LEVELS" :key="level" class="rx-case-option" :class="{ 'is-picked': caseLevel === level }">
            <span class="rx-case-pick rx-screen-only">
              <input type="radio" name="rx-case-level" :value="level" :checked="caseLevel === level" @change="edits.caseLevel = level" />
              {{ $t("level_n", { n: level }) }}
            </span>
            <div class="rx-case-card">
              <h2 class="rx-case-title"><u>{{ $t("ereport.case_title") }}</u> <mark>{{ shortName }}</mark> <u>:</u></h2>
              <div class="rx-case-body">
                <p v-for="(paragraph, i) in caseParagraphs(level)" :key="i">
                  <template v-for="(part, j) in paragraph" :key="j"><b v-if="part.bold">{{ part.text }}</b><template v-else>{{ part.text }}</template></template>
                </p>
              </div>
            </div>
          </label>
        </template>
        <div class="rx-case-free" :class="{ 'is-empty': !edits.caseFree.trim() }">
          <EditableText v-model="edits.caseFree" block multiline :placeholder="$t(milestoneSection ? 'ereport.case_free_more' : 'ereport.case_free')" />
        </div>

        <footer class="rx-foot"><span>{{ $t("ereport.academy") }}</span><span class="rx-page-num" /></footer>
      </section>

      <!-- 4+. One section per evaluation type -->
      <template v-for="section in sections" :key="section.group">
        <template v-if="section.type === MILESTONE">
          <!-- One VB-MAPP form page per chosen test, newest first: its tables (a row per level) and its own charts -->
          <section v-for="test in showCharts ? [...section.tests].reverse() : []" :key="'vb-' + test.key" class="rx-page">
            <header class="rx-head">
              <img :src="sawaLogo" alt="Sawa" />
              <span>VB-MAPP · <span class="ltr">{{ dmy(test.date) }}</span></span>
            </header>

            <p class="rx-kicker">{{ $t("ereport.special_education") }}</p>
            <p class="rx-intro">{{ $t("ereport.form_intro", { name: child.name, evaluation: "VB-MAPP" }) }}</p>

            <TestTables :child="child" :rows="milestoneRows(test)" />

            <div class="vb-levels">
              <MilestoneLevelChart v-for="level in mergedLevels([test])" :key="level.level_id" :level="level" :legend="false" />
              <p v-if="!mergedLevels([test]).length" class="rx-empty">{{ $t("ereport.no_result_data") }}</p>
            </div>

            <footer class="rx-foot"><span>{{ $t("ereport.academy") }}</span><span class="rx-page-num" /></footer>
          </section>

          <!-- Report: the newest test's strengths and weaknesses as the evaluation gave them; each level its own page -->
          <template v-if="showCharts">
          <section v-for="table in reportSummary.length ? reportSummary : [null]" :key="'summary-' + (table?.key ?? 'none')" class="rx-page">
            <header class="rx-head">
              <img :src="sawaLogo" alt="Sawa" />
              <span>VB-MAPP · <span class="ltr">{{ dmy(section.newest.date) }}</span></span>
            </header>
            <template v-if="table">
              <h3 v-if="table.title" class="rx-summary-level">{{ table.title }}</h3>
              <template v-for="kind in ['strengths', 'weaknesses']" :key="kind">
                <h3 class="rx-summary-level">{{ $t('ereport.' + kind + '_intro') }}</h3>
                <table class="rx-table rx-summary">
                  <thead>
                    <tr>
                      <th class="rx-sum-num">{{ $t('ereport.number') }}</th>
                      <th>{{ $t('ereport.' + kind) }}</th>
                      <th class="rx-sum-symbol">{{ $t("ereport.target_symbol") }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, r) in table.rows.filter((item) => item[kind].length)" :key="r">
                      <td class="rx-sum-num">{{ r + 1 }}</td>
                      <td><ul class="rx-plan-points is-static"><li v-for="point in row[kind]" :key="point.id">{{ point.text }}</li></ul></td>
                      <td class="rx-sum-symbol"><b>{{ row.symbol }}</b></td>
                    </tr>
                    <tr v-if="!table.rows.some(row => row[kind].length)">
                      <td colspan="3" class="rx-empty">{{ $t("ereport.no_result_data") }}</td>
                    </tr>
                  </tbody>
                </table>
              </template>
            </template>
            <p v-else class="rx-empty">{{ $t("ereport.no_result_data") }}</p>
            <footer class="rx-foot"><span>{{ $t("ereport.academy") }}</span><span class="rx-page-num" /></footer>
          </section>
          </template>

          <!-- Plan: the weaknesses with their goals, edited here and saved on the server; each level its own page -->
          <template v-if="showPlan && plan">
          <section v-for="level in planLevels.length ? planLevels : [null]" :key="'plan-' + (level?.key ?? 'none')" class="rx-page">
            <header class="rx-head">
              <img :src="sawaLogo" alt="Sawa" />
              <span>{{ $t("ereport.plan_title") }} · VB-MAPP · <span class="ltr">{{ dmy(section.newest.date) }}</span></span>
            </header>
            <h2 class="rx-band">{{ $t("ereport.plan_title") }}<template v-if="level?.title"> — {{ level.title }}</template></h2>
            <p v-if="plan.loading" class="rx-empty">{{ $t("ereport.loading") }}</p>
            <table v-else-if="level" class="rx-table rx-summary rx-plan">
              <thead>
                <tr>
                  <th class="rx-sum-num">{{ $t("ereport.number") }}</th>
                  <th>{{ $t("ereport.weaknesses") }}</th>
                  <th>{{ $t("ereport.plan_goal") }}</th>
                  <th class="rx-plan-control-col rx-screen-only" />
                </tr>
              </thead>
              <tbody>
                <template v-for="group in level.groups" :key="group.key">
                  <tr class="rx-plan-group">
                    <th colspan="4">{{ group.domain }}<template v-if="group.symbol"> ({{ group.symbol }})</template><template v-if="group.general_goal"> — {{ group.general_goal }}</template></th>
                  </tr>
                  <tr v-for="(goal, g) in group.goals" :key="goal.key">
                    <td class="rx-sum-num ltr">{{ goalCode(group, g) }}</td>
                    <td><EditableText v-model="goal.weakness" block multiline :placeholder="$t('ereport.point_text')" @update:modelValue="touchPlan" /></td>
                    <td><EditableText v-model="goal.goal" block multiline :placeholder="$t('ereport.plan_goal')" @update:modelValue="touchPlan" /></td>
                    <td class="rx-plan-control-col rx-screen-only">
                      <button type="button" class="rx-plan-control rx-remove-point" :aria-label="$t('ereport.remove_point')" :title="$t('ereport.remove_point')" @click="removePlanGoal(goal)"><i class="pi pi-trash" aria-hidden="true" /></button>
                    </td>
                  </tr>
                  <tr class="rx-screen-only">
                    <td colspan="4"><button type="button" class="rx-plan-control rx-add-point" @click="addPlanGoal(group)"><i class="pi pi-plus" aria-hidden="true" /> {{ $t("ereport.add_point") }}</button></td>
                  </tr>
                </template>
              </tbody>
            </table>
            <p v-else class="rx-empty">{{ $t("ereport.no_result_data") }}</p>
            <footer class="rx-foot"><span>{{ $t("ereport.academy") }}</span><span class="rx-page-num" /></footer>
          </section>
          </template>

          <!-- Tracking: the saved plans' goals, one table per general goal as on the centre's form -->
          <template v-if="showTracking && tracking">
          <section v-for="item in tracking.plans.length ? tracking.plans : [null]" :key="'track-' + (item?.evaluation_id ?? 'none')" class="rx-page">
            <header class="rx-head">
              <img :src="sawaLogo" alt="Sawa" />
              <span>{{ $t("ereport.tracking_title") }}<template v-if="item"> · VB-MAPP · <span class="ltr">{{ dmy(item.evaluation_date) }}</span></template></span>
            </header>
            <h2 class="rx-band">{{ $t("ereport.tracking_title") }}</h2>
            <p v-if="tracking.loading" class="rx-empty">{{ $t("ereport.loading") }}</p>
            <p v-else-if="!item" class="rx-empty">{{ $t("ereport.tracking_no_plan") }}</p>
            <template v-else>
              <p class="rx-case-hint rx-screen-only"><i class="pi pi-info-circle" aria-hidden="true" /> {{ $t("ereport.tracking_hint") }}</p>
              <table v-for="group in trackingGroups(item)" :key="group.key" class="rx-table rx-track"
                :class="{ 'rx-print-hidden': !group.goals.some(isTracked) }">
                <thead>
                  <tr class="rx-track-domain"><th colspan="11">{{ group.domain }} <span v-if="group.domain_symbol" class="ltr">{{ group.domain_symbol }}</span></th></tr>
                  <tr class="rx-track-goal"><th colspan="11">{{ $t("ereport.tracking_goal") }}: {{ group.general_goal }}<span v-if="group.symbol" class="rx-track-symbol ltr">{{ group.symbol }}</span></th></tr>
                  <tr>
                    <th rowspan="2" class="rx-track-num">{{ $t("ereport.number") }}</th>
                    <th rowspan="2">{{ $t("ereport.tracking_short_goals") }}</th>
                    <th class="rx-track-prop">{{ $t("ereport.tracking_prop") }}<br /><span class="ltr">prop</span></th>
                    <th v-for="column in TRIAL_COLUMNS" :key="column" colspan="2">{{ $t("ereport.trial_" + column) }}<br /><span class="ltr">{{ column.toUpperCase() }}</span></th>
                  </tr>
                  <tr>
                    <th class="rx-track-prop">{{ $t("ereport.tracking_date") }}</th>
                    <template v-for="column in TRIAL_COLUMNS" :key="column">
                      <th class="rx-track-cell">{{ $t("ereport.trial_start") }}</th>
                      <th class="rx-track-cell">{{ $t("ereport.trial_end") }}</th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(goal, g) in group.goals" :key="goal.id" :class="{ 'rx-print-hidden': !isTracked(goal), 'is-off': !isTracked(goal) }">
                    <td class="rx-track-num ltr"><b>{{ goal.code || goalCode(group, g) }}</b></td>
                    <td>
                      {{ goal.goal || goal.weakness }}
                      <span class="rx-track-controls rx-screen-only">
                        <label><input type="checkbox" :checked="isTracked(goal)" @change="toggleTracked(goal, $event.target.checked)" /> {{ $t("ereport.tracking_print") }}</label>
                        <label><input v-model="tracking.achieved[goal.id]" type="checkbox" :disabled="!isTracked(goal)" /> {{ $t("ereport.tracking_achieved") }}</label>
                      </span>
                    </td>
                    <td class="rx-track-prop">
                      <span v-for="attempt in goal.attempts" :key="attempt.date" class="rx-attempt ltr" :class="{ 'is-achieved': attempt.achieved }">
                        {{ ymd(attempt.date) }} {{ attempt.achieved ? "✓" : "" }}
                      </span>
                    </td>
                    <template v-for="column in TRIAL_COLUMNS" :key="column">
                      <td v-for="end in ['start', 'end']" :key="end" class="rx-track-cell">
                        <EditableText v-model="tracking.cells[goal.id][column + '_' + end]" block />
                      </td>
                    </template>
                  </tr>
                </tbody>
              </table>
            </template>
            <footer class="rx-foot"><span>{{ $t("ereport.academy") }}</span><span class="rx-page-num" /></footer>
          </section>
          </template>
        </template>

        <!-- Any other type (in the report): barriers with their test tables, then each type's chart -->
        <!-- Side profile: one page with every chosen dimension result -->
        <section v-else-if="showCharts && section.type === SIDE_PROFILE && section.group === firstSideProfile" class="rx-page">
          <header class="rx-head">
            <img :src="sawaLogo" alt="Sawa" />
            <span>Side Profile</span>
          </header>
          <h2 class="rx-sp-title ltr">Side Profile</h2>
          <p class="rx-sp-child"><b>{{ child.name }}</b><br /><span class="ltr">{{ child.birth_date }}</span></p>
          <SideProfileTable :tests="sideProfileTests" />
          <footer class="rx-foot"><span>{{ $t("ereport.academy") }}</span><span class="rx-page-num" /></footer>
        </section>

        <section v-else-if="showCharts && section.type !== SIDE_PROFILE" class="rx-page">
          <header class="rx-head">
            <img :src="sawaLogo" alt="Sawa" />
            <span>{{ section.label }} · <span class="ltr">{{ dmy(section.newest.date) }}</span></span>
          </header>

          <h2 class="rx-band">{{ $t("ereport.results_of", { name: section.label }) }}</h2>
          <p class="rx-intro">{{ $t("ereport.form_intro", { name: child.name, evaluation: section.label }) }}</p>

          <!-- The test tables belong to the VB-MAPP family only (barriers here). -->
          <TestTables v-if="section.type === BARRIER" :child="child" :rows="barrierRows(section.tests)" />

          <template v-if="showCharts">
          <BarrierChart v-if="section.type === BARRIER" :tests="section.tests" />
          <AbllsChart v-else-if="section.type === ABLLS" :tests="section.tests" />
          <CarolinaChart v-else-if="section.type === CAROLINA" :tests="section.tests" />

          <!-- The newest chosen barriers test as a table: barrier, the chosen answer, its number. -->
          <table v-if="section.type === BARRIER && barrierAnswers(section).length" class="rx-table rx-barrier-answers">
            <thead>
              <tr>
                <th>{{ $t("ereport.barrier_domain") }}</th>
                <th>{{ $t("ereport.barrier_answer") }}</th>
                <th class="rx-sum-num">{{ $t("ereport.barrier_answer_number") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in barrierAnswers(section)" :key="row.number + '-' + row.subtest">
                <td><b>{{ row.subtest }}</b></td>
                <td>{{ row.answer }}</td>
                <td class="rx-sum-num">{{ row.score }}</td>
              </tr>
            </tbody>
          </table>

          </template>

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
.rx-plan-points { margin: 0; padding: 0; list-style: none; }
.rx-plan-points li { display: flex; align-items: start; gap: .5rem; margin-bottom: .4rem; }
.rx-plan-points :deep(.rx-edit) { flex: 1; }
.rx-plan-control { border: 0; border-radius: 5px; padding: .3rem .5rem; cursor: pointer; font: inherit; font-size: 9pt; }
.rx-remove-point { color: #b91c1c; background: #fef2f2; flex: none; }
.rx-add-point { color: var(--sawa-primary); background: #edf7f5; margin-top: .4rem; }
/* screen-only controls and the parts left out of the print */
.rx-sp-title { margin: 4mm 0 2mm; text-align: center; font-size: 22pt; font-weight: 700; color: #334155; }
.rx-sp-child { margin: 0 0 5mm; text-align: start; font-size: 12pt; line-height: 1.8; }
.rx-barrier-answers { margin-top: 6mm; font-size: 9pt; }
.rx-barrier-answers td { vertical-align: top; }
.rx-save-state { font-size: .85rem; color: #166534; }
.rx-save-state.is-dirty { color: #b45309; }
.rx-save-state.is-error { color: #b91c1c; }
.rx-track-date { display: inline-flex; align-items: center; gap: .35rem; font-size: .85rem; }
.rx-track-date input { padding: .3rem .4rem; border: 1px solid var(--sawa-border); border-radius: 6px; font: inherit; }
.rx-case-hint { margin: 0 0 .6rem; padding: .5rem .75rem; border-radius: 8px; background: #f1f5f9; color: #475569; font-size: 9.5pt; }
.rx-case-option { display: block; margin-bottom: .75rem; padding: .5rem .75rem; border: 1px dashed #cbd5e1; border-radius: 10px; cursor: pointer; opacity: .55; }
.rx-case-option.is-picked { border: 2px solid var(--sawa-primary); opacity: 1; }
.rx-case-pick { display: inline-flex; align-items: center; gap: .4rem; margin-bottom: .3rem; font-weight: 800; color: var(--sawa-primary); }
/* The VB-MAPP case description as on the centre's form: a blue title bar, the name highlighted, a dark body. */
.rx-case-card { border: 1px solid #2f5d7c; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.rx-case-title { margin: 0; padding: 4px 10px; background: #3c6e91; color: #fff; font-size: 13pt; font-weight: 800; }
.rx-case-title u { text-underline-offset: 4px; }
.rx-case-title mark { padding: 0 6px; background: #6b5d00; color: #fff; }
.rx-case-body { padding: 8px 12px; background: #595959; color: #fff; font-size: 11pt; line-height: 1.7; text-align: justify; }
.rx-case-body p { margin: 0 0 .7rem; }
.rx-case-body p:last-child { margin-bottom: 0; }
.rx-case-body b { font-weight: 800; }
.rx-case-free { margin-top: .5rem; }
.rx-plan-points.is-static { list-style: disc; padding-inline-start: 1.1em; }
.rx-plan-points.is-static li { display: list-item; }
.rx-plan-group th { background: #edf7f5; text-align: start; font-weight: 800; }
.rx-plan-control-col { width: 2.5rem; text-align: center; }
.rx-track { margin-bottom: 6mm; font-size: 8.5pt; break-inside: avoid; page-break-inside: avoid; }
.rx-track th, .rx-track td { padding: 3px 4px; text-align: center; vertical-align: middle; }
.rx-track td:nth-child(2) { text-align: start; }
.rx-table.rx-track .rx-track-domain th { background: #c4b5fd; color: #1e293b; text-align: start; font-size: 10pt; }
.rx-table.rx-track .rx-track-goal th { background: #e2e8f0; color: #1e293b; text-align: start; font-weight: 700; }
.rx-track-symbol { float: inline-end; font-weight: 800; }
.rx-track-num { width: 11mm; }
.rx-track-prop { width: 22mm; }
.rx-track-cell { width: 10mm; background: #f8fafc; }
.rx-track thead .rx-track-cell { background: #f1f5f9; }
.rx-attempt { display: block; white-space: nowrap; }
.rx-attempt.is-achieved { color: #166534; font-weight: 800; }
.rx-track-controls { display: flex; flex-wrap: wrap; gap: .25rem .75rem; margin-top: .3rem; font-size: 8pt; color: #475569; }
.rx-track-controls label { display: inline-flex; align-items: center; gap: .25rem; cursor: pointer; }
.rx-track tr.is-off td { opacity: .45; }
@media print {
  .rx-screen-only, .rx-print-hidden, .rx-case-option:not(.is-picked), .rx-case-free.is-empty { display: none !important; }
  .rx-case-option { border: 0 !important; padding: 0 !important; opacity: 1 !important; }
}
@media print {
  .rx-plan-control, .rx-plan-empty-row { display: none !important; }
  .rx-plan-points { list-style: disc; padding-inline-start: 1.1em; }
  .rx-plan-points li { display: list-item; }
}

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
