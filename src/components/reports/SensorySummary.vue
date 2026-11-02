<script setup>
// What a Sensory Profile's quadrants mean for the child: each quadrant's classification and, when it is less or more than
// others, what that means and the intervention focus (the sheets' «Intervention Reference», editable in the settings).
// The low threshold line follows when it counts.
import { computed } from "vue";
import { LEVEL_TONE, levelLabel, meaningOf, scaleName, scoresOf } from "@/views/evaluation/sensory/sensory";

const props = defineProps({
  result: { type: Object, required: true },
  lang: { type: String, default: "ar" },
});

const quadrants = computed(() => scoresOf(props.result, "quadrant"));
const threshold = computed(() => scoresOf(props.result, "threshold").find((score) => score.relevant) ?? null);
const status = (score) => levelLabel(props.result.level_labels, score.level, props.lang);
</script>

<template>
  <table class="ss-table" :dir="lang === 'en' ? 'ltr' : 'rtl'">
    <thead>
      <tr>
        <th>{{ $t("sensory.quadrant") }}</th>
        <th>{{ $t("sensory.classification") }}</th>
        <th>{{ $t("sensory.meaning") }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="score in quadrants" :key="score.code">
        <th scope="row">{{ score.number }}. {{ scaleName(score, lang) }}</th>
        <td><span v-if="score.level" class="ss-level" :class="'is-' + LEVEL_TONE[score.level]">{{ status(score) }}</span>
          <span v-else class="ss-muted">{{ $t(score.status === "incomplete" ? "sensory.incomplete" : "sensory.no_norms") }}</span></td>
        <td class="ss-meaning">{{ meaningOf(result.form, score, lang) || (score.level === "typical" ? $t("sensory.typical_meaning") : "") }}</td>
      </tr>
      <tr v-if="threshold">
        <th scope="row">{{ scaleName(threshold, lang) }}</th>
        <td><span class="ss-level" :class="'is-' + LEVEL_TONE[threshold.level]">{{ status(threshold) }}</span></td>
        <td class="ss-meaning">{{ $t("sensory.threshold_meaning") }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.ss-table { width: 100%; border-collapse: collapse; font-size: 10.5pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.ss-table th, .ss-table td { padding: 2mm 2.5mm; border: 1px solid #94a3b8; text-align: start; vertical-align: middle; line-height: 1.6; }
.ss-table thead th { background: #f1f5f9; }
.ss-level { display: inline-block; padding: .5mm 2mm; border-radius: 1.5mm; font-weight: 700; white-space: nowrap; }
.ss-level.is-typical { background: #bbf7d0; color: #14532d; }
.ss-level.is-probable { background: #fde68a; color: #713f12; }
.ss-level.is-definite { background: #fecaca; color: #7f1d1d; }
.ss-level.is-consult { background: #fed7aa; color: #7c2d12; }
.ss-muted { color: #64748b; font-style: italic; }
.ss-meaning { color: #334155; }
</style>
