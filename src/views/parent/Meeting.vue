<script setup>
// A meeting request about a child who already has an accepted consultation: the time the parent suggests, where,
// and a note; the academy answers from the dashboard.
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import axios from "axios";
import PageHead from "@/components/parent/PageHead.vue";
import { useParentPortalStore } from "@/stores/ParentPortal";

const props = defineProps({ child_id: { type: [String, Number], required: true } });
const { t } = useI18n();
const router = useRouter();
const toast = useToast();
const portal = useParentPortalStore();
onMounted(() => portal.load());

const child = computed(() => portal.childById(props.child_id));
const form = ref({ meeting_time: null, location: "", notes: "" });
const submitted = ref(false);
const sending = ref(false);
const done = ref(false);

const toIso = (date) => {
  if (!date) return null;
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
};

async function submit() {
  submitted.value = true;
  if (!form.value.meeting_time || !form.value.location.trim()) return;
  sending.value = true;
  try {
    await axios.post("api/parent-meeting", { data: { ...form.value, meeting_time: toIso(form.value.meeting_time) }, child_id: props.child_id });
    done.value = true;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("تم اضاف الاجتماع "), life: 3000 });
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: error.response?.data?.message ?? t("mission_error"), life: 4000 });
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <div class="pp-page">
    <Toast />
    <PageHead :title="$t('pp.meeting_title')" :lead="$t('meeting_request_hint')" :back="child ? { name: 'parent-child', params: { child_id } } : { name: 'clidreen_parents' }" :kicker="child?.name" icon="pi pi-user" />

    <div v-if="done" class="pp-card pp-card--pad pp-done pp-in">
      <i class="pi pi-check-circle" aria-hidden="true" />
      <h2 class="pp-h2">{{ $t("pp.meeting_sent_title") }}</h2>
      <p class="pp-lead">{{ $t("pp.meeting_sent_text") }}</p>
      <div class="pp-row justify-center">
        <router-link :to="{ name: 'webHome' }" class="pp-btn">{{ $t("pp.nav_home") }}</router-link>
        <router-link v-if="child" :to="{ name: 'parent-child', params: { child_id } }" class="pp-btn pp-btn--ghost">{{ $t("pp.child_file") }}</router-link>
      </div>
    </div>

    <form v-else class="pp-card pp-card--pad pp-stack pp-in max-w-[640px]" novalidate data-no-request-spinner @submit.prevent="submit">
      <div class="pp-field is-required">
        <label for="m-time">{{ $t("meeting_suggested_time") }}</label>
        <DatePicker id="m-time" v-model="form.meeting_time" showTime hourFormat="12" dateFormat="yy-mm-dd" :minDate="new Date()" :placeholder="$t('meeting_pick_time')" fluid :invalid="submitted && !form.meeting_time" />
      </div>
      <div class="pp-field is-required">
        <label for="m-location">{{ $t("meeting_location") }}</label>
        <InputText id="m-location" v-model="form.location" :placeholder="$t('meeting_location_hint')" fluid :invalid="submitted && !form.location.trim()" />
      </div>
      <div class="pp-field">
        <label for="m-notes">{{ $t("notes") }}</label>
        <Textarea id="m-notes" v-model="form.notes" rows="4" autoResize fluid />
      </div>
      <Button type="submit" :label="$t('submit')" icon="pi pi-send" :loading="sending" size="large" />
    </form>
  </div>
</template>

<style scoped>
.pp-done {
  display: grid;
  justify-items: center;
  gap: 0.6rem;
  text-align: center;
  max-width: 560px;
}
.pp-done > .pi {
  font-size: 3rem;
  color: var(--pp-success);
}
</style>
