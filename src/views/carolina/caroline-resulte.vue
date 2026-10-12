<script setup>
// One Carolina evaluation's results (/carolina-resulte/:id): per general goal, the age range, symbol, skill and
// response of each item.
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const loading = ref(true);
const failed = ref(false);
const result = ref([]);

// Consecutive general goals of one main section share its heading.
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

<template>
  <div class="cr-page">
    <header class="cr-head">
      <h1>{{ $t("carolina_ui.result_title") }}</h1>
      <Button icon="pi pi-print" :label="$t('print_report')" severity="secondary" variant="outlined" class="print:hidden" @click="printPage" />
    </header>

    <div v-if="loading" class="cr-state"><ProgressSpinner style="width: 40px; height: 40px" /></div>
    <Message v-else-if="failed" severity="error" :closable="false">{{ $t("request_failed_retry") }}</Message>
    <Message v-else-if="!sections.length" severity="info" :closable="false">{{ $t("carolina_ui.no_results") }}</Message>

    <template v-else>
    <section v-for="(section, s) in sections" :key="s" class="cr-card">
      <h2 v-if="section.title">{{ section.title }}</h2>
      <div v-for="(goal, g) in section.goals" :key="g" class="cr-table-wrap">
        <table class="cr-table">
          <thead>
            <tr><th colspan="4" class="cr-goal">{{ $t("carolina_ui.general_goal") }}: {{ goal.category }}</th></tr>
            <tr>
              <th>{{ $t("age_range") }}</th>
              <th>{{ $t("carolina_ui.symbol") }}</th>
              <th>{{ $t("carolina_ui.skill") }}</th>
              <th>{{ $t("carolina_ui.response") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, r) in goal.rows" :key="r">
              <td v-if="row.first" :rowspan="row.span" class="cr-center" dir="ltr">{{ row.age }}</td>
              <td class="cr-center" dir="ltr">{{ row.symbol }}</td>
              <td>{{ row.skill }}</td>
              <td class="cr-center cr-response">{{ row.response }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    </template>
  </div>
</template>

<style scoped>
.cr-page { display: grid; gap: 1rem; }
.cr-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; }
.cr-head h1 { margin: 0; font-size: 1.4rem; font-weight: 800; color: var(--sawa-primary, #135c65); }
.cr-state { display: grid; place-items: center; padding: 3rem; }
.cr-card { display: grid; gap: 1rem; padding: 1.25rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 16px; background: #fff; }
.cr-card h2 { margin: 0; font-size: 1.1rem; font-weight: 800; }
.cr-table-wrap { overflow-x: auto; }
.cr-table { width: 100%; border-collapse: collapse; font-size: .9rem; }
.cr-table th, .cr-table td { border: 1px solid #cbd5e1; padding: .5rem .6rem; vertical-align: middle; text-align: start; }
.cr-table th { background: #f1f5f9; font-weight: 800; text-align: center; }
.cr-table th.cr-goal { background: #edf7f5; color: var(--sawa-primary, #135c65); text-align: start; }
.cr-center { text-align: center !important; white-space: nowrap; }
.cr-response { font-weight: 800; }
@media print {
  .cr-card { border: 0; padding: 0; }
}
</style>
