<script setup>
// The child's evaluations: the finished ones with the management's approval (an approved one opens its chart),
// and the appointments — coming, done, or waiting for their payment.
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";
import EmptyState from "@/components/parent/EmptyState.vue";
import EvaluationCharts from "@/components/parent/EvaluationCharts.vue";
import { evaluationLabel, typeIcon } from "@/components/reports/reportUtils";
import { fmtDate, fmtDay, fmtTime, meta, money } from "@/utils/parentPortal";
import { useParentPortalStore } from "@/stores/ParentPortal";

const props = defineProps({ child: { type: Object, required: true }, childId: { type: [Number, String], required: true } });
const { t } = useI18n();
const portal = useParentPortalStore();

const loading = ref(true);
const items = ref([]);
const requests = ref([]);
const charts = ref({});
const opening = ref({});
const currency = computed(() => portal.home?.finance?.currency ?? "JD");

onMounted(async () => {
  try {
    const { data } = await axios.get(`/api/parent/child/${props.childId}/portal/evaluations`);
    items.value = data.items ?? [];
    requests.value = data.requests ?? [];
  } catch {
    items.value = [];
  } finally {
    loading.value = false;
  }
});

async function toggle(item) {
  if (charts.value[item.key]) {
    delete charts.value[item.key];
    return;
  }
  opening.value[item.key] = true;
  try {
    const { data } = await axios.get(`/api/parent/child/${props.childId}/portal/report`, { params: { items: [item.key] } });
    charts.value[item.key] = data;
  } catch {
    charts.value[item.key] = null;
  } finally {
    opening.value[item.key] = false;
  }
}

const approvalHint = (item) => ({
  approved: t("pp.ev_approved_hint"), pending: t("pp.ev_pending_hint"), rejected: t("pp.ev_rejected_hint"),
})[item.approval] ?? "";
const upcoming = computed(() => requests.value.filter((row) => row.status === "0" || row.status === "2"));
const past = computed(() => requests.value.filter((row) => row.status === "1" || row.status === "3" || row.cancelled));
</script>

<template>
  <div class="pp-stack">
    <div v-if="loading" class="pp-stack">
      <div v-for="i in 3" :key="i" class="pp-skeleton" style="height: 84px" />
    </div>

    <template v-else>
      <!-- Appointments -->
      <section v-if="upcoming.length" class="pp-stack pp-in">
        <h2 class="pp-h2"><i class="pi pi-calendar text-[var(--pp-teal)]" /> {{ $t("pp.ev_appointments") }}</h2>
        <div class="pp-list">
          <div v-for="row in upcoming" :key="row.id" class="pp-item">
            <span class="pp-item__icon pp-item__icon--warn"><i :class="typeIcon(row.type)" /></span>
            <div class="pp-item__body">
              <p class="pp-item__title">{{ row.name || row.title }}</p>
              <p class="pp-item__meta">
                <template v-if="row.date">{{ fmtDay(row.date) }}<template v-if="row.start"> · {{ fmtTime(row.start) }}</template></template>
                <template v-else>{{ $t("pp.ev_no_appointment") }}</template>
                <template v-if="row.specialist"> · {{ row.specialist }}</template>
              </p>
            </div>
            <div class="pp-row">
              <span class="pp-tag" :class="`pp-tag--${meta('request', row.status).severity}`">{{ meta("request", row.status).label }}</span>
              <span v-if="row.billing_status" class="pp-tag" :class="`pp-tag--${meta('billing', row.billing_status).severity}`" :title="row.price ? money(row.price, currency) : ''">
                {{ meta("billing", row.billing_status).label }}<template v-if="row.billing_status === 'locked' && row.price"> · {{ money(row.price, currency) }}</template>
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Finished evaluations -->
      <section class="pp-stack pp-in" :style="{ '--i': 1 }">
        <h2 class="pp-h2"><i class="pi pi-clipboard text-[var(--pp-teal)]" /> {{ $t("pp.ev_done") }}</h2>
        <EmptyState v-if="!items.length" icon="pi pi-clipboard" :title="$t('pp.ev_none_title')" :text="$t('pp.ev_none_text')">
          <router-link :to="{ name: 'BookingTime', params: { child_id: childId } }" class="pp-btn pp-btn--magenta"><i class="pi pi-calendar-plus" /> {{ $t("pp.book_consultation") }}</router-link>
        </EmptyState>
        <div v-else class="pp-stack">
          <article v-for="(item, i) in items" :key="item.key" class="pp-card pp-card--pad pp-stack pp-in" :style="{ '--i': i + 2 }">
            <div class="pp-row pp-between">
              <div class="pp-row">
                <span class="pp-item__icon"><i :class="typeIcon(item.type)" /></span>
                <div>
                  <p class="pp-item__title">{{ evaluationLabel(item, $t) }}</p>
                  <p class="pp-item__meta">{{ fmtDate(item.date) }}<template v-if="item.specialist"> · {{ item.specialist.name }}</template></p>
                </div>
              </div>
              <div class="pp-row">
                <span class="pp-tag" :class="`pp-tag--${meta('approval', item.approval).severity}`"><i :class="item.approval === 'approved' ? 'pi pi-check-circle' : 'pi pi-clock'" /> {{ meta("approval", item.approval).label }}</span>
                <button v-if="item.approval === 'approved'" type="button" class="pp-btn pp-btn--soft pp-btn--sm" :disabled="opening[item.key]" @click="toggle(item)">
                  <i :class="opening[item.key] ? 'pi pi-spin pi-spinner' : charts[item.key] ? 'pi pi-eye-slash' : 'pi pi-chart-bar'" />
                  {{ charts[item.key] ? $t("pp.hide_chart") : $t("pp.show_chart") }}
                </button>
              </div>
            </div>
            <p class="pp-item__meta">{{ approvalHint(item) }}</p>
            <Transition name="pp-fade">
              <div v-if="charts[item.key] !== undefined" class="pt-1">
                <EvaluationCharts v-if="charts[item.key]" :report="charts[item.key]" />
                <p v-else class="pp-muted m-0">{{ $t("request_failed_retry") }}</p>
              </div>
            </Transition>
          </article>
        </div>
      </section>

      <!-- Past appointments -->
      <section v-if="past.length" class="pp-stack pp-in" :style="{ '--i': 3 }">
        <h3 class="pp-h3 pp-muted">{{ $t("pp.ev_past_appointments") }}</h3>
        <div class="pp-list">
          <div v-for="row in past" :key="row.id" class="pp-item" style="opacity: 0.85">
            <span class="pp-item__icon"><i :class="typeIcon(row.type)" /></span>
            <div class="pp-item__body">
              <p class="pp-item__title">{{ row.name || row.title }}</p>
              <p class="pp-item__meta">{{ fmtDate(row.date) }}<template v-if="row.specialist"> · {{ row.specialist }}</template></p>
            </div>
            <span class="pp-tag" :class="`pp-tag--${meta('request', row.cancelled ? 3 : row.status).severity}`">{{ meta("request", row.cancelled ? 3 : row.status).label }}</span>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
