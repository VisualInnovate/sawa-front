<script setup>
// The public check of a printed contract's code: is it a real contract of the academy, and is it approved?
import axios from "axios";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { siteLogo } from "@/utils/siteBrand";

const { t, locale } = useI18n();
const route = useRoute();
const result = ref(null);
const state = ref("loading");

onMounted(async () => {
  try {
    result.value = (await axios.get(`api/contract-sign/check/${encodeURIComponent(route.params.code)}`, { skipAuth: true, skipAuthRedirect: true })).data.data;
    state.value = "found";
  } catch {
    state.value = "missing";
  }
});
const dateTime = (iso) => (iso ? new Date(iso).toLocaleString(locale.value === "ar" ? "ar-JO" : "en-GB", { dateStyle: "medium", timeStyle: "short" }) : "");
</script>

<template>
  <div class="ck" dir="rtl" lang="ar">
    <div class="ck-card">
      <img :src="siteLogo()" alt="" class="ck-logo" />
      <h1>{{ t("sign.check_title") }}</h1>
      <p dir="ltr" class="ck-code">{{ route.params.code }}</p>
      <i v-if="state === 'loading'" class="pi pi-spin pi-spinner text-2xl" />
      <template v-else-if="state === 'found' && result.status === 'approved'">
        <i class="pi pi-verified ck-ok" aria-hidden="true" />
        <p>{{ t("sign.check_ok", { number: result.number, title: result.title, date: dateTime(result.approved_at) }) }}</p>
        <p class="ck-hash" dir="ltr">{{ result.content_hash }}</p>
      </template>
      <template v-else-if="state === 'found'">
        <i class="pi pi-exclamation-triangle ck-warn" aria-hidden="true" />
        <p>{{ t("sign.check_not_approved", { number: result.number, status: t("con.status_" + result.status) }) }}</p>
      </template>
      <template v-else>
        <i class="pi pi-times-circle ck-bad" aria-hidden="true" />
        <p>{{ t("sign.check_missing") }}</p>
      </template>
    </div>
  </div>
</template>

<style scoped>
.ck { min-height: 100vh; display: grid; place-items: center; background: #f1f5f9; padding: 1rem; font-family: Cairo, Tahoma, sans-serif; }
.ck-card { max-width: 460px; width: 100%; background: #fff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 1.5rem; text-align: center; display: grid; gap: .6rem; justify-items: center; }
.ck-logo { width: 64px; height: 64px; object-fit: contain; }
.ck-card h1 { font-size: 1.2rem; margin: 0; color: rgb(var(--bp-135c65)); }
.ck-code { font-weight: 800; letter-spacing: .08em; margin: 0; }
.ck-card p { margin: 0; line-height: 1.7; }
.ck-hash { font-size: .7rem; color: #94a3b8; word-break: break-all; }
.ck-card > i { font-size: 2.4rem; }
.ck-ok { color: #16a34a; }
.ck-warn { color: #d97706; }
.ck-bad { color: #dc2626; }
</style>
