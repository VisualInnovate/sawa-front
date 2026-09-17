<script setup>
import NavTabs from "./common/NavTabs.vue";

const items = [
  { to: { name: 'doctors-show' }, label: 'student_details', perm: 'doctor list' },
  { to: { name: 'doctors-programe' }, label: 'evaluation_order', perm: 'doctor list' },
  { to: { name: 'doctors-evaluation' }, label: 'Consultations_evaluations', perm: 'doctor list' },
];
</script>

<template>
  <NavTabs :items="items" />
</template>
