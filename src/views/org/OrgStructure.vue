<script setup>
// The org structure (phase 2): the departments with their head and deputy, the positions tree (who reports to whom)
// and the structure's roles with how many people hold them. Built without people: a department whose head is not set
// keeps its old leave approvers until one is.
import axios from "axios";
import { computed, nextTick, onMounted, ref } from "vue";
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

async function load() {
  loading.value = true;
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

onMounted(load);
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

          <small v-if="d.old_heads && !d.head" class="text-color-secondary"><i class="pi pi-info-circle" /> {{ $t("org.old_heads_active", { n: d.old_heads }) }}</small>
          <Button v-if="editable && changed(d)" :label="$t('save')" icon="pi pi-check" size="small" class="self-end"
            :loading="saving === `d${d.id}`" @click="saveLeaders(d)" />
        </div>
      </div>
    </section>

    <!-- Positions tree -->
    <section>
      <p class="font-bold text-lg mb-1">{{ $t("org.positions_tree") }}</p>
      <small class="text-color-secondary block mb-2">{{ $t("org.positions_hint") }}</small>
      <div v-if="!loading && data.positions.length" ref="chartWrap" class="org-chart-wrap" dir="ltr">
        <OrganizationChart :value="tree" collapsible>
          <template #academy="{ node }">
            <b>{{ node.data.title }}</b>
          </template>
          <template #position="{ node }">
            <div class="flex flex-column items-center gap-1 org-node" :dir="ar ? 'rtl' : 'ltr'">
              <b>{{ node.data.title }}</b>
              <small v-if="node.data.employees.length" class="text-color-secondary">{{ node.data.employees.map((e) => e.name).slice(0, 3).join("، ") }}<template v-if="node.data.employees.length > 3"> +{{ node.data.employees.length - 3 }}</template></small>
              <small v-else class="text-color-secondary">{{ $t("org.empty_position") }}</small>
              <Button v-if="editable" icon="pi pi-arrows-alt" size="small" variant="text" :label="$t('org.move')" @click="openMove(node.data)" />
            </div>
          </template>
        </OrganizationChart>
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
.org-chart-wrap {
  overflow-x: auto;
  padding-bottom: 0.5rem;
}
.org-node {
  min-width: 9rem;
}
</style>
