<script setup>
// Step 3 of a session: the goals of the child's latest approved tracking, one tab per table (domain and general goal)
// with previous / next. Columns as the tracking (utils/trackingColumns.js): number, short-term goal, prop (start: the
// child's first session after the tracking was approved; end: «تم تحقيق الهدف»), MT, EXP (extended training stage),
// RR, GEN, EF (establishing fluency) and MF (mixing fluency). prop, EXP, RR, EF and MF are a start and an end date,
// picked in the cell (the tracking report may have typed them already); MT opens MT1, MT2 and MT3, each a DTT sheet
// (start = MT1's date, end = MT3's once all three are done); GEN opens the generalization (GoalGeneralization.vue).
import axios from "axios";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import DttSheet from "./DttSheet.vue";
import GoalGeneralization from "./GoalGeneralization.vue";
import TrackingDates from "@/components/reports/TrackingDates.vue";
import { TRACKING_COLUMNS, columnDate, isDate } from "@/utils/trackingColumns";
import { useToast } from "primevue/usetoast";

const props = defineProps({
  sessionId: { type: [String, Number], required: true },
  canEdit: { type: Boolean, default: false },
  goals: { type: Object, required: true }, // { tracking, tables: [{ key, domain, domain_symbol, general_goal, symbol, goals }] }
  therapist: { type: String, default: "" },
  initialTab: { type: Number, default: 0 },
});
const { t } = useI18n();
const toast = useToast();

const tables = computed(() => props.goals.tables ?? []);
const tab = ref(Math.min(props.initialTab, Math.max(0, tables.value.length - 1)));
const direction = ref("next");
const PER_PAGE = 6;
const page = ref(0);
const table = computed(() => tables.value[tab.value] ?? null);
const pages = computed(() => Math.max(1, Math.ceil((table.value?.goals.length ?? 0) / PER_PAGE)));
const shownGoals = computed(() => (table.value?.goals ?? []).slice(page.value * PER_PAGE, (page.value + 1) * PER_PAGE));

function moveTab(to) {
  if (to < 0 || to >= tables.value.length) return;
  direction.value = to > tab.value ? "next" : "prev";
  tab.value = to;
  page.value = 0;
}
watch(tab, (value) => {
  if (props.canEdit) axios.put(`api/program-sessions/${props.sessionId}/workspace`, { goal_tab: value }).catch(() => {});
});

// Replaces a goal's data (achieved, dates, generalizations) everywhere it is shown.
function updateGoal(data) {
  for (const item of tables.value.flatMap((row) => row.goals)) {
    if (item.id === data.id) Object.assign(item, { achieved_at: data.achieved_at, prop_start: data.prop_start, cells: data.cells, gen: data.gen });
  }
}
const busy = ref(false);
async function call(request) {
  busy.value = true;
  try {
    const { data } = await request();
    updateGoal(data.data);
    return true;
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message ?? t("mission_error"), life: 3000 });
    return false;
  } finally {
    busy.value = false;
  }
}
const goalUrl = (goal, path) => `api/program-sessions/${props.sessionId}/goals/${goal.id}/${path}`;

// prop's end: «تم تحقيق الهدف» (today; its date can then be changed or cleared like the others').
const achieve = (goal) => call(() => axios.put(goalUrl(goal, "achieved"), { achieved: true }));

// prop, EXP, RR, EF, MF: one of the two dates picked (or cleared); the other is sent as it is.
function saveDate(goal, key, end, value) {
  const other = end === "start" ? "end" : "start";
  const keep = columnDate(goal, key, other);
  return call(() => axios.put(goalUrl(goal, "cells"), { column: key, [end]: value || null, [other]: isDate(keep) ? keep : null }));
}

// GEN: the generalization of a goal; the cell shows one dot per request, coloured by its answer.
const genGoalId = ref(null);
const genGoal = computed(() => tables.value.flatMap((row) => row.goals).find((item) => item.id === genGoalId.value) ?? null);
const genDots = (goal) => [goal.gen?.classes, goal.gen?.home, ...(goal.gen?.people ?? [])].filter(Boolean);

// MT: the steps panel, then a DTT sheet.
const mtGoal = ref(null);
const sheet = ref(null); // { goal, step }
const openMt = (goal) => { mtGoal.value = goal; };
const openSheet = (step) => {
  sheet.value = { goal: mtGoal.value, step };
  mtGoal.value = null;
};
function sheetSaved(mt) {
  for (const item of tables.value.flatMap((row) => row.goals)) {
    if (item.id === sheet.value.goal.id) item.mt = mt;
  }
}
const sheetRef = ref(null);
async function flush() {
  await sheetRef.value?.saveIfDirty?.();
}
defineExpose({ flush });
</script>

<template>
  <section class="rg-root">
    <div class="run-panel-head">
      <div>
        <h2>{{ $t("run_step_goals") }}</h2>
        <p v-if="goals.tracking">{{ $t("rg_from_tracking", { date: goals.tracking.approved_at }) }}</p>
      </div>
      <div v-if="tables.length && !sheet" class="rg-nav">
        <Button icon="pi pi-chevron-right" :label="$t('previous')" variant="outlined" severity="secondary" :disabled="tab === 0" @click="moveTab(tab - 1)" />
        <span class="rg-nav-count ltr">{{ tab + 1 }} / {{ tables.length }}</span>
        <Button icon="pi pi-chevron-left" iconPos="right" :label="$t('next')" :disabled="tab >= tables.length - 1" @click="moveTab(tab + 1)" />
      </div>
    </div>

    <div v-if="!tables.length" class="rg-empty">
      <i class="pi pi-file-excel" />
      <b>{{ $t("rg_no_tracking") }}</b>
      <span>{{ $t("rg_no_tracking_hint") }}</span>
    </div>

    <Transition v-else name="rg-sheet" mode="out-in">
      <!-- a DTT sheet -->
      <DttSheet v-if="sheet" :key="`${sheet.goal.id}-${sheet.step}`" ref="sheetRef" :sessionId="sessionId" :goal="sheet.goal" :step="sheet.step"
        :canEdit="canEdit" :therapist="therapist" @saved="sheetSaved" @close="sheet = null" />

      <!-- the goals table -->
      <div v-else class="rg-board">
        <div class="rg-tabs" role="tablist">
          <button v-for="(item, i) in tables" :key="item.key" type="button" role="tab" class="rg-tab" :class="{ 'is-active': i === tab }"
            :aria-selected="i === tab" @click="moveTab(i)">
            <span class="ltr">{{ item.domain_symbol || item.symbol }}</span>{{ item.domain }}
          </button>
        </div>
        <Transition :name="`rg-slide-${direction}`" mode="out-in">
          <div v-if="table" :key="table.key + '-' + page" class="rg-card">
            <div class="rg-goal-head">
              <span class="rg-domain">{{ table.domain }} <span class="ltr">{{ table.domain_symbol }}</span></span>
              <p><b>{{ $t("ereport.tracking_goal") }}:</b> {{ table.general_goal }}</p>
            </div>
            <table class="rg-table">
              <colgroup>
                <col class="rg-col-num" /><col />
                <col v-for="column in TRACKING_COLUMNS" :key="column.key" :class="`rg-col-${column.key}`" />
              </colgroup>
              <thead>
                <tr>
                  <th class="rg-num">{{ $t("ereport.number") }}</th>
                  <th>{{ $t("ereport.tracking_short_goals") }}</th>
                  <th v-for="column in TRACKING_COLUMNS" :key="column.key">
                    {{ $t(column.title) }}<span class="rg-code ltr">{{ column.code }}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(goal, g) in shownGoals" :key="goal.id" :style="{ '--d': `${g * 50}ms` }">
                  <td class="rg-num ltr"><b>{{ goal.code }}</b></td>
                  <td class="rg-text">{{ goal.goal }}</td>
                  <template v-for="column in TRACKING_COLUMNS" :key="column.key">
                    <!-- MT: its steps, then its dates (from the DTT sheets) -->
                    <td v-if="column.key === 'mt'" class="rg-cell is-action" role="button" tabindex="0" aria-label="MT"
                      @click="openMt(goal)" @keydown.enter="openMt(goal)">
                      <span class="rg-mt-dots"><i v-for="s in goal.mt.steps" :key="s.step" :class="{ 'is-done': s.done }" /></span>
                      <TrackingDates :start="goal.mt.start || ''" :end="goal.mt.end || ''" />
                    </td>
                    <td v-else-if="column.key === 'gen'" class="rg-cell is-action" role="button" tabindex="0" :aria-label="$t('gen_title')"
                      @click="genGoalId = goal.id" @keydown.enter="genGoalId = goal.id">
                      <span v-if="genDots(goal).length" class="rg-gen-dots"><i v-for="item in genDots(goal)" :key="item.id" :class="`is-${item.status}`" /></span>
                      <i v-else class="pi pi-share-alt rg-add" />
                    </td>
                    <td v-else class="rg-cell">
                      <TrackingDates :start="columnDate(goal, column.key, 'start')" :end="columnDate(goal, column.key, 'end')" :editable="canEdit" :disabled="busy"
                        @change="(end, value) => saveDate(goal, column.key, end, value)">
                        <template v-if="column.key === 'prop' && canEdit" #end-empty>
                          <button type="button" class="rg-achieve" :disabled="busy" @click="achieve(goal)"><i class="pi pi-flag" />{{ $t("rg_achieved") }}</button>
                        </template>
                      </TrackingDates>
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
            <div v-if="pages > 1" class="rg-pages">
              <button v-for="n in pages" :key="n" type="button" :class="{ 'is-active': page === n - 1 }" @click="page = n - 1">{{ n }}</button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- GEN -->
    <GoalGeneralization v-if="genGoal" :sessionId="sessionId" :goal="genGoal" :kind="goals.kind" :canEdit="canEdit"
      @updated="updateGoal" @close="genGoalId = null" />

    <!-- MT1, MT2, MT3 -->
    <Dialog :visible="!!mtGoal" modal :header="mtGoal ? `${mtGoal.code} · MT` : ''" :style="{ width: '34rem' }" :breakpoints="{ '640px': '94vw' }"
      @update:visible="mtGoal = null">
      <template v-if="mtGoal">
        <p class="rg-mt-goal">{{ mtGoal.goal }}</p>
        <div class="rg-mt-steps">
          <button v-for="item in mtGoal.mt.steps" :key="item.step" type="button" class="rg-mt-step" :class="{ 'is-done': item.done }" @click="openSheet(item.step)">
            <span class="rg-mt-badge ltr">MT{{ item.step }}</span>
            <span class="rg-mt-state"><i :class="item.done ? 'pi pi-check-circle' : 'pi pi-circle'" />{{ item.done ? $t("rg_mt_done") : $t("rg_mt_not_done") }}</span>
            <small v-if="item.date" class="ltr">{{ item.date }}</small>
          </button>
        </div>
        <div class="rg-mt-dates">
          <span>{{ $t("ereport.trial_start") }}: <b class="ltr">{{ mtGoal.mt.start || "—" }}</b></span>
          <span>{{ $t("ereport.trial_end") }}: <b class="ltr">{{ mtGoal.mt.end || "—" }}</b></span>
        </div>
      </template>
    </Dialog>
  </section>
</template>

<style scoped>
.rg-root { display: grid; grid-template-rows: auto 1fr; gap: .7rem; min-height: 0; }
.rg-nav { display: flex; align-items: center; gap: .5rem; }
.rg-nav-count { min-width: 3.5rem; text-align: center; font-weight: 800; color: rgb(var(--bp-135c65)); }
.rg-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .5rem; color: #64748b; background: #fff; border-radius: 16px; }
.rg-empty i { font-size: 3rem; color: #94a3b8; }
.rg-board { display: grid; grid-template-rows: auto 1fr; gap: .6rem; min-height: 0; }
.rg-tabs { display: flex; gap: .4rem; overflow: hidden; flex-wrap: wrap; }
.rg-tab { display: inline-flex; align-items: center; gap: .4rem; padding: .35rem .8rem; border-radius: 999px; border: 1px solid #cbd5e1; background: #fff; cursor: pointer;
  font: inherit; font-size: .85rem; color: #475569; transition: all .2s; }
.rg-tab span { font-weight: 800; color: #0f8a7e; }
.rg-tab:hover { border-color: #0f8a7e; transform: translateY(-1px); }
.rg-tab.is-active { background: rgb(var(--bp-135c65)); border-color: rgb(var(--bp-135c65)); color: #fff; box-shadow: 0 8px 18px -12px rgb(var(--bp-135c65)); }
.rg-tab.is-active span { color: #99f6e4; }
.rg-card { min-height: 0; display: flex; flex-direction: column; gap: .5rem; padding: .8rem; border-radius: 16px; background: #fff; border: 1px solid #e2e8f0;
  box-shadow: 0 10px 30px -24px rgb(15 23 42 / .6); overflow: hidden; }
.rg-goal-head { display: flex; align-items: center; gap: .8rem; padding: .5rem .7rem; border-radius: 12px; background: linear-gradient(90deg, #e0f2f1, #f8fafc); }
.rg-domain { padding: .25rem .7rem; border-radius: 999px; background: rgb(var(--bp-135c65)); color: #fff; font-weight: 700; white-space: nowrap; }
.rg-goal-head p { margin: 0; color: #0f172a; }
.rg-table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: .85rem; }
.rg-table th, .rg-table td { border: 1px solid #cbd5e1; padding: .35rem .3rem; text-align: center; }
.rg-table th { background: rgb(var(--bp-135c65)); color: #fff; font-size: .75rem; line-height: 1.25; }
.rg-code { display: block; margin-top: 2px; color: #a7f3d0; font-size: .68rem; font-weight: 600; }
.rg-col-num { width: 3.4rem; }
.rg-col-prop { width: 7.6rem; }
.rg-col-mt { width: 6.8rem; }
.rg-col-exp, .rg-col-rr, .rg-col-ef, .rg-col-mf { width: 7.2rem; }
.rg-col-gen { width: 4.6rem; }
.rg-achieve { display: inline-flex; align-items: center; gap: .25rem; padding: .25rem .45rem; border-radius: 999px; border: 1px dashed #0f8a7e; background: #f0fdfa;
  color: #0f766e; font: inherit; font-size: .7rem; font-weight: 700; cursor: pointer; transition: transform .2s, background .2s; }
.rg-achieve:hover:not(:disabled) { background: #ccfbf1; transform: scale(1.05); }
.rg-add { color: #94a3b8; }
.rg-gen-dots { display: inline-flex; flex-wrap: wrap; justify-content: center; gap: .2rem; }
.rg-gen-dots i { width: .55rem; height: .55rem; border-radius: 50%; background: #f59e0b; }
.rg-gen-dots i.is-approved { background: #10b981; }
.rg-gen-dots i.is-rejected { background: #ef4444; }
.rg-text { text-align: start !important; line-height: 1.6; }
.rg-table tbody tr { animation: rg-row .4s var(--d) ease both; }
.rg-table .rg-cell { padding: .3rem .25rem; font-size: .8rem; color: #334155; }
.rg-cell.is-action { cursor: pointer; background: #f0fdfa; transition: background .2s, box-shadow .2s; }
.rg-cell.is-action:hover { background: #ccfbf1; box-shadow: inset 0 0 0 2px #14b8a6; }
.rg-mt-dots { display: inline-flex; gap: .25rem; margin-bottom: .25rem; }
.rg-mt-dots i { width: .55rem; height: .55rem; border-radius: 50%; background: #cbd5e1; }
.rg-mt-dots i.is-done { background: #10b981; }
.rg-pages { display: flex; justify-content: center; gap: .3rem; margin-top: auto; }
.rg-pages button { width: 1.8rem; height: 1.8rem; border-radius: 50%; border: 1px solid #cbd5e1; background: #fff; cursor: pointer; }
.rg-pages button.is-active { background: rgb(var(--bp-135c65)); color: #fff; }
.rg-mt-goal { margin: 0 0 .8rem; color: #475569; }
.rg-mt-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: .6rem; }
.rg-mt-step { display: flex; flex-direction: column; align-items: center; gap: .35rem; padding: .9rem .5rem; border-radius: 14px; border: 2px dashed #cbd5e1; background: #fff;
  cursor: pointer; font: inherit; transition: transform .2s cubic-bezier(.34, 1.56, .64, 1), border-color .2s; animation: rg-pop .35s ease both; }
.rg-mt-step:nth-child(2) { animation-delay: .06s; }
.rg-mt-step:nth-child(3) { animation-delay: .12s; }
.rg-mt-step:hover { transform: translateY(-4px); border-color: #0f8a7e; }
.rg-mt-step.is-done { border-style: solid; border-color: #34d399; background: #ecfdf5; }
.rg-mt-badge { font-size: 1.2rem; font-weight: 900; color: rgb(var(--bp-135c65)); }
.rg-mt-state { display: flex; align-items: center; gap: .3rem; font-size: .8rem; color: #64748b; }
.is-done .rg-mt-state { color: #047857; }
.rg-mt-dates { display: flex; justify-content: space-around; margin-top: 1rem; padding: .6rem; border-radius: 10px; background: #f8fafc; color: #475569; }
.rg-slide-next-enter-active, .rg-slide-next-leave-active, .rg-slide-prev-enter-active, .rg-slide-prev-leave-active { transition: all .3s cubic-bezier(.22, 1, .36, 1); }
.rg-slide-next-enter-from, .rg-slide-prev-leave-to { opacity: 0; transform: translateX(-40px); }
.rg-slide-next-leave-to, .rg-slide-prev-enter-from { opacity: 0; transform: translateX(40px); }
.rg-sheet-enter-active, .rg-sheet-leave-active { transition: all .3s ease; }
.rg-sheet-enter-from, .rg-sheet-leave-to { opacity: 0; transform: scale(.97); }
@keyframes rg-row { from { opacity: 0; transform: translateY(6px); } }
@keyframes rg-pop { from { opacity: 0; transform: scale(.85); } }
</style>
