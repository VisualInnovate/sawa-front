// Helpers shared by the evaluation reports list and the printable report.
import { ageParts } from "@/utils/childAge";
import { getEvaluationTypeLabel } from "@/utils/evaluationTypes";

export const SIDE_PROFILE = 1;
export const MILESTONE = 2;
export const BARRIER = 3;
export const ABLLS = 4;
export const CAROLINA = 5;
export const TRANSITION = 6;
export const ABLLS_SKILLS = 7;
export const MCHAT = 8;
export const QFBA = 9;
export const ABLLS_SP = 10;
export const SENSORY = 11;
export const ELM = 12;

// ABLLS Academy, Ablls OT and Ablls SP all draw the paper flow chart (a column per domain).
export const isAbllsFlow = (type) => [ABLLS, ABLLS_SKILLS, ABLLS_SP].includes(Number(type));

// An Ablls skill's top score (its scale 0..top), and whether an answer is a strength. Ablls OT: 3 or more, or the top when
// the scale is shorter (0-2: 2; 0-1: 1). Ablls SP (`topOnly`): only the top score (0-4: 4; 0-2: 2). Below it is a weakness.
export const abllsTop = (mission) => Math.max(1, Number(mission?.mission_max) || String(mission?.mission_degree ?? "").length - 1);
export const abllsIsStrength = (mission, topOnly = false) => Number(mission?.answer_score) >= (topOnly ? abllsTop(mission) : Math.min(3, abllsTop(mission)));

// Ablls OT / SP reports also list the newest test's strengths and weaknesses (see abllsIsStrength) after the chart.
export const hasAbllsPoints = (type) => [ABLLS_SKILLS, ABLLS_SP].includes(Number(type));

// The flow chart's column order by the domain's letter (B1, B2 are skills of B); other letters follow in the order they came.
export const ABLLS_LETTER_ORDER = ["S", "B", "U", "V", "W", "X", "Y", "Z"];
export const abllsSymbolOf = (category) => String(category?.symbol ?? String(category?.category ?? "").split(" - ")[0]).trim();
export const abllsLetterOf = (category) => abllsSymbolOf(category).replace(/[\s.\-]*\d+$/u, "").toUpperCase();
export const abllsRank = (category) => {
  const i = ABLLS_LETTER_ORDER.indexOf(abllsLetterOf(category));
  return i < 0 ? ABLLS_LETTER_ORDER.length : i;
};

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
  ({ 1: "pi pi-id-card", 2: "pi pi-flag", 3: "pi pi-shield", 4: "pi pi-list-check", 5: "pi pi-sitemap", 6: "pi pi-directions", 7: "pi pi-list-check", 8: "pi pi-check-square", 9: "pi pi-bolt", 10: "pi pi-list-check", 11: "pi pi-sun", 12: "pi pi-th-large" })[Number(type)] || "pi pi-file";

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

/**
 * A VB-MAPP chart box's marks for one test (number `n`), one color per half: the lower half keeps the color of an
 * earlier ½ (continuing an evaluation), otherwise the answer's; the upper half takes the answer's color when it is 1.
 */
export function milestoneMarks(question, n) {
  const score = Number(question?.answer_score ?? 0);
  const color = question?.answer_color;
  const lower = Number(question?.previous_score) >= 0.5 && question?.previous_color ? question.previous_color : score >= 0.5 ? color : null;
  const upper = score >= 1 ? color : null;
  if (lower && upper && lower === upper) return [{ n, color: upper, score: 1 }];
  return [
    ...(lower ? [{ n: n - 0.5, color: lower, score: 0.5, half: "lower" }] : []),
    ...(upper ? [{ n, color: upper, score: 1, half: "upper" }] : []),
  ];
}
