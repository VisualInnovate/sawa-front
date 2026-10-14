// Helpers shared by the evaluation reports list and the printable report.
import { ageParts } from "@/utils/childAge";
import { getEvaluationTypeLabel } from "@/utils/evaluationTypes";

export const SIDE_PROFILE = 1;
export const MILESTONE = 2;
export const BARRIER = 3;
export const ABLLS = 4;
export const CAROLINA = 5;
export const TRANSITION = 6;

/** A report takes at most this many evaluations of one type (the VB-MAPP form has four test columns). */
export const MAX_PER_GROUP = 4;

/** "YYYY-MM-DD" -> { year, month, day } (strings, zero padded), or null. */
export const dateParts = (value) => {
  const match = String(value ?? "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? { year: match[1], month: match[2], day: match[3] } : null;
};

/** dd/mm/yyyy */
export const dmy = (value) => {
  const parts = dateParts(value);
  return parts ? `${parts.day}/${parts.month}/${parts.year}` : "";
};

/** yyyy/mm/dd (the VB-MAPP form's order) */
export const ymd = (value) => {
  const parts = dateParts(value);
  return parts ? `${parts.year}/${parts.month}/${parts.day}` : "";
};

const toDate = (value) => {
  const parts = dateParts(value);
  return parts ? new Date(Number(parts.year), Number(parts.month) - 1, Number(parts.day)) : new Date();
};

/** Age on a given day as { years, months }. */
export const ageOn = (birthDate, day) => ageParts(birthDate, toDate(day));

/** "2y 10m" */
export const shortAge = (months) => {
  if (months === null || months === undefined || months === "") return "";
  const whole = Math.max(0, Math.floor(Number(months)));
  const years = Math.floor(whole / 12);
  const rest = whole % 12;
  return years ? `${years}y ${rest}m` : `${rest}m`;
};

const countWord = (n, unit, t) => {
  const form = n === 1 ? "one" : n === 2 ? "two" : n >= 3 && n <= 10 ? "few" : "many";
  return t(`ereport.age_words.${unit}_${form}`, { n });
};

/** "سنتين و10 أشهر" — the wording used after "يبلغ من العمر". */
export const ageWords = (parts, t) => {
  if (!parts) return "";
  const { years, months } = parts;
  if (!years && !months) return t("ereport.age_words.zero");
  if (!years) return countWord(months, "month", t);
  if (!months) return countWord(years, "year", t);
  return t("ereport.age_words.join", { a: countWord(years, "year", t), b: countWord(months, "month", t) });
};

/** The child's first name (for "وصف حالة فؤاد"). */
export const firstName = (name) => String(name ?? "").trim().split(/\s+/)[0] ?? "";

export const isFemale = (gender) => String(gender) === "1";

/** Evaluation name as shown in lists and in the report ("VB-MAPP", "تقييم العوائق", "البعد المعرفي"...). */
export const evaluationLabel = (item, t) => {
  if (Number(item?.type) === SIDE_PROFILE) return item.title || t("ereport.side_profile");
  if (Number(item?.type) === MILESTONE) return "VB-MAPP";
  return getEvaluationTypeLabel(item?.type, t, item?.title || "");
};

/** Short family label for badges/tags. */
export const typeLabel = (type, t) =>
  Number(type) === SIDE_PROFILE ? t("ereport.side_profile") : Number(type) === MILESTONE ? "VB-MAPP" : getEvaluationTypeLabel(type, t, "");

export const typeIcon = (type) =>
  ({ 1: "pi pi-id-card", 2: "pi pi-flag", 3: "pi pi-shield", 4: "pi pi-list-check", 5: "pi pi-sitemap", 6: "pi pi-directions" })[Number(type)] || "pi pi-file";

/**
 * Items in blocks per type — `group` from the API: "t2" for a type, "s8" for one side-profile dimension —
 * in the order each block's first item appears (items come newest first).
 */
export const groupItems = (items, t) => {
  const blocks = new Map();
  for (const item of items ?? []) {
    const key = item.group ?? `t${item.type}`;
    if (!blocks.has(key)) blocks.set(key, { group: key, type: Number(item.type), label: t ? evaluationLabel(item, t) : "", items: [] });
    blocks.get(key).items.push(item);
  }
  return [...blocks.values()];
};

/** Behaviour problems are described only on a behavioural evaluation. */
export const isBehavioural = (label) => /سلوك|behavio/i.test(String(label ?? ""));
