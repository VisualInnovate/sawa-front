// ELM (evaluation type 12) helpers shared by its screens, the report and the parent portal.

/** Each item is answered (+)/(−) with each of them; either may be left empty. */
export const PEOPLE = ["caregiver", "therapist"];

/** A test's color in the chart when it was saved without one (by its place among the chosen tests). */
export const FALLBACK_COLORS = ["#00B8D9", "#FF5630", "#36B37E", "#6554C0"];

/** The colors offered on the answering screen (as on the ABLLS screens). */
export const COLORS = ["00B8D9", "36B37E", "FFAB00", "FF5630", "6554C0"];

/** An item's text with the child's name in place of {{name}} («إسم الطفل» on the form). */
export const itemText = (text, childName) => String(text ?? "").replaceAll("{{name}}", childName || "إسم الطفل");

/** "#00B8D9" from a saved "00B8D9" (or the fallback for the test's place). */
export const colorOf = (color, index = 0) => (color ? `#${String(color).replace(/^#/, "")}` : FALLBACK_COLORS[index % FALLBACK_COLORS.length]);

/** One part's percentage for one person, or null when they answered none of it. */
export const percentOf = (scores, code, person) => (scores ?? []).find((row) => row.code === code)?.[person]?.percent ?? null;

/** A part's (+) out of the items answered, and the percentage, as the screen counts them before saving. */
export function liveScore(items, answers, person) {
  const values = items.map((item) => answers[item.id]?.[person]).filter((value) => typeof value === "boolean");
  const plus = values.filter(Boolean).length;
  return { plus, answered: values.length, percent: values.length ? Math.round((plus * 100) / values.length) : null };
}
