<script setup>
// «معاملاتي المعلّقة»: what waits for my approval (mine, or as someone's stand-in) with the time left; every transaction
// for «approval flows list»; and my delegations (someone acting for me for a while).
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { errorText } from "@/utils/accounting";
import { can } from "@/utils/permissions";
import { useRouter } from "vue-router";

const { t, locale } = useI18n();
const router = useRouter();
// A transaction its module decides on its own page (a leave, a candidate, the payroll): open it there.
function openPage(row) {
  if (!row?.url) return;
  open.value = null;
  router.push(row.url);
}
const toast = useToast();
const ar = computed(() => locale.value === "ar");

const tab = ref("mine");
const tabs = computed(() => [
  { value: "mine", label: t("apf.waiting_me") },
  ...(can("approval flows list") ? [{ value: "all", label: t("apf.all") }] : []),
  { value: "delegations", label: t("apf.delegations") },
]);

// What waits for me.
const mine = ref([]);
const loading = ref(false);
async function loadMine() {
  loading.value = true;
  try {
    mine.value = (await axios.get("api/approvals/inbox")).data.data;
  } finally {
    loading.value = false;
  }
}

// Every transaction.
const all = ref([]);
const allTotal = ref(0);
const allPage = ref(1);
const allStatus = ref("open");
const statusOptions = computed(() => ["open", "late", "done"].map((value) => ({ value, label: t(`apf.filter_${value}`) })));
async function loadAll() {
  loading.value = true;
  try {
    const { data } = await axios.get("api/approvals/all", { params: { status: allStatus.value, page: allPage.value } });
    all.value = data.data;
    allTotal.value = data.total;
  } finally {
    loading.value = false;
  }
}
watch(allStatus, () => {
  allPage.value = 1;
  loadAll();
});

const flowName = (row) => (ar.value ? row.flow?.name_ar : row.flow?.name_en || row.flow?.name_ar) ?? "—";
const left = (row) => {
  if (row.minutes_left === null || row.minutes_left === undefined) return { text: t("apf.no_deadline"), severity: "secondary" };
  const m = row.minutes_left;
  if (m < 0) return { text: t("apf.late_by", { time: duration(-m) }), severity: "danger" };
  return { text: t("apf.left", { time: duration(m) }), severity: m < 240 ? "warn" : "success" };
};
function duration(minutes) {
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;
  return [days ? t("apf.d", { n: days }) : "", hours ? t("apf.h", { n: hours }) : "", !days && mins ? t("apf.m", { n: mins }) : ""].filter(Boolean).join(" ") || t("apf.m", { n: 0 });
}
const statusSeverity = { running: "info", returned: "warn", approved: "success", auto_approved: "success", rejected: "danger", cancelled: "secondary" };

// One transaction: its history and the decision.
const open = ref(null);
const note = ref("");
const deciding = ref(false);
async function show(row) {
  note.value = "";
  try {
    open.value = (await axios.get(`api/approvals/${row.id}`)).data.data;
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(e), life: 4000 });
  }
}
async function decide(decision) {
  deciding.value = true;
  try {
    await axios.post(`api/approvals/${open.value.id}/decide`, { decision, note: note.value || null });
    toast.add({ severity: "success", summary: t("success_message"), detail: t(decision === "approve" ? "apf.approved_done" : "apf.rejected_done"), life: 2500 });
    open.value = null;
    tab.value === "all" ? loadAll() : loadMine();
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(e), life: 5000 });
  } finally {
    deciding.value = false;
  }
}

// Delegations.
const delegations = ref([]);
const flows = ref([]);
const users = ref([]);
const adding = ref(null);
const savingDelegation = ref(false);
const showAllDelegations = ref(false);
async function loadDelegations() {
  loading.value = true;
  try {
    const { data } = await axios.get("api/approval-delegations", { params: { all: showAllDelegations.value ? 1 : undefined } });
    delegations.value = data.data;
    flows.value = data.flows;
    users.value = data.users;
  } finally {
    loading.value = false;
  }
}
watch(showAllDelegations, loadDelegations);
const flowOptions = computed(() => [{ key: "all", name: t("apf.all_flows") }, ...flows.value.map((f) => ({ key: f.key, name: ar.value ? f.name_ar : f.name_en || f.name_ar }))]);
function newDelegation() {
  const start = new Date();
  const end = new Date(Date.now() + 7 * 86400000);
  adding.value = { from_user_id: null, to_user_id: null, flow_key: "all", starts_at: start, ends_at: end, reason: "" };
}
const fmt = (d) => {
  const x = new Date(d);
  const p = (n) => String(n).padStart(2, "0");
  return `${x.getFullYear()}-${p(x.getMonth() + 1)}-${p(x.getDate())} ${p(x.getHours())}:${p(x.getMinutes())}`;
};
async function saveDelegation() {
  savingDelegation.value = true;
  try {
    const body = { ...adding.value, starts_at: fmt(adding.value.starts_at), ends_at: fmt(adding.value.ends_at) };
    if (!body.from_user_id) delete body.from_user_id;
    if (body.flow_key === "all") body.flow_key = null;
    await axios.post("api/approval-delegations", body);
    adding.value = null;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("apf.delegation_saved"), life: 2500 });
    loadDelegations();
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(e), life: 5000 });
  } finally {
    savingDelegation.value = false;
  }
}
async function cancelDelegation(row) {
  try {
    await axios.post(`api/approval-delegations/${row.id}/cancel`);
    loadDelegations();
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(e), life: 4000 });
  }
}

function load() {
  if (tab.value === "mine") loadMine();
  else if (tab.value === "all") loadAll();
  else loadDelegations();
}
watch(tab, load);
onMounted(load);
</script>

<template>
  <div class="sawa-card p-3 flex flex-column gap-3">
    <Toast />
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div>
        <p class="text-xl text-bp-135c65 font-bold m-0">{{ $t("apf.inbox") }}</p>
        <small class="text-color-secondary">{{ $t("apf.inbox_hint") }}</small>
      </div>
      <div class="flex gap-2 items-center">
        <SelectButton v-model="tab" :options="tabs" optionLabel="label" optionValue="value" :allowEmpty="false" />
        <Button icon="pi pi-refresh" variant="text" :loading="loading" @click="load" :aria-label="$t('refresh_data')" />
      </div>
    </div>

    <!-- Waiting for me / everything -->
    <template v-if="tab !== 'delegations'">
      <div v-if="tab === 'all'" class="flex gap-2">
        <SelectButton v-model="allStatus" :options="statusOptions" optionLabel="label" optionValue="value" :allowEmpty="false" />
      </div>
      <DataTable :value="tab === 'mine' ? mine : all" :loading="loading" dataKey="id" stripedRows size="small"
        :lazy="tab === 'all'" :paginator="tab === 'all'" :rows="25" :totalRecords="allTotal" @page="(e) => { allPage = e.page + 1; loadAll(); }">
        <Column :header="$t('apf.flow')">
          <template #body="{ data }"><Tag :value="flowName(data)" severity="secondary" /></template>
        </Column>
        <Column field="title" :header="$t('apf.subject')">
          <template #body="{ data }">
            <b>{{ data.title || `#${data.subject_id}` }}</b>
            <small class="block text-color-secondary">{{ $t("apf.by_requester", { name: data.requester ?? "—" }) }}</small>
          </template>
        </Column>
        <Column :header="$t('apf.stage')">
          <template #body="{ data }">
            <span v-if="data.stage">{{ data.stage.name }}</span>
            <Tag v-else :value="$t(`apf.status_${data.status}`)" :severity="statusSeverity[data.status]" />
            <Tag v-if="data.on_behalf_of" :value="$t('apf.for', { name: data.on_behalf_of })" severity="info" class="ms-1 text-xs" />
            <Tag v-if="data.escalations" :value="$t('apf.escalated')" severity="danger" class="ms-1 text-xs" />
          </template>
        </Column>
        <Column :header="$t('apf.time_left')">
          <template #body="{ data }">
            <Tag v-if="data.status === 'running'" :value="left(data).text" :severity="left(data).severity" />
            <span v-else>—</span>
          </template>
        </Column>
        <Column header-style="width: 4rem">
          <template #body="{ data }">
            <Button icon="pi pi-eye" variant="text" rounded @click="show(data)" v-tooltip.top="$t('apf.open')" :aria-label="$t('apf.open')" />
          </template>
        </Column>
        <template #empty><p class="text-center text-color-secondary m-0">{{ $t(tab === "mine" ? "apf.nothing_waiting" : "apf.no_transactions") }}</p></template>
      </DataTable>
    </template>

    <!-- Delegations -->
    <template v-else>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <small class="text-color-secondary">{{ $t("apf.delegations_hint") }}</small>
        <div class="flex items-center gap-3">
          <label v-if="can('approval delegations edit')" class="flex items-center gap-2 text-sm">
            <ToggleSwitch v-model="showAllDelegations" inputId="apf-all-del" />
            <span>{{ $t("apf.all_delegations") }}</span>
          </label>
          <Button icon="pi pi-plus" :label="$t('apf.new_delegation')" @click="newDelegation" />
        </div>
      </div>
      <DataTable :value="delegations" :loading="loading" dataKey="id" stripedRows size="small">
        <Column :header="$t('apf.from')"><template #body="{ data }">{{ data.from?.name }}</template></Column>
        <Column :header="$t('apf.to')"><template #body="{ data }">{{ data.to?.name }}</template></Column>
        <Column :header="$t('apf.flow')"><template #body="{ data }">{{ data.flow ?? $t("apf.all_flows") }}</template></Column>
        <Column :header="$t('apf.period')">
          <template #body="{ data }"><bdi class="whitespace-nowrap">{{ data.starts_at }} → {{ data.ends_at }}</bdi></template>
        </Column>
        <Column :header="$t('apf.source')">
          <template #body="{ data }">
            <Tag :value="$t(data.source === 'leave' ? 'apf.source_leave' : 'apf.source_manual')" :severity="data.source === 'leave' ? 'info' : 'secondary'" />
            <Tag v-if="data.cancelled" :value="$t('apf.cancelled')" severity="secondary" class="ms-1" />
            <Tag v-else-if="data.active" :value="$t('apf.active')" severity="success" class="ms-1" />
          </template>
        </Column>
        <Column header-style="width: 4rem">
          <template #body="{ data }">
            <Button v-if="!data.cancelled && (data.mine || can('approval delegations edit'))" icon="pi pi-times" variant="text" severity="danger" rounded
              @click="cancelDelegation(data)" v-tooltip.top="$t('apf.stop')" :aria-label="$t('apf.stop')" />
          </template>
        </Column>
        <template #empty><p class="text-center text-color-secondary m-0">{{ $t("apf.no_delegations") }}</p></template>
      </DataTable>
    </template>

    <!-- One transaction -->
    <Dialog :visible="!!open" @update:visible="open = null" modal :header="open ? `${flowName(open)} — ${open.title || '#' + open.subject_id}` : ''" :style="{ width: '640px' }">
      <template v-if="open">
        <div class="flex flex-wrap gap-2 mb-3">
          <Tag :value="$t(`apf.status_${open.status}`)" :severity="statusSeverity[open.status]" />
          <Tag v-if="open.stage" :value="open.stage.name" severity="info" />
          <Tag v-if="open.status === 'running'" :value="left(open).text" :severity="left(open).severity" />
        </div>
        <p v-if="open.approvers?.length" class="text-sm m-0 mb-2"><b>{{ $t("apf.who_acts") }}:</b> {{ open.approvers.join("، ") }}</p>
        <Message v-if="open.url && open.can_act" severity="info" class="mb-2">{{ $t("apf.module_hint") }}</Message>
        <ol class="apf-steps">
          <li v-for="s in open.stages" :key="s.id" :class="{ current: open.stage?.id === s.id }">{{ s.name }}</li>
        </ol>
        <p class="font-bold mt-3 mb-1">{{ $t("apf.history") }}</p>
        <ul class="apf-history">
          <li v-for="(tr, i) in open.transitions" :key="i">
            <bdi class="text-color-secondary">{{ tr.at }}</bdi> —
            <b>{{ $t(`apf.action_${tr.action}`) }}</b>
            <span v-if="tr.stage"> · {{ tr.stage }}</span>
            <span v-if="tr.user"> · {{ tr.user }}</span>
            <span v-else-if="['auto_approved', 'escalated', 'reminded', 'skipped', 'finished', 'returned'].includes(tr.action)"> · {{ $t("apf.system") }}</span>
            <span v-if="tr.on_behalf_of" class="text-color-secondary"> ({{ $t("apf.for", { name: tr.on_behalf_of }) }})</span>
            <div v-if="tr.note && tr.note !== 'auto'" class="apf-note">{{ tr.note }}</div>
          </li>
        </ul>
        <template v-if="open.can_act">
          <label for="apf-note" class="block mt-3 mb-1">{{ $t("apf.note") }}<span v-if="open.stage?.reject_note_required" class="text-color-secondary"> ({{ $t("apf.note_required_reject") }})</span></label>
          <Textarea id="apf-note" v-model="note" rows="3" autoResize class="w-full" />
        </template>
      </template>
      <template #footer>
        <Button v-if="open?.url" :label="$t('apf.open_page')" icon="pi pi-external-link" variant="text" @click="openPage(open)" />
        <template v-if="open?.can_act">
          <Button :label="$t('apf.reject')" icon="pi pi-times" severity="danger" variant="outlined" :loading="deciding" @click="decide('reject')" />
          <Button :label="$t('apf.approve')" icon="pi pi-check" severity="success" :loading="deciding" @click="decide('approve')" />
        </template>
        <Button v-else :label="$t('close')" variant="text" @click="open = null" />
      </template>
    </Dialog>

    <!-- New delegation -->
    <Dialog :visible="!!adding" @update:visible="adding = null" modal :header="$t('apf.new_delegation')" :style="{ width: '460px' }">
      <div v-if="adding" class="flex flex-column gap-3">
        <div v-if="can('approval delegations edit')" class="flex flex-column gap-1">
          <label for="apf-from">{{ $t("apf.from") }}</label>
          <Select inputId="apf-from" v-model="adding.from_user_id" :options="users" optionLabel="name" optionValue="id" filter showClear :placeholder="$t('apf.me')" />
        </div>
        <div class="flex flex-column gap-1">
          <label for="apf-to">{{ $t("apf.to") }}</label>
          <Select inputId="apf-to" v-model="adding.to_user_id" :options="users" optionLabel="name" optionValue="id" filter :placeholder="$t('apf.pick_person')" />
        </div>
        <div class="flex flex-column gap-1">
          <label for="apf-flow">{{ $t("apf.flow") }}</label>
          <Select inputId="apf-flow" v-model="adding.flow_key" :options="flowOptions" optionLabel="name" optionValue="key" />
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="flex flex-column gap-1">
            <label for="apf-start">{{ $t("apf.starts") }}</label>
            <DatePicker inputId="apf-start" v-model="adding.starts_at" showTime hourFormat="24" dateFormat="yy-mm-dd" />
          </div>
          <div class="flex flex-column gap-1">
            <label for="apf-end">{{ $t("apf.ends") }}</label>
            <DatePicker inputId="apf-end" v-model="adding.ends_at" showTime hourFormat="24" dateFormat="yy-mm-dd" />
          </div>
        </div>
        <div class="flex flex-column gap-1">
          <label for="apf-reason">{{ $t("apf.reason") }}</label>
          <InputText id="apf-reason" v-model="adding.reason" />
        </div>
      </div>
      <template #footer>
        <Button :label="$t('cancel')" variant="text" severity="secondary" @click="adding = null" />
        <Button :label="$t('save')" icon="pi pi-check" :loading="savingDelegation" :disabled="!adding?.to_user_id" @click="saveDelegation" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.apf-steps {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  list-style: none;
  padding: 0;
  margin: 0;
}
.apf-steps li {
  border: 1px solid rgb(var(--bp-b6dde0));
  border-radius: 999px;
  padding: 0.15rem 0.7rem;
  font-size: 0.85rem;
}
.apf-steps li.current {
  background: rgb(var(--bp-135c65));
  color: #fff;
}
.apf-history {
  margin: 0;
  padding-inline-start: 1rem;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.apf-note {
  background: rgb(var(--bp-f0f9fa));
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  margin-top: 0.15rem;
}
</style>
