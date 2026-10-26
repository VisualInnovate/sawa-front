<script setup>
// Booking a consultation, step 1: the days with a free consultant, then the free times of the chosen day.
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "axios";
import PageHead from "@/components/parent/PageHead.vue";
import EmptyState from "@/components/parent/EmptyState.vue";
import { useParentPortalStore } from "@/stores/ParentPortal";
import { fmtTime, locale } from "@/utils/parentPortal";

const props = defineProps({ child_id: { type: [String, Number], required: true } });
const { t } = useI18n();
const router = useRouter();
const portal = useParentPortalStore();

const loading = ref(true);
const days = ref([]);
const selected = ref(null);
const slots = ref([]);
const slotsLoading = ref(false);
let request = 0;

const child = computed(() => portal.childById(props.child_id));

onMounted(async () => {
  portal.load();
  try {
    const { data } = await axios.get("/api/event-calendar/get/front");
    // The API groups the dates by weekday; one chronological list is clearer.
    const dates = Object.values(data.data || {}).flatMap((events) => events || []).map((event) => event.start);
    days.value = [...new Set(dates)].sort().map((date) => {
      const day = new Date(`${date}T00:00:00`);
      return {
        date,
        weekday: new Intl.DateTimeFormat(locale(), { weekday: "long" }).format(day),
        number: day.getDate(),
        month: new Intl.DateTimeFormat(locale(), { month: "long" }).format(day),
      };
    });
  } catch {
    days.value = [];
  } finally {
    loading.value = false;
  }
});

async function openDay(day) {
  const current = ++request;
  selected.value = day;
  slots.value = [];
  slotsLoading.value = true;
  try {
    const { data } = await axios.get(`/api/event-calendar/get/${day.date}/slots`);
    if (current !== request) return;
    slots.value = [...(data.data || [])].sort((a, b) => a.start.localeCompare(b.start));
  } catch {
    // 404 when the day has no free time left.
    if (current === request) slots.value = [];
  } finally {
    if (current === request) slotsLoading.value = false;
  }
}

// The slot's length in minutes ("2026-11-03T13:00:00" … "14:00:00").
const minutes = (slot) => {
  const at = (value) => new Date(String(value).includes("T") || String(value).includes(" ") ? String(value).replace(" ", "T") : `2000-01-01T${value}`);
  return Math.max(0, Math.round((at(slot.end) - at(slot.start)) / 60000));
};

const choose = (slot) => router.push({ name: "more", params: { event_id: slot.id, child_id: props.child_id } });
</script>

<template>
  <div class="pp-page">
    <PageHead :title="$t('pp.slot_title')" :lead="child ? $t('pp.slot_lead_child', { name: child.name }) : $t('pp.slot_lead')" :back="{ name: 'Edit' }" :kicker="$t('pp.step_of', { n: 1, total: 2 })" icon="pi pi-calendar" />

    <div v-if="loading" class="pp-days"><div v-for="i in 6" :key="i" class="pp-skeleton" style="height: 128px" /></div>
    <EmptyState v-else-if="!days.length" icon="pi pi-calendar-times" :title="$t('pp.slot_none_title')" :text="$t('booking_no_days')">
      <router-link :to="{ name: 'contactus' }" class="pp-btn pp-btn--soft"><i class="pi pi-phone" /> {{ $t("pp.nav_contact") }}</router-link>
    </EmptyState>

    <div v-else class="pp-days">
      <button v-for="(day, i) in days" :key="day.date" type="button" class="pp-day pp-in" :class="{ 'is-active': selected?.date === day.date }" :style="{ '--i': i }" @click="openDay(day)">
        <span class="pp-day__weekday">{{ day.weekday }}</span>
        <span class="pp-day__number">{{ day.number }}</span>
        <span class="pp-day__month">{{ day.month }}</span>
      </button>
    </div>

    <Dialog class="pp-overlay" :visible="Boolean(selected)" modal :style="{ width: '34rem', maxWidth: '94vw' }" @update:visible="selected = null">
      <template #header>
        <div v-if="selected" class="pp-slot-head">
          <span class="pp-slot-head__date"><b>{{ selected.number }}</b>{{ selected.month }}</span>
          <div>
            <p class="pp-slot-head__title">{{ $t("pp.slots_title") }}</p>
            <p class="pp-slot-head__sub">{{ selected.weekday }}<template v-if="!slotsLoading && slots.length"> · {{ $t("pp.slots_count", { n: slots.length }) }}</template></p>
          </div>
        </div>
      </template>
      <div v-if="slotsLoading" class="pp-slots"><div v-for="i in 4" :key="i" class="pp-skeleton" style="height: 76px" /></div>
      <Message v-else-if="!slots.length" severity="warn" :closable="false">{{ $t("booking_no_slots_day") }}</Message>
      <ul v-else class="pp-slots">
        <li v-for="(slot, i) in slots" :key="slot.id">
          <button type="button" class="pp-slot pp-in" :style="{ '--i': i }" @click="choose(slot)">
            <span class="pp-slot__icon"><i class="pi pi-clock" aria-hidden="true" /></span>
            <span class="pp-slot__body">
              <span class="pp-slot__time">{{ fmtTime(slot.start) }} <span class="pp-slot__to">–</span> {{ fmtTime(slot.end) }}</span>
              <span class="pp-slot__meta">
                <span>{{ $t("pp.slot_minutes", { n: minutes(slot) }) }}</span>
                <span v-if="slot.title" class="pp-slot__chip">{{ slot.title }}</span>
              </span>
            </span>
            <span class="pp-slot__go">{{ $t("pp.slot_book") }} <i class="pi pi-arrow-left pp-flip" aria-hidden="true" /></span>
          </button>
        </li>
      </ul>
    </Dialog>
  </div>
</template>

<style scoped>
.pp-days {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 140px), 1fr));
  gap: 0.75rem;
}
.pp-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  padding: 1rem 0.5rem;
  border: 2px solid transparent;
  border-radius: var(--pp-radius);
  background: #fff;
  box-shadow: var(--pp-shadow);
  font: inherit;
  cursor: pointer;
  transition: transform 0.2s var(--pp-ease), border-color 0.2s, box-shadow 0.2s;
}
.pp-day:hover,
.pp-day.is-active {
  border-color: var(--pp-teal);
  transform: translateY(-3px);
  box-shadow: var(--pp-shadow-lg);
}
.pp-day__weekday {
  font-weight: 800;
  color: var(--pp-teal-900);
}
.pp-day__number {
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1.1;
  color: var(--pp-magenta);
}
.pp-day__month {
  color: var(--pp-muted);
  font-size: 0.9rem;
}
</style>

<!-- The dialog is rendered at the end of <body>, outside this component's scope. -->
<style>
.pp-slot-head {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}
.pp-slot-head__date {
  display: grid;
  place-items: center;
  flex: none;
  min-width: 58px;
  padding: 0.35rem 0.6rem;
  white-space: nowrap;
  border-radius: 16px;
  background: var(--pp-magenta-50);
  color: var(--pp-magenta);
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.2;
}
.pp-slot-head__date b {
  font-size: 1.5rem;
  font-weight: 800;
}
.pp-slot-head__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--pp-teal-900);
}
.pp-slot-head__sub {
  margin: 0.1rem 0 0;
  font-size: 0.85rem;
  color: var(--pp-muted);
}
.pp-slots {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.pp-slot {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.8rem 0.9rem;
  border: 1.5px solid var(--pp-teal-100);
  border-radius: var(--pp-radius-sm);
  background: #fff;
  font: inherit;
  color: inherit;
  text-align: start;
  cursor: pointer;
  transition: border-color 0.18s, background 0.18s, transform 0.18s var(--pp-ease), box-shadow 0.18s;
}
.pp-slot:hover {
  border-color: var(--pp-magenta);
  background: var(--pp-magenta-50);
  transform: translateY(-1px);
  box-shadow: var(--pp-shadow);
}
.pp-slot:focus-visible {
  outline: 3px solid rgba(178, 21, 83, 0.45);
  outline-offset: 2px;
}
.pp-slot__icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: var(--pp-teal-50);
  color: var(--pp-teal-900);
  font-size: 1.1rem;
  transition: background 0.18s, color 0.18s;
}
.pp-slot:hover .pp-slot__icon {
  background: #fff;
  color: var(--pp-magenta);
}
.pp-slot__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.pp-slot__time {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--pp-ink);
  font-variant-numeric: tabular-nums;
}
.pp-slot__to {
  color: var(--pp-muted);
  font-weight: 600;
}
.pp-slot__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--pp-muted);
}
.pp-slot__chip {
  padding: 0.1rem 0.55rem;
  border-radius: 999px;
  background: var(--pp-teal-50);
  color: var(--pp-teal-900);
  font-weight: 700;
}
.pp-slot__go {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 40px;
  padding: 0 1rem;
  border-radius: 999px;
  background: var(--pp-magenta);
  color: #fff;
  font-weight: 800;
  font-size: 0.88rem;
  box-shadow: 0 8px 18px -10px rgba(178, 21, 83, 0.8);
}
[dir="ltr"] .pp-slot__go .pp-flip {
  transform: scaleX(-1);
}
@media (max-width: 420px) {
  .pp-slot__go {
    padding: 0 0.75rem;
  }
  .pp-slot__icon {
    display: none;
  }
}
</style>
