<script setup>
// «طلبات المقابلات»: the department head's side of the candidates' cycle. The files HR sent them (waiting for their
// decision, or with a booked interview), the finished ones, and their weekly free times for interviews. HR («candidates
// edit») may see everyone's files and set anyone's times.
import axios from "axios";
import moment from "moment";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import InterviewHours from "@/components/hr/InterviewHours.vue";
import { formatWhen, loadInterviewer } from "@/utils/interviewer";

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();

const tab = ref(route.query.tab || "open");
const scope = ref("mine");
const rows = ref([]);
const manages = ref(false);
const loading = ref(false);
const hoursUser = ref(null);
const reviewers = ref([]);
const ar = computed(() => locale.value === "ar");

async function load() {
  if (tab.value === "hours") return;
  loading.value = true;
  try {
    const { data } = await axios.get("api/candidate-reviews", { params: { state: tab.value, scope: scope.value } });
    rows.value = data.data;
    manages.value = data.manages;
    if (manages.value && !reviewers.value.length) {
      reviewers.value = (await axios.get("api/candidate-reviews/reviewers")).data.data;
    }
  } finally {
    loading.value = false;
  }
}
onMounted(load);
watch([tab, scope], () => {
  router.replace({ query: { ...route.query, tab: tab.value } });
  load();
});

const tabs = computed(() => [
  { value: "open", label: t("crv.tab_open") },
  { value: "done", label: t("crv.tab_done") },
  { value: "hours", label: t("crv.tab_hours") },
]);
const scopes = computed(() => [
  { value: "mine", label: t("crv.scope_mine") },
  { value: "all", label: t("crv.scope_all") },
]);
const SEVERITY = { pending: "warn", scheduled: "info", archived: "secondary", rejected: "danger", interviewed: "success", cancelled: "secondary" };
const stateLabel = (r) => (r.status === "interviewed" ? t(`crv.outcome_${r.outcome}`) : t(`crv.state_${r.status}`));
const vacancyTitle = (v) => (v ? (ar.value ? v.title_ar : v.title_en || v.title_ar) : t("cand.no_vacancy"));
const specialty = (s) => (s ? (ar.value ? s.name_ar : s.name_en || s.name_ar) : "");
const when = (at) => formatWhen(at, locale.value);
const isToday = (at) => at && moment(at).isSame(moment(), "day");
const open = (r) => router.push({ name: "candidate-review", params: { id: r.id } });
const reviewerLabel = (r) => `${r.name}${r.department ? ` — ${r.department}` : ""}`;

onMounted(() => loadInterviewer(true));
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-2 p-4">
      <p class="text-xl text-bp-135c65 font-bold m-0">{{ $t("crv.title") }}</p>
      <SelectButton v-if="manages && tab !== 'hours'" v-model="scope" :options="scopes" optionLabel="label" optionValue="value" :allowEmpty="false" />
    </div>
    <Toast />

    <div class="sawa-card p-3">
      <SelectButton v-model="tab" :options="tabs" optionLabel="label" optionValue="value" :allowEmpty="false" class="mb-3" />

      <template v-if="tab === 'hours'">
        <div v-if="manages" class="flex flex-wrap items-center gap-2 mb-3">
          <label for="crv-hours-user">{{ $t("crv.hours_of") }}</label>
          <Select inputId="crv-hours-user" v-model="hoursUser" :options="reviewers" optionValue="user_id" :optionLabel="reviewerLabel" filter showClear
            :placeholder="$t('crv.my_hours')" class="w-20rem" />
        </div>
        <InterviewHours :userId="hoursUser" />
      </template>

      <template v-else>
        <div v-if="loading" class="flex justify-center p-5"><i class="pi pi-spin pi-spinner text-2xl" /></div>
        <div v-else-if="!rows.length" class="crv-empty">
          <i class="pi pi-inbox text-3xl" />
          <p class="m-0">{{ tab === "open" ? $t("crv.empty_open") : $t("crv.empty_done") }}</p>
        </div>
        <div v-else class="crv-list">
          <button v-for="r in rows" :key="r.id" type="button" class="crv-card" :class="{ 'is-today': isToday(r.scheduled_at) }" @click="open(r)">
            <div class="flex items-center justify-between gap-2">
              <strong class="crv-name">{{ r.candidate?.name_ar || $t("cand.unnamed") }}</strong>
              <Tag :severity="SEVERITY[r.status]" :value="stateLabel(r)" />
            </div>
            <small class="text-color-secondary"><i class="pi pi-briefcase" /> {{ vacancyTitle(r.candidate?.vacancy) }}<template v-if="r.candidate?.specialty"> · {{ specialty(r.candidate.specialty) }}</template></small>
            <small v-if="r.scheduled_at" class="crv-when"><i class="pi pi-calendar-clock" /> {{ when(r.scheduled_at) }}</small>
            <small v-else-if="r.status === 'pending'" class="text-orange-600"><i class="pi pi-hourglass" /> {{ $t("crv.waiting_decision") }}</small>
            <div class="flex items-center justify-between gap-2 text-sm text-color-secondary">
              <span v-if="scope === 'all'"><i class="pi pi-user" /> {{ r.reviewer?.name }}</span>
              <span v-if="r.percent !== null"><i class="pi pi-star" /> {{ $t("crv.score_pct", { n: r.percent }) }}</span>
              <span class="ms-auto">{{ $t("crv.open_file") }} <i class="pi pi-arrow-left" /></span>
            </div>
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.crv-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 0.75rem; }
.crv-card { text-align: start; background: var(--p-content-background, #fff); border: 1px solid var(--p-content-border-color); border-radius: 14px; padding: 0.85rem; display: grid; gap: 0.45rem; cursor: pointer; transition: box-shadow 0.15s, transform 0.15s; font: inherit; color: inherit; }
.crv-card:hover { box-shadow: 0 6px 18px -8px rgb(0 0 0 / 0.25); transform: translateY(-1px); }
.crv-card.is-today { border-color: var(--p-primary-color); box-shadow: inset 4px 0 0 var(--p-primary-color); }
.crv-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.crv-when { font-weight: 700; color: var(--p-primary-color); }
.crv-empty { display: grid; justify-items: center; gap: 0.5rem; padding: 2.5rem 1rem; color: var(--p-text-muted-color); }
</style>
