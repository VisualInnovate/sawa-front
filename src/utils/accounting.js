// «المحاسبة»: the currency every amount shows (set by the accountant), labels and colours of the statuses.
import axios from "axios";
import { ref } from "vue";
import { money } from "@/utils/programFees";
import { programName } from "@/utils/studentPrograms";
import i18n from "@/plugins/i18n";

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

// An installment as a tag: "2026-11-15 · 316 JD · الخصم 35.11 JD" (its discount when it has one; no brackets, which
// right-to-left text turns around).
export function installmentText(row) {
  return `${row.due_date} · ${amount(row.amount)}${row.discount > 0 ? ` · ${i18n.global.t("acc.discount")} ${amount(row.discount)}` : ""}`;
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

const cents = (value) => Math.round(Number(value) * 100) / 100;

// A discount on `base`: a percent of it or an amount, never more than it.
export function discountOn(base, type, value) {
  const raw = type === "percent" ? base * Math.min(100, Math.max(0, Number(value) || 0)) / 100 : type === "amount" ? Math.max(0, Number(value) || 0) : 0;
  return cents(Math.min(base, raw));
}

// `discount` spread over the rows by their `weight` (base or amount): over the ones marked `discounted`, or over all
// of them when none is; the cents left over go on the last one (as the backend). Each row's share.
export function spreadDiscount(rows, discount, weight) {
  let chosen = rows.map((row, i) => (row.discounted ? i : -1)).filter((i) => i >= 0);
  if (!chosen.length) chosen = rows.map((_, i) => i);
  const total = chosen.reduce((sum, i) => sum + Number(rows[i][weight] || 0), 0);
  const shares = rows.map(() => 0);
  let left = cents(discount || 0);
  chosen.forEach((i, n) => {
    const share = n === chosen.length - 1 ? left : cents(total > 0 ? discount * Number(rows[i][weight] || 0) / total : 0);
    shares[i] = share;
    left = cents(left - share);
  });
  return shares;
}

// Each installment's discount while the accountant sets it (as the backend): on the total, its discount spread over
// them all by their value before it; on chosen installments, a percent of each chosen one or the amount off each.
export function installmentDiscounts(rows, target, type, value) {
  if (!type || type === "none") return rows.map(() => 0);
  if (target === "installments") return rows.map((row) => (row.discounted ? discountOn(Number(row.base || 0), type, value) : 0));
  const total = cents(rows.reduce((sum, row) => sum + Number(row.base || 0), 0));
  return spreadDiscount(rows.map((row) => ({ ...row, discounted: false })), discountOn(total, type, value), "base");
}

// A program charge month by month (as the backend's monthlyPlan): each month's base, its share of every line
// (scaled to what the line is now).
export function monthlyPlan(months, lines) {
  const count = months?.length ?? 0;
  if (!count) return [];
  const bases = Array(count).fill(0);
  lines.forEach((line, i) => {
    const key = line.key ?? (line.type === "program" ? "program" : `l${i}`);
    const total = cents(line.amount || 0);
    const parts = months.map((row) => Number(row.parts?.[key] ?? 0));
    const sum = parts.reduce((a, b) => a + b, 0);
    const shares = parts.map((part) => cents(sum > 0 ? total * part / sum : total / count));
    const last = sum > 0 ? parts.reduce((at, part, index) => (part ? index : at), 0) : count - 1;
    shares[last] = cents(shares[last] + total - shares.reduce((a, b) => a + b, 0));
    shares.forEach((share, index) => { bases[index] += share; });
  });
  return months.map((row, index) => ({ ...row, base: cents(bases[index]) }));
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
