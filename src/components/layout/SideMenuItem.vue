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

// Opening a group slides its panel from 0 to its content height; closing is instant.
const expand = (el) => {
  el.style.height = "0px";
  void el.offsetHeight;
  el.style.height = `${el.scrollHeight}px`;
};
const clearHeight = (el) => {
  el.style.height = "";
};
</script>

<!-- Same look as the original Vuetify drawer: every entry is a white rounded card with dark text,
     an open group becomes one card holding its entries, and sub entries have no icon. -->
<template>
  <li class="side-item" :class="{ 'side-card': item.children, 'is-open': item.children && open }">
    <template v-if="item.children">
      <button
        type="button"
        class="side-link"
        :class="{ 'is-sub': depth > 0 }"
        :aria-expanded="open"
        :aria-controls="panelId"
        @click="open = !open"
      >
        <i v-if="item.icon" :class="['mdi', item.icon]" class="side-icon" aria-hidden="true" />
        <span class="side-label" :dir="item.text ? 'ltr' : undefined">{{ item.text ?? $t(item.label) }}</span>
        <i :class="['mdi', open ? 'mdi-chevron-up' : 'mdi-chevron-down']" class="side-caret" aria-hidden="true" />
      </button>
      <Transition name="side-expand" @enter="expand" @after-enter="clearHeight">
        <div v-show="open" :id="panelId" class="side-collapse">
          <ul class="side-children">
            <SideMenuItem
              v-for="child in item.children"
              :key="child.key ?? child.label ?? child.text"
              :item="child"
              :depth="depth + 1"
              @navigate="emit('navigate')"
            />
          </ul>
        </div>
      </Transition>
    </template>
    <router-link
      v-else
      :to="item.to"
      class="side-link"
      :class="{ 'is-sub': depth > 0, 'is-current': active }"
      :aria-current="active ? 'page' : undefined"
      @click="emit('navigate')"
    >
      <i v-if="item.icon" :class="['mdi', item.icon]" class="side-icon" aria-hidden="true" />
      <span class="side-label" :dir="item.text ? 'ltr' : undefined">{{ item.text ?? $t(item.label) }}</span>
    </router-link>
  </li>
</template>

<style scoped>
.side-item {
  list-style: none;
}
/* An open group is a single white card. */
.side-card {
  background: #fff;
  border-radius: 5px;
}
.side-link {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 40px;
  padding: 4px 8px;
  border: 0;
  border-radius: 5px;
  background: #fff;
  color: #000;
  font-family: inherit;
  font-size: 17px;
  font-weight: 500;
  line-height: 110%;
  text-align: start;
  text-decoration: none;
  cursor: pointer;
}
/* Hover/active tint drawn over the card, as Vuetify's list overlay did. */
.side-link::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: #000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease-in-out;
}
.side-link:hover::before {
  opacity: 0.04;
}
.side-link:focus-visible {
  outline: none;
}
.side-link:focus-visible::before,
.side-link.is-current::before {
  opacity: 0.12;
}
.side-link.is-sub {
  padding-inline: 20px;
}
.side-icon {
  flex-shrink: 0;
  margin-inline-end: 32px;
  font-size: 24px;
  line-height: 1;
  opacity: 0.6;
}
.side-link.is-current .side-icon {
  opacity: 1;
}
.side-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* Latin evaluation names keep their own direction but stay aligned with the menu. */
.side-label[dir="ltr"] {
  text-align: end;
}
[dir="ltr"] .side-label[dir="ltr"] {
  text-align: start;
}
.side-caret {
  flex-shrink: 0;
  margin-inline-start: 32px;
  font-size: 24px;
  line-height: 1;
  opacity: 0.6;
}
.side-collapse {
  overflow: hidden;
}
/* Kept even with "reduce motion": a short height slide, and Windows with animations off reports that setting. */
.side-expand-enter-active {
  transition: height 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}
.side-children {
  margin: 0;
  padding: 19px 0 0;
  display: grid;
  gap: 19px;
}
</style>
