<script setup>
// The weekly toilet check (no diaper): offer the toilet every hour on day 1, every 1 h 15 on day 2 and every 1 h 30
// from day 3; once the child asks it is "on request". After each urination every independence step gets its prompt
// level (FP · PP · G · FV · other), left empty when the child did it alone.
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { errorText, minutesText, nowTime, today } from "@/utils/toilet";

const props = defineProps({
  program: { type: Object, required: true },
  meta: { type: Object, required: true },
  canEdit: Boolean,
});
const emit = defineEmits(["updated"]);
const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const editable = computed(() => props.canEdit && props.program.status === "active");
const logs = ref([]);
const loading = ref(false);
async function load() {
  loading.value = true;
  try {
    logs.value = (await axios.get(`api/toilet-programs/${props.program.id}/logs`, { params: { kind: "weekly" } })).data.data;
  } finally {
    loading.value = false;
  }
}
onMounted(load);

const blank = () => ({ date: today(), time: nowTime(), data: { urinated_in: null, outside: null, request: null, steps: {}, note: "" } });
const form = ref(blank());
const codes = computed(() => [{ value: "", label: t("toilet.independent") }, ...props.meta.prompts.map((value) => ({ value, label: value }))]);
const nextTime = computed(() => props.program.times.find((time) => time >= nowTime()) ?? null);

const saving = ref(false);
async function save() {
  saving.value = true;
  try {
    const { data } = await axios.post(`api/toilet-programs/${props.program.id}/logs`, { kind: "weekly", ...form.value });
    toast.add({ severity: data.changes?.weekly_mode ? "info" : "success", summary: t("toilet.saved"), detail: data.changes?.weekly_mode ? t("toilet.mode_switched") : undefined, life: 3000 });
    form.value = { ...blank(), date: form.value.date };
    emit("updated", data.program);
    await load();
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(t, error), life: 4000 });
  } finally {
    saving.value = false;
  }
}

async function setMode(mode) {
  try {
    const { data } = await axios.put(`api/toilet-programs/${props.program.id}/stage`, { weekly_mode: mode });
    emit("updated", data.data);
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(t, error), life: 4000 });
  }
}

function remove(log) {
  confirm.require({
    header: t("toilet.delete_record"),
    message: `${log.date} ${log.time ?? ""}`,
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger",
    accept: async () => {
      try {
        const { data } = await axios.delete(`api/toilet-programs/${props.program.id}/logs/${log.id}`);
        emit("updated", data.program);
        await load();
      } catch (error) {
        toast.add({ severity: "error", summary: t("error"), detail: errorText(t, error), life: 3000 });
      }
    },
  });
}
const yes = (value) => (value === true ? t("toilet.yes") : value === false ? t("toilet.no") : "");
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="grid lg:grid-cols-3 gap-3">
      <div class="p-3 rounded-lg border border-sky-200 bg-sky-50 flex flex-col gap-2">
        <div class="flex items-center justify-between gap-2">
          <b class="text-lg">{{ $t("toilet.weekly_day", { n: program.weekly_day }) }}</b>
          <Tag :severity="program.weekly_mode === 'on_request' ? 'success' : 'info'" :value="$t(`toilet.mode_${program.weekly_mode}`)" />
        </div>
        <span>{{ $t("toilet.current_interval") }}: <b>{{ minutesText($t, program.interval) }}</b></span>
        <small class="text-slate-600">{{ $t("toilet.weekly_rule") }}</small>
        <div v-if="editable" class="flex gap-2">
          <Button size="small" variant="outlined" :label="$t('toilet.mode_timed')" :disabled="program.weekly_mode === 'timed'" @click="setMode('timed')" />
          <Button size="small" variant="outlined" :label="$t('toilet.mode_on_request')" :disabled="program.weekly_mode === 'on_request'" @click="setMode('on_request')" />
        </div>
      </div>
      <div class="p-3 rounded-lg border border-slate-200 bg-white flex flex-col gap-2 lg:col-span-2">
        <b>{{ $t("toilet.schedule_title") }}</b>
        <div v-if="program.times.length" class="flex flex-wrap gap-1">
          <Tag v-for="time in program.times" :key="time" :severity="time === nextTime ? 'success' : 'secondary'" class="ltr num">{{ time }}</Tag>
        </div>
        <span v-else class="text-slate-600">{{ $t("toilet.on_request") }}</span>
        <small class="text-slate-500">{{ $t("toilet.times_hint") }}</small>
      </div>
    </div>

    <div v-if="editable" class="p-3 rounded-lg border border-slate-200 bg-white flex flex-col gap-3">
      <b>{{ $t("toilet.add_weekly") }}</b>
      <div class="flex flex-wrap gap-3 items-end">
        <div class="flex flex-col gap-1"><label for="wk-date">{{ $t("toilet.date") }}</label><InputText id="wk-date" v-model="form.date" type="date" class="ltr" /></div>
        <div class="flex flex-col gap-1"><label for="wk-time">{{ $t("toilet.time") }}</label><InputText id="wk-time" v-model="form.time" type="time" class="ltr" /></div>
        <label v-for="flag in ['urinated_in', 'outside', 'request']" :key="flag" class="flex items-center gap-2 pb-2">
          <Checkbox v-model="form.data[flag]" binary :inputId="`wk-${flag}`" />{{ $t(`toilet.${flag}`) }}
        </label>
      </div>
      <div class="flex flex-col gap-2">
        <b class="text-sm">{{ $t("toilet.steps_codes") }}</b>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          <div v-for="step in meta.weekly_steps" :key="step" class="flex items-center justify-between gap-2 p-2 rounded border border-slate-200">
            <label :for="`wk-s-${step}`" class="text-sm">{{ $t(`toilet.w_${step}`) }}</label>
            <Select :inputId="`wk-s-${step}`" v-model="form.data.steps[step]" :options="codes" optionLabel="label" optionValue="value" :placeholder="$t('toilet.independent')" class="w-32" size="small" />
          </div>
        </div>
        <small class="text-slate-500">{{ meta.prompts.map((p) => $t(`toilet.prompt_${p}`)).join(" · ") }} · {{ $t("toilet.independent") }} = —</small>
      </div>
      <div class="flex flex-col gap-1"><label for="wk-note">{{ $t("toilet.note") }}</label><InputText id="wk-note" v-model="form.data.note" maxlength="500" fluid /></div>
      <Button icon="pi pi-plus" :label="$t('toilet.add_weekly')" :loading="saving" :disabled="!form.date || !form.time" class="self-start" @click="save" />
    </div>

    <div class="flex flex-col gap-2">
      <b>{{ $t("toilet.records") }}</b>
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse min-w-[60rem] [&_th]:whitespace-nowrap">
          <thead><tr class="text-slate-500">
            <th class="p-1 text-start">{{ $t("toilet.date") }}</th><th class="p-1 text-start">{{ $t("toilet.time") }}</th>
            <th class="p-1 text-start">{{ $t("toilet.urinated_in") }}</th><th class="p-1 text-start">{{ $t("toilet.outside") }}</th><th class="p-1 text-start">{{ $t("toilet.request") }}</th>
            <th v-for="step in meta.weekly_steps" :key="step" class="p-1 text-start">{{ $t(`toilet.w_${step}`) }}</th><th />
          </tr></thead>
          <tbody>
            <tr v-if="!loading && !logs.length"><td :colspan="6 + meta.weekly_steps.length" class="p-3 text-center text-slate-500">{{ $t("toilet.no_records") }}</td></tr>
            <tr v-for="log in logs" :key="log.id" class="border-t border-slate-100">
              <td class="p-1 ltr text-start whitespace-nowrap">{{ log.date }}</td>
              <td class="p-1 ltr text-start">{{ log.time }}</td>
              <td class="p-1">{{ yes(log.data.urinated_in) }}</td>
              <td class="p-1" :class="{ 'text-red-700 font-semibold': log.data.outside }">{{ yes(log.data.outside) }}</td>
              <td class="p-1">{{ yes(log.data.request) }}</td>
              <td v-for="step in meta.weekly_steps" :key="step" class="p-1 font-mono">{{ log.data.steps?.[step] ?? "—" }}</td>
              <td class="p-1 w-10"><Button v-if="editable" size="small" variant="text" severity="danger" icon="pi pi-trash" :aria-label="$t('toilet.delete_record')" @click="remove(log)" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
