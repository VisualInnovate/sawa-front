// «رسوم البرامج»: the tier programs and item categories of the fee tables, as stored by the backend.
export const TIER_PROGRAMS = ["day", "clinics", "clinics_extra"];
export const ITEM_CATEGORIES = ["inclusion", "inclusion_transport", "evaluation", "individual", "day_transport"];
export const ITEM_UNITS = ["month", "session", "hour", "trip", "evaluation"];

// A number as the sheets print it: no trailing zeros.
export function money(value) {
  if (value == null || value === "") return "";
  return Number(value).toLocaleString("en-US", { maximumFractionDigits: 2 });
}
