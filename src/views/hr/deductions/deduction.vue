<script setup>
import {FilterMatchMode} from '@primevue/core/api'
import {ref, onMounted, onBeforeMount} from 'vue'
import Deduction from '../../../components/hr/Deduction.vue'
import moment from "moment";
import PayrollItemStatus from '@/components/hr/PayrollItemStatus.vue'
import {useToast} from 'primevue/usetoast'
import axios from "axios";
import {useRouter} from "vue-router";
import { useI18n } from 'vue-i18n'
const toast = useToast()
const { t } = useI18n()
const router = useRouter()
const deduction_types=ref([])
// Deduction type categories with their types: the form picks the category, then one of its types.
const categories=ref([])
const typesOf=(categoryId)=>categories.value.find((category)=>category.id===categoryId)?.types ?? []
const categoryOfType=(typeId)=>deduction_types.value.find((type)=>type.id===typeId)?.category_id ?? null
const categoryTitle=(typeId)=>categories.value.find((category)=>category.id===categoryOfType(typeId))?.title ?? ''
const pickCategory=(categoryId)=>{
  deduction.value.category_id=categoryId
  if (!typesOf(categoryId).some((type)=>type.id===deduction.value.deduction_type_id)) deduction.value.deduction_type_id=null
}
const loading = ref(true)
const user = ref({})
const error = ref('')
const employees=ref([])
const deductions = ref(null)
const productDialog = ref(false)
const deleteDialog = ref(false)
const confir_id=ref('')
const selectedProducts = ref(null)
const dt = ref(null)
const filters = ref({})
const createdialog=ref(false)
const deduction=ref({})
const updatedialog=ref(false)
const  status=ref([
        { name: t("Pending"), code: 0 },
        { name: t("Accept"), code: 1 },
        { name: t("Cancell"), code: -1 },
      
      ])
onBeforeMount(() => {
  initFilters()
})

 const fetchData= ()=>{


  axios.get("/api/deduction-types").then((res)=>{
    loading.value= false
    deduction_types.value= res.data.data


  });

  axios.get("/api/deduction-categories").then((res)=>{
    categories.value= (res.data.data ?? []).map((category)=>({ ...category, types: category.types ?? [] }))
  });
  
  axios.get("/api/deductions").then((res)=>{
    loading.value= false
    deductions.value= res.data.data
   

  });
  
  axios.get("/api/employees").then((res)=>{
    
    employees.value= res.data.data
   

  });


}



onMounted(() => {
  // productService.getProducts().then((data) => (products.value = data));
fetchData()

})
const edit=(id)=>{
    axios.get(`/api/deductions/${id}`).then((res)=>{
    loading.value= false
    deduction.value= { ...res.data.data, category_id: categoryOfType(res.data.data.deduction_type_id) }


  });
    confir_id.value=id
    updatedialog.value=!(updatedialog.value)
}


///// update

const edite=()=>{
    axios
    .put(`/api/deductions/${confir_id.value}`,deduction.value)
    .then((res) => {
      console.log(res.data)
      fetchData()
      updatedialog.value=!(updatedialog.value)
      toast.add({severity: 'success', summary: t('success_message'), detail: t('successful'), life: 3000})
      deduction.value = ref({})
    })
    .catch((el)=>{
      error.value = el.response?.data?.errors
      // A salary not set (or a deduction already paid) comes back as a message, not as field errors.
      if (!error.value) toast.add({severity: 'error', summary: t('error'), detail: el.response?.data?.message || t('mission_error'), life: 5000})
    })
}

const openNew = () => {
    createdialog.value=!(createdialog.value)
    deduction.value={}
}

const confirmDelete = (id) => {
  console.log(id)
  deleteDialog.value = true
  confir_id.value=id
 

}
const updateStatus=(id,status)=>{
  
  loading.value=true
 
  axios.get(`/api/deductions/change-status/${id}?status=${status}`).then(()=>{
      loading.value=false
      fetchData()
    }).catch((e)=>{
      loading.value=false
      toast.add({severity: 'error', summary: t('error'), detail: e.response?.data?.message || t('mission_error'), life: 4000})
      fetchData()
    });

}
const createskill=()=>{
  deduction.value.date = moment(deduction.value.date).format("YYYY-MM-DD" );
    axios
    .post('/api/deductions',deduction.value)
    .then((res) => {
      console.log(res.data)
      fetchData()
      createdialog.value=!(createdialog.value)
      toast.add({severity: 'success', summary: t('success_message'), detail: t('successful'), life: 3000})
      deduction.value = ref({})
    })
    .catch((el)=>{
      error.value = el.response?.data?.errors
      // A salary not set (or a deduction already paid) comes back as a message, not as field errors.
      if (!error.value) toast.add({severity: 'error', summary: t('error'), detail: el.response?.data?.message || t('mission_error'), life: 5000})
    })
}
const deleting = ref(false)
const deleteAction = () => {
  if (deleting.value) return
  deleting.value = true
  axios
    .delete(`/api/deductions/${confir_id.value}`)
    .then(() => {
      deleteDialog.value=false
      fetchData()
      toast.add({severity: 'success', summary: t('success_message'), detail: t('element_delet_success'), life: 3000})
    })
    .catch((error) => {
      const status = error.response?.status
      const detail = status === 403 ? t('no_permission_action') : status === 404 ? t('deduction_already_deleted') : t('mission_error')
      toast.add({severity: 'error', summary: t('error'), detail, life: 5000})
      if (status === 404) { deleteDialog.value=false; fetchData() }
    })
    .finally(() => { deleting.value = false })
}


const exportCSV = () => {
  dt.value.exportCSV()
}


// «قواعد الخصومات والعقوبات»: HR records a violation on an employee; the row waits here to be confirmed like any other.
const rules = ref([])
const violation = ref(null) // { employee_id, rule_id, date, measure, reason }
const violationPreview = ref(null)
const recording = ref(false)
const loadRules = () => axios.get('/api/penalty-rules').then((res) => { rules.value = (res.data.data ?? []).filter((rule) => rule.active && rule.steps.length) }).catch(() => {})
onMounted(loadRules)
const ruleOf = (id) => rules.value.find((rule) => rule.id === id)
// A rule with a step priced by the violation's own time asks for the hours; an absence for its days.
const measureKind = (rule) => !rule ? null : rule.trigger === 'absence' ? 'days' : rule.steps.some((step) => step.method === 'actual_hours') ? 'hours' : null
const openViolation = () => {
  violationPreview.value = null
  violation.value = { employee_id: null, rule_id: null, date: new Date(), measure: null, reason: '' }
}
const violationBody = () => ({ employee_id: violation.value.employee_id, date: moment(violation.value.date).format('YYYY-MM-DD'),
  measure: measureKind(ruleOf(violation.value.rule_id)) ? violation.value.measure ?? (ruleOf(violation.value.rule_id).trigger === 'absence' ? 1 : 0) : null,
  reason: violation.value.reason?.trim() || null })
// What the employee would get today (the confirmed ones of the rule's period decide the step).
const previewViolation = () => {
  violationPreview.value = null
  const v = violation.value
  if (!v?.employee_id || !v.rule_id || !v.date) return
  const { reason, ...params } = violationBody()
  axios.get(`/api/penalty-rules/${v.rule_id}/preview`, { params }).then((res) => { violationPreview.value = res.data.data }).catch(() => {})
}
const recordViolation = () => {
  if (recording.value) return
  recording.value = true
  axios.post(`/api/penalty-rules/${violation.value.rule_id}/record`, violationBody()).then(() => {
    violation.value = null
    fetchData()
    toast.add({severity: 'success', summary: t('success_message'), detail: t('pen.recorded'), life: 3000})
  }).catch((e) => {
    toast.add({severity: 'error', summary: t('error'), detail: Object.values(e.response?.data?.errors ?? {})[0]?.[0] ?? e.response?.data?.message ?? t('mission_error'), life: 5000})
  }).finally(() => { recording.value = false })
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
      <div class="page">
        <div class="relative">
          <Deduction ></Deduction>
          <Button  v-can="'deduction create'" :label='$t("deduction_add")' icon="pi pi-plus" class="mr-2 absolute top-3" @click="openNew"></Button>
          <Button v-can="'deduction list'" :label='$t("export")' icon="pi pi-upload" class="absolute top-3 ltr:left-[15%] rtl:right-[15%]" @click="exportCSV($event)" severity="secondary" variant="outlined" />
          <Button v-if="$can('deduction create') && rules.length" :label="$t('pen.record')" icon="pi pi-exclamation-triangle" severity="warn" variant="outlined"
            class="absolute top-3 ltr:left-[27%] rtl:right-[27%]" @click="openViolation" />

        </div>
        
        
     

        <Toast/>


      <div>
        <DataTable
          ref="dt"
          v-model:selection="selectedProducts"
          :value="deductions"
          :loading="loading"
          data-key="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rows-per-page-options="[5, 10, 25]"
          :current-page-report-template="`${$t('Showing')} {first} ${$t('to')} {last} ${$t('of')} {totalRecords} ${$t('records')}`"
          responsive-layout="scroll"
          v-can="'deduction list'"
        >
          <template #header>
            <div class="flex w-full  justify-between align-items-center">
              <h5 class="page-title">{{ $t("deductions") }}</h5>
             <div>
              <IconField class="table-search mt-2 md:mt-0">
                <InputIcon class="pi pi-search" />
                <InputText v-model="filters['global'].value" :placeholder='$t("search")'/>
              </IconField>
              </div>
            </div>
          </template>

          <Column selection-mode="multiple" header-style="width: 3rem"></Column>
         

        
         
           <Column field="employee.name" :header='$t("employee_name")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.employee.name }}
            </template>
           </Column>
           <Column field="deduction_type.title" :header='$t("deduction_type")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              <small v-if="categoryTitle(slotProps.data.deduction_type_id)" class="block text-gray-500">{{ categoryTitle(slotProps.data.deduction_type_id) }}</small>
              {{ slotProps.data.deduction_type?.title }}
            </template>
           </Column>
           <!-- «قواعد الخصومات والعقوبات»: the violation and its repeat (fixed when confirmed; expected while pending). -->
           <Column field="penalty_rule.title" :header="$t('pen.col_violation')" :sortable="true" header-style="min-width:11rem;" class="ltr:text-justify">
            <template #body="slotProps">
              <template v-if="slotProps.data.penalty_rule_id">
                <b>{{ slotProps.data.penalty_rule?.title || $t('pen.rule_deleted') }}</b>
                <small class="block text-gray-500">{{ $t(slotProps.data.status == 1 ? 'pen.repeat_fixed' : 'pen.repeat_expected', { n: slotProps.data.penalty_step }) }}</small>
              </template>
              <span v-else class="text-gray-400">—</span>
            </template>
           </Column>
           <Column field="amount" :header='$t("deduction_mount")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              <Tag v-if="slotProps.data.kind === 'action'" severity="warn" icon="pi pi-megaphone" :value="slotProps.data.action_text || $t('pen.kind_action')" class="pen-action-tag" />
              <template v-else>
                {{ slotProps.data.amount }}
                <small v-if="slotProps.data.penalty_rule_id && slotProps.data.amount === null && slotProps.data.notes" class="block text-orange-600">{{ $t('pen.no_salary') }}</small>
              </template>
            </template>
           </Column>
          
           <Column field="status" :header='$t("status")' :sortable="true" header-style="width:14%; min-width:12rem;" class="ltr:text-justify">
            <template #body="slotProps">
                <PayrollItemStatus :item="slotProps.data" :can-edit="$can('deduction edit')" @change="updateStatus(slotProps.data.id,$event)" />

               
            </template>
           </Column>

        
          <Column header-style="min-width:10rem;">
            <template #body="slotProps">
              <div class="table-actions">
                <Button
                v-if="!slotProps.data.payroll_id && !slotProps.data.penalty_rule_id" v-can="'deduction edit'"
                icon="pi pi-pencil"
                @click="edit(slotProps.data.id)" rounded severity="info" variant="outlined" v-tooltip.top="$t('edit')" :aria-label="$t('edit')" />
                <Button
                v-if="!slotProps.data.payroll_id" v-can="'deduction delete'"
                icon="pi pi-trash"
                @click="confirmDelete(slotProps.data.id)" severity="danger" rounded variant="outlined" v-tooltip.top="$t('delete')" :aria-label="$t('delete')" />
              </div>
            </template>
          </Column>



        </DataTable>
        <Dialog :visible="!!violation" modal :header="$t('pen.record')" :style="{ width: '32rem' }" :breakpoints="{ '640px': '96vw' }" @update:visible="(v) => { if (!v) violation = null }">
          <form v-if="violation" class="flex flex-column gap-3" @submit.prevent="recordViolation">
            <div class="flex flex-column gap-2">
              <label>{{ $t('employee_name') }}</label>
              <Select v-model="violation.employee_id" :options="employees" optionLabel="name" optionValue="id" filter required :placeholder="$t('employee_name')" @change="previewViolation" />
            </div>
            <div class="flex flex-column gap-2">
              <label>{{ $t('pen.col_violation') }}</label>
              <Select v-model="violation.rule_id" :options="rules" optionLabel="title" optionValue="id" filter required :placeholder="$t('pen.pick_rule')" @change="previewViolation" />
            </div>
            <div class="flex flex-column gap-2">
              <label>{{ $t('pen.violation_date') }}</label>
              <DatePicker v-model="violation.date" showIcon dateFormat="yy-mm-dd" required @update:modelValue="previewViolation" />
            </div>
            <div v-if="measureKind(ruleOf(violation.rule_id))" class="flex flex-column gap-2">
              <label>{{ $t(measureKind(ruleOf(violation.rule_id)) === 'days' ? 'pen.measure_days' : 'pen.measure_hours') }}</label>
              <InputNumber v-model="violation.measure" :min="0" :maxFractionDigits="2" fluid @update:modelValue="previewViolation" />
            </div>
            <div class="flex flex-column gap-2">
              <label>{{ $t('notes') }}</label>
              <InputText v-model="violation.reason" maxlength="255" />
            </div>
            <Message v-if="violationPreview" :severity="violationPreview.kind === 'action' ? 'warn' : 'info'" :closable="false">
              <b>{{ $t('pen.preview_repeat', { n: violationPreview.repeat, confirmed: violationPreview.confirmed }) }}</b>
              <span class="block mt-1">
                {{ violationPreview.kind === 'action' ? $t('pen.preview_action', { text: violationPreview.action_text })
                  : violationPreview.amount === null ? $t('pen.no_salary') : $t('pen.preview_amount', { amount: violationPreview.amount }) }}
              </span>
              <small class="block mt-1">{{ $t('pen.preview_note') }}</small>
            </Message>
            <div class="flex justify-content-end gap-2">
              <Button type="button" :label="$t('cancel')" variant="text" severity="secondary" @click="violation = null" />
              <Button type="submit" :label="$t('pen.record')" icon="pi pi-check" :loading="recording" :disabled="!violation.employee_id || !violation.rule_id" />
            </div>
          </form>
        </Dialog>
        <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span>{{ $t('remove_item') }}?</span>
          </div>
          <template #footer>
            <Button  :label='$t("no")' icon="pi pi-times" @click="deleteDialog = false" variant="text" severity="secondary" />
            <Button  :label='$t("yes")' icon="pi pi-check" :loading="deleting" @click="deleteAction" severity="danger" />
          </template>
        </Dialog>
        <Dialog v-model:visible="createdialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
           
              <div class="flex flex-column gap-2">
                  <label  style="text-align: right !important;" for="username">{{ $t('employee_name') }}</label>
                  <Select required  v-model="deduction.employee_id"  option-value="id" filter :options="employees" optionLabel="name" :placeholder='$t("employee_name")' class="w-full" />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.employee_id">{{ error.employee_id[0] }}</div>
              </div> 
              <div class="flex flex-column gap-2">
                  <label style="text-align: right !important;">{{ $t('deduction_category') }}</label>
                  <Select :modelValue="deduction.category_id" @update:modelValue="pickCategory" option-value="id" filter :options="categories" optionLabel="title" :placeholder='$t("deduction_category")' class="w-full" />
              </div>
              <div class="flex flex-column gap-2">
                  <label style="text-align: right !important;" for="username">{{ $t('deduction_type') }}</label>
                  <Select required  v-model="deduction.deduction_type_id" :disabled="!deduction.category_id" option-value="id" filter :options="typesOf(deduction.category_id)" optionLabel="title" :placeholder='deduction.category_id ? $t("deduction_type") : $t("deduction_pick_category_first")' class="w-full" />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.deduction_type_id">{{ error.deduction_type_id[0] }}</div>
              </div> 
              <div class="flex flex-column gap-2">
                   <label style="text-align: right !important;" class="w-full " for="username">{{ $t('deduction_mount') }}</label>
                <InputNumber required class="text-center" v-model="deduction.value" :placeholder='$t("deduction_mount")' />
                  <div class="mt-1 mb-5 text-red-500" v-if="error?.value">{{ error.value[0] }}</div>
              </div>
              <div class="flex flex-column gap-2">
                   <label style="text-align: right !important;" for="username">{{ $t('deduction_date') }}</label>
                   <DatePicker  style="width: 100%" showButtonBar v-model.number="deduction.date" showIcon  :placeholder='$t("deduction_date")'   />   
                   <div class="mt-1 mb-5 text-red-500" v-if="error?.date">{{ error.date[0] }}</div>
               </div> 
              <div class="flex flex-column gap-2">
                   <label style="text-align: right !important;" class="w-full " for="username">{{ $t('deduction_reason') }}</label>
                <InputText required class="text-center" v-model="deduction.reason" :placeholder='$t("deduction_reason")' />
                  <div class="mt-1 mb-5 text-red-500" v-if="error?.reason">{{ error.reason[0] }}</div>
              </div>
           <div class="w-full text-center">
            <Button @click="createskill" class="m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>
        </Dialog>
        <Dialog v-model:visible="updatedialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
          <div class="flex flex-column gap-2">
                  <label  style="text-align: right !important;" for="username">{{ $t('employee_name') }}</label>
                  <Select required  v-model="deduction.employee_id"  option-value="id" filter :options="employees" optionLabel="name" :placeholder='$t("employee_name")' class="w-full" />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.employee_id">{{ error.employee_id[0] }}</div>
              </div> 
              <div class="flex flex-column gap-2">
                  <label style="text-align: right !important;">{{ $t('deduction_category') }}</label>
                  <Select :modelValue="deduction.category_id" @update:modelValue="pickCategory" option-value="id" filter :options="categories" optionLabel="title" :placeholder='$t("deduction_category")' class="w-full" />
              </div>
              <div class="flex flex-column gap-2">
                  <label style="text-align: right !important;" for="username">{{ $t('deduction_type') }}</label>
                  <Select required  v-model="deduction.deduction_type_id" :disabled="!deduction.category_id" option-value="id" filter :options="typesOf(deduction.category_id)" optionLabel="title" :placeholder='deduction.category_id ? $t("deduction_type") : $t("deduction_pick_category_first")' class="w-full" />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.deduction_type_id">{{ error.deduction_type_id[0] }}</div>
              </div> 
              <div class="flex flex-column gap-2">
                   <label style="text-align: right !important;" class="w-full " for="username">{{ $t('deduction_mount') }}</label>
                <InputNumber required class="text-center" v-model="deduction.value" :placeholder='$t("deduction_mount")' />
                  <div class="mt-1 mb-5 text-red-500" v-if="error?.value">{{ error.value[0] }}</div>
              </div>
              <div class="flex flex-column gap-2">
                   <label style="text-align: right !important;" for="username">{{ $t('deduction_date') }}</label>
                   <DatePicker  style="width: 100%" showButtonBar v-model.number="deduction.date" showIcon  :placeholder='$t("deduction_date")'   />   
                   <div class="mt-1 mb-5 text-red-500" v-if="error?.date">{{ error.date[0] }}</div>
               </div> 
              <div class="flex flex-column gap-2">
                   <label style="text-align: right !important;" class="w-full " for="username">{{ $t('deduction_reason') }}</label>
                <InputText required class="text-center" v-model="deduction.reason" :placeholder='$t("deduction_reason")' />
                  <div class="mt-1 mb-5 text-red-500" v-if="error?.reason">{{ error.reason[0] }}</div>
              </div>
           <div class="w-full text-center">
            <Button @click="edite" class="m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>
        </Dialog>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>