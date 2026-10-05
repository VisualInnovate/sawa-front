<template>
  <div class="profile-page">
    <Details />
  </div>
</template>

<script setup>
import Details from "../../components/profile/Details.vue";
import { resetUserProfile } from "../../components/profile/userProfile";

resetUserProfile();
</script>
