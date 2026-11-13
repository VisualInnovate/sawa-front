<script setup>
// «دراسة حالة الطالب» as it was answered: every section with its questions and the parent's answers (reading only).
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { answerText, isAnswered, isVisible, visibleAnswers } from "@/utils/caseStudy";

const props = defineProps({
  sections: { type: Array, required: true },
  answers: { type: Object, default: () => ({}) },
  // Hide the questions left without an answer.
  answeredOnly: { type: Boolean, default: false },
});
const { t } = useI18n();

const view = computed(() => {
  const kept = visibleAnswers(props.sections, props.answers);
  return props.sections.map((section) => ({
    key: section.key,
    title: section.title,
    rows: section.questions
      .filter((question) => isVisible(question, kept) && (!props.answeredOnly || isAnswered(kept[question.key])) && !(question.optional && !isAnswered(kept[question.key])))
      .map((question) => ({ question, value: kept[question.key], text: question.type === "rows" ? "" : answerText(question, kept[question.key], t("cs.not_yet")) })),
  })).filter((section) => section.rows.length);
});
// A column nobody filled in (the «other» position) is left out of the table.
const columnsOf = (row) => row.question.columns.filter((column) => row.value.some((item) => isAnswered(item[column.key])));
const cell = (column, row) => answerText(column, row[column.key], t("cs.not_yet")) || "—";
</script>

<template>
  <div class="cs-answers">
    <section v-for="(section, at) in view" :key="section.key" class="cs-answers__section">
      <h3 class="cs-answers__title"><span>{{ at + 1 }}</span> {{ section.title }}</h3>
      <dl class="cs-answers__list">
        <div v-for="row in section.rows" :key="row.question.key" class="cs-answers__row" :class="{ 'is-wide': row.question.type === 'rows' || row.question.type === 'textarea', 'is-sub': row.question.show_if }">
          <dt>{{ row.question.label }}</dt>
          <dd v-if="row.question.type !== 'rows'" :class="{ 'is-empty': !row.text }">{{ row.text || $t("cs.no_answer") }}</dd>
          <dd v-else-if="!isAnswered(row.value)" class="is-empty">{{ $t("cs.no_answer") }}</dd>
          <dd v-else-if="row.question.columns.length === 1">
            <ol class="cs-answers__ordered"><li v-for="(item, index) in row.value" :key="index">{{ cell(row.question.columns[0], item) }}</li></ol>
          </dd>
          <dd v-else class="cs-answers__table-wrap">
            <table class="cs-answers__table">
              <thead><tr><th v-for="column in columnsOf(row)" :key="column.key">{{ column.label }}</th></tr></thead>
              <tbody><tr v-for="(item, index) in row.value" :key="index"><td v-for="column in columnsOf(row)" :key="column.key">{{ cell(column, item) }}</td></tr></tbody>
            </table>
          </dd>
        </div>
      </dl>
    </section>
  </div>
</template>

<style scoped>
.cs-answers {
  display: grid;
  gap: 1.25rem;
}
.cs-answers__title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin: 0 0 0.6rem;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--cs-ink, #1f1b1c);
}
.cs-answers__title span {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--cs-accent, #1c6772);
  color: #fff;
  font-size: 0.85rem;
}
.cs-answers__list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0;
  margin: 0;
  border: 1px solid var(--cs-line, #e5e2e1);
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}
.cs-answers__row {
  padding: 0.7rem 0.9rem;
  border-bottom: 1px solid var(--cs-line, #e5e2e1);
  min-width: 0;
}
.cs-answers__row.is-wide {
  grid-column: 1 / -1;
}
.cs-answers__row.is-sub {
  background: var(--cs-soft, #faf8f7);
}
.cs-answers__row dt {
  font-size: 0.82rem;
  line-height: 1.6;
  color: var(--cs-muted, #6f6669);
}
.cs-answers__row dd {
  margin: 0.15rem 0 0;
  font-weight: 700;
  line-height: 1.8;
  color: var(--cs-ink, #1f1b1c);
  white-space: pre-line;
  overflow-wrap: anywhere;
}
.cs-answers__row dd.is-empty {
  font-weight: 400;
  color: var(--cs-muted, #9a9295);
}
.cs-answers__ordered {
  margin: 0;
  padding-inline-start: 1.25rem;
}
.cs-answers__table-wrap {
  overflow-x: auto;
}
.cs-answers__table {
  width: 100%;
  border-collapse: collapse;
  font-weight: 400;
}
.cs-answers__table th,
.cs-answers__table td {
  padding: 0.45rem 0.6rem;
  border: 1px solid var(--cs-line, #e5e2e1);
  text-align: start;
  vertical-align: top;
}
.cs-answers__table th {
  background: var(--cs-soft, #f6f3f2);
  font-size: 0.8rem;
  color: var(--cs-muted, #6f6669);
}
@media (max-width: 720px) {
  .cs-answers__list {
    grid-template-columns: 1fr;
  }
}
@media print {
  .cs-answers__section {
    break-inside: avoid;
  }
}
</style>
