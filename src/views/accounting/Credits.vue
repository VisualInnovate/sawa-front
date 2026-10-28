<script setup>
// «التعويضات والمبالغ المستردة»: money back to children (session compensations, stopped programs, cancelled paid evaluations
// or consultations, lower prices), each decided by the accountant: the child's balance, a refund or nothing.
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { can } from "@/utils/permissions";
import { PAYMENT_METHODS, amount, creditSeverity, errorText, loadCurrency } from "@/utils/accounting";
import AccountingTabs from "@/components/accounting/AccountingTabs.vue";

const { t } = useI18n();
const toast = useToast();
const credits = ref([]);
const loading = ref(true);
const status = ref("pending");
const deciding = ref(null);
const form = ref({});

const statuses = ["pending", "credit", "refunded", "dismissed", "all"];
const refundMethods = PAYMENT_METHODS.filter((method) => method !== "balance");

async function load() {
  loading.value = true;
  await loadCurrency();
  credits.value = (await axios.get("api/accounting/credits", { params: { status: status.value === "all" ? undefined : status.value } })).data.data;
  loading.value = false;
}

watch(status, load);

function open(row) {
  deciding.value = row;
  form.value = { decision: "credit", amount: row.suggested, refund_method: "cash", refund_reference: "", note: "" };
}

async function decide() {
  try {
    await axios.post(`api/accounting/credits/${deciding.value.id}/decide`, form.value);
    toast.add({ severity: "success", summary: t("success_message"), detail: t("acc.saved"), life: 2500 });
    deciding.value = null;
    load();
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  }
}

onMounted(load);
</script>

<template>
  <div>
    <p class="text-xl p-4 text-bp-135c65 font-bold m-0">{{ $t("acc.credits") }}</p>
    <AccountingTabs />
    <div class="sawa-card p-3">
      <SelectButton v-model="status" :options="statuses" :optionLabel="(s) => (s !== 'all' ? $t(`acc.credit_status.${s}`) : $t('acc.all'))" :allowEmpty="false" class="mb-3" />
      <DataTable :value="credits" :loading="loading" dataKey="id" paginator :rows="20" stripedRows>
        <Column :header="$t('acc.child')">
          <template #body="{ data }">{{ data.child?.name }}</template>
        </Column>
        <Column :header="$t('acc.description')">
          <template #body="{ data }">
            {{ $t(`acc.credit_type.${data.type}`) }}
            <div v-if="data.session" class="text-xs text-color-secondary">{{ $t("acc.session_on", { date: String(data.session.starts_at).slice(0, 16) }) }}</div>
            <div v-if="data.description" class="text-xs text-color-secondary">{{ data.description }}</div>
          </template>
        </Column>
        <Column :header="$t('acc.date')">
          <template #body="{ data }">{{ String(data.created_at).slice(0, 10) }}</template>
        </Column>
        <Column :header="$t('acc.suggested')">
          <template #body="{ data }">{{ amount(data.suggested) }}</template>
        </Column>
        <Column :header="$t('acc.decided')">
          <template #body="{ data }">
            <template v-if="data.status !== 'pending'">
              {{ amount(data.amount) }}
              <div class="text-xs text-color-secondary">{{ data.decider?.name }}<span v-if="data.refund_method"> · {{ $t(`acc.methods.${data.refund_method}`) }}</span></div>
            </template>
          </template>
        </Column>
        <Column :header="$t('acc.status')">
          <template #body="{ data }"><Tag :severity="creditSeverity[data.status]" :value="$t(`acc.credit_status.${data.status}`)" /></template>
        </Column>
        <Column header-style="width:7rem">
          <template #body="{ data }">
            <Button v-if="data.status === 'pending' && can('accounting credits edit')" size="small" :label="$t('acc.decide')" @click="open(data)" />
          </template>
        </Column>
      </DataTable>
    </div>
    <Dialog :visible="!!deciding" modal :header="$t('acc.decide')" :style="{ width: '32rem' }" @update:visible="deciding = null">
      <div v-if="deciding" class="flex flex-column gap-3">
        <span class="font-semibold">{{ deciding.child?.name }} — {{ $t(`acc.credit_type.${deciding.type}`) }} · {{ $t("acc.suggested") }} {{ amount(deciding.suggested) }}</span>
        <div class="flex flex-column gap-2">
          <div v-for="option in ['credit', 'refunded', 'dismissed']" :key="option" class="flex items-center gap-2">
            <RadioButton v-model="form.decision" :inputId="`dec-${option}`" :value="option" />
            <label :for="`dec-${option}`">{{ $t(option === "credit" ? "acc.decision_credit" : option === "refunded" ? "acc.decision_refund" : "acc.decision_dismiss") }}</label>
          </div>
          <small class="text-color-secondary">{{ $t("acc.decide_hint") }}</small>
        </div>
        <div v-if="form.decision !== 'dismissed'" class="flex flex-column gap-1">
          <label for="dec-amount">{{ $t("acc.amount") }}</label>
          <InputNumber v-model="form.amount" inputId="dec-amount" :min="0.01" :maxFractionDigits="2" />
        </div>
        <div v-if="form.decision === 'refunded'" class="grid grid-cols-2 gap-2">
          <div class="flex flex-column gap-1">
            <label for="dec-method">{{ $t("acc.refund_method") }}</label>
            <Select v-model="form.refund_method" inputId="dec-method" :options="refundMethods" :optionLabel="(m) => $t(`acc.methods.${m}`)" />
          </div>
          <div class="flex flex-column gap-1">
            <label for="dec-ref">{{ $t("acc.reference") }}</label>
            <InputText v-model="form.refund_reference" id="dec-ref" />
          </div>
        </div>
        <div class="flex flex-column gap-1">
          <label for="dec-note">{{ $t("acc.notes") }}</label>
          <InputText v-model="form.note" id="dec-note" />
        </div>
      </div>
      <template #footer>
        <Button :label="$t('acc.close')" severity="secondary" variant="outlined" @click="deciding = null" />
        <Button icon="pi pi-check" :label="$t('acc.save')" :disabled="form.decision !== 'dismissed' && !(form.amount > 0)" @click="decide" />
      </template>
    </Dialog>
    <Toast />
  </div>
</template>
