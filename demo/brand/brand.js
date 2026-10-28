// تخصيص الديمو (الشعار والألوان الأساسية): مشترك بين الشِّل والإطارَين.
// الحالة في localStorage (الأصل مشترك)، فيقرأها كل إطار عند الإقلاع ويلتقط تغييرها عبر حدث storage.
//
// الألوان: النظام الحقيقي مبنيّ على عائلتَين من الألوان — التركوازي (#135c65 ومشتقاته، وهو كذلك لون PrimeVue
// الأساسي) والأرجواني (#b21553 ومشتقاته في بوابة الأهل). بدل تعداد كل درجة، نعتبر كل لون قريب من تدرّج العائلة
// (hue) عضواً فيها ونعيد رسمه بتدرّج اللون الجديد مع الحفاظ على إضاءته (الفاتح يبقى فاتحاً والداكن داكناً)،
// بحيث يصبح اللون الأساسي نفسه هو اللون الذي اختاره المستخدم تماماً.

export const BRAND_KEY = "demo:brand";
export const DEFAULT_BRAND = Object.freeze({ logo: null, primary: "#135c65", secondary: "#b21553" });

export function readBrand() {
  try {
    const raw = localStorage.getItem(BRAND_KEY);
    const b = raw ? JSON.parse(raw) : {};
    return { ...DEFAULT_BRAND, ...(b && typeof b === "object" ? b : {}) };
  } catch {
    return { ...DEFAULT_BRAND };
  }
}

export function writeBrand(brand) {
  const b = { ...DEFAULT_BRAND, ...brand };
  try {
    if (isDefaultBrand(b)) localStorage.removeItem(BRAND_KEY);
    else localStorage.setItem(BRAND_KEY, JSON.stringify(b));
  } catch (e) {
    console.warn("[demo] تعذّر حفظ التخصيص (المساحة ممتلئة؟)", e);
  }
  return b;
}

export const sameColor = (a, b) => normalizeHex(a) === normalizeHex(b);
export const hasCustomColors = (b) => !sameColor(b.primary, DEFAULT_BRAND.primary) || !sameColor(b.secondary, DEFAULT_BRAND.secondary);
export const isDefaultBrand = (b) => !b.logo && !hasCustomColors(b);

export function normalizeHex(v) {
  const c = parseColor(v ?? "");
  return c ? toHex(c) : "";
}

// ---------- الشعار ----------
/** صور الشعار في النظام: sawa_logo.svg (لوحة التحكم والتقارير) وlogo.png (بوابة الأهل والموقع)، باسمها المبصوم بعد البناء. */
export const isLogoSrc = (src) => /(?:^|\/)(?:sawa_logo|logo)[^/]*\.(?:svg|png)(?:[?#].*)?$/i.test(src ?? "");

/** يحوّل ملف صورة إلى data URL صغير يصلح للتخزين: SVG كما هو، وغيره يُصغَّر إلى 640px كحدّ أقصى مع الشفافية. */
export async function fileToLogo(file) {
  if (file.type === "image/svg+xml") {
    const text = await file.text();
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(text)))}`;
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error("الصورة غير مقروءة")); i.src = url; });
    const max = 640;
    const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(img.naturalWidth * k));
    c.height = Math.max(1, Math.round(img.naturalHeight * k));
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}

// ---------- حساب الألوان ----------
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/** #rgb / #rgba / #rrggbb / #rrggbbaa / rgb() / rgba() → {r,g,b,a} أو null. */
export function parseColor(str) {
  const s = String(str).trim();
  let m = /^#([0-9a-f]{3,8})$/i.exec(s);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h].map((ch) => ch + ch).join("");
    if (h.length !== 6 && h.length !== 8) return null;
    const n = parseInt(h.slice(0, 6), 16);
    const a = h.length === 8 ? parseInt(h.slice(6), 16) / 255 : 1;
    return { r: n >> 16, g: (n >> 8) & 255, b: n & 255, a };
  }
  m = /^rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*(?:[,/]\s*([\d.]+)(%?)\s*)?\)$/i.exec(s);
  if (m) {
    const a = m[4] === undefined ? 1 : m[5] ? Number(m[4]) / 100 : Number(m[4]);
    return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]), a: clamp(a, 0, 1) };
  }
  return null;
}

export function toHex({ r, g, b }) {
  return "#" + [r, g, b].map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, "0")).join("");
}
export function toCss(c) {
  return c.a < 1 ? `rgba(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)}, ${+c.a.toFixed(3)})` : toHex(c);
}

export function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  return { h, s, l, chroma: d };
}

export function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}

const hueDist = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };

/** عائلتا ألوان النظام: التركوازي (الأساسي) والأرجواني (الثانوي)، مع سماحية التدرّج حول كل منهما. */
const FAMILIES = [
  { key: "primary", base: "#135c65", tol: 12 },
  { key: "secondary", base: "#b21553", tol: 16 },
].map((f) => ({ ...f, hsl: rgbToHsl(parseColor(f.base)) }));

function familyOf(c) {
  const o = rgbToHsl(c);
  // الرماديات والألوان شبه المحايدة ليست من أي عائلة (حتى لا نلوّن الخلفيات والحدود الرمادية).
  if (o.chroma < 0.03 || o.s < 0.18) return null;
  return FAMILIES.find((f) => hueDist(o.h, f.hsl.h) <= f.tol) ?? null;
}

/** يعيد رسم لون من عائلة إلى تدرّج اللون المستهدف: اللون الأساسي للعائلة يصبح المستهدف تماماً، والباقي يحافظ على بُعده عنه. */
function shift(c, fam, targetHex) {
  const t = rgbToHsl(parseColor(targetHex));
  const b = fam.hsl, o = rgbToHsl(c);
  const h = (t.h + (o.h - b.h) + 720) % 360;
  const s = clamp(o.s * (b.s > 0 ? t.s / b.s : 1), 0, 1);
  // الإضاءة: تحويل خطي بقطعتَين يُبقي الأبيض أبيضَ والأسود أسودَ ويجعل إضاءة الأساس = إضاءة المستهدف.
  const l = o.l <= b.l ? o.l * (t.l / b.l) : 1 - (1 - o.l) * ((1 - t.l) / (1 - b.l));
  return { ...hslToRgb(h, s, clamp(l, 0, 1)), a: c.a };
}

const COLOR_RE = /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b|rgba?\(\s*[\d.]+\s*[, ]\s*[\d.]+\s*[, ]\s*[\d.]+\s*(?:[,/]\s*[\d.]+%?\s*)?\)/gi;

/** هل في قيمة CSS هذه لون من عائلتَي النظام؟ */
export function containsBrandColor(value) {
  if (!value || (value.indexOf("#") < 0 && value.indexOf("rgb") < 0)) return false;
  COLOR_RE.lastIndex = 0;
  let m;
  while ((m = COLOR_RE.exec(value))) {
    const c = parseColor(m[0]);
    if (c && familyOf(c)) return true;
  }
  return false;
}

/** يبدّل ألوان العائلتَين داخل قيمة CSS (قد تحوي عدة ألوان: gradient، box-shadow…) إلى ألوان التخصيص. */
export function remapColor(value, brand) {
  if (!value || (value.indexOf("#") < 0 && value.indexOf("rgb") < 0)) return value;
  return value.replace(COLOR_RE, (tok) => {
    const c = parseColor(tok);
    if (!c) return tok;
    const fam = familyOf(c);
    if (!fam) return tok;
    const target = brand[fam.key];
    if (!target || !parseColor(target) || sameColor(target, fam.base)) return tok;
    return toCss(shift(c, fam, target));
  });
}

// ---------- الشِّل ----------
/** رموز الشِّل الكحلية/الزرقاء (tokens.css) تتبع تدرّج اللون الأساسي المختار، كل رمز بإضاءته نفسها؛ والبرتقالي يبقى. */
const SHELL_TOKENS = { "--brand-navy": "#0a2540", "--navy-raised": "#123a5e", "--brand-blue": "#0080c0", "--ink": "#0a2540", "--ink-accent": "#006a9e", "--border": "#c9dceb", "--surface": "#f5f7fa", "--soft": "#e8f1f8" };
export function applyShellBrand(brand, root = document.documentElement) {
  const primary = parseColor(brand.primary);
  if (!primary || sameColor(brand.primary, DEFAULT_BRAND.primary)) {
    for (const k of Object.keys(SHELL_TOKENS)) root.style.removeProperty(k);
    return;
  }
  const t = rgbToHsl(primary);
  for (const [k, v] of Object.entries(SHELL_TOKENS)) {
    if (k === "--brand-blue") { root.style.setProperty(k, toHex(primary)); continue; }
    const o = rgbToHsl(parseColor(v));
    root.style.setProperty(k, toHex(hslToRgb(t.h, clamp(o.s * Math.max(0.35, t.s), 0, 1), o.l)));
  }
}
