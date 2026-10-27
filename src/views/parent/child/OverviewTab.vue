<script setup>
// The child's page at a glance: the next two weeks, the program, the money, the home M-CHAT, and what the parent
// can do next.
import { computed } from "vue";
import EmptyState from "@/components/parent/EmptyState.vue";
import UpcomingItem from "@/components/parent/UpcomingItem.vue";
import { fmtDate, meta, money } from "@/utils/parentPortal";

const props = defineProps({ child: { type: Object, required: true }, overview: { type: Object, required: true }, childId: { type: [Number, String], required: true } });
const upcoming = computed(() => props.overview.upcoming ?? []);
const finance = computed(() => props.overview.finance ?? null);
const mchat = computed(() => props.overview.home_mchat ?? null);
const programs = computed(() => props.child.programs ?? []);
const RISK = { low: ["success", "منخفض"], medium: ["warn", "متوسط"], high: ["danger", "مرتفع"] };
</script>

<template>
  <div class="pp-grid pp-overview">
    <section class="pp-card pp-card--pad pp-stack pp-in">
      <h2 class="pp-h2"><i class="pi pi-calendar-clock text-[var(--pp-teal)]" /> {{ $t("pp.next_two_weeks") }}</h2>
      <div v-if="upcoming.length" class="pp-list">
        <UpcomingItem v-for="item in upcoming" :key="item.key" :item="item" />
      </div>
      <EmptyState v-else icon="pi pi-calendar" :text="$t('pp.nothing_upcoming')" />
      <router-link :to="{ name: 'parent-schedule' }" class="pp-link text-sm">{{ $t("pp.full_schedule") }} <i class="pi pi-angle-left rtl-arrow" /></router-link>
    </section>

    <div class="pp-stack">
      <section class="pp-card pp-card--pad pp-stack pp-in" :style="{ '--i': 1 }">
        <h2 class="pp-h2"><i class="pi pi-book text-[var(--pp-teal)]" /> {{ $t("pp.tab_program") }}</h2>
        <template v-if="programs.length">
          <div v-for="program in programs" :key="program.id" class="pp-soft p-3">
            <div class="pp-row pp-between">
              <b>{{ meta("programKind", program.kind).label }}</b>
              <span class="pp-tag" :class="`pp-tag--${meta('programStatus', program.status).severity}`">{{ meta("programStatus", program.status).label }}</span>
            </div>
            <dl class="pp-kv mt-2">
              <dt>{{ $t("sp_period") }}</dt><dd>{{ fmtDate(program.start_date) }} — {{ fmtDate(program.end_date) }}</dd>
              <template v-if="program.therapist"><dt>{{ $t("sp_therapist") }}</dt><dd>{{ program.therapist }}</dd></template>
              <template v-if="program.weekly_sessions"><dt>{{ $t("sp_weekly_sessions") }}</dt><dd>{{ program.weekly_sessions }}</dd></template>
            </dl>
          </div>
        </template>
        <p v-else class="pp-lead">{{ $t("pp.no_program_text") }}</p>
      </section>

      <section v-if="finance" class="pp-card pp-card--pad pp-stack pp-in" :style="{ '--i': 2 }">
        <h2 class="pp-h2"><i class="pi pi-wallet text-[var(--pp-teal)]" /> {{ $t("pp.tab_finance") }}</h2>
        <div class="pp-bar"><span :style="{ width: `${finance.owed ? Math.min(100, Math.round((finance.paid / finance.owed) * 100)) : 0}%` }" /></div>
        <dl class="pp-kv">
          <dt>{{ $t("acc.owed") }}</dt><dd class="pp-num">{{ money(finance.owed, finance.currency) }}</dd>
          <dt>{{ $t("acc.paid") }}</dt><dd class="pp-num text-[var(--pp-success)]">{{ money(finance.paid, finance.currency) }}</dd>
          <dt>{{ $t("acc.remaining") }}</dt><dd class="pp-num">{{ money(finance.remaining, finance.currency) }}</dd>
          <template v-if="finance.late > 0"><dt>{{ $t("acc.late") }}</dt><dd class="pp-num text-[var(--pp-danger)]">{{ money(finance.late, finance.currency) }}</dd></template>
        </dl>
      </section>

      <section class="pp-card pp-card--pad pp-stack pp-in" :style="{ '--i': 3 }">
        <h2 class="pp-h2"><i class="pi pi-heart text-[var(--pp-magenta)]" /> {{ $t("pmchat.title") }}</h2>
        <template v-if="mchat">
          <p class="m-0 pp-muted">{{ $t("pp.mchat_last", { date: fmtDate(mchat.date) }) }}</p>
          <span class="pp-tag" :class="`pp-tag--${RISK[mchat.risk]?.[0] ?? 'neutral'}`">{{ mchat.total }}/{{ mchat.out_of || 20 }} · {{ RISK[mchat.risk]?.[1] ?? mchat.risk }}</span>
        </template>
        <p v-else class="m-0 pp-muted">{{ $t("pp.mchat_none") }}</p>
        <router-link :to="{ name: 'parent-mchat', params: { child_id: childId } }" class="pp-btn pp-btn--soft pp-btn--sm justify-self-start"><i class="pi pi-heart" /> {{ $t("pmchat.button") }}</router-link>
      </section>
    </div>
  </div>
</template>

<style scoped>
.pp-overview {
  grid-template-columns: 1fr;
}
[dir="ltr"] .rtl-arrow {
  transform: scaleX(-1);
}
@media (min-width: 1024px) {
  .pp-overview {
    grid-template-columns: 1.2fr 1fr;
    align-items: start;
  }
}
</style>
