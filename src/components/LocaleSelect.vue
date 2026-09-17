<script setup>
import { computed } from "vue";
import i18n from "../plugins/i18n";
import { useAppLangStore } from "../stores/AppLangStore";

const appLang = useAppLangStore();

// The button shows the language it switches to; main.js updates the page direction.
const nextLang = computed(() => (i18n.global.locale.value === "ar" ? "en" : "ar"));

const changeLocale = () => {
  const lang = nextLang.value;
  i18n.global.locale.value = lang;
  appLang.setAppLang(lang);
};
</script>

<template>
  <Button
    type="button"
    class="locale-switch"
    severity="secondary"
    variant="text"
    icon="pi pi-globe"
    :label="nextLang === 'ar' ? 'العربية' : 'English'"
    :aria-label="nextLang === 'ar' ? 'التبديل إلى العربية' : 'Switch to English'"
    @click="changeLocale" />
</template>
