<script setup>
// The contract text editor (Quill, right to left). {{variables}} are tinted as you type: green when on the list, red
// when not. `insert(name)` puts {{name}} where the cursor was last, even after a click outside (the variables panel).
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { VARIABLE_PATTERN } from "./contractDocument";

const props = defineProps({
  modelValue: { type: String, default: "" },
  known: { type: Object, default: () => new Set() },
  placeholder: { type: String, default: "" },
});
const emit = defineEmits(["update:modelValue"]);

const Parchment = Quill.import("parchment");
if (!Quill.imports["formats/ctvar"]) {
  Quill.register("formats/ctvar", new Parchment.ClassAttributor("ctvar", "ct-var", { scope: Parchment.Scope.INLINE, whitelist: ["ok", "bad"] }), true);
}

const host = ref(null);
let quill = null;
let lastRange = { index: 0, length: 0 };
let lastHtml = null;
let timer = null;

// The saved HTML: plain lists and paragraphs, without the tint spans or the editor's hard spaces.
const html = () => {
  const out = quill.getSemanticHTML().replace(/&nbsp;/g, " ").replace(/<span class="ct-var-(ok|bad)">([^<]*)<\/span>/g, "$2");
  return quill.getText().trim() === "" ? "" : out;
};

function tint() {
  const text = quill.getText();
  quill.formatText(0, text.length, "ctvar", false, "api");
  for (const m of text.matchAll(VARIABLE_PATTERN)) {
    quill.formatText(m.index, m[0].length, "ctvar", props.known.has(m[1]) ? "ok" : "bad", "api");
  }
}

function load(value) {
  quill.setContents(quill.clipboard.convert({ html: value || "" }), "api");
  quill.history.clear();
  tint();
  lastHtml = value || "";
}

onMounted(() => {
  quill = new Quill(host.value, {
    theme: "snow",
    placeholder: props.placeholder,
    modules: {
      toolbar: [
        [{ header: [2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "+1" }, { indent: "-1" }],
        [{ align: [] }],
        ["clean"],
      ],
      history: { userOnly: true },
    },
  });
  load(props.modelValue);
  quill.on("selection-change", (range) => {
    if (range) lastRange = range;
  });
  quill.on("text-change", (delta, old, source) => {
    if (source !== "user") return;
    clearTimeout(timer);
    timer = setTimeout(tint, 150);
    lastHtml = html();
    emit("update:modelValue", lastHtml);
  });
});

onBeforeUnmount(() => clearTimeout(timer));

// A new text from outside (the template loaded): replace the editor's content.
watch(() => props.modelValue, (value) => {
  if (quill && value !== lastHtml) load(value);
});
watch(() => props.known, () => quill && tint());

function insert(name) {
  const token = `{{${name}}}`;
  const at = Math.min(lastRange.index, quill.getLength() - 1);
  if (lastRange.length) quill.deleteText(at, lastRange.length, "user");
  quill.insertText(at, token, "user");
  quill.setSelection(at + token.length, 0, "user");
  lastRange = { index: at + token.length, length: 0 };
  tint();
}

defineExpose({ insert });
</script>

<template>
  <div class="ct-editor"><div ref="host" /></div>
</template>

<style scoped>
.ct-editor { background: #fff; border-radius: 10px; }
.ct-editor :deep(.ql-toolbar) { border-radius: 10px 10px 0 0; direction: ltr; }
.ct-editor :deep(.ql-container) { border-radius: 0 0 10px 10px; font-family: inherit; font-size: 15px; }
.ct-editor :deep(.ql-editor) { direction: rtl; text-align: right; min-height: 520px; line-height: 1.9; }
.ct-editor :deep(.ql-editor.ql-blank::before) { right: 15px; left: auto; }
.ct-editor :deep(.ql-editor li) { padding-left: 0; padding-right: 1.6em; }
.ct-editor :deep(.ql-editor li > .ql-ui:before) { margin-left: .4em; margin-right: -1.6em; text-align: left; }
.ct-editor :deep(.ql-editor .ql-indent-1) { padding-left: 0 !important; padding-right: 3.2em !important; }
.ct-editor :deep(.ql-editor .ql-indent-2) { padding-left: 0 !important; padding-right: 4.8em !important; }
.ct-editor :deep(.ql-editor .ql-indent-3) { padding-left: 0 !important; padding-right: 6.4em !important; }
.ct-editor :deep(.ql-editor .ql-align-right) { text-align: right; }
.ct-editor :deep(.ct-var-ok) { background: #e0f2f1; color: #0f5132; border-radius: 4px; padding: 0 2px; }
.ct-editor :deep(.ct-var-bad) { background: #fee2e2; color: #991b1b; border-radius: 4px; padding: 0 2px; text-decoration: wavy underline #ef4444; }
</style>
