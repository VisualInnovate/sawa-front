<script setup>
// «برنامج الطعام»: today's meals for the class, the month's summary (who needs follow-up first) and the parents'
// food-preference questionnaires.
import axios from "axios";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { can } from "@/utils/permissions";
import { percent, thisMonth, useFeedingMeta } from "@/utils/feeding";
import DayGrid from "@/components/feeding/DayGrid.vue";
import ImportDialog from "@/components/feeding/ImportDialog.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const meta = useFeedingMeta();
const canCreate = can("feeding create");
const canEdit = can("feeding edit");
const importing = ref(false);
const dayKey = ref(0);
function imported() {
  dayKey.value++;
  if (tab.value === "month") loadMonth();
}

const tab = ref(["day", "month", "surveys"].includes(route.query.tab) ? route.query.tab : "day");
watch(tab, (value) => router.replace({ query: { ...route.query, tab: value } }));

// Month summary
const month = ref(thisMonth());
const overview = ref({ data: [], totals: null });
const loadingMonth = ref(false);
async function loadMonth() {
  loadingMonth.value = true;
  try {
    overview.value = (await axios.get("api/feeding/overview", { params: { month: month.value } })).data;
  } finally {
    loadingMonth.value = false;
  }
}
watch([tab, month], () => tab.value === "month" && loadMonth(), { immediate: true });
const alertRule = computed(() => meta.value && t("feeding.alert_rule", { rate: Math.round(meta.value.alert_eaten_rate * 100), qty: meta.value.alert_avg_quantity }));

// Questionnaires
const surveys = ref([]);
const loadingSurveys = ref(false);
async function loadSurveys() {
  loadingSurveys.value = true;
  try {
    surveys.value = (await axios.get("api/feeding-surveys")).data.data;
  } finally {
    loadingSurveys.value = false;
  }
}
watch(tab, () => tab.value === "surveys" && loadSurveys(), { immediate: true });
</script>

<template>
  <div class="sawa-card p-3">
    <Toast />
    <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
      <div>
        <p class="text-xl text-bp-135c65 font-bold m-0"><i class="pi pi-heart" aria-hidden="true" /> {{ $t("feeding.menu") }}</p>
        <small class="text-slate-500">{{ $t("feeding.lead") }}</small>
      </div>
      <div class="flex flex-wrap gap-2">
        <Button v-if="canEdit" icon="pi pi-file-import" variant="outlined" :label="$t('feeding.import')" @click="importing = true" />
        <Button v-if="canCreate" icon="pi pi-plus" variant="outlined" :label="$t('feeding.new_survey')" @click="router.push({ name: 'feeding-survey-new' })" />
      </div>
    </div>

    <Tabs v-if="meta" v-model:value="tab">
      <TabList>
        <Tab value="day">{{ $t("feeding.tab_day") }}</Tab>
        <Tab value="month">{{ $t("feeding.tab_month") }}</Tab>
        <Tab value="surveys">{{ $t("feeding.tab_surveys") }}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="day"><DayGrid :key="dayKey" :meta="meta" /></TabPanel>

        <TabPanel value="month">
          <div class="flex flex-wrap items-center gap-3 mb-3">
            <label for="fm-month" class="font-semibold">{{ $t("feeding.month") }}</label>
            <InputText id="fm-month" v-model="month" type="month" class="ltr" />
            <small class="text-slate-500">{{ alertRule }}</small>
          </div>
          <div v-if="overview.totals?.meals" class="flex flex-wrap gap-6 mb-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span class="font-semibold">{{ $t("feeding.totals") }}</span>
            <span>{{ $t("feeding.meals") }}: <b>{{ overview.totals.meals }}</b></span>
            <span>{{ $t("feeding.eaten_rate") }}: <b>{{ percent(overview.totals.eaten_rate) }}</b></span>
            <span>{{ $t("feeding.avg_quantity") }}: <b>{{ overview.totals.avg_quantity }}</b></span>
          </div>
          <DataTable :value="overview.data" :loading="loadingMonth" dataKey="child_id" stripedRows rowHover responsiveLayout="scroll" class="cursor-pointer"
                     @row-click="router.push({ name: 'feeding-child', params: { id: $event.data.child_id }, query: { month } })">
            <template #empty><p class="text-center text-slate-500 py-6">{{ $t("feeding.no_data") }}</p></template>
            <Column :header="$t('feeding.child')">
              <template #body="{ data }">
                <b :class="{ 'text-red-700': data.summary.alert }">{{ data.child }}</b>
                <Tag v-if="data.summary.alert" severity="danger" :value="$t('feeding.needs_follow')" class="ms-2" />
                <br /><small class="text-slate-500">{{ data.has_survey ? $t("feeding.has_survey") : $t("feeding.no_survey") }}</small>
              </template>
            </Column>
            <Column :header="$t('feeding.days_recorded')"><template #body="{ data }"><span class="num">{{ data.summary.days }}</span></template></Column>
            <Column :header="$t('feeding.meals')"><template #body="{ data }"><span class="num">{{ data.summary.meals }}</span></template></Column>
            <Column :header="$t('feeding.eaten_rate')">
              <template #body="{ data }">
                <div class="flex items-center gap-2 min-w-36">
                  <span class="num w-10">{{ percent(data.summary.eaten_rate) }}</span>
                  <ProgressBar :value="Math.round((data.summary.eaten_rate ?? 0) * 100)" :showValue="false" class="grow" style="height: .5rem" />
                </div>
              </template>
            </Column>
            <Column :header="$t('feeding.avg_quantity')">
              <template #body="{ data }">
                <div class="flex items-center gap-2 min-w-36">
                  <span class="num w-10">{{ data.summary.avg_quantity ?? "—" }}</span>
                  <ProgressBar :value="Math.round((data.summary.avg_quantity ?? 0) * 100)" :showValue="false" class="grow feeding-qty" style="height: .5rem" />
                </div>
              </template>
            </Column>
            <Column :header="$t('feeding.absences')"><template #body="{ data }"><span class="num">{{ data.summary.statuses.absent || "—" }}</span></template></Column>
            <Column :header="$t('feeding.top_eaten')"><template #body="{ data }"><small>{{ data.summary.top_eaten.slice(0, 3).join("، ") }}</small></template></Column>
            <Column :header="$t('feeding.top_refused')"><template #body="{ data }"><small class="text-red-700">{{ data.summary.top_refused.slice(0, 3).join("، ") }}</small></template></Column>
          </DataTable>
        </TabPanel>

        <TabPanel value="surveys">
          <DataTable :value="surveys" :loading="loadingSurveys" dataKey="id" stripedRows rowHover responsiveLayout="scroll" class="cursor-pointer"
                     @row-click="router.push({ name: 'feeding-survey', params: { id: $event.data.id } })">
            <template #empty><p class="text-center text-slate-500 py-6">{{ $t("feeding.no_surveys") }}</p></template>
            <Column :header="$t('feeding.child')" field="child" />
            <Column :header="$t('feeding.date')"><template #body="{ data }"><span class="ltr">{{ data.date }}</span></template></Column>
            <Column :header="$t('feeding.problems')">
              <template #body="{ data }">
                <div class="flex flex-wrap gap-1">
                  <Tag v-for="axis in data.problems" :key="axis" severity="danger" :value="$t(`feeding.axis_${axis}`)" />
                  <span v-if="!data.problems.length" class="text-slate-500">{{ $t("feeding.no_problems") }}</span>
                </div>
              </template>
            </Column>
            <Column :header="$t('feeding.therapist')" field="therapist" />
          </DataTable>
        </TabPanel>
      </TabPanels>
    </Tabs>
    <ImportDialog v-model:visible="importing" @imported="imported" />
  </div>
</template>

<style scoped>
.feeding-qty :deep(.p-progressbar-value) { background: #d97706; }
</style>
