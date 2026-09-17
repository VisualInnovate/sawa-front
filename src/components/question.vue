<script>
// One evaluation header (category) with its 2 or 3 questions, as an accordion panel.
// Emits `question-inputs(headerId, questions)` whenever the questions change.
export default {
  name: "question",
  props: {
    header: { type: Object, required: true },
    questionsAndHeader: { type: Array, default: undefined },
    showErrors: Boolean,
  },
  emits: ["question-inputs"],
  data: () => ({
    questionInputs: ["", ""],
  }),
  computed: {
    canAdd() {
      return this.questionInputs.length < 3;
    },
    // Only a partly written header is incomplete; an untouched one is simply skipped.
    missing() {
      const blanks = this.questionInputs.filter((value) => !String(value ?? "").trim()).length;
      return blanks === this.questionInputs.length ? 0 : blanks;
    },
  },
  methods: {
    toggleThird() {
      if (this.canAdd) this.questionInputs.push("");
      else this.questionInputs.splice(-1, 1);
      this.returnparent();
    },
    returnparent() {
      this.$emit("question-inputs", this.header.id, [...this.questionInputs]);
    },
  },
  created() {
    if (this.questionsAndHeader?.length) {
      this.questionInputs = this.questionsAndHeader.map((value) => value.questions?.title ?? "");
    }
    this.returnparent();
  },
};
</script>

<template>
  <AccordionPanel :value="header.id">
    <AccordionHeader>
      <span class="header-title">{{ header.title }}</span>
      <Tag v-if="showErrors && missing" severity="danger" :value="$t('questions_missing', { count: missing })" class="ms-2" />
    </AccordionHeader>
    <AccordionContent>
      <div class="questions">
        <div v-for="(question, index) in questionInputs" :key="index" class="field">
          <label :for="`q-${header.id}-${index}`">{{ $t("question") }} {{ index + 1 }}</label>
          <InputText
            :id="`q-${header.id}-${index}`"
            v-model="questionInputs[index]"
            fluid
            :invalid="showErrors && missing > 0 && !String(questionInputs[index] ?? '').trim()"
            @update:modelValue="returnparent"
          />
        </div>
        <div class="questions-actions">
          <Button
            type="button"
            size="small"
            variant="outlined"
            :severity="canAdd ? 'success' : 'danger'"
            :icon="canAdd ? 'pi pi-plus' : 'pi pi-minus'"
            :label="canAdd ? $t('add_third_question') : $t('remove_third_question')"
            @click="toggleThird"
          />
        </div>
      </div>
    </AccordionContent>
  </AccordionPanel>
</template>

<style scoped>
.header-title {
  font-size: 1.05rem;
  font-weight: 700;
}
.questions {
  display: grid;
  gap: 0.75rem;
}
.questions-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
