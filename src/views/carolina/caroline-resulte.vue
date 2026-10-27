<template>
  <div class="p-6 bg-gray-50 min-h-screen container mx-auto print:p-0 print:w-full print:max-w-full print:mx-0">
    <!-- The result's approval by the management (pending / approved / rejected with the reason). -->
    <Toast />
    <ApprovalBanner ref="approvalBanner" :evaluation-id="$route.params.id" @loaded="approval = $event" />
    <!-- Before approval the answers can still be edited (pending or rejected). -->
    <div v-if="approval && approval.status !== 'approved'" class="flex justify-end mb-3 print:hidden">
      <CarolinaAnswerEditor :evaluation-id="$route.params.id" @saved="answersEdited" />
    </div>
    <div class="flex justify-between items-center mb-6 print:hidden">
      <h1 class="text-3xl font-bold text-gray-800">{{ $t("carolina_ui.result_title") }}</h1>
      <div class="flex items-center gap-2">
        <button class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2" @click="printPage">
          <i class="pi pi-print" aria-hidden="true"></i>
          {{ $t("print_report") }}
        </button>
        <DeleteEvaluationButton :evaluation-id="$route.params.id" />
      </div>
    </div>

    <!-- As in the printed report: the paper form, its rounds' colors in each box. -->
    <div class="rxs-pages">
      <ResultSheet :label="label" :date="approval?.date" :child-name="approval?.child?.name">
        <p v-if="loading || failed" class="rx-empty">{{ loading ? $t("loading") : $t("request_failed_retry") }}</p>
        <CarolinaGrid v-else :result="result" :per-table="4" compact />
      </ResultSheet>
    </div>
  </div>
</template>

<script setup>
// One Carolina evaluation's result (/carolina-resulte/:id) as the paper form: domains and general goals against the
// age ranges, each skill's symbol showing its response and the color of the round that gave it, on the report's sheet.
import ApprovalBanner from "@/components/evaluations/ApprovalBanner.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import ResultSheet from "@/components/reports/ResultSheet.vue";
import { CAROLINA, typeLabel } from "@/components/reports/reportUtils";
import { useRoute } from "vue-router";
import axios from "axios";
import DeleteEvaluationButton from "@/components/evaluation/DeleteEvaluationButton.vue";
import CarolinaGrid from "@/components/carolina/CarolinaGrid.vue";
import CarolinaAnswerEditor from "@/components/carolina/CarolinaAnswerEditor.vue";

const route = useRoute();
const { t } = useI18n();
const label = computed(() => typeLabel(CAROLINA, t));
const loading = ref(true);
const failed = ref(false);
const result = ref(null);
const printPage = () => window.print();
const approval = ref(null);
const approvalBanner = ref(null);
// Edited answers: the grid and the approval state are read again.
function answersEdited() {
  approvalBanner.value?.reload();
  load();
}

async function load() {
  loading.value = true;
  failed.value = false;
  try {
    result.value = (await axios.get(`api/carolina-answer/result/${route.params.id}`)).data.data ?? null;
  } catch {
    failed.value = true;
  } finally {
    loading.value = false;
  }
}

onMounted(load);
watch(() => route.params.id, (value, before) => {
  if (value && value !== before && route.name === "carolina-resulte") load();
});
</script>
