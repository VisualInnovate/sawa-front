<script setup>
// A program's account: its lines (price, transport), the accountant's discount and installments; confirming it,
// approving a new price, stopping its sessions for a late installment, stopping the program, recording a payment.
import axios from "axios";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { can } from "@/utils/permissions";
import { programName } from "@/utils/studentPrograms";
import { amount, errorText, formatDateTime, installmentSeverity, loadCurrency, programStatusSeverity } from "@/utils/accounting";
import InstallmentsEditor from "@/components/accounting/InstallmentsEditor.vue";
import PaymentDialog from "@/components/accounting/PaymentDialog.vue";

const props = defineProps({ programId: { type: [Number, String], default: null } });
const visible = defineModel("visible", { type: Boolean, default: false });
const emit = defineEmits(["changed"]);
const { t } = useI18n();
const toast = useToast();

const program = ref(null);
const lines = ref([]);
const discount = ref({ type: null, value: 0, reason: "" });
const rows = ref([]);
const busy = ref(false);
const paying = ref(false);
const stopping = ref(false);

const charge = computed(() => program.value?.charge ?? null);
const canEdit = computed(() => can("accounting programs edit"));
const nothingPaid = computed(() => (charge.value?.paid ?? 0) === 0);
const editableLines = computed(() => canEdit.value && nothingPaid.value && ["tentative", "confirmed"].includes(program.value?.accounting_status) && !charge.value?.pending_gross);
const gross = computed(() => Math.round(lines.value.reduce((sum, line) => sum + Number(line.amount || 0), 0) * 100) / 100);
const discountAmount = computed(() => {
  const value = Number(discount.value.value || 0);
  const raw = discount.value.type === "percent" ? gross.value * Math.min(100, value) / 100 : discount.value.type === "amount" ? value : 0;
  return Math.round(Math.min(gross.value, Math.max(0, raw)) * 100) / 100;
});
const net = computed(() => editableLines.value ? Math.round((gross.value - discountAmount.value) * 100) / 100 : charge.value?.amount ?? 0);
const paidRows = computed(() => (charge.value?.installments ?? []).filter((row) => row.status === "paid"));
const owed = computed(() => Math.round((net.value - (charge.value?.paid ?? 0)) * 100) / 100);
const pendingOwed = computed(() => {
  if (!charge.value?.pending_gross) return 0;
  const value = Number(charge.value.discount_value || 0);
  const pendingDiscount = charge.value.discount_type === "percent" ? charge.value.pending_gross * value / 100 : charge.value.discount_type === "amount" ? value : 0;
  return Math.max(0, Math.round((charge.value.pending_gross - Math.min(charge.value.pending_gross, pendingDiscount) - charge.value.paid) * 100) / 100);
});
const sumMatches = computed(() => Math.abs(rows.value.reduce((sum, row) => sum + Number(row.amount || 0), 0) - (charge.value?.pending_gross ? pendingOwed.value : owed.value)) < 0.01);
const hasLate = computed(() => (charge.value?.late ?? 0) > 0);
// "none" (not null): the Select shows nothing for a null value.
const discountTypes = computed(() => [{ value: "none", label: t("acc.none") }, { value: "percent", label: t("acc.discount_percent") }, { value: "amount", label: t("acc.discount_amount") }]);

async function load() {
  if (!props.programId) return;
  loadCurrency();
  const { data } = await axios.get(`api/accounting/programs/${props.programId}`);
  program.value = data.data;
  const current = data.data.charge;
  lines.value = (current?.lines ?? []).map((line, i) => ({ ...line, key: line.key ?? `l${i}` }));
  discount.value = { type: current?.discount_type ?? "none", value: current?.discount_value ?? 0, reason: current?.discount_reason ?? "" };
  rows.value = (current?.installments ?? []).filter((row) => row.status === "open").map((row) => ({ due_date: row.due_date, amount: row.amount }));
}

watch(visible, (open) => { if (open) load(); });
// One open installment follows the total as the discount or transport change.
watch(owed, (value) => { if (rows.value.length === 1 && editableLines.value) rows.value[0].amount = Math.max(0, value); });
watch(() => props.programId, () => { if (visible.value) load(); });

function plan() {
  const body = { installments: rows.value };
  if (editableLines.value) {
    Object.assign(body, {
      lines: lines.value.filter((line) => line.type === "transport").map((line) => ({ key: line.key, amount: line.amount })),
      discount_type: discountAmount.value > 0 ? discount.value.type : null,
      discount_value: discountAmount.value > 0 ? discount.value.value : 0,
      discount_reason: discountAmount.value > 0 ? discount.value.reason : null,
    });
  }
  return body;
}

async function run(request, message = t("acc.saved")) {
  busy.value = true;
  try {
    await request();
    toast.add({ severity: "success", summary: t("success_message"), detail: message, life: 2500 });
    await load();
    emit("changed");
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  } finally {
    busy.value = false;
  }
}

const confirm = () => run(() => axios.post(`api/accounting/programs/${props.programId}/confirm`, plan()));
const savePlan = () => run(() => axios.put(`api/accounting/charges/${charge.value.id}/plan`, plan()));
const applyPriceChange = () => run(() => axios.post(`api/accounting/programs/${props.programId}/price-change`, { installments: rows.value }));
const suspend = () => run(() => axios.post(`api/accounting/programs/${props.programId}/suspend`));
const resume = () => run(() => axios.post(`api/accounting/programs/${props.programId}/resume`));
const stop = () => run(async () => { await axios.post(`api/accounting/programs/${props.programId}/stop`); stopping.value = false; });

function removeLine(key) {
  lines.value = lines.value.filter((line) => line.key !== key);
}

const discountMissingReason = computed(() => editableLines.value && discountAmount.value > 0 && !discount.value.reason?.trim());
const formatAt = formatDateTime;
</script>

<template>
  <Dialog v-model:visible="visible" modal :header="$t('acc.program_account')" :style="{ width: '56rem' }" :breakpoints="{ '960px': '96vw' }">
    <div v-if="!program" class="flex justify-center p-5"><i class="pi pi-spin pi-spinner text-2xl" /></div>
    <div v-else class="flex flex-column gap-3">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="flex flex-column">
          <span class="text-lg font-bold text-[#135C65]">{{ program.student?.name }} — {{ programName(t, program) }}</span>
          <span class="text-sm text-color-secondary">{{ program.start_date }} → {{ program.end_date }} · {{ program.therapist?.name }}</span>
        </div>
        <div class="flex flex-wrap gap-2">
          <Tag :severity="programStatusSeverity[program.accounting_status]" :value="$t(`acc.program_status.${program.accounting_status}`)" />
          <Tag v-if="program.sessions_suspended_at" severity="danger" icon="pi pi-pause" :value="$t('acc.suspended')" />
        </div>
      </div>

      <Message v-if="program.accounting_status === 'tentative' && program.tentative_until" severity="warn" size="small">
        {{ $t("acc.tentative_until", { at: formatAt(program.tentative_until) }) }}
      </Message>
      <Message v-if="program.accounting_status === 'unconfirmed'" severity="error" size="small">{{ $t("acc.unconfirmed_hint") }}</Message>
      <Message v-if="!charge" severity="info" size="small">{{ $t("acc.no_charge") }}</Message>

      <template v-if="charge">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div class="acc-stat"><span>{{ $t("acc.owed") }}</span><strong>{{ amount(charge.amount) }}</strong></div>
          <div class="acc-stat"><span>{{ $t("acc.paid") }}</span><strong class="text-green-700">{{ amount(charge.paid) }}</strong></div>
          <div class="acc-stat"><span>{{ $t("acc.remaining") }}</span><strong>{{ amount(charge.remaining) }}</strong></div>
          <div class="acc-stat"><span>{{ $t("acc.late") }}</span><strong :class="{ 'text-red-600': hasLate }">{{ amount(charge.late) }}</strong></div>
        </div>

        <!-- A confirmed program's new price waits for the accountant. -->
        <div v-if="charge.pending_gross" class="flex flex-column gap-2 p-3 border-round border-1 border-orange-300 bg-orange-50">
          <span class="font-semibold"><i class="pi pi-exclamation-triangle" aria-hidden="true" /> {{ $t("acc.price_change_title") }}</span>
          <span class="text-sm">{{ $t("acc.price_change_hint", { from: amount(charge.gross), to: amount(charge.pending_gross) }) }}</span>
        </div>

        <div class="flex flex-column gap-2">
          <span class="font-semibold">{{ $t("acc.lines") }}</span>
          <div v-for="line in lines" :key="line.key" class="flex flex-wrap items-center justify-between gap-2 py-1 border-bottom-1 surface-border">
            <span>
              {{ $t(`acc.line.${line.type}`) }}<template v-if="line.name"> — {{ line.name }}</template>
              <small v-if="line.monthly" class="text-color-secondary"> ({{ $t("acc.transport_monthly", { amount: amount(line.monthly) }) }})</small>
            </span>
            <div class="flex items-center gap-1">
              <InputNumber v-if="line.type === 'transport' && editableLines" v-model="line.amount" :min="0" :maxFractionDigits="2" class="w-9rem" :aria-label="$t('acc.amount')" />
              <span v-else class="font-semibold">{{ amount(line.amount) }}</span>
              <Button v-if="line.type === 'transport' && editableLines" icon="pi pi-trash" text rounded severity="danger" :aria-label="$t('acc.remove_line')"
                v-tooltip.top="$t('acc.remove_line')" @click="removeLine(line.key)" />
            </div>
          </div>
        </div>

        <div v-if="editableLines" class="flex flex-wrap items-end gap-2">
          <div class="flex flex-column gap-1">
            <label for="disc-type">{{ $t("acc.discount_type") }}</label>
            <Select v-model="discount.type" inputId="disc-type" :options="discountTypes" optionLabel="label" optionValue="value" class="w-10rem" />
          </div>
          <div v-if="discount.type !== 'none'" class="flex flex-column gap-1">
            <label for="disc-value">{{ $t("acc.discount") }}</label>
            <InputNumber v-model="discount.value" inputId="disc-value" :min="0" :max="discount.type === 'percent' ? 100 : undefined" :maxFractionDigits="2" class="w-9rem" />
          </div>
          <div v-if="discount.type !== 'none'" class="flex flex-column gap-1 flex-1 min-w-12rem">
            <label for="disc-reason">{{ $t("acc.discount_reason") }}</label>
            <InputText v-model="discount.reason" id="disc-reason" :invalid="discountMissingReason" />
          </div>
        </div>
        <div v-else-if="charge.discount > 0" class="text-sm">
          {{ $t("acc.discount") }}: {{ amount(charge.discount) }} — {{ charge.discount_reason }}
        </div>
        <div class="flex flex-wrap justify-end items-center gap-3">
          <span v-if="discountAmount > 0 && editableLines" class="text-color-secondary">{{ $t("acc.before_discount") }}: <span class="line-through">{{ amount(gross) }}</span></span>
          <span class="text-lg font-bold text-[#135C65]">{{ $t("acc.total") }}: {{ amount(net) }}</span>
        </div>

        <div v-if="charge.status !== 'cancelled'" class="flex flex-column gap-2">
          <span class="font-semibold">{{ $t("acc.installments") }}</span>
          <small v-if="!nothingPaid" class="text-color-secondary">{{ $t("acc.plan_locked_hint") }}</small>
          <InstallmentsEditor v-model="rows" :owed="charge.pending_gross ? pendingOwed : owed" :paidRows="paidRows"
            :disabled="!canEdit || !['tentative', 'confirmed'].includes(program.accounting_status)" />
        </div>
        <div v-else class="flex flex-wrap gap-2">
          <Tag v-for="row in charge.installments" :key="row.id" :severity="installmentSeverity[row.state]"
            :value="`${row.due_date} · ${amount(row.amount)} · ${$t(`acc.installment_state.${row.state}`)}`" />
        </div>

        <Message v-if="hasLate && !program.sessions_suspended_at && canEdit && program.accounting_status === 'confirmed'" severity="error" size="small">{{ $t("acc.suspend_hint") }}</Message>

        <div v-if="stopping" class="flex flex-column gap-2 p-3 border-round border-1 border-red-300 bg-red-50">
          <span>{{ $t("acc.stop_program_hint", { paid: amount(program.stop?.paid), used: amount(program.stop?.used_amount), suggested: amount(program.stop?.suggested) }) }}</span>
          <div class="flex gap-2 justify-end">
            <Button :label="$t('acc.cancel')" severity="secondary" variant="outlined" @click="stopping = false" />
            <Button :label="$t('acc.stop_confirm')" severity="danger" :loading="busy" @click="stop" />
          </div>
        </div>
      </template>
    </div>

    <template #footer>
      <div v-if="program && charge" class="flex flex-wrap justify-between gap-2 w-full">
        <div class="flex flex-wrap gap-2">
          <Button v-if="canEdit && program.stop && !stopping" icon="pi pi-stop-circle" :label="$t('acc.stop_program')" severity="danger" variant="outlined" @click="stopping = true" />
          <Button v-if="canEdit && program.sessions_suspended_at" icon="pi pi-play" :label="$t('acc.resume')" severity="secondary" :loading="busy" @click="resume" />
          <Button v-else-if="canEdit && hasLate && program.accounting_status === 'confirmed'" icon="pi pi-pause" :label="$t('acc.suspend')" severity="warn" :loading="busy" @click="suspend" />
        </div>
        <div class="flex flex-wrap gap-2">
          <Button v-if="can('accounting payments create') && charge.remaining > 0 && ['tentative', 'confirmed'].includes(program.accounting_status)"
            icon="pi pi-wallet" :label="$t('acc.pay')" severity="success" variant="outlined" @click="paying = true" />
          <template v-if="canEdit && charge.status !== 'cancelled'">
            <Button v-if="charge.pending_gross" icon="pi pi-check" :label="$t('acc.apply_price_change')" :loading="busy"
              :disabled="pendingOwed > 0 && !sumMatches" @click="applyPriceChange" />
            <template v-else-if="['tentative', 'confirmed'].includes(program.accounting_status)">
              <Button :label="$t('acc.save_plan')" icon="pi pi-save" severity="secondary" :loading="busy" :disabled="!sumMatches || discountMissingReason" @click="savePlan" />
              <Button v-if="program.accounting_status === 'tentative'" icon="pi pi-verified" :label="$t('acc.confirm_program')" :loading="busy"
                :disabled="!sumMatches || discountMissingReason" v-tooltip.top="$t('acc.confirm_program_hint')" @click="confirm" />
            </template>
          </template>
        </div>
      </div>
    </template>
    <PaymentDialog v-if="program" v-model:visible="paying" :childId="program.student_id"
      :preselect="(charge?.installments ?? []).filter((row) => row.status === 'open').slice(0, 1).map((row) => row.id)" @saved="load(); emit('changed')" />
  </Dialog>
</template>

<style scoped>
.acc-stat {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--sawa-border);
  border-radius: var(--sawa-radius);
  background: #fff;
}
.acc-stat span {
  font-size: 0.8rem;
  color: var(--p-text-muted-color);
}
</style>
