<script setup>
// An evaluation's approval on its result page: waiting (a new VB-MAPP level / Carolina round too), approved (locked)
// or rejected with the reason for the therapist. Whoever approves evaluations answers it here.
// Pass `evaluationId`, or a side profile's `childId` + `sideEvaluationId`, or the barriers' `childId` + `type`.
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import DecisionDialog from "@/components/sessions/DecisionDialog.vue";
import { refreshPendingCounts } from "@/utils/pendingCounts";

const props = defineProps({
  evaluationId: { type: [Number, String], default: null },
  childId: { type: [Number, String], default: null },
  sideEvaluationId: { type: [Number, String], default: null },
  type: { type: [Number, String], default: null },
});
const { t } = useI18n();
const toast = useToast();
const emit = defineEmits(["loaded"]);
const state = ref(null);
const answering = ref(false);
const deciding = ref(false);

async function load() {
  const params = props.evaluationId ? { evaluation: props.evaluationId }
    : props.sideEvaluationId ? { child: props.childId, side_evaluation: props.sideEvaluationId }
      : { child: props.childId, type: props.type };
  try {
    state.value = (await axios.get("api/evaluation-approvals/lookup", { params })).data.data;
  } catch {
    state.value = null;
  }
  emit("loaded", state.value);
}
async function decide(answer) {
  deciding.value = true;
  try {
    state.value = { ...(await axios.post(`api/evaluation-approvals/${state.value.key}/decide`, answer)).data.data, can_decide: true };
    emit("loaded", state.value);
    answering.value = false;
    refreshPendingCounts();
    toast.add({ severity: "success", summary: t("success_message"), detail: answer.approved ? t("ea_approved_done") : t("ea_rejected_done"), life: 2500 });
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message ?? t("mission_error"), life: 3000 });
  } finally {
    deciding.value = false;
  }
}
onMounted(load);
watch(() => [props.evaluationId, props.childId, props.sideEvaluationId, props.type], load);
defineExpose({ reload: load });
</script>

<template>
  <Transition name="ab-in">
    <div v-if="state?.status" class="ab-banner" :class="`is-${state.status}`" role="status">
      <i :class="{ pending: 'pi pi-clock', approved: 'pi pi-lock', rejected: 'pi pi-times-circle' }[state.status]" aria-hidden="true" />
      <div class="ab-text">
        <b>{{ $t(`ea_status_${state.status}`) }}</b>
        <span v-if="state.status === 'pending'">{{ state.extension ? $t("ea_pending_extension") : $t("ea_pending_hint") }}</span>
        <span v-else-if="state.status === 'approved'">{{ $t("ea_approved_hint", { date: state.approved_at }) }}</span>
        <span v-else>{{ $t("ea_rejected_hint", { note: state.note || "—" }) }}</span>
      </div>
      <Button v-if="state.can_decide && state.status === 'pending'" size="small" icon="pi pi-check-square" :label="$t('decision_answer')" @click="answering = true" />
      <DecisionDialog :visible="answering" :title="$t('ea_decide')" :loading="deciding" @update:visible="answering = false" @decide="decide" />
    </div>
  </Transition>
</template>

<style scoped>
.ab-banner { display: flex; align-items: center; gap: .7rem; margin: .6rem 0; padding: .65rem .9rem; border-radius: 12px; border: 1px solid; }
.ab-banner > i { font-size: 1.3rem; }
.ab-text { display: grid; flex: 1; min-width: 0; line-height: 1.5; }
.ab-text span { font-size: .85rem; }
.ab-banner.is-pending { background: #fffbeb; border-color: #fde68a; color: #92400e; }
.ab-banner.is-approved { background: #ecfdf5; border-color: #a7f3d0; color: #065f46; }
.ab-banner.is-rejected { background: #fef2f2; border-color: #fecaca; color: #991b1b; }
.ab-in-enter-active { transition: all .3s ease; }
.ab-in-enter-from { opacity: 0; transform: translateY(-6px); }
@media print { .ab-banner { display: none; } }
</style>
