<script setup>
// «طلبات النقل» (phase 6b): the parents' transport requests — subscribe, cancel, change the route / address, a day
// without transport. The transport manager decides (and picks the route), finance follows for a subscription or a
// cancellation; approved, it is carried out. Reception files one for the parents. Whom a request waits for sees it
// even without the list's permission (opened from «معاملاتي المعلّقة»).
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { errorText } from "@/utils/accounting";
import FlowDeadline from "@/components/approvals/FlowDeadline.vue";

const { t } = useI18n();
const toast = useToast();
const route = useRoute();

const rows = ref([]);
const loading = ref(false);
const canCreate = ref(false);
const filter = ref("pending");
const filters = computed(() => [{ value: "pending", label: t("trq.f_pending") }, { value: null, label: t("trq.f_all") }]);
const options = ref({ regions: [], routes: [] });
const SEVERITY = { pending: "warn", approved: "success", rejected: "danger", cancelled: "secondary" };
const routeLabel = (r) => `${r.region ?? "—"} · ${r.trip_type ? t("trq.trip_both") : t("trq.trip_one")} · ${t("trq.children_n", { n: r.children })}`;

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get("api/transport-requests", { params: { status: filter.value || undefined } });
    rows.value = data.data;
    canCreate.value = data.can_create;
  } catch {
    rows.value = [];
  } finally {
    loading.value = false;
  }
}
async function loadOptions() {
  options.value = (await axios.get("api/transport-requests/options")).data;
}

// One request: its decision.
const open = ref(null);
const routeId = ref(null);
const note = ref("");
const busy = ref(false);
async function show(row) {
  try {
    open.value = (await axios.get(`api/transport-requests/${row.id}`)).data.data;
    routeId.value = open.value.route_id;
    note.value = "";
    if (open.value.needs_route && !options.value.routes.length) await loadOptions();
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(e), life: 4000 });
  }
}
const suggested = computed(() => options.value.routes.filter((r) => !open.value?.region_id || r.region_id === open.value.region_id));
async function decide(approved) {
  busy.value = true;
  try {
    await axios.post(`api/transport-requests/${open.value.id}/decide`, { approved, note: note.value || null, route_id: routeId.value });
    toast.add({ severity: "success", summary: t("success_message"), detail: t("trq.decided"), life: 2500 });
    open.value = null;
    load();
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(e), life: 4500 });
  } finally {
    busy.value = false;
  }
}

// Reception files one.
const adding = ref(null);
const children = ref([]);
async function startAdding() {
  adding.value = { child_id: null, type: "subscribe", region_id: null, address: "", location_url: "", date: null, direction: "both", note: "" };
  if (!options.value.regions.length) await loadOptions();
  if (!children.value.length) {
    const { data } = await axios.get("api/child").catch(() => ({ data: {} }));
    children.value = (data.children ?? []).map((c) => ({ id: c.id, name: c.name }));
  }
}
async function create() {
  busy.value = true;
  try {
    const body = { ...adding.value, date: adding.value.date ? new Date(adding.value.date.getTime() - adding.value.date.getTimezoneOffset() * 60000).toISOString().slice(0, 10) : null };
    await axios.post("api/transport-requests", body);
    toast.add({ severity: "success", summary: t("success_message"), detail: t("trq.created"), life: 2500 });
    adding.value = null;
    load();
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(e), life: 4500 });
  } finally {
    busy.value = false;
  }
}
const types = computed(() => ["subscribe", "cancel", "change", "skip_day"].map((value) => ({ value, label: t(`trq.type_${value}`) })));
const directions = computed(() => ["both", "to_academy", "to_home"].map((value) => ({ value, label: t(`trq.dir_${value}`) })));

onMounted(async () => {
  await load();
  if (route.query.open) show({ id: Number(route.query.open) });
});
</script>

<template>
  <div class="card">
    <div class="flex flex-wrap justify-between items-start gap-3 mb-3">
      <div>
        <h1 class="text-xl font-bold m-0">{{ $t("trq.title") }}</h1>
        <small class="text-muted-color">{{ $t("trq.hint") }}</small>
      </div>
      <div class="flex gap-2 items-center">
        <SelectButton v-model="filter" :options="filters" optionLabel="label" optionValue="value" :allowEmpty="false" @change="load" />
        <Button v-if="canCreate" icon="pi pi-plus" :label="$t('trq.new')" @click="startAdding" />
      </div>
    </div>

    <DataTable :value="rows" :loading="loading" dataKey="id" size="small" stripedRows>
      <Column :header="$t('trq.child')"><template #body="{ data }"><b>{{ data.child?.name }}</b><br /><small class="text-muted-color" dir="ltr">{{ data.created_at }}</small></template></Column>
      <Column :header="$t('trq.type')">
        <template #body="{ data }">
          {{ $t(`trq.type_${data.type}`) }}
          <small v-if="data.type === 'skip_day'" class="block text-muted-color"><bdi dir="ltr">{{ data.date }}</bdi> · {{ $t(`trq.dir_${data.direction}`) }}</small>
          <small v-else-if="data.region" class="block text-muted-color">{{ data.region }}</small>
        </template>
      </Column>
      <Column :header="$t('trq.by')"><template #body="{ data }">{{ data.by || $t("trq.by_parents") }}</template></Column>
      <Column :header="$t('status')">
        <template #body="{ data }">
          <Tag :value="$t(`trq.status_${data.status}`)" :severity="SEVERITY[data.status]" />
          <small v-if="data.stage" class="block text-muted-color mt-1">{{ data.stage.name }}</small>
          <FlowDeadline v-if="data.status === 'pending' && data.due_at" :state="{ status: 'running', due_at: data.due_at, minutes_left: data.minutes_left, escalations: data.escalations }" compact class="mt-1" />
          <small v-if="data.decision_note" class="block text-red-700 mt-1">{{ data.decision_note }}</small>
        </template>
      </Column>
      <Column style="width: 7rem">
        <template #body="{ data }"><Button size="small" icon="pi pi-eye" :label="data.can_decide ? $t('trq.approve') + ' / ' + $t('trq.reject') : $t('view')" variant="outlined" @click="show(data)" /></template>
      </Column>
      <template #empty><p class="text-center text-muted-color m-0">{{ $t("trq.none") }}</p></template>
    </DataTable>

    <!-- One request -->
    <Dialog :visible="!!open" @update:visible="open = null" modal :header="open ? `${$t(`trq.type_${open.type}`)} — ${open.child?.name}` : ''" :style="{ width: '560px', maxWidth: '96vw' }">
      <div v-if="open" class="grid gap-2">
        <div class="flex flex-wrap gap-2"><Tag :value="$t(`trq.status_${open.status}`)" :severity="SEVERITY[open.status]" /><Tag v-if="open.stage" :value="open.stage.name" severity="info" /></div>
        <p v-if="open.region" class="m-0"><b>{{ $t("trq.region") }}:</b> {{ open.region }}</p>
        <p v-if="open.from_route" class="m-0"><b>{{ $t("trq.from_route") }}:</b> {{ open.from_route }}</p>
        <p v-if="open.route" class="m-0"><b>{{ $t("trq.route") }}:</b> {{ open.route }}</p>
        <p v-if="open.address" class="m-0"><b>{{ $t("trq.address") }}:</b> {{ open.address }}</p>
        <p v-if="open.location_url" class="m-0"><b>{{ $t("trq.location") }}:</b> <a :href="open.location_url" target="_blank" rel="noopener" dir="ltr">{{ open.location_url }}</a></p>
        <p v-if="open.date" class="m-0"><b>{{ $t("trq.date") }}:</b> <bdi dir="ltr">{{ open.date }}</bdi><template v-if="open.direction"> · {{ $t(`trq.dir_${open.direction}`) }}</template></p>
        <p v-if="open.note" class="m-0"><b>{{ $t("trq.note") }}:</b> {{ open.note }}</p>
        <FlowDeadline :state="{ status: open.status === 'pending' ? 'running' : 'done', due_at: open.due_at, minutes_left: open.minutes_left, escalations: open.escalations, history: open.history }" />
        <template v-if="open.can_decide">
          <div v-if="open.needs_route" class="flex flex-column gap-1">
            <label for="trq-route">{{ $t("trq.route") }}</label>
            <Select id="trq-route" v-model="routeId" :options="suggested.length ? suggested : options.routes" optionValue="id" :optionLabel="routeLabel" :placeholder="$t('trq.choose_route')" />
          </div>
          <label for="trq-note">{{ $t("trq.reject_reason") }}</label>
          <Textarea id="trq-note" v-model="note" rows="2" autoResize />
        </template>
      </div>
      <template #footer>
        <template v-if="open?.can_decide">
          <Button :label="$t('trq.reject')" icon="pi pi-times" severity="danger" variant="outlined" :disabled="!note.trim()" :loading="busy" @click="decide(false)" />
          <Button :label="$t('trq.approve')" icon="pi pi-check" severity="success" :disabled="open.needs_route && !routeId" :loading="busy" @click="decide(true)" />
        </template>
        <Button v-else :label="$t('close')" text @click="open = null" />
      </template>
    </Dialog>

    <!-- New request (reception) -->
    <Dialog :visible="!!adding" @update:visible="adding = null" modal :header="$t('trq.new')" :style="{ width: '520px', maxWidth: '96vw' }">
      <div v-if="adding" class="grid gap-2">
        <label for="trq-child">{{ $t("trq.child") }}</label>
        <Select id="trq-child" v-model="adding.child_id" :options="children" optionValue="id" optionLabel="name" filter />
        <label for="trq-type">{{ $t("trq.type") }}</label>
        <Select id="trq-type" v-model="adding.type" :options="types" optionValue="value" optionLabel="label" />
        <template v-if="['subscribe', 'change'].includes(adding.type)">
          <label for="trq-region">{{ $t("trq.region") }}</label>
          <Select id="trq-region" v-model="adding.region_id" :options="options.regions" optionValue="id" optionLabel="name" showClear />
          <label for="trq-address">{{ $t("trq.address") }}</label>
          <InputText id="trq-address" v-model="adding.address" />
          <label for="trq-loc">{{ $t("trq.location") }}</label>
          <InputText id="trq-loc" v-model="adding.location_url" dir="ltr" />
        </template>
        <template v-if="adding.type === 'skip_day'">
          <label for="trq-date">{{ $t("trq.date") }}</label>
          <DatePicker inputId="trq-date" v-model="adding.date" dateFormat="yy-mm-dd" :minDate="new Date()" showIcon />
          <label for="trq-dir">{{ $t("trq.direction") }}</label>
          <Select id="trq-dir" v-model="adding.direction" :options="directions" optionValue="value" optionLabel="label" />
        </template>
        <label for="trq-n">{{ $t("trq.note") }}</label>
        <Textarea id="trq-n" v-model="adding.note" rows="2" autoResize />
      </div>
      <template #footer>
        <Button :label="$t('cancel')" text @click="adding = null" />
        <Button :label="$t('trq.create')" icon="pi pi-send" :disabled="!adding?.child_id || (adding?.type === 'skip_day' && !adding?.date)" :loading="busy" @click="create" />
      </template>
    </Dialog>
  </div>
</template>
