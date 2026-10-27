<script setup>
// «إعدادات M-CHAT-R» (/mchat-settings): the checklist's questions (text, example, which answer is the risk point,
// order), its risk levels (where low and medium end; high is everything above) with the specialist's recommendation
// and the parent's message, the answering instructions and the ages it is meant for. Changes apply to new
// evaluations; a deleted question stays on the evaluations that answered it.
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import axios from "axios";
import { RISK_SEVERITY, levelRange } from "./mchat";

const { t } = useI18n();
const toast = useToast();

const loading = ref(true);
const tab = ref("questions");
const questions = ref([]);
const levels = ref([]);
const errors = ref({});

// Questions
const dialog = ref(false);
const saving = ref(false);
const form = ref(null);
const deleteTarget = ref(null);
const RISK_OPTIONS = computed(() => [
  { value: false, label: t("mchat.risk_answer_no") },
  { value: true, label: t("mchat.risk_answer_yes") },
]);

// Levels: where low and medium end, and each level's texts.
const levelForm = ref({ low_to: 2, medium_to: 7, levels: {} });
const levelRows = computed(() => {
  const { low_to: lowTo, medium_to: mediumTo } = levelForm.value;
  return [
    { key: "low", from: 0, to: lowTo, editTo: "low_to" },
    { key: "medium", from: (lowTo ?? 0) + 1, to: mediumTo, editTo: "medium_to" },
    { key: "high", from: (mediumTo ?? 0) + 1, to: null },
  ];
});

// Instructions and ages
const general = ref({ instructions: "", from_months: null, to_months: null });

function apply(data) {
  questions.value = data.questions ?? [];
  levels.value = data.levels ?? [];
  const byKey = Object.fromEntries(levels.value.map((level) => [level.key, level]));
  levelForm.value = {
    low_to: byKey.low?.to ?? 2,
    medium_to: byKey.medium?.to ?? 7,
    levels: Object.fromEntries(["low", "medium", "high"].map((key) => [key, {
      recommendation: byKey[key]?.recommendation ?? "",
      parent_message: byKey[key]?.parent_message ?? "",
    }])),
  };
  general.value = {
    instructions: data.instructions ?? "",
    from_months: data.age_range?.from_months ?? null,
    to_months: data.age_range?.to_months ?? null,
  };
}

async function load() {
  loading.value = true;
  try {
    apply((await axios.get("/api/mchat-settings")).data.data);
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

const nextOrder = () => Math.max(0, ...questions.value.map((q) => Number(q.display_order) || 0)) + 1;

function openNew() {
  errors.value = {};
  form.value = { id: null, text: "", example: "", yes_is_risk: false, display_order: nextOrder() };
  dialog.value = true;
}

function openEdit(question) {
  errors.value = {};
  form.value = { id: question.id, text: question.text, example: question.example ?? "", yes_is_risk: question.yes_is_risk, display_order: question.display_order };
  dialog.value = true;
}

async function saveQuestion() {
  saving.value = true;
  errors.value = {};
  const payload = { text: form.value.text, example: form.value.example || null, yes_is_risk: form.value.yes_is_risk, display_order: form.value.display_order };
  try {
    const { data } = form.value.id
      ? await axios.put(`/api/mchat-settings/questions/${form.value.id}`, payload)
      : await axios.post("/api/mchat-settings/questions", payload);
    dialog.value = false;
    done(data.data);
  } catch (error) {
    fail(error);
  } finally {
    saving.value = false;
  }
}

async function removeQuestion() {
  const question = deleteTarget.value;
  deleteTarget.value = null;
  try {
    done((await axios.delete(`/api/mchat-settings/questions/${question.id}`)).data.data);
  } catch (error) {
    fail(error);
  }
}

async function saveLevels() {
  saving.value = true;
  errors.value = {};
  try {
    done((await axios.put("/api/mchat-settings/levels", levelForm.value)).data.data);
  } catch (error) {
    fail(error);
  } finally {
    saving.value = false;
  }
}

async function saveGeneral() {
  saving.value = true;
  errors.value = {};
  try {
    done((await axios.put("/api/mchat-settings/general", general.value)).data.data);
  } catch (error) {
    fail(error);
  } finally {
    saving.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div class="page ms-page">
    <Toast />
    <header class="ms-head">
      <div>
        <h1 class="page-title">{{ $t("mchat.settings_title") }}</h1>
        <p class="ms-hint">{{ $t("mchat.settings_lead") }}</p>
      </div>
    </header>

    <div v-if="loading" class="ms-state"><ProgressSpinner style="width: 40px; height: 40px" /></div>

    <Tabs v-else v-model:value="tab">
      <TabList>
        <Tab value="questions"><i class="pi pi-list-check" aria-hidden="true" /> {{ $t("mchat.tab_questions") }} ({{ questions.length }})</Tab>
        <Tab value="levels"><i class="pi pi-chart-bar" aria-hidden="true" /> {{ $t("mchat.tab_levels") }}</Tab>
        <Tab value="general"><i class="pi pi-info-circle" aria-hidden="true" /> {{ $t("mchat.tab_general") }}</Tab>
      </TabList>
      <TabPanels>
        <!-- Questions -->
        <TabPanel value="questions">
          <div class="ms-bar">
            <Button v-can="'mchat question create'" icon="pi pi-plus" :label="$t('mchat.add_question')" @click="openNew" />
          </div>
          <DataTable :value="questions" dataKey="id" responsiveLayout="scroll">
            <template #empty>{{ $t("mchat.no_questions") }}</template>
            <Column field="number" header="#" style="width: 3.5rem" />
            <Column :header="$t('mchat.question')">
              <template #body="{ data }">
                <span class="ms-text">{{ data.text }}</span>
                <small v-if="data.example" class="ms-example">{{ data.example }}</small>
              </template>
            </Column>
            <Column :header="$t('mchat.point')" style="width: 9rem">
              <template #body="{ data }">
                <Tag :severity="data.yes_is_risk ? 'warn' : 'secondary'"
                  :value="data.yes_is_risk ? $t('mchat.risk_answer_short_yes') : $t('mchat.risk_answer_short_no')" />
              </template>
            </Column>
            <Column field="display_order" :header="$t('mchat.display_order')" style="width: 6rem" />
            <Column style="width: 8rem">
              <template #body="{ data }">
                <div class="table-actions">
                  <Button v-can="'mchat question edit'" icon="pi pi-pencil" rounded severity="info" variant="outlined"
                    v-tooltip.top="$t('edit')" :aria-label="$t('edit')" @click="openEdit(data)" />
                  <Button v-can="'mchat question delete'" icon="pi pi-trash" rounded severity="danger" variant="outlined"
                    v-tooltip.top="$t('delete')" :aria-label="$t('delete')" @click="deleteTarget = data" />
                </div>
              </template>
            </Column>
          </DataTable>
        </TabPanel>

        <!-- Risk levels -->
        <TabPanel value="levels">
          <form class="ms-form" @submit.prevent="saveLevels">
            <p class="ms-hint">{{ $t("mchat.levels_hint", { count: questions.length }) }}</p>
            <section v-for="row in levelRows" :key="row.key" class="ms-level" :class="'is-' + row.key">
              <header class="ms-level-head">
                <Tag :severity="RISK_SEVERITY[row.key]" :value="$t('mchat.risk_' + row.key)" />
                <span class="ltr ms-range">{{ levelRange(row) }}</span>
              </header>
              <div class="ms-row">
                <div class="ms-field ms-num">
                  <label>{{ $t("mchat.level_from") }}</label>
                  <InputNumber :modelValue="row.from" disabled :useGrouping="false" />
                </div>
                <div class="ms-field ms-num">
                  <label :for="'ms-to-' + row.key">{{ $t("mchat.level_to") }}</label>
                  <InputNumber v-if="row.editTo" :inputId="'ms-to-' + row.key" v-model="levelForm[row.editTo]" :min="row.from" :max="1000"
                    :useGrouping="false" :invalid="!!errors[row.editTo]" />
                  <InputText v-else :modelValue="$t('mchat.and_above')" disabled />
                  <small v-if="row.editTo && errors[row.editTo]" class="ms-error">{{ errors[row.editTo][0] }}</small>
                </div>
              </div>
              <div class="ms-field">
                <label :for="'ms-rec-' + row.key">{{ $t("mchat.recommendation") }}</label>
                <Textarea :id="'ms-rec-' + row.key" v-model="levelForm.levels[row.key].recommendation" rows="3" autoResize />
              </div>
              <div class="ms-field">
                <label :for="'ms-pm-' + row.key">{{ $t("mchat.parent_message") }}</label>
                <Textarea :id="'ms-pm-' + row.key" v-model="levelForm.levels[row.key].parent_message" rows="2" autoResize />
              </div>
            </section>
            <div class="ms-actions">
              <Button v-can="'mchat question edit'" type="submit" :label="$t('save')" icon="pi pi-check" :loading="saving" />
            </div>
          </form>
        </TabPanel>

        <!-- Instructions and ages -->
        <TabPanel value="general">
          <form class="ms-form" @submit.prevent="saveGeneral">
            <div class="ms-field">
              <label for="ms-instructions">{{ $t("mchat.instructions_label") }}</label>
              <Textarea id="ms-instructions" v-model="general.instructions" rows="4" autoResize />
            </div>
            <div class="ms-row">
              <div class="ms-field ms-num">
                <label for="ms-age-from">{{ $t("mchat.age_from") }}</label>
                <InputNumber inputId="ms-age-from" v-model="general.from_months" :min="0" :max="1200" :useGrouping="false" />
              </div>
              <div class="ms-field ms-num">
                <label for="ms-age-to">{{ $t("mchat.age_to") }}</label>
                <InputNumber inputId="ms-age-to" v-model="general.to_months" :min="0" :max="1200" :useGrouping="false" :invalid="!!errors.to_months" />
                <small v-if="errors.to_months" class="ms-error">{{ errors.to_months[0] }}</small>
              </div>
            </div>
            <small class="ms-hint">{{ $t("mchat.age_hint") }}</small>
            <div class="ms-actions">
              <Button v-can="'mchat question edit'" type="submit" :label="$t('save')" icon="pi pi-check" :loading="saving" />
            </div>
          </form>
        </TabPanel>
      </TabPanels>
    </Tabs>

    <Dialog v-model:visible="dialog" :header="form?.id ? $t('mchat.edit_question') : $t('mchat.add_question')" modal
      :style="{ width: '640px' }" :breakpoints="{ '700px': '95vw' }">
      <form v-if="form" class="ms-form" @submit.prevent="saveQuestion">
        <div class="ms-field">
          <label for="ms-q-text">{{ $t("mchat.question_text") }}</label>
          <Textarea id="ms-q-text" v-model="form.text" rows="2" autoResize required :invalid="!!errors.text" />
          <small v-if="errors.text" class="ms-error">{{ errors.text[0] }}</small>
        </div>
        <div class="ms-field">
          <label for="ms-q-example">{{ $t("mchat.example") }}</label>
          <Textarea id="ms-q-example" v-model="form.example" rows="2" autoResize />
        </div>
        <div class="ms-field">
          <label>{{ $t("mchat.risk_answer") }}</label>
          <SelectButton v-model="form.yes_is_risk" :options="RISK_OPTIONS" optionLabel="label" optionValue="value" :allowEmpty="false" />
        </div>
        <div class="ms-field ms-num">
          <label for="ms-q-order">{{ $t("mchat.display_order") }}</label>
          <InputNumber inputId="ms-q-order" v-model="form.display_order" :min="0" :useGrouping="false" />
        </div>
        <div class="ms-actions">
          <Button type="button" :label="$t('cancel')" severity="secondary" variant="text" @click="dialog = false" />
          <Button type="submit" :label="$t('save')" icon="pi pi-check" :loading="saving" />
        </div>
      </form>
    </Dialog>

    <Dialog :visible="!!deleteTarget" :header="$t('delete')" modal :style="{ width: '440px' }" @update:visible="deleteTarget = null">
      <p>{{ $t("mchat.delete_question_confirm") }}</p>
      <p><b>{{ deleteTarget?.text }}</b></p>
      <template #footer>
        <Button :label="$t('no')" icon="pi pi-times" variant="text" severity="secondary" @click="deleteTarget = null" />
        <Button :label="$t('yes')" icon="pi pi-check" severity="danger" @click="removeQuestion" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.ms-page { display: grid; gap: 1rem; }
.ms-head h1 { margin: 0; }
.ms-hint { margin: .25rem 0 0; color: var(--sawa-muted, #64748b); font-size: .88rem; line-height: 1.7; }
.ms-state { display: grid; place-items: center; padding: 3rem; }
.ms-bar { display: flex; justify-content: flex-end; margin-bottom: .75rem; }
.ms-text { display: block; font-weight: 600; line-height: 1.7; }
.ms-example { display: block; margin-top: .15rem; color: var(--sawa-muted, #64748b); }
.ms-form { display: grid; gap: 1rem; }
.ms-row { display: flex; flex-wrap: wrap; gap: 1rem; }
.ms-field { display: grid; gap: .4rem; }
.ms-field label { font-weight: 700; }
.ms-num { width: 11rem; }
.ms-level { display: grid; gap: .85rem; padding: 1rem 1.15rem; border: 1px solid var(--sawa-border, #e2e8f0); border-inline-start: 6px solid var(--tone); border-radius: 14px; background: #fff; }
.ms-level.is-low { --tone: #16a34a; }
.ms-level.is-medium { --tone: #d97706; }
.ms-level.is-high { --tone: #dc2626; }
.ms-level-head { display: flex; align-items: center; gap: .75rem; }
.ms-range { font-weight: 800; color: var(--tone); }
.ms-error { color: #dc2626; }
.ms-actions { display: flex; justify-content: flex-end; gap: .5rem; }
</style>
