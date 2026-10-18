<script setup>
import { useRoute } from "vue-router";
import RoomForm from "@/components/rooms/RoomForm.vue";

const route = useRoute();
</script>

<template>
  <RoomForm :room-id="route.params.id" />
</template>
