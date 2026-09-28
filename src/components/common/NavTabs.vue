<script setup>
// Row of links between the pages of one section. items: [{ to, label (i18n key) | text, perm }]; slot `end` sits opposite them.
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
    <!-- Optional content on the opposite side of the tabs (e.g. whose pages these are). -->
    <div v-if="$slots.end" class="section-tabs-end"><slot name="end" /></div>
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
.section-tabs-end {
  display: flex;
  align-items: center;
  margin-inline-start: auto;
}
</style>
