<script setup>
// «تعديل الإجابات» of a side-profile result that is not approved yet: the dimension's questions screen again, with the
// answers given. The result page's route holds the child and the evaluation (/children/:child_id/:sideProfile_id/:evaluation_id).
import { useRoute } from "vue-router";
import EditAnswersButton from "@/components/evaluations/EditAnswersButton.vue";

defineProps({ resultId: { type: [Number, String], required: true } });
const route = useRoute();
</script>

<template>
  <EditAnswersButton :to="{ name: 'ShowEvaluations', params: { id: route.params.evaluation_id }, query: { childId: route.params.child_id, edit: resultId } }" />
</template>
