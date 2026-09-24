<script setup>
// One text with a boy's and a girl's wording: a male/female switch, a copy from the other gender (with undo)
// and a growing textarea. v-model is { male, female }.
import { computed, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: Object, required: true },
  label: { type: String, required: true },
  inputId: { type: String, required: true },
  rows: { type: Number, default: 3 },
  // Marks the empty wordings as missing (both are required once the form was submitted).
  showErrors: Boolean,
  disabled: Boolean,
});
const emit = defineEmits(["update:modelValue"]);

const genders = ["male", "female"];
const gender = ref("male");
const otherOf = (value) => (value === "male" ? "female" : "male");
const blank = (value) => !String(value ?? "").trim();
const missing = (value) => props.showErrors && blank(props.modelValue[value]);
const otherHasText = computed(() => !blank(props.modelValue[otherOf(gender.value)]));

const update = (value, text) => emit("update:modelValue", { ...props.modelValue, [value]: text });

// Show the gender that still needs text once the form reports errors.
watch(() => props.showErrors, (showErrors) => {
  if (showErrors && !missing(gender.value) && missing(otherOf(gender.value))) gender.value = otherOf(gender.value);
});

const undo = ref(null);
let undoTimer;
function copyFromOther() {
  undo.value = { gender: gender.value, text: props.modelValue[gender.value] };
  update(gender.value, props.modelValue[otherOf(gender.value)]);
  clearTimeout(undoTimer);
  undoTimer = setTimeout(() => { undo.value = null; }, 8000);
}
function undoCopy() {
  if (!undo.value) return;
  update(undo.value.gender, undo.value.text);
  undo.value = null;
}
watch(gender, () => { undo.value = null; });
onBeforeUnmount(() => clearTimeout(undoTimer));
</script>

<template>
  <div class="gender-text">
    <div class="gender-text-bar">
      <label :for="`${inputId}-${gender}`" class="gender-text-label">{{ label }}</label>
      <div class="gender-text-tools">
        <SelectButton v-model="gender" :options="genders" :allowEmpty="false" size="small" :aria-label="label">
          <template #option="{ option }">
            <span>{{ $t(option) }}</span>
            <span v-if="missing(option)" class="error-marker" :title="$t('field_required')">!</span>
          </template>
        </SelectButton>
        <Button v-if="!disabled" type="button" size="small" severity="secondary" variant="outlined" icon="pi pi-clone"
          :label="$t(`gender_text.copy_from_${otherOf(gender)}`)" :disabled="!otherHasText"
          v-tooltip.top="$t('gender_text.copy_hint')" @click="copyFromOther" />
      </div>
    </div>
    <Message v-if="undo" severity="success" size="small" :closable="false" class="undo-note">
      <span>{{ $t(`gender_text.copied_from_${otherOf(undo.gender)}`) }}</span>
      <Button type="button" size="small" variant="link" :label="$t('undo')" @click="undoCopy" />
    </Message>
    <Textarea :id="`${inputId}-${gender}`" :modelValue="modelValue[gender]" :rows="rows" autoResize fluid
      :disabled="disabled" :invalid="missing(gender)" @update:modelValue="update(gender, $event)" />
    <small v-if="missing(gender)" class="field-error">{{ $t("field_required") }}</small>
  </div>
</template>

<style scoped>
.gender-text { display: grid; gap: .5rem; }
.gender-text-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .5rem; }
.gender-text-label { font-weight: 600; }
.gender-text-tools { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; }
.error-marker { color: #fff; background: #dc2626; border-radius: 50%; width: 1.1rem; height: 1.1rem; display: inline-grid; place-items: center; font-size: .75rem; margin-inline-start: .4rem; }
.undo-note :deep(.p-message-text) { display: flex; align-items: center; gap: .5rem; }
.field-error { color: #dc2626; }
</style>
