<script setup>
// "Back" button whose arrow points the reading direction's way (→ in Arabic, ← in English).
import { useRouter } from "vue-router";

const props = defineProps({ to: { type: [String, Object], default: null } });
const router = useRouter();
const goBack = () => (props.to ? router.push(props.to) : router.back());
</script>

<template>
  <Button type="button" :label="$t('back')" severity="secondary" variant="outlined" class="back-button" @click="goBack">
    <template #icon>
      <i class="pi pi-arrow-right back-icon" aria-hidden="true" />
    </template>
  </Button>
</template>

<style scoped>
[dir="ltr"] .back-icon {
  transform: scaleX(-1);
}
</style>
