// «إعدادات الموقع» for every page: the logo, the contacts and the brand colours, read once from the public endpoint
// (no sign-in) and kept in localStorage so the next visit starts with them before the request returns.
// Pages use `siteBrand` (reactive) and the helpers below instead of hard-coding the logo, a phone or an e-mail.
import { reactive } from "vue";
import axios from "axios";
import { brandVariables, DEFAULT_BRAND_COLORS, isHex, shiftShade, PRIMARY_SHADES } from "@/utils/brandPalette";
import sawaLogo from "@/assets/img/sawa_logo.svg";

const CACHE_KEY = "sawaSiteBrand";

const readCache = () => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "null") || {};
  } catch {
    return {};
  }
};

export const siteBrand = reactive({ settings: readCache(), loaded: false });

/** The uploaded logo, or the page's own default (the dashboard SVG unless another is given). */
export const siteLogo = (fallback = sawaLogo) => siteBrand.settings.logo || fallback;

export const brandColors = () => ({ ...DEFAULT_BRAND_COLORS, ...(siteBrand.settings.colors || {}) });

/** Current hex of a default brand shade, for places CSS variables can't reach (charts, print windows). */
export const brandHex = (shade) => {
  const colors = brandColors();
  const family = PRIMARY_SHADES.includes(shade.toLowerCase()) ? "primary" : "secondary";
  const base = isHex(colors[family]) ? colors[family].toLowerCase() : DEFAULT_BRAND_COLORS[family];
  if (base === DEFAULT_BRAND_COLORS[family]) return shade;
  return "#" + shiftShade(shade.toLowerCase(), DEFAULT_BRAND_COLORS[family], base).map((v) => v.toString(16).padStart(2, "0")).join("");
};

const digits = (phone) => String(phone || "").replace(/[^\d+]/g, "");

// wa.me wants the international number without "+" or "00"; a local number (one leading 0) is taken as Jordanian,
// where the academy is.
const whatsappNumber = (phone) => {
  const d = digits(phone).replace(/^\+/, "").replace(/^00/, "");
  return /^0\d/.test(d) ? `962${d.slice(1)}` : d;
};

/** Contacts as the pages show them, from the settings (empty strings when not set). */
export const siteContacts = () => {
  const s = siteBrand.settings;
  const phone1 = (s.number_1 || "").trim();
  const phone2 = (s.number_2 || "").trim();
  return {
    name: s.name || "",
    description: s.description || "",
    address: (s.address || "").trim(),
    email: (s.email || "").trim(),
    phones: [phone1, phone2].filter(Boolean),
    phone1,
    whatsappHref: phone1 ? `https://wa.me/${whatsappNumber(phone1)}` : "",
    telHref: (phone) => (phone ? `tel:${digits(phone)}` : ""),
    mapHref: s.location || (s.address ? `https://maps.google.com/?q=${encodeURIComponent(s.address)}` : ""),
    social: s.social_links && !Array.isArray(s.social_links) ? s.social_links : {},
  };
};

const applyColors = () => {
  const root = document.documentElement;
  const vars = brandVariables(siteBrand.settings.colors || {});
  // Default colours: drop the overrides and let styles/brand-colors.css speak.
  const isDefault = Object.entries(brandColors()).every(([k, v]) => String(v).toLowerCase() === DEFAULT_BRAND_COLORS[k]);
  for (const [name, value] of Object.entries(vars)) {
    if (isDefault) root.style.removeProperty(name);
    else root.style.setProperty(name, value);
  }
};

const applyFavicon = () => {
  const link = document.querySelector("link[rel~='icon']");
  if (!link) return;
  link.dataset.defaultHref ??= link.getAttribute("href");
  const logo = siteBrand.settings.logo;
  link.setAttribute("href", logo || link.dataset.defaultHref);
  if (logo) link.removeAttribute("type");
};

/** Puts the settings on the page: colours on <html>, the logo as the tab icon. */
export const applySiteBrand = (settings) => {
  if (settings) {
    siteBrand.settings = settings;
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(settings));
    } catch {
      // Private mode: the settings still apply for this visit.
    }
  }
  applyColors();
  applyFavicon();
};

export const loadSiteBrand = async () => {
  try {
    const { data } = await axios.get("/api/site/public-settings", { skipAuth: true, skipAuthRedirect: true });
    if (data?.settings) applySiteBrand(data.settings);
  } catch {
    // Keep the cached / default look when the server can't be reached.
  } finally {
    siteBrand.loaded = true;
  }
};
