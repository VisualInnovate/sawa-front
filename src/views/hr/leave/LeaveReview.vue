<script setup>
// «مراجعة طلب إجازة»: the two-step leave as the head or HR sees it — warnings, the steps, the balance and every item of
// the employee's schedule during the leave with its substitute or decision; approve (head → HR, HR → done) or reject.
// The employee sees the same page without the actions.
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import Timeline from "primevue/timeline";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const toast = useToast();

const leave = ref(null);
const loading = ref(true);
const busy = ref(false);
const note = ref("");
const rejectOpen = ref(false);
const rejectReason = ref("");
const rejectError = ref("");

// The item being decided, its candidates and the session's free hours.
const item = ref(null);
const decideOpen = ref(false);
const action = ref("substitute");
const candidates = ref([]);
const candidatesLoading = ref(false);
const search = ref("");
const chosen = ref(null);
const applyToProgram = ref(false);
const postponeOptions = ref([]);
const postponeChoice = ref(null);
const postponeDate = ref("");
const postponeFrom = ref("");
const postponeTo = ref("");
const decideError = ref("");

const id = computed(() => route.params.id);
const can = computed(() => leave.value?.can ?? {});
const pending = computed(() => ["pending_head", "pending_hr"].includes(leave.value?.stage));

const load = async () => {
  loading.value = true;
  try {
    leave.value = (await axios.get(`/api/leaves/${id.value}/review`)).data.data;
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message || t("mission_error"), life: 5000 });
  } finally {
    loading.value = false;
  }
};
onMounted(load);

const stageSeverity = (stage) => ({ pending_head: "warn", pending_hr: "warn", approved: "success", rejected: "danger" }[stage] ?? "secondary");
const unit = (u) => t(u === "hour" || u === "hours" ? "hrleave.hours" : "hrleave.days");
const period = computed(() => {
  const l = leave.value;
  if (!l) return "";
  return l.start_date ? `${l.start_date}${l.end_date !== l.start_date ? " → " + l.end_date : ""}` : `${l.off_date} ${l.start_time?.slice(0, 5)}–${l.end_time?.slice(0, 5)}`;
});
const warningText = (w) => {
  if (w.code === "no_balance") return t("lflow.w_no_balance", { remaining: `${w.remaining} ${unit(w.unit)}`, requested: `${w.requested} ${unit(w.unit)}` });
  if (w.code === "low_balance") return t("lflow.w_low_balance", { after: `${w.after} ${unit(w.unit)}` });
  if (w.code === "no_substitute") return t("lflow.w_no_substitute", { count: w.count });
  if (w.code === "unpaid") return t("lflow.w_unpaid", { month: w.month });
  return t(`lflow.w_${w.code}`);
};
const warningSeverity = (w) => (["no_balance", "no_substitute", "overlap"].includes(w.code) ? "error" : "warn");

// The items by day.
const days = computed(() => {
  const groups = {};
  for (const row of leave.value?.items ?? []) (groups[row.date] ??= []).push(row);
  return Object.entries(groups);
});
const itemTitle = (row) => [row.start ? row.start : null, t(`lflow.type_${row.type}`),
  row.child?.name ?? row.title ?? row.room ?? null].filter(Boolean).join(" · ");
const itemSub = (row) => [row.treatment, row.room && row.type !== "room_admin" ? row.room : null, row.program_kind].filter(Boolean).join(" · ");
const itemTone = (row) => (!row.decision ? "bad" : row.decision === "substitute" ? "ok" : "warn");
const rankText = (s) => (s?.source === "program" ? t("lflow.program_rank", { rank: s.rank }) : s?.source === "employee" ? t("lflow.employee_rank", { rank: s.rank }) : "");
const payloadText = (row) => {
  const p = row.payload ?? {};
  if (row.decision === "postpone") return `${p.date ?? ""} ${p.start ?? p.start_time ?? ""}`;
  if (row.decision === "compensate") return t("lflow.action_compensate_hint");
  if (row.decision === "cancel") return t("lflow.action_cancel_hint");
  return "";
};

// ---- deciding an item ----
const openDecide = async (row, first = "substitute") => {
  item.value = row;
  action.value = first;
  chosen.value = row.substitute?.id ?? null;
  applyToProgram.value = false;
  search.value = "";
  decideError.value = "";
  postponeChoice.value = null;
  postponeDate.value = row.date;
  postponeFrom.value = row.start ?? "";
  postponeTo.value = row.end ?? "";
  decideOpen.value = true;
  loadCandidates();
  if (row.type === "session") {
    postponeOptions.value = [];
    axios.get(`/api/leaves/${id.value}/items/${row.key}/postpone-options`).then(({ data }) => (postponeOptions.value = data.data ?? [])).catch(() => {});
  }
};
const loadCandidates = async () => {
  candidatesLoading.value = true;
  try {
    candidates.value = (await axios.get(`/api/leaves/${id.value}/items/${item.value.key}/candidates`, { params: { search: search.value || undefined } })).data.data;
  } finally {
    candidatesLoading.value = false;
  }
};
const sameDepartment = computed(() => candidates.value.filter((c) => c.same_department));
const others = computed(() => candidates.value.filter((c) => !c.same_department));
const availabilitySeverity = (a) => ({ free: "success", busy: "danger", on_leave: "secondary", off_shift: "secondary" }[a] ?? "secondary");
const postponeLabel = (o) => `${o.date} ${o.start}–${o.end} · ${o.room_name} · ${o.therapist_name}`;

const saveDecision = async () => {
  decideError.value = "";
  const body = { action: action.value };
  if (action.value === "substitute") {
    const pick = candidates.value.find((c) => c.id === chosen.value);
    if (!pick) return (decideError.value = t("lflow.pick_substitute"));
    if (pick.availability !== "free" && !window.confirm(t("lflow.busy_confirm", { name: pick.name }))) return;
    Object.assign(body, { user_id: pick.id, apply_to_program: applyToProgram.value });
  } else if (action.value === "postpone") {
    if (item.value.type === "session") {
      const o = postponeOptions.value[postponeChoice.value];
      if (!o) return (decideError.value = t("lflow.action_postpone_hint"));
      Object.assign(body, { date: o.date, start: o.start, room_id: o.room_id, therapist_id: o.therapist_id });
    } else {
      Object.assign(body, { date: postponeDate.value, start_time: postponeFrom.value || null, end_time: postponeTo.value || null });
    }
  }
  busy.value = true;
  try {
    leave.value = (await axios.put(`/api/leaves/${id.value}/items/${item.value.key}`, body)).data.data;
    decideOpen.value = false;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("successful"), life: 2500 });
  } catch (e) {
    decideError.value = Object.values(e.response?.data?.errors ?? {}).flat()[0] || e.response?.data?.message || t("mission_error");
  } finally {
    busy.value = false;
  }
};
const clearDecision = async (row) => {
  busy.value = true;
  try {
    leave.value = (await axios.put(`/api/leaves/${id.value}/items/${row.key}`, { action: "clear" })).data.data;
  } finally {
    busy.value = false;
  }
};

// ---- approving / rejecting ----
const approve = async () => {
  busy.value = true;
  try {
    const step = leave.value.stage === "pending_hr" ? "hr-approve" : "head-approve";
    await axios.post(`/api/leaves/${id.value}/${step}`, { note: note.value || null });
    toast.add({ severity: "success", summary: t("success_message"), detail: t("successful"), life: 3000 });
    note.value = "";
    await load();
  } catch (e) {
    const errors = e.response?.data?.errors;
    toast.add({ severity: "error", summary: t("error"), detail: errors?.items ? t("lflow.needs_decisions", { count: errors.items.length }) : e.response?.data?.message || t("mission_error"), life: 6000 });
    await load();
  } finally {
    busy.value = false;
  }
};
const finalNow = async () => {
  busy.value = true;
  try {
    await axios.post(`/api/leaves/${id.value}/hr-approve`, { note: note.value || null });
    toast.add({ severity: "success", summary: t("success_message"), detail: t("successful"), life: 3000 });
    await load();
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message || t("mission_error"), life: 6000 });
  } finally {
    busy.value = false;
  }
};
const reject = async () => {
  rejectError.value = "";
  if (!rejectReason.value.trim()) return (rejectError.value = t("lflow.reject_reason"));
  busy.value = true;
  try {
    leave.value = (await axios.post(`/api/leaves/${id.value}/reject`, { reason: rejectReason.value })).data.data;
    rejectOpen.value = false;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("successful"), life: 3000 });
  } catch (e) {
    rejectError.value = e.response?.data?.message || t("mission_error");
  } finally {
    busy.value = false;
  }
};
const openSchedule = () => router.push({ name: "staff-schedules",
  query: { user: leave.value.employee.user_id, tab: "employee", from: leave.value.start_date ?? leave.value.off_date } });
const openProfile = () => router.push({ name: "employee-profile", params: { id: leave.value.employee.user_id } });
</script>

<template>
  <div class="page leave-review">
    <Toast />
    <div class="page-header">
      <div class="flex items-center gap-2">
        <Button icon="pi pi-arrow-right" variant="text" rounded :aria-label="$t('back')" @click="router.back()" />
        <h1 class="page-title">{{ $t("lflow.review_title") }} <span v-if="leave" class="text-muted-color">#{{ leave.id }}</span></h1>
      </div>
      <Tag v-if="leave" :value="$t(`lflow.stage_${leave.stage}`)" :severity="stageSeverity(leave.stage)" />
    </div>

    <div v-if="loading" class="flex justify-center py-10"><ProgressSpinner style="width: 48px; height: 48px" /></div>

    <div v-else-if="leave" class="review-grid">
      <div class="review-main">
        <div v-if="leave.warnings.length" class="flex flex-col gap-2">
          <Message v-for="w in leave.warnings" :key="w.code" :severity="warningSeverity(w)" :closable="false">{{ warningText(w) }}</Message>
        </div>

        <section class="card review-card">
          <div class="flex items-center justify-between gap-3 flex-wrap">
            <div class="flex items-center gap-3">
              <Avatar :label="leave.employee.name?.charAt(0)" shape="circle" size="large" />
              <div class="flex flex-col">
                <b class="text-lg">{{ leave.employee.name }}</b>
                <span class="text-muted-color text-sm">{{ [leave.employee.department, leave.employee.position].filter(Boolean).join(" · ") }}</span>
              </div>
            </div>
            <div class="flex gap-2" v-if="leave.employee.user_id">
              <Button :label="$t('lflow.employee_file')" icon="pi pi-id-card" severity="secondary" variant="outlined" size="small" v-can="'employees list'" @click="openProfile" />
              <Button :label="$t('lflow.employee_schedule')" icon="pi pi-calendar" severity="secondary" variant="outlined" size="small" v-can="'staff schedules list'" @click="openSchedule" />
            </div>
          </div>
          <dl class="review-kv">
            <dt>{{ $t("leave_type") }}</dt>
            <dd>{{ leave.leave_setup.title }} · {{ leave.leave_setup.deduct_from === "salary" ? $t("lflow.unpaid") : $t("lflow.from_balance") }}</dd>
            <dt>{{ $t("hrleave.period") }}</dt>
            <dd dir="ltr" class="text-start">{{ period }}</dd>
            <dt>{{ leave.start_date ? $t("hrleave.days") : $t("hrleave.hours") }}</dt>
            <dd>{{ leave.start_date ? leave.total_days : leave.total_hours }}</dd>
            <template v-if="leave.reason"><dt>{{ $t("request_reason") }}</dt><dd>{{ leave.reason }}</dd></template>
            <template v-if="leave.balance"><dt>{{ $t("lflow.balance") }}</dt>
              <dd dir="ltr" class="text-start" :class="{ 'text-red-600': leave.balance.after < 0 }">{{ leave.balance.before }} → {{ leave.balance.after }}</dd></template>
            <template v-if="leave.attachment"><dt>{{ $t("lflow.attachment") }}</dt><dd><a :href="leave.attachment" target="_blank" rel="noopener">{{ $t("lflow.attachment") }}</a></dd></template>
          </dl>
          <p v-if="pending && leave.balance?.unpaid_days_if_approved > 0" class="text-amber-700 text-sm m-0">{{ $t("lflow.unpaid_if_approved", { days: leave.balance.unpaid_days_if_approved }) }}</p>
          <p v-if="leave.unpaid_days > 0" class="text-amber-700 text-sm m-0">{{ $t("lflow.unpaid_if_approved", { days: leave.unpaid_days }) }}</p>
          <p class="text-muted-color text-sm m-0">{{ $t("lflow.leaves_this_year", leave.leaves_this_year) }}</p>
        </section>

        <section class="card review-card">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold m-0">{{ $t("lflow.items") }}</h2>
            <Tag v-if="leave.undecided" :value="$t('lflow.undecided', { count: leave.undecided })" severity="danger" />
          </div>
          <p v-if="!leave.items.length" class="text-muted-color m-0">{{ $t("lflow.no_items") }}</p>
          <div v-for="[day, rows] in days" :key="day" class="flex flex-col gap-2">
            <b class="text-primary text-sm" dir="ltr">{{ day }}</b>
            <div v-for="row in rows" :key="row.key" class="review-item" :class="`review-item--${itemTone(row)}`">
              <div class="flex items-center justify-between gap-2 flex-wrap">
                <b>{{ itemTitle(row) }}</b>
                <div class="flex gap-1 items-center">
                  <Tag v-if="row.is_new" :value="$t('lflow.new_item')" severity="info" />
                  <Tag :value="row.decision ? $t(`lflow.decision_${row.decision}`) : $t('lflow.no_substitute')" :severity="row.decision ? (row.decision === 'substitute' ? 'success' : 'warn') : 'danger'" />
                </div>
              </div>
              <span v-if="itemSub(row)" class="text-muted-color text-sm">{{ itemSub(row) }}</span>
              <div class="flex items-center justify-between gap-2 flex-wrap">
                <span class="text-sm">
                  <template v-if="row.decision === 'substitute' && row.substitute">
                    {{ row.substitute.name }} <Tag v-if="row.substitute.department" :value="row.substitute.department" severity="secondary" class="text-xs" />
                    <span v-if="!row.decided && row.suggested" class="text-muted-color"> · {{ $t("lflow.suggested") }} · {{ rankText(row.suggested) }}</span>
                  </template>
                  <template v-else>{{ payloadText(row) }}</template>
                </span>
                <div v-if="can.assign && pending" class="flex gap-1">
                  <Button v-if="row.decided" :label="$t('lflow.clear')" size="small" variant="text" severity="secondary" :disabled="busy" @click="clearDecision(row)" />
                  <Button :label="row.decision ? $t('lflow.change') : $t('lflow.assign')" icon="pi pi-user-edit" size="small"
                    :severity="row.decision ? 'secondary' : 'danger'" variant="outlined" @click="openDecide(row)" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <aside class="review-side">
        <section class="card review-card">
          <h2 class="text-lg font-bold m-0">{{ $t("lflow.stage") }}</h2>
          <Timeline :value="[{ step: 'submitted' }, ...leave.approvals]" class="review-timeline">
            <template #marker="{ item: s }">
              <span class="review-dot" :class="s.step === 'submitted' || s.decision === 'approved' ? 'ok' : s.decision === 'rejected' ? 'bad' : s.waiting ? 'now' : ''">
                <i :class="s.step === 'submitted' || s.decision === 'approved' ? 'pi pi-check' : s.decision === 'rejected' ? 'pi pi-times' : 'pi pi-clock'" />
              </span>
            </template>
            <template #content="{ item: s }">
              <div v-if="s.step === 'submitted'" class="flex flex-col"><b>{{ $t("lflow.submitted") }}</b><small class="text-muted-color">{{ leave.applied_on }}</small></div>
              <div v-else class="flex flex-col">
                <b>{{ $t(`lflow.step_${s.step}`) }}</b>
                <small v-if="s.decision" class="text-muted-color">{{ $t(s.decision === "approved" ? "lflow.approved_by" : "lflow.rejected_by", { name: s.approver?.name ?? "" }) }} · {{ s.at }}</small>
                <small v-else-if="s.waiting && s.approvers?.length" class="text-muted-color">{{ $t("lflow.waiting_for", { names: s.approvers.map((a) => a.name).join("، ") }) }}</small>
                <small v-if="s.note" class="review-note">«{{ s.note }}»</small>
              </div>
            </template>
          </Timeline>
          <p v-if="leave.rejected_reason && leave.stage === 'rejected'" class="text-red-600 text-sm m-0">{{ leave.rejected_reason }}</p>
        </section>

        <section v-if="pending" class="card review-card">
          <template v-if="can.approve">
            <label for="review-note" class="font-semibold text-sm">{{ $t("lflow.note") }}</label>
            <Textarea id="review-note" v-model="note" rows="2" autoResize fluid />
            <Button v-if="leave.stage === 'pending_head'" :label="$t('lflow.head_approve')" icon="pi pi-check" :loading="busy" @click="approve" />
            <Button v-if="leave.stage === 'pending_head' && can.final" :label="$t('lflow.final_approve')" icon="pi pi-check-circle" severity="secondary"
              :disabled="leave.undecided > 0" :loading="busy" @click="finalNow" />
            <Button v-if="leave.stage === 'pending_hr'" :label="$t('lflow.final_approve')" icon="pi pi-check-circle" :disabled="leave.undecided > 0" :loading="busy" @click="approve" />
            <small v-if="leave.stage === 'pending_hr' && leave.undecided" class="text-red-600">{{ $t("lflow.needs_decisions", { count: leave.undecided }) }}</small>
            <Button :label="$t('lflow.reject')" icon="pi pi-times" severity="danger" variant="outlined" :disabled="busy" @click="rejectOpen = true" />
          </template>
          <Message v-else severity="secondary" :closable="false">{{ $t("lflow.not_yours") }}</Message>
        </section>
      </aside>
    </div>

    <Dialog v-model:visible="decideOpen" modal :header="item ? itemTitle(item) : ''" :style="{ width: '560px' }" :breakpoints="{ '640px': '95vw' }">
      <div v-if="item" class="flex flex-col gap-3">
        <SelectButton v-model="action" :options="item.actions" :allowEmpty="false" :optionLabel="(a) => $t(`lflow.action_${a}`)" />

        <template v-if="action === 'substitute'">
          <IconField><InputIcon class="pi pi-search" /><InputText v-model="search" :placeholder="$t('search')" fluid @keyup.enter="loadCandidates" @input="loadCandidates" /></IconField>
          <div v-if="candidatesLoading" class="flex justify-center py-4"><ProgressSpinner style="width: 32px; height: 32px" /></div>
          <div v-else class="cand-list">
            <template v-for="[label, list] in [[$t('lflow.same_department', { name: leave.employee.department ?? '' }), sameDepartment], [$t('lflow.other_employees'), others]]" :key="label">
              <b v-if="list.length" class="text-primary text-sm">{{ label }}</b>
              <label v-for="c in list" :key="c.id" class="cand" :class="{ on: chosen === c.id }">
                <RadioButton v-model="chosen" :value="c.id" :inputId="`cand-${c.id}`" />
                <span class="flex flex-col flex-1">
                  <span class="flex items-center gap-2 flex-wrap"><b>{{ c.name }}</b>
                    <Tag v-if="c.department" :value="c.department" severity="secondary" class="text-xs" />
                    <Tag v-if="c.substitute_rank" :value="c.rank_source === 'program' ? $t('lflow.program_rank', { rank: c.substitute_rank }) : $t('lflow.employee_rank', { rank: c.substitute_rank })" class="text-xs" />
                  </span>
                  <small class="text-muted-color">{{ [c.position, c.busy_with].filter(Boolean).join(" · ") }}</small>
                </span>
                <Tag :value="$t(`lflow.${c.reason === 'this_leave' ? 'this_leave' : c.availability}`)" :severity="availabilitySeverity(c.availability)" />
              </label>
            </template>
          </div>
          <label v-if="item.program_id" class="flex items-center gap-2 text-sm"><Checkbox v-model="applyToProgram" binary inputId="apply-program" /> {{ $t("lflow.apply_to_program") }}</label>
        </template>

        <template v-else-if="action === 'postpone'">
          <template v-if="item.type === 'session'">
            <p class="text-muted-color m-0">{{ $t("lflow.action_postpone_hint") }}</p>
            <p v-if="!postponeOptions.length" class="m-0">{{ $t("lflow.no_options") }}</p>
            <Select v-else v-model="postponeChoice" :options="postponeOptions.map((o, i) => ({ i, label: postponeLabel(o) }))" optionLabel="label" optionValue="i" filter fluid />
          </template>
          <div v-else class="grid grid-cols-3 gap-2">
            <div class="flex flex-col gap-1"><label for="pp-date" class="text-sm">{{ $t("lflow.new_date") }}</label><InputText id="pp-date" v-model="postponeDate" type="date" /></div>
            <div class="flex flex-col gap-1"><label for="pp-from" class="text-sm">{{ $t("lflow.from") }}</label><InputText id="pp-from" v-model="postponeFrom" type="time" /></div>
            <div class="flex flex-col gap-1"><label for="pp-to" class="text-sm">{{ $t("lflow.to") }}</label><InputText id="pp-to" v-model="postponeTo" type="time" /></div>
          </div>
        </template>
        <p v-else class="m-0 text-muted-color">{{ $t(`lflow.action_${action}_hint`) }}</p>

        <Message v-if="decideError" severity="error" :closable="false">{{ decideError }}</Message>
      </div>
      <template #footer>
        <Button :label="$t('cancel')" variant="text" severity="secondary" @click="decideOpen = false" />
        <Button :label="$t('save')" icon="pi pi-check" :loading="busy" @click="saveDecision" />
      </template>
    </Dialog>

    <Dialog v-model:visible="rejectOpen" modal :header="$t('lflow.reject')" :style="{ width: '440px' }">
      <div class="flex flex-col gap-2">
        <label for="reject-reason" class="font-semibold">{{ $t("lflow.reject_reason") }}</label>
        <Textarea id="reject-reason" v-model="rejectReason" rows="3" autoResize fluid />
        <small v-if="rejectError" class="text-red-600">{{ rejectError }}</small>
      </div>
      <template #footer>
        <Button :label="$t('cancel')" variant="text" severity="secondary" @click="rejectOpen = false" />
        <Button :label="$t('lflow.reject')" severity="danger" :loading="busy" @click="reject" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.review-grid { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 1rem; align-items: start; }
.review-main, .review-side { display: flex; flex-direction: column; gap: 1rem; }
.review-card { display: flex; flex-direction: column; gap: .75rem; margin: 0; }
.review-kv { display: grid; grid-template-columns: auto 1fr; gap: .4rem 1rem; margin: 0; font-size: .95rem; }
.review-kv dt { color: var(--p-text-muted-color); }
.review-kv dd { margin: 0; font-weight: 600; }
.review-item { display: flex; flex-direction: column; gap: .35rem; padding: .7rem .9rem; border-radius: 12px; background: var(--p-content-background);
  border: 1px solid var(--p-content-border-color); border-inline-start: 5px solid var(--p-primary-color); }
.review-item--ok { border-inline-start-color: var(--p-green-600); }
.review-item--warn { border-inline-start-color: var(--p-amber-500); }
.review-item--bad { border-inline-start-color: var(--p-red-600); }
.review-dot { width: 26px; height: 26px; border-radius: 999px; display: flex; align-items: center; justify-content: center; background: var(--p-surface-200); font-size: .75rem; }
.review-dot.ok { background: var(--p-green-100); color: var(--p-green-700); }
.review-dot.now { background: var(--p-amber-100); color: var(--p-amber-700); }
.review-dot.bad { background: var(--p-red-100); color: var(--p-red-700); }
.review-note { background: var(--p-surface-100); border-radius: 8px; padding: .25rem .5rem; margin-top: .25rem; }
.review-timeline :deep(.p-timeline-event-opposite) { display: none; }
.cand-list { display: flex; flex-direction: column; gap: .35rem; max-height: 360px; overflow-y: auto; }
.cand { display: flex; align-items: center; gap: .6rem; padding: .5rem .6rem; border-radius: 10px; border: 1px solid var(--p-content-border-color); cursor: pointer; }
.cand.on { border-color: var(--p-primary-color); background: var(--p-highlight-background); }
@media (max-width: 960px) { .review-grid { grid-template-columns: 1fr; } }
</style>
