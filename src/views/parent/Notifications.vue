<script setup>
// The academy's messages to the parent: accepted bookings, changed times, and what the management wrote.
import { onMounted, ref } from "vue";
import axios from "axios";
import PageHead from "@/components/parent/PageHead.vue";
import EmptyState from "@/components/parent/EmptyState.vue";
import { fmtDateTime, fmtRelative, notificationText } from "@/utils/parentPortal";

const loading = ref(true);
const rows = ref([]);
onMounted(async () => {
  try {
    rows.value = (await axios.get("/api/parent/notification")).data.notifications ?? [];
  } catch {
    rows.value = [];
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="pp-page">
    <PageHead :title="$t('pp.notifications_title')" :lead="$t('pp.notifications_lead')" :kicker="$t('pp.brand')" icon="pi pi-bell" />
    <div v-if="loading" class="pp-stack"><div v-for="i in 4" :key="i" class="pp-skeleton" style="height: 76px" /></div>
    <EmptyState v-else-if="!rows.length" icon="pi pi-bell" :text="$t('no_notifications')" />
    <div v-else class="pp-list">
      <article v-for="(item, i) in rows" :key="item.id" class="pp-item pp-in" :class="{ 'is-unread': !item.read_at }" :style="{ '--i': Math.min(i, 8) }">
        <span class="pp-item__icon" :class="item.read_at ? '' : 'pp-item__icon--magenta'"><i class="pi pi-bell" /></span>
        <div class="pp-item__body">
          <p class="pp-item__title">{{ notificationText(item).title }}</p>
          <p v-if="notificationText(item).body" class="pp-item__meta leading-7">{{ notificationText(item).body }}</p>
          <p class="pp-item__meta" :title="fmtDateTime(item.created_at)">{{ fmtRelative(item.created_at) }}</p>
        </div>
        <span v-if="!item.read_at" class="pp-dot" style="color: var(--pp-magenta)" :aria-label="$t('pp.unread')" />
      </article>
    </div>
  </div>
</template>

<style scoped>
.is-unread {
  border-color: rgb(var(--bs-b21553) / 0.3);
  background: #fff;
}
</style>
