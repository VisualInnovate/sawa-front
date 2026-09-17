<script setup>
// Dashboard (staff) password reset: the API e-mails a 4-digit code, then the code sets a new password.
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "axios";
import sawaLogo from "../assets/img/sawa_logo.svg";

const { t } = useI18n();
const router = useRouter();
const step = ref(1);
const form = ref({ email: "", otp: "", password: "", password_confirmation: "" });
const errors = ref({});
const message = ref("");
const info = ref("");
const loading = ref(false);
const done = ref(false);

const mismatch = computed(
  () => form.value.password_confirmation !== "" && form.value.password !== form.value.password_confirmation
);
const firstError = (key) => errors.value[key]?.[0];

const failed = (err) => {
  const status = err.response?.status;
  if (status === 422) errors.value = err.response.data.errors ?? {};
  else if (status === 404) message.value = t("pwreset.invalid_code");
  else if (status === 403) message.value = t("pwreset.code_expired");
  else message.value = t("request_failed_retry");
};

async function sendCode(resend = false) {
  if (loading.value) return;
  errors.value = {};
  message.value = "";
  loading.value = true;
  try {
    await axios.post("api/forgot/password", { email: form.value.email.trim() }, { skipAuth: true });
    step.value = 2;
    info.value = resend ? t("pwreset.code_resent") : "";
  } catch (err) {
    failed(err);
  } finally {
    loading.value = false;
  }
}

async function resetPassword() {
  if (loading.value || mismatch.value) return;
  errors.value = {};
  message.value = "";
  loading.value = true;
  try {
    await axios.post("api/rest/password", { ...form.value, email: form.value.email.trim() }, { skipAuth: true });
    done.value = true;
    setTimeout(() => router.push({ name: "Login" }), 2500);
  } catch (err) {
    failed(err);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="reset-page">
    <div class="reset-card">
      <img class="reset-logo" :src="sawaLogo" alt="Sawa" />
      <h1 class="reset-title">{{ $t("pwreset.title") }}</h1>
      <p class="reset-subtitle">
        {{ step === 1 ? $t("pwreset.staff_step1_hint") : $t("pwreset.step2_hint_sent", { email: form.email }) }}
      </p>

      <div v-if="done" class="reset-done" role="status">
        <i class="pi pi-check-circle" aria-hidden="true" />
        <strong>{{ $t("pwreset.done_title") }}</strong>
        <span>{{ $t("pwreset.done_detail") }}</span>
      </div>

      <form v-else-if="step === 1" class="reset-form" novalidate data-no-request-spinner @submit.prevent="sendCode()">
        <div class="field">
          <label for="staff-reset-email">{{ $t("email") }}</label>
          <IconField>
            <InputIcon class="pi pi-envelope" />
            <InputText id="staff-reset-email" v-model="form.email" type="email" autocomplete="email" fluid
              :invalid="Boolean(firstError('email'))" placeholder="name@example.com" />
          </IconField>
          <small v-if="firstError('email')" class="field-error">{{ firstError("email") }}</small>
        </div>
        <Message v-if="message" severity="error" :closable="false">{{ message }}</Message>
        <Button type="submit" :label="$t('pwreset.send_code')" icon="pi pi-send" :loading="loading" :disabled="!form.email.trim()" fluid />
      </form>

      <form v-else class="reset-form" novalidate data-no-request-spinner @submit.prevent="resetPassword">
        <Message v-if="info" severity="info" :closable="false">{{ info }}</Message>
        <div class="field">
          <label for="staff-reset-code">{{ $t("pwreset.code_label") }}</label>
          <InputOtp id="staff-reset-code" v-model="form.otp" :length="4" integerOnly dir="ltr" class="otp" :invalid="Boolean(firstError('otp'))" />
          <small v-if="firstError('otp')" class="field-error">{{ firstError("otp") }}</small>
          <small v-else class="help">{{ $t("pwreset.staff_code_help") }}</small>
        </div>
        <div class="field">
          <label for="staff-reset-password">{{ $t("new_password") }}</label>
          <Password v-model="form.password" input-id="staff-reset-password" toggle-mask :feedback="false"
            autocomplete="new-password" fluid :invalid="Boolean(firstError('password'))" />
          <small v-if="firstError('password')" class="field-error">{{ firstError("password") }}</small>
        </div>
        <div class="field">
          <label for="staff-reset-password-confirm">{{ $t("confirm_password") }}</label>
          <Password v-model="form.password_confirmation" input-id="staff-reset-password-confirm" toggle-mask
            :feedback="false" autocomplete="new-password" fluid :invalid="mismatch" />
          <small v-if="mismatch" class="field-error">{{ $t("pwreset.mismatch") }}</small>
        </div>
        <Message v-if="message" severity="error" :closable="false">{{ message }}</Message>
        <Button type="submit" :label="$t('pwreset.save_password')" icon="pi pi-check" :loading="loading"
          :disabled="form.otp.length !== 4 || !form.password || mismatch" fluid />
        <div class="step-links">
          <Button type="button" variant="link" :label="$t('pwreset.change_email')" @click="step = 1" />
          <Button type="button" variant="link" :label="$t('pwreset.resend')" :disabled="loading" @click="sendCode(true)" />
        </div>
      </form>

      <router-link :to="{ name: 'Login' }" class="back-link">
        <i class="pi pi-arrow-right rtl-flip" aria-hidden="true" />
        {{ $t("pwreset.back_to_login") }}
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.reset-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: linear-gradient(160deg, #eef8f9 0%, #f8fafc 60%, #f6f6ee 100%);
}
.reset-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border: 1px solid var(--sawa-border);
  border-top: 4px solid var(--sawa-primary);
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(19, 92, 101, 0.1);
  padding: 2rem 1.75rem;
  text-align: center;
}
.reset-logo {
  display: block;
  width: 150px;
  margin: 0 auto 1rem;
}
.reset-title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--sawa-primary);
}
.reset-subtitle {
  margin: 0.4rem 0 1.25rem;
  color: var(--sawa-muted);
  line-height: 1.8;
}
.reset-form {
  display: grid;
  gap: 1rem;
  text-align: start;
}
.otp {
  justify-content: center;
}
.help {
  color: var(--sawa-muted);
}
.step-links {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.reset-done {
  display: grid;
  justify-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0 1rem;
  color: #475569;
}
.reset-done .pi {
  font-size: 2.5rem;
  color: #16a34a;
}
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 1.25rem;
  color: var(--sawa-primary);
  font-weight: 600;
  text-decoration: none;
}
.back-link:hover {
  text-decoration: underline;
}
[dir="ltr"] .rtl-flip {
  transform: scaleX(-1);
}
</style>
