<script>
import axios from "axios";
import SideProfileQuestionGroup from "../../components/SideProfileQuestionGroup.vue";
import NameTokenHint from "../../components/NameTokenHint.vue";
import { genders } from "../../utils/sideProfileWording";

export default {
  components: { SideProfileQuestionGroup, NameTokenHint },
  data: () => ({
    evaluation: { title: "", side_profile_id: "", six_month: true, questions: [] },
    headers: [],
    questions: {},
    headerAndQuestions: null,
    sideProfile: [],
    loading: true,
    loadError: false,
    submitted: false,
    saving: false,
  }),
  computed: {
    titleError() {
      return this.submitted && this.evaluation.title.trim().length < 3;
    },
    // A header is either left untouched (skipped) or has a boy's and a girl's title for every question.
    // Each question is { male: { title, yes, no }, female: { title, yes, no } }; the answer wording is optional.
    filledGroups() {
      const trimmed = (question) => Object.fromEntries(genders.map((gender) => [gender,
        Object.fromEntries(Object.entries(question[gender]).map(([key, value]) => [key, String(value ?? "").trim()]))]));
      return Object.entries(this.questions)
        .map(([headerId, list]) => ({ headerId: Number(headerId), questions: list.map(trimmed) }))
        .filter((group) => group.questions.some((question) => genders.some((gender) => Object.values(question[gender]).some(Boolean))));
    },
    questionsError() {
      return this.submitted && (this.filledGroups.length === 0 || this.filledGroups.some((group) =>
        group.questions.some((question) => genders.some((gender) => !question[gender].title))));
    },
  },
  methods: {
    addQuestion(headerId, inputs) {
      this.questions = { ...this.questions, [headerId]: inputs };
    },
    async submit() {
      this.submitted = true;
      if (this.titleError || this.questionsError || this.saving) return;
      this.saving = true;
      const payload = {
        ...this.evaluation,
        questions: this.filledGroups,
      };
      try {
        await axios.post(`/api/evaluations/${this.$route.params.id}/update`, payload);
        this.$toast.add({ severity: "success", summary: this.$t("success_message"), detail: this.$t("successful"), life: 3000 });
      } catch (error) {
        const data = error.response?.data ?? {};
        const detail = Array.isArray(data.questions)
          ? `${this.$t("question_has_scores")} ${data.questions.join("، ")}`
          : data.errors
            ? Object.values(data.errors).flat()[0]
            : data.message ?? this.$t("request_failed_retry");
        this.$toast.add({ severity: "error", summary: this.$t("error"), detail, life: 8000 });
      } finally {
        this.saving = false;
      }
    },
    getSideProfile() {
      axios.get("/api/side-profiles").then((res) => {
        this.sideProfile = (res.data.sideProfile ?? []).map((elem) => ({ title: elem.title, value: elem.id }));
      });
    },
    getQuestionHeaders() {
      return axios.get("/api/evaluationheaders").then((res) => {
        this.headers = res.data.headers ?? [];
      });
    },
    getQuestions() {
      const id = this.$route.params.id;
      return Promise.all([
        axios.get(`/api/evaluations/${id}`).then((res) => {
          this.headerAndQuestions = res.data.evaluation ?? {};
        }),
        axios.get(`/api/evaluations/${id}/show`).then((res) => {
          const evaluation = res.data.evaluation;
          this.evaluation.title = evaluation.title ?? "";
          this.evaluation.side_profile_id = evaluation.side_profile_id;
          this.evaluation.six_month = Boolean(Number(evaluation.six_month));
        }),
      ]);
    },
  },
  async created() {
    this.getSideProfile();
    try {
      await Promise.all([this.getQuestions(), this.getQuestionHeaders()]);
    } catch {
      this.loadError = true;
    } finally {
      this.loading = false;
    }
  },
};
</script>

<template>
  <div class="page">
    <Toast />
    <div class="page-header">
      <h1 class="page-title">{{ $t("edit_evaluation") }}</h1>
      <BackButton />
    </div>

    <div v-if="loading" class="surface-card empty-state"><ProgressSpinner style="width: 40px; height: 40px" /></div>
    <Message v-else-if="loadError" severity="error" :closable="false">{{ $t("evaluation_not_found") }}</Message>

    <form v-else class="surface-card form-stack" novalidate data-no-request-spinner @submit.prevent="submit">
      <div class="form-grid">
        <div class="field">
          <label for="evaluation-title">{{ $t("evaluation_title") }}</label>
          <InputText id="evaluation-title" v-model="evaluation.title" fluid :invalid="titleError" />
          <small v-if="titleError" class="field-error">{{ $t("min_3_chars") }}</small>
        </div>
        <div class="field">
          <label for="evaluation-side-profile">{{ $t("side_profile_title") }}</label>
          <Select inputId="evaluation-side-profile" v-model="evaluation.side_profile_id" :options="sideProfile"
            optionLabel="title" optionValue="value" showClear fluid :placeholder="$t('side_profile_title')" />
        </div>
      </div>

      <div class="check-row">
        <Checkbox v-model="evaluation.six_month" inputId="evaluation-six-month" binary />
        <label for="evaluation-six-month">{{ $t("evaluation_exception") }}</label>
      </div>

      <NameTokenHint :text="$t('side_profile_wording.name_hint_after')" />

      <Message v-if="questionsError" severity="error" :closable="false">{{ $t("fill_all_questions") }}</Message>

      <Accordion multiple>
        <SideProfileQuestionGroup v-for="head in headers" :key="head.id" :header="head"
          :questionsAndHeader="headerAndQuestions[head.id]" :showErrors="submitted" @question-inputs="addQuestion" />
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
