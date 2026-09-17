<script setup>
import NavTabs from "./common/NavTabs.vue";

const items = [
  { to: { name: 'children-detailes' }, label: 'student_details' },
  { to: { name: 'children-evaluate' }, label: 'Consultations_evaluations' },
  { to: { name: 'children-programe' }, label: 'evaluations_details' },
  { to: { name: 'children-request' }, label: 'child_requests' },
];
</script>

<template>
  <NavTabs :items="items" />
</template>
