<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

defineOptions({ name: "SideMenuItem" });

const props = defineProps({
  item: { type: Object, required: true },
  depth: { type: Number, default: 0 },
});
const emit = defineEmits(["navigate"]);

const route = useRoute();
const router = useRouter();

const hrefOf = (to) => {
  try {
    return router.resolve(to).path;
  } catch {
    return null;
  }
};
// A link is active on its own page and on pages below it (…/create, …/:id/edit).
const matches = (item) => {
  if (item.children) return item.children.some(matches);
  const href = item.to && hrefOf(item.to);
  if (!href) return false;
  return route.path === href || (href !== "/sawa-admin" && route.path.startsWith(`${href}/`));
};

const active = computed(() => matches(props.item));
const open = ref(active.value);
watch(active, (value) => {
  if (value) open.value = true;
});

const panelId = computed(() => `side-menu-${props.item.key ?? props.item.label ?? props.item.text}`);
</script>

<template>
  <li class="side-item" :class="[`depth-${depth}`, { 'is-active': active }]">
    <template v-if="item.children">
      <button
        type="button"
        class="side-link side-group"
        :aria-expanded="open"
        :aria-controls="panelId"
        @click="open = !open"
      >
        <i v-if="item.icon" :class="item.icon" class="side-icon" aria-hidden="true" />
        <span class="side-label">{{ item.text ?? $t(item.label) }}</span>
        <i class="pi pi-chevron-down side-caret" :class="{ open }" aria-hidden="true" />
      </button>
      <ul v-show="open" :id="panelId" class="side-children">
        <SideMenuItem
          v-for="child in item.children"
          :key="child.key ?? child.label ?? child.text"
          :item="child"
          :depth="depth + 1"
          @navigate="emit('navigate')"
        />
      </ul>
    </template>
    <router-link
      v-else
      :to="item.to"
      class="side-link"
      :class="{ 'is-current': active }"
      :aria-current="active ? 'page' : undefined"
      @click="emit('navigate')"
    >
      <i v-if="item.icon" :class="item.icon" class="side-icon" aria-hidden="true" />
      <span v-else-if="depth > 0" class="side-dot" aria-hidden="true" />
      <span class="side-label" :dir="item.text ? 'ltr' : undefined">{{ item.text ?? $t(item.label) }}</span>
    </router-link>
  </li>
</template>

<style scoped>
.side-item {
  list-style: none;
}
.side-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.88);
  font-size: 0.95rem;
  font-weight: 600;
  text-align: start;
  text-decoration: none;
  background: transparent;
  border: 0;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
}
.side-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}
.side-link:focus-visible {
  outline: 2px solid #fff;
  outline-offset: -2px;
}
.side-item.is-active > .side-group {
  color: #fff;
}
.side-link.is-current {
  background: #fff;
  color: #135c65;
}
.side-icon {
  font-size: 1.05rem;
  width: 1.25rem;
  text-align: center;
  flex-shrink: 0;
}
.side-label {
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
}
/* Latin evaluation names keep their own direction but stay aligned with the menu. */
.side-label[dir="ltr"] {
  text-align: end;
}
[dir="ltr"] .side-label[dir="ltr"] {
  text-align: start;
}
.side-caret {
  font-size: 0.75rem;
  transition: transform 0.2s;
}
.side-caret.open {
  transform: rotate(180deg);
}
.side-children {
  margin: 0.15rem 0 0.35rem;
  padding: 0;
  padding-inline-start: 1.1rem;
  border-inline-start: 1px solid rgba(255, 255, 255, 0.18);
  margin-inline-start: 1.3rem;
  display: grid;
  gap: 0.1rem;
}
.depth-1 > .side-link,
.depth-2 > .side-link {
  font-weight: 500;
  font-size: 0.9rem;
  padding-block: 0.5rem;
}
.side-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.6;
  flex-shrink: 0;
}
</style>
