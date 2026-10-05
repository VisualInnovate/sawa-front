<script setup>
// Deduction types grouped in categories: each category card lists its types. Type 1 is used by the attendance
// deductions: its name is fixed and it cannot be deleted, but it can move to another category.
import { computed, onMounted, ref } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import Deduction from "../../../components/hr/Deduction.vue";
import { can } from "@/utils/permissions";

const { t } = useI18n();
const toast = useToast();

const categories = ref([]);
const loading = ref(true);
const search = ref("");

// { kind: "category" | "type", id, title, category_id }
const form = ref(null);
const saving = ref(false);
const submitted = ref(false);
const formError = ref("");
// { kind, id, title }
const removing = ref(null);
const deleting = ref(false);

const LOCKED_TYPE = 1;
const isLocked = (type) => Number(type.id) === LOCKED_TYPE;

// The search keeps a category whose name matches (all its types) or the types whose names match.
const shown = computed(() => {
  const term = search.value.trim().toLocaleLowerCase();
  if (!term) return categories.value;
  const has = (text) => String(text ?? "").toLocaleLowerCase().includes(term);
  return categories.value
    .map((category) => (has(category.title) ? category : { ...category, types: category.types.filter((type) => has(type.title)) }))
    .filter((category) => has(category.title) || category.types.length);
});

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get("api/deduction-categories");
    categories.value = (data?.data ?? []).map((category) => ({ ...category, types: category.types ?? [] }));
  } catch {
    categories.value = [];
    toast.add({ severity: "error", summary: t("error"), detail: t("request_failed_retry"), life: 4000 });
  } finally {
    loading.value = false;
  }
}

function openCategory(category = null) {
  submitted.value = false;
  formError.value = "";
  form.value = { kind: "category", id: category?.id ?? null, title: category?.title ?? "" };
}

function openType(category, type = null) {
  submitted.value = false;
  formError.value = "";
  form.value = { kind: "type", id: type?.id ?? null, title: type?.title ?? "", category_id: category.id, locked: type ? isLocked(type) : false };
}

async function save() {
  submitted.value = true;
  const value = form.value;
  if (!value || saving.value || !value.title.trim() || (value.kind === "type" && !value.category_id)) return;
  saving.value = true;
  formError.value = "";
  try {
    const url = value.kind === "category" ? "api/deduction-categories" : "api/deduction-types";
    const body = value.kind === "category" ? { title: value.title.trim() } : { title: value.title.trim(), category_id: value.category_id };
    if (value.id) await axios.put(`${url}/${value.id}`, body);
    else await axios.post(url, body);
    toast.add({ severity: "success", summary: t("success_message"), detail: t(value.id ? "element_update_success" : "element_add_success"), life: 3000 });
    form.value = null;
    await load();
  } catch (error) {
    formError.value = Object.values(error.response?.data?.errors ?? {}).flat()[0] ?? error.response?.data?.message ?? t("mission_error");
  } finally {
    saving.value = false;
  }
}

async function remove() {
  const target = removing.value;
  if (!target || deleting.value) return;
  deleting.value = true;
  try {
    await axios.delete(`${target.kind === "category" ? "api/deduction-categories" : "api/deduction-types"}/${target.id}`);
    toast.add({ severity: "success", summary: t("success_message"), detail: t("element_delet_success"), life: 3000 });
    removing.value = null;
    await load();
  } catch (error) {
    const status = error.response?.status;
    const detail = status === 422
      ? t(target.kind === "category" ? "deduction_category_not_empty" : "deduction_type_in_use")
      : t("mission_error");
    toast.add({ severity: "error", summary: t("error"), detail, life: 5000 });
    removing.value = null;
  } finally {
    deleting.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div class="page">
    <Deduction />

    <div class="sawa-card categories-page">
      <header class="categories-head">
        <h2>{{ $t("deduction_types") }}</h2>
        <div class="categories-tools">
          <IconField>
            <InputIcon class="pi pi-search" />
            <InputText v-model="search" :placeholder="$t('search')" :aria-label="$t('search')" />
          </IconField>
          <Button v-if="can('deduction type create')" icon="pi pi-plus" :label="$t('deduction_category_add')" @click="openCategory()" />
        </div>
      </header>

      <div v-if="loading" class="categories-state"><i class="pi pi-spin pi-spinner" aria-hidden="true" /> {{ $t("loading") }}</div>
      <div v-else-if="!shown.length" class="categories-state">
        <i class="pi pi-inbox" aria-hidden="true" />
        <p>{{ $t(search ? "no_records_found" : "deduction_categories_empty") }}</p>
      </div>

      <div v-else class="categories-grid">
        <section v-for="category in shown" :key="category.id" class="category-card">
          <header class="category-head">
            <div>
              <h3>{{ category.title }}</h3>
              <small>{{ $t("deduction_types_count", { count: category.types.length }) }}</small>
            </div>
            <div class="category-actions">
              <Button v-if="can('deduction type edit')" icon="pi pi-pencil" severity="info" variant="text" rounded
                v-tooltip.top="$t('edit')" :aria-label="$t('edit') + ' ' + category.title" @click="openCategory(category)" />
              <Button v-if="can('deduction type delete')" icon="pi pi-trash" severity="danger" variant="text" rounded
                v-tooltip.top="$t('delete')" :aria-label="$t('delete') + ' ' + category.title"
                @click="removing = { kind: 'category', id: category.id, title: category.title }" />
            </div>
          </header>

          <ul v-if="category.types.length" class="type-list">
            <li v-for="type in category.types" :key="type.id">
              <span class="type-title">
                {{ type.title }}
                <Tag v-if="isLocked(type)" :value="$t('deduction_type_system')" severity="secondary" />
              </span>
              <span class="type-actions">
                <Button v-if="can('deduction type edit')" icon="pi pi-pencil" severity="info" variant="text" rounded size="small"
                  v-tooltip.top="$t('edit')" :aria-label="$t('edit') + ' ' + type.title" @click="openType(category, type)" />
                <Button v-if="can('deduction type delete') && !isLocked(type)" icon="pi pi-trash" severity="danger" variant="text"
                  rounded size="small" v-tooltip.top="$t('delete')" :aria-label="$t('delete') + ' ' + type.title"
                  @click="removing = { kind: 'type', id: type.id, title: type.title }" />
              </span>
            </li>
          </ul>
          <p v-else class="type-empty">{{ $t("deduction_category_no_types") }}</p>

          <Button v-if="can('deduction type create')" icon="pi pi-plus" :label="$t('deduction_type_add')" variant="outlined"
            size="small" class="type-add" @click="openType(category)" />
        </section>
      </div>
    </div>

    <!-- Add / edit a category or a type -->
    <Dialog :visible="form !== null" modal :style="{ width: '30rem', maxWidth: '95vw' }"
      :header="form ? $t(form.kind === 'category' ? (form.id ? 'deduction_category_edit' : 'deduction_category_add') : (form.id ? 'deduction_type_edit' : 'deduction_type_add')) : ''"
      @update:visible="(value) => { if (!value) form = null; }">
      <form v-if="form" class="edit-form" @submit.prevent="save">
        <template v-if="form.kind === 'type'">
          <label for="deduction-type-category">{{ $t("deduction_category") }}</label>
          <Select v-model="form.category_id" inputId="deduction-type-category" :options="categories" optionLabel="title"
            optionValue="id" filter :invalid="submitted && !form.category_id" fluid />
        </template>
        <label for="deduction-form-title">{{ $t(form.kind === "category" ? "deduction_category_name" : "deduction_title") }}</label>
        <InputText id="deduction-form-title" v-model="form.title" :disabled="form.locked" :invalid="submitted && !form.title.trim()" fluid />
        <small v-if="form.locked" class="edit-note">{{ $t("deduction_type_system_hint") }}</small>
        <small v-if="formError" class="field-error">{{ formError }}</small>
        <div class="edit-buttons">
          <Button :label="$t('cancel')" variant="text" severity="secondary" @click="form = null" />
          <Button type="submit" icon="pi pi-check" :label="$t('save')" :loading="saving" />
        </div>
      </form>
    </Dialog>

    <Dialog :visible="removing !== null" modal :header="$t('confirm')" :style="{ width: '28rem', maxWidth: '95vw' }"
      @update:visible="(value) => { if (!value) removing = null; }">
      <p>{{ $t("remove_item") }} <b>{{ removing?.title }}</b>?</p>
      <template #footer>
        <Button :label="$t('no')" variant="text" severity="secondary" @click="removing = null" />
        <Button :label="$t('yes')" icon="pi pi-check" severity="danger" :loading="deleting" @click="remove" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.categories-page { margin-top: 1rem; padding: 1.25rem; }
.categories-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.25rem; }
.categories-head h2 { margin: 0; font-size: 1.3rem; font-weight: 700; color: var(--sawa-primary, #135c65); }
.categories-tools { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.categories-state { display: grid; justify-items: center; gap: 0.5rem; padding: 3rem 1rem; color: #64748b; }
.categories-state .pi { font-size: 2rem; color: #94a3b8; }
.categories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr)); gap: 1rem; }
.category-card { display: flex; flex-direction: column; gap: 0.75rem; padding: 1rem; border: 1px solid #e2e8f0; border-top: 4px solid var(--sawa-primary, #135c65); border-radius: 0.9rem; background: #fff; }
.category-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.5rem; }
.category-head h3 { margin: 0; font-size: 1.05rem; font-weight: 700; color: #0f172a; }
.category-head small { color: #64748b; }
.category-actions, .type-actions { display: flex; flex-shrink: 0; }
.type-list { display: grid; gap: 0.35rem; margin: 0; padding: 0; list-style: none; }
.type-list li { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; padding: 0.35rem 0.6rem; border-radius: 0.5rem; background: #f8fafc; }
.type-title { display: flex; flex-wrap: wrap; align-items: center; gap: 0.4rem; color: #1e293b; overflow-wrap: anywhere; }
.type-empty { margin: 0; color: #94a3b8; font-size: 0.9rem; }
.type-add { align-self: flex-start; margin-top: auto; }
.edit-form { display: grid; gap: 0.5rem; }
.edit-form label { font-weight: 600; color: #334155; }
.edit-note { color: #64748b; }
.field-error { color: #dc2626; }
.edit-buttons { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem; }
</style>
