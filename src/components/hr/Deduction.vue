<script setup>
import NavTabs from "../common/NavTabs.vue";

const items = [
  { to: { name: 'deduction' }, label: 'deductions', perm: 'deduction list' },
  { to: { name: 'deduction-types' }, label: 'deduction_types', perm: 'deduction type list' },
  { to: { name: 'deduction-rules' }, label: 'pen.title', perm: 'deduction rules list' },
];
</script>

<template>
  <NavTabs :items="items" />
</template>
