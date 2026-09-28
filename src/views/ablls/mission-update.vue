<script setup>
import { useRoute } from "vue-router";
import MissionForm from "@/components/ablls/MissionForm.vue";

const route = useRoute();
</script>

<template>
  <MissionForm :id="route.params.id" :key="route.params.id" />
</template>
