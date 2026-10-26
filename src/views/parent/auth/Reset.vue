<script setup>
// Step 2 of resetting the password: the code from the e-mail and the new password.
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import axios from "axios";
import AuthLayout from "./AuthLayout.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const form = ref({
  email: typeof route.query.email === "string" ? route.query.email : "",
  code: "",
  password: "",
  password_confirmation: "",
});
const errors = ref({});
const message = ref("");
const loading = ref(false);
const resending = ref(false);
const done = ref(false);

const emailKnown = computed(() => Boolean(route.query.email));
const mismatch = computed(() => form.value.password_confirmation !== "" && form.value.password !== form.value.password_confirmation);
const firstError = (key) => errors.value[key]?.[0];

async function resetPassword() {
  if (loading.value || mismatch.value) return;
  errors.value = {};
  message.value = "";
  loading.value = true;
  try {
    await axios.post("api/reast-password", { ...form.value, email: form.value.email.trim() }, { skipAuth: true });
    done.value = true;
    setTimeout(() => router.push({ name: "parentLogin" }), 2500);
  } catch (err) {
    const status = err.response?.status;
    if (status === 422) errors.value = err.response.data.errors ?? {};
    else if (status === 400) message.value = t("pwreset.invalid_code");
    else message.value = t("request_failed_retry");
  } finally {
    loading.value = false;
  }
}

async function resendCode() {
  if (resending.value || !form.value.email.trim()) return;
  resending.value = true;
  message.value = "";
  try {
    await axios.post("api/forgot-password", { email: form.value.email.trim() }, { skipAuth: true });
    toast.add({ severity: "info", summary: t("pwreset.code_resent"), life: 4000 });
  } catch (err) {
    const status = err.response?.status;
    message.value = status === 404 ? t("pwreset.email_not_found") : status === 503 ? t("pwreset.send_failed") : t("request_failed_retry");
  } finally {
    resending.value = false;
  }
}
</script>

<template>
  <AuthLayout :title="$t('pwreset.title')" :subtitle="emailKnown ? $t('pwreset.step2_hint_sent', { email: form.email }) : $t('pwreset.step2_hint')">
    <Toast />
    <ol class="pp-steps" :aria-label="$t('pwreset.steps_label')">
      <li class="done"><span>✓</span>{{ $t("pwreset.step_email") }}</li>
      <li class="line" aria-hidden="true" />
      <li class="current"><span>2</span>{{ $t("pwreset.step_new_password") }}</li>
    </ol>

    <div v-if="done" class="pp-done" role="status">
      <i class="pi pi-check-circle" aria-hidden="true" />
      <strong>{{ $t("pwreset.done_title") }}</strong>
      <span>{{ $t("pwreset.done_detail") }}</span>
      <Button as="router-link" :to="{ name: 'parentLogin' }" :label="$t('sign_in')" icon="pi pi-sign-in" />
    </div>

    <form v-else class="pp-stack" novalidate data-no-request-spinner @submit.prevent="resetPassword">
      <div v-if="!emailKnown" class="pp-field is-required">
        <label for="reset-email">{{ $t("pwreset.email_label") }}</label>
        <InputText id="reset-email" v-model="form.email" type="email" autocomplete="email" required fluid :invalid="Boolean(firstError('email'))" />
        <small v-if="firstError('email')" class="error">{{ firstError("email") }}</small>
      </div>

      <div class="pp-field is-required">
        <label for="reset-code">{{ $t("pwreset.code_label") }}</label>
        <InputOtp id="reset-code" v-model="form.code" :length="4" integerOnly class="justify-center" dir="ltr" :invalid="Boolean(firstError('code'))" />
        <small v-if="firstError('code')" class="error">{{ firstError("code") }}</small>
        <small v-else class="help">{{ $t("pwreset.code_help") }}</small>
      </div>

      <div class="pp-field is-required">
        <label for="reset-password">{{ $t("new_password") }}</label>
        <Password v-model="form.password" input-id="reset-password" toggle-mask :feedback="false" autocomplete="new-password" fluid :invalid="Boolean(firstError('password'))" />
        <small v-if="firstError('password')" class="error">{{ firstError("password") }}</small>
        <small v-else class="help">{{ $t("pwreset.password_help") }}</small>
      </div>

      <div class="pp-field is-required">
        <label for="reset-password-confirm">{{ $t("confirm_password") }}</label>
        <Password v-model="form.password_confirmation" input-id="reset-password-confirm" toggle-mask :feedback="false" autocomplete="new-password" fluid :invalid="mismatch" />
        <small v-if="mismatch" class="error">{{ $t("pwreset.mismatch") }}</small>
      </div>

      <Message v-if="message" severity="error" :closable="false">{{ message }}</Message>

      <Button type="submit" :label="$t('pwreset.save_password')" icon="pi pi-check" :loading="loading" :disabled="form.code.length !== 4 || !form.password || mismatch" fluid size="large" />

      <p class="text-center pp-muted m-0 flex flex-wrap justify-center items-center gap-1">
        {{ $t("pwreset.no_code") }}
        <Button type="button" variant="link" :label="$t('pwreset.resend')" :loading="resending" :disabled="!form.email.trim()" class="p-1 font-bold" @click="resendCode" />
      </p>
      <p class="text-center m-0"><router-link :to="{ name: 'parentLogin' }" class="pp-link"><i class="pi pi-arrow-right rtl-arrow" /> {{ $t("pwreset.back_to_login") }}</router-link></p>
    </form>
  </AuthLayout>
</template>

<style scoped>
.pp-done {
  display: grid;
  justify-items: center;
  gap: 0.5rem;
  padding: 1rem 0;
  color: #475569;
}
.pp-done .pi {
  font-size: 2.5rem;
  color: #0f8a5f;
}
.pp-done strong {
  font-size: 1.15rem;
  color: #166534;
}
</style>
