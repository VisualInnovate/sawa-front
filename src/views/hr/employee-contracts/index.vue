<script setup>
// «مستندات التوظيف»: every offer letter, work contract and amendment, by status — the general manager finds what waits
// for approval, the signer what is ready to sign, HR the rest. Each opens on the document page; they are issued from
// a contract's «المستندات» on «العقود».
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { can } from "@/utils/permissions";
import { EMPLOYEE_STATUSES, statusSeverity } from "@/components/contracts/contractStatus";
import { DOC_TYPES } from "@/components/hr/employeeContracts";

const { t, locale } = useI18n();
const toast = useToast();
const router = useRouter();
const route = useRoute();

// Each person starts on what waits for them.
const firstStatus = () => route.query.status || (can("employee contract approval edit") ? "pending_approval" : can("employee contract signing edit") ? "ready" : null);
const rows = ref([]);
const counts = ref({});
const meta = ref({ total: 0, page: 1, pages: 1 });
const loading = ref(true);
const status = ref(firstStatus());
const docType = ref(null);
const search = ref("");
const page = ref(1);

const date = (iso) => (iso ? new Date(iso).toLocaleDateString(locale.value === "ar" ? "ar-JO" : "en-GB", { dateStyle: "medium" }) : "");
const tabs = computed(() => [
  { value: null, label: t("con.all"), n: Object.values(counts.value).reduce((a, b) => a + b, 0) },
  ...EMPLOYEE_STATUSES.map((s) => ({ value: s, label: t("ect.st_" + s), n: counts.value[s] || 0 })),
]);
const typeOptions = computed(() => DOC_TYPES.map((value) => ({ value, label: t("ect.doc_" + value) })));
const vacancyTitle = (v) => (v ? (locale.value === "ar" ? v.title_ar : v.title_en || v.title_ar) : "");

let timer = null;
async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get("api/employee-contracts", { params: { status: status.value || undefined, doc_type: docType.value || undefined, search: search.value || undefined, page: page.value } });
    rows.value = data.data;
    counts.value = data.counts || {};
    meta.value = data.meta;
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message || t("mission_error"), life: 4000 });
  } finally {
    loading.value = false;
  }
}
onMounted(load);
watch([status, docType], () => {
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
</script>

<template>
  <div class="sawa-card p-3">
    <div class="flex flex-wrap items-start justify-between gap-3 mb-3">
      <div>
        <p class="text-xl text-bp-135c65 font-bold mb-1"><i class="pi pi-file-check" aria-hidden="true" /> {{ t("ect.menu") }}</p>
        <p class="text-color-secondary m-0">{{ t("ect.list_hint") }}</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <Button v-if="can('contracts list')" icon="pi pi-briefcase" :label="t('ctr.title')" severity="secondary" outlined @click="router.push({ name: 'contracts' })" />
        <Button v-if="can('contracts list')" icon="pi pi-file-edit" :label="t('ect.templates')" severity="secondary" outlined @click="router.push({ name: 'employee-contract-templates' })" />
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
      <div class="ec-tabs" role="tablist">
        <button v-for="tab in tabs" :key="tab.value || 'all'" type="button" role="tab" :aria-selected="status === tab.value" class="ec-tab" :class="{ on: status === tab.value }" @click="status = tab.value">
          {{ tab.label }} <span class="ec-n">{{ tab.n }}</span>
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        <Select v-model="docType" :options="typeOptions" optionLabel="label" optionValue="value" showClear :placeholder="t('ect.all_types')" class="w-12rem" :aria-label="t('ect.all_types')" />
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText v-model="search" :placeholder="t('ect.search')" :aria-label="t('ect.search')" />
        </IconField>
      </div>
    </div>

    <DataTable :value="rows" :loading="loading" data-key="id" striped-rows>
      <template #empty><p class="text-center text-color-secondary p-3 m-0">{{ t("ect.empty") }}</p></template>
      <Column :header="t('con.number')">
        <template #body="{ data }"><span dir="ltr" class="font-bold">{{ data.number }}</span></template>
      </Column>
      <Column :header="t('ect.type')">
        <template #body="{ data }">{{ t("ect.doc_" + data.doc_type) }}</template>
      </Column>
      <Column :header="t('ect.employee')">
        <template #body="{ data }">{{ data.recipient_name }}<div class="text-sm text-color-secondary">{{ vacancyTitle(data.vacancy) }}</div></template>
      </Column>
      <Column :header="t('con.status')">
        <template #body="{ data }"><Tag :severity="statusSeverity(data.status)" :value="t('ect.st_' + data.status)" /></template>
      </Column>
      <Column :header="t('con.created')">
        <template #body="{ data }">{{ date(data.created_at) }}<div class="text-sm text-color-secondary">{{ data.created_by }}</div></template>
      </Column>
      <Column :header="t('actions')" style="width: 1%; white-space: nowrap">
        <template #body="{ data }">
          <Button icon="pi pi-folder-open" :label="t('con.open')" size="small" text @click="router.push({ name: 'employee-contract', params: { id: data.id } })" />
        </template>
      </Column>
    </DataTable>
    <Paginator v-if="meta.pages > 1" :rows="25" :total-records="meta.total" :first="(page - 1) * 25" @page="(e) => { page = e.page + 1; load(); }" />
  </div>
</template>

<style scoped>
.ec-tabs { display: flex; flex-wrap: wrap; gap: .35rem; }
.ec-tab { border: 1px solid #e2e8f0; background: #fff; border-radius: 999px; padding: .35rem .8rem; cursor: pointer; font: inherit; color: inherit; font-size: .88rem; }
.ec-tab.on { background: rgb(var(--bp-135c65)); border-color: rgb(var(--bp-135c65)); color: #fff; }
.ec-n { display: inline-block; min-width: 1.4rem; padding: 0 .35rem; border-radius: 99px; background: rgb(0 0 0 / .06); font-weight: 700; font-size: .78rem; }
.ec-tab.on .ec-n { background: rgb(255 255 255 / .25); }
</style>
