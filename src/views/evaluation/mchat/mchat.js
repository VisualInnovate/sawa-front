// M-CHAT-R scoring (the same rules as the server's App\Support\Mchat\Mchat): every «لا» is a risk point, except
// the questions marked yes_is_risk (2, 5 and 12 on the form) where «نعم» is. The total's level comes from the levels'
// score ranges ({ key, from, to }; `to` null = and above), managed on the M-CHAT settings page.

export const mchatPoint = (question, yes) => (question.yes_is_risk ? Number(Boolean(yes)) : Number(!yes));

// The form's own ranges, until the server's are loaded.
const FORM_LEVELS = [{ key: "low", from: 0, to: 2 }, { key: "medium", from: 3, to: 7 }, { key: "high", from: 8, to: null }];

export const mchatRisk = (total, levels) => {
  const list = levels?.length ? levels : FORM_LEVELS;
  return (list.find((level) => total >= level.from && (level.to === null || total <= level.to)) ?? list[list.length - 1]).key;
};

// "0–2", or "8+" for the open-ended last level.
export const levelRange = (level) => (level.to === null || level.to === undefined ? `${level.from}+` : `${level.from}–${level.to}`);

export const RISK_SEVERITY = { low: "success", medium: "warn", high: "danger" };
