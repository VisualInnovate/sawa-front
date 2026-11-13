<script setup>
// «الملف التشخيصي» on the child's page: the diagnosis from a fixed list (so the outcomes can be compared by
// diagnosis), its severity and source, and the parents' consent to use the data without identity in research.
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { can } from "@/utils/permissions";

const props = defineProps({ childId: { type: [Number, String], required: true } });
const { t } = useI18n();
const toast = useToast();
const options = ref({ diagnoses: [], severities: [], sources: [] });
const form = ref(null);
const saved = ref(null);
const saving = ref(false);
const editing = ref(false);
const canEdit = computed(() => can("child edit"));
const opt = (list, prefix) => list.map((v) => ({ value: v, label: t(`cp.${prefix}_${v}`) }));
const consentOptions = computed(() => [
  { value: true, label: t("cp.consent_yes") },
  { value: false, label: t("cp.consent_no") },
  { value: null, label: t("cp.consent_unknown") },
]);

async function load() {
  const { data } = await axios.get(`api/child-clinical/${props.childId}`);
  options.value = data.options;
  saved.value = data.data;
  form.value = {
    primary_diagnosis: data.data?.primary_diagnosis ?? null, other_diagnoses: data.data?.other_diagnoses ?? [], severity: data.data?.severity ?? null,
    source: data.data?.source ?? null, diagnosed_at: data.data?.diagnosed_at ? new Date(`${data.data.diagnosed_at}T00:00:00`) : null,
    notes: data.data?.notes ?? "", research_consent: data.data?.research_consent ?? null,
  };
  editing.value = !data.data && canEdit.value;
}
async function save() {
  saving.value = true;
  try {
    const d = form.value.diagnosed_at;
    const payload = { ...form.value, diagnosed_at: d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` : null };
    const { data } = await axios.put(`api/child-clinical/${props.childId}`, payload);
    saved.value = data.data;
    editing.value = false;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("cp.saved"), life: 2500 });
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message || t("mission_error"), life: 4000 });
  } finally {
    saving.value = false;
  }
}
onMounted(load);
</script>

<template>
  <section class="cp">
    <header class="cp-head">
      <h3><i class="pi pi-id-card" aria-hidden="true" /> {{ $t("cp.title") }}</h3>
      <Button v-if="canEdit && saved && !editing" icon="pi pi-pencil" :label="$t('cp.edit')" size="small" text @click="editing = true" />
    </header>
    <p class="cp-hint">{{ $t("cp.hint") }}</p>

    <div v-if="form && !editing" class="cp-view">
      <div><small>{{ $t("cp.primary") }}</small><b>{{ saved?.primary_diagnosis ? $t(`cp.dx_${saved.primary_diagnosis}`) : "—" }}</b></div>
      <div v-if="saved?.other_diagnoses?.length"><small>{{ $t("cp.other") }}</small><b>{{ saved.other_diagnoses.map((d) => $t(`cp.dx_${d}`)).join("، ") }}</b></div>
      <div><small>{{ $t("cp.severity") }}</small><b>{{ saved?.severity ? $t(`cp.sev_${saved.severity}`) : "—" }}</b></div>
      <div><small>{{ $t("cp.source") }}</small><b>{{ saved?.source ? $t(`cp.src_${saved.source}`) : "—" }}</b></div>
      <div><small>{{ $t("cp.date") }}</small><b>{{ saved?.diagnosed_at || "—" }}</b></div>
      <div>
        <small>{{ $t("cp.consent") }}</small>
        <Tag :value="saved?.research_consent === true ? $t('cp.consent_yes') : saved?.research_consent === false ? $t('cp.consent_no') : $t('cp.consent_unknown')"
          :severity="saved?.research_consent === true ? 'success' : saved?.research_consent === false ? 'danger' : 'secondary'" />
      </div>
      <p v-if="saved?.notes" class="cp-notes">{{ saved.notes }}</p>
    </div>

    <form v-else-if="form" class="cp-form" @submit.prevent="save">
      <label>{{ $t("cp.primary") }}<Select v-model="form.primary_diagnosis" :options="opt(options.diagnoses, 'dx')" optionLabel="label" optionValue="value" showClear /></label>
      <label>{{ $t("cp.other") }}<MultiSelect v-model="form.other_diagnoses" :options="opt(options.diagnoses, 'dx')" optionLabel="label" optionValue="value" display="chip" /></label>
      <label>{{ $t("cp.severity") }}<Select v-model="form.severity" :options="opt(options.severities, 'sev')" optionLabel="label" optionValue="value" showClear /></label>
      <label>{{ $t("cp.source") }}<Select v-model="form.source" :options="opt(options.sources, 'src')" optionLabel="label" optionValue="value" showClear /></label>
      <label>{{ $t("cp.date") }}<DatePicker v-model="form.diagnosed_at" dateFormat="yy-mm-dd" :maxDate="new Date()" showIcon /></label>
      <label>{{ $t("cp.consent") }}<Select v-model="form.research_consent" :options="consentOptions" optionLabel="label" optionValue="value" /></label>
      <small class="cp-consent-hint">{{ $t("cp.consent_hint") }}</small>
      <label class="cp-wide">{{ $t("cp.notes") }}<Textarea v-model="form.notes" rows="2" autoResize /></label>
      <div class="cp-actions">
        <Button v-if="saved" type="button" :label="$t('cancel')" text severity="secondary" @click="editing = false" />
        <Button type="submit" :label="$t('save')" icon="pi pi-check" :loading="saving" />
      </div>
    </form>
  </section>
</template>

<style scoped>
.cp { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 1rem 1.25rem; margin-top: 1rem; }
.cp-head { display: flex; justify-content: space-between; align-items: center; }
.cp-head h3 { margin: 0; font-size: 1.1rem; font-weight: 700; color: rgb(var(--bp-135c65)); display: flex; gap: 0.5rem; align-items: center; }
.cp-hint { color: #64748b; font-size: 0.85rem; margin: 0.25rem 0 0.75rem; }
.cp-view { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.75rem; }
.cp-view > div { display: flex; flex-direction: column; gap: 0.2rem; }
.cp-view small { color: #64748b; }
.cp-notes { grid-column: 1 / -1; margin: 0; color: #334155; }
.cp-form { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 0.75rem; }
.cp-form label { display: flex; flex-direction: column; gap: 0.3rem; font-size: 0.9rem; }
.cp-wide, .cp-consent-hint, .cp-actions { grid-column: 1 / -1; }
.cp-consent-hint { color: #64748b; }
.cp-actions { display: flex; justify-content: flex-end; gap: 0.5rem; }
</style>
