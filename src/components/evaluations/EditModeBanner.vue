<script setup>
// On an evaluation screen opened to edit its answers (?edit=): what is being done, and the management's rejection
// reason when there is one. Saving keeps it waiting for approval.
defineProps({
  status: { type: String, default: null },
  note: { type: String, default: null },
});
</script>

<template>
  <div class="em-banner" role="status">
    <i class="pi pi-pencil" aria-hidden="true" />
    <div>
      <b>{{ $t("mae_title") }}</b>
      <span>{{ $t("mae_screen_hint") }}</span>
      <span v-if="status === 'rejected'" class="em-note">{{ $t("ea_rejected_hint", { note: note || "—" }) }}</span>
    </div>
  </div>
</template>

<style scoped>
.em-banner { display: flex; align-items: flex-start; gap: .7rem; padding: .75rem 1rem; border: 1px solid #fde68a; border-radius: 12px; background: #fffbeb; color: #92400e; }
.em-banner > i { margin-top: .2rem; font-size: 1.15rem; }
.em-banner div { display: grid; gap: .15rem; line-height: 1.6; }
.em-banner span { font-size: .87rem; }
.em-note { color: #991b1b; font-weight: 600; }
</style>
