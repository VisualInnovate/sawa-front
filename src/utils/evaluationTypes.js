const evaluationTypes = {
  1: { translationKey: "side_profile_eval", routeName: "SideProfiles" },
  2: { translationKey: "milestone", routeName: "milestone-evaluation" },
  3: { translationKey: "evaluation_barrier", routeName: "barrier-evaluation" },
  4: { translationKey: "ablls", routeName: "mission-test" },
  5: { translationKey: "evaluation_carolina", routeName: "carolina-test" },
  101: { translationKey: "side_profile_cognitive", routeName: "SideProfiles", dimensionIndex: 0 },
  102: { translationKey: "side_profile_self_care", routeName: "SideProfiles", dimensionIndex: 1 },
  103: { translationKey: "side_profile_motor", routeName: "SideProfiles", dimensionIndex: 2 },
  104: { translationKey: "side_profile_social", routeName: "SideProfiles", dimensionIndex: 3 },
  105: { translationKey: "side_profile_communication", routeName: "SideProfiles", dimensionIndex: 4 },
};

export function getEvaluationType(type) {
  return evaluationTypes[Number(type)] ?? null;
}

// Booking codes describe a dimension, never its position in the API response.
export function resolveSideProfileDimension(rows, dimension) {
  const terms = [
    ['معرف', 'cognitive'], ['عناي', 'ذات', 'self care', 'self-care'],
    ['حرك', 'motor'], ['اجتماع', 'social'], ['اتصال', 'تواصل', 'communication'],
  ][Number(dimension)];
  if (!terms) return null;
  const normalize = value => String(value || '').toLowerCase()
    .replace(/[أإآ]/g, 'ا').replace(/[\u064b-\u065f]/g, '');
  const matches = rows.filter(row => terms.some(term => normalize(row.title).includes(term)));
  return matches.length === 1 ? matches[0] : null;
}

export function getEvaluationTypeLabel(type, translate, fallback = "") {
  const definition = getEvaluationType(type);
  return definition ? translate(definition.translationKey) : fallback;
}

export function getEvaluationStartRoute(type, childId, requestId) {
  const definition = getEvaluationType(type);
  if (!definition) return null;

  if (definition.dimensionIndex !== undefined) {
    return {
      name: definition.routeName,
      query: { childId, requestId, dimension: definition.dimensionIndex },
    };
  }

  if (Number(type) === 1) {
    return { name: definition.routeName, query: { childId, requestId } };
  }

  return { name: definition.routeName, params: { id: childId }, query: { requestId } };
}
