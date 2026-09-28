<script setup>
// Evaluation reports: children with finished evaluations; picking one lists its finished evaluations,
// and the chosen ones open in the printable report.
import { computed, nextTick, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { formatChildAge } from "@/utils/childAge";
import { dmy, evaluationLabel, isFemale, typeIcon, typeLabel } from "@/components/reports/reportUtils";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const children = ref([]);
const loading = ref(true);
const loadError = ref(false);
const search = ref("");

const selectedChild = ref(null);
const evaluations = ref([]);
const evaluationsLoading = ref(false);
const picked = ref([]);
const panel = ref(null);

const totalEvaluations = computed(() => children.value.reduce((sum, child) => sum + child.evaluations_count, 0));

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return children.value;
  return children.value.filter((child) => [child.name, child.parent_name].some((v) => String(v ?? "").toLowerCase().includes(q)));
});

const allPicked = computed(() => evaluations.value.length > 0 && picked.value.length === evaluations.value.length);

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

function toggleAll() {
  picked.value = allPicked.value ? [] : evaluations.value.map((item) => item.key);
}

function toggle(key) {
  picked.value = picked.value.includes(key) ? picked.value.filter((k) => k !== key) : [...picked.value, key];
}

function openReport() {
  if (!picked.value.length) return;
  // Keep the list's order (newest first).
  const items = evaluations.value.filter((item) => picked.value.includes(item.key)).map((item) => item.key);
  router.push({ name: "evaluation-report", params: { childId: selectedChild.value.id }, query: { items: items.join(",") } });
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

          <ul v-else class="rp-evals">
            <li v-for="item in evaluations" :key="item.key">
              <label class="rp-eval" :class="{ 'is-picked': picked.includes(item.key) }">
                <Checkbox :modelValue="picked.includes(item.key)" binary @update:modelValue="toggle(item.key)" />
                <span class="rp-eval-icon" :class="'type-' + item.type"><i :class="typeIcon(item.type)" aria-hidden="true" /></span>
                <span class="rp-eval-text">
                  <strong>{{ evaluationLabel(item, $t) }}</strong>
                  <small>
                    <span class="ltr"><i class="pi pi-calendar" aria-hidden="true" /> {{ dmy(item.date) }}</span>
                    <span v-if="item.specialist?.name"><i class="pi pi-user" aria-hidden="true" /> {{ item.specialist.name }}</span>
                  </small>
                </span>
              </label>
            </li>
          </ul>

          <footer class="rp-panel-foot">
            <span class="rp-picked">{{ picked.length ? $t("ereport.selected_n", { n: picked.length }) : $t("ereport.choose_one") }}</span>
            <Button :label="$t('ereport.create_report')" icon="pi pi-file-export" :disabled="!picked.length" @click="openReport" />
          </footer>
        </template>
      </aside>
    </div>
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
.rp-evals {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: 60vh;
  overflow-y: auto;
}
.rp-eval {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.65rem 0.75rem;
  border: 1px solid var(--sawa-border);
  border-radius: 10px;
  background: #fbfcfd;
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
.rp-eval-text small {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.75rem;
  color: var(--sawa-muted);
  font-size: 0.78rem;
}
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
