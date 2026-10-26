<script setup>
// «التقييمات والاستشارات»: evaluations of children without a confirmed program, and paid consultations, by billing state:
// waiting for payment (pay or confirm without payment), paid, confirmed, cancelled for not being paid.
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import { can } from "@/utils/permissions";
import { getEvaluationTypeLabel } from "@/utils/evaluationTypes";
import { amount, billingSeverity, errorText, loadCurrency } from "@/utils/accounting";
import AccountingTabs from "@/components/accounting/AccountingTabs.vue";
import PaymentDialog from "@/components/accounting/PaymentDialog.vue";

const { t } = useI18n();
const route = useRoute();
const toast = useToast();
const tab = ref(route.query.tab === "consultations" ? "consultations" : "evaluations");
const status = ref("locked");
const rows = ref([]);
const loading = ref(true);
const paying = ref(null);

const statuses = ["locked", "paid", "confirmed", "cancelled"];

async function load() {
  loading.value = true;
  await loadCurrency();
  const { data } = await axios.get(`api/accounting/${tab.value}`, { params: { status: status.value } });
  rows.value = data.data;
  loading.value = false;
}

watch([tab, status], load);

async function confirm(row) {
  try {
    await axios.post(`api/accounting/${tab.value}/${row.id}/confirm`);
    toast.add({ severity: "success", summary: t("success_message"), detail: t("acc.saved"), life: 2500 });
    load();
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  }
}

const appointment = (row) => tab.value === "consultations"
  ? String(row.start ?? "").slice(0, 16)
  : row.start_time ? `${row.date} ${row.start_time.slice(0, 5)}` : `${row.date} · ${t("acc.without_appointment")}`;
const openInstallments = (row) => (row.charge?.installments ?? []).filter((installment) => installment.status === "open").map((installment) => installment.id);

onMounted(load);
</script>

<template>
  <div>
    <p class="text-xl p-4 text-[#135C65] font-bold m-0">{{ $t("acc.evaluations") }}</p>
    <AccountingTabs />
    <div class="sawa-card p-3">
      <Tabs v-model:value="tab">
        <TabList>
          <Tab value="evaluations">{{ $t("acc.evaluation") }}</Tab>
          <Tab value="consultations">{{ $t("acc.consultation") }}</Tab>
        </TabList>
      </Tabs>
      <div class="flex flex-wrap items-center gap-2 my-3">
        <SelectButton v-model="status" :options="statuses" :optionLabel="(s) => $t(`acc.billing.${s}`)" :allowEmpty="false" />
      </div>
      <DataTable :value="rows" :loading="loading" dataKey="id" paginator :rows="15" stripedRows>
        <Column :header="$t('acc.child')">
          <template #body="{ data }">{{ data.child?.name }}</template>
        </Column>
        <Column v-if="tab === 'evaluations'" :header="$t('acc.evaluation')">
          <template #body="{ data }">{{ getEvaluationTypeLabel(data.evaluation_type, t, `#${data.evaluation_type}`) }}</template>
        </Column>
        <Column :header="tab === 'evaluations' ? $t('acc.specialist') : $t('acc.consultant')">
          <template #body="{ data }">{{ tab === "evaluations" ? data.specialist?.name : data.consultant }}</template>
        </Column>
        <Column :header="$t('acc.appointment')">
          <template #body="{ data }"><span class="whitespace-nowrap">{{ appointment(data) }}</span></template>
        </Column>
        <Column :header="$t('acc.price')">
          <template #body="{ data }">{{ amount(data.billing_price) }}</template>
        </Column>
        <Column :header="$t('acc.status')">
          <template #body="{ data }">
            <Tag :severity="billingSeverity[data.billing_status]" :value="$t(`acc.billing.${data.billing_status}`)" />
          </template>
        </Column>
        <Column header-style="width:16rem">
          <template #body="{ data }">
            <div v-if="data.billing_status === 'locked' || (data.billing_status === 'confirmed' && openInstallments(data).length)" class="flex flex-wrap gap-1">
              <Button v-if="can('accounting payments create') && openInstallments(data).length" icon="pi pi-wallet" size="small" :label="$t('acc.pay')"
                severity="success" variant="outlined" @click="paying = data" />
              <Button v-if="can('accounting evaluations edit') && data.billing_status === 'locked'" icon="pi pi-unlock" size="small" :label="$t('acc.confirm_without_payment')"
                variant="outlined" v-tooltip.top="$t('acc.confirm_without_payment_hint')" @click="confirm(data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
    <PaymentDialog :visible="!!paying" :childId="paying?.child_id" :preselect="paying ? openInstallments(paying) : []"
      @update:visible="(open) => { if (!open) paying = null; }" @saved="load" />
    <Toast />
  </div>
</template>
