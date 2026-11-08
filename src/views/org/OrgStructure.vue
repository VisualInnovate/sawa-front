<script setup>
// The org structure (phase 2): the departments with their head and deputy, the positions tree (who reports to whom)
// and the structure's roles with how many people hold them. Built without people: a department whose head is not set
// keeps its old leave approvers until one is.
import axios from "axios";
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { errorText } from "@/utils/accounting";
import { can } from "@/utils/permissions";

const { t, locale } = useI18n();
const toast = useToast();

const data = ref({ positions: [], departments: [], roles: [], employees: [] });
const loading = ref(true);
const saving = ref(null);
const editable = computed(() => can("org structure edit"));
const ar = computed(() => locale.value === "ar");
// The head / deputy being edited, per department.
const leaders = ref({});
// The tree is wider than the page: it opens centred on its top.
const chartWrap = ref(null);
async function centreChart() {
  await nextTick();
  const el = chartWrap.value;
  if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
}

// How many employees do not match their job title («تعارضات الهيكل»).
const conflicts = ref(0);
async function load() {
  loading.value = true;
  axios.get("api/org-structure/conflicts").then(({ data: res }) => (conflicts.value = res.data.employees.length + res.data.roles_outside.length)).catch(() => {});
  try {
    data.value = (await axios.get("api/org-structure")).data.data;
    leaders.value = Object.fromEntries(data.value.departments.map((d) => [d.id, { head: d.head?.id ?? null, deputy: d.deputy?.id ?? null }]));
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(e), life: 4000 });
  } finally {
    loading.value = false;
    centreChart();
  }
}

// The deputy is a therapist of the department: its own employees first (the server also accepts its linked therapists).
const deputyOptions = (department) => {
  const mine = data.value.employees.filter((e) => Number(e.department_id) === department.id);
  return mine.length ? mine : data.value.employees;
};
const changed = (department) => {
  const l = leaders.value[department.id] ?? {};
  return (l.head ?? null) !== (department.head?.id ?? null) || (l.deputy ?? null) !== (department.deputy?.id ?? null);
};

async function saveLeaders(department) {
  saving.value = `d${department.id}`;
  try {
    const l = leaders.value[department.id];
    data.value = (await axios.put(`api/org-structure/departments/${department.id}/leaders`, {
      head_employee_id: l.head, deputy_employee_id: l.deputy,
    })).data.data;
    leaders.value = Object.fromEntries(data.value.departments.map((d) => [d.id, { head: d.head?.id ?? null, deputy: d.deputy?.id ?? null }]));
    toast.add({ severity: "success", summary: t("success_message"), detail: t("org.saved"), life: 2500 });
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(e), life: 5000 });
  } finally {
    saving.value = null;
  }
}

// The positions as a tree; several tops hang under the academy.
const tree = computed(() => {
  const byParent = {};
  for (const p of data.value.positions) (byParent[p.parent_id ?? "root"] ??= []).push(p);
  const node = (p) => ({ key: String(p.id), type: "position", data: p, children: (byParent[p.id] ?? []).map(node) });
  const tops = (byParent.root ?? []).map(node);
  return tops.length === 1 ? tops[0] : { key: "academy", type: "academy", data: { title: t("org.academy") }, children: tops };
});

// Moving a position: under another one (not itself nor one of its own) or to the top.
const moving = ref(null);
const moveTo = ref(null);
const descendants = (id) => {
  const out = new Set([id]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const p of data.value.positions) if (p.parent_id && out.has(p.parent_id) && !out.has(p.id)) { out.add(p.id); grew = true; }
  }
  return out;
};
const parentOptions = computed(() => {
  if (!moving.value) return [];
  const blocked = descendants(moving.value.id);
  return [{ id: null, title: t("org.top_level") }, ...data.value.positions.filter((p) => !blocked.has(p.id))];
});
function openMove(position) {
  moving.value = position;
  moveTo.value = position.parent_id ?? null;
}
async function saveMove() {
  saving.value = "move";
  try {
    data.value = (await axios.put(`api/org-structure/positions/${moving.value.id}/parent`, { parent_id: moveTo.value })).data.data;
    moving.value = null;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("org.saved"), life: 2500 });
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(e), life: 5000 });
  } finally {
    saving.value = null;
  }
}

const roleLabel = (key) => {
  const row = data.value.roles.find((r) => r.key === key);
  return row ? (ar.value ? row.ar : row.en) : "—";
};
const withoutHead = computed(() => data.value.departments.filter((d) => !d.head).length);

// ---- Tree controls: zoom, fit, full screen, print, expand/collapse, find, drag to move. ----
const chartBox = ref(null); // the section that goes full screen
const chartInner = ref(null); // the zoomed content
const zoom = ref(1);
const ZOOM_MIN = 0.2;
const ZOOM_MAX = 2;
const zoomPercent = computed(() => `${Math.round(zoom.value * 100)}%`);
// Zooms keeping the point under (x, y) of the visible area in place (its centre by default).
async function setZoom(value, x = null, y = null) {
  const el = chartWrap.value;
  const next = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(value * 100) / 100));
  if (!el || next === zoom.value) return (zoom.value = next);
  const px = x ?? el.clientWidth / 2;
  const py = y ?? el.clientHeight / 2;
  const ratio = next / zoom.value;
  const left = (el.scrollLeft + px) * ratio - px;
  const top = (el.scrollTop + py) * ratio - py;
  zoom.value = next;
  await nextTick();
  el.scrollLeft = left;
  el.scrollTop = top;
}
const zoomIn = () => setZoom(zoom.value + 0.1);
const zoomOut = () => setZoom(zoom.value - 0.1);
async function resetZoom() {
  await setZoom(1);
  centreChart();
}
// The whole tree in the visible area.
async function fitChart() {
  const el = chartWrap.value;
  const inner = chartInner.value;
  if (!el || !inner) return;
  zoom.value = 1;
  await nextTick();
  const width = inner.scrollWidth;
  const height = inner.scrollHeight;
  zoom.value = Math.max(ZOOM_MIN, Math.floor(Math.min(1, (el.clientWidth - 16) / width, (el.clientHeight - 16) / height) * 100) / 100);
  await nextTick();
  el.scrollTop = 0;
  centreChart();
}
// Ctrl + wheel zooms at the mouse.
function onWheel(event) {
  if (!event.ctrlKey && !event.metaKey) return;
  event.preventDefault();
  const rect = chartWrap.value.getBoundingClientRect();
  setZoom(zoom.value * (event.deltaY < 0 ? 1.1 : 0.9), event.clientX - rect.left, event.clientY - rect.top);
}
// Dragging the background moves the tree.
const dragging = ref(null);
function onPointerDown(event) {
  if (event.button !== 0 || event.target.closest("button, a, input, .p-organizationchart-node-toggle-button")) return;
  const el = chartWrap.value;
  dragging.value = { x: event.clientX, y: event.clientY, left: el.scrollLeft, top: el.scrollTop };
}
function onPointerMove(event) {
  if (!dragging.value) return;
  const el = chartWrap.value;
  el.scrollLeft = dragging.value.left - (event.clientX - dragging.value.x);
  el.scrollTop = dragging.value.top - (event.clientY - dragging.value.y);
}
const stopDrag = () => (dragging.value = null);

// Full screen of the tree box only.
const fullscreen = ref(false);
function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen();
  else chartBox.value?.requestFullscreen?.();
}
function onFullscreenChange() {
  fullscreen.value = document.fullscreenElement === chartBox.value && !!chartBox.value;
  setTimeout(fitChart, 150);
}

// Expand / collapse: the top and its direct branches stay open when collapsing.
const collapsedKeys = ref({});
const expandAll = () => (collapsedKeys.value = {});
function collapseAll() {
  const keys = {};
  const walk = (node, depth) => {
    if (node.children?.length && depth >= 1) keys[node.key] = true;
    node.children?.forEach((child) => walk(child, depth + 1));
  };
  walk(tree.value, tree.value.key === "academy" ? -1 : 0);
  collapsedKeys.value = keys;
}

// Find a position (by its title, department or one of its employees): opens its branch and brings it into view.
const found = ref(null);
// The title shows; the department and its people show small under it and are searched too.
const findOptions = computed(() => data.value.positions.map((p) => {
  const people = (p.employees ?? []).map((e) => e.name);
  return {
    id: p.id,
    title: p.title,
    sub: [p.department, people.slice(0, 3).join("، ") + (people.length > 3 ? ` +${people.length - 3}` : "")].filter(Boolean).join(" — "),
    search: [p.title, p.department, ...people].filter(Boolean).join(" "),
  };
}));
async function findPosition(id) {
  if (!id) return (found.value = null);
  const byId = Object.fromEntries(data.value.positions.map((p) => [p.id, p]));
  const keys = { ...collapsedKeys.value };
  for (let p = byId[byId[id]?.parent_id]; p; p = byId[p.parent_id]) delete keys[String(p.id)];
  delete keys.academy;
  collapsedKeys.value = keys;
  found.value = id;
  if (zoom.value < 0.6) zoom.value = 0.8;
  await nextTick();
  chartWrap.value?.querySelector(`[data-position="${id}"]`)?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
}

// Print: the tree alone at its real size (100%), on one page as big as the tree (a wide structure is not shrunk onto
// A4), with the page's own styles. Saved as PDF it keeps that size; a paper printer fits it to its paper.
function printTree() {
  const inner = chartInner.value;
  if (!inner) return;
  const frame = document.createElement("iframe");
  frame.style.cssText = "position:fixed;width:0;height:0;border:0;right:0;bottom:0";
  document.body.appendChild(frame);
  const doc = frame.contentDocument;
  const styles = [...document.querySelectorAll('style, link[rel="stylesheet"]')].map((node) => node.outerHTML).join("");
  doc.open();
  doc.write(`<!doctype html><html dir="${ar.value ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${t("org.positions_tree")}</title>${styles}
    <style>html,body{background:#fff!important;margin:0;font-family:inherit}
    .print-head{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px;border-bottom:1px solid #ccc;padding-bottom:6px}
    .print-tree{width:max-content;margin:0 auto}.org-no-print{display:none!important}.org-node-found{outline:none!important}
    *{-webkit-print-color-adjust:exact;print-color-adjust:exact}</style></head>
    <body><div class="print-head"><b style="font-size:18px">${t("org.positions_tree")}</b><small>${t("org.tree_print_date")}: ${new Date().toLocaleDateString(ar.value ? "ar" : "en")}</small></div>
    <div class="print-tree" dir="ltr">${inner.innerHTML}</div></body></html>`);
  doc.close();
  const go = () => {
    // The page is as big as the printed tree (never smaller than A4 landscape).
    const printed = doc.querySelector(".print-tree");
    const width = Math.max(1050, Math.ceil(printed.scrollWidth) + 40);
    const height = Math.max(700, Math.ceil(printed.scrollHeight) + 110);
    const page = doc.createElement("style");
    page.textContent = `@page{size:${width}px ${height}px;margin:16px}`;
    doc.head.appendChild(page);
    frame.contentWindow.focus();
    frame.contentWindow.print();
    setTimeout(() => frame.remove(), 1000);
  };
  setTimeout(go, 400);
}

onMounted(() => {
  load();
  document.addEventListener("fullscreenchange", onFullscreenChange);
  window.addEventListener("pointerup", stopDrag);
});
onBeforeUnmount(() => {
  document.removeEventListener("fullscreenchange", onFullscreenChange);
  window.removeEventListener("pointerup", stopDrag);
});
</script>

<template>
  <div class="sawa-card p-3 flex flex-column gap-4">
    <Toast />
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div>
        <p class="text-xl text-bp-135c65 font-bold m-0">{{ $t("org.title") }}</p>
        <small class="text-color-secondary">{{ $t("org.subtitle") }}</small>
      </div>
      <div class="flex gap-2">
        <Button icon="pi pi-exclamation-circle" :label="$t('stc.menu')" :severity="conflicts ? 'warn' : 'secondary'" variant="outlined"
          :badge="conflicts ? String(conflicts) : undefined" badgeSeverity="warn" @click="$router.push({ name: 'structure-conflicts' })" />
        <Button v-can="'structure log list'" icon="pi pi-history" :label="$t('org.log_menu')" severity="secondary" variant="outlined"
          @click="$router.push({ name: 'structure-log' })" />
        <Button icon="pi pi-refresh" variant="text" :loading="loading" @click="load" v-tooltip.top="$t('refresh_data')" :aria-label="$t('refresh_data')" />
      </div>
    </div>

    <Message v-if="!loading && withoutHead" severity="warn" :closable="false">
      {{ $t("org.departments_without_head", { n: withoutHead }) }}
    </Message>

    <!-- Departments -->
    <section>
      <p class="font-bold text-lg mb-2">{{ $t("departments") }}</p>
      <div v-if="loading" class="py-4 text-center"><ProgressSpinner style="width: 40px; height: 40px" /></div>
      <div v-else class="org-grid">
        <div v-for="d in data.departments" :key="d.id" class="org-dept">
          <div class="flex items-center justify-between gap-2">
            <b>{{ d.title }}</b>
            <Tag :value="$t(d.kind === 'clinical' ? 'org.kind_clinical' : 'org.kind_administrative')" :severity="d.kind === 'clinical' ? 'success' : 'secondary'" />
          </div>
          <small class="text-color-secondary">
            {{ $t("org.counts", { employees: d.employees, therapists: d.therapists }) }}
          </small>
          <Tag v-if="!d.head" :value="$t('org.flow_inactive')" severity="warn" class="self-start" v-tooltip.top="$t('org.no_head_hint')" />

          <label :for="`head-${d.id}`" class="text-sm">{{ $t("org.head") }}</label>
          <Select v-if="editable" :inputId="`head-${d.id}`" v-model="leaders[d.id].head" :options="data.employees" optionLabel="name" optionValue="id"
            filter showClear :placeholder="$t('org.pick_head')" class="w-full" />
          <span v-else>{{ d.head?.name ?? "—" }}</span>

          <label :for="`deputy-${d.id}`" class="text-sm">{{ $t("org.deputy") }}</label>
          <Select v-if="editable" :inputId="`deputy-${d.id}`" v-model="leaders[d.id].deputy" :options="deputyOptions(d)" optionLabel="name" optionValue="id"
            filter showClear :placeholder="$t('org.pick_deputy')" class="w-full" />
          <span v-else>{{ d.deputy?.name ?? "—" }}</span>

          <!-- Its people (main department here) with their job title. -->
          <details v-if="d.members?.length" class="org-members">
            <summary class="text-sm cursor-pointer">{{ $t("stc.members", { n: d.members.length }) }}</summary>
            <ul class="m-0 ps-3 text-sm">
              <li v-for="m in d.members" :key="m.id">{{ m.name }} <small class="text-color-secondary">— {{ m.position ?? $t("stc.no_position") }}</small></li>
            </ul>
          </details>
          <small v-if="d.old_heads && !d.head" class="text-color-secondary"><i class="pi pi-info-circle" /> {{ $t("org.old_heads_active", { n: d.old_heads }) }}</small>
          <Button v-if="editable && changed(d)" :label="$t('save')" icon="pi pi-check" size="small" class="self-end"
            :loading="saving === `d${d.id}`" @click="saveLeaders(d)" />
        </div>
      </div>
    </section>

    <!-- Positions tree -->
    <section ref="chartBox" class="org-tree-box" :class="{ 'org-tree-full': fullscreen }">
      <p class="font-bold text-lg mb-1">{{ $t("org.positions_tree") }}</p>
      <small class="text-color-secondary block mb-2">{{ $t("org.positions_hint") }}</small>
      <!-- Tree controls -->
      <div v-if="!loading && data.positions.length" class="org-tree-tools">
        <div class="flex items-center gap-1">
          <Button icon="pi pi-search-minus" severity="secondary" variant="outlined" size="small" :disabled="zoom <= ZOOM_MIN" @click="zoomOut"
            v-tooltip.top="$t('org.tree_zoom_out')" :aria-label="$t('org.tree_zoom_out')" />
          <Button :label="zoomPercent" severity="secondary" variant="text" size="small" class="org-zoom-label" @click="resetZoom"
            v-tooltip.top="$t('org.tree_reset')" :aria-label="$t('org.tree_reset')" />
          <Button icon="pi pi-search-plus" severity="secondary" variant="outlined" size="small" :disabled="zoom >= ZOOM_MAX" @click="zoomIn"
            v-tooltip.top="$t('org.tree_zoom_in')" :aria-label="$t('org.tree_zoom_in')" />
          <Button icon="pi pi-expand" :label="$t('org.tree_fit')" severity="secondary" variant="outlined" size="small" @click="fitChart" />
        </div>
        <div class="flex items-center gap-1">
          <Button icon="pi pi-plus-circle" severity="secondary" variant="text" size="small" @click="expandAll"
            v-tooltip.top="$t('org.tree_expand_all')" :aria-label="$t('org.tree_expand_all')" />
          <Button icon="pi pi-minus-circle" severity="secondary" variant="text" size="small" @click="collapseAll"
            v-tooltip.top="$t('org.tree_collapse_all')" :aria-label="$t('org.tree_collapse_all')" />
        </div>
        <Select :modelValue="found" @update:modelValue="findPosition" :options="findOptions" optionLabel="title" optionValue="id"
          filter :filterFields="['search']" showClear :placeholder="$t('org.tree_find')" size="small" class="org-tree-find"
          :overlayStyle="{ width: '22rem', maxWidth: '90vw' }">
          <template #option="{ option }">
            <div class="flex flex-column org-find-option">
              <span>{{ option.title }}</span>
              <small v-if="option.sub" class="text-color-secondary">{{ option.sub }}</small>
            </div>
          </template>
        </Select>
        <div class="flex items-center gap-1 ms-auto">
          <Button icon="pi pi-print" :label="$t('print')" severity="secondary" variant="outlined" size="small" @click="printTree"
            v-tooltip.top="$t('org.tree_print')" />
          <Button :icon="fullscreen ? 'pi pi-window-minimize' : 'pi pi-window-maximize'" :label="$t(fullscreen ? 'org.tree_exit_fullscreen' : 'org.tree_fullscreen')"
            size="small" @click="toggleFullscreen" />
        </div>
      </div>
      <small v-if="!loading && data.positions.length" class="text-color-secondary block mb-1"><i class="pi pi-info-circle text-xs" /> {{ $t("org.tree_hint") }}</small>
      <div v-if="!loading && data.positions.length" ref="chartWrap" class="org-chart-wrap" :class="{ 'org-dragging': dragging }" dir="ltr"
        @wheel="onWheel" @pointerdown="onPointerDown" @pointermove="onPointerMove">
        <div ref="chartInner" class="org-chart-inner" :style="{ zoom }">
        <OrganizationChart :value="tree" collapsible v-model:collapsedKeys="collapsedKeys">
          <template #academy="{ node }">
            <b>{{ node.data.title }}</b>
          </template>
          <template #position="{ node }">
            <div class="flex flex-column items-center gap-1 org-node" :class="{ 'org-node-found': found === node.data.id }" :data-position="node.data.id" :dir="ar ? 'rtl' : 'ltr'">
              <b>{{ node.data.title }}</b>
              <!-- What the title gives whoever holds it. -->
              <Tag v-if="node.data.role" :value="node.data.role" severity="info" class="text-xs" />
              <Tag v-else :value="$t('stc.no_role')" severity="warn" class="text-xs" />
              <small v-if="node.data.department" class="text-color-secondary">{{ node.data.department }}</small>
              <small v-if="node.data.employees.length" class="text-color-secondary">{{ node.data.employees.map((e) => e.name).slice(0, 3).join("، ") }}<template v-if="node.data.employees.length > 3"> +{{ node.data.employees.length - 3 }}</template></small>
              <small v-else class="text-color-secondary">{{ $t("org.empty_position") }}</small>
              <Button v-if="editable" icon="pi pi-arrows-alt" size="small" variant="text" class="org-no-print" :label="$t('org.move')" @click="openMove(node.data)" />
            </div>
          </template>
        </OrganizationChart>
        </div>
      </div>
      <p v-else-if="!loading" class="text-color-secondary">{{ $t("org.no_positions") }}</p>
    </section>

    <!-- The structure's roles -->
    <section>
      <p class="font-bold text-lg mb-2">{{ $t("org.roles_title") }}</p>
      <DataTable :value="data.roles" :loading="loading" dataKey="key" size="small" stripedRows>
        <Column :header="$t('org.role')">
          <template #body="{ data: row }">{{ ar ? row.ar : row.en }}</template>
        </Column>
        <Column :header="$t('org.role_name')">
          <template #body="{ data: row }">
            <span v-if="row.name">{{ row.name }}</span>
            <Tag v-else :value="$t('org.role_missing')" severity="warn" v-tooltip.top="$t('org.role_missing_hint')" />
          </template>
        </Column>
        <Column :header="$t('org.reports_to')">
          <template #body="{ data: row }">{{ row.reports_to ? roleLabel(row.reports_to) : "—" }}</template>
        </Column>
        <Column :header="$t('org.people')">
          <template #body="{ data: row }">
            <Tag :value="String(row.users)" :severity="row.users ? 'info' : 'secondary'" />
          </template>
        </Column>
      </DataTable>
    </section>

    <Dialog :visible="!!moving" @update:visible="moving = null" modal :header="$t('org.move_title', { title: moving?.title ?? '' })" :style="{ width: '420px' }">
      <div class="flex flex-column gap-2">
        <label for="org-move-parent">{{ $t("org.reports_to") }}</label>
        <Select inputId="org-move-parent" v-model="moveTo" :options="parentOptions" optionLabel="title" optionValue="id" filter class="w-full" />
      </div>
      <template #footer>
        <Button :label="$t('cancel')" variant="text" severity="secondary" @click="moving = null" />
        <Button :label="$t('save')" icon="pi pi-check" :loading="saving === 'move'" @click="saveMove" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.org-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 0.75rem;
}
.org-dept {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  border: 1px solid rgb(var(--bp-b6dde0));
  border-radius: 10px;
  padding: 0.75rem;
  background: rgb(var(--bp-f0f9fa));
}
.org-members summary {
  color: rgb(var(--bp-135c65));
}
.org-chart-wrap {
  overflow: auto;
  height: 70vh;
  min-height: 320px;
  padding-bottom: 0.5rem;
  border: 1px solid rgb(var(--bp-b6dde0));
  border-radius: 10px;
  background: rgb(var(--bp-f0f9fa) / 0.4);
  cursor: grab;
  user-select: none;
}
.org-chart-wrap.org-dragging {
  cursor: grabbing;
}
.org-chart-inner {
  width: max-content;
  margin: 0 auto;
  padding: 0.75rem;
}
.org-tree-tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}
.org-zoom-label {
  min-width: 4rem;
}
.org-tree-find {
  width: 16rem;
  max-width: 100%;
}
.org-tree-box.org-tree-full {
  background: var(--p-content-background, #fff);
  padding: 1rem;
  display: flex;
  flex-direction: column;
}
.org-tree-full .org-chart-wrap {
  flex: 1;
  height: auto;
}
.org-find-option {
  white-space: normal;
  min-width: 0;
}
.org-node-found {
  outline: 3px solid rgb(var(--bp-135c65));
  outline-offset: 6px;
  border-radius: 6px;
}
.org-node {
  min-width: 9rem;
}
</style>
