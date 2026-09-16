<template>
  <div class="permission-groups">
    <p v-if="!groups.length" class="empty">{{ $t("no_permissions_found") }}</p>

    <section v-for="group in groups" :key="group.key" class="permission-group">
      <h2 class="group-title">{{ group.label }}</h2>

      <div class="permissions-grid">
        <div v-for="card in group.cards" :key="card.module" class="permission-category">
          <div class="category-header">
            <h3>{{ label(card) }}</h3>
            <label v-if="selectable" class="select-all" :title="$t('select_all_in_card')">
              <input
                type="checkbox"
                class="category-checkbox"
                :checked="allSelected(card)"
                :disabled="readonly"
                @change="toggleCard(card)"
              />
            </label>
            <i v-else class="pi pi-lock category-icon"></i>
          </div>

          <div class="permission-list">
            <div v-for="permission in card.permissions" :key="permission.id" class="permission-item">
              <label class="permission-info">
                <input
                  v-if="selectable"
                  type="checkbox"
                  class="permission-checkbox"
                  :checked="modelValue.includes(permission.id)"
                  :disabled="readonly"
                  @change="toggle(permission.id)"
                />
                <i v-else class="pi pi-key permission-icon"></i>
                <span class="permission-action">{{ label(permission) }}</span>
                <span class="permission-name">{{ permission.name }}</span>
              </label>
              <Button
                :icon="describeIcon"
                class="p-button-rounded p-button-text info-btn"
                @click="$emit('describe', permission)"
                v-tooltip.top="$t(describeTooltip)"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  // [{ module, group, group_ar, group_en, label_ar, label_en, permissions: [{ id, name, label_ar, label_en, description }] }]
  modules: { type: Array, default: () => [] },
  // selected permission ids
  modelValue: { type: Array, default: () => [] },
  selectable: { type: Boolean, default: true },
  readonly: { type: Boolean, default: false },
  describeIcon: { type: String, default: "pi pi-info-circle" },
  describeTooltip: { type: String, default: "view_description" },
});
const emit = defineEmits(["update:modelValue", "describe"]);
const { locale } = useI18n();

const label = (item) => (locale.value === "ar" ? item.label_ar : item.label_en) || item.name;

// One section per sidebar group, cards in the order the API returns them.
const groups = computed(() => {
  const byKey = new Map();
  for (const card of props.modules) {
    if (!byKey.has(card.group)) {
      byKey.set(card.group, {
        key: card.group,
        label: locale.value === "ar" ? card.group_ar : card.group_en,
        cards: [],
      });
    }
    byKey.get(card.group).cards.push(card);
  }
  return [...byKey.values()];
});

const idsOf = (card) => card.permissions.map((p) => p.id);
const allSelected = (card) => idsOf(card).every((id) => props.modelValue.includes(id));

const toggle = (id) => {
  if (props.readonly) return;
  const next = props.modelValue.includes(id)
    ? props.modelValue.filter((x) => x !== id)
    : [...props.modelValue, id];
  emit("update:modelValue", next);
};

const toggleCard = (card) => {
  if (props.readonly) return;
  const ids = idsOf(card);
  const next = allSelected(card)
    ? props.modelValue.filter((id) => !ids.includes(id))
    : [...new Set([...props.modelValue, ...ids])];
  emit("update:modelValue", next);
};
</script>

<style scoped lang="scss">
.empty {
  text-align: center;
  color: #64748b;
  padding: 2rem 0;
}

.permission-group + .permission-group {
  margin-top: 2rem;
}

.group-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #135c65;
  margin: 0 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.permissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

.permission-category {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid #e2e8f0;

  .category-header {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    padding: 0.85rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;

    h3 {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 600;
    }

    .select-all {
      display: flex;
      cursor: pointer;
    }

    .category-checkbox {
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 4px;
      border: 2px solid white;
      appearance: none;
      cursor: pointer;
      position: relative;
      flex-shrink: 0;

      &:checked {
        background-color: white;

        &::after {
          content: "✓";
          color: #6366f1;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 0.875rem;
          font-weight: bold;
        }
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.7;
      }
    }
  }

  .permission-list {
    padding: 0.5rem 1rem;
  }

  .permission-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f1f1f1;

    &:last-child {
      border-bottom: none;
    }
  }

  .permission-info {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex: 1;
    min-width: 0;
    cursor: pointer;
  }

  .permission-checkbox {
    width: 1.1rem;
    height: 1.1rem;
    border-radius: 4px;
    border: 2px solid #6366f1;
    appearance: none;
    cursor: pointer;
    position: relative;
    flex-shrink: 0;

    &:checked {
      background-color: #6366f1;

      &::after {
        content: "✓";
        color: white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 0.75rem;
        font-weight: bold;
      }
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }
  }

  .permission-icon {
    color: #6366f1;
  }

  .permission-action {
    font-size: 0.95rem;
    font-weight: 500;
    color: #334155;
  }

  .permission-name {
    font-size: 0.75rem;
    color: #94a3b8;
    direction: ltr;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .info-btn {
    color: #6366f1;
    flex-shrink: 0;
  }
}

@media (max-width: 768px) {
  .permissions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
