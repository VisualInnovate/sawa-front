<script setup>
// One question of «دراسة حالة الطالب», answered the way its type says: a choice (radio / list / several), a number,
// an age in months, a time, writing, or a small table of lines the parent adds.
import { computed } from "vue";
import ConceptPicker from "./ConceptPicker.vue";
import { isVisible, NOT_YET } from "@/utils/caseStudy";

const props = defineProps({
  question: { type: Object, required: true },
  modelValue: { default: null },
  name: { type: String, default: "" },
  compact: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue"]);

const id = computed(() => `cs-${props.name || props.question.key}`);
const set = (value) => emit("update:modelValue", value === "" || value === undefined ? null : value);
const picked = computed(() => (Array.isArray(props.modelValue) ? props.modelValue : []));
const rows = computed(() => (Array.isArray(props.modelValue) ? props.modelValue : []));
const canAdd = computed(() => rows.value.length < (props.question.max ?? 10));

function toggle(value) {
  const only = props.question.exclusive;
  let next = picked.value.includes(value) ? picked.value.filter((item) => item !== value) : [...picked.value, value];
  // «لا يوجد» cannot stay beside another choice.
  if (only && next.includes(only) && next.length > 1) next = value === only ? [only] : next.filter((item) => item !== only);
  set(next.length ? next : null);
}
// A radio answer can be taken back by pressing it again.
const choose = (value) => set(props.modelValue === value ? null : value);
const setNumber = (event) => set(event.target.value === "" ? null : Number(event.target.value));
const setNotYet = (event) => set(event.target.checked ? NOT_YET : null);

const addRow = () => set([...rows.value, {}]);
const removeRow = (index) => set(rows.value.filter((_, at) => at !== index));
function setCell(index, key, value) {
  const next = rows.value.map((row) => ({ ...row }));
  if (value === null) delete next[index][key];
  else next[index][key] = value;
  set(next);
}
// Several cells of a line at once (a library word is its text and its concept).
function patchRow(index, patch) {
  const next = rows.value.map((row) => ({ ...row }));
  for (const [key, value] of Object.entries(patch)) {
    if (value === null || value === undefined) delete next[index][key];
    else next[index][key] = value;
  }
  set(next);
}
function move(index, by) {
  const next = [...rows.value];
  const [row] = next.splice(index, 1);
  next.splice(index + by, 0, row);
  set(next);
}
</script>

<template>
  <div class="cs-field" :class="[`cs-field--${question.type}`, { 'cs-field--compact': compact }]">
    <label v-if="!['radio', 'checks', 'rows'].includes(question.type)" class="cs-label" :for="id">{{ question.label }}</label>
    <div v-else class="cs-label" :id="`${id}-label`">{{ question.label }}</div>

    <input v-if="question.type === 'text'" :id="id" class="cs-input" type="text" maxlength="500" :value="modelValue ?? ''" @input="set($event.target.value)">

    <textarea v-else-if="question.type === 'textarea'" :id="id" class="cs-input cs-textarea" rows="3" maxlength="3000" :value="modelValue ?? ''" @input="set($event.target.value)" />

    <div v-else-if="question.type === 'number'" class="cs-unit">
      <input :id="id" class="cs-input" type="number" inputmode="decimal" :min="question.min" :max="question.max" :step="question.step ?? 1" :value="modelValue ?? ''" @input="setNumber">
      <span v-if="question.unit">{{ question.unit }}</span>
    </div>

    <div v-else-if="question.type === 'months'" class="cs-months">
      <div class="cs-unit">
        <input :id="id" class="cs-input" type="number" inputmode="numeric" min="0" max="240" step="1" :disabled="modelValue === NOT_YET"
          :value="modelValue === NOT_YET ? '' : modelValue ?? ''" :placeholder="$t('cs.age_placeholder')" @input="setNumber">
        <span>{{ $t("cs.month") }}</span>
      </div>
      <label class="cs-choice cs-choice--plain"><input type="checkbox" :checked="modelValue === NOT_YET" @change="setNotYet"> {{ $t("cs.not_yet") }}</label>
    </div>

    <input v-else-if="question.type === 'time'" :id="id" class="cs-input" type="time" :value="modelValue ?? ''" @input="set($event.target.value)">

    <select v-else-if="question.type === 'select'" :id="id" class="cs-input" :value="modelValue ?? ''" @change="set($event.target.value)">
      <option value="">{{ $t("cs.choose") }}</option>
      <option v-for="option in question.options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>

    <div v-else-if="question.type === 'radio'" class="cs-choices" role="radiogroup" :aria-labelledby="`${id}-label`">
      <button v-for="option in question.options" :key="option.value" type="button" role="radio" class="cs-choice" :class="{ 'is-on': modelValue === option.value }"
        :aria-checked="modelValue === option.value" @click="choose(option.value)">
        <span class="cs-dot" aria-hidden="true" /> {{ option.label }}
      </button>
    </div>

    <div v-else-if="question.type === 'checks'" class="cs-choices" role="group" :aria-labelledby="`${id}-label`">
      <button v-for="option in question.options" :key="option.value" type="button" role="checkbox" class="cs-choice" :class="{ 'is-on': picked.includes(option.value) }"
        :aria-checked="picked.includes(option.value)" @click="toggle(option.value)">
        <span class="cs-box" aria-hidden="true"><i v-if="picked.includes(option.value)" class="pi pi-check" /></span> {{ option.label }}
      </button>
    </div>

    <div v-else-if="question.type === 'rows'" class="cs-rows">
      <div v-for="(row, index) in rows" :key="index" class="cs-row">
        <span v-if="question.numbered" class="cs-row__n">{{ index + 1 }}</span>
        <div class="cs-row__cells" :class="{ 'cs-row__cells--one': question.columns.length === 1 }">
          <template v-for="column in question.columns.filter((item) => isVisible(item, row))" :key="column.key">
            <ConceptPicker v-if="column.type === 'concept'" :row="row" :field="column.key" :label="`${column.label} ${index + 1}`"
              :input-id="`cs-${question.key}-${index}-${column.key}`" @update="patchRow(index, $event)" />
            <CaseStudyField v-else :question="column" :name="`${question.key}-${index}-${column.key}`" compact
              :model-value="row[column.key] ?? null" @update:model-value="setCell(index, column.key, $event)" />
          </template>
        </div>
        <div class="cs-row__tools">
          <template v-if="question.numbered">
            <button type="button" class="cs-icon" :disabled="index === 0" :title="$t('cs.move_up')" :aria-label="$t('cs.move_up')" @click="move(index, -1)"><i class="pi pi-arrow-up" /></button>
            <button type="button" class="cs-icon" :disabled="index === rows.length - 1" :title="$t('cs.move_down')" :aria-label="$t('cs.move_down')" @click="move(index, 1)"><i class="pi pi-arrow-down" /></button>
          </template>
          <button type="button" class="cs-icon cs-icon--danger" :title="$t('cs.remove_row')" :aria-label="$t('cs.remove_row')" @click="removeRow(index)"><i class="pi pi-trash" /></button>
        </div>
      </div>
      <button v-if="canAdd" type="button" class="cs-add" @click="addRow"><i class="pi pi-plus" /> {{ question.add || $t("cs.add_row") }}</button>
    </div>
  </div>
</template>

<style scoped>
.cs-field {
  display: grid;
  gap: 0.5rem;
  min-width: 0;
}
.cs-label {
  font-weight: 800;
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--cs-ink, #1f1b1c);
}
.cs-field--compact .cs-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--cs-muted, #6f6669);
}
.cs-input {
  width: 100%;
  min-height: 46px;
  padding: 0.55rem 0.85rem;
  border: 1.5px solid var(--cs-line, #e5e2e1);
  border-radius: 12px;
  background: #fff;
  color: var(--cs-ink, #1f1b1c);
  font: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.cs-input:focus-visible {
  outline: none;
  border-color: var(--cs-accent, #1c6772);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--cs-accent, #1c6772) 18%, transparent);
}
.cs-input:disabled {
  background: var(--cs-soft, #f6f3f2);
}
.cs-textarea {
  resize: vertical;
  line-height: 1.8;
}
.cs-unit {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  max-width: 220px;
  color: var(--cs-muted, #6f6669);
  font-weight: 700;
}
.cs-months {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1.25rem;
}
.cs-choices {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.cs-choice {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  min-height: 44px;
  padding: 0.45rem 0.95rem;
  border: 1.5px solid var(--cs-line, #e5e2e1);
  border-radius: 999px;
  background: #fff;
  color: var(--cs-ink, #1f1b1c);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.cs-choice:hover {
  border-color: var(--cs-accent, #1c6772);
}
.cs-choice:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--cs-accent, #1c6772) 35%, transparent);
  outline-offset: 2px;
}
.cs-choice.is-on {
  border-color: var(--cs-accent, #1c6772);
  background: color-mix(in srgb, var(--cs-accent, #1c6772) 9%, #fff);
}
.cs-choice--plain {
  border: 0;
  padding-inline: 0;
  background: none;
  color: var(--cs-muted, #6f6669);
}
.cs-choice--plain input {
  width: 18px;
  height: 18px;
  accent-color: var(--cs-accent, #1c6772);
}
.cs-dot,
.cs-box {
  display: inline-grid;
  place-items: center;
  width: 18px;
  height: 18px;
  flex: none;
  border: 2px solid var(--cs-line-strong, #b9b3b5);
  background: #fff;
}
.cs-dot {
  border-radius: 50%;
}
.cs-box {
  border-radius: 5px;
  font-size: 0.65rem;
  color: #fff;
}
.is-on .cs-dot {
  border-color: var(--cs-accent, #1c6772);
  box-shadow: inset 0 0 0 3px #fff;
  background: var(--cs-accent, #1c6772);
}
.is-on .cs-box {
  border-color: var(--cs-accent, #1c6772);
  background: var(--cs-accent, #1c6772);
}
.cs-rows {
  display: grid;
  gap: 0.6rem;
}
.cs-row {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.75rem;
  border: 1.5px solid var(--cs-line, #e5e2e1);
  border-radius: 14px;
  background: var(--cs-soft, #f6f3f2);
}
.cs-row__n {
  display: grid;
  place-items: center;
  width: 28px;
  height: 46px;
  flex: none;
  font-weight: 800;
  color: var(--cs-accent, #1c6772);
}
.cs-row__cells {
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 0.6rem;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
}
.cs-row__cells--one :deep(.cs-label) {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}
.cs-row__cells :deep(.cs-field--checks) {
  grid-column: 1 / -1;
}
.cs-row__tools {
  display: flex;
  gap: 0.15rem;
  flex: none;
}
.cs-icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 46px;
  border: 0;
  border-radius: 10px;
  background: none;
  color: var(--cs-muted, #6f6669);
  cursor: pointer;
}
.cs-icon:hover:not(:disabled) {
  background: #fff;
  color: var(--cs-accent, #1c6772);
}
.cs-icon:disabled {
  opacity: 0.3;
  cursor: default;
}
.cs-icon--danger:hover:not(:disabled) {
  color: #c2282e;
}
.cs-add {
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 44px;
  padding: 0.45rem 1rem;
  border: 1.5px dashed var(--cs-accent, #1c6772);
  border-radius: 12px;
  background: none;
  color: var(--cs-accent, #1c6772);
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}
@media (max-width: 640px) {
  .cs-row {
    flex-wrap: wrap;
  }
  .cs-row__tools {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
