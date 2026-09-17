<template>
  <Dialog v-model:visible="dialog" modal :header="title || $t('confirmation')" :style="{ width: '420px', maxWidth: '95vw' }">
    <p class="m-0">{{ message || $t('remove_item') }}</p>
    <template #footer>
      <Button :label="$t('cancel')" severity="secondary" variant="text" @click="dialog = false" />
      <Button :label="$t('confirm')" severity="danger" @click="confirm" />
    </template>
  </Dialog>
</template>

<script>
export default {
  emits: ["confirmed"],
  data() {
    return {
      dialog: false,
      title: "",
      message: "",
    };
  },
  methods: {
    openDialog({ title = "", message = "" } = {}) {
      this.title = title;
      this.message = message;
      this.dialog = true;
    },
    confirm() {
      this.$emit("confirmed");
      this.dialog = false;
    },
  },
};
</script>
