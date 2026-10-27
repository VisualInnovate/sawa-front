// Student programs by kind (inclusion / day / clinics, the employee work types) and their sessions.
import moment from "moment";

export const WEEK_DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
export const GROUP_KINDS = ["group", "both"];

// The automatic scheduling criteria (backend SchedulingCriteria::KEYS), in the default order.
export const SCHEDULING_CRITERIA = ["least_vacancy", "consecutive", "early_start", "age_group", "skills", "program_therapist"];

// Whole hours from start to end ("H:i"); 0 when the window is not valid.
export function windowHours(window) {
  if (!window?.start || !window?.end || window.end <= window.start) return 0;
  const minutes = (time) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
  return Math.floor((minutes(window.end) - minutes(window.start)) / 60);
}

export function dayLabel(t, day) {
  return t(`weekday.${WEEK_DAYS[day]}`);
}

export function sessionKindLabel(t, kind) {
  return t(`sp_session_${kind}`);
}

// closed / waiting / late / ongoing / finished / missed, as the backend computes them.
export const SESSION_STATUS_SEVERITY = { closed: "secondary", waiting: "info", late: "warn", ongoing: "success", finished: "contrast", missed: "danger" };

// Why a session was postponed, missed or compensated (an official holiday is filled in by the system).
export const SESSION_REASONS = ["family_delay", "therapist_delay", "transport_delay", "other"];

export function reasonText(t, type, note) {
  if (!type) return "";
  if (type === "holiday") return `${t("session_reason_holiday")}${note ? `: ${note}` : ""}`;
  const label = t(`session_reason_${type}`);
  return type === "other" ? note || label : note ? `${label} — ${note}` : label;
}

export function isoDate(value) {
  return value ? moment(value).format("YYYY-MM-DD") : null;
}

export function timeRange(start, end) {
  return `${start ?? ""} – ${end ?? ""}`;
}

// The program kind's label: «دمج» / «نهاري (الصفوف)» / «عيادات».
export function programName(t, program) {
  if (program.kind !== "inclusion") return t(`work_type_${program.kind}`);
  const type = program.inclusion_type === "supervision" ? t("sp_inclusion_supervision") : t("sp_inclusion_program");
  return `${t("work_type_inclusion")} — ${type}${program.inclusion_english ? ` (${t("sp_english")})` : ""}`;
}
