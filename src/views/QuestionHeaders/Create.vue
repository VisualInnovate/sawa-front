<script>
import axios from "axios";
import QuestionHeaderForm from "@/components/evaluation/QuestionHeaderForm.vue";

const emptyHeader = () => ({ title: "", from: "", to: "" });

export default {
  components: { QuestionHeaderForm },
  data: () => ({
    questionHeader: emptyHeader(),
    saving: false,
    formKey: 0,
  }),
  methods: {
    async submit() {
      this.saving = true;
      try {
        const res = await axios.post("/api/evaluationheaders/create", this.questionHeader);
        this.$toast.add({ severity: "success", summary: this.$t("success_message"), detail: res.data.message ?? this.$t("successful"), life: 3000 });
        this.questionHeader = emptyHeader();
        this.formKey += 1;
      } catch (error) {
        this.$toast.add({ severity: "error", summary: this.$t("error"), detail: error.response?.data?.message ?? this.$t("request_failed_retry"), life: 5000 });
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<template>
  <div class="page">
    <Toast />
    <div class="page-header">
      <h1 class="page-title">{{ $t("add_header") }}</h1>
      <BackButton />
    </div>
    <QuestionHeaderForm :key="formKey" v-model="questionHeader" :saving="saving" @submit="submit" />
  </div>
</template>
