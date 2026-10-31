<script setup>
import VehicleForm from "@/components/transport/VehicleForm.vue";
</script>

<template>
  <VehicleForm :id="$route.params.id" />
</template>
