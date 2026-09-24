<script>
import axios from "axios";
import GenderTextField from "../../components/GenderTextField.vue";
import NameTokenHint from "../../components/NameTokenHint.vue";

// Consultation settings: the instructions parents read before a consultation, and the home recommendations
// the consultant picks from when writing a result. Both have a boy's and a girl's wording; the one matching
// the child's gender is used, with {{name}} replaced by the child's name.
const genders = ["male", "female"];
const blank = (value) => !String(value ?? "").trim();

export default {
  components: { GenderTextField, NameTokenHint },
  data() {
    return {
      loading: true,
      loadError: false,
      saving: false,
      submitted: false,
      instructions: { male: "", female: "" },
      recommendations: [],
      // Local keys for v-for; new items have no id until saved.
      nextKey: 1,
    };
  },
  computed: {
    canEdit() {
      return this.$can("consultation settings edit");
    },
    instructionsMissing() {
      return genders.some((gender) => blank(this.instructions[gender]));
    },
    incompleteCount() {
      return this.recommendations.filter((item) => this.itemMissing(item)).length;
    },
    hasErrors() {
      return this.instructionsMissing || this.incompleteCount > 0;
    },
  },
  methods: {
    itemMissing(item) {
      return genders.some((gender) => blank(item.text[gender])) || item.display_order === null || item.display_order === undefined;
    },
    // Rows in the old { value, index } shape read their text for both genders.
    toItem(row) {
      return {
        key: this.nextKey++,
        id: row.id ?? null,
        display_order: row.display_order ?? (row.index != null ? row.index + 1 : null),
        text: { male: row.male ?? row.value ?? "", female: row.female ?? row.value ?? "" },
      };
    },
    sortItems() {
      this.recommendations.sort((a, b) => (a.display_order ?? Infinity) - (b.display_order ?? Infinity) || (a.id ?? Infinity) - (b.id ?? Infinity));
    },
    async load() {
      this.loading = true;
      this.loadError = false;
      try {
        const { data } = await axios.get("/api/consultation-settings");
        const settings = data.data ?? {};
        this.instructions = {
          male: settings.instructions_wording?.male ?? settings.instructions ?? "",
          female: settings.instructions_wording?.female ?? settings.instructions ?? "",
        };
        this.recommendations = (settings.recommendations ?? []).map(this.toItem);
        this.sortItems();
      } catch {
        this.loadError = true;
      } finally {
        this.loading = false;
      }
    },
    addItem() {
      const last = Math.max(0, ...this.recommendations.map((item) => Number(item.display_order) || 0));
      this.recommendations.push(this.toItem({ display_order: last + 1 }));
      this.$nextTick(() => {
        const cards = this.$el.querySelectorAll(".recommendation");
        cards[cards.length - 1]?.scrollIntoView({ behavior: "smooth", block: "center" });
        cards[cards.length - 1]?.querySelector("textarea")?.focus();
      });
    },
    removeItem(index) {
      this.recommendations.splice(index, 1);
    },
    async save() {
      this.submitted = true;
      if (this.hasErrors || this.saving) {
        this.$toast.add({ severity: "error", summary: this.$t("error"), detail: this.$t("fill_required_fields"), life: 4000 });
        return;
      }
      this.saving = true;
      try {
        const { data } = await axios.put("/api/consultation-settings", {
          instructions_wording: this.instructions,
          recommendations: this.recommendations.map((item) => ({
            ...(item.id ? { id: item.id } : {}),
            display_order: item.display_order,
            male: item.text.male,
            female: item.text.female,
          })),
        });
        // New items now have ids, and the list comes back in display order.
        this.recommendations = (data.data?.recommendations ?? []).map(this.toItem);
        this.submitted = false;
        this.$toast.add({ severity: "success", summary: this.$t("saved"), detail: this.$t("recommendations_updated"), life: 3000 });
      } catch (error) {
        const detail = Object.values(error.response?.data?.errors ?? {}).flat()[0] ?? error.response?.data?.message ?? this.$t("request_failed_retry");
        this.$toast.add({ severity: "error", summary: this.$t("error"), detail, life: 6000 });
      } finally {
        this.saving = false;
      }
    },
  },
  mounted() {
    this.load();
  },
};
</script>

<template>
  <div class="page">
    <Toast />
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ $t("اعدادات الاستشارات") }}</h1>
        <p class="page-hint">{{ $t("consultation_settings_hint") }}</p>
      </div>
    </div>

    <div v-if="loading" class="surface-card empty-state"><ProgressSpinner style="width: 40px; height: 40px" /></div>
    <Message v-else-if="loadError" severity="error" :closable="false">{{ $t("request_failed_retry") }}</Message>

    <form v-else class="settings-form" novalidate data-no-request-spinner @submit.prevent="save">
      <NameTokenHint :text="$t('consultation_settings_name_hint')" />

      <section class="surface-card settings-section">
        <header class="section-bar">
          <h2 class="section-title">{{ $t("تعليمات الاستشارة") }}</h2>
        </header>
        <GenderTextField v-model="instructions" inputId="consultation-instructions" :label="$t('consultation_instructions_text')"
          :rows="4" :showErrors="submitted" :disabled="!canEdit" />
      </section>

      <section class="surface-card settings-section">
        <header class="section-bar">
          <div>
            <h2 class="section-title">{{ $t("توصييات منزلية") }}</h2>
            <p class="section-hint">{{ $t("recommendations_order_hint") }}</p>
          </div>
          <div class="section-tools">
            <Tag v-if="submitted && incompleteCount" severity="danger" :value="$t('recommendations_incomplete', { count: incompleteCount })" />
            <Tag :value="$t('recommendations_count', { count: recommendations.length })" severity="secondary" />
          </div>
        </header>

        <div v-if="!recommendations.length" class="empty-state">
          <i class="pi pi-inbox" />{{ $t("no_recommendations") }}
        </div>

        <article v-for="(item, index) in recommendations" :key="item.key" class="recommendation"
          :class="{ incomplete: submitted && itemMissing(item) }">
          <div class="recommendation-side">
            <label :for="`recommendation-order-${item.key}`" class="order-label">{{ $t("display_order") }}</label>
            <InputNumber :inputId="`recommendation-order-${item.key}`" v-model="item.display_order" :min="0" :useGrouping="false"
              :disabled="!canEdit" :invalid="submitted && item.display_order == null"
              class="order-input" @blur="sortItems" />
          </div>
          <GenderTextField v-model="item.text" :inputId="`recommendation-${item.key}`"
            :label="`${$t('recommendation')} ${index + 1}`" :rows="3" :showErrors="submitted" :disabled="!canEdit" class="recommendation-text" />
          <Button v-if="canEdit" type="button" icon="pi pi-trash" severity="danger" variant="text" rounded
            v-tooltip.top="$t('delete')" :aria-label="$t('delete')" class="recommendation-delete" @click="removeItem(index)" />
        </article>

        <Button v-if="canEdit" type="button" icon="pi pi-plus" :label="$t('add_new_item')" severity="secondary" variant="outlined"
          class="add-button" @click="addItem" />
      </section>

      <div v-if="canEdit" class="form-actions">
        <Button type="submit" :label="$t('save')" icon="pi pi-check" :loading="saving" />
      </div>
    </form>
  </div>
</template>

<style scoped>
.page-hint,
.section-hint {
  margin: 0.25rem 0 0;
  color: var(--sawa-muted);
  font-size: 0.9rem;
}
.settings-form {
  display: grid;
  gap: 1rem;
}
.settings-section {
  display: grid;
  gap: 1rem;
}
.section-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}
.section-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--sawa-primary);
}
.section-tools {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.recommendation {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: start;
  padding: 1rem;
  border: 1px solid var(--sawa-border);
  border-inline-start: 4px solid var(--sawa-primary);
  border-radius: 0.75rem;
  background: #fff;
}
.recommendation.incomplete {
  border-color: #fca5a5;
  border-inline-start-color: #dc2626;
}
.recommendation-side {
  display: grid;
  gap: 0.35rem;
  justify-items: center;
}
.order-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--sawa-muted);
  white-space: nowrap;
}
.order-input :deep(input) {
  width: 4rem;
  text-align: center;
}
.add-button {
  justify-self: start;
}
.form-actions {
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: center;
  padding: 0.75rem;
  background: linear-gradient(to top, var(--sawa-page-bg) 70%, transparent);
}
.form-actions .p-button {
  min-width: 12rem;
}
@media (max-width: 640px) {
  .recommendation {
    grid-template-columns: minmax(0, 1fr) auto;
  }
  .recommendation-side {
    grid-column: 1 / -1;
    grid-template-columns: auto auto;
    justify-content: start;
    align-items: center;
  }
  .recommendation-text {
    grid-column: 1;
  }
}
</style>
