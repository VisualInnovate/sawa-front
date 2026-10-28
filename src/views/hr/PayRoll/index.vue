<script setup>
import {FilterMatchMode} from '@primevue/core/api'
import {ref, onMounted, onBeforeMount} from 'vue'
import moment from "moment";

import {useToast} from 'primevue/usetoast'
import axios from "axios";
import {useRouter} from "vue-router";
import { useI18n } from 'vue-i18n';
import PayrollMonths from '@/components/hr/PayrollMonths.vue';
import { printPayslip } from '@/components/hr/payslip';
const toast = useToast()
const router = useRouter()
const { t, locale } = useI18n();
const monthsPanel = ref(null)
// A month card picks that month in the filter.
const pickMonth = (month) => {
  fetchFilter.value.month = moment(month, 'YYYY-MM').toDate()
  fetchData()
}
const slip = (id) => printPayslip(t, id, locale.value).catch(() => toast.add({ severity: 'error', summary: t('error'), detail: t('mission_error'), life: 4000 }))
const allemployee=ref([])
const loading = ref(true)
const fetchFilter=ref({
  base_salary:'',
  month: null,
})
const user = ref({})
const error = ref('')
const users = ref(null)
const productDialog = ref(false)
const deleteDialog = ref(false)
const confir_id=ref('')
const selectedProducts = ref(null)
const dt = ref(null)
const filters = ref({})
const createdialog=ref(false)
const payroll=ref({})
const updatedialog=ref(false)
const selectedMonths=ref('')
onBeforeMount(() => {
  initFilters()
})

// "2026-10" from a DatePicker month, "" when empty.
const monthOf = (d) => (d ? moment(d).format("YYYY-MM") : "")

 const fetchData= ()=>{


  const params = { base_salary: fetchFilter.value?.base_salary || undefined, month: monthOf(fetchFilter.value?.month) || undefined }
  axios.get('/api/payroll', { params }).then((res)=>{
    loading.value= false
    users.value= res.data.data
  });
  monthsPanel.value?.load()
  axios.get("/api/employees").then((res)=>{
   
    allemployee.value= res.data.data
    

  });


}



onMounted(() => {
  // productService.getProducts().then((data) => (products.value = data));
fetchData()

})
const edit=(id)=>{
    axios.get(`/api/payroll/${id}`).then((res)=>{
    loading.value= false
    payroll.value= res.data.data


  });
    confir_id.value=id
    updatedialog.value=!(updatedialog.value)
}


///// update

const update=()=>{
    axios
    .post(`/api/payroll/${confir_id.value}`,payroll.value)
    .then((res) => {
      console.log(res.data)
      fetchData()
      updatedialog.value=!(updatedialog.value)
      toast.add({severity: 'success', summary: t('success_message'), detail: t('successful'), life: 3000})
      payroll.value = ref({})
    })
    .catch((el)=>{
      error.value = el.response.data.errors
    })
}

const openNew = () => {
    createdialog.value=!(createdialog.value)
    error.value = ''
    // The month that just ended is the usual one to pay.
    payroll.value={ month: moment().subtract(1, 'month').startOf('month').toDate() }
}

const confirmDelete = (id) => {
  console.log(id)
  deleteDialog.value = true
  confir_id.value=id
 

}

const create=()=>{
    error.value = ''
    axios
    .post('/api/payroll',{ ...payroll.value, month: monthOf(payroll.value.month) })
    .then((res) => {
      fetchData()
      createdialog.value=!(createdialog.value)
      toast.add({severity: 'success', summary: t('success_message'), detail: t('successful'), life: 3000})
      payroll.value = {}
    })
    .catch((el)=>{
      const data = el.response?.data
      error.value = data?.errors ?? ''
      // A salary not set or a month already paid comes back as a message ({id: name} in data), not as field errors.
      if (!data?.errors) {
        const name = Object.values(data?.data ?? {})[0]
        const message = String(data?.message ?? '')
        const detail = message === 'hr.month_closed' ? t('pmon.month_closed', { month: monthOf(payroll.value.month) })
          : name && message.includes('already has a payroll') ? t('hrpay.already_paid_month', { name, month: monthOf(payroll.value.month) })
          : name && message.includes('Salary not set') ? t('hrpay.salary_not_set', { name })
          : message || t('mission_error')
        toast.add({severity: 'error', summary: t('error'), detail, life: 5000})
      }
    })
}
const deleteAction = () => {
  axios
    .delete(`/api/payroll/${confir_id.value}`)
    .then((res) => {
      console.log(res.data)
      deleteDialog.value=false
      fetchData()
      toast.add({severity: 'success', summary: t('success_message'), detail: t('successful'), life: 3000})
    })
    .catch((el) => {
      deleteDialog.value=false
      const closed = el.response?.data?.message === 'hr.month_closed'
      toast.add({severity: 'error', summary: t('error'), detail: closed ? t('pmon.cannot_delete_closed') : t('mission_error'), life: 5000})
    })

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
  <div class="grid overflow-x-scroll">
    <div class="col-12">
      <div class="page">
        <Toolbar>
          <template #start>
            <div class="my-2">
            <Button v-can="'payroll create'" :label='$t("payroll")' icon="pi pi-plus" class="mr-2" @click="openNew"></Button>
           
            </div>
          </template>

          <template #end>
      
            <Button v-can="'payroll list'" :label='$t("export")' icon="pi pi-upload" @click="exportCSV($event)" severity="secondary" variant="outlined" />
          </template>
        </Toolbar>

        <Toast/>
        <PayrollMonths ref="monthsPanel" class="mt-3" @pick="pickMonth" />
        <Toolbar class="mb-4 shadow-md overflow-x-scroll">
          <template #start>
          <DatePicker v-model="fetchFilter.month" view="month" date-format="yy-mm" show-clear :placeholder='$t("hrpay.month")' />
          <InputNumber  required v-model="fetchFilter.base_salary" :placeholder='$t("basic_salary")' class="mx-2" />
        </template>
        <template #end>
      
          <Button v-can="'payroll list'"  icon="pi pi-search" @click="fetchData" />
        </template>
          </Toolbar>

      <div>
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
          :current-page-report-template="`${$t('Showing')} {first} ${$t('to')} {last} ${$t('of')} {totalRecords} ${$t('records')}`"
          responsive-layout="scroll"
          v-can="'payroll list'"
        >
          <template #header>
            <div class="flex w-full  justify-between align-items-center">
              <h5 class="page-title">{{ $t("payroll") }}</h5>
             <div>
              <IconField class="table-search mt-2 md:mt-0">
                <InputIcon class="pi pi-search" />
                <InputText v-model="filters['global'].value" :placeholder='$t("search")'/>
              </IconField>
              </div>
            </div>
          </template>

          <Column selection-mode="multiple" header-style="width: 3rem"></Column>
         

        
         
           <Column field="employee.name " :header='$t("employee_payroll")' :sortable="true" header-style="width:20%; min-width:12rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.employee.name }}
            </template>
           </Column>

           <!-- Payrolls made before months were kept show their creation date. -->
           <Column field="month" :header='$t("hrpay.month")' :sortable="true" header-style="min-width:7rem;">
            <template #body="slotProps">
              {{ slotProps.data.month || slotProps.data.date }}
            </template>
           </Column>

           <Column field="base_salary" :header='$t("basic_salary")' :sortable="true" header-style="min-width:8rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.base_salary }}
            </template>
           </Column>
           <Column field="overtime" :header='$t("hrpay.overtime")' :sortable="true" header-style="min-width:8rem;">
            <template #body="slotProps">
              <span class="text-green-600">+{{ slotProps.data.overtime }}</span>
            </template>
           </Column>
           <Column field="bonus" :header='$t("bonus")' :sortable="true" header-style="min-width:8rem;" class="ltr:text-justify">
            <template #body="slotProps">
              <span class="text-green-600">+{{ slotProps.data.bonus }}</span>
            </template>
           </Column>
           <Column field="deduction" :header='$t("deduction_mount")' :sortable="true" header-style="min-width:8rem;" class="ltr:text-justify">
            <template #body="slotProps">
              <span class="text-red-600">−{{ slotProps.data.deduction }}</span>
            </template>
           </Column>
           <Column field="financial_advance" :header='$t("hrpay.financial_advance")' :sortable="true" header-style="min-width:8rem;">
            <template #body="slotProps">
              <span class="text-red-600">−{{ slotProps.data.financial_advance ?? 0 }}</span>
            </template>
           </Column>
           <Column field="insurance" :header='$t("pmon.insurance_col")' :sortable="true" header-style="min-width:8rem;">
            <template #body="slotProps">
              <span v-if="Number(slotProps.data.insurance)" class="text-red-600">−{{ slotProps.data.insurance }}</span>
              <span v-else class="text-color-secondary">—</span>
            </template>
           </Column>
           <Column field="total_salary" :header='$t("total")' :sortable="true" header-style="min-width:8rem;">
            <template #body="slotProps">
              <b>{{ slotProps.data.total_salary }}</b>
            </template>
           </Column>
           


        
          <Column header-style="min-width:10rem;">
            <template #body="slotProps">
              <div class="table-actions">
                <Button
                v-if="false"
                icon="pi pi-pencil"
                @click="edit(slotProps.data.id)" rounded severity="info" variant="outlined" v-tooltip.top="$t('edit')" :aria-label="$t('edit')" />
                <Button icon="pi pi-file" @click="slip(slotProps.data.id)" rounded severity="secondary" variant="outlined" v-tooltip.top="$t('slip.print')" :aria-label="$t('slip.print')" />
                <Button
                v-can="'payroll delete'"
                icon="pi pi-trash"
                @click="confirmDelete(slotProps.data.id)" severity="danger" rounded variant="outlined" v-tooltip.top="$t('delete')" :aria-label="$t('delete')" />
              </div>
            </template>
          </Column>



        </DataTable>
        <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span v-if="user"
            >{{ $t('remove_item') }} <b>{{ user.first_name }}</b
            >?</span
            >
          </div>
          <template #footer>
            <Button  :label='$t("no")' icon="pi pi-times" @click="deleteDialog = false" variant="text" severity="secondary" />
            <Button  :label='$t("yes")' icon="pi pi-check" @click="deleteAction" severity="danger" />
          </template>
        </Dialog>
        <Dialog v-model:visible="createdialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
            <div class="flex flex-column gap-2">
                  <label class="w-full text-start" for="username">{{ $t('employee_payroll') }}</label>
                  <MultiSelect v-model="payroll.employees_ids"  required  option-value="id" filter :options="allemployee" optionLabel="name" :placeholder='$t("employee_payroll")' class="w-full" />
                  <div class="mt-1 mb-5 text-red-500" v-if="error?.employees_ids">{{ error.employees_ids[0] }}</div>
                  <label class="w-full text-start" for="payroll-month">{{ $t('hrpay.month') }}</label>
                  <DatePicker input-id="payroll-month" v-model="payroll.month" view="month" date-format="yy-mm" class="w-full" />
                  <div class="mt-1 text-red-500" v-if="error?.month">{{ error.month[0] }}</div>
                  <small class="text-muted-color">{{ $t('hrpay.month_hint') }}</small>
            </div>
           <div class="w-full text-center">
            <Button @click="create" class="m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>
        </Dialog>
        <Dialog v-model:visible="updatedialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
            <div class="flex flex-column gap-2">
                  <label class="w-full text-start" for="username">{{ $t('employee_payroll') }}</label>
                  <MultiSelect v-model="payroll.employees_ids"  required  option-value="id" filter :options="allemployee" optionLabel="name" :placeholder='$t("employee_payroll")' class="w-full" />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.employees_ids">{{ error.employees_ids[0] }}</div>
            </div>
           <div class="w-full text-center">
            <Button @click="update" class="m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>
        </Dialog>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>