<script setup>
// Sign in with the phone number (the one given at registration) and the password.
import { ref } from "vue";
import { useParentStore } from "@/stores/ParentStore";
import AuthLayout from "./AuthLayout.vue";

const parentStore = useParentStore();
const form = ref({ phone: "", password: "" });
const firstError = (key) => {
  const value = parentStore.errors?.[key];
  return Array.isArray(value) ? value[0] : value;
};
const submit = () => parentStore.login({ phone: form.value.phone.trim(), password: form.value.password });
</script>

<template>
  <AuthLayout :title="$t('pp.login_title')" :subtitle="$t('pp.login_hint')">
    <form class="pp-stack" novalidate data-no-request-spinner @submit.prevent="submit">
      <div class="pp-field is-required">
        <label for="login-phone">{{ $t("Mobile_number") }}</label>
        <IconField>
          <InputIcon class="pi pi-phone" />
          <InputText id="login-phone" v-model="form.phone" type="tel" inputmode="tel" autocomplete="username" dir="ltr" required fluid
            placeholder="07xxxxxxxx" :invalid="Boolean(firstError('phone'))" />
        </IconField>
        <small v-if="firstError('phone')" class="error">{{ firstError("phone") }}</small>
      </div>

      <div class="pp-field is-required">
        <label for="login-password">{{ $t("password") }}</label>
        <Password v-model="form.password" input-id="login-password" toggle-mask :feedback="false" autocomplete="current-password" required fluid
          :invalid="Boolean(firstError('password'))" />
        <small v-if="firstError('password')" class="error">{{ firstError("password") }}</small>
        <router-link :to="{ name: 'forgetpassword' }" class="pp-link text-sm justify-self-start">{{ $t("forgetpass") }}</router-link>
      </div>

      <Message v-if="parentStore.showErrors && parentStore.errorMessage" severity="error" :closable="false">{{ parentStore.errorMessage }}</Message>

      <Button type="submit" :label="$t('sign_in')" icon="pi pi-sign-in" :loading="parentStore.loading" :disabled="!form.phone.trim() || !form.password" fluid size="large" />

      <p class="text-center pp-muted m-0 pt-2">
        {{ $t("pp.no_account") }}
        <router-link :to="{ name: 'SingUp' }" class="pp-link">{{ $t("Create_an_account") }}</router-link>
      </p>
    </form>
  </AuthLayout>
</template>
