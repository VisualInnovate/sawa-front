<script setup>
// «مقترحات الإدخال»: the programs manager proposes a child's programs (tentative, their times held) with the case
// manager and sends it to the finance; the finance makes the contract from it; the parents sign; a payment or the
// accountant's confirmation admits the child. No program of a proposal is confirmed before the signature.
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { can } from "@/utils/permissions";
import { amount, errorText, programStatusSeverity } from "@/utils/accounting";

const { t } = useI18n();
const toast = useToast();
const route = useRoute();
const router = useRouter();

const rows = ref([]);
const caseManagers = ref([]);
const holdDays = ref(2);
const loading = ref(false);
const status = ref("open");
const open = ref(null);
const busy = ref(false);

const STATUSES = ["proposal", "finance", "contract_sent", "signed", "admitted", "cancelled", "expired"];
const filters = computed(() => [{ value: "open", label: t("adm.f_open") }, ...STATUSES.map((s) => ({ value: s, label: t(`adm.s_${s}`) })), { value: "all", label: t("adm.f_all") }]);
const severity = { proposal: "secondary", finance: "warn", contract_sent: "info", signed: "info", admitted: "success", cancelled: "danger", expired: "danger" };
const canPropose = computed(() => can("admissions create"));
const canEdit = computed(() => can("admissions edit"));
const isFinance = computed(() => can("parent contracts create"));

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get("api/admissions", { params: { status: status.value } });
    rows.value = data.data;
    caseManagers.value = data.case_managers ?? [];
    holdDays.value = data.hold_days ?? 2;
    if (open.value) open.value = rows.value.find((r) => r.id === open.value.id) ?? open.value;
  } catch (e) {
    fail(e);
  } finally {
    loading.value = false;
  }
}
function fail(e) {
  toast.add({ severity: "error", summary: t("error"), detail: errorText(e), life: 4000 });
}
async function act(request, done) {
  busy.value = true;
  try {
    const { data } = await request();
    open.value = data.data;
    toast.add({ severity: "success", summary: t("success_message"), detail: done, life: 2500 });
    await load();
  } catch (e) {
    fail(e);
  } finally {
    busy.value = false;
  }
}

// A new proposal: child (without an open one), case manager, note.
const draft = ref(null);
const children = ref([]);
let timer = null;
async function findChildren(search = "") {
  const { data } = await axios.get("api/admissions/children", { params: { search: search || undefined } });
  children.value = data.data.map((c) => ({ ...c, label: c.parent ? `${c.name} — ${c.parent}` : c.name }));
}
function newProposal() {
  draft.value = { child_id: null, case_manager_id: null, note: "" };
  findChildren();
}
const onFilter = (e) => { clearTimeout(timer); timer = setTimeout(() => findChildren(e.value), 300); };
async function create() {
  await act(() => axios.post("api/admissions", draft.value), t("adm.created"));
  if (!busy.value) draft.value = null;
}

// The open proposal's actions.
const editing = ref(null);
const extendDays = ref(2);
const cancelReason = ref("");
const cancelOpen = ref(false);
const extendOpen = ref(false);
const send = () => act(() => axios.post(`api/admissions/${open.value.id}/send`), t("adm.sent_done"));
const saveEdit = () => act(() => axios.put(`api/admissions/${open.value.id}`, editing.value), t("success_message")).then(() => { editing.value = null; });
const extend = () => act(() => axios.post(`api/admissions/${open.value.id}/extend`, { days: extendDays.value }), t("adm.extended")).then(() => { extendOpen.value = false; });
const cancel = () => act(() => axios.post(`api/admissions/${open.value.id}/cancel`, { reason: cancelReason.value }), t("adm.cancelled")).then(() => { cancelOpen.value = false; });
function addProgram() {
  router.push({ name: "create-studentprograme", query: { admission: open.value.id, child: open.value.child?.id, case_manager: open.value.case_manager?.id } });
}
function makeContract() {
  router.push({ name: "parent-contracts", query: { admission: open.value.id, child: open.value.child?.id, child_name: open.value.child?.name,
    program: open.value.programs?.[0]?.id } });
}
const programLabel = (p) => t(`work_type_${p.kind}`);

onMounted(async () => {
  await load();
  const id = Number(route.query.open);
  if (id) {
    open.value = rows.value.find((r) => r.id === id) ?? (await axios.get(`api/admissions/${id}`).then((r) => r.data.data).catch(() => null));
  }
});
</script>

<template>
  <div class="sawa-card p-3">
    <Toast />
    <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
      <div>
        <p class="text-xl text-bp-135c65 font-bold m-0">{{ $t("adm.title") }}</p>
        <small class="text-color-secondary">{{ $t("adm.hint", { days: holdDays }) }}</small>
      </div>
      <div class="flex gap-2 items-center">
        <Select v-model="status" :options="filters" optionLabel="label" optionValue="value" class="w-48" @change="load" :aria-label="$t('status')" />
        <Button v-if="canPropose" icon="pi pi-plus" :label="$t('adm.new')" @click="newProposal" />
      </div>
    </div>

    <DataTable :value="rows" :loading="loading" dataKey="id" stripedRows size="small" @row-click="(e) => (open = e.data)" rowHover class="cursor-pointer">
      <template #empty><p class="text-center text-color-secondary m-0">{{ $t("adm.none") }}</p></template>
      <Column :header="$t('child')"><template #body="{ data }"><b>{{ data.child?.name }}</b><div class="text-xs text-color-secondary">{{ data.parent?.name }}</div></template></Column>
      <Column :header="$t('adm.programs')"><template #body="{ data }">{{ data.programs.length }}</template></Column>
      <Column :header="$t('org.case_manager')"><template #body="{ data }">{{ data.case_manager?.name ?? "—" }}</template></Column>
      <Column :header="$t('status')"><template #body="{ data }"><Tag :severity="severity[data.status]" :value="$t(`adm.s_${data.status}`)" /></template></Column>
      <Column :header="$t('adm.expires')"><template #body="{ data }"><bdi>{{ ["admitted", "cancelled", "expired", "signed"].includes(data.status) ? "—" : data.expires_at }}</bdi></template></Column>
      <Column :header="$t('adm.proposed_by')"><template #body="{ data }">{{ data.proposed_by }}<div class="text-xs text-color-secondary"><bdi>{{ data.created_at }}</bdi></div></template></Column>
    </DataTable>

    <!-- The proposal -->
    <Dialog :visible="!!open" modal :header="$t('adm.proposal_of', { name: open?.child?.name })" :style="{ width: '760px', maxWidth: '96vw' }" @update:visible="open = null">
      <template v-if="open">
        <ol class="adm-steps">
          <li v-for="s in ['proposal', 'finance', 'contract_sent', 'signed', 'admitted']" :key="s"
            :class="{ done: STATUSES.indexOf(open.status) > STATUSES.indexOf(s) && STATUSES.indexOf(open.status) <= 4, now: open.status === s }">{{ $t(`adm.s_${s}`) }}</li>
        </ol>
        <Message v-if="open.closed_reason" :severity="['cancelled', 'expired'].includes(open.status) ? 'error' : 'warn'" class="mb-2">{{ open.closed_reason }}</Message>
        <Message v-if="open.status === 'expired'" severity="error" class="mb-2">{{ $t("adm.expired_hint") }}</Message>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3 text-sm">
          <div><b>{{ $t("org.case_manager") }}:</b> {{ open.case_manager?.name ?? "—" }}</div>
          <div><b>{{ $t("adm.parent") }}:</b> {{ open.parent?.name }} <bdi v-if="open.parent?.phone">{{ open.parent.phone }}</bdi></div>
          <div v-if="open.expires_at && !['admitted', 'cancelled', 'expired', 'signed'].includes(open.status)"><b>{{ $t("adm.expires") }}:</b> <bdi>{{ open.expires_at }}</bdi></div>
          <div v-if="open.contract"><b>{{ $t("adm.contract") }}:</b>
            <router-link :to="{ name: 'parent-contract', params: { id: open.contract.id } }" class="underline"><bdi>{{ open.contract.number }}</bdi></router-link>
            · {{ $t(`con.status_${open.contract.status}`) }}</div>
          <div v-if="open.note" class="md:col-span-2"><b>{{ $t("notes") }}:</b> {{ open.note }}</div>
        </div>

        <div class="flex items-center justify-between mb-2">
          <b>{{ $t("adm.programs") }}</b>
          <Button v-if="canPropose && ['proposal', 'finance'].includes(open.status)" size="small" icon="pi pi-plus" :label="$t('adm.add_program')" variant="outlined" @click="addProgram" />
        </div>
        <DataTable :value="open.programs" dataKey="id" size="small">
          <template #empty><p class="text-center text-color-secondary m-0">{{ $t("adm.no_programs") }}</p></template>
          <Column :header="$t('sp_kind')"><template #body="{ data }">
            <router-link :to="{ name: 'show-studentprograme', params: { id: data.id } }" class="underline">{{ programLabel(data) }}</router-link></template></Column>
          <Column :header="$t('adm.period')"><template #body="{ data }"><bdi>{{ data.start_date }} – {{ data.end_date }}</bdi></template></Column>
          <Column :header="$t('price')"><template #body="{ data }">{{ amount(data.price) }}</template></Column>
          <Column :header="$t('acc.paid')"><template #body="{ data }">{{ amount(data.paid) }}</template></Column>
          <Column :header="$t('status')"><template #body="{ data }"><Tag :severity="programStatusSeverity[data.accounting_status]" :value="$t(`acc.program_status.${data.accounting_status}`)" /></template></Column>
        </DataTable>

        <div v-if="editing" class="grid gap-2 mt-3 p-3 border-1 surface-border border-round">
          <label for="adm-cm2" class="font-bold">{{ $t("org.case_manager") }}</label>
          <Select inputId="adm-cm2" v-model="editing.case_manager_id" :options="caseManagers" optionLabel="name" optionValue="id" filter />
          <label for="adm-note2" class="font-bold">{{ $t("notes") }}</label>
          <Textarea id="adm-note2" v-model="editing.note" rows="2" autoResize />
          <div class="flex gap-2 justify-end"><Button :label="$t('cancel')" text @click="editing = null" /><Button :label="$t('save')" :loading="busy" @click="saveEdit" /></div>
        </div>
      </template>
      <template #footer>
        <template v-if="open">
          <Button v-if="canEdit && ['proposal', 'finance'].includes(open.status)" :label="$t('edit')" icon="pi pi-pencil" text @click="editing = { case_manager_id: open.case_manager?.id, note: open.note }" />
          <Button v-if="canEdit && open.status !== 'signed' && ['proposal', 'finance', 'contract_sent'].includes(open.status)" :label="$t('adm.cancel')" icon="pi pi-times" severity="danger" text @click="cancelReason = ''; cancelOpen = true" />
          <Button v-if="(canEdit || isFinance) && ['proposal', 'finance', 'contract_sent'].includes(open.status)" :label="$t('adm.extend')" icon="pi pi-clock" text @click="extendOpen = true" />
          <Button v-if="canEdit && open.status === 'proposal'" :label="$t('adm.send')" icon="pi pi-send" :loading="busy" :disabled="!open.programs.length" @click="send" />
          <Button v-if="isFinance && open.status === 'finance' && !open.contract" :label="$t('adm.make_contract')" icon="pi pi-file-edit" @click="makeContract" />
          <Button v-if="open.contract" :label="$t('adm.open_contract')" icon="pi pi-folder-open" variant="outlined" @click="router.push({ name: 'parent-contract', params: { id: open.contract.id } })" />
          <Button v-if="isFinance && open.status === 'signed'" :label="$t('adm.to_accounting')" icon="pi pi-wallet" @click="router.push({ name: 'accounting-programs' })" />
        </template>
      </template>
    </Dialog>

    <Dialog :visible="!!draft" modal :header="$t('adm.new')" :style="{ width: '520px', maxWidth: '96vw' }" @update:visible="draft = null">
      <div v-if="draft" class="grid gap-3">
        <div class="grid gap-1">
          <label for="adm-child" class="font-bold">{{ $t("child") }}</label>
          <Select inputId="adm-child" v-model="draft.child_id" :options="children" optionLabel="label" optionValue="id" filter @filter="onFilter" :placeholder="$t('con.pick_child')" />
        </div>
        <div class="grid gap-1">
          <label for="adm-cm" class="font-bold">{{ $t("org.case_manager") }} <span class="text-red-500">*</span></label>
          <Select inputId="adm-cm" v-model="draft.case_manager_id" :options="caseManagers" optionLabel="name" optionValue="id" filter
            :placeholder="caseManagers.length ? $t('org.pick_case_manager') : $t('org.no_case_managers')" />
        </div>
        <div class="grid gap-1">
          <label for="adm-note" class="font-bold">{{ $t("notes") }}</label>
          <Textarea id="adm-note" v-model="draft.note" rows="2" autoResize />
        </div>
        <small class="text-color-secondary">{{ $t("adm.new_hint", { days: holdDays }) }}</small>
      </div>
      <template #footer>
        <Button :label="$t('cancel')" text @click="draft = null" />
        <Button :label="$t('adm.create')" icon="pi pi-check" :loading="busy" :disabled="!draft?.child_id || !draft?.case_manager_id" @click="create" />
      </template>
    </Dialog>

    <Dialog v-model:visible="extendOpen" modal :header="$t('adm.extend')" :style="{ width: '380px' }">
      <label for="adm-days" class="font-bold">{{ $t("adm.extend_days") }}</label>
      <InputNumber inputId="adm-days" v-model="extendDays" :min="1" :max="30" showButtons class="w-full mt-1" />
      <template #footer><Button :label="$t('cancel')" text @click="extendOpen = false" /><Button :label="$t('save')" :loading="busy" @click="extend" /></template>
    </Dialog>
    <Dialog v-model:visible="cancelOpen" modal :header="$t('adm.cancel')" :style="{ width: '440px' }">
      <label for="adm-reason" class="font-bold">{{ $t("adm.cancel_reason") }}</label>
      <Textarea id="adm-reason" v-model="cancelReason" rows="3" autoResize class="w-full mt-1" />
      <small class="text-color-secondary">{{ $t("adm.cancel_hint") }}</small>
      <template #footer><Button :label="$t('close')" text @click="cancelOpen = false" /><Button :label="$t('adm.cancel')" severity="danger" :loading="busy" :disabled="cancelReason.trim().length < 3" @click="cancel" /></template>
    </Dialog>
  </div>
</template>

<style scoped>
.adm-steps { display: flex; flex-wrap: wrap; gap: .4rem; list-style: none; padding: 0; margin: 0 0 .8rem; }
.adm-steps li { padding: .25rem .7rem; border-radius: 999px; background: var(--p-surface-100, #f1f5f9); font-size: .82rem; color: #64748b; }
.adm-steps li.done { background: #ecfdf5; color: #065f46; }
.adm-steps li.now { background: rgb(var(--bp-1c6772, 28 103 114)); color: #fff; font-weight: 700; }
</style>
