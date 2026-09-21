<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

defineOptions({ name: "SideMenuItem" });

const props = defineProps({
  item: { type: Object, required: true },
  depth: { type: Number, default: 0 },
  compact: Boolean,
});
const emit = defineEmits(["navigate", "expand"]);

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
  return (
    route.path === href ||
    (href !== "/sawa-admin" && route.path.startsWith(`${href}/`))
  );
};

const active = computed(() => matches(props.item));
const open = ref(active.value);
watch(active, (value) => {
  if (value) open.value = true;
});

const panelId = computed(
  () => `side-menu-${props.item.key ?? props.item.label ?? props.item.text}`,
);
function toggleGroup() {
  if (props.compact) {
    open.value = true;
    emit("expand");
  } else open.value = !open.value;
}

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

<template>
  <li
    class="side-item"
    :class="{ 'is-open': item.children && open, 'is-compact': compact }"
  >
    <template v-if="item.children">
      <button
        type="button"
        class="side-link"
        :class="{
          'is-sub': depth > 0,
          'has-current': active,
          'is-expanded': open && !compact,
        }"
        :aria-label="item.text ?? $t(item.label)"
        :title="compact ? item.text ?? $t(item.label) : undefined"
        :aria-expanded="open && !compact"
        :aria-controls="panelId"
        @click="toggleGroup"
      >
        <i
          v-if="item.icon"
          :class="['mdi', item.icon]"
          class="side-icon"
          aria-hidden="true"
        />
        <span class="side-label" :dir="item.text ? 'ltr' : undefined">{{
          item.text ?? $t(item.label)
        }}</span>
        <i
          :class="['mdi', open ? 'mdi-chevron-up' : 'mdi-chevron-down']"
          class="side-caret"
          aria-hidden="true"
        />
      </button>
      <Transition name="side-expand" @enter="expand" @after-enter="clearHeight">
        <div v-show="open && !compact" :id="panelId" class="side-collapse">
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
      :aria-label="item.text ?? $t(item.label)"
      :title="compact ? item.text ?? $t(item.label) : undefined"
      @click="emit('navigate')"
    >
      <i
        v-if="item.icon"
        :class="['mdi', item.icon]"
        class="side-icon"
        aria-hidden="true"
      />
      <span class="side-label" :dir="item.text ? 'ltr' : undefined">{{
        item.text ?? $t(item.label)
      }}</span>
    </router-link>
  </li>
</template>

<style scoped>
.side-item {
  list-style: none;
  min-width: 0;
}
.side-link {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;
  min-height: 44px;
  padding: 8px 12px;
  border: 1px solid transparent;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.4);
  color: #3d565a;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.65;
  text-align: start;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s,
    box-shadow 0.15s;
}
.side-link:hover {
  color: #0b6462;
  background: #effaf5;
  border-color: rgba(15, 122, 115, 0.12);
}
.side-link:focus-visible {
  outline: 2px solid #0f7a73;
  outline-offset: -2px;
}
.side-link.has-current,
.side-link.is-expanded {
  background: #edf9f5;
  color: #0f6462;
  border-color: rgba(15, 122, 115, 0.14);
}
.side-link.is-current {
  color: #fff;
  background: linear-gradient(135deg, #0f7a73 0%, #0b5f5d 100%);
  box-shadow: 0 8px 16px -10px rgba(15, 122, 115, 0.7);
}
.side-link.is-sub {
  min-height: 37px;
  padding: 7px 10px;
  font-size: 12px;
  font-weight: 600;
  gap: 8px;
}
.side-link.is-sub::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #a9c5b9;
  flex-shrink: 0;
}
.side-link.is-sub.is-current::before {
  background: #dfeec0;
}
.side-icon {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  border-radius: 9px;
  background: #eef7f3;
  color: #4a7b73;
  font-size: 20px;
  line-height: 1;
}
.has-current .side-icon,
.is-expanded .side-icon {
  color: #0f7a73;
  background: #dff5ee;
}
.side-link.is-current .side-icon {
  color: #edf9d5;
  background: rgba(255, 255, 255, 0.18);
}
.side-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.side-label[dir="ltr"] {
  text-align: end;
}
[dir="ltr"] .side-label[dir="ltr"] {
  text-align: start;
}
.side-caret {
  flex-shrink: 0;
  margin-inline-start: auto;
  font-size: 18px;
  line-height: 1;
  color: #8b9e96;
}
.side-collapse {
  overflow: hidden;
}
.side-expand-enter-active {
  transition: height 0.2s ease;
}
.side-children {
  margin: 7px 0 7px;
  margin-inline-start: 24px;
  padding: 0;
  padding-inline-start: 10px;
  border-inline-start: 1px solid #dce8e1;
  display: grid;
  gap: 3px;
}
.side-children .side-children {
  margin-inline-start: 10px;
}
.is-compact > .side-link {
  justify-content: center;
  padding: 7px;
  min-height: 46px;
}
.is-compact > .side-link .side-icon {
  margin: 0;
  width: 34px;
  height: 34px;
  font-size: 22px;
  background: transparent;
}
.is-compact > .side-link .side-label,
.is-compact > .side-link .side-caret {
  display: none;
}
@media (prefers-reduced-motion: reduce) {
  .side-expand-enter-active,
  .side-link {
    transition: none;
  }
}
</style>
