<script setup>
// «تواصل معنا»: a welcome band with the quick ways to reach the academy, a message form, and the phones, WhatsApp,
// e-mail and address. Visitors see it in its own frame; a signed-in parent sees it inside the portal, with the form
// filled from the account and the way to «ملاحظاتي» (notes, complaints and suggestions to management).
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import LocaleSelect from "@/components/LocaleSelect.vue";
import { useParentStore } from "@/stores/ParentStore";
import { sendContactMessage, contactErrorText } from "@/utils/contact";
import logo from "@/views/frontend/views/main/images/logo.png";
import { siteContacts } from "@/utils/siteBrand";

const { t } = useI18n();
const parentStore = useParentStore();
const signedIn = computed(() => parentStore.isAuthenticated);

const blank = () => {
  const user = signedIn.value ? parentStore.user : {};
  return { fname: user.fname ?? "", lname: user.lname ?? "", email: user.email ?? "", phone: user.phone ?? "", message: "" };
};
const form = ref(blank());
const sending = ref(false);
const result = ref(null);
// A parent whose account has all four details only writes the message; «تعديل» shows the fields.
const detailsComplete = computed(() => ["fname", "lname", "email", "phone"].every((key) => String(form.value[key] ?? "").trim()));
const editDetails = ref(false);
const showDetails = computed(() => !signedIn.value || editDetails.value || !detailsComplete.value);

onMounted(async () => {
  if (!signedIn.value) return;
  await parentStore.getUser().catch(() => {});
  const message = form.value.message;
  form.value = { ...blank(), message };
});

async function submit() {
  if (sending.value) return;
  result.value = null;
  sending.value = true;
  try {
    await sendContactMessage({ firstName: form.value.fname, lastName: form.value.lname, email: form.value.email, phone: form.value.phone, message: form.value.message });
    result.value = { type: "success", text: t("message_sent") };
    form.value = blank();
    editDetails.value = false;
  } catch (error) {
    result.value = { type: "error", text: contactErrorText(error, t) };
    editDetails.value = true;
  } finally {
    sending.value = false;
  }
}

// Phones, WhatsApp, e-mail and address from «إعدادات الموقع».
const contacts = computed(() => siteContacts());
const quick = computed(() => {
  const c = contacts.value;
  return [
    c.phone1 && { key: "call", icon: "pi pi-phone", label: "ctp.call", href: c.telHref(c.phone1) },
    c.whatsappHref && { key: "whatsapp", icon: "pi pi-whatsapp", label: "ctp.whatsapp", href: c.whatsappHref, blank: true },
    c.email && { key: "email", icon: "pi pi-envelope", label: "ctp.email", href: `mailto:${c.email}` },
  ].filter(Boolean);
});
const ways = computed(() => {
  const c = contacts.value;
  return [
    c.phones.length && { key: "phone", icon: "pi pi-phone", tone: "teal", title: "ctp.call", hint: "happy_to_help", values: c.phones.map((p) => ({ text: p, href: c.telHref(p) })), ltr: true },
    c.whatsappHref && { key: "whatsapp", icon: "pi pi-whatsapp", tone: "green", title: "ctp.whatsapp", hint: "pp.whatsapp_hint", values: [{ text: c.phone1, href: c.whatsappHref, blank: true }], ltr: true },
    c.email && { key: "email", icon: "pi pi-envelope", tone: "magenta", title: "ctp.email", hint: "support_hint", values: [{ text: c.email, href: `mailto:${c.email}` }], ltr: true },
  ].filter(Boolean);
});
</script>

<template>
  <div :class="signedIn ? '' : 'pp-shell ct-guest'">
    <header v-if="!signedIn" class="ct-guest__bar">
      <div class="pp-container pp-row pp-between" style="min-height: 72px">
        <a href="/"><img :src="$siteLogo(logo)" alt="Sawa" style="height: 44px" /></a>
        <div class="pp-row">
          <LocaleSelect />
          <router-link :to="{ name: 'parentLogin' }" class="pp-btn pp-btn--soft pp-btn--sm">{{ $t("sign_in") }}</router-link>
        </div>
      </div>
    </header>

    <div :class="signedIn ? '' : 'pp-container'">
      <div class="pp-page ct">
        <!-- ===== Welcome band ===== -->
        <section class="ct-hero pp-in">
          <span class="ct-hero__blob ct-hero__blob--a" aria-hidden="true" />
          <span class="ct-hero__blob ct-hero__blob--b" aria-hidden="true" />
          <div class="ct-hero__body">
            <p class="ct-hero__kicker"><i class="pi pi-comments" aria-hidden="true" /> {{ $t("contact_us") }}</p>
            <h1 class="ct-hero__title">{{ $t("ctp.hero_title") }}</h1>
            <p class="ct-hero__lead">{{ $t("ctp.hero_lead") }}</p>
            <div v-if="quick.length" class="ct-hero__actions">
              <a v-for="q in quick" :key="q.key" :href="q.href" :target="q.blank ? '_blank' : undefined" rel="noopener" class="ct-quick" :class="`ct-quick--${q.key}`">
                <i :class="q.icon" aria-hidden="true" /> {{ $t(q.label) }}
              </a>
            </div>
          </div>
          <div class="ct-hero__badge" aria-hidden="true"><i class="pi pi-heart-fill" /></div>
        </section>

        <!-- ===== A parent's notes go to «ملاحظاتي» ===== -->
        <router-link v-if="signedIn" :to="{ name: 'parent-feedback' }" class="ct-feedback pp-in" style="--i: 1">
          <span class="ct-feedback__icon"><i class="pi pi-comment" aria-hidden="true" /></span>
          <span class="ct-feedback__body">
            <strong>{{ $t("ctp.feedback_title") }}</strong>
            <small>{{ $t("ctp.feedback_lead") }}</small>
          </span>
          <span class="pp-btn pp-btn--magenta ct-feedback__btn">
            <i class="pi pi-pencil" aria-hidden="true" /> {{ $t("ctp.feedback_btn") }}
          </span>
        </router-link>

        <div class="ct-grid">
          <!-- ===== The message ===== -->
          <form class="pp-card ct-form pp-in" style="--i: 2" novalidate data-no-request-spinner @submit.prevent="submit">
            <div class="ct-form__head">
              <span class="ct-form__icon"><i class="pi pi-send" aria-hidden="true" /></span>
              <div>
                <h2 class="pp-h2">{{ $t("ctp.form_title") }}</h2>
                <p class="pp-muted">{{ $t("ctp.form_lead") }}</p>
              </div>
            </div>

            <div v-if="!showDetails" class="ct-replyto">
              <i class="pi pi-user" aria-hidden="true" />
              <span>
                {{ $t("ctp.reply_to") }} <strong>{{ form.fname }} {{ form.lname }}</strong> ·
                <span dir="ltr">{{ form.phone }}</span> · <span dir="ltr">{{ form.email }}</span>
              </span>
              <button type="button" class="pp-link" @click="editDetails = true">{{ $t("ctp.edit_details") }}</button>
            </div>
            <div v-else class="ct-fields">
              <div class="pp-field is-required"><label for="ct-fname">{{ $t("first_name") }}</label><InputText id="ct-fname" v-model="form.fname" autocomplete="given-name" fluid /></div>
              <div class="pp-field is-required"><label for="ct-lname">{{ $t("family_name") }}</label><InputText id="ct-lname" v-model="form.lname" autocomplete="family-name" fluid /></div>
              <div class="pp-field is-required"><label for="ct-phone">{{ $t("Mobile_number") }}</label><InputText id="ct-phone" v-model="form.phone" type="tel" dir="ltr" autocomplete="tel" placeholder="07xxxxxxxx" fluid /></div>
              <div class="pp-field is-required"><label for="ct-email">{{ $t("email") }}</label><InputText id="ct-email" v-model="form.email" type="email" dir="ltr" autocomplete="email" placeholder="example@mail.com" fluid /></div>
            </div>

            <div class="pp-field is-required">
              <label for="ct-message">{{ $t("your_message") }}</label>
              <Textarea id="ct-message" v-model="form.message" rows="5" maxlength="255" autoResize :placeholder="$t('ctp.message_placeholder')" fluid />
              <small class="ct-count" dir="ltr">{{ form.message.length }} / 255</small>
            </div>
            <Message v-if="result" :severity="result.type" :closable="false">{{ result.text }}</Message>
            <Button type="submit" :label="$t('send_message')" icon="pi pi-send" :loading="sending" size="large" class="ct-submit" />
          </form>

          <!-- ===== The ways to reach us ===== -->
          <aside class="ct-side">
            <h2 class="pp-h3 ct-side__title">{{ $t("ctp.ways") }}</h2>
            <div v-for="(way, i) in ways" :key="way.key" class="ct-way pp-in" :class="`ct-way--${way.tone}`" :style="{ '--i': i + 3 }">
              <span class="ct-way__icon"><i :class="way.icon" aria-hidden="true" /></span>
              <div class="ct-way__body">
                <p class="ct-way__title">{{ $t(way.title) }}</p>
                <p class="ct-way__hint">{{ $t(way.hint) }}</p>
                <div class="ct-way__values">
                  <a v-for="v in way.values" :key="v.text" :href="v.href" :target="v.blank ? '_blank' : undefined" rel="noopener" :dir="way.ltr ? 'ltr' : undefined">{{ v.text }}</a>
                </div>
              </div>
            </div>

            <div v-if="contacts.address" class="ct-map pp-in" :style="{ '--i': ways.length + 3 }">
              <div class="ct-map__pin" aria-hidden="true"><i class="pi pi-map-marker" /></div>
              <p class="ct-way__title">{{ $t("ctp.address") }}</p>
              <p class="ct-map__text">{{ contacts.address }}</p>
              <a v-if="contacts.mapHref" :href="contacts.mapHref" target="_blank" rel="noopener" class="pp-btn pp-btn--soft pp-btn--sm">
                <i class="pi pi-directions" aria-hidden="true" /> {{ $t("ctp.open_map") }}
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ct-guest {
  min-height: 100dvh;
}
.ct-guest__bar {
  background: rgba(252, 249, 248, 0.9);
  border-bottom: 1px solid rgb(var(--bp-1c6772) / 0.08);
}
.ct {
  display: grid;
  gap: 1.25rem;
}

/* ---- welcome band ---- */
.ct-hero {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: clamp(1.5rem, 4vw, 2.75rem);
  border-radius: 28px;
  color: #fff;
  background: linear-gradient(135deg, var(--pp-teal-900), var(--pp-teal) 70%);
  box-shadow: var(--pp-shadow-lg);
}
.ct-hero__blob {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.ct-hero__blob--a {
  width: 260px;
  height: 260px;
  inset-inline-end: -80px;
  top: -110px;
  background: rgb(255 255 255 / 0.08);
}
.ct-hero__blob--b {
  width: 180px;
  height: 180px;
  inset-inline-start: 35%;
  bottom: -120px;
  background: var(--pp-magenta);
  opacity: 0.35;
  filter: blur(30px);
}
.ct-hero__body {
  position: relative;
  max-width: 640px;
}
.ct-hero__kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0 0 0.6rem;
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.14);
  color: var(--pp-cyan);
  font-weight: 800;
  font-size: 0.85rem;
}
.ct-hero__title {
  margin: 0;
  font-size: clamp(1.7rem, 3.6vw, 2.6rem);
  font-weight: 900;
  line-height: 1.3;
}
.ct-hero__lead {
  margin: 0.6rem 0 0;
  color: rgb(255 255 255 / 0.85);
  font-size: clamp(0.95rem, 1.6vw, 1.1rem);
  line-height: 1.9;
}
.ct-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 1.25rem;
}
.ct-quick {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.25rem;
  border-radius: 999px;
  background: #fff;
  color: var(--pp-teal-900);
  font-weight: 800;
  text-decoration: none;
  transition: transform 0.2s var(--pp-spring), box-shadow 0.2s;
}
.ct-quick:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -10px rgb(0 0 0 / 0.4);
}
.ct-quick--whatsapp {
  background: #25d366;
  color: #fff;
}
.ct-quick--email {
  background: rgb(255 255 255 / 0.14);
  color: #fff;
  border: 1px solid rgb(255 255 255 / 0.35);
}
.ct-hero__badge {
  position: relative;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 120px;
  height: 120px;
  border-radius: 36px;
  background: rgb(255 255 255 / 0.12);
  border: 1px solid rgb(255 255 255 / 0.2);
  transform: rotate(-8deg);
  font-size: 3rem;
  color: var(--pp-cyan);
}

/* ---- parent notes ---- */
.ct-feedback {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: var(--pp-radius);
  background: var(--pp-magenta-50);
  border: 1px solid var(--pp-magenta-100);
  color: var(--pp-ink);
  text-decoration: none;
  transition: box-shadow 0.2s, transform 0.2s;
}
.ct-feedback:hover {
  box-shadow: var(--pp-shadow);
  transform: translateY(-1px);
}
.ct-feedback__icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: var(--pp-magenta);
  color: #fff;
  font-size: 1.3rem;
}
.ct-feedback__body {
  display: grid;
  gap: 0.15rem;
  flex: 1;
  min-width: 0;
}
.ct-feedback__body strong {
  font-size: 1.05rem;
  color: var(--pp-magenta);
}
.ct-feedback__body small {
  color: var(--pp-text);
  font-size: 0.9rem;
}
.ct-feedback__btn {
  flex-shrink: 0;
}

/* ---- form + side ---- */
.ct-grid {
  display: grid;
  gap: 1.25rem;
}
.ct-form {
  display: grid;
  gap: 1rem;
  padding: clamp(1.1rem, 3vw, 1.75rem);
  align-content: start;
}
.ct-form__head {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}
.ct-form__head .pp-h2 {
  margin: 0;
}
.ct-form__head p {
  margin: 0.15rem 0 0;
}
.ct-form__icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 15px;
  background: var(--pp-teal-50);
  color: var(--pp-teal);
  font-size: 1.2rem;
}
.ct-fields {
  display: grid;
  gap: 0.9rem;
}
.ct-replyto {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: var(--pp-radius-sm);
  background: var(--pp-sand);
  color: var(--pp-text);
  font-size: 0.92rem;
}
.ct-replyto > .pi {
  color: var(--pp-teal);
}
.ct-replyto > span {
  flex: 1;
  min-width: 0;
}
.ct-replyto button {
  border: 0;
  background: none;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}
.ct-count {
  justify-self: end;
  color: var(--pp-muted);
  font-size: 0.78rem;
}
.ct-submit {
  width: 100%;
}
.ct-side {
  display: grid;
  gap: 0.75rem;
  align-content: start;
}
.ct-side__title {
  margin: 0.25rem 0 0;
}
.ct-way {
  --tone: var(--pp-teal);
  --tone-50: var(--pp-teal-50);
  display: flex;
  gap: 0.9rem;
  padding: 1rem 1.1rem;
  border-radius: var(--pp-radius);
  background: #fff;
  border: 1px solid rgb(var(--bp-1c6772) / 0.08);
  box-shadow: var(--pp-shadow);
  min-width: 0;
}
.ct-way--green {
  --tone: #128c4a;
  --tone-50: #e6f8ee;
}
.ct-way--magenta {
  --tone: var(--pp-magenta);
  --tone-50: var(--pp-magenta-50);
}
.ct-way__icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: var(--tone-50);
  color: var(--tone);
  font-size: 1.15rem;
}
.ct-way__body {
  min-width: 0;
  flex: 1;
}
.ct-way__title {
  margin: 0;
  font-weight: 900;
  color: var(--pp-ink);
}
.ct-way__hint {
  margin: 0.1rem 0 0.35rem;
  color: var(--pp-muted);
  font-size: 0.85rem;
}
.ct-way__values {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.9rem;
}
.ct-way__values a {
  color: var(--tone);
  font-weight: 800;
  text-decoration: none;
  overflow-wrap: anywhere;
}
.ct-way__values a:hover {
  text-decoration: underline;
}
.ct-map {
  position: relative;
  overflow: hidden;
  display: grid;
  gap: 0.4rem;
  justify-items: start;
  padding: 1.1rem;
  border-radius: var(--pp-radius);
  background:
    radial-gradient(circle at 85% 20%, rgb(var(--bp-1c6772) / 0.1) 0 40px, transparent 41px),
    repeating-linear-gradient(45deg, transparent 0 22px, rgb(var(--bp-1c6772) / 0.04) 22px 23px),
    var(--pp-cyan-50);
  border: 1px solid rgb(var(--bp-1c6772) / 0.1);
}
.ct-map__pin {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 50% 50% 50% 4px;
  transform: rotate(-45deg);
  background: var(--pp-magenta);
  color: #fff;
  margin-bottom: 0.25rem;
}
.ct-map__pin .pi {
  transform: rotate(45deg);
  font-size: 1.1rem;
}
.ct-map__text {
  margin: 0 0 0.35rem;
  color: var(--pp-text);
  line-height: 1.8;
}

@media (min-width: 640px) {
  .ct-fields {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .ct-grid {
    grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr);
    align-items: start;
  }
}
@media (max-width: 639px) {
  .ct-hero__badge {
    display: none;
  }
  .ct-quick {
    flex: 1;
    justify-content: center;
  }
  .ct-feedback {
    flex-wrap: wrap;
  }
  .ct-feedback__btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
