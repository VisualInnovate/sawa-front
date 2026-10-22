<script setup>
// One dialog for the three moves of a session (permission «session reschedule edit»):
// - postpone: before it starts, to a free hour of the next 14 days;
// - reschedule: a missed session gets a new appointment (a new session) at a free hour;
// - compensate: a missed session is closed with an amount (the system suggests the session's share of the price).
// Each asks why (family / therapist / transport delay, or another reason written out); on an official holiday the
// reason is the holiday and cannot be changed. The free hours come from the server, grouped here by day.
import axios from "axios";
import moment from "moment";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { SESSION_REASONS, dayLabel, timeRange } from "@/utils/studentPrograms";

const props = defineProps({
  session: { type: Object, default: null },
  mode: { type: String, default: "postpone" }, // postpone | reschedule | compensate
});
const emit = defineEmits(["close", "saved"]);

const { t } = useI18n();
const toast = useToast();
const loading = ref(false);
const saving = ref(false);
const form = ref(null);
const choice = ref(null);
const reason = ref({ type: null, note: "" });
const amount = ref(null);
const submitted = ref(false);

const title = computed(() => t(`session_${props.mode}`));
const holiday = computed(() => form.value?.holiday);
const days = computed(() => {
  const groups = {};
  for (const option of form.value?.options ?? []) (groups[option.date] ??= []).push(option);
  return Object.entries(groups).map(([date, options]) => ({ date, options }));
});
const key = (option) => `${option.date}|${option.start}|${option.room_id}|${option.therapist_id}`;
const reasonMissing = computed(() => !holiday.value && (!reason.value.type || (reason.value.type === "other" && !reason.value.note.trim())));
const invalid = computed(() => reasonMissing.value || (props.mode === "compensate" ? amount.value === null || amount.value < 0 : !choice.value));

watch(() => props.session, async (session) => {
  form.value = null;
  choice.value = null;
  reason.value = { type: null, note: "" };
  amount.value = null;
  submitted.value = false;
  if (!session) return;
  loading.value = true;
  try {
    const { data } = await axios.get(`api/program-sessions/${session.id}/reschedule-options`);
    form.value = data.data;
    amount.value = data.data.estimate ?? 0;
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message ?? t("mission_error"), life: 3500 });
    emit("close");
  } finally {
    loading.value = false;
  }
}, { immediate: true });

async function save() {
  submitted.value = true;
  if (invalid.value) return;
  saving.value = true;
  const body = { reason_type: holiday.value ? null : reason.value.type, reason_note: reason.value.note.trim() || null };
  try {
    if (props.mode === "compensate") {
      await axios.post(`api/program-sessions/${props.session.id}/compensate`, { ...body, amount: amount.value });
    } else {
      const [date, start, room_id, therapist_id] = choice.value.split("|");
      await axios.post(`api/program-sessions/${props.session.id}/${props.mode}`, { ...body, date, start, room_id: Number(room_id), therapist_id: Number(therapist_id) });
    }
    toast.add({ severity: "success", summary: t("success_message"), detail: t(`session_${props.mode}_done`), life: 3000 });
    emit("saved");
  } catch (e) {
    const errors = e.response?.data?.errors;
    toast.add({ severity: "error", summary: t("error"), detail: (errors && Object.values(errors)[0]?.[0]) || e.response?.data?.message || t("mission_error"), life: 4000 });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <Dialog :visible="!!session" modal :header="title" :style="{ width: '40rem' }" :breakpoints="{ '760px': '96vw' }" @update:visible="emit('close')">
    <template v-if="session">
      <div class="rs-session">
        <i class="pi pi-calendar" aria-hidden="true" />
        <span><strong>{{ session.child?.name }}</strong> · {{ moment(session.starts_at).format("YYYY-MM-DD") }}
          · <span dir="ltr">{{ timeRange(moment(session.starts_at).format("HH:mm"), moment(session.ends_at).format("HH:mm")) }}</span>
          · {{ session.therapist?.name }}</span>
      </div>

      <div v-if="loading" class="rs-state"><ProgressSpinner style="width: 36px; height: 36px" /></div>

      <template v-else-if="form">
        <!-- The reason: automatic on an official holiday. -->
        <Message v-if="holiday" severity="info" :closable="false" class="mb-3">
          {{ $t("session_holiday_reason", { title: holiday.title }) }}
        </Message>
        <fieldset v-else class="rs-reasons">
          <legend>{{ $t("session_reason") }}</legend>
          <label v-for="type in SESSION_REASONS" :key="type" class="rs-reason" :class="{ 'is-on': reason.type === type }">
            <RadioButton v-model="reason.type" :value="type" :inputId="`reason-${type}`" />
            <span>{{ $t(`session_reason_${type}`) }}</span>
          </label>
          <Textarea v-if="reason.type === 'other'" v-model="reason.note" rows="2" autoResize class="w-full mt-2" :placeholder="$t('session_reason_write')"
            :invalid="submitted && !reason.note.trim()" />
          <small v-if="submitted && reasonMissing" class="rs-error">{{ $t("session_reason_required") }}</small>
        </fieldset>

        <!-- The amount: the system's suggestion, editable. -->
        <div v-if="mode === 'compensate'" class="rs-amount">
          <label for="rs-amount">{{ $t("session_compensation_amount") }}</label>
          <InputNumber v-model="amount" inputId="rs-amount" :min="0" :maxFractionDigits="2" suffix=" JD" class="w-full" :invalid="submitted && amount === null" />
          <small>{{ $t("session_compensation_estimate", { amount: form.estimate }) }}</small>
        </div>

        <!-- The free hours of the next days. -->
        <div v-else class="rs-options">
          <p class="rs-hint">{{ $t("session_free_hours_hint", { days: form.days_ahead }) }}</p>
          <p v-if="!days.length" class="rs-empty">{{ $t("session_no_free_hours") }}</p>
          <section v-for="day in days" :key="day.date" class="rs-day">
            <h4>{{ dayLabel($t, moment(day.date).day()) }} <span dir="ltr">{{ day.date }}</span></h4>
            <div class="rs-hours">
              <label v-for="option in day.options" :key="key(option)" class="rs-hour" :class="{ 'is-on': choice === key(option) }">
                <RadioButton v-model="choice" :value="key(option)" />
                <span>
                  <strong dir="ltr">{{ timeRange(option.start, option.end) }}</strong>
                  <small>{{ option.room_name }} · {{ option.therapist_name }}</small>
                  <small v-if="option.room_age_warning || option.therapist_age_warning" class="rs-age">
                    <i class="pi pi-exclamation-triangle" aria-hidden="true" />
                    {{ [option.room_age_warning && $t("age_ranges.room_warning"), option.therapist_age_warning && $t("age_ranges.therapist_short")].filter(Boolean).join(" · ") }}
                  </small>
                </span>
              </label>
            </div>
          </section>
          <small v-if="submitted && !choice" class="rs-error">{{ $t("session_choose_hour") }}</small>
        </div>
      </template>
    </template>
    <template #footer>
      <Button :label="$t('cancel')" severity="secondary" variant="text" @click="emit('close')" />
      <Button icon="pi pi-check" :label="title" :loading="saving" :disabled="loading || !form" @click="save" />
    </template>
  </Dialog>
</template>

<style scoped>
.rs-session { display: flex; align-items: center; gap: .5rem; padding: .6rem .8rem; margin-bottom: 1rem; border-radius: 10px; background: #f1f7f7; color: #135c65; font-size: .9rem; }
.rs-state { display: grid; place-items: center; padding: 2rem; }
.rs-reasons { margin: 0 0 1rem; padding: .75rem; border: 1px solid #e2e8f0; border-radius: 12px; }
.rs-reasons legend { padding: 0 .35rem; font-weight: 700; color: #0f172a; }
.rs-reason { display: inline-flex; align-items: center; gap: .4rem; margin: .25rem .75rem .25rem 0; cursor: pointer; }
.rs-reason.is-on span { font-weight: 700; color: #135c65; }
.rs-error { display: block; margin-top: .4rem; color: #dc2626; }
.rs-amount { display: grid; gap: .35rem; }
.rs-amount label { font-weight: 700; }
.rs-amount small { color: #64748b; }
.rs-hint { margin: 0 0 .5rem; color: #64748b; font-size: .85rem; }
.rs-empty { padding: 1rem; text-align: center; color: #b45309; background: #fffbeb; border-radius: 10px; }
.rs-options { max-height: 52vh; overflow-y: auto; padding-inline-end: .25rem; }
.rs-day { margin-bottom: .75rem; }
.rs-day h4 { margin: 0 0 .4rem; font-size: .9rem; color: #0f172a; }
.rs-hours { display: grid; grid-template-columns: repeat(auto-fill, minmax(11.5rem, 1fr)); gap: .4rem; }
.rs-hour { display: flex; align-items: center; gap: .5rem; padding: .45rem .6rem; border: 1px solid #e2e8f0; border-radius: 10px; cursor: pointer; transition: border-color .15s, background-color .15s; }
.rs-hour:hover { border-color: #94a3b8; }
.rs-hour.is-on { border-color: #135c65; background: #e6f4f3; }
.rs-hour span { display: grid; line-height: 1.35; }
.rs-hour small { color: #64748b; font-size: .75rem; }
.rs-hour small.rs-age { color: #c2410c; }
</style>
