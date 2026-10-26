<script setup>
// «البرامج»: every child's programs — the kind, the therapist, the period, the confirmation and the money — and
// the academy's programs for a child who has none yet.
import { computed, onMounted, ref } from "vue";
import axios from "axios";
import PageHead from "@/components/parent/PageHead.vue";
import ChildAvatar from "@/components/parent/ChildAvatar.vue";
import EmptyState from "@/components/parent/EmptyState.vue";
import { useParentPortalStore } from "@/stores/ParentPortal";
import { fmtDate, fmtDay, fmtTime, isToday, meta, money } from "@/utils/parentPortal";
import earlyImg from "@/views/frontend/views/main/images/early-intervention.jpg";
import dayImg from "@/views/frontend/views/main/images/classroom-1.jpg";
import inclusionImg from "@/views/frontend/views/main/images/integration-illustration.jpg";
import clinicsImg from "@/views/frontend/views/main/images/individual-session.jpg";

const portal = useParentPortalStore();
const loading = ref(true);
const rows = ref([]);
const currency = computed(() => portal.home?.finance?.currency ?? "JD");

onMounted(async () => {
  portal.load();
  try {
    rows.value = (await axios.get("/api/parent/programs")).data.data ?? [];
  } catch {
    rows.value = [];
  } finally {
    loading.value = false;
  }
});

const enrolled = computed(() => rows.value.flatMap((row) => (row.programs ?? []).map((program) => ({ ...program, child: row.child }))));
const statusOf = (program) => (program.stopped_at ? "stopped" : program.accounting_status);

// The academy's programs, from the booklet.
const ACADEMY = [
  { key: "early", image: earlyImg, title: "pp.ac_early_title", text: "pp.ac_early_text" },
  { key: "day", image: dayImg, title: "pp.ac_day_title", text: "pp.ac_day_text" },
  { key: "inclusion", image: inclusionImg, title: "pp.ac_inclusion_title", text: "pp.ac_inclusion_text" },
  { key: "clinics", image: clinicsImg, title: "pp.ac_clinics_title", text: "pp.ac_clinics_text" },
];
</script>

<template>
  <div class="pp-page">
    <PageHead :title="$t('pp.programs_title')" :lead="$t('pp.programs_lead')" :kicker="$t('pp.brand')" icon="pi pi-book" />

    <div v-if="loading" class="pp-grid pp-grid--2"><div v-for="i in 2" :key="i" class="pp-skeleton" style="height: 200px" /></div>

    <template v-else>
      <section class="pp-stack">
        <h2 class="pp-h2 pp-in"><i class="pi pi-users text-[var(--pp-teal)]" /> {{ $t("pp.programs_enrolled") }}</h2>
        <EmptyState v-if="!enrolled.length" icon="pi pi-book" :title="$t('pp.no_program_title')" :text="$t('pp.programs_none_text')">
          <router-link :to="{ name: 'Edit' }" class="pp-btn pp-btn--magenta"><i class="pi pi-calendar-plus" /> {{ $t("pp.book_consultation") }}</router-link>
        </EmptyState>
        <div v-else class="pp-grid pp-grid--2">
          <router-link v-for="(program, i) in enrolled" :key="program.id" :to="{ name: 'parent-child', params: { child_id: program.child.id }, query: { tab: 'program' } }"
            class="pp-card pp-card--link pp-card--pad pp-program pp-in" :style="{ '--i': i + 1 }">
            <div class="pp-row pp-between">
              <div class="pp-row">
                <ChildAvatar :child="program.child" :size="44" />
                <div>
                  <p class="pp-item__title">{{ program.child.name }}</p>
                  <p class="pp-item__meta">{{ meta("programKind", program.kind).label }} · {{ fmtDate(program.start_date) }} — {{ fmtDate(program.end_date) }}</p>
                </div>
              </div>
              <span class="pp-tag" :class="`pp-tag--${meta('programStatus', statusOf(program)).severity}`">{{ meta("programStatus", statusOf(program)).label }}</span>
            </div>
            <dl class="pp-kv">
              <template v-if="program.therapist?.name"><dt>{{ $t("sp_therapist") }}</dt><dd>{{ program.therapist.name }}</dd></template>
              <template v-if="program.weekly_sessions"><dt>{{ $t("sp_weekly_sessions") }}</dt><dd>{{ program.weekly_sessions }}</dd></template>
              <dt>{{ $t("acc.price") }}</dt><dd class="pp-num">{{ money(program.price, currency) }}</dd>
              <template v-if="program.charge"><dt>{{ $t("acc.paid") }}</dt><dd class="pp-num">{{ money(program.charge.paid, currency) }} <small class="pp-muted">/ {{ money(program.charge.amount, currency) }}</small></dd></template>
              <template v-if="program.next_session"><dt>{{ $t("pp.next_session") }}</dt><dd>{{ isToday(program.next_session.starts_at) ? $t("pp.today") : fmtDay(program.next_session.starts_at) }} · {{ fmtTime(program.next_session.starts_at) }}</dd></template>
            </dl>
            <div v-if="program.charge" class="pp-bar"><span :style="{ width: `${program.charge.amount ? Math.min(100, Math.round((program.charge.paid / program.charge.amount) * 100)) : 0}%` }" /></div>
            <span class="pp-link text-sm">{{ $t("pp.program_details") }} <i class="pi pi-angle-left rtl-arrow" /></span>
          </router-link>
        </div>
      </section>

      <section class="pp-stack">
        <div class="pp-in">
          <h2 class="pp-h2"><i class="pi pi-star text-[var(--pp-sun)]" /> {{ $t("pp.programs_academy") }}</h2>
          <p class="pp-lead text-sm mt-1">{{ $t("pp.programs_academy_lead") }}</p>
        </div>
        <div class="pp-grid pp-grid--2">
          <article v-for="(item, i) in ACADEMY" :key="item.key" class="pp-card pp-academy pp-in" :style="{ '--i': i + 2 }">
            <img :src="item.image" alt="" class="pp-academy__img" loading="lazy" />
            <div class="pp-academy__body">
              <h3 class="pp-h3">{{ $t(item.title) }}</h3>
              <p class="pp-lead text-sm mt-1">{{ $t(item.text) }}</p>
            </div>
          </article>
        </div>
        <div class="pp-row">
          <router-link :to="{ name: 'Edit' }" class="pp-btn pp-btn--magenta"><i class="pi pi-calendar-plus" /> {{ $t("pp.book_consultation") }}</router-link>
          <a href="/programs" class="pp-btn pp-btn--ghost"><i class="pi pi-external-link" /> {{ $t("pp.programs_read_more") }}</a>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.pp-program {
  display: grid;
  gap: 0.85rem;
  text-decoration: none;
  color: inherit;
}
.pp-academy {
  display: grid;
  grid-template-columns: 120px 1fr;
  overflow: hidden;
}
.pp-academy__img {
  width: 100%;
  height: 100%;
  min-height: 130px;
  object-fit: cover;
}
.pp-academy__body {
  padding: 1rem 1.1rem;
}
[dir="ltr"] .rtl-arrow {
  transform: scaleX(-1);
}
</style>
