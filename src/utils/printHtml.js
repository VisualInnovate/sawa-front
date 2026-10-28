// Prints a whole HTML document through a hidden frame: no pop-up window (which browsers may block).
export function printHtml(html) {
  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.style.cssText = "position:fixed;width:0;height:0;border:0;inset-inline-start:-9999px";
  frame.srcdoc = html;
  frame.onload = () => {
    frame.contentWindow.focus();
    frame.contentWindow.print();
    setTimeout(() => frame.remove(), 60000);
  };
  document.body.appendChild(frame);
}

export const escapeHtml = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

/** The shared look of printed HR papers (settlement, payslip). */
export const PRINT_STYLE = `body{font-family:Cairo,Tahoma,sans-serif;margin:32px;color:#1f2937}h1{font-size:22px;margin:0 0 4px}.muted{color:#6b7280;font-size:13px}
table{width:100%;border-collapse:collapse;margin-top:18px;font-size:14px}td,th{border:1px solid #d1d5db;padding:8px}th{background:#f3f4f6;text-align:start}
.num{text-align:end;direction:ltr;unicode-bidi:isolate;white-space:nowrap}.total td{font-weight:700;background:#f9fafb}.minus{color:#b91c1c}
.meta{display:grid;grid-template-columns:1fr 1fr;gap:6px 24px;margin-top:16px;font-size:14px}.sign{display:grid;grid-template-columns:1fr 1fr;gap:48px;margin-top:64px}
.sign div{border-top:1px solid #9ca3af;padding-top:6px;text-align:center;font-size:13px}@media print{body{margin:16mm}}`;
