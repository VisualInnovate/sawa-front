// The tracking's columns, as the tracking report, a session's goals and «طلبات اعتماد التراكنج» show them:
// prop, MT, EXP, RR, GEN, then EF (Establishing fluency) and MF (Mixing fluency). The ones with `dates` are a start
// and an end date, typed in the report and changed in the sessions alike; MT (its DTT sheets) and GEN (its requests)
// are filled by what the session does.
export const TRACKING_COLUMNS = [
  { key: "prop", title: "ereport.tracking_prop", code: "prop", dates: true },
  { key: "mt", title: "ereport.trial_mt", code: "MT" },
  { key: "exp", title: "ereport.trial_exp", code: "EXP", dates: true },
  { key: "rr", title: "ereport.trial_rr", code: "RR", dates: true },
  { key: "gen", title: "gen_title", code: "GEN" },
  { key: "ef", title: "ereport.trial_ef", code: "Establishing fluency", dates: true },
  { key: "mf", title: "ereport.trial_mf", code: "Mixing fluency", dates: true },
];

export const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value ?? "");

// A column's start or end: prop's are its start and the day the goal was achieved, the others are the goal's cells.
export function columnDate(goal, key, end) {
  if (key === "prop") return (end === "start" ? goal.prop_start : goal.achieved_at) || goal.cells?.[`prop_${end}`] || "";
  return goal.cells?.[`${key}_${end}`] || "";
}

// "2026-11-01" → "01/11/2026"; anything else (an older free-text value) as it is.
export const showDate = (value) => (isDate(value) ? value.split("-").reverse().join("/") : value ?? "");
