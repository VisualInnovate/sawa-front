<script setup>
// A parent's account: the name, the phone (used to sign in), an optional e-mail for recovery, and the password.
// Three short rows, so the page fits a laptop screen without scrolling.
import { computed, ref } from "vue";
import { useParentStore } from "@/stores/ParentStore";
import AuthLayout from "./AuthLayout.vue";

const parentStore = useParentStore();
const form = ref({ fname: "", lname: "", phone: "", email: "", password: "", password_confirmation: "" });
const submitted = ref(false);

const mismatch = computed(() => form.value.password_confirmation !== "" && form.value.password !== form.value.password_confirmation);
const ready = computed(() => form.value.fname.trim() && form.value.lname.trim() && form.value.phone.trim() && form.value.password.length >= 6 && !mismatch.value);
const firstError = (key) => {
  const value = parentStore.errors?.[key];
  return Array.isArray(value) ? value[0] : value;
};
const submit = () => {
  submitted.value = true;
  if (!ready.value) return;
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
          <InputText id="reg-fname" v-model="form.fname" autocomplete="given-name" required fluid :invalid="Boolean(firstError('fname')) || (submitted && !form.fname.trim())" />
          <small v-if="firstError('fname')" class="error">{{ firstError("fname") }}</small>
        </div>
        <div class="pp-field is-required">
          <label for="reg-lname">{{ $t("family_name") }}</label>
          <InputText id="reg-lname" v-model="form.lname" autocomplete="family-name" required fluid :invalid="Boolean(firstError('lname')) || (submitted && !form.lname.trim())" />
          <small v-if="firstError('lname')" class="error">{{ firstError("lname") }}</small>
        </div>

        <div class="pp-field is-required">
          <label for="reg-phone">{{ $t("Mobile_number") }}</label>
          <IconField>
            <InputIcon class="pi pi-phone" />
            <InputText id="reg-phone" v-model="form.phone" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" required fluid placeholder="07xxxxxxxx"
              :title="$t('pp.phone_help')" :invalid="Boolean(firstError('phone')) || (submitted && !form.phone.trim())" />
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
            :placeholder="$t('pwreset.password_help')" :invalid="Boolean(firstError('password')) || (submitted && form.password.length < 6)" />
          <small v-if="firstError('password')" class="error">{{ firstError("password") }}</small>
        </div>
        <div class="pp-field is-required">
          <label for="reg-confirm">{{ $t("password_confirmation") }}</label>
          <Password v-model="form.password_confirmation" input-id="reg-confirm" toggle-mask :feedback="false" autocomplete="new-password" required fluid :invalid="mismatch" />
          <small v-if="mismatch" class="error">{{ $t("pwreset.mismatch") }}</small>
        </div>
      </div>

      <Message v-if="parentStore.showErrors && parentStore.errorMessage" severity="error" :closable="false">{{ parentStore.errorMessage }}</Message>

      <Button type="submit" :label="$t('create_button')" icon="pi pi-user-plus" :loading="parentStore.loading" fluid size="large" />

      <p class="text-center pp-muted m-0">
        {{ $t("pp.have_account") }}
        <router-link :to="{ name: 'parentLogin' }" class="pp-link">{{ $t("sign_in") }}</router-link>
      </p>
    </form>
  </AuthLayout>
</template>

<style scoped>
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
