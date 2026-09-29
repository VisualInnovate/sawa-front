// Prints home recommendations as a clean A4 sheet through a hidden iframe, so no pop-up window is needed.
// texts: the recommendations already in display order.
// The settings page prints a blank sheet (genderLabel = which wording, name and date left to fill in by hand);
// a child's page passes childName and date, and its texts already carry the child's name.
import sawaLogo from "@/assets/img/sawa_logo.svg";

const escape = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// {{name}} (any {{...}}) becomes a blank the staff can fill in by hand.
const withBlank = (text) => escape(text).replace(/\{\{.*?\}\}/g, '<span class="blank"></span>');

export function printRecommendations({ texts, genderLabel = null, childName = null, date = null, t }) {
  const dir = document.documentElement.dir || "rtl";
  const lang = document.documentElement.lang || "ar";
  const logo = new URL(sawaLogo, window.location.href).href;

  const rows = texts
    .map((text, i) => `<li class="item"><span class="num">${i + 1}</span><p>${withBlank(text)}</p></li>`)
    .join("");

  const html = `<!doctype html>
<html lang="${escape(lang)}" dir="${dir}">
<head>
<meta charset="utf-8">
<title>${escape(t("rec_print.title"))}${childName ? " - " + escape(childName) : ""}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 14mm 14mm 16mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; }
  body {
    font-family: "Cairo", "Segoe UI", Tahoma, sans-serif;
    color: #1e293b;
    font-size: 13pt;
    line-height: 1.85;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding-bottom: 12px;
    border-bottom: 3px solid #135c65;
  }
  .head img { height: 64px; }
  .academy { font-size: 12pt; font-weight: 700; color: #135c65; }
  .academy small { display: block; font-weight: 400; color: #64748b; font-size: 10pt; }
  h1 { margin: 20px 0 14px; text-align: center; font-size: 20pt; font-weight: 800; color: #135c65; }
  .meta {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px 28px;
    margin-bottom: 18px;
    padding: 10px 16px;
    border: 1px solid #d5e6e8;
    border-radius: 10px;
    background: #f3f9fa;
    font-size: 11.5pt;
  }
  .meta b { color: #135c65; margin-inline-end: 6px; }
  .line { display: inline-block; min-width: 150px; border-bottom: 1px dotted #64748b; }
  ol { list-style: none; margin: 0; padding: 0; }
  .item {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 9px 4px;
    border-bottom: 1px dashed #cbd5e1;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .item:last-child { border-bottom: 0; }
  .num {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    margin-top: 3px;
    border-radius: 50%;
    background: #135c65;
    color: #fff;
    font-weight: 700;
    font-size: 11pt;
  }
  .item p { margin: 0; white-space: pre-line; overflow-wrap: anywhere; }
  .ltr { direction: ltr; unicode-bidi: isolate; }
  .blank { display: inline-block; min-width: 90px; border-bottom: 1px dotted #64748b; }
  .foot {
    margin-top: 26px;
    padding-top: 10px;
    border-top: 1px solid #e2e8f0;
    text-align: center;
    color: #64748b;
    font-size: 10pt;
  }
</style>
</head>
<body>
  <header class="head">
    <div class="academy">${escape(t("academy_name"))}<small>${escape(t("rec_print.subtitle"))}</small></div>
    <img src="${logo}" alt="Sawa">
  </header>
  <h1>${escape(t("rec_print.title"))}</h1>
  <div class="meta">
    <span><b>${escape(t("child_name"))}:</b>${childName ? `<strong>${escape(childName)}</strong>` : '<span class="line"></span>'}</span>
    <span><b>${escape(t("rec_print.date"))}:</b>${date ? `<span class="ltr">${escape(date)}</span>` : '<span class="line"></span>'}</span>
    ${genderLabel ? `<span><b>${escape(t("rec_print.wording"))}:</b>${escape(genderLabel)}</span>` : `<span><b>${escape(t("rec_print.count"))}:</b>${texts.length}</span>`}
  </div>
  <ol>${rows}</ol>
  <div class="foot">${escape(t("rec_print.footer"))}</div>
</body>
</html>`;

  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.style.cssText = "position:fixed;width:0;height:0;border:0;right:0;bottom:0;visibility:hidden";
  document.body.appendChild(frame);

  const doc = frame.contentDocument;
  doc.open();
  doc.write(html);
  doc.close();

  const win = frame.contentWindow;
  const run = async () => {
    // Wait for the logo and the Arabic font so the sheet doesn't print with fallbacks.
    const img = doc.querySelector("img");
    await Promise.race([
      Promise.all([doc.fonts?.ready, img && !img.complete ? new Promise((r) => { img.onload = img.onerror = r; }) : null]),
      new Promise((r) => setTimeout(r, 2500)),
    ]);
    win.addEventListener("afterprint", () => setTimeout(() => frame.remove(), 1000), { once: true });
    win.focus();
    win.print();
  };
  if (doc.readyState === "complete") run();
  else win.addEventListener("load", run, { once: true });
}
