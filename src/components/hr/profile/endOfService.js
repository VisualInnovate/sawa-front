// The settlement lines' labels and the printed settlement (مخالصة) of an end of service.
import moment from "moment";
import { escapeHtml as esc, PRINT_STYLE, printHtml } from "@/utils/printHtml";

// Dates and numbers kept left-to-right inside Arabic text.
const ltr = (text) => `\u2066${text}\u2069`;

export function eosLineLabel(t, line) {
  const d = line.detail ?? {};
  switch (line.key) {
    case "award":
      return d.factor < 1 ? t("eos.line_award_part", { years: d.years, part: Math.round(d.factor * 100) }) : t("eos.line_award", { years: d.years });
    case "leave":
      return t("eos.line_leave", { days: d.days, title: d.title });
    case "last_month":
      return t("eos.line_last_month", { days: d.days, month: ltr(d.month) });
    default:
      return t(`eos.line_${line.key}`);
  }
}

/** Prints the settlement, ready to sign. */
export function printSettlement(t, { record, employee, locale }) {
  const rtl = locale === "ar";
  const currency = record.currency === "SAR" ? t("vac.sar") : t("vac.jod");
  const money = (v) => Number(v ?? 0).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const items = record.lines?.items ?? [];
  const rows = [...items.map((line) => [eosLineLabel(t, line), line.amount]), ...(Number(record.adjustment) ? [[t("eos.adjustment"), record.adjustment]] : [])]
    .map(([label, amount]) => `<tr><td>${esc(label)}</td><td class="num">${money(amount)}</td></tr>`).join("");
  printHtml(`<!doctype html><html lang="${rtl ? "ar" : "en"}" dir="${rtl ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${esc(t("eos.settlement"))}</title>
<style>${PRINT_STYLE}</style></head><body>
<h1>${esc(t("eos.settlement"))}</h1><div class="muted">${esc(t("eos.printed_on"))} ${moment().format("YYYY-MM-DD")}</div>
<div class="meta"><div>${esc(t("eos.employee"))}: <b>${esc(employee.name)}</b></div><div>${esc(t("eos.type"))}: <b>${esc(t(`eos.type_${record.type}`))}</b></div>
<div>${esc(t("eos.since"))}: <b dir="ltr">${esc(record.lines?.start ?? "—")}</b></div><div>${esc(t("eos.last_day"))}: <b dir="ltr">${esc(moment(record.last_day).format("YYYY-MM-DD"))}</b></div>
<div>${esc(t("eos.service", { years: record.lines?.years ?? 0, days: record.service_days }))}</div><div>${esc(t("eos.wage"))}: <b>${money(record.wage)} ${esc(currency)}</b></div></div>
<table><thead><tr><th>${esc(t("eos.item"))}</th><th class="num">${esc(t("eos.amount"))} (${esc(currency)})</th></tr></thead><tbody>${rows}
<tr class="total"><td>${esc(t("eos.total"))}</td><td class="num">${money(record.total)}</td></tr></tbody></table>
${record.notes ? `<p class="muted">${esc(t("eos.notes"))}: ${esc(record.notes)}</p>` : ""}
<div class="sign"><div>${esc(t("eos.sign_employee"))}</div><div>${esc(t("eos.sign_hr"))}</div></div></body></html>`);
}
