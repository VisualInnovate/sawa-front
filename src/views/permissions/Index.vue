<script setup>
import {FilterMatchMode} from 'primevue/api'
import {ref, onMounted, onBeforeMount} from 'vue'
import Editor from 'primevue/editor';
import {useToast} from 'primevue/usetoast'
import axios from "axios";
import {useRouter} from "vue-router";

const toast = useToast()
const router = useRouter()

const loading = ref(true)
const details = ref({})
const description = ref('')
const permissions = ref(null)
const show = ref(false)
const deleteDialog = ref(false)
const confir_id = ref('')
const selectedProducts = ref(null)
const dt = ref(null)
const filters = ref({})
const createdialog = ref(false)
const skill = ref({})
const updatedialog = ref(false)

onBeforeMount(() => {
  initFilters()
})

const fetchData = (e) => {
  axios.get(`/api/permissions`).then((res) => {
    loading.value = false
    permissions.value = res.data.permissions
  });
}

const handelSearch = (e) => {
  axios.get(`/api/permissions?search=${e}`).then((res) => {
    loading.value = false
    permissions.value = res.data.permissions
  });
}

const updateDis = () => {
  axios.put(`/api/permissions/${details.value.id}/edit`, {
    description: description.value
  }).then((res) => {
    fetchData()
    show.value = !(show.value)
    toast.add({severity: 'success', summary: 'Success', detail: 'Permission updated', life: 3000});
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
</script>

<template>
  <div v-can="'permissions list'" class="permissions-container">
    <div class="header-container">
      <h1 class="page-title">{{ $t("permissions") }}</h1>
      <div class="search-container">
        <span class="p-input-icon-left">
          <i class="pi pi-search"/>
          <InputText @update:model-value="handelSearch" :placeholder='$t("search")' class="search-input"/>
        </span>
      </div>
    </div>

    <div class="permissions-grid">
      <div class="permission-category" v-for="(permissionsList, category) in permissions" :key="category">
        <div class="category-header">
          <h3>{{ category }}</h3>
          <i class="pi pi-lock category-icon"></i>
        </div>
        <div class="permission-list">
          <div class="permission-item" v-for="permission in permissionsList" :key="permission.id">
            <div class="permission-info">
              <i class="pi pi-key permission-icon"></i>
              <span class="permission-name">{{ permission.name }}</span>
            </div>
            <Button 
              icon="pi pi-pencil" 
              class="p-button-rounded p-button-text edit-btn"
              @click="showDirection(permission)"
              v-tooltip.top="'Edit description'"
            />
          </div>
        </div>
      </div>
    </div>

    <Dialog 
      v-model:visible="show" 
      :style="{ width: '550px' }" 
      :header='$t("update_description")' 
      :modal="true"
      class="description-dialog"
    >
      <div class="dialog-content">
        <div class="flex flex-column gap-2">
          <label class="dialog-label" for="username">{{ $t('description') }}</label>
          <Editor 
            v-model="description" 
            editorStyle="height: 150px"
            class="rich-text-editor"
          />
        </div>
      </div>
      <template #footer>
        <Button 
          :label='$t("cancel")' 
          icon="pi pi-times" 
          class="p-button-text p-button-danger" 
          @click="show = false"
        />
        <Button 
          :label='$t("save")' 
          icon="pi pi-check" 
          class="p-button-text p-button-success" 
          @click="updateDis"
        />
      </template>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
.permissions-container {
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
      font-size: 1.25rem;
      text-transform: capitalize;
    }

    .category-icon {
      font-size: 1.5rem;
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

        .permission-icon {
          color: #6366f1;
          font-size: 1rem;
        }

        .permission-name {
          font-size: 0.95rem;
          color: #4a5568;
        }
      }

      .edit-btn {
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

    .rich-text-editor {
      border-radius: 8px;
      border: 1px solid #ced4da;

      &:deep(.ql-toolbar) {
        border-radius: 8px 8px 0 0;
        background-color: #f8f9fa;
      }

      &:deep(.ql-container) {
        border-radius: 0 0 8px 8px;
      }
    }
  }
}

@media (max-width: 768px) {
  .permissions-grid {
    grid-template-columns: 1fr;
  }

  .header-container {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>