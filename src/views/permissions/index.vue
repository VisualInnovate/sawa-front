<template>
  <div class="permissions-container">
    <div class="header-container">
      <h1 class="page-title">{{ $t("permissions") }}</h1>
      <IconField class="table-search">
                <InputIcon class="pi pi-search" />
                <InputText v-model="search" :placeholder="$t('search')" class="search-input" />
              </IconField>
    </div>

    <p v-if="loading" class="loading">{{ $t("loading") }}</p>
    <PermissionCards
      v-else
      :modules="filteredModules"
      :selectable="false"
      :describe-icon="$can('permissions edit') ? 'pi pi-pencil' : 'pi pi-info-circle'"
      :describe-tooltip="$can('permissions edit') ? 'edit_description' : 'view_description'"
      @describe="openDescription"
    />

    <Dialog
      v-model:visible="show"
      :style="{ width: '520px' }"
      :header="$can('permissions edit') ? $t('update_description') : $t('permission_description')"
      :modal="true"
    >
      <div class="dialog-content">
        <label class="dialog-label" for="permission-description">{{ details.name }}</label>
        <Textarea
          v-if="$can('permissions edit')"
          id="permission-description"
          v-model="description"
          rows="4"
          maxlength="255"
          class="w-full"
        />
        <p v-else class="description-text">{{ description || $t("no_description") }}</p>
      </div>
      <template #footer>
        <Button :label="$t('cancel')" icon="pi pi-times" @click="show = false" variant="text" severity="danger" />
        <Button
          v-can="'permissions edit'"
          :label="$t('save')"
          icon="pi pi-check"
          :loading="saving"
          @click="updateDescription" variant="text" severity="success" />
      </template>
    </Dialog>
    <Toast />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import axios from "axios";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import PermissionCards from "../../components/permissions/PermissionCards.vue";

const toast = useToast();
const { t } = useI18n();

const modules = ref([]);
const loading = ref(true);
const saving = ref(false);
const search = ref("");
const show = ref(false);
const details = ref({});
const description = ref("");

const filteredModules = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return modules.value;
  return modules.value
    .map((card) => {
      const cardMatches = [card.label_ar, card.label_en].some((v) => v?.toLowerCase().includes(q));
      const permissions = cardMatches
        ? card.permissions
        : card.permissions.filter((p) =>
            [p.name, p.label_ar, p.label_en, p.description].some((v) => v?.toLowerCase().includes(q))
          );
      return { ...card, permissions };
    })
    .filter((card) => card.permissions.length);
});

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await axios.get("/api/permissions");
    modules.value = res.data.modules;
  } finally {
    loading.value = false;
  }
};

const openDescription = (permission) => {
  details.value = permission;
  description.value = permission.description || "";
  show.value = true;
};

const updateDescription = async () => {
  saving.value = true;
  try {
    await axios.put(`/api/permissions/${details.value.id}/edit`, { description: description.value });
    await fetchData();
    show.value = false;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("permission_updated"), life: 3000 });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: t("error"),
      detail: error.response?.status === 403 ? t("no_permission_action") : error.response?.data?.message,
      life: 4000,
    });
  } finally {
    saving.value = false;
  }
};

onMounted(fetchData);
</script>

<style scoped lang="scss">
.permissions-container {
  padding: 1.5rem;
  background-color: #f8f9fa;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;

  .page-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
  }

  .search-input {
    border-radius: 20px;
    padding: 0.5rem 1rem;
    border: 1px solid #ced4da;
  }
}

.loading {
  color: #64748b;
}

.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dialog-label {
  font-weight: 500;
  color: #4a5568;
  direction: ltr;
}

.description-text {
  white-space: pre-line;
  line-height: 1.7;
  margin: 0;
}
</style>
