import { useAppLangStore } from "@/stores/AppLangStore";

export const isRtlLang = (lang) => lang === "ar";

/** Sets <html dir/lang> (and the stored flag) for the given app language. */
export function applyDirection(lang) {
  const dir = isRtlLang(lang) ? "rtl" : "ltr";
  const html = document.documentElement;
  html.setAttribute("dir", dir);
  html.setAttribute("lang", lang);
  // Older code set dir on <body>; drop it so everything inherits from <html>.
  document.body.removeAttribute("dir");
  try {
    useAppLangStore().setAppRtl(dir === "rtl");
  } catch {
    // Pinia not ready yet (only during the very first call); the store keeps its saved value.
  }
}
