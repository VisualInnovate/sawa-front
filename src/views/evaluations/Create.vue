<script>
import axios from "axios";
import questionComponent from "../../components/question.vue";

export default {
  components: { questionComponent },
  data: () => ({
    evaluation: { title: "", side_profile_id: "", six_month: true, questions: [] },
    headers: [],
    questions: {},
    submitted: false,
    saving: false,
  }),
  computed: {
    titleError() {
      return this.submitted && !this.evaluation.title.trim();
    },
    // A header is either left empty (skipped) or has all of its questions written.
    filledGroups() {
      return Object.entries(this.questions)
        .map(([headerId, list]) => ({ headerId: Number(headerId), questions: list.map((q) => String(q ?? "").trim()) }))
        .filter((group) => group.questions.some(Boolean));
    },
    questionsError() {
      return this.submitted && (this.filledGroups.length === 0 || this.filledGroups.some((group) => group.questions.some((q) => !q)));
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    addQuestion(headerId, inputs) {
      this.questions = { ...this.questions, [headerId]: inputs };
    },
    async submit() {
      this.submitted = true;
      if (this.titleError || this.questionsError || this.saving) return;
      this.saving = true;
      const payload = {
        ...this.evaluation,
        type: 1,
        side_profile_id: this.$route.params.sideProfile_id,
        questions: this.filledGroups,
      };
      try {
        await axios.post("/api/evaluations/create", payload);
        this.$toast.add({ severity: "success", summary: this.$t("success_message"), detail: this.$t("successful"), life: 3000 });
        this.$router.go(-1);
      } catch (error) {
        this.$toast.add({ severity: "error", summary: this.$t("error"), detail: error.response?.data?.message ?? this.$t("request_failed_retry"), life: 5000 });
      } finally {
        this.saving = false;
      }
    },
    getQuestionHeaders() {
      axios.get("/api/evaluationheaders").then((res) => {
        this.headers = res.data.headers ?? [];
      });
    },
  },
  mounted() {
    this.getQuestionHeaders();
  },
};
</script>

<template>
  <div class="page">
    <Toast />
    <div class="page-header">
      <h1 class="page-title">{{ $t("create_evaluation") }}</h1>
      <BackButton />
    </div>

    <form class="surface-card form-stack" novalidate data-no-request-spinner @submit.prevent="submit">
      <div class="field">
        <label for="evaluation-title">{{ $t("evaluation_title") }}</label>
        <InputText id="evaluation-title" v-model="evaluation.title" fluid :invalid="titleError" />
        <small v-if="titleError" class="field-error">{{ $t("field_required") }}</small>
      </div>

      <div class="check-row">
        <Checkbox v-model="evaluation.six_month" inputId="evaluation-six-month" binary />
        <label for="evaluation-six-month">{{ $t("evaluation_exception") }}</label>
      </div>

      <Message v-if="questionsError" severity="error" :closable="false">{{ $t("fill_all_questions") }}</Message>

      <Accordion multiple>
        <questionComponent v-for="head in headers" :key="head.id" :header="head" :showErrors="submitted" @question-inputs="addQuestion" />
      </Accordion>

      <div class="form-actions">
        <Button type="submit" :label="$t('submit')" icon="pi pi-check" :loading="saving" />
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-stack {
  display: grid;
  gap: 1rem;
}
.check-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.form-actions {
  display: flex;
  justify-content: center;
}
.form-actions .p-button {
  min-width: 12rem;
}
</style>
