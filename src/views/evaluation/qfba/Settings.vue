<script setup>
// «إعدادات QFBA» (/qfba-settings): every text in Arabic and English — the questions (the function each points to, and
// order), the five functions (name and what each means when it is the likely one), the answer scale (0 = not endorsed;
// above 0 is endorsed and adds to the severity; «لا ينطبق» is always offered), the instructions, how many endorsed
// questions make a function «likely», and the ages. Changes apply to new evaluations; a deleted question stays on the
// evaluations that answered it.
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import axios from "axios";
import { functionColor } from "./qfba";

const { t, locale } = useI18n();
const toast = useToast();

const loading = ref(true);
const tab = ref("questions");
const questions = ref([]);
const functions = ref([]);
const errors = ref({});
const saving = ref(false);

const dialog = ref(false);
const form = ref(null);
const deleteTarget = ref(null);
const functionForm = ref([]);
const optionForm = ref([]);
const general = ref({ instructions: "", instructions_en: "", clear_function_from: 4, from_months: null, to_months: null });

const fnName = (fn) => (locale.value === "en" && fn?.name_en ? fn.name_en : fn?.name ?? "");
const functionById = computed(() => Object.fromEntries(functions.value.map((fn) => [fn.id, fn])));
const functionOptions = computed(() => functions.value.map((fn) => ({ value: fn.id, label: `${fn.name} — ${fn.name_en ?? ""}` })));

function apply(data) {
  questions.value = data.questions ?? [];
  functions.value = data.functions ?? [];
  functionForm.value = functions.value.map((fn) => ({ id: fn.id, key: fn.key, name: fn.name, name_en: fn.name_en ?? "", description: fn.description ?? "", description_en: fn.description_en ?? "" }));
  optionForm.value = (data.options ?? []).map((option) => ({ value: option.value, label: option.label, label_en: option.label_en ?? "" }));
  general.value = {
    instructions: data.instructions ?? "",
    instructions_en: data.instructions_en ?? "",
    clear_function_from: data.clear_function_from ?? 4,
    from_months: data.age_range?.from_months ?? null,
    to_months: data.age_range?.to_months ?? null,
  };
}

async function load() {
  loading.value = true;
  try {
    apply((await axios.get("/api/qfba-settings")).data.data);
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

const nextOrder = () => Math.max(0, ...questions.value.map((q) => Number(q.display_order) || 0)) + 1;

function openNew() {
  errors.value = {};
  form.value = { id: null, text: "", text_en: "", function_id: functions.value[0]?.id ?? null, display_order: nextOrder() };
  dialog.value = true;
}

function openEdit(question) {
  errors.value = {};
  form.value = { id: question.id, text: question.text, text_en: question.text_en ?? "", function_id: question.function_id, display_order: question.display_order };
  dialog.value = true;
}

async function saveQuestion() {
  const payload = { text: form.value.text, text_en: form.value.text_en || null, function_id: form.value.function_id, display_order: form.value.display_order };
  const ok = await run(() => (form.value.id
    ? axios.put(`/api/qfba-settings/questions/${form.value.id}`, payload)
    : axios.post("/api/qfba-settings/questions", payload)));
  if (ok) dialog.value = false;
}

async function removeQuestion() {
  const question = deleteTarget.value;
  deleteTarget.value = null;
  await run(() => axios.delete(`/api/qfba-settings/questions/${question.id}`));
}

const saveFunctions = () => run(() => axios.put("/api/qfba-settings/functions", { functions: functionForm.value }));

function addOption() {
  const next = Math.max(-1, ...optionForm.value.map((option) => Number(option.value))) + 1;
  optionForm.value.push({ value: next, label: "", label_en: "" });
}
const saveOptions = () => run(() => axios.put("/api/qfba-settings/options", { options: optionForm.value }));
const saveGeneral = () => run(() => axios.put("/api/qfba-settings/general", general.value));

onMounted(load);
</script>

<template>
  <div class="page qs-page">
    <Toast />
    <header>
      <h1 class="page-title">{{ $t("qfba.settings_title") }}</h1>
      <p class="qs-hint">{{ $t("qfba.settings_lead") }}</p>
    </header>

    <div v-if="loading" class="qs-state"><ProgressSpinner style="width: 40px; height: 40px" /></div>

    <Tabs v-else v-model:value="tab">
      <TabList>
        <Tab value="questions"><i class="pi pi-list-check" aria-hidden="true" /> {{ $t("qfba.tab_questions") }} ({{ questions.length }})</Tab>
        <Tab value="functions"><i class="pi pi-sitemap" aria-hidden="true" /> {{ $t("qfba.tab_functions") }}</Tab>
        <Tab value="scale"><i class="pi pi-sliders-h" aria-hidden="true" /> {{ $t("qfba.tab_scale") }}</Tab>
        <Tab value="general"><i class="pi pi-info-circle" aria-hidden="true" /> {{ $t("qfba.tab_general") }}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="questions">
          <div class="qs-bar">
            <Button v-can="'qfba question create'" icon="pi pi-plus" :label="$t('qfba.add_question')" @click="openNew" />
          </div>
          <DataTable :value="questions" dataKey="id" responsiveLayout="scroll">
            <template #empty>{{ $t("qfba.no_questions") }}</template>
            <Column field="number" header="#" style="width: 3.5rem" />
            <Column :header="$t('qfba.question')">
              <template #body="{ data }">
                <span class="qs-text">{{ data.text }}</span>
                <small v-if="data.text_en" class="qs-en" dir="ltr">{{ data.text_en }}</small>
              </template>
            </Column>
            <Column :header="$t('qfba.function')" style="width: 12rem">
              <template #body="{ data }">
                <span class="qs-fn" :style="{ '--tone': functionColor(functionById[data.function_id]?.key) }">{{ fnName(functionById[data.function_id]) }}</span>
              </template>
            </Column>
            <Column field="display_order" :header="$t('qfba.display_order')" style="width: 6rem" />
            <Column style="width: 8rem">
              <template #body="{ data }">
                <div class="table-actions">
                  <Button v-can="'qfba question edit'" icon="pi pi-pencil" rounded severity="info" variant="outlined"
                    v-tooltip.top="$t('edit')" :aria-label="$t('edit')" @click="openEdit(data)" />
                  <Button v-can="'qfba question delete'" icon="pi pi-trash" rounded severity="danger" variant="outlined"
                    v-tooltip.top="$t('delete')" :aria-label="$t('delete')" @click="deleteTarget = data" />
                </div>
              </template>
            </Column>
          </DataTable>
        </TabPanel>

        <TabPanel value="functions">
          <form class="qs-form" @submit.prevent="saveFunctions">
            <p class="qs-hint">{{ $t("qfba.functions_hint") }}</p>
            <section v-for="fn in functionForm" :key="fn.id" class="qs-box" :style="{ '--tone': functionColor(fn.key) }">
              <div class="qs-two">
                <div class="qs-field">
                  <label :for="'qs-fn-' + fn.id">{{ $t("qfba.name_ar") }}</label>
                  <InputText :id="'qs-fn-' + fn.id" v-model="fn.name" required />
                </div>
                <div class="qs-field">
                  <label :for="'qs-fn-en-' + fn.id">{{ $t("qfba.name_en") }}</label>
                  <InputText :id="'qs-fn-en-' + fn.id" v-model="fn.name_en" dir="ltr" />
                </div>
                <div class="qs-field">
                  <label :for="'qs-fd-' + fn.id">{{ $t("qfba.meaning_ar") }}</label>
                  <Textarea :id="'qs-fd-' + fn.id" v-model="fn.description" rows="3" autoResize />
                </div>
                <div class="qs-field">
                  <label :for="'qs-fd-en-' + fn.id">{{ $t("qfba.meaning_en") }}</label>
                  <Textarea :id="'qs-fd-en-' + fn.id" v-model="fn.description_en" rows="3" autoResize dir="ltr" />
                </div>
              </div>
            </section>
            <div class="qs-actions">
              <Button v-can="'qfba question edit'" type="submit" :label="$t('save')" icon="pi pi-check" :loading="saving" />
            </div>
          </form>
        </TabPanel>

        <TabPanel value="scale">
          <form class="qs-form" @submit.prevent="saveOptions">
            <p class="qs-hint">{{ $t("qfba.scale_hint") }}</p>
            <div v-for="(option, index) in optionForm" :key="index" class="qs-option">
              <div class="qs-field qs-num">
                <label :for="'qs-ov-' + index">{{ $t("qfba.value") }}</label>
                <InputNumber :inputId="'qs-ov-' + index" v-model="option.value" :min="0" :max="10" :useGrouping="false" />
              </div>
              <div class="qs-field">
                <label :for="'qs-ol-' + index">{{ $t("qfba.label_ar") }}</label>
                <InputText :id="'qs-ol-' + index" v-model="option.label" required />
              </div>
              <div class="qs-field">
                <label :for="'qs-ole-' + index">{{ $t("qfba.label_en") }}</label>
                <InputText :id="'qs-ole-' + index" v-model="option.label_en" dir="ltr" />
              </div>
              <Button type="button" icon="pi pi-trash" rounded severity="danger" variant="text" :disabled="optionForm.length <= 2"
                v-tooltip.top="$t('delete')" :aria-label="$t('delete')" @click="optionForm.splice(index, 1)" />
            </div>
            <small v-if="errors.options" class="qs-error">{{ errors.options[0] }}</small>
            <div class="qs-actions">
              <Button type="button" icon="pi pi-plus" :label="$t('qfba.add_option')" severity="secondary" variant="outlined" @click="addOption" />
              <Button v-can="'qfba question edit'" type="submit" :label="$t('save')" icon="pi pi-check" :loading="saving" />
            </div>
          </form>
        </TabPanel>

        <TabPanel value="general">
          <form class="qs-form" @submit.prevent="saveGeneral">
            <div class="qs-two">
              <div class="qs-field">
                <label for="qs-ins">{{ $t("qfba.instructions_ar") }}</label>
                <Textarea id="qs-ins" v-model="general.instructions" rows="4" autoResize />
              </div>
              <div class="qs-field">
                <label for="qs-ins-en">{{ $t("qfba.instructions_en") }}</label>
                <Textarea id="qs-ins-en" v-model="general.instructions_en" rows="4" autoResize dir="ltr" />
              </div>
            </div>
            <div class="qs-row">
              <div class="qs-field qs-num">
                <label for="qs-clear">{{ $t("qfba.clear_from") }}</label>
                <InputNumber inputId="qs-clear" v-model="general.clear_function_from" :min="1" :max="100" :useGrouping="false" />
              </div>
              <div class="qs-field qs-num">
                <label for="qs-age-from">{{ $t("mchat.age_from") }}</label>
                <InputNumber inputId="qs-age-from" v-model="general.from_months" :min="0" :max="1200" :useGrouping="false" />
              </div>
              <div class="qs-field qs-num">
                <label for="qs-age-to">{{ $t("mchat.age_to") }}</label>
                <InputNumber inputId="qs-age-to" v-model="general.to_months" :min="0" :max="1200" :useGrouping="false" :invalid="!!errors.to_months" />
                <small v-if="errors.to_months" class="qs-error">{{ errors.to_months[0] }}</small>
              </div>
            </div>
            <small class="qs-hint">{{ $t("qfba.clear_from_hint") }} {{ $t("mchat.age_hint") }}</small>
            <div class="qs-actions">
              <Button v-can="'qfba question edit'" type="submit" :label="$t('save')" icon="pi pi-check" :loading="saving" />
            </div>
          </form>
        </TabPanel>
      </TabPanels>
    </Tabs>

    <Dialog v-model:visible="dialog" :header="form?.id ? $t('qfba.edit_question') : $t('qfba.add_question')" modal
      :style="{ width: '680px' }" :breakpoints="{ '720px': '95vw' }">
      <form v-if="form" class="qs-form" @submit.prevent="saveQuestion">
        <div class="qs-field">
          <label for="qs-q-text">{{ $t("qfba.question_ar") }}</label>
          <Textarea id="qs-q-text" v-model="form.text" rows="2" autoResize required :invalid="!!errors.text" />
          <small v-if="errors.text" class="qs-error">{{ errors.text[0] }}</small>
        </div>
        <div class="qs-field">
          <label for="qs-q-en">{{ $t("qfba.question_en") }}</label>
          <Textarea id="qs-q-en" v-model="form.text_en" rows="2" autoResize dir="ltr" />
        </div>
        <div class="qs-row">
          <div class="qs-field qs-grow">
            <label for="qs-q-fn">{{ $t("qfba.function") }}</label>
            <Select inputId="qs-q-fn" v-model="form.function_id" :options="functionOptions" optionLabel="label" optionValue="value" :invalid="!!errors.function_id" />
          </div>
          <div class="qs-field qs-num">
            <label for="qs-q-order">{{ $t("qfba.display_order") }}</label>
            <InputNumber inputId="qs-q-order" v-model="form.display_order" :min="0" :useGrouping="false" />
          </div>
        </div>
        <div class="qs-actions">
          <Button type="button" :label="$t('cancel')" severity="secondary" variant="text" @click="dialog = false" />
          <Button type="submit" :label="$t('save')" icon="pi pi-check" :loading="saving" />
        </div>
      </form>
    </Dialog>

    <Dialog :visible="!!deleteTarget" :header="$t('delete')" modal :style="{ width: '440px' }" @update:visible="deleteTarget = null">
      <p>{{ $t("qfba.delete_question_confirm") }}</p>
      <p><b>{{ deleteTarget?.text }}</b></p>
      <template #footer>
        <Button :label="$t('no')" icon="pi pi-times" variant="text" severity="secondary" @click="deleteTarget = null" />
        <Button :label="$t('yes')" icon="pi pi-check" severity="danger" @click="removeQuestion" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.qs-page { display: grid; gap: 1rem; }
.qs-page h1 { margin: 0; }
.qs-hint { margin: .25rem 0 0; color: var(--sawa-muted, #64748b); font-size: .88rem; line-height: 1.7; }
.qs-state { display: grid; place-items: center; padding: 3rem; }
.qs-bar { display: flex; justify-content: flex-end; margin-bottom: .75rem; }
.qs-text { display: block; font-weight: 600; line-height: 1.7; }
.qs-en { display: block; margin-top: .15rem; color: var(--sawa-muted, #64748b); text-align: start; }
.qs-fn { padding: .15rem .55rem; border-inline-start: 4px solid var(--tone); border-radius: 6px; background: #f8fafc; font-weight: 700; }
.qs-form { display: grid; gap: 1rem; }
.qs-box { padding: 1rem 1.15rem; border: 1px solid var(--sawa-border, #e2e8f0); border-inline-start: 6px solid var(--tone); border-radius: 14px; background: #fff; }
.qs-two { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr)); gap: .85rem 1rem; }
.qs-row { display: flex; flex-wrap: wrap; gap: 1rem; }
.qs-field { display: grid; gap: .4rem; align-content: start; }
.qs-field label { font-weight: 700; }
.qs-num { width: 11rem; }
.qs-grow { flex: 1 1 16rem; }
.qs-option { display: grid; grid-template-columns: 8rem minmax(0, 1fr) minmax(0, 1fr) auto; align-items: end; gap: .75rem; }
.qs-option .qs-num { width: auto; }
.qs-error { color: #dc2626; }
.qs-actions { display: flex; justify-content: flex-end; gap: .5rem; }
@media (max-width: 640px) {
  .qs-option { grid-template-columns: 1fr 1fr; }
}
</style>
