<script setup>
// Evaluation reports: children with finished evaluations; picking one lists its finished evaluations,
// and the chosen ones open in the printable report. The reports already made for the child (saved from the
// report) are listed above them, to open again instead of making them anew.
import { computed, nextTick, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import axios from "axios";
import { formatChildAge } from "@/utils/childAge";
import { MAX_PER_GROUP, dmy, evaluationLabel, groupItems, isFemale, typeIcon, typeLabel } from "@/components/reports/reportUtils";
import DeleteEvaluationButton from "@/components/evaluation/DeleteEvaluationButton.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const children = ref([]);
const loading = ref(true);
const loadError = ref(false);
const search = ref("");

const selectedChild = ref(null);
const evaluations = ref([]);
const evaluationsLoading = ref(false);
const picked = ref([]);
const panel = ref(null);
const reportTypes = ref([]);

// The child's saved reports; each one's evaluations are found in the list below (a deleted one is gone).
const savedReports = ref([]);
const savedLoading = ref(false);
const deletingReport = ref(null);
const deleteBusy = ref(false);
const evaluationsByKey = computed(() => new Map(evaluations.value.map((item) => [item.key, item])));
const reportEvaluations = (saved) => saved.items.map((key) => evaluationsByKey.value.get(key)).filter(Boolean);
const timeOf = (value) => String(value ?? "").slice(11, 16);

const totalEvaluations = computed(() => children.value.reduce((sum, child) => sum + child.evaluations_count, 0));

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return children.value;
  return children.value.filter((child) => [child.name, child.parent_name].some((v) => String(v ?? "").toLowerCase().includes(q)));
});

// The list shown in blocks per evaluation type (a side-profile dimension is its own type), newest first.
const groups = computed(() => groupItems(evaluations.value, t));
const pickedIn = (group) => group.items.filter((item) => picked.value.includes(item.key)).length;
const groupFull = (group) => pickedIn(group) >= MAX_PER_GROUP;
// "Select all" = the newest four of every type.
const maxPick = computed(() => groups.value.flatMap((group) => group.items.slice(0, MAX_PER_GROUP).map((item) => item.key)));
const allPicked = computed(() => maxPick.value.length > 0 && maxPick.value.every((key) => picked.value.includes(key)));

async function loadChildren() {
  loading.value = true;
  loadError.value = false;
  try {
    const { data } = await axios.get("api/reports/children");
    children.value = data.data ?? [];
    const fromQuery = Number(route.query.child);
    const match = fromQuery && children.value.find((child) => child.id === fromQuery);
    if (match) selectChild(match, false);
  } catch {
    loadError.value = true;
  } finally {
    loading.value = false;
  }
}

async function selectChild(child, scroll = true) {
  if (!child || selectedChild.value?.id === child.id) return;
  selectedChild.value = child;
  evaluations.value = [];
  picked.value = [];
  router.replace({ query: { ...route.query, child: child.id } });
  loadSaved(child);
  evaluationsLoading.value = true;
  try {
    const { data } = await axios.get(`api/reports/children/${child.id}`);
    if (selectedChild.value?.id !== child.id) return;
    evaluations.value = data.data ?? [];
    // The newest evaluation is picked by default.
    picked.value = evaluations.value.length ? [evaluations.value[0].key] : [];
  } catch {
    evaluations.value = [];
  } finally {
    evaluationsLoading.value = false;
  }
  if (scroll && window.innerWidth < 1100) nextTick(() => panel.value?.scrollIntoView({ behavior: "smooth", block: "start" }));
}

// A deleted evaluation leaves the list; a child without finished evaluations leaves the children list.
function evaluationDeleted(item) {
  evaluations.value = evaluations.value.filter((row) => row.key !== item.key);
  picked.value = picked.value.filter((key) => key !== item.key);
  const child = children.value.find((row) => row.id === selectedChild.value?.id);
  if (child) child.evaluations_count = evaluations.value.length;
  if (!evaluations.value.length) {
    children.value = children.value.filter((row) => row.id !== selectedChild.value?.id);
    selectedChild.value = null;
  }
}

async function loadSaved(child) {
  savedReports.value = [];
  savedLoading.value = true;
  try {
    const { data } = await axios.get(`api/reports/children/${child.id}/saved`);
    if (selectedChild.value?.id === child.id) savedReports.value = data.data ?? [];
  } catch {
    savedReports.value = [];
  } finally {
    savedLoading.value = false;
  }
}

// Opens the saved report with its evaluations that still exist.
function openSaved(saved) {
  const items = reportEvaluations(saved).map((item) => item.key);
  if (!items.length) return;
  router.push({ name: "evaluation-report", params: { childId: selectedChild.value.id }, query: { items: items.join(","), types: saved.types.join(","), report: saved.id } });
}

async function deleteSaved() {
  const saved = deletingReport.value;
  if (!saved) return;
  deleteBusy.value = true;
  try {
    await axios.delete(`api/reports/saved/${saved.id}`);
    savedReports.value = savedReports.value.filter((row) => row.id !== saved.id);
    deletingReport.value = null;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("ereport.report_deleted"), life: 3000 });
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message || t("request_failed_retry"), life: 3000 });
  } finally {
    deleteBusy.value = false;
  }
}

function toggleAll() {
  picked.value = allPicked.value ? [] : [...maxPick.value];
}

function toggle(item, group) {
  if (picked.value.includes(item.key)) picked.value = picked.value.filter((key) => key !== item.key);
  else if (!groupFull(group)) picked.value = [...picked.value, item.key];
}

function openReport() {
  if (!picked.value.length || !reportTypes.value.length) return;
  // Keep the list's order (newest first).
  const items = evaluations.value.filter((item) => picked.value.includes(item.key)).map((item) => item.key);
  router.push({ name: "evaluation-report", params: { childId: selectedChild.value.id }, query: { items: items.join(","), types: reportTypes.value.join(",") } });
}

onMounted(loadChildren);
</script>

<template>
  <div class="rp-page">
    <header class="rp-hero">
      <div class="rp-hero-main">
        <span class="rp-hero-icon"><i class="mdi mdi-file-chart-outline" aria-hidden="true" /></span>
        <div>
          <h1>{{ $t("ereport.title") }}</h1>
          <p>{{ $t("ereport.subtitle") }}</p>
        </div>
      </div>
      <div class="rp-hero-stats">
        <div class="rp-stat"><b>{{ children.length }}</b><span>{{ $t("ereport.children_count") }}</span></div>
        <div class="rp-stat"><b>{{ totalEvaluations }}</b><span>{{ $t("ereport.evaluations_count") }}</span></div>
      </div>
    </header>

    <div class="rp-layout">
      <!-- children -->
      <section class="rp-card rp-children">
        <div class="rp-toolbar">
          <IconField class="rp-search">
            <InputIcon class="pi pi-search" />
            <InputText v-model="search" :placeholder="$t('ereport.search')" />
          </IconField>
        </div>

        <div v-if="loading" class="rp-skeletons">
          <Skeleton v-for="n in 6" :key="n" height="3.25rem" />
        </div>
        <Message v-else-if="loadError" severity="error" :closable="false">{{ $t("request_failed_retry") }}</Message>
        <div v-else-if="!children.length" class="rp-empty">
          <i class="pi pi-inbox" aria-hidden="true" />
          <p>{{ $t("ereport.no_children") }}</p>
        </div>

        <DataTable
          v-else
          :value="filtered"
          dataKey="id"
          :selection="selectedChild"
          selectionMode="single"
          :metaKeySelection="false"
          paginator
          :rows="12"
          sortField="last_date"
          :sortOrder="-1"
          class="rp-table"
          :rowClass="(row) => (row.id === selectedChild?.id ? 'is-selected' : '')"
          @row-click="selectChild($event.data)"
        >
          <template #empty>
            <div class="rp-empty rp-empty-inline">{{ $t("ereport.no_results") }}</div>
          </template>
          <Column field="name" :header="$t('ereport.child')" sortable>
            <template #body="{ data }">
              <div class="rp-child">
                <span class="rp-avatar" :class="isFemale(data.gender) ? 'is-female' : 'is-male'">
                  <i :class="isFemale(data.gender) ? 'mdi mdi-face-woman' : 'mdi mdi-face-man'" aria-hidden="true" />
                </span>
                <div class="rp-child-text">
                  <strong>{{ data.name }}</strong>
                  <small v-if="data.parent_name"><i class="pi pi-user" aria-hidden="true" /> {{ data.parent_name }}</small>
                </div>
              </div>
            </template>
          </Column>
          <Column field="birth_date" :header="$t('ereport.age')" sortable :sortOrder="-1">
            <template #body="{ data }">{{ formatChildAge(data.birth_date, null, $t) || "—" }}</template>
          </Column>
          <Column field="evaluations_count" :header="$t('ereport.evaluations')" sortable>
            <template #body="{ data }"><span class="rp-count">{{ data.evaluations_count }}</span></template>
          </Column>
          <Column field="last_date" :header="$t('ereport.last_evaluation')" sortable>
            <template #body="{ data }"><span class="ltr">{{ dmy(data.last_date) }}</span></template>
          </Column>
          <Column :header="$t('ereport.types')">
            <template #body="{ data }">
              <div class="rp-types">
                <span v-for="type in data.types" :key="type" class="rp-type" :class="'type-' + type" :title="typeLabel(type, $t)">
                  <i :class="typeIcon(type)" aria-hidden="true" />{{ typeLabel(type, $t) }}
                </span>
              </div>
            </template>
          </Column>
        </DataTable>
      </section>

      <!-- the chosen child's finished evaluations -->
      <aside ref="panel" class="rp-card rp-panel">
        <div v-if="!selectedChild" class="rp-empty rp-panel-empty">
          <i class="mdi mdi-gesture-tap" aria-hidden="true" />
          <p>{{ $t("ereport.pick_child") }}</p>
        </div>

        <template v-else>
          <header class="rp-panel-head">
            <span class="rp-avatar is-lg" :class="isFemale(selectedChild.gender) ? 'is-female' : 'is-male'">
              <i :class="isFemale(selectedChild.gender) ? 'mdi mdi-face-woman' : 'mdi mdi-face-man'" aria-hidden="true" />
            </span>
            <div>
              <h2>{{ selectedChild.name }}</h2>
              <p>
                {{ isFemale(selectedChild.gender) ? $t("female") : $t("male") }}
                <template v-if="selectedChild.birth_date"> · {{ formatChildAge(selectedChild.birth_date, null, $t) }}</template>
              </p>
            </div>
          </header>

          <!-- reports already made for the child -->
          <section class="rp-saved">
            <div class="rp-panel-bar">
              <h3>{{ $t("ereport.saved_reports") }} <span>{{ savedReports.length }}</span></h3>
            </div>
            <div v-if="savedLoading || evaluationsLoading" class="rp-skeletons">
              <Skeleton height="3.5rem" />
            </div>
            <p v-else-if="!savedReports.length" class="rp-limit"><i class="pi pi-info-circle" aria-hidden="true" /> {{ $t("ereport.no_saved_reports") }}</p>
            <template v-else>
              <p class="rp-saved-hint">{{ $t("ereport.saved_reports_hint") }}</p>
              <ul class="rp-saved-list">
                <li v-for="saved in savedReports" :key="saved.id" class="rp-saved-item">
                  <div class="rp-saved-text">
                    <div class="rp-saved-top">
                      <strong><span class="ltr">{{ dmy(saved.updated_at) }} {{ timeOf(saved.updated_at) }}</span></strong>
                      <span v-for="type in saved.types" :key="type" class="rp-output-tag">{{ $t("ereport.output_" + type) }}</span>
                      <span v-if="saved.printed_at" class="rp-printed"><i class="pi pi-print" aria-hidden="true" /> {{ $t("ereport.report_printed") }}</span>
                    </div>
                    <div class="rp-types">
                      <span v-for="item in reportEvaluations(saved)" :key="item.key" class="rp-type" :class="'type-' + item.type">
                        <i :class="typeIcon(item.type)" aria-hidden="true" />{{ evaluationLabel(item, $t) }} · <span class="ltr">{{ dmy(item.date) }}</span>
                      </span>
                    </div>
                    <small v-if="!reportEvaluations(saved).length" class="rp-incomplete">{{ $t("ereport.report_no_evaluations") }}</small>
                    <small v-else-if="reportEvaluations(saved).length < saved.items.length" class="rp-incomplete">
                      {{ $t("ereport.report_missing_evaluations", { n: saved.items.length - reportEvaluations(saved).length }) }}
                    </small>
                    <small v-if="saved.updated_by?.name || saved.created_by?.name">
                      <i class="pi pi-user" aria-hidden="true" /> {{ $t("ereport.report_by", { name: saved.updated_by?.name || saved.created_by?.name }) }}
                    </small>
                  </div>
                  <div class="rp-saved-actions">
                    <Button :label="$t('ereport.open_report')" icon="pi pi-external-link" size="small" :disabled="!reportEvaluations(saved).length" @click="openSaved(saved)" />
                    <Button icon="pi pi-trash" size="small" severity="danger" variant="outlined" :aria-label="$t('ereport.delete_report')"
                      v-tooltip.top="$t('ereport.delete_report')" @click="deletingReport = saved" />
                  </div>
                </li>
              </ul>
            </template>
          </section>

          <div class="rp-panel-bar">
            <h3>{{ $t("ereport.finished_evaluations") }} <span>{{ evaluations.length }}</span></h3>
            <Button
              v-if="evaluations.length > 1"
              :label="allPicked ? $t('ereport.clear') : $t('ereport.select_all')"
              :icon="allPicked ? 'pi pi-times' : 'pi pi-check-square'"
              size="small"
              text
              @click="toggleAll"
            />
          </div>

          <div v-if="evaluationsLoading" class="rp-skeletons">
            <Skeleton v-for="n in 4" :key="n" height="4rem" />
          </div>

          <div v-else class="rp-groups">
            <p v-if="evaluations.length" class="rp-limit"><i class="pi pi-info-circle" aria-hidden="true" /> {{ $t("ereport.limit_hint", { n: MAX_PER_GROUP }) }}</p>
            <section v-for="group in groups" :key="group.group" class="rp-group" :class="'type-' + group.type">
              <header class="rp-group-head">
                <span class="rp-eval-icon"><i :class="typeIcon(group.type)" aria-hidden="true" /></span>
                <strong>{{ group.label }}</strong>
                <span class="rp-group-count" :class="{ 'is-full': groupFull(group) }">{{ pickedIn(group) }}/{{ Math.min(MAX_PER_GROUP, group.items.length) }}</span>
              </header>
              <ul class="rp-evals">
                <li v-for="item in group.items" :key="item.key">
                  <label
                    class="rp-eval"
                    :class="{ 'is-picked': picked.includes(item.key), 'is-locked': !picked.includes(item.key) && groupFull(group) }"
                    :title="!picked.includes(item.key) && groupFull(group) ? $t('ereport.limit_reached', { n: MAX_PER_GROUP }) : undefined"
                  >
                    <Checkbox
                      :modelValue="picked.includes(item.key)"
                      binary
                      :disabled="!picked.includes(item.key) && groupFull(group)"
                      @update:modelValue="toggle(item, group)"
                    />
                    <span class="rp-eval-text">
                      <strong class="ltr">{{ dmy(item.date) }}</strong>
                      <small v-if="item.specialist?.name"><i class="pi pi-user" aria-hidden="true" /> {{ item.specialist.name }}</small>
                      <!-- A VB-MAPP evaluation still waiting for levels: reported with the levels it has. -->
                      <small v-if="item.complete === false" class="rp-incomplete"><i class="pi pi-hourglass" aria-hidden="true" /> {{ $t("ereport.incomplete") }}</small>
                    </span>
                  </label>
                  <DeleteEvaluationButton :evaluation-id="item.id" :side-profile-result="item.key.startsWith('s')" :label="false" size="small"
                    class="rp-eval-delete" @deleted="evaluationDeleted(item)" />
                </li>
              </ul>
            </section>
          </div>

          <fieldset class="rp-report-types">
            <legend>{{ $t("ereport.output_types") }}</legend>
            <p>{{ $t("ereport.output_types_hint") }}</p>
            <label v-for="type in ['report', 'plan', 'tracking']" :key="type" class="rp-output-type">
              <Checkbox v-model="reportTypes" :value="type" />
              <span>{{ $t('ereport.output_' + type) }}</span>
            </label>
          </fieldset>

          <footer class="rp-panel-foot">
            <span class="rp-picked">{{ picked.length ? $t("ereport.selected_n", { n: picked.length }) : $t("ereport.choose_one") }}</span>
            <Button :label="$t('ereport.create_report')" icon="pi pi-file-export" :disabled="!picked.length || !reportTypes.length" @click="openReport" />
          </footer>
        </template>
      </aside>
    </div>

    <Dialog :visible="Boolean(deletingReport)" modal :header="$t('ereport.delete_report')" :style="{ width: '440px', maxWidth: '95vw' }"
      @update:visible="(open) => { if (!open) deletingReport = null; }">
      <p class="m-0">{{ $t("ereport.delete_report_confirm") }}</p>
      <template #footer>
        <Button :label="$t('cancel')" severity="secondary" variant="text" @click="deletingReport = null" />
        <Button :label="$t('delete')" icon="pi pi-trash" severity="danger" :loading="deleteBusy" @click="deleteSaved" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.rp-page {
  display: grid;
  gap: 1rem;
}
.rp-hero {
  position: relative;
  overflow: hidden;
  overflow: clip;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 1.5rem;
  padding: 1.35rem 1.5rem;
  border-radius: var(--sawa-radius);
  background: linear-gradient(135deg, var(--sawa-primary) 0%, #1b7c86 100%);
  color: #fff;
  box-shadow: 0 8px 24px -12px rgba(19, 92, 101, 0.55);
}
.rp-hero::after {
  content: "";
  position: absolute;
  inset-inline-end: -60px;
  top: -80px;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.07);
  pointer-events: none;
}
.rp-hero-main {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1 1 22rem;
}
.rp-hero-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.15);
  font-size: 1.6rem;
}
.rp-hero h1 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 800;
}
.rp-hero p {
  margin: 0.2rem 0 0;
  font-size: 0.9rem;
  opacity: 0.85;
}
.rp-hero-stats {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 0.75rem;
}
.rp-stat {
  display: grid;
  min-width: 6rem;
  padding: 0.45rem 0.9rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
  text-align: center;
}
.rp-stat b {
  font-size: 1.25rem;
}
.rp-stat span {
  font-size: 0.75rem;
  opacity: 0.85;
}

.rp-layout {
  display: grid;
  gap: 1rem;
  align-items: start;
}
@media (min-width: 1100px) {
  .rp-layout {
    grid-template-columns: minmax(0, 1.75fr) minmax(21rem, 1fr);
  }
  .rp-panel {
    position: sticky;
    top: 1rem;
  }
}
.rp-card {
  min-width: 0;
  background: #fff;
  border: 1px solid var(--sawa-border);
  border-radius: var(--sawa-radius);
  box-shadow: var(--sawa-shadow);
}
.rp-children {
  padding: 0.75rem;
}
.rp-toolbar {
  margin-bottom: 0.75rem;
}
.rp-search {
  max-width: 26rem;
}
.rp-search :deep(.p-inputtext) {
  width: 100%;
}
.rp-table {
  border: 0;
}
.rp-table :deep(.p-datatable-tbody > tr) {
  cursor: pointer;
}
.rp-table :deep(.p-datatable-tbody > tr.is-selected) {
  background: var(--sawa-primary-soft);
  box-shadow: inset 3px 0 0 var(--sawa-primary);
}
[dir="rtl"] .rp-table :deep(.p-datatable-tbody > tr.is-selected) {
  box-shadow: inset -3px 0 0 var(--sawa-primary);
}
.rp-child {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}
.rp-child-text {
  display: grid;
  min-width: 0;
}
.rp-child-text strong {
  font-weight: 700;
  color: var(--sawa-text);
}
.rp-child-text small {
  color: var(--sawa-muted);
  font-size: 0.78rem;
}
.rp-avatar {
  display: grid;
  place-items: center;
  flex: none;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  font-size: 1.2rem;
}
.rp-avatar.is-male {
  background: #e0f2fe;
  color: #0369a1;
}
.rp-avatar.is-female {
  background: #fce7f3;
  color: #be185d;
}
.rp-avatar.is-lg {
  width: 3rem;
  height: 3rem;
  font-size: 1.6rem;
}
.rp-count {
  display: inline-grid;
  place-items: center;
  min-width: 1.9rem;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  background: var(--sawa-primary-soft);
  color: var(--sawa-primary);
  font-weight: 700;
}
.rp-types {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}
.rp-type {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.1rem 0.45rem;
  border-radius: 6px;
  background: #f1f5f9;
  color: #334155;
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
}
.rp-type .pi {
  font-size: 0.7rem;
}
.type-1 { --tone: #db2777; --tone-soft: #fce7f3; }
.type-2 { --tone: #0f766e; --tone-soft: #ccfbf1; }
.type-3 { --tone: #b45309; --tone-soft: #fef3c7; }
.type-4 { --tone: #4f46e5; --tone-soft: #e0e7ff; }
.type-5 { --tone: #0369a1; --tone-soft: #e0f2fe; }
.type-6 { --tone: #9d174d; --tone-soft: #fce7f3; }
.type-7 { --tone: #4338ca; --tone-soft: #e0e7ff; }
.type-8 { --tone: #047857; --tone-soft: #d1fae5; }
.rp-type[class*="type-"] {
  background: var(--tone-soft);
  color: var(--tone);
}

.rp-panel {
  display: grid;
  gap: 0.9rem;
  padding: 1.1rem;
  scroll-margin-top: 1rem;
}
.rp-panel-head {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid #f1f5f9;
}
.rp-panel-head h2 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--sawa-text);
}
.rp-panel-head p {
  margin: 0.1rem 0 0;
  color: var(--sawa-muted);
  font-size: 0.85rem;
}
.rp-panel-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.rp-panel-bar h3 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--sawa-primary);
}
.rp-panel-bar h3 span {
  margin-inline-start: 0.3rem;
  padding: 0 0.5rem;
  border-radius: 999px;
  background: var(--sawa-primary-soft);
  font-size: 0.78rem;
}
.rp-groups {
  display: grid;
  gap: 0.75rem;
  max-height: 62vh;
  overflow-y: auto;
  padding-inline-end: 2px;
}
.rp-limit {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0;
  padding: 0.45rem 0.7rem;
  border-radius: 8px;
  background: #f8fafc;
  color: var(--sawa-muted);
  font-size: 0.8rem;
}
.rp-group {
  display: grid;
  gap: 0.45rem;
}
.rp-group-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.rp-group-head .rp-eval-icon {
  width: 1.9rem;
  height: 1.9rem;
}
.rp-group-head strong {
  flex: 1;
  color: var(--sawa-text);
  font-size: 0.92rem;
}
.rp-group-count {
  padding: 0 0.5rem;
  border-radius: 999px;
  background: #f1f5f9;
  color: var(--sawa-muted);
  font-size: 0.75rem;
  font-weight: 700;
}
.rp-group-count.is-full {
  background: var(--tone-soft);
  color: var(--tone);
}
.rp-evals {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10.5rem, 1fr));
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
.rp-evals li {
  position: relative;
}
/* The delete button sits in the item's corner, over the label (a two-root component: no scope id). */
.rp-evals li :deep(.rp-eval-delete.p-button) {
  position: absolute;
  inset-block-start: 0.3rem;
  inset-inline-end: 0.3rem;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
}
.rp-eval {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.65rem;
  border: 1px solid var(--sawa-border);
  border-radius: 10px;
  background: #fbfcfd;
  padding-inline-end: 2.4rem;
  cursor: pointer;
  transition: border-color 0.15s, background-color 0.15s;
}
.rp-eval:hover {
  border-color: #b6d7db;
}
.rp-eval.is-picked {
  border-color: var(--sawa-primary);
  background: var(--sawa-primary-soft);
}
.rp-eval.is-locked {
  opacity: 0.5;
  cursor: not-allowed;
}
.rp-eval-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 9px;
  background: var(--tone-soft, #f1f5f9);
  color: var(--tone, #334155);
}
.rp-eval-text {
  display: grid;
  gap: 0.1rem;
  min-width: 0;
}
.rp-eval-text strong {
  color: var(--sawa-text);
  font-weight: 700;
  font-size: 0.93rem;
}
.rp-eval-text small.rp-incomplete {
  color: #b45309;
  font-weight: 700;
}
.rp-eval-text small {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.75rem;
  color: var(--sawa-muted);
  font-size: 0.78rem;
}
.rp-saved {
  display: grid;
  gap: 0.5rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid #f1f5f9;
}
.rp-saved-hint {
  margin: 0;
  color: var(--sawa-muted);
  font-size: 0.8rem;
}
.rp-saved-list {
  display: grid;
  gap: 0.45rem;
  max-height: 18rem;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  list-style: none;
}
.rp-saved-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.55rem 0.7rem;
  border: 1px solid var(--sawa-border);
  border-radius: 10px;
  background: #fbfcfd;
}
.rp-saved-text {
  display: grid;
  gap: 0.3rem;
  min-width: 0;
  flex: 1 1 14rem;
}
.rp-saved-text small {
  color: var(--sawa-muted);
  font-size: 0.78rem;
}
.rp-saved-text small.rp-incomplete {
  color: #b45309;
  font-weight: 700;
}
.rp-saved-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.3rem 0.45rem;
}
.rp-saved-top strong {
  color: var(--sawa-text);
  font-size: 0.9rem;
}
.rp-output-tag {
  padding: 0 0.5rem;
  border-radius: 999px;
  background: var(--sawa-primary-soft);
  color: var(--sawa-primary);
  font-size: 0.72rem;
  font-weight: 700;
}
.rp-printed {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: #166534;
  font-size: 0.72rem;
  font-weight: 700;
}
.rp-saved-actions {
  display: flex;
  gap: 0.35rem;
}
.rp-report-types {
  display: grid;
  gap: 0.6rem;
  margin: 0;
  padding: 0.75rem;
  border: 1px solid var(--sawa-border);
  border-radius: 10px;
}
.rp-report-types legend { font-weight: 700; color: var(--sawa-primary); }
.rp-report-types p { margin: 0; font-size: 0.8rem; color: var(--sawa-muted); }
.rp-output-type { display: flex; align-items: center; gap: 0.6rem; cursor: pointer; }
.rp-output-type.is-disabled { opacity: 0.5; cursor: not-allowed; }
.rp-output-type small { margin-inline-start: auto; }
.rp-panel-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding-top: 0.8rem;
  border-top: 1px solid #f1f5f9;
}
.rp-picked {
  color: var(--sawa-muted);
  font-size: 0.85rem;
  font-weight: 600;
}
.rp-skeletons {
  display: grid;
  gap: 0.5rem;
}
.rp-empty {
  display: grid;
  justify-items: center;
  gap: 0.4rem;
  padding: 2.5rem 1rem;
  color: var(--sawa-muted);
  text-align: center;
}
.rp-empty i {
  font-size: 2.2rem;
  color: #94a3b8;
}
.rp-empty p {
  margin: 0;
}
.rp-empty-inline {
  padding: 1.5rem;
}
.rp-panel-empty {
  padding: 3.5rem 1rem;
}
@media (max-width: 640px) {
  .rp-hero-stats,
  .rp-stat {
    flex: 1;
  }
}
</style>
