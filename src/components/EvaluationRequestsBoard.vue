<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { getEvaluationTypeLabel } from "../utils/evaluationTypes";
const props = defineProps({ requests: { type: Array, default: () => [] }, loading: Boolean });
defineEmits(["start", "delete"]);
const { t } = useI18n();
const search = ref("");
const groups = computed(() => {
  const result = new Map();
  const rows = [...props.requests].sort((a, b) =>
    String(a.date).localeCompare(String(b.date)) ||
    String(a.start_time || "").localeCompare(String(b.start_time || "")) || a.id - b.id);
  for (const row of rows) {
    const name = row.child?.name || "";
    if (!name.toLocaleLowerCase().includes(search.value.trim().toLocaleLowerCase())) continue;
    const key = String(row.child_id ?? row.child?.id) + ":" + row.date;
    if (!result.has(key)) result.set(key, { key, name, date: row.date, rows: [] });
    result.get(key).rows.push(row);
  }
  return [...result.values()];
});
const pending = computed(() => props.requests.filter(row => Number(row.status) !== 1).length);
const name = row => getEvaluationTypeLabel(row.evaluation_type, t, row.title || t("unknown_evaluation_type"));
</script>

<template>
  <div class="request-board">
    <header class="request-toolbar">
      <div><h2>{{ t('evaluation_order') }}</h2><p>{{ t('requests_grouped_hint') }}</p></div>
      <div class="request-tools">
        <Tag :value="t('requests_pending_count', { count: pending })" severity="info" />
        <IconField><InputIcon class="pi pi-search" /><InputText v-model="search" :placeholder="t('child_name')" :aria-label="t('search')" /></IconField>
      </div>
    </header>
    <div v-if="loading" class="request-empty"><ProgressSpinner style="width:42px;height:42px" /></div>
    <div v-else-if="!groups.length" class="request-empty"><i class="pi pi-inbox" /><p>{{ t('no_records_found') }}</p></div>
    <div v-else class="request-groups">
      <section v-for="group in groups" :key="group.key" class="request-group">
        <header class="child-heading">
          <span class="child-symbol"><i class="pi pi-user" /></span>
          <div><h3>{{ group.name }}</h3><span class="request-date"><i class="pi pi-calendar" /> <time>{{ group.date }}</time></span></div>
          <Tag :value="t('requests_count', { count: group.rows.length })" severity="secondary" />
        </header>
        <div v-for="row in group.rows" :key="row.id" class="request-row">
          <div class="request-description">
            <h4>{{ name(row) }}</h4>
            <span v-if="row.start_time" class="request-date"><i class="pi pi-clock" /><span dir="ltr">{{ row.start_time.slice(0, 5) }} – {{ row.end_time?.slice(0, 5) }}</span></span>
          </div>
          <Tag :severity="Number(row.status) === 1 ? 'success' : 'warn'" :value="t(Number(row.status) === 1 ? 'status_finished' : 'status_under_evaluation')" />
          <div class="request-actions">
            <Button v-if="Number(row.status) !== 1" v-can="['evaluation results create', 'able answer create', 'carolina answer create', 'milestone answer create', 'barrier answer create']" icon="pi pi-play" :label="t('start_evaluation')" @click="$emit('start', row)" />
            <Button v-can="'evaluation request delete'" icon="pi pi-trash" severity="danger" variant="text" :aria-label="t('delete')" @click="$emit('delete', row.id)" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.request-board { padding: clamp(.75rem, 2vw, 1.5rem); }
.request-toolbar, .request-tools, .child-heading, .request-row, .request-actions { display: flex; align-items: center; gap: 1rem; }
.request-toolbar { justify-content: space-between; flex-wrap: wrap; margin-bottom: 1.5rem; }
.request-toolbar h2 { font-size: 1.3rem; font-weight: 700; color: var(--sawa-primary); margin: 0; }
.request-toolbar p, .request-date { color: var(--sawa-muted, #64748b); font-size: .9rem; }
.request-toolbar p { margin-top: .4rem; }
.request-tools { flex-wrap: wrap; }
.request-groups { display: grid; gap: 1.25rem; }
.request-group { border: 1px solid var(--sawa-border, #dce8e8); border-radius: 18px; overflow: hidden; background: white; }
.child-heading { background: #f0f8f7; padding: 1.15rem; }
.child-heading h3 { margin: 0 0 .35rem; font-size: 1.05rem; font-weight: 700; }
.child-heading > .p-tag { margin-inline-start: auto; }
.child-symbol { display: grid; place-items: center; width: 44px; height: 44px; flex-shrink: 0; border-radius: 14px; background: white; color: var(--sawa-primary); }
.request-row { flex-wrap: wrap; padding: 1rem 1.25rem; border-top: 1px solid var(--sawa-border, #dce8e8); }
.request-description { flex: 1; min-width: 160px; }
.request-description h4 { margin: 0 0 .4rem; font-weight: 600; }
.request-date { display: inline-flex; align-items: center; gap: .5rem; }
.request-empty { text-align: center; padding: 3rem; color: var(--sawa-muted); }
@media (max-width: 600px) { .request-tools, .request-actions { width: 100%; } .request-actions { justify-content: flex-end; } .child-heading { gap: .65rem; } }
</style>
