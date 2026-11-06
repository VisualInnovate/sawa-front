<script setup>
// An evaluation's approval on its result page. With the approval flow (phase 4): its status of the nine (waiting for
// the head, approved by the head, rejected…), who acts now and the time left, the decision for whoever the flow
// names, sending it to the parents, and its history. A department with no head yet: the old one-step approval.
// Pass `evaluationId`, or a side profile's `childId` + `sideEvaluationId`, or the barriers' `childId` + `type`.
import axios from "axios";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
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
const sending = ref(false);
const showHistory = ref(false);

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
    state.value = (await axios.post(`api/evaluation-approvals/${state.value.key}/decide`, answer)).data.data;
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
async function send() {
  sending.value = true;
  try {
    state.value = (await axios.post(`api/evaluation-approvals/${state.value.key}/send`)).data.data;
    emit("loaded", state.value);
    toast.add({ severity: "success", summary: t("success_message"), detail: t("ewf.sent_done"), life: 2500 });
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message ?? t("mission_error"), life: 3000 });
  } finally {
    sending.value = false;
  }
}

// The nine statuses when the flow has one; else the old three.
const wf = computed(() => state.value?.workflow_status ?? null);
const tone = computed(() => {
  const s = wf.value ?? state.value?.status;
  if (["sent", "auto_sent", "final_approved", "approved"].includes(s)) return "approved";
  if (["first_rejected", "second_rejected", "rejected"].includes(s)) return "rejected";
  return "pending";
});
const icon = computed(() => ({ pending: "pi pi-clock", approved: "pi pi-lock", rejected: "pi pi-times-circle" })[tone.value]);
const title = computed(() => (state.value?.flow === "engine" || ["sent", "auto_sent"].includes(wf.value)) && wf.value
  ? t(`ewf.status_${wf.value}`) : t(`ea_status_${state.value?.status}`));
const printable = computed(() => state.value?.printable ?? state.value?.status === "approved");

// Nothing of an evaluation is printed before its first approval: the print button only says so, and a browser print
// (Ctrl+P) gives a page with that message instead of the result.
const nativePrint = window.print;
let printLocked = false;
function blockedPrint() {
  toast.add({ severity: "warn", summary: t("ea_print_locked"), detail: t("ea_print_locked_hint"), life: 3500 });
}
function lockPrint(locked) {
  if (locked === printLocked) return;
  printLocked = locked;
  document.body.classList.toggle("ea-print-locked", locked);
  document.body.dataset.printLocked = locked ? t("ea_print_locked") : "";
  window.print = locked ? blockedPrint : nativePrint;
}
watch(state, (value) => lockPrint(!!value?.status && !(value.printable ?? value.status === "approved")));
onBeforeUnmount(() => lockPrint(false));

onMounted(load);
watch(() => [props.evaluationId, props.childId, props.sideEvaluationId, props.type], load);
defineExpose({ reload: load });
</script>

<template>
  <Transition name="ab-in">
    <div v-if="state?.status" class="ab-banner" :class="`is-${tone}`" role="status">
      <i :class="icon" aria-hidden="true" />
      <div class="ab-text">
        <b>{{ title }}</b>
        <template v-if="state.flow === 'engine' && state.stage">
          <span>{{ $t("ewf.waiting_for", { stage: state.stage.name, names: (state.approvers || []).join("، ") || "—" }) }}</span>
          <span v-if="state.due_at">{{ $t("ewf.due", { date: state.due_at }) }}</span>
          <span v-if="state.on_behalf_of">{{ $t("apf.for", { name: state.on_behalf_of }) }}</span>
        </template>
        <span v-else-if="state.status === 'pending'">{{ state.extension ? $t("ea_pending_extension") : $t("ea_pending_hint") }}</span>
        <span v-if="state.note && tone === 'rejected' && wf !== 'second_rejected'">{{ $t("ea_rejected_hint", { note: state.note }) }}</span>
        <span v-else-if="state.note && wf === 'second_rejected'">{{ $t("ewf.note", { note: state.note }) }}</span>
        <span v-if="wf === 'final_approved'">{{ $t("ewf.final_hint") }}</span>
        <span v-else-if="state.sent_at">{{ $t("ewf.sent_hint", { date: state.sent_at }) }}</span>
        <span v-else-if="state.status === 'approved' && !wf">{{ $t("ea_approved_hint", { date: state.approved_at }) }}</span>
        <span v-if="!printable" class="ab-muted">{{ $t("ewf.print_after_first") }}</span>
        <button v-if="state.history?.length" type="button" class="ab-link" @click="showHistory = !showHistory">
          {{ showHistory ? $t("ewf.hide_history") : $t("ewf.show_history") }}
        </button>
        <ol v-if="showHistory" class="ab-history">
          <li v-for="(h, i) in state.history" :key="i">
            <bdi>{{ h.at }}</bdi> — <b>{{ $t(`apf.action_${h.action}`) }}</b><template v-if="h.user"> · {{ h.user }}</template>
            <template v-if="h.on_behalf_of"> ({{ $t("apf.for", { name: h.on_behalf_of }) }})</template>
            <div v-if="h.note" class="ab-note">{{ h.note }}</div>
          </li>
        </ol>
      </div>
      <div class="flex flex-column gap-2">
        <Button v-if="state.can_decide" size="small" icon="pi pi-check-square" :label="$t('decision_answer')" @click="answering = true" />
        <Button v-if="state.can_send" size="small" icon="pi pi-send" severity="success" :label="$t('ewf.send')" :loading="sending" @click="send" />
      </div>
      <DecisionDialog :visible="answering" :title="$t('ea_decide')" :loading="deciding" @update:visible="answering = false" @decide="decide" />
    </div>
  </Transition>
</template>

<style scoped>
.ab-banner { display: flex; align-items: flex-start; gap: .7rem; margin: .6rem 0; padding: .65rem .9rem; border-radius: 12px; border: 1px solid; }
.ab-banner > i { font-size: 1.3rem; margin-top: .15rem; }
.ab-text { display: grid; flex: 1; min-width: 0; line-height: 1.5; }
.ab-text span { font-size: .85rem; }
.ab-muted { opacity: .8; }
.ab-link { background: none; border: 0; padding: 0; color: inherit; text-decoration: underline; cursor: pointer; font-size: .82rem; justify-self: start; }
.ab-history { margin: .3rem 0 0; padding-inline-start: 1rem; font-size: .82rem; display: grid; gap: .2rem; }
.ab-note { background: rgba(255, 255, 255, .6); border-radius: 6px; padding: .1rem .4rem; }
.ab-banner.is-pending { background: #fffbeb; border-color: #fde68a; color: #92400e; }
.ab-banner.is-approved { background: #ecfdf5; border-color: #a7f3d0; color: #065f46; }
.ab-banner.is-rejected { background: #fef2f2; border-color: #fecaca; color: #991b1b; }
.ab-in-enter-active { transition: all .3s ease; }
.ab-in-enter-from { opacity: 0; transform: translateY(-6px); }
@media print { .ab-banner { display: none; } }
</style>

<style>
@media print {
  body.ea-print-locked > * { display: none !important; }
  body.ea-print-locked::before { content: attr(data-print-locked); display: block; padding: 3rem; text-align: center; font-size: 1.4rem; }
}
</style>
