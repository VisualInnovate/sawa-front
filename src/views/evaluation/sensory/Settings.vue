<script setup>
// «إعدادات الملف الحسي» (/sensory-settings), per form (infant, toddler, child): the items' wording in Arabic and English
// (an item translated by the system, not on the academy's form, is marked until someone saves it), the sections /
// quadrants / factors (names, what a score less / more than others means and its intervention focus), the cut scores
// of each age band (from the highest scores down; each band starts right below the one before), and the form's name,
// instructions and ages. Items are not added, removed or moved between quadrants: the cut scores are normed on the forms
// as they are. Saved evaluations keep the scores they were saved with.
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import axios from "axios";
import { LEVEL_TONE, QUADRANT_COLOR, formName, levelLabel, scaleName } from "./sensory";

const { t, locale } = useI18n();
const toast = useToast();
const lang = computed(() => (locale.value === "en" ? "en" : "ar"));

const loading = ref(true);
const saving = ref(false);
const errors = ref({});
const forms = ref([]);
const levelLabels = ref({});
const formId = ref(null);
const tab = ref("items");
const general = ref({ from_months: null, to_months: null });
const formEdit = ref(null);
const itemDialog = ref(null);
const scaleDialog = ref(null);
const cutForms = ref({});

const form = computed(() => forms.value.find((row) => row.id === formId.value) ?? null);
const sections = computed(() => Object.fromEntries((form.value?.scales ?? []).filter((s) => s.kind === "section").map((s) => [s.id, s])));
const scales = computed(() => form.value?.scales ?? []);
const scaledScales = computed(() => scales.value.filter((scale) => scale.cuts.length));
const quadrantsOf = (item) => scales.value.filter((scale) => scale.kind === "quadrant" && scale.item_ids.includes(item.id));
const translatedCount = computed(() => (form.value?.items ?? []).filter((item) => item.translated).length);

function apply(data) {
  forms.value = data.forms ?? [];
  levelLabels.value = data.level_labels ?? {};
  general.value = { from_months: data.age_range?.from_months ?? null, to_months: data.age_range?.to_months ?? null };
  if (!forms.value.some((row) => row.id === formId.value)) formId.value = forms.value[0]?.id ?? null;
  resetForm();
}

function resetForm() {
  const row = form.value;
  formEdit.value = row ? { name: row.name, name_en: row.name_en ?? "", instructions: row.instructions ?? "", from_months: row.from_months, to_months: row.to_months } : null;
  cutForms.value = Object.fromEntries(scales.value.flatMap((scale) => scale.cuts.map((cut) => [cut.id, {
    from_months: cut.from_months, to_months: cut.to_months,
    bands: Object.fromEntries((row?.level_keys ?? []).map((key) => [key, cut.bands?.[key] ? { min: Math.min(...cut.bands[key]), max: Math.max(...cut.bands[key]) } : { min: null, max: null }])),
  }])));
}

function pickForm(id) {
  formId.value = id;
  resetForm();
}

async function load() {
  loading.value = true;
  try {
    apply((await axios.get("/api/sensory-profile-settings")).data.data);
  } catch (error) {
    fail(error);
  } finally {
    loading.value = false;
  }
}

function fail(error) {
  errors.value = error.response?.data?.errors ?? {};
  const detail = Object.values(errors.value).flat().join(" ") || error.response?.data?.message || t("request_failed_retry");
  toast.add({ severity: "error", summary: t("error"), detail, life: 6000 });
}

async function run(request) {
  saving.value = true;
  errors.value = {};
  try {
    apply((await request()).data.data);
    toast.add({ severity: "success", summary: t("success_message"), detail: t("successful"), life: 3000 });
    return true;
  } catch (error) {
    fail(error);
    return false;
  } finally {
    saving.value = false;
  }
}

const openItem = (item) => { errors.value = {}; itemDialog.value = { id: item.id, number: item.number, text: item.text, text_en: item.text_en ?? "", specify: item.specify }; };
async function saveItem() {
  const row = itemDialog.value;
  if (await run(() => axios.put(`/api/sensory-profile-settings/items/${row.id}`, { text: row.text, text_en: row.text_en || null, specify: row.specify }))) itemDialog.value = null;
}

const openScale = (scale) => {
  errors.value = {};
  scaleDialog.value = { ...scale, name_en: scale.name_en ?? "", group_name: scale.group_name ?? "", less_text: scale.less_text ?? "", less_text_en: scale.less_text_en ?? "",
    more_text: scale.more_text ?? "", more_text_en: scale.more_text_en ?? "", note: scale.note ?? "", note_en: scale.note_en ?? "" };
};
async function saveScale() {
  const row = scaleDialog.value;
  const payload = Object.fromEntries(["name", "name_en", "group_name", "less_text", "less_text_en", "more_text", "more_text_en", "note", "note_en"]
    .map((key) => [key, String(row[key] ?? "").trim() || null]));
  if (await run(() => axios.put(`/api/sensory-profile-settings/scales/${row.id}`, payload))) scaleDialog.value = null;
}

function saveCut(cut) {
  const row = cutForms.value[cut.id];
  const bands = Object.fromEntries(Object.entries(row.bands).map(([key, band]) => [key,
    band.min === null || band.max === null || band.min === "" || band.max === "" ? null : [Number(band.min), Number(band.max)]]));
  return run(() => axios.put(`/api/sensory-profile-settings/cuts/${cut.id}`, { from_months: row.from_months, to_months: row.to_months, bands }));
}

const saveForm = () => run(() => axios.put(`/api/sensory-profile-settings/forms/${formId.value}`, formEdit.value));
const saveGeneral = () => run(() => axios.put("/api/sensory-profile-settings/general", general.value));
const kindLabel = (kind) => t("sensory.kind_" + kind);
const cutAges = (cut) => (cut.from_months == null && cut.to_months == null ? t("sensory.all_ages") : t("sensory.months_range", { from: cut.from_months ?? 0, to: cut.to_months ?? "…" }));

onMounted(load);
</script>

<template>
  <div class="page ss-page">
    <Toast />
    <header>
      <h1 class="page-title">{{ $t("sensory.settings_title") }}</h1>
      <p class="ss-hint">{{ $t("sensory.settings_lead") }}</p>
    </header>

    <div v-if="loading" class="ss-state"><ProgressSpinner style="width: 40px; height: 40px" /></div>

    <template v-else-if="form">
      <div class="ss-forms">
        <button v-for="row in forms" :key="row.id" type="button" class="ss-form-btn" :class="{ 'is-picked': row.id === formId }" :aria-pressed="row.id === formId" @click="pickForm(row.id)">
          {{ formName(row, lang) }} <small>{{ $t("sensory.items_count", { n: row.items.length }) }}</small>
        </button>
      </div>

      <Tabs v-model:value="tab">
        <TabList>
          <Tab value="items"><i class="pi pi-list" aria-hidden="true" /> {{ $t("sensory.tab_items") }} ({{ form.items.length }})</Tab>
          <Tab value="scales"><i class="pi pi-th-large" aria-hidden="true" /> {{ $t("sensory.tab_scales") }}</Tab>
          <Tab value="cuts"><i class="pi pi-sliders-h" aria-hidden="true" /> {{ $t("sensory.tab_cuts") }}</Tab>
          <Tab value="general"><i class="pi pi-info-circle" aria-hidden="true" /> {{ $t("sensory.tab_general") }}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="items">
            <Message v-if="translatedCount" severity="warn" :closable="false" class="mb-3">{{ $t("sensory.translated_hint", { n: translatedCount }) }}</Message>
            <DataTable :value="form.items" dataKey="id" responsiveLayout="scroll" size="small">
              <Column field="number" header="#" style="width: 3.5rem" />
              <Column :header="$t('sensory.section')" style="width: 4rem">
                <template #body="{ data }"><b>{{ sections[data.section_id]?.code }}</b></template>
              </Column>
              <Column :header="$t('sensory.item')">
                <template #body="{ data }">
                  <span class="ss-text">{{ data.text }}</span>
                  <small v-if="data.text_en" class="ss-en" dir="ltr">{{ data.text_en }}</small>
                  <span class="ss-badges">
                    <Tag v-if="data.translated" severity="warn" :value="$t('sensory.translated')" />
                    <Tag v-if="data.specify" severity="info" :value="$t('sensory.specify_flag')" />
                    <Tag v-if="data.threshold" severity="secondary" :value="data.threshold" />
                  </span>
                </template>
              </Column>
              <Column :header="$t('sensory.quadrant')" style="width: 10rem">
                <template #body="{ data }">
                  <span v-for="q in quadrantsOf(data)" :key="q.code" class="ss-q" :style="{ '--q': QUADRANT_COLOR[q.code] }">{{ scaleName(q, lang) }}</span>
                </template>
              </Column>
              <Column style="width: 4rem">
                <template #body="{ data }">
                  <Button v-can="'sensory question edit'" icon="pi pi-pencil" rounded severity="info" variant="outlined"
                    v-tooltip.top="$t('edit')" :aria-label="$t('edit')" @click="openItem(data)" />
                </template>
              </Column>
            </DataTable>
          </TabPanel>

          <TabPanel value="scales">
            <DataTable :value="scales" dataKey="id" responsiveLayout="scroll" size="small">
              <Column :header="$t('sensory.kind')" style="width: 7rem">
                <template #body="{ data }">{{ kindLabel(data.kind) }}</template>
              </Column>
              <Column field="code" header="#" style="width: 4rem" />
              <Column :header="$t('sensory.name')">
                <template #body="{ data }">
                  <b>{{ data.name }}</b> <small v-if="data.name_en" class="ss-en" dir="ltr">{{ data.name_en }}</small>
                  <small v-if="data.group_name" class="ss-group">{{ data.group_name }}</small>
                </template>
              </Column>
              <Column :header="$t('sensory.meaning')">
                <template #body="{ data }">
                  <small v-if="data.less_text" class="ss-meaning"><b>{{ $t("sensory.less_than_others") }}:</b> {{ data.less_text }}</small>
                  <small v-if="data.more_text" class="ss-meaning"><b>{{ $t("sensory.more_than_others") }}:</b> {{ data.more_text }}</small>
                  <small v-if="data.note" class="ss-meaning">{{ data.note }}</small>
                </template>
              </Column>
              <Column :header="$t('sensory.items_word')" style="width: 5rem">
                <template #body="{ data }">{{ data.kind === "threshold" ? (data.parts || []).join(" + ") : data.item_ids.length }}</template>
              </Column>
              <Column style="width: 4rem">
                <template #body="{ data }">
                  <Button v-can="'sensory question edit'" icon="pi pi-pencil" rounded severity="info" variant="outlined"
                    v-tooltip.top="$t('edit')" :aria-label="$t('edit')" @click="openScale(data)" />
                </template>
              </Column>
            </DataTable>
          </TabPanel>

          <TabPanel value="cuts">
            <p class="ss-hint">{{ $t("sensory.cuts_hint") }}</p>
            <section v-for="scale in scaledScales" :key="scale.id" class="ss-card">
              <h3>{{ kindLabel(scale.kind) }} · {{ scale.code }} · {{ scaleName(scale, lang) }}
                <small v-if="scale.kind !== 'threshold'">({{ $t("sensory.possible", { min: scale.item_ids.length, max: scale.item_ids.length * 5 }) }})</small></h3>
              <div v-for="cut in scale.cuts" :key="cut.id" class="ss-cut">
                <div class="ss-cut-ages">
                  <span>{{ cutAges(cut) }}</span>
                  <InputNumber v-model="cutForms[cut.id].from_months" :min="0" :placeholder="$t('sensory.from_months')" inputClass="ss-n" :aria-label="$t('sensory.from_months')" />
                  <InputNumber v-model="cutForms[cut.id].to_months" :min="0" :placeholder="$t('sensory.to_months')" inputClass="ss-n" :aria-label="$t('sensory.to_months')" />
                </div>
                <div class="ss-bands">
                  <div v-for="key in form.level_keys" :key="key" class="ss-band" :class="'is-' + LEVEL_TONE[key]">
                    <label>{{ levelLabel(levelLabels, key, lang) }}</label>
                    <div class="ss-band-inputs">
                      <InputNumber v-model="cutForms[cut.id].bands[key].max" :min="0" inputClass="ss-n" :aria-label="$t('sensory.band_max')" placeholder="—" />
                      <span>–</span>
                      <InputNumber v-model="cutForms[cut.id].bands[key].min" :min="0" inputClass="ss-n" :aria-label="$t('sensory.band_min')" placeholder="—" />
                    </div>
                  </div>
                </div>
                <Button v-can="'sensory question edit'" icon="pi pi-check" :label="$t('save')" size="small" :loading="saving" @click="saveCut(cut)" />
              </div>
            </section>
          </TabPanel>

          <TabPanel value="general">
            <section class="ss-card ss-grid">
              <h3 class="ss-wide">{{ formName(form, lang) }}</h3>
              <div class="ss-field"><label for="ss-fn">{{ $t("sensory.name") }}</label><InputText id="ss-fn" v-model="formEdit.name" /></div>
              <div class="ss-field"><label for="ss-fne">{{ $t("sensory.name_en") }}</label><InputText id="ss-fne" v-model="formEdit.name_en" dir="ltr" /></div>
              <div class="ss-field"><label for="ss-ff">{{ $t("sensory.form_from") }}</label><InputNumber inputId="ss-ff" v-model="formEdit.from_months" :min="0" /></div>
              <div class="ss-field"><label for="ss-ft">{{ $t("sensory.form_to") }}</label><InputNumber inputId="ss-ft" v-model="formEdit.to_months" :min="0" /></div>
              <div class="ss-field ss-wide"><label for="ss-fi">{{ $t("sensory.instructions") }}</label><Textarea id="ss-fi" v-model="formEdit.instructions" rows="4" autoResize /></div>
              <div class="ss-wide"><Button v-can="'sensory question edit'" icon="pi pi-check" :label="$t('save')" :loading="saving" @click="saveForm" /></div>
            </section>
            <section class="ss-card ss-grid">
              <h3 class="ss-wide">{{ $t("sensory.booking_ages") }}</h3>
              <p class="ss-hint ss-wide">{{ $t("sensory.booking_ages_hint") }}</p>
              <div class="ss-field"><label for="ss-gf">{{ $t("sensory.from_months") }}</label><InputNumber inputId="ss-gf" v-model="general.from_months" :min="0" /></div>
              <div class="ss-field"><label for="ss-gt">{{ $t("sensory.to_months") }}</label><InputNumber inputId="ss-gt" v-model="general.to_months" :min="0" /></div>
              <div class="ss-wide"><Button v-can="'sensory question edit'" icon="pi pi-check" :label="$t('save')" :loading="saving" @click="saveGeneral" /></div>
            </section>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </template>

    <Dialog :visible="Boolean(itemDialog)" modal :header="$t('sensory.edit_item', { n: itemDialog?.number })" :style="{ width: 'min(40rem, 95vw)' }" @update:visible="itemDialog = null">
      <div v-if="itemDialog" class="ss-dialog">
        <div class="ss-field"><label for="ss-it">{{ $t("sensory.text_ar") }}</label><Textarea id="ss-it" v-model="itemDialog.text" rows="3" autoResize /></div>
        <div class="ss-field"><label for="ss-ite">{{ $t("sensory.text_en") }}</label><Textarea id="ss-ite" v-model="itemDialog.text_en" rows="3" autoResize dir="ltr" /></div>
        <div class="ss-check"><Checkbox v-model="itemDialog.specify" inputId="ss-isp" binary /><label for="ss-isp">{{ $t("sensory.specify_flag_hint") }}</label></div>
      </div>
      <template #footer>
        <Button :label="$t('cancel')" severity="secondary" variant="text" @click="itemDialog = null" />
        <Button :label="$t('save')" icon="pi pi-check" :loading="saving" @click="saveItem" />
      </template>
    </Dialog>

    <Dialog :visible="Boolean(scaleDialog)" modal :header="scaleDialog ? kindLabel(scaleDialog.kind) + ' · ' + scaleDialog.code : ''" :style="{ width: 'min(46rem, 95vw)' }" @update:visible="scaleDialog = null">
      <div v-if="scaleDialog" class="ss-dialog ss-grid">
        <div class="ss-field"><label for="ss-sn">{{ $t("sensory.name") }}</label><InputText id="ss-sn" v-model="scaleDialog.name" /></div>
        <div class="ss-field"><label for="ss-sne">{{ $t("sensory.name_en") }}</label><InputText id="ss-sne" v-model="scaleDialog.name_en" dir="ltr" /></div>
        <div v-if="scaleDialog.kind === 'section'" class="ss-field ss-wide"><label for="ss-sg">{{ $t("sensory.group_name") }}</label><InputText id="ss-sg" v-model="scaleDialog.group_name" /></div>
        <template v-if="scaleDialog.kind !== 'threshold'">
          <div class="ss-field"><label for="ss-sl">{{ $t("sensory.less_than_others") }}</label><Textarea id="ss-sl" v-model="scaleDialog.less_text" rows="2" autoResize /></div>
          <div class="ss-field"><label for="ss-sle">{{ $t("sensory.less_than_others") }} (EN)</label><Textarea id="ss-sle" v-model="scaleDialog.less_text_en" rows="2" autoResize dir="ltr" /></div>
          <div class="ss-field"><label for="ss-sm">{{ $t("sensory.more_than_others") }}</label><Textarea id="ss-sm" v-model="scaleDialog.more_text" rows="2" autoResize /></div>
          <div class="ss-field"><label for="ss-sme">{{ $t("sensory.more_than_others") }} (EN)</label><Textarea id="ss-sme" v-model="scaleDialog.more_text_en" rows="2" autoResize dir="ltr" /></div>
        </template>
        <div class="ss-field"><label for="ss-no">{{ $t("sensory.note") }}</label><Textarea id="ss-no" v-model="scaleDialog.note" rows="2" autoResize /></div>
        <div class="ss-field"><label for="ss-noe">{{ $t("sensory.note") }} (EN)</label><Textarea id="ss-noe" v-model="scaleDialog.note_en" rows="2" autoResize dir="ltr" /></div>
      </div>
      <template #footer>
        <Button :label="$t('cancel')" severity="secondary" variant="text" @click="scaleDialog = null" />
        <Button :label="$t('save')" icon="pi pi-check" :loading="saving" @click="saveScale" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.ss-page { display: grid; gap: 1rem; }
.ss-state { display: grid; place-items: center; padding: 3rem; }
.ss-hint { margin: .25rem 0 0; color: #64748b; line-height: 1.7; }
.ss-forms { display: flex; flex-wrap: wrap; gap: .5rem; }
.ss-form-btn { display: grid; gap: .1rem; padding: .5rem .9rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 12px; background: #fff; font: inherit; font-weight: 700; text-align: start; cursor: pointer; }
.ss-form-btn small { color: #64748b; font-weight: 500; }
.ss-form-btn.is-picked { border-color: var(--sawa-primary, rgb(var(--bp-135c65))); background: #edf7f5; box-shadow: 0 0 0 1px var(--sawa-primary, rgb(var(--bp-135c65))); }
.ss-text { display: block; font-weight: 600; line-height: 1.6; }
.ss-en { display: block; color: #64748b; }
.ss-group { display: block; color: #0f766e; }
.ss-badges { display: flex; flex-wrap: wrap; gap: .3rem; margin-top: .25rem; }
.ss-q { display: inline-block; padding: 0 .45rem; border-radius: 6px; background: color-mix(in srgb, var(--q) 12%, #fff); color: var(--q); font-size: .8rem; font-weight: 700; }
.ss-meaning { display: block; color: #334155; line-height: 1.6; }
.ss-card { padding: 1rem 1.25rem; margin-bottom: 1rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 14px; background: #fff; }
.ss-card h3 { margin: 0 0 .75rem; font-size: 1rem; font-weight: 800; }
.ss-card h3 small { color: #64748b; font-weight: 500; }
.ss-cut { display: grid; gap: .6rem; padding: .75rem 0; border-top: 1px dashed #e2e8f0; }
.ss-cut-ages { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; font-weight: 700; }
.ss-bands { display: grid; grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr)); gap: .5rem; }
.ss-band { display: grid; gap: .3rem; padding: .5rem; border-radius: 10px; background: #f8fafc; }
.ss-band.is-typical { background: #dcfce7; }
.ss-band.is-probable { background: #fef3c7; }
.ss-band.is-definite { background: #fee2e2; }
.ss-band.is-consult { background: #ffedd5; }
.ss-band label { font-size: .8rem; font-weight: 700; }
.ss-band-inputs { display: flex; align-items: center; gap: .3rem; direction: ltr; }
.ss-page :deep(.ss-n) { width: 4.5rem; }
.ss-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr)); gap: 1rem; }
.ss-wide { grid-column: 1 / -1; }
.ss-field { display: grid; gap: .35rem; }
.ss-field label { font-weight: 700; }
.ss-dialog { display: grid; gap: 1rem; }
.ss-check { display: flex; align-items: center; gap: .5rem; }
</style>
