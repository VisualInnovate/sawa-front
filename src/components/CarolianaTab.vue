<script setup>
import NavTabs from "./common/NavTabs.vue";

const items = [
  { to: { name: 'agerange' }, label: 'age_range', perm: 'carolina age range list' },
  { to: { name: 'category' }, label: 'category', perm: 'carolina category list' },
  { to: { name: 'answer_type' }, label: 'answer_type', perm: 'carolina answer type list' },
  { to: { name: 'test' }, label: 'test', perm: 'carolina test list' },
];
</script>

<template>
  <NavTabs :items="items" />
</template>
