<script setup>
// Every answer of one Sensory Profile, section by section as on the form: the item, the answer (1 دائماً … 5 أبداً or X),
// what was specified («اذكر») and the section's total and comments.
import { computed } from "vue";
import { itemText, scaleName, sectionLetter } from "@/views/evaluation/sensory/sensory";

const props = defineProps({
  result: { type: Object, required: true },
  lang: { type: String, default: "ar" },
});

const sections = computed(() => (props.result.form?.scales ?? []).filter((scale) => scale.kind === "section").map((section) => ({
  ...section,
  items: (props.result.form?.items ?? []).filter((item) => item.section_id === section.id),
  score: (props.result.scores ?? []).find((score) => score.code === section.code && score.kind === "section"),
  comment: props.result.info?.section_comments?.[section.code] ?? "",
})));
const answerText = (item) => (!item.answered ? "" : item.value === null ? "X" : `${item.value} · ${item.label}`);
</script>

<template>
  <table class="sa-table" :dir="lang === 'en' ? 'ltr' : 'rtl'">
    <thead>
      <tr>
        <th class="sa-num">#</th>
        <th>{{ $t("sensory.item") }}</th>
        <th class="sa-answer">{{ $t("sensory.answer") }}</th>
      </tr>
    </thead>
    <tbody v-for="section in sections" :key="section.id">
      <tr class="sa-section">
        <th colspan="2">{{ sectionLetter(section.code, lang) }}. {{ scaleName(section, lang) }}</th>
        <th class="sa-answer"><span class="ltr">{{ section.score?.raw ?? "" }} / {{ section.score?.max ?? "" }}</span></th>
      </tr>
      <tr v-for="item in section.items" :key="item.id">
        <td class="sa-num">{{ item.number }}</td>
        <td>
          {{ itemText(item, lang) }}
          <span v-if="item.note" class="sa-note">({{ $t("sensory.specified") }}: {{ item.note }})</span>
        </td>
        <td class="sa-answer" :class="{ 'is-x': item.answered && item.value === null }">{{ answerText(item) }}</td>
      </tr>
      <tr v-if="section.comment" class="sa-comment">
        <td colspan="3"><b>{{ $t("sensory.section_comments") }}:</b> {{ section.comment }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.sa-table { width: 100%; border-collapse: collapse; font-size: 9.5pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.sa-table th, .sa-table td { padding: 1.2mm 2mm; border: 1px solid #cbd5e1; text-align: start; vertical-align: middle; line-height: 1.5; }
.sa-table thead th { background: #f1f5f9; }
.sa-num { width: 9mm; text-align: center !important; }
.sa-answer { width: 26mm; text-align: center !important; white-space: nowrap; }
.sa-answer.is-x { font-weight: 800; color: #b91c1c; }
.sa-section th { background: #edf7f5; color: #0f3d36; }
.sa-note { color: #475569; font-style: italic; }
.sa-comment td { background: #f8fafc; color: #334155; }
tbody { break-inside: auto; }
tr { break-inside: avoid; }
.ltr { direction: ltr; unicode-bidi: isolate; }
</style>
