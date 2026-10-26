// «جداول الموظفين» / «جدولي» / the parent's weekly schedule: item types, their colors, statuses and the week helpers.
import moment from "moment";

// What takes an employee's time, each with its color (background / border / text).
export const ITEM_TYPES = {
  session: { icon: "pi pi-users", bg: "#e0f2f1", border: "#135c65", text: "#0b3f45" },
  inclusion: { icon: "pi pi-sitemap", bg: "#ede7f6", border: "#6a3fb5", text: "#3d2370" },
  evaluation: { icon: "pi pi-clipboard", bg: "#fff4e0", border: "#d9822b", text: "#7a4310" },
  consultation: { icon: "pi pi-comments", bg: "#e3f0fd", border: "#2f6fcf", text: "#163d78" },
  meeting: { icon: "pi pi-calendar", bg: "#fce4ec", border: "#c2185b", text: "#6d0f33" },
  availability: { icon: "pi pi-clock", bg: "#f5f6f7", border: "#9aa5ad", text: "#4b5563" },
};

// Statuses that need attention get their own mark on the item.
export const STATUS_SEVERITY = {
  closed: "secondary", waiting: "info", late: "warn", ongoing: "success", finished: "contrast", missed: "danger", compensated: "secondary",
  awaiting: "warn", in_progress: "info", booked: "info", open: "secondary",
};

// Flags from the backend: what is wrong or special about an item.
export const FLAG_META = {
  conflict: { icon: "pi pi-exclamation-circle", severity: "danger" },
  outside_shift: { icon: "pi pi-sign-out", severity: "warn" },
  holiday: { icon: "pi pi-sun", severity: "danger" },
  postponed: { icon: "pi pi-history", severity: "info" },
  makeup: { icon: "pi pi-replay", severity: "info" },
  tentative: { icon: "pi pi-hourglass", severity: "warn" },
  suspended: { icon: "pi pi-pause", severity: "danger" },
  unpaid: { icon: "pi pi-lock", severity: "warn" },
  not_started: { icon: "pi pi-stopwatch", severity: "danger" },
};

export const ATTENTION_FLAGS = ["conflict", "outside_shift", "holiday", "suspended", "not_started"];
export const ATTENTION_STATUSES = ["late", "missed"];

export function needsAttention(item) {
  return ATTENTION_STATUSES.includes(item.status) || (item.flags ?? []).some((flag) => ATTENTION_FLAGS.includes(flag));
}

// Sunday of the date's week (the centre's week starts on Sunday).
export function weekStart(date = new Date()) {
  return moment(date).startOf("day").subtract(moment(date).day(), "days").toDate();
}

export function weekRange(start) {
  return { from: moment(start).format("YYYY-MM-DD"), to: moment(start).add(6, "days").format("YYYY-MM-DD") };
}

// The days of from–to as the grid reads them ({date, weekday}); the backend adds shift / load for employees.
export function daysOf(from, to) {
  const days = [];
  for (let date = moment(from); date.isSameOrBefore(to, "day"); date.add(1, "day")) days.push({ date: date.format("YYYY-MM-DD"), weekday: date.day() });
  return days;
}

export function holidayOn(holidays, date) {
  return (holidays ?? []).find((holiday) => holiday.from <= date && date <= holiday.to) ?? null;
}

export function minutesOf(time) {
  if (!time) return null;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function formatMinutes(t, minutes) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? t("sch.hours_minutes", { hours, minutes: rest }) : t("sch.hours", { hours });
}

// The item's main line: the child (or the title of a calendar entry).
export function itemTitle(t, item) {
  if (item.child?.name) return item.child.name;
  if (item.type === "availability") return t("sch.open_time");
  return item.title || t(`sch.type_${item.type}`);
}

// What kind of item it is, in words: the treatment and session kind, the inclusion type, the evaluation …
export function itemSubtitle(t, item, evaluationName) {
  switch (item.type) {
    case "session":
      return [item.treatment, item.kind ? t(`sp_session_${item.kind}`) : null].filter(Boolean).join(" · ");
    case "inclusion":
      return item.kind === "supervision" ? t("sp_inclusion_supervision") : t("sp_inclusion_program");
    case "evaluation":
      return evaluationName ? evaluationName(item.evaluation_type) : t("sch.type_evaluation");
    case "availability":
      return (item.event_types ?? []).map((type) => t(`event_type.${type}`)).join("، ");
    default:
      return item.title && item.child?.name ? item.title : t(`sch.type_${item.type}`);
  }
}

export function statusLabel(t, item) {
  if (!item.status) return "";
  if (item.type === "session" && item.status !== "compensated") return t(`session_status_${item.status}`);
  return t(`sch.status_${item.status}`);
}

/**
 * Places a day's timed items side by side when they overlap: each gets {lane, lanes} (its column and how many columns
 * its group of overlapping items needs).
 */
export function layoutDay(items) {
  const sorted = [...items].sort((a, b) => minutesOf(a.start) - minutesOf(b.start) || minutesOf(b.end) - minutesOf(a.end));
  const placed = [];
  let group = [];
  let groupEnd = -1;
  const close = () => {
    const lanes = Math.max(1, ...group.map((item) => item.lane + 1));
    group.forEach((item) => { item.lanes = lanes; });
    group = [];
  };
  for (const source of sorted) {
    const item = { ...source, from: minutesOf(source.start), to: Math.max(minutesOf(source.end), minutesOf(source.start) + 15) };
    if (item.from >= groupEnd) close();
    const taken = group.filter((other) => other.to > item.from).map((other) => other.lane);
    item.lane = 0;
    while (taken.includes(item.lane)) item.lane++;
    group.push(item);
    placed.push(item);
    groupEnd = Math.max(groupEnd, item.to);
  }
  close();
  return placed;
}
