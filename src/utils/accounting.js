// «المحاسبة»: the currency every amount shows (set by the accountant), labels and colours of the statuses.
import axios from "axios";
import { ref } from "vue";
import { money } from "@/utils/programFees";
import { programName } from "@/utils/studentPrograms";

export const currency = ref({ currency_symbol: "JD", currency_name: "دينار", consultation_paid: "0", consultation_price: "0" });

let loading = null;

// Loaded once per page load; `force` after the settings change.
export function loadCurrency(force = false) {
  if (!loading || force) {
    loading = axios.get("api/accounting/currency")
      .then(({ data }) => { currency.value = { ...currency.value, ...data.data }; })
      .catch(() => {});
  }
  return loading;
}

// "1,250 JD"
export function amount(value) {
  if (value == null || value === "") return "";
  return `${money(value)} ${currency.value.currency_symbol}`;
}

export const PAYMENT_METHODS = ["cash", "cliq", "bank", "cheque", "card", "balance"];

export const programStatusSeverity = { tentative: "warn", confirmed: "success", unconfirmed: "danger", stopped: "secondary" };

export const installmentSeverity = { paid: "success", late: "danger", due: "warn", upcoming: "info", cancelled: "secondary" };

export const billingSeverity = { free: "success", locked: "warn", paid: "success", confirmed: "info", cancelled: "danger" };

export const creditSeverity = { pending: "warn", credit: "success", refunded: "info", dismissed: "secondary" };

export const chargeSeverity = { open: "warn", paid: "success", cancelled: "secondary" };

// Today as yyyy-mm-dd (local time).
export function today() {
  const date = new Date();
  return isoDate(date);
}

export function isoDate(date) {
  if (!date) return null;
  if (typeof date === "string") return date.slice(0, 10);
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Installments from a total: `count` of them every `every` (week | month | days with `days`), starting `start`;
// the cents left over go on the last one.
export function generateInstallments(total, count, start, every = "month", days = 30) {
  const rows = [];
  const n = Math.max(1, Number(count) || 1);
  const each = Math.floor((Number(total) / n) * 100) / 100;
  const first = new Date(`${isoDate(start) ?? today()}T00:00:00`);
  for (let i = 0; i < n; i++) {
    const date = new Date(first);
    if (every === "week") date.setDate(date.getDate() + 7 * i);
    else if (every === "days") date.setDate(date.getDate() + Number(days || 1) * i);
    else date.setMonth(date.getMonth() + i);
    rows.push({ due_date: isoDate(date), amount: i === n - 1 ? Math.round((Number(total) - each * (n - 1)) * 100) / 100 : each });
  }
  return rows;
}

// What a charge is for: the program's kind, or its description (evaluation, consultation, manual fee).
export function chargeTitle(t, charge) {
  if (charge.source === "program" && charge.program) return `${t("acc.source.program")}: ${programName(t, charge.program)}`;
  return charge.description || t(`acc.source.${charge.source}`);
}

// The first validation message of a failed request (or its message).
export function errorText(error) {
  const data = error?.response?.data ?? {};
  const first = data.errors ? Object.values(data.errors).flat()[0] : null;
  return first || data.message || error?.message || "";
}

// The booking forms: whether the child is registered (a confirmed program: evaluations are free) and each type's price.
export async function evaluationPricing(childId, date) {
  if (!childId) return null;
  try {
    const { data } = await axios.get(`api/evaluation-request/pricing/${childId}`, { params: date ? { date } : {} });
    return data.data;
  } catch {
    return null;
  }
}

// An evaluation type in a booking form: closed (no price, child not registered), free, or its price.
export function evaluationTypeState(t, pricing, type) {
  if (!pricing) return { disabled: false, note: "" };
  if (pricing.registered) return { disabled: false, note: t("acc.free_for_registered") };
  const price = pricing.prices?.[type];
  if (price == null) return { disabled: true, note: t("acc.no_price_closed") };
  return { disabled: false, note: amount(price) };
}

// A server timestamp (UTC) in local time: "2026-10-28 05:04".
export function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 16);
  return `${isoDate(date)} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
