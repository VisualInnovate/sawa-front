<script setup>
// «إعدادات الموقع»: the academy's contacts, logo and two main colours. Every page reads them (utils/siteBrand):
// public pages, parents' portal, dashboard and printouts; saving applies them at once on this browser too.
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { applySiteBrand } from "@/utils/siteBrand";
import { brandVariables, DEFAULT_BRAND_COLORS, isHex } from "@/utils/brandPalette";
import sawaLogo from "@/assets/img/sawa_logo.svg";

const { t } = useI18n();
const toast = useToast();

const SOCIAL = [
  { key: "facebook", icon: "pi pi-facebook", label: "facebook " },
  { key: "instagram", icon: "pi pi-instagram", label: "Instagram " },
  { key: "twitter", icon: "pi pi-twitter", label: "Twitter " },
  { key: "youtube", icon: "pi pi-youtube", label: "youtube " },
];
const COLOR_FIELDS = [
  { key: "primary", hint: "site.primary_hint" },
  { key: "secondary", hint: "site.secondary_hint" },
];

const loading = ref(true);
const saving = ref(false);
const errors = ref({});
const form = ref({
  name: "", number_1: "", number_2: "", email: "", address: "", location: "", description: "",
  social_links: {}, colors: { ...DEFAULT_BRAND_COLORS },
});
// What the Hex boxes show while typing; the colour changes once a full code is written.
const hexText = ref({ ...DEFAULT_BRAND_COLORS });
const currentLogo = ref(null);
const logoFile = ref(null);
const logoPreview = ref(null);
const removeLogo = ref(false);
const fileInput = ref(null);

const shownLogo = computed(() => logoPreview.value || (removeLogo.value ? null : currentLogo.value) || sawaLogo);
const usingDefaultLogo = computed(() => !logoPreview.value && (removeLogo.value || !currentLogo.value));
// The chosen colours on the preview box only, until they are saved.
const previewVars = computed(() => brandVariables(form.value.colors));

const fill = (s) => {
  form.value = {
    name: s.name ?? "", number_1: s.number_1 ?? "", number_2: s.number_2 ?? "", email: s.email ?? "",
    address: s.address ?? "", location: s.location ?? "", description: s.description ?? "",
    social_links: { ...(s.social_links && !Array.isArray(s.social_links) ? s.social_links : {}) },
    colors: { ...DEFAULT_BRAND_COLORS, ...(s.colors || {}) },
  };
  hexText.value = { ...form.value.colors };
  currentLogo.value = s.logo || null;
};

onMounted(async () => {
  try {
    const { data } = await axios.get("/api/site/settings");
    if (data.settings) fill(data.settings);
  } finally {
    loading.value = false;
  }
});

// ColorPicker (format hex) works without the "#".
const pickerValue = (key) => form.value.colors[key].replace("#", "");
const onPick = (key, value) => {
  const hex = `#${String(value).replace("#", "").toLowerCase()}`;
  if (!isHex(hex)) return;
  form.value.colors[key] = hex;
  hexText.value[key] = hex;
};
const onHexInput = (key, value) => {
  let v = String(value ?? "").trim();
  if (v && !v.startsWith("#")) v = `#${v}`;
  hexText.value[key] = v;
  if (isHex(v)) form.value.colors[key] = v.toLowerCase();
};
const hexInvalid = (key) => !isHex(hexText.value[key]);
const resetColors = () => {
  form.value.colors = { ...DEFAULT_BRAND_COLORS };
  hexText.value = { ...DEFAULT_BRAND_COLORS };
};

const pickLogo = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  logoFile.value = file;
  removeLogo.value = false;
  const reader = new FileReader();
  reader.onload = (e) => (logoPreview.value = e.target.result);
  reader.readAsDataURL(file);
};
const useDefaultLogo = () => {
  logoFile.value = null;
  logoPreview.value = null;
  removeLogo.value = true;
  if (fileInput.value) fileInput.value.value = "";
};

const fieldError = (key) => errors.value?.[key]?.[0];

async function save() {
  if (COLOR_FIELDS.some(({ key }) => hexInvalid(key))) return;
  saving.value = true;
  errors.value = {};
  const data = new FormData();
  for (const key of ["name", "number_1", "number_2", "email", "address", "location", "description"]) data.append(key, form.value[key] ?? "");
  data.append("social_links", JSON.stringify(form.value.social_links));
  data.append("colors[primary]", form.value.colors.primary);
  data.append("colors[secondary]", form.value.colors.secondary);
  if (logoFile.value) data.append("logo", logoFile.value);
  else if (removeLogo.value) data.append("remove_logo", "1");
  try {
    const res = await axios.post("/api/site/settings", data);
    fill(res.data.settings);
    logoFile.value = null;
    logoPreview.value = null;
    removeLogo.value = false;
    // The rest of the site (this browser) follows at once; other visitors get it on their next page load.
    applySiteBrand(res.data.settings);
    toast.add({ severity: "success", summary: t("success_message"), detail: t("site.saved"), life: 2500 });
  } catch (e) {
    errors.value = e.response?.data?.errors ?? {};
    const first = Object.values(errors.value)[0]?.[0];
    toast.add({ severity: "error", summary: t("error"), detail: first || e.response?.data?.message || t("mission_error"), life: 4000 });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="sawa-card p-3">
    <p class="text-xl text-bp-135c65 font-bold mb-2"><i class="pi pi-cog" aria-hidden="true" /> {{ $t("site.title") }}</p>
    <p class="text-color-secondary mb-4">{{ $t("site.lead") }}</p>

    <div v-if="loading" class="flex justify-center p-5"><i class="pi pi-spin pi-spinner text-2xl" /></div>
    <form v-else class="ss-grid" novalidate @submit.prevent="save">
      <!-- Contacts -->
      <section class="ss-card ss-wide">
        <h2 class="ss-title"><i class="pi pi-phone" /> {{ $t("site.contact") }}</h2>
        <div class="ss-fields">
          <div class="ss-field">
            <label for="ss-name">{{ $t("site.name") }} <span class="text-red-500">*</span></label>
            <InputText id="ss-name" v-model="form.name" :invalid="!!fieldError('name')" fluid />
            <small v-if="fieldError('name')" class="text-red-500">{{ fieldError("name") }}</small>
          </div>
          <div class="ss-field">
            <label for="ss-email">{{ $t("site.email") }} <span class="text-red-500">*</span></label>
            <InputText id="ss-email" v-model="form.email" type="email" dir="ltr" :invalid="!!fieldError('email')" fluid />
            <small v-if="fieldError('email')" class="text-red-500">{{ fieldError("email") }}</small>
          </div>
          <div class="ss-field">
            <label for="ss-phone1">{{ $t("site.phone1") }} <span class="text-red-500">*</span></label>
            <InputText id="ss-phone1" v-model="form.number_1" type="tel" dir="ltr" :invalid="!!fieldError('number_1')" fluid />
            <small v-if="fieldError('number_1')" class="text-red-500">{{ fieldError("number_1") }}</small>
            <small v-else class="text-color-secondary">{{ $t("site.phone1_hint") }}</small>
          </div>
          <div class="ss-field">
            <label for="ss-phone2">{{ $t("site.phone2") }}</label>
            <InputText id="ss-phone2" v-model="form.number_2" type="tel" dir="ltr" :invalid="!!fieldError('number_2')" fluid />
            <small v-if="fieldError('number_2')" class="text-red-500">{{ fieldError("number_2") }}</small>
          </div>
          <div class="ss-field">
            <label for="ss-address">{{ $t("site.address") }} <span class="text-red-500">*</span></label>
            <InputText id="ss-address" v-model="form.address" :invalid="!!fieldError('address')" fluid />
            <small v-if="fieldError('address')" class="text-red-500">{{ fieldError("address") }}</small>
          </div>
          <div class="ss-field">
            <label for="ss-location">{{ $t("site.location") }}</label>
            <InputText id="ss-location" v-model="form.location" dir="ltr" placeholder="https://maps.google.com/..." :invalid="!!fieldError('location')" fluid />
            <small v-if="fieldError('location')" class="text-red-500">{{ fieldError("location") }}</small>
            <small v-else class="text-color-secondary">{{ $t("site.location_hint") }}</small>
          </div>
          <div class="ss-field ss-span">
            <label for="ss-desc">{{ $t("site.description") }}</label>
            <Textarea id="ss-desc" v-model="form.description" rows="2" auto-resize fluid />
          </div>
        </div>

        <h3 class="ss-subtitle">{{ $t("site.social") }}</h3>
        <div class="ss-fields">
          <div v-for="item in SOCIAL" :key="item.key" class="ss-field">
            <label :for="'ss-' + item.key"><i :class="item.icon" /> {{ $t(item.label) }}</label>
            <InputText :id="'ss-' + item.key" v-model="form.social_links[item.key]" dir="ltr" placeholder="https://" fluid />
          </div>
        </div>
      </section>

      <!-- Logo -->
      <section class="ss-card">
        <h2 class="ss-title"><i class="pi pi-image" /> {{ $t("site.logo") }}</h2>
        <p class="text-color-secondary text-sm m-0">{{ $t("site.logo_hint") }}</p>
        <button type="button" class="ss-logo" @click="fileInput?.click()">
          <img :src="shownLogo" alt="" />
        </button>
        <small v-if="usingDefaultLogo" class="text-color-secondary text-center">{{ $t("site.logo_using_default") }}</small>
        <small v-if="fieldError('logo')" class="text-red-500">{{ fieldError("logo") }}</small>
        <input ref="fileInput" type="file" accept="image/*" hidden @change="pickLogo" />
        <div class="flex flex-wrap gap-2 justify-center">
          <Button type="button" icon="pi pi-upload" :label="$t('site.logo_pick')" severity="secondary" outlined @click="fileInput?.click()" />
          <Button v-if="!usingDefaultLogo" type="button" icon="pi pi-replay" :label="$t('site.logo_default')" severity="secondary" text @click="useDefaultLogo" />
        </div>
      </section>

      <!-- Colours -->
      <section class="ss-card">
        <h2 class="ss-title"><i class="pi pi-palette" /> {{ $t("site.colors") }}</h2>
        <p class="text-color-secondary text-sm m-0">{{ $t("site.colors_hint") }}</p>
        <div v-for="field in COLOR_FIELDS" :key="field.key" class="ss-color">
          <ColorPicker :model-value="pickerValue(field.key)" format="hex" :aria-label="$t('site.' + field.key)" @update:model-value="onPick(field.key, $event)" />
          <div class="ss-field flex-1">
            <label :for="'ss-hex-' + field.key">{{ $t("site." + field.key) }}</label>
            <InputText
              :id="'ss-hex-' + field.key"
              :model-value="hexText[field.key]"
              dir="ltr"
              maxlength="7"
              class="ss-hex"
              :invalid="hexInvalid(field.key)"
              @update:model-value="onHexInput(field.key, $event)"
            />
            <small v-if="hexInvalid(field.key)" class="text-red-500">{{ $t("site.hex_invalid") }}</small>
            <small v-else class="text-color-secondary">{{ $t(field.hint) }}</small>
          </div>
        </div>
        <Button type="button" icon="pi pi-replay" :label="$t('site.reset_colors')" severity="secondary" text class="self-start" @click="resetColors" />

        <div class="ss-preview" :style="previewVars">
          <p class="ss-preview__label">{{ $t("site.preview") }}</p>
          <div class="ss-preview__bar">
            <img :src="shownLogo" alt="" />
            <span>{{ form.name || "Sawa" }}</span>
          </div>
          <div class="flex flex-wrap gap-2 p-3">
            <span class="ss-preview__btn ss-preview__btn--primary">{{ $t("site.preview_button") }}</span>
            <span class="ss-preview__btn ss-preview__btn--accent">{{ $t("site.preview_accent") }}</span>
            <span class="ss-preview__chip">{{ $t("site.primary") }}</span>
          </div>
          <small class="text-color-secondary px-3 pb-2 block">{{ $t("site.unsaved_preview") }}</small>
        </div>
      </section>

      <div class="ss-wide flex justify-end">
        <Button v-can="'settings edit'" type="submit" icon="pi pi-save" :label="$t('save_changes')" :loading="saving" size="large" />
      </div>
    </form>
    <Toast />
  </div>
</template>

<style scoped>
.ss-grid { display: grid; gap: 1rem; grid-template-columns: 1fr; }
@media (min-width: 1024px) { .ss-grid { grid-template-columns: 1fr 1fr; } .ss-wide { grid-column: 1 / -1; } }
.ss-card { display: flex; flex-direction: column; gap: .8rem; padding: 1rem 1.1rem; border: 1px solid #e2e8f0; border-radius: 12px; background: #fff; }
.ss-title { margin: 0; font-size: 1.05rem; font-weight: 800; color: rgb(var(--bp-135c65)); display: flex; align-items: center; gap: .5rem; }
.ss-subtitle { margin: .4rem 0 0; font-size: .95rem; font-weight: 700; color: #334155; }
.ss-fields { display: grid; gap: .9rem; grid-template-columns: 1fr; }
@media (min-width: 640px) { .ss-fields { grid-template-columns: 1fr 1fr; } .ss-span { grid-column: 1 / -1; } }
.ss-field { display: flex; flex-direction: column; gap: .35rem; }
.ss-field > label { font-weight: 600; font-size: .9rem; }
.ss-logo { align-self: center; width: 180px; height: 180px; padding: .75rem; border: 2px dashed #cbd5e1; border-radius: 16px; background: #f8fafc; cursor: pointer; display: grid; place-items: center; }
.ss-logo:hover { border-color: rgb(var(--bp-135c65)); }
.ss-logo img { max-width: 100%; max-height: 100%; object-fit: contain; }
.ss-color { display: flex; align-items: flex-start; gap: .9rem; }
.ss-color :deep(.p-colorpicker-preview) { width: 3rem; height: 3rem; border-radius: 12px; margin-top: 1.6rem; }
.ss-hex { font-family: ui-monospace, Consolas, monospace; text-transform: lowercase; max-width: 11rem; }
.ss-preview { border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: rgb(var(--bp-f0f9fa, 240 249 250)); }
.ss-preview__label { margin: 0; padding: .4rem .75rem; font-size: .75rem; font-weight: 700; color: #64748b; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
.ss-preview__bar { display: flex; align-items: center; gap: .6rem; padding: .6rem .9rem; background: rgb(var(--bp-135c65)); color: #fff; font-weight: 700; }
.ss-preview__bar img { height: 2rem; width: auto; background: #fff; border-radius: 8px; padding: 2px; }
.ss-preview__btn { padding: .45rem .9rem; border-radius: 999px; color: #fff; font-weight: 700; font-size: .85rem; }
.ss-preview__btn--primary { background: rgb(var(--bp-135c65)); }
.ss-preview__btn--accent { background: rgb(var(--bs-b21553)); }
.ss-preview__chip { padding: .4rem .8rem; border-radius: 999px; font-size: .85rem; font-weight: 700; color: rgb(var(--bp-135c65)); background: rgb(var(--bp-135c65) / .12); }
</style>
