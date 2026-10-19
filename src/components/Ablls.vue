<script setup>
import { useRoute } from "vue-router";
import NavTabs from "./common/NavTabs.vue";
import { assessmentOf, permOf } from "./ablls/assessment";

// The tabs of ABLLS Academy or Ablls OT, whichever page is open.
const assessment = assessmentOf(useRoute());
const items = [
  { to: { name: assessment.routes.categories }, label: assessment.title, perm: permOf(assessment, 'category', 'list') },
  { to: { name: assessment.routes.missions }, label: 'ablls_ui.missions_count', perm: permOf(assessment, 'mission', 'list') },
];
</script>

<template>
  <NavTabs :items="items" />
</template>
