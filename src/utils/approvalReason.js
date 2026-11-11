// Why the user cannot approve a waiting evaluation, as one sentence (the server sends the code, who it waits for, the
// evaluation's departments and its stage): shown on hover next to the evaluation and in the result page's banner.
export function blockedText(t, blocked) {
  if (!blocked) return "";
  const join = (list) => (list ?? []).join("، ");
  const parts = [t(`ewf.blocked_${blocked.code}`, { departments: join(blocked.departments) || "—" })];
  if (blocked.approvers?.length) {
    parts.push(t("ewf.blocked_waits", { stage: blocked.stage || t("ewf.blocked_stage"), names: join(blocked.approvers) }));
  } else if (blocked.stage) {
    parts.push(t("ewf.blocked_nobody", { stage: blocked.stage }));
  }
  return parts.join(" ");
}
