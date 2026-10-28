<script setup>
// The VB-MAPP Transition scoring form: one box per question (in the form's order), 4 columns (the child's last four
// Transition evaluations, oldest first, left to right) by 5 rows (score 1 at the bottom, 5 at the top). A column is
// filled from the bottom up to that evaluation's score, in its color.
const props = defineProps({
  // [{ id, title, display_order }]
  questions: { type: Array, required: true },
  // [{ evaluation_id, color, scores: { [question_id]: 1-5 } }], oldest first, at most four
  columns: { type: Array, required: true },
});

const ROWS = [5, 4, 3, 2, 1];
const COLUMNS = [0, 1, 2, 3];

const fill = (question, column, row) => {
  const test = props.columns[column];
  const score = Number(test?.scores?.[question.id] ?? test?.scores?.[String(question.id)] ?? 0);
  return score >= row ? `#${String(test.color || "135c65").replace("#", "")}` : "transparent";
};
</script>

<template>
  <div class="tg">
    <section v-for="question in questions" :key="question.id" class="tg-item">
      <h5><span class="tg-n">{{ question.display_order }}</span> {{ question.title }}</h5>
      <div class="tg-grid">
        <template v-for="row in ROWS" :key="row">
          <span class="tg-label">{{ row }}</span>
          <span v-for="column in COLUMNS" :key="column" class="tg-cell" :style="{ background: fill(question, column, row) }" />
        </template>
        <span />
        <span v-for="column in COLUMNS" :key="'c' + column" class="tg-label tg-col">{{ column + 1 }}</span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tg {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.25rem 1rem;
}
.tg-item {
  display: grid;
  align-content: start;
  gap: 6px;
  break-inside: avoid;
}
.tg-item h5 {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 4px;
  min-height: 3.2em;
  margin: 0;
  font-size: 0.8rem;
  font-weight: 800;
  line-height: 1.35;
  text-align: center;
  color: #1e293b;
}
.tg-n {
  color: var(--sawa-primary, rgb(var(--bp-135c65)));
}
.tg-grid {
  display: grid;
  grid-template-columns: 16px repeat(4, 1fr);
  width: 100%;
  max-width: 150px;
  margin-inline: auto;
  direction: ltr;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.tg-label {
  display: grid;
  place-items: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: #64748b;
}
.tg-col {
  padding-top: 2px;
}
.tg-cell {
  height: 22px;
  border: 1px solid #1e293b;
  margin: 0 -1px -1px 0;
}
</style>
