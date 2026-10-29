// The printed payslip of one payroll row: the salary and allowances, the extras paid with it, then what it took
// (deductions, social insurance, health insurance, life fund, tax, the advance installment), and the net.
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
    Number(amount) ? `<tr><td>${esc(label)}${detail ? `<div class="muted">${esc(detail)}</div>` : ""}</td><td class="num${minus ? " minus" : ""}">${minus ? "−" : ""}${money(amount)}</td></tr>` : "";
  const withSalary = p.extra_paid !== "separate";
  const separate = withSalary ? 0 : Number(p.fixed_extra) + Number(p.variable_extra);

  const lines = [
    row(t("slip.basic"), p.base_salary),
    row(t("run.c.housing"), p.housing),
    row(t("run.c.transport"), p.transport),
    row(t("run.c.other_allowance"), p.other_allowance),
    withSalary ? row(t("run.c.fixed_extra"), p.fixed_extra, false, p.fixed_extra_note) : "",
    withSalary ? row(t("run.c.variable_extra"), p.variable_extra, false, p.variable_extra_note) : "",
    row(t("slip.deduction"), p.deduction, true, p.deduction_note),
    row(t(s.country === "SA" ? "slip.gosi" : "slip.ssc"), p.insurance, true),
    row(t("run.c.health_insurance"), p.health_insurance, true),
    row(t("run.c.life_fund"), p.life_fund, true),
    row(t("run.c.income_tax"), p.income_tax, true),
    row(t("slip.installment"), p.financial_advance, true, s.installments.map((x) => t("slip.installment_of", { month: x.month, total: money(x.advance?.amount) })).join(" · ")),
  ].join("");

  printHtml(`<!doctype html><html lang="${rtl ? "ar" : "en"}" dir="${rtl ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${esc(t("slip.title"))}</title>
<style>${PRINT_STYLE}</style></head><body>
<h1>${esc(t("slip.title"))} — <span dir="ltr">${esc(p.month)}</span></h1><div class="muted">${esc(t("eos.printed_on"))} ${moment().format("YYYY-MM-DD")}</div>
<div class="meta"><div>${esc(t("eos.employee"))}: <b>${esc(p.employee?.name)}</b></div><div>${esc(t("prof.national_id"))}: <b dir="ltr">${esc(p.employee?.national_id ?? "—")}</b></div>
<div>${esc(t("prof.department"))}: <b>${esc(p.employee?.department?.title ?? "—")}</b></div><div>${esc(t("slip.job"))}: <b>${esc(p.employee?.job_title ?? "—")}</b></div>
<div>${esc(t("slip.bank"))}: <b>${esc(p.payment_method === "cheque" ? t("run.pm_cheque") : s.bank ?? "—")}</b></div><div>IBAN: <b dir="ltr">${esc(p.employee?.iban ?? "—")}</b></div></div>
<table><thead><tr><th>${esc(t("eos.item"))}</th><th class="num">${esc(t("eos.amount"))} (${esc(currency)})</th></tr></thead><tbody>${lines}
<tr class="total"><td>${esc(t("slip.net"))}</td><td class="num">${money(p.total_salary)}</td></tr></tbody></table>
${separate ? `<p>${esc(t("slip.separate_extras", { amount: money(separate), currency }))}</p>` : ""}
${p.notes ? `<p class="muted">${esc(p.notes)}</p>` : ""}
${Number(p.insurance_employer) ? `<p class="muted">${esc(t("slip.employer_share", { amount: money(p.insurance_employer), currency }))}</p>` : ""}
<div class="sign"><div>${esc(t("eos.sign_employee"))}</div><div>${esc(t("eos.sign_hr"))}</div></div></body></html>`);
}
