<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { ageOptions } from "@/utils/ageOptions";

const props = defineProps({
  modelValue: { type: Object, required: true },
  saving: Boolean,
});
const emit = defineEmits(["update:modelValue", "submit"]);
const { t } = useI18n();

const submitted = ref(false);
const fromOptions = computed(() => ageOptions(0, 11.5, t));
const toOptions = computed(() => ageOptions(0.5, 11.5, t));
const titleError = computed(() => submitted.value && String(props.modelValue.title ?? "").trim().length < 3);
const rangeError = computed(
  () => submitted.value && (props.modelValue.from === "" || props.modelValue.to === "" || props.modelValue.to <= props.modelValue.from)
);
const update = (key, value) => emit("update:modelValue", { ...props.modelValue, [key]: value });

const submit = () => {
  submitted.value = true;
  if (!titleError.value && !rangeError.value) emit("submit");
};
</script>

<template>
  <form class="surface-card form-stack" novalidate data-no-request-spinner @submit.prevent="submit">
    <div class="field">
      <label for="header-title">{{ $t("header_title") }}</label>
      <InputText id="header-title" :modelValue="modelValue.title" fluid :invalid="titleError"
        @update:modelValue="update('title', $event)" />
      <small v-if="titleError" class="field-error">{{ $t("min_3_chars") }}</small>
    </div>
    <div class="form-grid">
      <div class="field">
        <label for="header-from">{{ $t("from") }}</label>
        <Select inputId="header-from" :modelValue="modelValue.from" :options="fromOptions" optionLabel="title"
          optionValue="value" fluid :invalid="rangeError" @update:modelValue="update('from', $event)" />
      </div>
      <div class="field">
        <label for="header-to">{{ $t("to") }}</label>
        <Select inputId="header-to" :modelValue="modelValue.to" :options="toOptions" optionLabel="title"
          optionValue="value" fluid :invalid="rangeError" @update:modelValue="update('to', $event)" />
      </div>
    </div>
    <small v-if="rangeError" class="field-error">{{ $t("age_range_invalid") }}</small>
    <div class="form-actions">
      <Button type="submit" :label="$t('submit')" icon="pi pi-check" :loading="saving" />
    </div>
  </form>
</template>

<style scoped>
.form-stack {
  display: grid;
  gap: 1rem;
}
.form-actions {
  display: flex;
  justify-content: center;
}
.form-actions .p-button {
  min-width: 12rem;
}
</style>
