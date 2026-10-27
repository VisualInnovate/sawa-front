// «نوع القاعة» (Room::CATEGORIES on the server): one or more of إداري / اجتماعات / استشارة, or «جلسات» alone.
// Only sessions rooms take program sessions.
export const ROOM_CATEGORIES = ["admin", "meetings", "consultation", "sessions"];
export const SESSIONS_CATEGORY = "sessions";

export const roomCategoryLabel = (t, category) => t(`room_cat_${category}`);

/** Rooms saved before the categories: the one their type_tow code meant. */
export function savedCategories(room) {
  if (Array.isArray(room?.categories) && room.categories.length) return room.categories;
  return { 0: ["admin"], 1: ["meetings"], 2: ["sessions"], 3: ["consultation"] }[room?.type_tow] ?? [];
}
