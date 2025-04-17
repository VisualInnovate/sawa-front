<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();
const loading = ref(true);
const user = ref({});
const error = ref('');
const users = ref(null);
const deleteDialog = ref(false);
const selectedParents = ref(null);
const dt = ref(null);
const filters = ref({});
const exportLoading = ref(false);
const printLoading = ref(false);

onBeforeMount(() => {
  initFilters();
});

const fetchData = () => {
  loading.value = true;
  axios.get('/api/admin-parents')
    .then((res) => {
      loading.value = false;
      users.value = res.data.parents;
    })
    .catch((error) => {
      loading.value = false;
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load parents data',
        life: 3000
      });
    });
};

onMounted(() => {
  fetchData();
});

const confirmDelete = (id) => {
  deleteDialog.value = true;
  user.value.id = id;
};

const deleteAction = () => {
  axios.delete(`/api/admin-parents/delete/${user.value.id}`)
    .then(() => {
      deleteDialog.value = false;
      fetchData();
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Parent deleted successfully',
        life: 3000
      });
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete parent',
        life: 3000
      });
    });
};

const exportCSV = () => {
  exportLoading.value = true;
  dt.value.exportCSV();
  setTimeout(() => {
    exportLoading.value = false;
  }, 1000);
};

const printTable = () => {
  printLoading.value = true;
  const printContents = document.querySelector('.p-datatable-wrapper').cloneNode(true);
  const originalContents = document.body.innerHTML;
  
  // Remove action buttons from print
  const actionButtons = printContents.querySelectorAll('.p-button');
  actionButtons.forEach(button => button.remove());
  
  // Create print window
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Parents Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f5f5f5; text-align: left; padding: 8px; border: 1px solid #ddd; }
          td { padding: 8px; border: 1px solid #ddd; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          @page { size: auto; margin: 5mm; }
          @media print {
            body { margin: 0; padding: 0; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <h1>Parents Report</h1>
        ${printContents.innerHTML}
        <div style="text-align: center; margin-top: 20px; font-size: 12px;">
          Generated on ${new Date().toLocaleString()}
        </div>
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
    printLoading.value = false;
  }, 500);
};

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
};
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-4 shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">{{ $t('Parents Management') }}</h2>
          </template>

          <template #end>
            <div class="flex gap-2">
              <Button 
                :label='$t("print")' 
                icon="pi pi-print" 
                class="p-button-help no-print" 
                :loading="printLoading"
                @click="printTable"
              />
              <Button 
                v-can="'child create'" 
                :label='$t("export")' 
                icon="pi pi-download" 
                class="p-button-info no-print" 
                :loading="exportLoading"
                @click="exportCSV"
              />
            </div>
          </template>
        </Toolbar>

        <Toast />

        <div class="card shadow-1 surface-0">
          <DataTable
            ref="dt"
            v-model:selection="selectedParents"
            :value="users"
            :loading="loading"
            data-key="id"
            :paginator="true"
            :rows="10"
            :filters="filters"
            paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rows-per-page-options="[5, 10, 25, 50]"
            current-page-report-template="Showing {first} to {last} of {totalRecords} parents"
            responsive-layout="scroll"
            scrollable
            scroll-height="flex"
            v-can="'child list'"
            stripedRows
            showGridlines
            class="p-datatable-sm"
          >
            <template #header>
              <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3">
                <h3 class="m-0">{{ $t('Parents List') }}</h3>
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
                    @click="fetchData" 
                    v-tooltip.top="'Refresh data'"
                  />
                </div>
              </div>
            </template>

            <Column selection-mode="multiple" header-style="width: 3rem"></Column>

            <Column field="id" :header='$t("ID")' :sortable="true">
              <template #body="slotProps">
                <span class="font-medium">{{ slotProps.data.id }}</span>
              </template>
            </Column>

            <Column field="fname" :header='$t("First Name")' :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.fname || 'N/A' }}
              </template>
            </Column>

            <Column field="lname" :header='$t("Last Name")' :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.lname || 'N/A' }}
              </template>
            </Column>

            <Column field="email" :header='$t("Email")' :sortable="true">
              <template #body="slotProps">
                <a v-if="slotProps.data.email" :href="`mailto:${slotProps.data.email}`" class="text-primary">
                  {{ slotProps.data.email }}
                </a>
                <span v-else>N/A</span>
              </template>
            </Column>

            <Column field="phone" :header='$t("Phone")' :sortable="true">
              <template #body="slotProps">
                <span v-if="slotProps.data.phone">{{ slotProps.data.phone }}</span>
                <span v-else>N/A</span>
              </template>
            </Column>

            <Column header-style="width: 8rem; min-width: 8rem;" class="no-print">
              <template #body="slotProps">
                <Button
                  v-can="'child delete'"
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger p-button-sm"
                  @click="confirmDelete(slotProps.data.id)"
                  v-tooltip.top="'Delete'"
                />
              </template>
            </Column>

            <template #empty>
              <div class="text-center py-4">
                <i class="pi pi-exclamation-circle text-2xl mb-2" />
                <p class="text-xl">No parents found</p>
              </div>
            </template>

            <template #loading>
              <div class="flex justify-content-center align-items-center py-4">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
              </div>
            </template>
          </DataTable>
        </div>

        <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" :header='$t("Confirm Deletion")' :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--red-500)" />
            <span>
              {{ $t('Are you sure you want to delete this parent?') }}
            </span>
          </div>
          <template #footer>
            <Button :label='$t("Cancel")' icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
            <Button :label='$t("Delete")' icon="pi pi-check" class="p-button-text p-button-danger" @click="deleteAction" />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

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

.text-primary {
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.2s;
}

.text-primary:hover {
  color: #2563eb;
  text-decoration: underline;
}

@media screen and (max-width: 960px) {
  :deep(.p-datatable) {
    overflow-x: auto;
    display: block;
  }
}

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
    padding: 4px 6px;
  }
  
  a {
    text-decoration: none;
    color: inherit;
  }
}
</style>