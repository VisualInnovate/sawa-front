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

const areAllPermissionsSelected = (permissionsList) => {
  return permissionsList.every((permission) =>
    selectedPermissionIds.value.includes(permission.id)
  );
};

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

const handelSearch = (e) => {
  axios.get(`/api/permissions?search=${e}`).then((res) => {
    loading.value = false
    permissions.value = res.data.permissions
  });
}

const fetchData = () => {
  axios.get("/api/permissions").then((res) => {
    loading.value = false
    permissions.value = res.data.permissions
  });
}

const getOne = () => {
  axios.get(`/api/roles/${router.currentRoute.value.params.id}`).then((res) => {
    loading.value = false
    role.value.name = res.data.role.name
    for (let i = 0; i < res.data.role.permissions.length; i++) {
      selectedPermissionIds.value.push(res.data.role.permissions[i].id)
    }
  });
}

const submitForm = () => {
  submitted.value = true;
  if (!role.value.name) {
    toast.add({severity: 'error', summary: 'Validation Error', detail: 'Role name is required', life: 3000});
    return;
  }

  axios.put(`/api/roles/${router.currentRoute.value.params.id}/edit`, {
    permissions: selectedPermissionIds.value,
    name: role.value.name
  }).then((res) => {
    toast.add({severity: 'success', summary: 'Success', detail: 'Role updated successfully', life: 3000});
    router.push({name: 'Roles'})
  }).catch(error => {
    toast.add({severity: 'error', summary: 'Error', detail: 'Failed to update role', life: 3000});
  });
}

onMounted(() => {
  fetchData()
  getOne()
})

const showDirection = (e) => {
  show.value = !(show.value)
  description.value = e.description
  details.value = e
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
  <div v-can="'roles list'" class="role-edit-container">
    <div class="header-container">
      <h1 class="page-title">{{ $t("Edit Role") }}</h1>
      <div class="search-container">
        <span class="p-input-icon-left">
          <i class="pi pi-search"/>
          <InputText 
            @update:model-value="handelSearch" 
            :placeholder='$t("search")'
            class="search-input"
          />
        </span>
      </div>
    </div>

    <div class="card-container">
      <div class="form-section">
        <form @submit.prevent="submitForm" class="role-form">
          <div class="form-group">
            <div class="flex items-center">
              <label class="form-label">{{ $t("اسم الرول") }}</label>
              <svg class="required-icon" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
              </svg>
            </div>
            <InputText 
              v-model="role.name" 
              class="form-input"
              :class="{ 'input-error': submitted && !role.name}"
              placeholder="Enter role name"
            />
            <small v-if="submitted && !role.name" class="error-message">Role name is required</small>
          </div>
          
          <Button 
            type="submit" 
            class="submit-button"
          >
            {{ $t("submit") }}
            <i class="pi pi-save ml-2"></i>
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
                <label class="permission-checkbox-container">
                  <input 
                    type="checkbox"
                    :checked="selectedPermissionIds.includes(permission.id)"
                    @change="handleCheckboxClick(permission.id)"
                  />
                  <span class="checkmark"></span>
                  <span class="permission-name">{{ permission.name }}</span>
                </label>
              </div>
              <Button 
                icon="pi pi-info-circle" 
                class="p-button-rounded p-button-text info-button"
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
      :header="'Permission Description'"
      :modal="true"
      class="permission-dialog"
    >
      <div class="dialog-content">
        <div class="description-container">
          <label class="description-label">{{ $t('description') }}</label>
          <div class="description-text">
            {{ description || 'No description available' }}
          </div>
        </div>
      </div>
      <template #footer>
        <Button 
          label="Close" 
          icon="pi pi-times" 
          class="p-button-text close-button" 
          @click="show = false"
        />
      </template>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
.role-edit-container {
  padding: 2rem;
  background-color: #f8fafc;
  min-height: 100vh;
  max-height: 90vh;
  overflow-y: auto;
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
    color: #1e293b;
    margin: 0;
  }

  .search-container {
    .search-input {
      border-radius: 20px;
      padding: 0.5rem 1rem;
      border: 1px solid #cbd5e1;
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
  padding: 2rem;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.role-form {
  display: flex;
  align-items: flex-end;
  gap: 1.5rem;
  flex-wrap: wrap;

  .form-group {
    flex: 1;
    min-width: 300px;

    .form-label {
      font-weight: 500;
      color: #475569;
      margin-right: 0.5rem;
      font-size: 0.95rem;
    }

    .required-icon {
      margin-bottom: 0.25rem;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      transition: all 0.3s;
      margin-top: 0.5rem;
      font-size: 0.95rem;
      color: #334155;

      &:focus {
        outline: none;
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
      }

      &.input-error {
        border-color: #ef4444;
      }
    }

    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.5rem;
      display: block;
    }
  }

  .submit-button {
    background: linear-gradient(to right, #6366f1, #8b5cf6);
    border: none;
    padding: 0.75rem 1.5rem;
    color: white;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s;
    height: fit-content;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;

    &:hover {
      background: linear-gradient(to right, #4f46e5, #7c3aed);
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
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }

  .category-header {
    background: linear-gradient(to right, #6366f1, #8b5cf6);
    color: white;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      text-transform: capitalize;
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
      border-bottom: 1px solid #f1f5f9;

      &:last-child {
        border-bottom: none;
      }

      .permission-info {
        flex: 1;

        .permission-checkbox-container {
          display: flex;
          align-items: center;
          position: relative;
          padding-left: 2rem;
          cursor: pointer;
          user-select: none;

          input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;

            &:checked ~ .checkmark {
              background-color: #6366f1;
              border-color: #6366f1;

              &:after {
                display: block;
              }
            }
          }

          .checkmark {
            position: absolute;
            top: 0;
            left: 0;
            height: 1.25rem;
            width: 1.25rem;
            background-color: white;
            border: 2px solid #cbd5e1;
            border-radius: 4px;
            transition: all 0.2s;

            &:after {
              content: "";
              position: absolute;
              display: none;
              left: 6px;
              top: 2px;
              width: 5px;
              height: 10px;
              border: solid white;
              border-width: 0 2px 2px 0;
              transform: rotate(45deg);
            }
          }

          .permission-name {
            font-size: 0.95rem;
            color: #475569;
            margin-left: 0.5rem;
          }

          &:hover input ~ .checkmark {
            border-color: #94a3b8;
          }
        }
      }

      .info-button {
        color: #64748b;
        transition: all 0.2s;

        &:hover {
          color: #6366f1;
          background-color: rgba(99, 102, 241, 0.1) !important;
        }
      }
    }
  }
}

.permission-dialog {
  .dialog-content {
    .description-container {
      .description-label {
        font-weight: 500;
        color: #475569;
        margin-bottom: 0.5rem;
        display: block;
      }

      .description-text {
        padding: 1rem;
        background-color: #f8fafc;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        min-height: 100px;
        max-height: 300px;
        overflow-y: auto;
        line-height: 1.6;
        color: #475569;
      }
    }
  }

  .close-button {
    color: #64748b;

    &:hover {
      color: #475569;
      background-color: #f1f5f9 !important;
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