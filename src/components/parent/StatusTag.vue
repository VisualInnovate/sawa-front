<script setup>
// A state in words on its colour: { severity, label } from utils/parentPortal, or the two given apart.
defineProps({
  meta: { type: Object, default: null },
  severity: { type: String, default: "neutral" },
  label: { type: String, default: "" },
  icon: { type: String, default: "" },
});
</script>

<template>
  <span class="pp-tag" :class="`pp-tag--${meta?.severity ?? severity}`">
    <i v-if="icon" :class="icon" aria-hidden="true" />
    {{ meta?.label ?? label }}
  </span>
</template>
