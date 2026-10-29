<script setup>
// The social insurance rates of the current labour system: the employee's and the employer's shares, the wage cap
// and the day each rate starts. A payroll month uses the latest rate started by its last day. Saudi Arabia has
// three categories (Saudis, Saudis first registered from 3 July 2024, non-Saudis); Jordan one.
import axios from "axios";
import moment from "moment";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { errorText } from "@/utils/accounting";

const props = defineProps({ canEdit: Boolean });
const { t } = useI18n();
const toast = useToast();

const rows = ref([]);
const categories = ref([]);
const form = ref(null);
const removing = ref(null);

async function load() {
  const { data } = await axios.get("api/payroll/insurance-rates");
  rows.value = data.data;
  categories.value = data.categories;
}
onMounted(load);

function open(row = null) {
  form.value = row
    ? { ...row, effective_from: moment(row.effective_from).toDate() }
    : { category: categories.value[0], employee_rate: null, employer_rate: null, cap: null, effective_from: moment().startOf("month").toDate() };
}
async function save() {
  const f = form.value;
  const body = { ...f, effective_from: moment(f.effective_from).format("YYYY-MM-DD") };
  try {
    await (f.id ? axios.put(`api/payroll/insurance-rates/${f.id}`, body) : axios.post("api/payroll/insurance-rates", body));
    form.value = null;
    load();
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  }
}
async function remove() {
  await axios.delete(`api/payroll/insurance-rates/${removing.value.id}`);
  removing.value = null;
  load();
}
const money = (v) => (v === null || v === undefined ? "—" : Number(v).toLocaleString("en"));
</script>

<template>
  <div class="flex flex-column gap-2">
    <div class="flex items-center justify-between gap-2">
      <p class="font-semibold m-0">{{ $t("rates.title") }}</p>
      <Button v-if="props.canEdit" icon="pi pi-plus" :label="$t('rates.add')" size="small" outlined @click="open()" />
    </div>
    <small class="text-color-secondary">{{ $t("rates.hint") }}</small>
    <DataTable :value="rows" dataKey="id" size="small" stripedRows>
      <Column :header="$t('rates.category')"><template #body="{ data }">{{ $t(`rates.cat_${data.category}`) }}</template></Column>
      <Column :header="$t('rates.employee_rate')"><template #body="{ data }">{{ data.employee_rate }}%</template></Column>
      <Column :header="$t('rates.employer_rate')"><template #body="{ data }">{{ data.employer_rate }}%</template></Column>
      <Column :header="$t('rates.cap')"><template #body="{ data }">{{ money(data.cap) }}</template></Column>
      <Column :header="$t('rates.from')"><template #body="{ data }"><bdi dir="ltr">{{ moment(data.effective_from).format("YYYY-MM-DD") }}</bdi></template></Column>
      <Column v-if="props.canEdit" class="text-end">
        <template #body="{ data }">
          <Button icon="pi pi-pencil" text rounded size="small" :aria-label="$t('edit')" @click="open(data)" />
          <Button icon="pi pi-trash" text rounded size="small" severity="danger" :aria-label="$t('delete')" @click="removing = data" />
        </template>
      </Column>
    </DataTable>

    <Dialog :visible="!!form" modal :header="form?.id ? $t('edit') : $t('rates.add')" :style="{ width: '460px' }" @update:visible="form = null">
      <div v-if="form" class="flex flex-column gap-3">
        <div class="flex flex-column gap-1">
          <label for="rate-cat">{{ $t("rates.category") }}</label>
          <Select inputId="rate-cat" v-model="form.category" :options="categories" :optionLabel="(c) => $t(`rates.cat_${c}`)" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-column gap-1">
            <label for="rate-emp">{{ $t("rates.employee_rate") }}</label>
            <InputNumber v-model="form.employee_rate" inputId="rate-emp" :min="0" :max="50" :maxFractionDigits="2" suffix=" %" fluid />
          </div>
          <div class="flex flex-column gap-1">
            <label for="rate-er">{{ $t("rates.employer_rate") }}</label>
            <InputNumber v-model="form.employer_rate" inputId="rate-er" :min="0" :max="50" :maxFractionDigits="2" suffix=" %" fluid />
          </div>
          <div class="flex flex-column gap-1">
            <label for="rate-cap">{{ $t("rates.cap") }}</label>
            <InputNumber v-model="form.cap" inputId="rate-cap" :min="0" :maxFractionDigits="2" fluid />
          </div>
          <div class="flex flex-column gap-1">
            <label for="rate-from">{{ $t("rates.from") }}</label>
            <DatePicker v-model="form.effective_from" inputId="rate-from" dateFormat="yy-mm-dd" showIcon fluid />
          </div>
        </div>
      </div>
      <template #footer>
        <Button :label="$t('cancel')" text severity="secondary" @click="form = null" />
        <Button icon="pi pi-check" :label="$t('save')" :disabled="form?.employee_rate === null || form?.employer_rate === null" @click="save" />
      </template>
    </Dialog>

    <Dialog :visible="!!removing" modal :header="$t('delete')" :style="{ width: '400px' }" @update:visible="removing = null">
      <p class="m-0">{{ $t("rates.remove_confirm") }}</p>
      <template #footer>
        <Button :label="$t('cancel')" text severity="secondary" @click="removing = null" />
        <Button icon="pi pi-trash" :label="$t('delete')" severity="danger" @click="remove" />
      </template>
    </Dialog>
  </div>
</template>
