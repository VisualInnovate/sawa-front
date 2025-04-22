<script setup>
import {FilterMatchMode} from 'primevue/api'
import {ref, onMounted, onBeforeMount} from 'vue'
import Editor from 'primevue/editor';
import {useToast} from 'primevue/usetoast'
import axios from "axios";
import {useRouter} from "vue-router";
import { Button } from 'flowbite-vue';

const toast = useToast()
const router = useRouter()
const submitted = ref(false)
const loading = ref(true)
const details = ref({})
const description = ref('')
const permissions = ref(null)
const show = ref(false)
const role = ref({})
const confir_id = ref('')
const selectedProducts = ref(null)
const dt = ref(null)
const filters = ref({})
const createdialog = ref(false)
const skill = ref({})
const updatedialog = ref(false)
const selectedPermissionIds = ref([]);

onBeforeMount(() => {
  initFilters()
})

const fetchData = () => {
  axios.get("/api/permissions").then((res) => {
    loading.value = false
    permissions.value = res.data.permissions
  });
}

const handleSelectAll = (category, permissionsList) => {
  const permissionIdsInCategory = permissionsList.map((permission) => permission.id);

  if (areAllPermissionsSelected(permissionsList)) {
    selectedPermissionIds.value = selectedPermissionIds.value.filter(
      (id) => !permissionIdsInCategory.includes(id)
    );
  } else {
    selectedPermissionIds.value = [
      ...new Set([...selectedPermissionIds.value, ...permissionIdsInCategory]),
    ];
  }
};

const areAllPermissionsSelected = (permissionsList) => {
  return permissionsList.every((permission) =>
    selectedPermissionIds.value.includes(permission.id)
  );
};

const submitForm = () => {
  submitted.value = true;
  if (!role.value.name) return;

  axios.post(`/api/roles/create`, {
    permissions: selectedPermissionIds.value,
    name: role.value.name
  }).then((res) => {
    toast.add({severity: 'success', summary: 'Success', detail: 'Role created successfully', life: 3000});
    router.push({name: 'Roles'})
  }).catch(error => {
    toast.add({severity: 'error', summary: 'Error', detail: 'Failed to create role', life: 3000});
  });
}

onMounted(() => {
  fetchData()
})

const showDirection = (e) => {
  show.value = !(show.value)
  description.value = e.description
  details.value = e
}

const exportCSV = () => {
  dt.value.exportCSV()
}

const initFilters = () => {
  filters.value = {
    global: {value: null, matchMode: FilterMatchMode.CONTAINS},
  }
}

const handelSearch = (e) => {
  axios.get(`/api/permissions?search=${e}`).then((res) => {
    loading.value = false
    permissions.value = res.data.permissions
  });
}

const handleCheckboxClick = (permissionId) => {
  const index = selectedPermissionIds.value.indexOf(permissionId);
  if (index === -1) {
    selectedPermissionIds.value.push(permissionId);
  } else {
    selectedPermissionIds.value.splice(index, 1);
  }
};
</script>

<template>
  <div class="roles-container">
    <div class="header-container">
      <h1 class="page-title">{{ $t("roles") }}</h1>
      <div class="search-container">
        <span class="p-input-icon-left">
          <i class="pi pi-search"/>
          <InputText @update:model-value="handelSearch" :placeholder='$t("search")' class="search-input"/>
        </span>
      </div>
    </div>

    <div class="card-container">
      <div class="role-form-container">
        <form class="role-form" @submit.prevent="submitForm">
          <div class="form-group">
            <div class="flex items-center">
              <label class="form-label">{{ $t("اسم الرول") }}</label>
              <svg class="required-icon" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
              </svg>
            </div>
            <InputText 
              class="form-input" 
              v-model="role.name" 
              required 
              :class="{ 'input-error': submitted && !role.name}" 
            />
            <small class="error-message" v-if="submitted && !role.name">Role name is required</small>
          </div>
          
          <Button 
            type="submit" 
            class="submit-btn"
          >
            {{ $t("submit") }}
          </Button>
        </form>
      </div>

      <div class="permissions-grid">
        <div class="permission-category" v-for="(permissionsList, category) in permissions" :key="category">
          <div class="category-header">
            <h3>{{ category }}</h3>
            <input
              type="checkbox"
              class="category-checkbox"
              :checked="areAllPermissionsSelected(permissionsList)"
              @change="handleSelectAll(category, permissionsList)"
            />
          </div>
          <div class="permission-list">
            <div class="permission-item" v-for="permission in permissionsList" :key="permission.id">
              <div class="permission-info">
                <input
                  class="permission-checkbox"
                  type="checkbox"
                  :checked="selectedPermissionIds.includes(permission.id)"
                  @change="handleCheckboxClick(permission.id)"
                />
                <span class="permission-name">{{ permission.name }}</span>
              </div>
              <Button 
                icon="pi pi-info-circle" 
                class="p-button-rounded p-button-text info-btn"
                @click="showDirection(permission)"
                v-tooltip.top="'View description'"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <Dialog 
      v-model:visible="show" 
      :style="{ width: '550px' }" 
      :header='$t("permission_details")' 
      :modal="true"
      class="description-dialog"
    >
      <div class="dialog-content">
        <div class="flex flex-column gap-2">
          <label class="dialog-label" for="username">{{ $t('description') }}</label>
          <v-textarea 
            disabled 
            readonly="true" 
            bg-color="#f8f9fa" 
            rows="3" 
            v-model="description"
            class="description-textarea"
          ></v-textarea> 
        </div>
      </div>
      <template #footer>
        <Button 
          :label='$t("close")' 
          icon="pi pi-times" 
          class="p-button-text" 
          @click="show = false"
        />
      </template>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
.roles-container {
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.5rem;
  background-color: #f8f9fa;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  .page-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
  }

  .search-container {
    .search-input {
      border-radius: 20px;
      padding: 0.5rem 1rem;
      border: 1px solid #ced4da;
      transition: all 0.3s;

      &:focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 0.2rem rgba(99, 102, 241, 0.25);
      }
    }
  }
}

.card-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.role-form-container {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f1f1f1;
}

.role-form {
  display: flex;
  align-items: flex-end;
  gap: 1.5rem;
  flex-wrap: wrap;

  .form-group {
    flex: 1;
    min-width: 250px;

    .form-label {
      font-weight: 500;
      color: #4a5568;
      margin-right: 0.5rem;
    }

    .required-icon {
      margin-bottom: 0.25rem;
    }

    .form-input {
      width: 100%;
      border-radius: 8px;
      padding: 0.75rem;
      border: 1px solid #ced4da;
      transition: all 0.3s;
      margin-top: 0.5rem;

      &:focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 0.2rem rgba(99, 102, 241, 0.25);
      }

      &.input-error {
        border-color: #e53e3e;
      }
    }

    .error-message {
      color: #e53e3e;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: block;
    }
  }

  .submit-btn {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border: none;
    padding: 0.75rem 1.5rem;
    color: white;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s;
    height: fit-content;
    margin-bottom: 0.5rem;

    &:hover {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

.permissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.permission-category {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
  overflow: hidden;
  border: 1px solid #e2e8f0;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }

  .category-header {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
      font-size: 1.1rem;
      text-transform: capitalize;
      font-weight: 600;
    }

    .category-checkbox {
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 4px;
      border: 2px solid white;
      appearance: none;
      cursor: pointer;
      position: relative;

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
    }
  }

  .permission-list {
    padding: 1rem;

    .permission-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f1f1f1;
      transition: background-color 0.2s;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background-color: #f8f9fa;
      }

      .permission-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex: 1;

        .permission-checkbox {
          width: 1.1rem;
          height: 1.1rem;
          border-radius: 4px;
          border: 2px solid #6366f1;
          appearance: none;
          cursor: pointer;
          position: relative;

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
        }

        .permission-name {
          font-size: 0.9rem;
          color: #4a5568;
        }
      }

      .info-btn {
        color: #6366f1;
        transition: all 0.2s;

        &:hover {
          background-color: rgba(99, 102, 241, 0.1) !important;
          color: #4f46e5;
        }
      }
    }
  }
}

.description-dialog {
  .dialog-content {
    .dialog-label {
      font-weight: 500;
      color: #4a5568;
      margin-bottom: 0.5rem;
    }

    .description-textarea {
      border-radius: 8px;
      font-size: 0.95rem;
      line-height: 1.6;
    }
  }
}

@media (max-width: 768px) {
  .role-form {
    flex-direction: column;
    align-items: stretch;

    .form-group {
      min-width: 100%;
    }
  }

  .permissions-grid {
    grid-template-columns: 1fr;
  }
}
</style>