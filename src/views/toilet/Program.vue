<script setup>
// One child's toilet program. Training: assessment → dryness check (4.5) → consent (4.6) → training → completed, each
// step on its own tab; the weekly check and the daily diaper check have one page each.
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { can } from "@/utils/permissions";
import { STATUS_SEVERITY, TRACK_ICONS, TRACK_SEVERITY, TRAINING_STEPS, ageText, errorText, useToiletMeta } from "@/utils/toilet";
import AssessmentPanel from "@/components/toilet/AssessmentPanel.vue";
import DrynessPanel from "@/components/toilet/DrynessPanel.vue";
import TrainingPanel from "@/components/toilet/TrainingPanel.vue";
import WeeklyPanel from "@/components/toilet/WeeklyPanel.vue";
import DiaperPanel from "@/components/toilet/DiaperPanel.vue";
import SignDialog from "@/components/toilet/SignDialog.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const confirm = useConfirm();
const meta = useToiletMeta();
const canEdit = can("toilet program edit");
const canDelete = can("toilet program delete");

const program = ref(null);
const loading = ref(false);
async function load() {
  loading.value = true;
  try {
    program.value = (await axios.get(`api/toilet-programs/${route.params.id}`)).data.data;
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(t, error), life: 4000 });
  } finally {
    loading.value = false;
  }
}
onMounted(load);
watch(() => route.params.id, (id) => id && load());

const open = computed(() => program.value && !["completed", "cancelled"].includes(program.value.status));
const stepIndex = computed(() => (program.value?.status === "cancelled" ? -1 : TRAINING_STEPS.indexOf(program.value?.status)));

// The training track's tab follows the program's step; earlier steps stay readable.
const tab = ref("assessment");
watch(() => program.value?.status, (status) => {
  if (!status || program.value.track !== "training") return;
  tab.value = { assessment: "assessment", dryness: "dryness", consent: "consent", training: "training", completed: "training" }[status] ?? tab.value;
});
const tabReached = (step) => program.value.status === "cancelled" || TRAINING_STEPS.indexOf(program.value.status) >= TRAINING_STEPS.indexOf(step);

function updated(next) {
  program.value = next;
}

// Details
const details = ref({});
watch(program, (p) => {
  if (p) details.value = { wake_time: p.wake_time ?? "", sleep_time: p.sleep_time ?? "", reinforcer: p.reinforcer ?? "", notes: p.notes ?? "" };
});
const savingDetails = ref(false);
async function saveDetails() {
  savingDetails.value = true;
  try {
    const body = { ...details.value, wake_time: details.value.wake_time || null, sleep_time: details.value.sleep_time || null };
    program.value = (await axios.put(`api/toilet-programs/${program.value.id}`, body)).data.data;
    toast.add({ severity: "success", summary: t("toilet.saved"), life: 1500 });
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(t, error), life: 4000 });
  } finally {
    savingDetails.value = false;
  }
}

const consentDialog = ref(false);

// Finish / cancel / delete
function completeOther() {
  confirm.require({
    header: t("toilet.complete"),
    message: t("toilet.complete"),
    icon: "pi pi-check",
    accept: async () => {
      try {
        program.value = (await axios.post(`api/toilet-programs/${program.value.id}/complete`)).data.data;
      } catch (error) {
        toast.add({ severity: "error", summary: t("error"), detail: errorText(t, error), life: 4000 });
      }
    },
  });
}
const cancelDialog = ref(false);
const cancelReason = ref("");
async function cancelProgram() {
  try {
    program.value = (await axios.post(`api/toilet-programs/${program.value.id}/cancel`, { reason: cancelReason.value })).data.data;
    cancelDialog.value = false;
    toast.add({ severity: "success", summary: t("toilet.cancelled_msg"), life: 2500 });
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(t, error), life: 4000 });
  }
}
function remove() {
  confirm.require({
    header: t("toilet.delete_program"),
    message: t("toilet.confirm_delete", { name: program.value.child }),
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger",
    accept: async () => {
      try {
        await axios.delete(`api/toilet-programs/${program.value.id}`);
        toast.add({ severity: "success", summary: t("toilet.deleted"), life: 2500 });
        router.push({ name: "toilet-programs" });
      } catch (error) {
        toast.add({ severity: "error", summary: t("error"), detail: errorText(t, error), life: 4000 });
      }
    },
  });
}
</script>

<template>
  <div class="sawa-card p-3">
    <Toast />
    <ConfirmDialog />
    <Button variant="link" icon="pi pi-arrow-right" :label="$t('toilet.back')" class="p-0 mb-2" @click="router.push({ name: 'toilet-programs' })" />

    <div v-if="loading && !program" class="flex justify-center p-8"><ProgressSpinner /></div>
    <template v-else-if="program && meta">
      <!-- Header -->
      <div class="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div class="flex flex-col gap-1">
          <p class="text-xl text-bp-135c65 font-bold m-0">{{ program.child }} <small class="text-slate-500 font-normal">{{ ageText($t, program.age_months) }}</small></p>
          <div class="flex flex-wrap items-center gap-2">
            <Tag :severity="TRACK_SEVERITY[program.track]"><i :class="TRACK_ICONS[program.track]" aria-hidden="true" />&nbsp;{{ $t(`toilet.track_${program.track}`) }}</Tag>
            <Tag :severity="STATUS_SEVERITY[program.status]" :value="$t(`toilet.status_${program.status}`)" />
            <span v-if="program.reasons.length" class="text-slate-600 text-sm">{{ program.reasons.map((r) => $t(`toilet.reason_${r}`)).join("، ") }}</span>
            <span v-if="program.therapist" class="text-slate-500 text-sm">{{ $t("toilet.therapist") }}: {{ program.therapist }}</span>
          </div>
          <small v-if="program.cancel_reason" class="text-red-700">{{ program.cancel_reason }}</small>
        </div>
        <div class="flex flex-wrap gap-2">
          <Button v-if="canEdit && open && program.track !== 'training'" icon="pi pi-check" variant="outlined" :label="$t('toilet.complete')" @click="completeOther" />
          <Button v-if="canEdit && open" icon="pi pi-ban" severity="danger" variant="outlined" :label="$t('toilet.cancel_program')" @click="cancelReason = ''; cancelDialog = true" />
          <Button v-if="canDelete" icon="pi pi-trash" severity="danger" variant="text" :aria-label="$t('toilet.delete_program')" v-tooltip.top="$t('toilet.delete_program')" @click="remove" />
        </div>
      </div>

      <!-- Training steps -->
      <ol v-if="program.track === 'training'" class="flex flex-wrap gap-2 list-none p-0 m-0 mb-4">
        <li v-for="(step, index) in TRAINING_STEPS" :key="step" class="flex items-center gap-2">
          <span class="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
                :class="index < stepIndex ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : index === stepIndex ? 'bg-emerald-600 border-emerald-600 text-white font-semibold' : 'border-slate-200 text-slate-500'">
            <i :class="index < stepIndex ? 'pi pi-check' : 'pi pi-circle'" aria-hidden="true" />{{ $t(`toilet.step_${step}`) }}
          </span>
          <i v-if="index < TRAINING_STEPS.length - 1" class="pi pi-angle-left text-slate-400" aria-hidden="true" />
        </li>
      </ol>

      <!-- Details: times and reinforcer -->
      <details v-if="program.track !== 'diaper'" class="p-3 rounded-lg border border-slate-200 bg-white mb-4" :open="program.status === 'consent'">
        <summary class="cursor-pointer font-semibold">{{ $t("toilet.details") }}</summary>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
          <div class="flex flex-col gap-1"><label for="pd-wake">{{ $t("toilet.wake") }}</label><InputText id="pd-wake" v-model="details.wake_time" type="time" class="ltr" :disabled="!canEdit" /></div>
          <div class="flex flex-col gap-1"><label for="pd-sleep">{{ $t("toilet.sleep") }}</label><InputText id="pd-sleep" v-model="details.sleep_time" type="time" class="ltr" :disabled="!canEdit" /></div>
          <div class="flex flex-col gap-1 lg:col-span-2"><label for="pd-rein">{{ $t("toilet.reinforcer") }}</label><InputText id="pd-rein" v-model="details.reinforcer" maxlength="150" :disabled="!canEdit" fluid /><small class="text-slate-500">{{ $t("toilet.reinforcer_hint") }}</small></div>
          <div class="flex flex-col gap-1 sm:col-span-2 lg:col-span-4"><label for="pd-notes">{{ $t("toilet.notes") }}</label><Textarea id="pd-notes" v-model="details.notes" rows="2" autoResize maxlength="2000" :disabled="!canEdit" fluid /></div>
        </div>
        <small class="text-slate-500 block mt-2">{{ $t("toilet.times_hint") }}</small>
        <Button v-if="canEdit" icon="pi pi-save" :label="$t('toilet.save')" :loading="savingDetails" class="mt-2" @click="saveDetails" />
      </details>

      <!-- Training track -->
      <Tabs v-if="program.track === 'training'" v-model:value="tab">
        <TabList>
          <Tab value="assessment">{{ $t("toilet.step_assessment") }}</Tab>
          <Tab value="dryness" :disabled="!tabReached('dryness')">{{ $t("toilet.step_dryness") }}</Tab>
          <Tab value="consent" :disabled="!tabReached('consent')">{{ $t("toilet.step_consent") }}</Tab>
          <Tab value="training" :disabled="!tabReached('training')">{{ $t("toilet.step_training") }}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="assessment"><AssessmentPanel :program="program" :meta="meta" :canEdit="canEdit" @updated="updated" /></TabPanel>
          <TabPanel value="dryness"><DrynessPanel v-if="tab === 'dryness'" :program="program" :meta="meta" :canEdit="canEdit" @updated="updated" /></TabPanel>
          <TabPanel value="consent">
            <div class="flex flex-col gap-3">
              <p class="m-0 leading-7 p-3 rounded-lg bg-slate-50 border border-slate-200">{{ $t("toilet.consent_terms") }}</p>
              <small class="text-slate-600">{{ $t("toilet.clothes_notice", { total: meta.clothes.academy + meta.clothes.bag, academy: meta.clothes.academy }) }}</small>
              <div v-if="program.signatures?.consent" class="flex flex-wrap items-center gap-3">
                <img :src="program.signatures.consent.image" alt="" class="h-12 bg-white border border-slate-200 rounded" />
                <span>{{ $t("toilet.signed", { name: program.signatures.consent.signer, at: program.signatures.consent.at }) }}</span>
                <span>{{ $t("toilet.start_date") }}: <b class="ltr">{{ program.signatures.consent.start_date }}</b></span>
              </div>
              <Button v-else-if="canEdit && program.status === 'consent'" icon="pi pi-pen-to-square" :label="$t('toilet.sign_consent')" class="self-start" @click="consentDialog = true" />
            </div>
          </TabPanel>
          <TabPanel value="training"><TrainingPanel v-if="tab === 'training' && program.stage" :program="program" :meta="meta" :canEdit="canEdit" @updated="updated" /></TabPanel>
        </TabPanels>
      </Tabs>

      <WeeklyPanel v-else-if="program.track === 'weekly'" :program="program" :meta="meta" :canEdit="canEdit" @updated="updated" />
      <DiaperPanel v-else :program="program" :meta="meta" :canEdit="canEdit" @updated="updated" />

      <SignDialog v-model:visible="consentDialog" :program="program" document="consent" :meta="meta" @updated="updated" />
      <Dialog v-model:visible="cancelDialog" modal :header="$t('toilet.cancel_program')" :style="{ width: '28rem' }">
        <div class="flex flex-col gap-1">
          <label for="pc-reason">{{ $t("toilet.cancel_reason") }}</label>
          <Textarea id="pc-reason" v-model="cancelReason" rows="3" maxlength="500" autoResize fluid />
        </div>
        <template #footer>
          <Button variant="outlined" :label="$t('close')" @click="cancelDialog = false" />
          <Button icon="pi pi-ban" severity="danger" :label="$t('toilet.cancel_program')" :disabled="!cancelReason.trim()" @click="cancelProgram" />
        </template>
      </Dialog>
    </template>
  </div>
</template>
