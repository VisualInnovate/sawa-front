// The employees' documents (offer letter, work contract, amendment): shared helpers for the pages that show them.

export const DOC_TYPES = ["offer", "work", "amendment"];

/** An amendment's changes as lines to read: the new salary, title, end date, other changes, from when. */
export function amendmentLines(changes, t) {
  if (!changes) return [];
  const lines = [];
  if (changes.basic_salary !== undefined && changes.basic_salary !== null && changes.basic_salary !== "") lines.push(t("ect.ch_salary", { value: changes.basic_salary }));
  if (changes.job_title) lines.push(t("ect.ch_title", { value: changes.job_title }));
  if (changes.end_date) lines.push(t("ect.ch_end", { value: changes.end_date }));
  if (changes.details) lines.push(changes.details);
  if (changes.effective_date) lines.push(t("ect.ch_from", { value: changes.effective_date }));
  return lines;
}
