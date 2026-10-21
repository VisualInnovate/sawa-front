<script setup>
// The DTT sheet of one MT step of a goal, as the paper form: Date and Trainer filled in (editable), Phase and SD/SΔ
// empty, 10 trials with a Response (C, I, P or NR), prompt and notes, then % correct and Next. Saving goes back to
// the goals table; leaving the session time saves it too.
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import moment from "moment";

const props = defineProps({
  sessionId: { type: [String, Number], required: true },
  goal: { type: Object, required: true },
  step: { type: Number, required: true },
  canEdit: { type: Boolean, default: false },
  therapist: { type: String, default: "" },
});
const emit = defineEmits(["saved", "close"]);
const { t } = useI18n();
const toast = useToast();

const RESPONSES = ["C", "I", "P", "NR"];
const sheet = ref(null);
const loading = ref(true);
const saving = ref(false);
const dirty = ref(false);
const url = () => `api/program-sessions/${props.sessionId}/goals/${props.goal.id}/dtt/${props.step}`;

const blank = () => ({
  date: moment().format("YYYY-MM-DD"), trainer: props.therapist, phase: "", sd: "", percent_correct: "", next: "",
  trials: Array.from({ length: 10 }, () => ({ response: null, prompt: "", notes: "" })),
});

onMounted(async () => {
  try {
    const { data } = await axios.get(url());
    const saved = data.data;
    sheet.value = saved
      ? { date: saved.date, trainer: saved.trainer ?? "", phase: saved.phase ?? "", sd: saved.sd ?? "", percent_correct: saved.percent_correct ?? "",
        next: saved.next ?? "", trials: saved.trials }
      : blank();
  } finally {
    loading.value = false;
    // Only changes after loading count.
    setTimeout(() => { dirty.value = false; });
  }
});
watch(sheet, () => { dirty.value = true; }, { deep: true });

const setResponse = (row, value) => {
  if (!props.canEdit) return;
  row.response = row.response === value ? null : value;
};

async function save(close = true) {
  saving.value = true;
  try {
    const { data } = await axios.put(url(), sheet.value);
    dirty.value = false;
    emit("saved", data.mt);
    toast.add({ severity: "success", summary: t("success_message"), detail: t("dtt_saved", { step: props.step }), life: 2000 });
    if (close) emit("close");
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message ?? t("mission_error"), life: 3000 });
  } finally {
    saving.value = false;
  }
}
async function saveIfDirty() {
  if (props.canEdit && dirty.value && sheet.value) await save(false);
}
defineExpose({ saveIfDirty });
</script>

<template>
  <div class="dtt-root">
    <div v-if="loading" class="dtt-loading"><i class="pi pi-spin pi-spinner" /></div>
    <template v-else>
      <header class="dtt-top">
        <div class="dtt-title">
          <span class="dtt-badge ltr">MT{{ step }}</span>
          <div>
            <b>DTT · {{ goal.code }}</b>
            <p>{{ goal.goal }}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <Button icon="pi pi-arrow-right" :label="$t('back')" variant="text" severity="secondary" @click="$emit('close')" />
          <Button v-if="canEdit" icon="pi pi-save" :label="$t('dtt_save_back')" :loading="saving" @click="save()" />
        </div>
      </header>

      <div class="dtt-paper" dir="ltr">
        <div class="dtt-fields">
          <label>Date: <input v-model="sheet.date" type="date" :disabled="!canEdit" /></label>
          <label>Trainer: <input v-model="sheet.trainer" :disabled="!canEdit" /></label>
          <label>Phase: <input v-model="sheet.phase" :disabled="!canEdit" placeholder="MT / SP / …" /></label>
          <label>(SD/SΔ): <input v-model="sheet.sd" :disabled="!canEdit" /></label>
        </div>
        <table class="dtt-table">
          <thead>
            <tr><th class="dtt-trial">Trial</th><th class="dtt-resp">Response</th><th>prompt</th><th>Notes</th></tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in sheet.trials" :key="i" :style="{ '--d': `${i * 30}ms` }">
              <td class="dtt-trial"><b>{{ i + 1 }}</b></td>
              <td class="dtt-resp">
                <div class="dtt-choices">
                  <button v-for="value in RESPONSES" :key="value" type="button" class="dtt-chip" :class="[`is-${value.toLowerCase()}`, { 'is-on': row.response === value }]"
                    :disabled="!canEdit" :aria-pressed="row.response === value" @click="setResponse(row, value)">{{ value }}</button>
                </div>
              </td>
              <td><input v-model="row.prompt" :disabled="!canEdit" :aria-label="`prompt ${i + 1}`" /></td>
              <td><input v-model="row.notes" :disabled="!canEdit" :aria-label="`notes ${i + 1}`" /></td>
            </tr>
            <tr class="dtt-foot">
              <td colspan="2"><b>% correct</b></td>
              <td colspan="2"><input v-model="sheet.percent_correct" :disabled="!canEdit" aria-label="% correct" /></td>
            </tr>
            <tr class="dtt-foot">
              <td colspan="2"><b>Next:</b></td>
              <td colspan="2"><input v-model="sheet.next" :disabled="!canEdit" aria-label="Next" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<style scoped>
.dtt-root { height: 100%; min-height: 0; display: grid; grid-template-rows: auto 1fr; gap: .6rem; }
.dtt-loading { display: grid; place-items: center; font-size: 2rem; color: #135c65; }
.dtt-top { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.dtt-title { display: flex; align-items: center; gap: .7rem; min-width: 0; }
.dtt-badge { padding: .45rem .7rem; border-radius: 12px; background: linear-gradient(135deg, #135c65, #0f8a7e); color: #fff; font-weight: 900; font-size: 1.1rem;
  box-shadow: 0 10px 20px -12px #135c65; animation: dtt-pop .4s cubic-bezier(.34, 1.56, .64, 1); }
.dtt-title b { color: #135c65; }
.dtt-title p { margin: 0; color: #475569; font-size: .85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 50vw; }
.dtt-paper { min-height: 0; display: grid; grid-template-rows: auto 1fr; gap: .5rem; padding: .8rem 1rem; border-radius: 16px; background: #fff;
  border: 1px solid #e2e8f0; box-shadow: 0 14px 40px -28px rgb(15 23 42 / .7); overflow: hidden; max-width: 64rem; width: 100%; margin-inline: auto; }
.dtt-fields { display: grid; grid-template-columns: repeat(4, 1fr); gap: .5rem 1rem; }
.dtt-fields label { display: flex; align-items: center; gap: .4rem; font-weight: 700; color: #0f3d43; font-size: .85rem; white-space: nowrap; }
.dtt-fields input { flex: 1; min-width: 0; border: 0; border-bottom: 1.5px solid #94a3b8; padding: .2rem .1rem; font: inherit; font-weight: 500; background: transparent; outline: none; }
.dtt-fields input:focus { border-color: #0f8a7e; }
.dtt-table { width: 100%; height: 100%; border-collapse: collapse; table-layout: fixed; font-size: .85rem; }
.dtt-table th, .dtt-table td { border: 1px solid #94a3b8; padding: 0 .3rem; }
.dtt-table th { background: #eef6f6; font-size: .8rem; height: 1.8rem; }
.dtt-trial { width: 3.5rem; text-align: center; }
.dtt-resp { width: 14rem; }
.dtt-table tbody tr { animation: dtt-row .35s var(--d, 0ms) ease both; }
.dtt-table td input { width: 100%; height: 100%; min-height: 1.7rem; border: 0; background: transparent; font: inherit; outline: none; }
.dtt-table td input:focus { background: #f0fdfa; }
.dtt-choices { display: flex; gap: .3rem; justify-content: center; }
.dtt-chip { min-width: 2.4rem; padding: .1rem .35rem; border-radius: 8px; border: 1.5px solid #cbd5e1; background: #fff; font-weight: 800; font-size: .8rem; cursor: pointer;
  color: #64748b; transition: all .18s cubic-bezier(.34, 1.56, .64, 1); }
.dtt-chip:not(:disabled):hover { transform: translateY(-2px); }
.dtt-chip.is-on { color: #fff; transform: scale(1.08); }
.dtt-chip.is-c.is-on { background: #10b981; border-color: #10b981; }
.dtt-chip.is-i.is-on { background: #ef4444; border-color: #ef4444; }
.dtt-chip.is-p.is-on { background: #f59e0b; border-color: #f59e0b; }
.dtt-chip.is-nr.is-on { background: #64748b; border-color: #64748b; }
.dtt-foot td { background: #f8fafc; }
@keyframes dtt-row { from { opacity: 0; transform: translateX(-8px); } }
@keyframes dtt-pop { from { transform: scale(.6); opacity: 0; } }
</style>
