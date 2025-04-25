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
          this.showSuccess("Side profile added successfully");
          this.sideProfile.title = "";
        }
      } catch (error) {
        this.showError(error.response?.data?.message || "An error occurred");
      } finally {
        this.loading = false;
      }
    },
    validateForm() {
      if (this.sideProfile.title?.length < 3) {
        this.showError("Name must be at least 3 characters");
        return false;
      }
      return true;
    },
    showSuccess(message) {
      this.alert_text = message;
      this.alert_severity = "success";
      this.$toast.add({
        severity: 'success',
        summary: 'Success',
        detail: message,
        life: 3000
      });
    },
    showError(message) {
      this.alert_text = message;
      this.alert_severity = "error";
      this.$toast.add({
        severity: 'error',
        summary: 'Error',
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
  <div class="card">
    <Toast />
    
    <div class="flex justify-content-start mb-5">
      <Button 
        icon="pi pi-arrow-left" 
        :label="$t('back')" 
        class="p-button-outlined p-button-secondary"
        @click="goBack"
      />
    </div>

    <div class="surface-card p-4 shadow-2 border-round" style="max-width: 800px; margin: 0 auto">
      <div class="text-center mb-5">
        <div class="text-900 text-3xl font-medium mb-3">Create Side Profile</div>
        <span class="text-600 font-medium line-height-3">Enter the details below</span>
      </div>

      <Message 
        v-if="alert_text" 
        :severity="alert_severity" 
        :closable="true"
        class="mb-4"
      >
        {{ alert_text }}
      </Message>

      <form @submit.prevent="submit">
        <div class="field">
          <label for="title" class="block text-900 font-medium mb-2">
            {{ $t('side_profile_title') }}
          </label>
          <InputText
            id="title"
            v-model="sideProfile.title"
            class="w-full mb-3"
            :class="{ 'p-invalid': sideProfile.title?.length > 0 && sideProfile.title.length < 3 }"
            placeholder="Enter profile title"
          />
          <small 
            v-if="sideProfile.title?.length > 0 && sideProfile.title.length < 3" 
            class="p-error"
          >
            Name must be at least 3 characters
          </small>
        </div>

        <Button 
          type="submit" 
          label="Submit" 
          icon="pi pi-check" 
          class="w-full" 
          :loading="loading"
        />
      </form>
    </div>
  </div>
</template>

<style scoped>
.p-card {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.p-inputtext {
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--surface-border);
  transition: all 0.3s;
}

.p-inputtext:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(158, 173, 186, 0.5);
}

.p-button {
  padding: 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.3s;
}

.p-button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>