<script setup>
// «إرسال للأهل» of a saved combined report: per department, the report alone, with the plan, or with the plan and the
// tracking. The technical supervisor and the consultant send every department; a head only their own. Only finally
// approved evaluations go (and become visible to the parents). The report saves itself first.
import axios from "axios";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { errorText } from "@/utils/accounting";

const props = defineProps({ reportId: { type: Number, default: null }, beforeOpen: { type: Function, default: null } });
const { t } = useI18n();
const toast = useToast();

const visible = ref(false);
const loading = ref(false);
const sending = ref(false);
const groups = ref([]);
const sentAt = ref(null);
const choice = ref({});
const currentId = ref(null);

const PARTS = [["report"], ["report", "plan"], ["report", "plan", "tracking"]];
const options = computed(() => [{ value: "", label: t("crs.skip") }, ...PARTS.map((p) => ({ value: p.join(","), label: t(`crs.parts_${p.length}`) }))]);
const keyOf = (g) => String(g.department_id ?? 0);
const chosen = computed(() => groups.value.filter((g) => g.may_send && choice.value[keyOf(g)]));

async function open() {
  let id = props.reportId;
  if (props.beforeOpen) id = (await props.beforeOpen()) ?? id;
  if (!id) return;
  currentId.value = id;
  visible.value = true;
  loading.value = true;
  try {
    const { data } = await axios.get(`api/reports/saved/${id}/send`);
    groups.value = data.data;
    sentAt.value = data.sent_at;
    choice.value = Object.fromEntries(data.data.map((g) => [keyOf(g), g.may_send && g.items.some((i) => i.approved) ? (g.sent_parts ?? ["report"]).join(",") : ""]));
  } catch (e) {
    visible.value = false;
    toast.add({ severity: "error", summary: t("error"), detail: errorText(e), life: 4000 });
  } finally {
    loading.value = false;
  }
}
async function send() {
  sending.value = true;
  try {
    const { data } = await axios.post(`api/reports/saved/${currentId.value}/send`, {
      departments: chosen.value.map((g) => ({ department_id: g.department_id, parts: choice.value[keyOf(g)].split(",") })),
    });
    groups.value = data.data;
    sentAt.value = data.report?.sent_at;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("crs.sent_done"), life: 2500 });
    visible.value = false;
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(e), life: 4000 });
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <Button :label="$t('crs.send')" icon="pi pi-send" severity="success" variant="outlined" @click="open" />
  <Dialog v-model:visible="visible" modal :header="$t('crs.title')" :style="{ width: '640px', maxWidth: '96vw' }">
    <div v-if="loading" class="flex justify-center p-4"><i class="pi pi-spin pi-spinner text-2xl" /></div>
    <div v-else class="grid gap-3">
      <small class="text-color-secondary">{{ $t("crs.hint") }}</small>
      <Message v-if="sentAt" severity="info">{{ $t("crs.sent_before", { date: sentAt }) }}</Message>
      <div v-for="g in groups" :key="keyOf(g)" class="crs-group" :class="{ 'is-off': !g.may_send }">
        <div class="flex flex-wrap justify-between gap-2 items-center">
          <b>{{ g.department ?? $t("crs.no_department") }}</b>
          <Select v-if="g.may_send" v-model="choice[keyOf(g)]" :options="options" optionLabel="label" optionValue="value" class="w-64"
            :aria-label="$t('crs.what', { name: g.department ?? $t('crs.no_department') })" />
          <Tag v-else severity="secondary" :value="$t('crs.not_yours')" />
        </div>
        <ul class="crs-items">
          <li v-for="item in g.items" :key="item.key">
            <i :class="item.approved ? 'pi pi-check-circle text-green-600' : 'pi pi-clock text-orange-500'" aria-hidden="true" />
            {{ item.title }} <small v-if="!item.approved" class="text-color-secondary">— {{ $t("crs.not_approved") }}</small>
          </li>
        </ul>
        <small v-if="g.sent_parts" class="text-color-secondary">{{ $t("crs.already", { parts: $t(`crs.parts_${g.sent_parts.length}`) }) }}</small>
      </div>
    </div>
    <template #footer>
      <Button :label="$t('cancel')" text @click="visible = false" />
      <Button :label="$t('crs.send')" icon="pi pi-send" severity="success" :loading="sending" :disabled="!chosen.length" @click="send" />
    </template>
  </Dialog>
</template>

<style scoped>
.crs-group { display: grid; gap: .35rem; padding: .7rem .8rem; border: 1px solid var(--p-content-border-color, #e2e8f0); border-radius: 10px; }
.crs-group.is-off { opacity: .65; }
.crs-items { margin: 0; padding-inline-start: 1rem; display: grid; gap: .15rem; font-size: .88rem; list-style: none; }
</style>
