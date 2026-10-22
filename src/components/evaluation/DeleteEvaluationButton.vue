<script setup>
// Deletes a child's evaluation of any type, with its results, plan, report summary and tracking entries
// (the server removes them together), or with `sideProfileResult` one side profile result of the child.
// After the delete it emits "deleted"; without a listener it goes back to the child's evaluations tab.
import { getCurrentInstance, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import axios from "axios";

const props = defineProps({
  evaluationId: { type: [Number, String], required: true },
  label: { type: Boolean, default: true },
  sideProfileResult: { type: Boolean, default: false },
});
const emit = defineEmits(["deleted"]);
// The attributes (class, size) belong to the button, not to the dialog beside it.
defineOptions({ inheritAttrs: false });

const { t } = useI18n();
const toast = useToast();
const router = useRouter();
const instance = getCurrentInstance();
const visible = ref(false);
const deleting = ref(false);

async function remove() {
  deleting.value = true;
  try {
    await axios.delete(props.sideProfileResult ? `api/evaluations/results/${props.evaluationId}` : `api/evaluations/${props.evaluationId}/delete`);
    visible.value = false;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("evaluation_deleted_successfully"), life: 3000 });
    if (instance?.vnode.props?.onDeleted) emit("deleted", props.evaluationId);
    else router.push({ name: "children-evaluate" });
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message || t("mission_error"), life: 3000 });
  } finally {
    deleting.value = false;
  }
}
</script>

<template>
  <Button v-bind="$attrs" v-can="'evaluations delete'" icon="pi pi-trash" :label="label ? t('evaluation_delete') : undefined" severity="danger" variant="outlined"
    class="print:hidden" v-tooltip.top="label ? null : t('evaluation_delete')" :aria-label="t('evaluation_delete')" @click="visible = true" />
  <Dialog v-model:visible="visible" modal :header="t('evaluation_delete')" :style="{ width: '440px', maxWidth: '95vw' }">
    <p class="m-0">{{ t("evaluation_delete_confirm") }}</p>
    <template #footer>
      <Button :label="t('cancel')" severity="secondary" variant="text" @click="visible = false" />
      <Button :label="t('delete')" icon="pi pi-trash" severity="danger" :loading="deleting" @click="remove" />
    </template>
  </Dialog>
</template>
