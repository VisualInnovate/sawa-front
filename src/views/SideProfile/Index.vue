<script>
import axios from 'axios'
import { th } from "vuetify/locale";
import Sideprofiletap from '../../components/Sideprofiletap.vue'

export default {
  components: { Sideprofiletap },

  data() {
    return {
      search: '',
      headers: [],
      sideProfile: [],
      alert_text: null,
      loading: true,
      groupBy: [{ key: 'side_profile_title' }],
      active: false,
      expandedRows: []
    }
  },
  methods: {
    getSideProfile() {
      axios.get("/api/side-profile-types").then(res => {
        this.sideProfile = res.data.data
        this.sideProfile.length = 5
        console.log(this.sideProfile)
        this.loading = false
      })
    },
    editItem(id) {
      this.$router.push({ name: 'EditSideProfiles', params: { id: id } })
    },
    deleteItem(id) {
      console.log(id)
      axios.delete(`/api/side-profiles/${id}/delete`).then(res => {
        if (res.data.status == 200) {
          this.alert_text = "Side profile deleted successfully"
          this.sideProfile = res.data.sideProfile
        }
      })
    },
    create() {
      this.$router.push({ name: 'CreateSideProfiles' })
    },
    showItem(id) {
      this.$router.push({ name: 'ShowSideProfiles', params: { id: id } })
    },
    onClickOutside() {
      this.active = false
    },
    editEvaluation(id) {
      this.$router.push({ name: 'EditEvaluations', params: { id: id } })
    },
    deleteEvaluation(id) {
      this.$confirm.require({
        message: 'Are you sure you want to delete this evaluation?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          axios.delete(`/api/evaluations/${id}/delete`).then(res => {
            if (res.data.status == 200) {
              this.$toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Evaluation deleted successfully',
                life: 3000
              });
              this.getSideProfile()
            }
          })
        },
        reject: () => {
          this.$toast.add({
            severity: 'info',
            summary: 'Cancelled',
            detail: 'Delete operation cancelled',
            life: 3000
          });
        }
      });
    },
    createEvaluation(side_profile_id) {
      this.$router.push({ name: 'CreateEvaluations', params: { sideProfile_id: side_profile_id } })
    },
    showEvaluation(id) {
      this.$router.push({ name: 'ShowEvaluations', params: { id: id } })
    },
    onRowExpand(event) {
      this.$toast.add({
        severity: 'info',
        summary: 'Profile Expanded',
        detail: `Showing evaluations for ${event.data.side_profile_title}`,
        life: 3000
      });
    },
    onRowCollapse(event) {
      this.$toast.add({
        severity: 'info',
        summary: 'Profile Collapsed',
        detail: `Hiding evaluations for ${event.data.side_profile_title}`,
        life: 3000
      });
    },
    toggleRow(data) {
      if (this.expandedRows.includes(data)) {
        this.expandedRows = this.expandedRows.filter(p => p.id !== data.id);
      } else {
        this.expandedRows.push(data);
      }
    }
  },
  mounted() {
    this.getSideProfile()
  },
  computed: {
    header() {
      return [
        { field: 'evaluation_title', header: this.$t('evaluation_title') },
        { header: this.$t('operation'), sortable: false }
      ];
    },
  }
}
</script>

<template>
  <div class="card">
    <Toast />
    <ConfirmDialog></ConfirmDialog>

    <div class="relative ">
      <Sideprofiletap></Sideprofiletap>
    </div>

    <div class="card p-fluid">
    <DataTable 
  :value="sideProfile"
  :loading="loading"
  sortMode="multiple"
  removableSort
  :rows="5"
  currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
  filterDisplay="menu"
  :globalFilterFields="['title', 'evaluations.evaluation_title']"
  stripedRows
  showGridlines
  responsiveLayout="scroll"
>
  <template #header>
    <div>
      <span class="text-xl text-900 font-bold w-[20%] m-auto">Side Profiles</span>
    </div>
  </template>

  <Column field="title" header="Profile Title" sortable>
    <template #body="{ data }">
      <span class="font-semibold">{{ data.title }}</span>
    </template>
  </Column>

  <Column header="Actions" :exportable="false" style="min-width: 10rem">
    <template #body="{ data }">
      <div class="flex gap-2">
        <Button 
          icon="pi pi-eye" 
          class="p-button-rounded p-button-info p-button-text"
          @click="showEvaluation(data.id)" 
          v-tooltip.top="'View Details'" 
        />
        <Button 
          icon="pi pi-pencil" 
          class="p-button-rounded p-button-warning p-button-text"
          @click="editEvaluation(data.id)" 
          v-tooltip.top="'Edit Evaluation'" 
        />
      </div>
    </template>
  </Column>

  <template #empty>
    <div class="text-center py-5">
      <i class="pi pi-database text-5xl text-400 mb-3" />
      <p class="text-900 font-semibold text-xl">No records found</p>
      <p class="text-600">Create a new side profile to get started</p>
    </div>
  </template>

  <template #loading>
    <div class="flex items-center justify-center p-5">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
    </div>
  </template>
</DataTable>

    </div>
  </div>
</template>

<style scoped>
:deep(.p-datatable) {
  font-family: 'Inter', sans-serif;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 400;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  transition: background-color 0.2s;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #f8f9fa !important;
}

:deep(.p-button.p-button-text) {
  background-color: transparent;
  border-color: transparent;
}

:deep(.p-button.p-button-text:hover) {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>