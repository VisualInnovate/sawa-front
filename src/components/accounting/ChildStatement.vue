<script setup>
// A child's account («كشف حساب»): totals, the charges with their installments, the receipts and the money back.
// Used by the statement page and the child profile's «المالية» tab.
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { can } from "@/utils/permissions";
import { amount, chargeSeverity, chargeTitle, creditSeverity, errorText, installmentSeverity, installmentText, loadCurrency } from "@/utils/accounting";
import PaymentDialog from "@/components/accounting/PaymentDialog.vue";
import ManualFeeDialog from "@/components/accounting/ManualFeeDialog.vue";
import ProgramAccountDialog from "@/components/accounting/ProgramAccountDialog.vue";

const props = defineProps({ childId: { type: [Number, String], required: true } });
const { t } = useI18n();
const router = useRouter();
const toast = useToast();

const statement = ref(null);
const paying = ref(false);
const addingFee = ref(false);
const programId = ref(null);
const showingProgram = ref(false);
const cancelling = ref(null);
const cancelReason = ref("");

const totals = computed(() => statement.value ? [
  { key: "owed", value: statement.value.totals.owed },
  { key: "paid", value: statement.value.totals.paid, cls: "text-green-700" },
  { key: "remaining", value: statement.value.totals.remaining },
  { key: "late", value: statement.value.totals.late, cls: statement.value.totals.late > 0 ? "text-red-600" : "" },
  { key: "balance", value: statement.value.totals.balance },
] : []);

async function load() {
  await loadCurrency();
  statement.value = (await axios.get(`api/accounting/accounts/${props.childId}`)).data.data;
}

function openCharge(charge) {
  if (charge.source !== "program") return;
  programId.value = charge.student_program_id;
  showingProgram.value = true;
}

async function cancelPayment() {
  try {
    await axios.post(`api/accounting/payments/${cancelling.value.id}/cancel`, { reason: cancelReason.value });
    cancelling.value = null;
    cancelReason.value = "";
    load();
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  }
}

const printReceipt = (payment) => window.open(router.resolve({ name: "accounting-receipt", params: { id: payment.id } }).href, "_blank");

watch(() => props.childId, load);
onMounted(load);
</script>

<template>
  <div v-if="!statement" class="flex justify-center p-5"><i class="pi pi-spin pi-spinner text-2xl" /></div>
  <div v-else class="flex flex-column gap-3">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <span class="text-lg font-bold text-[#135C65]">{{ statement.child?.name }}</span>
      <div class="flex flex-wrap gap-2">
        <Button v-if="can('accounting charges create')" icon="pi pi-plus" :label="$t('acc.add_fee')" severity="secondary" variant="outlined" @click="addingFee = true" />
        <Button v-if="can('accounting payments create')" icon="pi pi-wallet" :label="$t('acc.pay')" @click="paying = true" />
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-5 gap-2">
      <div v-for="item in totals" :key="item.key" class="sawa-card p-3 flex flex-column gap-1">
        <span class="text-sm text-color-secondary">{{ $t(`acc.${item.key}`) }}</span>
        <span class="text-lg font-bold" :class="item.cls">{{ amount(item.value) }}</span>
      </div>
    </div>

    <div class="sawa-card p-3 flex flex-column gap-2">
      <span class="font-semibold">{{ $t("acc.charges") }}</span>
      <DataTable :value="statement.charges" dataKey="id" size="small" :rowClass="(row) => (row.status === 'cancelled' ? 'opacity-60' : '')">
        <Column :header="$t('acc.description')">
          <template #body="{ data }">
            <button v-if="data.source === 'program'" type="button" class="text-start text-[#135C65] underline bg-transparent border-none cursor-pointer p-0" @click="openCharge(data)">
              {{ chargeTitle(t, data) }}
            </button>
            <span v-else>{{ chargeTitle(t, data) }}</span>
            <div class="text-xs text-color-secondary">{{ String(data.created_at).slice(0, 10) }}</div>
          </template>
        </Column>
        <Column :header="$t('acc.amount')">
          <template #body="{ data }">
            {{ amount(data.amount) }}
            <div v-if="data.discount > 0" class="text-xs text-color-secondary">{{ $t("acc.discount") }} {{ amount(data.discount) }}</div>
          </template>
        </Column>
        <Column :header="$t('acc.installments')">
          <template #body="{ data }">
            <div class="flex flex-wrap gap-1">
              <Tag v-for="row in data.installments" :key="row.id" :severity="installmentSeverity[row.state]" class="text-xs"
                :value="installmentText(row)" v-tooltip.top="$t(`acc.installment_state.${row.state}`)" />
            </div>
          </template>
        </Column>
        <Column :header="$t('acc.status')">
          <template #body="{ data }"><Tag :severity="chargeSeverity[data.status]" :value="$t(`acc.charge_status.${data.status}`)" /></template>
        </Column>
      </DataTable>
    </div>

    <div class="sawa-card p-3 flex flex-column gap-2">
      <span class="font-semibold">{{ $t("acc.payments") }}</span>
      <DataTable :value="statement.payments" dataKey="id" size="small" :rowClass="(row) => (row.cancelled_at ? 'line-through opacity-60' : '')">
        <Column field="receipt_no" :header="$t('acc.receipt_no')" />
        <Column field="paid_on" :header="$t('acc.paid_on')" />
        <Column :header="$t('acc.amount')">
          <template #body="{ data }">{{ amount(data.amount) }}</template>
        </Column>
        <Column :header="$t('acc.method')">
          <template #body="{ data }">{{ $t(`acc.methods.${data.method}`) }}<span v-if="data.reference" class="text-xs text-color-secondary"> · {{ data.reference }}</span></template>
        </Column>
        <Column :header="$t('acc.created_by')">
          <template #body="{ data }">
            {{ data.creator?.name }}
            <div v-if="data.cancelled_at" class="text-xs text-red-600 no-underline">{{ $t("acc.cancelled_by", { name: data.canceller?.name, reason: data.cancel_reason }) }}</div>
          </template>
        </Column>
        <Column header-style="width:6rem">
          <template #body="{ data }">
            <div class="flex gap-1">
              <Button icon="pi pi-print" size="small" text rounded :aria-label="$t('acc.print')" v-tooltip.top="$t('acc.print')" @click="printReceipt(data)" />
              <Button v-if="!data.cancelled_at && can('accounting payments delete')" icon="pi pi-ban" size="small" text rounded severity="danger"
                :aria-label="$t('acc.cancel_payment')" v-tooltip.top="$t('acc.cancel_payment')" @click="cancelling = data" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <div v-if="statement.credits.length" class="sawa-card p-3 flex flex-column gap-2">
      <span class="font-semibold">{{ $t("acc.credits") }}</span>
      <DataTable :value="statement.credits" dataKey="id" size="small">
        <Column :header="$t('acc.description')">
          <template #body="{ data }">
            {{ $t(`acc.credit_type.${data.type}`) }}
            <span v-if="data.session" class="text-xs text-color-secondary"> · {{ $t("acc.session_on", { date: String(data.session.starts_at).slice(0, 16) }) }}</span>
          </template>
        </Column>
        <Column :header="$t('acc.suggested')">
          <template #body="{ data }">{{ amount(data.suggested) }}</template>
        </Column>
        <Column :header="$t('acc.decided')">
          <template #body="{ data }">{{ data.status === "pending" ? "" : amount(data.amount) }}</template>
        </Column>
        <Column :header="$t('acc.status')">
          <template #body="{ data }"><Tag :severity="creditSeverity[data.status]" :value="$t(`acc.credit_status.${data.status}`)" /></template>
        </Column>
      </DataTable>
    </div>

    <PaymentDialog v-model:visible="paying" :childId="childId" @saved="(payment) => { load(); printReceipt(payment); }" />
    <ManualFeeDialog v-model:visible="addingFee" :childId="childId" @saved="load" />
    <ProgramAccountDialog v-model:visible="showingProgram" :programId="programId" @changed="load" />
    <Dialog :visible="!!cancelling" modal :header="$t('acc.cancel_payment')" :style="{ width: '28rem' }" @update:visible="cancelling = null">
      <p class="text-sm">{{ $t("acc.cancel_payment_hint") }}</p>
      <div class="flex flex-column gap-1">
        <label for="cancel-reason">{{ $t("acc.reason") }}</label>
        <InputText v-model="cancelReason" id="cancel-reason" />
      </div>
      <template #footer>
        <Button :label="$t('acc.close')" severity="secondary" variant="outlined" @click="cancelling = null" />
        <Button :label="$t('acc.cancel_payment')" severity="danger" :disabled="!cancelReason.trim()" @click="cancelPayment" />
      </template>
    </Dialog>
  </div>
</template>
