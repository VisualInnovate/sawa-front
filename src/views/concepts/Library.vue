<script setup>
// «مكتبة المفاهيم من Enable 360»: the specialist's pictures, sounds and videos for a session.
import ConceptLibrary from "@/components/concepts/ConceptLibrary.vue";
</script>

<template>
  <div class="p-4">
    <Toast />
    <div class="mb-4">
      <p class="text-xl text-bp-135c65 font-bold m-0">{{ $t("cl.title") }}</p>
      <small class="text-color-secondary">{{ $t("cl.subtitle") }}</small>
    </div>
    <ConceptLibrary />
  </div>
</template>
