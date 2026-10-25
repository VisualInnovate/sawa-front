<template>
  <div class="p-6 bg-gray-50 min-h-screen container mx-auto print:p-0 print:w-full print:max-w-full print:mx-0">
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

    <div class="hidden print:block py-4 border-b border-gray-200 mb-4">
      <h1 class="text-3xl font-bold text-gray-800 text-center">{{ $t("carolina_ui.result_title") }}</h1>
      <div class="text-center text-gray-600 mt-2">{{ $t("generated_on") }}: {{ new Date().toLocaleDateString() }}</div>
    </div>

    <div v-if="loading || failed" class="bg-white rounded-xl shadow-md px-6 py-10 text-center text-gray-500">
      {{ loading ? $t("loading") : $t("request_failed_retry") }}
    </div>
    <div v-else class="bg-white rounded-xl shadow-md p-4 print:shadow-none print:p-0">
      <CarolinaGrid :result="result" />
    </div>
  </div>
</template>

<script setup>
// One Carolina evaluation's result (/carolina-resulte/:id) as the paper form: domains and general goals against the
// age ranges, each skill's symbol showing its response and the color of the round that gave it.
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import DeleteEvaluationButton from "@/components/evaluation/DeleteEvaluationButton.vue";
import CarolinaGrid from "@/components/carolina/CarolinaGrid.vue";

const route = useRoute();
const loading = ref(true);
const failed = ref(false);
const result = ref(null);
const printPage = () => window.print();

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
