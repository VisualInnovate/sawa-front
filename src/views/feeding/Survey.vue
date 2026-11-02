<script setup>
// «تقييم - استبانة الأهل»: the food-preference questionnaire filled with the parent, laid out like the paper — each
// axis's items (likes a lot / does not like / neutral + examples) and its conclusion, the daily routine, the preferred
// positions, how the parent knows the child is full, notes, and the parent's signature on the device.
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { can } from "@/utils/permissions";
import { errorText, today, useFeedingMeta } from "@/utils/feeding";
import SignaturePad from "@/components/contracts/SignaturePad.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const confirm = useConfirm();
const meta = useFeedingMeta();

const isNew = computed(() => !route.params.id);
const canSave = computed(() => (isNew.value ? can("feeding create") : can("feeding edit")));
const canDelete = can("feeding delete");

const students = ref([]);
const survey = ref(null);
const form = ref({
  child_id: Number(route.query.child_id) || null,
  date: today(),
  answers: { items: {}, conclusions: {}, routine: [], positions: {}, other_food: "", satiety: "", notes: "" },
  parent_signer: "",
  parent_signature: null,
});
const resign = ref(false);

onMounted(async () => {
  if (isNew.value) {
    students.value = (await axios.get("api/feeding/students")).data.data;
    form.value.answers.routine = [{ meal: "", time: "", details: "" }, { meal: "", time: "", details: "" }, { meal: "", time: "", details: "" }];
    return;
  }
  survey.value = (await axios.get(`api/feeding-surveys/${route.params.id}`)).data.data;
  const a = survey.value.answers ?? {};
  form.value = {
    date: survey.value.date,
    answers: {
      items: JSON.parse(JSON.stringify(a.items ?? {})),
      conclusions: { ...(a.conclusions ?? {}) },
      routine: (a.routine ?? []).map((row) => ({ meal: row.meal ?? "", time: row.time ?? "", details: row.details ?? "" })),
      positions: { ...(a.positions ?? {}) },
      other_food: a.other_food ?? "",
      satiety: a.satiety ?? "",
      notes: a.notes ?? "",
    },
    parent_signer: survey.value.parent_signer ?? "",
    parent_signature: null,
  };
  if (!form.value.answers.routine.length) form.value.answers.routine.push({ meal: "", time: "", details: "" });
});

const item = (key) => (form.value.answers.items[key] ??= { pref: null, examples: "" });
const prefs = computed(() => meta.value?.prefs ?? []);
const problemOptions = computed(() => [{ value: true, label: t("feeding.problem_yes") }, { value: false, label: t("feeding.problem_no") }]);
const hasDislike = (axis) => axis.items.some((key) => form.value.answers.items[key]?.pref === "dislike");

const saving = ref(false);
async function save() {
  saving.value = true;
  try {
    const body = {
      date: form.value.date,
      answers: form.value.answers,
      parent_signer: form.value.parent_signer || null,
      parent_signature: form.value.parent_signature || undefined,
    };
    const { data } = isNew.value
      ? await axios.post("api/feeding-surveys", { ...body, child_id: form.value.child_id })
      : await axios.put(`api/feeding-surveys/${route.params.id}`, body);
    toast.add({ severity: "success", summary: t("feeding.saved"), life: 2000 });
    if (isNew.value) router.replace({ name: "feeding-survey", params: { id: data.data.id } });
    survey.value = data.data;
    form.value.parent_signature = null;
    resign.value = false;
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(t, error), life: 4000 });
  } finally {
    saving.value = false;
  }
}

function remove() {
  confirm.require({
    header: t("feeding.delete"),
    message: t("feeding.confirm_delete", { name: survey.value.child, date: survey.value.date }),
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger",
    accept: async () => {
      await axios.delete(`api/feeding-surveys/${survey.value.id}`);
      toast.add({ severity: "success", summary: t("feeding.deleted"), life: 2000 });
      router.push({ name: "feeding-child", params: { id: survey.value.child_id } });
    },
  });
}
</script>

<template>
  <div class="sawa-card p-3">
    <Toast />
    <ConfirmDialog />
    <Button variant="link" icon="pi pi-arrow-right" :label="$t('feeding.back')" class="p-0 mb-2"
            @click="survey ? router.push({ name: 'feeding-child', params: { id: survey.child_id } }) : router.push({ name: 'feeding', query: { tab: 'surveys' } })" />
    <template v-if="meta && (isNew || survey)">
      <div class="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <p class="text-xl text-bp-135c65 font-bold m-0">{{ $t("feeding.survey_title") }}</p>
          <small class="text-slate-500">{{ $t("feeding.survey_lead") }}</small>
        </div>
        <Button v-if="!isNew && canDelete" icon="pi pi-trash" severity="danger" variant="text" :label="$t('feeding.delete')" @click="remove" />
      </div>

      <div class="grid sm:grid-cols-3 gap-3 mb-4">
        <div class="flex flex-col gap-1 sm:col-span-2">
          <label for="fs-child" class="font-semibold">{{ $t("feeding.child") }}</label>
          <Select v-if="isNew" inputId="fs-child" v-model="form.child_id" :options="students" optionLabel="name" optionValue="id" filter :emptyMessage="$t('feeding.no_students')" fluid />
          <b v-else class="py-2">{{ survey.child }} <small class="text-slate-500 font-normal">· {{ $t("feeding.therapist") }}: {{ survey.therapist }}</small></b>
        </div>
        <div class="flex flex-col gap-1">
          <label for="fs-date" class="font-semibold">{{ $t("feeding.date") }}</label>
          <InputText id="fs-date" v-model="form.date" type="date" class="ltr" :disabled="!canSave" />
        </div>
      </div>

      <!-- Axes -->
      <section v-for="axis in meta.axes" :key="axis.axis" class="mb-4 rounded-lg border border-slate-200 bg-white overflow-hidden">
        <p class="m-0 p-3 font-bold bg-slate-50 border-b border-slate-200">{{ $t(`feeding.axis_${axis.axis}`) }}</p>
        <div class="overflow-x-auto">
          <table class="w-full text-sm border-collapse min-w-[40rem]">
            <thead><tr class="text-slate-500">
              <th class="p-2 text-start w-2/5" />
              <th v-for="pref in prefs" :key="pref" class="p-2 text-center whitespace-nowrap">{{ $t(`feeding.pref_${pref}`) }}</th>
              <th class="p-2 text-start">{{ $t("feeding.examples") }}</th>
            </tr></thead>
            <tbody>
              <tr v-for="key in axis.items" :key="key" class="border-t border-slate-100">
                <td class="p-2">{{ $t(`feeding.i_${key}`) }}</td>
                <td v-for="pref in prefs" :key="pref" class="p-2 text-center">
                  <RadioButton v-model="item(key).pref" :value="pref" :inputId="`fs-${key}-${pref}`" :name="`fs-${key}`" :disabled="!canSave"
                               :aria-label="`${$t(`feeding.i_${key}`)}: ${$t(`feeding.pref_${pref}`)}`" />
                </td>
                <td class="p-2"><InputText v-model="item(key).examples" maxlength="200" size="small" :disabled="!canSave" :aria-label="$t('feeding.examples')" fluid /></td>
              </tr>
              <tr v-if="axis.axis === 'group'" class="border-t border-slate-100">
                <td class="p-2" colspan="5">
                  <label for="fs-other" class="block mb-1">{{ $t("feeding.other_food") }}</label>
                  <InputText id="fs-other" v-model="form.answers.other_food" maxlength="200" size="small" :disabled="!canSave" fluid />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="p-3 border-t border-slate-200 flex flex-wrap items-center gap-3">
          <b>{{ $t("feeding.conclusion") }}:</b>
          <SelectButton v-model="form.answers.conclusions[axis.axis]" :options="problemOptions" optionLabel="label" optionValue="value" size="small" :disabled="!canSave" />
          <small v-if="hasDislike(axis) && form.answers.conclusions[axis.axis] == null" class="text-amber-800">{{ $t("feeding.suggest_problem") }}</small>
        </div>
      </section>

      <!-- Routine -->
      <section class="mb-4 rounded-lg border border-slate-200 bg-white p-3 flex flex-col gap-2">
        <b>{{ $t("feeding.routine") }}</b>
        <div v-for="(row, index) in form.answers.routine" :key="index" class="grid grid-cols-[1fr_8rem_2fr_auto] gap-2 items-center">
          <InputText v-model="row.meal" :placeholder="$t('feeding.routine_meal')" maxlength="60" size="small" :disabled="!canSave" :aria-label="$t('feeding.routine_meal')" />
          <InputText v-model="row.time" :placeholder="$t('feeding.routine_time')" maxlength="20" size="small" :disabled="!canSave" :aria-label="$t('feeding.routine_time')" />
          <InputText v-model="row.details" :placeholder="$t('feeding.routine_details')" maxlength="300" size="small" :disabled="!canSave" :aria-label="$t('feeding.routine_details')" />
          <Button v-if="canSave" icon="pi pi-times" variant="text" severity="secondary" size="small" :aria-label="$t('feeding.delete')" @click="form.answers.routine.splice(index, 1)" />
        </div>
        <Button v-if="canSave && form.answers.routine.length < 8" icon="pi pi-plus" variant="text" size="small" :label="$t('feeding.add_row')" class="self-start"
                @click="form.answers.routine.push({ meal: '', time: '', details: '' })" />
      </section>

      <!-- Positions -->
      <section class="mb-4 rounded-lg border border-slate-200 bg-white p-3 flex flex-col gap-2">
        <b>{{ $t("feeding.positions") }}</b>
        <div v-for="position in meta.positions" :key="position" class="grid sm:grid-cols-[12rem_1fr] gap-2 items-center">
          <label :for="`fs-pos-${position}`">{{ $t(`feeding.pos_${position}`) }}</label>
          <InputText :id="`fs-pos-${position}`" v-model="form.answers.positions[position]" :placeholder="$t('feeding.description')" maxlength="300" size="small" :disabled="!canSave" fluid />
        </div>
      </section>

      <section class="mb-4 grid md:grid-cols-2 gap-3">
        <div class="flex flex-col gap-1">
          <label for="fs-satiety" class="font-semibold">{{ $t("feeding.satiety") }}</label>
          <Textarea id="fs-satiety" v-model="form.answers.satiety" rows="3" autoResize maxlength="1000" :disabled="!canSave" fluid />
        </div>
        <div class="flex flex-col gap-1">
          <label for="fs-notes" class="font-semibold">{{ $t("feeding.notes") }}</label>
          <Textarea id="fs-notes" v-model="form.answers.notes" rows="3" autoResize maxlength="3000" :disabled="!canSave" fluid />
        </div>
      </section>

      <!-- Signature -->
      <section class="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3 flex flex-col gap-2">
        <b>{{ $t("feeding.parent_sign") }}</b>
        <div class="flex flex-col gap-1 max-w-md">
          <label for="fs-signer">{{ $t("feeding.signer") }}</label>
          <InputText id="fs-signer" v-model="form.parent_signer" maxlength="120" :disabled="!canSave" fluid />
        </div>
        <div v-if="survey?.parent_signature && !resign" class="flex flex-wrap items-center gap-3">
          <img :src="survey.parent_signature" alt="" class="h-12 bg-white border border-slate-200 rounded" />
          <small class="text-slate-600">{{ $t("feeding.signed", { name: survey.parent_signer, at: survey.parent_signed_at }) }}</small>
          <Button v-if="canSave" size="small" variant="text" :label="$t('feeding.resign')" @click="resign = true" />
        </div>
        <SignaturePad v-else-if="canSave" v-model="form.parent_signature" />
      </section>

      <Button v-if="canSave" icon="pi pi-save" :label="$t('feeding.save_survey')" :loading="saving" :disabled="isNew && !form.child_id" @click="save" />
    </template>
  </div>
</template>
