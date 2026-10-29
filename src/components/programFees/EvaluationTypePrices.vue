<script setup>
// Which evaluation item prices each evaluation type of the system (none: closed for children without a confirmed program).
import axios from "axios";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { getEvaluationTypeLabel } from "@/utils/evaluationTypes";
import { amount } from "@/utils/accounting";

const props = defineProps({
  items: { type: Array, default: () => [] },
  prices: { type: Object, default: () => ({}) },
});
const emit = defineEmits(["saved"]);
const { t } = useI18n();
const toast = useToast();

const TYPES = [1, 101, 102, 103, 104, 105, 2, 3, 6, 4, 7, 5, 8, 9];
const draft = ref({});
// "none" (not null): the Select shows nothing for a null value.
const options = computed(() => [{ id: "none", label: t("acc.no_price") }, ...props.items.map((item) => ({ id: item.id, label: `${item.name} — ${amount(item.price)}` }))]);

watch(() => props.prices, (prices) => {
  draft.value = Object.fromEntries(TYPES.map((type) => [type, prices?.[type] ?? "none"]));
}, { immediate: true });

async function save() {
  const prices = Object.fromEntries(Object.entries(draft.value).map(([type, item]) => [type, item === "none" ? null : item]));
  await axios.put("api/program-fees/evaluation-prices", { prices });
  toast.add({ severity: "success", summary: t("success_message"), detail: t("fees_saved"), life: 2500 });
  emit("saved");
}
</script>

<template>
  <div class="flex flex-column gap-2">
    <span class="font-bold">{{ $t("acc.evaluation_prices") }}</span>
    <Message severity="info" size="small">{{ $t("acc.evaluation_prices_hint") }}</Message>
    <DataTable :value="TYPES.map((type) => ({ type }))" size="small" dataKey="type">
      <Column :header="$t('evaluation_type')">
        <template #body="{ data }">{{ getEvaluationTypeLabel(data.type, t, `#${data.type}`) }}</template>
      </Column>
      <Column :header="$t('acc.price')">
        <template #body="{ data }">
          <Select v-model="draft[data.type]" :options="options" optionLabel="label" optionValue="id" class="w-full md:w-30rem"
            :aria-label="getEvaluationTypeLabel(data.type, t, `#${data.type}`)" />
        </template>
      </Column>
    </DataTable>
    <div class="flex justify-end">
      <Button icon="pi pi-check" :label="$t('submit')" @click="save" />
    </div>
  </div>
</template>
