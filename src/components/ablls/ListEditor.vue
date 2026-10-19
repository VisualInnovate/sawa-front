<script setup>
// An ordered list of texts (goals, questions, sub goals ...): type and press Enter to add, edit in place,
// reorder or remove. Each item shows its code (C13.1-1, R1-2 ...) when a prefix is given.
import { nextTick, ref } from 'vue'

const items = defineModel({ type: Array, default: () => [] })
const props = defineProps({
  label: { type: String, required: true },
  icon: { type: String, default: 'pi pi-list' },
  placeholder: { type: String, default: '' },
  prefix: { type: String, default: '' },
  required: { type: Boolean, default: false },
  error: { type: String, default: '' },
  // The matching item of another wording (the boy's text under the girl's), shown under each item.
  reference: { type: Array, default: () => [] },
  referenceLabel: { type: String, default: '' },
})
const emit = defineEmits(['change'])

const draft = ref('')
const input = ref(null)

const add = () => {
  const text = draft.value.trim()
  if (!text) return
  items.value = [...items.value, text]
  draft.value = ''
  emit('change')
  nextTick(() => input.value?.$el?.focus?.())
}
const remove = (i) => {
  items.value = items.value.filter((_, j) => j !== i)
  emit('change')
}
const move = (i, dir) => {
  const j = i + dir
  if (j < 0 || j >= items.value.length) return
  const list = [...items.value]
  ;[list[i], list[j]] = [list[j], list[i]]
  items.value = list
}
const update = (i, value) => {
  const list = [...items.value]
  list[i] = value
  items.value = list
}

// Saves a typed but not yet added item (called by the form before it validates).
const flush = () => add()
defineExpose({ flush })
</script>

<template>
  <div class="le">
    <div class="le-head">
      <i :class="[icon, 'le-icon']" aria-hidden="true" />
      <span class="le-label">{{ label }}<span v-if="required" class="ab-req">*</span></span>
      <span class="le-count">{{ items.length }}</span>
    </div>

    <div class="le-add">
      <Textarea
        ref="input"
        v-model="draft"
        rows="1"
        auto-resize
        :placeholder="placeholder"
        :invalid="!!error"
        :aria-label="label"
        fluid
        @keydown.enter.exact.prevent="add"
      />
      <Button type="button" icon="pi pi-plus" :aria-label="$t('ablls_ui.add_item')" v-tooltip.top="$t('ablls_ui.add_item')" :disabled="!draft.trim()" @click="add" />
    </div>
    <small v-if="error" class="ab-error">{{ error }}</small>

    <ol v-if="items.length" class="le-list">
      <li v-for="(item, i) in items" :key="i" class="le-item">
        <span class="le-num" :class="{ 'is-code': prefix }">{{ prefix ? `${prefix}-${i + 1}` : i + 1 }}</span>
        <div class="le-body">
          <Textarea :model-value="item" rows="1" auto-resize class="le-input" :aria-label="`${label} ${i + 1}`" @update:model-value="update(i, $event)" />
          <small v-if="reference[i]" class="le-ref"><b>{{ referenceLabel }}:</b> {{ reference[i] }}</small>
        </div>
        <div class="le-actions">
          <Button type="button" icon="pi pi-chevron-up" text rounded size="small" severity="secondary" :disabled="i === 0" :aria-label="$t('ablls_ui.move_up')" @click="move(i, -1)" />
          <Button type="button" icon="pi pi-chevron-down" text rounded size="small" severity="secondary" :disabled="i === items.length - 1" :aria-label="$t('ablls_ui.move_down')" @click="move(i, 1)" />
          <Button type="button" icon="pi pi-times" text rounded size="small" severity="danger" :aria-label="$t('ablls_ui.remove')" @click="remove(i)" />
        </div>
      </li>
    </ol>
    <div v-else class="le-empty">{{ $t('ablls_ui.no_items') }}</div>
  </div>
</template>

<style scoped>
.le {
  display: grid;
  gap: 0.55rem;
  min-width: 0;
}
.le-head {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 700;
  color: var(--sawa-text);
}
.le-icon {
  color: var(--sawa-primary);
  font-size: 0.9rem;
}
.le-count {
  padding: 0 0.5rem;
  border-radius: 999px;
  background: var(--sawa-primary-soft);
  color: var(--sawa-primary);
  font-size: 0.75rem;
}
.le-add {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}
.le-add .p-button {
  flex: none;
}
.le-list {
  display: grid;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
.le-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.35rem;
  border: 1px solid var(--sawa-border);
  border-radius: 10px;
  background: #fbfcfd;
  transition: border-color 0.15s;
}
.le-item:focus-within {
  border-color: var(--sawa-primary);
  background: #fff;
}
.le-num {
  flex: none;
  display: grid;
  place-items: center;
  min-width: 1.8rem;
  height: 1.8rem;
  margin-top: 0.3rem;
  padding: 0 0.35rem;
  border-radius: 8px;
  background: var(--sawa-primary);
  color: #fff;
  font-weight: 700;
  font-size: 0.78rem;
  direction: ltr;
  unicode-bidi: isolate;
}
.le-num.is-code {
  background: var(--sawa-primary-soft);
  color: var(--sawa-primary);
}
.le-body {
  flex: 1;
  display: grid;
  min-width: 0;
}
.le-ref {
  padding: 0 0.75rem 0.3rem;
  color: var(--sawa-muted);
  font-size: 0.78rem;
  line-height: 1.6;
}
.le-input {
  flex: 1;
  min-width: 0;
  border-color: transparent;
  background: transparent;
  box-shadow: none;
  resize: none;
  line-height: 1.7;
}
.le-input:focus {
  border-color: transparent;
  box-shadow: none;
}
.le-actions {
  display: flex;
  flex: none;
}
.le-actions .p-button {
  width: 1.9rem;
  height: 1.9rem;
}
.le-empty {
  padding: 0.9rem;
  border: 1px dashed #cbd5e1;
  border-radius: 10px;
  color: var(--sawa-muted);
  font-size: 0.85rem;
  text-align: center;
}
</style>
