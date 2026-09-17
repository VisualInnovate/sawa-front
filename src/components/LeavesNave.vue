<script setup>
import NavTabs from "./common/NavTabs.vue";

const items = [
  { to: { name: 'leaves' }, label: 'leaves', perm: 'leaves list' },
  { to: { name: 'leave-setup' }, label: 'leave_setup', perm: 'leave setup list' },
  { to: { name: 'leave-balance' }, label: 'leave_balance', perm: 'leave balance list' },
];
</script>

<template>
  <NavTabs :items="items" />
</template>
