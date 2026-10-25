// M-CHAT-R scoring (the same rules as the server's App\Support\Mchat\Mchat): every «لا» is a risk point, except
// the questions marked yes_is_risk (2, 5, 12) where «نعم» is. Total 0-2 low, 3-7 medium, 8-20 high.

export const mchatPoint = (question, yes) => (question.yes_is_risk ? Number(Boolean(yes)) : Number(!yes));

export const mchatRisk = (total) => (total <= 2 ? "low" : total <= 7 ? "medium" : "high");

export const RISK_SEVERITY = { low: "success", medium: "warn", high: "danger" };
