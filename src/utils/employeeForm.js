import axios from "axios";

// The employee form's dropdowns come in one request (api/employees/form-options), reused for a minute
// so going back and forth between employees does not ask again.
const OPTIONS_TTL_MS = 60 * 1000;
let cachedOptions = null;

export function fetchEmployeeFormOptions({ refresh = false } = {}) {
  if (refresh || !cachedOptions || Date.now() - cachedOptions.at > OPTIONS_TTL_MS) {
    const promise = axios.get("api/employees/form-options").then(({ data }) => data.data);
    promise.catch(() => {
      if (cachedOptions?.promise === promise) cachedOptions = null;
    });
    cachedOptions = { at: Date.now(), promise };
  }
  return cachedOptions.promise;
}

/** Employee kinds of the form (users.type). */
export const employeeTypes = (t) => [
  { name: t("driver"), id: 1 },
  { name: t("doctor"), id: 2 },
  { name: t("Evaluator"), id: 5 },
  { name: t("أداري"), id: 6 },
];

export const employeeTypeName = (t, type) =>
  employeeTypes(t).find((item) => Number(item.id) === Number(type))?.name?.trim() ?? "";

/** Skills, evaluation types and treatments belong to therapists (and the old type 0). */
export const hasTherapistFields = (type) => Number(type) === 0 || Number(type) === 2;

/** The evaluations an employee may perform (ids saved in users.evaluations). */
export const evaluationTypeGroups = (t) => [
  {
    label: "Side Profile",
    items: [
      { name: "البعد المعرفي", id: 101 },
      { name: "البعد العنايه الذاتيه", id: 102 },
      { name: "البعد الحركي", id: 103 },
      { name: "البعد الاجتماعي", id: 104 },
      { name: "البعد الاتصالي", id: 105 },
    ],
  },
  {
    label: t("other_evaluation_types"),
    items: [
      { name: "milestone", id: 2 },
      { name: "barrier", id: 3 },
      { name: "ABLLS Academy", id: 4 },
      { name: "carolina", id: 5 },
      { name: "Transition", id: 6 },
      { name: "Ablls OT", id: 7 },
      { name: "M-CHAT-R", id: 8 },
    ],
  },
];

export const DEFAULT_AVATAR = "https://sys.sawa.sawa.academy/public/default.jpg";
