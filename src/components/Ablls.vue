<script setup>
import NavTabs from "./common/NavTabs.vue";

const items = [
  { to: { name: 'ablls' }, label: 'ablls', perm: 'able category list' },
  { to: { name: 'missions' }, label: 'ablls_ui.missions_count', perm: 'able mission list' },
];
</script>

<template>
  <NavTabs :items="items" />
</template>
