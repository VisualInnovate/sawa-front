<script setup>
import { computed, ref } from "vue";
import sawaLogo from "../assets/img/sawa_logo.svg";
import { useAuthStore } from "../stores/Auth";
import LocaleSelect from "./LocaleSelect.vue";

const authStore = useAuthStore();
const form = ref({ email: "", password: "" });
const submitted = ref(false);

const emailError = computed(() => {
  if (!submitted.value) return "";
  if (!form.value.email) return "email_required";
  return /.+@.+\..+/.test(form.value.email) ? "" : "email_invalid";
});
const passwordError = computed(() => (submitted.value && !form.value.password ? "password_required" : ""));

// The API answers 422 with either a field map, a list or a single message.
const serverErrors = computed(() => {
  const errors = authStore.errors;
  if (!errors || errors.length === 0) return [];
  if (typeof errors === "string") return [errors];
  return Object.values(errors).flat();
});

const submit = () => {
  submitted.value = true;
  if (emailError.value || passwordError.value) return;
  authStore.handleLogin(form.value);
};
</script>

<template>
  <div class="login-page">
    <div class="login-locale" data-no-request-spinner>
      <LocaleSelect />
    </div>
    <div class="login-card">
      <img class="login-logo" :src="sawaLogo" alt="Sawa" />
      <h1 class="login-title">{{ $t("admin_login_title") }}</h1>
      <p class="login-subtitle">{{ $t("admin_login_hint") }}</p>

      <form class="login-form" novalidate data-no-request-spinner @submit.prevent="submit">
        <Message v-for="(message, index) in serverErrors" :key="index" severity="error" :closable="false">
          {{ message }}
        </Message>

        <div class="field">
          <label for="login-email">{{ $t("email") }}</label>
          <IconField>
            <InputIcon class="pi pi-envelope" />
            <InputText
              id="login-email"
              v-model.trim="form.email"
              type="email"
              autocomplete="username"
              fluid
              :invalid="Boolean(emailError)"
              :placeholder="$t('email')"
            />
          </IconField>
          <small v-if="emailError" class="field-error">{{ $t(emailError) }}</small>
        </div>

        <div class="field">
          <div class="label-row">
            <label for="login-password">{{ $t("password") }}</label>
            <router-link :to="{ name: 'ForgotPassword' }" class="forgot-link">
              {{ $t("forgot_password") }}
            </router-link>
          </div>
          <Password
            v-model="form.password"
            input-id="login-password"
            toggle-mask
            :feedback="false"
            autocomplete="current-password"
            fluid
            :invalid="Boolean(passwordError)"
            :placeholder="$t('enter_password')"
          />
          <small v-if="passwordError" class="field-error">{{ $t(passwordError) }}</small>
        </div>

        <Button
          type="submit"
          :label="$t('sign_in')"
          icon="pi pi-sign-in"
          :loading="authStore.loading"
          fluid
          size="large" />
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: linear-gradient(160deg, #eef8f9 0%, #f8fafc 60%, #f6f6ee 100%);
  position: relative;
}
.login-locale {
  position: absolute;
  inset-block-start: 1rem;
  inset-inline-end: 1rem;
}
.login-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border: 1px solid var(--sawa-border);
  border-top: 4px solid var(--sawa-primary);
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(19, 92, 101, 0.1);
  padding: 2rem 1.75rem;
}
.login-logo {
  display: block;
  width: 170px;
  margin: 0 auto 1rem;
}
.login-title {
  margin: 0;
  text-align: center;
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--sawa-primary);
}
.login-subtitle {
  margin: 0.35rem 0 1.5rem;
  text-align: center;
  color: var(--sawa-muted);
}
.login-form {
  display: grid;
  gap: 1rem;
}
.label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.label-row label {
  font-weight: 600;
  font-size: 0.925rem;
  color: #334155;
}
.forgot-link {
  font-size: 0.85rem;
  color: var(--sawa-primary);
  text-decoration: none;
}
.forgot-link:hover {
  text-decoration: underline;
}
</style>
