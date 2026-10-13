<script setup>
// A Carolina item: main section, general goal (from the general goals tab), age range and symbol, then the five
// wordings for a boy and for a girl (with {{name}} for the child's name). v-model is
// { category_id (the main section), general_goal_id, age_group_id, symbol, wording: { male, female } }.
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import axios from 'axios';
import NameTokenHint from '@/components/NameTokenHint.vue';
import { carolinaFields } from '@/utils/carolina';

const props = defineProps({
  modelValue: { type: Object, required: true },
  // Every Carolina category (the main sections are those without a parent) and every general goal.
  categories: { type: Array, default: () => [] },
  generalGoals: { type: Array, default: () => [] },
  errors: { type: Object, default: () => ({}) },
  saving: Boolean,
});
const emit = defineEmits(['submit', 'update:modelValue']);
const genders = ['male', 'female'];
const gender = ref('male');
const otherGender = computed(() => (gender.value === 'male' ? 'female' : 'male'));

const mains = computed(() => props.categories.filter(category => !category.parent_id));
const goals = computed(() => props.generalGoals.filter(goal => Number(goal.category_id) === Number(props.modelValue.category_id)));
const ageGroups = ref([]);
const loadingAges = ref(false);

const firstError = (key) => Array.isArray(props.errors[key]) ? props.errors[key][0] : props.errors[key];
const hasGenderErrors = (item) => Object.keys(props.errors).some(key => key.startsWith(`wording.${item}.`));
const update = (patch) => emit('update:modelValue', { ...props.modelValue, ...patch });
const updateText = (key, value) => update({
  wording: { ...props.modelValue.wording, [gender.value]: { ...props.modelValue.wording[gender.value], [key]: value } },
});

// The age ranges of the chosen main section.
async function loadAges(categoryId) {
  ageGroups.value = [];
  if (!categoryId) return;
  loadingAges.value = true;
  try {
    const { data } = await axios.post(`/api/carolina-category/get-age-groups/${categoryId}`);
    if (Number(props.modelValue.category_id) === Number(categoryId)) ageGroups.value = data.data ?? [];
  } catch {
    ageGroups.value = [];
  } finally {
    loadingAges.value = false;
  }
}
watch(() => props.modelValue.category_id, loadAges, { immediate: true });

const changeMain = (value) => update({ category_id: value, general_goal_id: null, age_group_id: null });

watch(() => props.errors, errors => {
  const key = Object.keys(errors).find(key => key.startsWith('wording.'));
  if (key?.split('.')[1] === 'female') gender.value = 'female';
  else if (key) gender.value = 'male';
});

// Copy the other gender's wording into the open tab, with an undo while the notice is shown.
const otherHasText = computed(() =>
  carolinaFields.some(field => (props.modelValue.wording[otherGender.value][field.key] ?? '').trim() !== '')
);
const undo = ref(null);
let undoTimer;
function copyFromOther() {
  const target = gender.value;
  undo.value = { gender: target, values: { ...props.modelValue.wording[target] } };
  update({ wording: { ...props.modelValue.wording, [target]: { ...props.modelValue.wording[otherGender.value] } } });
  clearTimeout(undoTimer);
  undoTimer = setTimeout(() => { undo.value = null; }, 8000);
}
function undoCopy() {
  if (!undo.value) return;
  update({ wording: { ...props.modelValue.wording, [undo.value.gender]: undo.value.values } });
  undo.value = null;
}
watch(gender, () => { undo.value = null; });
onBeforeUnmount(() => clearTimeout(undoTimer));
</script>

<template>
  <form class="carolina-form" data-no-request-spinner @submit.prevent="emit('submit')">
    <div class="selection-fields">
      <div class="form-field">
        <label for="carolina-main">{{ $t('carolina_ui.main_section') }}</label>
        <Select inputId="carolina-main" :modelValue="modelValue.category_id" :options="mains" optionLabel="title" optionValue="id"
          filter fluid :disabled="saving" :invalid="Boolean(errors.category_id)" :placeholder="$t('carolina_ui.main_section')"
          @update:modelValue="changeMain" />
        <small v-if="errors.category_id" class="field-error">{{ firstError('category_id') }}</small>
      </div>
      <div class="form-field">
        <label for="carolina-goal">{{ $t('carolina_ui.general_goal') }}</label>
        <Select inputId="carolina-goal" :modelValue="modelValue.general_goal_id" :options="goals" optionLabel="title" optionValue="id"
          filter fluid :disabled="saving || !modelValue.category_id" :invalid="Boolean(errors.general_goal_id)"
          :placeholder="$t('carolina_ui.general_goal')" :emptyMessage="$t('carolina_ui.no_general_goals')"
          @update:modelValue="update({ general_goal_id: $event })" />
        <small v-if="errors.general_goal_id" class="field-error">{{ firstError('general_goal_id') }}</small>
      </div>
      <div class="form-field">
        <label for="carolina-age">{{ $t('age_range') }}</label>
        <Select inputId="carolina-age" :modelValue="modelValue.age_group_id" :options="ageGroups" optionLabel="name" optionValue="id"
          fluid :loading="loadingAges" :disabled="saving || !modelValue.category_id" :invalid="Boolean(errors.age_group_id)"
          :placeholder="$t('age_range')" @update:modelValue="update({ age_group_id: $event })" />
        <small v-if="errors.age_group_id" class="field-error">{{ firstError('age_group_id') }}</small>
      </div>
      <div class="form-field">
        <label for="carolina-symbol">{{ $t('carolina_ui.symbol') }}</label>
        <InputText id="carolina-symbol" :modelValue="modelValue.symbol" dir="ltr" fluid :disabled="saving"
          :invalid="Boolean(errors.symbol)" placeholder="1-a" @update:modelValue="update({ symbol: $event })" />
        <small v-if="errors.symbol" class="field-error">{{ firstError('symbol') }}</small>
      </div>
    </div>

    <NameTokenHint :text="$t('carolina_ui.name_hint_after')" />

    <div class="wording-box">
      <div class="gender-bar">
        <SelectButton v-model="gender" :options="genders" :allowEmpty="false" :aria-label="$t('carolina_ui.gender_tabs')">
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
        <div v-for="field in carolinaFields" :key="`${gender}-${field.key}`" class="form-field">
          <label :for="`carolina-${gender}-${field.key}`">{{ $t(field.label) }}</label>
          <Textarea :id="`carolina-${gender}-${field.key}`" :modelValue="modelValue.wording[gender][field.key]"
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
.carolina-form { display: grid; gap: 1rem; }
.selection-fields { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; }
.wording-box { display: grid; gap: .75rem; padding: 1rem; border: 1px solid #e2e8f0; border-radius: .75rem; }
.gender-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .5rem; }
.error-marker { color: #fff; background: #dc2626; border-radius: 50%; width: 1.1rem; height: 1.1rem; display: inline-grid; place-items: center; font-size: .75rem; margin-inline-start: .4rem; }
.undo-note :deep(.p-message-text) { display: flex; align-items: center; gap: .5rem; }
.wording-fields { display: grid; gap: .85rem; }
.form-field { display: grid; gap: .35rem; align-content: start; }
.form-field label { font-weight: 600; text-align: start; }
.field-error { color: #dc2626; }
.form-actions { display: flex; justify-content: center; }
.form-actions .p-button { min-width: 12rem; }
@media (max-width: 900px) { .selection-fields { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 600px) { .selection-fields { grid-template-columns: 1fr; } }
</style>
