<script setup>
// «إعدادات ELM» (/elm-settings): a tab for each of the form's four parts (its name, its instructions and its items: text,
// column «المادة» / «الأدوات», order) and the ages the form is meant for. Changes apply to new evaluations; a deleted
// item stays on the evaluations that answered it. {{name}} in an item is the child's name.
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import axios from "axios";

const { t } = useI18n();
const toast = useToast();

const loading = ref(true);
const tab = ref(null);
const sections = ref([]);
const errors = ref({});
const saving = ref(false);
// The open part's name and instructions, as typed.
const sectionForms = ref({});
const general = ref({ from_months: null, to_months: null });

const dialog = ref(false);
const form = ref(null);
const deleteTarget = ref(null);
const COLUMN_OPTIONS = computed(() => [
  { value: "material", label: t("elm.column_material") },
  { value: "tool", label: t("elm.column_tool") },
]);

function apply(data) {
  sections.value = data.sections ?? [];
  sectionForms.value = Object.fromEntries(sections.value.map((section) => [section.id, { name: section.name, instructions: section.instructions ?? "" }]));
  general.value = { from_months: data.age_range?.from_months ?? null, to_months: data.age_range?.to_months ?? null };
  if (tab.value === null && sections.value.length) tab.value = String(sections.value[0].id);
}

async function load() {
  loading.value = true;
  try {
    apply((await axios.get("/api/elm-settings")).data.data);
  } catch (error) {
    fail(error);
  } finally {
    loading.value = false;
  }
}

function done(data) {
  apply(data);
  toast.add({ severity: "success", summary: t("success_message"), detail: t("successful"), life: 3000 });
}

function fail(error) {
  errors.value = error.response?.data?.errors ?? {};
  if (!Object.keys(errors.value).length) {
    toast.add({ severity: "error", summary: t("error"), detail: error.response?.data?.message || t("request_failed_retry"), life: 5000 });
  }
}

async function run(request) {
  saving.value = true;
  errors.value = {};
  try {
    done((await request()).data.data);
    return true;
  } catch (error) {
    fail(error);
    return false;
  } finally {
    saving.value = false;
  }
}

const saveSection = (section) => run(() => axios.put(`/api/elm-settings/sections/${section.id}`, sectionForms.value[section.id]));
const saveGeneral = () => run(() => axios.put("/api/elm-settings/general", general.value));

function openNew(section) {
  errors.value = {};
  form.value = { id: null, section_id: section.id, column: "material", text: "" };
  dialog.value = true;
}

function openEdit(item, section) {
  errors.value = {};
  form.value = { id: item.id, section_id: section.id, column: item.column, text: item.text };
  dialog.value = true;
}

async function saveItem() {
  const payload = { section_id: form.value.section_id, column: form.value.column, text: form.value.text };
  const ok = await run(() => (form.value.id ? axios.put(`/api/elm-settings/items/${form.value.id}`, payload) : axios.post("/api/elm-settings/items", payload)));
  if (ok) dialog.value = false;
}

async function removeItem() {
  const item = deleteTarget.value;
  deleteTarget.value = null;
  await run(() => axios.delete(`/api/elm-settings/items/${item.id}`));
}

// Moves an item one place up or down in its part.
function move(section, index, step) {
  const ids = section.items.map((item) => item.id);
  const to = index + step;
  if (to < 0 || to >= ids.length) return;
  [ids[index], ids[to]] = [ids[to], ids[index]];
  run(() => axios.put("/api/elm-settings/items/order", { section_id: section.id, ids }));
}

onMounted(load);
</script>

<template>
  <div class="page es-page">
    <Toast />
    <header>
      <h1 class="page-title">{{ $t("elm.settings_title") }}</h1>
      <p class="es-hint">{{ $t("elm.settings_lead") }}</p>
    </header>

    <div v-if="loading" class="es-state"><ProgressSpinner style="width: 40px; height: 40px" /></div>

    <Tabs v-else v-model:value="tab">
      <TabList>
        <Tab v-for="section in sections" :key="section.id" :value="String(section.id)">
          <b class="ltr">{{ section.code }}</b> {{ section.name }} ({{ section.items.length }})
        </Tab>
        <Tab value="general"><i class="pi pi-info-circle" aria-hidden="true" /> {{ $t("elm.tab_general") }}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel v-for="section in sections" :key="section.id" :value="String(section.id)">
          <form class="es-form" @submit.prevent="saveSection(section)">
            <div class="es-row">
              <div class="es-field es-name">
                <label :for="'es-name-' + section.id">{{ $t("elm.section_name") }}</label>
                <InputText :id="'es-name-' + section.id" v-model="sectionForms[section.id].name" required :invalid="!!errors.name" />
                <small v-if="errors.name" class="es-error">{{ errors.name[0] }}</small>
              </div>
              <div class="es-field es-grow">
                <label :for="'es-ins-' + section.id">{{ $t("elm.instructions_label") }}</label>
                <Textarea :id="'es-ins-' + section.id" v-model="sectionForms[section.id].instructions" rows="2" autoResize />
              </div>
            </div>
            <div class="es-actions">
              <Button v-can="'elm question edit'" type="submit" :label="$t('save')" icon="pi pi-check" :loading="saving" size="small" />
            </div>
          </form>

          <div class="es-bar">
            <small class="es-hint">{{ $t("elm.name_hint") }}</small>
            <Button v-can="'elm question create'" icon="pi pi-plus" :label="$t('elm.add_item')" @click="openNew(section)" />
          </div>
          <DataTable :value="section.items" dataKey="id" responsiveLayout="scroll">
            <Column field="number" header="#" style="width: 3.5rem" />
            <Column :header="$t('elm.item')">
              <template #body="{ data }"><span class="es-text">{{ data.text }}</span></template>
            </Column>
            <Column :header="$t('elm.column')" style="width: 9rem">
              <template #body="{ data }">
                <Tag :severity="data.column === 'tool' ? 'info' : 'secondary'" :value="$t(`elm.column_${data.column}`)" />
              </template>
            </Column>
            <Column style="width: 13rem">
              <template #body="{ data, index }">
                <div class="table-actions">
                  <Button v-can="'elm question edit'" icon="pi pi-arrow-up" rounded severity="secondary" variant="text" :disabled="index === 0 || saving"
                    v-tooltip.top="$t('elm.move_up')" :aria-label="$t('elm.move_up')" @click="move(section, index, -1)" />
                  <Button v-can="'elm question edit'" icon="pi pi-arrow-down" rounded severity="secondary" variant="text" :disabled="index === section.items.length - 1 || saving"
                    v-tooltip.top="$t('elm.move_down')" :aria-label="$t('elm.move_down')" @click="move(section, index, 1)" />
                  <Button v-can="'elm question edit'" icon="pi pi-pencil" rounded severity="info" variant="outlined"
                    v-tooltip.top="$t('edit')" :aria-label="$t('edit')" @click="openEdit(data, section)" />
                  <Button v-can="'elm question delete'" icon="pi pi-trash" rounded severity="danger" variant="outlined"
                    v-tooltip.top="$t('delete')" :aria-label="$t('delete')" @click="deleteTarget = data" />
                </div>
              </template>
            </Column>
          </DataTable>
        </TabPanel>

        <TabPanel value="general">
          <form class="es-form" @submit.prevent="saveGeneral">
            <div class="es-row">
              <div class="es-field es-num">
                <label for="es-age-from">{{ $t("elm.age_from") }}</label>
                <InputNumber inputId="es-age-from" v-model="general.from_months" :min="0" :max="1200" :useGrouping="false" />
              </div>
              <div class="es-field es-num">
                <label for="es-age-to">{{ $t("elm.age_to") }}</label>
                <InputNumber inputId="es-age-to" v-model="general.to_months" :min="0" :max="1200" :useGrouping="false" :invalid="!!errors.to_months" />
                <small v-if="errors.to_months" class="es-error">{{ errors.to_months[0] }}</small>
              </div>
            </div>
            <small class="es-hint">{{ $t("elm.age_hint") }}</small>
            <div class="es-actions">
              <Button v-can="'elm question edit'" type="submit" :label="$t('save')" icon="pi pi-check" :loading="saving" />
            </div>
          </form>
        </TabPanel>
      </TabPanels>
    </Tabs>

    <Dialog v-model:visible="dialog" :header="form?.id ? $t('elm.edit_item') : $t('elm.add_item')" modal :style="{ width: '560px' }" :breakpoints="{ '620px': '95vw' }">
      <form v-if="form" class="es-form" @submit.prevent="saveItem">
        <div class="es-field">
          <label for="es-item-text">{{ $t("elm.item") }}</label>
          <InputText id="es-item-text" v-model="form.text" required :invalid="!!errors.text" />
          <small v-if="errors.text" class="es-error">{{ errors.text[0] }}</small>
          <small class="es-hint">{{ $t("elm.name_hint") }}</small>
        </div>
        <div class="es-field">
          <label>{{ $t("elm.column") }}</label>
          <SelectButton v-model="form.column" :options="COLUMN_OPTIONS" optionLabel="label" optionValue="value" :allowEmpty="false" />
        </div>
        <div class="es-actions">
          <Button type="button" :label="$t('cancel')" severity="secondary" variant="text" @click="dialog = false" />
          <Button type="submit" :label="$t('save')" icon="pi pi-check" :loading="saving" />
        </div>
      </form>
    </Dialog>

    <Dialog :visible="!!deleteTarget" :header="$t('delete')" modal :style="{ width: '440px' }" @update:visible="deleteTarget = null">
      <p>{{ $t("elm.delete_item_confirm") }}</p>
      <p><b>{{ deleteTarget?.text }}</b></p>
      <template #footer>
        <Button :label="$t('no')" icon="pi pi-times" variant="text" severity="secondary" @click="deleteTarget = null" />
        <Button :label="$t('yes')" icon="pi pi-check" severity="danger" @click="removeItem" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.es-page { display: grid; gap: 1rem; }
.es-page h1 { margin: 0; }
.es-hint { margin: .25rem 0 0; color: var(--sawa-muted, #64748b); font-size: .88rem; line-height: 1.7; }
.es-state { display: grid; place-items: center; padding: 3rem; }
.es-form { display: grid; gap: 1rem; margin-bottom: 1rem; }
.es-row { display: flex; flex-wrap: wrap; gap: 1rem; }
.es-field { display: grid; gap: .4rem; align-content: start; }
.es-field label { font-weight: 700; }
.es-name { width: 18rem; }
.es-grow { flex: 1; min-width: 16rem; }
.es-num { width: 11rem; }
.es-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .75rem; margin-bottom: .75rem; }
.es-text { font-weight: 600; }
.es-error { color: #dc2626; }
.es-actions { display: flex; justify-content: flex-end; gap: .5rem; }
</style>
