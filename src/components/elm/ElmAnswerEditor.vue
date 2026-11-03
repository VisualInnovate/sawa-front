<script setup>
// «تعديل الإجابات» of an ELM evaluation that is not approved yet: the evaluation screen again, with the answers given.
// The result page's route holds the child (/elm-result/:id/:evaluation).
import { useRoute } from "vue-router";
import EditAnswersButton from "@/components/evaluations/EditAnswersButton.vue";

defineProps({ evaluationId: { type: [Number, String], required: true } });
const route = useRoute();
</script>

<template>
  <EditAnswersButton :to="{ name: 'elm-evaluation', params: { id: route.params.id }, query: { edit: evaluationId } }" />
</template>
