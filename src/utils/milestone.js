export const milestoneFields = [
  { key: 'title', label: 'الهدف الفرعي (1- صياغة نقطة قوة)' },
  { key: 'half_strength', label: '1/2 - صياغة نقطة قوة' },
  { key: 'half_weakness', label: '1/2 - صياغة نقطة ضعف' },
  { key: 'half_plan_goal', label: '1/2 - صياغة هدف بالخطة' },
  { key: 'zero_weakness', label: '0 - صياغة نقطة ضعف' },
  { key: 'zero_plan_goal', label: '0 - صياغة هدف بالخطة' },
];

export const emptyMilestoneWording = () => Object.fromEntries(
  ['male', 'female'].map(gender => [gender, Object.fromEntries(milestoneFields.map(field => [field.key, '']))])
);
