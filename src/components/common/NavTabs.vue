<script setup>
// Row of links between the pages of one section. items: [{ to, label (i18n key) | text, perm }]
import { computed } from "vue";
import { can } from "@/utils/permissions";

const props = defineProps({ items: { type: Array, required: true } });
const visible = computed(() => props.items.filter((item) => !item.perm || can(item.perm)));
</script>

<template>
  <nav v-if="visible.length" class="nav-tabs section-tabs" :aria-label="$t('section_pages')">
    <router-link v-for="item in visible" :key="item.label ?? item.text" :to="item.to" class="nav-tab">
      {{ item.text ?? $t(item.label) }}
    </router-link>
  </nav>
</template>

<style scoped>
.section-tabs {
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: #fff;
  border: 1px solid var(--sawa-border);
  border-radius: var(--sawa-radius);
}
</style>
