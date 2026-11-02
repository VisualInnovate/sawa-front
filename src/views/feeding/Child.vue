<script setup>
// One student's month on the feeding program: the summary, every day's meals, and the parents' questionnaires.
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { can } from "@/utils/permissions";
import { DAY_SEVERITY, STATE_SEVERITY, percent, quantityKey, thisMonth, useFeedingMeta } from "@/utils/feeding";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const meta = useFeedingMeta();
const canCreate = can("feeding create");

const month = ref(route.query.month || thisMonth());
const data = ref(null);
const loading = ref(false);
async function load() {
  loading.value = true;
  try {
    data.value = (await axios.get(`api/feeding/children/${route.params.id}`, { params: { month: month.value } })).data;
  } finally {
    loading.value = false;
  }
}
onMounted(load);
watch(month, () => {
  router.replace({ query: { month: month.value } });
  load();
});

const slots = computed(() => Array.from({ length: meta.value?.meal_slots ?? 3 }, (_, i) => i + 1));
const mealOf = (day, slot) => day.meals.find((meal) => meal.slot === slot);
const summary = computed(() => data.value?.summary);
</script>

<template>
  <div class="sawa-card p-3">
    <Button variant="link" icon="pi pi-arrow-right" :label="$t('feeding.back')" class="p-0 mb-2" @click="router.push({ name: 'feeding', query: { tab: 'month' } })" />
    <div v-if="loading && !data" class="flex justify-center p-8"><ProgressSpinner /></div>
    <template v-else-if="data">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
        <p class="text-xl text-bp-135c65 font-bold m-0">{{ data.child.name }}</p>
        <div class="flex items-center gap-2">
          <label for="fc-month">{{ $t("feeding.month") }}</label>
          <InputText id="fc-month" v-model="month" type="month" class="ltr" />
        </div>
      </div>

      <!-- Summary -->
      <div v-if="summary.meals" class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div class="p-3 rounded-lg border border-slate-200 bg-white"><small class="text-slate-500">{{ $t("feeding.meals") }}</small><p class="m-0 text-2xl font-bold num">{{ summary.meals }}</p><small>{{ $t("feeding.days_recorded") }}: {{ summary.days }}</small></div>
        <div class="p-3 rounded-lg border border-slate-200 bg-white"><small class="text-slate-500">{{ $t("feeding.eaten_rate") }}</small><p class="m-0 text-2xl font-bold num" :class="{ 'text-red-700': summary.alert }">{{ percent(summary.eaten_rate) }}</p><small>{{ summary.eaten }} / {{ summary.meals }}</small></div>
        <div class="p-3 rounded-lg border border-slate-200 bg-white"><small class="text-slate-500">{{ $t("feeding.avg_quantity") }}</small><p class="m-0 text-2xl font-bold num">{{ summary.avg_quantity }}</p><small>{{ $t("feeding.absences") }}: {{ summary.statuses.absent }}</small></div>
        <div class="p-3 rounded-lg border bg-white flex flex-col gap-1" :class="summary.alert ? 'border-red-300' : 'border-slate-200'">
          <Tag v-if="summary.alert" severity="danger" :value="$t('feeding.needs_follow')" class="self-start" />
          <small><b>{{ $t("feeding.top_eaten") }}:</b> {{ summary.top_eaten.join("، ") || "—" }}</small>
          <small class="text-red-700"><b>{{ $t("feeding.top_refused") }}:</b> {{ summary.top_refused.join("، ") || "—" }}</small>
        </div>
      </div>

      <!-- Days -->
      <p class="font-bold m-0 mb-2">{{ $t("feeding.month_days") }}</p>
      <p v-if="!data.days.length" class="text-slate-500">{{ $t("feeding.no_data") }}</p>
      <div v-else class="overflow-x-auto mb-4">
        <table class="w-full text-sm border-collapse min-w-[48rem]">
          <thead><tr class="text-slate-500">
            <th class="p-2 text-start">{{ $t("feeding.date") }}</th>
            <th class="p-2 text-start">{{ $t("feeding.status") }}</th>
            <th v-for="slot in slots" :key="slot" class="p-2 text-start">{{ $t("feeding.meal_n", { n: slot }) }}</th>
          </tr></thead>
          <tbody>
            <tr v-for="day in data.days" :key="day.id" class="border-t border-slate-100 align-top">
              <td class="p-2 ltr text-start whitespace-nowrap">{{ day.date }}</td>
              <td class="p-2"><Tag :severity="DAY_SEVERITY[day.status]" :value="$t(`feeding.st_${day.status}`)" /><small v-if="day.note" class="block text-slate-600">{{ day.note }}</small></td>
              <td v-for="slot in slots" :key="slot" class="p-2">
                <template v-if="mealOf(day, slot)">
                  <span>{{ mealOf(day, slot).meal }}</span>
                  <Tag v-if="mealOf(day, slot).state" :severity="STATE_SEVERITY[mealOf(day, slot).state]" class="ms-1"
                       :value="mealOf(day, slot).state === 'partial' ? $t(quantityKey(mealOf(day, slot).quantity)) : $t(`feeding.state_${mealOf(day, slot).state}`)" />
                  <small v-if="mealOf(day, slot).note" class="block text-slate-600">{{ mealOf(day, slot).note }}</small>
                  <small v-if="mealOf(day, slot).action" class="block text-amber-800">{{ $t("feeding.action") }}: {{ mealOf(day, slot).action }}</small>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Questionnaires -->
      <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
        <p class="font-bold m-0">{{ $t("feeding.surveys") }}</p>
        <Button v-if="canCreate" size="small" icon="pi pi-plus" variant="outlined" :label="$t('feeding.new_survey')"
                @click="router.push({ name: 'feeding-survey-new', query: { child_id: data.child.id } })" />
      </div>
      <p v-if="!data.surveys.length" class="text-slate-500 m-0">{{ $t("feeding.no_surveys") }}</p>
      <div class="flex flex-col gap-2">
        <button v-for="survey in data.surveys" :key="survey.id" type="button"
                class="text-start p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex flex-wrap items-center gap-2"
                @click="router.push({ name: 'feeding-survey', params: { id: survey.id } })">
          <b class="ltr">{{ survey.date }}</b>
          <Tag v-for="axis in survey.problems" :key="axis" severity="danger" :value="$t(`feeding.axis_${axis}`)" />
          <span v-if="!survey.problems.length" class="text-slate-500">{{ $t("feeding.no_problems") }}</span>
          <small class="text-slate-500 ms-auto">{{ survey.therapist }}</small>
        </button>
      </div>
    </template>
  </div>
</template>
