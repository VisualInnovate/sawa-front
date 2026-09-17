<script setup>
import NavTabs from "./common/NavTabs.vue";

const items = [
  { to: { name: 'SideProfiles' }, label: 'side_profile_page_title', perm: 'side profiles list' },
  { to: { name: 'Headers' }, label: 'headers', perm: 'evaluation headers list' },
];
</script>

<template>
  <NavTabs :items="items" />
</template>
