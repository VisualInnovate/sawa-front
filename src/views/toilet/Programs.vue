<script setup>
// «برنامج الحمام»: the class students' programs. A new one asks the two questions that pick the track:
// wears a diaper? (no → weekly check) · parents ready and age suitable? (no → daily diaper check, yes → training).
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { can } from "@/utils/permissions";
import { TRACK_ICONS, TRACK_SEVERITY, STATUS_SEVERITY, BAND_SEVERITY, ageText, minutesText, errorText, useToiletMeta } from "@/utils/toilet";

const { t } = useI18n();
const toast = useToast();
const router = useRouter();
const meta = useToiletMeta();
const canCreate = can("toilet program create");

const rows = ref([]);
const counts = ref({});
const loading = ref(false);
const state = ref("open");
const track = ref(null);
const search = ref("");

const stateOptions = computed(() => ["open", "completed", "cancelled", "all"].map((value) => ({ value, label: t(`toilet.state_${value}`) })));
const trackOptions = computed(() => ["training", "weekly", "diaper"].map((value) => ({ value, label: t(`toilet.track_${value}`), count: counts.value[value] ?? 0 })));

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get("api/toilet-programs", { params: { state: state.value, track: track.value || undefined, search: search.value.trim() || undefined } });
    rows.value = data.data;
    counts.value = data.counts ?? {};
  } finally {
    loading.value = false;
  }
}
let typing;
watch(search, () => {
  clearTimeout(typing);
  typing = setTimeout(load, 350);
});

function stageText(row) {
  if (row.track === "training" && row.status === "training") {
    const every = meta.value?.stages?.find((s) => s.stage === row.stage)?.every;
    return `${t("toilet.stage_n", { n: row.stage })} · ${minutesText(t, every)} · ${t(`toilet.phase_${row.phase}`)}`;
  }
  if (row.track === "weekly" && row.status === "active") return row.weekly_mode === "on_request" ? t("toilet.mode_on_request") : t("toilet.mode_timed");
  if (row.track === "diaper") return row.reasons.map((r) => t(`toilet.reason_${r}`)).join("، ");
  return "";
}

// New program
const dialog = ref(false);
const candidates = ref([]);
const draft = ref({});
const saving = ref(false);
const chosen = computed(() => candidates.value.find((c) => c.id === draft.value.child_id));
const pickedTrack = computed(() => {
  if (draft.value.diaper === false) return "weekly";
  if (draft.value.diaper === true && draft.value.ready === false) return "diaper";
  if (draft.value.diaper === true && draft.value.ready === true) return "training";
  return null;
});
const yesNo = computed(() => [{ value: true, label: t("toilet.yes") }, { value: false, label: t("toilet.no") }]);
const reasonOptions = computed(() => ["parents_not_ready", "too_young"].map((value) => ({ value, label: t(`toilet.reason_${value}`) })));

async function openNew() {
  draft.value = { child_id: null, diaper: null, ready: null, reasons: [], notes: "" };
  dialog.value = true;
  if (!candidates.value.length) candidates.value = (await axios.get("api/toilet-programs/candidates")).data.data;
}
async function create() {
  saving.value = true;
  try {
    const { data } = await axios.post("api/toilet-programs", {
      child_id: draft.value.child_id,
      track: pickedTrack.value,
      reasons: pickedTrack.value === "diaper" ? draft.value.reasons : undefined,
      notes: draft.value.notes || undefined,
    });
    toast.add({ severity: "success", summary: t("toilet.created"), life: 2500 });
    dialog.value = false;
    candidates.value = [];
    router.push({ name: "toilet-program", params: { id: data.data.id } });
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(t, error), life: 4000 });
  } finally {
    saving.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div class="sawa-card p-3">
    <Toast />
    <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
      <div>
        <p class="text-xl text-bp-135c65 font-bold m-0"><i class="pi pi-sparkles" aria-hidden="true" /> {{ $t("toilet.menu") }}</p>
        <small class="text-slate-500">{{ $t("toilet.lead") }}</small>
      </div>
      <div class="flex gap-2">
        <Button icon="pi pi-refresh" variant="outlined" :loading="loading" :aria-label="$t('refresh')" @click="load" />
        <Button v-if="canCreate" icon="pi pi-plus" :label="$t('toilet.new')" @click="openNew" />
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2 mb-3">
      <SelectButton v-model="state" :options="stateOptions" optionLabel="label" optionValue="value" :allowEmpty="false" @change="load" />
      <Select v-model="track" :options="trackOptions" optionLabel="label" optionValue="value" :placeholder="$t('toilet.all_tracks')" showClear class="w-60" @change="load">
        <template #option="{ option }"><span class="grow">{{ option.label }}</span><Badge v-if="option.count" :value="option.count" severity="secondary" /></template>
      </Select>
      <IconField class="grow max-w-80">
        <InputIcon class="pi pi-search" />
        <InputText v-model="search" :placeholder="$t('toilet.search')" fluid />
      </IconField>
    </div>

    <DataTable :value="rows" :loading="loading" dataKey="id" stripedRows rowHover responsiveLayout="scroll" class="cursor-pointer"
               @row-click="router.push({ name: 'toilet-program', params: { id: $event.data.id } })">
      <template #empty><p class="text-center text-slate-500 py-6">{{ $t("toilet.empty") }}</p></template>
      <Column :header="$t('toilet.child')">
        <template #body="{ data }"><b>{{ data.child }}</b><br /><small class="text-slate-500">{{ ageText($t, data.age_months) }}</small></template>
      </Column>
      <Column :header="$t('toilet.track')">
        <template #body="{ data }"><Tag :severity="TRACK_SEVERITY[data.track]"><i :class="TRACK_ICONS[data.track]" aria-hidden="true" />&nbsp;{{ $t(`toilet.track_${data.track}`) }}</Tag></template>
      </Column>
      <Column :header="$t('status')">
        <template #body="{ data }">
          <Tag :severity="STATUS_SEVERITY[data.status]" :value="$t(`toilet.status_${data.status}`)" />
          <small class="block text-slate-600 mt-1">{{ stageText(data) }}</small>
        </template>
      </Column>
      <Column :header="$t('toilet.score')">
        <template #body="{ data }"><Tag v-if="data.band" :severity="BAND_SEVERITY[data.band]" :value="`${data.score} · ${$t(`toilet.band_${data.band}`)}`" /></template>
      </Column>
      <Column :header="$t('toilet.therapist')" field="therapist" />
      <Column :header="$t('toilet.started_on')"><template #body="{ data }"><span class="ltr whitespace-nowrap">{{ data.started_on || data.created_at }}</span></template></Column>
    </DataTable>

    <Dialog v-model:visible="dialog" modal :header="$t('toilet.new')" :style="{ width: '40rem' }" :breakpoints="{ '768px': '95vw' }">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label for="tp-child" class="font-semibold">{{ $t("toilet.child") }}</label>
          <Select id="tp-child" v-model="draft.child_id" :options="candidates" optionLabel="name" optionValue="id" filter :placeholder="$t('toilet.choose_child')"
                  :emptyMessage="$t('toilet.no_candidates')" fluid>
            <template #option="{ option }">
              <span class="grow">{{ option.name }}</span>
              <Tag v-if="option.open_program_id" severity="warn" :value="$t('toilet.has_open')" />
            </template>
          </Select>
          <Message v-if="chosen?.open_program_id" severity="warn" size="small">
            {{ $t("toilet.has_open") }} ·
            <Button variant="link" class="p-0" :label="$t('toilet.open_it')" @click="dialog = false; router.push({ name: 'toilet-program', params: { id: chosen.open_program_id } })" />
          </Message>
        </div>

        <template v-if="draft.child_id && !chosen?.open_program_id">
          <div class="flex flex-col gap-1">
            <span class="font-semibold" id="tp-q1">{{ $t("toilet.q_diaper") }}</span>
            <SelectButton v-model="draft.diaper" :options="yesNo" optionLabel="label" optionValue="value" :allowEmpty="false" aria-labelledby="tp-q1" />
          </div>
          <div v-if="draft.diaper === true" class="flex flex-col gap-1">
            <span class="font-semibold" id="tp-q2">{{ $t("toilet.q_ready") }}</span>
            <SelectButton v-model="draft.ready" :options="yesNo" optionLabel="label" optionValue="value" :allowEmpty="false" aria-labelledby="tp-q2" />
          </div>
          <div v-if="pickedTrack === 'diaper'" class="flex flex-col gap-1">
            <span class="font-semibold">{{ $t("toilet.reasons") }}</span>
            <div class="flex flex-wrap gap-4">
              <label v-for="option in reasonOptions" :key="option.value" class="flex items-center gap-2">
                <Checkbox v-model="draft.reasons" :value="option.value" :inputId="`tp-r-${option.value}`" />{{ option.label }}
              </label>
            </div>
          </div>
          <Message v-if="pickedTrack" :severity="TRACK_SEVERITY[pickedTrack]" :icon="TRACK_ICONS[pickedTrack]">
            <b>{{ $t(`toilet.track_${pickedTrack}`) }}</b><br />{{ $t(`toilet.track_${pickedTrack}_hint`) }}
          </Message>
          <div class="flex flex-col gap-1">
            <label for="tp-notes" class="font-semibold">{{ $t("toilet.notes") }}</label>
            <Textarea id="tp-notes" v-model="draft.notes" rows="2" autoResize maxlength="2000" fluid />
          </div>
        </template>
      </div>
      <template #footer>
        <Button variant="outlined" :label="$t('close')" @click="dialog = false" />
        <Button icon="pi pi-check" :label="$t('toilet.new')" :loading="saving"
                :disabled="!pickedTrack || chosen?.open_program_id || (pickedTrack === 'diaper' && !draft.reasons.length)" @click="create" />
      </template>
    </Dialog>
  </div>
</template>
