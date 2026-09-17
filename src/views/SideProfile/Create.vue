<script>
import axios from "axios";

export default {
  data: () => ({
    NameRules: [
      value => {
        if (value?.length >= 3) return true
        return 'Name must be at least 3 characters.'
      },
    ],
    sideProfile: {
      title: "",
    },
    loading: false,
    alert_text: null,
    alert_severity: "success"
  }),
  methods: {
    async submit() {
      if (!this.validateForm()) return;
      
      this.loading = true;
      try {
        const response = await axios.post(`/api/side-profiles/create`, this.sideProfile);
        if (response.data.status == 200) {
          this.showSuccess(this.$t("successful"));
          this.sideProfile.title = "";
        }
      } catch (error) {
        this.showError(error.response?.data?.message || this.$t("request_failed_retry"));
      } finally {
        this.loading = false;
      }
    },
    validateForm() {
      if (this.sideProfile.title?.length < 3) {
        this.showError(this.$t("min_3_chars"));
        return false;
      }
      return true;
    },
    showSuccess(message) {
      this.alert_text = message;
      this.alert_severity = "success";
      this.$toast.add({
        severity: 'success',
        summary: this.$t('success_message'),
        detail: message,
        life: 3000
      });
    },
    showError(message) {
      this.alert_text = message;
      this.alert_severity = "error";
      this.$toast.add({
        severity: 'error',
        summary: this.$t('error'),
        detail: message,
        life: 3000
      });
    },
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<template>
  <div class="page">
    <Toast />
    <div class="page-header">
      <h1 class="page-title">{{ $t("create_side_profile") }}</h1>
      <BackButton />
    </div>

    <form class="surface-card form-stack" novalidate data-no-request-spinner @submit.prevent="submit">
      <Message v-if="alert_text" :severity="alert_severity" :closable="true">{{ alert_text }}</Message>
      <div class="field">
        <label for="side-profile-title">{{ $t("side_profile_title") }}</label>
        <InputText id="side-profile-title" v-model="sideProfile.title" fluid
          :invalid="sideProfile.title?.length > 0 && sideProfile.title.length < 3" />
        <small v-if="sideProfile.title?.length > 0 && sideProfile.title.length < 3" class="field-error">
          {{ $t("min_3_chars") }}
        </small>
      </div>
      <div>
        <Button type="submit" :label="$t('submit')" icon="pi pi-check" :loading="loading" />
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-stack {
  display: grid;
  gap: 1rem;
  max-width: 800px;
}
</style>
