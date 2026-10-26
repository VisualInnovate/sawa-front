<script setup>
// One category's priced items (inclusion packages, transport, evaluations, individual services);
// every item can be edited, added and deleted.
import { currency } from "@/utils/accounting";
import axios from "axios";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { ITEM_UNITS, money } from "@/utils/programFees";

const props = defineProps({
  category: { type: String, required: true },
  items: { type: Array, default: () => [] },
});
const emit = defineEmits(["saved"]);
const { t } = useI18n();
const toast = useToast();

const units = computed(() => ITEM_UNITS.map((value) => ({ value, label: t(`fees_unit_${value}`) })));
const defaultUnit = computed(() => ({ evaluation: "evaluation", individual: "session" })[props.category] ?? "month");
const showsFullDay = computed(() => props.category === "day_transport");

const dialog = ref(false);
const form = ref({});
const saving = ref(false);
const errors = ref({});
const removing = ref(null);

function open(item = null) {
  errors.value = {};
  form.value = item
    ? { id: item.id, name: item.name, price: item.price, unit: item.unit, monthly_cap: item.monthly_cap, needs_full_day: item.needs_full_day, notes: item.notes }
    : { name: "", price: null, unit: defaultUnit.value, monthly_cap: null, needs_full_day: false, notes: "" };
  dialog.value = true;
}

async function save() {
  saving.value = true;
  errors.value = {};
  try {
    const body = { ...form.value, category: props.category, needs_full_day: showsFullDay.value && !!form.value.needs_full_day };
    if (form.value.id) await axios.put(`api/program-fees/items/${form.value.id}`, body);
    else await axios.post("api/program-fees/items", body);
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
  await axios.delete(`api/program-fees/items/${removing.value.id}`);
  removing.value = null;
  emit("saved");
}
</script>

<template>
  <div class="flex justify-end mb-2">
    <Button icon="pi pi-plus" :label="$t('fees_add_item')" size="small" @click="open()" />
  </div>
  <DataTable :value="items" dataKey="id" size="small" stripedRows>
    <Column field="name" :header="$t('fees_item')" />
    <Column :header="$t('fees_price', { currency: currency.currency_name })">
      <template #body="{ data }"><span class="font-semibold">{{ money(data.price) }}</span></template>
    </Column>
    <Column :header="$t('fees_unit')">
      <template #body="{ data }">{{ $t(`fees_unit_${data.unit}`) }}</template>
    </Column>
    <Column :header="$t('fees_monthly_cap')">
      <template #body="{ data }">{{ money(data.monthly_cap) }}</template>
    </Column>
    <Column field="notes" :header="$t('fees_notes')">
      <template #body="{ data }">
        <div class="flex flex-column gap-1">
          <span>{{ data.notes }}</span>
          <Tag v-if="data.needs_full_day" severity="warn" :value="$t('fees_needs_full_day')" class="w-fit" />
        </div>
      </template>
    </Column>
    <Column header-style="width:7rem">
      <template #body="{ data }">
        <div class="flex gap-1">
          <Button icon="pi pi-pencil" size="small" rounded variant="outlined" severity="info" v-tooltip.top="$t('edit')" :aria-label="$t('edit')" @click="open(data)" />
          <Button icon="pi pi-trash" size="small" rounded variant="outlined" severity="danger" v-tooltip.top="$t('delete')" :aria-label="$t('delete')" @click="removing = data" />
        </div>
      </template>
    </Column>
  </DataTable>

  <Dialog v-model:visible="dialog" modal :header="form.id ? $t('edit') : $t('fees_add_item')" :style="{ width: '32rem' }" :breakpoints="{ '640px': '92vw' }">
    <form class="flex flex-column gap-3" @submit.prevent="save">
      <div class="flex flex-column gap-1">
        <label for="item-name">{{ $t("fees_item") }}</label>
        <InputText id="item-name" v-model="form.name" :invalid="!!errors.name" />
        <small class="text-red-500" v-if="errors.name">{{ errors.name[0] }}</small>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="flex flex-column gap-1">
          <label for="item-price">{{ $t("fees_price", { currency: currency.currency_name }) }}</label>
          <InputNumber v-model="form.price" inputId="item-price" :min="0" :maxFractionDigits="2" :invalid="!!errors.price" />
          <small class="text-red-500" v-if="errors.price">{{ errors.price[0] }}</small>
        </div>
        <div class="flex flex-column gap-1">
          <label for="item-unit">{{ $t("fees_unit") }}</label>
          <Select v-model="form.unit" inputId="item-unit" :options="units" optionLabel="label" optionValue="value" />
        </div>
      </div>
      <div class="flex flex-column gap-1">
        <label for="item-cap">{{ $t("fees_monthly_cap") }}</label>
        <InputNumber v-model="form.monthly_cap" inputId="item-cap" :min="0" :maxFractionDigits="2" />
        <small class="text-color-secondary">{{ $t("fees_monthly_cap_hint") }}</small>
      </div>
      <div v-if="showsFullDay" class="flex items-center gap-2">
        <Checkbox v-model="form.needs_full_day" inputId="item-full-day" binary />
        <label for="item-full-day">{{ $t("fees_needs_full_day") }}</label>
      </div>
      <div class="flex flex-column gap-1">
        <label for="item-notes">{{ $t("fees_notes") }}</label>
        <Textarea id="item-notes" v-model="form.notes" rows="2" autoResize />
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
