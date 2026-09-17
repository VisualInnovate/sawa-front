// Half-year age steps (in years) shown as "سنتان و نصف" / "2 years and a half".
export const ageLabel = (years, t) => {
  if (years === 0) return "0";
  const whole = Math.floor(years);
  if (whole === 0) return t("age_label.half_year");
  const key = whole === 1 ? "one_year" : whole === 2 ? "two_years" : whole <= 10 ? "few_years" : "many_years";
  const label = t(`age_label.${key}`, { n: whole });
  return years % 1 !== 0 ? `${label} ${t("age_label.and_half")}` : label;
};

export const ageOptions = (from, to, t) => {
  const options = [];
  for (let years = from; years <= to; years += 0.5) options.push({ title: ageLabel(years, t), value: years });
  return options;
};
