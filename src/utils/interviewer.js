// Whether the signed-in user takes part in the candidates' interviews (HR, or a department head who got files or set
// free times) and how many files wait for them: shows «طلبات المقابلات» in the menu. Read once per page load.
import axios from "axios";
import { reactive } from "vue";

export const interviewer = reactive({ is: false, waiting: 0, loaded: false });

let loading = null;
export const loadInterviewer = (force = false) => {
  if (force) loading = null;
  loading ??= axios.get("/api/candidate-reviews/summary")
    .then(({ data }) => Object.assign(interviewer, { is: !!data?.data?.is, waiting: data?.data?.waiting ?? 0, loaded: true }))
    .catch(() => { loading = null; });

  return loading;
};

// The weekday's name (0 = Sunday … 6 = Saturday) in the page's language.
export const weekdayName = (day, locale, style = "long") => new Intl.DateTimeFormat(locale, { weekday: style }).format(new Date(2024, 0, 7 + day));

// An interview time ("YYYY-MM-DD HH:mm") in the page's language: «الأحد 1 نوفمبر · 09:00» (short: «الأحد 1/11 · 09:00»).
export const formatWhen = (at, locale, style = "long") => {
  if (!at) return "";
  const [date, time = ""] = String(at).split(" ");
  const [y, m, d] = date.split("-").map(Number);
  const options = style === "long" ? { weekday: "long", day: "numeric", month: "long", year: "numeric" } : { weekday: "short", day: "numeric", month: "numeric" };
  // Latin digits, like the rest of the dashboard.
  const day = new Intl.DateTimeFormat(`${locale}-u-nu-latn`, options).format(new Date(y, m - 1, d));
  return style === "day" || !time ? day : `${day} · ${time.slice(0, 5)}`;
};

// The backend's «hr.x» codes in the page's language, other messages as they are.
export const hrError = (t, text) => (typeof text === "string" && text.startsWith("hr.") ? t(`crv.err.${text.slice(3)}`) : text);
