// Six wordings of a milestone sub-goal; `label` is an i18n key.
export const milestoneFields = [
  { key: 'title', label: 'milestone_wording.title' },
  { key: 'half_strength', label: 'milestone_wording.half_strength' },
  { key: 'half_weakness', label: 'milestone_wording.half_weakness' },
  { key: 'half_plan_goal', label: 'milestone_wording.half_plan_goal' },
  { key: 'zero_weakness', label: 'milestone_wording.zero_weakness' },
  { key: 'zero_plan_goal', label: 'milestone_wording.zero_plan_goal' },
];

export const emptyMilestoneWording = () => Object.fromEntries(
  ['male', 'female'].map(gender => [gender, Object.fromEntries(milestoneFields.map(field => [field.key, '']))])
);
