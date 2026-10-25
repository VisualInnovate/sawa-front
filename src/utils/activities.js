// Weekdays of the rooms' activity schedules: 0 = Sunday … 6 = Saturday (the server's numbering).
export const DAY_INDEXES = [0, 1, 2, 3, 4, 5, 6];

export const formatDays = (days, t) => [...(days ?? [])].sort((a, b) => a - b).map((day) => t(`activities.day_${day}`)).join("، ");
