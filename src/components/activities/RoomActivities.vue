<script setup>
// A room's weekly activities: each an activity from–to on chosen weekdays, kept until changed. Used on the
// activities page (a room picker on top) and from the rooms list (`roomId` fixed). The server refuses a time outside
// the room's hours that day or overlapping another activity of the same room; its reasons are shown in the form.
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import axios from "axios";
import { DAY_INDEXES, formatDays } from "@/utils/activities";

const props = defineProps({
  // A fixed room (from the rooms list); without it the component offers a room picker.
  roomId: { type: [Number, String], default: null },
});

const { t } = useI18n();
const router = useRouter();
const toast = useToast();

const rooms = ref([]);
const activities = ref([]);
const pickedRoom = ref(props.roomId ? Number(props.roomId) : null);
const entries = ref([]);
// day => [{ program, start, end }]: the room's hours (where activities may go).
const hours = ref({});
const loading = ref(false);
const saving = ref(false);
const dialog = ref(false);
const deleting = ref(null);
const errors = ref({});
const form = ref({});

const room = computed(() => rooms.value.find((entry) => entry.id === pickedRoom.value) ?? null);
const hoursText = computed(() => DAY_INDEXES.filter((day) => hours.value[day]?.length)
  .map((day) => `${t("activities.day_" + day)} ${hours.value[day].map((period) => `${period.start}–${period.end}`).join("، ")}`));
const firstError = (key) => (Array.isArray(errors.value[key]) ? errors.value[key] : errors.value[key] ? [errors.value[key]] : []);
const notifyError = () => toast.add({ severity: "error", summary: t("error"), detail: t("request_failed_retry"), life: 4000 });

async function loadLists() {
  try {
    const [list, roomList] = await Promise.all([axios.get("api/activities"), axios.get("api/room-activities", { params: { room_id: -1 } })]);
    activities.value = list.data.data ?? [];
    rooms.value = roomList.data.rooms ?? [];
  } catch {
    notifyError();
  }
}

async function loadWeek() {
  entries.value = [];
  hours.value = {};
  if (!pickedRoom.value) return;
  loading.value = true;
  try {
    const { data } = await axios.get(`api/room-activities/rooms/${pickedRoom.value}/week`);
    entries.value = data.data ?? [];
    hours.value = data.hours ?? {};
  } catch {
    notifyError();
  } finally {
    loading.value = false;
  }
}

function openNew() {
  form.value = { activity_id: null, days: DAY_INDEXES.filter((day) => hours.value[day]?.length), start: "", end: "" };
  errors.value = {};
  dialog.value = true;
}
function edit(entry) {
  form.value = { id: entry.id, activity_id: entry.activity_id, days: [...entry.days], start: entry.start, end: entry.end };
  errors.value = {};
  dialog.value = true;
}
async function save() {
  if (saving.value) return;
  saving.value = true;
  errors.value = {};
  const body = { ...form.value, room_id: pickedRoom.value };
  try {
    if (form.value.id) await axios.put(`api/room-activities/${form.value.id}`, body);
    else await axios.post("api/room-activities", body);
    dialog.value = false;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("successful"), life: 2500 });
    await loadWeek();
  } catch (error) {
    if (error.response?.status === 422) errors.value = error.response.data.errors || {};
    else notifyError();
  } finally {
    saving.value = false;
  }
}
async function remove() {
  if (saving.value || !deleting.value) return;
  saving.value = true;
  try {
    await axios.delete(`api/room-activities/${deleting.value.id}`);
    deleting.value = null;
    await loadWeek();
  } catch {
    notifyError();
  } finally {
    saving.value = false;
  }
}
// The printable weekly sheet opens in its own tab.
function print() {
  window.open(router.resolve({ name: "room-activities-print", params: { roomId: pickedRoom.value } }).href, "_blank");
}

onMounted(async () => {
  await loadLists();
  loadWeek();
});
watch(pickedRoom, loadWeek);
watch(() => props.roomId, (value) => { if (value) pickedRoom.value = Number(value); });
defineExpose({ reload: loadLists });
</script>

<template>
  <section class="ra">
    <header class="ra-bar">
      <div v-if="!roomId" class="ra-room">
        <label for="ra-room">{{ $t("activities.room") }}</label>
        <Select inputId="ra-room" v-model="pickedRoom" :options="rooms" optionLabel="name" optionValue="id" filter
          :placeholder="$t('activities.pick_room')" class="ra-room-select" />
      </div>
      <h3 v-else class="ra-title">{{ room?.name }}</h3>
      <div class="ra-actions">
        <Button v-if="pickedRoom" :label="$t('activities.print_week')" icon="pi pi-print" severity="secondary" variant="outlined" @click="print" />
        <Button v-if="pickedRoom" v-can="'room activities edit'" :label="$t('activities.add_to_room')" icon="pi pi-plus" @click="openNew" />
      </div>
    </header>

    <p v-if="!pickedRoom" class="ra-empty"><i class="pi pi-building" aria-hidden="true" /> {{ $t("activities.pick_room_hint") }}</p>
    <template v-else>
      <p v-if="hoursText.length" class="ra-hours"><i class="pi pi-clock" aria-hidden="true" /> {{ $t("activities.room_hours") }}: {{ hoursText.join(" · ") }}</p>
      <Message v-else-if="!loading" severity="warn" :closable="false">{{ $t("activities.no_room_hours") }}</Message>

      <DataTable :value="entries" :loading="loading" dataKey="id" class="ra-table" sortField="start" :sortOrder="1">
        <template #empty><div class="ra-empty">{{ $t("activities.no_room_activities") }}</div></template>
        <Column :header="$t('activities.activity')">
          <template #body="{ data }">
            <span class="ra-activity">
              <img v-if="data.activity?.image_url" :src="data.activity.image_url" alt="" />
              <b>{{ data.activity?.name }}</b>
            </span>
          </template>
        </Column>
        <Column field="start" :header="$t('activities.time')" sortable style="width: 10rem">
          <template #body="{ data }"><span dir="ltr" class="ra-time">{{ data.start }} – {{ data.end }}</span></template>
        </Column>
        <Column :header="$t('activities.days')">
          <template #body="{ data }">
            <div class="ra-days">
              <Tag v-for="day in data.days" :key="day" :value="$t('activities.day_' + day)" severity="secondary" />
            </div>
          </template>
        </Column>
        <Column style="width: 7rem">
          <template #body="{ data }">
            <div class="table-actions">
              <Button v-can="'room activities edit'" icon="pi pi-pencil" rounded variant="outlined" severity="info" :aria-label="$t('edit')" v-tooltip.top="$t('edit')" @click="edit(data)" />
              <Button v-can="'room activities edit'" icon="pi pi-trash" rounded variant="outlined" severity="danger" :aria-label="$t('delete')" v-tooltip.top="$t('delete')" @click="deleting = data" />
            </div>
          </template>
        </Column>
      </DataTable>
    </template>

    <Dialog v-model:visible="dialog" modal :header="form.id ? $t('activities.edit_slot') : $t('activities.add_to_room')" :style="{ width: '560px', maxWidth: '95vw' }"
      :closable="!saving">
      <form class="ra-form" data-no-request-spinner @submit.prevent="save">
        <div class="ra-field">
          <label for="ra-activity">{{ $t("activities.activity") }}</label>
          <Select inputId="ra-activity" v-model="form.activity_id" :options="activities" optionLabel="name" optionValue="id" filter fluid
            :invalid="Boolean(errors.activity_id)" :placeholder="$t('activities.pick_activity')" :emptyMessage="$t('activities.no_activities')">
            <template #option="{ option }">
              <span class="ra-activity"><img v-if="option.image_url" :src="option.image_url" alt="" />{{ option.name }}</span>
            </template>
          </Select>
          <small v-for="message in firstError('activity_id')" :key="message" class="ra-error">{{ message }}</small>
        </div>
        <div class="ra-field">
          <label>{{ $t("activities.days") }}</label>
          <div class="ra-day-picks">
            <label v-for="day in DAY_INDEXES" :key="day" class="ra-day" :class="{ 'is-off': !hours[day]?.length }">
              <Checkbox v-model="form.days" :value="day" />
              <span>{{ $t("activities.day_" + day) }}</span>
            </label>
          </div>
          <small v-for="message in firstError('days')" :key="message" class="ra-error">{{ message }}</small>
        </div>
        <div class="ra-times">
          <div class="ra-field">
            <label for="ra-start">{{ $t("activities.from") }}</label>
            <input id="ra-start" v-model="form.start" type="time" class="ra-input" :class="{ 'is-invalid': errors.start }" />
          </div>
          <div class="ra-field">
            <label for="ra-end">{{ $t("activities.to") }}</label>
            <input id="ra-end" v-model="form.end" type="time" class="ra-input" :class="{ 'is-invalid': errors.end }" />
          </div>
        </div>
        <!-- The server's reasons: outside the room's hours, or a clash with another activity of the room. -->
        <Message v-if="errors.start || errors.end" severity="error" :closable="false">
          <ul class="ra-reasons"><li v-for="message in [...firstError('start'), ...firstError('end')]" :key="message">{{ message }}</li></ul>
        </Message>
        <p class="ra-note">{{ $t("activities.rules_hint") }}</p>
        <div class="ra-form-actions">
          <Button type="submit" :loading="saving" :label="$t('submit')" icon="pi pi-check" />
        </div>
      </form>
    </Dialog>

    <Dialog :visible="Boolean(deleting)" modal :header="$t('delete')" :style="{ width: '440px', maxWidth: '95vw' }" @update:visible="deleting = null">
      <p class="m-0">{{ $t("activities.remove_slot_confirm", { name: deleting?.activity?.name, days: formatDays(deleting?.days ?? [], $t) }) }}</p>
      <template #footer>
        <Button :label="$t('no')" variant="text" severity="secondary" :disabled="saving" @click="deleting = null" />
        <Button :label="$t('yes')" severity="danger" :loading="saving" @click="remove" />
      </template>
    </Dialog>
  </section>
</template>

<style scoped>
.ra { display: grid; gap: .9rem; }
.ra-bar { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: .75rem; }
.ra-room { display: grid; gap: .35rem; }
.ra-room label { font-weight: 700; }
.ra-room-select { min-width: 16rem; }
.ra-title { margin: 0; font-size: 1.1rem; font-weight: 800; color: var(--sawa-primary, #135c65); }
.ra-actions { display: flex; flex-wrap: wrap; gap: .5rem; }
.ra-hours { margin: 0; padding: .5rem .75rem; border-radius: 10px; background: #f1f5f9; color: #334155; font-size: .88rem; }
.ra-empty { margin: 0; padding: 1.5rem; color: var(--sawa-muted, #64748b); text-align: center; }
.ra-activity { display: inline-flex; align-items: center; gap: .6rem; }
.ra-activity img { width: 2.4rem; height: 2.4rem; border-radius: 8px; object-fit: cover; border: 1px solid #e2e8f0; }
.ra-time { font-weight: 700; white-space: nowrap; }
.ra-days { display: flex; flex-wrap: wrap; gap: .25rem; }
.ra-form { display: grid; gap: 1rem; }
.ra-field { display: grid; gap: .4rem; }
.ra-field > label { font-weight: 700; }
.ra-day-picks { display: flex; flex-wrap: wrap; gap: .5rem .9rem; }
.ra-day { display: inline-flex; align-items: center; gap: .35rem; cursor: pointer; }
.ra-day.is-off { opacity: .55; }
.ra-times { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
.ra-input { width: 100%; padding: .55rem .7rem; border: 1px solid var(--p-inputtext-border-color, #cbd5e1); border-radius: 8px; font: inherit; direction: ltr; }
.ra-input.is-invalid { border-color: #ef4444; }
.ra-error { color: #dc2626; }
.ra-reasons { margin: 0; padding-inline-start: 1.1rem; }
.ra-note { margin: 0; color: var(--sawa-muted, #64748b); font-size: .82rem; }
.ra-form-actions { display: flex; justify-content: flex-end; }
</style>
