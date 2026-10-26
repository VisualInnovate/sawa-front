<script setup>
// "Nothing here yet", with what the parent can do about it.
defineProps({
  icon: { type: String, default: "pi pi-inbox" },
  title: { type: String, default: "" },
  text: { type: String, default: "" },
});
</script>

<template>
  <div class="pp-empty pp-in">
    <i :class="icon" aria-hidden="true" />
    <strong v-if="title">{{ title }}</strong>
    <p v-if="text" class="m-0 leading-7">{{ text }}</p>
    <div v-if="$slots.default" class="mt-2"><slot /></div>
  </div>
</template>
