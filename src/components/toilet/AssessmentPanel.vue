<script setup>
// The assessment: the Paediatric Assessment Tool (11 items, score 0–37) and the 4.4 initial assessment, the behaviour
// and speech departments' answers, the parent's signature on 4.4, and the decision (open the program or the daily check).
import axios from "axios";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import SignDialog from "./SignDialog.vue";
import { BAND_SEVERITY, CONSULT_SEVERITY, errorText } from "@/utils/toilet";

const props = defineProps({
  program: { type: Object, required: true },
  meta: { type: Object, required: true },
  canEdit: Boolean,
});
const emit = defineEmits(["updated"]);
const { t, tm, rt } = useI18n();
const toast = useToast();

const editable = computed(() => props.canEdit && props.program.status === "assessment");
const form = ref({});
function reset() {
  const a = props.program.assessment ?? {};
  form.value = {
    pdf: { ...(a.pdf ?? {}) },
    urinary: { ...(a.urinary ?? {}) },
    cognitive: { ...(a.cognitive ?? {}) },
    steps: { ...(a.steps ?? {}) },
    recommendation: a.recommendation ?? null,
    note: a.note ?? "",
  };
}
watch(() => props.program.assessment, reset, { immediate: true });

const sections = computed(() => ["maturity", "independence", "behaviour"].map((section) => ({
  section,
  items: props.meta.pdf_items.filter((item) => item.section === section),
})));
const options = (key) => (tm("toilet.pdf_o")[key] ?? []).map((text) => rt(text));
const advice = (key) => {
  const chosen = form.value.pdf[key];
  return chosen == null ? "" : rt(tm("toilet.pdf_r")[key][chosen]);
};
const answered = computed(() => props.meta.pdf_items.filter((item) => form.value.pdf[item.key] != null).length);
const score = computed(() => props.meta.pdf_items.reduce((sum, item) => sum + (form.value.pdf[item.key] != null ? item.scores[form.value.pdf[item.key]] : 0), 0));
const band = computed(() => {
  if (answered.value < props.meta.pdf_items.length) return null;
  return score.value <= props.meta.low_max ? "low" : score.value >= props.meta.high_min ? "high" : "medium";
});
const yesNo = computed(() => [{ value: true, label: t("toilet.yes") }, { value: false, label: t("toilet.no") }]);
const recommendations = computed(() => props.meta.recommendations.map((value) => ({ value, label: t(`toilet.r_${value}`) })));

const saving = ref(false);
async function save() {
  saving.value = true;
  try {
    const { data } = await axios.put(`api/toilet-programs/${props.program.id}/assessment`, form.value);
    toast.add({ severity: "success", summary: t("toilet.saved"), life: 2000 });
    emit("updated", data.data);
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(t, error), life: 4000 });
  } finally {
    saving.value = false;
  }
}

const signing = ref(false);
const initialSigned = computed(() => props.program.signatures?.initial);
const consultsPending = computed(() => props.program.consults.some((c) => c.status === "pending"));
const savedComplete = computed(() => props.program.assessment?.complete);

const deciding = ref(false);
const diaperDialog = ref(false);
const diaperReasons = ref([]);
async function decide(decision) {
  deciding.value = true;
  try {
    const { data } = await axios.post(`api/toilet-programs/${props.program.id}/decide`, { decision, reasons: decision === "diaper" ? diaperReasons.value : undefined });
    toast.add({ severity: "success", summary: t("toilet.saved"), life: 2000 });
    diaperDialog.value = false;
    emit("updated", data.data);
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(t, error), life: 4000 });
  } finally {
    deciding.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <Message severity="info" icon="pi pi-info-circle">{{ $t("toilet.assessment_lead") }}</Message>

    <!-- Departments -->
    <section class="flex flex-col gap-2">
      <p class="font-bold m-0">{{ $t("toilet.consults_title") }}</p>
      <div class="grid md:grid-cols-2 gap-3">
        <div v-for="consult in program.consults" :key="consult.id" class="p-3 rounded-lg border border-slate-200 bg-white flex flex-col gap-1">
          <div class="flex items-center justify-between gap-2">
            <b>{{ $t(`toilet.dept_${consult.department}`) }}</b>
            <Tag :severity="CONSULT_SEVERITY[consult.status]" :value="$t(`toilet.consult_${consult.status}`)" />
          </div>
          <small class="text-slate-500">{{ $t(`toilet.q_${consult.department}`) }}</small>
          <span v-if="consult.request_skill">{{ $t("toilet.skill") }}: <b>{{ $t(`toilet.skill_${consult.request_skill}`) }}</b></span>
          <p v-if="consult.note" class="m-0 whitespace-pre-line">{{ consult.note }}</p>
          <small v-if="consult.answered_by" class="text-slate-500">{{ consult.answered_by }} · <span class="ltr">{{ consult.answered_at }}</span></small>
        </div>
      </div>
    </section>

    <!-- Paediatric assessment -->
    <section class="flex flex-col gap-3">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p class="font-bold m-0 ltr text-start">{{ $t("toilet.pdf_title") }}</p>
          <small class="text-slate-500">{{ $t("toilet.pdf_lead") }}</small>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-slate-600">{{ $t("toilet.score") }}:</span>
          <b class="text-lg">{{ $t("toilet.score_of", { score, max: meta.pdf_max }) }}</b>
          <Tag v-if="band" :severity="BAND_SEVERITY[band]" :value="$t(`toilet.band_${band}`)" />
          <Tag v-else severity="secondary" :value="$t('toilet.incomplete', { n: answered })" />
        </div>
      </div>
      <Message v-if="band" :severity="BAND_SEVERITY[band]" size="small">{{ $t(`toilet.band_${band}_hint`) }}</Message>

      <div v-for="group in sections" :key="group.section" class="flex flex-col gap-2">
        <p class="m-0 font-semibold text-bp-135c65">{{ $t(`toilet.section_${group.section}`) }}</p>
        <div v-for="item in group.items" :key="item.key" class="p-3 rounded-lg border border-slate-200 bg-white flex flex-col gap-2">
          <b>({{ item.key }}) {{ $t(`toilet.pdf_q.${item.key}`) }}</b>
          <div class="flex flex-col gap-1">
            <label v-for="(label, index) in options(item.key)" :key="index" class="flex items-center gap-2">
              <RadioButton v-model="form.pdf[item.key]" :value="index" :inputId="`pdf-${item.key}-${index}`" :name="`pdf-${item.key}`" :disabled="!editable" />
              <span class="grow">{{ label }}</span>
              <span class="text-slate-500 num">{{ item.scores[index] }}</span>
            </label>
          </div>
          <small v-if="advice(item.key)" class="text-slate-600"><i class="pi pi-lightbulb" aria-hidden="true" /> {{ advice(item.key) }}</small>
        </div>
      </div>
    </section>

    <!-- 4.4 -->
    <section class="flex flex-col gap-3">
      <p class="font-bold m-0">{{ $t("toilet.initial_title") }}</p>
      <div class="grid md:grid-cols-2 gap-3">
        <div class="p-3 rounded-lg border border-slate-200 bg-white flex flex-col gap-2">
          <b>{{ $t("toilet.urinary") }}</b>
          <div v-for="key in meta.urinary" :key="key" class="flex flex-wrap items-center justify-between gap-2">
            <span>{{ $t(`toilet.u_${key}`) }}</span>
            <SelectButton v-model="form.urinary[key]" :options="yesNo" optionLabel="label" optionValue="value" size="small" :disabled="!editable" />
          </div>
        </div>
        <div class="p-3 rounded-lg border border-slate-200 bg-white flex flex-col gap-2">
          <b>{{ $t("toilet.cognitive") }}</b>
          <div v-for="key in meta.cognitive" :key="key" class="flex flex-wrap items-center justify-between gap-2">
            <span>{{ $t(`toilet.c_${key}`) }}</span>
            <SelectButton v-model="form.cognitive[key]" :options="yesNo" optionLabel="label" optionValue="value" size="small" :disabled="!editable" />
          </div>
        </div>
      </div>
      <div class="p-3 rounded-lg border border-slate-200 bg-white flex flex-col gap-2">
        <b>{{ $t("toilet.steps_title") }}</b>
        <div class="grid md:grid-cols-2 gap-3">
          <div v-for="key in meta.initial_steps" :key="key" class="flex flex-col gap-1">
            <label :for="`ia-${key}`">{{ $t(`toilet.s_${key}`) }}</label>
            <Textarea :id="`ia-${key}`" v-model="form.steps[key]" rows="1" autoResize maxlength="1000" :disabled="!editable" fluid />
          </div>
        </div>
      </div>
      <div class="p-3 rounded-lg border border-slate-200 bg-white flex flex-col gap-2">
        <b>{{ $t("toilet.recommendation") }}</b>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
          <label v-for="option in recommendations" :key="option.value" class="flex items-center gap-2">
            <RadioButton v-model="form.recommendation" :value="option.value" :inputId="`rec-${option.value}`" name="toilet-rec" :disabled="!editable" />{{ option.label }}
          </label>
        </div>
        <label for="ia-note" class="mt-2">{{ $t("toilet.assessment_note") }}</label>
        <Textarea id="ia-note" v-model="form.note" rows="2" autoResize maxlength="3000" :disabled="!editable" fluid />
      </div>
      <div v-if="editable" class="flex items-center gap-3">
        <Button icon="pi pi-save" :label="$t('toilet.save_assessment')" :loading="saving" @click="save" />
        <small v-if="program.assessed_at" class="text-slate-500">{{ $t("toilet.assessed_at") }}: <span class="ltr">{{ program.assessed_at }}</span></small>
      </div>
    </section>

    <!-- Signature on 4.4 and the decision -->
    <section class="p-3 rounded-lg border border-slate-200 bg-slate-50 flex flex-col gap-3">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <b>{{ $t("toilet.sign_initial") }}</b>
        <span v-if="initialSigned" class="flex items-center gap-2">
          <img :src="initialSigned.image" alt="" class="h-10 bg-white border border-slate-200 rounded" />
          <small class="text-slate-600">{{ $t("toilet.signed", { name: initialSigned.signer, at: initialSigned.at }) }}</small>
        </span>
        <Button v-else-if="editable" icon="pi pi-pen-to-square" variant="outlined" :label="$t('toilet.sign_now')" @click="signing = true" />
      </div>
      <template v-if="editable">
        <Divider class="my-0" />
        <b>{{ $t("toilet.decide_title") }}</b>
        <small class="text-slate-600">{{ $t("toilet.decide_hint") }}</small>
        <Message v-if="consultsPending" severity="warn" size="small">{{ $t("toilet.consults_waiting") }}</Message>
        <ul class="m-0 ps-5 text-slate-600 text-sm">
          <li v-if="!savedComplete">{{ $t("toilet.need_complete") }}</li>
          <li v-if="!initialSigned">{{ $t("toilet.need_initial_sign") }}</li>
        </ul>
        <div class="flex flex-wrap gap-2">
          <Button icon="pi pi-check" :label="$t('toilet.decide_open')" :loading="deciding" :disabled="!savedComplete || !initialSigned" @click="decide('open')" />
          <Button icon="pi pi-clock" severity="warn" variant="outlined" :label="$t('toilet.decide_diaper')" @click="diaperReasons = band === 'high' ? ['score'] : []; diaperDialog = true" />
        </div>
      </template>
    </section>

    <SignDialog v-model:visible="signing" :program="program" document="initial" :meta="meta" @updated="emit('updated', $event)" />
    <Dialog v-model:visible="diaperDialog" modal :header="$t('toilet.decide_diaper_title')" :style="{ width: '28rem' }">
      <div class="flex flex-col gap-2">
        <span class="font-semibold">{{ $t("toilet.reasons") }}</span>
        <label v-for="reason in meta.diaper_reasons" :key="reason" class="flex items-center gap-2">
          <Checkbox v-model="diaperReasons" :value="reason" :inputId="`dr-${reason}`" />{{ $t(`toilet.reason_${reason}`) }}
        </label>
      </div>
      <template #footer>
        <Button variant="outlined" :label="$t('close')" @click="diaperDialog = false" />
        <Button icon="pi pi-check" severity="warn" :label="$t('toilet.decide_diaper')" :loading="deciding" :disabled="!diaperReasons.length" @click="decide('diaper')" />
      </template>
    </Dialog>
  </div>
</template>
