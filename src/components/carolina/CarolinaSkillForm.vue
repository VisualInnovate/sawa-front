<script setup>
// A Carolina skill: general goal, then one of its age ranges, then a free symbol, and the five wordings for a boy
// and for a girl (with {{name}} for the child's name; only the skill text is required).
// v-model is { general_goal_id, age_range_id, symbol_id, wording: { male, female } }.
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import NameTokenHint from '@/components/NameTokenHint.vue';
import { carolinaFields } from '@/utils/carolina';

const props = defineProps({
  modelValue: { type: Object, required: true },
  // Every general goal, each with its age_ranges.
  generalGoals: { type: Array, default: () => [] },
  // Every symbol, with the id of the skill using it (skill_id) if any.
  symbols: { type: Array, default: () => [] },
  // The skill being edited (its own symbol stays selectable).
  skillId: { type: Number, default: null },
  errors: { type: Object, default: () => ({}) },
  saving: Boolean,
});
const emit = defineEmits(['submit', 'update:modelValue']);
const genders = ['male', 'female'];
const gender = ref('male');
const otherGender = computed(() => (gender.value === 'male' ? 'female' : 'male'));

const ageRanges = computed(() => props.generalGoals.find(goal => goal.id === props.modelValue.general_goal_id)?.age_ranges ?? []);
const freeSymbols = computed(() => props.symbols.filter(symbol => !symbol.skill_id || symbol.skill_id === props.skillId));

const firstError = (key) => Array.isArray(props.errors[key]) ? props.errors[key][0] : props.errors[key];
const hasGenderErrors = (item) => Object.keys(props.errors).some(key => key.startsWith(`wording.${item}.`));
const update = (patch) => emit('update:modelValue', { ...props.modelValue, ...patch });
const updateText = (key, value) => update({
  wording: { ...props.modelValue.wording, [gender.value]: { ...props.modelValue.wording[gender.value], [key]: value } },
});
const changeGoal = (value) => update({ general_goal_id: value, age_range_id: null });

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
        <label for="skill-goal">{{ $t('carolina_ui.general_goal') }}</label>
        <Select inputId="skill-goal" :modelValue="modelValue.general_goal_id" :options="generalGoals" optionLabel="title" optionValue="id"
          filter fluid :disabled="saving" :invalid="Boolean(errors.general_goal_id)" :placeholder="$t('carolina_ui.general_goal')"
          :emptyMessage="$t('carolina_ui.no_general_goals')" @update:modelValue="changeGoal" />
        <small v-if="errors.general_goal_id" class="field-error">{{ firstError('general_goal_id') }}</small>
      </div>
      <div class="form-field">
        <label for="skill-age">{{ $t('carolina_ui.age_range') }}</label>
        <Select inputId="skill-age" :modelValue="modelValue.age_range_id" :options="ageRanges" optionLabel="name" optionValue="id"
          fluid :disabled="saving || !modelValue.general_goal_id" :invalid="Boolean(errors.age_range_id)"
          :placeholder="$t('carolina_ui.age_range')" :emptyMessage="$t('carolina_ui.no_ranges_for_goal')"
          @update:modelValue="update({ age_range_id: $event })">
          <template #value="{ value, placeholder }">
            <span v-if="value"><span dir="ltr">{{ ageRanges.find(range => range.id === value)?.name }}</span> {{ $t('carolina_ui.months') }}</span>
            <span v-else>{{ placeholder }}</span>
          </template>
          <template #option="{ option }"><span dir="ltr">{{ option.name }}</span>&nbsp;{{ $t('carolina_ui.months') }}</template>
        </Select>
        <small v-if="errors.age_range_id" class="field-error">{{ firstError('age_range_id') }}</small>
      </div>
      <div class="form-field">
        <label for="skill-symbol">{{ $t('carolina_ui.symbol') }}</label>
        <Select inputId="skill-symbol" :modelValue="modelValue.symbol_id" :options="freeSymbols" optionLabel="name" optionValue="id"
          filter fluid :disabled="saving" :invalid="Boolean(errors.symbol_id)" :placeholder="$t('carolina_ui.symbol')"
          :emptyMessage="$t('carolina_ui.no_free_symbols')" :emptyFilterMessage="$t('carolina_ui.no_free_symbols')"
          @update:modelValue="update({ symbol_id: $event })">
          <template #option="{ option }"><span dir="ltr">{{ option.name }}</span></template>
        </Select>
        <small v-if="errors.symbol_id" class="field-error">{{ firstError('symbol_id') }}</small>
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
          <label :for="`skill-${gender}-${field.key}`">
            {{ $t(field.label) }}<span v-if="field.key === 'skill'" class="required-mark">*</span>
          </label>
          <Textarea :id="`skill-${gender}-${field.key}`" :modelValue="modelValue.wording[gender][field.key]"
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
.selection-fields { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
.wording-box { display: grid; gap: .75rem; padding: 1rem; border: 1px solid #e2e8f0; border-radius: .75rem; }
.gender-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .5rem; }
.error-marker { color: #fff; background: #dc2626; border-radius: 50%; width: 1.1rem; height: 1.1rem; display: inline-grid; place-items: center; font-size: .75rem; margin-inline-start: .4rem; }
.undo-note :deep(.p-message-text) { display: flex; align-items: center; gap: .5rem; }
.wording-fields { display: grid; gap: .85rem; }
.form-field { display: grid; gap: .35rem; align-content: start; }
.form-field label { font-weight: 600; text-align: start; }
.required-mark { color: #dc2626; margin-inline-start: .2rem; }
.field-error { color: #dc2626; }
.form-actions { display: flex; justify-content: center; }
.form-actions .p-button { min-width: 12rem; }
@media (max-width: 760px) { .selection-fields { grid-template-columns: 1fr; } }
</style>
