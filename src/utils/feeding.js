// «برنامج الطعام»: the rules come from the server (api/feeding/meta) so the pages and the backend agree.
import axios from "axios";
import { ref } from "vue";

const meta = ref(null);
let loading = null;

export function useFeedingMeta() {
  if (!meta.value && !loading) {
    loading = axios.get("api/feeding/meta").then(({ data }) => (meta.value = data.data)).finally(() => (loading = null));
  }
  return meta;
}

export const STATE_SEVERITY = { full: "success", partial: "warn", refused: "danger" };
export const DAY_SEVERITY = { present: "success", absent: "danger", late: "warn", holiday: "secondary", left_early: "warn" };

/** Locale key of a quantity (0, 0.25 … 1). */
export const quantityKey = (q) => `feeding.q_${String(q).replace(".", "")}`;
export const percent = (value) => (value == null ? "—" : `${Math.round(value * 100)}%`);
export const today = () => new Date().toLocaleDateString("en-CA");
export const thisMonth = () => today().slice(0, 7);

export function errorText(t, error) {
  const errors = error?.response?.data?.errors;
  return errors ? Object.values(errors).flat()[0] : error?.response?.data?.message ?? t("mission_error");
}
