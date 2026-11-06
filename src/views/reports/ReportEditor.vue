<script setup>
// The printable evaluation report: A4 pages shown as they will print. Highlighted fields are typed in
// directly on the page and "Print" prints the pages only. «حفظ التقرير» (and printing) saves the report for the
// child, with what was typed and the deleted pages, so it opens again from the reports page; until then the
// values are a draft on this device. A page left with nothing to print (its tables deleted) is not printed.
//
// Pages: 1 cover (logo, child, evaluations) · 2 personal info + team signatures (newest chosen evaluation)
// · then what the chosen outputs ask for:
//   report   = case description page (with VB-MAPP: the description of one level, picked on screen, plus free text;
//              otherwise free text), one VB-MAPP form page per chosen test (its tables, a row per level, and its own
//              level charts) with the newest test's strengths/weaknesses (edited here, saved on the server), and the other types' charts
//              (barriers with their test tables). The behaviour-problems table belongs to a behavioural evaluation.
//   plan     = the goals written for the newest chosen VB-MAPP test's weaknesses (only the goals are shown), edited here and saved on the server;
//              with a QFBA, also its plan page: goals for each endorsed function of the newest chosen QFBA (from the QFBA settings),
//              in the form's language, saved on the server the same way.
//   In the strengths/weaknesses and the plan, a whole row (domain) or table can be deleted; it is saved with them and
//   listed on its page to be restored.
//   tracking = the goals of the chosen VB-MAPP and QFBA tests' saved plans, as the centre's tracking form: one table per general goal,
//              the date each goal was achieved (prop, editable; sessions will set it) and the trial columns MT, EXP
//              and RR; «اعتماد التراكنج» records it as the one the child's sessions work on.
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import sawaLogo from "@/assets/img/sawa_logo.svg";
import { createSummaryTables, newSummaryPoint } from "@/components/reports/summaryDraft";
import { childListOf, childTextOf } from "@/components/ablls/abllsTypes";
import { CASE_LEVELS, caseDescription } from "@/components/reports/caseDescriptions";
import Popover from "primevue/popover";
import EditableText from "@/components/reports/EditableText.vue";
import MilestoneLevelChart from "@/components/reports/MilestoneLevelChart.vue";
import TestTables from "@/components/reports/TestTables.vue";
import BarrierChart from "@/components/reports/BarrierChart.vue";
import AbllsFlowChart from "@/components/reports/AbllsFlowChart.vue";
import AbllsSpChart from "@/components/reports/AbllsSpChart.vue";
import AbllsTestsHeader from "@/components/reports/AbllsTestsHeader.vue";
import CarolinaGrid from "@/components/carolina/CarolinaGrid.vue";
import QfbaChart from "@/components/reports/QfbaChart.vue";
import QfbaSummary from "@/components/reports/QfbaSummary.vue";
import { functionColor, functionName, optionLabel, planGoalsOf, qt, questionText } from "@/views/evaluation/qfba/qfba";
import SensoryGrid from "@/components/reports/SensoryGrid.vue";
import SensorySummary from "@/components/reports/SensorySummary.vue";
import ElmChart from "@/components/reports/ElmChart.vue";
import ElmSummary from "@/components/reports/ElmSummary.vue";
import { ageText as sensoryAge, formName as sensoryFormName } from "@/views/evaluation/sensory/sensory";
import TransitionChart from "@/components/reports/TransitionChart.vue";
import SideProfileTable from "@/components/reports/SideProfileTable.vue";
import TrackingDates from "@/components/reports/TrackingDates.vue";
import CombinedReportSend from "@/components/reports/CombinedReportSend.vue";
import PlanApproval from "@/components/reports/PlanApproval.vue";
import { TRACKING_COLUMNS, columnDate, isDate, showDate } from "@/utils/trackingColumns";
import {
  BARRIER, CAROLINA, ELM, MAX_PER_GROUP, MCHAT, MILESTONE, QFBA, SENSORY, SIDE_PROFILE, TRANSITION, ageOn, ageWords, dateParts, dmy, firstName, groupItems, isAbllsFlow,
  ABLLS_SKILLS, ABLLS_SP, abllsLetterOf, abllsRank, abllsSymbolOf, hasAbllsPoints, isBehavioural, isFemale, milestoneMarks, typeIcon, typeLabel,
} from "@/components/reports/reportUtils";

const { t, locale } = useI18n();
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
// A report saved for the child (?report=<id>, listed on the reports page) keeps its values on the server; a new
// one keeps a draft on this device until it is saved (or printed, which saves it).
const reportId = computed(() => (route.query.report ? Number(route.query.report) : null));

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

// One section per evaluation type, in the order the evaluations were picked (the type of the first picked one
// first); inside, oldest to newest (1st test ... 4th test).
const byDate = (a, b) => String(a.date).localeCompare(String(b.date)) || a.id - b.id;
const pickIndex = (group) => Math.min(...group.items.map((item) => {
  const index = keys.value.indexOf(item.key);
  return index === -1 ? Infinity : index;
}));
const sections = computed(() =>
  groupItems(items.value, t)
    .map((group, i) => ({ group, i, pick: pickIndex(group) }))
    .sort((a, b) => a.pick - b.pick || a.i - b.i)
    .map(({ group }) => {
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

// M-CHAT-R: one test's answer to a question ({ yes, point }, by the question's id), for the answers page's column of that test.
const mchatAnswer = (test, id) => (test.result?.questions ?? []).find((question) => question.id === id) ?? null;

// QFBA: the language its newest chosen test was filled in (its pages are drawn in it), and one test's answer to a question.
const qfbaLang = (section) => (section.newest?.result?.language === "en" ? "en" : "ar");
const qfbaAnswer = (test, id) => (test.result?.questions ?? []).find((question) => question.id === id) ?? null;

// Sensory Profile: its pages follow the screen's language.
const sensoryLang = computed(() => (locale.value === "en" ? "en" : "ar"));
const qfbaFunction = (section, functionId) => (section.newest?.result?.scores ?? []).find((score) => score.function_id === functionId) ?? null;

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
    // Ablls OT plan: the opening sentence as edited (empty = built from the types that have weaknesses).
    otPlanIntro: "",
    behaviors: Object.fromEntries(groupItems(data.items).map((group) => [group.group, Array.from({ length: 3 }, () => ["", "", "", "", ""])])),
    // «وصف التقييمات»: each type's description (from its settings page), printed and edited before its charts.
    descriptions: Object.fromEntries(Object.entries(data.descriptions ?? {}).map(([type, text]) => [type, String(text ?? "")])),
    // Transition: the points of the newest chosen evaluation ("حصل في السؤال: الإجابة"), editable.
    transitionPoints: Object.fromEntries(groupItems(data.items).filter((group) => group.type === TRANSITION)
      .map((group) => [group.group, transitionPoints(newestOf(group.items), data.child)])),
  };
}

const newestOf = (list) => [...list].sort(byDate).slice(-1)[0];

function transitionPoints(item, person) {
  const verb = isFemale(person?.gender) ? "حصلت" : "حصل";
  return [...(item?.result ?? [])]
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0) || a.id - b.id)
    .filter((row) => row.answer)
    .map((row) => `${verb} في ${row.title}: ${row.answer}`);
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
  // Rows may have been added or deleted, so the saved rows replace the defaults.
  if (Array.isArray(saved.team)) {
    base.team = saved.team.filter((row) => row && typeof row === "object")
      .map((row) => ({ name: String(row.name ?? ""), specialty: String(row.specialty ?? "") }));
  }
  if (CASE_LEVELS.includes(Number(saved.caseLevel))) base.caseLevel = Number(saved.caseLevel);
  if (typeof saved.caseFree === "string") base.caseFree = saved.caseFree;
  if (typeof saved.otPlanIntro === "string") base.otPlanIntro = saved.otPlanIntro;
  if (Array.isArray(saved.hiddenLevels)) base.hiddenLevels = saved.hiddenLevels.map(String);
  if (Array.isArray(saved.trackingHidden)) base.trackingHidden = saved.trackingHidden.map(Number);
  for (const key of Object.keys(base.behaviors)) {
    if (Array.isArray(saved.behaviors?.[key])) base.behaviors[key] = saved.behaviors[key];
  }
  // Reports saved before the descriptions existed take the current ones.
  for (const key of Object.keys(base.descriptions)) {
    if (typeof saved.descriptions?.[key] === "string") base.descriptions[key] = saved.descriptions[key];
  }
  for (const key of Object.keys(base.transitionPoints)) {
    if (Array.isArray(saved.transitionPoints?.[key])) base.transitionPoints[key] = saved.transitionPoints[key].map(String);
  }
  return base;
}

watch(edits, (value) => {
  if (!value) return;
  touchReport();
  if (savedReport.value.id) return;
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
  restoreAllPages();
}

// ---- the saved report ------------------------------------------------------------------------------

// { id (null until saved), dirty, saving, error, savedAt }. Once saved, every change saves itself shortly after.
const savedReport = ref({ id: null, dirty: false, saving: false, error: false, savedAt: null });
// Loading a report's values is not a change.
let restoring = false;
let changes = 0;
let autosaveTimer = null;
let saveQueue = Promise.resolve(true);

function touchReport() {
  if (restoring) return;
  changes++;
  savedReport.value.dirty = true;
  if (!savedReport.value.id) return;
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => saveReport(), 1500);
}

// «إرسال للأهل»: the report is saved first (a new one gets its id), then its departments are offered.
async function savedIdForSending() {
  if (!savedReport.value.id || savedReport.value.dirty) await saveReport();
  return savedReport.value.id;
}

// One save at a time, so a new report is created once.
function saveReport(options) {
  clearTimeout(autosaveTimer);
  autosaveTimer = null;
  saveQueue = saveQueue.then(() => sendReport(options), () => sendReport(options));
  return saveQueue;
}

async function sendReport({ printed = false } = {}) {
  if (!report.value || !edits.value) return false;
  const state = savedReport.value;
  const version = changes;
  state.saving = true;
  state.error = false;
  const body = { items: keys.value, types: outputTypes.value, edits: { ...edits.value, deletedPages: [...deletedPages.value] }, printed };
  try {
    const { data } = state.id
      ? await axios.put(`api/reports/saved/${state.id}`, body)
      : await axios.post(`api/reports/children/${childId.value}/saved`, body);
    if (!state.id) {
      state.id = data.report.id;
      // The address now opens this saved report (the watcher below does not reload for it).
      router.replace({ query: { ...route.query, report: data.report.id } });
    }
    if (version === changes) state.dirty = false;
    state.savedAt = data.report.updated_at;
    return true;
  } catch {
    state.error = true;
    return false;
  } finally {
    state.saving = false;
  }
}

// ---- data ------------------------------------------------------------------------------------------

async function load() {
  loading.value = true;
  loadError.value = false;
  try {
    const [{ data }, saved] = await Promise.all([
      axios.get(`api/reports/children/${childId.value}/report`, { params: { items: keys.value } }),
      // A saved report that is gone opens as a new one.
      reportId.value ? axios.get(`api/reports/saved/${reportId.value}`).then((res) => res.data.report).catch(() => null) : null,
    ]);
    restoring = true;
    report.value = data;
    savedReport.value = { id: saved?.id ?? null, dirty: false, saving: false, error: false, savedAt: saved?.updated_at ?? null };
    edits.value = applyDraft(defaults(data), saved ? saved.edits : readDraft());
    deletedPages.value = new Set(saved?.edits?.deletedPages ?? []);
    nextTick(() => {
      restoring = false;
    });
    document.title = `${t("ereport.report_title")} - ${data.child?.name ?? ""}`;
    if (showCharts.value) {
      loadSummary();
      loadAbllsSummaries();
    }
    if (showPlan.value) {
      loadPlan();
      loadQfbaPlan();
      loadOtPlan();
      loadCarolinaPlan();
    }
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
  summary.value = null;
  abllsSummaries.value = {};
  plan.value = null;
  qfbaPlan.value = null;
  otPlan.value = null;
  carolinaPlan.value = null;
  tracking.value = null;
  if (!keys.value.length) {
    loading.value = false;
    loadError.value = true;
    return;
  }
  load();
}
onMounted(open);
// A new selection (or another saved report) reloads; saving a new report only adds its id to the address.
const selectionKey = computed(() => `${childId.value}|${route.query.items ?? ""}|${route.query.types ?? ""}`);
watch([selectionKey, reportId], ([selection, id], [selectionBefore]) => {
  if (route.name !== "evaluation-report") return;
  if (selection === selectionBefore && id === savedReport.value.id) return;
  open();
});
onBeforeUnmount(() => {
  document.title = previousTitle;
  // A change still waiting to save itself is saved on leaving.
  if (autosaveTimer) saveReport();
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
          domain.questions[q].marks.push(...milestoneMarks(question, index + 1));
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

// One VB-MAPP evaluation: one row per test up to it — a new evaluation is Test 1, each continuation on its weaknesses
// the next test (completing missing levels changes the same test). The score is every box the test colored out of
// all the form's boxes.
const milestoneRows = (test) => (test.form?.tests ?? []).map((row) => ({
  n: row.n,
  key: `Test ${row.n}`,
  date: row.date,
  age_months: row.age_months,
  testers: row.testers ?? [],
  colors: row.colors ?? [],
  score: row.score,
  boxes_total: row.boxes_total,
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

// ---- strengths/weaknesses (saved on the server, per VB-MAPP evaluation) ----------------------------

// The newest VB-MAPP test's strengths/weaknesses: as edited and saved for it, or else as the evaluation gave them.
// { evaluationId, tables: [{ key, title, rows: [{ symbol, strengths: [point], weaknesses: [point] }] }], saved, dirty, saving, error, loading }
const summary = ref(null);

// Each point with its question's number in the domain: saved with it, or (a summary saved before numbers were kept)
// the number of the same text in the newest test.
const summaryFromServer = (tables, test = milestoneSection.value?.newest) => {
  const known = new Map((test?.result?.summary ?? []).flatMap((group) => [...(group.strength ?? []), ...(group.weak ?? [])]
    .filter((point) => point.number).map((point) => [`${group.level_id}|${group.symbol ?? ""}|${point.question}`, point.number])));
  const points = (table, row, kind) => (row[kind] ?? []).map((text, i) => newSummaryPoint(text,
    row[`${kind}_numbers`]?.[i] ?? known.get(`${table.key}|${row.symbol ?? ""}|${text}`) ?? null));
  return tables.map((table) => ({
    key: String(table.key ?? ""), title: table.title ?? "", hidden: [...(table.hidden ?? [])],
    rows: (table.rows ?? []).map((row) => ({
      symbol: row.symbol ?? "", hidden: [...(row.hidden ?? [])],
      strengths: points(table, row, "strengths"),
      weaknesses: points(table, row, "weaknesses"),
    })),
  }));
};
// A point's code: the row's symbol and its question's number in the domain (M-3).
const pointCode = (row, point) => (point.number ? [row.symbol, point.number].filter(Boolean).join("-") : "");

async function loadSummary() {
  const test = milestoneSection.value?.newest;
  if (!test) return;
  summary.value = { evaluationId: test.id, tables: [], saved: false, dirty: false, saving: false, error: false, loading: true };
  try {
    const { data } = await axios.get(`api/reports/summaries/${test.id}`);
    summary.value.tables = data.summary ? summaryFromServer(data.summary.tables) : createSummaryTables(test);
    summary.value.saved = Boolean(data.summary);
  } catch {
    summary.value.tables = createSummaryTables(test);
  } finally {
    summary.value.loading = false;
  }
}

const reportSummary = computed(() => (summary.value?.tables ?? []).filter((table) => isLevelShown(table.key)));

// `state`: the VB-MAPP summary (default) or an Ablls OT / SP one.
function touchSummary(state = summary.value) {
  if (state) state.dirty = true;
}
function addSummaryPoint(row, kind, state) {
  row[kind].push(newSummaryPoint(""));
  touchSummary(state);
}
function removeSummaryPoint(row, kind, point, state) {
  row[kind].splice(row[kind].indexOf(point), 1);
  touchSummary(state);
}
// Deleted rows and tables (per kind: strengths / weaknesses), restorable from their page.
const isHidden = (item, kind) => (item?.hidden ?? []).includes(kind);
const summaryRows = (table, kind) => table.rows.filter((row) => !isHidden(row, kind));
function setHidden(item, kind, hidden, state) {
  const list = new Set(item.hidden ?? []);
  if (hidden) list.add(kind);
  else list.delete(kind);
  item.hidden = [...list];
  touchSummary(state);
}
// What a summary page has deleted: [{ label, restore() }].
const summaryDeleted = (table, state) => ["strengths", "weaknesses"].flatMap((kind) => [
  ...(isHidden(table, kind) ? [{ key: `t-${kind}`, label: t(`ereport.${kind}`), restore: () => setHidden(table, kind, false, state) }] : []),
  ...table.rows.filter((row) => isHidden(row, kind))
    .map((row) => ({ key: `r-${kind}-${row.symbol}`, label: `${row.symbol || "—"} · ${t(`ereport.${kind}`)}`, restore: () => setHidden(row, kind, false, state) })),
]);
// A page whose tables are deleted (or left without points) has nothing to print and is left out of the print.
const summaryPrintable = (table) => ["strengths", "weaknesses"]
  .some((kind) => !isHidden(table, kind) && summaryRows(table, kind).some((row) => row[kind].length));
// The rows that print for a kind (shown, with points), numbered in order.
const summaryNumber = (table, kind, row) => summaryRows(table, kind).filter((item) => item[kind].length).indexOf(row) + 1;

async function saveSummary(state = summary.value, test = milestoneSection.value?.newest) {
  if (!state || state.saving) return;
  state.saving = true;
  state.error = false;
  try {
    const tables = state.tables.map((table) => ({
      key: table.key, title: table.title, hidden: table.hidden ?? [],
      rows: table.rows.map((row) => ({
        symbol: row.symbol, hidden: row.hidden ?? [],
        ...Object.fromEntries(["strengths", "weaknesses"].flatMap((kind) => {
          const kept = row[kind].filter((point) => point.text.trim());
          return [[kind, kept.map((point) => point.text)], [`${kind}_numbers`, kept.map((point) => point.number ?? null)]];
        })),
      })),
    }));
    const { data } = await axios.put(`api/reports/summaries/${state.evaluationId}`, { tables });
    state.tables = summaryFromServer(data.summary.tables, test);
    state.saved = true;
    state.dirty = false;
  } catch {
    state.error = true;
  } finally {
    state.saving = false;
  }
}

// ---- Ablls OT / SP strengths/weaknesses (saved on the server, per evaluation, like VB-MAPP's) ---------------

// By section group: { evaluationId, tables: [one table: rows per domain (type), by its letter], saved, dirty, saving, error, loading }.
const abllsSummaries = ref({});
const abllsSections = computed(() => sections.value.filter((section) => hasAbllsPoints(section.type) || section.type === CAROLINA));

// The newest test's answers: each skill's strength text when it scored 3 or 4, its weakness text when 0, 1 or 2
// (the child's wording and first name); a skill without that text, or not answered, is left out. Rows follow the chart.
function abllsSummaryTables(test) {
  const rows = new Map();
  [...(test?.result ?? [])]
    .map((category, i) => ({ category, i }))
    .sort((a, b) => abllsRank(a.category) - abllsRank(b.category) || (a.category.type_id ?? 0) - (b.category.type_id ?? 0) || a.i - b.i)
    .forEach(({ category }) => {
      const symbol = abllsLetterOf(category);
      if (!rows.has(symbol)) rows.set(symbol, { symbol, strengths: [], weaknesses: [] });
      const row = rows.get(symbol);
      // B12 -> number 12 (code B-12, like VB-MAPP's M-3); another form has no number.
      const match = abllsSymbolOf(category).match(/^[^\d]*?(\d+)$/u);
      const number = match && Number(match[1]) <= 999 ? Number(match[1]) : null;
      for (const mission of category.missions ?? []) {
        if (mission.answer_score === null || mission.answer_score === undefined || mission.answer_score === "") continue;
        const kind = Number(mission.answer_score) >= 3 ? "strengths" : "weaknesses";
        const text = childTextOf(mission, kind === "strengths" ? "strength_point" : "weakness_point", child.value).trim();
        if (text) row[kind].push(newSummaryPoint(text, number));
      }
    });
  return [{ key: "ablls", title: "", rows: [...rows.values()].sort((a, b) => abllsRank({ symbol: a.symbol }) - abllsRank({ symbol: b.symbol })) }];
}

// A row's domain name (the type's flow-chart name) by its letter, from the newest test.
const abllsRowTitle = (section, symbol) => {
  const category = (section.newest?.result ?? []).find((item) => abllsLetterOf(item) === symbol);
  return category?.type_chart_title || category?.type_title || "";
};


// ---- Carolina strengths/weaknesses: one row per general goal (its code, 4C), weaknesses first ------------------
// The code of a general goal is the part before the dash of its skills' symbols (4C-d -> 4C). A point's number is the
// skill's place among the skills of the goals with that code, so its code (4C-d) is found again from the result.
const carolinaCode = (symbol) => {
  const text = String(symbol ?? "").trim();
  return text.includes("-") ? text.replace(/-[^-]*$/u, "") : text;
};
const carolinaGoalCode = (goal) => carolinaCode((goal?.skills ?? []).find((skill) => skill.symbol)?.symbol) || "";
const carolinaGoalsOf = (result) => (result?.domains ?? []).flatMap((domain) => (domain.goals ?? []).map((goal) => ({ domain, goal, code: carolinaGoalCode(goal) })));
const carolinaSkillsByCode = (result) => {
  const codes = new Map();
  for (const { goal, code } of carolinaGoalsOf(result)) {
    if (!codes.has(code)) codes.set(code, { title: goal.title ?? "", skills: [] });
    codes.get(code).skills.push(...(goal.skills ?? []));
  }
  return codes;
};
const isCarolinaWeak = (response) => response === "-" || response === "+-";

function carolinaSummaryTables(test) {
  const rows = [];
  for (const [code, { skills }] of carolinaSkillsByCode(test?.result)) {
    const row = { symbol: code, strengths: [], weaknesses: [] };
    skills.forEach((skill, i) => {
      const number = i + 1 <= 999 ? i + 1 : null;
      if (skill.response === "+" && String(skill.strength ?? "").trim()) row.strengths.push(newSummaryPoint(skill.strength.trim(), number));
      if (isCarolinaWeak(skill.response) && String(skill.weakness ?? "").trim()) row.weaknesses.push(newSummaryPoint(skill.weakness.trim(), number));
    });
    rows.push(row);
  }
  return [{ key: "carolina", title: "", rows }];
}

// Sections with strengths/weaknesses pages of their own (Ablls OT / SP, Carolina) and how each reads.
const hasPoints = (type) => hasAbllsPoints(type) || Number(type) === CAROLINA;
const pointKinds = (section) => (section.type === CAROLINA ? ["weaknesses", "strengths"] : ["strengths", "weaknesses"]);
const pointRowTitle = (section, symbol) => (section.type === CAROLINA
  ? carolinaSkillsByCode(section.newest?.result).get(symbol)?.title ?? "" : abllsRowTitle(section, symbol));
const sectionPointCode = (section, row, point) => (section.type === CAROLINA
  ? (point.number ? carolinaSkillsByCode(section.newest?.result).get(row.symbol)?.skills?.[point.number - 1]?.symbol ?? "" : "")
  : pointCode(row, point));
const pointTablesOf = (section, test) => (section.type === CAROLINA ? carolinaSummaryTables(test) : abllsSummaryTables(test));

function loadAbllsSummaries() {
  for (const section of abllsSections.value) {
    const test = section.newest;
    if (!test) continue;
    const state = { evaluationId: test.id, tables: [], saved: false, dirty: false, saving: false, error: false, loading: true };
    abllsSummaries.value[section.group] = state;
    axios.get(`api/reports/summaries/${test.id}`)
      .then(({ data }) => {
        const current = abllsSummaries.value[section.group];
        current.tables = data.summary ? summaryFromServer(data.summary.tables, test) : pointTablesOf(section, test);
        current.saved = Boolean(data.summary);
      })
      .catch(() => {
        abllsSummaries.value[section.group].tables = pointTablesOf(section, test);
      })
      .finally(() => {
        abllsSummaries.value[section.group].loading = false;
      });
  }
}

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
    number: point.number ?? null, weakness: point.question, goal: point.goal ?? "",
  })));
}
// A plan saved before goals kept their question's number gets it from the same weakness in the newest test.
function withSummaryNumbers(goals, test) {
  const numbers = new Map((test?.result?.summary ?? []).flatMap((group) => (group.weak ?? [])
    .filter((point) => point.number).map((point) => [`${group.general_goal_id}|${point.question}`, point.number])));
  return goals.map((goal) => (goal.number ? goal : { ...goal, number: numbers.get(`${goal.general_goal_id}|${goal.weakness}`) ?? null }));
}

async function loadPlan() {
  const test = milestoneSection.value?.newest;
  if (!test) return;
  plan.value = { evaluationId: test.id, goals: [], hidden: [], saved: false, dirty: false, saving: false, error: false, loading: true };
  try {
    const { data } = await axios.get(`api/reports/plans/${test.id}`);
    plan.value.goals = data.plan ? withSummaryNumbers(data.plan.goals, test).map(planGoal) : planFromSummary(test);
    plan.value.hidden = [...(data.plan?.hidden ?? [])];
    plan.value.saved = Boolean(data.plan);
    plan.value.savedAt = data.plan?.updated_at ?? null;
    plan.value.approval = data.plan?.approval ?? null;
  } catch {
    plan.value.goals = planFromSummary(test);
  } finally {
    plan.value.loading = false;
  }
}

// The plan by level (lowest first), then by general goal; each goal coded by its question's number in the domain (M-3).
const planLevels = computed(() => {
  if (!plan.value) return [];
  const names = new Map((milestoneSection.value?.newest?.result?.levels ?? []).map((level) => [String(level.level_id), level]));
  const levels = new Map();
  for (const goal of plan.value.goals) {
    const levelKey = String(goal.level_id ?? "");
    if (!levels.has(levelKey)) levels.set(levelKey, { key: levelKey, title: names.get(levelKey)?.level_name ?? "", age: Number(names.get(levelKey)?.level_age) || 0, groups: new Map() });
    const groups = levels.get(levelKey).groups;
    const groupKey = planGroupKey(goal);
    if (!groups.has(groupKey)) groups.set(groupKey, { key: groupKey, legacyKey: String(goal.general_goal_id ?? goal.symbol ?? ""), general_goal: goal.general_goal, domain: goal.domain, symbol: goal.symbol, goals: [] });
    groups.get(groupKey).goals.push(goal);
  }
  // A deleted table (level) or group stays listed on its page to be restored; the server keeps them out of the tracking.
  const hidden = new Set(plan.value.hidden);
  return [...levels.values()].filter((level) => isLevelShown(level.key))
    .sort((a, b) => a.age - b.age || Number(a.key) - Number(b.key))
    .map((level) => {
      const groups = [...level.groups.values()];
      const levelHidden = hidden.has(`level:${level.key}`);
      // A group deleted before groups were split by domain was saved under its general goal alone.
      const groupHiddenKey = (group) => [group.key, group.legacyKey].map((key) => `group:${level.key}|${key}`).find((key) => hidden.has(key));
      const hiddenGroups = groups.filter((group) => groupHiddenKey(group));
      return { ...level, hidden: levelHidden, groups: groups.filter((group) => !hiddenGroups.includes(group)),
        deleted: [
          ...(levelHidden ? [{ key: `level:${level.key}`, label: t("ereport.whole_table") }] : []),
          ...hiddenGroups.map((group) => ({ key: groupHiddenKey(group), label: [group.domain, group.symbol && `(${group.symbol})`].filter(Boolean).join(" ") || "—" })),
        ] };
    });
});
function setPlanHidden(key, hidden) {
  const list = new Set(plan.value.hidden);
  if (hidden) list.add(key);
  else list.delete(key);
  plan.value.hidden = [...list];
  touchPlan();
}
// A plan group: the goals of one general goal and one domain symbol (math under the mands' general goal is MA, not M);
// a goal without a general goal (QFBA) goes by its symbol.
function planGroupKey(goal) {
  if (goal.general_goal_id == null) return String(goal.symbol ?? "");
  return goal.symbol ? `${goal.general_goal_id}:${goal.symbol}` : String(goal.general_goal_id);
}
// The symbol and the question's number in its domain (M-3); a goal written by hand takes its place in the group.
// A VB-MAPP goal added by hand (no question number) is coded «ADD», not the next number.
const goalCode = (group, index, goal) => (goal?.level_id != null && !goal?.number ? "ADD"
  : [group.symbol, goal?.number || index + 1].filter((part) => part !== "" && part !== null && part !== undefined).join("-"));

function touchPlan() {
  if (plan.value) plan.value.dirty = true;
}
function addPlanGoal(group) {
  const last = group.goals[group.goals.length - 1];
  const at = plan.value.goals.indexOf(last) + 1;
  plan.value.goals.splice(at, 0, planGoal({ ...last, id: undefined, number: null, weakness: "", goal: "" }));
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
    // The plan shows goals only; a goal added here has no weakness, so the server's required weakness takes the goal text.
    const goals = plan.value.goals.filter((goal) => (goal.goal || goal.weakness).trim())
      .map(({ key, code, attempts, cells, achieved_at, ...goal }) => ({ ...goal, weakness: goal.weakness.trim() ? goal.weakness : goal.goal }));
    const { data } = await axios.put(`api/reports/plans/${plan.value.evaluationId}`, { goals, hidden: plan.value.hidden });
    plan.value.goals = data.plan.goals.map(planGoal);
    plan.value.hidden = [...(data.plan.hidden ?? [])];
    plan.value.saved = true;
    plan.value.dirty = false;
    plan.value.savedAt = data.plan.updated_at;
    plan.value.approval = data.plan.approval ?? null;
    // The tracking reads the saved plans.
    if (showTracking.value) loadTracking();
  } catch {
    plan.value.error = true;
  } finally {
    plan.value.saving = false;
  }
}

// ---- QFBA plan (saved on the server, per QFBA evaluation) -------------------------------------------

// The newest chosen QFBA's plan, in the form's language: goals for each endorsed function, grouped by function and coded by
// its symbol (ATT-1, ATT-2 …); a new plan starts from the goals set for the functions in the QFBA settings. A group is
// deleted as "group:|<symbol>" (no level), so the tracking leaves its goals out too.
// { evaluationId, lang, goals: [planGoal], hidden: [key], saved, dirty, saving, error, loading, savedAt }
const qfbaSection = computed(() => sections.value.find((section) => section.type === QFBA) ?? null);
const qfbaPlan = ref(null);
const qfbaSymbol = (score) => score?.symbol || score?.key || "";
const qfbaGoal = (score, lang, values = {}) => planGoal({
  level_id: null, general_goal_id: null, general_goal: functionName(score, lang), domain: functionName(score, lang),
  domain_symbol: qfbaSymbol(score), symbol: qfbaSymbol(score), number: null, weakness: functionName(score, lang), goal: "", ...values,
});
const qfbaPlanFromResult = (test, lang) => planGoalsOf(test?.result, lang, { female: female.value, name: shortName.value })
  .flatMap(({ score, goals }) => goals.map((goal) => qfbaGoal(score, lang, { goal })));

async function loadQfbaPlan() {
  const test = qfbaSection.value?.newest;
  if (!test) return;
  const lang = qfbaLang(qfbaSection.value);
  qfbaPlan.value = { evaluationId: test.id, lang, goals: [], hidden: [], saved: false, dirty: false, saving: false, error: false, loading: true };
  try {
    const { data } = await axios.get(`api/reports/plans/${test.id}`);
    qfbaPlan.value.goals = data.plan ? data.plan.goals.map(planGoal) : qfbaPlanFromResult(test, lang);
    qfbaPlan.value.hidden = [...(data.plan?.hidden ?? [])];
    qfbaPlan.value.saved = Boolean(data.plan);
    qfbaPlan.value.savedAt = data.plan?.updated_at ?? null;
    qfbaPlan.value.approval = data.plan?.approval ?? null;
  } catch {
    qfbaPlan.value.goals = qfbaPlanFromResult(test, lang);
  } finally {
    qfbaPlan.value.loading = false;
  }
}

// One group per endorsed function (even without goals, to add some), then any other function a saved goal has.
const qfbaPlanAllGroups = computed(() => {
  if (!qfbaPlan.value) return [];
  const groups = new Map();
  for (const score of (qfbaSection.value?.newest?.result?.scores ?? []).filter((item) => item.endorsed > 0)) {
    groups.set(qfbaSymbol(score), { key: qfbaSymbol(score), score, title: functionName(score, qfbaPlan.value.lang), goals: [] });
  }
  for (const goal of qfbaPlan.value.goals) {
    const key = goal.symbol || "";
    if (!groups.has(key)) groups.set(key, { key, score: null, title: goal.domain || goal.general_goal || key, goals: [] });
    groups.get(key).goals.push(goal);
  }
  return [...groups.values()];
});
const qfbaGroupHidden = (group) => qfbaPlan.value.hidden.includes(`group:|${group.key}`);
const qfbaPlanGroups = computed(() => qfbaPlanAllGroups.value.filter((group) => !qfbaGroupHidden(group)));
const qfbaPlanDeleted = computed(() => qfbaPlanAllGroups.value.filter(qfbaGroupHidden));

function touchQfbaPlan() {
  if (qfbaPlan.value) qfbaPlan.value.dirty = true;
}
function setQfbaGroupHidden(group, hidden) {
  const list = new Set(qfbaPlan.value.hidden);
  if (hidden) list.add(`group:|${group.key}`);
  else list.delete(`group:|${group.key}`);
  qfbaPlan.value.hidden = [...list];
  touchQfbaPlan();
}
function addQfbaGoal(group) {
  const last = group.goals[group.goals.length - 1];
  const goal = last ? planGoal({ ...last, id: undefined, number: null, goal: "" }) : qfbaGoal(group.score, qfbaPlan.value.lang);
  qfbaPlan.value.goals.splice(last ? qfbaPlan.value.goals.indexOf(last) + 1 : qfbaPlan.value.goals.length, 0, goal);
  touchQfbaPlan();
}
function removeQfbaGoal(goal) {
  qfbaPlan.value.goals.splice(qfbaPlan.value.goals.indexOf(goal), 1);
  touchQfbaPlan();
}

async function saveQfbaPlan() {
  if (!qfbaPlan.value || qfbaPlan.value.saving) return;
  qfbaPlan.value.saving = true;
  qfbaPlan.value.error = false;
  try {
    const goals = qfbaPlan.value.goals.filter((goal) => goal.goal.trim())
      .map(({ key, code, attempts, cells, achieved_at, ...goal }) => ({ ...goal, weakness: goal.weakness?.trim() ? goal.weakness : goal.goal }));
    const { data } = await axios.put(`api/reports/plans/${qfbaPlan.value.evaluationId}`, { goals, hidden: qfbaPlan.value.hidden });
    qfbaPlan.value.goals = data.plan.goals.map(planGoal);
    qfbaPlan.value.hidden = [...(data.plan.hidden ?? [])];
    qfbaPlan.value.saved = true;
    qfbaPlan.value.dirty = false;
    qfbaPlan.value.savedAt = data.plan.updated_at;
    qfbaPlan.value.approval = data.plan.approval ?? null;
    if (showTracking.value) loadTracking();
  } catch {
    qfbaPlan.value.error = true;
  } finally {
    qfbaPlan.value.saving = false;
  }
}

// ---- Ablls OT plan (saved on the server like VB-MAPP's, on the newest chosen Ablls OT test) ------------------
// As the centre's paper: the flow chart, «سيتم رفع مستوى أداء <name> في كل من (<types with weaknesses>):», then per type
// «أهداف مجال <type>:», per weak skill (answer 0, 1, 2) «B7: <its long-term goal>», «(objectives):» and its sub goals
// not reached yet (score 1 of 4 -> B7-2, B7-3, B7-4). Saved goals: general_goal = the long-term goal, domain = the type,
// domain_symbol = its letter, symbol = the skill (B7), number = the sub goal's number; no general goal id, so the
// tracking groups and codes them by the skill (B7-2). A skill can be deleted (hidden "group:|B7") and restored.

// { evaluationId, goals: [planGoal], hidden: [key], saved, dirty, saving, error, loading, savedAt }
const otSection = computed(() => sections.value.find((section) => section.type === ABLLS_SKILLS) ?? null);
const otPlan = ref(null);

function otPlanFromResult(test) {
  return [...(test?.result ?? [])]
    .map((category, i) => ({ category, i }))
    .sort((a, b) => abllsRank(a.category) - abllsRank(b.category) || (a.category.type_id ?? 0) - (b.category.type_id ?? 0)
      || String(abllsSymbolOf(a.category)).localeCompare(String(abllsSymbolOf(b.category)), undefined, { numeric: true }) || a.i - b.i)
    .flatMap(({ category }) => (category.missions ?? []).flatMap((mission) => {
      const raw = mission.answer_score;
      if (raw === null || raw === undefined || raw === "" || Number(raw) >= 3) return [];
      const score = Number(raw);
      const symbol = (category.missions.length > 1 ? mission.mission_key : abllsSymbolOf(category)) || abllsSymbolOf(category);
      const general = childTextOf(mission, "long_term_goal", child.value);
      return childListOf(mission, "sub_goals", null, child.value)
        .map((text, index) => ({ text, number: index + 1 }))
        .filter(({ number }) => number > score)
        .map(({ text, number }) => planGoal({
          level_id: null, general_goal_id: null, general_goal: general, domain: category.type_title ?? "",
          domain_symbol: abllsLetterOf(category), symbol, number, weakness: text, goal: text,
        }));
    }));
}

async function loadOtPlan() {
  const test = otSection.value?.newest;
  if (!test) return;
  otPlan.value = { evaluationId: test.id, goals: [], hidden: [], saved: false, dirty: false, saving: false, error: false, loading: true };
  try {
    const { data } = await axios.get(`api/reports/plans/${test.id}`);
    otPlan.value.goals = data.plan ? data.plan.goals.map(planGoal) : otPlanFromResult(test);
    otPlan.value.hidden = [...(data.plan?.hidden ?? [])];
    otPlan.value.saved = Boolean(data.plan);
    otPlan.value.savedAt = data.plan?.updated_at ?? null;
    otPlan.value.approval = data.plan?.approval ?? null;
  } catch {
    otPlan.value.goals = otPlanFromResult(test);
  } finally {
    otPlan.value.loading = false;
  }
}

// Types (in order) -> skills -> goals; deleted skills are left out and listed to restore.
const otSkillKey = (symbol) => `group:|${symbol}`;
const otPlanAllSkills = computed(() => {
  const skills = new Map();
  for (const goal of otPlan.value?.goals ?? []) {
    const key = goal.symbol || "";
    if (!skills.has(key)) skills.set(key, { key, symbol: key, domain: goal.domain || "", letter: goal.domain_symbol || "", goals: [] });
    skills.get(key).goals.push(goal);
  }
  return [...skills.values()];
});
const otSkillHidden = (skill) => (otPlan.value?.hidden ?? []).includes(otSkillKey(skill.key));
const otPlanDomains = computed(() => {
  const domains = new Map();
  for (const skill of otPlanAllSkills.value.filter((item) => !otSkillHidden(item))) {
    const key = skill.letter || skill.domain;
    if (!domains.has(key)) domains.set(key, { key, title: skill.domain, skills: [] });
    domains.get(key).skills.push(skill);
  }
  return [...domains.values()];
});
const otPlanDeleted = computed(() => otPlanAllSkills.value.filter(otSkillHidden));
const otIntroDefault = computed(() => t("ereport.ot_plan_intro", {
  name: shortName.value, types: otPlanDomains.value.map((domain) => domain.title).filter(Boolean).join(" / "),
}));
// The opening sentence: as edited in the report, or built from the types.
const otIntro = computed(() => edits.value?.otPlanIntro || otIntroDefault.value);
function setOtIntro(value) {
  if (edits.value) edits.value.otPlanIntro = value === otIntroDefault.value ? "" : value;
}

function touchOtPlan() {
  if (otPlan.value) otPlan.value.dirty = true;
}
function setOtSkillHidden(skill, hidden) {
  const list = new Set(otPlan.value.hidden);
  if (hidden) list.add(otSkillKey(skill.key));
  else list.delete(otSkillKey(skill.key));
  otPlan.value.hidden = [...list];
  touchOtPlan();
}
// The skill's long-term goal is kept on each of its goals.
function setOtGeneralGoal(skill, text) {
  skill.goals.forEach((goal) => (goal.general_goal = text));
  touchOtPlan();
}
function addOtGoal(skill) {
  const last = skill.goals[skill.goals.length - 1];
  const number = Math.max(0, ...skill.goals.map((goal) => Number(goal.number) || 0)) + 1;
  otPlan.value.goals.splice(otPlan.value.goals.indexOf(last) + 1, 0, planGoal({ ...last, id: undefined, number, weakness: "", goal: "" }));
  touchOtPlan();
}
function removeOtGoal(skill, goal) {
  // The last goal of a skill holds its long-term goal: delete the skill instead (restorable).
  if (skill.goals.length === 1) return setOtSkillHidden(skill, true);
  otPlan.value.goals.splice(otPlan.value.goals.indexOf(goal), 1);
  touchOtPlan();
}

async function saveOtPlan() {
  if (!otPlan.value || otPlan.value.saving) return;
  otPlan.value.saving = true;
  otPlan.value.error = false;
  try {
    const goals = otPlan.value.goals.filter((goal) => (goal.goal || goal.weakness || "").trim())
      .map(({ key, code, attempts, cells, achieved_at, ...goal }) => ({ ...goal, weakness: goal.weakness?.trim() ? goal.weakness : goal.goal }));
    const { data } = await axios.put(`api/reports/plans/${otPlan.value.evaluationId}`, { goals, hidden: otPlan.value.hidden });
    otPlan.value.goals = data.plan.goals.map(planGoal);
    otPlan.value.hidden = [...(data.plan.hidden ?? [])];
    otPlan.value.saved = true;
    otPlan.value.dirty = false;
    otPlan.value.savedAt = data.plan.updated_at;
    otPlan.value.approval = data.plan.approval ?? null;
  } catch {
    otPlan.value.error = true;
  } finally {
    otPlan.value.saving = false;
  }
}

// ---- Carolina plan (saved on the server like VB-MAPP's, on the newest chosen Carolina test) -------------------
// Per domain «أهداف <domain>:», per general goal «4C : أن يطور <name> مهارات <goal> لديه.» (editable), «(objectives):» and
// each of its skills answered - or +- with its plan goal: «4C-d: <plan goal>». Saved goals: general_goal_id = the goal,
// general_goal = the sentence, domain = the domain, domain_symbol = the goal's code (4C), symbol = the skill (4C-d), no
// number. A general goal can be deleted (hidden "group:|<goal id>") and restored; a skill without a plan goal is left out.
const carolinaSection = computed(() => sections.value.find((section) => section.type === CAROLINA) ?? null);
const carolinaPlan = ref(null);
const carolinaSentence = (goal) => t(female.value ? "ereport.carolina_goal_female" : "ereport.carolina_goal_male", { name: shortName.value, goal: goal.title ?? "" });

function carolinaPlanFromResult(test) {
  return carolinaGoalsOf(test?.result).flatMap(({ domain, goal, code }) => (goal.skills ?? [])
    .filter((skill) => isCarolinaWeak(skill.response) && String(skill.plan_goal ?? "").trim())
    .map((skill) => planGoal({
      level_id: null, general_goal_id: goal.id ?? null, general_goal: carolinaSentence(goal), domain: domain.title ?? "",
      domain_symbol: code, symbol: skill.symbol ?? "", number: null, weakness: String(skill.weakness ?? "").trim() || skill.plan_goal.trim(), goal: skill.plan_goal.trim(),
    })));
}

async function loadCarolinaPlan() {
  const test = carolinaSection.value?.newest;
  if (!test) return;
  carolinaPlan.value = { evaluationId: test.id, goals: [], hidden: [], saved: false, dirty: false, saving: false, error: false, loading: true };
  try {
    const { data } = await axios.get(`api/reports/plans/${test.id}`);
    carolinaPlan.value.goals = data.plan ? data.plan.goals.map(planGoal) : carolinaPlanFromResult(test);
    carolinaPlan.value.hidden = [...(data.plan?.hidden ?? [])];
    carolinaPlan.value.saved = Boolean(data.plan);
    carolinaPlan.value.savedAt = data.plan?.updated_at ?? null;
    carolinaPlan.value.approval = data.plan?.approval ?? null;
  } catch {
    carolinaPlan.value.goals = carolinaPlanFromResult(test);
  } finally {
    carolinaPlan.value.loading = false;
  }
}

const carolinaGroupKey = (group) => `group:|${group.key}`;
const carolinaPlanAllGroups = computed(() => {
  const groups = new Map();
  for (const goal of carolinaPlan.value?.goals ?? []) {
    const key = String(goal.general_goal_id ?? goal.domain_symbol ?? "");
    if (!groups.has(key)) groups.set(key, { key, code: goal.domain_symbol || "", domain: goal.domain || "", goals: [] });
    groups.get(key).goals.push(goal);
  }
  return [...groups.values()];
});
const carolinaGroupHidden = (group) => (carolinaPlan.value?.hidden ?? []).includes(carolinaGroupKey(group));
const carolinaPlanDomains = computed(() => {
  const domains = new Map();
  for (const group of carolinaPlanAllGroups.value.filter((item) => !carolinaGroupHidden(item))) {
    if (!domains.has(group.domain)) domains.set(group.domain, { key: group.domain || "none", title: group.domain, groups: [] });
    domains.get(group.domain).groups.push(group);
  }
  return [...domains.values()];
});
const carolinaPlanDeleted = computed(() => carolinaPlanAllGroups.value.filter(carolinaGroupHidden));

function touchCarolinaPlan() {
  if (carolinaPlan.value) carolinaPlan.value.dirty = true;
}
function setCarolinaGroupHidden(group, hidden) {
  const list = new Set(carolinaPlan.value.hidden);
  if (hidden) list.add(carolinaGroupKey(group));
  else list.delete(carolinaGroupKey(group));
  carolinaPlan.value.hidden = [...list];
  touchCarolinaPlan();
}
function setCarolinaSentence(group, text) {
  group.goals.forEach((goal) => (goal.general_goal = text));
  touchCarolinaPlan();
}
// A point added by hand has the code «ADD».
function addCarolinaGoal(group) {
  const last = group.goals[group.goals.length - 1];
  carolinaPlan.value.goals.splice(carolinaPlan.value.goals.indexOf(last) + 1, 0, planGoal({ ...last, id: undefined, symbol: "ADD", number: null, weakness: "", goal: "" }));
  touchCarolinaPlan();
}
function removeCarolinaGoal(group, goal) {
  // The last point of a general goal holds its sentence: delete the general goal instead (restorable).
  if (group.goals.length === 1) return setCarolinaGroupHidden(group, true);
  carolinaPlan.value.goals.splice(carolinaPlan.value.goals.indexOf(goal), 1);
  touchCarolinaPlan();
}

async function saveCarolinaPlan() {
  if (!carolinaPlan.value || carolinaPlan.value.saving) return;
  carolinaPlan.value.saving = true;
  carolinaPlan.value.error = false;
  try {
    const goals = carolinaPlan.value.goals.filter((goal) => (goal.goal || "").trim())
      .map(({ key, code, attempts, cells, achieved_at, ...goal }) => ({ ...goal, weakness: goal.weakness?.trim() ? goal.weakness : goal.goal }));
    const { data } = await axios.put(`api/reports/plans/${carolinaPlan.value.evaluationId}`, { goals, hidden: carolinaPlan.value.hidden });
    carolinaPlan.value.goals = data.plan.goals.map(planGoal);
    carolinaPlan.value.hidden = [...(data.plan.hidden ?? [])];
    carolinaPlan.value.saved = true;
    carolinaPlan.value.dirty = false;
    carolinaPlan.value.savedAt = data.plan.updated_at;
    carolinaPlan.value.approval = data.plan.approval ?? null;
  } catch {
    carolinaPlan.value.error = true;
  } finally {
    carolinaPlan.value.saving = false;
  }
}

// ---- tracking (the saved plans' goals of the chosen VB-MAPP and QFBA tests) -----------------------

// { plans: [{ evaluation_id, evaluation_date, goals: [...] }], achieved: { [id]: "YYYY-MM-DD" | "" }, cells: { [id]: {...} },
//   request: the tracking sent for these tests ({ status: pending | approved | rejected, note, goal_ids, … }) or null,
//   saving, approving, error, savedAt }
// Columns prop, MT, EXP, RR, GEN, EF and MF (utils/trackingColumns.js): the date columns take a start and an end date
// (the sessions show and change them too), MT and GEN are free text until a session fills them, then they are shown
// and cannot change. Once the management approved the tracking it is view-only.
const tracking = ref(null);
// The tests whose plans the tracking reads (VB-MAPP, then QFBA), and the evaluation type a tracked plan belongs to.
const trackingTests = computed(() => [...(milestoneSection.value?.tests ?? []), ...(qfbaSection.value?.tests ?? [])]);
const planTypeLabel = (item) => (items.value.find((test) => Number(test.id) === Number(item?.evaluation_id))?.type === QFBA ? "QFBA" : "VB-MAPP");
const CELL_KEYS = TRACKING_COLUMNS.flatMap((column) => (column.key === "gen" ? ["gen"] : [`${column.key}_start`, `${column.key}_end`]));
const trackingApproved = computed(() => tracking.value?.request?.status === "approved");
const sessionFilled = (goal, key) => (goal.session_cells ?? []).includes(key);
const cellLocked = (goal, key) => trackingApproved.value || goal.locked || sessionFilled(goal, key);
// GEN filled by a session: a summary of its requests.
function genSummary(goal) {
  const status = (item) => t(`gen_status_${item.status}`);
  const people = goal.gen?.people ?? [];
  return [
    goal.gen?.classes && `${t("gen_classes")}: ${status(goal.gen.classes)}`,
    goal.gen?.home && `${t("gen_home")}: ${status(goal.gen.home)}`,
    people.length && `${t("gen_people")}: ${people.filter((item) => item.status === "approved").length}/${people.length}`,
  ].filter(Boolean).join(" · ");
}
function cellText(goal, key) {
  if (!sessionFilled(goal, key)) return tracking.value.cells[goal.id]?.[key] ?? "";
  if (key === "gen") return genSummary(goal);
  return goal.cells?.[key] ?? "";
}

async function loadTracking() {
  const tests = trackingTests.value;
  if (!tests.length) return;
  tracking.value = { plans: [], achieved: {}, cells: {}, request: null, loading: true, saving: false, approving: false, error: false };
  try {
    const { data } = await axios.get(`api/reports/children/${childId.value}/tracking`, { params: { evaluations: tests.map((test) => test.id) } });
    setTrackingPlans(data.plans ?? []);
    tracking.value.request = data.request ?? null;
  } catch {
    tracking.value.error = true;
  } finally {
    tracking.value.loading = false;
  }
}

function setTrackingPlans(plans) {
  tracking.value.plans = plans;
  for (const goal of plans.flatMap((item) => item.goals)) {
    tracking.value.achieved[goal.id] = goal.achieved_at ?? "";
    tracking.value.cells[goal.id] = Object.fromEntries(CELL_KEYS.map((key) => [key, goal.cells?.[key] ?? ""]));
    // prop's dates are the goal's start and the day it was achieved.
    Object.assign(tracking.value.cells[goal.id], { prop_start: columnDate(goal, "prop", "start"), prop_end: columnDate(goal, "prop", "end") });
  }
}

// Each plan's goals by general goal and domain (the centre's form has one table per goal), numbered inside it.
const trackingGroups = (item) => {
  const groups = new Map();
  for (const goal of item.goals) {
    const key = planGroupKey(goal);
    if (!groups.has(key)) groups.set(key, { key, general_goal: goal.general_goal, domain: goal.domain, domain_symbol: goal.domain_symbol, symbol: goal.symbol, goals: [] });
    groups.get(key).goals.push(goal);
  }
  return [...groups.values()];
};
// An approved tracking prints the goals it was approved with.
const isTracked = (goal) => (trackingApproved.value
  ? tracking.value.request.goal_ids.includes(Number(goal.id))
  : !(edits.value?.trackingHidden ?? []).includes(Number(goal.id)));
function toggleTracked(goal, shown) {
  if (trackingApproved.value) return;
  const hidden = new Set((edits.value.trackingHidden ?? []).map(Number));
  if (shown) hidden.delete(Number(goal.id));
  else hidden.add(Number(goal.id));
  edits.value.trackingHidden = [...hidden];
}

// Saves the goals that print: their columns (the server keeps what a session filled and approved goals as they are).
async function saveTracking() {
  if (!tracking.value || tracking.value.saving || trackingApproved.value) return true;
  const goals = tracking.value.plans.flatMap((item) => item.goals).filter(isTracked).filter((goal) => !goal.locked);
  if (!goals.length) return true;
  tracking.value.saving = true;
  tracking.value.error = false;
  try {
    await axios.post(`api/reports/children/${childId.value}/tracking`, {
      goals: goals.map((goal) => {
        const { prop_start: start, prop_end: end, ...cells } = tracking.value.cells[goal.id];
        return { id: goal.id, prop_start: isDate(start) ? start : null, achieved_at: isDate(end) ? end : null, cells };
      }),
    });
    const { data } = await axios.get(`api/reports/children/${childId.value}/tracking`, { params: { evaluations: trackingTests.value.map((test) => test.id) } });
    setTrackingPlans(data.plans ?? []);
    tracking.value.request = data.request ?? null;
    tracking.value.savedAt = new Date().toLocaleTimeString();
    return true;
  } catch {
    tracking.value.error = true;
    return false;
  } finally {
    tracking.value.saving = false;
  }
}

// ---- deleted pages (left out of the print; kept with the saved report) -----------------------------

// Every page registers itself (v-page="{ key, title }"): the toolbar lists them in page order.
const pages = ref([]);
const pageEls = new Map();
const deletedPages = ref(new Set());
watch(deletedPages, () => touchReport());
const isDeleted = (key) => deletedPages.value.has(key);
function deletePage(key) {
  deletedPages.value = new Set([...deletedPages.value, key]);
}
function restorePage(key) {
  const next = new Set(deletedPages.value);
  next.delete(key);
  deletedPages.value = next;
}
function restoreAllPages() {
  deletedPages.value = new Set();
}
function setPageShown(key, shown) {
  if (shown) restorePage(key);
  else deletePage(key);
}
// Page order as on screen; a page that left the report (another output, a level hidden) leaves the list.
const orderedPages = computed(() => [...pages.value].sort((a, b) => {
  const elA = pageEls.get(a.key);
  const elB = pageEls.get(b.key);
  if (!elA || !elB) return 0;
  return elA.compareDocumentPosition(elB) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}));
const deletedCount = computed(() => pages.value.filter((page) => isDeleted(page.key)).length);
const pagesMenu = ref(null);

function registerPage(el, { key, title }) {
  pageEls.set(key, el);
  const index = pages.value.findIndex((page) => page.key === key);
  if (index === -1) pages.value = [...pages.value, { key, title }];
  else if (pages.value[index].title !== title) pages.value = pages.value.map((page, i) => (i === index ? { key, title } : page));
}
function unregisterPage(key) {
  pageEls.delete(key);
  pages.value = pages.value.filter((page) => page.key !== key);
}

// v-page: registers the page, adds its delete button (screen only) and hides it while deleted.
const vPage = {
  mounted(el, binding) {
    el.__page = { ...binding.value };
    registerPage(el, el.__page);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "rx-page-delete";
    button.innerHTML = '<i class="pi pi-trash" aria-hidden="true"></i>';
    button.addEventListener("click", () => deletePage(el.__page.key));
    el.__deleteButton = button;
    el.appendChild(button);
    el.__stop = watch([deletedPages, () => t("ereport.delete_page")], ([, label]) => {
      el.classList.toggle("is-deleted", isDeleted(el.__page.key));
      button.title = label;
      button.setAttribute("aria-label", `${label}: ${el.__page.title}`);
    }, { immediate: true });
  },
  updated(el, binding) {
    if (binding.value.key !== el.__page.key) {
      unregisterPage(el.__page.key);
      el.__page = { ...binding.value };
      registerPage(el, el.__page);
      el.classList.toggle("is-deleted", isDeleted(el.__page.key));
    } else if (binding.value.title !== el.__page.title) {
      el.__page = { ...binding.value };
      registerPage(el, el.__page);
    }
    // A changed :class binding rewrites the element's classes, dropping the one added here.
    el.classList.toggle("is-deleted", isDeleted(el.__page.key));
    // Keep the button last if Vue re-rendered the page's children.
    if (el.__deleteButton && el.lastElementChild !== el.__deleteButton) el.appendChild(el.__deleteButton);
  },
  unmounted(el) {
    el.__stop?.();
    unregisterPage(el.__page.key);
  },
};

// «إرسال للاعتماد»: saves it, then sends it (the chosen tests and the goals that print) to the management; sending a
// pending one again updates it. Once approved the child's sessions work on it.
async function approveTracking() {
  if (!tracking.value || tracking.value.approving || trackingApproved.value) return;
  const goals = tracking.value.plans.flatMap((item) => item.goals).filter(isTracked);
  if (!goals.length) return;
  tracking.value.approving = true;
  try {
    if (!(await saveTracking())) return;
    const { data } = await axios.post(`api/reports/children/${childId.value}/tracking/approve`, {
      evaluations: trackingTests.value.map((test) => test.id),
      goals: goals.map((goal) => goal.id),
    });
    tracking.value.request = data.tracking;
  } catch {
    tracking.value.error = true;
  } finally {
    tracking.value.approving = false;
  }
}

// ---- actions ---------------------------------------------------------------------------------------

// Printing saves the tracking and the report (listed then on the reports page) first.
async function print() {
  document.activeElement?.blur?.();
  if (showTracking.value) await saveTracking();
  await saveReport({ printed: true });
  window.print();
}

function back() {
  router.push({ name: "evaluation-reports", query: { child: childId.value } });
}
</script>

<template>
  <div class="rx-root">
    <!-- toolbar (not printed) -->
    <!-- toolbar (not printed): the title and the main actions, then what is saved, each with its state -->
    <header class="rx-toolbar">
      <div class="rx-toolbar-main">
        <Button :label="$t('ereport.back')" icon="pi pi-arrow-right" class="rx-back" severity="secondary" variant="text" @click="back" />
        <div class="rx-toolbar-title">
          <strong>{{ $t("ereport.report_title") }}<template v-if="child.name"> — {{ child.name }}</template></strong>
          <small><i class="pi pi-pencil" aria-hidden="true" /> {{ $t("ereport.editor_hint") }}</small>
        </div>
        <div class="rx-toolbar-end">
          <!-- Pages: untick (or the trash on a page) to leave it out of the print; nothing is saved. -->
          <Button v-if="report" type="button" icon="pi pi-clone" variant="outlined"
            :label="deletedCount ? $t('ereport.pages_deleted', { n: deletedCount }) : $t('ereport.pages')"
            :severity="deletedCount ? 'danger' : 'secondary'" aria-haspopup="true"
            @click="pagesMenu.toggle($event)" />
          <Popover ref="pagesMenu">
            <div class="rx-pages-menu">
              <p class="rx-pages-menu-hint">{{ $t("ereport.pages_hint") }}</p>
              <ol>
                <li v-for="(page, i) in orderedPages" :key="page.key" :class="{ 'is-off': isDeleted(page.key) }">
                  <Checkbox :modelValue="!isDeleted(page.key)" binary :inputId="'rx-page-' + i" @update:modelValue="setPageShown(page.key, $event)" />
                  <label :for="'rx-page-' + i">{{ page.title }}</label>
                  <button v-if="isDeleted(page.key)" type="button" class="rx-pages-restore" @click="restorePage(page.key)">{{ $t("ereport.restore_page") }}</button>
                </li>
              </ol>
              <Button v-if="deletedCount" size="small" icon="pi pi-undo" :label="$t('ereport.restore_all_pages')" severity="secondary" @click="restoreAllPages" />
            </div>
          </Popover>
          <Button v-if="report" :label="$t('ereport.reset')" icon="pi pi-refresh" severity="secondary" variant="text" @click="resetEdits" />
          <CombinedReportSend v-if="report" :report-id="savedReport.id" :before-open="savedIdForSending" />
          <Button :label="$t('ereport.print')" icon="pi pi-print" :disabled="!report" data-no-request-spinner @click="print" />
        </div>
      </div>

      <div v-if="report" class="rx-toolbar-sub">
        <!-- Which VB-MAPP levels the report shows (charts and strengths/weaknesses); not printed. -->
        <fieldset v-if="milestoneLevels.length" class="rx-levels">
          <legend>{{ $t("ereport.levels_shown") }}</legend>
          <label v-for="level in milestoneLevels" :key="level.id" class="rx-level-option">
            <Checkbox :modelValue="isLevelShown(level.id)" binary :inputId="'rx-level-' + level.id"
              @update:modelValue="toggleLevel(level.id, $event)" />
            <span>{{ level.name || $t("level_n", { n: level.age || level.id }) }}</span>
          </label>
        </fieldset>

        <div class="rx-save-groups">
          <div class="rx-save-group" :class="savedReport.error ? 'is-error' : savedReport.dirty || !savedReport.id ? 'is-dirty' : 'is-saved'">
            <span class="rx-save-dot" aria-hidden="true" />
            <div class="rx-save-text">
              <b>{{ $t("ereport.group_report") }}</b>
              <small>{{ savedReport.error ? $t("ereport.save_failed") : !savedReport.id ? $t("ereport.report_unsaved") : savedReport.dirty ? $t("ereport.report_saving") : $t("ereport.report_saved") }}</small>
            </div>
            <Button size="small" icon="pi pi-bookmark" :label="$t('save')" :loading="savedReport.saving" data-no-request-spinner @click="saveReport()" />
          </div>

          <div v-if="summary && !summary.loading" class="rx-save-group" :class="summary.error ? 'is-error' : summary.dirty || !summary.saved ? 'is-dirty' : 'is-saved'">
            <span class="rx-save-dot" aria-hidden="true" />
            <div class="rx-save-text">
              <b>{{ $t("ereport.group_summary") }}</b>
              <small>{{ summary.error ? $t("ereport.save_failed") : summary.dirty || !summary.saved ? $t("ereport.summary_unsaved") : $t("ereport.summary_saved") }}</small>
            </div>
            <Button size="small" icon="pi pi-save" :label="$t('save')" :loading="summary.saving" data-no-request-spinner @click="saveSummary()" />
          </div>

          <!-- Ablls OT / SP: each section's strengths/weaknesses, saved like VB-MAPP's. -->
          <template v-for="section in abllsSections" :key="'ablls-save-' + section.group">
            <div v-if="abllsSummaries[section.group] && !abllsSummaries[section.group].loading" class="rx-save-group"
              :class="abllsSummaries[section.group].error ? 'is-error' : abllsSummaries[section.group].dirty || !abllsSummaries[section.group].saved ? 'is-dirty' : 'is-saved'">
              <span class="rx-save-dot" aria-hidden="true" />
              <div class="rx-save-text">
                <b>{{ $t("ereport.group_summary") }} · {{ section.label }}</b>
                <small>{{ abllsSummaries[section.group].error ? $t("ereport.save_failed") : abllsSummaries[section.group].dirty || !abllsSummaries[section.group].saved ? $t("ereport.summary_unsaved") : $t("ereport.summary_saved") }}</small>
              </div>
              <Button size="small" icon="pi pi-save" :label="$t('save')" :loading="abllsSummaries[section.group].saving" data-no-request-spinner
                @click="saveSummary(abllsSummaries[section.group], section.newest)" />
            </div>
          </template>

          <div v-if="plan && !plan.loading" class="rx-save-group" :class="plan.error ? 'is-error' : plan.dirty || !plan.saved ? 'is-dirty' : 'is-saved'">
            <span class="rx-save-dot" aria-hidden="true" />
            <div class="rx-save-text">
              <b>{{ $t("ereport.group_plan") }}</b>
              <small>{{ plan.error ? $t("ereport.save_failed") : plan.dirty || !plan.saved ? $t("ereport.plan_unsaved") : $t("ereport.plan_saved") }}</small>
            </div>
            <Button size="small" icon="pi pi-save" :label="$t('save')" :loading="plan.saving" data-no-request-spinner @click="savePlan" />
            <PlanApproval v-if="plan.approval" v-model:approval="plan.approval" :evaluationId="plan.evaluationId" :dirty="plan.dirty || !plan.saved" />
          </div>

          <div v-if="qfbaPlan && !qfbaPlan.loading" class="rx-save-group" :class="qfbaPlan.error ? 'is-error' : qfbaPlan.dirty || !qfbaPlan.saved ? 'is-dirty' : 'is-saved'">
            <span class="rx-save-dot" aria-hidden="true" />
            <div class="rx-save-text">
              <b>{{ $t("ereport.group_plan") }} · QFBA</b>
              <small>{{ qfbaPlan.error ? $t("ereport.save_failed") : qfbaPlan.dirty || !qfbaPlan.saved ? $t("ereport.plan_unsaved") : $t("ereport.plan_saved") }}</small>
            </div>
            <Button size="small" icon="pi pi-save" :label="$t('save')" :loading="qfbaPlan.saving" data-no-request-spinner @click="saveQfbaPlan" />
            <PlanApproval v-if="qfbaPlan.approval" v-model:approval="qfbaPlan.approval" :evaluationId="qfbaPlan.evaluationId" :dirty="qfbaPlan.dirty || !qfbaPlan.saved" />
          </div>

          <div v-if="otPlan && !otPlan.loading" class="rx-save-group" :class="otPlan.error ? 'is-error' : otPlan.dirty || !otPlan.saved ? 'is-dirty' : 'is-saved'">
            <span class="rx-save-dot" aria-hidden="true" />
            <div class="rx-save-text">
              <b>{{ $t("ereport.group_plan") }} · Ablls OT</b>
              <small>{{ otPlan.error ? $t("ereport.save_failed") : otPlan.dirty || !otPlan.saved ? $t("ereport.plan_unsaved") : $t("ereport.plan_saved") }}</small>
            </div>
            <Button size="small" icon="pi pi-save" :label="$t('save')" :loading="otPlan.saving" data-no-request-spinner @click="saveOtPlan()" />
            <PlanApproval v-if="otPlan.approval" v-model:approval="otPlan.approval" :evaluationId="otPlan.evaluationId" :dirty="otPlan.dirty || !otPlan.saved" />
          </div>

          <div v-if="carolinaPlan && !carolinaPlan.loading" class="rx-save-group" :class="carolinaPlan.error ? 'is-error' : carolinaPlan.dirty || !carolinaPlan.saved ? 'is-dirty' : 'is-saved'">
            <span class="rx-save-dot" aria-hidden="true" />
            <div class="rx-save-text">
              <b>{{ $t("ereport.group_plan") }} · {{ carolinaSection?.label }}</b>
              <small>{{ carolinaPlan.error ? $t("ereport.save_failed") : carolinaPlan.dirty || !carolinaPlan.saved ? $t("ereport.plan_unsaved") : $t("ereport.plan_saved") }}</small>
            </div>
            <Button size="small" icon="pi pi-save" :label="$t('save')" :loading="carolinaPlan.saving" data-no-request-spinner @click="saveCarolinaPlan()" />
            <PlanApproval v-if="carolinaPlan.approval" v-model:approval="carolinaPlan.approval" :evaluationId="carolinaPlan.evaluationId" :dirty="carolinaPlan.dirty || !carolinaPlan.saved" />
          </div>

          <div v-if="tracking && !tracking.loading && tracking.plans.length" class="rx-save-group"
            :class="tracking.error ? 'is-error' : tracking.request ? `is-${tracking.request.status}` : 'is-dirty'">
            <span class="rx-save-dot" aria-hidden="true" />
            <div class="rx-save-text">
              <b>{{ $t("ereport.group_tracking") }}</b>
              <small>{{ tracking.error ? $t("ereport.save_failed") : tracking.request ? $t(`ereport.tracking_status_${tracking.request.status}`) : $t("ereport.tracking_not_sent") }}</small>
            </div>
            <template v-if="!trackingApproved">
              <Button size="small" icon="pi pi-save" :label="$t('save')" severity="secondary" variant="outlined" :loading="tracking.saving" data-no-request-spinner @click="saveTracking" />
              <Button size="small" icon="pi pi-send" :label="tracking.request?.status === 'pending' ? $t('ereport.resend_tracking') : $t('ereport.send_tracking')"
                :loading="tracking.approving" data-no-request-spinner @click="approveTracking" />
            </template>
            <i v-else class="pi pi-lock rx-save-lock" v-tooltip.bottom="$t('ereport.tracking_status_approved')" />
          </div>
        </div>
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
      <section v-page="{ key: 'cover', title: $t('ereport.page_cover') }" class="rx-page rx-cover">
        <div class="rx-cover-top">
          <img :src="$siteLogo(sawaLogo)" alt="Sawa" class="rx-cover-logo" />
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
      <section v-page="{ key: 'info', title: $t('ereport.page_info') }" class="rx-page">
        <header class="rx-head">
          <img :src="$siteLogo(sawaLogo)" alt="Sawa" />
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
              <th class="rx-plan-control-col rx-screen-only" />
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in edits.team" :key="i">
              <td class="rx-col-num">{{ i + 1 }}</td>
              <td><EditableText v-model="row.name" block :placeholder="$t('ereport.name')" /></td>
              <td><EditableText v-model="row.specialty" block :placeholder="$t('ereport.specialty')" /></td>
              <td class="rx-col-sign" />
              <td class="rx-plan-control-col rx-screen-only">
                <button type="button" class="rx-plan-control rx-remove-point" :aria-label="$t('ereport.delete_row')" :title="$t('ereport.delete_row')"
                  @click="edits.team.splice(i, 1)"><i class="pi pi-trash" aria-hidden="true" /></button>
              </td>
            </tr>
            <tr class="rx-screen-only">
              <td colspan="5"><button type="button" class="rx-plan-control rx-add-point" @click="edits.team.push({ name: '', specialty: '' })">
                <i class="pi pi-plus" aria-hidden="true" /> {{ $t("ereport.add_row") }}</button></td>
            </tr>
          </tbody>
        </table>

        <footer class="rx-foot"><span>{{ $t("ereport.academy") }}</span><span class="rx-page-num" /></footer>
      </section>

      <!-- Case description belongs to the report output. -->
      <section v-if="showCharts" v-page="{ key: 'case', title: $t('ereport.page_case') }" class="rx-page">
        <header class="rx-head">
          <img :src="$siteLogo(sawaLogo)" alt="Sawa" />
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
        <!-- The evaluation's description (from «وصف التقييمات», edited here), on the page before its charts; once per type. -->
        <section v-if="showCharts && edits.descriptions?.[section.type] !== undefined && (section.type !== SIDE_PROFILE || section.group === firstSideProfile)"
          v-page="{ key: 'about-' + section.type, title: $t('eval_desc.report_title') + ' · ' + typeLabel(section.type, $t) }" class="rx-page"
          :class="{ 'rx-print-hidden': !edits.descriptions[section.type].trim() }" :data-print-note="$t('ereport.page_not_printed')">
          <header class="rx-head">
            <img :src="$siteLogo(sawaLogo)" alt="Sawa" />
            <span>{{ typeLabel(section.type, $t) }}</span>
          </header>

          <h2 class="rx-band">{{ $t("eval_desc.report_title") }} · {{ typeLabel(section.type, $t) }}</h2>
          <p class="rx-case-hint rx-screen-only"><i class="pi pi-info-circle" aria-hidden="true" /> {{ $t("eval_desc.report_hint") }}</p>
          <EditableText v-model="edits.descriptions[section.type]" block multiline class="rx-about" :placeholder="$t('eval_desc.placeholder')" />

          <footer class="rx-foot"><span>{{ $t("ereport.academy") }}</span><span class="rx-page-num" /></footer>
        </section>

        <template v-if="section.type === MILESTONE">
          <!-- One VB-MAPP form page per chosen test, newest first: its tables (a row per level) and its own charts -->
          <section v-for="test in showCharts ? [...section.tests].reverse() : []" :key="'vb-' + test.key"
            v-page="{ key: 'vb-' + test.key, title: 'VB-MAPP · ' + dmy(test.date) }" class="rx-page">
            <header class="rx-head">
              <img :src="$siteLogo(sawaLogo)" alt="Sawa" />
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

          <!-- Report: the newest test's strengths and weaknesses, edited here and saved on the server; each level its own page -->
          <template v-if="showCharts">
          <section v-for="table in reportSummary.length ? reportSummary : [null]" :key="'summary-' + (table?.key ?? 'none')"
            v-page="{ key: 'summary-' + (table?.key ?? 'none'), title: [$t('ereport.page_summary'), table?.title].filter(Boolean).join(' · ') }" class="rx-page"
            :class="{ 'rx-print-hidden': table && !summaryPrintable(table) }" :data-print-note="$t('ereport.page_not_printed')">
            <header class="rx-head">
              <img :src="$siteLogo(sawaLogo)" alt="Sawa" />
              <span>VB-MAPP · <span class="ltr">{{ dmy(section.newest.date) }}</span></span>
            </header>
            <template v-if="table">
              <h3 v-if="table.title" class="rx-summary-level">{{ table.title }}</h3>
              <div v-if="summaryDeleted(table).length" class="rx-deleted rx-screen-only">
                <span><i class="pi pi-eye-slash" aria-hidden="true" /> {{ $t("ereport.deleted_items") }}</span>
                <button v-for="item in summaryDeleted(table)" :key="item.key" type="button" class="rx-restore" :title="$t('ereport.restore')" @click="item.restore()">
                  <i class="pi pi-undo" aria-hidden="true" /> {{ item.label }}
                </button>
              </div>
              <template v-for="kind in ['strengths', 'weaknesses']" :key="kind">
                <template v-if="!isHidden(table, kind)">
                <div class="rx-table-head">
                  <h3 class="rx-summary-level">{{ $t('ereport.' + kind + '_intro') }}</h3>
                  <button type="button" class="rx-plan-control rx-remove-point rx-screen-only" @click="setHidden(table, kind, true)">
                    <i class="pi pi-trash" aria-hidden="true" /> {{ $t("ereport.delete_table") }}
                  </button>
                </div>
                <table class="rx-table rx-summary">
                  <thead>
                    <tr>
                      <th class="rx-sum-num">{{ $t('ereport.number') }}</th>
                      <th>{{ $t('ereport.' + kind) }}</th>
                      <th class="rx-sum-symbol">{{ $t("ereport.target_symbol") }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- A row without points shows on screen only (to add one) and is left out of the print. -->
                    <tr v-for="row in summaryRows(table, kind)" :key="table.rows.indexOf(row)" :class="{ 'rx-screen-only': !row[kind].length }">
                      <td class="rx-sum-num">{{ row[kind].length ? summaryNumber(table, kind, row) : "" }}</td>
                      <td>
                        <ul class="rx-plan-points">
                          <li v-for="point in row[kind]" :key="point.id">
                            <b v-if="pointCode(row, point)" class="rx-point-code ltr">{{ pointCode(row, point) }}</b>
                            <EditableText v-model="point.text" block multiline @update:modelValue="touchSummary()" />
                            <button type="button" class="rx-plan-control rx-remove-point rx-screen-only" :aria-label="$t('ereport.remove_point')" :title="$t('ereport.remove_point')"
                              @click="removeSummaryPoint(row, kind, point)"><i class="pi pi-trash" aria-hidden="true" /></button>
                          </li>
                        </ul>
                        <button type="button" class="rx-plan-control rx-add-point rx-screen-only" @click="addSummaryPoint(row, kind)">
                          <i class="pi pi-plus" aria-hidden="true" /> {{ $t("ereport.add_point") }}
                        </button>
                      </td>
                      <td class="rx-sum-symbol">
                        <b>{{ row.symbol }}</b>
                        <button type="button" class="rx-plan-control rx-remove-point rx-row-delete rx-screen-only" :aria-label="$t('ereport.delete_row')"
                          :title="$t('ereport.delete_row')" @click="setHidden(row, kind, true)"><i class="pi pi-times" aria-hidden="true" /></button>
                      </td>
                    </tr>
                    <tr v-if="!summaryRows(table, kind).some(row => row[kind].length)">
                      <td colspan="3" class="rx-empty">{{ $t("ereport.no_result_data") }}</td>
                    </tr>
                  </tbody>
                </table>
                </template>
              </template>
            </template>
            <p v-else class="rx-empty">{{ $t("ereport.no_result_data") }}</p>
            <footer class="rx-foot"><span>{{ $t("ereport.academy") }}</span><span class="rx-page-num" /></footer>
          </section>
          </template>

          <!-- Plan: the goals only (weaknesses are not shown), edited here and saved on the server; each level its own page -->
          <template v-if="showPlan && plan">
          <section v-for="level in planLevels.length ? planLevels : [null]" :key="'plan-' + (level?.key ?? 'none')"
            v-page="{ key: 'plan-' + (level?.key ?? 'none'), title: [$t('ereport.plan_title'), level?.title].filter(Boolean).join(' · ') }" class="rx-page"
            :class="{ 'rx-print-hidden': level && (level.hidden || !level.groups.length) }" :data-print-note="$t('ereport.page_not_printed')">
            <header class="rx-head">
              <img :src="$siteLogo(sawaLogo)" alt="Sawa" />
              <span>{{ $t("ereport.plan_title") }} · VB-MAPP · <span class="ltr">{{ dmy(section.newest.date) }}</span></span>
            </header>
            <h2 class="rx-band">{{ $t("ereport.plan_title") }}<template v-if="level?.title"> — {{ level.title }}</template></h2>
            <div v-if="level?.deleted.length" class="rx-deleted rx-screen-only">
              <span><i class="pi pi-eye-slash" aria-hidden="true" /> {{ $t("ereport.deleted_items") }}</span>
              <button v-for="item in level.deleted" :key="item.key" type="button" class="rx-restore" :title="$t('ereport.restore')" @click="setPlanHidden(item.key, false)">
                <i class="pi pi-undo" aria-hidden="true" /> {{ item.label }}
              </button>
            </div>
            <p v-if="plan.loading" class="rx-empty">{{ $t("ereport.loading") }}</p>
            <div v-else-if="level && !level.hidden && level.groups.length" class="rx-table-head rx-screen-only">
              <span />
              <button type="button" class="rx-plan-control rx-remove-point" @click="setPlanHidden(`level:${level.key}`, true)">
                <i class="pi pi-trash" aria-hidden="true" /> {{ $t("ereport.delete_table") }}
              </button>
            </div>
            <table v-if="!plan.loading && level && !level.hidden && level.groups.length" class="rx-table rx-summary rx-plan">
              <thead>
                <tr>
                  <th class="rx-sum-num">{{ $t("ereport.number") }}</th>
                  <th>{{ $t("ereport.plan_goal") }}</th>
                  <th class="rx-plan-control-col rx-screen-only" />
                </tr>
              </thead>
              <tbody>
                <template v-for="group in level.groups" :key="group.key">
                  <tr class="rx-plan-group">
                    <th colspan="3">
                      {{ group.domain }}<template v-if="group.symbol"> ({{ group.symbol }})</template><template v-if="group.general_goal"> — {{ group.general_goal }}</template>
                      <button type="button" class="rx-plan-control rx-remove-point rx-row-delete rx-screen-only" :aria-label="$t('ereport.delete_row')"
                        :title="$t('ereport.delete_row')" @click="setPlanHidden(`group:${level.key}|${group.key}`, true)"><i class="pi pi-times" aria-hidden="true" /></button>
                    </th>
                  </tr>
                  <tr v-for="(goal, g) in group.goals" :key="goal.key">
                    <td class="rx-sum-num ltr">{{ goalCode(group, g, goal) }}</td>
                    <td><EditableText v-model="goal.goal" block multiline :placeholder="$t('ereport.plan_goal')" @update:modelValue="touchPlan" /></td>
                    <td class="rx-plan-control-col rx-screen-only">
                      <button type="button" class="rx-plan-control rx-remove-point" :aria-label="$t('ereport.remove_point')" :title="$t('ereport.remove_point')" @click="removePlanGoal(goal)"><i class="pi pi-trash" aria-hidden="true" /></button>
                    </td>
                  </tr>
                  <tr class="rx-screen-only">
                    <td colspan="3"><button type="button" class="rx-plan-control rx-add-point" @click="addPlanGoal(group)"><i class="pi pi-plus" aria-hidden="true" /> {{ $t("ereport.add_point") }}</button></td>
                  </tr>
                </template>
              </tbody>
            </table>
            <p v-else-if="!plan.loading && !level?.deleted.length" class="rx-empty">{{ $t("ereport.no_result_data") }}</p>
            <footer class="rx-foot"><span>{{ $t("ereport.academy") }}</span><span class="rx-page-num" /></footer>
          </section>
          </template>

        </template>

        <!-- Any other type (in the report): barriers with their test tables, then each type's chart -->
        <!-- Side profile: one page with every chosen dimension result -->
        <section v-else-if="showCharts && section.type === SIDE_PROFILE && section.group === firstSideProfile"
          v-page="{ key: 'side-profile', title: 'Side Profile' }" class="rx-page">
          <header class="rx-head">
            <img :src="$siteLogo(sawaLogo)" alt="Sawa" />
            <span>Side Profile</span>
          </header>
          <h2 class="rx-sp-title ltr">Side Profile</h2>
          <p class="rx-sp-child"><b>{{ child.name }}</b><br /><span class="ltr">{{ child.birth_date }}</span></p>
          <SideProfileTable :tests="sideProfileTests" />
          <footer class="rx-foot"><span>{{ $t("ereport.academy") }}</span><span class="rx-page-num" /></footer>
        </section>

        <section v-else-if="showCharts && section.type !== SIDE_PROFILE"
          v-page="{ key: 'type-' + section.group, title: section.label + ' · ' + dmy(section.newest.date) }" class="rx-page">
          <header class="rx-head">
            <img :src="$siteLogo(sawaLogo)" alt="Sawa" />
            <span>{{ section.label }} · <span class="ltr">{{ dmy(section.newest.date) }}</span></span>
          </header>

          <h2 class="rx-band">{{ $t("ereport.results_of", { name: section.label }) }}</h2>
          <p class="rx-intro">{{ $t("ereport.form_intro", { name: child.name, evaluation: section.label }) }}</p>

          <!-- The test tables belong to the VB-MAPP family only (barriers here). -->
          <TestTables v-if="section.type === BARRIER || section.type === TRANSITION" :child="child" :rows="barrierRows(section.tests)" />

          <template v-if="showCharts">
          <BarrierChart v-if="section.type === BARRIER" :tests="section.tests" />
          <!-- Ablls OT / SP: the paper's table of tests (child, assessor, date, color) above the chart. -->
          <template v-else-if="isAbllsFlow(section.type)">
            <AbllsTestsHeader v-if="hasAbllsPoints(section.type)" :variant="section.type === ABLLS_SP ? 'sp' : 'ot'" :tests="section.tests" :child-name="child.name" />
            <AbllsSpChart v-if="section.type === ABLLS_SP" :tests="section.tests" />
            <AbllsFlowChart v-else :tests="section.tests" />
          </template>
          <!-- Carolina: the newest chosen evaluation as the paper form (its rounds' colors in each box). -->
          <CarolinaGrid v-else-if="section.type === CAROLINA" :result="section.newest.result" :per-table="5" compact />
          <TransitionChart v-else-if="section.type === TRANSITION" :tests="section.tests" />

          <!-- M-CHAT-R: each chosen test's risk points and level (oldest first), then what the newest one means. -->
          <template v-if="section.type === MCHAT">
            <table class="rx-table rx-mchat">
              <thead>
                <tr>
                  <th class="rx-sum-num">{{ $t("ereport.number") }}</th>
                  <th>{{ $t("mchat.test_date") }}</th>
                  <th>{{ $t("mchat.child_age") }}</th>
                  <th>{{ $t("mchat.tester") }}</th>
                  <th>{{ $t("mchat.total") }}</th>
                  <th>{{ $t("mchat.risk") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(test, i) in section.tests" :key="test.key">
                  <td class="rx-sum-num">{{ i + 1 }}</td>
                  <td><span class="ltr">{{ dmy(test.date) }}</span></td>
                  <td>{{ (test.result?.child_age ?? test.form?.age_months) == null ? "" : $t("mchat.months", { n: test.result?.child_age ?? test.form.age_months }) }}</td>
                  <td>{{ test.specialist?.name ?? "" }}</td>
                  <td><b class="ltr">{{ test.result?.total ?? "" }} / {{ test.form?.boxes_total ?? 20 }}</b></td>
                  <td><span v-if="test.result?.risk" class="rx-mchat-risk" :class="'is-' + test.result.risk">{{ $t("mchat.risk_" + test.result.risk) }}</span></td>
                </tr>
              </tbody>
            </table>
            <div v-if="section.newest.result?.risk" class="rx-mchat-meaning" :class="'is-' + section.newest.result.risk">
              <h3>{{ $t("mchat.risk_" + section.newest.result.risk) }} — <span class="ltr">{{ section.newest.result.total }} / {{ section.newest.result.questions?.length || 20 }}</span></h3>
              <p>{{ section.newest.result.recommendation }}</p>
            </div>
          </template>

          <!-- QFBA (in the language it was filled in): each chosen test's row, the severity chart (tests side by side),
               then the newest test's functions with the likely one and what it means. -->
          <div v-if="section.type === QFBA" class="rx-qfba" :dir="qfbaLang(section) === 'en' ? 'ltr' : 'rtl'">
            <table class="rx-table rx-mchat">
              <thead>
                <tr>
                  <th class="rx-sum-num">#</th>
                  <th>{{ qt(qfbaLang(section), "test_date") }}</th>
                  <th>{{ qt(qfbaLang(section), "child_age") }}</th>
                  <th>{{ qt(qfbaLang(section), "tester") }}</th>
                  <th>{{ qt(qfbaLang(section), "interviewee") }}</th>
                  <th>{{ qt(qfbaLang(section), "target_behavior") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(test, i) in section.tests" :key="test.key">
                  <td class="rx-sum-num">{{ i + 1 }}</td>
                  <td><span class="ltr">{{ dmy(test.date) }}</span></td>
                  <td>{{ (test.result?.child_age ?? test.form?.age_months) == null ? "" : qt(qfbaLang(section), "months", { n: test.result?.child_age ?? test.form.age_months }) }}</td>
                  <td>{{ test.specialist?.name ?? "" }}</td>
                  <td>{{ test.result?.interviewee ?? "" }}</td>
                  <td><b>{{ test.result?.target_behavior ?? "" }}</b></td>
                </tr>
              </tbody>
            </table>
            <QfbaChart :tests="section.tests" :lang="qfbaLang(section)" :child-name="child.name ?? ''" />
            <QfbaSummary v-if="section.newest.result" :result="section.newest.result" :lang="qfbaLang(section)" />
          </div>

          <!-- Sensory Profile: each chosen test's row (form, who answered, every quadrant's level), then the newest test's
               quadrants against its age's cut scores and what each means. -->
          <div v-if="section.type === SENSORY && section.newest.result?.form" class="rx-sensory">
            <table class="rx-table rx-mchat">
              <thead>
                <tr>
                  <th class="rx-sum-num">#</th>
                  <th>{{ $t("sensory.test_date") }}</th>
                  <th>{{ $t("sensory.child_age") }}</th>
                  <th>{{ $t("sensory.form") }}</th>
                  <th>{{ $t("sensory.tester") }}</th>
                  <th>{{ $t("sensory.respondent") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(test, i) in section.tests" :key="test.key">
                  <td class="rx-sum-num">{{ i + 1 }}</td>
                  <td><span class="ltr">{{ dmy(test.date) }}</span></td>
                  <td>{{ sensoryAge(test.result?.child_age, $t) }}</td>
                  <td>{{ sensoryFormName(test.result?.form, sensoryLang) }}</td>
                  <td>{{ test.specialist?.name ?? "" }}</td>
                  <td>{{ test.result?.info?.respondent ?? "" }}</td>
                </tr>
              </tbody>
            </table>
            <SensoryGrid :scores="(section.newest.result.scores ?? []).filter((s) => s.kind === 'quadrant' || s.kind === 'threshold')"
              :level-keys="section.newest.result.form.level_keys" :level-labels="section.newest.result.level_labels" :lang="sensoryLang"
              :title="$t('sensory.quadrant')" numbered />
            <SensorySummary :result="section.newest.result" :lang="sensoryLang" />
          </div>

          <!-- ELM: «مجموع النتائج» with every chosen test's X in its color, then the newest test's other answers. -->
          <div v-if="section.type === ELM" class="rx-elm">
            <ElmChart :tests="section.tests" />
            <ElmSummary v-if="section.newest.result" :result="section.newest.result" />
          </div>

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

        <!-- Ablls OT / SP: after the flow chart, the newest test's strengths (answer 3 or 4) then weaknesses (0, 1, 2), as VB-MAPP's:
             edited here and saved on the server; a row or a table can be deleted and restored. -->
        <template v-if="showCharts && hasPoints(section.type) && abllsSummaries[section.group]">
          <section v-for="table in abllsSummaries[section.group].tables.length ? abllsSummaries[section.group].tables : [null]" :key="'ablls-summary-' + section.group + (table?.key ?? 'none')"
            v-page="{ key: 'ablls-summary-' + section.group, title: [$t('ereport.page_summary'), section.label].join(' · ') }" class="rx-page"
            :class="{ 'rx-print-hidden': !table || !summaryPrintable(table) }" :data-print-note="$t('ereport.page_not_printed')">
            <header class="rx-head">
              <img :src="$siteLogo(sawaLogo)" alt="Sawa" />
              <span>{{ section.label }} · <span class="ltr">{{ dmy(section.newest.date) }}</span></span>
            </header>
            <template v-if="table">
              <h2 class="rx-band">{{ $t("ereport.page_summary") }}</h2>
              <div v-if="summaryDeleted(table, abllsSummaries[section.group]).length" class="rx-deleted rx-screen-only">
                <span><i class="pi pi-eye-slash" aria-hidden="true" /> {{ $t("ereport.deleted_items") }}</span>
                <button v-for="item in summaryDeleted(table, abllsSummaries[section.group])" :key="item.key" type="button" class="rx-restore" :title="$t('ereport.restore')" @click="item.restore()">
                  <i class="pi pi-undo" aria-hidden="true" /> {{ item.label }}
                </button>
              </div>
              <template v-for="kind in pointKinds(section)" :key="kind">
                <template v-if="!isHidden(table, kind)">
                <div class="rx-table-head">
                  <h3 class="rx-summary-level">{{ $t('ereport.' + kind + '_intro') }}</h3>
                  <button type="button" class="rx-plan-control rx-remove-point rx-screen-only" @click="setHidden(table, kind, true, abllsSummaries[section.group])">
                    <i class="pi pi-trash" aria-hidden="true" /> {{ $t("ereport.delete_table") }}
                  </button>
                </div>
                <table class="rx-table rx-summary">
                  <thead>
                    <tr>
                      <th class="rx-sum-num">{{ $t('ereport.number') }}</th>
                      <th>{{ $t('ereport.' + kind) }}</th>
                      <th class="rx-sum-symbol">{{ $t("ereport.target_symbol") }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in summaryRows(table, kind)" :key="table.rows.indexOf(row)" :class="{ 'rx-screen-only': !row[kind].length }">
                      <td class="rx-sum-num">{{ row[kind].length ? summaryNumber(table, kind, row) : "" }}</td>
                      <td>
                        <ul class="rx-plan-points">
                          <li v-for="point in row[kind]" :key="point.id">
                            <b v-if="sectionPointCode(section, row, point)" class="rx-point-code ltr">{{ sectionPointCode(section, row, point) }}</b>
                            <EditableText v-model="point.text" block multiline @update:modelValue="touchSummary(abllsSummaries[section.group])" />
                            <button type="button" class="rx-plan-control rx-remove-point rx-screen-only" :aria-label="$t('ereport.remove_point')" :title="$t('ereport.remove_point')"
                              @click="removeSummaryPoint(row, kind, point, abllsSummaries[section.group])"><i class="pi pi-trash" aria-hidden="true" /></button>
                          </li>
                        </ul>
                        <button type="button" class="rx-plan-control rx-add-point rx-screen-only" @click="addSummaryPoint(row, kind, abllsSummaries[section.group])">
                          <i class="pi pi-plus" aria-hidden="true" /> {{ $t("ereport.add_point") }}
                        </button>
                      </td>
                      <td class="rx-sum-symbol">
                        <b>{{ row.symbol }}</b>
                        <small v-if="pointRowTitle(section, row.symbol)" class="rx-sum-domain">{{ pointRowTitle(section, row.symbol) }}</small>
                        <button type="button" class="rx-plan-control rx-remove-point rx-row-delete rx-screen-only" :aria-label="$t('ereport.delete_row')"
                          :title="$t('ereport.delete_row')" @click="setHidden(row, kind, true, abllsSummaries[section.group])"><i class="pi pi-times" aria-hidden="true" /></button>
                      </td>
                    </tr>
                    <tr v-if="!summaryRows(table, kind).some(row => row[kind].length)">
                      <td colspan="3" class="rx-empty">{{ $t("ereport.no_result_data") }}</td>
                    </tr>
                  </tbody>
                </table>
                </template>
              </template>
            </template>
            <p v-else class="rx-empty">{{ abllsSummaries[section.group].loading ? "…" : $t("ereport.no_result_data") }}</p>
            <footer class="rx-foot"><span>{{ $t("ereport.academy") }}</span><span class="rx-page-num" /></footer>
          </section>
        </template>

        <!-- M-CHAT-R: the 20 answers of every chosen test side by side (oldest first); a risk point is marked. -->
        <section v-if="showCharts && section.type === MCHAT"
          v-page="{ key: 'mchat-' + section.group, title: $t('mchat.answers') + ' · ' + section.label }" class="rx-page">
          <header class="rx-head">
            <img :src="$siteLogo(sawaLogo)" alt="Sawa" />
            <span>{{ section.label }} · <span class="ltr">{{ dmy(section.newest.date) }}</span></span>
          </header>

          <h2 class="rx-band">{{ $t("mchat.answers") }}</h2>
          <table class="rx-table rx-mchat rx-mchat-answers">
            <thead>
              <tr>
                <th class="rx-sum-num">#</th>
                <th>{{ $t("mchat.question") }}</th>
                <th v-for="test in section.tests" :key="test.key" class="rx-mchat-col"><span class="ltr">{{ dmy(test.date) }}</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="question in section.newest.result?.questions ?? []" :key="question.id">
                <td class="rx-sum-num">{{ question.number }}</td>
                <td>{{ question.text }}</td>
                <td v-for="test in section.tests" :key="test.key" class="rx-mchat-col"
                  :class="{ 'is-point': mchatAnswer(test, question.id)?.point === 1 }">
                  {{ mchatAnswer(test, question.id)?.yes == null ? "" : mchatAnswer(test, question.id).yes ? $t("mchat.yes") : $t("mchat.no") }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th colspan="2">{{ $t("mchat.total") }}</th>
                <th v-for="test in section.tests" :key="test.key" class="rx-mchat-col">{{ test.result?.total ?? "" }}</th>
              </tr>
            </tfoot>
          </table>
          <p class="rx-mchat-hint">{{ $t("mchat.points_hint") }}</p>

          <footer class="rx-foot"><span>{{ $t("ereport.academy") }}</span><span class="rx-page-num" /></footer>
        </section>

        <!-- Sensory Profile: the newest chosen test's sections (and factors on the 3–10 years form) against its age's cut scores. -->
        <section v-if="showCharts && section.type === SENSORY && section.newest.result?.form"
          v-page="{ key: 'sensory-' + section.group, title: $t('sensory.section_summary') + ' · ' + section.label }" class="rx-page">
          <header class="rx-head">
            <img :src="$siteLogo(sawaLogo)" alt="Sawa" />
            <span>{{ section.label }} · <span class="ltr">{{ dmy(section.newest.date) }}</span></span>
          </header>

          <h2 class="rx-band">{{ $t("sensory.section_summary") }}</h2>
          <SensoryGrid :scores="(section.newest.result.scores ?? []).filter((s) => s.kind === 'section')" :level-keys="section.newest.result.form.level_keys"
            :level-labels="section.newest.result.level_labels" :lang="sensoryLang" :title="$t('sensory.section')" />
          <template v-if="(section.newest.result.scores ?? []).some((s) => s.kind === 'factor')">
            <h2 class="rx-band rx-band-soft rx-space">{{ $t("sensory.factor_summary") }}</h2>
            <SensoryGrid :scores="section.newest.result.scores.filter((s) => s.kind === 'factor')" :level-keys="section.newest.result.form.level_keys"
              :level-labels="section.newest.result.level_labels" :lang="sensoryLang" :title="$t('sensory.factor')" />
          </template>
          <p class="rx-mchat-hint">{{ $t("sensory.score_hint") }}</p>

          <footer class="rx-foot"><span>{{ $t("ereport.academy") }}</span><span class="rx-page-num" /></footer>
        </section>

        <!-- QFBA: every answer of each chosen test side by side (oldest first); an endorsed answer is marked. -->
        <section v-if="showCharts && section.type === QFBA"
          v-page="{ key: 'qfba-' + section.group, title: qt(qfbaLang(section), 'answers') + ' · ' + section.label }" class="rx-page">
          <header class="rx-head">
            <img :src="$siteLogo(sawaLogo)" alt="Sawa" />
            <span>{{ section.label }} · <span class="ltr">{{ dmy(section.newest.date) }}</span></span>
          </header>

          <h2 class="rx-band">{{ qt(qfbaLang(section), "answers") }}</h2>
          <table class="rx-table rx-mchat rx-mchat-answers rx-qfba-answers" :dir="qfbaLang(section) === 'en' ? 'ltr' : 'rtl'">
            <thead>
              <tr>
                <th class="rx-sum-num">#</th>
                <th>{{ qt(qfbaLang(section), "question") }}</th>
                <th>{{ qt(qfbaLang(section), "function") }}</th>
                <th v-for="test in section.tests" :key="test.key" class="rx-mchat-col"><span class="ltr">{{ dmy(test.date) }}</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="question in section.newest.result?.questions ?? []" :key="question.id">
                <td class="rx-sum-num">{{ question.number }}</td>
                <td>{{ questionText(question, qfbaLang(section)) }}</td>
                <td class="rx-qfba-fn" :style="{ color: functionColor(qfbaFunction(section, question.function_id)?.key) }">
                  {{ functionName(qfbaFunction(section, question.function_id), qfbaLang(section)) }}
                </td>
                <td v-for="test in section.tests" :key="test.key" class="rx-mchat-col"
                  :class="{ 'is-endorsed': qfbaAnswer(test, question.id)?.value > 0 }">
                  <template v-if="qfbaAnswer(test, question.id)?.value === null">{{ qfbaAnswer(test, question.id)?.answered ? qt(qfbaLang(section), "na") : "" }}</template>
                  <template v-else-if="qfbaAnswer(test, question.id)">{{ qfbaAnswer(test, question.id).value }}</template>
                </td>
              </tr>
            </tbody>
          </table>
          <p class="rx-mchat-hint" :dir="qfbaLang(section) === 'en' ? 'ltr' : 'rtl'">
            {{ qt(qfbaLang(section), "scale") }}:
            <span v-for="option in section.newest.result?.options ?? []" :key="option.value"> <span class="ltr">{{ option.value }}</span> = {{ optionLabel(option, qfbaLang(section)) }} ·</span>
            {{ qt(qfbaLang(section), "na") }}
          </p>

          <footer class="rx-foot"><span>{{ $t("ereport.academy") }}</span><span class="rx-page-num" /></footer>
        </section>

        <!-- QFBA plan (in the form's language): goals for each endorsed function, edited here and saved on the server. -->
        <section v-if="showPlan && qfbaPlan && section.type === QFBA && section.group === qfbaSection?.group"
          v-page="{ key: 'qfba-plan', title: qt(qfbaPlan.lang, 'plan_title') + ' · QFBA' }" class="rx-page"
          :class="{ 'rx-print-hidden': !qfbaPlan.loading && !qfbaPlanGroups.some((group) => group.goals.length) }" :data-print-note="$t('ereport.page_not_printed')">
          <header class="rx-head">
            <img :src="$siteLogo(sawaLogo)" alt="Sawa" />
            <span>{{ qt(qfbaPlan.lang, "plan_title") }} · QFBA · <span class="ltr">{{ dmy(section.newest.date) }}</span></span>
          </header>
          <h2 class="rx-band">{{ qt(qfbaPlan.lang, "plan_title") }}<template v-if="section.newest.result?.target_behavior"> — {{ section.newest.result.target_behavior }}</template></h2>
          <div :dir="qfbaPlan.lang === 'en' ? 'ltr' : 'rtl'">
            <div v-if="qfbaPlanDeleted.length" class="rx-deleted rx-screen-only">
              <span><i class="pi pi-eye-slash" aria-hidden="true" /> {{ $t("ereport.deleted_items") }}</span>
              <button v-for="group in qfbaPlanDeleted" :key="group.key" type="button" class="rx-restore" :title="$t('ereport.restore')" @click="setQfbaGroupHidden(group, false)">
                <i class="pi pi-undo" aria-hidden="true" /> {{ group.title }} ({{ group.key }})
              </button>
            </div>
            <p v-if="qfbaPlan.loading" class="rx-empty">{{ $t("ereport.loading") }}</p>
            <template v-else>
              <p class="rx-case-hint rx-screen-only"><i class="pi pi-info-circle" aria-hidden="true" /> {{ qt(qfbaPlan.lang, "plan_hint") }}</p>
              <table v-if="qfbaPlanGroups.length" class="rx-table rx-summary rx-plan">
                <thead>
                  <tr>
                    <th class="rx-sum-num">#</th>
                    <th>{{ qt(qfbaPlan.lang, "plan_goal") }}</th>
                    <th class="rx-plan-control-col rx-screen-only" />
                  </tr>
                </thead>
                <tbody>
                  <template v-for="group in qfbaPlanGroups" :key="group.key">
                    <tr class="rx-plan-group">
                      <th colspan="3">
                        {{ qt(qfbaPlan.lang, "function") }}: {{ group.title }} <span class="ltr">({{ group.key }})</span>
                        <template v-if="group.score"> · {{ qt(qfbaPlan.lang, "endorsed") }} <span class="ltr">{{ group.score.endorsed }}/{{ group.score.questions }}</span>
                          · {{ qt(qfbaPlan.lang, "severity") }} <span class="ltr">{{ group.score.severity }}/{{ group.score.max_severity }}</span></template>
                        <button type="button" class="rx-plan-control rx-remove-point rx-row-delete rx-screen-only" :aria-label="$t('ereport.delete_row')"
                          :title="$t('ereport.delete_row')" @click="setQfbaGroupHidden(group, true)"><i class="pi pi-times" aria-hidden="true" /></button>
                      </th>
                    </tr>
                    <tr v-for="(goal, g) in group.goals" :key="goal.key">
                      <td class="rx-sum-num ltr" style="white-space: nowrap">{{ group.key }}-{{ g + 1 }}</td>
                      <td><EditableText v-model="goal.goal" block multiline :placeholder="qt(qfbaPlan.lang, 'plan_goal')" @update:modelValue="touchQfbaPlan" /></td>
                      <td class="rx-plan-control-col rx-screen-only">
                        <button type="button" class="rx-plan-control rx-remove-point" :aria-label="$t('ereport.remove_point')" :title="$t('ereport.remove_point')" @click="removeQfbaGoal(goal)"><i class="pi pi-trash" aria-hidden="true" /></button>
                      </td>
                    </tr>
                    <tr class="rx-screen-only">
                      <td colspan="3"><button type="button" class="rx-plan-control rx-add-point" @click="addQfbaGoal(group)"><i class="pi pi-plus" aria-hidden="true" /> {{ $t("ereport.add_point") }}</button></td>
                    </tr>
                  </template>
                </tbody>
              </table>
              <p v-else-if="!qfbaPlanDeleted.length" class="rx-empty">{{ qt(qfbaPlan.lang, "plan_empty") }}</p>
            </template>
          </div>
          <footer class="rx-foot"><span>{{ $t("ereport.academy") }}</span><span class="rx-page-num" /></footer>
        </section>

        <!-- Ablls OT plan, as the centre's paper: the flow chart, the opening sentence (editable), then per type its weak skills'
             long-term goals and their sub goals not reached yet (objectives), edited here and saved on the server. -->
        <section v-if="showPlan && otPlan && section.type === ABLLS_SKILLS && section.group === otSection?.group"
          v-page="{ key: 'ot-plan', title: $t('ereport.plan_title') + ' · ' + section.label }" class="rx-page"
          :class="{ 'rx-print-hidden': !otPlan.loading && !otPlanDomains.length }" :data-print-note="$t('ereport.page_not_printed')">
          <header class="rx-head">
            <img :src="$siteLogo(sawaLogo)" alt="Sawa" />
            <span>{{ $t("ereport.plan_title") }} · {{ section.label }} · <span class="ltr">{{ dmy(section.newest.date) }}</span></span>
          </header>
          <h2 class="rx-band">{{ $t("ereport.plan_title") }} · {{ section.label }}</h2>
          <h3 class="rx-ot-flow ltr">FLOW CHART:</h3>
          <AbllsTestsHeader variant="ot" :tests="section.tests" :child-name="child.name" />
          <AbllsFlowChart :tests="section.tests" />

          <div v-if="otPlanDeleted.length" class="rx-deleted rx-screen-only">
            <span><i class="pi pi-eye-slash" aria-hidden="true" /> {{ $t("ereport.deleted_items") }}</span>
            <button v-for="skill in otPlanDeleted" :key="skill.key" type="button" class="rx-restore" :title="$t('ereport.restore')" @click="setOtSkillHidden(skill, false)">
              <i class="pi pi-undo" aria-hidden="true" /> {{ skill.symbol }}
            </button>
          </div>
          <p v-if="otPlan.loading" class="rx-empty">{{ $t("ereport.loading") }}</p>
          <template v-else-if="otPlanDomains.length">
            <div class="rx-ot-intro"><EditableText :model-value="otIntro" block multiline @update:modelValue="setOtIntro" /></div>
            <div v-for="domain in otPlanDomains" :key="domain.key" class="rx-ot-domain">
              <h4 class="rx-ot-domain-title">{{ $t("ereport.ot_plan_domain", { type: domain.title }) }}</h4>
              <div v-for="skill in domain.skills" :key="skill.key" class="rx-ot-skill">
                <div class="rx-ot-ltg">
                  <span class="rx-ot-bullet" aria-hidden="true">•</span>
                  <b class="ltr">{{ skill.symbol }}:</b>
                  <EditableText :model-value="skill.goals[0]?.general_goal ?? ''" block multiline :placeholder="$t('ablls_ui.long_term_goal')"
                    @update:modelValue="setOtGeneralGoal(skill, $event)" />
                  <button type="button" class="rx-plan-control rx-remove-point rx-screen-only" :aria-label="$t('ereport.delete_row')" :title="$t('ereport.delete_row')"
                    @click="setOtSkillHidden(skill, true)"><i class="pi pi-times" aria-hidden="true" /></button>
                </div>
                <p class="rx-ot-objectives ltr">(objectives):</p>
                <ul class="rx-ot-goals">
                  <li v-for="goal in skill.goals" :key="goal.key">
                    <b class="ltr">{{ skill.symbol }}-{{ goal.number ?? skill.goals.indexOf(goal) + 1 }}:</b>
                    <EditableText v-model="goal.goal" block multiline :placeholder="$t('ablls_ui.sub_goals')" @update:modelValue="touchOtPlan()" />
                    <button type="button" class="rx-plan-control rx-remove-point rx-screen-only" :aria-label="$t('ereport.remove_point')" :title="$t('ereport.remove_point')"
                      @click="removeOtGoal(skill, goal)"><i class="pi pi-trash" aria-hidden="true" /></button>
                  </li>
                </ul>
                <button type="button" class="rx-plan-control rx-add-point rx-screen-only" @click="addOtGoal(skill)">
                  <i class="pi pi-plus" aria-hidden="true" /> {{ $t("ereport.add_point") }}
                </button>
              </div>
            </div>
          </template>
          <p v-else-if="!otPlanDeleted.length" class="rx-empty">{{ $t("ereport.ot_plan_empty") }}</p>
          <footer class="rx-foot"><span>{{ $t("ereport.academy") }}</span><span class="rx-page-num" /></footer>
        </section>

        <!-- Carolina plan: per domain its general goals' sentences and their skills answered - or +- (plan goals), edited here
             and saved on the server. -->
        <section v-if="showPlan && carolinaPlan && section.type === CAROLINA && section.group === carolinaSection?.group"
          v-page="{ key: 'carolina-plan', title: $t('ereport.plan_title') + ' · ' + section.label }" class="rx-page"
          :class="{ 'rx-print-hidden': !carolinaPlan.loading && !carolinaPlanDomains.length }" :data-print-note="$t('ereport.page_not_printed')">
          <header class="rx-head">
            <img :src="$siteLogo(sawaLogo)" alt="Sawa" />
            <span>{{ $t("ereport.plan_title") }} · {{ section.label }} · <span class="ltr">{{ dmy(section.newest.date) }}</span></span>
          </header>
          <h2 class="rx-band">{{ $t("ereport.plan_title") }} · {{ section.label }}</h2>
          <div v-if="carolinaPlanDeleted.length" class="rx-deleted rx-screen-only">
            <span><i class="pi pi-eye-slash" aria-hidden="true" /> {{ $t("ereport.deleted_items") }}</span>
            <button v-for="group in carolinaPlanDeleted" :key="group.key" type="button" class="rx-restore" :title="$t('ereport.restore')" @click="setCarolinaGroupHidden(group, false)">
              <i class="pi pi-undo" aria-hidden="true" /> {{ group.code || group.domain }}
            </button>
          </div>
          <p v-if="carolinaPlan.loading" class="rx-empty">{{ $t("ereport.loading") }}</p>
          <template v-else-if="carolinaPlanDomains.length">
            <div v-for="domain in carolinaPlanDomains" :key="domain.key" class="rx-ot-domain">
              <h4 class="rx-ot-domain-title">• {{ $t("ereport.carolina_plan_domain", { domain: domain.title }) }}</h4>
              <div v-for="group in domain.groups" :key="group.key" class="rx-ot-skill">
                <div class="rx-ot-ltg">
                  <b class="ltr">{{ group.code }} :</b>
                  <span />
                  <EditableText :model-value="group.goals[0]?.general_goal ?? ''" block multiline @update:modelValue="setCarolinaSentence(group, $event)" />
                  <button type="button" class="rx-plan-control rx-remove-point rx-screen-only" :aria-label="$t('ereport.delete_row')" :title="$t('ereport.delete_row')"
                    @click="setCarolinaGroupHidden(group, true)"><i class="pi pi-times" aria-hidden="true" /></button>
                </div>
                <p class="rx-ot-objectives ltr">(objectives):</p>
                <ul class="rx-ot-goals">
                  <li v-for="goal in group.goals" :key="goal.key">
                    <b class="ltr">{{ goal.symbol || "ADD" }}:</b>
                    <EditableText v-model="goal.goal" block multiline :placeholder="$t('ereport.plan_title')" @update:modelValue="touchCarolinaPlan()" />
                    <button type="button" class="rx-plan-control rx-remove-point rx-screen-only" :aria-label="$t('ereport.remove_point')" :title="$t('ereport.remove_point')"
                      @click="removeCarolinaGoal(group, goal)"><i class="pi pi-trash" aria-hidden="true" /></button>
                  </li>
                </ul>
                <button type="button" class="rx-plan-control rx-add-point rx-screen-only" @click="addCarolinaGoal(group)">
                  <i class="pi pi-plus" aria-hidden="true" /> {{ $t("ereport.add_point") }}
                </button>
              </div>
            </div>
          </template>
          <p v-else-if="!carolinaPlanDeleted.length" class="rx-empty">{{ $t("ereport.carolina_plan_empty") }}</p>
          <footer class="rx-foot"><span>{{ $t("ereport.academy") }}</span><span class="rx-page-num" /></footer>
        </section>

        <!-- Transition: what each answer of the newest chosen test means. -->
        <section v-if="showCharts && section.type === TRANSITION && edits.transitionPoints?.[section.group]"
          v-page="{ key: 'points-' + section.group, title: $t('ereport.transition_points') + ' · ' + section.label }" class="rx-page"
          :class="{ 'rx-print-hidden': !edits.transitionPoints[section.group].some((point) => String(point).trim()) }" :data-print-note="$t('ereport.page_not_printed')">
          <header class="rx-head">
            <img :src="$siteLogo(sawaLogo)" alt="Sawa" />
            <span>{{ section.label }} · <span class="ltr">{{ dmy(section.newest.date) }}</span></span>
          </header>

          <h2 class="rx-band">{{ $t("ereport.transition_points") }}</h2>
          <ul class="rx-plan-points rx-transition-points">
            <li v-for="(point, p) in edits.transitionPoints[section.group]" :key="p">
              <EditableText v-model="edits.transitionPoints[section.group][p]" block multiline />
              <button type="button" class="rx-plan-control rx-remove-point" :aria-label="$t('ereport.remove_point')" :title="$t('ereport.remove_point')"
                @click="edits.transitionPoints[section.group].splice(p, 1)"><i class="pi pi-trash" aria-hidden="true" /></button>
            </li>
          </ul>
          <button type="button" class="rx-plan-control rx-add-point" @click="edits.transitionPoints[section.group].push('')">
            <i class="pi pi-plus" aria-hidden="true" /> {{ $t("ereport.add_point") }}
          </button>

          <footer class="rx-foot"><span>{{ $t("ereport.academy") }}</span><span class="rx-page-num" /></footer>
        </section>
      </template>

      <!-- Tracking: the saved plans' goals (VB-MAPP and QFBA), one table per general goal as on the centre's form -->
      <template v-if="showTracking && tracking">
      <section v-for="item in tracking.plans.length ? tracking.plans : [null]" :key="'track-' + (item?.evaluation_id ?? 'none')"
        v-page="{ key: 'track-' + (item?.evaluation_id ?? 'none'), title: [$t('ereport.tracking_title'), item ? dmy(item.evaluation_date) : ''].filter(Boolean).join(' · ') }" class="rx-page"
        :class="{ 'rx-print-hidden': item && !item.goals.some(isTracked) }" :data-print-note="$t('ereport.page_not_printed')">
        <header class="rx-head">
          <img :src="$siteLogo(sawaLogo)" alt="Sawa" />
          <span>{{ $t("ereport.tracking_title") }}<template v-if="item"> · {{ planTypeLabel(item) }} · <span class="ltr">{{ dmy(item.evaluation_date) }}</span></template></span>
        </header>
        <h2 class="rx-band">{{ $t("ereport.tracking_title") }}</h2>
        <p v-if="tracking.loading" class="rx-empty">{{ $t("ereport.loading") }}</p>
        <p v-else-if="!item" class="rx-empty">{{ $t("ereport.tracking_no_plan") }}</p>
        <template v-else>
          <p class="rx-case-hint rx-screen-only"><i class="pi pi-info-circle" aria-hidden="true" /> {{ $t("ereport.tracking_hint") }}</p>
          <p v-if="tracking.request?.status === 'rejected'" class="rx-track-state is-rejected rx-screen-only">
            <i class="pi pi-times-circle" aria-hidden="true" /> {{ $t("ereport.tracking_rejected_note", { note: tracking.request.note || "—" }) }}
          </p>
          <p v-else-if="tracking.request?.status === 'pending'" class="rx-track-state is-pending rx-screen-only">
            <i class="pi pi-clock" aria-hidden="true" /> {{ $t("ereport.tracking_pending_note", { date: tracking.request.requested_at }) }}
          </p>
          <p v-else-if="trackingApproved" class="rx-track-state is-approved rx-screen-only">
            <i class="pi pi-lock" aria-hidden="true" /> {{ $t("ereport.tracking_approved_note", { date: tracking.request.decided_at, name: tracking.request.approver || "" }) }}
          </p>
          <table v-for="group in trackingGroups(item)" :key="group.key" class="rx-table rx-track"
            :class="{ 'rx-print-hidden': !group.goals.some(isTracked) }">
            <thead>
              <tr class="rx-track-domain"><th :colspan="TRACKING_COLUMNS.length + 2">{{ group.domain }} <span v-if="group.domain_symbol" class="ltr">{{ group.domain_symbol }}</span></th></tr>
              <tr class="rx-track-goal"><th :colspan="TRACKING_COLUMNS.length + 2">{{ $t("ereport.tracking_goal") }}: {{ group.general_goal }}<span v-if="group.symbol" class="rx-track-symbol ltr">{{ group.symbol }}</span></th></tr>
              <tr class="rx-track-cols">
                <th class="rx-track-num">{{ $t("ereport.number") }}</th>
                <th>{{ $t("ereport.tracking_short_goals") }}</th>
                <th v-for="column in TRACKING_COLUMNS" :key="column.key" :class="`rx-track-col is-${column.key}`">
                  {{ $t(column.title) }}<span class="rx-track-code ltr">{{ column.code }}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(goal, g) in group.goals" :key="goal.id" :class="{ 'rx-print-hidden': !isTracked(goal), 'is-off': !isTracked(goal) }">
                <td class="rx-track-num ltr"><b>{{ goal.code || goalCode(group, g, goal) }}</b></td>
                <td>
                  {{ goal.goal || goal.weakness }}
                  <span class="rx-track-controls rx-screen-only">
                    <label><input type="checkbox" :checked="isTracked(goal)" :disabled="trackingApproved" @change="toggleTracked(goal, $event.target.checked)" /> {{ $t("ereport.tracking_print") }}</label>
                  </span>
                </td>
                <!-- the date columns: pickers; MT and GEN: free text, a session's value shown (locked); an approved tracking: all locked. -->
                <td v-for="column in TRACKING_COLUMNS" :key="column.key" :class="['rx-track-col', `is-${column.key}`,
                  { 'is-session': column.key === 'gen' ? sessionFilled(goal, 'gen') : sessionFilled(goal, `${column.key}_start`) }]">
                  <TrackingDates v-if="column.dates" :start="tracking.cells[goal.id][`${column.key}_start`]" :end="tracking.cells[goal.id][`${column.key}_end`]"
                    :editable="!trackingApproved && !goal.locked" @change="(end, value) => (tracking.cells[goal.id][`${column.key}_${end}`] = value)" />
                  <template v-else-if="column.key === 'gen'">
                    <span v-if="cellLocked(goal, 'gen')" class="rx-track-locked" :title="sessionFilled(goal, 'gen') ? $t('ereport.tracking_from_session') : undefined">{{ cellText(goal, "gen") }}</span>
                    <EditableText v-else v-model="tracking.cells[goal.id].gen" block />
                  </template>
                  <div v-else class="rx-track-mt">
                    <div v-for="end in ['start', 'end']" :key="end" :class="`is-${end}`">
                      <small>{{ $t(`ereport.trial_${end}`) }}</small>
                      <span v-if="cellLocked(goal, `mt_${end}`)" class="rx-track-locked ltr" :title="sessionFilled(goal, `mt_${end}`) ? $t('ereport.tracking_from_session') : undefined">{{ showDate(cellText(goal, `mt_${end}`)) || "—" }}</span>
                      <EditableText v-else v-model="tracking.cells[goal.id][`mt_${end}`]" block />
                    </div>
                  </div>
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
/* a point's code (M-3) before its text */
.rx-point-code { flex: none; min-width: 2.6em; color: rgb(var(--bp-135c65)); font-weight: 800; white-space: nowrap; }
@media print { .rx-point-code { margin-inline-end: .35em; } }
.rx-plan-points :deep(.rx-edit) { flex: 1; }
.rx-plan-control { border: 0; border-radius: 5px; padding: .3rem .5rem; cursor: pointer; font: inherit; font-size: 9pt; }
.rx-remove-point { color: #b91c1c; background: #fef2f2; flex: none; }
.rx-add-point { color: var(--sawa-primary); background: #edf7f5; margin-top: .4rem; }
/* screen-only controls and the parts left out of the print */
.rx-sp-title { margin: 4mm 0 2mm; text-align: center; font-size: 22pt; font-weight: 700; color: #334155; }
.rx-sp-child { margin: 0 0 5mm; text-align: start; font-size: 12pt; line-height: 1.8; }
.rx-barrier-answers { margin-top: 6mm; font-size: 9pt; }
/* M-CHAT-R: the tests table, the newest test's meaning, and the answers page (20 rows on one sheet). */
.rx-mchat th, .rx-mchat td { text-align: center; }
.rx-mchat-risk { padding: 1px 8px; border-radius: 999px; font-weight: 800; }
.rx-mchat-risk.is-low, .rx-mchat-meaning.is-low { --tone: #15803d; --tone-soft: #dcfce7; }
.rx-mchat-risk.is-medium, .rx-mchat-meaning.is-medium { --tone: #b45309; --tone-soft: #fef3c7; }
.rx-mchat-risk.is-high, .rx-mchat-meaning.is-high { --tone: #b91c1c; --tone-soft: #fee2e2; }
.rx-mchat-risk { background: var(--tone-soft); color: var(--tone); }
.rx-mchat-meaning { margin-top: 6mm; padding: 10px 14px; border-inline-start: 5px solid var(--tone); border-radius: 8px; background: var(--tone-soft); }
.rx-mchat-meaning h3 { margin: 0 0 4px; color: var(--tone); font-size: 12pt; font-weight: 800; }
.rx-mchat-meaning p { margin: 0; line-height: 1.8; }
.rx-mchat-answers { font-size: 9pt; line-height: 1.45; }
.rx-mchat-answers th, .rx-mchat-answers td { padding: 4px 6px; }
.rx-mchat-answers td:nth-child(2) { text-align: start; }
.rx-mchat-col { width: 15mm; }
.rx-qfba { display: grid; gap: 5mm; text-align: start; }
.rx-qfba-answers td:nth-child(2) { text-align: start; }
.rx-qfba-fn { font-size: 8pt; font-weight: 700; }
.rx-qfba-answers td.is-endorsed { background: #fef3c7; font-weight: 800; }
.rx-mchat-answers td.is-point { background: #fee2e2; color: #b91c1c; font-weight: 800; }
.rx-mchat-answers tfoot th { background: rgb(var(--bp-eef8f9)); color: rgb(var(--bp-0e464d)); }
.rx-mchat-hint { margin: 3mm 0 0; color: #64748b; font-size: 8.5pt; }
.rx-barrier-answers td { vertical-align: top; }
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
.rx-about { font-size: 12pt; line-height: 1.9; text-align: justify; }
@media screen { .rx-summary .rx-plan-points li::before { content: "•"; flex: none; line-height: 1.6; } }
.rx-plan-points.is-static { list-style: disc; padding-inline-start: 1.1em; }
.rx-plan-points.is-static li { display: list-item; }
.rx-plan-group th { background: #edf7f5; text-align: start; font-weight: 800; }
.rx-plan-control-col { width: 2.5rem; text-align: center; }
/* Deleting a row / table and the list of what was deleted (screen only). */
.rx-table-head { display: flex; align-items: center; justify-content: space-between; gap: .5rem; }
.rx-row-delete { margin-inline-start: .35rem; padding: .1rem .3rem; font-size: 8pt; vertical-align: middle; }
.rx-deleted { display: flex; flex-wrap: wrap; align-items: center; gap: .35rem; margin: 0 0 .6rem; padding: .45rem .6rem; border: 1px dashed #f59e0b; border-radius: 8px; background: #fffbeb; color: #92400e; font-size: 9pt; }
.rx-restore { display: inline-flex; align-items: center; gap: .3rem; padding: .2rem .5rem; border: 1px solid #fcd34d; border-radius: 999px; background: #fff; color: #92400e; font: inherit; cursor: pointer; }
.rx-restore:hover { background: #fef3c7; }
.rx-track { margin-bottom: 6mm; font-size: 8.5pt; break-inside: avoid; page-break-inside: avoid; }
.rx-track th, .rx-track td { padding: 3px 4px; text-align: center; vertical-align: middle; }
.rx-track td:nth-child(2) { text-align: start; }
.rx-table.rx-track .rx-track-domain th { background: #c4b5fd; color: #1e293b; text-align: start; font-size: 10pt; }
.rx-table.rx-track .rx-track-goal th { background: #e2e8f0; color: #1e293b; text-align: start; font-weight: 700; }
.rx-track-symbol { float: inline-end; font-weight: 800; }
.rx-track-num { width: 10mm; }
/* Column titles: dark band, white text; the code (EXP, Mixing fluency…) under the title in a lighter tint. */
.rx-table.rx-track .rx-track-cols th { padding: 4px 3px; background: rgb(var(--bp-135c65)); color: #fff; font-size: 7.5pt; line-height: 1.25; }
.rx-track-code { display: block; margin-top: 1px; color: #a7f3d0; font-size: .85em; font-weight: 600; }
.rx-track-col { width: 19mm; }
.rx-track-col.is-gen { width: 17mm; font-size: .8em; }
.rx-track td.rx-track-col { padding: 3px 2px; }
.rx-track-locked { display: block; white-space: pre-wrap; }
.rx-track td.is-session { background: #f0fdfa; }
.rx-track-state { display: flex; align-items: center; gap: .4rem; margin: .4rem 0; padding: .45rem .7rem; border-radius: 10px; font-weight: 700; }
.rx-track-state.is-rejected { background: #fef2f2; color: #b91c1c; }
.rx-track-state.is-pending { background: #fffbeb; color: #b45309; }
.rx-track-state.is-approved { background: #ecfdf5; color: #047857; }
/* MT: start and end as free text, laid out like the date columns. */
.rx-track-mt { display: grid; gap: 3px; }
.rx-track-mt > div { display: grid; gap: 1px; padding: 2px 4px; border-radius: 6px; }
.rx-track-mt > .is-start { background: #ecfdf5; }
.rx-track-mt > .is-end { background: #eef2ff; }
.rx-track-mt small { font-size: .72em; font-weight: 800; }
.rx-track-mt > .is-start small { color: #047857; }
.rx-track-mt > .is-end small { color: #4338ca; }
@media print { .rx-track-mt > div { background: none !important; padding: 0; } }
.rx-attempt { display: block; white-space: nowrap; }
.rx-prop-input { width: 100%; border: 0; background: transparent; font: inherit; font-size: .75em; direction: ltr; }
.rx-attempt.is-achieved { color: #166534; font-weight: 800; }
.rx-track-controls { display: flex; flex-wrap: wrap; gap: .25rem .75rem; margin-top: .3rem; font-size: 8pt; color: #475569; }
.rx-track-controls label { display: inline-flex; align-items: center; gap: .25rem; cursor: pointer; }
.rx-track tr.is-off td { opacity: .45; }
.rx-print-only { display: none; }
@media print {
  .rx-print-only { display: inline; }
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
  display: grid;
  gap: 0.6rem;
  padding: 0.65rem 1.25rem 0.75rem;
  background: #fff;
  border-bottom: 1px solid var(--sawa-border);
  box-shadow: 0 6px 18px -14px rgba(15, 23, 42, 0.45);
}
.rx-toolbar-main {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1rem;
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
  font-size: 1.1rem;
}
.rx-toolbar-title small {
  color: var(--sawa-muted);
}
.rx-toolbar-end {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}
.rx-toolbar-sub {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  gap: 0.6rem;
  padding-top: 0.6rem;
  border-top: 1px dashed var(--sawa-border);
}
.rx-save-groups {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-inline-start: auto;
}
.rx-save-group {
  --tone: #94a3b8;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.35rem 0.45rem 0.35rem 0.75rem;
  border: 1px solid var(--sawa-border);
  border-radius: 12px;
  background: #f8fafc;
  transition: border-color 0.2s, background 0.2s;
}
[dir="rtl"] .rx-save-group {
  padding: 0.35rem 0.75rem 0.35rem 0.45rem;
}
.rx-save-group.is-saved, .rx-save-group.is-approved { --tone: #10b981; }
.rx-save-group.is-dirty, .rx-save-group.is-pending { --tone: #f59e0b; background: #fffbeb; border-color: #fde68a; }
.rx-save-group.is-error, .rx-save-group.is-rejected { --tone: #ef4444; background: #fef2f2; border-color: #fecaca; }
.rx-save-dot {
  width: 0.6rem;
  height: 0.6rem;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--tone);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--tone) 20%, transparent);
}
.rx-save-text {
  display: grid;
  line-height: 1.2;
  min-width: 6.5rem;
}
.rx-save-text b {
  color: rgb(var(--bp-0f3d43));
  font-size: 0.85rem;
}
.rx-save-text small {
  color: var(--sawa-muted);
  font-size: 0.72rem;
}
.rx-save-lock {
  color: #047857;
  padding-inline: 0.35rem;
}
.rx-levels {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 1rem;
  margin: 0;
  padding: 0.35rem 0.75rem;
  border: 1px solid var(--sawa-border);
  border-radius: 12px;
  background: #f8fafc;
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
/* A page deleted from the report: gone from the screen and the print (it does not count in the page numbers). */
.rx-page.is-deleted {
  display: none !important;
}
/* A page with nothing left to print (its tables deleted) stays on screen, to restore them, marked as not printed. */
@media screen {
  .rx-page.rx-print-hidden {
    outline: 2px dashed #f59e0b;
    outline-offset: -2px;
  }
  .rx-page.rx-print-hidden::after {
    content: attr(data-print-note);
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    padding: 2px 12px;
    border-radius: 999px;
    background: #fffbeb;
    color: #92400e;
    font-size: 9pt;
    font-weight: 700;
    white-space: nowrap;
  }
}
/* The delete button is added by v-page outside the template: scoped styles reach it through :deep(). */
.rx-page :deep(.rx-page-delete) {
  position: absolute;
  top: 6px;
  inset-inline-end: 6px;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 8px;
  background: #fef2f2;
  color: #b91c1c;
  cursor: pointer;
  opacity: 0.55;
  transition: opacity 0.15s;
  z-index: 2;
}
.rx-page:hover :deep(.rx-page-delete),
.rx-page :deep(.rx-page-delete:focus-visible) {
  opacity: 1;
}
.rx-pages-menu {
  display: grid;
  gap: 0.6rem;
  max-width: 22rem;
}
.rx-pages-menu-hint {
  margin: 0;
  color: #64748b;
  font-size: 0.85rem;
}
.rx-pages-menu ol {
  display: grid;
  gap: 0.35rem;
  max-height: 55vh;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  list-style: none;
}
.rx-pages-menu li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.rx-pages-menu li label {
  flex: 1;
  cursor: pointer;
}
.rx-pages-menu li.is-off label {
  color: #94a3b8;
  text-decoration: line-through;
}
.rx-pages-restore {
  border: 0;
  border-radius: 6px;
  padding: 0.15rem 0.5rem;
  background: #edf7f5;
  color: var(--sawa-primary, rgb(var(--bp-135c65)));
  cursor: pointer;
  font: inherit;
  font-size: 0.8rem;
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
  border-bottom: 2px solid rgb(var(--bp-135c65));
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
    radial-gradient(circle at 100% 0, rgb(var(--bp-135c65) / 0.1) 0 150px, transparent 151px),
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
  color: rgb(var(--bp-135c65));
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
  background: linear-gradient(135deg, rgb(var(--bp-135c65)) 0%, rgb(var(--bp-1b7c86)) 100%);
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
  color: rgb(var(--bp-135c65));
  font-size: 12pt;
  font-weight: 800;
}
.rx-cover-list h2::before {
  content: "";
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: rgb(var(--bp-135c65));
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
  border: 1px solid rgb(var(--bp-d5e6e8));
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
  color: rgb(var(--bp-0e464d));
  font-size: 11pt;
}
.rx-cover-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: rgb(var(--bp-eef8f9));
  color: rgb(var(--bp-135c65));
  font-size: 9pt;
}
.rx-cover-count {
  display: grid;
  place-items: center;
  min-width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgb(var(--bp-135c65));
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
  color: rgb(var(--bp-135c65));
  font-size: 14pt;
  font-weight: 800;
}
.rx-bullet::before {
  content: "";
  flex: none;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: rgb(var(--bp-135c65));
  box-shadow: 0 0 0 4px rgb(var(--bp-d7ecee));
}
.rx-band {
  margin: 0 0 12px;
  padding: 8px 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgb(var(--bp-135c65)) 0%, rgb(var(--bp-1b7c86)) 100%);
  color: #fff;
  font-size: 14pt;
  font-weight: 800;
}
.rx-band-soft {
  background: rgb(var(--bp-eef8f9));
  color: rgb(var(--bp-135c65));
  border-inline-start: 5px solid rgb(var(--bp-135c65));
}
.rx-space {
  margin-top: 10mm;
}
.rx-kicker {
  margin: 0;
  color: rgb(var(--bp-135c65));
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
  border: 1px solid rgb(var(--bp-d5e6e8));
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
  background: rgb(var(--bp-135c65));
  color: #fff;
  font-weight: 700;
}
.rx-info th {
  width: 34%;
  background: rgb(var(--bp-eef8f9));
  color: rgb(var(--bp-0e464d));
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
  border: 1.5px solid rgb(var(--bp-0e464d));
  border-radius: 3px;
}
.rx-box.is-on {
  background: rgb(var(--bp-135c65));
  box-shadow: inset 0 0 0 2px #fff;
}
.ltr-cell {
  text-align: start;
}
.rx-team td {
  height: 16mm;
}
.rx-team tr.rx-screen-only td {
  height: auto;
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
  border-inline-start: 4px solid rgb(var(--bp-135c65));
  color: rgb(var(--bp-135c65));
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
.rx-ot-flow {
  margin: 0 0 2mm;
  font-size: 11pt;
  font-weight: 800;
  text-align: left;
}
.rx-ot-intro {
  margin: 4mm 0 3mm;
  font-weight: 700;
  line-height: 1.8;
}
.rx-ot-domain {
  margin-top: 4mm;
  break-inside: auto;
}
.rx-ot-domain-title {
  margin: 0 0 2mm;
  font-size: 10.5pt;
  font-weight: 800;
  text-decoration: underline;
}
.rx-ot-skill {
  margin: 0 0 3mm;
  padding-inline-start: 4mm;
  break-inside: avoid;
  page-break-inside: avoid;
}
.rx-ot-ltg,
.rx-ot-goals li {
  display: flex;
  align-items: flex-start;
  gap: 1.5mm;
  line-height: 1.7;
}
.rx-ot-ltg > :nth-child(3),
.rx-ot-goals li > :nth-child(2) {
  flex: 1;
  min-width: 0;
}
.rx-ot-objectives {
  margin: 1mm 0;
  font-weight: 700;
  text-align: right;
}
.rx-ot-goals {
  margin: 0;
  padding: 0;
  list-style: none;
}
.rx-sum-domain {
  display: block;
  margin-top: 2px;
  color: #475569;
  font-size: 7.5pt;
  line-height: 1.3;
}
.rx-points {
  margin: 0;
  padding-inline-start: 1.1em;
  list-style: disc;
}
.rx-points li::marker {
  color: rgb(var(--bp-135c65));
}
.rx-weak-name {
  display: block;
  color: rgb(var(--bp-0e464d));
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
    break-after: auto;
    page-break-after: auto;
  }
  /* A new sheet before every printed page that follows another one (deleted pages print nothing). */
  .rx-page:not(.is-deleted) ~ .rx-page:not(.is-deleted) {
    break-before: page;
    page-break-before: always;
  }
  /* The page's delete button (added by v-page; this block is not scoped, so no :deep here). */
  .rx-page .rx-page-delete {
    display: none !important;
  }
}
</style>
