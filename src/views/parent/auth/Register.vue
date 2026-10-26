<script setup>
// A parent's account: the name, the phone (used to sign in), an optional e-mail for recovery, and the password.
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
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
      </div>

      <div class="pp-field is-required">
        <label for="reg-phone">{{ $t("Mobile_number") }}</label>
        <IconField>
          <InputIcon class="pi pi-phone" />
          <InputText id="reg-phone" v-model="form.phone" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" required fluid placeholder="07xxxxxxxx"
            :invalid="Boolean(firstError('phone')) || (submitted && !form.phone.trim())" />
        </IconField>
        <small v-if="firstError('phone')" class="error">{{ firstError("phone") }}</small>
        <small v-else class="help">{{ $t("pp.phone_help") }}</small>
      </div>

      <div class="pp-field">
        <label for="reg-email">{{ $t("parent_optional_email") }}</label>
        <IconField>
          <InputIcon class="pi pi-envelope" />
          <InputText id="reg-email" v-model="form.email" type="email" inputmode="email" autocomplete="email" fluid placeholder="name@example.com" :invalid="Boolean(firstError('email'))" />
        </IconField>
        <small v-if="firstError('email')" class="error">{{ firstError("email") }}</small>
        <small v-else class="help">{{ $t("parent_email_recovery_hint") }}</small>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="pp-field is-required">
          <label for="reg-password">{{ $t("password") }}</label>
          <Password v-model="form.password" input-id="reg-password" toggle-mask :feedback="false" autocomplete="new-password" required fluid
            :invalid="Boolean(firstError('password')) || (submitted && form.password.length < 6)" />
          <small v-if="firstError('password')" class="error">{{ firstError("password") }}</small>
          <small v-else class="help">{{ $t("pwreset.password_help") }}</small>
        </div>
        <div class="pp-field is-required">
          <label for="reg-confirm">{{ $t("password_confirmation") }}</label>
          <Password v-model="form.password_confirmation" input-id="reg-confirm" toggle-mask :feedback="false" autocomplete="new-password" required fluid :invalid="mismatch" />
          <small v-if="mismatch" class="error">{{ $t("pwreset.mismatch") }}</small>
        </div>
      </div>

      <Message v-if="parentStore.showErrors && parentStore.errorMessage" severity="error" :closable="false">{{ parentStore.errorMessage }}</Message>

      <Button type="submit" :label="$t('create_button')" icon="pi pi-user-plus" :loading="parentStore.loading" fluid size="large" />

      <p class="text-center pp-muted m-0 pt-2">
        {{ $t("pp.have_account") }}
        <router-link :to="{ name: 'parentLogin' }" class="pp-link">{{ $t("sign_in") }}</router-link>
      </p>
    </form>
  </AuthLayout>
</template>
