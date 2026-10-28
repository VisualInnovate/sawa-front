<script setup>
// «إعدادات المحاسبة»: the currency (shown everywhere, the fees page included), the consultations' price and the
// manual fee kinds with their default prices.
import axios from "axios";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { amount, errorText, loadCurrency } from "@/utils/accounting";
import AccountingTabs from "@/components/accounting/AccountingTabs.vue";

const { t } = useI18n();
const toast = useToast();
const form = ref(null);
const types = ref([]);
const newType = ref({ name: "", default_price: 0 });

async function load() {
  const { data } = await axios.get("api/accounting/settings");
  const settings = data.data.settings;
  form.value = { currency_symbol: settings.currency_symbol, currency_name: settings.currency_name,
    consultation_paid: settings.consultation_paid === "1", consultation_price: Number(settings.consultation_price || 0) };
  types.value = data.data.fee_types.map((row) => ({ ...row }));
}

async function call(request) {
  try {
    await request();
    toast.add({ severity: "success", summary: t("success_message"), detail: t("acc.saved"), life: 2500 });
    await load();
    await loadCurrency(true);
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  }
}

const saveSettings = () => call(() => axios.put("api/accounting/settings", form.value));
const addType = () => call(async () => { await axios.post("api/accounting/fee-types", newType.value); newType.value = { name: "", default_price: 0 }; });
const saveType = (row) => call(() => axios.put(`api/accounting/fee-types/${row.id}`, { name: row.name, default_price: row.default_price }));
const removeType = (row) => call(() => axios.delete(`api/accounting/fee-types/${row.id}`));

onMounted(load);
</script>

<template>
  <div>
    <p class="text-xl p-4 text-bp-135c65 font-bold m-0">{{ $t("acc.settings") }}</p>
    <AccountingTabs />
    <div v-if="!form" class="flex justify-center p-5"><i class="pi pi-spin pi-spinner text-2xl" /></div>
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <div class="sawa-card p-4 flex flex-column gap-3">
        <span class="font-semibold">{{ $t("acc.currency") }}</span>
        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-column gap-1">
            <label for="cur-symbol">{{ $t("acc.currency_symbol") }}</label>
            <InputText v-model="form.currency_symbol" id="cur-symbol" maxlength="10" />
          </div>
          <div class="flex flex-column gap-1">
            <label for="cur-name">{{ $t("acc.currency_name") }}</label>
            <InputText v-model="form.currency_name" id="cur-name" maxlength="30" />
          </div>
        </div>
        <small class="text-color-secondary">{{ $t("acc.currency_hint") }}</small>

        <span class="font-semibold mt-2">{{ $t("acc.consultation_price") }}</span>
        <div class="flex flex-wrap items-center gap-3">
          <ToggleSwitch v-model="form.consultation_paid" inputId="cons-paid" />
          <label for="cons-paid">{{ form.consultation_paid ? $t("acc.consultations_paid") : $t("acc.consultations_free") }}</label>
          <InputNumber v-if="form.consultation_paid" v-model="form.consultation_price" :min="0" :maxFractionDigits="2" :suffix="` ${form.currency_symbol}`"
            :aria-label="$t('acc.consultation_price')" class="w-10rem" />
        </div>
        <small class="text-color-secondary">{{ $t("acc.consultation_price_hint") }}</small>
        <div class="flex justify-end">
          <Button icon="pi pi-check" :label="$t('acc.save')" :disabled="!form.currency_symbol?.trim() || !form.currency_name?.trim() || (form.consultation_paid && !(form.consultation_price > 0))"
            @click="saveSettings" />
        </div>
      </div>

      <div class="sawa-card p-4 flex flex-column gap-3">
        <span class="font-semibold">{{ $t("acc.fee_types") }}</span>
        <DataTable :value="types" dataKey="id" size="small">
          <Column :header="$t('acc.description')">
            <template #body="{ data }"><InputText v-model="data.name" class="w-full" :aria-label="$t('acc.description')" /></template>
          </Column>
          <Column :header="$t('acc.default_price')">
            <template #body="{ data }"><InputNumber v-model="data.default_price" :min="0" :maxFractionDigits="2" class="w-8rem" :aria-label="$t('acc.default_price')" /></template>
          </Column>
          <Column header-style="width:6rem">
            <template #body="{ data }">
              <div class="flex gap-1">
                <Button icon="pi pi-check" text rounded :aria-label="$t('acc.save')" @click="saveType(data)" />
                <Button icon="pi pi-trash" text rounded severity="danger" :aria-label="$t('delete')" @click="removeType(data)" />
              </div>
            </template>
          </Column>
        </DataTable>
        <div class="flex flex-wrap items-end gap-2">
          <div class="flex flex-column gap-1 flex-1">
            <label for="type-name">{{ $t("acc.description") }}</label>
            <InputText v-model="newType.name" id="type-name" />
          </div>
          <div class="flex flex-column gap-1">
            <label for="type-price">{{ $t("acc.default_price") }}</label>
            <InputNumber v-model="newType.default_price" inputId="type-price" :min="0" :maxFractionDigits="2" class="w-8rem" />
          </div>
          <Button icon="pi pi-plus" :label="$t('acc.add_fee_type')" :disabled="!newType.name.trim()" @click="addType" />
        </div>
        <small v-if="types.length" class="text-color-secondary">{{ types.map((row) => `${row.name}: ${amount(row.default_price)}`).join(" · ") }}</small>
      </div>
    </div>
    <Toast />
  </div>
</template>
