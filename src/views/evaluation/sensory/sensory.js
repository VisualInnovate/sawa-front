// Sensory Profile (evaluation type 11) helpers shared by its evaluation, result and settings screens, the report and
// the parent portal. The scale runs 1 دائماً … 5 أبداً (X = not observed / does not apply), so a LOW raw score means the
// behaviour happens MORE than in other children. Every scale's band for the child's age comes saved with the result.

export const SENSORY = 11;

/** How each level is coloured: typical, a probable difference, a definite one, or (infant form) consult and follow up. */
export const LEVEL_TONE = {
  less_definite: "definite", less_probable: "probable", less: "consult", typical: "typical",
  more: "consult", more_probable: "probable", more_definite: "definite",
};

/** The quadrants in the sheets' order, with the paper form's colour for each. */
export const QUADRANT_COLOR = { LR: "#2563eb", SK: "#16a34a", SN: "#9333ea", AV: "#dc2626" };

export const isEn = (lang) => lang === "en";

// The Arabic forms letter their sections أ ب ج د ه و ز ح ط ي ك ل م س (A … N in English).
const ARABIC_LETTERS = { A: "أ", B: "ب", C: "ج", D: "د", E: "هـ", F: "و", G: "ز", H: "ح", I: "ط", J: "ي", K: "ك", L: "ل", M: "م", N: "س" };
export const sectionLetter = (code, lang) => (isEn(lang) ? code : ARABIC_LETTERS[code] ?? code);

export const itemText = (item, lang) => (isEn(lang) && item?.text_en ? item.text_en : item?.text ?? "");

export const scaleName = (scale, lang) => (isEn(lang) && scale?.name_en ? scale.name_en : scale?.name ?? "");

export const formName = (form, lang) => (isEn(lang) && form?.name_en ? form.name_en : form?.name ?? "");

export const levelLabel = (labels, key, lang) => (key ? labels?.[key]?.[isEn(lang) ? "en" : "ar"] ?? key : "");

export const optionLabel = (option, lang) => (isEn(lang) ? option?.label_en : option?.label) ?? "";

/** A band as the sheets print it, highest score first: «55–53», or «55» when it is one score. */
export const bandText = (band) => {
  if (!band) return "—";
  const [min, max] = [Math.min(band[0], band[1]), Math.max(band[0], band[1])];
  return min === max ? String(max) : `${max}–${min}`;
};

/** The saved scores of one kind (quadrant | threshold | section | factor), in the form's order. */
export const scoresOf = (result, ...kinds) => (result?.scores ?? []).filter((score) => kinds.includes(score.kind));

/** «less» when the level is less than others, «more» when more, else null. */
export const direction = (level) => (level?.startsWith("less") ? "less" : level?.startsWith("more") ? "more" : null);

/** What a quadrant's level means and its intervention focus (the scale's texts as set now). */
export const meaningOf = (form, score, lang) => {
  const scale = (form?.scales ?? []).find((row) => row.code === score?.code);
  const side = direction(score?.level);
  if (!scale || !side) return "";
  return (isEn(lang) ? scale[`${side}_text_en`] : null) || scale[`${side}_text`] || "";
};

/** The quadrants an item belongs to (codes), from the form's scales. */
export const quadrantsOfItem = (form, itemId) => (form?.scales ?? [])
  .filter((scale) => scale.kind === "quadrant" && scale.item_ids.includes(itemId)).map((scale) => scale.code);

/** "1 سنة و 3 أشهر"-free short age: months under 3 years, else years and months. */
export const ageText = (months, t) => {
  if (months == null) return "";
  if (months < 36) return t("sensory.months", { n: months });
  return t("sensory.years_months", { y: Math.floor(months / 12), m: months % 12 });
};
