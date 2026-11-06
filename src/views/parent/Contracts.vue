<script setup>
// «العقود»: the family's contracts — waiting for a signature (opened from the private link sent on WhatsApp, with
// its code sent apart) and signed ones. Reading only: signing happens on the link's page.
import { onMounted, ref } from "vue";
import axios from "axios";
import PageHead from "@/components/parent/PageHead.vue";
import EmptyState from "@/components/parent/EmptyState.vue";
import { fmtDate } from "@/utils/parentPortal";

const rows = ref([]);
const loading = ref(true);
const failed = ref(false);
onMounted(async () => {
  try {
    rows.value = (await axios.get("/api/parent/contracts")).data.data ?? [];
  } catch {
    failed.value = true;
  } finally {
    loading.value = false;
  }
});
const icon = { sent: "pi pi-pen-to-square", approved: "pi pi-verified", rejected: "pi pi-times-circle", expired: "pi pi-clock" };
const tone = { sent: "pp-item__icon--warn", approved: "pp-item__icon--success", rejected: "pp-item__icon--magenta", expired: "pp-item__icon--info" };
</script>

<template>
  <div class="pp-page">
    <PageHead :title="$t('pcon.title')" :lead="$t('pcon.lead')" :kicker="$t('pp.brand')" icon="pi pi-file-edit" />
    <div v-if="loading" class="pp-stack"><div class="pp-skeleton" style="height: 90px" /><div class="pp-skeleton" style="height: 90px" /></div>
    <EmptyState v-else-if="!rows.length" icon="pi pi-file" :title="$t('pcon.none_title')" :text="failed ? $t('request_failed_retry') : $t('pcon.none_text')" />
    <div v-else class="pp-list">
      <div v-for="row in rows" :key="row.id" class="pp-item">
        <span class="pp-item__icon" :class="tone[row.status]"><i :class="icon[row.status]" /></span>
        <div class="pp-item__body">
          <p class="pp-item__title">{{ row.title }} <bdi class="pp-muted">· {{ row.number }}</bdi></p>
          <p class="pp-item__meta">
            <template v-if="row.child">{{ row.child }} · </template>{{ $t(`pcon.status_${row.status}`) }}
            <template v-if="row.status === 'approved' && row.decided_at"> · {{ fmtDate(row.decided_at) }}</template>
          </p>
          <p v-if="row.status === 'sent'" class="pp-item__meta">{{ $t("pcon.sign_hint", { date: row.link_expires_at }) }}</p>
          <p v-else-if="row.status === 'expired'" class="pp-item__meta">{{ $t("pcon.expired_hint") }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
