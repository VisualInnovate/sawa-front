<script setup>
// Staff passwords are reset with an e-mailed code on the forgot-password page; old reset links land there.
import { useRouter } from "vue-router";

useRouter().replace({ name: "ForgotPassword" });
</script>

<template>
  <div />
</template>
