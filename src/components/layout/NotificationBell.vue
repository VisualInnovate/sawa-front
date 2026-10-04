<script setup>
import axios from "axios";
import Popover from "primevue/popover";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

// The signed-in user's dashboard notifications (new required evaluations, evaluations booked with them).
const REFRESH_MS = 120000;

const router = useRouter();
const { t, locale } = useI18n();
const panel = ref(null);
const items = ref([]);
const unread = ref(0);
const loading = ref(false);
let timer = null;

const load = async () => {
  try {
    const { data } = await axios.get("api/my-notifications", { params: { _ts: Date.now() } });
    items.value = data.data ?? [];
    unread.value = data.unread ?? 0;
  } catch {
    // The bell is a convenience; a failed refresh keeps what was shown.
  }
};

const payload = (item) => (typeof item.data === "string" ? JSON.parse(item.data) : item.data) ?? {};

const toggle = async (event) => {
  panel.value.toggle(event);
  loading.value = true;
  await load();
  loading.value = false;
  if (unread.value) {
    axios.post("api/my-notifications/read").catch(() => {});
    unread.value = 0;
  }
};

const open = (item) => {
  const url = payload(item).url;
  panel.value.hide();
  if (url) router.push(url);
};

const formatDate = (value) =>
  value ? new Date(value).toLocaleString(locale.value === "ar" ? "ar-JO" : "en-GB", { dateStyle: "medium", timeStyle: "short" }) : "";

onMounted(() => {
  load();
  timer = setInterval(load, REFRESH_MS);
});
onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
  <div class="bell">
    <Button type="button" icon="pi pi-bell" severity="secondary" variant="text" rounded
      :aria-label="t('notifications_title')" aria-haspopup="true" @click="toggle" />
    <span v-if="unread" class="bell-count" aria-hidden="true">{{ unread > 9 ? "9+" : unread }}</span>
    <Popover ref="panel">
      <div class="bell-panel">
        <h3 class="bell-title">{{ t("notifications_title") }}</h3>
        <p v-if="loading && !items.length" class="bell-empty">{{ t("calendar_loading") }}</p>
        <p v-else-if="!items.length" class="bell-empty">{{ t("no_notifications") }}</p>
        <ul v-else class="bell-list">
          <li v-for="item in items" :key="item.id">
            <button type="button" class="bell-item" :class="{ unread: !item.read_at }" @click="open(item)">
              <span class="bell-item-title">{{ payload(item).title }}</span>
              <span class="bell-item-text">{{ payload(item).message }}</span>
              <span class="bell-item-date">{{ formatDate(item.created_at) }}</span>
            </button>
          </li>
        </ul>
      </div>
    </Popover>
  </div>
</template>

<style scoped>
.bell {
  position: relative;
}
.bell-count {
  position: absolute;
  inset-block-start: 2px;
  inset-inline-end: 2px;
  min-width: 18px;
  height: 18px;
  padding-inline: 4px;
  border-radius: 9px;
  background: #dc2626;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 18px;
  text-align: center;
  pointer-events: none;
}
.bell-panel {
  width: min(360px, calc(100vw - 32px));
}
.bell-title {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: #135c65;
}
.bell-empty {
  margin: 0;
  padding: 1rem 0;
  color: #6b7280;
  text-align: center;
}
.bell-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 60vh;
  overflow-y: auto;
}
.bell-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.65rem 0.5rem;
  border: 0;
  border-bottom: 1px solid #eef2f2;
  background: none;
  text-align: start;
  cursor: pointer;
  border-radius: 8px;
}
.bell-item:hover,
.bell-item:focus-visible {
  background: #f0f7f7;
}
.bell-item.unread {
  background: #ecfdf5;
}
.bell-item-title {
  font-weight: 700;
  color: #1f2937;
}
.bell-item-text {
  font-size: 0.875rem;
  color: #4b5563;
}
.bell-item-date {
  font-size: 0.75rem;
  color: #9ca3af;
}
</style>
