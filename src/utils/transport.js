// «المواصلات»: the lists the transport pages share, and dates sent as the day picked (not shifted to UTC).
import { isoDate } from "@/utils/accounting";

export { isoDate };

export const VEHICLE_TYPES = [0, 1, 2];
export const vehicleTypeKey = (type) => ["vehicle_type.car", "vehicle_type.bus", "vehicle_type.minibus"][type] ?? "vehicle_type.unknown";

export const TRIP_TYPES = [0, 1];
export const tripTypeKey = (type) => (Number(type) === 1 ? "tow_way" : "one_way");

export const DIRECTIONS = ["to_academy", "to_home"];
export const STOP_STATUSES = ["pending", "approaching", "arrived", "absent"];
export const STOP_SEVERITY = { pending: "secondary", approaching: "warn", arrived: "success", absent: "danger" };

// 0 = Sunday … 6 = Saturday, as the backend stores them.
export const WEEK_DAYS = [0, 1, 2, 3, 4, 5, 6];

/** A "YYYY-MM-DD" from the backend as a Date of that day (for the date pickers). */
export function dateOf(value) {
  if (!value) return null;
  const [y, m, d] = String(value).slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** "HH:mm" of a "HH:mm:ss" time. */
export const hm = (value) => (value ? String(value).slice(0, 5) : "");

/** The backend's validation errors of an axios error: { field: [message] }. */
export const fieldErrors = (error) => error?.response?.data?.errors ?? {};
