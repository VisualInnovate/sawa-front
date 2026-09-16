<template>
  <RoleForm v-can="'roles edit'" :role-id="$route.params.id" />
</template>

<script setup>
import RoleForm from "../../components/permissions/RoleForm.vue";
</script>
