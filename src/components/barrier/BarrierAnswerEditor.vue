<script setup>
// «تعديل الإجابات» of a barriers evaluation that is not approved yet: each barrier with its options (0–4) — the chosen
// one's text under it — and, for the barriers that take it, the example. Saving sends a rejected evaluation for
// approval again.
import axios from "axios";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";

const props = defineProps({ evaluationId: { type: [Number, String], required: true } });
const emit = defineEmits(["saved"]);
const { t } = useI18n();
const toast = useToast();

const open = ref(false);
const loading = ref(false);
const saving = ref(false);
const barriers = ref([]);
const original = ref({});

const key = (barrier) => `${barrier.score}|${(barrier.example ?? "").trim()}`;
const changed = computed(() => barriers.value.filter((barrier) => key(barrier) !== original.value[barrier.subtest_id]));
const chosenText = (barrier) => barrier.options.find((option) => option.index === barrier.score)?.text ?? "";

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get(`api/barrier-answer/evaluation/${props.evaluationId}/edit`);
    barriers.value = data.data.barriers;
    original.value = Object.fromEntries(barriers.value.map((barrier) => [barrier.subtest_id, key(barrier)]));
  } catch (e) {
    open.value = false;
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message ?? t("mission_error"), life: 3000 });
  } finally {
    loading.value = false;
  }
}
function start() {
  open.value = true;
  load();
}
async function save() {
  if (!changed.value.length) return;
  saving.value = true;
  try {
    await axios.put(`api/barrier-answer/evaluation/${props.evaluationId}/edit`, {
      answers: changed.value.map((barrier) => ({ subtest_id: barrier.subtest_id, score: barrier.score, example: barrier.takes_example ? barrier.example : null })),
    });
    toast.add({ severity: "success", summary: t("success_message"), detail: t("mae_saved"), life: 2500 });
    open.value = false;
    emit("saved");
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message ?? t("mission_error"), life: 3500 });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <Button icon="pi pi-pencil" :label="$t('mae_edit')" severity="warn" variant="outlined" class="print:hidden" @click="start" />
  <Dialog v-model:visible="open" modal :header="$t('mae_title')" :style="{ width: '56rem' }" :breakpoints="{ '1000px': '96vw' }">
    <div v-if="loading" class="bae-loading"><i class="pi pi-spin pi-spinner" /></div>
    <template v-else-if="barriers.length">
      <p class="bae-hint"><i class="pi pi-info-circle" /> {{ $t("bae_hint") }}</p>
      <div class="bae-body">
        <article v-for="(barrier, i) in barriers" :key="barrier.subtest_id" class="bae-card"
          :class="{ 'is-changed': key(barrier) !== original[barrier.subtest_id] }" :style="{ '--d': `${Math.min(i, 12) * 25}ms` }">
          <header>
            <span class="bae-num ltr">{{ barrier.number }}</span>
            <b>{{ barrier.title }}</b>
            <SelectButton v-model="barrier.score" :options="barrier.options" optionLabel="index" optionValue="index" :allowEmpty="false" :aria-label="barrier.title" />
          </header>
          <p class="bae-answer">{{ chosenText(barrier) }}</p>
          <InputText v-if="barrier.takes_example" v-model="barrier.example" class="w-full" :placeholder="$t('bae_example')" :aria-label="$t('bae_example')" />
        </article>
      </div>
    </template>
    <p v-else class="bae-empty">{{ $t("mae_empty") }}</p>
    <template #footer>
      <span class="bae-count">{{ $t("mae_changed", { n: changed.length }) }}</span>
      <Button :label="$t('cancel')" variant="text" severity="secondary" @click="open = false" />
      <Button icon="pi pi-save" :label="$t('save')" :loading="saving" :disabled="!changed.length" @click="save" />
    </template>
  </Dialog>
</template>

<style scoped>
.bae-loading { display: grid; place-items: center; min-height: 10rem; font-size: 1.6rem; color: #135c65; }
.bae-hint { display: flex; gap: .4rem; margin: 0 0 .7rem; color: #64748b; font-size: .85rem; }
.bae-body { display: grid; gap: .6rem; max-height: 62vh; overflow: auto; padding-inline-end: .3rem; }
.bae-card { display: grid; gap: .4rem; padding: .6rem .75rem; border: 1px solid #e2e8f0; border-radius: 12px; background: #fff; transition: background .2s, border-color .2s;
  animation: bae-in .3s var(--d) ease both; }
.bae-card.is-changed { background: #fffbeb; border-color: #fde68a; }
.bae-card header { display: flex; align-items: center; gap: .6rem; flex-wrap: wrap; }
.bae-card header b { flex: 1; min-width: 10rem; color: #0f3d43; }
.bae-num { display: inline-grid; place-items: center; width: 1.8rem; height: 1.8rem; border-radius: 50%; background: #135c65; color: #fff; font-weight: 800; font-size: .85rem; }
.bae-answer { margin: 0; color: #475569; line-height: 1.6; font-size: .9rem; }
.bae-count { margin-inline-end: auto; color: #64748b; font-size: .85rem; }
.bae-empty { color: #94a3b8; text-align: center; }
@keyframes bae-in { from { opacity: 0; transform: translateY(6px); } }
</style>
