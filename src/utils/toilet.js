// «برنامج الحمام»: the rules come from the server (api/toilet-programs/meta) so the pages and the backend agree.
import axios from "axios";
import { ref } from "vue";

const meta = ref(null);
let loading = null;

export function useToiletMeta() {
  if (!meta.value && !loading) {
    loading = axios.get("api/toilet-programs/meta").then(({ data }) => (meta.value = data.data)).finally(() => (loading = null));
  }
  return meta;
}

export const TRACK_ICONS = { training: "pi pi-flag", weekly: "pi pi-calendar", diaper: "pi pi-clock" };
export const TRACK_SEVERITY = { training: "success", weekly: "info", diaper: "warn" };
export const STATUS_SEVERITY = {
  assessment: "info", dryness: "info", consent: "warn", training: "success", active: "success", completed: "secondary", cancelled: "danger",
};
export const BAND_SEVERITY = { low: "success", medium: "warn", high: "danger" };
export const CONSULT_SEVERITY = { pending: "secondary", ready: "success", not_ready: "danger" };

/** The training track's steps, in order, for the progress bar. */
export const TRAINING_STEPS = ["assessment", "dryness", "consent", "training", "completed"];

export function ageText(t, months) {
  if (months == null) return "";
  const years = Math.floor(months / 12);
  return years ? t("toilet.age_years", { y: years, m: months % 12 }) : t("toilet.age_months", { m: months });
}

export function minutesText(t, minutes) {
  if (minutes == null) return t("toilet.on_request");
  if (minutes < 60) return t("toilet.every_min", { n: minutes });
  if ([60, 75, 90, 120, 150, 180, 240].includes(minutes)) return t(`toilet.every_known.${minutes}`);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? t("toilet.every_hm", { h, m }) : t("toilet.every_h", { h });
}

export const today = () => new Date().toLocaleDateString("en-CA");
export const nowTime = () => new Date().toTimeString().slice(0, 5);

export function errorText(t, error) {
  const errors = error?.response?.data?.errors;
  return errors ? Object.values(errors).flat()[0] : error?.response?.data?.message ?? t("mission_error");
}
