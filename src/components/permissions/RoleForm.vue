<template>
  <div class="role-form-page">
    <div class="header-container">
      <h1 class="page-title">{{ roleId ? $t("edit_role") : $t("create_role") }}</h1>
      <div class="search-container">
        <IconField class="table-search">
                <InputIcon class="pi pi-search" />
                <InputText v-model="search" :placeholder="$t('search')" class="search-input" />
              </IconField>
      </div>
    </div>

    <div class="card-container">
      <div v-if="locked" class="locked-banner">
        <i class="pi pi-lock"></i>
        <span>{{ $t("admin_role_locked") }}</span>
      </div>

      <form v-else class="role-form" @submit.prevent="submit">
        <div class="form-group">
          <label class="form-label" for="role-name">{{ $t("role_name") }} <span class="required">*</span></label>
          <InputText
            id="role-name"
            v-model="name"
            class="form-input"
            :class="{ 'input-error': submitted && !name }"
            :placeholder="$t('enter_role_name')"
          />
          <small v-if="submitted && !name" class="error-message">{{ $t("role_name_required") }}</small>
        </div>
        <button type="submit" class="submit-btn" :disabled="saving">
          <i class="pi pi-save"></i>
          {{ $t("submit") }}
        </button>
      </form>

      <p v-if="loading" class="loading">{{ $t("loading") }}</p>
      <PermissionCards
        v-else
        v-model="selected"
        :modules="filteredModules"
        :readonly="locked"
        @describe="openDescription"
      />
    </div>

    <Dialog
      v-model:visible="descriptionVisible"
      :style="{ width: '520px' }"
      :header="$t('permission_description')"
      :modal="true"
    >
      <p class="description-text">{{ description || $t("no_description") }}</p>
      <template #footer>
        <Button :label="$t('close')" icon="pi pi-times" @click="descriptionVisible = false" variant="text" />
      </template>
    </Dialog>
    <Toast />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import PermissionCards from "./PermissionCards.vue";

const props = defineProps({
  // Empty for a new role.
  roleId: { type: [String, Number], default: null },
});

const router = useRouter();
const toast = useToast();
const { t } = useI18n();

const modules = ref([]);
const selected = ref([]);
const name = ref("");
const locked = ref(false);
const loading = ref(true);
const saving = ref(false);
const submitted = ref(false);
const search = ref("");
const descriptionVisible = ref(false);
const description = ref("");

// Filtering happens in the page so the checked state survives a search.
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

const load = async () => {
  loading.value = true;
  try {
    const requests = [axios.get("/api/permissions")];
    if (props.roleId) requests.push(axios.get(`/api/roles/${props.roleId}`));
    const [permissionsRes, roleRes] = await Promise.all(requests);
    modules.value = permissionsRes.data.modules;
    if (roleRes) {
      const role = roleRes.data.role;
      name.value = role.name;
      locked.value = Boolean(role.is_locked);
      selected.value = role.permissions.map((p) => p.id);
    }
  } finally {
    loading.value = false;
  }
};

const submit = async () => {
  submitted.value = true;
  if (!name.value || locked.value) return;
  saving.value = true;
  const body = { name: name.value, permissions: selected.value };
  try {
    if (props.roleId) {
      await axios.put(`/api/roles/${props.roleId}/edit`, body);
    } else {
      await axios.post("/api/roles/create", body);
    }
    toast.add({
      severity: "success",
      summary: t("success_message"),
      detail: t(props.roleId ? "role_updated_successfully" : "role_created_successfully"),
      life: 3000,
    });
    router.push({ name: "Roles" });
  } catch (error) {
    const forbidden = error.response?.status === 403;
    toast.add({
      severity: "error",
      summary: t("error"),
      detail: forbidden
        ? t("no_permission_action")
        : error.response?.data?.message || t(props.roleId ? "failed_to_update_role" : "failed_to_create_role"),
      life: 4000,
    });
  } finally {
    saving.value = false;
  }
};

const openDescription = (permission) => {
  description.value = permission.description;
  descriptionVisible.value = true;
};

onMounted(load);
</script>

<style scoped lang="scss">
.role-form-page {
  padding: 1.5rem;
  background-color: #f8fafc;
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
    color: #1e293b;
    margin: 0;
  }

  .search-input {
    border-radius: 20px;
    padding: 0.5rem 1rem;
    border: 1px solid #cbd5e1;
  }
}

.card-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.locked-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f0f9fa;
  border: 1px solid #b6dde0;
  color: #135c65;
  border-radius: 10px;
  padding: 0.9rem 1rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.role-form {
  display: flex;
  align-items: flex-end;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;

  .form-group {
    flex: 1;
    min-width: 250px;
  }

  .form-label {
    display: block;
    font-weight: 500;
    color: #475569;
    margin-bottom: 0.5rem;
  }

  .required {
    color: #da1414;
  }

  .form-input {
    width: 100%;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    border: 1px solid #cbd5e1;

    &.input-error {
      border-color: #ef4444;
    }
  }

  .error-message {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.4rem;
    display: block;
  }
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  padding: 0.75rem 1.5rem;
  color: white;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }

  &:focus-visible {
    outline: 2px solid #135c65;
    outline-offset: 2px;
  }
}

.loading {
  color: #64748b;
}

.description-text {
  white-space: pre-line;
  line-height: 1.7;
  margin: 0;
}
</style>
