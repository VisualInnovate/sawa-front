<script setup>
// The child's reports: the results of every approved evaluation drawn as the printed report (the newest four of
// each family), and the consultations' results — all printable from here.
import { computed, onMounted, ref } from "vue";
import axios from "axios";
import EmptyState from "@/components/parent/EmptyState.vue";
import EvaluationCharts from "@/components/parent/EvaluationCharts.vue";
import ConsultationResult from "@/components/parent/ConsultationResult.vue";
import { MAX_PER_GROUP } from "@/components/reports/reportUtils";
import { fmtDate } from "@/utils/parentPortal";

const props = defineProps({ child: { type: Object, required: true }, childId: { type: [Number, String], required: true } });

const loading = ref(true);
const report = ref(null);
const failed = ref(false);
const results = ref([]);
const open = ref(null);
const resultView = ref(null);

onMounted(async () => {
  try {
    const [{ data: evaluations }, { data: consultations }] = await Promise.all([
      axios.get(`/api/parent/child/${props.childId}/portal/evaluations`),
      axios.get(`/api/parent/child/${props.childId}/portal/consultations`),
    ]);
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
.pp-report-head {
  display: none;
  justify-content: space-between;
  border-bottom: 2px solid #1c6772;
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
