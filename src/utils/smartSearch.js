// Smarter name search, in every table and list: Arabic letters that are written several ways count as one
// (أ إ آ ا · ة ه · ى ي · ؤ و · ئ ي, no tashkeel or tatweel, «عبد الله» = «عبدالله», Arabic digits = Latin), and a
// query of several words matches when every word is found, in any order — so «تيم فلاح» finds «تيم الله عوض فلاح».

const MARKS = /[ؐ-ًؚ-ٰٟۖ-ۭـ]/g;
const DIGITS = /[٠-٩۰-۹]/g;

export function normalize(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .toLowerCase()
    .replace(MARKS, "")
    .replace(DIGITS, (d) => String((d.charCodeAt(0) & 0xf) % 10))
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/عبد\s+ال/g, "عبدال")
    .replace(/\s+/g, " ")
    .trim();
}

export const words = (query) => normalize(query).split(" ").filter(Boolean);

/** Every word of the query is found in the text (any order). */
export function matches(text, query) {
  const parts = words(query);
  if (!parts.length) return true;
  const hay = normalize(text);
  return parts.every((word) => hay.includes(word));
}

/** The rows whose given fields together hold every word of the query (first name in one field, family in another). */
export function filterRows(rows, query, fields) {
  const parts = words(query);
  if (!parts.length) return rows;
  return rows.filter((row) => {
    const hay = normalize(fields.map((f) => (typeof f === "function" ? f(row) : row?.[f])).join(" "));
    return parts.every((word) => hay.includes(word));
  });
}
