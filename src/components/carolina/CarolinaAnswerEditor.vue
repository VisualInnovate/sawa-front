<script setup>
// «تعديل الإجابات» of a Carolina evaluation that is not approved yet: the evaluation screen again, with the answers
// given. The screen finds the child from the evaluation.
import EditAnswersButton from "@/components/evaluations/EditAnswersButton.vue";

defineProps({ evaluationId: { type: [Number, String], required: true } });
</script>

<template>
  <EditAnswersButton :to="{ name: 'carolina-test', params: { id: evaluationId }, query: { edit: evaluationId } }" />
</template>
