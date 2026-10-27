<script setup>
// One labelled field of the employee forms: label (with a required mark), the input in the slot, then a hint or the error.
defineProps({
  label: { type: String, required: true },
  for: { type: String, default: undefined },
  required: Boolean,
  hint: { type: String, default: "" },
  error: { type: [String, Array], default: "" },
  wide: Boolean,
});
</script>

<template>
  <div class="employee-field" :class="{ 'employee-field--wide': wide }">
    <label :for="$props.for" class="employee-field__label">
      {{ label }}<span v-if="required" class="employee-field__required" aria-hidden="true">*</span>
    </label>
    <slot />
    <small v-if="error" class="employee-field__error">{{ Array.isArray(error) ? error[0] : error }}</small>
    <small v-else-if="hint" class="employee-field__hint">{{ hint }}</small>
  </div>
</template>

<style scoped>
.employee-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0;
}

.employee-field--wide {
  grid-column: 1 / -1;
}

.employee-field__label {
  color: var(--sawa-text);
  font-size: 0.875rem;
  font-weight: 600;
}

.employee-field__required {
  color: #dc2626;
  margin-inline-start: 0.2rem;
}

.employee-field__hint {
  color: var(--sawa-muted);
}

.employee-field__error {
  color: #dc2626;
}

.employee-field :deep(.p-inputtext),
.employee-field :deep(.p-select),
.employee-field :deep(.p-multiselect),
.employee-field :deep(.p-datepicker),
.employee-field :deep(.p-inputnumber),
.employee-field :deep(.p-password) {
  width: 100%;
}
</style>
