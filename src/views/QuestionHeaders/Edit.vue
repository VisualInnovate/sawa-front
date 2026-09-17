<script>
import axios from "axios";
import QuestionHeaderForm from "@/components/evaluation/QuestionHeaderForm.vue";

// The API stores months (min_age + span in `type`); the form works in years.
const toForm = (header) => ({ ...header, from: header.min_age / 12, to: (header.min_age + header.type) / 12 });

export default {
  components: { QuestionHeaderForm },
  data: () => ({
    questionHeader: null,
    saving: false,
  }),
  methods: {
    async submit() {
      this.saving = true;
      try {
        const res = await axios.post(`/api/evaluationheaders/${this.$route.params.id}/update`, this.questionHeader);
        if (res.data.header) this.questionHeader = toForm(res.data.header);
        this.$toast.add({ severity: "success", summary: this.$t("success_message"), detail: res.data.message ?? this.$t("successful"), life: 3000 });
      } catch (error) {
        this.$toast.add({ severity: "error", summary: this.$t("error"), detail: error.response?.data?.message ?? this.$t("request_failed_retry"), life: 5000 });
      } finally {
        this.saving = false;
      }
    },
  },
  mounted() {
    axios.get(`/api/evaluationheaders/${this.$route.params.id}`).then((res) => {
      this.questionHeader = toForm(res.data.header);
    });
  },
};
</script>

<template>
  <div class="page">
    <Toast />
    <div class="page-header">
      <h1 class="page-title">{{ $t("edit_header") }}</h1>
      <BackButton />
    </div>
    <QuestionHeaderForm v-if="questionHeader" v-model="questionHeader" :saving="saving" @submit="submit" />
    <div v-else class="surface-card empty-state"><ProgressSpinner style="width: 40px; height: 40px" /></div>
  </div>
</template>
