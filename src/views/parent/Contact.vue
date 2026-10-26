<script setup>
// «تواصل معنا»: a message to the academy and its phone, address and e-mail. Open to visitors too; a signed-in
// parent sees it inside the portal.
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import PageHead from "@/components/parent/PageHead.vue";
import LocaleSelect from "@/components/LocaleSelect.vue";
import { useParentStore } from "@/stores/ParentStore";
import { sendContactMessage, contactErrorText } from "@/utils/contact";
import logo from "@/views/frontend/views/main/images/logo.png";

const { t } = useI18n();
const parentStore = useParentStore();
const form = ref({ fname: "", lname: "", email: "", phone: "", message: "" });
const sending = ref(false);
const feedback = ref(null);

async function submit() {
  if (sending.value) return;
  feedback.value = null;
  sending.value = true;
  try {
    await sendContactMessage({ firstName: form.value.fname, lastName: form.value.lname, email: form.value.email, phone: form.value.phone, message: form.value.message });
    feedback.value = { type: "success", text: t("message_sent") };
    form.value = { fname: "", lname: "", email: "", phone: "", message: "" };
  } catch (error) {
    feedback.value = { type: "error", text: contactErrorText(error, t) };
  } finally {
    sending.value = false;
  }
}

const CARDS = [
  { icon: "pi pi-phone", title: "call_now", text: "happy_to_help", value: "0791017001 - 065522688", href: "tel:+962791017001" },
  { icon: "pi pi-whatsapp", title: "pp.whatsapp", text: "pp.whatsapp_hint", value: "+962 79 101 7001", href: "https://wa.me/962791017001" },
  { icon: "pi pi-map-marker", title: "address", text: "academy_address", value: "", href: "https://maps.google.com/?q=Sawa+Academy+Amman" },
  { icon: "pi pi-envelope", title: "support", text: "support_hint", value: "info@sawa.academy", href: "mailto:info@sawa.academy" },
];
</script>

<template>
  <div :class="parentStore.isAuthenticated ? '' : 'pp-shell pp-guest'">
    <header v-if="!parentStore.isAuthenticated" class="pp-guest__bar">
      <div class="pp-container pp-row pp-between" style="min-height: 72px">
        <a href="/"><img :src="logo" alt="Sawa" style="height: 44px" /></a>
        <div class="pp-row">
          <LocaleSelect />
          <router-link :to="{ name: 'parentLogin' }" class="pp-btn pp-btn--soft pp-btn--sm">{{ $t("sign_in") }}</router-link>
        </div>
      </div>
    </header>

    <div :class="parentStore.isAuthenticated ? '' : 'pp-container'">
      <div class="pp-page">
        <PageHead :title="$t('contact_us')" :lead="$t('contact_page_hint')" :kicker="$t('pp.brand')" icon="pi pi-phone" />

        <div class="pp-grid pp-contact">
          <form class="pp-card pp-card--pad pp-stack pp-in" novalidate data-no-request-spinner @submit.prevent="submit">
            <h2 class="pp-h2">{{ $t("contact_anytime") }}</h2>
            <div class="pp-form-grid">
              <div class="pp-field is-required"><label for="ct-fname">{{ $t("first_name") }}</label><InputText id="ct-fname" v-model="form.fname" fluid /></div>
              <div class="pp-field is-required"><label for="ct-lname">{{ $t("family_name") }}</label><InputText id="ct-lname" v-model="form.lname" fluid /></div>
              <div class="pp-field is-required"><label for="ct-email">{{ $t("email") }}</label><InputText id="ct-email" v-model="form.email" type="email" fluid /></div>
              <div class="pp-field is-required"><label for="ct-phone">{{ $t("Mobile_number") }}</label><InputText id="ct-phone" v-model="form.phone" type="tel" dir="ltr" fluid /></div>
            </div>
            <div class="pp-field is-required"><label for="ct-message">{{ $t("your_message") }}</label><Textarea id="ct-message" v-model="form.message" rows="5" maxlength="255" autoResize fluid /></div>
            <Message v-if="feedback" :severity="feedback.type" :closable="false">{{ feedback.text }}</Message>
            <Button type="submit" :label="$t('send_message')" icon="pi pi-send" :loading="sending" size="large" />
          </form>

          <div class="pp-stack">
            <a v-for="(card, i) in CARDS" :key="card.title" :href="card.href" target="_blank" rel="noopener" class="pp-item pp-item--link pp-in" :style="{ '--i': i + 1 }">
              <span class="pp-item__icon pp-item__icon--magenta"><i :class="card.icon" /></span>
              <div class="pp-item__body">
                <p class="pp-item__title">{{ $t(card.title) }}</p>
                <p class="pp-item__meta">{{ $t(card.text) }}</p>
                <p v-if="card.value" class="pp-item__meta font-bold text-[var(--pp-teal-900)]" dir="ltr">{{ card.value }}</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pp-guest {
  min-height: 100dvh;
}
.pp-guest__bar {
  background: rgba(252, 249, 248, 0.9);
  border-bottom: 1px solid rgba(28, 103, 114, 0.08);
}
.pp-contact {
  grid-template-columns: 1fr;
}
.pp-form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.9rem;
}
@media (min-width: 640px) {
  .pp-form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .pp-contact {
    grid-template-columns: 1.3fr 1fr;
    align-items: start;
  }
}
</style>
