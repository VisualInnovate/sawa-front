<script setup>
// Importing the monthly meals Excel («شهر 1.xlsm»): upload it, check which child each sheet belongs to (the sheet
// name is the child's name; the matches are suggested), then save. Days already recorded are kept unless replaced.
import axios from "axios";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { errorText } from "@/utils/feeding";

const props = defineProps({ visible: Boolean });
const emit = defineEmits(["update:visible", "imported"]);
const { t } = useI18n();
const toast = useToast();

const file = ref(null);
const preview = ref(null);
const students = ref([]);
const overwrite = ref(false);
const busy = ref(false);
watch(() => props.visible, (open) => {
  if (open) {
    file.value = null;
    preview.value = null;
    overwrite.value = false;
  }
});

function pick(event) {
  file.value = event.target.files?.[0] ?? null;
}
async function read() {
  busy.value = true;
  try {
    const body = new FormData();
    body.append("file", file.value);
    preview.value = (await axios.post("api/feeding/import/preview", body)).data;
    if (!students.value.length) students.value = (await axios.get("api/feeding/students")).data.data;
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(t, error), life: 5000 });
  } finally {
    busy.value = false;
  }
}

/** The sheet's suggested children first, then the class students. */
const optionsFor = (sheet) => {
  const seen = new Set(sheet.suggestions.map((c) => c.id));
  return [
    ...sheet.suggestions.map((c) => ({ ...c, suggested: true })),
    ...students.value.filter((c) => !seen.has(c.id)).map((c) => ({ id: c.id, name: c.name, suggested: false })),
  ];
};
const matched = computed(() => preview.value?.sheets.filter((s) => s.child_id).length ?? 0);
const duplicateChild = computed(() => {
  const ids = preview.value?.sheets.map((s) => s.child_id).filter(Boolean) ?? [];
  return ids.length !== new Set(ids).size;
});

async function apply() {
  busy.value = true;
  try {
    const map = Object.fromEntries(preview.value.sheets.map((s) => [s.index, s.child_id || null]));
    const { data } = await axios.post("api/feeding/import/apply", { token: preview.value.token, map, overwrite: overwrite.value });
    toast.add({ severity: "success", summary: t("feeding.import_done"), detail: t("feeding.import_result", data.data), life: 6000 });
    emit("imported");
    emit("update:visible", false);
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(t, error), life: 5000 });
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <Dialog :visible="visible" modal :header="$t('feeding.import')" :style="{ width: '52rem' }" :breakpoints="{ '900px': '95vw' }" @update:visible="emit('update:visible', $event)">
    <div class="flex flex-col gap-3">
      <small class="text-slate-600">{{ $t("feeding.import_lead") }}</small>
      <div v-if="!preview" class="flex flex-wrap items-center gap-3">
        <input id="fi-file" type="file" accept=".xlsx,.xlsm" class="text-sm" :aria-label="$t('feeding.choose_file')" @change="pick" />
        <Button icon="pi pi-file-import" :label="$t('feeding.read_file')" :loading="busy" :disabled="!file" @click="read" />
      </div>

      <template v-else>
        <div class="overflow-x-auto">
          <table class="w-full text-sm border-collapse min-w-[40rem]">
            <thead><tr class="text-slate-500">
              <th class="p-2 text-start">{{ $t("feeding.sheet") }}</th>
              <th class="p-2 text-start">{{ $t("feeding.content") }}</th>
              <th class="p-2 text-start">{{ $t("feeding.child") }}</th>
            </tr></thead>
            <tbody>
              <tr v-for="sheet in preview.sheets" :key="sheet.index" class="border-t border-slate-100">
                <td class="p-2 font-semibold">{{ sheet.sheet }}</td>
                <td class="p-2">
                  {{ $t("feeding.days_meals", { days: sheet.days, meals: sheet.meals }) }}<br />
                  <small class="ltr inline-block text-slate-500">{{ sheet.from }} → {{ sheet.to }}</small>
                </td>
                <td class="p-2">
                  <Select v-model="sheet.child_id" :options="optionsFor(sheet)" optionLabel="name" optionValue="id" filter showClear :placeholder="$t('feeding.skip_sheet')" class="w-64">
                    <template #option="{ option }"><span class="grow">{{ option.name }}</span><Tag v-if="option.suggested" severity="success" :value="$t('feeding.suggested')" /></template>
                  </Select>
                  <small v-if="!sheet.suggestions.length" class="block text-amber-800">{{ $t("feeding.no_match") }}</small>
                  <small v-else-if="sheet.suggestions.length > 1 && !sheet.child_id" class="block text-amber-800">{{ $t("feeding.many_matches") }}</small>
                  <small v-if="sheet.existing" class="block text-slate-500">{{ $t("feeding.existing_n", { n: sheet.existing }) }}</small>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Message v-if="duplicateChild" severity="warn" size="small">{{ $t("feeding.same_child_twice") }}</Message>
        <label class="flex items-center gap-2">
          <Checkbox v-model="overwrite" binary inputId="fi-overwrite" />{{ $t("feeding.overwrite") }}
        </label>
      </template>
    </div>
    <template #footer>
      <Button variant="outlined" :label="$t('close')" @click="emit('update:visible', false)" />
      <Button v-if="preview" icon="pi pi-check" :label="$t('feeding.apply_import', { n: matched })" :loading="busy" :disabled="!matched" @click="apply" />
    </template>
  </Dialog>
</template>
