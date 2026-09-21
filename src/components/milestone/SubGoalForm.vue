<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { milestoneFields } from '@/utils/milestone';

const props = defineProps({
  modelValue: { type: Object, required: true },
  domains: { type: Array, default: () => [] },
  generalGoals: { type: Array, default: () => [] },
  errors: { type: Object, default: () => ({}) },
  saving: Boolean,
});
const emit = defineEmits(['submit', 'update:modelValue']);
const genders = ['male', 'female'];
const gender = ref('male');
const otherGender = computed(() => (gender.value === 'male' ? 'female' : 'male'));
const nameToken = '{{name}}';

const firstError = (key) => Array.isArray(props.errors[key]) ? props.errors[key][0] : props.errors[key];
const hasGenderErrors = (item) => Object.keys(props.errors).some(key => key.startsWith(`wording.${item}.`));
const update = (key, value) => emit('update:modelValue', { ...props.modelValue, [key]: value });
const updateText = (key, value) => update('wording', {
  ...props.modelValue.wording,
  [gender.value]: { ...props.modelValue.wording[gender.value], [key]: value },
});
watch(() => props.errors, errors => {
  const key = Object.keys(errors).find(key => key.startsWith('wording.'));
  if (key?.split('.')[1] === 'female') gender.value = 'female';
  else if (key) gender.value = 'male';
});

// "Copied" feedback next to the {{name}} hint.
const tokenCopied = ref(false);
let tokenTimer;
async function copyToken() {
  try {
    await navigator.clipboard.writeText(nameToken);
  } catch {
    const input = document.createElement('textarea');
    input.value = nameToken;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    input.remove();
  }
  tokenCopied.value = true;
  clearTimeout(tokenTimer);
  tokenTimer = setTimeout(() => { tokenCopied.value = false; }, 2000);
}

// Copy the other gender's wording into the open tab, with an undo while the notice is shown.
const otherHasText = computed(() =>
  milestoneFields.some(field => (props.modelValue.wording[otherGender.value][field.key] ?? '').trim() !== '')
);
const undo = ref(null);
let undoTimer;
function copyFromOther() {
  const target = gender.value;
  undo.value = { gender: target, values: { ...props.modelValue.wording[target] } };
  update('wording', {
    ...props.modelValue.wording,
    [target]: { ...props.modelValue.wording[otherGender.value] },
  });
  clearTimeout(undoTimer);
  undoTimer = setTimeout(() => { undo.value = null; }, 8000);
}
function undoCopy() {
  if (!undo.value) return;
  update('wording', { ...props.modelValue.wording, [undo.value.gender]: undo.value.values });
  undo.value = null;
}
watch(gender, () => { undo.value = null; });
onBeforeUnmount(() => {
  clearTimeout(tokenTimer);
  clearTimeout(undoTimer);
});
</script>

<template>
  <form class="sub-goal-form" data-no-request-spinner @submit.prevent="emit('submit')">
    <div class="selection-fields">
      <div class="form-field">
        <label for="sub-goal-domain">{{ $t('milestone_domain') }}</label>
        <Select inputId="sub-goal-domain" :modelValue="modelValue.question_type_id" :options="domains"
          optionLabel="title" optionValue="id" filter fluid :disabled="saving" :invalid="Boolean(errors.question_type_id)"
          :placeholder="$t('milestone_domain')" @update:modelValue="update('question_type_id', $event)" />
        <small v-if="errors.question_type_id" class="field-error">{{ firstError('question_type_id') }}</small>
      </div>
      <div class="form-field">
        <label for="sub-goal-general-goal">{{ $t('milestone_general_goal') }}</label>
        <Select inputId="sub-goal-general-goal" :modelValue="modelValue.subtest_id" :options="generalGoals"
          optionLabel="title" optionValue="id" filter fluid :disabled="saving" :invalid="Boolean(errors.subtest_id)"
          :placeholder="$t('milestone_general_goal')" @update:modelValue="update('subtest_id', $event)" />
        <small v-if="errors.subtest_id" class="field-error">{{ firstError('subtest_id') }}</small>
      </div>
      <div class="form-field">
        <label for="sub-goal-display-order">{{ $t('display_order') }}</label>
        <InputNumber inputId="sub-goal-display-order" :modelValue="modelValue.display_order" :min="0"
          :useGrouping="false" fluid :disabled="saving" :invalid="Boolean(errors.display_order)"
          :placeholder="$t('display_order')" @update:modelValue="update('display_order', $event)" />
        <small v-if="errors.display_order" class="field-error">{{ firstError('display_order') }}</small>
      </div>
    </div>

    <div class="name-hint">
      <i class="pi pi-info-circle" aria-hidden="true" />
      <span>{{ $t('milestone_wording.name_hint_before') }}</span>
      <code dir="ltr">{{ nameToken }}</code>
      <Button type="button" size="small" variant="text" :icon="tokenCopied ? 'pi pi-check' : 'pi pi-copy'"
        :label="tokenCopied ? $t('copied') : $t('copy')" class="hint-copy" @click="copyToken" />
      <span class="hint-rest">{{ $t('milestone_wording.name_hint_after') }}</span>
    </div>

    <div class="wording-box">
      <div class="gender-bar">
        <SelectButton v-model="gender" :options="genders" :allowEmpty="false" :aria-label="$t('milestone_wording.gender_tabs')">
          <template #option="{ option }">
            <span>{{ $t(option) }}</span>
            <span v-if="hasGenderErrors(option)" class="error-marker" :title="$t('milestone_wording.has_errors')">!</span>
          </template>
        </SelectButton>
        <Button type="button" size="small" severity="secondary" variant="outlined" icon="pi pi-clone"
          :label="$t(`milestone_wording.copy_from_${otherGender}`)" :disabled="saving || !otherHasText"
          v-tooltip.top="$t('milestone_wording.copy_hint')" @click="copyFromOther" />
      </div>

      <Message v-if="undo" severity="success" size="small" :closable="false" class="undo-note">
        <span>{{ $t(`milestone_wording.copied_from_${otherGender}`) }}</span>
        <Button type="button" size="small" variant="link" :label="$t('undo')" @click="undoCopy" />
      </Message>

      <div class="wording-fields">
        <div v-for="field in milestoneFields" :key="`${gender}-${field.key}`" class="form-field">
          <label :for="`${gender}-${field.key}`">{{ $t(field.label) }}</label>
          <Textarea :id="`${gender}-${field.key}`" :modelValue="modelValue.wording[gender][field.key]"
            rows="2" autoResize fluid :invalid="Boolean(errors[`wording.${gender}.${field.key}`])"
            :disabled="saving" @update:modelValue="updateText(field.key, $event)" />
          <small v-if="errors[`wording.${gender}.${field.key}`]" class="field-error">
            {{ firstError(`wording.${gender}.${field.key}`) }}
          </small>
        </div>
      </div>
    </div>

    <div class="form-actions">
      <Button type="submit" :loading="saving" :label="$t('submit')" icon="pi pi-check" />
    </div>
  </form>
</template>

<style scoped>
.sub-goal-form { display: grid; gap: 1rem; }
.selection-fields { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
.name-hint {
  display: flex; flex-wrap: wrap; align-items: center; gap: .35rem;
  padding: .45rem .75rem; border-radius: .5rem;
  background: #eef8f9; color: #135c65; font-size: .85rem; line-height: 1.6;
}
.name-hint code { font-weight: 700; background: #fff; border-radius: .3rem; padding: 0 .35rem; }
.hint-copy { padding: .1rem .4rem; }
.hint-rest { flex-basis: 100%; color: #3f6f75; }
.wording-box { display: grid; gap: .75rem; padding: 1rem; border: 1px solid #e2e8f0; border-radius: .75rem; }
.gender-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .5rem; }
.error-marker { color: #fff; background: #dc2626; border-radius: 50%; width: 1.1rem; height: 1.1rem; display: inline-grid; place-items: center; font-size: .75rem; margin-inline-start: .4rem; }
.undo-note :deep(.p-message-text) { display: flex; align-items: center; gap: .5rem; }
.wording-fields { display: grid; gap: .85rem; }
.form-field { display: grid; gap: .35rem; }
.form-field label { font-weight: 600; text-align: start; }
.field-error { color: #dc2626; }
.form-actions { display: flex; justify-content: center; }
.form-actions .p-button { min-width: 12rem; }
@media (max-width: 600px) { .selection-fields { grid-template-columns: 1fr; } }
</style>
