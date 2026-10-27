<script setup>
// «تعديل الإجابات» on a result page that is not approved yet: opens the evaluation screen itself (`to`, with
// ?edit=), every question with the answer given, for the therapist or whoever approves it.
defineProps({ to: { type: Object, required: true } });
</script>

<template>
  <RouterLink :to="to" custom v-slot="{ navigate, href }">
    <Button as="a" :href="href" icon="pi pi-pencil" :label="$t('mae_edit')" severity="warn" variant="outlined" class="print:hidden" @click="navigate" />
  </RouterLink>
</template>
