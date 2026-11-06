<script setup>
// «رحلاتي» (مشرف باص, made for the phone): his bus's trips on a date, then a trip's children with their address and
// parent's phone. «اقتربنا» / «وصلنا» / «غائب» tell the parent (and the management for arrived / absent); never back.
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { STOP_SEVERITY, isoDate, dateOf } from "@/utils/transport";
import { can } from "@/utils/permissions";

const { t } = useI18n();
const toast = useToast();
const route = useRoute();
const router = useRouter();

const day = ref(route.query.date ? dateOf(route.query.date) : new Date());
const trips = ref([]);
const trip = ref(null);
const loading = ref(false);
const busy = ref(null);
const confirming = ref(null);
const canMark = computed(() => can("bus supervisor edit"));
const tripId = computed(() => (route.params.id ? Number(route.params.id) : null));
const counts = computed(() => (trip.value?.stops ?? []).reduce((all, stop) => ({ ...all, [stop.status]: (all[stop.status] ?? 0) + 1 }), {}));
const waiting = computed(() => (trip.value?.stops ?? []).filter((stop) => ["pending", "approaching"].includes(stop.status)).length);

function shift(days) {
  const next = new Date(day.value);
  next.setDate(next.getDate() + days);
  day.value = next;
}

async function loadTrips() {
  loading.value = true;
  try {
    trips.value = (await axios.get("api/bus-supervisor/trips", { params: { date: isoDate(day.value) } })).data.data ?? [];
  } finally {
    loading.value = false;
  }
}

async function loadTrip() {
  if (!tripId.value) {
    trip.value = null;
    return;
  }
  loading.value = true;
  try {
    trip.value = (await axios.get(`api/bus-supervisor/trips/${tripId.value}`)).data.data;
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: error?.response?.data?.message, life: 4000 });
    router.replace({ name: "bus-trips" });
  } finally {
    loading.value = false;
  }
}

watch(day, () => {
  router.replace({ name: "bus-trips", query: { date: isoDate(day.value) } });
  loadTrips();
});
watch(tripId, (id) => (id ? loadTrip() : (trip.value = null, loadTrips())));
onMounted(() => (tripId.value ? loadTrip() : loadTrips()));

const openTrip = (row) => router.push({ name: "bus-trip", params: { id: row.id } });
function back() {
  if (trip.value?.date && trip.value.date !== isoDate(day.value)) day.value = dateOf(trip.value.date);
  router.push({ name: "bus-trips", query: { date: isoDate(day.value) } });
}

function stopLabel(status) {
  return t(`tr.status.${trip.value?.direction === "to_home" && status === "arrived" ? "arrived_home" : status}`);
}

async function mark(stop, status) {
  busy.value = `${stop.id}-${status}`;
  try {
    const { data } = await axios.post(`api/bus-supervisor/stops/${stop.id}`, { status });
    Object.assign(stop, data.data);
    toast.add({ severity: "success", summary: stop.child.name, detail: t("tr.sent"), life: 2500 });
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: error?.response?.data?.message, life: 4000 });
    loadTrip();
  } finally {
    busy.value = null;
    confirming.value = null;
  }
}

async function arriveAll() {
  busy.value = "all";
  try {
    trip.value.stops = (await axios.post(`api/bus-supervisor/trips/${trip.value.id}/arrive-all`)).data.data;
    toast.add({ severity: "success", summary: t("tr.arrived_all"), detail: t("tr.sent"), life: 2500 });
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: error?.response?.data?.message, life: 4000 });
  } finally {
    busy.value = null;
    confirming.value = null;
  }
}

const statusTime = (stop) => {
  const at = stop[`${stop.status}_at`];
  return at ? new Date(at).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) : "";
};
</script>

<template>
  <div class="bus-trips">
    <!-- The day's trips -->
    <template v-if="!tripId">
      <div class="sawa-card p-3 mb-3">
        <h1 class="text-xl text-bp-135c65 font-bold m-0">{{ $t("tr.my_trips") }}</h1>
        <p class="text-sm text-color-secondary mt-1 mb-3">{{ $t("tr.my_trips_lead") }}</p>
        <div class="flex items-center gap-2">
          <Button icon="pi pi-chevron-right" rounded variant="outlined" :aria-label="$t('tr.prev_day')" @click="shift(-1)" />
          <DatePicker v-model="day" dateFormat="yy-mm-dd" showIcon class="flex-1" inputClass="w-full" :aria-label="$t('tr.date')" />
          <Button icon="pi pi-chevron-left" rounded variant="outlined" :aria-label="$t('tr.next_day')" @click="shift(1)" />
        </div>
        <Button variant="text" size="small" class="mt-2" :label="$t('tr.today')" @click="day = new Date()" />
      </div>

      <div v-if="loading" class="flex justify-center py-6"><ProgressSpinner style="width: 2.5rem; height: 2.5rem" /></div>
      <p v-else-if="!trips.length" class="sawa-card p-4 text-center text-color-secondary">{{ $t("tr.no_trips") }}</p>
      <button v-for="row in trips" v-else :key="row.id" type="button" class="trip-card sawa-card" @click="openTrip(row)">
        <span class="trip-card__icon" aria-hidden="true"><i :class="row.direction === 'to_home' ? 'pi pi-home' : 'pi pi-building'" /></span>
        <span class="flex-1 text-start">
          <span class="block font-bold">{{ $t(`tr.dir.${row.direction}`) }} — {{ row.route ?? "—" }}</span>
          <span class="block text-sm text-color-secondary"><span dir="ltr">{{ row.from }} – {{ row.to }}</span> · {{ $t("tr.bus") }} <span dir="ltr">{{ row.vehicle?.plate_number }}</span></span>
          <span class="block text-sm text-color-secondary">{{ $t("tr.children_count", { n: row.children_count ?? 0 }) }}<template v-if="row.driver"> · {{ $t("driver_name") }}: {{ row.driver }}</template></span>
        </span>
        <i class="pi pi-angle-left text-color-secondary" aria-hidden="true" />
      </button>
    </template>

    <!-- One trip -->
    <template v-else>
      <div v-if="loading && !trip" class="flex justify-center py-6"><ProgressSpinner style="width: 2.5rem; height: 2.5rem" /></div>
      <template v-else-if="trip">
        <div class="sawa-card p-3 mb-3">
          <Button icon="pi pi-arrow-right" variant="text" size="small" :label="$t('tr.my_trips')" class="mb-2" @click="back" />
          <h1 class="text-lg font-bold m-0">{{ $t(`tr.dir.${trip.direction}`) }} — {{ trip.route ?? "—" }}</h1>
          <p class="text-sm text-color-secondary m-0">
            <span dir="ltr">{{ trip.date }}</span> · <span dir="ltr">{{ trip.from }} – {{ trip.to }}</span> · {{ $t("tr.bus") }} <span dir="ltr">{{ trip.vehicle?.plate_number }}</span>
          </p>
          <div class="flex flex-wrap gap-2 mt-2">
            <Tag v-for="(n, status) in counts" :key="status" :severity="STOP_SEVERITY[status]" :value="`${stopLabel(status)}: ${n}`" />
          </div>
          <Button v-if="canMark && trip.direction === 'to_academy' && waiting" class="w-full mt-3" size="large" icon="pi pi-check-circle" severity="success"
            :label="$t('tr.arrive_all', { n: waiting })" :loading="busy === 'all'" @click="confirming = { all: true }" />
        </div>

        <p v-if="!trip.stops.length" class="sawa-card p-4 text-center text-color-secondary">{{ $t("tr.no_children") }}</p>
        <article v-for="stop in trip.stops" :key="stop.id" class="sawa-card p-3 mb-2 stop">
          <div class="flex items-start justify-between gap-2">
            <div>
              <h2 class="text-base font-bold m-0">{{ stop.child.name }}</h2>
              <p v-if="stop.child.address" class="text-sm m-0"><i class="pi pi-map-marker text-xs" aria-hidden="true" /> {{ stop.child.address }}</p>
              <p v-if="stop.parent" class="text-sm m-0">
                {{ stop.parent.name }} ·
                <a v-if="stop.parent.phone" :href="`tel:${stop.parent.phone}`" dir="ltr" class="text-primary">{{ stop.parent.phone }}</a>
              </p>
            </div>
            <div class="text-end">
              <Tag :severity="STOP_SEVERITY[stop.status]" :value="stopLabel(stop.status)" />
              <Tag v-if="stop.skipped" severity="info" icon="pi pi-calendar-times" :value="$t('trq.skipped')" />
              <div v-if="statusTime(stop)" class="text-xs text-color-secondary mt-1" dir="ltr">{{ statusTime(stop) }}</div>
            </div>
          </div>
          <div v-if="canMark && ['pending', 'approaching'].includes(stop.status)" class="stop__actions">
            <Button v-if="stop.status === 'pending'" severity="warn" icon="pi pi-clock" :label="$t('tr.do.approaching')" :loading="busy === `${stop.id}-approaching`" @click="mark(stop, 'approaching')" />
            <Button severity="success" icon="pi pi-check" :label="$t(trip.direction === 'to_home' ? 'tr.do.arrived_home' : 'tr.do.arrived')" :loading="busy === `${stop.id}-arrived`" @click="mark(stop, 'arrived')" />
            <Button severity="danger" variant="outlined" icon="pi pi-times" :label="$t('tr.do.absent')" @click="confirming = { stop }" />
          </div>
        </article>
      </template>
    </template>

    <Dialog :visible="!!confirming" modal :header="$t('tr.confirm')" :style="{ width: '26rem', maxWidth: '95vw' }" @update:visible="confirming = null">
      <p class="m-0">{{ confirming?.all ? $t("tr.confirm_all", { n: waiting }) : $t("tr.confirm_absent", { name: confirming?.stop?.child?.name }) }}</p>
      <template #footer>
        <Button variant="text" severity="secondary" :label="$t('no')" @click="confirming = null" />
        <Button :severity="confirming?.all ? 'success' : 'danger'" :label="$t('yes')" :loading="!!busy"
          @click="confirming?.all ? arriveAll() : mark(confirming.stop, 'absent')" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.bus-trips {
  max-width: 40rem;
  margin-inline: auto;
}
.trip-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.9rem 1rem;
  margin-bottom: 0.5rem;
  border: 1px solid var(--p-content-border-color);
  cursor: pointer;
  font: inherit;
  color: inherit;
}
.trip-card:hover,
.trip-card:focus-visible {
  border-color: var(--p-primary-color);
}
.trip-card__icon {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--p-primary-50, #eef6f2);
  color: var(--p-primary-color);
}
.stop__actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr));
  gap: 0.5rem;
  margin-top: 0.75rem;
}
.stop__actions :deep(.p-button) {
  min-height: 2.75rem;
}
</style>
