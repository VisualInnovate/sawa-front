// The parents' portal: labels, states and formats shared by its pages.
import i18n from "@/plugins/i18n";
import { formatChildAge } from "./childAge";

const t = (key, params) => i18n.global.t(key, params);

/** The date/number locale: Arabic words with western digits, so numbers read the same in both languages. */
export function locale() {
  return i18n.global.locale.value === "en" ? "en-GB" : "ar-JO-u-nu-latn";
}

const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  const text = String(value).trim();
  // "2026-11-02" alone is read as UTC by Date; make it a local day.
  const day = /^\d{4}-\d{2}-\d{2}$/.test(text) ? new Date(`${text}T00:00:00`) : new Date(text.replace(" ", "T"));
  return Number.isNaN(day.getTime()) ? null : day;
};

/** "الأحد 2 نوفمبر" */
export function fmtDay(value, options = {}) {
  const day = toDate(value);
  return day ? new Intl.DateTimeFormat(locale(), { weekday: "long", day: "numeric", month: "long", ...options }).format(day) : "";
}

/** "28/10" — for the tightest places (a stat box on a phone). */
export function fmtShortDate(value) {
  const day = toDate(value);
  return day ? new Intl.DateTimeFormat(locale(), { day: "numeric", month: "numeric" }).format(day) : "";
}

/** "2 نوفمبر 2026" */
export function fmtDate(value) {
  const day = toDate(value);
  return day ? new Intl.DateTimeFormat(locale(), { day: "numeric", month: "long", year: "numeric" }).format(day) : "";
}

/** "09:30 ص" from "09:30" or a datetime. */
export function fmtTime(value) {
  if (!value) return "";
  const text = String(value);
  const match = /^(\d{1,2}):(\d{2})/.exec(text.includes(" ") || text.includes("T") ? text.split(/[ T]/)[1] ?? "" : text);
  const day = match ? new Date(2000, 0, 1, Number(match[1]), Number(match[2])) : toDate(text);
  return day ? new Intl.DateTimeFormat(locale(), { hour: "numeric", minute: "2-digit" }).format(day) : "";
}

/** "الأحد 2 نوفمبر · 09:30 ص" */
export function fmtDateTime(value) {
  const day = toDate(value);
  if (!day) return "";
  return `${fmtDay(day)} · ${fmtTime(day)}`;
}

/** "منذ 3 أيام" / "بعد ساعتين" */
export function fmtRelative(value, now = new Date()) {
  const day = toDate(value);
  if (!day) return "";
  const diff = (day - now) / 1000;
  const units = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
  const rtf = new Intl.RelativeTimeFormat(locale(), { numeric: "auto" });
  for (const [unit, seconds] of units) {
    if (Math.abs(diff) >= seconds || unit === "minute") return rtf.format(Math.round(diff / seconds), unit);
  }
  return "";
}

/** The day of a datetime string, "2026-11-02". */
export function dayOf(value) {
  const day = toDate(value);
  return day ? `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}` : "";
}

export function isToday(value) {
  return dayOf(value) === dayOf(new Date());
}

/** "1,250 JD" */
export function money(value, currency = "JD") {
  if (value === null || value === undefined || value === "") return "";
  const number = Number(value);
  return `${new Intl.NumberFormat(locale(), { maximumFractionDigits: 2 }).format(Number.isNaN(number) ? 0 : number)} ${currency}`;
}

export function initials(name) {
  return String(name ?? "").trim().split(/\s+/).slice(0, 2).map((part) => part[0] ?? "").join("");
}

/** One of four soft palettes, the same for the same child. */
export function paletteOf(child) {
  const seed = Number(child?.id ?? 0) || String(child?.name ?? "").length;
  return ["teal", "magenta", "cyan", "sun"][seed % 4];
}

export function isGirl(child) {
  return String(child?.gender) === "1";
}

export function ageText(child) {
  return formatChildAge(child?.birth_date, child?.age_months ?? null, t);
}

/** A tag's look and words for every state the portal shows. */
const META = {
  programKind: { inclusion: ["teal", "pp.kind_inclusion"], day: ["info", "pp.kind_day"], clinics: ["magenta", "pp.kind_clinics"] },
  programStatus: {
    tentative: ["warn", "pp.ps_tentative"], confirmed: ["success", "pp.ps_confirmed"], unconfirmed: ["danger", "pp.ps_unconfirmed"],
    stopped: ["neutral", "pp.ps_stopped"],
  },
  installment: { paid: ["success", "pp.in_paid"], late: ["danger", "pp.in_late"], due: ["warn", "pp.in_due"], upcoming: ["info", "pp.in_upcoming"], cancelled: ["neutral", "pp.in_cancelled"] },
  billing: { free: ["success", "pp.bl_free"], locked: ["warn", "pp.bl_locked"], paid: ["success", "pp.bl_paid"], confirmed: ["info", "pp.bl_confirmed"], cancelled: ["danger", "pp.bl_cancelled"] },
  approval: { approved: ["success", "pp.ap_approved"], pending: ["warn", "pp.ap_pending"], rejected: ["danger", "pp.ap_rejected"] },
  charge: { open: ["warn", "pp.ch_open"], paid: ["success", "pp.ch_paid"], cancelled: ["neutral", "pp.ch_cancelled"] },
  session: {
    closed: ["neutral", "pp.ss_closed"], waiting: ["info", "pp.ss_waiting"], late: ["warn", "pp.ss_late"], ongoing: ["success", "pp.ss_ongoing"],
    finished: ["teal", "pp.ss_finished"], missed: ["danger", "pp.ss_missed"], compensated: ["info", "pp.ss_compensated"],
  },
  generalization: { pending: ["warn", "pp.gen_pending"], approved: ["success", "pp.gen_approved"], rejected: ["danger", "pp.gen_rejected"] },
  request: { 0: ["info", "pp.er_awaiting"], 1: ["success", "pp.er_finished"], 2: ["warn", "pp.er_in_progress"], 3: ["danger", "pp.er_cancelled"] },
  credit: { pending: ["warn", "pp.cr_pending"], credit: ["success", "pp.cr_credit"], refunded: ["info", "pp.cr_refunded"], dismissed: ["neutral", "pp.cr_dismissed"] },
};

export function meta(kind, value) {
  const row = META[kind]?.[value];
  return row ? { severity: row[0], label: t(row[1]) } : { severity: "neutral", label: value ? String(value) : "" };
}

/** A consultation booking's state from its `accepted` flag. */
export function bookingMeta(accepted) {
  if (String(accepted) === "1") return { severity: "success", label: t("pp.bk_accepted") };
  if (String(accepted) === "0") return { severity: "danger", label: t("pp.bk_rejected") };
  return { severity: "warn", label: t("pp.bk_waiting") };
}

/** A schedule item's words (the same items as the weekly schedule). */
export function scheduleTitle(item) {
  if (!item) return "";
  if (item.type === "session") return item.treatment || t("pp.type_session");
  if (item.type === "inclusion") return t("pp.type_inclusion");
  if (item.type === "evaluation") return item.title || t("pp.type_evaluation");
  if (item.type === "consultation") return t("pp.type_consultation");
  if (item.type === "meeting") return item.title || t("pp.type_meeting");
  return item.title || item.type;
}

export const SCHEDULE_ICON = {
  session: "pi pi-users", inclusion: "pi pi-sitemap", evaluation: "pi pi-clipboard", consultation: "pi pi-comments", meeting: "pi pi-calendar",
};

/** The first words of a notification. */
export function notificationText(item) {
  let data = item?.data;
  if (typeof data === "string") {
    try { data = JSON.parse(data); } catch { data = { message: data }; }
  }
  data = data && typeof data === "object" ? data : {};
  return { title: data.title ?? data.subject ?? t("notification"), body: data.message ?? data.body ?? data.text ?? "" };
}
