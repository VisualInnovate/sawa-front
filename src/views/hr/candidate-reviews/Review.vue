<script setup>
// One file sent to a department head. Waiting: the head approves and books the interview in one of their free times,
// approves and keeps the candidate in the pool (no interview now), or rejects with a reason. Booked: the interview
// screen — the candidate's file beside the department's criteria; the answers save as the head goes, and finishing
// keeps the candidate in the pool, rejects them (with a reason) or passes them to HR to hire. Finished: read only.
import axios from "axios";
import moment from "moment";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import CandidateFile from "@/components/hr/CandidateFile.vue";
import { errorText } from "@/utils/accounting";
import { formatWhen, hrError, loadInterviewer } from "@/utils/interviewer";

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const data = ref(null);
const loading = ref(true);
const id = computed(() => route.params.id);
const review = computed(() => data.value?.review);
const base = computed(() => `api/candidate-reviews/${id.value}`);
const fail = (e) => toast.add({ severity: "error", summary: t("error"), detail: hrError(t, errorText(e)), life: 5000 });

async function load() {
  loading.value = true;
  try {
    data.value = (await axios.get(base.value)).data.data;
    answers.value = Object.fromEntries(data.value.sheet.answers.map((a) => [a.id, a.type === "multiple" ? a.answer ?? [] : a.answer ?? null]));
  } catch (e) {
    fail(e);
  } finally {
    loading.value = false;
  }
}
onMounted(load);

const when = (at) => formatWhen(at, locale.value);

// ---- The decision (waiting, or a new time for a booked interview) ----
const mode = ref(null); // schedule | archive | reject
const slots = ref([]);
const hasHours = ref(true);
const day = ref(null);
const slot = ref(null);
const reason = ref("");
const reasonError = ref("");
const saving = ref(false);

async function start(next) {
  mode.value = next;
  reason.value = "";
  reasonError.value = "";
  slot.value = null;
  if (next !== "schedule") return;
  const res = (await axios.get(`${base.value}/slots`)).data;
  slots.value = res.data;
  hasHours.value = res.has_hours;
  day.value = slots.value[0]?.start.slice(0, 10) ?? null;
}
const days = computed(() => [...new Set(slots.value.map((s) => s.start.slice(0, 10)))]);
const dayLabel = (d) => formatWhen(d, locale.value, "day");
const daySlots = computed(() => slots.value.filter((s) => s.start.startsWith(day.value ?? "-")));

async function decide() {
  if (mode.value === "reject" && reason.value.trim().length < 3) {
    reasonError.value = t("cand.reason_required");
    return;
  }
  if (mode.value === "schedule" && !slot.value) return;
  saving.value = true;
  try {
    await axios.post(`${base.value}/decide`, { decision: mode.value, scheduled_at: slot.value, reason: reason.value.trim() || null });
    toast.add({ severity: "success", summary: t("success_message"), detail: t(`crv.done_${mode.value}`), life: 2500 });
    mode.value = null;
    loadInterviewer(true);
    await load();
  } catch (e) {
    fail(e);
    if (mode.value === "schedule") start("schedule");
  } finally {
    saving.value = false;
  }
}

// ---- The interview ----
const answers = ref({});
const criteria = computed(() => data.value?.sheet.answers ?? []);
const missing = ref([]);
const savingSheet = ref(false);
const finishing = ref(null); // pool | rejected | hire
const finishReason = ref("");
const finishError = ref("");

// The running total as the head answers (the server works it out again when saving).
const live = computed(() => {
  let score = 0;
  let max = 0;
  for (const c of criteria.value) {
    if (c.max === null || c.max === undefined) continue;
    const chosen = [].concat(answers.value[c.id] ?? []);
    score += c.options.filter((o) => chosen.includes(o.label)).reduce((sum, o) => sum + (Number(o.score) || 0), 0);
    max += c.max;
  }
  return max > 0 ? { score, max, percent: Math.round((score / max) * 100) } : null;
});

async function saveSheet(outcome = null) {
  savingSheet.value = true;
  try {
    await axios.post(`${base.value}/interview`, { answers: answers.value, outcome, reason: finishReason.value.trim() || null });
    if (outcome) {
      toast.add({ severity: "success", summary: t("success_message"), detail: t(`crv.finished_${outcome}`), life: 3000 });
      finishing.value = null;
      loadInterviewer(true);
      await load();
    } else {
      toast.add({ severity: "success", summary: t("success_message"), detail: t("crv.sheet_saved"), life: 2000 });
    }
    missing.value = [];
  } catch (e) {
    if (e.response?.data?.errors?.answers) {
      missing.value = criteria.value.filter((c) => c.required && isEmpty(answers.value[c.id])).map((c) => c.id);
      finishing.value = null;
    }
    fail(e);
  } finally {
    savingSheet.value = false;
  }
}
const isEmpty = (v) => v === null || v === undefined || (Array.isArray(v) ? !v.length : String(v).trim() === "");

function openFinish(outcome) {
  missing.value = criteria.value.filter((c) => c.required && isEmpty(answers.value[c.id])).map((c) => c.id);
  if (missing.value.length) {
    toast.add({ severity: "warn", summary: t("crv.err.answers_missing"), life: 4000 });
    return;
  }
  finishing.value = outcome;
  finishReason.value = "";
  finishError.value = "";
}
function finish() {
  if (finishing.value === "rejected" && finishReason.value.trim().length < 3) {
    finishError.value = t("cand.reason_required");
    return;
  }
  saveSheet(finishing.value);
}

const scoreTag = (s) => (s === null || s === undefined || s === "" ? null : `${Number(s) > 0 ? "+" : ""}${Number(s)}`);
const answerText = (a) => (Array.isArray(a.answer) ? a.answer.join("، ") : a.answer) || "—";
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center gap-2 p-4">
      <Button :icon="locale === 'ar' ? 'pi pi-arrow-right' : 'pi pi-arrow-left'" text rounded :aria-label="$t('crv.back')" @click="router.push({ name: 'candidate-reviews' })" />
      <p v-if="data" class="text-xl text-bp-135c65 font-bold m-0">{{ data.file.candidate.name_ar || $t("cand.unnamed") }}</p>
      <Tag v-if="review" :value="review.status === 'interviewed' ? $t(`crv.outcome_${review.outcome}`) : $t(`crv.state_${review.status}`)" class="ms-2" />
    </div>
    <Toast />

    <div v-if="loading && !data" class="flex justify-center p-5"><i class="pi pi-spin pi-spinner text-2xl" /></div>
    <div v-else-if="data" class="crv-layout">
      <!-- The decision / interview -->
      <div class="flex flex-column gap-3">
        <section class="sawa-card p-3 flex flex-column gap-2">
          <div class="flex flex-wrap gap-3 text-sm text-color-secondary">
            <span><i class="pi pi-send" /> {{ $t("crv.sent_by", { name: review.assigner?.name || "—" }) }}</span>
            <span dir="ltr">{{ moment(review.created_at).format("YYYY-MM-DD HH:mm") }}</span>
            <span v-if="review.department"><i class="pi pi-sitemap" /> {{ review.department }}</span>
          </div>
          <p v-if="review.note" class="m-0 crv-note">{{ review.note }}</p>
          <p v-if="review.scheduled_at" class="m-0 crv-when"><i class="pi pi-calendar-clock" /> {{ when(review.scheduled_at) }}</p>
        </section>

        <!-- Waiting for the head's decision -->
        <section v-if="review.status === 'pending' || (review.status === 'scheduled' && mode === 'schedule')" class="sawa-card p-3 flex flex-column gap-3">
          <h3 class="crv-h">{{ review.status === "pending" ? $t("crv.decision") : $t("crv.reschedule") }}</h3>
          <div v-if="review.status === 'pending'" class="crv-choices">
            <button type="button" class="crv-choice" :class="{ 'is-on': mode === 'schedule' }" @click="start('schedule')">
              <i class="pi pi-calendar-plus text-green-600" /><strong>{{ $t("crv.d_schedule") }}</strong><small>{{ $t("crv.d_schedule_hint") }}</small>
            </button>
            <button type="button" class="crv-choice" :class="{ 'is-on': mode === 'archive' }" @click="start('archive')">
              <i class="pi pi-inbox text-blue-600" /><strong>{{ $t("crv.d_archive") }}</strong><small>{{ $t("crv.d_archive_hint") }}</small>
            </button>
            <button type="button" class="crv-choice" :class="{ 'is-on': mode === 'reject' }" @click="start('reject')">
              <i class="pi pi-times-circle text-red-500" /><strong>{{ $t("crv.d_reject") }}</strong><small>{{ $t("crv.d_reject_hint") }}</small>
            </button>
          </div>

          <template v-if="mode === 'schedule'">
            <Message v-if="!hasHours" severity="warn" :closable="false">
              {{ $t("crv.no_hours_self") }}
              <RouterLink :to="{ name: 'candidate-reviews', query: { tab: 'hours' } }">{{ $t("crv.tab_hours") }}</RouterLink>
            </Message>
            <Message v-else-if="!slots.length" severity="warn" :closable="false">{{ $t("crv.no_slots") }}</Message>
            <template v-else>
              <div class="crv-days" role="tablist">
                <button v-for="d in days" :key="d" type="button" role="tab" :aria-selected="day === d" class="crv-day" :class="{ 'is-on': day === d }" @click="day = d; slot = null">
                  {{ dayLabel(d) }}
                </button>
              </div>
              <div class="crv-slots">
                <button v-for="s in daySlots" :key="s.start" type="button" class="crv-slot" :class="{ 'is-on': slot === s.start }" :aria-pressed="slot === s.start" @click="slot = s.start">
                  <bdi dir="ltr">{{ s.start.slice(11) }} – {{ s.end.slice(11) }}</bdi>
                </button>
              </div>
            </template>
            <div class="flex justify-end gap-2">
              <Button v-if="review.status === 'scheduled'" :label="$t('cancel')" text severity="secondary" @click="mode = null" />
              <Button icon="pi pi-check" :label="$t('crv.confirm_time')" :disabled="!slot" :loading="saving" @click="decide" />
            </div>
          </template>
          <template v-else-if="mode">
            <div class="flex flex-column gap-1">
              <label for="crv-reason">{{ mode === "reject" ? $t("cand.reason") : $t("crv.note_optional") }} <span v-if="mode === 'reject'" class="text-red-500">*</span></label>
              <Textarea id="crv-reason" v-model="reason" rows="3" autoResize maxlength="2000" :invalid="!!reasonError" />
              <small v-if="reasonError" class="text-red-500">{{ reasonError }}</small>
            </div>
            <div class="flex justify-end">
              <Button :icon="mode === 'reject' ? 'pi pi-times' : 'pi pi-inbox'" :severity="mode === 'reject' ? 'danger' : 'info'"
                :label="mode === 'reject' ? $t('crv.d_reject') : $t('crv.d_archive')" :loading="saving" @click="decide" />
            </div>
          </template>
        </section>

        <!-- The interview -->
        <section v-if="review.status === 'scheduled' && mode !== 'schedule'" class="sawa-card p-3 flex flex-column gap-3">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h3 class="crv-h">{{ $t("crv.interview") }}</h3>
            <Button icon="pi pi-calendar" :label="$t('crv.reschedule')" size="small" text @click="start('schedule')" />
          </div>
          <div v-if="live" class="crv-score">
            <span>{{ $t("crv.total") }}</span>
            <strong>{{ live.score }} / {{ live.max }}</strong>
            <ProgressBar :value="live.percent" class="flex-1" style="height: 10px" :showValue="false" />
            <strong>{{ live.percent }}%</strong>
          </div>
          <Message v-if="!criteria.length" severity="info" :closable="false">{{ $t("crv.no_criteria") }}</Message>

          <fieldset v-for="c in criteria" :key="c.id" class="crv-q" :class="{ 'is-missing': missing.includes(c.id) }">
            <legend>{{ c.title }} <span v-if="c.required" class="text-red-500">*</span></legend>
            <template v-if="c.type === 'single'">
              <div v-for="(o, i) in c.options" :key="i" class="flex items-center gap-2">
                <RadioButton v-model="answers[c.id]" :inputId="`q${c.id}-${i}`" :name="`q${c.id}`" :value="o.label" />
                <label :for="`q${c.id}-${i}`" class="flex-1">{{ o.label }}</label>
                <Tag v-if="scoreTag(o.score)" severity="secondary" :value="scoreTag(o.score)" />
              </div>
            </template>
            <template v-else-if="c.type === 'multiple'">
              <div v-for="(o, i) in c.options" :key="i" class="flex items-center gap-2">
                <Checkbox v-model="answers[c.id]" :inputId="`q${c.id}-${i}`" :value="o.label" />
                <label :for="`q${c.id}-${i}`" class="flex-1">{{ o.label }}</label>
                <Tag v-if="scoreTag(o.score)" severity="secondary" :value="scoreTag(o.score)" />
              </div>
            </template>
            <Textarea v-else v-model="answers[c.id]" rows="2" autoResize maxlength="3000" :aria-label="c.title" class="w-full" />
            <small v-if="missing.includes(c.id)" class="text-red-500">{{ $t("crv.answer_required") }}</small>
          </fieldset>

          <div class="flex flex-wrap justify-between gap-2 crv-actions">
            <Button icon="pi pi-save" :label="$t('crv.save_sheet')" severity="secondary" outlined :loading="savingSheet && !finishing" @click="saveSheet()" />
            <div class="flex flex-wrap gap-2">
              <Button icon="pi pi-times" :label="$t('crv.o_rejected')" severity="danger" outlined @click="openFinish('rejected')" />
              <Button icon="pi pi-inbox" :label="$t('crv.o_pool')" severity="info" outlined @click="openFinish('pool')" />
              <Button icon="pi pi-check" :label="$t('crv.o_hire')" severity="success" @click="openFinish('hire')" />
            </div>
          </div>
        </section>

        <!-- Finished -->
        <section v-if="!['pending', 'scheduled'].includes(review.status)" class="sawa-card p-3 flex flex-column gap-3">
          <h3 class="crv-h">{{ $t("crv.result") }}</h3>
          <p class="m-0"><strong>{{ review.status === "interviewed" ? $t(`crv.outcome_${review.outcome}`) : $t(`crv.state_${review.status}`) }}</strong>
            <span v-if="review.interviewed_at || review.decided_at" class="text-color-secondary text-sm ms-2" dir="ltr">{{ moment(review.interviewed_at || review.decided_at).format("YYYY-MM-DD HH:mm") }}</span></p>
          <p v-if="review.reason || review.outcome_reason" class="m-0 crv-note">{{ review.outcome_reason || review.reason }}</p>
          <div v-if="review.percent !== null" class="crv-score">
            <span>{{ $t("crv.total") }}</span><strong>{{ review.score }} / {{ review.max_score }}</strong>
            <ProgressBar :value="review.percent" class="flex-1" style="height: 10px" :showValue="false" /><strong>{{ review.percent }}%</strong>
          </div>
          <dl v-if="criteria.length && review.status === 'interviewed'" class="crv-answers">
            <template v-for="a in criteria" :key="a.id">
              <dt>{{ a.title }}</dt>
              <dd>{{ answerText(a) }} <small v-if="a.score !== null && a.score !== undefined" class="text-color-secondary"><bdi dir="ltr">({{ a.score }} / {{ a.max }})</bdi></small></dd>
            </template>
          </dl>
        </section>
      </div>

      <!-- The candidate's file -->
      <aside class="sawa-card p-3">
        <CandidateFile :detail="data.file" :base="base" />
      </aside>
    </div>

    <Dialog :visible="!!finishing" modal :header="finishing ? $t(`crv.o_${finishing}`) : ''" :style="{ width: '480px' }" :breakpoints="{ '640px': '95vw' }" @update:visible="finishing = null">
      <div class="flex flex-column gap-3">
        <p class="m-0 text-color-secondary">{{ finishing ? $t(`crv.o_${finishing}_hint`) : "" }}</p>
        <div class="flex flex-column gap-1">
          <label for="crv-finish-reason">{{ finishing === "rejected" ? $t("cand.reason") : $t("crv.note_optional") }} <span v-if="finishing === 'rejected'" class="text-red-500">*</span></label>
          <Textarea id="crv-finish-reason" v-model="finishReason" rows="3" autoResize maxlength="2000" :invalid="!!finishError" />
          <small v-if="finishError" class="text-red-500">{{ finishError }}</small>
        </div>
      </div>
      <template #footer>
        <Button :label="$t('cancel')" text severity="secondary" @click="finishing = null" />
        <Button icon="pi pi-check" :severity="finishing === 'rejected' ? 'danger' : finishing === 'hire' ? 'success' : 'info'" :label="$t('crv.finish')" :loading="savingSheet" @click="finish" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.crv-layout { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 1rem; align-items: start; }
@media (max-width: 960px) { .crv-layout { grid-template-columns: 1fr; } }
.crv-h { font-size: 1.05rem; font-weight: 800; margin: 0; }
.crv-note { background: var(--p-surface-100, #f1f5f9); border-radius: 10px; padding: 0.6rem 0.8rem; white-space: pre-line; }
.crv-when { font-weight: 800; color: var(--p-primary-color); }
.crv-choices { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 0.6rem; }
.crv-choice { display: grid; gap: 0.3rem; justify-items: start; text-align: start; padding: 0.8rem; border-radius: 14px; border: 2px solid var(--p-content-border-color); background: var(--p-content-background, #fff); cursor: pointer; font: inherit; color: inherit; }
.crv-choice i { font-size: 1.4rem; }
.crv-choice small { color: var(--p-text-muted-color); line-height: 1.5; }
.crv-choice.is-on { border-color: var(--p-primary-color); background: color-mix(in srgb, var(--p-primary-color) 7%, transparent); }
.crv-days { display: flex; gap: 0.4rem; overflow-x: auto; padding-bottom: 0.25rem; }
.crv-day, .crv-slot { border: 1px solid var(--p-content-border-color); background: var(--p-content-background, #fff); border-radius: 10px; padding: 0.45rem 0.75rem; cursor: pointer; font: inherit; color: inherit; white-space: nowrap; }
.crv-day.is-on, .crv-slot.is-on { border-color: var(--p-primary-color); background: var(--p-primary-color); color: var(--p-primary-contrast-color, #fff); }
.crv-slots { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 0.4rem; }
.crv-score { display: flex; align-items: center; gap: 0.6rem; background: var(--p-surface-100, #f1f5f9); border-radius: 12px; padding: 0.6rem 0.8rem; }
.crv-q { border: 1px solid var(--p-content-border-color); border-radius: 12px; padding: 0.6rem 0.8rem 0.8rem; margin: 0; display: grid; gap: 0.45rem; }
.crv-q legend { font-weight: 700; padding: 0 0.3rem; }
.crv-q.is-missing { border-color: #f87171; background: #fef2f2; }
.crv-actions { position: sticky; bottom: 0; background: var(--p-content-background, #fff); padding-top: 0.6rem; border-top: 1px solid var(--p-content-border-color); }
.crv-answers { display: grid; grid-template-columns: minmax(120px, 45%) 1fr; gap: 0.35rem 0.75rem; margin: 0; font-size: 0.9rem; }
.crv-answers dt { color: var(--p-text-muted-color); }
.crv-answers dd { margin: 0; font-weight: 600; }
</style>
