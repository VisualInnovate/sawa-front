<script setup>
// The recipient's signing page (no account): the private link, a code sent to their phone, then the contract to read,
// accept with their signature or stamp (kept for their phone only if they wish), or reject with a reason.
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { printHtml } from "@/utils/printHtml";
import { siteLogo } from "@/utils/siteBrand";
import SignaturePad from "@/components/contracts/SignaturePad.vue";
import { contractPage } from "@/components/contracts/contractStatus";

const { t, locale } = useI18n();
const route = useRoute();
const token = String(route.params.token || "");
const KEY = `contractSign:${token}`;

const step = ref("loading");
const info = ref(null);
const contract = ref(null);
const code = ref("");
const error = ref("");
const busy = ref(false);
const agree = ref(false);
const useSaved = ref(true);
const signature = ref(null);
const keep = ref(true);
const reject = ref({ open: false, reason: "" });
const frame = ref(null);

const session = {
  get: () => { try { return sessionStorage.getItem(KEY); } catch { return null; } },
  set: (v) => { try { sessionStorage.setItem(KEY, v); } catch { /* this visit only */ } },
  clear: () => { try { sessionStorage.removeItem(KEY); } catch { /* nothing stored */ } },
};
const api = (method, url, data) =>
  axios({ method, url: `api/contract-sign/${token}${url}`, data, skipAuth: true, skipAuthRedirect: true, headers: session.get() ? { "X-Sign-Session": session.get() } : {} });
const message = (e) => Object.values(e.response?.data?.errors || {})[0]?.[0] || e.response?.data?.message || t("sign.failed");
const dateTime = (iso) => (iso ? new Date(iso).toLocaleString(locale.value === "ar" ? "ar-JO" : "en-GB", { dateStyle: "medium", timeStyle: "short" }) : "");
const html = computed(() => (contract.value ? contractPage(contract.value, t) : ""));
const hasSaved = computed(() => !!contract.value?.saved_signature);
const ready = computed(() => agree.value && ((hasSaved.value && useSaved.value) || signature.value));

const showContract = (data) => {
  contract.value = data;
  step.value = data.status === "sent" ? "read" : data.status;
};

onMounted(async () => {
  try {
    info.value = (await api("get", "")).data.data;
  } catch (e) {
    step.value = e.response?.status === 404 ? "invalid" : "error";
    error.value = message(e);
    return;
  }
  if (session.get()) {
    try {
      showContract((await api("get", "/contract")).data.data);
      return;
    } catch {
      session.clear();
    }
  }
  step.value = info.value.status === "sent" ? "start" : info.value.status;
});

async function sendCode() {
  busy.value = true;
  error.value = "";
  try {
    await api("post", "/code");
    step.value = "code";
  } catch (e) {
    error.value = e.response?.status === 429 ? t("sign.wait") : message(e);
  } finally {
    busy.value = false;
  }
}

async function verify() {
  busy.value = true;
  error.value = "";
  try {
    const { data } = await api("post", "/verify", { code: code.value });
    session.set(data.session);
    showContract(data.data);
  } catch (e) {
    error.value = e.response?.status === 429 ? t("sign.wait") : message(e);
  } finally {
    busy.value = false;
  }
}

async function accept() {
  busy.value = true;
  error.value = "";
  try {
    const drawn = !hasSaved.value || !useSaved.value;
    const body = { agree: agree.value, ...(drawn ? { signature: signature.value, save_signature: keep.value } : { use_saved: true }) };
    showContract((await api("post", "/accept", body)).data.data);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (e) {
    if (e.response?.status === 401) return expired();
    error.value = message(e);
  } finally {
    busy.value = false;
  }
}

async function sendReject() {
  busy.value = true;
  error.value = "";
  try {
    showContract((await api("post", "/reject", { reason: reject.value.reason })).data.data);
    reject.value.open = false;
  } catch (e) {
    if (e.response?.status === 401) return expired();
    error.value = message(e);
  } finally {
    busy.value = false;
  }
}

async function forgetSaved() {
  try {
    contract.value = (await axios({ method: "delete", url: `api/contract-sign/${token}/signature`, skipAuth: true, skipAuthRedirect: true, headers: { "X-Sign-Session": session.get() } })).data.data;
    useSaved.value = false;
  } catch (e) {
    error.value = message(e);
  }
}

function expired() {
  session.clear();
  code.value = "";
  step.value = "start";
  error.value = t("sign.session_over");
}

// The contract page sizes itself to its content (same-origin frame).
function fit() {
  const doc = frame.value?.contentDocument;
  if (doc?.body) frame.value.style.height = `${doc.documentElement.scrollHeight + 8}px`;
}
</script>

<template>
  <div class="sg" dir="rtl" lang="ar">
    <header class="sg-top">
      <img :src="siteLogo()" alt="" class="sg-logo" />
      <div>
        <p class="sg-brand">{{ t("sign.brand") }}</p>
        <p v-if="info" class="sg-sub">{{ info.title }} · <span dir="ltr">{{ info.number }}</span></p>
      </div>
    </header>

    <main class="sg-main">
      <div v-if="step === 'loading'" class="sg-card text-center"><i class="pi pi-spin pi-spinner text-2xl" /></div>

      <div v-else-if="step === 'invalid' || step === 'error'" class="sg-card sg-state">
        <i class="pi pi-link" aria-hidden="true" />
        <h1>{{ t("sign.invalid_title") }}</h1>
        <p>{{ t("sign.invalid_body") }}</p>
      </div>

      <div v-else-if="step === 'start' || step === 'code'" class="sg-card">
        <h1>{{ t("sign.hello", { name: info.recipient_name || "" }) }}</h1>
        <p>{{ t("sign.intro") }}</p>
        <p class="sg-muted">{{ t("sign.expires", { date: dateTime(info.expires_at) }) }}</p>
        <template v-if="step === 'start'">
          <p>{{ t("sign.code_to", { phone: info.phone }) }}</p>
          <Button icon="pi pi-mobile" :label="t('sign.send_code')" :loading="busy" class="w-full" @click="sendCode" />
        </template>
        <form v-else class="grid gap-2" @submit.prevent="verify">
          <label for="sg-code" class="font-bold">{{ t("sign.enter_code", { phone: info.phone }) }}</label>
          <InputText id="sg-code" v-model="code" inputmode="numeric" autocomplete="one-time-code" dir="ltr" class="sg-code" maxlength="10" autofocus />
          <Button type="submit" icon="pi pi-check" :label="t('sign.verify')" :loading="busy" :disabled="!code.trim()" class="w-full" />
          <Button type="button" :label="t('sign.resend')" text size="small" :disabled="busy" @click="sendCode" />
        </form>
        <p v-if="error" class="p-error m-0" role="alert">{{ error }}</p>
      </div>

      <template v-else-if="step === 'read'">
        <div class="sg-card">
          <h1>{{ t("sign.read_title") }}</h1>
          <p class="m-0">{{ t("sign.read_hint") }}</p>
        </div>
        <iframe ref="frame" class="sg-doc" :srcdoc="html" :title="t('sign.read_title')" @load="fit" />
        <div class="sg-card">
          <div class="flex items-start gap-2">
            <Checkbox v-model="agree" input-id="sg-agree" binary />
            <label for="sg-agree" class="font-bold">{{ t("sign.agree") }}</label>
          </div>
          <div class="grid gap-2">
            <p class="font-bold m-0">{{ t("sign.your_signature") }}</p>
            <template v-if="hasSaved">
              <div class="flex items-center gap-3">
                <RadioButton v-model="useSaved" input-id="sg-saved" :value="true" />
                <label for="sg-saved" class="sg-saved"><img :src="contract.saved_signature" :alt="t('sign.saved_signature')" /></label>
              </div>
              <div class="flex items-center gap-3">
                <RadioButton v-model="useSaved" input-id="sg-new" :value="false" />
                <label for="sg-new">{{ t("sign.new_signature") }}</label>
              </div>
              <Button :label="t('sign.forget_saved')" text size="small" severity="danger" class="justify-self-start" @click="forgetSaved" />
            </template>
            <template v-if="!hasSaved || !useSaved">
              <SignaturePad v-model="signature" />
              <div class="flex items-center gap-2">
                <Checkbox v-model="keep" input-id="sg-keep" binary />
                <label for="sg-keep">{{ t("sign.keep") }}</label>
              </div>
            </template>
          </div>
          <p v-if="error" class="p-error m-0" role="alert">{{ error }}</p>
          <div class="sg-actions">
            <Button icon="pi pi-check-circle" :label="t('sign.accept')" :loading="busy" :disabled="!ready" @click="accept" />
            <Button icon="pi pi-times" :label="t('sign.reject')" severity="danger" outlined :disabled="busy" @click="reject = { open: true, reason: '' }" />
          </div>
        </div>
      </template>

      <template v-else-if="step === 'approved'">
        <div class="sg-card sg-state ok">
          <i class="pi pi-check-circle" aria-hidden="true" />
          <h1>{{ t("sign.approved_title") }}</h1>
          <p>{{ contract ? t("sign.approved_body", { date: dateTime(contract.decided_at) }) : t("sign.already_approved") }}</p>
          <Button v-if="contract" icon="pi pi-print" :label="t('sign.print')" @click="printHtml(html)" />
        </div>
        <iframe v-if="contract" ref="frame" class="sg-doc" :srcdoc="html" :title="t('sign.read_title')" @load="fit" />
      </template>

      <div v-else-if="step === 'rejected'" class="sg-card sg-state">
        <i class="pi pi-times-circle" aria-hidden="true" />
        <h1>{{ t("sign.rejected_title") }}</h1>
        <p>{{ t("sign.rejected_body") }}</p>
      </div>

      <div v-else class="sg-card sg-state">
        <i class="pi pi-clock" aria-hidden="true" />
        <h1>{{ t("sign.closed_title") }}</h1>
        <p>{{ t("sign.closed_body") }}</p>
      </div>
    </main>

    <Dialog v-model:visible="reject.open" modal :header="t('sign.reject')" :style="{ width: '480px', maxWidth: '94vw' }">
      <div class="grid gap-2">
        <label for="sg-reason" class="font-bold">{{ t("sign.reason") }}</label>
        <Textarea id="sg-reason" v-model="reject.reason" rows="4" auto-resize />
        <p v-if="error" class="p-error m-0">{{ error }}</p>
      </div>
      <template #footer>
        <Button :label="t('cancel')" text severity="secondary" @click="reject.open = false" />
        <Button icon="pi pi-times" :label="t('sign.reject')" severity="danger" :loading="busy" :disabled="reject.reason.trim().length < 3" @click="sendReject" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.sg { min-height: 100vh; background: #f1f5f9; font-family: Cairo, Tahoma, sans-serif; color: #0f172a; }
.sg-top { display: flex; align-items: center; gap: .75rem; padding: .9rem 1rem; background: #fff; border-bottom: 3px solid rgb(var(--bp-135c65)); }
.sg-logo { width: 48px; height: 48px; object-fit: contain; }
.sg-brand { margin: 0; font-weight: 800; color: rgb(var(--bp-135c65)); }
.sg-sub { margin: 0; font-size: .85rem; color: #475569; }
.sg-main { max-width: 860px; margin: 0 auto; padding: 1rem; display: grid; gap: 1rem; }
.sg-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.25rem; display: grid; gap: .85rem; }
.sg-card h1 { font-size: 1.25rem; margin: 0; }
.sg-card p { margin: 0; line-height: 1.7; }
.sg-muted { color: #64748b; font-size: .88rem; }
.sg-code { font-size: 1.6rem; letter-spacing: .4em; text-align: center; }
.sg-doc { width: 100%; min-height: 70vh; border: 0; border-radius: 12px; background: #f1f5f9; }
.sg-saved img { max-height: 70px; max-width: 260px; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; padding: 4px; }
.sg-actions { display: flex; flex-wrap: wrap; gap: .6rem; }
.sg-state { text-align: center; justify-items: center; }
.sg-state > i { font-size: 2.6rem; color: #94a3b8; }
.sg-state.ok > i { color: #16a34a; }
</style>
