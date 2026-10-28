<script setup>
// A consultation's result as the consultant wrote it: the health and development notes, the recommendations,
// the home recommendations, printable and saved as PDF.
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { useStyleTag } from "@vueuse/core";
import html2pdf from "html2pdf.js";
import { fmtDate } from "@/utils/parentPortal";
import { brandHex } from "@/utils/siteBrand";

const props = defineProps({ booking: { type: Object, required: true } });
const { t } = useI18n();
const toast = useToast();
const content = ref(null);

// Literal colours (the brand ones as «إعدادات الموقع» has them): the print frame and html2pdf do not see the
// portal's CSS variables.
const styles = `
.cr{color:#1e293b;line-height:1.8;display:grid;gap:14px;font-family:"Cairo","Segoe UI",Tahoma,sans-serif}
.cr-header{background:${brandHex("#e9f4f5")};border-radius:14px;padding:16px 18px}
.cr-caption{margin:0;color:${brandHex("#1c6772")};font-size:13px;font-weight:700}
.cr-child{margin:2px 0 10px;font-size:20px;font-weight:800;color:${brandHex("#035b65")}}
.cr-meta{display:flex;flex-wrap:wrap;gap:8px}
.cr-chip{display:inline-flex;align-items:center;gap:6px;background:#fff;border:1px solid ${brandHex("#d2e8ea")};border-radius:999px;padding:3px 12px;font-size:13px}
.cr-chip-label{color:#6f6669}
.cr-section{border:1px solid #e5e2e1;border-inline-start:4px solid ${brandHex("#b21553")};border-radius:12px;padding:12px 16px;break-inside:avoid}
.cr-label{margin:0 0 6px;font-size:15px;font-weight:800;color:${brandHex("#1c6772")}}
.cr-text{margin:0;white-space:pre-line;overflow-wrap:anywhere}
.cr-list{margin:0;padding-inline-start:22px;display:grid;gap:6px;list-style:disc outside}
.cr-list li{display:list-item;line-height:1.8;overflow-wrap:anywhere}
.cr-list li::marker{color:${brandHex("#b21553")};font-weight:700}
.cr-empty{margin:0;text-align:center;color:#6f6669;padding:24px}
`;
useStyleTag(styles);

// Older rows hold the result as JSON text, some encoded twice; decode until it is an object.
const parseResult = (value) => {
  let parsed = value;
  for (let i = 0; i < 3 && typeof parsed === "string"; i++) {
    try { parsed = JSON.parse(parsed); } catch { return {}; }
  }
  return parsed && typeof parsed === "object" ? parsed : {};
};
const result = computed(() => parseResult(props.booking.consultation_result ?? props.booking.result));
const home = computed(() => (Array.isArray(result.value.filed_value) ? result.value.filed_value : [])
  .flatMap((item) => String(item?.value ?? "").split(/\r?\n/)).map((line) => line.trim()).filter(Boolean));
const hasResult = computed(() => Boolean(result.value.health || result.value.consultant_recommendations || result.value.notes || home.value.length));

// Recommendation templates use {{ ... }} as the child's name placeholder.
const fill = (text) => String(text ?? "").replace(/\{\{.*?\}\}/g, props.booking.child_name || t("your_child"));

function print() {
  if (!content.value) return;
  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  Object.assign(frame.style, { position: "fixed", width: "0", height: "0", border: "0", right: "0", bottom: "0" });
  document.body.appendChild(frame);
  const doc = frame.contentDocument;
  doc.open();
  doc.write(`<!doctype html><html dir="${document.documentElement.dir || "rtl"}" lang="${document.documentElement.lang || "ar"}"><head><meta charset="utf-8"><title>${t("نتيجة الاستشارة")}</title><style>body{padding:24px}${styles}</style></head><body>${content.value.innerHTML}</body></html>`);
  doc.close();
  frame.contentWindow.focus();
  frame.contentWindow.print();
  setTimeout(() => frame.remove(), 1000);
}

function pdf() {
  if (!content.value) return;
  const name = (props.booking.child_name || "consultation").replace(/\s+/g, "_");
  html2pdf().set({ margin: 10, filename: `consultation_result_${name}.pdf`, image: { type: "jpeg", quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: "mm", format: "a4", orientation: "portrait" } })
    .from(content.value).save()
    .catch(() => toast.add({ severity: "error", summary: t("error"), detail: t("request_failed_retry"), life: 4000 }));
}
defineExpose({ print, pdf });
</script>

<template>
  <div ref="content" class="cr">
    <header class="cr-header">
      <p class="cr-caption">{{ $t("نتيجة الاستشارة") }}</p>
      <h2 class="cr-child">{{ booking.child_name }}</h2>
      <div class="cr-meta">
        <span class="cr-chip"><span class="cr-chip-label">{{ $t("consultation_date") }}</span>{{ fmtDate(booking.event_date) }}</span>
        <span v-if="booking.user_name" class="cr-chip"><span class="cr-chip-label">{{ $t("consultant_label") }}</span>{{ booking.user_name }}</span>
      </div>
    </header>
    <section v-if="result.health" class="cr-section"><h3 class="cr-label">{{ $t("التوصييات الصحية والنمائية") }}</h3><p class="cr-text">{{ fill(result.health) }}</p></section>
    <section v-if="result.consultant_recommendations" class="cr-section"><h3 class="cr-label">{{ $t("توصييات المستشار") }}</h3><p class="cr-text">{{ fill(result.consultant_recommendations) }}</p></section>
    <section v-if="home.length" class="cr-section"><h3 class="cr-label">{{ $t("التوصييات المزلية") }}</h3><ul class="cr-list"><li v-for="(line, i) in home" :key="i">{{ fill(line) }}</li></ul></section>
    <section v-if="result.notes" class="cr-section"><h3 class="cr-label">{{ $t("ملاحظات المستشار") }}</h3><p class="cr-text">{{ fill(result.notes) }}</p></section>
    <p v-if="!hasResult" class="cr-empty">{{ $t("no_records_found") }}</p>
  </div>
</template>
