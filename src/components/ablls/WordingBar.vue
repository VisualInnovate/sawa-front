<script setup>
// The head of a skill's boy / girl wording box: the male/female switch (with a mark on the gender that has errors),
// a copy from the other gender with its undo note, and the {{name}} hint.
import { computed } from 'vue'
import NameTokenHint from '@/components/NameTokenHint.vue'

const props = defineProps({
  gender: { type: String, required: true },
  title: { type: String, required: true },
  hint: { type: String, required: true },
  hasError: { type: Function, default: () => false },
  otherHasText: Boolean,
  // The gender the last copy went into, while it can be undone.
  undoneGender: { type: String, default: null },
})
const emit = defineEmits(['switch', 'copy', 'undo'])

const genders = ['male', 'female']
const otherOf = (g) => (g === 'male' ? 'female' : 'male')
const otherGender = computed(() => otherOf(props.gender))
</script>

<template>
  <div class="wb-bar">
    <span class="wb-title"><i class="pi pi-users" aria-hidden="true" />{{ title }}</span>
    <div class="wb-tools">
      <SelectButton :model-value="gender" :options="genders" :allow-empty="false" size="small" :aria-label="title" @update:model-value="emit('switch', $event)">
        <template #option="{ option }">
          <span>{{ $t(option) }}</span>
          <span v-if="hasError(option)" class="wb-error-marker" :title="$t('ablls_ui.fix_errors')">!</span>
        </template>
      </SelectButton>
      <Button type="button" size="small" severity="secondary" variant="outlined" icon="pi pi-clone"
        :label="$t(`gender_text.copy_from_${otherGender}`)" :disabled="!otherHasText"
        v-tooltip.top="$t('gender_text.copy_hint')" @click="emit('copy')" />
    </div>
  </div>
  <Message v-if="undoneGender" severity="success" size="small" :closable="false" class="wb-undo">
    <span>{{ $t(`gender_text.copied_from_${otherOf(undoneGender)}`) }}</span>
    <Button type="button" size="small" variant="link" :label="$t('undo')" @click="emit('undo')" />
  </Message>
  <NameTokenHint :text="hint" />
</template>

<style scoped>
.wb-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.wb-title {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 700;
  color: var(--sawa-text);
}
.wb-title .pi {
  color: var(--sawa-primary);
  font-size: 0.85rem;
}
.wb-tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}
.wb-error-marker {
  display: inline-grid;
  place-items: center;
  width: 1.1rem;
  height: 1.1rem;
  margin-inline-start: 0.4rem;
  border-radius: 50%;
  background: #dc2626;
  color: #fff;
  font-size: 0.75rem;
}
.wb-undo :deep(.p-message-text) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
