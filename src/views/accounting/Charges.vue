<script setup>
// «الرسوم»: every charge (programs, evaluations, consultations, manual fees) by source and state; manual fees are added
// and cancelled here, and any open charge's installments can be changed.
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { FilterMatchMode } from "@primevue/core/api";
import { can } from "@/utils/permissions";
import { amount, chargeSeverity, chargeTitle, errorText, installmentSeverity, installmentText, loadCurrency, spreadDiscount } from "@/utils/accounting";
import AccountingTabs from "@/components/accounting/AccountingTabs.vue";
import ManualFeeDialog from "@/components/accounting/ManualFeeDialog.vue";
import InstallmentsEditor from "@/components/accounting/InstallmentsEditor.vue";

const { t } = useI18n();
const toast = useToast();
const charges = ref([]);
const loading = ref(true);
const source = ref("all");
const status = ref("open");
const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
const adding = ref(false);
const cancelling = ref(null);
const reason = ref("");
const planning = ref(null);
const planRows = ref([]);

const sources = computed(() => [{ value: "all", label: t("acc.all") }, ...["program", "evaluation", "consultation", "manual"].map((value) => ({ value, label: t(`acc.source.${value}`) }))]);
const statuses = ["open", "late", "paid", "cancelled", "all"];
const rows = computed(() => charges.value.map((row) => ({ ...row, child_name: row.child?.name, title: chargeTitle(t, row) })));
const planOwed = computed(() => planning.value ? Math.round((planning.value.amount - planning.value.paid) * 100) / 100 : 0);
// What the paid installments did not take of the discount, spread over the open ones (as the backend).
const planDiscounts = computed(() => {
  if (!planning.value) return [];
  const paidDiscount = planning.value.installments.filter((row) => row.status === "paid").reduce((sum, row) => sum + Number(row.discount || 0), 0);
  return spreadDiscount(planRows.value, Math.max(0, Math.round((planning.value.discount - paidDiscount) * 100) / 100), "amount");
});
const planOk = computed(() => Math.abs(planRows.value.reduce((sum, row) => sum + Number(row.amount || 0), 0) - planOwed.value) < 0.01);

async function load() {
  loading.value = true;
  await loadCurrency();
  const { data } = await axios.get("api/accounting/charges", { params: { source: source.value === "all" ? undefined : source.value, status: status.value === "all" ? undefined : status.value } });
  charges.value = data.data;
  loading.value = false;
}

watch([source, status], load);

function openPlan(row) {
  planning.value = row;
  // An installment chosen for the discount stays chosen (what is left of it stays on the chosen ones).
  planRows.value = row.installments.filter((installment) => installment.status === "open")
    .map((installment) => ({ due_date: installment.due_date, amount: installment.amount, discounted: row.discount_target === "installments" && installment.discount > 0 }));
}

async function request(call) {
  try {
    await call();
    toast.add({ severity: "success", summary: t("success_message"), detail: t("acc.saved"), life: 2500 });
    load();
    return true;
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
    return false;
  }
}

async function savePlan() {
  if (await request(() => axios.put(`api/accounting/charges/${planning.value.id}/plan`, { installments: planRows.value }))) planning.value = null;
}

async function cancel() {
  if (await request(() => axios.post(`api/accounting/charges/${cancelling.value.id}/cancel`, { reason: reason.value }))) {
    cancelling.value = null;
    reason.value = "";
  }
}

onMounted(load);
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-2 p-4">
      <p class="text-xl text-[#135C65] font-bold m-0">{{ $t("acc.charges") }}</p>
      <Button v-if="can('accounting charges create')" icon="pi pi-plus" :label="$t('acc.add_fee')" @click="adding = true" />
    </div>
    <AccountingTabs />
    <div class="sawa-card p-3">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div class="flex flex-wrap gap-2">
          <Select v-model="source" :options="sources" optionLabel="label" optionValue="value" class="w-12rem" :aria-label="$t('acc.description')" />
          <SelectButton v-model="status" :options="statuses" :optionLabel="(s) => (s === 'late' ? $t('acc.installment_state.late') : s !== 'all' ? $t(`acc.charge_status.${s}`) : $t('acc.all'))" :allowEmpty="false" />
        </div>
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText v-model="filters.global.value" :placeholder="$t('acc.search_child')" />
        </IconField>
      </div>
      <DataTable :value="rows" :loading="loading" dataKey="id" v-model:filters="filters" :globalFilterFields="['child_name', 'title']" paginator :rows="20" stripedRows>
        <Column field="child_name" :header="$t('acc.child')" sortable />
        <Column field="title" :header="$t('acc.description')">
          <template #body="{ data }">
            {{ data.title }}
            <div class="text-xs text-color-secondary">{{ String(data.created_at).slice(0, 10) }}<span v-if="data.creator"> · {{ data.creator.name }}</span></div>
          </template>
        </Column>
        <Column :header="$t('acc.amount')">
          <template #body="{ data }">{{ amount(data.amount) }}</template>
        </Column>
        <Column :header="$t('acc.paid')">
          <template #body="{ data }"><span class="text-green-700">{{ amount(data.paid) }}</span></template>
        </Column>
        <Column :header="$t('acc.installments')">
          <template #body="{ data }">
            <div class="flex flex-wrap gap-1">
              <Tag v-for="row in data.installments" :key="row.id" :severity="installmentSeverity[row.state]" class="text-xs" :value="installmentText(row)" />
            </div>
          </template>
        </Column>
        <Column :header="$t('acc.status')">
          <template #body="{ data }"><Tag :severity="chargeSeverity[data.status]" :value="$t(`acc.charge_status.${data.status}`)" /></template>
        </Column>
        <Column header-style="width:6rem">
          <template #body="{ data }">
            <div v-if="data.status === 'open'" class="flex gap-1">
              <Button v-if="data.source !== 'program' && can('accounting charges create', 'accounting programs edit')" icon="pi pi-calendar" size="small" text rounded
                :aria-label="$t('acc.edit_installments')" v-tooltip.top="$t('acc.edit_installments')" @click="openPlan(data)" />
              <Button v-if="data.source !== 'program' && can('accounting charges delete')" icon="pi pi-ban" size="small" text rounded severity="danger"
                :aria-label="$t('acc.cancel_charge')" v-tooltip.top="$t('acc.cancel_charge')" @click="cancelling = data" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
    <ManualFeeDialog v-model:visible="adding" @saved="load" />
    <Dialog :visible="!!planning" modal :header="$t('acc.edit_installments')" :style="{ width: '40rem' }" @update:visible="planning = null">
      <InstallmentsEditor v-if="planning" v-model="planRows" :owed="planOwed" :paidRows="planning.installments.filter((row) => row.status === 'paid')"
        :discounts="planDiscounts" />
      <template #footer>
        <Button :label="$t('acc.close')" severity="secondary" variant="outlined" @click="planning = null" />
        <Button :label="$t('acc.save_plan')" :disabled="!planOk" @click="savePlan" />
      </template>
    </Dialog>
    <Dialog :visible="!!cancelling" modal :header="$t('acc.cancel_charge')" :style="{ width: '28rem' }" @update:visible="cancelling = null">
      <div class="flex flex-column gap-1">
        <label for="charge-cancel-reason">{{ $t("acc.reason") }}</label>
        <InputText v-model="reason" id="charge-cancel-reason" />
      </div>
      <template #footer>
        <Button :label="$t('acc.close')" severity="secondary" variant="outlined" @click="cancelling = null" />
        <Button :label="$t('acc.cancel_charge')" severity="danger" :disabled="!reason.trim()" @click="cancel" />
      </template>
    </Dialog>
    <Toast />
  </div>
</template>
