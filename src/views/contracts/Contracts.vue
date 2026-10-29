<script setup>
// «العقود»: contracts issued to parents. Issue one from a template for a child (optionally from one of their programs);
// it opens as a draft to fill and check. Anything not approved prints with «غير معتمد».
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { can } from "@/utils/permissions";
import { printHtml } from "@/utils/printHtml";
import { STATUSES, contractPage, statusSeverity } from "@/components/contracts/contractStatus";

const { t, locale } = useI18n();
const toast = useToast();
const confirm = useConfirm();
const router = useRouter();
const route = useRoute();

const rows = ref([]);
const counts = ref({});
const meta = ref({ total: 0, page: 1, pages: 1 });
const loading = ref(true);
const status = ref(route.query.status || null);
const search = ref("");
const page = ref(1);
const busy = ref(null);

const ltr = (s) => String.fromCharCode(0x2066) + s + String.fromCharCode(0x2069);
const date = (iso) => (iso ? new Date(iso).toLocaleDateString(locale.value === "ar" ? "ar-JO" : "en-GB", { dateStyle: "medium" }) : "");
const tabs = computed(() => [{ value: null, label: t("con.all"), n: Object.values(counts.value).reduce((a, b) => a + b, 0) }, ...STATUSES.map((s) => ({ value: s, label: t("con.status_" + s), n: counts.value[s] || 0 }))]);
const fail = (e) => toast.add({ severity: "error", summary: t("error"), detail: Object.values(e.response?.data?.errors || {})[0]?.[0] || e.response?.data?.message || t("mission_error"), life: 4000 });

let timer = null;
async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get("api/parent-contracts", { params: { status: status.value || undefined, search: search.value || undefined, page: page.value } });
    rows.value = data.data;
    counts.value = data.counts || {};
    meta.value = data.meta;
  } catch (e) {
    fail(e);
  } finally {
    loading.value = false;
  }
}
onMounted(load);
watch(status, () => {
  page.value = 1;
  load();
});
watch(search, () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    page.value = 1;
    load();
  }, 350);
});

// «إصدار عقد»: child → (program) → template.
const issue = ref({ open: false, child: null, program: null, template: null, saving: false });
const children = ref([]);
const programs = ref([]);
const templates = ref([]);
let childTimer = null;

async function openIssue() {
  issue.value = { open: true, child: null, program: null, template: null, saving: false };
  programs.value = [];
  const [opt] = await Promise.all([axios.get("api/parent-contracts/options"), findChildren("")]);
  templates.value = opt.data.templates;
}
async function findChildren(text) {
  const { data } = await axios.get("api/parent-contracts/children", { params: { search: text || undefined } });
  const picked = children.value.find((c) => c.id === issue.value.child);
  const found = data.data.map((c) => ({ ...c, label: c.parent ? `${c.name} — ${c.parent}` : c.name }));
  // Keep the chosen child in the list so its name stays shown after another search.
  children.value = picked && !found.some((c) => c.id === picked.id) ? [picked, ...found] : found;
}
const onChildFilter = (e) => {
  clearTimeout(childTimer);
  childTimer = setTimeout(() => findChildren(e.value), 300);
};
watch(() => issue.value.child, async (id) => {
  issue.value.program = null;
  programs.value = [];
  if (!id) return;
  const { data } = await axios.get(`api/parent-contracts/children/${id}/programs`);
  programs.value = data.data.map((p) => ({ ...p, label: `${t("ct.kind_" + p.template_kind)} · ${ltr(p.start_date || "")} – ${ltr(p.end_date || "")}` }));
});
// A program suggests the template made for its kind.
watch(() => issue.value.program, (id) => {
  const kind = programs.value.find((p) => p.id === id)?.template_kind;
  const match = kind && templates.value.find((tpl) => tpl.kind === kind);
  if (match) issue.value.template = match.id;
});

async function createDraft() {
  issue.value.saving = true;
  try {
    const { data } = await axios.post("api/parent-contracts", { template_id: issue.value.template, child_id: issue.value.child, student_program_id: issue.value.program || null });
    issue.value.open = false;
    router.push({ name: "parent-contract", params: { id: data.data.id } });
  } catch (e) {
    fail(e);
  } finally {
    issue.value.saving = false;
  }
}

async function print(row) {
  busy.value = row.id;
  try {
    const { data } = await axios.get(`api/parent-contracts/${row.id}`);
    printHtml(contractPage(data.data, t));
  } catch (e) {
    fail(e);
  } finally {
    busy.value = null;
  }
}

function cancel(row) {
  confirm.require({
    header: t("con.cancel"),
    message: t("con.confirm_cancel", { number: row.number }),
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger",
    accept: async () => {
      try {
        await axios.post(`api/parent-contracts/${row.id}/cancel`);
        toast.add({ severity: "success", summary: t("con.cancelled"), life: 2500 });
        load();
      } catch (e) {
        fail(e);
      }
    },
  });
}

function remove(row) {
  confirm.require({
    header: t("con.delete"),
    message: t("con.confirm_delete", { number: row.number }),
    icon: "pi pi-trash",
    acceptClass: "p-button-danger",
    accept: async () => {
      try {
        await axios.delete(`api/parent-contracts/${row.id}`);
        toast.add({ severity: "success", summary: t("con.deleted"), life: 2500 });
        load();
      } catch (e) {
        fail(e);
      }
    },
  });
}
</script>

<template>
  <div class="sawa-card p-3">
    <div class="flex flex-wrap items-start justify-between gap-3 mb-3">
      <div>
        <p class="text-xl text-bp-135c65 font-bold mb-1"><i class="pi pi-file-check" aria-hidden="true" /> {{ t("con.menu") }}</p>
        <p class="text-color-secondary m-0">{{ t("con.hint") }}</p>
      </div>
      <Button v-if="can('parent contracts create')" icon="pi pi-plus" :label="t('con.issue')" @click="openIssue" />
    </div>

    <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
      <div class="con-tabs" role="tablist">
        <button v-for="tab in tabs" :key="tab.value || 'all'" type="button" role="tab" :aria-selected="status === tab.value" class="con-tab" :class="{ on: status === tab.value }" @click="status = tab.value">
          {{ tab.label }} <span class="con-n">{{ tab.n }}</span>
        </button>
      </div>
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText v-model="search" :placeholder="t('con.search')" :aria-label="t('con.search')" />
      </IconField>
    </div>

    <DataTable :value="rows" :loading="loading" data-key="id" class="con-table" striped-rows>
      <template #empty><p class="text-center text-color-secondary p-3 m-0">{{ t("con.empty") }}</p></template>
      <Column :header="t('con.number')">
        <template #body="{ data }"><span dir="ltr" class="font-bold">{{ data.number }}</span></template>
      </Column>
      <Column :header="t('con.child')" field="child_name" />
      <Column :header="t('con.template')">
        <template #body="{ data }">{{ data.template_name }} <small class="text-color-secondary">({{ t("ct.version_n", { n: data.template_version }) }})</small></template>
      </Column>
      <Column :header="t('con.recipient')">
        <template #body="{ data }">{{ data.recipient_name }}<div v-if="data.recipient_phone" class="text-sm text-color-secondary" dir="ltr">{{ data.recipient_phone }}</div></template>
      </Column>
      <Column :header="t('con.status')">
        <template #body="{ data }"><Tag :severity="statusSeverity(data.status)" :value="t('con.status_' + data.status)" /></template>
      </Column>
      <Column :header="t('con.created')">
        <template #body="{ data }">{{ date(data.created_at) }}<div class="text-sm text-color-secondary">{{ data.created_by }}</div></template>
      </Column>
      <Column :header="t('actions')" style="width: 1%; white-space: nowrap">
        <template #body="{ data }">
          <div class="flex gap-1">
            <Button icon="pi pi-folder-open" size="small" text :aria-label="t('con.open')" v-tooltip.top="t('con.open')" @click="router.push({ name: 'parent-contract', params: { id: data.id } })" />
            <Button icon="pi pi-print" size="small" text severity="secondary" :loading="busy === data.id" :aria-label="t('con.print')" v-tooltip.top="t('con.print')" @click="print(data)" />
            <Button v-if="can('parent contracts edit') && ['draft', 'sent'].includes(data.status)" icon="pi pi-ban" size="small" text severity="warn" :aria-label="t('con.cancel')" v-tooltip.top="t('con.cancel')" @click="cancel(data)" />
            <Button v-if="can('parent contracts delete') && data.status === 'draft'" icon="pi pi-trash" size="small" text severity="danger" :aria-label="t('con.delete')" v-tooltip.top="t('con.delete')" @click="remove(data)" />
          </div>
        </template>
      </Column>
    </DataTable>
    <Paginator v-if="meta.pages > 1" :rows="25" :total-records="meta.total" :first="(page - 1) * 25" @page="(e) => { page = e.page + 1; load(); }" />

    <Dialog v-model:visible="issue.open" modal :header="t('con.issue')" :style="{ width: '560px', maxWidth: '96vw' }">
      <div class="grid gap-3">
        <div class="grid gap-1">
          <label for="con-child" class="font-bold">{{ t("con.child") }}</label>
          <Select input-id="con-child" v-model="issue.child" :options="children" option-label="label" option-value="id" filter :filter-placeholder="t('con.search_child')" :placeholder="t('con.pick_child')" @filter="onChildFilter" class="w-full" />
        </div>
        <div class="grid gap-1">
          <label for="con-program" class="font-bold">{{ t("con.program") }}</label>
          <Select input-id="con-program" v-model="issue.program" :options="programs" option-label="label" option-value="id" show-clear :disabled="!issue.child" :placeholder="programs.length ? t('con.pick_program') : t('con.no_program')" class="w-full" />
          <small class="text-color-secondary">{{ t("con.program_hint") }}</small>
        </div>
        <div class="grid gap-1">
          <label for="con-template" class="font-bold">{{ t("con.template") }}</label>
          <Select input-id="con-template" v-model="issue.template" :options="templates" option-label="name" option-value="id" :placeholder="t('con.pick_template')" class="w-full" />
        </div>
      </div>
      <template #footer>
        <Button :label="t('cancel')" text severity="secondary" @click="issue.open = false" />
        <Button icon="pi pi-check" :label="t('con.create_draft')" :loading="issue.saving" :disabled="!issue.child || !issue.template" @click="createDraft" />
      </template>
    </Dialog>
    <ConfirmDialog />
    <Toast />
  </div>
</template>

<style scoped>
.con-tabs { display: flex; flex-wrap: wrap; gap: .35rem; }
.con-tab { border: 1px solid #e2e8f0; background: #fff; border-radius: 999px; padding: .35rem .8rem; font: inherit; font-size: .85rem; cursor: pointer; color: #334155; }
.con-tab.on { background: rgb(var(--bp-135c65)); border-color: rgb(var(--bp-135c65)); color: #fff; }
.con-n { display: inline-block; min-width: 1.4em; padding: 0 .35em; border-radius: 999px; background: rgba(0, 0, 0, .08); font-size: .75rem; text-align: center; }
.con-tab.on .con-n { background: rgba(255, 255, 255, .25); }
</style>
