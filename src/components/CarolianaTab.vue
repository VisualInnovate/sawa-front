<script setup>
import NavTabs from "./common/NavTabs.vue";

const items = [
  { to: { name: 'carolina-domains' }, label: 'carolina_ui.domains', perm: 'carolina domain list' },
  { to: { name: 'carolina-general-goals' }, label: 'carolina_ui.general_goals', perm: 'carolina general goal list' },
  { to: { name: 'agerange' }, label: 'carolina_ui.age_ranges', perm: 'carolina age range list' },
  { to: { name: 'carolina-symbols' }, label: 'carolina_ui.symbols', perm: 'carolina symbol list' },
  { to: { name: 'carolina-skills' }, label: 'carolina_ui.skills', perm: 'carolina skill list' },
];
</script>

<template>
  <NavTabs :items="items" />
</template>
