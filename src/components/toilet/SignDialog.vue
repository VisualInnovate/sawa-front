<script setup>
// The parent signs on the device: the 4.4 initial assessment (agreeing to open the program) or the 4.6 consent
// (with the day training starts, which also sends the parents the procedures notice).
import axios from "axios";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import SignaturePad from "@/components/contracts/SignaturePad.vue";
import { errorText, today } from "@/utils/toilet";

const props = defineProps({
  visible: Boolean,
  program: { type: Object, required: true },
  document: { type: String, required: true }, // initial | consent
  meta: { type: Object, default: null },
});
const emit = defineEmits(["update:visible", "updated"]);
const { t } = useI18n();
const toast = useToast();

const form = ref({ signer: "", image: null, start_date: today() });
const saving = ref(false);
watch(() => props.visible, (open) => {
  if (open) form.value = { signer: "", image: null, start_date: today() };
});
const total = computed(() => (props.meta?.clothes?.academy ?? 3) + (props.meta?.clothes?.bag ?? 1));

async function save() {
  saving.value = true;
  try {
    const { data } = await axios.post(`api/toilet-programs/${props.program.id}/sign`, {
      document: props.document,
      signer: form.value.signer,
      image: form.value.image,
      start_date: props.document === "consent" ? form.value.start_date : undefined,
    });
    toast.add({ severity: "success", summary: t("toilet.saved"), life: 2500 });
    emit("updated", data.data);
    emit("update:visible", false);
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(t, error), life: 4000 });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <Dialog :visible="visible" modal :header="$t(document === 'initial' ? 'toilet.sign_initial' : 'toilet.sign_consent')" :style="{ width: '36rem' }"
          :breakpoints="{ '768px': '95vw' }" @update:visible="emit('update:visible', $event)">
    <div class="flex flex-col gap-3">
      <template v-if="document === 'consent'">
        <p class="m-0 leading-7 p-3 rounded-lg bg-slate-50 border border-slate-200">{{ $t("toilet.consent_terms") }}</p>
        <small class="text-slate-600">{{ $t("toilet.clothes_notice", { total, academy: meta?.clothes?.academy ?? 3 }) }}</small>
        <div class="flex flex-col gap-1">
          <label for="ts-start" class="font-semibold">{{ $t("toilet.start_date") }}</label>
          <InputText id="ts-start" v-model="form.start_date" type="date" class="ltr" />
        </div>
      </template>
      <div class="flex flex-col gap-1">
        <label for="ts-signer" class="font-semibold">{{ $t("toilet.signer") }}</label>
        <InputText id="ts-signer" v-model="form.signer" maxlength="120" fluid />
      </div>
      <div class="flex flex-col gap-1">
        <span class="font-semibold">{{ $t("toilet.signature") }}</span>
        <SignaturePad v-model="form.image" />
      </div>
    </div>
    <template #footer>
      <Button variant="outlined" :label="$t('close')" @click="emit('update:visible', false)" />
      <Button icon="pi pi-check" :label="$t('toilet.sign_btn')" :loading="saving" :disabled="!form.signer.trim() || !form.image || (document === 'consent' && !form.start_date)" @click="save" />
    </template>
  </Dialog>
</template>
