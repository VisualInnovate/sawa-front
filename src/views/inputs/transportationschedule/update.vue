<script setup>
import TripForm from "@/components/transport/TripForm.vue";
</script>

<template>
  <TripForm :id="$route.params.id" />
</template>
