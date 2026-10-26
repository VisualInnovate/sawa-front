<script setup>
// The child's consultations: each booking with its consultant, its time, whether it was accepted, its payment,
// and the result once written; a booking not accepted yet can be cancelled.
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import axios from "axios";
import EmptyState from "@/components/parent/EmptyState.vue";
import ConsultationResult from "@/components/parent/ConsultationResult.vue";
import { useParentPortalStore } from "@/stores/ParentPortal";
import { bookingMeta, fmtDay, fmtTime, meta, money } from "@/utils/parentPortal";

const props = defineProps({ child: { type: Object, required: true }, childId: { type: [Number, String], required: true } });
const emit = defineEmits(["changed"]);
const { t } = useI18n();
const toast = useToast();
const portal = useParentPortalStore();

const loading = ref(true);
const bookings = ref([]);
const open = ref(null);
const resultView = ref(null);
const cancelling = ref(null);
const busy = ref(false);
const currency = computed(() => portal.home?.finance?.currency ?? "JD");

async function load() {
  loading.value = true;
  try {
    bookings.value = (await axios.get(`/api/parent/child/${props.childId}/portal/consultations`)).data.bookings ?? [];
  } catch {
    bookings.value = [];
  } finally {
    loading.value = false;
  }
}
onMounted(load);

const sorted = computed(() => [...bookings.value].sort((a, b) => String(b.event_date).localeCompare(String(a.event_date))));

async function cancel() {
  busy.value = true;
  try {
    await axios.delete(`/api/calender/appointments/${cancelling.value.booking_id}`);
    toast.add({ severity: "success", summary: t("success_message"), detail: t("booking_cancelled"), life: 3000 });
    cancelling.value = null;
    await load();
    portal.refresh();
    emit("changed");
  } catch {
    toast.add({ severity: "error", summary: t("error"), detail: t("booking_cancel_failed"), life: 4000 });
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <div class="pp-stack">
    <div class="pp-row pp-between pp-in">
      <h2 class="pp-h2"><i class="pi pi-comments text-[var(--pp-teal)]" /> {{ $t("pp.tab_consultations") }}</h2>
      <router-link :to="{ name: 'BookingTime', params: { child_id: childId } }" class="pp-btn pp-btn--magenta pp-btn--sm"><i class="pi pi-calendar-plus" /> {{ $t("pp.book_consultation") }}</router-link>
    </div>

    <div v-if="loading" class="pp-stack"><div v-for="i in 2" :key="i" class="pp-skeleton" style="height: 110px" /></div>
    <EmptyState v-else-if="!bookings.length" icon="pi pi-comments" :title="$t('pp.cs_none_title')" :text="$t('pp.cs_none_text')" />

    <div v-else class="pp-stack">
      <article v-for="(booking, i) in sorted" :key="booking.booking_id" class="pp-card pp-card--pad pp-stack pp-in" :style="{ '--i': i + 1 }">
        <div class="pp-row pp-between">
          <div class="pp-row">
            <img v-if="booking.user_image" :src="booking.user_image" alt="" class="pp-consultant" />
            <span v-else class="pp-item__icon pp-item__icon--magenta"><i class="pi pi-user" /></span>
            <div>
              <p class="pp-item__title">{{ booking.user_name }}</p>
              <p class="pp-item__meta">{{ booking.user_title }}</p>
            </div>
          </div>
          <div class="pp-row">
            <span class="pp-tag" :class="`pp-tag--${bookingMeta(booking.accepted).severity}`">{{ bookingMeta(booking.accepted).label }}</span>
            <span v-if="booking.billing_status" class="pp-tag" :class="`pp-tag--${meta('billing', booking.billing_status).severity}`">
              {{ meta("billing", booking.billing_status).label }}<template v-if="booking.billing_status === 'locked' && booking.price"> · {{ money(booking.price, currency) }}</template>
            </span>
          </div>
        </div>
        <p class="pp-item__meta"><i class="pi pi-calendar" /> {{ fmtDay(booking.event_date) }} · {{ fmtTime(booking.event_date) }}</p>
        <p v-if="String(booking.accepted) === '1' && booking.consultation_settings" class="pp-note"><i class="pi pi-info-circle" /> {{ booking.consultation_settings }}</p>
        <p v-if="booking.accepted_notes" class="pp-item__meta"><b>{{ $t("ملاحظات المستشار") }}:</b> {{ booking.accepted_notes }}</p>
        <div class="pp-row">
          <button v-if="String(booking.status) === '1'" type="button" class="pp-btn pp-btn--soft pp-btn--sm" @click="open = booking"><i class="pi pi-file" /> {{ $t("نتيجة الاستشارة") }}</button>
          <button v-if="String(booking.accepted) !== '1'" type="button" class="pp-btn pp-btn--ghost pp-btn--sm text-[var(--pp-danger)]" @click="cancelling = booking"><i class="pi pi-times" /> {{ $t("إلغاء الحجز") }}</button>
        </div>
      </article>
    </div>

    <Dialog :visible="Boolean(open)" modal :header="$t('نتيجة الاستشارة')" :style="{ width: '640px', maxWidth: '94vw' }" @update:visible="open = null">
      <ConsultationResult v-if="open" ref="resultView" :booking="open" />
      <template #footer>
        <Button :label="$t('print')" icon="pi pi-print" variant="text" @click="resultView?.print()" />
        <Button :label="$t('export_pdf')" icon="pi pi-file-pdf" severity="success" @click="resultView?.pdf()" />
        <Button :label="$t('close')" icon="pi pi-times" variant="text" @click="open = null" />
      </template>
    </Dialog>

    <Dialog :visible="Boolean(cancelling)" modal :header="$t('إلغاء الحجز')" :style="{ width: '420px', maxWidth: '92vw' }" @update:visible="cancelling = null">
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
  width: 44px;
  height: 44px;
  border-radius: 14px;
  object-fit: cover;
}
.pp-note {
  display: flex;
  gap: 0.5rem;
  margin: 0;
  padding: 0.75rem 0.9rem;
  border-radius: 12px;
  background: var(--pp-info-50);
  color: var(--pp-info);
  font-size: 0.9rem;
  line-height: 1.7;
}
</style>
