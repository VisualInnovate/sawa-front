<script setup>
// The plan and the goals: the goals the sessions work on now (the tracking the management approved), what was
// reached in each, and the home generalizations the therapist asks for — the parent approves or refuses them
// here (with the reason), the same decision as on the generalizations page.
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import axios from "axios";
import EmptyState from "@/components/parent/EmptyState.vue";
import DecisionDialog from "@/components/sessions/DecisionDialog.vue";
import { refreshPendingCounts } from "@/utils/pendingCounts";
import { useParentPortalStore } from "@/stores/ParentPortal";
import { fmtDate, meta } from "@/utils/parentPortal";

const props = defineProps({ child: { type: Object, required: true }, childId: { type: [Number, String], required: true } });
const emit = defineEmits(["changed"]);
const { t } = useI18n();
const toast = useToast();
const portal = useParentPortalStore();

const loading = ref(true);
const data = ref(null);
const deciding = ref(false);
const current = ref(null);

async function load() {
  loading.value = true;
  try {
    data.value = (await axios.get(`/api/parent/child/${props.childId}/portal/plan`)).data;
  } catch {
    data.value = null;
  } finally {
    loading.value = false;
  }
}
onMounted(load);

const current_goals = computed(() => data.value?.current ?? []);
const plans = computed(() => data.value?.plans ?? []);
const achieved = computed(() => current_goals.value.filter((goal) => goal.achieved_at).length);
const percent = computed(() => (current_goals.value.length ? Math.round((achieved.value / current_goals.value.length) * 100) : 0));
const homeOf = (goal) => (goal.generalizations ?? []).filter((row) => row.type === "home");
const pendingHome = (goal) => homeOf(goal).find((row) => row.status === "pending");

async function decide(answer) {
  deciding.value = true;
  try {
    await axios.post(`/api/parent/goal-generalizations/${current.value.row.id}/decide`, answer);
    toast.add({ severity: "success", summary: t("success_message"), detail: answer.approved ? t("gen_approved_done") : t("gen_rejected_done"), life: 2500 });
    current.value = null;
    await load();
    refreshPendingCounts("parent");
    portal.refresh();
    emit("changed");
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: error.response?.data?.message ?? t("mission_error"), life: 3000 });
  } finally {
    deciding.value = false;
  }
}
</script>

<template>
  <div class="pp-stack">
    <div v-if="loading" class="pp-stack">
      <div class="pp-skeleton" style="height: 110px" />
      <div v-for="i in 3" :key="i" class="pp-skeleton" style="height: 120px" />
    </div>

    <template v-else>
      <!-- Where the plan stands -->
      <section class="pp-card pp-card--pad pp-plan-head pp-in">
        <div class="pp-ring" :style="{ '--value': percent, '--size': '84px' }"><span>{{ percent }}%</span></div>
        <div class="min-w-0 flex-1">
          <h2 class="pp-h2">{{ $t("pp.plan_title") }}</h2>
          <p v-if="data?.tracking" class="pp-lead text-sm mt-1">
            {{ $t("pp.plan_approved_on", { date: fmtDate(data.tracking.decided_at), n: current_goals.length }) }}
            · {{ $t("pp.plan_achieved", { n: achieved }) }}
          </p>
          <p v-else-if="data?.pending_tracking" class="pp-lead text-sm mt-1">{{ $t("pp.plan_waiting", { date: fmtDate(data.pending_tracking.requested_at) }) }}</p>
          <p v-else class="pp-lead text-sm mt-1">{{ $t("pp.plan_none") }}</p>
          <div class="pp-row mt-2">
            <span v-if="data?.tracking" class="pp-tag pp-tag--success"><i class="pi pi-check-circle" /> {{ $t("pp.plan_tag_approved") }}</span>
            <span v-else-if="data?.pending_tracking" class="pp-tag pp-tag--warn"><i class="pi pi-clock" /> {{ $t("pp.plan_tag_waiting") }}</span>
            <router-link :to="{ name: 'parent-generalizations' }" class="pp-link text-sm">{{ $t("gen_parent_title") }} <i class="pi pi-angle-left rtl-arrow" /></router-link>
          </div>
        </div>
      </section>

      <!-- The goals the sessions work on -->
      <section v-if="current_goals.length" class="pp-stack pp-in" :style="{ '--i': 1 }">
        <h2 class="pp-h2"><i class="pi pi-flag text-[var(--pp-teal)]" /> {{ $t("pp.plan_current_goals") }}</h2>
        <article v-for="(goal, i) in current_goals" :key="goal.id" class="pp-card pp-card--pad pp-goal pp-in" :style="{ '--i': i + 2 }" :class="{ 'is-done': goal.achieved_at }">
          <div class="pp-goal__top">
            <span class="pp-goal__code">{{ goal.code }}</span>
            <div class="min-w-0 flex-1">
              <p class="pp-item__meta">{{ goal.domain }}<template v-if="goal.general_goal"> · {{ goal.general_goal }}</template></p>
              <p class="pp-goal__text">{{ goal.goal }}</p>
            </div>
            <span v-if="goal.achieved_at" class="pp-tag pp-tag--success"><i class="pi pi-check" /> {{ $t("pp.goal_achieved", { date: fmtDate(goal.achieved_at) }) }}</span>
            <span v-else-if="goal.prop_start" class="pp-tag pp-tag--info"><i class="pi pi-play" /> {{ $t("pp.goal_started", { date: fmtDate(goal.prop_start) }) }}</span>
            <span v-else class="pp-tag"><i class="pi pi-clock" /> {{ $t("pp.goal_not_started") }}</span>
          </div>

          <div v-if="goal.attempts.length" class="pp-goal__attempts" :title="$t('pp.goal_attempts', { done: goal.progress.done, total: goal.progress.total })">
            <span v-for="attempt in goal.attempts" :key="attempt.date" class="pp-goal__dot" :class="{ 'is-ok': attempt.achieved }" :title="fmtDate(attempt.date)" />
            <small class="pp-muted">{{ $t("pp.goal_attempts", { done: goal.progress.done, total: goal.progress.total }) }}</small>
          </div>

          <div v-if="homeOf(goal).length" class="pp-goal__home">
            <div v-for="row in homeOf(goal)" :key="row.id" class="pp-row pp-between">
              <span class="pp-row">
                <i class="pi pi-home text-[var(--pp-magenta)]" aria-hidden="true" />
                <span>{{ $t("pp.goal_home_request") }}<template v-if="row.created_at"> · {{ fmtDate(row.created_at) }}</template></span>
                <span class="pp-tag" :class="`pp-tag--${meta('generalization', row.status).severity}`">{{ meta("generalization", row.status).label }}</span>
              </span>
              <button v-if="row.status === 'pending'" type="button" class="pp-btn pp-btn--magenta pp-btn--sm" @click="current = { goal, row }"><i class="pi pi-check-square" /> {{ $t("decision_answer") }}</button>
              <small v-else-if="row.status === 'rejected' && row.note" class="text-[var(--pp-danger)]">{{ row.note }}</small>
            </div>
          </div>
        </article>
      </section>

      <!-- The plans of the approved evaluations -->
      <section v-if="plans.length" class="pp-stack pp-in" :style="{ '--i': 3 }">
        <h2 class="pp-h2"><i class="pi pi-list text-[var(--pp-teal)]" /> {{ $t("pp.plan_plans") }}</h2>
        <details v-for="plan in plans" :key="plan.id" class="pp-card pp-plan">
          <summary class="pp-plan__summary">
            <span><b>{{ plan.evaluation?.name || plan.evaluation?.title }}</b> <span class="pp-muted">· {{ fmtDate(plan.evaluation?.date) }}</span></span>
            <span class="pp-tag pp-tag--teal">{{ $t("pp.plan_goals_n", { n: plan.goals.length }) }}</span>
          </summary>
          <ol class="pp-plan__goals">
            <li v-for="goal in plan.goals" :key="goal.id">
              <span class="pp-goal__code">{{ goal.code }}</span>
              <span><small class="pp-muted block">{{ goal.domain }}</small>{{ goal.goal }}</span>
              <i v-if="goal.achieved_at" class="pi pi-check-circle text-[var(--pp-success)]" :title="fmtDate(goal.achieved_at)" aria-hidden="true" />
            </li>
          </ol>
        </details>
      </section>

      <EmptyState v-if="!current_goals.length && !plans.length" icon="pi pi-flag" :title="$t('pp.plan_none_title')" :text="$t('pp.plan_none_text')" />
    </template>

    <DecisionDialog :visible="!!current" :title="$t('gen_home_decide')" :loading="deciding" @update:visible="current = null" @decide="decide">
      <template v-if="current">
        <p class="m-0"><b>{{ child.name }}</b> · {{ current.goal.code }}</p>
        <p class="mt-2 mb-0 pp-muted">{{ current.goal.goal }}</p>
      </template>
    </DecisionDialog>
  </div>
</template>

<style scoped>
.pp-plan-head {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.pp-goal {
  display: grid;
  gap: 0.75rem;
}
.pp-goal.is-done {
  border-color: rgba(15, 138, 95, 0.35);
}
.pp-goal__top {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.pp-goal__code {
  display: inline-grid;
  place-items: center;
  min-width: 46px;
  height: 36px;
  padding: 0 0.5rem;
  border-radius: 10px;
  background: var(--pp-teal-50);
  color: var(--pp-teal-900);
  font-weight: 800;
  font-size: 0.85rem;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}
.pp-goal__text {
  margin: 0.1rem 0 0;
  font-weight: 700;
  line-height: 1.7;
  color: var(--pp-ink);
}
.pp-goal__attempts {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.3rem;
}
.pp-goal__dot {
  width: 14px;
  height: 14px;
  border-radius: 4px;
  background: var(--pp-sand-200);
}
.pp-goal__dot.is-ok {
  background: var(--pp-success);
}
.pp-goal__attempts small {
  margin-inline-start: 0.4rem;
}
.pp-goal__home {
  display: grid;
  gap: 0.5rem;
  padding: 0.75rem 0.9rem;
  border-radius: 12px;
  background: var(--pp-magenta-50);
  font-size: 0.9rem;
}
.pp-plan {
  padding: 0;
  overflow: hidden;
}
.pp-plan__summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  cursor: pointer;
  list-style: none;
}
.pp-plan__summary::-webkit-details-marker {
  display: none;
}
.pp-plan__goals {
  margin: 0;
  padding: 0 1.25rem 1rem;
  display: grid;
  gap: 0.5rem;
  list-style: none;
}
.pp-plan__goals li {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.6rem 0.75rem;
  border-radius: 12px;
  background: var(--pp-sand);
  line-height: 1.6;
}
.pp-plan__goals li > span:last-of-type {
  flex: 1;
}
[dir="ltr"] .rtl-arrow {
  transform: scaleX(-1);
}
</style>
