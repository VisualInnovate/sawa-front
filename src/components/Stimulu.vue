<script setup>
import NavTabs from "./common/NavTabs.vue";

const items = [
  { to: { name: 'reinforcers' }, label: 'reinforcers', perm: 'stimulus list' },
  { to: { name: 'pair' }, label: 'pair', perm: 'stimulus test create' },
  { to: { name: 'return' }, label: 'return', perm: 'stimulus test create' },
  { to: { name: 'without' }, label: 'without', perm: 'stimulus test create' },
];
</script>

<template>
  <NavTabs :items="items" />
</template>
