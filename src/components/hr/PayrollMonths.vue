<script setup>
// The payroll months above the payrolls: how many and how much each month, the bank transfer file (Mudad's wage
// protection file in Saudi Arabia), and closing a paid month so its payrolls no longer change.
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { errorText } from "@/utils/accounting";
import { can } from "@/utils/permissions";

const emit = defineEmits(["pick"]);
const { t } = useI18n();
const toast = useToast();

const months = ref([]);
const currency = ref("JOD");
const country = ref("JO");
const loading = ref(false);
const money = (v) => Number(v ?? 0).toLocaleString("en", { maximumFractionDigits: 2 });
const cur = computed(() => (currency.value === "SAR" ? t("vac.sar") : t("vac.jod")));

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get("api/payroll/months");
    months.value = data.data;
    currency.value = data.currency;
    country.value = data.country;
  } finally {
    loading.value = false;
  }
}
onMounted(load);
defineExpose({ load });

async function exportFile(month) {
  try {
    const { data } = await axios.get(`api/payroll/months/${month}/export`, { responseType: "blob" });
    const link = Object.assign(document.createElement("a"), { href: URL.createObjectURL(data), download: `salaries-${month}.csv` });
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 4000 });
  }
}

const confirming = ref(null);
async function toggle() {
  const { month, closed_at } = confirming.value;
  try {
    await axios.post(`api/payroll/months/${month}/${closed_at ? "reopen" : "close"}`);
    toast.add({ severity: "success", summary: t(closed_at ? "pmon.reopened" : "pmon.closed_done", { month }), life: 2500 });
    confirming.value = null;
    load();
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 4000 });
  }
}
</script>

<template>
  <div v-if="months.length" class="pmon mb-3">
    <div v-for="m in months.slice(0, 6)" :key="m.month" class="pmon__card" :class="{ 'is-closed': m.closed_at }">
      <div class="flex items-center justify-between gap-2">
        <button type="button" class="pmon__month" dir="ltr" @click="emit('pick', m.month)">{{ m.month }}</button>
        <Tag v-if="m.closed_at" severity="secondary" icon="pi pi-lock" :value="$t('pmon.closed')" v-tooltip.top="m.closed_by" />
      </div>
      <div class="text-sm text-color-secondary">{{ $t("pmon.payrolls", { n: m.payrolls }) }}</div>
      <div class="font-bold">{{ money(m.net) }} {{ cur }}</div>
      <small v-if="m.insurance" class="text-color-secondary">{{ $t("pmon.insurance", { employee: money(m.insurance), employer: money(m.insurance_employer) }) }}</small>
      <div class="flex flex-wrap gap-1 mt-2">
        <Button icon="pi pi-download" :label="country === 'SA' ? $t('pmon.export_sa') : $t('pmon.export')" size="small" outlined @click="exportFile(m.month)" />
        <Button v-if="can('payroll edit')" :icon="m.closed_at ? 'pi pi-lock-open' : 'pi pi-lock'" size="small" text
          :label="m.closed_at ? $t('pmon.reopen') : $t('pmon.close')" @click="confirming = m" />
      </div>
    </div>
  </div>

  <Dialog :visible="!!confirming" modal :header="confirming?.closed_at ? $t('pmon.reopen') : $t('pmon.close')" :style="{ width: '440px' }" @update:visible="confirming = null">
    <p class="m-0">{{ confirming?.closed_at ? $t("pmon.reopen_confirm", { month: confirming?.month }) : $t("pmon.close_confirm", { month: confirming?.month }) }}</p>
    <template #footer>
      <Button :label="$t('cancel')" text severity="secondary" @click="confirming = null" />
      <Button :icon="confirming?.closed_at ? 'pi pi-lock-open' : 'pi pi-lock'" :label="confirming?.closed_at ? $t('pmon.reopen') : $t('pmon.close')" @click="toggle" />
    </template>
  </Dialog>
</template>

<style scoped>
.pmon { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.75rem; }
.pmon__card { display: grid; gap: 0.2rem; padding: 0.9rem 1rem; border: 1px solid var(--p-content-border-color); border-radius: 14px; background: var(--p-content-background, #fff); }
.pmon__card.is-closed { background: var(--p-surface-50, #f8fafc); }
.pmon__month { background: none; border: 0; padding: 0; font: inherit; font-weight: 800; font-size: 1.1rem; color: var(--p-primary-color); cursor: pointer; }
</style>
