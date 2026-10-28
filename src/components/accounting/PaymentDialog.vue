<script setup>
// «سند قبض»: whole installments of one child, each charge's earliest first (choosing a later one takes the earlier
// ones with it); paid in cash, CliQ, transfer, cheque, card or from the child's balance.
import axios from "axios";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { PAYMENT_METHODS, amount, chargeTitle, errorText, installmentSeverity, isoDate, loadCurrency } from "@/utils/accounting";

const props = defineProps({
  childId: { type: [Number, String], default: null },
  // Installments to tick when it opens (with the earlier ones of their charges).
  preselect: { type: Array, default: () => [] },
});
const visible = defineModel("visible", { type: Boolean, default: false });
const emit = defineEmits(["saved"]);
const { t } = useI18n();
const toast = useToast();

const children = ref([]);
const child = ref(null);
const charges = ref([]);
const balance = ref(0);
const chosen = ref([]);
const form = ref({ method: "cash", reference: "", paid_on: new Date(), notes: "" });
const loading = ref(false);
const saving = ref(false);

const openCharges = computed(() => charges.value
  .filter((charge) => charge.status !== "cancelled" && charge.installments.some((row) => row.status === "open"))
  .map((charge) => ({ ...charge, open: charge.installments.filter((row) => row.status === "open") })));
const allOpen = computed(() => openCharges.value.flatMap((charge) => charge.open));
const total = computed(() => Math.round(allOpen.value.filter((row) => chosen.value.includes(row.id)).reduce((sum, row) => sum + Number(row.amount), 0) * 100) / 100);
const methods = computed(() => PAYMENT_METHODS.filter((method) => method !== "balance" || balance.value > 0));

async function loadChildren() {
  if (children.value.length) return;
  const { data } = await axios.get("api/child");
  children.value = data.children ?? [];
}

async function loadChild() {
  charges.value = [];
  chosen.value = [];
  if (!child.value) return;
  loading.value = true;
  const { data } = await axios.get(`api/accounting/accounts/${child.value}`);
  charges.value = data.data.charges;
  balance.value = data.data.totals.balance;
  loading.value = false;
  props.preselect.forEach((id) => toggle(id, true));
}

// Ticking an installment ticks the earlier open ones of its charge; unticking one unticks the later ones.
function toggle(id, on) {
  const charge = openCharges.value.find((row) => row.open.some((installment) => installment.id === id));
  if (!charge) return;
  const index = charge.open.findIndex((installment) => installment.id === id);
  const ids = charge.open.map((installment) => installment.id);
  const others = chosen.value.filter((value) => !ids.includes(value));
  chosen.value = on ? [...others, ...ids.slice(0, index + 1)] : [...others, ...ids.slice(0, index)];
}

watch(visible, async (open) => {
  if (!open) return;
  loadCurrency();
  form.value = { method: "cash", reference: "", paid_on: new Date(), notes: "" };
  child.value = props.childId ? Number(props.childId) : null;
  if (!props.childId) await loadChildren();
  await loadChild();
});

async function save() {
  saving.value = true;
  try {
    const { data } = await axios.post("api/accounting/payments", {
      child_id: child.value, installment_ids: chosen.value, method: form.value.method,
      reference: form.value.reference || null, paid_on: isoDate(form.value.paid_on), notes: form.value.notes || null,
    });
    toast.add({ severity: "success", summary: t("success_message"), detail: t("acc.payment_saved", { no: data.data.receipt_no }), life: 3000 });
    visible.value = false;
    emit("saved", data.data);
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <Dialog v-model:visible="visible" modal :header="$t('acc.pay')" :style="{ width: '44rem' }" :breakpoints="{ '768px': '95vw' }">
    <div class="flex flex-column gap-3">
      <div v-if="!childId" class="flex flex-column gap-1">
        <label for="pay-child">{{ $t("acc.child") }}</label>
        <Select v-model="child" inputId="pay-child" :options="children" optionLabel="name" optionValue="id" filter :placeholder="$t('acc.search_child')" @change="loadChild" />
      </div>

      <div v-if="loading" class="flex justify-center p-3"><i class="pi pi-spin pi-spinner text-xl" /></div>
      <template v-else-if="child">
        <div>
          <span class="font-semibold">{{ $t("acc.choose_installments") }}</span>
          <p class="text-sm text-color-secondary m-0">{{ $t("acc.choose_installments_hint") }}</p>
        </div>
        <Message v-if="!openCharges.length" severity="info" size="small">{{ $t("acc.no_open_installments") }}</Message>
        <div v-for="charge in openCharges" :key="charge.id" class="border-1 surface-border border-round p-2 flex flex-column gap-2">
          <div class="flex flex-wrap justify-between gap-2">
            <span class="font-semibold">{{ chargeTitle(t, charge) }}</span>
            <span class="text-sm text-color-secondary">{{ $t("acc.remaining") }}: {{ amount(charge.remaining) }}</span>
          </div>
          <div v-for="row in charge.open" :key="row.id" class="flex items-center gap-2">
            <Checkbox :inputId="`inst-${row.id}`" :modelValue="chosen.includes(row.id)" binary @update:modelValue="(on) => toggle(row.id, on)" />
            <label :for="`inst-${row.id}`" class="flex flex-wrap items-center gap-2 cursor-pointer">
              <span>{{ row.due_date }}</span>
              <span class="font-semibold">{{ amount(row.amount) }}</span>
              <Tag :severity="installmentSeverity[row.state]" :value="$t(`acc.installment_state.${row.state}`)" />
            </label>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="flex flex-column gap-1">
            <label for="pay-method">{{ $t("acc.method") }}</label>
            <Select v-model="form.method" inputId="pay-method" :options="methods" :optionLabel="(m) => $t(`acc.methods.${m}`)" />
            <small v-if="balance > 0" class="text-color-secondary">{{ $t("acc.balance") }}: {{ amount(balance) }}</small>
          </div>
          <div class="flex flex-column gap-1">
            <label for="pay-date">{{ $t("acc.paid_on") }}</label>
            <DatePicker v-model="form.paid_on" inputId="pay-date" dateFormat="yy-mm-dd" showIcon :maxDate="new Date()" />
          </div>
          <div class="flex flex-column gap-1">
            <label for="pay-ref">{{ $t("acc.reference") }}</label>
            <InputText v-model="form.reference" id="pay-ref" />
          </div>
          <div class="flex flex-column gap-1">
            <label for="pay-notes">{{ $t("acc.notes") }}</label>
            <InputText v-model="form.notes" id="pay-notes" />
          </div>
        </div>
      </template>
    </div>
    <template #footer>
      <div class="flex flex-wrap items-center justify-between gap-2 w-full">
        <span class="text-lg font-bold text-bp-135c65">{{ $t("acc.payment_total") }}: {{ amount(total) }}</span>
        <div class="flex gap-2">
          <Button :label="$t('acc.cancel')" severity="secondary" variant="outlined" @click="visible = false" />
          <Button icon="pi pi-check" :label="$t('acc.save_payment')" :loading="saving"
            :disabled="!chosen.length || (form.method === 'balance' && balance + 0.001 < total)" @click="save" />
        </div>
      </div>
    </template>
  </Dialog>
</template>
