<script setup>
// One date for the whole class: each class student's status and up to four meals (ate or not, what, how much, note,
// action). Rows save one by one or all together; food names already used are suggested so the same food is written
// the same way.
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { can } from "@/utils/permissions";
import { STATE_SEVERITY, errorText, quantityKey, today } from "@/utils/feeding";

const props = defineProps({ meta: { type: Object, required: true } });
const { t } = useI18n();
const toast = useToast();
const router = useRouter();
const canEdit = can("feeding edit");

const date = ref(today());
const rows = ref([]);
const foods = ref([]);
const loading = ref(false);

const blankMeals = () => Array.from({ length: props.meta.meal_slots }, (_, i) => ({ slot: i + 1, ate: null, meal: "", quantity: null, note: "", action: "" }));
function toRow(item) {
  const meals = blankMeals();
  for (const meal of item.day?.meals ?? []) meals[meal.slot - 1] = { ...meals[meal.slot - 1], ...meal, meal: meal.meal ?? "", note: meal.note ?? "", action: meal.action ?? "" };
  return { ...item, status: item.day?.status ?? "present", note: item.day?.note ?? "", meals, dirty: false, saving: false, open: false };
}
async function load() {
  loading.value = true;
  try {
    rows.value = (await axios.get("api/feeding/day", { params: { date: date.value } })).data.data.map(toRow);
  } finally {
    loading.value = false;
  }
}
onMounted(async () => {
  load();
  foods.value = (await axios.get("api/feeding/foods")).data.data;
});
watch(date, load);

const statuses = computed(() => props.meta.day_statuses.map((value) => ({ value, label: t(`feeding.st_${value}`) })));
const quantities = computed(() => props.meta.quantities.map((value) => ({ value, label: t(quantityKey(value)) })));
const yesNo = computed(() => [{ value: true, label: t("feeding.ate_yes") }, { value: false, label: t("feeding.ate_no") }]);
const dirtyCount = computed(() => rows.value.filter((row) => row.dirty).length);
const isFuture = computed(() => date.value > today());

function touch(row) {
  row.dirty = true;
}
function setAte(row, meal, ate) {
  meal.ate = ate;
  if (ate === false) meal.quantity = 0;
  else if (ate === true && !meal.quantity) meal.quantity = 1;
  touch(row);
}
function stateOf(meal) {
  if (meal.ate == null) return null;
  if (!meal.ate || !Number(meal.quantity)) return "refused";
  return Number(meal.quantity) >= 1 ? "full" : "partial";
}

async function save(row) {
  row.saving = true;
  try {
    const { data } = await axios.put(`api/feeding/day/${row.child_id}/${date.value}`, {
      status: row.status,
      note: row.note || null,
      meals: row.status === "present" || row.status === "late" || row.status === "left_early" ? row.meals : [],
    });
    Object.assign(row, toRow({ ...row, day: data.data }), { open: row.open });
    for (const meal of data.data.meals) for (const food of (meal.meal ?? "").split(/[/،,+]/)) {
      const name = food.trim();
      if (name && !foods.value.includes(name)) foods.value.push(name);
    }
    return true;
  } catch (error) {
    toast.add({ severity: "error", summary: `${row.child}: ${t("error")}`, detail: errorText(t, error), life: 4000 });
    return false;
  } finally {
    row.saving = false;
  }
}
async function saveAll() {
  const results = await Promise.all(rows.value.filter((row) => row.dirty).map(save));
  if (results.every(Boolean)) toast.add({ severity: "success", summary: t("feeding.saved"), life: 1500 });
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <datalist id="feeding-foods"><option v-for="food in foods" :key="food" :value="food" /></datalist>
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <label for="fd-date" class="font-semibold">{{ $t("feeding.date") }}</label>
        <InputText id="fd-date" v-model="date" type="date" class="ltr" :max="today()" />
      </div>
      <div v-if="canEdit" class="flex items-center gap-2">
        <Tag v-if="dirtyCount" severity="warn" :value="`${$t('feeding.unsaved')}: ${dirtyCount}`" />
        <Button icon="pi pi-save" :label="$t('feeding.save_all')" :disabled="!dirtyCount || isFuture" @click="saveAll" />
      </div>
    </div>

    <p v-if="!loading && !rows.length" class="text-slate-500 m-0">{{ $t("feeding.no_students") }}</p>
    <div class="flex flex-col gap-2">
      <div v-for="row in rows" :key="row.child_id" class="p-3 rounded-lg border bg-white flex flex-col gap-2" :class="row.dirty ? 'border-amber-300' : 'border-slate-200'">
        <div class="flex flex-wrap items-center gap-3">
          <Button variant="link" class="p-0 font-bold" :label="row.child" @click="router.push({ name: 'feeding-child', params: { id: row.child_id } })" />
          <Select v-model="row.status" :options="statuses" optionLabel="label" optionValue="value" size="small" class="w-36" :disabled="!canEdit" @change="touch(row)" />
          <div class="flex flex-wrap gap-1 grow">
            <template v-for="meal in row.meals" :key="meal.slot">
              <Tag v-if="stateOf(meal)" :severity="STATE_SEVERITY[stateOf(meal)]">{{ meal.meal || $t("feeding.meal_n", { n: meal.slot }) }} · {{ $t(`feeding.state_${stateOf(meal)}`) }}</Tag>
            </template>
          </div>
          <small v-if="row.day?.updated_by && !row.dirty" class="text-slate-500">{{ $t("feeding.saved_by", { name: row.day.updated_by, at: row.day.updated_at }) }}</small>
          <Button v-if="canEdit && row.dirty" size="small" icon="pi pi-save" :label="$t('feeding.save')" :loading="row.saving" :disabled="isFuture" @click="save(row).then((ok) => ok && toast.add({ severity: 'success', summary: $t('feeding.saved'), life: 1200 }))" />
        </div>

        <div v-if="['present', 'late', 'left_early'].includes(row.status)" class="grid sm:grid-cols-2 xl:grid-cols-4 gap-2">
          <div v-for="meal in row.meals" :key="meal.slot" class="p-2 rounded border border-slate-100 bg-slate-50 flex flex-col gap-2">
            <b class="text-sm">{{ $t("feeding.meal_n", { n: meal.slot }) }}</b>
            <SelectButton :modelValue="meal.ate" :options="yesNo" optionLabel="label" optionValue="value" size="small" :disabled="!canEdit" fluid
                          @update:modelValue="setAte(row, meal, $event)" />
            <InputText v-model="meal.meal" list="feeding-foods" :placeholder="$t('feeding.meal_ph')" maxlength="150" size="small" :disabled="!canEdit"
                       :aria-label="$t('feeding.meal')" fluid @input="touch(row)" />
            <Select v-if="meal.ate !== false" v-model="meal.quantity" :options="quantities" optionLabel="label" optionValue="value" :placeholder="$t('feeding.quantity')"
                    size="small" :disabled="!canEdit || meal.ate == null" fluid @change="touch(row)" />
            <InputText v-model="meal.note" :placeholder="$t('feeding.note')" maxlength="300" size="small" :disabled="!canEdit" :aria-label="$t('feeding.note')" fluid @input="touch(row)" />
            <InputText v-if="stateOf(meal) === 'refused' || stateOf(meal) === 'partial' || meal.action" v-model="meal.action" :placeholder="$t('feeding.action_ph')"
                       maxlength="300" size="small" :disabled="!canEdit" :aria-label="$t('feeding.action')" fluid @input="touch(row)" />
          </div>
        </div>
        <InputText v-else v-model="row.note" :placeholder="$t('feeding.note')" maxlength="500" size="small" :disabled="!canEdit" :aria-label="$t('feeding.note')" fluid @input="touch(row)" />
      </div>
    </div>
  </div>
</template>
