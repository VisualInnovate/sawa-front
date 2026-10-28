<script setup>
// «التوظيف»: the public careers page. The candidate signs in with their phone and a one-time code, then fills in
// two steps (their data, their documents) that are saved as they go, and sends the application. Afterwards the page
// shows where it stands; when HR returns it, the reason shows on top and the steps open again.
import moment from "moment";
import { computed, nextTick, onMounted, onBeforeUnmount, ref } from "vue";
import { useI18n } from "vue-i18n";
import LocaleSelect from "@/components/LocaleSelect.vue";
import logo from "@/views/frontend/views/main/images/logo.png";
import photo from "@/views/frontend/views/main/images/hero-teacher-child.jpg";
import { careersApi, careersToken, serverMessage } from "@/utils/careers";
import CareersForm from "./CareersForm.vue";
import CareersDocuments from "./CareersDocuments.vue";

const { t, te, locale } = useI18n();

const info = ref(null);
const payload = ref(null);
const loading = ref(true);
const loadError = ref("");
const step = ref(1);
const ar = computed(() => locale.value === "ar");

async function load() {
  loading.value = true;
  loadError.value = "";
  try {
    info.value = (await careersApi("get", "info")).data.data;
    if (careersToken.get()) {
      try {
        payload.value = (await careersApi("get", "me")).data.data;
      } catch (err) {
        if (err.response?.status === 401) careersToken.clear();
        else throw err;
      }
    }
  } catch {
    loadError.value = t("careers.load_failed");
  } finally {
    loading.value = false;
  }
}
onMounted(load);

// ---- Sign in: phone, then the code ----
const phone = ref("");
const code = ref("");
const sentTo = ref("");
const signError = ref("");
const signing = ref(false);
const resendIn = ref(0);
let resendTimer = null;
onBeforeUnmount(() => clearInterval(resendTimer));

const profile = computed(() => payload.value?.profile ?? info.value?.profile);
const phoneTried = ref(false);
// Shown under the field: empty only after trying to send, wrong as soon as typed.
const phoneError = computed(() => {
  const digits = phone.value.replace(/\D/g, "").replace(/^0+/, "");
  if (!digits) return phoneTried.value ? t("careers.err.required") : "";
  return digits.length === profile.value.phone_digits && digits.startsWith(profile.value.phone_starts) ? "" : t("careers.err.phone_detail", { start: profile.value.phone_starts, n: profile.value.phone_digits });
});

async function requestCode() {
  signError.value = "";
  phoneTried.value = true;
  if (phoneError.value) return;
  signing.value = true;
  try {
    const { data } = await careersApi("post", "code", { phone: phone.value });
    sentTo.value = data.data.phone;
    code.value = "";
    resendIn.value = 60;
    clearInterval(resendTimer);
    resendTimer = setInterval(() => (resendIn.value = Math.max(0, resendIn.value - 1)), 1000);
    await nextTick();
    document.querySelector(".cr-code input")?.focus();
  } catch (err) {
    signError.value = serverMessage(t, te, err.response?.data?.message ?? Object.values(err.response?.data?.errors ?? {})[0]?.[0]);
  } finally {
    signing.value = false;
  }
}

async function verify() {
  signError.value = "";
  if (!/^\d{6}$/.test(code.value)) {
    signError.value = t("careers.err.code_format");
    return;
  }
  signing.value = true;
  try {
    const { data } = await careersApi("post", "verify", { phone: sentTo.value, code: code.value });
    careersToken.set(data.data.token);
    payload.value = data.data.candidate;
    step.value = 1;
  } catch (err) {
    signError.value = serverMessage(t, te, err.response?.data?.message ?? Object.values(err.response?.data?.errors ?? {})[0]?.[0]);
  } finally {
    signing.value = false;
  }
}

async function signOut() {
  try {
    await careersApi("post", "logout");
  } catch {
    // signed out anyway
  }
  careersToken.clear();
  payload.value = null;
  sentTo.value = "";
  phone.value = "";
}

// ---- Steps and status ----
const form = ref(null);
const editable = computed(() => payload.value?.editable);
const statusKey = computed(() => payload.value?.candidate.status);
const statusTone = { new: "info", review: "info", approved: "success", contracting: "success", hired: "success", rejected: "danger" };

async function goToDocuments() {
  step.value = 2;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
async function backToData() {
  step.value = 1;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function sent(data) {
  payload.value = data;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
const vacancyName = computed(() => {
  const v = info.value?.vacancies.find((row) => row.id === payload.value?.candidate.vacancy_id);
  return v ? (ar.value ? v.title_ar : v.title_en || v.title_ar) : "";
});
</script>

<template>
  <div class="pp-shell cr">
    <header class="cr-top pp-container">
      <a href="/" class="cr-top__logo"><img :src="$siteLogo(logo)" alt="Sawa" /></a>
      <div class="flex items-center gap-2">
        <LocaleSelect />
        <Button v-if="payload" type="button" icon="pi pi-sign-out" :label="$t('careers.sign_out')" text size="small" @click="signOut" />
      </div>
    </header>

    <main class="pp-container cr-main">
      <div v-if="loading" class="flex justify-center p-6"><i class="pi pi-spin pi-spinner text-3xl" /></div>
      <Message v-else-if="loadError" severity="error" :closable="false">{{ loadError }} <Button :label="$t('careers.retry')" text size="small" @click="load" /></Message>

      <!-- Signing in -->
      <section v-else-if="!payload" class="cr-sign pp-card pp-in">
        <div class="cr-sign__photo">
          <img :src="photo" alt="" />
          <div class="cr-sign__veil" />
          <div class="cr-sign__words">
            <p class="cr-sign__tag">{{ $t("careers.brand") }}</p>
            <h1 class="cr-sign__slogan">{{ $t("careers.slogan") }}</h1>
          </div>
        </div>
        <div class="cr-sign__form pp-stack">
          <h2 class="pp-h2">{{ sentTo ? $t("careers.enter_code") : $t("careers.sign_in") }}</h2>
          <p class="pp-lead m-0">{{ sentTo ? $t("careers.code_sent", { phone: `⁦${sentTo}⁩` }) : $t("careers.sign_in_hint") }}</p>
          <Message v-if="!info.open" severity="warn" :closable="false">{{ $t("careers.closed") }}</Message>

          <form v-if="!sentTo" class="pp-stack" novalidate @submit.prevent="requestCode">
            <div class="pp-field is-required" :class="{ 'cr-invalid': phoneError }">
              <label for="cr-login-phone">{{ $t("careers.phone") }}</label>
              <div dir="ltr" class="cr-addon">
                <span class="cr-addon__label">{{ profile.phone_code }}</span>
                <InputText id="cr-login-phone" v-model="phone" type="tel" inputmode="tel" autocomplete="tel" class="cr-addon__input"
                  :placeholder="`${profile.phone_starts}XXXXXXXX`" :invalid="!!phoneError" />
              </div>
              <small v-if="phoneError" class="error">{{ phoneError }}</small>
            </div>
            <Message v-if="signError" severity="error" :closable="false">{{ signError }}</Message>
            <Button type="submit" :label="$t('careers.send_code')" icon="pi pi-send" :loading="signing" fluid size="large" />
          </form>

          <form v-else class="pp-stack" novalidate @submit.prevent="verify">
            <div class="pp-field is-required">
              <label for="cr-code">{{ $t("careers.code") }}</label>
              <div dir="ltr" class="cr-otp cr-code">
                <InputOtp id="cr-code" v-model="code" :length="6" integerOnly @update:modelValue="(v) => String(v ?? '').length === 6 && verify()" />
              </div>
            </div>
            <Message v-if="signError" severity="error" :closable="false">{{ signError }}</Message>
            <Button type="submit" :label="$t('careers.verify')" icon="pi pi-check" :loading="signing" fluid size="large" />
            <div class="flex flex-wrap items-center justify-between gap-2">
              <Button type="button" :label="$t('careers.change_phone')" text size="small" @click="sentTo = ''" />
              <Button type="button" :label="resendIn ? $t('careers.resend_in', { s: resendIn }) : $t('careers.resend')" text size="small" :disabled="resendIn > 0 || signing" @click="requestCode" />
            </div>
          </form>
        </div>
      </section>

      <!-- After sending: where it stands -->
      <section v-else-if="!editable" class="cr-status pp-card pp-card--pad pp-in">
        <i class="pi cr-status__icon" :class="statusKey === 'rejected' ? 'pi-times-circle' : 'pi-check-circle'" />
        <h1 class="pp-h1">{{ $t(`careers.status_${statusKey}_title`) }}</h1>
        <p class="pp-lead">{{ $t(`careers.status_${statusKey}_body`) }}</p>
        <div class="cr-status__facts">
          <span class="pp-tag" :class="`pp-tag--${statusTone[statusKey] ?? 'info'}`">{{ $t(`careers.status_${statusKey}`) }}</span>
          <span v-if="vacancyName"><i class="pi pi-briefcase" /> {{ vacancyName }}</span>
          <span v-if="payload.candidate.submitted_at"><i class="pi pi-calendar" /> {{ $t("careers.sent_on", { date: `⁦${moment(payload.candidate.submitted_at).format("YYYY-MM-DD")}⁩` }) }}</span>
        </div>
      </section>

      <!-- Filling in -->
      <template v-else>
        <div class="cr-head pp-in">
          <h1 class="pp-h1">{{ $t("careers.title") }}</h1>
          <p class="pp-lead m-0">{{ $t("careers.subtitle") }}</p>
          <ol class="cr-steps" :aria-label="$t('careers.steps')">
            <li :class="{ 'is-on': step === 1, 'is-done': step > 1 }"><span>1</span>{{ $t("careers.step_data") }}</li>
            <li class="cr-steps__line" aria-hidden="true" />
            <li :class="{ 'is-on': step === 2 }"><span>2</span>{{ $t("careers.step_documents") }}</li>
          </ol>
          <div class="cr-progress" :aria-label="$t('careers.completion')">
            <ProgressBar :value="payload.completion" :showValue="false" />
            <small>{{ $t("careers.completion_value", { n: payload.completion }) }}</small>
          </div>
        </div>

        <Message severity="warn" :closable="false" icon="pi pi-info-circle">{{ $t("careers.fill_all") }}</Message>
        <div v-if="payload.return_note" class="cr-return" role="alert">
          <div class="cr-return__head">
            <strong>{{ $t("careers.return_title") }}</strong>
            <small dir="ltr">{{ moment(payload.return_note.created_at).format("YYYY-MM-DD HH:mm") }}</small>
          </div>
          <p class="m-0 whitespace-pre-line">{{ payload.return_note.body }}</p>
          <small v-if="payload.return_note.data?.fields?.length || payload.return_note.data?.documents?.length">{{ $t("careers.return_marked") }}</small>
        </div>

        <CareersForm v-if="step === 1" ref="form" :payload="payload" :info="info" @saved="(p) => (payload = p)" @next="goToDocuments" />
        <CareersDocuments v-else :payload="payload" @saved="(p) => (payload = p)" @back="backToData" @sent="sent" />
      </template>
    </main>
  </div>
</template>

<style>
.cr { padding-bottom: 3rem; }
.cr-top { display: flex; align-items: center; justify-content: space-between; padding-block: 0.9rem; }
.cr-top__logo img { height: 52px; width: auto; }
.cr-main { display: grid; gap: 1rem; }
.cr-head { text-align: center; display: grid; gap: 0.5rem; justify-items: center; padding-top: 0.5rem; }
.cr-steps { list-style: none; display: flex; align-items: center; gap: 0.75rem; padding: 0; margin: 0.75rem 0 0; }
.cr-steps li { display: flex; flex-direction: column; align-items: center; gap: 0.35rem; font-weight: 700; color: var(--pp-muted); font-size: 0.9rem; }
.cr-steps li span { width: 44px; height: 44px; border-radius: 999px; display: grid; place-items: center; background: var(--pp-sand); border: 2px solid var(--pp-sand-200); font-weight: 800; }
.cr-steps li.is-on { color: var(--pp-teal-900); }
.cr-steps li.is-on span { background: var(--pp-teal-900); color: #fff; border-color: var(--pp-teal-100); box-shadow: 0 0 0 4px var(--pp-teal-50); }
.cr-steps li.is-done span { background: var(--pp-success); color: #fff; border-color: var(--pp-success-50); }
.cr-steps__line { width: clamp(60px, 18vw, 220px); height: 2px; background: var(--pp-sand-200); align-self: start; margin-top: 22px; }
.cr-progress { width: min(420px, 100%); display: grid; gap: 0.25rem; }
.cr-progress .p-progressbar { height: 8px; border-radius: 99px; }
.cr-progress .p-progressbar-value { background: var(--pp-teal); }
.cr-progress small { color: var(--pp-muted); font-weight: 700; }
.cr-section { display: grid; gap: 1rem; }
.cr-section__title { display: flex; align-items: center; gap: 0.5rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--pp-sand-200); }
.cr-section__title i { color: var(--pp-teal); }
.cr-grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
.cr-two { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
.cr-invalid .p-selectbutton { outline: 2px solid var(--pp-danger); outline-offset: 2px; border-radius: 12px; }
.cr-flag { background: var(--pp-warn-50); border-radius: 12px; padding: 0.5rem; margin: -0.5rem; }
.cr-addon { display: flex; align-items: stretch; }
.cr-addon__label { display: grid; place-items: center; padding: 0 0.9rem; background: var(--pp-sand); border: 1px solid var(--pp-sand-200); border-inline-end: 0; border-radius: 14px 0 0 14px; font-weight: 800; color: var(--pp-ink); }
.cr-addon__input { flex: 1; border-radius: 0 14px 14px 0 !important; letter-spacing: 0.04em; }
.cr-otp .p-inputotp { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.cr-otp .p-inputotp-input { width: 44px; height: 48px; text-align: center; font-weight: 800; font-size: 1.15rem; border-radius: 12px; }
.cr-job { border: 1px dashed var(--pp-sand-200); border-radius: 16px; padding: 1rem; display: grid; gap: 0.5rem; }
.cr-actions { display: flex; justify-content: flex-end; }
.cr-actions--split { justify-content: space-between; }
.cr-autosave { justify-self: end; font-size: 0.85rem; font-weight: 700; color: var(--pp-muted); display: flex; align-items: center; gap: 0.35rem; }
.cr-autosave.is-saved { color: var(--pp-success); }
.cr-autosave.is-error { color: var(--pp-danger); }
.cr-return { background: var(--pp-danger-50); border: 1px solid #f3c2c4; border-radius: 16px; padding: 1rem 1.25rem; display: grid; gap: 0.35rem; color: var(--pp-danger); }
.cr-return__head { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
.cr-return p { color: var(--pp-ink); }
.cr-docs { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
.cr-doc { border: 1px dashed var(--pp-sand-200); border-radius: 18px; padding: 1rem; display: grid; gap: 0.6rem; align-content: start; background: #fff; }
.cr-doc.cr-invalid { border-color: var(--pp-danger); background: var(--pp-danger-50); }
.cr-doc .error { font-size: 0.82rem; font-weight: 700; color: var(--pp-danger); }
.cr-doc .help, .cr-section > .help { font-size: 0.8rem; color: var(--pp-muted); }
.cr-doc__head { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
.cr-doc__name { font-weight: 800; color: var(--pp-ink); }
.cr-doc__files { display: grid; gap: 0.5rem; }
.cr-doc__file { display: flex; align-items: center; gap: 0.6rem; background: var(--pp-sand); border-radius: 12px; padding: 0.4rem; }
.cr-doc__thumb { width: 54px; height: 54px; border-radius: 10px; overflow: hidden; display: grid; place-items: center; background: #fff; border: 1px solid var(--pp-sand-200); cursor: pointer; flex: none; }
.cr-doc__thumb img { width: 100%; height: 100%; object-fit: cover; }
.cr-doc__thumb i { font-size: 1.5rem; color: var(--pp-teal); }
.cr-doc__meta { display: grid; min-width: 0; flex: 1; }
.cr-doc__filename { font-weight: 700; font-size: 0.85rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cr-doc__empty { display: grid; place-items: center; gap: 0.25rem; min-height: 72px; color: var(--pp-muted); background: var(--pp-sand); border-radius: 12px; font-size: 0.85rem; }
.cr-doc__upload { justify-content: center; gap: 0.5rem; cursor: pointer; border-radius: 999px !important; }
.cr-sign { display: grid; overflow: hidden; max-width: 980px; margin: 1rem auto 0; width: 100%; }
@media (min-width: 900px) { .cr-sign { grid-template-columns: 1fr 1fr; } }
.cr-sign__photo { position: relative; min-height: 200px; background: var(--pp-teal-900); }
.cr-sign__photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.cr-sign__veil { position: absolute; inset: 0; background: linear-gradient(180deg, rgb(var(--bp-035b65) / 0.15), rgb(var(--bp-035b65) / 0.8)); }
.cr-sign__words { position: absolute; inset-inline: 1.5rem; bottom: 1.5rem; color: #fff; }
.cr-sign__tag { margin: 0 0 0.25rem; font-weight: 700; opacity: 0.9; }
.cr-sign__slogan { margin: 0; font-size: clamp(1.3rem, 1rem + 1.2vw, 1.9rem); font-weight: 800; line-height: 1.35; }
.cr-sign__form { padding: clamp(1.25rem, 3vw, 2.25rem); align-content: center; }
.cr-status { max-width: 680px; margin: 1.5rem auto 0; text-align: center; display: grid; gap: 0.75rem; justify-items: center; }
.cr-status__icon { font-size: 3.25rem; color: var(--pp-success); }
.cr-status__icon.pi-times-circle { color: var(--pp-danger); }
.cr-status__facts { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem 1.25rem; color: var(--pp-muted); font-weight: 700; }
</style>
