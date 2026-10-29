// Where an evaluation's result page opens, by type (1 = a side-profile result).
export function resultRoute({ type, id, childId, sideProfileId = 0, evaluationId = null }) {
  switch (Number(type)) {
    case 1: return { name: "showChildResult", params: { child_id: childId, sideProfile_id: sideProfileId || 0, evaluation_id: evaluationId ?? id } };
    case 2: return { name: "milestone-resulte", params: { id: childId, evla_id: id } };
    case 3: return { name: "barrier-resulte", params: { id: childId } };
    case 4: return { name: "ablls-resulte", params: { id } };
    case 5: return { name: "carolina-resulte", params: { id } };
    case 6: return { name: "transition-result", params: { id: childId, evaluation: id } };
    case 7: return { name: "skills-result", params: { id } };
    case 8: return { name: "mchat-result", params: { id: childId, evaluation: id } };
    case 9: return { name: "qfba-result", params: { id: childId, evaluation: id } };
    default: return null;
  }
}

export const APPROVAL_SEVERITY = { pending: "warn", approved: "success", rejected: "danger" };
