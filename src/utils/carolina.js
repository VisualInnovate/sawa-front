// The five wordings of a Carolina item (boy's and girl's); `label` is an i18n key. `skill` is what the
// evaluator reads beside the symbol.
export const carolinaFields = [
  { key: 'skill', label: 'carolina_ui.skill_text' },
  { key: 'strength', label: 'carolina_ui.strength_text' },
  { key: 'weakness', label: 'carolina_ui.weakness_text' },
  { key: 'plan_goal', label: 'carolina_ui.plan_goal_text' },
  { key: 'practice', label: 'carolina_ui.practice_text' },
];

export const emptyCarolinaWording = () => Object.fromEntries(
  ['male', 'female'].map(gender => [gender, Object.fromEntries(carolinaFields.map(field => [field.key, '']))])
);

// One wording of an item for the child: the child's gender ('1' is a girl) and first name in place of {{name}}.
// Items saved before the wordings fall back to their old `skill`.
export function carolinaText(item, key, child = {}) {
  const gender = String(child.gender) === '1' ? 'female' : 'male';
  const text = item?.wording?.[gender]?.[key] || item?.wording?.male?.[key] || (key === 'skill' ? item?.skill : '') || '';
  return String(text).replace(/\{\{.*?\}\}/g, String(child.name ?? '').trim().split(/\s+/)[0] || '');
}
