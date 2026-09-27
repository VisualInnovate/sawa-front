<script setup>
import NavTabs from "./common/NavTabs.vue";

const items = [
  { to: { name: 'children-detailes' }, label: 'student_details' },
  { to: { name: 'children-consultations' }, label: 'child_consultations_tab', perm: 'bookings list' },
  { to: { name: 'children-evaluate' }, label: 'child_evaluations_tab' },
  { to: { name: 'children-recommendations' }, label: 'child_recommendations', perm: ['child recommendations list', 'child recommendations create'] },
  { to: { name: 'children-programe' }, label: 'evaluations_details' },
  { to: { name: 'children-request' }, label: 'child_requests' },
];
</script>

<template>
  <NavTabs :items="items" />
</template>
