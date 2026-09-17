<script setup>
import NavTabs from "./common/NavTabs.vue";

const items = [
  { to: { name: 'barrier-subtest' }, label: 'Subtest', perm: 'barrier subtest list' },
  { to: { name: 'barrier-question' }, label: 'questions', perm: 'barrier question list' },
  { to: { name: 'barrier-answer-type' }, label: 'answer_type', perm: 'barrier answer type list' },
];
</script>

<template>
  <NavTabs :items="items" />
</template>
