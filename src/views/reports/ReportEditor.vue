<script setup>
// The printable evaluation report: A4 pages shown as they will print. Highlighted fields are typed in
// directly on the page (kept as a draft on this device) and "Print" prints the pages only.
//
// Pages: 1 cover (logo, child, evaluations) · 2 personal info + team signatures (newest chosen evaluation)
// · then per evaluation: VB-MAPP = case description + behaviours, and the VB-MAPP charts page;
// any other type = its results page.
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import sawaLogo from "@/assets/img/sawa_logo.svg";
import EditableText from "@/components/reports/EditableText.vue";
import MilestoneLevelChart from "@/components/reports/MilestoneLevelChart.vue";
import ReportResults from "@/components/reports/ReportResults.vue";
import {
  MILESTONE, ageOn, ageWords, dateParts, dmy, evaluationLabel, firstName, isFemale, shortAge, typeIcon, ymd,
} from "@/components/reports/reportUtils";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const childId = String(route.params.childId);
const keys = String(route.query.items ?? "").split(",").map((key) => key.trim()).filter(Boolean);
const draftKey = `ereport-draft:${childId}:${[...keys].sort().join(",")}`;

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
const todayIso = (() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
})();

const TEST_KEYS = ["1st test", "2nd test", "3rd test", "4th test"];
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
    cases: Object.fromEntries(
      (data.items ?? [])
        .filter((item) => item.type === MILESTONE)
        .map((item) => [item.key, { level: "", skills: "", behaviors: Array.from({ length: 3 }, () => ["", "", "", "", ""]), scores: ["", "", "", ""] }])
    ),
  };
}

function readDraft() {
  try {
    const saved = JSON.parse(localStorage.getItem(draftKey) ?? "null");
    return saved && typeof saved === "object" ? saved : null;
  } catch {
    return null;
  }
}

function applyDraft(base, saved) {
  if (!saved) return base;
  if (Array.isArray(saved.team)) base.team = base.team.map((row, i) => ({ ...row, ...(saved.team[i] ?? {}) }));
  for (const key of Object.keys(base.cases)) {
    if (saved.cases?.[key]) base.cases[key] = { ...base.cases[key], ...saved.cases[key] };
  }
  return base;
}

watch(edits, (value) => {
  if (!value) return;
  try {
    localStorage.setItem(draftKey, JSON.stringify(value));
  } catch {
    // Storage full or blocked: the edits still stay on the page.
  }
}, { deep: true });

function resetEdits() {
  try {
    localStorage.removeItem(draftKey);
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
    const { data } = await axios.get(`api/reports/children/${childId}/report`, { params: { items: keys } });
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
onMounted(() => {
  window.scrollTo(0, 0);
  if (!keys.length) {
    loading.value = false;
    loadError.value = true;
    return;
  }
  load();
});
onBeforeUnmount(() => {
  document.title = previousTitle;
});

// ---- VB-MAPP helpers -------------------------------------------------------------------------------

const levelsHighFirst = (item) => [...(item.result?.levels ?? [])].sort((a, b) => Number(b.level_id) - Number(a.level_id));
const historyRow = (item, index) => item.result?.history?.[index] ?? null;
const caseAge = (item) => ageWords(ageOn(child.value.birth_date, item.date), t);

// ---- actions ---------------------------------------------------------------------------------------

function print() {
  document.activeElement?.blur?.();
  window.print();
}

function back() {
  router.push({ name: "evaluation-reports", query: { child: childId } });
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
        </div>

        <div class="rx-cover-list">
          <h2>{{ $t("ereport.included") }}</h2>
          <ol>
            <li v-for="(item, i) in items" :key="item.key">
              <span class="rx-cover-num">{{ i + 1 }}</span>
              <span class="rx-cover-icon"><i :class="typeIcon(item.type)" aria-hidden="true" /></span>
              <span class="rx-cover-eval">
                <strong>{{ evaluationLabel(item, $t) }}</strong>
                <small>
                  <span class="ltr">{{ dmy(item.date) }}</span>
                  <template v-if="item.specialist?.name"> · {{ item.specialist.name }}</template>
                </small>
              </span>
            </li>
          </ol>
        </div>

        <footer class="rx-cover-foot">
          <span>{{ $t("ereport.report_date") }}: <b class="ltr">{{ dmy(todayIso) }}</b></span>
        </footer>
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

      <!-- 3+. Each evaluation -->
      <template v-for="item in items" :key="item.key">
        <template v-if="item.type === MILESTONE">
          <!-- Case description + behaviour problems -->
          <section class="rx-page">
            <header class="rx-head">
              <img :src="sawaLogo" alt="Sawa" />
              <span>VB-MAPP · <span class="ltr">{{ dmy(item.date) }}</span></span>
            </header>

            <h2 class="rx-band">{{ $t("ereport.case_description", { name: shortName }) }}</h2>
            <p class="rx-case">
              {{ $t(female ? "ereport.case_text_female" : "ereport.case_text_male", { name: shortName, age: caseAge(item) }) }}
              <EditableText v-model="edits.cases[item.key].level" bold :placeholder="$t('ereport.blank')" />
              {{ $t(female ? "ereport.case_text_2_female" : "ereport.case_text_2_male") }}
              <EditableText v-model="edits.cases[item.key].skills" :placeholder="$t('ereport.blank')" />.
            </p>

            <h2 class="rx-band rx-band-soft rx-space">{{ $t("ereport.behaviors") }}</h2>
            <table class="rx-table rx-behaviours">
              <thead>
                <tr>
                  <th v-for="column in behaviourColumns" :key="column">{{ $t(`ereport.${column}`) }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, r) in edits.cases[item.key].behaviors" :key="r">
                  <td v-for="(value, c) in row" :key="c">
                    <EditableText v-model="row[c]" block multiline />
                  </td>
                </tr>
              </tbody>
            </table>

            <footer class="rx-foot"><span>{{ $t("ereport.academy") }}</span><span class="rx-page-num" /></footer>
          </section>

          <!-- VB-MAPP charts -->
          <section class="rx-page">
            <header class="rx-head">
              <img :src="sawaLogo" alt="Sawa" />
              <span>VB-MAPP · <span class="ltr">{{ dmy(item.date) }}</span></span>
            </header>

            <p class="rx-kicker">{{ $t("ereport.special_education") }}</p>
            <p class="rx-intro">{{ $t("ereport.vb_intro", { name: child.name }) }}</p>

            <div class="vb-tables">
              <table class="vb-table vb-info">
                <tbody>
                  <tr>
                    <th class="tone-a">Child name</th>
                    <td colspan="2">{{ child.name }}</td>
                  </tr>
                  <tr>
                    <th class="tone-b">Date of birth</th>
                    <td colspan="2" class="ltr-cell"><span class="ltr">{{ ymd(child.birth_date) }}</span></td>
                  </tr>
                  <tr v-for="(key, i) in TEST_KEYS" :key="key">
                    <th v-if="i === 0" :rowspan="TEST_KEYS.length" class="tone-c">Age at testing</th>
                    <th class="tone-c vb-n">{{ i + 1 }}</th>
                    <td class="ltr-cell"><span class="ltr">{{ historyRow(item, i) ? shortAge(historyRow(item, i).age_months) : "" }}</span></td>
                  </tr>
                </tbody>
              </table>

              <table class="vb-table vb-tests">
                <thead>
                  <tr>
                    <th class="tone-a">Tester</th>
                    <th class="tone-b">Color</th>
                    <th class="tone-c">Date</th>
                    <th class="tone-d">Score</th>
                    <th class="tone-e">Key</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(key, i) in TEST_KEYS" :key="key">
                    <td>{{ historyRow(item, i)?.testers?.join(" / ") ?? "" }}</td>
                    <td>
                      <span class="vb-swatches">
                        <i v-for="color in historyRow(item, i)?.colors ?? []" :key="color" :style="{ background: '#' + color }" />
                      </span>
                    </td>
                    <td class="ltr-cell"><span class="ltr">{{ ymd(historyRow(item, i)?.date) }}</span></td>
                    <td><EditableText v-model="edits.cases[item.key].scores[i]" block /></td>
                    <th class="tone-e ltr-cell"><span class="ltr">{{ key }}</span></th>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="vb-levels">
              <MilestoneLevelChart v-for="level in levelsHighFirst(item)" :key="level.level_id" :level="level" />
              <p v-if="!levelsHighFirst(item).length" class="rx-empty">{{ $t("ereport.no_result_data") }}</p>
            </div>

            <footer class="rx-foot"><span>{{ $t("ereport.academy") }}</span><span class="rx-page-num" /></footer>
          </section>
        </template>

        <!-- Any other evaluation: its results -->
        <section v-else class="rx-page">
          <header class="rx-head">
            <img :src="sawaLogo" alt="Sawa" />
            <span>{{ evaluationLabel(item, $t) }} · <span class="ltr">{{ dmy(item.date) }}</span></span>
          </header>

          <h2 class="rx-band">{{ $t("ereport.results_of", { name: evaluationLabel(item, $t) }) }}</h2>
          <p class="rx-meta">
            <span><i class="pi pi-calendar" aria-hidden="true" /> <span class="ltr">{{ dmy(item.date) }}</span></span>
            <span v-if="item.specialist?.name"><i class="pi pi-user" aria-hidden="true" /> {{ $t("ereport.evaluator") }}: {{ item.specialist.name }}</span>
          </p>
          <ReportResults :item="item" />

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
    radial-gradient(circle at 100% 0, rgba(19, 92, 101, 0.1) 0 180px, transparent 181px),
    radial-gradient(circle at 0 100%, rgba(169, 171, 127, 0.18) 0 220px, transparent 221px),
    #fff;
}
.rx-cover-top {
  display: grid;
  justify-items: center;
  gap: 6px;
  padding: 22mm 20mm 0;
}
.rx-cover-logo {
  height: 118px;
}
.rx-cover-academy {
  margin: 0;
  color: #135c65;
  font-size: 13pt;
  font-weight: 700;
}
.rx-cover-center {
  display: grid;
  justify-items: center;
  gap: 6px;
  margin: 18mm 20mm 12mm;
  padding: 12mm 10mm;
  border-radius: 18px;
  background: linear-gradient(135deg, #135c65 0%, #1b7c86 100%);
  color: #fff;
  text-align: center;
}
.rx-cover-kicker {
  margin: 0;
  font-size: 13pt;
  letter-spacing: 0.02em;
  opacity: 0.85;
}
.rx-cover-name {
  margin: 0;
  font-size: 28pt;
  font-weight: 800;
  line-height: 1.35;
}
.rx-cover-line {
  width: 70px;
  height: 4px;
  margin-top: 6px;
  border-radius: 4px;
  background: #a9ab7f;
}
.rx-cover-list {
  margin: 0 20mm;
}
.rx-cover-list h2 {
  margin: 0 0 10px;
  color: #135c65;
  font-size: 13pt;
  font-weight: 800;
}
.rx-cover-list ol {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.rx-cover-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 14px;
  border: 1px solid #d5e6e8;
  border-radius: 12px;
  background: #fff;
  break-inside: avoid;
}
.rx-cover-num {
  display: grid;
  place-items: center;
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #135c65;
  color: #fff;
  font-weight: 800;
  font-size: 10pt;
}
.rx-cover-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #eef8f9;
  color: #135c65;
}
.rx-cover-eval {
  display: grid;
  line-height: 1.45;
}
.rx-cover-eval strong {
  font-size: 12pt;
}
.rx-cover-eval small {
  color: #64748b;
  font-size: 9.5pt;
}
.rx-cover-foot {
  margin-top: auto;
  padding: 10mm 20mm 14mm;
  color: #475569;
  font-size: 11pt;
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
  text-align: justify;
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

/* VB-MAPP tables */
.vb-tables {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.25fr);
  gap: 8mm;
  align-items: start;
  margin-bottom: 7mm;
}
.vb-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 9pt;
  line-height: 1.4;
}
.vb-table th,
.vb-table td {
  padding: 4px 6px;
  border: 1px solid #94a3b8;
  text-align: center;
  vertical-align: middle;
}
.vb-table th {
  font-weight: 800;
  color: #1e293b;
  white-space: nowrap;
}
.vb-table td {
  background: #fff;
}
.vb-n {
  width: 26px;
}
.tone-a { background: #cfe8ea; }
.tone-b { background: #dcfce7; }
.tone-c { background: #fef3c7; }
.tone-d { background: #fce7f3; }
.tone-e { background: #e0e7ff; }
.vb-tests td {
  height: 26px;
}
.vb-swatches {
  display: inline-flex;
  gap: 0;
}
.vb-swatches i {
  width: 16px;
  height: 16px;
  border: 1px solid rgba(15, 23, 42, 0.25);
}
.vb-levels {
  display: grid;
  gap: 5mm;
}

@media (max-width: 860px) {
  .rx-pages {
    justify-content: start;
  }
}
</style>

<style>
/* Printing: only the pages, one per sheet, edge to edge (the pages carry their own margins). */
@media print {
  @page {
    size: A4;
    margin: 0;
  }
  html,
  body {
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
    overflow: visible !important;
  }
  .rx-page {
    width: 210mm !important;
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
