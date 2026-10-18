// The optional work types of an employee (القسم/الفترة). Several may be picked, but never inclusion with day;
// the backend refuses that pair too.
export const WORK_TYPES = ["inclusion", "day", "clinics"];

const EXCLUSIVE = { inclusion: "day", day: "inclusion" };

export function workTypeLabel(t, type) {
  return t(`work_type_${type}`);
}

// A type is greyed out while the one it cannot go with is picked.
export function isWorkTypeBlocked(type, picked) {
  return Boolean(EXCLUSIVE[type]) && (picked ?? []).includes(EXCLUSIVE[type]);
}

// The form posts multipart data, so the backend reads them comma-separated ("" clears them).
export function workTypesValue(picked) {
  return WORK_TYPES.filter((type) => (picked ?? []).includes(type)).join(",");
}

// The periods a room works in use the same names as the employee work types: day (classes) and clinics (evening).
export const ROOM_PERIODS = ["day", "clinics"];
