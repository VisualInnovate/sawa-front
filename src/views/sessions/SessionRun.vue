<script setup>
// A running session, full screen and without any page scroll:
// a fixed top bar (child, the three steps to jump between at any time, the time left, full screen, end) and one step:
// 1. the break tables (as prepared, or empty) — editable, printable, saved as they change;
// 2. the child's reinforcers and a preference test (or skip);
// 3. the goals of the latest approved tracking, one tab per table; MT opens MT1–MT3 and their DTT sheets.
// When the time is up everything is saved, the session ends and the therapist goes back to the sessions page.
import axios from "axios";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import sawaLogo from "@/assets/img/sawa_logo.svg";
import BreakTables from "@/components/sessions/BreakTables.vue";
import RunReinforcers from "@/components/sessions/RunReinforcers.vue";
import RunGoals from "@/components/sessions/RunGoals.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const id = route.params.id;

const data = ref(null);
const step = ref("breaks");
const secondsLeft = ref(0);
const fullscreen = ref(!!document.fullscreenElement);
const leaving = ref(false);
const breaksSaving = ref(false);
const breaksSavedAt = ref(null);
const tableView = ref("both");
const goalsRef = ref(null);

const STEPS = computed(() => [
  { key: "breaks", icon: "pi pi-stopwatch", label: t("run_step_breaks") },
  { key: "reinforcers", icon: "pi pi-star", label: t("run_step_reinforcers") },
  { key: "goals", icon: "pi pi-flag", label: t("run_step_goals") },
]);
const stepIndex = computed(() => STEPS.value.findIndex((item) => item.key === step.value));
const canEdit = computed(() => !!data.value?.can_edit);
const clock = computed(() => {
  const s = Math.max(0, secondsLeft.value);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
});
const total = computed(() => (data.value ? Math.max(1, (new Date(data.value.session.ends_at.replace(" ", "T")) - new Date(data.value.session.starts_at.replace(" ", "T"))) / 1000) : 1));
const progress = computed(() => Math.min(1, Math.max(0, secondsLeft.value / total.value)));
const urgency = computed(() => (secondsLeft.value <= 60 ? "is-critical" : secondsLeft.value <= 300 ? "is-warning" : ""));

async function load() {
  const { data: response } = await axios.get(`api/program-sessions/${id}/workspace`);
  data.value = response.data;
  secondsLeft.value = response.data.seconds_left;
  step.value = response.data.session.workspace?.step ?? "breaks";
  if (!response.data.can_edit) {
    toast.add({ severity: "info", summary: t("run_read_only"), life: 3000 });
  }
}

// ---- break tables: saved shortly after each change -----------------------------------------------
let breaksTimer = null;
function breaksChanged() {
  clearTimeout(breaksTimer);
  breaksTimer = setTimeout(saveBreaks, 700);
}
async function saveBreaks() {
  clearTimeout(breaksTimer);
  breaksTimer = null;
  if (!canEdit.value) return;
  breaksSaving.value = true;
  try {
    const schedule = data.value.break_schedule;
    await axios.put(`api/program-sessions/${id}/break-schedule`, { trials: schedule.trials, minutes: schedule.minutes });
    breaksSavedAt.value = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    toast.add({ severity: "error", summary: t("error"), detail: t("run_save_failed"), life: 3000 });
  } finally {
    breaksSaving.value = false;
  }
}

async function go(key) {
  if (key === step.value) return;
  if (breaksTimer) await saveBreaks();
  step.value = key;
  if (canEdit.value) axios.put(`api/program-sessions/${id}/workspace`, { step: key }).catch(() => {});
}

async function skipReinforcers() {
  if (canEdit.value) await axios.put(`api/program-sessions/${id}/workspace`, { reinforcers_skipped: true }).catch(() => {});
  go("goals");
}

// ---- time ----------------------------------------------------------------------------------------
let tick = null;
let endsAt = 0;
function startClock() {
  endsAt = Date.now() + secondsLeft.value * 1000;
  tick = setInterval(() => {
    secondsLeft.value = Math.max(0, Math.round((endsAt - Date.now()) / 1000));
    if (secondsLeft.value === 0 && canEdit.value && !leaving.value) timeUp();
  }, 1000);
}

async function flush() {
  if (breaksTimer) await saveBreaks();
  await goalsRef.value?.flush?.();
}

async function timeUp() {
  leaving.value = true;
  await flush();
  await axios.post(`api/program-sessions/${id}/end`).catch(() => {});
  toast.add({ severity: "info", summary: t("run_time_up"), life: 4000 });
  exit();
}

const endDialog = ref(false);
async function endNow() {
  leaving.value = true;
  await flush();
  await axios.post(`api/program-sessions/${id}/end`).catch(() => {});
  exit();
}

async function leave() {
  await flush();
  exit();
}

function exit() {
  if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
  router.push({ name: "sessions" });
}

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen?.();
  else document.documentElement.requestFullscreen?.().catch(() => {});
}
const onFullscreen = () => { fullscreen.value = !!document.fullscreenElement; };

onMounted(async () => {
  document.addEventListener("fullscreenchange", onFullscreen);
  document.documentElement.classList.add("run-no-scroll");
  await load();
  startClock();
});
onBeforeUnmount(() => {
  clearInterval(tick);
  clearTimeout(breaksTimer);
  document.removeEventListener("fullscreenchange", onFullscreen);
  document.documentElement.classList.remove("run-no-scroll");
});
</script>

<template>
  <div class="run-root" dir="rtl">
    <!-- top bar -->
    <header class="run-bar">
      <div class="run-brand">
        <img :src="$siteLogo(sawaLogo)" alt="Sawa" />
        <div v-if="data" class="run-who">
          <strong>{{ data.session.child?.name }}</strong>
          <small>{{ data.session.treatment?.name ?? $t("sp_session_group") }} · {{ data.session.room?.name }} · {{ data.session.therapist?.name }}</small>
          <!-- The room's activities during the session. -->
          <span v-if="data.activities?.length" class="run-activities" :aria-label="$t('activities.during_session')">
            <span v-for="activity in data.activities" :key="activity.id" class="run-activity" :title="`${activity.name} ${activity.start}–${activity.end}`">
              <img v-if="activity.image_url" :src="activity.image_url" alt="" />
              <b>{{ activity.name }}</b>
              <span dir="ltr" class="run-activity-time">{{ activity.start }}–{{ activity.end }}</span>
            </span>
          </span>
        </div>
      </div>

      <nav class="run-steps" :aria-label="$t('run_steps')">
        <span class="run-steps-track"><span class="run-steps-fill" :style="{ width: `${(stepIndex / (STEPS.length - 1)) * 100}%` }" /></span>
        <button v-for="(item, i) in STEPS" :key="item.key" type="button" class="run-step" :class="{ 'is-active': step === item.key, 'is-done': i < stepIndex }"
          @click="go(item.key)">
          <span class="run-step-dot"><i :class="i < stepIndex ? 'pi pi-check' : item.icon" /></span>
          <span class="run-step-label">{{ item.label }}</span>
        </button>
      </nav>

      <div class="run-actions">
        <div class="run-clock" :class="urgency" role="timer" :aria-label="$t('run_time_left')">
          <svg viewBox="0 0 36 36" aria-hidden="true">
            <circle cx="18" cy="18" r="15.5" class="run-clock-bg" />
            <circle cx="18" cy="18" r="15.5" class="run-clock-fg" :style="{ strokeDashoffset: 97.4 * (1 - progress) }" />
          </svg>
          <div><small>{{ $t("run_time_left") }}</small><b class="ltr">{{ clock }}</b></div>
        </div>
        <Button :icon="fullscreen ? 'pi pi-window-minimize' : 'pi pi-window-maximize'" variant="text" rounded severity="secondary"
          v-tooltip.bottom="$t('run_fullscreen')" :aria-label="$t('run_fullscreen')" @click="toggleFullscreen" />
        <Button v-if="canEdit" icon="pi pi-stop-circle" :label="$t('run_end')" severity="danger" variant="outlined" size="small" @click="endDialog = true" />
        <Button v-else icon="pi pi-sign-out" :label="$t('back')" severity="secondary" size="small" @click="leave" />
      </div>
    </header>

    <main v-if="data" class="run-main">
      <Transition name="run-step" mode="out-in">
        <!-- 1. breaks -->
        <section v-if="step === 'breaks'" key="breaks" class="run-panel run-breaks">
          <div class="run-panel-head">
            <div>
              <h2>{{ $t("run_step_breaks") }}</h2>
              <p>
                <Tag v-if="data.break_schedule.ready_at" severity="success" icon="pi pi-check" :value="$t('break_ready')" />
                <Tag v-else-if="!data.break_schedule.saved" severity="secondary" :value="$t('break_empty')" />
                <span v-if="canEdit" class="run-saved"><i :class="breaksSaving ? 'pi pi-spin pi-spinner' : 'pi pi-cloud'" />
                  {{ breaksSaving ? $t("run_saving") : breaksSavedAt ? $t("run_saved_at", { time: breaksSavedAt }) : $t("run_autosave") }}</span>
              </p>
            </div>
            <div class="flex items-center gap-2">
              <SelectButton v-model="tableView" :options="['both', 'trials', 'minutes']" :allowEmpty="false" size="small">
                <template #option="{ option }">{{ $t(`break_view_${option}`) }}</template>
              </SelectButton>
              <Button icon="pi pi-arrow-left" iconPos="right" :label="$t('run_approve_next')" @click="go('reinforcers')" />
            </div>
          </div>
          <BreakTables v-model="data.break_schedule" :editable="canEdit" :childName="data.session.child?.name"
            :only="tableView === 'both' ? null : tableView" class="run-break-tables" :class="{ 'is-single': tableView !== 'both' }" @change="breaksChanged" />
        </section>

        <!-- 2. reinforcers -->
        <RunReinforcers v-else-if="step === 'reinforcers'" key="reinforcers" class="run-panel" :sessionId="id" :canEdit="canEdit"
          v-model:reinforcers="data.reinforcers" v-model:tests="data.preference_tests" @skip="skipReinforcers" @next="go('goals')" />

        <!-- 3. goals -->
        <RunGoals v-else key="goals" ref="goalsRef" class="run-panel" :sessionId="id" :canEdit="canEdit" :goals="data.goals"
          :therapist="data.session.therapist?.name" :initialTab="data.session.workspace?.goal_tab ?? 0" />
      </Transition>
    </main>
    <div v-else class="run-loading"><i class="pi pi-spin pi-spinner" /></div>

    <Dialog v-model:visible="endDialog" modal :header="$t('run_end')" :style="{ width: '24rem' }">
      <p>{{ $t("run_end_confirm") }}</p>
      <template #footer>
        <Button :label="$t('no')" variant="text" severity="secondary" @click="endDialog = false" />
        <Button :label="$t('run_end')" severity="danger" icon="pi pi-stop-circle" :loading="leaving" @click="endNow" />
      </template>
    </Dialog>
    <Toast />
  </div>
</template>

<style scoped>
.run-root { --run-teal: rgb(var(--bp-135c65)); --run-accent: #0f8a7e; position: fixed; inset: 0; z-index: 10; display: grid; grid-template-rows: auto 1fr; overflow: hidden;
  background: radial-gradient(1200px 500px at 100% -10%, #e0f2f1 0, transparent 60%), linear-gradient(180deg, rgb(var(--bp-f6fafa)), #eef3f4); font-family: 'Cairo', sans-serif; }
.run-bar { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 1rem; padding: .55rem 1.1rem; background: rgb(255 255 255 / .85);
  backdrop-filter: blur(8px); border-bottom: 1px solid #e2e8f0; box-shadow: 0 6px 24px -18px rgb(15 23 42 / .5); animation: run-down .45s ease both; }
.run-brand { display: flex; align-items: center; gap: .7rem; min-width: 0; }
.run-brand img { height: 2.3rem; }
.run-who { display: flex; flex-direction: column; min-width: 0; }
.run-who strong { color: var(--run-teal); font-size: 1rem; }
.run-who small { color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 22rem; }
.run-activities { display: flex; flex-wrap: wrap; gap: .3rem; margin-top: .25rem; }
.run-activity { display: inline-flex; align-items: center; gap: .35rem; padding: .1rem .55rem .1rem .15rem; border-radius: 999px; background: #edf7f5; color: rgb(var(--bp-0e464d)); font-size: .75rem; white-space: nowrap; }
.run-activity img { width: 1.4rem; height: 1.4rem; border-radius: 50%; object-fit: cover; }
.run-activity-time { color: #64748b; }
.run-steps { position: relative; display: flex; justify-content: center; gap: 2.5rem; }
.run-steps-track { position: absolute; top: 1.05rem; inset-inline: 18%; height: 3px; border-radius: 3px; background: #e2e8f0; overflow: hidden; }
.run-steps-fill { display: block; height: 100%; background: linear-gradient(90deg, var(--run-accent), #34d399); transition: width .5s cubic-bezier(.65, 0, .35, 1); }
.run-step { position: relative; display: flex; flex-direction: column; align-items: center; gap: .2rem; border: 0; background: none; cursor: pointer; color: #64748b; font: inherit; }
.run-step-dot { width: 2.2rem; height: 2.2rem; border-radius: 50%; display: grid; place-items: center; background: #fff; border: 2px solid #cbd5e1;
  transition: transform .25s, background .25s, border-color .25s, color .25s; }
.run-step:hover .run-step-dot { transform: translateY(-2px); border-color: var(--run-accent); }
.run-step.is-done .run-step-dot { background: #d1fae5; border-color: #34d399; color: #047857; }
.run-step.is-active { color: var(--run-teal); font-weight: 700; }
.run-step.is-active .run-step-dot { background: var(--run-teal); border-color: var(--run-teal); color: #fff; box-shadow: 0 0 0 6px rgb(19 92 101 / .14); transform: scale(1.08); }
.run-step-label { font-size: .8rem; }
.run-actions { display: flex; align-items: center; gap: .5rem; }
.run-clock { display: flex; align-items: center; gap: .5rem; padding: .25rem .7rem .25rem .4rem; border-radius: 999px; background: #f0fdfa; color: var(--run-teal);
  transition: background .3s, color .3s; }
.run-clock svg { width: 2.4rem; height: 2.4rem; transform: rotate(-90deg); }
.run-clock-bg { fill: none; stroke: #ccfbf1; stroke-width: 3.5; }
.run-clock-fg { fill: none; stroke: currentColor; stroke-width: 3.5; stroke-linecap: round; stroke-dasharray: 97.4; transition: stroke-dashoffset 1s linear; }
.run-clock div { display: flex; flex-direction: column; line-height: 1.1; }
.run-clock small { font-size: .65rem; opacity: .8; }
.run-clock b { font-size: 1.25rem; font-variant-numeric: tabular-nums; }
.run-clock.is-warning { background: #fffbeb; color: #b45309; }
.run-clock.is-critical { background: #fef2f2; color: #b91c1c; animation: run-pulse 1s ease-in-out infinite; }
.run-main { min-height: 0; padding: .9rem 1.1rem 1rem; overflow: hidden; }
.run-panel { height: 100%; min-height: 0; }
.run-breaks { display: grid; grid-template-rows: auto 1fr; gap: .6rem; }
:deep(.run-panel-head) { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
:deep(.run-panel-head h2) { margin: 0; font-size: 1.2rem; font-weight: 800; color: var(--run-teal); }
:deep(.run-panel-head p) { margin: .15rem 0 0; display: flex; align-items: center; gap: .6rem; font-size: .8rem; color: #64748b; }
.run-saved { display: inline-flex; align-items: center; gap: .3rem; }
.run-break-tables { min-height: 0; grid-template-rows: 1fr 1fr; }
.run-break-tables.is-single { grid-template-rows: 1fr; }
.run-break-tables :deep(.bt-table-card) { min-height: 0; }
.run-break-tables :deep(.bt-grid-wrap) { flex: 1; }
.run-break-tables :deep(.bt-grid) { height: 100%; }
.run-break-tables :deep(.bt-grid td), .run-break-tables :deep(.bt-grid th) { height: auto; }
.run-break-tables :deep(.bt-table-card) { padding: .5rem .6rem; }
.run-break-tables :deep(.bt-head) { margin-bottom: .3rem; }
.run-break-tables :deep(.bt-logo) { height: 1.6rem; }
.run-break-tables :deep(.bt-grid) { font-size: .72rem; }
.run-break-tables :deep(.bt-grid th) { font-size: .6rem; line-height: 1.05; padding: .1rem; }
.run-break-tables :deep(.bt-grid td) { line-height: 1; }
.run-break-tables :deep(.bt-input) { height: 1.05rem; }
.run-break-tables :deep(.bt-slash), .run-break-tables :deep(.bt-slashes) { font-size: .9rem; }
.run-breaks :deep(.run-panel-head h2) { font-size: 1.05rem; }
.run-break-tables.is-single :deep(.bt-grid) { font-size: .95rem; }
.run-loading { display: grid; place-items: center; font-size: 2rem; color: var(--run-teal); }
.run-step-enter-active, .run-step-leave-active { transition: opacity .3s ease, transform .35s cubic-bezier(.22, 1, .36, 1); }
.run-step-enter-from { opacity: 0; transform: translateX(-28px) scale(.985); }
.run-step-leave-to { opacity: 0; transform: translateX(28px) scale(.985); }
@keyframes run-down { from { transform: translateY(-100%); } to { transform: none; } }
@keyframes run-pulse { 50% { box-shadow: 0 0 0 8px rgb(239 68 68 / .15); } }
@media (max-width: 1100px) { .run-step-label, .run-who small { display: none; } .run-steps { gap: 1.2rem; } }
</style>

<style>
html.run-no-scroll, html.run-no-scroll body { overflow: hidden; }
</style>
