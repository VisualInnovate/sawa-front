<script setup>
// ELM's pages after the four parts, as written on the test: how the child asks for basic needs and for the toilet,
// the behaviour problems, where each came from (direct / indirect observation), the other notes and the technical
// supervisor's recommendations. Empty parts are left out.
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  // { info: { needs, toilet, behaviors, needs_source, behaviors_source, recommendations }, notes }
  result: { type: Object, required: true },
  // The result page shows the other notes; the parent portal does not.
  showNotes: { type: Boolean, default: true },
});
const { t } = useI18n();

const info = computed(() => props.result?.info ?? {});
const needs = computed(() => info.value.needs ?? {});
const toilet = computed(() => info.value.toilet ?? {});
const behaviors = computed(() => (info.value.behaviors ?? []).filter(Boolean));
const general = computed(() => (needs.value.general ?? []).filter(Boolean));
const hasNeeds = computed(() => needs.value.mode || needs.value.how || needs.value.specific || general.value.length || needs.value.general_count != null || needs.value.notes);
const hasToilet = computed(() => toilet.value.mode || toilet.value.how || toilet.value.notes);

function sourceText(source) {
  if (!source) return "";
  const parts = [];
  if (source.direct) parts.push(`${t("elm.source_direct")}: ${source.direct}`);
  const indirect = (source.indirect ?? []).map((who) => (who === "other" && source.other ? source.other : t(`elm.source_${who}`)));
  if (indirect.length) parts.push(`${t("elm.source_indirect")}: ${indirect.join("، ")}`);
  return parts.join(" · ");
}
</script>

<template>
  <div class="es">
    <section v-if="hasNeeds" class="es-block">
      <h3>{{ $t("elm.needs") }}</h3>
      <dl>
        <template v-if="needs.mode">
          <dt>{{ $t("elm.request_mode") }}</dt>
          <dd>{{ $t(`elm.mode_${needs.mode}`) }}<template v-if="needs.how"> — {{ needs.how }}</template></dd>
        </template>
        <template v-else-if="needs.how"><dt>{{ $t("elm.how") }}</dt><dd>{{ needs.how }}</dd></template>
        <template v-if="needs.specific"><dt>{{ $t("elm.needs_specific") }}</dt><dd>{{ needs.specific }}</dd></template>
        <template v-if="general.length || needs.general_count != null">
          <dt>{{ $t("elm.needs_general") }}</dt>
          <dd>{{ general.join("، ") }}<template v-if="needs.general_count != null"> ({{ $t("elm.count_about", { n: needs.general_count }) }})</template></dd>
        </template>
        <template v-if="needs.notes"><dt>{{ $t("elm.other_notes") }}</dt><dd>{{ needs.notes }}</dd></template>
        <template v-if="sourceText(info.needs_source)"><dt>{{ $t("elm.source") }}</dt><dd>{{ sourceText(info.needs_source) }}</dd></template>
      </dl>
    </section>

    <section v-if="hasToilet" class="es-block">
      <h3>{{ $t("elm.toilet") }}</h3>
      <dl>
        <template v-if="toilet.mode">
          <dt>{{ $t("elm.request_mode") }}</dt>
          <dd>{{ $t(`elm.mode_${toilet.mode}`) }}<template v-if="toilet.how"> — {{ toilet.how }}</template></dd>
        </template>
        <template v-else-if="toilet.how"><dt>{{ $t("elm.how") }}</dt><dd>{{ toilet.how }}</dd></template>
        <template v-if="toilet.notes"><dt>{{ $t("elm.other_notes") }}</dt><dd>{{ toilet.notes }}</dd></template>
      </dl>
    </section>

    <section v-if="behaviors.length" class="es-block">
      <h3>{{ $t("elm.behaviors") }}</h3>
      <ol>
        <li v-for="(behavior, i) in behaviors" :key="i">{{ behavior }}</li>
      </ol>
      <p v-if="sourceText(info.behaviors_source)" class="es-source">{{ $t("elm.source") }}: {{ sourceText(info.behaviors_source) }}</p>
    </section>

    <section v-if="showNotes && result.notes" class="es-block">
      <h3>{{ $t("elm.other_notes") }}</h3>
      <p class="es-text">{{ result.notes }}</p>
    </section>

    <section v-if="info.recommendations" class="es-block">
      <h3>{{ $t("elm.recommendations") }}</h3>
      <p class="es-text">{{ info.recommendations }}</p>
    </section>
  </div>
</template>

<style scoped>
.es { display: grid; gap: .75rem; }
.es-block { padding: .75rem 1rem; border: 1px solid #e2e8f0; border-radius: 10px; break-inside: avoid; page-break-inside: avoid; }
.es-block h3 { margin: 0 0 .5rem; font-size: 1rem; font-weight: 800; color: var(--sawa-primary, rgb(var(--bp-135c65))); }
.es-block dl { display: grid; grid-template-columns: max-content minmax(0, 1fr); gap: .3rem 1rem; margin: 0; }
.es-block dt { font-weight: 700; color: #475569; }
.es-block dd { margin: 0; white-space: pre-line; }
.es-block ol { margin: 0; padding-inline-start: 1.25rem; display: grid; gap: .2rem; }
.es-source { margin: .5rem 0 0; color: #475569; font-size: .9rem; }
.es-text { margin: 0; white-space: pre-line; line-height: 1.8; }
</style>
