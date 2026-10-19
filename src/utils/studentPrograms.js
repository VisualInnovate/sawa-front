// Student programs by kind (inclusion / day / clinics, the employee work types) and their sessions.
import moment from "moment";

export const WEEK_DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
export const GROUP_KINDS = ["group", "both"];

export function dayLabel(t, day) {
  return t(`weekday.${WEEK_DAYS[day]}`);
}

export function sessionKindLabel(t, kind) {
  return t(`sp_session_${kind}`);
}

// closed / waiting / late / ongoing / missed, as the backend computes them.
export const SESSION_STATUS_SEVERITY = { closed: "secondary", waiting: "info", late: "warn", ongoing: "success", missed: "danger" };

export function isoDate(value) {
  return value ? moment(value).format("YYYY-MM-DD") : null;
}

export function timeRange(start, end) {
  return `${start ?? ""} – ${end ?? ""}`;
}

// The program kind's label: «دمج» / «نهاري (الصفوف)» / «عيادات (مسائي)».
export function programName(t, program) {
  if (program.kind !== "inclusion") return t(`work_type_${program.kind}`);
  const type = program.inclusion_type === "supervision" ? t("sp_inclusion_supervision") : t("sp_inclusion_program");
  return `${t("work_type_inclusion")} — ${type}${program.inclusion_english ? ` (${t("sp_english")})` : ""}`;
}
