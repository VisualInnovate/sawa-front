<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "axios";
import PasswordResetLayout from "../components/PasswordResetLayout.vue";

const { t } = useI18n();
const router = useRouter();
const email = ref("");
const error = ref("");
const loading = ref(false);

async function sendCode() {
  if (loading.value) return;
  error.value = "";
  loading.value = true;
  try {
    await axios.post("api/forgot-password", { email: email.value.trim() }, { skipAuth: true });
    router.push({ name: "restepassword", query: { email: email.value.trim() } });
  } catch (err) {
    const status = err.response?.status;
    if (status === 422) error.value = err.response.data.errors?.email?.[0] ?? t("pwreset.invalid_email");
    else if (status === 404) error.value = t("pwreset.email_not_found");
    else if (status === 503) error.value = t("pwreset.send_failed");
    else error.value = t("request_failed_retry");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <PasswordResetLayout :step="1" :title="$t('pwreset.title')" :subtitle="$t('pwreset.step1_hint')">
    <form class="reset-form" novalidate data-no-request-spinner @submit.prevent="sendCode">
      <div class="field">
        <label for="reset-email">{{ $t("pwreset.email_label") }}</label>
        <IconField>
          <InputIcon class="pi pi-envelope" />
          <InputText
            id="reset-email"
            v-model="email"
            type="email"
            inputmode="email"
            autocomplete="email"
            required
            fluid
            placeholder="name@example.com"
            :invalid="Boolean(error)"
            aria-describedby="reset-email-help"
          />
        </IconField>
        <small id="reset-email-help" class="help">{{ $t("pwreset.email_help") }}</small>
      </div>

      <Message v-if="error" severity="error" :closable="false">{{ error }}</Message>

      <Button type="submit" :label="$t('pwreset.send_code')" icon="pi pi-send" :loading="loading" :disabled="!email.trim()" fluid />

      <p class="have-code">
        {{ $t("pwreset.have_code") }}
        <router-link :to="{ name: 'restepassword', query: email.trim() ? { email: email.trim() } : {} }">
          {{ $t("pwreset.enter_code") }}
        </router-link>
      </p>
    </form>
  </PasswordResetLayout>
</template>

<style scoped>
.reset-form {
  display: grid;
  gap: 1rem;
  text-align: start;
}
.help {
  color: #64748b;
  line-height: 1.7;
}
.have-code {
  margin: 0;
  text-align: center;
  color: #475569;
  font-size: 0.925rem;
}
.have-code a {
  color: #135c65;
  font-weight: 700;
}
</style>
