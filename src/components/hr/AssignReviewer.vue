<script setup>
// Sends a checked candidate file to a department head. The specialty's default head is picked already (set on the
// specialties list in the HR settings); HR may choose anyone. Heads without free interview times are marked.
import axios from "axios";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { errorText } from "@/utils/accounting";
import { hrError } from "@/utils/interviewer";

const props = defineProps({ candidate: { type: Object, default: null } });
const emit = defineEmits(["close", "done"]);

const { t } = useI18n();
const toast = useToast();
const reviewers = ref([]);
const reviewerId = ref(null);
const note = ref("");
const saving = ref(false);
const error = ref("");

watch(
  () => props.candidate?.id,
  async (id) => {
    if (!id) return;
    reviewerId.value = null;
    note.value = "";
    error.value = "";
    const { data } = await axios.get("api/candidate-reviews/reviewers", { params: { candidate_id: id } });
    reviewers.value = data.data;
    reviewerId.value = data.default;
  },
  { immediate: true },
);

const chosen = computed(() => reviewers.value.find((r) => r.user_id === reviewerId.value));
const label = (r) => `${r.name}${r.department ? ` — ${r.department}` : ""}`;

async function send() {
  if (!reviewerId.value) {
    error.value = t("crv.pick_reviewer");
    return;
  }
  saving.value = true;
  try {
    await axios.post(`api/candidates/${props.candidate.id}/assign`, { reviewer_id: reviewerId.value, note: note.value.trim() || null });
    toast.add({ severity: "success", summary: t("success_message"), detail: t("crv.assigned", { name: chosen.value?.name }), life: 2500 });
    emit("done");
  } catch (e) {
    error.value = hrError(t, errorText(e));
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <Dialog :visible="!!candidate" modal :header="$t('crv.assign_title')" :style="{ width: '520px' }" :breakpoints="{ '640px': '95vw' }" @update:visible="emit('close')">
    <div class="flex flex-column gap-3">
      <p class="m-0 text-color-secondary">{{ $t("crv.assign_hint", { name: candidate?.name_ar || $t("cand.unnamed") }) }}</p>
      <div class="flex flex-column gap-1">
        <label for="as-reviewer">{{ $t("crv.reviewer") }} <span class="text-red-500">*</span></label>
        <Select inputId="as-reviewer" v-model="reviewerId" :options="reviewers" optionValue="user_id" :optionLabel="label" filter :invalid="!!error && !reviewerId"
          :placeholder="$t('crv.pick_reviewer')">
          <template #option="{ option }">
            <div class="flex items-center justify-between gap-2 w-full">
              <span>{{ option.name }} <small v-if="option.department" class="text-color-secondary">— {{ option.department }}</small></span>
              <span class="flex gap-1">
                <Tag v-if="option.head" severity="info" :value="$t('crv.head')" />
                <Tag v-if="!option.has_hours" severity="warn" :value="$t('crv.no_hours_tag')" />
              </span>
            </div>
          </template>
        </Select>
        <small v-if="chosen && !chosen.has_hours" class="text-orange-600">{{ $t("crv.no_hours_warn") }}</small>
      </div>
      <div class="flex flex-column gap-1">
        <label for="as-note">{{ $t("crv.note_to_head") }}</label>
        <Textarea id="as-note" v-model="note" rows="3" autoResize maxlength="2000" />
      </div>
      <small v-if="error" class="text-red-500">{{ error }}</small>
    </div>
    <template #footer>
      <Button :label="$t('cancel')" text severity="secondary" @click="emit('close')" />
      <Button icon="pi pi-send" :label="$t('crv.send_to_head')" :loading="saving" @click="send" />
    </template>
  </Dialog>
</template>
