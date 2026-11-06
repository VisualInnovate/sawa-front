<script setup>
// The child's reports: the results of every approved evaluation drawn as the printed report (the newest four of
// each family), and the consultations' results — all printable from here.
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";
import EmptyState from "@/components/parent/EmptyState.vue";
import EvaluationCharts from "@/components/parent/EvaluationCharts.vue";
import ConsultationResult from "@/components/parent/ConsultationResult.vue";
import { MAX_PER_GROUP } from "@/components/reports/reportUtils";
import { fmtDate } from "@/utils/parentPortal";

const props = defineProps({ child: { type: Object, required: true }, childId: { type: [Number, String], required: true } });
const { t } = useI18n();

const loading = ref(true);
const report = ref(null);
const failed = ref(false);
const results = ref([]);
const open = ref(null);
const resultView = ref(null);
// The combined reports the centre sent (what of each department), opened one at a time.
const sent = ref([]);
const sentOpen = ref(null);
const sentData = ref(null);
const sentLoading = ref(false);
async function openSent(row) {
  sentOpen.value = row;
  sentData.value = null;
  sentLoading.value = true;
  try {
    sentData.value = (await axios.get(`/api/parent/child/${props.childId}/portal/sent-reports/${row.id}`)).data;
  } catch {
    sentData.value = { failed: true };
  } finally {
    sentLoading.value = false;
  }
}
const partsText = (parts) => t(`crs.parts_${parts.length}`);

onMounted(async () => {
  try {
    const [{ data: evaluations }, { data: consultations }] = await Promise.all([
      axios.get(`/api/parent/child/${props.childId}/portal/evaluations`),
      axios.get(`/api/parent/child/${props.childId}/portal/consultations`),
    ]);
    axios.get(`/api/parent/child/${props.childId}/portal/sent-reports`).then(({ data }) => { sent.value = data.data ?? []; }).catch(() => {});
    results.value = (consultations.bookings ?? []).filter((booking) => String(booking.status) === "1" && booking.consultation_result);

    // The newest approved evaluations of each family, as many as the report holds.
    const perGroup = {};
    const keys = [];
    for (const item of evaluations.items ?? []) {
      if (item.approval !== "approved") continue;
      perGroup[item.group] = (perGroup[item.group] ?? 0) + 1;
      if (perGroup[item.group] <= MAX_PER_GROUP) keys.push(item.key);
    }
    if (keys.length) report.value = (await axios.get(`/api/parent/child/${props.childId}/portal/report`, { params: { items: keys } })).data;
  } catch {
    failed.value = true;
  } finally {
    loading.value = false;
  }
});

const hasReport = computed(() => Boolean(report.value?.items?.length));
const print = () => window.print();
</script>

<template>
  <div class="pp-stack">
    <div v-if="loading" class="pp-stack">
      <div class="pp-skeleton" style="height: 120px" />
      <div class="pp-skeleton" style="height: 320px" />
    </div>

    <template v-else>
      <div class="pp-row pp-between pp-in pp-no-print">
        <div>
          <h2 class="pp-h2"><i class="pi pi-chart-bar text-[var(--pp-teal)]" /> {{ $t("pp.rp_title") }}</h2>
          <p class="pp-lead text-sm mt-1">{{ $t("pp.rp_lead") }}</p>
        </div>
        <button v-if="hasReport" type="button" class="pp-btn pp-btn--ghost pp-btn--sm" @click="print"><i class="pi pi-print" /> {{ $t("print") }}</button>
      </div>

      <section v-if="sent.length" class="pp-stack pp-in pp-no-print">
        <h2 class="pp-h2"><i class="pi pi-send text-[var(--pp-teal)]" /> {{ $t("crs.parent_title") }}</h2>
        <div class="pp-list">
          <button v-for="row in sent" :key="row.id" type="button" class="pp-item pp-item--link text-start" @click="openSent(row)">
            <span class="pp-item__icon pp-item__icon--success"><i class="pi pi-file" /></span>
            <div class="pp-item__body">
              <p class="pp-item__title">{{ $t("crs.parent_item", { date: fmtDate(row.sent_at) }) }}</p>
              <p class="pp-item__meta">
                <template v-for="(d, i) in row.departments" :key="i"><template v-if="i"> · </template>{{ d.name ?? $t("crs.no_department") }}: {{ partsText(d.parts) }}</template>
              </p>
            </div>
            <i class="pi pi-angle-left rtl-arrow pp-muted" aria-hidden="true" />
          </button>
        </div>
      </section>

      <template v-if="hasReport">
        <div class="pp-report-head">
          <b>{{ child.name }}</b>
          <span class="pp-muted">{{ $t("pp.rp_generated", { date: fmtDate(new Date()) }) }}</span>
        </div>
        <EvaluationCharts :report="report" />
      </template>
      <EmptyState v-else icon="pi pi-chart-bar" :title="$t('pp.rp_none_title')" :text="failed ? $t('request_failed_retry') : $t('pp.rp_none_text')" />

      <section class="pp-stack pp-in" :style="{ '--i': 2 }">
        <h2 class="pp-h2"><i class="pi pi-comments text-[var(--pp-magenta)]" /> {{ $t("pp.rp_consultations") }}</h2>
        <EmptyState v-if="!results.length" icon="pi pi-comments" :text="$t('pp.rp_no_consultation_results')" />
        <div v-else class="pp-list">
          <button v-for="booking in results" :key="booking.booking_id" type="button" class="pp-item pp-item--link text-start" @click="open = booking">
            <span class="pp-item__icon pp-item__icon--magenta"><i class="pi pi-file" /></span>
            <div class="pp-item__body">
              <p class="pp-item__title">{{ $t("نتيجة الاستشارة") }} · {{ fmtDate(booking.event_date) }}</p>
              <p class="pp-item__meta">{{ booking.user_name }}<template v-if="booking.user_title"> · {{ booking.user_title }}</template></p>
            </div>
            <i class="pi pi-angle-left rtl-arrow pp-muted" aria-hidden="true" />
          </button>
        </div>
      </section>
    </template>

    <Dialog class="pp-overlay" :visible="Boolean(sentOpen)" modal :header="sentOpen ? $t('crs.parent_item', { date: fmtDate(sentOpen.sent_at) }) : ''"
      :style="{ width: '900px', maxWidth: '96vw' }" @update:visible="sentOpen = null">
      <div v-if="sentLoading" class="pp-skeleton" style="height: 240px" />
      <p v-else-if="sentData?.failed" class="pp-muted">{{ $t("request_failed_retry") }}</p>
      <div v-else-if="sentData" class="pp-stack">
        <EvaluationCharts v-if="sentData.report?.items?.length" :report="sentData.report" />
        <section v-for="plan in sentData.plans" :key="plan.id" class="pp-stack">
          <h3 class="pp-h2">{{ $t("crs.plan_of", { name: plan.evaluation.name }) }}</h3>
          <ul class="crs-goals"><li v-for="goal in plan.goals" :key="goal.id"><bdi class="pp-muted">{{ goal.code }}</bdi> {{ goal.goal }}</li></ul>
        </section>
        <section v-if="sentData.tracking" class="pp-stack">
          <h3 class="pp-h2">{{ $t("crs.tracking_title") }}</h3>
          <p v-if="!sentData.tracking.current.length" class="pp-muted">{{ $t("crs.no_tracking") }}</p>
          <ul v-else class="crs-goals">
            <li v-for="goal in sentData.tracking.current" :key="goal.id">
              <bdi class="pp-muted">{{ goal.code }}</bdi> {{ goal.goal }} — <b>{{ goal.achieved_at ? $t("crs.achieved") : `${goal.progress.percent}%` }}</b>
            </li>
          </ul>
        </section>
      </div>
      <template #footer>
        <Button :label="$t('print')" icon="pi pi-print" variant="text" @click="print" />
        <Button :label="$t('close')" icon="pi pi-times" variant="text" @click="sentOpen = null" />
      </template>
    </Dialog>

    <Dialog class="pp-overlay" :visible="Boolean(open)" modal :header="$t('نتيجة الاستشارة')" :style="{ width: '640px', maxWidth: '94vw' }" @update:visible="open = null">
      <ConsultationResult v-if="open" ref="resultView" :booking="open" />
      <template #footer>
        <Button :label="$t('print')" icon="pi pi-print" variant="text" @click="resultView?.print()" />
        <Button :label="$t('export_pdf')" icon="pi pi-file-pdf" severity="success" @click="resultView?.pdf()" />
        <Button :label="$t('close')" icon="pi pi-times" variant="text" @click="open = null" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.crs-goals {
  margin: 0;
  padding-inline-start: 1.1rem;
  display: grid;
  gap: 0.3rem;
}
.pp-report-head {
  display: none;
  justify-content: space-between;
  border-bottom: 2px solid rgb(var(--bp-1c6772));
  padding-bottom: 0.5rem;
}
[dir="ltr"] .rtl-arrow {
  transform: scaleX(-1);
}
@media print {
  .pp-report-head {
    display: flex;
  }
}
</style>
