<script setup>
// The consultation bookings of the selected child.
import { onMounted, ref } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import ChildTaps from "../../components/ChildTaps.vue";

const { t } = useI18n();
const router = useRouter();
const childId = Number(localStorage.getItem("child_id"));
const bookings = ref([]);
const loading = ref(true);
const failed = ref(false);

// accepted: -1 waiting, 1 accepted, 0 rejected — status: -1 in progress, 1 done, 0 cancelled (as on the bookings page).
const bookingStatus = (code) => ({
  "-1": { label: t("Pending"), tone: "pending" },
  1: { label: t("Accept"), tone: "done" },
  0: { label: t("Cancell"), tone: "cancelled" },
})[Number(code)] ?? { label: "—", tone: "none" };
const consultationStatus = (code) => ({
  "-1": { label: t("consultation_in_progress"), tone: "pending" },
  1: { label: t("consultation_done"), tone: "done" },
  0: { label: t("consultation_cancelled"), tone: "cancelled" },
})[Number(code)] ?? { label: "—", tone: "none" };

async function load() {
  loading.value = true;
  failed.value = false;
  try {
    const { data } = await axios.get(`api/calender/child/${childId}/bookings`);
    bookings.value = data?.data ?? [];
  } catch {
    failed.value = true;
    bookings.value = [];
  } finally {
    loading.value = false;
  }
}

const open = (id) => router.push({ name: "BookingDetails", params: { id } });

onMounted(load);
</script>

<template>
  <div>
    <ChildTaps />

    <div class="sawa-card consultations-page">
      <div v-if="loading" class="page-state"><i class="pi pi-spin pi-spinner" aria-hidden="true"></i><p>{{ $t("loading") }}</p></div>
      <div v-else-if="failed" class="page-state"><i class="pi pi-exclamation-circle" aria-hidden="true"></i><p>{{ $t("request_failed_retry") }}</p></div>

      <div v-else-if="bookings.length" class="consultation-grid">
        <article v-for="booking in bookings" :key="booking.id" class="consultation-card">
          <header class="consultation-head">
            <span class="consultation-date">
              <i class="pi pi-calendar" aria-hidden="true"></i>
              <span dir="ltr">{{ booking.date || "—" }}</span>
              <span v-if="booking.start" class="consultation-time" dir="ltr">{{ booking.start }}<template v-if="booking.end"> – {{ booking.end }}</template></span>
            </span>
            <span class="result-chip" :class="booking.has_result ? 'is-written' : 'is-missing'">
              <i :class="booking.has_result ? 'pi pi-check-circle' : 'pi pi-clock'" aria-hidden="true"></i>
              {{ booking.has_result ? $t("consultation_result_written") : $t("consultation_result_missing") }}
            </span>
          </header>

          <dl class="consultation-meta">
            <div>
              <dt>{{ $t("consultant") }}</dt>
              <dd>{{ booking.consultant || "—" }}</dd>
            </div>
            <div>
              <dt>{{ $t("booking_status_filter") }}</dt>
              <dd><span class="status-chip" :class="'tone-' + bookingStatus(booking.accepted).tone">{{ bookingStatus(booking.accepted).label }}</span></dd>
            </div>
            <div>
              <dt>{{ $t("consultation_status_filter") }}</dt>
              <dd><span class="status-chip" :class="'tone-' + consultationStatus(booking.status).tone">{{ consultationStatus(booking.status).label }}</span></dd>
            </div>
          </dl>

          <Button icon="pi pi-eye" :label="$t('follow_details')" variant="outlined" class="w-full" @click="open(booking.id)" />
        </article>
      </div>

      <div v-else class="page-state">
        <i class="pi pi-inbox" aria-hidden="true"></i>
        <p>{{ $t("no_child_consultations") }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.consultations-page { padding: 1.25rem; }
.consultation-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr)); gap: 1rem; }
.consultation-card { display: flex; flex-direction: column; gap: 0.9rem; padding: 1.1rem 1.25rem; border: 1px solid #e2e8f0; border-top: 4px solid var(--sawa-primary, #135c65); border-radius: 14px; background: #fff; }
.consultation-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.5rem; }
.consultation-date { display: inline-flex; align-items: center; gap: 0.4rem; color: #0f172a; font-weight: 700; }
.consultation-date i { color: var(--sawa-primary, #135c65); }
.consultation-time { color: #64748b; font-weight: 500; font-size: 0.85rem; }
.result-chip { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.25rem 0.65rem; border-radius: 999px; font-size: 0.75rem; font-weight: 700; }
.result-chip.is-written { background: #dcfce7; color: #166534; }
.result-chip.is-missing { background: #f1f5f9; color: #64748b; }
.consultation-meta { display: grid; gap: 0.55rem; margin: 0; padding: 0.75rem; border-radius: 10px; background: #f8fafc; }
.consultation-meta > div { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; }
.consultation-meta dt { color: #64748b; font-size: 0.85rem; }
.consultation-meta dd { margin: 0; color: #1e293b; font-weight: 600; }
.status-chip { padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; font-weight: 700; }
.tone-pending { background: #fef3c7; color: #92400e; }
.tone-done { background: #dcfce7; color: #166534; }
.tone-cancelled { background: #ffe4e6; color: #9f1239; }
.tone-none { background: #f1f5f9; color: #64748b; }
.page-state { display: grid; justify-items: center; gap: 0.6rem; padding: 3rem 1rem; color: #64748b; }
.page-state i { font-size: 2.25rem; color: #94a3b8; }
</style>
