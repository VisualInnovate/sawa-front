// Child age helpers shared by the parent portal and the bookings screens.

// Calendar pickers give a Date at local midnight; JSON would turn it into UTC and can
// shift the birth date back one day, so dates are sent as plain "YYYY-MM-DD".
export const toDateOnly = (value) => {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return value;
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${value.getFullYear()}-${month}-${day}`;
};

const parseBirthDate = (value) => {
  if (!value) return null;
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

// Completed years and months between the birth date and today.
export const ageParts = (birthDate, today = new Date()) => {
  const birth = parseBirthDate(birthDate);
  if (!birth || birth > today) return null;
  let months =
    (today.getFullYear() - birth.getFullYear()) * 12 +
    (today.getMonth() - birth.getMonth());
  if (today.getDate() < birth.getDate()) months -= 1;
  return { years: Math.floor(months / 12), months: months % 12 };
};

const countLabel = (n, unit, t) => {
  const key = n === 0 ? "zero" : n === 1 ? "one" : n === 2 ? "two" : n >= 3 && n <= 10 ? "few" : "many";
  return t(`age_count.${unit}_${key}`, { n });
};

const partsText = ({ years, months }, t) => {
  if (!years) return countLabel(months, "month", t);
  const yearsText = countLabel(years, "year", t);
  return months ? t("age_count.join", { a: yearsText, b: countLabel(months, "month", t) }) : yearsText;
};

// "4 سنوات و3 أشهر" from the birth date. Without it, the API's age in whole months is shown the same way
// (the bookings list used to print that number alone, which read like years).
export const formatChildAge = (birthDate, fallbackMonths, t) => {
  const parts = ageParts(birthDate);
  if (parts) return partsText(parts, t);
  const months = Number(fallbackMonths);
  if (fallbackMonths === null || fallbackMonths === undefined || fallbackMonths === "" || !Number.isFinite(months)) {
    return fallbackMonths ?? "";
  }
  const whole = Math.max(0, Math.floor(months));
  return partsText({ years: Math.floor(whole / 12), months: whole % 12 }, t);
};
