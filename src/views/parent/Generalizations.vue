<script setup>
// «تعميم الأهداف في البيت»: the goals the therapists ask to work on at home. The parent approves or refuses each
// (with the reason); the therapist sees the answer in the session.
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import axios from "axios";
import PageHead from "@/components/parent/PageHead.vue";
import EmptyState from "@/components/parent/EmptyState.vue";
import DecisionDialog from "@/components/sessions/DecisionDialog.vue";
import { refreshPendingCounts } from "@/utils/pendingCounts";
import { useParentPortalStore } from "@/stores/ParentPortal";
import { fmtDate, meta } from "@/utils/parentPortal";

const { t } = useI18n();
const toast = useToast();
const portal = useParentPortalStore();
const rows = ref([]);
const loading = ref(true);
const current = ref(null);
const deciding = ref(false);
const filter = ref("pending");

async function load() {
  loading.value = true;
  try {
    rows.value = (await axios.get("/api/parent/goal-generalizations")).data.data ?? [];
  } catch {
    rows.value = [];
  } finally {
    loading.value = false;
  }
}
onMounted(load);

const counts = computed(() => rows.value.reduce((acc, row) => ({ ...acc, [row.status]: (acc[row.status] ?? 0) + 1 }), {}));
const shown = computed(() => rows.value.filter((row) => filter.value === "all" || row.status === filter.value));

async function decide(answer) {
  deciding.value = true;
  try {
    await axios.post(`/api/parent/goal-generalizations/${current.value.id}/decide`, answer);
    toast.add({ severity: "success", summary: t("success_message"), detail: answer.approved ? t("gen_approved_done") : t("gen_rejected_done"), life: 2500 });
    current.value = null;
    await load();
    refreshPendingCounts("parent");
    portal.refresh();
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: error.response?.data?.message ?? t("mission_error"), life: 3000 });
  } finally {
    deciding.value = false;
  }
}
</script>

<template>
  <div class="pp-page">
    <Toast />
    <PageHead :title="$t('gen_parent_title')" :lead="$t('gen_parent_hint')" :kicker="$t('pp.brand')" icon="pi pi-home" />

    <nav class="pp-tabs pp-in" :style="{ '--i': 1 }">
      <button v-for="key in ['pending', 'approved', 'rejected', 'all']" :key="key" type="button" class="pp-tab" :class="{ 'is-active': filter === key }" @click="filter = key">
        {{ key === "all" ? $t("acc.all") : meta("generalization", key).label }}
        <span v-if="key !== 'all' && counts[key]" class="pp-tab__count">{{ counts[key] }}</span>
      </button>
    </nav>

    <div v-if="loading" class="pp-stack"><div v-for="i in 3" :key="i" class="pp-skeleton" style="height: 120px" /></div>
    <EmptyState v-else-if="!shown.length" icon="pi pi-home" :title="$t('gen_parent_empty')" :text="filter === 'pending' ? $t('pp.gen_nothing_pending') : ''" />
    <div v-else class="pp-stack">
      <article v-for="(row, i) in shown" :key="row.id" class="pp-card pp-card--pad pp-stack pp-in" :style="{ '--i': Math.min(i, 8) + 2 }">
        <div class="pp-row pp-between">
          <router-link :to="{ name: 'parent-child', params: { child_id: row.child?.id }, query: { tab: 'plan' } }" class="pp-link text-lg">{{ row.child?.name }}</router-link>
          <span class="pp-tag" :class="`pp-tag--${meta('generalization', row.status).severity}`">{{ meta("generalization", row.status).label }}</span>
        </div>
        <p class="pp-item__meta">{{ row.goal?.domain }}<template v-if="row.goal?.general_goal"> · {{ row.goal?.general_goal }}</template></p>
        <p class="m-0 leading-7 font-semibold">{{ row.goal?.goal }}</p>
        <p v-if="row.status === 'rejected' && row.note" class="m-0 text-[var(--pp-danger)]"><i class="pi pi-comment" /> {{ row.note }}</p>
        <div class="pp-row pp-between">
          <small class="pp-muted">{{ fmtDate(row.created_at) }}</small>
          <button v-if="row.status === 'pending'" type="button" class="pp-btn pp-btn--magenta pp-btn--sm" @click="current = row"><i class="pi pi-check-square" /> {{ $t("decision_answer") }}</button>
        </div>
      </article>
    </div>

    <DecisionDialog :visible="!!current" :title="$t('gen_home_decide')" :loading="deciding" @update:visible="current = null" @decide="decide">
      <template v-if="current">
        <p class="m-0"><b>{{ current.child?.name }}</b></p>
        <p class="mt-2 mb-0 pp-muted">{{ current.goal?.goal }}</p>
      </template>
    </DecisionDialog>
  </div>
</template>
