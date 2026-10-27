<script setup>
// One sheet of an evaluation's results page drawn as the printed report draws it (ReportEditor): the logo header
// with the evaluation and its date, the green title band, the "تم تقييم ... على ..." line, the content and the
// academy footer. Put the sheets in a `.rxs-pages` box; the report's table classes (rx-table, rx-summary, ...) are
// styled here for the content.
import sawaLogo from "@/assets/img/sawa_logo.svg";
import { dmy } from "./reportUtils";

defineProps({
  // The evaluation's name in the header and the intro ("VB-MAPP", "تقييم العوائق", ...).
  label: { type: String, required: true },
  date: { type: String, default: "" },
  childName: { type: String, default: "" },
  // The title band; the report's "نتائج {label}" when not given, none when false.
  band: { type: [String, Boolean], default: null },
  // The VB-MAPP form page opens with «مجال التربية الخاصة:» instead of a band.
  kicker: { type: Boolean, default: false },
  intro: { type: Boolean, default: true },
});
</script>

<template>
  <section class="rxs-page">
    <header class="rx-head">
      <img :src="sawaLogo" alt="Sawa" />
      <span>{{ label }}<template v-if="date"> · <span class="ltr">{{ dmy(date) }}</span></template></span>
    </header>

    <p v-if="kicker" class="rx-kicker">{{ $t("ereport.special_education") }}</p>
    <h2 v-else-if="band !== false" class="rx-band">{{ band || $t("ereport.results_of", { name: label }) }}</h2>
    <p v-if="intro && childName" class="rx-intro">{{ $t("ereport.form_intro", { name: childName, evaluation: label }) }}</p>

    <slot />

    <footer class="rx-foot"><span>{{ $t("ereport.academy") }}</span></footer>
  </section>
</template>

<style>
/* The sheets on the report's grey desk, each an A4 page (as in ReportEditor). */
.rxs-pages {
  display: grid;
  /* "safe": on a screen narrower than the sheet it scrolls instead of being cut on one side. */
  justify-content: safe center;
  gap: 24px;
  padding: 24px;
  border-radius: 16px;
  background: #e8edef;
  overflow-x: auto;
  color: #1e293b;
}
.rxs-page {
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 210mm;
  min-height: 297mm;
  padding: 14mm 15mm 12mm;
  background: #fff;
  box-shadow: 0 10px 30px -12px rgba(15, 23, 42, 0.35);
  font-size: 11.5pt;
  line-height: 1.75;
  text-align: start;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.rxs-page > :not(.rx-foot):nth-last-child(2) { margin-bottom: 8mm; }
.rxs-page .ltr { direction: ltr; unicode-bidi: isolate; }
.rxs-page .rx-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8mm;
  padding-bottom: 8px;
  border-bottom: 2px solid #135c65;
  color: #64748b;
  font-size: 9.5pt;
  font-weight: 600;
}
.rxs-page .rx-head img { height: 38px; }
.rxs-page .rx-foot {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px solid #e2e8f0;
  color: #94a3b8;
  font-size: 8.5pt;
}
.rxs-page .rx-band {
  margin: 0 0 12px;
  padding: 8px 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, #135c65 0%, #1b7c86 100%);
  color: #fff;
  font-size: 14pt;
  font-weight: 800;
}
.rxs-page .rx-band-soft { background: #eef8f9; color: #135c65; border-inline-start: 5px solid #135c65; }
.rxs-page .rx-space { margin-top: 10mm; }
.rxs-page .rx-kicker { margin: 0; color: #135c65; font-size: 13pt; font-weight: 800; }
.rxs-page .rx-intro { margin: 2px 0 12px; }
.rxs-page .rx-empty { color: #64748b; text-align: center; }

/* tables */
.rxs-page .rx-table { width: 100%; border-collapse: collapse; }
.rxs-page .rx-table th,
.rxs-page .rx-table td { padding: 8px 12px; border: 1px solid #b7cdd0; text-align: start; vertical-align: middle; }
.rxs-page .rx-table thead th { background: #135c65; color: #fff; font-weight: 700; }

/* strengths / weaknesses */
.rxs-page .rx-summary-level {
  margin: 14px 0 6px;
  padding-inline-start: 10px;
  border-inline-start: 4px solid #135c65;
  color: #135c65;
  font-size: 12pt;
  font-weight: 800;
  break-after: avoid;
  page-break-after: avoid;
}
.rxs-page .rx-head + .rx-summary-level { margin-top: 0; }
.rxs-page .rx-summary th,
.rxs-page .rx-summary td { padding: 6px 8px; font-size: 10pt; line-height: 1.6; vertical-align: top; }
.rxs-page .rx-summary thead th { text-align: center; vertical-align: middle; }
.rxs-page .rx-summary tr { break-inside: avoid; page-break-inside: avoid; }
.rxs-page .rx-sum-num { width: 7%; text-align: center !important; }
.rxs-page .rx-sum-symbol { width: 11%; text-align: center !important; }
.rxs-page .rx-plan-points { margin: 0; padding: 0; list-style: none; }
.rxs-page .rx-plan-points li { display: flex; align-items: start; gap: .5rem; margin-bottom: .4rem; }
@media screen { .rxs-page .rx-summary .rx-plan-points li::before { content: "•"; flex: none; line-height: 1.6; } }
.rxs-page .vb-levels { display: grid; gap: 3mm; }

/* barriers */
.rxs-page .rx-barrier-answers { margin-top: 6mm; font-size: 9pt; }
.rxs-page .rx-barrier-answers td { vertical-align: top; }

/* M-CHAT-R */
.rxs-page .rx-mchat th, .rxs-page .rx-mchat td { text-align: center; }
.rxs-page .rx-mchat-risk { padding: 1px 8px; border-radius: 999px; font-weight: 800; }
.rxs-page .is-low { --tone: #15803d; --tone-soft: #dcfce7; }
.rxs-page .is-medium { --tone: #b45309; --tone-soft: #fef3c7; }
.rxs-page .is-high { --tone: #b91c1c; --tone-soft: #fee2e2; }
.rxs-page .rx-mchat-risk { background: var(--tone-soft); color: var(--tone); }
.rxs-page .rx-mchat-meaning { margin-top: 6mm; padding: 10px 14px; border-inline-start: 5px solid var(--tone); border-radius: 8px; background: var(--tone-soft); }
.rxs-page .rx-mchat-meaning h3 { margin: 0 0 4px; color: var(--tone); font-size: 12pt; font-weight: 800; }
.rxs-page .rx-mchat-meaning p { margin: 0; line-height: 1.8; }
.rxs-page .rx-mchat-answers { font-size: 9pt; line-height: 1.45; }
.rxs-page .rx-mchat-answers th, .rxs-page .rx-mchat-answers td { padding: 4px 6px; }
.rxs-page .rx-mchat-answers td:nth-child(2) { text-align: start; }
.rxs-page .rx-mchat-col { width: 15mm; }
.rxs-page .rx-mchat-answers td.is-point { background: #fee2e2; color: #b91c1c; font-weight: 800; }
.rxs-page .rx-mchat-answers tfoot th { background: #eef8f9; color: #0e464d; }
.rxs-page .rx-mchat-hint { margin: 3mm 0 0; color: #64748b; font-size: 8.5pt; }

/* side profile */
.rxs-page .rx-sp-title { margin: 4mm 0 2mm; text-align: center; font-size: 22pt; font-weight: 700; color: #334155; }
.rxs-page .rx-sp-child { margin: 0 0 5mm; text-align: start; font-size: 12pt; line-height: 1.8; }

@media print {
  .rxs-pages { display: block; padding: 0; border-radius: 0; background: none; overflow: visible; }
  .rxs-page { width: 100%; min-height: 0; box-shadow: none; }
  .rxs-page + .rxs-page { break-before: page; page-break-before: always; }
}
</style>
