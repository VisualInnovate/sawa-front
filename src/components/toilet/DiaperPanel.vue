<script setup>
// The classroom daily diaper check (wears a diaper but is not ready): four fixed checks, Sunday to Thursday. After the
// snack and before leaving the diaper is changed wet or dry; on arrival and after physiotherapy only when wet.
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { errorText, today } from "@/utils/toilet";

const props = defineProps({
  program: { type: Object, required: true },
  meta: { type: Object, required: true },
  canEdit: Boolean,
});
const emit = defineEmits(["updated"]);
const { t } = useI18n();
const toast = useToast();

const editable = computed(() => props.canEdit && props.program.status === "active");
const iso = (date) => date.toLocaleDateString("en-CA");
const sundayOf = (value) => {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() - date.getDay());
  return date;
};
const weekStart = ref(sundayOf(today()));
const days = computed(() => Array.from({ length: 5 }, (_, i) => {
  const date = new Date(weekStart.value);
  date.setDate(date.getDate() + i);
  return iso(date);
}));
const dayNames = computed(() => [t("weekday.sunday"), t("weekday.monday"), t("weekday.tuesday"), t("weekday.wednesday"), t("weekday.thursday")]);
function shift(weeks) {
  const date = new Date(weekStart.value);
  date.setDate(date.getDate() + weeks * 7);
  weekStart.value = date;
}

const logs = ref([]);
async function load() {
  logs.value = (await axios.get(`api/toilet-programs/${props.program.id}/logs`, { params: { kind: "diaper", from: days.value[0], to: days.value[4] } })).data.data;
}
onMounted(load);
watch(weekStart, load);
const cell = (date, slot) => logs.value.find((log) => log.date === date && log.data.slot === slot);

const dialog = ref(false);
const form = ref({});
function open(date, slot) {
  if (!editable.value || date > today()) return;
  const existing = cell(date, slot);
  const always = props.meta.diaper_slots.find((s) => s.slot === slot)?.always_change;
  form.value = { date, slot, always, dry: existing?.data.dry ?? true, changed: existing?.data.changed ?? !!always, note: existing?.data.note ?? "" };
  dialog.value = true;
}
watch(() => form.value.dry, (dry) => {
  if (dialog.value && !form.value.always) form.value.changed = !dry;
});
const yesNo = computed(() => [{ value: true, label: t("toilet.yes") }, { value: false, label: t("toilet.no") }]);
const saving = ref(false);
async function save() {
  saving.value = true;
  try {
    const { data } = await axios.post(`api/toilet-programs/${props.program.id}/logs`, {
      kind: "diaper", date: form.value.date, data: { slot: form.value.slot, dry: form.value.dry, changed: form.value.changed, note: form.value.note },
    });
    dialog.value = false;
    emit("updated", data.program);
    await load();
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(t, error), life: 4000 });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <b>{{ $t("toilet.diaper_title") }}</b>
      <div class="flex items-center gap-2">
        <Button icon="pi pi-angle-right" variant="text" :aria-label="'-1'" @click="shift(-1)" />
        <span class="ltr">{{ days[0] }} → {{ days[4] }}</span>
        <Button icon="pi pi-angle-left" variant="text" :aria-label="'+1'" @click="shift(1)" />
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-sm border-collapse min-w-[48rem]">
        <thead><tr>
          <th class="p-2 text-start bg-slate-50 border border-slate-200">{{ $t("toilet.time") }}</th>
          <th v-for="(date, i) in days" :key="date" class="p-2 border border-slate-200" :class="date === today() ? 'bg-emerald-50' : 'bg-slate-50'">
            {{ dayNames[i] }}<br /><small class="ltr text-slate-500">{{ date }}</small>
          </th>
        </tr></thead>
        <tbody>
          <tr v-for="slot in meta.diaper_slots" :key="slot.slot">
            <td class="p-2 border border-slate-200">
              <b>{{ $t(`toilet.slot_${slot.slot}`) }}</b><br />
              <small class="text-slate-500">{{ $t(slot.always_change ? "toilet.always_change" : "toilet.change_if_wet") }}</small>
            </td>
            <td v-for="date in days" :key="date" class="p-1 border border-slate-200 text-center">
              <button type="button" class="w-full rounded p-2 flex flex-col items-center gap-1 disabled:cursor-default"
                      :class="editable && date <= today() ? 'hover:bg-slate-100 cursor-pointer' : ''" :disabled="!editable || date > today()" @click="open(date, slot.slot)">
                <template v-if="cell(date, slot.slot)">
                  <Tag :severity="cell(date, slot.slot).data.dry ? 'success' : 'warn'" :value="cell(date, slot.slot).data.dry ? $t('toilet.is_dry') : $t('toilet.is_wet')" />
                  <small v-if="cell(date, slot.slot).data.changed" class="text-slate-600"><i class="pi pi-refresh" aria-hidden="true" /> {{ $t("toilet.changed") }}</small>
                </template>
                <small v-else class="text-slate-400">{{ editable && date <= today() ? $t("toilet.check_slot") : "—" }}</small>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Dialog v-model:visible="dialog" modal :style="{ width: '26rem' }">
      <template #header><b>{{ $t(`toilet.slot_${form.slot}`) }} · <span class="ltr inline-block">{{ form.date }}</span></b></template>
      <div class="flex flex-col gap-3">
        <div class="flex flex-col gap-1"><span>{{ $t("toilet.dry") }}</span><SelectButton v-model="form.dry" :options="yesNo" optionLabel="label" optionValue="value" :allowEmpty="false" /></div>
        <div class="flex flex-col gap-1">
          <span>{{ $t("toilet.changed") }}</span>
          <SelectButton v-model="form.changed" :options="yesNo" optionLabel="label" optionValue="value" :allowEmpty="false" />
          <small class="text-slate-500">{{ $t(form.always ? "toilet.always_change" : "toilet.change_if_wet") }}</small>
        </div>
        <div class="flex flex-col gap-1"><label for="dp-note">{{ $t("toilet.note") }}</label><InputText id="dp-note" v-model="form.note" maxlength="500" fluid /></div>
      </div>
      <template #footer>
        <Button variant="outlined" :label="$t('close')" @click="dialog = false" />
        <Button icon="pi pi-check" :label="$t('toilet.save')" :loading="saving" @click="save" />
      </template>
    </Dialog>
  </div>
</template>
