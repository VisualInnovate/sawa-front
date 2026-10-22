// Age ranges (from–to in months, either end may be empty) of evaluation types, therapists and rooms.
// A child outside a range only gets a warning; nothing is refused.
import { ageParts } from "@/utils/childAge";

// The child's age in whole months on a day (today by default), or null without a birth date.
export function childMonths(birthDate, on = new Date()) {
  const parts = ageParts(birthDate, on instanceof Date ? on : new Date(on));
  return parts ? parts.years * 12 + parts.months : null;
}

const limit = (value) => (value === null || value === undefined || value === "" ? null : Number(value));

// An unknown age or an empty range always fits.
export function fitsAge(from, to, months) {
  if (months === null || months === undefined) return true;
  const low = limit(from);
  const high = limit(to);
  return (low === null || months >= low) && (high === null || months <= high);
}

export const hasRange = (from, to) => limit(from) !== null || limit(to) !== null;

// "24 – 48 شهراً" / "2 – 4 سنوات" / "من 3 سنوات": years when both ends are whole years.
export function formatAgeRange(t, from, to) {
  const low = limit(from);
  const high = limit(to);
  if (low === null && high === null) return t("age_ranges.any");
  const years = [low, high].every((value) => value === null || value % 12 === 0);
  const show = (value) => (years ? value / 12 : value);
  const unit = t(years ? "age_ranges.years" : "age_ranges.months");
  if (low !== null && high !== null) return `${show(low)} – ${show(high)} ${unit}`;
  return low !== null ? t("age_ranges.from_only", { n: show(low), unit }) : t("age_ranges.to_only", { n: show(high), unit });
}
