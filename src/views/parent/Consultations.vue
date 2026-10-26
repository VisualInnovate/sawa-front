<script setup>
// «الاستشارات»: every consultation booked for the parent's children — coming, waiting for the consultant,
// done (with the result) or refused — and the way to book a new one.
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import axios from "axios";
import PageHead from "@/components/parent/PageHead.vue";
import EmptyState from "@/components/parent/EmptyState.vue";
import ConsultationResult from "@/components/parent/ConsultationResult.vue";
import { useParentPortalStore } from "@/stores/ParentPortal";
import { bookingMeta, fmtDay, fmtTime, isToday } from "@/utils/parentPortal";

const { t } = useI18n();
const toast = useToast();
const portal = useParentPortalStore();

const loading = ref(true);
const bookings = ref([]);
const filter = ref("all");
const open = ref(null);
const resultView = ref(null);
const cancelling = ref(null);
const busy = ref(false);

async function load() {
  loading.value = true;
  try {
    bookings.value = (await axios.get("/api/calender/appointments")).data.bookings ?? [];
  } catch {
    bookings.value = [];
  } finally {
    loading.value = false;
  }
}
onMounted(() => {
  load();
  portal.load();
});

const now = new Date().toISOString();
const FILTERS = ["all", "upcoming", "waiting", "done"];
const stateOf = (booking) => {
  if (String(booking.status) === "1") return "done";
  if (String(booking.accepted) === "1") return new Date(booking.event_date) >= new Date() ? "upcoming" : "done";
  if (String(booking.accepted) === "0") return "refused";
  return "waiting";
};
const counts = computed(() => bookings.value.reduce((acc, booking) => ({ ...acc, [stateOf(booking)]: (acc[stateOf(booking)] ?? 0) + 1 }), {}));
const shown = computed(() => [...bookings.value]
  .filter((booking) => filter.value === "all" || stateOf(booking) === filter.value)
  .sort((a, b) => String(b.event_date).localeCompare(String(a.event_date))));

async function cancel() {
  busy.value = true;
  try {
    await axios.delete(`/api/calender/appointments/${cancelling.value.booking_id}`);
    toast.add({ severity: "success", summary: t("success_message"), detail: t("booking_cancelled"), life: 3000 });
    cancelling.value = null;
    await load();
    portal.refresh();
  } catch {
    toast.add({ severity: "error", summary: t("error"), detail: t("booking_cancel_failed"), life: 4000 });
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <div class="pp-page">
    <Toast />
    <PageHead :title="$t('pp.consultations_title')" :lead="$t('pp.consultations_lead')" :kicker="$t('pp.brand')" icon="pi pi-comments">
      <template #actions>
        <router-link :to="{ name: 'Edit' }" class="pp-btn pp-btn--magenta"><i class="pi pi-calendar-plus" /> {{ $t("pp.book_consultation") }}</router-link>
      </template>
    </PageHead>

    <nav class="pp-tabs pp-in" :style="{ '--i': 1 }">
      <button v-for="key in FILTERS" :key="key" type="button" class="pp-tab" :class="{ 'is-active': filter === key }" @click="filter = key">
        {{ $t(`pp.cf_${key}`) }}
        <span v-if="key !== 'all' && counts[key]" class="pp-tab__count">{{ counts[key] }}</span>
      </button>
    </nav>

    <div v-if="loading" class="pp-grid pp-grid--2"><div v-for="i in 2" :key="i" class="pp-skeleton" style="height: 170px" /></div>
    <EmptyState v-else-if="!shown.length" icon="pi pi-comments" :title="$t('pp.cs_none_title')" :text="bookings.length ? $t('pp.cs_none_filter') : $t('pp.cs_none_text')">
      <router-link v-if="!bookings.length" :to="{ name: 'Edit' }" class="pp-btn pp-btn--magenta"><i class="pi pi-calendar-plus" /> {{ $t("pp.book_consultation") }}</router-link>
    </EmptyState>

    <div v-else class="pp-grid pp-grid--2">
      <article v-for="(booking, i) in shown" :key="booking.booking_id" class="pp-card pp-card--pad pp-stack pp-in" :style="{ '--i': i + 2 }">
        <div class="pp-row pp-between">
          <div class="pp-row">
            <img v-if="booking.user_image" :src="booking.user_image" alt="" class="pp-consultant" />
            <span v-else class="pp-item__icon pp-item__icon--magenta"><i class="pi pi-user" /></span>
            <div>
              <p class="pp-item__title">{{ booking.user_name }}</p>
              <p class="pp-item__meta">{{ booking.user_title }}</p>
            </div>
          </div>
          <span class="pp-tag" :class="`pp-tag--${bookingMeta(booking.accepted).severity}`">{{ bookingMeta(booking.accepted).label }}</span>
        </div>
        <div class="pp-soft p-3 pp-stack" style="gap: 0.3rem">
          <p class="m-0"><i class="pi pi-user text-[var(--pp-teal)]" /> <b>{{ booking.child_name }}</b></p>
          <p class="m-0"><i class="pi pi-calendar text-[var(--pp-teal)]" /> {{ isToday(booking.event_date) ? $t("pp.today") : fmtDay(booking.event_date) }} · {{ fmtTime(booking.event_date) }}</p>
        </div>
        <p v-if="String(booking.accepted) === '1' && booking.consultation_settings" class="pp-item__meta leading-7">{{ booking.consultation_settings }}</p>
        <p v-if="booking.accepted_notes" class="pp-item__meta"><b>{{ $t("ملاحظات المستشار") }}:</b> {{ booking.accepted_notes }}</p>
        <div class="pp-row">
          <button v-if="String(booking.status) === '1'" type="button" class="pp-btn pp-btn--soft pp-btn--sm" @click="open = booking"><i class="pi pi-file" /> {{ $t("نتيجة الاستشارة") }}</button>
          <router-link :to="{ name: 'parent-child', params: { child_id: booking.child_id }, query: { tab: 'consultations' } }" class="pp-btn pp-btn--ghost pp-btn--sm"><i class="pi pi-folder-open" /> {{ $t("pp.child_file") }}</router-link>
          <button v-if="String(booking.accepted) !== '1'" type="button" class="pp-btn pp-btn--ghost pp-btn--sm text-[var(--pp-danger)]" @click="cancelling = booking"><i class="pi pi-times" /> {{ $t("إلغاء الحجز") }}</button>
        </div>
      </article>
    </div>

    <Dialog class="pp-overlay" :visible="Boolean(open)" modal :header="$t('نتيجة الاستشارة')" :style="{ width: '640px', maxWidth: '94vw' }" @update:visible="open = null">
      <ConsultationResult v-if="open" ref="resultView" :booking="open" />
      <template #footer>
        <Button :label="$t('print')" icon="pi pi-print" variant="text" @click="resultView?.print()" />
        <Button :label="$t('export_pdf')" icon="pi pi-file-pdf" severity="success" @click="resultView?.pdf()" />
        <Button :label="$t('close')" icon="pi pi-times" variant="text" @click="open = null" />
      </template>
    </Dialog>

    <Dialog class="pp-overlay" :visible="Boolean(cancelling)" modal :header="$t('إلغاء الحجز')" :style="{ width: '420px', maxWidth: '92vw' }" @update:visible="cancelling = null">
      <p class="m-0 leading-7">{{ $t("confirm_cancel_booking") }}</p>
      <template #footer>
        <Button :label="$t('back')" icon="pi pi-times" variant="text" @click="cancelling = null" />
        <Button :label="$t('confirm_cancel')" icon="pi pi-check" severity="danger" :loading="busy" @click="cancel" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.pp-consultant {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  object-fit: cover;
}
</style>
