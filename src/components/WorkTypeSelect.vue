<script setup>
// Picks the employee's work types (optional): inclusion, day, clinics; inclusion and day exclude each other.
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { WORK_TYPES, isWorkTypeBlocked, workTypeLabel } from "@/utils/employeeWorkTypes";

defineProps({
  inputId: { type: String, default: "work-types" },
});
const model = defineModel({ type: Array, default: () => [] });
const { t } = useI18n();

const options = computed(() => WORK_TYPES.map((type) => ({
  value: type,
  label: workTypeLabel(t, type),
  disabled: isWorkTypeBlocked(type, model.value),
})));
</script>

<template>
  <MultiSelect v-model="model" :inputId="inputId" :options="options" optionLabel="label" optionValue="value"
    optionDisabled="disabled" display="chip" :showToggleAll="false" :placeholder="$t('work_types_pick')"
    class="w-full" />
  <small class="text-start text-color-secondary">{{ $t("work_types_hint") }}</small>
</template>
