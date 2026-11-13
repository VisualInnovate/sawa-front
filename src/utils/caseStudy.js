// «دراسة حالة الطالب»: the helpers shared by the parents' form and the child's details. The questions come from the
// server (App\Support\CaseStudy\CaseStudyForm); a question may be shown only when an earlier one has a given answer.
export const NOT_YET = "not_yet";

export function isVisible(question, answers) {
  if (!question.show_if) return true;
  const given = answers?.[question.show_if.key];
  if (given === null || given === undefined) return false;
  return [].concat(given).some((value) => question.show_if.in.includes(value));
}

export function isAnswered(value) {
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined && value !== "";
}

const allQuestions = (sections) => (sections ?? []).flatMap((section) => section.questions);

/** The answers without those of the questions that are hidden now (a later «لا» hides what «نعم» had opened). */
export function visibleAnswers(sections, answers) {
  const kept = {};
  for (const question of allQuestions(sections)) {
    if (isVisible(question, kept) && isAnswered(answers?.[question.key])) kept[question.key] = answers[question.key];
  }
  return kept;
}

/** The shown questions still without an answer (per section when a section is given). */
export function unanswered(sections, answers) {
  const kept = visibleAnswers(sections, answers);
  return allQuestions(sections).filter((question) => isVisible(question, kept) && !question.optional && !isAnswered(kept[question.key]));
}

const optionLabel = (question, value) => question.options?.find((option) => option.value === value)?.label ?? value;

/** One answer as text (a rows question is drawn as a table: see rowsOf). */
export function answerText(question, value, notYet = "لم يبدأ بعد") {
  if (!isAnswered(value)) return "";
  switch (question.type) {
    case "radio":
    case "select":
      return optionLabel(question, value);
    case "checks":
      return [].concat(value).map((item) => optionLabel(question, item)).join("، ");
    case "months":
      return value === NOT_YET ? notYet : monthsText(Number(value));
    case "number":
      return `${value}${question.unit ? ` ${question.unit}` : ""}`;
    default:
      return String(value);
  }
}

export function monthsText(months) {
  if (months < 24) return `${months} شهر`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return rest ? `${years} سنة و${rest} شهر` : `${years} سنة`;
}

export const STATUS = {
  sent: { label: "cs.status_sent", severity: "warn", icon: "pi pi-send" },
  submitted: { label: "cs.status_submitted", severity: "success", icon: "pi pi-check-circle" },
};
