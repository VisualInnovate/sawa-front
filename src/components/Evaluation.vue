<script setup>
import NavTabs from "./common/NavTabs.vue";

const items = [
  { to: { name: 'levels' }, label: 'levels', perm: 'milestone level list' },
  { to: { name: 'milestone-domains' }, label: 'milestone_domain', perm: 'milestone domain list' },
  { to: { name: 'milestone-general-goals' }, label: 'milestone_general_goal', perm: 'milestone general goal list' },
  { to: { name: 'milestone-sub-goals' }, label: 'milestone_sub_goals', perm: 'milestone sub goal list' },
];
</script>

<template>
  <NavTabs :items="items" />
</template>
