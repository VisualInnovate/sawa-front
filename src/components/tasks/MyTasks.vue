<script setup>
// «ما ينتظرك»: what waits for the signed-in user (GET api/my-tasks): approvals in the flows (the simple ones decided
// here, the ones that need reading opened), evaluations to distribute or to do, work sent back, the smaller lists with
// their own pages, today's sessions, and their own requests waiting for others. Read again every minute while shown.
import axios from "axios";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { openAppLink } from "@/utils/appLink";
import { useToast } from "primevue/usetoast";
import { getEvaluationTypeLabel } from "@/utils/evaluationTypes";
import { refreshPendingCounts } from "@/utils/pendingCounts";

const props = defineProps({
  // The welcome page lists my evaluation requests with their «start» button itself.
  hideMyEvaluations: { type: Boolean, default: false },
  // The statistics dashboard: the lists start closed (a title with its count; the arrow opens it).
  collapsed: { type: Boolean, default: false },
});

const { t, locale } = useI18n();
const router = useRouter();
const toast = useToast();
const data = ref(null);
const loading = ref(true);
const deciding = ref(null);
const rejecting = ref(null); // { row, note }
const showRequests = ref(false);
// Each list folds under its title; what the user opened or closed is kept for the next visit.
const FOLD_KEY = "my-tasks-folds";
const readFolds = () => {
  try {
    return JSON.parse(localStorage.getItem(FOLD_KEY) || "{}") || {};
  } catch {
    return {};
  }
};
const folds = ref(readFolds());
const isOpen = (key) => folds.value[key] ?? !props.collapsed;
function toggle(key) {
  folds.value = { ...folds.value, [key]: !isOpen(key) };
  try {
    localStorage.setItem(FOLD_KEY, JSON.stringify(folds.value));
  } catch {
    // Private mode: the choice lasts for this visit only.
  }
}

// Decided here: a yes / no on a request. The rest (an evaluation, a plan, a leave with its items…) is read on its page first.
const QUICK = ["departure", "advance", "overtime", "transport", "refund"];
const quick = (row) => row.can_act && QUICK.includes(row.flow?.key);

const flowName = (flow) => (flow ? (locale.value === "ar" ? flow.name_ar : flow.name_en || flow.name_ar) : "");
const typeName = (type) => (type ? getEvaluationTypeLabel(type, t) : "");

async function load() {
  try {
    data.value = (await axios.get("api/my-tasks")).data.data;
  } catch {
    // Offline or signed out: keep what is shown.
  } finally {
    loading.value = false;
  }
}

let timer = null;
const tick = () => document.visibilityState === "visible" && load();
onMounted(() => {
  load();
  timer = setInterval(tick, 60_000);
});
onBeforeUnmount(() => clearInterval(timer));

// Who the page speaks to: the system admin (an overview, nothing is theirs), the general manager, a head / deputy, staff.
const context = computed(() => data.value?.context ?? { kind: "staff" });
const isAdmin = computed(() => context.value.kind === "admin");
const title = computed(() => (isAdmin.value ? t("tasks.title_admin") : t("tasks.title")));
const hint = computed(() => {
  const c = context.value;
  if (c.kind === "admin") return t("tasks.hint_admin");
  if (c.kind === "general_manager") return t("tasks.hint_gm");
  if (c.kind === "head") return t("tasks.hint_head", { departments: c.heads.join("، ") });
  if (c.kind === "deputy") return t("tasks.hint_deputy", { departments: c.deputy_of.join("، ") });
  if (c.role) return c.department ? t("tasks.hint_role_dept", { role: c.role, department: c.department }) : t("tasks.hint_role", { role: c.role });
  return t("tasks.hint");
});
const oversight = computed(() => data.value?.oversight ?? []);
function oversightLabel(row) {
  if (row.key === "flow") return [flowName(row.flow), row.stage].filter(Boolean).join(" — ");
  if (row.key === "distribute") return t("tasks.ov_distribute", { department: row.department ?? "—" });
  if (row.key === "old_evaluations") return t("tasks.ov_old_evaluations");
  if (row.key === "toilet_consults") return `${t("tasks.o_toilet_consults")} — ${t(`toilet.dept_${row.department}`)}`;
  return t(`tasks.o_${row.key}`);
}

const summary = computed(() => data.value?.summary ?? { late: 0, approvals: 0, to_do: 0, returned: 0 });
const consultations = computed(() => [...(data.value?.consultations ?? [])].sort((a, b) => Number(b.late) - Number(a.late)));
const myEvaluations = computed(() => (props.hideMyEvaluations ? [] : data.value?.my_evaluations ?? []));
const nothing = computed(() => data.value && !isAdmin.value && !summary.value.approvals && !summary.value.returned && !data.value.distribute.length
  && !myEvaluations.value.length && !data.value.others.length && !consultations.value.length);

// The deadline: «متبقي 5 س» or «متأخر 2 س».
function deadline(row) {
  if (row.minutes_left === null || row.minutes_left === undefined) return null;
  const minutes = Math.abs(row.minutes_left);
  const text = minutes >= 1440 ? t("tasks.days", { n: Math.round(minutes / 1440) }) : minutes >= 60 ? t("tasks.hours", { n: Math.round(minutes / 60) }) : t("tasks.minutes", { n: minutes });
  return row.minutes_left < 0 ? { late: true, text: t("tasks.late_by", { time: text }) } : { late: false, text: t("tasks.left", { time: text }) };
}

function open(row) {
  if (row.url) openAppLink(router, row.url);
}

async function decide(row, decision, note = null) {
  deciding.value = row.id;
  try {
    await axios.post(`api/approvals/${row.id}/decide`, { decision, note });
    toast.add({ severity: "success", summary: t("success_message"), detail: decision === "approve" ? t("tasks.approved") : t("tasks.rejected"), life: 2500 });
    rejecting.value = null;
    await load();
    refreshPendingCounts();
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message || t("mission_error"), life: 4000 });
  } finally {
    deciding.value = null;
  }
}
</script>

<template>
  <section class="mt">
    <header class="mt-head">
      <div>
        <h2><i :class="isAdmin ? 'pi pi-chart-bar' : 'pi pi-inbox'" aria-hidden="true" /> {{ title }}</h2>
        <p>{{ hint }}</p>
      </div>
      <Button icon="pi pi-refresh" text rounded :loading="loading" :aria-label="$t('tasks.refresh')" v-tooltip.top="$t('tasks.refresh')" @click="load" />
    </header>

    <div v-if="loading && !data" class="mt-loading"><i class="pi pi-spin pi-spinner" /></div>
    <template v-else-if="data">
      <div v-if="!isAdmin || summary.approvals || summary.returned || summary.to_do" class="mt-counters">
        <div class="mt-counter is-late" :class="{ 'is-zero': !summary.late }"><b>{{ summary.late }}</b><span>{{ $t("tasks.c_late") }}</span></div>
        <div class="mt-counter" :class="{ 'is-zero': !summary.approvals }"><b>{{ summary.approvals }}</b><span>{{ $t("tasks.c_approvals") }}</span></div>
        <div class="mt-counter" :class="{ 'is-zero': !summary.to_do }"><b>{{ summary.to_do }}</b><span>{{ $t("tasks.c_to_do") }}</span></div>
        <div class="mt-counter" :class="{ 'is-zero': !summary.returned }"><b>{{ summary.returned }}</b><span>{{ $t("tasks.c_returned") }}</span></div>
      </div>

      <div v-if="data.sessions_today" class="mt-sessions">
        <i class="pi pi-calendar-clock" aria-hidden="true" />
        <span>{{ $t("tasks.sessions_today", { total: data.sessions_today.total, left: data.sessions_today.left }) }}</span>
        <span v-if="data.sessions_today.next">· {{ $t("tasks.next_session", { time: data.sessions_today.next }) }}</span>
        <Button :label="$t('tasks.my_schedule')" size="small" text @click="router.push({ name: data.sessions_today.route })" />
      </div>

      <p v-if="nothing" class="mt-empty"><i class="pi pi-check-circle" aria-hidden="true" /> {{ $t("tasks.nothing") }}</p>

      <!-- Approvals in the flows, the oldest deadline first (late at the top). -->
      <div v-if="data.approvals.length" class="mt-block">
        <h3>
          <button type="button" class="mt-fold" :aria-expanded="isOpen('approvals')" @click="toggle('approvals')">
            <i :class="isOpen('approvals') ? 'pi pi-chevron-down' : 'pi pi-chevron-left'" aria-hidden="true" />
            {{ $t("tasks.s_approvals") }} <Tag :value="data.approvals.length" rounded />
          </button>
        </h3>
        <ul v-show="isOpen('approvals')" class="mt-list">
          <li v-for="row in [...data.approvals].sort((a, b) => (a.minutes_left ?? 1e9) - (b.minutes_left ?? 1e9))" :key="row.id" class="mt-row">
            <div class="mt-main">
              <Tag :value="flowName(row.flow)" severity="secondary" />
              <b>{{ row.title }}</b>
              <small>
                <span v-if="row.stage">{{ row.stage.name }}</span>
                <span v-if="row.requester"> · {{ $t("tasks.from", { name: row.requester }) }}</span>
                <span v-if="row.on_behalf_of"> · {{ $t("tasks.instead_of", { name: row.on_behalf_of }) }}</span>
                <span v-if="row.stage_started_at"> · {{ $t("tasks.since", { at: row.stage_started_at }) }}</span>
              </small>
            </div>
            <span v-if="deadline(row)" class="mt-deadline" :class="{ 'is-late': deadline(row).late }">{{ deadline(row).text }}</span>
            <div class="mt-actions">
              <template v-if="quick(row)">
                <Button icon="pi pi-check" :label="$t('tasks.approve')" size="small" severity="success" :loading="deciding === row.id" @click="decide(row, 'approve')" />
                <Button icon="pi pi-times" :label="$t('tasks.reject')" size="small" severity="danger" outlined :disabled="deciding === row.id"
                  @click="rejecting = { row, note: '' }" />
              </template>
              <Button v-if="row.url" icon="pi pi-external-link" :label="$t('tasks.open')" size="small" outlined @click="open(row)" />
              <Button v-else icon="pi pi-inbox" :label="$t('tasks.open')" size="small" outlined @click="router.push({ name: 'approvals-inbox' })" />
            </div>
          </li>
        </ul>
      </div>

      <!-- Evaluations on the old one-step approval (a department without a head). -->
      <div v-if="data.old_evaluations.count" class="mt-block">
        <h3>
          <button type="button" class="mt-fold" :aria-expanded="isOpen('old')" @click="toggle('old')">
            <i :class="isOpen('old') ? 'pi pi-chevron-down' : 'pi pi-chevron-left'" aria-hidden="true" />
            {{ $t("tasks.s_old_evaluations") }} <Tag :value="data.old_evaluations.count" rounded />
          </button>
        </h3>
        <ul v-show="isOpen('old')" class="mt-list">
          <li v-for="row in data.old_evaluations.items" :key="row.key" class="mt-row">
            <div class="mt-main">
              <Tag v-if="row.evaluation_type" :value="typeName(row.evaluation_type)" severity="secondary" />
              <b>{{ row.child }}</b>
              <small><span v-if="row.therapist">{{ row.therapist }}</span><span v-if="row.since"> · {{ $t("tasks.since", { at: row.since }) }}</span></small>
            </div>
            <div class="mt-actions"><Button icon="pi pi-external-link" :label="$t('tasks.open')" size="small" outlined @click="open(row)" /></div>
          </li>
        </ul>
        <Button v-if="isOpen('old') && data.old_evaluations.count > data.old_evaluations.items.length" :label="$t('tasks.all', { n: data.old_evaluations.count })" text size="small"
          @click="router.push({ name: 'evaluation-approvals' })" />
      </div>

      <!-- «مطلوب»: evaluations my department was asked for, to give to someone. -->
      <div v-if="data.distribute.length" class="mt-block">
        <h3>
          <button type="button" class="mt-fold" :aria-expanded="isOpen('distribute')" @click="toggle('distribute')">
            <i :class="isOpen('distribute') ? 'pi pi-chevron-down' : 'pi pi-chevron-left'" aria-hidden="true" />
            {{ $t("tasks.s_distribute") }} <Tag :value="data.distribute.length" rounded />
          </button>
        </h3>
        <ul v-show="isOpen('distribute')" class="mt-list">
          <li v-for="row in data.distribute" :key="row.id" class="mt-row">
            <div class="mt-main">
              <Tag :value="typeName(row.evaluation_type)" severity="secondary" />
              <b>{{ row.child }}</b>
              <small><span v-if="row.department">{{ row.department }}</span><span v-if="row.requested_by"> · {{ $t("tasks.from", { name: row.requested_by }) }}</span>
                <span v-if="row.since"> · {{ $t("tasks.since", { at: row.since }) }}</span></small>
            </div>
            <div class="mt-actions"><Button icon="pi pi-share-alt" :label="$t('tasks.distribute')" size="small" outlined @click="open(row)" /></div>
          </li>
        </ul>
      </div>

      <div v-if="myEvaluations.length" class="mt-block">
        <h3>
          <button type="button" class="mt-fold" :aria-expanded="isOpen('mine')" @click="toggle('mine')">
            <i :class="isOpen('mine') ? 'pi pi-chevron-down' : 'pi pi-chevron-left'" aria-hidden="true" />
            {{ $t("tasks.s_my_evaluations") }} <Tag :value="myEvaluations.length" rounded />
          </button>
        </h3>
        <ul v-show="isOpen('mine')" class="mt-list">
          <li v-for="row in myEvaluations" :key="row.id" class="mt-row">
            <div class="mt-main">
              <Tag :value="typeName(row.evaluation_type)" severity="secondary" />
              <b>{{ row.child }}</b>
              <small><span v-if="row.date" dir="ltr">{{ row.date }} {{ row.time || "" }}</span><span v-if="row.started"> · {{ $t("tasks.started") }}</span></small>
            </div>
            <span v-if="row.late" class="mt-deadline is-late">{{ $t("tasks.not_started") }}</span>
            <div class="mt-actions"><Button icon="pi pi-external-link" :label="$t('tasks.open')" size="small" outlined @click="open(row)" /></div>
          </li>
        </ul>
      </div>

      <!-- The consultant's confirmed consultations: late ones (result not written) first, then today and the coming days. -->
      <div v-if="consultations.length" class="mt-block">
        <h3>
          <button type="button" class="mt-fold" :aria-expanded="isOpen('consultations')" @click="toggle('consultations')">
            <i :class="isOpen('consultations') ? 'pi pi-chevron-down' : 'pi pi-chevron-left'" aria-hidden="true" />
            {{ $t("tasks.s_consultations") }} <Tag :value="consultations.length" rounded />
          </button>
        </h3>
        <ul v-show="isOpen('consultations')" class="mt-list">
          <li v-for="row in consultations" :key="row.id" class="mt-row">
            <div class="mt-main">
              <Tag :value="row.late ? $t('tasks.c_result_missing') : row.today ? $t('tasks.today') : $t('tasks.upcoming')" :severity="row.late ? 'danger' : row.today ? 'success' : 'secondary'" />
              <b>{{ row.child }}</b>
              <small><span dir="ltr">{{ row.date }} {{ row.time }}</span></small>
            </div>
            <div class="mt-actions"><Button icon="pi pi-external-link" :label="$t('tasks.open')" size="small" outlined @click="open(row)" /></div>
          </li>
        </ul>
      </div>

      <!-- My work sent back to me, with why. -->
      <div v-if="data.returned.length" class="mt-block">
        <h3>
          <button type="button" class="mt-fold" :aria-expanded="isOpen('returned')" @click="toggle('returned')">
            <i :class="isOpen('returned') ? 'pi pi-chevron-down' : 'pi pi-chevron-left'" aria-hidden="true" />
            {{ $t("tasks.s_returned") }} <Tag :value="data.returned.length" severity="warn" rounded />
          </button>
        </h3>
        <ul v-show="isOpen('returned')" class="mt-list">
          <li v-for="(row, i) in data.returned" :key="row.id ?? 'r' + i" class="mt-row">
            <div class="mt-main">
              <Tag :value="row.evaluation_type ? typeName(row.evaluation_type) : flowName(row.flow)" severity="warn" />
              <b>{{ row.title }}</b>
              <small v-if="row.note" class="mt-note">{{ $t("tasks.reason", { note: row.note }) }}</small>
            </div>
            <div class="mt-actions"><Button icon="pi pi-pencil" :label="$t('tasks.fix')" size="small" outlined :disabled="!row.url" @click="open(row)" /></div>
          </li>
        </ul>
      </div>

      <!-- The smaller lists: their own pages. -->
      <div v-if="data.others.length" class="mt-others">
        <button v-for="row in data.others" :key="row.key" type="button" class="mt-other" @click="router.push({ name: row.route })">
          <b>{{ row.count }}</b><span>{{ $t(`tasks.o_${row.key}`) }}</span><i class="pi pi-angle-left" aria-hidden="true" />
        </button>
      </div>

      <!-- What I asked for, waiting for someone else. -->
      <div v-if="data.my_requests.length" class="mt-block is-soft">
        <button type="button" class="mt-toggle" :aria-expanded="showRequests" @click="showRequests = !showRequests">
          <i :class="showRequests ? 'pi pi-chevron-down' : 'pi pi-chevron-left'" aria-hidden="true" />
          {{ $t("tasks.s_my_requests") }} <Tag :value="data.my_requests.length" severity="secondary" rounded />
        </button>
        <ul v-if="showRequests" class="mt-list">
          <li v-for="row in data.my_requests" :key="row.id" class="mt-row">
            <div class="mt-main">
              <Tag :value="flowName(row.flow)" severity="secondary" />
              <b>{{ row.title }}</b>
              <small><span v-if="row.stage">{{ row.stage }}</span>
                <span v-if="row.waiting_for.length"> · {{ $t("tasks.waiting_for", { names: row.waiting_for.join("، ") }) }}</span>
                <span v-if="row.since"> · {{ $t("tasks.since", { at: row.since }) }}</span></small>
            </div>
            <div class="mt-actions"><Button v-if="row.url" icon="pi pi-external-link" :label="$t('tasks.open')" size="small" text @click="open(row)" /></div>
          </li>
        </ul>
      </div>

      <!-- The academy's open work and whom it waits for (the system admin first, the general manager after their own). -->
      <div v-if="data.oversight" class="mt-block mt-oversight" :class="{ 'is-first': isAdmin }">
        <h3>
          <button type="button" class="mt-fold" :aria-expanded="isOpen('oversight')" @click="toggle('oversight')">
            <i :class="isOpen('oversight') ? 'pi pi-chevron-down' : 'pi pi-chevron-left'" aria-hidden="true" />
            {{ $t("tasks.s_oversight") }} <Tag :value="oversight.reduce((n, r) => n + r.count, 0)" severity="secondary" rounded />
          </button>
        </h3>
        <template v-if="isOpen('oversight')">
          <p v-if="!oversight.length" class="mt-empty"><i class="pi pi-check-circle" aria-hidden="true" /> {{ $t("tasks.ov_nothing") }}</p>
          <ul v-else class="mt-list">
            <li v-for="(row, i) in oversight" :key="i" class="mt-row">
              <div class="mt-main">
                <b>{{ oversightLabel(row) }}</b>
                <small>
                  <Tag :value="String(row.count)" rounded />
                  <Tag v-if="row.late" :value="$t('tasks.ov_late', { n: row.late })" severity="danger" rounded class="ms-1" />
                  <span v-if="row.waiting_for.length"> {{ $t("tasks.waiting_for", { names: row.waiting_for.join("، ") }) }}</span>
                  <span v-else-if="row.nobody" class="text-red-600"> {{ $t("tasks.ov_nobody") }}</span>
                  <span v-if="row.since"> · {{ $t("tasks.since", { at: row.since }) }}</span>
                </small>
              </div>
              <div class="mt-actions"><Button v-if="row.url" icon="pi pi-external-link" :label="$t('tasks.open')" size="small" text @click="open(row)" /></div>
            </li>
          </ul>
        </template>
      </div>
    </template>

    <Dialog :visible="!!rejecting" @update:visible="(v) => { if (!v) rejecting = null; }" modal :header="$t('tasks.reject')" :style="{ width: '28rem' }" :breakpoints="{ '600px': '95vw' }">
      <form v-if="rejecting" class="flex flex-column gap-3" @submit.prevent="decide(rejecting.row, 'reject', rejecting.note)">
        <p class="m-0"><b>{{ rejecting.row.title }}</b></p>
        <label for="mt-reason">{{ $t("tasks.reject_reason") }}</label>
        <Textarea id="mt-reason" v-model="rejecting.note" rows="3" autoResize :required="rejecting.row.stage?.reject_note_required !== false" />
        <Button type="submit" severity="danger" icon="pi pi-times" :label="$t('tasks.reject')" :loading="deciding === rejecting.row.id" />
      </form>
    </Dialog>
  </section>
</template>

<style scoped>
.mt { width: 100%; background: #fff; border: 1px solid rgb(var(--bp-135c65) / 0.14); border-radius: 18px; box-shadow: 0 8px 24px rgb(var(--bp-135c65) / 0.07); padding: 1.25rem 1.5rem; }
.mt { display: flex; flex-direction: column; }
.mt-head { order: -2; }
.mt-oversight.is-first { order: -1; margin-top: 1rem; }
.mt-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
.mt-head h2 { margin: 0 0 .25rem; font-size: 1.2rem; font-weight: 700; color: rgb(var(--bp-135c65)); }
.mt-head p { margin: 0; color: #6b7280; font-size: .9rem; }
.mt-loading { display: flex; justify-content: center; padding: 2rem; font-size: 1.5rem; }
.mt-counters { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .75rem; margin: 1rem 0; }
.mt-counter { border-radius: 14px; padding: .8rem 1rem; background: rgb(var(--bp-135c65) / 0.08); color: rgb(var(--bp-135c65)); display: flex; flex-direction: column; }
.mt-counter b { font-size: 1.6rem; line-height: 1.1; }
.mt-counter span { font-size: .85rem; }
.mt-counter.is-late { background: #fef2f2; color: #b91c1c; }
.mt-counter.is-zero { opacity: .55; }
.mt-sessions { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; padding: .6rem .9rem; border-radius: 12px; background: #f8fafc; margin-bottom: 1rem; }
.mt-empty { text-align: center; color: #15803d; font-weight: 600; padding: 1rem 0; margin: 0; }
.mt-block { margin-top: 1.1rem; }
.mt-block h3 { display: flex; align-items: center; gap: .5rem; margin: 0 0 .5rem; font-size: 1rem; font-weight: 700; color: #1f2937; }
.mt-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .5rem; }
.mt-row { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; padding: .7rem .9rem; border: 1px solid #e5e7eb; border-radius: 12px; }
.mt-main { flex: 1 1 18rem; min-width: 0; display: flex; flex-wrap: wrap; align-items: center; gap: .4rem .6rem; }
.mt-main small { flex-basis: 100%; color: #6b7280; }
.mt-note { color: #b45309 !important; }
.mt-deadline { font-size: .8rem; font-weight: 600; padding: .2rem .6rem; border-radius: 999px; background: #ecfdf5; color: #047857; white-space: nowrap; }
.mt-deadline.is-late { background: #fef2f2; color: #b91c1c; }
.mt-actions { display: flex; flex-wrap: wrap; gap: .4rem; }
.mt-others { display: flex; flex-wrap: wrap; gap: .6rem; margin-top: 1.1rem; }
.mt-other { display: flex; align-items: center; gap: .5rem; padding: .6rem .9rem; border-radius: 12px; border: 1px solid rgb(var(--bp-135c65) / 0.2); background: #fff; cursor: pointer; color: #1f2937; }
.mt-other b { color: rgb(var(--bp-135c65)); font-size: 1.1rem; }
.mt-fold { display: flex; align-items: center; gap: .5rem; width: 100%; background: none; border: 0; padding: .35rem 0; font: inherit; color: inherit; cursor: pointer; text-align: start; }
.mt-fold:hover { color: rgb(var(--bp-135c65)); }
.mt-fold > .pi { font-size: .8rem; color: #64748b; }
.mt-toggle { display: flex; align-items: center; gap: .5rem; background: none; border: 0; padding: 0; font-weight: 700; color: #475569; cursor: pointer; margin-bottom: .5rem; }
@media (max-width: 640px) {
  .mt { padding: 1rem; }
  .mt-counters { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
</style>
