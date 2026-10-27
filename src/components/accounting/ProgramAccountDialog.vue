<script setup>
// A program's account: first its price table as the program form showed it (month by month, free sessions), then
// its lines (price, transport), the accountant's discount (on the total, spread over every installment, or on the
// installments they choose: one or several) and the installments (one a month, editable), each with its value before
// the discount and its discount; confirming it, approving a new price, stopping its sessions for a late installment,
// stopping the program, recording a payment.
import axios from "axios";
import { computed, nextTick, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { can } from "@/utils/permissions";
import { programName } from "@/utils/studentPrograms";
import { amount, errorText, formatDateTime, installmentDiscounts, installmentSeverity, installmentText, loadCurrency, monthlyPlan, programStatusSeverity, spreadDiscount } from "@/utils/accounting";
import InstallmentsEditor from "@/components/accounting/InstallmentsEditor.vue";
import ProgramPrice from "@/components/studentPrograms/ProgramPrice.vue";
import PaymentDialog from "@/components/accounting/PaymentDialog.vue";

const props = defineProps({ programId: { type: [Number, String], default: null } });
const visible = defineModel("visible", { type: Boolean, default: false });
const emit = defineEmits(["changed"]);
const { t } = useI18n();
const toast = useToast();

const program = ref(null);
const lines = ref([]);
const discount = ref({ type: null, value: 0, reason: "", target: "total" });
const rows = ref([]);
const busy = ref(false);
const ready = ref(false);
const paying = ref(false);
const stopping = ref(false);

const charge = computed(() => program.value?.charge ?? null);
const canEdit = computed(() => can("accounting programs edit"));
const nothingPaid = computed(() => (charge.value?.paid ?? 0) === 0);
const editableLines = computed(() => canEdit.value && nothingPaid.value && ["tentative", "confirmed"].includes(program.value?.accounting_status) && !charge.value?.pending_gross);
const gross = computed(() => Math.round(lines.value.reduce((sum, line) => sum + Number(line.amount || 0), 0) * 100) / 100);
const cents = (value) => Math.round(Number(value) * 100) / 100;
const months = computed(() => charge.value?.months ?? []);
// Each month's value as the lines are now.
const monthPlan = computed(() => monthlyPlan(months.value, editableLines.value ? lines.value : charge.value?.lines ?? []));
const priceTable = computed(() => (program.value?.price_details?.lines?.length ? program.value.price_details : null));
const paidRows = computed(() => (charge.value?.installments ?? []).filter((row) => row.status === "paid"));
// While the discount is set (nothing paid) the rows hold their value before it and each one's discount follows the
// discount; afterwards they hold what is to be paid and what is left of the discount is spread over them.
const baseMode = computed(() => editableLines.value);
const openDiscount = computed(() => program.value?.pending
  ? program.value.pending.open_discount ?? 0
  : Math.max(0, cents((charge.value?.discount ?? 0) - paidRows.value.reduce((sum, row) => sum + Number(row.discount || 0), 0))));
const rowDiscounts = computed(() => baseMode.value
  ? installmentDiscounts(rows.value, discount.value.target, discount.value.type, discount.value.value)
  : spreadDiscount(rows.value, openDiscount.value, "amount"));
const discountAmount = computed(() => (baseMode.value ? cents(rowDiscounts.value.reduce((sum, value) => sum + value, 0)) : charge.value?.discount ?? 0));
const net = computed(() => editableLines.value ? cents(gross.value - discountAmount.value) : charge.value?.amount ?? 0);
const owed = computed(() => cents(net.value - (charge.value?.paid ?? 0)));
const pendingOwed = computed(() => program.value?.pending?.owed ?? 0);
// What the rows must add up to: the lines before the discount, or what is still owed.
const editorTotal = computed(() => (baseMode.value ? gross.value : charge.value?.pending_gross ? pendingOwed.value : owed.value));
// The installments the months make, before any discount (chosen installments stay chosen by their place).
const monthRows = (keep = []) => monthPlan.value.filter((row) => row.base > 0)
  .map((row, i) => ({ due_date: row.due_date, base: row.base, month: row.month, discounted: keep[i] ?? false }));
const monthOf = (dueDate) => monthPlan.value.find((item) => item.due_date === dueDate)?.month;
const sumMatches = computed(() => Math.abs(rows.value.reduce((sum, row) => sum + Number((baseMode.value ? row.base : row.amount) || 0), 0) - editorTotal.value) < 0.01);
const hasLate = computed(() => (charge.value?.late ?? 0) > 0);
// "none" (not null): the Select shows nothing for a null value.
const discountTypes = computed(() => [{ value: "none", label: t("acc.none") }, { value: "percent", label: t("acc.discount_percent") }, { value: "amount", label: t("acc.discount_amount") }]);
const discountTargets = computed(() => [{ value: "total", label: t("acc.discount_on_total") }, { value: "installments", label: t("acc.discount_on_installments") }]);
const installmentLabel = (row, i) => `${t("acc.installment_n", { n: paidRows.value.length + i + 1 })} · ${row.due_date}${row.month ? ` (${row.month})` : ""}`;
const installmentOptions = computed(() => rows.value.map((row, i) => ({ value: i, label: installmentLabel(row, i) })));
// The installments the discount comes off, by their place among the open ones.
const chosenInstallments = computed({
  get: () => rows.value.map((row, i) => (row.discounted ? i : -1)).filter((i) => i >= 0),
  set: (chosen) => rows.value.forEach((row, i) => { row.discounted = chosen.includes(i); }),
});
// A saved discount: on the total, or on the installments that have one.
const savedDiscountOn = computed(() => {
  if (charge.value?.discount_target !== "installments") return t("acc.discount_on_total");
  const live = (charge.value?.installments ?? []).filter((row) => row.status !== "cancelled");
  return live.map((row, i) => (row.discount > 0 ? t("acc.installment_n", { n: i + 1 }) : null)).filter(Boolean).join("، ");
});

async function load() {
  if (!props.programId) return;
  ready.value = false;
  loadCurrency();
  const { data } = await axios.get(`api/accounting/programs/${props.programId}`);
  program.value = data.data;
  const current = data.data.charge;
  lines.value = (current?.lines ?? []).map((line, i) => ({ ...line, key: line.key ?? `l${i}` }));
  const target = current?.discount_target ?? "total";
  discount.value = { type: current?.discount_type ?? "none", value: current?.discount_value ?? 0, reason: current?.discount_reason ?? "", target };
  rows.value = data.data.pending
    ? data.data.pending.installments.map((row) => ({ ...row, month: monthOf(row.due_date) }))
    : (current?.installments ?? []).filter((row) => row.status === "open").map((row) => ({ due_date: row.due_date, base: row.base ?? row.amount,
      amount: row.amount, discounted: target === "installments" && row.discount > 0, month: monthOf(row.due_date) }));
  await nextTick();
  ready.value = true;
}

watch(visible, (open) => { if (open) load(); });
// The installments follow the months as the transport changes (one open installment follows the total); not while
// loading, so the saved installments show as they are.
watch(monthPlan, () => {
  if (!editableLines.value || !ready.value) return;
  if (months.value.length) rows.value = monthRows(rows.value.map((row) => row.discounted));
  else if (rows.value.length === 1) rows.value[0].base = gross.value;
});
watch(() => props.programId, () => { if (visible.value) load(); });

// Installments made again: a discount on chosen installments goes (the accountant enters it again).
function regenerated() {
  if (!editableLines.value || discount.value.target !== "installments" || discount.value.type === "none") return;
  discount.value = { type: "none", value: 0, reason: "", target: "total" };
  toast.add({ severity: "info", summary: t("acc.discount"), detail: t("acc.discount_cleared"), life: 5000 });
}

function resetMonthly() {
  rows.value = monthRows();
  regenerated();
}

function plan() {
  if (!editableLines.value) return { installments: rows.value.map((row) => ({ due_date: row.due_date, amount: row.amount, discounted: !!row.discounted })) };
  const on = discountAmount.value > 0;
  return {
    lines: lines.value.filter((line) => line.type === "transport").map((line) => ({ key: line.key, amount: line.amount })),
    discount_type: on ? discount.value.type : null,
    discount_value: on ? discount.value.value : 0,
    discount_reason: on ? discount.value.reason : null,
    discount_target: on ? discount.value.target : null,
    installments: rows.value.map((row) => ({ due_date: row.due_date, base: row.base, discounted: on && discount.value.target === "installments" && !!row.discounted })),
  };
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
const applyPriceChange = () => run(() => axios.post(`api/accounting/programs/${props.programId}/price-change`, plan()));
const suspend = () => run(() => axios.post(`api/accounting/programs/${props.programId}/suspend`));
const resume = () => run(() => axios.post(`api/accounting/programs/${props.programId}/resume`));
const stop = () => run(async () => { await axios.post(`api/accounting/programs/${props.programId}/stop`); stopping.value = false; });

function removeLine(key) {
  lines.value = lines.value.filter((line) => line.key !== key);
}

const discountMissingReason = computed(() => editableLines.value && discountAmount.value > 0 && !discount.value.reason?.trim());
// A discount on chosen installments needs them chosen, and no discount takes a whole installment.
const discountMissingInstallments = computed(() => editableLines.value && discount.value.target === "installments" && discount.value.type !== "none"
  && Number(discount.value.value) > 0 && !rows.value.some((row) => row.discounted));
const discountTakesWhole = computed(() => editableLines.value && rows.value.some((row, i) => rowDiscounts.value[i] > 0 && rowDiscounts.value[i] >= Number(row.base || 0)));
const discountInvalid = computed(() => discountMissingReason.value || discountMissingInstallments.value || discountTakesWhole.value);
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

        <!-- The price table as the program form showed it: month by month, with the free sessions. -->
        <div v-if="priceTable" class="flex flex-column gap-2">
          <span class="font-semibold">{{ $t("acc.program_price_table") }}</span>
          <ProgramPrice :price="priceTable" />
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
          <div v-if="discount.type !== 'none'" class="flex flex-column gap-1">
            <label for="disc-target">{{ $t("acc.discount_target") }}</label>
            <Select v-model="discount.target" inputId="disc-target" :options="discountTargets" optionLabel="label" optionValue="value" class="w-11rem" />
          </div>
          <div v-if="discount.type !== 'none' && discount.target === 'installments'" class="flex flex-column gap-1 w-full">
            <label for="disc-installments">{{ $t("acc.discount_installments") }}</label>
            <MultiSelect v-model="chosenInstallments" inputId="disc-installments" :options="installmentOptions" optionLabel="label" optionValue="value"
              display="chip" :maxSelectedLabels="3" :selectedItemsLabel="$t('acc.installments_count', { n: '{0}' })" :invalid="discountMissingInstallments"
              :placeholder="$t('acc.discount_installments_pick')" class="w-full" />
          </div>
          <div v-if="discount.type !== 'none'" class="flex flex-column gap-1 flex-1 min-w-12rem">
            <label for="disc-reason">{{ $t("acc.discount_reason") }}</label>
            <InputText v-model="discount.reason" id="disc-reason" :invalid="discountMissingReason" />
          </div>
          <small v-if="discount.type !== 'none'" class="w-full text-color-secondary">
            {{ discount.target === "installments"
              ? $t(discount.type === "amount" ? "acc.discount_installments_amount_hint" : "acc.discount_installments_percent_hint")
              : $t("acc.discount_total_hint") }}
          </small>
          <small v-if="discountTakesWhole" class="w-full text-red-600">{{ $t("acc.discount_whole_installment") }}</small>
        </div>
        <div v-else-if="charge.discount > 0" class="text-sm">
          {{ $t("acc.discount") }}: {{ amount(charge.discount) }} ({{ savedDiscountOn }}) — {{ charge.discount_reason }}
        </div>
        <div class="flex flex-wrap justify-end items-center gap-3">
          <span v-if="discountAmount > 0 && editableLines" class="text-color-secondary">{{ $t("acc.before_discount") }}: <span class="line-through">{{ amount(gross) }}</span></span>
          <span class="text-lg font-bold text-[#135C65]">{{ $t("acc.total") }}: {{ amount(net) }}</span>
        </div>

        <div v-if="charge.status !== 'cancelled'" class="flex flex-column gap-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="font-semibold">{{ $t("acc.installments") }}</span>
            <Button v-if="editableLines && months.length" icon="pi pi-refresh" :label="$t('acc.reset_monthly')" text size="small" @click="resetMonthly" />
          </div>
          <small v-if="!nothingPaid" class="text-color-secondary">{{ $t("acc.plan_locked_hint") }}</small>
          <InstallmentsEditor v-model="rows" :owed="editorTotal" :paidRows="paidRows" :mode="baseMode ? 'base' : 'amount'" :discounts="rowDiscounts"
            :disabled="!canEdit || !['tentative', 'confirmed'].includes(program.accounting_status)" @generated="regenerated" />
        </div>
        <div v-else class="flex flex-wrap gap-2">
          <Tag v-for="row in charge.installments" :key="row.id" :severity="installmentSeverity[row.state]"
            :value="`${installmentText(row)} · ${$t(`acc.installment_state.${row.state}`)}`" />
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
              <Button :label="$t('acc.save_plan')" icon="pi pi-save" severity="secondary" :loading="busy" :disabled="!sumMatches || discountInvalid" @click="savePlan" />
              <Button v-if="program.accounting_status === 'tentative'" icon="pi pi-verified" :label="$t('acc.confirm_program')" :loading="busy"
                :disabled="!sumMatches || discountInvalid" v-tooltip.top="$t('acc.confirm_program_hint')" @click="confirm" />
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
