// The printed payslip of one payroll: what it paid and took, line by line.
import axios from "axios";
import moment from "moment";
import { escapeHtml as esc, PRINT_STYLE, printHtml } from "@/utils/printHtml";

export async function printPayslip(t, payrollId, locale) {
  const { data } = await axios.get(`api/payroll/${payrollId}/slip`);
  const s = data.data;
  const p = s.payroll;
  const rtl = locale === "ar";
  const currency = s.currency === "SAR" ? t("vac.sar") : t("vac.jod");
  const money = (v) => Number(v ?? 0).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const row = (label, amount, minus = false, detail = "") =>
    `<tr><td>${esc(label)}${detail ? `<div class="muted">${esc(detail)}</div>` : ""}</td><td class="num${minus ? " minus" : ""}">${minus ? "−" : ""}${money(amount)}</td></tr>`;

  const lines = [
    row(t("slip.basic"), p.base_salary),
    ...s.overtimes.map((x) => row(t("slip.overtime"), x.amount, false, `${x.date}${x.notes ? " · " + x.notes : ""}`)),
    ...s.bonuses.map((x) => row(t("slip.bonus"), x.amount, false, `${x.date}${x.reason ? " · " + x.reason : ""}`)),
    ...s.deductions.map((x) => row(t("slip.deduction"), x.amount, true, `${x.date}${x.reason ? " · " + x.reason : ""}`)),
    ...s.advances.map((x) => row(t("slip.advance"), x.amount, true, x.date)),
    ...s.installments.map((x) => row(t("slip.installment"), x.amount, true, t("slip.installment_of", { month: x.month, total: money(x.advance?.amount), n: x.advance?.installments }))),
    ...(Number(p.insurance) ? [row(t("slip.insurance", { rate: s.insurance_rates.insurance_rate }), p.insurance, true)] : []),
  ].join("");

  printHtml(`<!doctype html><html lang="${rtl ? "ar" : "en"}" dir="${rtl ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${esc(t("slip.title"))}</title>
<style>${PRINT_STYLE}</style></head><body>
<h1>${esc(t("slip.title"))} — <span dir="ltr">${esc(p.month)}</span></h1><div class="muted">${esc(t("eos.printed_on"))} ${moment().format("YYYY-MM-DD")}</div>
<div class="meta"><div>${esc(t("eos.employee"))}: <b>${esc(p.employee?.name)}</b></div><div>${esc(t("prof.national_id"))}: <b dir="ltr">${esc(p.employee?.national_id ?? "—")}</b></div>
<div>${esc(t("prof.department"))}: <b>${esc(p.employee?.department?.title ?? "—")}</b></div><div>${esc(t("slip.job"))}: <b>${esc(p.employee?.job_title ?? "—")}</b></div>
<div>${esc(t("slip.bank"))}: <b>${esc(s.bank ?? "—")}</b></div><div>IBAN: <b dir="ltr">${esc(p.employee?.iban ?? "—")}</b></div></div>
<table><thead><tr><th>${esc(t("eos.item"))}</th><th class="num">${esc(t("eos.amount"))} (${esc(currency)})</th></tr></thead><tbody>${lines}
<tr class="total"><td>${esc(t("slip.net"))}</td><td class="num">${money(p.total_salary)}</td></tr></tbody></table>
${Number(p.insurance_employer) ? `<p class="muted">${esc(t("slip.employer_share", { amount: money(p.insurance_employer), currency }))}</p>` : ""}
<div class="sign"><div>${esc(t("eos.sign_employee"))}</div><div>${esc(t("eos.sign_hr"))}</div></div></body></html>`);
}
