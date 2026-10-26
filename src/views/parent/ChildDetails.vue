<script setup>
// One child's file: who they are, then everything the academy keeps about them in tabs — evaluations with their
// charts, the reports, the plan and the goals (with the home generalizations to answer), the program and its
// sessions, the fees and what was paid, and the consultations.
import { computed, defineAsyncComponent, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "axios";
import ChildAvatar from "@/components/parent/ChildAvatar.vue";
import EmptyState from "@/components/parent/EmptyState.vue";
import PageHead from "@/components/parent/PageHead.vue";
import { ageText, fmtShortDate, fmtTime, isGirl, isToday, meta, money } from "@/utils/parentPortal";

const props = defineProps({ child_id: { type: [String, Number], required: true } });
const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const TABS = [
  { key: "overview", icon: "pi pi-th-large", label: "pp.tab_overview", component: defineAsyncComponent(() => import("./child/OverviewTab.vue")) },
  { key: "evaluations", icon: "pi pi-clipboard", label: "pp.tab_evaluations", component: defineAsyncComponent(() => import("./child/EvaluationsTab.vue")) },
  { key: "reports", icon: "pi pi-chart-bar", label: "pp.tab_reports", component: defineAsyncComponent(() => import("./child/ReportsTab.vue")) },
  { key: "plan", icon: "pi pi-flag", label: "pp.tab_plan", component: defineAsyncComponent(() => import("./child/PlanTab.vue")) },
  { key: "program", icon: "pi pi-book", label: "pp.tab_program", component: defineAsyncComponent(() => import("./child/ProgramTab.vue")) },
  { key: "finance", icon: "pi pi-wallet", label: "pp.tab_finance", component: defineAsyncComponent(() => import("./child/FinanceTab.vue")) },
  { key: "consultations", icon: "pi pi-comments", label: "pp.tab_consultations", component: defineAsyncComponent(() => import("./child/ConsultationsTab.vue")) },
];

const overview = ref(null);
const loading = ref(true);
const missing = ref(false);
const tab = computed(() => (TABS.some((item) => item.key === route.query.tab) ? route.query.tab : "overview"));
const current = computed(() => TABS.find((item) => item.key === tab.value));
const child = computed(() => overview.value?.child ?? null);
const counts = computed(() => ({
  evaluations: child.value?.evaluations?.approved ?? 0,
  plan: child.value?.pending_generalizations ?? 0,
  consultations: child.value?.consultations?.waiting ?? 0,
}));

const setTab = (key) => router.replace({ query: { ...route.query, tab: key } });

async function load() {
  loading.value = true;
  missing.value = false;
  try {
    overview.value = (await axios.get(`/api/parent/child/${props.child_id}/portal/overview`)).data;
  } catch (error) {
    overview.value = null;
    missing.value = error.response?.status === 404;
  } finally {
    loading.value = false;
  }
}
onMounted(load);
watch(() => props.child_id, load);

const nextSession = computed(() => child.value?.next_session ?? null);
const nextText = computed(() => nextSession.value
  ? `${isToday(nextSession.value.starts_at) ? t("pp.today") : fmtShortDate(nextSession.value.starts_at)} · ${fmtTime(nextSession.value.starts_at)}`
  : "");
const finance = computed(() => overview.value?.finance ?? null);
</script>

<template>
  <div class="pp-page">
    <div v-if="loading" class="pp-stack">
      <div class="pp-skeleton" style="height: 140px" />
      <div class="pp-skeleton" style="height: 48px" />
      <div class="pp-skeleton" style="height: 300px" />
    </div>

    <EmptyState v-else-if="!child" icon="pi pi-user" :title="$t('pp.child_not_found')" :text="missing ? $t('pp.child_not_found_text') : $t('request_failed_retry')">
      <router-link :to="{ name: 'clidreen_parents' }" class="pp-btn pp-btn--soft">{{ $t("pp.my_children") }}</router-link>
    </EmptyState>

    <template v-else>
      <PageHead :title="child.name" :back="{ name: 'clidreen_parents' }" :kicker="$t('pp.child_file')" icon="pi pi-folder-open">
        <template #actions>
          <router-link :to="{ name: 'BookingTime', params: { child_id: child.id } }" class="pp-btn pp-btn--magenta"><i class="pi pi-calendar-plus" /> {{ $t("pp.book_consultation") }}</router-link>
          <router-link :to="{ name: 'parent-mchat', params: { child_id: child.id } }" class="pp-btn pp-btn--ghost"><i class="pi pi-heart" /> M-CHAT</router-link>
        </template>
      </PageHead>

      <!-- Who -->
      <section class="pp-card pp-card--pad pp-stack pp-in" :style="{ '--i': 1 }">
        <div class="pp-who">
          <ChildAvatar :child="child" :size="64" />
          <div class="pp-who__body pp-row">
            <span class="pp-tag pp-tag--cyan"><i class="pi pi-calendar" /> {{ ageText(child) }}</span>
            <span v-if="child.gender !== null" class="pp-tag">{{ isGirl(child) ? $t("female") : $t("male") }}</span>
            <span v-for="program in child.programs" :key="program.id" class="pp-tag" :class="`pp-tag--${meta('programStatus', program.status).severity}`">
              {{ meta("programKind", program.kind).label }} · {{ meta("programStatus", program.status).label }}
            </span>
          </div>
        </div>
        <div class="pp-grid pp-grid--stats">
          <div class="pp-stat"><span class="pp-stat__icon"><i class="pi pi-clipboard" /></span><div><div class="pp-stat__value">{{ child.evaluations?.approved ?? 0 }}</div><div class="pp-stat__label">{{ $t("pp.stat_evaluations") }}</div></div></div>
          <div class="pp-stat"><span class="pp-stat__icon"><i class="pi pi-book" /></span><div><div class="pp-stat__value">{{ child.programs?.length ?? 0 }}</div><div class="pp-stat__label">{{ $t("pp.stat_programs") }}</div></div></div>
          <div class="pp-stat"><span class="pp-stat__icon"><i class="pi pi-wallet" /></span><div><div class="pp-stat__value pp-num">{{ finance ? money(finance.remaining, finance.currency) : "—" }}</div><div class="pp-stat__label">{{ $t("acc.remaining") }}</div></div></div>
          <div class="pp-stat pp-stat--wide"><span class="pp-stat__icon"><i class="pi pi-clock" /></span><div><div class="pp-stat__value text-base leading-6">{{ nextText || "—" }}</div><div class="pp-stat__label">{{ $t("pp.next_session") }}</div></div></div>
        </div>
      </section>

      <!-- Tabs -->
      <nav class="pp-tabs pp-in pp-no-print" :style="{ '--i': 2 }" role="tablist">
        <button v-for="item in TABS" :key="item.key" type="button" role="tab" class="pp-tab" :class="{ 'is-active': tab === item.key }" :aria-selected="tab === item.key" @click="setTab(item.key)">
          <i :class="item.icon" aria-hidden="true" />
          {{ $t(item.label) }}
          <span v-if="counts[item.key]" class="pp-tab__count">{{ counts[item.key] }}</span>
        </button>
      </nav>

      <Transition name="pp-fade" mode="out-in">
        <component :is="current.component" :key="tab" :child="child" :overview="overview" :childId="child.id" @changed="load" />
      </Transition>
    </template>
  </div>
</template>

<style scoped>
.pp-who {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.pp-who__body {
  flex: 1;
  min-width: 0;
}
</style>
