<script setup>
import NavTabs from "./common/NavTabs.vue";

const items = [
  { to: { name: 'ablls' }, label: 'ablls', perm: 'able category list' },
  { to: { name: 'missions' }, label: 'missions', perm: 'able mission list' },
];
</script>

<template>
  <NavTabs :items="items" />
</template>
