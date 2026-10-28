<script setup>
// «سندات القبض»: every receipt by date, child and method; printed, or cancelled with a reason (never deleted).
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { FilterMatchMode } from "@primevue/core/api";
import { can } from "@/utils/permissions";
import { PAYMENT_METHODS, amount, errorText, isoDate, loadCurrency } from "@/utils/accounting";
import AccountingTabs from "@/components/accounting/AccountingTabs.vue";
import PaymentDialog from "@/components/accounting/PaymentDialog.vue";

const { t } = useI18n();
const router = useRouter();
const toast = useToast();
const payments = ref([]);
const loading = ref(true);
const range = ref(null);
const method = ref("all");
const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
const paying = ref(false);
const cancelling = ref(null);
const reason = ref("");

const rows = computed(() => payments.value.map((row) => ({ ...row, child_name: row.child?.name })));
const total = computed(() => rows.value.filter((row) => !row.cancelled_at && row.method !== "balance").reduce((sum, row) => sum + Number(row.amount), 0));
const methods = computed(() => [{ value: "all", label: t("acc.all") }, ...PAYMENT_METHODS.map((value) => ({ value, label: t(`acc.methods.${value}`) }))]);

async function load() {
  loading.value = true;
  await loadCurrency();
  const [from, to] = range.value ?? [];
  const { data } = await axios.get("api/accounting/payments", { params: { from: isoDate(from) ?? undefined, to: isoDate(to ?? from) ?? undefined, method: method.value === "all" ? undefined : method.value } });
  payments.value = data.data;
  loading.value = false;
}

watch([range, method], () => { if (!range.value || range.value[1] || !range.value[0]) load(); });

async function cancel() {
  try {
    await axios.post(`api/accounting/payments/${cancelling.value.id}/cancel`, { reason: reason.value });
    cancelling.value = null;
    reason.value = "";
    load();
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  }
}

const print = (row) => window.open(router.resolve({ name: "accounting-receipt", params: { id: row.id } }).href, "_blank");
onMounted(load);
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-2 p-4">
      <p class="text-xl text-bp-135c65 font-bold m-0">{{ $t("acc.payments") }}</p>
      <Button v-if="can('accounting payments create')" icon="pi pi-wallet" :label="$t('acc.pay')" @click="paying = true" />
    </div>
    <AccountingTabs />
    <div class="sawa-card p-3">
      <div class="flex flex-wrap items-end justify-between gap-2 mb-3">
        <div class="flex flex-wrap gap-2">
          <DatePicker v-model="range" selectionMode="range" dateFormat="yy-mm-dd" showIcon showButtonBar :placeholder="$t('acc.date')" :aria-label="$t('acc.date')" />
          <Select v-model="method" :options="methods" optionLabel="label" optionValue="value" class="w-12rem" :aria-label="$t('acc.method')" />
          <IconField>
            <InputIcon class="pi pi-search" />
            <InputText v-model="filters.global.value" :placeholder="$t('acc.search_child')" />
          </IconField>
        </div>
        <span class="text-lg font-bold text-bp-135c65">{{ $t("acc.total") }}: {{ amount(total) }}</span>
      </div>
      <DataTable :value="rows" :loading="loading" dataKey="id" v-model:filters="filters" :globalFilterFields="['child_name', 'reference']"
        paginator :rows="20" stripedRows :rowClass="(row) => (row.cancelled_at ? 'opacity-60' : '')">
        <Column field="receipt_no" :header="$t('acc.receipt_no')" sortable />
        <Column field="paid_on" :header="$t('acc.paid_on')" sortable />
        <Column field="child_name" :header="$t('acc.child')" sortable />
        <Column :header="$t('acc.amount')">
          <template #body="{ data }"><span :class="{ 'line-through': data.cancelled_at }">{{ amount(data.amount) }}</span></template>
        </Column>
        <Column :header="$t('acc.method')">
          <template #body="{ data }">{{ $t(`acc.methods.${data.method}`) }}<span v-if="data.reference" class="text-xs text-color-secondary"> · {{ data.reference }}</span></template>
        </Column>
        <Column :header="$t('acc.created_by')">
          <template #body="{ data }">
            {{ data.creator?.name }}
            <div v-if="data.cancelled_at" class="text-xs text-red-600">{{ $t("acc.cancelled_by", { name: data.canceller?.name, reason: data.cancel_reason }) }}</div>
          </template>
        </Column>
        <Column header-style="width:6rem">
          <template #body="{ data }">
            <div class="flex gap-1">
              <Button icon="pi pi-print" size="small" text rounded :aria-label="$t('acc.print')" v-tooltip.top="$t('acc.print')" @click="print(data)" />
              <Button v-if="!data.cancelled_at && can('accounting payments delete')" icon="pi pi-ban" size="small" text rounded severity="danger"
                :aria-label="$t('acc.cancel_payment')" v-tooltip.top="$t('acc.cancel_payment')" @click="cancelling = data" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
    <PaymentDialog v-model:visible="paying" @saved="(payment) => { load(); print(payment); }" />
    <Dialog :visible="!!cancelling" modal :header="$t('acc.cancel_payment')" :style="{ width: '28rem' }" @update:visible="cancelling = null">
      <p class="text-sm">{{ $t("acc.cancel_payment_hint") }}</p>
      <div class="flex flex-column gap-1">
        <label for="pay-cancel-reason">{{ $t("acc.reason") }}</label>
        <InputText v-model="reason" id="pay-cancel-reason" />
      </div>
      <template #footer>
        <Button :label="$t('acc.close')" severity="secondary" variant="outlined" @click="cancelling = null" />
        <Button :label="$t('acc.cancel_payment')" severity="danger" :disabled="!reason.trim()" @click="cancel" />
      </template>
    </Dialog>
    <Toast />
  </div>
</template>
