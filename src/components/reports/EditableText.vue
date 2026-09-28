<script setup>
// Text the user can type into directly on the report page before printing.
// Highlighted on screen; on paper it prints as plain text, or as a dotted blank line when left empty.
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  bold: Boolean,
  // Fills its cell / line instead of sitting inside a sentence.
  block: Boolean,
  multiline: Boolean,
});
const emit = defineEmits(["update:modelValue"]);
const el = ref(null);

// The element's text is only written from the model when it isn't being typed in (keeps the caret in place).
const sync = () => {
  if (el.value && el.value.innerText !== (props.modelValue ?? "")) el.value.innerText = props.modelValue ?? "";
};
onMounted(sync);
watch(() => props.modelValue, () => {
  if (document.activeElement !== el.value) sync();
});

const onInput = () => emit("update:modelValue", el.value.innerText.replace(/\n+$/, ""));
const onKeydown = (event) => {
  if (!props.multiline && event.key === "Enter") event.preventDefault();
};
// Paste as plain text only.
const onPaste = (event) => {
  event.preventDefault();
  let text = event.clipboardData?.getData("text/plain") ?? "";
  if (!props.multiline) text = text.replace(/\s*\n\s*/g, " ");
  document.execCommand("insertText", false, text);
};
</script>

<template>
  <span
    ref="el"
    class="rx-edit"
    :class="{ 'is-bold': bold, 'is-block': block, 'is-multiline': multiline, 'is-empty': !modelValue }"
    contenteditable="true"
    role="textbox"
    :aria-multiline="multiline ? 'true' : 'false'"
    :aria-label="placeholder"
    :data-placeholder="placeholder"
    spellcheck="false"
    @input="onInput"
    @keydown="onKeydown"
    @paste="onPaste"
  />
</template>

<style scoped>
.rx-edit {
  display: inline-block;
  min-width: 7rem;
  padding: 0 0.3rem;
  border-radius: 4px;
  background: #fff8db;
  box-shadow: inset 0 -1px 0 #e5c100;
  outline: none;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  cursor: text;
  transition: background-color 0.15s, box-shadow 0.15s;
}
.rx-edit:hover {
  background: #fff1b8;
}
.rx-edit:focus {
  background: #fff;
  box-shadow: 0 0 0 2px #e5c100;
}
.rx-edit.is-bold {
  font-weight: 800;
}
.rx-edit.is-block {
  display: block;
  min-width: 0;
  min-height: 1.6em;
}
.rx-edit.is-multiline.is-block {
  min-height: 3.2em;
}
.rx-edit.is-empty::before {
  content: attr(data-placeholder);
  color: #b8a14a;
  font-weight: 400;
  font-size: 0.85em;
  pointer-events: none;
}

@media print {
  .rx-edit {
    background: none !important;
    box-shadow: none !important;
    padding: 0;
  }
  .rx-edit.is-empty::before {
    content: "";
  }
  /* Left empty: a dotted line to fill in by hand. */
  .rx-edit.is-empty:not(.is-block) {
    min-width: 9rem;
    border-bottom: 1px dotted #64748b;
  }
}
</style>
