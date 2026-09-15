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

// "4 سنوات 3 أشهر" from the birth date; falls back to the value the API sent.
export const formatChildAge = (birthDate, fallback, t) => {
  const parts = ageParts(birthDate);
  if (!parts) return fallback ?? "";
  const years = `${parts.years} ${t("age_years")}`;
  return parts.months ? `${years} ${parts.months} ${t("age_months")}` : years;
};
