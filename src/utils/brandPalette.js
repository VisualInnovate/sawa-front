// The brand colours of «إعدادات الموقع» → CSS variables. Every teal (primary) and magenta (secondary) shade the site
// draws with is a variable --bp-<hex> / --bs-<hex> holding "r g b" (so Tailwind's /opacity works): the default value
// is the original shade, and a new base colour moves each shade by the same hue / saturation / lightness step as the
// base, so lighter tints stay lighter and darker shades darker. src/styles/brand-colors.css holds the defaults.
// Generated list — when a new brand shade is added to the code, add it here and to brand-colors.css.

export const DEFAULT_BRAND_COLORS = { primary: "#135c65", secondary: "#b21553" };

export const PRIMARY_SHADES = ["#004f58", "#035b65", "#08282d", "#0b3f45", "#0b5f5d", "#0b6462", "#0e464d", "#0f2a2e", "#0f2f33", "#0f3d43", "#0f6462", "#133f45", "#134b53", "#135c65", "#148a98", "#168694", "#1b7a83", "#1b7c86", "#1c6772", "#1d3b3d", "#1d7780", "#1f7a83", "#226f78", "#2e8791", "#3f6f75", "#4aa3ad", "#4c9499", "#4cbdbb", "#51bdbb", "#5fbec7", "#7cc4cc", "#a7ebf6", "#aaeef9", "#aedde2", "#b6d7db", "#b6dde0", "#b7d7d9", "#cfe8ea", "#d2e8ea", "#d5e6e8", "#d5eef0", "#d7ecee", "#ddf6f8", "#e3eef0", "#e3f1f1", "#e5eef0", "#e6f1f3", "#e7fbfe", "#e8f1f2", "#e8f3f4", "#e9f4f5", "#e9fbfe", "#eafcff", "#ecfeff", "#eef6f6", "#eef8f9", "#eef8fa", "#f0f6f7", "#f0f7f7", "#f0f7f8", "#f0f9fa", "#f0fafc", "#f1f7f7", "#f3f8f8", "#f3f9fa", "#f6fafa", "#fafcfc", "#0f7a73", "#f7faf8", "#edf9f5", "#dfece7", "#5d726d", "#e8f7f2", "#f4f8f5", "#c9ddd7", "#738783", "#3d565a", "#effaf5", "#a9c5b9", "#eef7f3", "#4a7b73", "#dff5ee", "#8b9e96", "#dce8e1"];
export const SECONDARY_SHADES = ["#6d0f33", "#9d174d", "#b21553", "#be185d", "#c2185b", "#c51a58", "#c91f5f", "#d4346b", "#d73572", "#d95d91", "#db2777", "#e0a8c0", "#ec477c", "#f0c9d6", "#f1d1df", "#f3dce5", "#f4dde7", "#f7e7ef", "#f8e4ec", "#faeef2", "#fbe7ef", "#fce4ec", "#fce8f1", "#fdeef3", "#fdf2f7"];

const toHsl = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
};

const toRgb = ([h, s, l]) => {
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255));
};

const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

export const isHex = (v) => typeof v === "string" && /^#[0-9a-fA-F]{6}$/.test(v);

/** The shade that stands to `base` as `shade` stands to `defaultBase`. */
export function shiftShade(shade, defaultBase, base) {
  if (shade === defaultBase) return hexToRgb(base);
  const [h, s, l] = toHsl(shade);
  const [fh, fs, fl] = toHsl(defaultBase);
  const [th, ts, tl] = toHsl(base);
  const nh = (h + th - fh + 360) % 360;
  const ns = fs > 0 ? Math.min(1, (s * ts) / fs) : ts;
  const nl = l <= fl ? (fl > 0 ? (l * tl) / fl : tl) : tl + ((l - fl) * (1 - tl)) / (1 - fl);
  return toRgb([nh, ns, nl]);
}

/** CSS variables for the given colours: { "--bp-135c65": "19 92 101", ... }. */
export function brandVariables(colors = {}) {
  const primary = isHex(colors.primary) ? colors.primary.toLowerCase() : DEFAULT_BRAND_COLORS.primary;
  const secondary = isHex(colors.secondary) ? colors.secondary.toLowerCase() : DEFAULT_BRAND_COLORS.secondary;
  const vars = {};
  for (const h of PRIMARY_SHADES) vars[`--bp-${h.slice(1)}`] = (primary === DEFAULT_BRAND_COLORS.primary ? hexToRgb(h) : shiftShade(h, DEFAULT_BRAND_COLORS.primary, primary)).join(" ");
  for (const h of SECONDARY_SHADES) vars[`--bs-${h.slice(1)}`] = (secondary === DEFAULT_BRAND_COLORS.secondary ? hexToRgb(h) : shiftShade(h, DEFAULT_BRAND_COLORS.secondary, secondary)).join(" ");
  return vars;
}

/** Tailwind colours: text-bp-1c6772, bg-bs-b21553/10, … */
export const tailwindBrandColors = {
  bp: Object.fromEntries(PRIMARY_SHADES.map((h) => [h.slice(1), `rgb(var(--bp-${h.slice(1)}) / <alpha-value>)`])),
  bs: Object.fromEntries(SECONDARY_SHADES.map((h) => [h.slice(1), `rgb(var(--bs-${h.slice(1)}) / <alpha-value>)`])),
};
