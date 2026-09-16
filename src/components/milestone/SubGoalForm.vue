<script setup>
import { ref, watch } from 'vue';
import { milestoneFields } from '@/utils/milestone';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';

const props = defineProps({
  modelValue: { type: Object, required: true },
  domains: { type: Array, default: () => [] },
  generalGoals: { type: Array, default: () => [] },
  errors: { type: Object, default: () => ({}) },
  saving: Boolean,
});
const emit = defineEmits(['submit', 'update:modelValue']);
const gender = ref('male');
const nameToken = '{{name}}';
const firstError = (key) => Array.isArray(props.errors[key]) ? props.errors[key][0] : props.errors[key];
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
</script>

<template>
  <form class="sub-goal-form" @submit.prevent="emit('submit')">
    <p class="name-hint" dir="rtl">
      يمكنك إضافة الرمز <code dir="ltr">{{ nameToken }}</code> في أي حقل؛ وسيُستبدل تلقائيًا باسم الطفل عند عرض النص له، مع اختيار صياغة الذكر أو الأنثى بحسب جنس الطفل.
    </p>
    <div class="gender-tabs" role="tablist" aria-label="صياغة الهدف حسب الجنس">
      <button v-for="item in ['male', 'female']" :key="item" :id="`wording-tab-${item}`"
        type="button" role="tab" :aria-selected="gender === item" aria-controls="wording-panel"
        :class="{ active: gender === item }" @click="gender = item">
        {{ $t(item) }}
        <span v-if="Object.keys(errors).some(key => key.startsWith(`wording.${item}.`))" class="error-marker">!</span>
      </button>
    </div>
    <div id="wording-panel" role="tabpanel" :aria-labelledby="`wording-tab-${gender}`" class="wording-fields" dir="rtl">
      <div v-for="field in milestoneFields" :key="`${gender}-${field.key}`" class="form-field">
        <label :for="`${gender}-${field.key}`">{{ field.label }}</label>
        <textarea :id="`${gender}-${field.key}`" :value="modelValue.wording[gender][field.key]"
          rows="3" :aria-invalid="Boolean(errors[`wording.${gender}.${field.key}`])"
          :disabled="saving" @input="updateText(field.key, $event.target.value)" />
        <small v-if="errors[`wording.${gender}.${field.key}`]" class="field-error">
          {{ firstError(`wording.${gender}.${field.key}`) }}
        </small>
      </div>
    </div>
    <div class="selection-fields">
      <div class="form-field">
        <label for="sub-goal-domain">{{ $t('milestone_domain') }}</label>
        <Dropdown inputId="sub-goal-domain" :modelValue="modelValue.question_type_id" :options="domains"
          optionLabel="title" optionValue="id" filter :disabled="saving"
          :placeholder="$t('milestone_domain')" @update:modelValue="update('question_type_id', $event)" />
        <small v-if="errors.question_type_id" class="field-error">{{ firstError('question_type_id') }}</small>
      </div>
      <div class="form-field">
        <label for="sub-goal-general-goal">{{ $t('milestone_general_goal') }}</label>
        <Dropdown inputId="sub-goal-general-goal" :modelValue="modelValue.subtest_id" :options="generalGoals"
          optionLabel="title" optionValue="id" filter :disabled="saving"
          :placeholder="$t('milestone_general_goal')" @update:modelValue="update('subtest_id', $event)" />
        <small v-if="errors.subtest_id" class="field-error">{{ firstError('subtest_id') }}</small>
      </div>
    </div>
    <Button type="submit" :loading="saving" :disabled="saving" :label="$t('submit')" class="create submit-button" />
  </form>
</template>

<style scoped>
.sub-goal-form { display: grid; gap: 1.25rem; }
.name-hint { padding: 1rem; border-radius: .6rem; background: #eef8f9; color: #135c65; line-height: 1.9; }
.name-hint code { display: inline-block; font-weight: 700; }
.gender-tabs { display: flex; border-bottom: 1px solid #dce2e5; gap: .5rem; }
.gender-tabs button { flex: 1; padding: .8rem; border-radius: .5rem .5rem 0 0; background: #f3f5f6; font-weight: 600; }
.gender-tabs button.active { background: #135c65; color: white; }
.error-marker { color: #dc2626; background: white; border-radius: 50%; padding: 0 .4rem; margin-inline-start: .5rem; }
.wording-fields, .form-field { display: grid; gap: .5rem; }
.wording-fields { gap: 1rem; }
.form-field label { font-weight: 600; text-align: start; }
.form-field textarea { width: 100%; resize: vertical; padding: .7rem; background: #f7f8fa; border: 1px solid #cbd5e1; border-radius: .5rem; line-height: 1.8; }
.form-field textarea:focus { outline: 2px solid #62a5ae; outline-offset: 1px; }
.form-field textarea[aria-invalid="true"] { border-color: #dc2626; }
.selection-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.field-error { color: #dc2626; }
.submit-button { justify-self: center; min-width: 12rem; }
@media (max-width: 600px) { .selection-fields { grid-template-columns: 1fr; } }
</style>
