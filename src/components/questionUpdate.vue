<script setup>
// Kept for existing imports: the edit form uses the same component as the create form.
import Question from "./question.vue";
</script>

<template>
  <Question v-bind="$attrs" />
</template>
