<script setup>
// The head of a portal page: a small kicker, the title, a line under it and the actions on the side.
defineProps({
  title: { type: String, required: true },
  lead: { type: String, default: "" },
  kicker: { type: String, default: "" },
  icon: { type: String, default: "" },
  back: { type: [Object, String], default: null },
});
</script>

<template>
  <header class="pp-head pp-in">
    <div class="min-w-0">
      <router-link v-if="back" :to="back" class="pp-link pp-back pp-no-print">
        <i class="pi pi-arrow-right rtl-only" aria-hidden="true" /><i class="pi pi-arrow-left ltr-only" aria-hidden="true" />
        <span>{{ $t("pp.back") }}</span>
      </router-link>
      <p v-if="kicker" class="pp-kicker"><i v-if="icon" :class="icon" aria-hidden="true" />{{ kicker }}</p>
      <h1 class="pp-h1">{{ title }}</h1>
      <p v-if="lead" class="pp-lead mt-1">{{ lead }}</p>
      <slot />
    </div>
    <div v-if="$slots.actions" class="pp-head__actions pp-no-print">
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
.pp-back {
  margin-bottom: 0.4rem;
  font-size: 0.85rem;
}
.ltr-only {
  display: none;
}
[dir="ltr"] .rtl-only {
  display: none;
}
[dir="ltr"] .ltr-only {
  display: inline-block;
}
</style>
