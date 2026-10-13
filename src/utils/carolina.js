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

// One wording of a skill for the child: the child's gender ('1' is a girl) and first name in place of {{name}}.
export function carolinaText(skill, key, child = {}) {
  const gender = String(child.gender) === '1' ? 'female' : 'male';
  const text = skill?.wording?.[gender]?.[key] || '';
  return String(text).replace(/\{\{.*?\}\}/g, String(child.name ?? '').trim().split(/\s+/)[0] || '');
}
