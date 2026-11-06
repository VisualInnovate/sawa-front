<script setup>
// «طلبات النقل» in the parents' portal (phase 6b): each child's transport now, a new request (subscribe, cancel, change
// the route or address, a day without transport) and the requests with their answer (a rejection with its reason).
import { computed, onMounted, ref } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";
import PageHead from "@/components/parent/PageHead.vue";
import EmptyState from "@/components/parent/EmptyState.vue";

const { t } = useI18n();
const loading = ref(true);
const data = ref({ children: [], requests: [], regions: [] });
const error = ref("");
const done = ref("");
const busy = ref(false);
const form = ref(null);

async function load() {
  loading.value = true;
  try {
    data.value = (await axios.get("/api/parent/transport")).data;
  } finally {
    loading.value = false;
  }
}
onMounted(load);

const subscribed = (childId) => (data.value.children.find((c) => c.id === childId)?.routes ?? []).length > 0;
const typesFor = computed(() => {
  if (!form.value?.child_id) return [];
  return (subscribed(form.value.child_id) ? ["change", "skip_day", "cancel"] : ["subscribe"]).map((value) => ({ value, label: t(`trq.type_${value}`) }));
});
const directions = computed(() => ["both", "to_academy", "to_home"].map((value) => ({ value, label: t(`trq.dir_${value}`) })));
const today = new Date().toISOString().slice(0, 10);

function start(child) {
  error.value = "";
  done.value = "";
  form.value = { child_id: child.id, type: subscribed(child.id) ? "change" : "subscribe", region_id: null, address: child.address ?? "", location_url: "", date: "", direction: "both", note: "" };
}
async function send() {
  busy.value = true;
  error.value = "";
  try {
    await axios.post("/api/parent/transport", form.value);
    form.value = null;
    done.value = t("trq.created");
    await load();
  } catch (e) {
    const errors = e.response?.data?.errors;
    error.value = errors ? Object.values(errors).flat().join(" ") : e.response?.data?.message ?? t("request_failed_retry");
  } finally {
    busy.value = false;
  }
}
async function withdraw(row) {
  try {
    await axios.post(`/api/parent/transport/${row.id}/withdraw`);
    done.value = t("trq.p_withdrawn");
    await load();
  } catch (e) {
    error.value = e.response?.data?.message ?? t("request_failed_retry");
  }
}
const tone = { pending: "pp-item__icon--warn", approved: "pp-item__icon--success", rejected: "pp-item__icon--magenta", cancelled: "pp-item__icon--info" };
const icon = { pending: "pi pi-clock", approved: "pi pi-check-circle", rejected: "pi pi-times-circle", cancelled: "pi pi-undo" };
</script>

<template>
  <div class="pp-page">
    <PageHead :title="$t('trq.p_title')" :lead="$t('trq.p_lead')" :kicker="$t('pp.brand')" icon="pi pi-car" />
    <div v-if="loading" class="pp-stack"><div class="pp-skeleton" style="height: 90px" /></div>
    <template v-else>
      <p v-if="done" class="pp-alert pp-alert--success" role="status">{{ done }}</p>
      <p v-if="error" class="pp-alert pp-alert--danger" role="alert">{{ error }}</p>

      <h2 class="pp-section-title">{{ $t("trq.p_now") }}</h2>
      <EmptyState v-if="!data.children.length" icon="pi pi-users" :title="$t('trq.p_empty')" />
      <div v-else class="pp-list">
        <div v-for="child in data.children" :key="child.id" class="pp-item">
          <span class="pp-item__icon pp-item__icon--info"><i class="pi pi-car" /></span>
          <div class="pp-item__body">
            <p class="pp-item__title">{{ child.name }}</p>
            <p class="pp-item__meta">
              <template v-if="child.routes.length">{{ child.routes.map((r) => `${r.region} · ${r.trip_type ? $t("trq.trip_both") : $t("trq.trip_one")}`).join("، ") }}</template>
              <template v-else>{{ $t("trq.p_none_route") }}</template>
            </p>
          </div>
          <button type="button" class="pp-btn pp-btn--ghost pp-btn--sm" @click="start(child)"><i class="pi pi-plus" /> {{ $t("trq.new") }}</button>
        </div>
      </div>

      <form v-if="form" class="pp-card pp-card--pad pp-form" @submit.prevent="send">
        <label for="tq-type">{{ $t("trq.type") }}</label>
        <select id="tq-type" v-model="form.type" class="pp-input">
          <option v-for="o in typesFor" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
        <template v-if="['subscribe', 'change'].includes(form.type)">
          <label for="tq-region">{{ $t("trq.region") }}</label>
          <select id="tq-region" v-model="form.region_id" class="pp-input">
            <option :value="null">—</option>
            <option v-for="r in data.regions" :key="r.id" :value="r.id">{{ r.name }}</option>
          </select>
          <label for="tq-address">{{ $t("trq.address") }}</label>
          <input id="tq-address" v-model="form.address" class="pp-input" />
          <label for="tq-loc">{{ $t("trq.location") }}</label>
          <input id="tq-loc" v-model="form.location_url" class="pp-input" dir="ltr" />
        </template>
        <template v-if="form.type === 'skip_day'">
          <label for="tq-date">{{ $t("trq.date") }}</label>
          <input id="tq-date" v-model="form.date" type="date" :min="today" class="pp-input" required />
          <label for="tq-dir">{{ $t("trq.direction") }}</label>
          <select id="tq-dir" v-model="form.direction" class="pp-input">
            <option v-for="o in directions" :key="o.value" :value="o.value">{{ o.label }}</option>
          </select>
        </template>
        <label for="tq-note">{{ $t("trq.note") }}</label>
        <textarea id="tq-note" v-model="form.note" rows="2" class="pp-input" />
        <div class="pp-form__actions">
          <button type="button" class="pp-btn pp-btn--ghost pp-btn--sm" @click="form = null">{{ $t("cancel") }}</button>
          <button type="submit" class="pp-btn" :disabled="busy">{{ $t("trq.create") }}</button>
        </div>
      </form>

      <h2 class="pp-section-title">{{ $t("trq.p_requests") }}</h2>
      <EmptyState v-if="!data.requests.length" icon="pi pi-inbox" :title="$t('trq.p_empty')" />
      <div v-else class="pp-list">
        <div v-for="row in data.requests" :key="row.id" class="pp-item">
          <span class="pp-item__icon" :class="tone[row.status]"><i :class="icon[row.status]" /></span>
          <div class="pp-item__body">
            <p class="pp-item__title">{{ $t(`trq.type_${row.type}`) }} · {{ row.child?.name }}</p>
            <p class="pp-item__meta">
              {{ $t(`trq.status_${row.status}`) }}
              <template v-if="row.date"> · <bdi dir="ltr">{{ row.date }}</bdi></template>
              <template v-if="row.route"> · {{ row.route }}</template>
            </p>
            <p v-if="row.status === 'rejected' && row.decision_note" class="pp-item__meta">{{ $t("trq.p_reason", { note: row.decision_note }) }}</p>
          </div>
          <button v-if="row.status === 'pending'" type="button" class="pp-btn pp-btn--ghost pp-btn--sm" @click="withdraw(row)">{{ $t("trq.p_withdraw") }}</button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.pp-section-title { font-size: 1.05rem; font-weight: 700; margin: 1.2rem 0 0.6rem; }
.pp-form { display: grid; gap: 0.45rem; margin-top: 0.8rem; padding: 1rem; }
.pp-input { width: 100%; padding: 0.55rem 0.7rem; border: 1px solid var(--pp-line, #e2e8f0); border-radius: 10px; font: inherit; background: #fff; }
.pp-form__actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.4rem; }
.pp-alert { padding: 0.6rem 0.8rem; border-radius: 10px; margin: 0 0 0.6rem; }
.pp-alert--success { background: #ecfdf5; color: #065f46; }
.pp-alert--danger { background: #fef2f2; color: #991b1b; }
</style>
