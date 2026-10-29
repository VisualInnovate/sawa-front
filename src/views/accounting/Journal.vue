<script setup>
// «القيود المحاسبية»: the entries the system makes — approving and paying the salaries, paying the extras apart,
// giving an advance — each balanced (debit = credit); an entry taken back shows its reverse. The accounts tab sets
// each account's code and names (accounting settings).
import axios from "axios";
import moment from "moment";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { errorText } from "@/utils/accounting";
import { can } from "@/utils/permissions";
import { escapeHtml as esc, PRINT_STYLE, printHtml } from "@/utils/printHtml";

const { t, locale } = useI18n();
const toast = useToast();

const SOURCES = ["payroll_approval", "payroll_payment", "payroll_extras", "advance"];
const entries = ref([]);
const accounts = ref([]);
const loading = ref(false);
const tab = ref("entries");
const filter = ref({ range: [moment().startOf("year").toDate(), new Date()], source: null });
const ar = computed(() => locale.value === "ar");
const money = (v) => Number(v ?? 0).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const accountName = (a) => (ar.value ? a?.name_ar : a?.name_en || a?.name_ar);
const sourceLabel = (e) => t(`jr.src_${e.source}`) + (e.reverses_id ? ` — ${t("jr.reversal")}` : "");
const totals = computed(() => entries.value.reduce((s, e) => s + e.lines.reduce((x, l) => x + Number(l.debit), 0), 0));

const params = () => {
  const [from, to] = filter.value.range ?? [];
  return { from: from ? moment(from).format("YYYY-MM-DD") : undefined, to: to ? moment(to).format("YYYY-MM-DD") : undefined, source: filter.value.source || undefined };
};
async function load() {
  loading.value = true;
  try {
    entries.value = (await axios.get("api/accounting/journal", { params: params() })).data.data;
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  } finally {
    loading.value = false;
  }
}
async function loadAccounts() {
  accounts.value = (await axios.get("api/accounting/journal/accounts")).data.data;
}
onMounted(() => {
  load();
  loadAccounts();
});

async function exportExcel() {
  try {
    const { data } = await axios.get("api/accounting/journal/export", {
      responseType: "blob",
      params: { ...params(), title: t("jr.title"), rtl: ar.value ? 1 : 0, sources: Object.fromEntries(SOURCES.map((s) => [s, t(`jr.src_${s}`)])),
        headers: ["date", "number", "source", "description", "code", "account", "debit", "credit"].map((k) => t(`jr.h_${k}`)) },
    });
    const link = Object.assign(document.createElement("a"), { href: URL.createObjectURL(data), download: `journal-${moment().format("YYYY-MM-DD")}.xlsx` });
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  }
}

function print() {
  const blocks = entries.value.map((e) => `<h3 style="margin:18px 0 6px">#${e.id} · <span dir="ltr">${esc(e.date)}</span> · ${esc(sourceLabel(e))}</h3>
<div class="muted">${esc(e.description)}</div>
<table><thead><tr><th>${esc(t("jr.h_code"))}</th><th>${esc(t("jr.h_account"))}</th><th class="num">${esc(t("jr.h_debit"))}</th><th class="num">${esc(t("jr.h_credit"))}</th></tr></thead><tbody>
${e.lines.map((l) => `<tr><td dir="ltr">${esc(l.account?.code)}</td><td>${esc(accountName(l.account))}</td><td class="num">${Number(l.debit) ? money(l.debit) : ""}</td><td class="num">${Number(l.credit) ? money(l.credit) : ""}</td></tr>`).join("")}
</tbody></table>`).join("");
  printHtml(`<!doctype html><html lang="${ar.value ? "ar" : "en"}" dir="${ar.value ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${esc(t("jr.title"))}</title>
<style>${PRINT_STYLE}</style></head><body><h1>${esc(t("jr.title"))}</h1>${blocks}</body></html>`);
}

// Accounts: code and names.
const editing = ref(null);
async function saveAccount() {
  try {
    await axios.put(`api/accounting/journal/accounts/${editing.value.id}`, editing.value);
    editing.value = null;
    loadAccounts();
    load();
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  }
}
const KIND_SEVERITY = { asset: "info", liability: "warn", expense: "danger" };
</script>

<template>
  <div>
    <Toast />
    <div class="flex flex-wrap items-center justify-between gap-2 p-4">
      <p class="text-xl text-bp-135c65 font-bold m-0">{{ $t("jr.title") }}</p>
      <div class="flex gap-2">
        <Button icon="pi pi-print" :label="$t('jr.print')" outlined :disabled="!entries.length" @click="print" />
        <Button icon="pi pi-file-excel" label="Excel" outlined :disabled="!entries.length" @click="exportExcel" />
      </div>
    </div>

    <Tabs v-model:value="tab">
      <TabList>
        <Tab value="entries">{{ $t("jr.entries") }}</Tab>
        <Tab value="accounts">{{ $t("jr.accounts") }}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="entries">
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <DatePicker v-model="filter.range" selectionMode="range" dateFormat="yy-mm-dd" showIcon class="w-16rem" :manualInput="false" @update:modelValue="(v) => v?.[1] && load()" />
            <Select v-model="filter.source" :options="SOURCES" :optionLabel="(s) => $t(`jr.src_${s}`)" showClear :placeholder="$t('jr.all_sources')" class="w-14rem" @change="load" />
            <small class="text-color-secondary ms-auto">{{ $t("jr.count", { n: entries.length, amount: money(totals) }) }}</small>
          </div>
          <ProgressSpinner v-if="loading" class="w-3rem h-3rem" />
          <p v-else-if="!entries.length" class="text-color-secondary">{{ $t("jr.empty") }}</p>
          <div v-else class="flex flex-column gap-3">
            <section v-for="e in entries" :key="e.id" class="jr-entry" :class="{ 'is-reversal': e.reverses_id }">
              <header class="flex flex-wrap items-center gap-2 mb-2">
                <b>#{{ e.id }}</b>
                <bdi dir="ltr" class="text-color-secondary">{{ e.date }}</bdi>
                <Tag :value="sourceLabel(e)" :severity="e.reverses_id ? 'secondary' : 'info'" />
                <span class="text-sm">{{ e.description }}</span>
                <small v-if="e.creator" class="text-color-secondary ms-auto">{{ e.creator.name }}</small>
              </header>
              <table class="jr-lines">
                <thead><tr><th>{{ $t("jr.h_code") }}</th><th>{{ $t("jr.h_account") }}</th><th class="num">{{ $t("jr.h_debit") }}</th><th class="num">{{ $t("jr.h_credit") }}</th></tr></thead>
                <tbody>
                  <tr v-for="l in e.lines" :key="l.id">
                    <td><bdi dir="ltr">{{ l.account?.code }}</bdi></td>
                    <td :class="{ 'ps-5': Number(l.credit) }">{{ accountName(l.account) }}</td>
                    <td class="num">{{ Number(l.debit) ? money(l.debit) : "" }}</td>
                    <td class="num">{{ Number(l.credit) ? money(l.credit) : "" }}</td>
                  </tr>
                </tbody>
              </table>
            </section>
          </div>
        </TabPanel>

        <TabPanel value="accounts">
          <p class="text-sm text-color-secondary mt-0">{{ $t("jr.accounts_hint") }}</p>
          <DataTable :value="accounts" dataKey="id" size="small" stripedRows>
            <Column :header="$t('jr.h_code')"><template #body="{ data }"><bdi dir="ltr" class="font-medium">{{ data.code }}</bdi></template></Column>
            <Column :header="$t('jr.name_ar')" field="name_ar" />
            <Column :header="$t('jr.name_en')" field="name_en" />
            <Column :header="$t('jr.kind')"><template #body="{ data }"><Tag :severity="KIND_SEVERITY[data.kind]" :value="$t(`jr.kind_${data.kind}`)" /></template></Column>
            <Column v-if="can('accounting settings edit')" class="text-end">
              <template #body="{ data }"><Button icon="pi pi-pencil" text rounded size="small" :aria-label="$t('edit')" @click="editing = { ...data }" /></template>
            </Column>
          </DataTable>
        </TabPanel>
      </TabPanels>
    </Tabs>

    <Dialog :visible="!!editing" modal :header="$t('edit')" :style="{ width: '440px' }" @update:visible="editing = null">
      <div v-if="editing" class="flex flex-column gap-3">
        <div class="flex flex-column gap-1">
          <label for="acc-code">{{ $t("jr.h_code") }}</label>
          <InputText id="acc-code" v-model="editing.code" dir="ltr" maxlength="20" class="text-start" />
        </div>
        <div class="flex flex-column gap-1">
          <label for="acc-ar">{{ $t("jr.name_ar") }}</label>
          <InputText id="acc-ar" v-model="editing.name_ar" maxlength="255" />
        </div>
        <div class="flex flex-column gap-1">
          <label for="acc-en">{{ $t("jr.name_en") }}</label>
          <InputText id="acc-en" v-model="editing.name_en" dir="ltr" maxlength="255" class="text-start" />
        </div>
      </div>
      <template #footer>
        <Button :label="$t('cancel')" text severity="secondary" @click="editing = null" />
        <Button icon="pi pi-check" :label="$t('save')" :disabled="!editing?.code || !editing?.name_ar" @click="saveAccount" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.jr-entry { border: 1px solid var(--p-content-border-color); border-radius: 14px; padding: 0.8rem 1rem; background: var(--p-content-background, #fff); }
.jr-entry.is-reversal { background: var(--p-surface-50, #f8fafc); }
.jr-lines { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
.jr-lines th { text-align: start; font-weight: 600; color: var(--p-text-muted-color); border-bottom: 1px solid var(--p-content-border-color); padding: 0.3rem 0.4rem; }
.jr-lines td { padding: 0.3rem 0.4rem; border-bottom: 1px dashed var(--p-content-border-color); }
.jr-lines .num { text-align: end; width: 9rem; font-variant-numeric: tabular-nums; }
</style>
