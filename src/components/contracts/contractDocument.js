// A contract as a printable A4 page: header lines, title, body (its numbered list = the clauses), the two parties'
// signature boxes and the approval note. Without `values` the {{variables}} show as labelled chips (template preview).
import { escapeHtml } from "@/utils/printHtml";
import { siteLogo } from "@/utils/siteBrand";

export const VARIABLE_PATTERN = /\{\{\s*([^{}\s]+)\s*\}\}/g;

/** The clauses: the items of the top-level numbered lists. */
export function clauseCount(html) {
  const doc = new DOMParser().parseFromString(`<div>${html || ""}</div>`, "text/html");
  return [...doc.body.firstElementChild.children].filter((el) => el.tagName === "OL").reduce((n, ol) => n + [...ol.children].filter((li) => li.tagName === "LI").length, 0);
}

/** {{names}} in a text, each once. */
export function usedVariables(text) {
  return [...new Set([...String(text || "").matchAll(VARIABLE_PATTERN)].map((m) => m[1]))];
}

const STYLE = `@page{size:A4;margin:14mm 16mm}*{box-sizing:border-box}
body{font-family:Cairo,Tahoma,Arial,sans-serif;color:#111827;margin:0;font-size:13.5px;line-height:1.75;direction:rtl}
.page{max-width:180mm;margin:0 auto;padding:8mm 0;position:relative}
.head{display:grid;grid-template-columns:70px 1fr 70px;align-items:center;gap:12px;border-bottom:2px solid #135c65;padding-bottom:8px}
.head img{max-width:70px;max-height:70px;object-fit:contain}.lines{text-align:center;font-weight:700;line-height:1.6}
.lines div:first-child{font-size:17px;color:#135c65}.title{text-align:center;font-size:16px;font-weight:800;margin:10px 0 6px}
.body p{margin:4px 0}.body ol{margin:6px 0;padding-inline-start:22px}.body li{margin:3px 0}.body ul{list-style:"✓  ";padding-inline-start:22px}
.body .ql-align-center{text-align:center}.body .ql-align-left{text-align:left}.body .ql-align-justify{text-align:justify}
.val{unicode-bidi:isolate;font-weight:700}
.var{background:#e0f2f1;color:#0f5132;border:1px dashed #5aa59c;border-radius:4px;padding:0 4px;font-size:12px;white-space:nowrap}
.var.bad{background:#fee2e2;color:#991b1b;border-color:#f87171}.blank{display:inline-block;min-width:90px;border-bottom:1px dotted #6b7280}
.sign{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:28px;break-inside:avoid}
.party{text-align:center;font-weight:700}.party .ink{height:76px;display:flex;align-items:flex-end;justify-content:center}
.party .ink img{max-height:72px;max-width:100%;object-fit:contain}.party .who{border-top:1px solid #9ca3af;padding-top:6px}
.party small{display:block;font-weight:500;color:#4b5563;font-size:11px}
.proof{margin-top:16px;border:1px solid #d1d5db;border-radius:6px;padding:6px 10px;font-size:10.5px;color:#374151;display:flex;flex-wrap:wrap;gap:4px 16px}
.proof b{unicode-bidi:isolate;direction:ltr}
.note{margin-top:18px;font-size:11px;color:#6b7280;text-align:start}
.mark{position:fixed;top:42%;left:0;right:0;text-align:center;font-size:72px;font-weight:900;color:rgba(185,28,28,.12);transform:rotate(-24deg);pointer-events:none}
@media screen{body{background:#f1f5f9}.page{background:#fff;padding:14mm 16mm;margin:16px auto;box-shadow:0 1px 6px rgba(0,0,0,.12)}}
@media screen and (max-width:640px){.page{padding:16px;margin:0}.head{grid-template-columns:48px 1fr}.head img{max-width:48px}.head span{display:none}.sign{gap:16px}}`;

/**
 * template: { header, title, body, approval_note }; options.labels: { name: label } for the chips;
 * options.values: { name: value } to fill; options.mark: the watermark («غير معتمد»); options.parties: [first, second];
 * options.signatures: { academy, recipient } each { image, name, at }; options.proof: [[label, value]] printed under them.
 */
export function contractDocument(template, { labels = {}, values = null, mark = "", parties = ["الفريق الأول", "الفريق الثاني"], signatures = {}, proof = [] } = {}) {
  const fill = (html) => String(html || "").replace(VARIABLE_PATTERN, (all, name) => {
    if (values && values[name] !== undefined && values[name] !== null && String(values[name]).trim() !== "") return `<span class="val">${escapeHtml(values[name])}</span>`;
    if (values) return `<span class="blank"></span>`;
    return `<span class="var${labels[name] ? "" : " bad"}">${escapeHtml(labels[name] || name)}</span>`;
  });
  const lines = String(template.header || "").split("\n").map((l) => l.trim()).filter(Boolean).map((l) => `<div>${fill(escapeHtml(l))}</div>`).join("");
  const logo = siteLogo();
  const when = (iso) => (iso ? new Date(iso).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" }) : "");
  const party = (label, sig) => `<div class="party"><div class="ink">${sig?.image ? `<img src="${escapeHtml(sig.image)}" alt="">` : ""}</div>
<div class="who">${escapeHtml(label)}${sig?.name ? `<small>${escapeHtml(sig.name)}</small>` : ""}${sig?.at ? `<small dir="ltr">${escapeHtml(when(sig.at))}</small>` : ""}</div></div>`;

  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>${escapeHtml(template.name || template.title || "")}</title><style>${STYLE}</style></head>
<body><div class="page">${mark ? `<div class="mark">${escapeHtml(mark)}</div>` : ""}
<div class="head"><img src="${escapeHtml(logo)}" alt=""><div class="lines">${lines}</div><span></span></div>
${template.title ? `<div class="title">${fill(escapeHtml(template.title))}</div>` : ""}
<div class="body">${fill(template.body)}</div>
<div class="sign">${party(parties[0], signatures.academy)}${party(parties[1], signatures.recipient)}</div>
${proof.length ? `<div class="proof">${proof.map(([k, v]) => `<span>${escapeHtml(k)}: <b>${escapeHtml(v)}</b></span>`).join("")}</div>` : ""}
${template.approval_note ? `<div class="note">${fill(escapeHtml(template.approval_note))}</div>` : ""}
</div></body></html>`;
}
