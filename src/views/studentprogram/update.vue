<script setup>
import { useRoute } from "vue-router";
import StudentProgramForm from "@/components/studentPrograms/StudentProgramForm.vue";

const route = useRoute();
</script>

<template>
  <StudentProgramForm :program-id="route.params.id" />
</template>
