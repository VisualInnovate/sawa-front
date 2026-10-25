<script setup>
// Approve or reject a request; a rejection needs its reason. Emits `decide` with { approved, note }.
import { ref, watch } from "vue";

const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: "" },
  loading: { type: Boolean, default: false },
});
const emit = defineEmits(["update:visible", "decide"]);

const rejecting = ref(false);
const note = ref("");
watch(() => props.visible, (open) => {
  if (open) {
    rejecting.value = false;
    note.value = "";
  }
});
</script>

<template>
  <Dialog :visible="visible" modal :header="title" :style="{ width: '30rem' }" :breakpoints="{ '640px': '94vw' }" @update:visible="emit('update:visible', $event)">
    <slot />
    <Transition name="dd-note">
      <div v-if="rejecting" class="dd-note">
        <label for="dd-note-input">{{ $t("decision_reason") }}</label>
        <Textarea id="dd-note-input" v-model="note" rows="3" autoResize autofocus class="w-full" :placeholder="$t('decision_reason_hint')" />
      </div>
    </Transition>
    <template #footer>
      <template v-if="!rejecting">
        <Button icon="pi pi-times" :label="$t('decision_reject')" severity="danger" variant="outlined" :disabled="loading" @click="rejecting = true" />
        <Button icon="pi pi-check" :label="$t('decision_approve')" severity="success" :loading="loading" @click="emit('decide', { approved: true, note: null })" />
      </template>
      <template v-else>
        <Button :label="$t('back')" variant="text" severity="secondary" :disabled="loading" @click="rejecting = false" />
        <Button icon="pi pi-times" :label="$t('decision_confirm_reject')" severity="danger" :loading="loading" :disabled="!note.trim()"
          @click="emit('decide', { approved: false, note: note.trim() })" />
      </template>
    </template>
  </Dialog>
</template>

<style scoped>
.dd-note { display: grid; gap: .35rem; margin-top: .8rem; }
.dd-note label { font-weight: 700; color: #b91c1c; }
.dd-note-enter-active, .dd-note-leave-active { transition: all .25s ease; }
.dd-note-enter-from, .dd-note-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
