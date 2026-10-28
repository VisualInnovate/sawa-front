<script setup>
// Step 1 of resetting the password: the e-mail gets a 4-digit code.
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "axios";
import AuthLayout from "./AuthLayout.vue";

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
  <AuthLayout :title="$t('pwreset.title')" :subtitle="$t('pwreset.step1_hint')">
    <ol class="pp-steps" :aria-label="$t('pwreset.steps_label')">
      <li class="current"><span>1</span>{{ $t("pwreset.step_email") }}</li>
      <li class="line" aria-hidden="true" />
      <li><span>2</span>{{ $t("pwreset.step_new_password") }}</li>
    </ol>
    <form class="pp-stack" novalidate data-no-request-spinner @submit.prevent="sendCode">
      <div class="pp-field is-required">
        <label for="reset-email">{{ $t("pwreset.email_label") }}</label>
        <IconField>
          <InputIcon class="pi pi-envelope" />
          <InputText id="reset-email" v-model="email" type="email" inputmode="email" autocomplete="email" required fluid placeholder="name@example.com"
            :invalid="Boolean(error)" aria-describedby="reset-email-help" />
        </IconField>
        <small id="reset-email-help" class="help">{{ $t("pwreset.email_help") }}</small>
      </div>
      <Message v-if="error" severity="error" :closable="false">{{ error }}</Message>
      <Button type="submit" :label="$t('pwreset.send_code')" icon="pi pi-send" :loading="loading" :disabled="!email.trim()" fluid size="large" />
      <p class="text-center pp-muted m-0">
        {{ $t("pwreset.have_code") }}
        <router-link :to="{ name: 'restepassword', query: email.trim() ? { email: email.trim() } : {} }" class="pp-link">{{ $t("pwreset.enter_code") }}</router-link>
      </p>
      <p class="text-center m-0"><router-link :to="{ name: 'parentLogin' }" class="pp-link"><i class="pi pi-arrow-right rtl-arrow" /> {{ $t("pwreset.back_to_login") }}</router-link></p>
    </form>
  </AuthLayout>
</template>

<style>
.pp-steps {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.25rem;
  padding: 0;
  list-style: none;
  font-size: 0.85rem;
  font-weight: 700;
  color: #94a3b8;
}
.pp-steps li:not(.line) {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
}
.pp-steps .line {
  flex: 1;
  height: 2px;
  background: #e5e2e1;
}
.pp-steps li > span {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 2px solid currentColor;
}
.pp-steps .current {
  color: rgb(var(--bp-1c6772));
}
.pp-steps .current > span {
  background: rgb(var(--bp-1c6772));
  border-color: rgb(var(--bp-1c6772));
  color: #fff;
}
.pp-steps .done {
  color: #0f8a5f;
}
[dir="ltr"] .pp-auth .rtl-arrow {
  transform: scaleX(-1);
}
</style>
