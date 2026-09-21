<script setup>
import { computed, nextTick, ref, watch } from "vue";
import SideMenuItem from "./SideMenuItem.vue";

const props = defineProps({
  items: { type: Array, default: () => [] },
  compact: Boolean,
  visible: Boolean,
  desktop: Boolean,
});
const emit = defineEmits(["toggle", "close", "expand", "navigate"]);
const sidebar = ref(null);
const home = computed(() => props.items.find((item) => item.key === "home"));
const sections = computed(() =>
  [
    {
      key: "team",
      label: "sidebar_team",
      keys: ["admin", "parents", "therapeutic", "consulting"],
    },
    {
      key: "care",
      label: "sidebar_care",
      keys: ["evaluations", "custom-files", "inputs", "rooms"],
    },
    {
      key: "system",
      label: "sidebar_system",
      keys: ["hr", "notifications", "site"],
    },
  ]
    .map((section) => ({
      ...section,
      items: section.keys.flatMap((key) =>
        props.items.filter((item) => item.key === key),
      ),
    }))
    .filter((section) => section.items.length),
);

watch(
  () => props.visible,
  async (visible) => {
    if (visible && !props.desktop) {
      await nextTick();
      sidebar.value?.querySelector("button")?.focus();
    }
  },
);
function handleKeydown(event) {
  if (props.desktop) return;
  if (event.key === "Escape") emit("close");
  if (event.key !== "Tab") return;
  const links = [...sidebar.value.querySelectorAll("a[href], button")].filter(
    (el) => el.getClientRects().length,
  );
  const first = links[0];
  const last = links.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
}
</script>

<template>
  <aside
    id="admin-sidebar"
    ref="sidebar"
    data-no-request-spinner
    class="admin-sidebar"
    :class="{ 'is-compact': compact, 'is-visible': visible }"
    :aria-hidden="!visible"
    :inert="visible ? null : ''"
    @keydown="handleKeydown"
  >
    <div class="sidebar-heading">
      <div class="workspace-mark" aria-hidden="true">
        <i class="mdi mdi-view-dashboard-outline" />
      </div>
      <div v-if="!compact" class="workspace-copy">
        <span>{{ $t("sidebar_workspace") }}</span>
        <strong>{{ $t("sidebar_title") }}</strong>
      </div>
      <button
        type="button"
        class="sidebar-toggle"
        :aria-label="$t(compact ? 'sidebar_expand' : 'sidebar_collapse')"
        :title="$t(compact ? 'sidebar_expand' : 'sidebar_collapse')"
        :aria-expanded="!compact"
        @click="emit('toggle')"
      >
        <i
          :class="[
            'mdi',
            !desktop
              ? 'mdi-close'
              : compact
              ? 'mdi-arrow-expand-horizontal'
              : 'mdi-arrow-collapse-horizontal',
          ]"
          aria-hidden="true"
        />
      </button>
    </div>

    <nav class="sidebar-navigation" :aria-label="$t('main_menu')">
      <ul v-if="home" class="side-menu sidebar-home">
        <SideMenuItem
          :item="home"
          :compact="compact"
          @navigate="emit('navigate')"
        />
      </ul>
      <section
        v-for="section in sections"
        :key="section.key"
        class="sidebar-section"
        :aria-label="$t(section.label)"
      >
        <h2 v-if="!compact" class="sidebar-section-title">
          {{ $t(section.label) }}
        </h2>
        <div v-else class="sidebar-section-divider" aria-hidden="true" />
        <ul class="side-menu">
          <SideMenuItem
            v-for="item in section.items"
            :key="item.key"
            :item="item"
            :compact="compact"
            @expand="emit('expand')"
            @navigate="emit('navigate')"
          />
        </ul>
      </section>
    </nav>
  </aside>
</template>

<style scoped>
.admin-sidebar {
  --sidebar-surface: #f7faf8;
  --sidebar-panel: #ffffff;
  --sidebar-panel-strong: #edf9f5;
  --sidebar-border: #dfece7;
  --sidebar-text: #1d3b3d;
  --sidebar-muted: #5d726d;
  --sidebar-accent: #0f7a73;
  --sidebar-accent-strong: #0b5f5d;
  --sidebar-active: #e8f7f2;
  --sidebar-soft: #f4f8f5;
  position: fixed;
  inset-block: calc(var(--header-h) + var(--sidebar-gap)) var(--sidebar-gap);
  inset-inline-start: var(--sidebar-gap);
  z-index: 25;
  width: var(--sidebar-w);
  max-width: calc(100vw - 2rem);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: var(--sidebar-text);
  background: linear-gradient(
    180deg,
    var(--sidebar-panel) 0%,
    var(--sidebar-surface) 100%
  );
  border: 1px solid var(--sidebar-border);
  border-radius: 22px;
  box-shadow: 0 16px 32px -24px rgba(13, 73, 72, 0.38);
  transition: width 0.2s ease, transform 0.2s ease, visibility 0.2s;
}
.admin-sidebar:not(.is-visible) {
  transform: translateX(-110%);
  visibility: hidden;
}
[dir="rtl"] .admin-sidebar:not(.is-visible) {
  transform: translateX(110%);
}
.sidebar-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 92px;
  padding: 20px 16px;
  border-bottom: 1px solid var(--sidebar-border);
}
.workspace-mark {
  display: grid;
  place-items: center;
  flex: 0 0 42px;
  height: 42px;
  color: var(--sidebar-accent);
  background: linear-gradient(
    135deg,
    rgba(15, 122, 115, 0.12),
    rgba(15, 122, 115, 0.06)
  );
  border: 1px solid rgba(15, 122, 115, 0.15);
  border-radius: 14px;
  font-size: 24px;
}
.workspace-copy {
  display: grid;
  gap: 2px;
  flex: 1;
  white-space: nowrap;
}
.workspace-copy span {
  color: var(--sidebar-muted);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
}
.workspace-copy strong {
  font-size: 15px;
  font-weight: 800;
  color: var(--sidebar-accent-strong);
}
.sidebar-toggle {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid var(--sidebar-border);
  border-radius: 10px;
  background: #fff;
  color: var(--sidebar-muted);
  cursor: pointer;
  font-size: 17px;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
}
.sidebar-toggle:hover {
  color: var(--sidebar-accent);
  background: var(--sidebar-active);
  border-color: rgba(15, 122, 115, 0.2);
}
.sidebar-toggle:focus-visible {
  outline: 2px solid var(--sidebar-accent);
  outline-offset: 3px;
}
.sidebar-navigation {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 12px 16px;
  scrollbar-width: thin;
  scrollbar-color: #c9ddd7 transparent;
}
.side-menu {
  list-style: none;
  display: grid;
  gap: 4px;
  padding: 0;
  margin: 0;
}
.sidebar-home {
  padding-bottom: 4px;
}
.sidebar-section {
  margin-block-start: 18px;
}
.sidebar-section:first-of-type {
  margin-block-start: 0;
}
.sidebar-section-title {
  margin: 0 10px 9px;
  font-size: 10px;
  font-weight: 800;
  line-height: 1.6;
  color: #738783;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.sidebar-section-divider {
  width: 24px;
  height: 1px;
  margin: 0 auto 12px;
  background: var(--sidebar-border);
}
.is-compact .sidebar-heading {
  flex-direction: column;
  padding: 16px 0 12px;
  gap: 10px;
  border-bottom: 0;
}
.is-compact .workspace-mark {
  flex-basis: auto;
  width: 38px;
  height: 38px;
  border-radius: 12px;
}
.is-compact .sidebar-toggle {
  width: 28px;
  height: 24px;
  border: 0;
}
.is-compact .sidebar-navigation {
  padding-inline: 10px;
}
.is-compact .sidebar-section {
  margin-block-start: 14px;
}
@media (max-width: 1023px) {
  .admin-sidebar {
    z-index: 40;
    inset-block: 12px;
    inset-inline-start: 12px;
    width: 280px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .admin-sidebar,
  .sidebar-toggle {
    transition: none;
  }
}
@media print {
  .admin-sidebar {
    display: none;
  }
}
</style>
