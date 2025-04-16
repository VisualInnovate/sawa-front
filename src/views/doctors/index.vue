<script setup>
import {FilterMatchMode} from 'primevue/api'
import {ref, onMounted, onBeforeMount} from 'vue'
import { useI18n } from 'vue-i18n';
import { useStorage } from "@vueuse/core";
import {useToast} from 'primevue/usetoast'
import axios from "axios";
import {useRouter} from "vue-router";

const toast = useToast()
const router = useRouter()
const usersdata = ref({
  skills: [],
  department: []
})
const { t } = useI18n();
const roles = ref([])
const skills = ref([])

const tpes = () => {
  return [
    { name: t('driver'), id: 1 },
    { name: t('doctor'), id: 2 },
    { name: t('Evaluator'), id: 5 },
  ]
}

const doctor_id = useStorage("doctor_id", Number)
const departments = ref({})
const loading = ref(true)
const user = ref({})
const error = ref('')
const users = ref(null)
const productDialog = ref(false)
const deleteDialog = ref(false)
const confir_id = ref('')
const selectedProducts = ref(null)
const dt = ref(null)
const filters = ref({})
const createdialog = ref(false)
const updatedialog = ref(false)

onBeforeMount(() => {
  initFilters()
})

const fetchData = () => {
  loading.value=true
  axios.get("/api/doctors").then((res) => {
    users.value = res.data.doctors
    loading.value = false
  });
  
  axios.post("/api/roles").then((res) => {
    loading.value = false
    roles.value = res.data.roles.data
  });
  
  axios.get("/api/skills").then((res) => {
    skills.value = res.data.data
  });
  
  axios.get("/api/department").then((res) => {
    departments.value = res.data.data
  });
}

const detail = (id) => {
  doctor_id.value = id
  router.push({name: 'doctors-show'})
}

onMounted(() => {
  fetchData()
})

const edit = (id) => {
  router.push({name: 'Employee-update', params: {'id': id}})
}

const openNew = () => {
  usersdata.value = ref({})
  createdialog.value = !(createdialog.value)
}

const confirmDelete = (id) => {
  deleteDialog.value = true
  confir_id.value = id
}

const uploadFile = (e) => {
  const image = e.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(image);
  reader.onload = (e) => {
    usersdata.value.image = e.target.result;
    usersdata.value.file = image;
  };
};

const createuser = () => {
  const body = new FormData();
  body.append("name", usersdata.value.name);
  body.append("email", usersdata.value.email);
  body.append("title", usersdata.value.title);
  body.append("password", usersdata.value.password);
  body.append("image", usersdata.value.file);
  body.append("role", usersdata.value.role);
  
  if(usersdata.value.spotter) {
    body.append("spotter", usersdata.value.spotter);
  }
  
  if(usersdata.value.skills) {
    body.append("skills", usersdata.value.skills);
  }
  
  if(usersdata.value.department) {
    body.append("department_id", usersdata.value.department);
  }
  
  body.append("type", usersdata.value.type)

  axios.post('/api/users/create', body)
    .then((res) => {
      fetchData()
      createdialog.value = !(createdialog.value)
      toast.add({severity: 'success', summary: 'Successful', detail: 'Successful', life: 3000})
      skill.value = ref({})
    })
    .catch((el) => {
      error.value = el.response.data.errors
    })
}

const editesuser = () => {
  const body = new FormData();
  body.append("name", usersdata.value.name);
  body.append("email", usersdata.value.email);
  body.append("title", usersdata.value.title);
  body.append("password", usersdata.value.password);
  body.append("image", usersdata.value.file);
  body.append("role", usersdata.value.role);
  
  if(usersdata.value.spotter) {
    body.append("spotter", usersdata.value.spotter);
  }
  
  if(usersdata.value.skills) {
    body.append("skills", usersdata.value.skills);
  }
  
  if(usersdata.value.department) {
    body.append("department_id", usersdata.value.department);
  }
  
  body.append("type", usersdata.value.type)
  
  axios.post(`/api/users/${confir_id.value}/edit`, body)
    .then((res) => {
      fetchData()
      updatedialog.value = !(updatedialog.value)
      toast.add({severity: 'success', summary: 'Successful', detail: 'Successful', life: 3000})
      skill.value = ref({})
    })
    .catch((el) => {
      error.value = el.response.data.errors
    })
}

const deleteAction = () => {
  axios.delete(`/api/users/${confir_id.value}/delete`)
    .then((res) => {
      deleteDialog.value = false
      fetchData()
      toast.add({severity: 'success', summary: 'Successful', detail: 'Successful', life: 3000})
    })
    .catch(() => {})
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
  <div class="grid">
    <div class="col-12">
      <div class="card p-4 shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">{{ $t("doctors") }}</h2>
          </template>

          <template #end>
            <Button 
              v-can="'doctor list'" 
              :label='$t("export")' 
              icon="pi pi-download" 
              class="p-button-info no-print" 
              @click="exportCSV"
            />
          </template>
        </Toolbar>

        <Toast />

        <div class="card shadow-1 surface-0">
          <DataTable
            ref="dt"
            v-model:selection="selectedProducts"
            :value="users"
            :loading="loading"
            data-key="id"
            :paginator="true"
            :rows="10"
            :filters="filters"
            paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rows-per-page-options="[5, 10, 25, 50, 100]"
            current-page-report-template="Showing {first} to {last} of {totalRecords} records"
            responsive-layout="scroll"
            scrollable
            scroll-height="flex"
            v-can="'doctor list'"
            stripedRows
            showGridlines
            class="p-datatable-sm"
          >
            <template #header>
              <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3">
                <div class="flex gap-2">
                  <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText 
                      v-model="filters['global'].value" 
                      :placeholder='$t("search")' 
                      class="w-full"
                    />
                  </span>
                  <Button 
                    icon="pi pi-refresh" 
                    class="p-button-text" 
                    @click="fetchData()" 
                    v-tooltip.top="'Refresh data'"
                  />
                </div>
              </div>
            </template>

            <Column selection-mode="multiple" header-style="width: 3rem"></Column>
            
            <Column field="index" :header='$t("index")' :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.id }}
              </template>
            </Column>
            
            <Column field="name" :header='$t("name")' :sortable="true">
              <template #body="slotProps">
                <span class="font-medium">{{ slotProps.data.name }}</span>
              </template>
            </Column>
            
        
            
            <Column field="email" :header='$t("email")' :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.email }}
              </template>
            </Column>
             
            <Column field="title" :header='$t("title")' :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.title }}
              </template>
            </Column>
            
            <Column header-style="min-width:10rem;" class="no-print">
              <template #body="slotProps">
                <div class="flex gap-2">
                  <Button
                    v-can="'user edit'"
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-success"
                    @click="edit(slotProps.data.id)"
                    v-tooltip.top="'Edit'"
                  />
                  <Button
                    v-can="'user create'"
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-danger"
                    @click="confirmDelete(slotProps.data.id)"
                    v-tooltip.top="'Delete'"
                  />
                  <Button
                    icon="pi pi-user"
                    class="p-button-rounded p-button-info"
                    @click="detail(slotProps.data.id)"
                    v-tooltip.top="'View Details'"
                  />
                </div>
              </template>
            </Column>

            <template #empty>
              <div class="text-center py-4">
                <i class="pi pi-exclamation-circle text-2xl mb-2" />
                <p class="text-xl">No records found</p>
              </div>
            </template>

            <template #loading>
              <div class="flex justify-content-center align-items-center py-4">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
              </div>
            </template>
          </DataTable>
        </div>

        <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" :header='$t("confirm")' :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--red-500)" />
            <span v-if="user">
              {{ $t('remove_item') }} <b>{{ user.first_name }}</b>?
            </span>
          </div>
          <template #footer>
            <Button :label='$t("no")' icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
            <Button :label='$t("yes")' icon="pi pi-check" class="p-button-text p-button-danger" @click="deleteAction" />
          </template>
        </Dialog>

        <Dialog v-model:visible="createdialog" :style="{ width: '450px' }" :header='$t("users")' :modal="true">
          <div class="">
            <div>
              <img onclick="document.getElementById('filr').click()" class="m-auto rounded-full" style="width: 150px; height: 150px;" v-if="usersdata.image" :src="'https://sawa.sawa.academy/'+usersdata.image">
              <img onclick="document.getElementById('filr').click()" class="m-auto rounded-full" style="width: 150px; height: 150px;" v-else src="../frontend/image/Ellipse2.png">
              <div class="mt-1 mb-5 text-red-500" v-if="error?.image">{{ error.image[0] }}</div>
            </div>
          </div>
          
          <div class="flex flex-column gap-2 py-1">
            <label class="w-full text-right" for="username">{{ $t('name') }}</label>
            <InputText required class="bg-[#f7f5f5] text-center" v-model="usersdata.name" :placeholder='$t("name")' />
            <div class="mt-1 mb-5 text-red-500" v-if="error?.name">{{ error.name[0] }}</div>
          </div>
          
          <div class="flex flex-column gap-2 py-1">
            <label class="w-full text-right" for="username">{{ $t('type') }}</label>
            <Dropdown required id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="usersdata.type" option-value="id" filter :options="tpes()" optionLabel="name" :placeholder='$t("type")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem" />
            <div class="mt-1 mb-5 text-red-500" v-if="error?.type">{{ error.type[0] }}</div>
          </div>
          
          <div v-if="usersdata.type == 0 || usersdata.type ==2" class="flex flex-column gap-2">
            <label class="w-full text-right" for="username">{{ $t('skill_name') }}</label>
            <MultiSelect v-model="usersdata.skills" filter option-value="id" :options="skills" optionLabel="name" :placeholder='$t("skill_name")' class="w-full bg-[#f7f5f5] md:w-20rem" />
            <div class="mt-1 mb-5 text-red-500" v-if="error?.permissions">{{ error.permissions[0] }}</div>
          </div>
          
          <div v-if="usersdata.type == 0 || usersdata.type ==2" class="flex flex-column gap-2">
            <label class="w-full text-right" for="username">{{ $t('department') }}</label>
            <MultiSelect v-model="usersdata.department" filter option-value="id" :options="departments" optionLabel="title" :placeholder='$t("department")' class="w-full bg-[#f7f5f5] md:w-20rem" />
            <div class="mt-1 mb-5 text-red-500" v-if="error?.permissions">{{ error.permissions[0] }}</div>
          </div>
          
          <div v-if="usersdata.type == 0 || usersdata.type ==2" class="flex flex-column gap-2">
            <label class="w-full text-right" for="username">{{ $t('Spotter') }}</label>
            <InputText required class="bg-[#f7f5f5] text-center" v-model="usersdata.spotter" :placeholder='$t("Spotter")' />
            <div class="mt-1 mb-5 text-red-500" v-if="error?.permissions">{{ error.permissions[0] }}</div>
          </div>
          
          <div class="flex flex-column gap-2 py-1">
            <label class="w-full text-right" for="username">{{ $t('email') }}</label>
            <InputText required class="bg-[#f7f5f5] text-center" v-model="usersdata.email" :placeholder='$t("email")' />
            <div class="mt-1 mb-5 text-red-500" v-if="error?.email">{{ error.email[0] }}</div>
          </div>
          
          <div class="flex flex-column gap-2 py-1">
            <label class="w-full text-right" for="username">{{ $t('title') }}</label>
            <InputText required class="bg-[#f7f5f5] text-center" v-model="usersdata.title" :placeholder='$t("title")' />
            <div class="mt-1 mb-5 text-red-500" v-if="error?.title">{{ error.title[0] }}</div>
          </div>
          
          <div class="flex flex-column gap-2 py-1">
            <label class="w-full text-right" for="username">{{ $t('password') }}</label>
            <InputText required class="bg-[#f7f5f5] text-center" v-model="usersdata.password" :placeholder='$t("password")' />
            <div class="mt-1 mb-5 text-red-500" v-if="error?.password">{{ error.password[0] }}</div>
          </div>
          
          <div class="flex flex-column gap-2 py-1">
            <label class="w-full text-right" for="username">{{ $t('roles') }}</label>
            <Dropdown required id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="usersdata.role" option-value="id" filter :options="roles" optionLabel="name" :placeholder='$t("roles")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem" />
            <div class="mt-1 mb-5 text-red-500" v-if="error?.role">{{ error.role[0] }}</div>
          </div>
          
          <div class="flex-column gap-2 py-1 hidden">
            <label class="w-full text-right" for="username">{{ $t('personal_image') }}</label>
            <InputText name="file" ref="file" @change="uploadFile" accept="image/*" id="filr" type="file" class="w-full" />
            <div class="mt-1 mb-5 text-red-500" v-if="error?.image">{{ error.image[0] }}</div>
          </div>

          <div class="w-full text-center">
            <Button @click="createuser" class="p-button-success m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
          </div>
        </Dialog>

        <Dialog v-model:visible="updatedialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
          <!-- Update dialog content remains the same as create dialog -->
          <!-- ... -->
        </Dialog>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for better table display */
:deep(.p-datatable) {
  font-size: 0.9rem;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #f8f9fa;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  transition: background-color 0.2s;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #f0f4f8 !important;
}

/* Responsive adjustments */
@media screen and (max-width: 960px) {
  :deep(.p-datatable) {
    overflow-x: auto;
    display: block;
  }
}

/* Print-specific styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  :deep(.p-datatable) {
    font-size: 10pt;
    width: 100%;
  }
  
  :deep(.p-datatable .p-datatable-thead > tr > th),
  :deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 0px 0px;
  }
}

/* Button spacing in action column */
:deep(.p-button) {
  margin: 0.0rem;
}
</style>