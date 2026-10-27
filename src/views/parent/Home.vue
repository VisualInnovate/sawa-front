<script setup>
// The portal's home: a hello, what waits for the parent, the children, what is coming this week, the money and
// the latest news — all from one request (api/parent/home), kept in the portal store.
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useParentPortalStore } from "@/stores/ParentPortal";
import ChildCard from "@/components/parent/ChildCard.vue";
import EmptyState from "@/components/parent/EmptyState.vue";
import UpcomingItem from "@/components/parent/UpcomingItem.vue";
import { fmtDay, fmtRelative, money, notificationText } from "@/utils/parentPortal";

const { t } = useI18n();
const portal = useParentPortalStore();
onMounted(() => portal.load());

const home = computed(() => portal.home);
const children = computed(() => portal.children);
const today = computed(() => fmtDay(new Date(), { year: "numeric" }));
const hour = new Date().getHours();
const greeting = computed(() => t(hour < 12 ? "pp.good_morning" : hour < 18 ? "pp.good_afternoon" : "pp.good_evening"));

// Everything coming for every child this week, soonest first.
const upcoming = computed(() => children.value
  .flatMap((child) => (child.upcoming ?? []).map((item) => ({ ...item, childName: child.name })))
  .sort((a, b) => `${a.date} ${a.start ?? ""}`.localeCompare(`${b.date} ${b.start ?? ""}`))
  .slice(0, 6));

const attention = computed(() => {
  const rows = [];
  const pending = home.value?.pending ?? {};
  const finance = home.value?.finance ?? {};
  if (pending.generalizations) rows.push({ key: "gen", icon: "pi pi-home", cls: "pp-item__icon--magenta", title: t("pp.att_generalizations", { n: pending.generalizations }), meta: t("pp.att_generalizations_hint"), to: { name: "parent-generalizations" } });
  if (finance.late > 0) rows.push({ key: "late", icon: "pi pi-exclamation-triangle", cls: "pp-item__icon--warn", title: t("pp.att_late", { amount: money(finance.late, finance.currency) }), meta: t("pp.att_late_hint"), to: { name: "parent-finances" } });
  if (pending.consultations_waiting) rows.push({ key: "cons", icon: "pi pi-comments", cls: "pp-item__icon--info", title: t("pp.att_consultations", { n: pending.consultations_waiting }), meta: t("pp.att_consultations_hint"), to: { name: "Booking" } });
  if (pending.evaluations_waiting) rows.push({ key: "eval", icon: "pi pi-clipboard", cls: "pp-item__icon--warn", title: t("pp.att_evaluations", { n: pending.evaluations_waiting }), meta: t("pp.att_evaluations_hint"), to: { name: "Edit" } });
  return rows;
});
const finance = computed(() => home.value?.finance ?? null);
const news = computed(() => home.value?.notifications?.latest ?? []);
</script>

<template>
  <div class="pp-page">
    <!-- Hello -->
    <section class="pp-card pp-card--teal pp-hello pp-in">
      <div class="pp-hello__text">
        <p class="pp-hello__date">{{ today }}</p>
        <h1 class="pp-hello__title">{{ greeting }}<template v-if="home?.parent?.fname">، {{ home.parent.fname }}</template> 👋</h1>
        <p class="pp-hello__lead">{{ $t("pp.home_lead") }}</p>
        <div class="pp-hello__actions">
          <router-link :to="{ name: 'Edit' }" class="pp-btn pp-btn--magenta"><i class="pi pi-calendar-plus" /> {{ $t("pp.book_consultation") }}</router-link>
          <router-link :to="{ name: 'parent-schedule' }" class="pp-btn pp-btn--ghost"><i class="pi pi-calendar" /> {{ $t("pp.week_schedule") }}</router-link>
          <router-link :to="{ name: 'ReAction' }" class="pp-btn pp-btn--ghost"><i class="pi pi-user-plus" /> {{ $t("Add_new_child") }}</router-link>
        </div>
      </div>
      <div class="pp-hello__art pp-float" aria-hidden="true">
        <span class="pp-hello__bubble pp-hello__bubble--1" />
        <span class="pp-hello__bubble pp-hello__bubble--2" />
        <i class="pi pi-sparkles" />
      </div>
    </section>

    <!-- Loading -->
    <template v-if="portal.loading && !home">
      <div class="pp-grid pp-grid--2">
        <div v-for="i in 2" :key="i" class="pp-skeleton" style="height: 220px" />
      </div>
    </template>

    <template v-else-if="home">
      <!-- What waits for the parent -->
      <section v-if="attention.length" class="pp-stack pp-in" :style="{ '--i': 1 }">
        <h2 class="pp-h2"><i class="pi pi-bell text-[var(--pp-magenta)]" /> {{ $t("pp.needs_you") }}</h2>
        <div class="pp-list">
          <router-link v-for="row in attention" :key="row.key" :to="row.to" class="pp-item pp-item--link">
            <span class="pp-item__icon" :class="row.cls"><i :class="row.icon" /></span>
            <div class="pp-item__body">
              <p class="pp-item__title">{{ row.title }}</p>
              <p class="pp-item__meta">{{ row.meta }}</p>
            </div>
            <i class="pi pi-angle-left rtl-arrow pp-muted" aria-hidden="true" />
          </router-link>
        </div>
      </section>

      <!-- Children -->
      <section class="pp-stack">
        <div class="pp-row pp-between pp-in" :style="{ '--i': 2 }">
          <h2 class="pp-h2"><i class="pi pi-users text-[var(--pp-teal)]" /> {{ $t("pp.my_children") }}</h2>
          <router-link :to="{ name: 'clidreen_parents' }" class="pp-link">{{ $t("pp.all_children") }} <i class="pi pi-angle-left rtl-arrow" /></router-link>
        </div>
        <EmptyState v-if="!children.length" icon="pi pi-user-plus" :title="$t('pp.no_children_title')" :text="$t('pp.no_children_text')">
          <div class="pp-row justify-center">
            <router-link :to="{ name: 'ReAction' }" class="pp-btn"><i class="pi pi-plus" /> {{ $t("Add_new_child") }}</router-link>
            <router-link :to="{ name: 'parent-mchat' }" class="pp-btn pp-btn--soft"><i class="pi pi-heart" /> {{ $t("pmchat.button") }}</router-link>
          </div>
        </EmptyState>
        <div v-else class="pp-grid pp-grid--2">
          <ChildCard v-for="(child, i) in children" :key="child.id" :child="child" :index="i + 3" />
        </div>
      </section>

      <div class="pp-grid pp-home-cols">
        <!-- This week -->
        <section class="pp-card pp-card--pad pp-stack pp-in" :style="{ '--i': 4 }">
          <div class="pp-row pp-between">
            <h2 class="pp-h2"><i class="pi pi-calendar-clock text-[var(--pp-teal)]" /> {{ $t("pp.this_week") }}</h2>
            <router-link :to="{ name: 'parent-schedule' }" class="pp-link text-sm">{{ $t("pp.full_schedule") }}</router-link>
          </div>
          <div v-if="upcoming.length" class="pp-list">
            <UpcomingItem v-for="item in upcoming" :key="item.key" :item="item" :childName="children.length > 1 ? item.childName : ''" />
          </div>
          <EmptyState v-else icon="pi pi-calendar" :text="$t('pp.nothing_this_week')" />
        </section>

        <div class="pp-stack">
          <!-- Money -->
          <section v-if="finance && finance.owed > 0" class="pp-card pp-card--pad pp-stack pp-in" :style="{ '--i': 5 }">
            <div class="pp-row pp-between">
              <h2 class="pp-h2"><i class="pi pi-wallet text-[var(--pp-teal)]" /> {{ $t("pp.fees_summary") }}</h2>
              <router-link :to="{ name: 'parent-finances' }" class="pp-link text-sm">{{ $t("pp.details") }}</router-link>
            </div>
            <div class="pp-bar"><span :style="{ width: `${finance.owed ? Math.min(100, Math.round((finance.paid / finance.owed) * 100)) : 0}%` }" /></div>
            <div class="pp-money">
              <div><span class="pp-money__label">{{ $t("acc.owed") }}</span><b class="pp-num">{{ money(finance.owed, finance.currency) }}</b></div>
              <div><span class="pp-money__label">{{ $t("acc.paid") }}</span><b class="pp-num text-[var(--pp-success)]">{{ money(finance.paid, finance.currency) }}</b></div>
              <div><span class="pp-money__label">{{ $t("acc.remaining") }}</span><b class="pp-num">{{ money(finance.remaining, finance.currency) }}</b></div>
              <div v-if="finance.late > 0"><span class="pp-money__label">{{ $t("acc.late") }}</span><b class="pp-num text-[var(--pp-danger)]">{{ money(finance.late, finance.currency) }}</b></div>
            </div>
          </section>

          <!-- News -->
          <section class="pp-card pp-card--pad pp-stack pp-in" :style="{ '--i': 6 }">
            <div class="pp-row pp-between">
              <h2 class="pp-h2"><i class="pi pi-bell text-[var(--pp-teal)]" /> {{ $t("pp.latest_news") }}</h2>
              <router-link :to="{ name: 'New' }" class="pp-link text-sm">{{ $t("pp.all_notifications") }}</router-link>
            </div>
            <div v-if="news.length" class="pp-list">
              <div v-for="item in news" :key="item.id" class="pp-item">
                <span class="pp-dot" :style="{ color: item.read_at ? 'var(--pp-sand-200)' : 'var(--pp-magenta)' }" />
                <div class="pp-item__body">
                  <p class="pp-item__title">{{ notificationText(item).title }}</p>
                  <p v-if="notificationText(item).body" class="pp-item__meta">{{ notificationText(item).body }}</p>
                  <p class="pp-item__meta">{{ fmtRelative(item.created_at) }}</p>
                </div>
              </div>
            </div>
            <EmptyState v-else icon="pi pi-bell" :text="$t('no_notifications')" />
          </section>
        </div>
      </div>
    </template>

    <EmptyState v-else icon="pi pi-wifi" :title="$t('error')" :text="$t('request_failed_retry')">
      <button type="button" class="pp-btn pp-btn--soft" @click="portal.refresh()"><i class="pi pi-refresh" /> {{ $t("pp.retry") }}</button>
    </EmptyState>
  </div>
</template>

<style scoped>
.pp-hello {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem 1.25rem;
  overflow: hidden;
}
.pp-hello__date {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.85;
  font-weight: 700;
}
.pp-hello__title {
  margin: 0.2rem 0 0;
  font-size: clamp(1.4rem, 1.1rem + 1.5vw, 2rem);
  font-weight: 800;
}
.pp-hello__lead {
  margin: 0.35rem 0 0;
  opacity: 0.9;
  line-height: 1.7;
  max-width: 560px;
}
.pp-hello__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}
.pp-hello__actions .pp-btn--ghost {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.35);
}
.pp-hello__actions .pp-btn--ghost:hover {
  background: rgba(255, 255, 255, 0.25);
}
.pp-hello__art {
  position: relative;
  display: none;
  width: 150px;
  height: 150px;
  flex-shrink: 0;
}
.pp-hello__art .pi {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 3.5rem;
  color: var(--pp-sun);
}
.pp-hello__bubble {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
}
.pp-hello__bubble--1 {
  inset: 0;
}
.pp-hello__bubble--2 {
  inset: 22px;
  background: rgba(167, 235, 246, 0.25);
}
.pp-home-cols {
  grid-template-columns: 1fr;
}
.pp-money {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.6rem 1rem;
}
.pp-money > div {
  display: grid;
}
.pp-money__label {
  font-size: 0.8rem;
  color: var(--pp-muted);
}
[dir="ltr"] .rtl-arrow {
  transform: scaleX(-1);
}
@media (min-width: 768px) {
  .pp-hello {
    padding: 2rem 2rem;
  }
  .pp-hello__art {
    display: block;
  }
}
@media (min-width: 1024px) {
  .pp-home-cols {
    grid-template-columns: 1.2fr 1fr;
    align-items: start;
  }
}
</style>
