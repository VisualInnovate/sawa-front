<script setup>
// A parent's account: the name, the phone (used to sign in), an optional e-mail for recovery, and the password.
// Three short rows, so the page fits a laptop screen without scrolling.
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useParentStore } from "@/stores/ParentStore";
import AuthLayout from "./AuthLayout.vue";

const { t } = useI18n();
const parentStore = useParentStore();
const form = ref({ fname: "", lname: "", phone: "", email: "", password: "", password_confirmation: "" });
const submitted = ref(false);

const PASSWORD_MIN = 8; // as the server asks
const mismatch = computed(() => form.value.password_confirmation !== "" && form.value.password !== form.value.password_confirmation);
// What is wrong before sending, by field (shown once the form was submitted, and as it is fixed).
const clientErrors = computed(() => {
  const f = form.value;
  const e = {};
  if (!f.fname.trim()) e.fname = t("pp.reg_required", { field: t("first_name") });
  if (!f.lname.trim()) e.lname = t("pp.reg_required", { field: t("family_name") });
  if (!f.phone.trim()) e.phone = t("pp.reg_required", { field: t("Mobile_number") });
  else if (!/^\+?[\d\s-]{7,}$/.test(f.phone.trim())) e.phone = t("pp.reg_phone_invalid");
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = t("pp.reg_email_invalid");
  if (!f.password) e.password = t("pp.reg_required", { field: t("password") });
  else if (f.password.length < PASSWORD_MIN) e.password = t("pp.reg_password_short", { n: PASSWORD_MIN, count: f.password.length });
  if (!f.password_confirmation) e.password_confirmation = t("pp.reg_confirm_required");
  else if (mismatch.value) e.password_confirmation = t("pwreset.mismatch");
  return e;
});
// The form's own message first, then the server's for that field.
const firstError = (key) => {
  if (submitted.value && clientErrors.value[key]) return clientErrors.value[key];
  const value = parentStore.errors?.[key];
  return Array.isArray(value) ? value[0] : value;
};
const clientCount = computed(() => Object.keys(clientErrors.value).length);
const submit = () => {
  submitted.value = true;
  if (clientCount.value) {
    document.getElementById(`reg-${{ fname: "fname", lname: "lname", phone: "phone", email: "email", password: "password", password_confirmation: "confirm" }[Object.keys(clientErrors.value)[0]]}`)?.focus();
    return;
  }
  const payload = { ...form.value, fname: form.value.fname.trim(), lname: form.value.lname.trim(), phone: form.value.phone.trim(), email: form.value.email.trim() || null };
  if (!payload.email) delete payload.email;
  parentStore.register(payload);
};
</script>

<template>
  <AuthLayout :title="$t('Create_an_account')" :subtitle="$t('pp.register_hint')" wide>
    <form class="pp-stack" novalidate data-no-request-spinner @submit.prevent="submit">
      <div class="pp-form-grid">
        <div class="pp-field is-required">
          <label for="reg-fname">{{ $t("first_name") }}</label>
          <InputText id="reg-fname" v-model="form.fname" autocomplete="given-name" required fluid :invalid="Boolean(firstError('fname'))" />
          <small v-if="firstError('fname')" class="error">{{ firstError("fname") }}</small>
        </div>
        <div class="pp-field is-required">
          <label for="reg-lname">{{ $t("family_name") }}</label>
          <InputText id="reg-lname" v-model="form.lname" autocomplete="family-name" required fluid :invalid="Boolean(firstError('lname'))" />
          <small v-if="firstError('lname')" class="error">{{ firstError("lname") }}</small>
        </div>

        <div class="pp-field is-required">
          <label for="reg-phone">{{ $t("Mobile_number") }}</label>
          <IconField>
            <InputIcon class="pi pi-phone" />
            <InputText id="reg-phone" v-model="form.phone" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" required fluid placeholder="07xxxxxxxx"
              :title="$t('pp.phone_help')" :invalid="Boolean(firstError('phone'))" />
          </IconField>
          <small v-if="firstError('phone')" class="error">{{ firstError("phone") }}</small>
        </div>
        <div class="pp-field">
          <label for="reg-email">{{ $t("parent_optional_email") }}</label>
          <IconField>
            <InputIcon class="pi pi-envelope" />
            <InputText id="reg-email" v-model="form.email" type="email" inputmode="email" autocomplete="email" fluid placeholder="name@example.com"
              :title="$t('parent_email_recovery_hint')" :invalid="Boolean(firstError('email'))" />
          </IconField>
          <small v-if="firstError('email')" class="error">{{ firstError("email") }}</small>
        </div>

        <div class="pp-field is-required">
          <label for="reg-password">{{ $t("password") }}</label>
          <Password v-model="form.password" input-id="reg-password" toggle-mask :feedback="false" autocomplete="new-password" required fluid
            :placeholder="$t('pwreset.password_help')" :invalid="Boolean(firstError('password'))" />
          <small v-if="firstError('password')" class="error">{{ firstError("password") }}</small>
          <small v-else class="pp-muted">{{ $t("pwreset.password_help") }}</small>
        </div>
        <div class="pp-field is-required">
          <label for="reg-confirm">{{ $t("password_confirmation") }}</label>
          <Password v-model="form.password_confirmation" input-id="reg-confirm" toggle-mask :feedback="false" autocomplete="new-password" required fluid
            :invalid="Boolean(firstError('password_confirmation')) || mismatch" />
          <small v-if="firstError('password_confirmation') || mismatch" class="error">{{ firstError("password_confirmation") || $t("pwreset.mismatch") }}</small>
        </div>
      </div>

      <!-- Every problem said once more above the button, so it is not missed. -->
      <Message v-if="submitted && clientCount" severity="error" :closable="false">
        <b>{{ $t("pp.reg_fix_title") }}</b>
        <ul class="reg-errors">
          <li v-for="(text, key) in clientErrors" :key="key">{{ text }}</li>
        </ul>
      </Message>
      <Message v-else-if="parentStore.showErrors && parentStore.errorMessage" severity="error" :closable="false">{{ parentStore.errorMessage }}</Message>

      <Button type="submit" :label="$t('create_button')" icon="pi pi-user-plus" :loading="parentStore.loading" fluid size="large" />

      <p class="text-center pp-muted m-0">
        {{ $t("pp.have_account") }}
        <router-link :to="{ name: 'parentLogin' }" class="pp-link">{{ $t("sign_in") }}</router-link>
      </p>
    </form>
  </AuthLayout>
</template>

<style scoped>
.reg-errors {
  margin: 0.3rem 0 0;
  padding-inline-start: 1.2rem;
}
.pp-form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.7rem 0.9rem;
}
@media (min-width: 480px) {
  .pp-form-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
