<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import {FilterMatchMode} from '@primevue/core/api'
import {ref, onMounted, onBeforeMount} from 'vue'
// import ProductService from '@/service/ProductService';
import {useToast} from 'primevue/usetoast'
import axios from "axios";
import {useRouter} from "vue-router";
const toast = useToast()
const router = useRouter()
const scrollableTabs = ref(Array.from({ length: 3 }, (_, i) => ({ title: `Tab ${i + 1}`, content: `Tab ${i + 1} Content` })));

const loading = ref(true)
const user = ref({})
const error = ref('')
const users = ref(null)
const productDialog = ref(false)
const deleteDialog = ref(false)
const confir_id=ref('')
const selectedProducts = ref(null)
const dt = ref(null)
const filters = ref({})
const move=ref(false)

 const isStartActive = ref(false);
    const isMidActive = ref(false);
    const isEndActive = ref(false);

    const activateStart = () => {
      isStartActive.value = true;
      isMidActive.value = false;
      isEndActive.value = false;
    };

    const activateMid = () => {
      isMidActive.value = true;
      isEndActive.value = false;
    };

    const activateEnd = () => {
      isEndActive.value = true;
      isMidActive.value = true;
      isStartActive.value = true;
    };
const moveing=()=>{
  move.value=!(move.value)
}
onBeforeMount(() => {
  initFilters()
})

 const fetchData= ()=>{


  axios.get("/api/student-transportation").then((res)=>{
    loading.value= false
    users.value= res.data.data
    console.log(users.value)

  });


}



onMounted(() => {
  // productService.getProducts().then((data) => (products.value = data));
fetchData()

})
const edit=(id)=>{
  router.push({name:'student-transportation-update',params:{'id':id} })
}


const openNew = () => {
  router.push({name:'student-transportation-create'})
}

const confirmDelete = (id) => {
  console.log(id)
  deleteDialog.value = true
  confir_id.value=id
 

}

const deleteAction = () => {
  axios
    .delete(`/api/student-transportation/${confir_id.value}`)
    .then((res) => {
      console.log(res.data)
      deleteDialog.value=false
      fetchData()
      toast.add({severity: 'success', summary: t('success_message'), detail: t('successful'), life: 3000})
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
      <div class="page">
        <Toolbar>
          <template #start>
            <div class="my-2">
            <Button v-can="'student transportation create'" :label='$t("create_button")' icon="pi pi-plus" class="mr-2" @click="openNew"></Button>
<!--              <Button-->
<!--                label="Delete"-->
<!--                icon="pi pi-trash"-->
<!--                class="p-button-danger"-->
<!--                :disabled="!selectedProducts || !selectedProducts.length"-->
<!--                @click="confirmDeleteSelected"-->
<!--              />-->
            </div>
          </template>

          <template #end>
<!--            <FileUpload-->
<!--              mode="basic"-->
<!--              accept="image/*"-->
<!--              :max-file-size="1000000"-->
<!--              label="Import"-->
<!--              choose-label="Import"-->
<!--              class="mr-2 inline-block"-->
<!--            />-->
            <Button  v-can="'student transportation list'" :label='$t("export")' icon="pi pi-upload" @click="exportCSV($event)" severity="secondary" variant="outlined" />
          </template>
        </Toolbar>

        <Toast/>


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
          :current-page-report-template="`${$t('Showing')} {first} ${$t('to')} {last} ${$t('of')} {totalRecords} ${$t('products')}`"
          responsive-layout="scroll"
          v-can="'student transportation list'"
        >
          <template #header>
            <div class="flex w-full  justify-between align-items-center">
              <h5 class="page-title">{{ $t("student_tans") }}</h5>
             <div>
              <IconField class="table-search mt-2 md:mt-0">
                <InputIcon class="pi pi-search" />
                <InputText v-model="filters['global'].value" :placeholder='$t("search")'/>
              </IconField>
              </div>
            </div>
          </template>

          <Column selection-mode="multiple" header-style="width: 3rem"></Column>
         

        
         
          
           <Column field="plate_number" :header='$t("area_name")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.region.name }}
            </template>
           </Column>
           <Column field="plate_number" :header='$t("student_location")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
             <a style="color: blue; " target="_blank" :href="slotProps.data.location_url" >{{ (slotProps.data.location_url).substring(0, 20) }}</a>
            </template>
           </Column>
           
          
           <Column field="license_exp_date" :header='$t("trip_type")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              <p v-if="slotProps.data.trip_type == 0">{{ $t("one_way")}} </p>
              <p v-if="slotProps.data.trip_type == 1"> {{ $t("tow_way")}}  </p>
           
            </template>
           </Column>
          

           <Column field="type" :header='$t("vecile_type")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ $t(['vehicle_type.car', 'vehicle_type.bus', 'vehicle_type.minibus'][slotProps.data.type] ?? 'vehicle_type.unknown') }}
         
           
            </template>
           </Column> 
       
          

        
          <Column header-style="min-width:10rem;">
            <template #body="slotProps">
              <div class="table-actions">

                <Button
                v-can="'student transportation edit'"
                icon="pi pi-car"
                @click="moveing(slotProps.data.id)" rounded severity="success" variant="outlined" v-tooltip.top="$t('trip_status')" :aria-label="$t('trip_status')" />
                <Button
                v-can="'student transportation edit'"
                icon="pi pi-pencil"
                @click="edit(slotProps.data.id)" rounded severity="info" variant="outlined" v-tooltip.top="$t('edit')" :aria-label="$t('edit')" />
                <Button
                v-can="'student transportation delete'"
                icon="pi pi-trash"
                @click="confirmDelete(slotProps.data.id)" severity="danger" rounded variant="outlined" v-tooltip.top="$t('delete')" :aria-label="$t('delete')" />
              </div>
            </template>
          </Column>



        </DataTable>

        <Dialog v-model:visible="move" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
          <div class="line-container m-auto w-full">
          <Button :label="$t('trip_start')" class="mr-2" :class="['dot', { active: isStartActive }]" @click="activateStart" rounded severity="success"></Button>
         
          <div :class="['line', { endActive: isEndActive }]"></div>
          <Button :label="$t('trip_end')" class="mr-2" :class="['dot', { active: isEndActive }]" @click="activateEnd" rounded severity="success"></Button>
        </div>
         
        </Dialog>

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
      </div>
      </div>
    </div>
  </div>
</template>

<style>
.line-container {
  display: flex;
  margin: auto;
  align-items: center;
  gap: 10px;
}

.dot {

  background-color: gray;
  cursor: pointer;
}

.dot.active {
  background-color: #135C65 ;
}

.line {
  width: 50px;
  height: 4px;
  background-color: gray;
  transition: background-color 0.3s ease;
}

.line.midActive {
  background-color: rgb(255, 77, 77) 
}

.line.endActive {
  background-color: rgb(255, 77, 77) 
}
</style>