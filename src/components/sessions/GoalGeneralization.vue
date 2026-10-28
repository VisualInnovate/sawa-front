<script setup>
// «التعميم» of a goal in a running session: environment (classes for day programs, approved by the management; school
// for inclusion programs, shown but not sent yet; home always, approved by the parent on the parents' portal), people
// (sent to every therapist of the program's kind, each confirms or rejects) and tools (later). Every request shows its
// status and, when rejected, the reason; after a rejection it can be asked again.
import axios from "axios";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";

const props = defineProps({
  sessionId: { type: [String, Number], required: true },
  goal: { type: Object, required: true },
  kind: { type: String, default: null }, // the session program's kind: day | inclusion | clinics
  canEdit: { type: Boolean, default: false },
});
const emit = defineEmits(["updated", "close"]);
const { t } = useI18n();
const toast = useToast();

const view = ref("menu"); // menu | environment | people
const sending = ref(null);
const SEVERITY = { pending: "warn", approved: "success", rejected: "danger" };

const OPTIONS = computed(() => [
  { key: "environment", icon: "pi pi-home", title: t("gen_environment"), hint: t("gen_environment_hint") },
  { key: "people", icon: "pi pi-users", title: t("gen_people"), hint: t("gen_people_hint") },
  { key: "tools", icon: "pi pi-wrench", title: t("gen_tools"), hint: t("gen_later"), disabled: true },
]);
// classes on day programs, school on inclusion programs, home always.
const PLACES = computed(() => [
  props.kind === "day" && { key: "classes", icon: "pi pi-building", title: t("gen_classes"), hint: t("gen_classes_hint"), item: props.goal.gen?.classes },
  props.kind === "inclusion" && { key: "school", icon: "pi pi-graduation-cap", title: t("gen_school"), hint: t("gen_school_hint"), soon: true },
  { key: "home", icon: "pi pi-heart", title: t("gen_home"), hint: t("gen_home_hint"), item: props.goal.gen?.home },
].filter(Boolean));

const people = computed(() => props.goal.gen?.people ?? []);
const count = (status) => people.value.filter((item) => item.status === status).length;
const statusText = (item) => (item ? t(`gen_status_${item.status}`) : t("gen_status_none"));
const canAsk = (item) => props.canEdit && (!item || item.status === "rejected");

async function send(type) {
  sending.value = type;
  try {
    const { data } = await axios.post(`api/program-sessions/${props.sessionId}/goals/${props.goal.id}/generalizations`, { type });
    emit("updated", data.data);
    toast.add({ severity: "success", summary: t("success_message"), detail: t("gen_sent"), life: 2500 });
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message ?? t("mission_error"), life: 3000 });
  } finally {
    sending.value = null;
  }
}
</script>

<template>
  <Dialog visible modal :header="`${goal.code} · ${$t('gen_title')}`" :style="{ width: '36rem' }" :breakpoints="{ '640px': '94vw' }" @update:visible="$emit('close')">
    <p class="gg-goal">{{ goal.goal }}</p>

    <Transition name="gg-view" mode="out-in">
      <!-- the three kinds -->
      <div v-if="view === 'menu'" key="menu" class="gg-options">
        <button v-for="(option, i) in OPTIONS" :key="option.key" type="button" class="gg-option" :class="{ 'is-disabled': option.disabled }"
          :disabled="option.disabled" :style="{ '--d': `${i * 60}ms` }" @click="view = option.key">
          <i :class="option.icon" />
          <b>{{ option.title }}</b>
          <small>{{ option.hint }}</small>
        </button>
      </div>

      <!-- environment: classes / school / home -->
      <div v-else-if="view === 'environment'" key="environment" class="gg-list">
        <div v-for="(place, i) in PLACES" :key="place.key" class="gg-row" :style="{ '--d': `${i * 60}ms` }">
          <i :class="place.icon" class="gg-row-icon" />
          <div class="gg-row-text">
            <b>{{ place.title }}</b>
            <small>{{ place.hint }}</small>
            <small v-if="place.item?.status === 'rejected' && place.item.note" class="gg-note"><i class="pi pi-comment" /> {{ place.item.note }}</small>
          </div>
          <Tag v-if="place.soon" severity="secondary" :value="$t('gen_not_available')" />
          <template v-else>
            <Tag :severity="SEVERITY[place.item?.status] ?? 'secondary'" :value="statusText(place.item)" />
            <Button v-if="canAsk(place.item)" size="small" icon="pi pi-send" :label="place.item ? $t('gen_resend') : $t('gen_request')"
              :loading="sending === place.key" @click="send(place.key)" />
          </template>
        </div>
      </div>

      <!-- people: every therapist of the program's kind -->
      <div v-else-if="view === 'people'" key="people" class="gg-list">
        <div class="gg-people-head">
          <span>{{ $t("gen_people_summary", { approved: count("approved"), rejected: count("rejected"), pending: count("pending") }) }}</span>
          <Button v-if="canEdit" size="small" icon="pi pi-send" :label="people.length ? $t('gen_people_resend') : $t('gen_people_send')"
            :loading="sending === 'people'" @click="send('people')" />
        </div>
        <p v-if="!people.length" class="gg-empty">{{ $t("gen_people_none") }}</p>
        <div v-for="(item, i) in people" :key="item.id" class="gg-row" :style="{ '--d': `${i * 40}ms` }">
          <i class="pi pi-user gg-row-icon" />
          <div class="gg-row-text">
            <b>{{ item.recipient }}</b>
            <small v-if="item.status === 'rejected' && item.note" class="gg-note"><i class="pi pi-comment" /> {{ item.note }}</small>
          </div>
          <Tag :severity="SEVERITY[item.status]" :value="statusText(item)" />
        </div>
      </div>
    </Transition>

    <template #footer>
      <Button v-if="view !== 'menu'" icon="pi pi-arrow-right" :label="$t('back')" variant="text" severity="secondary" @click="view = 'menu'" />
      <Button :label="$t('close')" severity="secondary" @click="$emit('close')" />
    </template>
  </Dialog>
</template>

<style scoped>
.gg-goal { margin: 0 0 .9rem; color: #475569; line-height: 1.6; }
.gg-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: .7rem; }
.gg-option { display: flex; flex-direction: column; align-items: center; gap: .35rem; padding: 1.1rem .6rem; border-radius: 16px; border: 2px solid #e2e8f0;
  background: #fff; cursor: pointer; font: inherit; text-align: center; animation: gg-pop .35s var(--d) ease both;
  transition: transform .2s cubic-bezier(.34, 1.56, .64, 1), border-color .2s, box-shadow .2s; }
.gg-option i { font-size: 1.7rem; color: #0f8a7e; }
.gg-option b { color: rgb(var(--bp-135c65)); }
.gg-option small { color: #64748b; font-size: .75rem; }
.gg-option:hover:not(:disabled) { transform: translateY(-4px); border-color: #0f8a7e; box-shadow: 0 12px 24px -18px rgb(var(--bp-135c65)); }
.gg-option.is-disabled { opacity: .5; cursor: not-allowed; }
.gg-option.is-disabled i { color: #94a3b8; }
.gg-list { display: grid; gap: .55rem; }
.gg-row { display: flex; align-items: center; gap: .7rem; padding: .7rem .8rem; border-radius: 14px; border: 1px solid #e2e8f0; background: #fff;
  animation: gg-slide .3s var(--d) ease both; }
.gg-row-icon { font-size: 1.3rem; color: #0f8a7e; }
.gg-row-text { display: grid; gap: .1rem; flex: 1; min-width: 0; }
.gg-row-text small { color: #64748b; font-size: .75rem; }
.gg-note { color: #b91c1c !important; }
.gg-people-head { display: flex; align-items: center; justify-content: space-between; gap: .6rem; padding: .5rem .7rem; border-radius: 12px; background: #f0fdfa; color: #115e59; font-weight: 700; }
.gg-empty { margin: .5rem 0; color: #94a3b8; text-align: center; }
.gg-view-enter-active, .gg-view-leave-active { transition: all .25s ease; }
.gg-view-enter-from { opacity: 0; transform: translateX(-24px); }
.gg-view-leave-to { opacity: 0; transform: translateX(24px); }
@keyframes gg-pop { from { opacity: 0; transform: scale(.85); } }
@keyframes gg-slide { from { opacity: 0; transform: translateY(8px); } }
</style>
