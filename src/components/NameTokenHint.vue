<script setup>
// "Type {{name}} ..." hint with a copy button, for forms whose text gets the child's name.
import { onBeforeUnmount, ref } from "vue";

defineProps({ text: { type: String, required: true } });

const token = "{{name}}";
const copied = ref(false);
let timer;
async function copy() {
  try {
    await navigator.clipboard.writeText(token);
  } catch {
    const input = document.createElement("textarea");
    input.value = token;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }
  copied.value = true;
  clearTimeout(timer);
  timer = setTimeout(() => { copied.value = false; }, 2000);
}
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <div class="name-hint">
    <i class="pi pi-info-circle" aria-hidden="true" />
    <span>{{ $t("name_token_hint_before") }}</span>
    <code dir="ltr">{{ token }}</code>
    <Button type="button" size="small" variant="text" :icon="copied ? 'pi pi-check' : 'pi pi-copy'"
      :label="copied ? $t('copied') : $t('copy')" class="hint-copy" @click="copy" />
    <span class="hint-rest">{{ text }}</span>
  </div>
</template>

<style scoped>
.name-hint {
  display: flex; flex-wrap: wrap; align-items: center; gap: .35rem;
  padding: .45rem .75rem; border-radius: .5rem;
  background: var(--sawa-primary-soft); color: var(--sawa-primary); font-size: .85rem; line-height: 1.6;
}
.name-hint code { font-weight: 700; background: #fff; border-radius: .3rem; padding: 0 .35rem; }
.hint-copy { padding: .1rem .4rem; }
.hint-rest { flex-basis: 100%; color: #3f6f75; }
</style>
