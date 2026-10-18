<script setup>
// One program's session tiers (day classes in weekly sessions, the clinics programs in monthly sessions);
// every tier can be edited, added and deleted.
import axios from "axios";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { money } from "@/utils/programFees";

const props = defineProps({
  program: { type: String, required: true },
  tiers: { type: Array, default: () => [] },
  usdRate: { type: Number, default: null },
});
const emit = defineEmits(["saved"]);
const { t } = useI18n();
const toast = useToast();

const isDay = computed(() => props.program === "day");
const hasDiscount = computed(() => props.program === "clinics");
const rows = computed(() => props.tiers.map((tier) => ({
  ...tier,
  session_price: tier.price / tier.sessions,
  installment: tier.price - tier.discount,
  usd: props.usdRate ? Math.round((tier.price - tier.discount) / props.usdRate) : null,
})));

const dialog = ref(false);
const form = ref({});
const saving = ref(false);
const errors = ref({});
const removing = ref(null);

function open(tier = null) {
  errors.value = {};
  form.value = tier ? { id: tier.id, sessions: tier.sessions, price: tier.price, discount: tier.discount } : { sessions: null, price: null, discount: 0 };
  dialog.value = true;
}

async function save() {
  saving.value = true;
  errors.value = {};
  try {
    const body = { program: props.program, sessions: form.value.sessions, price: form.value.price, discount: hasDiscount.value ? form.value.discount ?? 0 : 0 };
    if (form.value.id) await axios.put(`api/program-fees/tiers/${form.value.id}`, body);
    else await axios.post("api/program-fees/tiers", body);
    dialog.value = false;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("fees_saved"), life: 2500 });
    emit("saved");
  } catch (e) {
    errors.value = e.response?.data?.errors ?? {};
  } finally {
    saving.value = false;
  }
}

async function remove() {
  await axios.delete(`api/program-fees/tiers/${removing.value.id}`);
  removing.value = null;
  emit("saved");
}
</script>

<template>
  <div class="flex justify-end mb-2">
    <Button icon="pi pi-plus" :label="$t('fees_add_tier')" size="small" @click="open()" />
  </div>
  <DataTable :value="rows" dataKey="id" size="small" stripedRows>
    <Column v-if="isDay" :header="$t('fees_daily_sessions')">
      <template #body="{ data }">{{ money(data.sessions / 5) }}</template>
    </Column>
    <Column field="sessions" :header="isDay ? $t('fees_weekly_sessions') : $t('fees_sessions')" />
    <Column v-if="isDay" :header="$t('fees_monthly_sessions')">
      <template #body="{ data }">{{ data.sessions * 4 }}</template>
    </Column>
    <Column v-if="!isDay" :header="$t('fees_session_price')">
      <template #body="{ data }">{{ money(data.session_price) }}</template>
    </Column>
    <Column :header="isDay ? $t('fees_monthly_cost') : $t('fees_total_before_discount')">
      <template #body="{ data }">{{ money(data.price) }}</template>
    </Column>
    <template v-if="hasDiscount">
      <Column :header="$t('fees_discount')">
        <template #body="{ data }">{{ money(data.discount) }}</template>
      </Column>
      <Column :header="$t('fees_installment_jd')">
        <template #body="{ data }"><span class="font-semibold">{{ money(data.installment) }}</span></template>
      </Column>
      <Column :header="$t('fees_installment_usd')">
        <template #body="{ data }">{{ data.usd == null ? "" : `${money(data.usd)} $` }}</template>
      </Column>
    </template>
    <Column header-style="width:7rem">
      <template #body="{ data }">
        <div class="flex gap-1">
          <Button icon="pi pi-pencil" size="small" rounded variant="outlined" severity="info" v-tooltip.top="$t('edit')" :aria-label="$t('edit')" @click="open(data)" />
          <Button icon="pi pi-trash" size="small" rounded variant="outlined" severity="danger" v-tooltip.top="$t('delete')" :aria-label="$t('delete')" @click="removing = data" />
        </div>
      </template>
    </Column>
  </DataTable>

  <Dialog v-model:visible="dialog" modal :header="form.id ? $t('edit') : $t('fees_add_tier')" :style="{ width: '28rem' }" :breakpoints="{ '640px': '92vw' }">
    <form class="flex flex-column gap-3" @submit.prevent="save">
      <div class="flex flex-column gap-1">
        <label for="tier-sessions">{{ isDay ? $t("fees_weekly_sessions") : $t("fees_sessions") }}</label>
        <InputNumber v-model="form.sessions" inputId="tier-sessions" :min="1" :invalid="!!errors.sessions" />
        <small class="text-red-500" v-if="errors.sessions">{{ errors.sessions[0] }}</small>
      </div>
      <div class="flex flex-column gap-1">
        <label for="tier-price">{{ isDay ? $t("fees_monthly_cost") : $t("fees_total_before_discount") }}</label>
        <InputNumber v-model="form.price" inputId="tier-price" :min="0" :maxFractionDigits="2" :invalid="!!errors.price" />
        <small class="text-color-secondary" v-if="!isDay && form.sessions && form.price">{{ $t("fees_session_price") }}: {{ money(form.price / form.sessions) }}</small>
        <small class="text-red-500" v-if="errors.price">{{ errors.price[0] }}</small>
      </div>
      <div v-if="hasDiscount" class="flex flex-column gap-1">
        <label for="tier-discount">{{ $t("fees_discount") }}</label>
        <InputNumber v-model="form.discount" inputId="tier-discount" :min="0" :maxFractionDigits="2" :invalid="!!errors.discount" />
        <small class="text-color-secondary" v-if="form.price != null">{{ $t("fees_installment_jd") }}: {{ money(form.price - (form.discount ?? 0)) }}</small>
        <small class="text-red-500" v-if="errors.discount">{{ errors.discount[0] }}</small>
      </div>
      <Button type="submit" :loading="saving" icon="pi pi-check" :label="$t('submit')" />
    </form>
  </Dialog>

  <Dialog :visible="!!removing" modal :header="$t('delete')" :style="{ width: '24rem' }" @update:visible="removing = null">
    <p>{{ $t("fees_delete_confirm") }}</p>
    <div class="flex justify-end gap-2 mt-3">
      <Button :label="$t('cancel')" severity="secondary" variant="outlined" @click="removing = null" />
      <Button :label="$t('delete')" severity="danger" @click="remove" />
    </div>
  </Dialog>
</template>
