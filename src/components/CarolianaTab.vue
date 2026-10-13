<script setup>
import NavTabs from "./common/NavTabs.vue";

const items = [
  { to: { name: 'agerange' }, label: 'age_range', perm: 'carolina age range list' },
  { to: { name: 'carolina-general-goals' }, label: 'carolina_ui.general_goals', perm: 'carolina general goal list' },
  { to: { name: 'category' }, label: 'carolina_ui.domain', perm: 'carolina category list' },
  { to: { name: 'answer_type' }, label: 'answer_type', perm: 'carolina answer type list' },
  { to: { name: 'test' }, label: 'carolina_ui.items', perm: 'carolina test list' },
];
</script>

<template>
  <NavTabs :items="items" />
</template>
