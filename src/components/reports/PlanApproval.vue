<script setup>
// The plan's own approval (phase 6b) beside its save button: draft → sent → approved, or returned with a note. Parents
// see a plan only once approved; changing an approved plan's goals puts it back to draft. Its flow: the department's
// head, then who asked for the evaluation or the technical supervisor within 72 hours.
import axios from "axios";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { errorText } from "@/utils/accounting";
import FlowDeadline from "@/components/approvals/FlowDeadline.vue";

const props = defineProps({ evaluationId: { type: Number, required: true }, approval: { type: Object, default: null }, dirty: { type: Boolean, default: false } });
const emit = defineEmits(["update:approval"]);
const { t } = useI18n();
const toast = useToast();

const busy = ref(false);
const returning = ref(false);
const note = ref("");
const SEVERITY = { draft: "secondary", pending: "warn", returned: "danger", approved: "success" };
const status = computed(() => props.approval?.status ?? "draft");

async function call(path, body, done) {
  busy.value = true;
  try {
    const { data } = await axios.post(`api/reports/plans/${props.evaluationId}/${path}`, body);
    emit("update:approval", data.plan?.approval ?? null);
    toast.add({ severity: "success", summary: t("success_message"), detail: t(done), life: 2500 });
    returning.value = false;
    note.value = "";
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(e), life: 4500 });
  } finally {
    busy.value = false;
  }
}
const submit = () => call("submit", {}, "papr.sent");
const approve = () => call("decide", { approved: true }, "papr.approved_done");
const sendBack = () => call("decide", { approved: false, note: note.value }, "papr.returned_done");
</script>

<template>
  <div v-if="approval" class="papr">
    <div class="flex flex-wrap items-center gap-2">
      <Tag :value="$t(`papr.status_${status}`)" :severity="SEVERITY[status]" />
      <Button v-if="approval.can_submit" size="small" icon="pi pi-send" :label="$t('papr.submit')" :disabled="dirty" :loading="busy"
        v-tooltip.top="dirty ? $t('papr.save_first') : null" @click="submit" />
      <template v-if="approval.can_decide">
        <Button size="small" icon="pi pi-check" severity="success" :label="$t('papr.approve')" :loading="busy" @click="approve" />
        <Button size="small" icon="pi pi-replay" severity="warn" variant="outlined" :label="$t('papr.return')" :disabled="busy" @click="returning = true" />
      </template>
    </div>
    <small v-if="status === 'returned' && approval.return_note" class="papr-note">{{ $t("papr.returned_with", { note: approval.return_note }) }}</small>
    <small v-if="status === 'approved'" class="text-muted-color">{{ $t("papr.visible") }}</small>
    <small v-else class="text-muted-color">{{ $t("papr.hidden") }}</small>
    <FlowDeadline v-if="approval.flow" :state="approval.flow" />

    <Dialog v-model:visible="returning" modal :header="$t('papr.return')" :style="{ width: '440px', maxWidth: '96vw' }">
      <label for="papr-note" class="block mb-1">{{ $t("papr.note") }}</label>
      <Textarea id="papr-note" v-model="note" rows="3" autoResize class="w-full" />
      <template #footer>
        <Button :label="$t('cancel')" text @click="returning = false" />
        <Button :label="$t('papr.return')" icon="pi pi-replay" severity="warn" :disabled="!note.trim()" :loading="busy" @click="sendBack" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.papr { display: grid; gap: 0.35rem; width: 100%; padding-top: 0.4rem; border-top: 1px dashed var(--p-content-border-color, #e2e8f0); }
.papr-note { color: var(--p-red-600, #dc2626); }
</style>
