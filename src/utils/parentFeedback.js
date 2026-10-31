import axios from "axios";

// «ملاحظات أولياء الأمور»: the kinds a parent may send and the states the management moves them through.
export const FEEDBACK_TYPES = ["note", "complaint", "suggestion", "inquiry"];
export const FEEDBACK_STATUSES = ["new", "in_progress", "closed"];
export const FEEDBACK_ICONS = { note: "pi pi-pencil", complaint: "pi pi-exclamation-circle", suggestion: "pi pi-lightbulb", inquiry: "pi pi-question-circle" };
export const STATUS_SEVERITY = { new: "info", in_progress: "warn", closed: "success" };
export const ATTACHMENT_ACCEPT = ".jpg,.jpeg,.png,.webp,.pdf";
export const ATTACHMENT_MAX_MB = 5;

// The attachment is private: fetched with the signed-in token, then opened in a new tab.
export async function openAttachment(url) {
  const tab = window.open("", "_blank");
  try {
    const { data } = await axios.get(url, { responseType: "blob" });
    const href = URL.createObjectURL(data);
    if (tab) tab.location.href = href;
    else window.location.href = href;
    setTimeout(() => URL.revokeObjectURL(href), 60_000);
  } catch (error) {
    tab?.close();
    throw error;
  }
}
