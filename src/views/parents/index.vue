<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();
const products = ref(null);
const loading = ref(true);
const user = ref({});
const error = ref('');
const users = ref(null);
const deleteDialog = ref(false);


const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});

const rate = ref({
  tourist_rating: Number,
  reviewable_id: '',
  type: 1,
});

onBeforeMount(() => {
  initFilters()
})


const fetchData = () => {
  axios.get('/api/admin-parents').then((res) => {
    loading.value = false;
    users.value = res.data.parents;
    console.log(users.value);
  });
};

onMounted(() => {
  fetchData();
});




const confirmDelete = (id) => {
  console.log(id);
  deleteDialog.value = true;
  error.value = ref('');
  rate.value.reviewable_id = id;
  user.value.id = id;
};

const deleteAction = () => {
  axios
    .delete(`/api/admin-parents/delete/${user.value.id}`)
    .then((res) => {
      console.log(res.data);
      deleteDialog.value = false;
      fetchData();
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Successful', life: 3000 });
    })
    .catch(() => {});
};




const exportCSV = () => {
  dt.value.exportCSV();
};


const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  }
}
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <va-card class="card">
        <Toolbar class="mb-4 shadow-md">
          <template #start>
            <div class="my-2">
              <!-- Add your buttons here -->
            </div>
          </template>

          <template #end>
            <Button v-can="'child create'" :label='$t("export")' icon="pi pi-upload" class="export" @click="exportCSV($event)" />
          </template>
        </Toolbar>

        <Toast />

        <div class="shadow-xl">
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
            :rows-per-page-options="[5, 10, 25]"
            responsive-layout="scroll"
            v-can="'child list'"
          >
            <template #header>
              <div class="flex w-full justify-between align-items-center">
                <h5 class="m-0 my-auto">{{ $t('parents') }}</h5>
                <div>
                  <span class="block mt-2 md:mt-0 p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText v-model="filters['global'].value" :placeholder='$t("search")' />
                  </span>
                </div>
              </div>
            </template>

            <Column selection-mode="multiple" header-style="width: 3rem"></Column>

            <Column field="phone" :header='$t("index")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
              <template #body="slotProps">
                {{ slotProps.data.id }}
              </template>
            </Column>

            <Column field="fname" :header='$t("parent.fname")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
              <template #body="slotProps">
                {{ slotProps.data.fname }}
              </template>
            </Column>
            <Column field="lname" :header='$t("parent.lname")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
              <template #body="slotProps">
                {{ slotProps.data.lname }}
              </template>
            </Column>
            <Column field="email" :header='$t("parent.email")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
              <template #body="slotProps">
                {{ slotProps.data.email }}
              </template>
            </Column>
            <Column field="phone" :header='$t("phone")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
              <template #body="slotProps">
                {{ slotProps.data.phone }}
              </template>
            </Column>

            <Column header-style="min-width:10rem;">
              <template #body="slotProps">
                <div>
                  <Button v-can="'child delete'" icon="pi pi-trash" class="delete mt-2" @click="confirmDelete(slotProps.data.id)" />
                </div>
              </template>
            </Column>
          </DataTable>
          <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
            <div class="flex align-items-center justify-content-center">
              <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
              <span v-if="user">
                {{ $t('remove_item') }} <b>{{ user.first_name }}</b
                >?
              </span>
            </div>
            <template #footer>
              <Button :label='$t("no")' icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
              <Button :label='$t("yes")' icon="pi pi-check" class="p-button-text" @click="deleteAction" />
            </template>
          </Dialog>
        </div>
      </va-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
}

.export {
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
}

.delete {
  background-color: #f44336;
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #d32f2f;
  }
  }

  .p-button-text {
    color: #2196f3;
    background-color: transparent;
    border: none;
    transition: color 0.3s ease;

    &:hover {
      color: #1976d2;
    }
  }

  .shadow-md {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .shadow-xl {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }

  .flex {
    display: flex;
    align-items: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .align-items-center {
    align-items: center;
  }

  .m-0 {
    margin: 0;
  }

  .my-auto {
    margin-top: auto;
    margin-bottom: auto;
  }

  .mt-2 {
    margin-top: 0.5rem;
  }

  .md\:mt-0 {
    @media (min-width: 768px) {
      margin-top: 0;
    }
  }

  .p-input-icon-left {
    position: relative;

    i {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: #6c757d;
    }

    input {
      padding-left: 30px;
    }
  }
</style>