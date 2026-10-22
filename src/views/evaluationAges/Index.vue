<script setup>
// «الفئات العمرية للتقييمات»: one age range per evaluation type. Booking an evaluation for a child outside it only warns.
import axios from "axios";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { getEvaluationTypeLabel } from "@/utils/evaluationTypes";
import AgeRangeField from "@/components/common/AgeRangeField.vue";

const { t } = useI18n();
const toast = useToast();
const rows = ref([]);
const loading = ref(true);
const saving = ref(false);

onMounted(async () => {
  try {
    rows.value = (await axios.get("api/evaluation-type-ages")).data.data;
  } finally {
    loading.value = false;
  }
});

async function save() {
  saving.value = true;
  try {
    const { data } = await axios.put("api/evaluation-type-ages", { ranges: rows.value.map(({ type, from_months, to_months }) => ({ type, from_months, to_months })) });
    rows.value = data.data;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("age_ranges.saved"), life: 2500 });
  } catch (e) {
    const errors = e.response?.data?.errors;
    toast.add({ severity: "error", summary: t("error"), detail: (errors && Object.values(errors)[0]?.[0]) || e.response?.data?.message || t("mission_error"), life: 4000 });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="sawa-card p-3">
    <div class="flex flex-wrap items-center justify-between gap-3 mb-2">
      <p class="text-xl text-[#135C65] font-bold"><i class="pi pi-users" aria-hidden="true" /> {{ $t("age_ranges.evaluation_page") }}</p>
      <Button icon="pi pi-save" :label="$t('save')" :loading="saving" :disabled="loading" @click="save" />
    </div>
    <p class="text-color-secondary mb-4">{{ $t("age_ranges.evaluation_hint") }}</p>
    <div v-if="loading" class="flex justify-center p-5"><i class="pi pi-spin pi-spinner text-2xl" /></div>
    <div v-else class="ea-grid">
      <div v-for="row in rows" :key="row.type" class="ea-row">
        <strong>{{ getEvaluationTypeLabel(row.type, $t) }}</strong>
        <AgeRangeField v-model:from="row.from_months" v-model:to="row.to_months" />
      </div>
    </div>
    <Toast />
  </div>
</template>

<style scoped>
.ea-grid { display: grid; gap: .75rem; }
.ea-row { display: grid; grid-template-columns: minmax(10rem, 16rem) 1fr; align-items: center; gap: 1rem; padding: .75rem 1rem; border: 1px solid #e2e8f0; border-radius: 12px; background: #fff; }
@media (max-width: 640px) { .ea-row { grid-template-columns: 1fr; } }
</style>
