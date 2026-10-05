<template>
  <Requests />
</template>

<script setup>
import Requests from "../../components/profile/Requests.vue";
import { resetUserProfile } from "../../components/profile/userProfile";

resetUserProfile();
</script>
