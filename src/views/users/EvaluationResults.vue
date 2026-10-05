<template>
  <Evaluation />
</template>

<script setup>
import Evaluation from "../../components/profile/Evaluation.vue";
import { resetUserProfile } from "../../components/profile/userProfile";

resetUserProfile();
</script>
