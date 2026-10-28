<script setup>
// Preparing a session's break schedule before it starts: the two tables, save, print each, and «الجدولة جاهزة».
// Saving changes nothing in the session; the therapist sees (and may edit) the tables when they start it.
import axios from "axios";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import moment from "moment";
import BreakTables from "@/components/sessions/BreakTables.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const session = ref(null);
const schedule = ref(null);
const dirty = ref(false);
const saving = ref(false);

async function load() {
  const { data } = await axios.get(`api/program-sessions/${route.params.id}/workspace`);
  session.value = data.data.session;
  schedule.value = data.data.break_schedule;
  dirty.value = false;
}

async function save(ready = null) {
  saving.value = true;
  try {
    const { data } = await axios.put(`api/program-sessions/${route.params.id}/break-schedule`, {
      trials: schedule.value.trials, minutes: schedule.value.minutes, ...(ready === null ? {} : { ready }),
    });
    schedule.value = data.data;
    dirty.value = false;
    toast.add({ severity: "success", summary: t("success_message"), detail: ready ? t("break_marked_ready") : t("break_saved"), life: 2500 });
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message ?? t("mission_error"), life: 3500 });
  } finally {
    saving.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div class="flex flex-column gap-3">
    <div class="sawa-card p-3 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <Button icon="pi pi-arrow-right" variant="text" rounded :aria-label="$t('back')" @click="router.push({ name: 'sessions' })" />
        <div>
          <p class="text-xl text-bp-135c65 font-bold m-0">{{ $t("break_schedule") }}</p>
          <p v-if="session" class="text-sm text-color-secondary m-0">
            {{ session.child?.name }} · {{ moment(session.starts_at).format("YYYY-MM-DD HH:mm") }} · {{ session.therapist?.name }}
          </p>
        </div>
      </div>
      <div v-if="schedule" class="flex flex-wrap items-center gap-2">
        <Tag v-if="schedule.ready_at" severity="success" icon="pi pi-check" :value="$t('break_ready')" />
        <Tag v-else-if="schedule.saved" severity="warn" :value="$t('break_draft')" />
        <Button icon="pi pi-save" :label="$t('save')" variant="outlined" :loading="saving" :disabled="!dirty" @click="save()" />
        <Button v-if="!schedule.ready_at" icon="pi pi-verified" :label="$t('break_mark_ready')" :loading="saving" @click="save(true)" />
        <Button v-else icon="pi pi-undo" :label="$t('break_mark_draft')" severity="secondary" variant="outlined" :loading="saving" @click="save(false)" />
      </div>
    </div>
    <div v-if="!schedule" class="flex justify-center p-5"><i class="pi pi-spin pi-spinner text-2xl" /></div>
    <BreakTables v-else v-model="schedule" editable :childName="session?.child?.name" @change="dirty = true" />
    <Toast />
  </div>
</template>
