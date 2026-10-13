<template>
  <div class="p-6 bg-gray-50 min-h-screen container mx-auto print:p-0 print:w-full print:max-w-full print:mx-0">
    <div class="flex justify-between items-center mb-8 print:hidden">
      <h1 class="text-3xl font-bold text-gray-800">{{ $t("carolina_ui.result_title") }}</h1>
      <button class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2" @click="printPage">
        <i class="pi pi-print" aria-hidden="true"></i>
        {{ $t("print_report") }}
      </button>
    </div>

    <div class="hidden print:block py-4 border-b border-gray-200 mb-4">
      <h1 class="text-3xl font-bold text-gray-800 text-center">{{ $t("carolina_ui.result_title") }}</h1>
      <div class="text-center text-gray-600 mt-2">{{ $t("generated_on") }}: {{ new Date().toLocaleDateString() }}</div>
    </div>

    <div v-if="loading || failed || !sections.length" class="bg-white rounded-xl shadow-md px-6 py-10 text-center text-gray-500">
      {{ loading ? $t("loading") : failed ? $t("request_failed_retry") : $t("carolina_ui.no_results") }}
    </div>

    <div v-else class="space-y-12 print:space-y-6">
      <div v-for="(section, s) in sections" :key="s" class="bg-white rounded-xl shadow-md overflow-hidden print:shadow-none print:border">
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-4 print:bg-blue-600">
          <h2 class="text-xl font-bold text-white">{{ section.title || $t("carolina_ui.title") }}</h2>
        </div>
        <section v-for="(goal, g) in section.goals" :key="g" class="carolina-goal print:break-inside-avoid">
          <h3 class="carolina-goal-title">{{ $t("carolina_ui.domain") }}: {{ goal.category }}</h3>
          <div class="carolina-table-wrap">
            <table class="carolina-table">
              <thead>
                <tr>
                  <th>{{ $t("age_range") }}</th>
                  <th>{{ $t("carolina_ui.symbol") }}</th>
                  <th>{{ $t("carolina_ui.skill") }}</th>
                  <th>{{ $t("carolina_ui.response") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, r) in goal.rows" :key="r">
                  <td v-if="row.first" :rowspan="row.span" class="carolina-age" dir="ltr">{{ row.age }}</td>
                  <td class="carolina-center" dir="ltr">{{ row.symbol }}</td>
                  <td>{{ row.skill }}</td>
                  <td class="carolina-center carolina-response">{{ row.response }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
// One Carolina evaluation's results (/carolina-resulte/:id), laid out like the Milestones report: a card per general
// goal and, per domain, the age range, symbol, skill and response of each skill.
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const loading = ref(true);
const failed = ref(false);
const result = ref([]);

// Consecutive domains of one general goal share its card.
const sections = computed(() => {
  const list = [];
  for (const goal of result.value) {
    const title = goal.main_category ?? "";
    let section = list[list.length - 1];
    if (!section || section.title !== title) list.push((section = { title, goals: [] }));
    section.goals.push({
      ...goal,
      rows: (goal.groups ?? []).flatMap((group) => (group.tests ?? []).map((test, i) => ({ ...test, age: group.age, first: i === 0, span: group.tests.length }))),
    });
  }
  return list;
});
const printPage = () => window.print();

async function load() {
  loading.value = true;
  failed.value = false;
  try {
    result.value = (await axios.get(`api/carolina-category/flow-chart/${route.params.id}`)).data.data ?? [];
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

<style scoped>
.carolina-goal + .carolina-goal { border-top: 1px solid #e5e7eb; }
.carolina-goal-title { margin: 0; padding: .85rem 1.25rem; background: #eff6ff; color: #1d4ed8; font-size: 1.1rem; font-weight: 700; }
.carolina-table-wrap { overflow-x: auto; padding: 1rem 1.25rem; }
.carolina-table { width: 100%; border-collapse: collapse; font-size: .95rem; }
.carolina-table th, .carolina-table td { border: 1px solid #e2e8f0; padding: .6rem .75rem; vertical-align: middle; text-align: start; }
.carolina-table th { background: #f8fafc; color: #334155; font-weight: 700; text-align: center; }
.carolina-center, .carolina-age { text-align: center !important; white-space: nowrap; }
.carolina-age { background: #f8fafc; font-weight: 700; }
.carolina-response { font-size: 1.1rem; font-weight: 800; color: #1e293b; }
</style>
