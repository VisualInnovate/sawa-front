<script setup>
// «تعديل الإجابات» of an ABLLS or Ablls OT evaluation that is not approved yet: the evaluation screen again, with the
// answers given. `api` is the assessment's prefix: "able" or "skills". The screen finds the child from the evaluation.
import EditAnswersButton from "@/components/evaluations/EditAnswersButton.vue";

defineProps({
  evaluationId: { type: [Number, String], required: true },
  api: { type: String, default: "able" },
});
</script>

<template>
  <EditAnswersButton :to="{ name: api === 'skills' ? 'skills-test' : 'mission-test', params: { id: evaluationId }, query: { edit: evaluationId } }" />
</template>
