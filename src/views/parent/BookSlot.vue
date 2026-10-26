<script setup>
// Booking a consultation, step 1: the days with a free consultant, then the free times of the chosen day.
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "axios";
import PageHead from "@/components/parent/PageHead.vue";
import EmptyState from "@/components/parent/EmptyState.vue";
import { useParentPortalStore } from "@/stores/ParentPortal";
import { fmtDay, fmtTime, locale } from "@/utils/parentPortal";

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

    <Dialog :visible="Boolean(selected)" modal :header="selected ? `${$t('المواعيد المتاحة')} — ${fmtDay(selected.date)}` : ''" :style="{ width: '32rem', maxWidth: '94vw' }" @update:visible="selected = null">
      <div v-if="slotsLoading" class="pp-stack"><div v-for="i in 3" :key="i" class="pp-skeleton" style="height: 56px" /></div>
      <Message v-else-if="!slots.length" severity="warn" :closable="false">{{ $t("booking_no_slots_day") }}</Message>
      <div v-else class="pp-stack">
        <div v-for="slot in slots" :key="slot.id" class="pp-item">
          <span class="pp-item__icon"><i class="pi pi-clock" /></span>
          <div class="pp-item__body">
            <p class="pp-item__title" dir="ltr">{{ fmtTime(slot.start) }} – {{ fmtTime(slot.end) }}</p>
            <p v-if="slot.title" class="pp-item__meta">{{ slot.title }}</p>
          </div>
          <button type="button" class="pp-btn pp-btn--magenta pp-btn--sm" @click="choose(slot)">{{ $t("Book_now") }}</button>
        </div>
      </div>
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
