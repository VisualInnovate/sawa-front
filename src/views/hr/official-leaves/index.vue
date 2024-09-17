
<template>
  
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <Toast/>
          <Toolbar class="mb-4">
            <template v-slot:start>
              <div class="my-2">
                <Button :label='$t("add_official_leaves")' icon="pi pi-plus" class="p-button-success mr-2"
                        @click="openNew"/>
              </div>
  
             
            </template>
  
            <template v-slot:end>
            
              <Button :label='$t("export")' icon="pi pi-upload" class="p-button-help"
                      @click="exportCSV($event)"/>
            </template>
          </Toolbar>
          <DataTable
              ref="dt"
              :loading="loading"
              :value="users"
              v-model:selection="selectedUsers"
              :paginator="true"
              :rows="10"
              :filters="filters"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              :rowsPerPageOptions="[5, 10, 25]"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
              responsiveLayout="scroll"
         
  
          >
            <template #header>
              <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                <h5 class="m-0">{{ $t("official_leaves") }}</h5>
                <span class="block mt-2 md:mt-0 p-input-icon-left">
                                  <i class="pi pi-search"/>
                                  <InputText v-model="filters['global'].value" :placeholder='$t("search")'/>
                              </span>
              </div>
            </template>
            <template #empty> No official leaves found.</template>
            <template #loading>
              <ProgressSpinner/>
            </template>
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <!--          <Column field="id" header="Id" :sortable="true" headerStyle="width:14%; min-width:10rem;">-->
            <!--            <template #body="slotProps">-->
            <!--              {{ slotProps.data.id }}-->
            <!--            </template>-->
            <!--          </Column>-->
           
            <Column field="title" :header='$t("title")' :sortable="true" headerStyle="width:14%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.title }}
              </template>
            </Column>
         
            <Column field="location" :header='$t("location")' :sortable="true" headerStyle="width:14%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.location }}
              </template>
            </Column>
            <!-- <Column field="status"  :header='$t("status")' :sortable="true" headerStyle="width:14%; min-width:10rem;">
              <template #body="slotProps">
                <p style="background-color:rgb(255, 38, 38) ;width:50%;color:white;text-align:center;padding:5px; border-radius:5px" v-if="slotProps.data.is_active ==0" >In Active</p>
                <p style="background-color:rgb(32, 131, 32) ;width:50%;color:white;text-align:center;padding:5px; border-radius:5px" v-if="slotProps.data.is_active ==1" > Active</p>
              </template>
            </Column> -->
           
            <Column field="Start Date" :header='$t("start_date")' :sortable="true" headerStyle="width:14%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.start }}
              </template>
            </Column>
            <Column field="End Date" :header='$t("end_date")' :sortable="true" headerStyle="width:14%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.end }}
              </template>
            </Column>
  
       
            <Column headerStyle="min-width:10rem;">
               <template #body="slotProps">
                <router-link :to="{ type: Object, required: true }"
                             @click.native="showUser(slotProps.data)">
  
                  <!-- <Button icon="pi pi-eye" v-can="'clock in-out user'" class="p-button-rounded p-button-info mr-2"/> -->
                </router-link>
                <Button icon="pi pi-pencil"
                        class="p-button-rounded p-button-success mr-2"
                        @click="updateleave(slotProps.data.id)"/>
                <!-- <Button v-can="'update user'" v-if="myUser == slotProps.data.user_id " icon="pi pi-plus"
                        class="p-button-rounded p-button-secondary mr-2"
                        @click="editRequest(slotProps.data)"/> -->
               
                        <Button
                          v-can="'skills delete'"
                          icon="pi pi-trash"
                          class="delete mt-2"
                          @click="confirmDeleteUser(slotProps.data.id)"
                        />
                <!-- <Button v-can="'reset user'" icon="pi pi-replay" style="margin-left: 7%;"
                        class="p-button-rounded p-button-info mt-2"
                        @click="confirmUnsetUser(slotProps.data)"/> -->
              </template> 
            </Column>
          </DataTable> 
          <Dialog v-model:visible="unsetuserDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span v-if="user"
            >{{ $t('remove_item') }} <b>{{ user.first_name }}</b
            >?</span
            >
          </div>
          <template #footer>
            <Button  :label='$t("no")' icon="pi pi-times" class="p-button-text" @click="unsetuserDialog = false"/>
            <Button  :label='$t("yes")' icon="pi pi-check" class="p-button-text" @click="deleteleave"/>
          </template>
        </Dialog>
        <Dialog v-model:visible="RequestDialog" :style="{ width: '550px' }" :header='$t("add_official_leaves")' :modal="true"
                class="p-fluid">
                <div class="flex flex-column gap-2">
                    <label class="w-full text-right" for="username">{{ $t('title') }}</label>
                    <InputText required class="bg-[#f7f5f5] text-center" v-model="leave.title" :placeholder='$t("title")' />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.title">{{ error.title[0] }}</div>
                </div>
                <div class="flex flex-column gap-2">
                    <label class="w-full text-right" for="username">{{ $t('location') }}</label>
                    <InputText required class="bg-[#f7f5f5] text-center" v-model="leave.location" :placeholder='$t("location")' />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.location">{{ error.location[0] }}</div>
                </div>
              
            
            
              <div class="flex flex-column gap-2">
                    <label class="w-full text-right" for="username ">{{ $t('start_date') }}</label>
                    <Calendar  style="width: 100%" showButtonBar v-model.number="leave.start" showIcon  :placeholder='$t("start_date")'   />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.start">{{ error.start[0] }}</div>

                </div> 
                <div class="flex flex-column gap-2">
                    <label class="w-full text-right" for="username">{{ $t('end_date') }}</label>
                    <Calendar  style="width: 100%" showButtonBar v-model.number="leave.end" showIcon  :placeholder='$t("end_date")'  />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.end">{{ error.end[0] }}</div>

                </div> 
            
              <div class="flex flex-column gap-2">
                    <label class="w-full text-right" for="username">{{ $t('Employees') }}</label>
                    <MultiSelect filter required id="pv_id_1" style="direction: ltr !important;" v-model="leave.assigners"  option-value="id" :options="assigner"  optionLabel="name" :placeholder='$t("Employees")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                      <div class="mt-1 mb-5 text-red-500" v-if="error?.assigners">{{ error.assigners[0] }}</div>
                </div>
             
              <div class="flex flex-column gap-2">
                    <label class="w-full text-right" for="username">{{ $t('lat') }}</label>
                    <InputNumber  required class="bg-[#f7f5f5]" v-model="leave.lat" :placeholder='$t("lat")' />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.lat">{{ error.lat[0] }}</div>
                </div> 
                <div class="flex flex-column gap-2">
                    <label class="w-full text-right" for="username">{{ $t('long') }}</label>
                    <InputNumber  required class="bg-[#f7f5f5]" v-model="leave.long" :placeholder='$t("long")' />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.long">{{ error.long[0] }}</div>
                </div> 
             
        
                <div class="py-3">
                    <GoogleMap api-key="AIzaSyDZnJeq94aaneiA3QWUZdWYV9uKDEjxjas" @click="handleMapClick"
                   style="width: 100%; height: 500px"
                   :center="{ lat: 		parseFloat(location.latitude), lng: parseFloat(location.longitude)} " :zoom="14">
          <Marker
              :options="{ position: { lat: parseFloat(location.latitude)		, lng: parseFloat(location.longitude) } }"/>
         
                 </GoogleMap>

                </div>
          <template #footer>
            <Button :label='$t("cancel")'  icon="pi pi-times" class="p-button-text" @click="hideDialogRequest"/>
            <Button :label='$t("save")' icon="pi pi-check" class="p-button-text" @click="saveRequest"/>
          </template>
        </Dialog>     
        
        <Dialog v-model:visible="updata" :style="{ width: '450px' }" :header='$t("add_official_leaves")' :modal="true"
                class="p-fluid">
                <div class="flex flex-column gap-2">
                    <label class="w-full text-right" for="username">{{ $t('title') }}</label>
                    <InputText required class="bg-[#f7f5f5] text-center" v-model="leave.title" :placeholder='$t("title")' />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.title">{{ error.title[0] }}</div>
                </div>
                <div class="flex flex-column gap-2">
                    <label class="w-full text-right" for="username">{{ $t('location') }}</label>
                    <InputText required class="bg-[#f7f5f5] text-center" v-model="leave.location" :placeholder='$t("location")' />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.location">{{ error.location[0] }}</div>
                </div>
              
            
            
              <div class="flex flex-column gap-2">
                    <label class="w-full text-right" for="username ">{{ $t('start_date') }}</label>
                    <Calendar  style="width: 100%" showButtonBar v-model.number="leave.start" showIcon  :placeholder='$t("start_date")'   />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.start">{{ error.start[0] }}</div>

                </div> 
                <div class="flex flex-column gap-2">
                    <label class="w-full text-right" for="username">{{ $t('end_date') }}</label>
                    <Calendar  style="width: 100%" showButtonBar v-model.number="leave.end" showIcon  :placeholder='$t("end_date")'  />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.end">{{ error.end[0] }}</div>

                </div> 
            
              <div class="flex flex-column gap-2">
                    <label class="w-full text-right" for="username">{{ $t('Employees') }}</label>
                    <MultiSelect filter required id="pv_id_1" style="direction: ltr !important;" v-model="leave.assigners"  option-value="id" :options="assigner"  optionLabel="name" :placeholder='$t("Employees")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                      <div class="mt-1 mb-5 text-red-500" v-if="error?.assigners">{{ error.assigners[0] }}</div>
                </div>
             
              <div class="flex flex-column gap-2">
                    <label class="w-full text-right" for="username">{{ $t('lat') }}</label>
                    <InputNumber  required class="bg-[#f7f5f5]" v-model="leave.lat" :placeholder='$t("lat")' />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.lat">{{ error.lat[0] }}</div>
                </div> 
                <div class="flex flex-column gap-2">
                    <label class="w-full text-right" for="username">{{ $t('long') }}</label>
                    <InputNumber  required class="bg-[#f7f5f5]" v-model="leave.long" :placeholder='$t("long")' />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.long">{{ error.long[0] }}</div>
                </div> 
             
        
                <div class="py-3">
                    <GoogleMap api-key="AIzaSyDZnJeq94aaneiA3QWUZdWYV9uKDEjxjas" @click="handleMapClick"
                   style="width: 100%; height: 500px"
                   :center="{ lat: 		parseFloat(location.latitude), lng: parseFloat(location.longitude)} " :zoom="14">
          <Marker
              :options="{ position: { lat: parseFloat(location.latitude)		, lng: parseFloat(location.longitude) } }"/>
         
                 </GoogleMap>

                </div>

          <template #footer>
            <Button :label='$t("cancel")'  icon="pi pi-times" class="p-button-text" @click="hideDialogRequest"/>
            <Button :label='$t("save")' icon="pi pi-check" class="p-button-text" @click="updatel"/>
          </template>
        </Dialog>     
        

        



        </div>
      </div>
      <Toast/>
    </div>
  </template>
  <script setup>
  import { FilterMatchMode } from 'primevue/api'
  import { ref, onMounted, onBeforeMount ,computed} from 'vue'
  // import ProductService from '@/service/ProductService';
  import { useToast } from 'primevue/usetoast'
  import {GoogleMap, Marker, Circle} from "vue3-google-map";
  import axios from 'axios'
  import moment from "moment";
  const toast = useToast()
  const leave=ref({
    long:'',
    lat:'',
    assigners:[]
  })
  const loading = ref(true)
  const user = ref({})
  const error = ref('')
  const users = ref(null)
  const data_id=ref('')
  const updata=ref(false)
  const productDialog = ref(false)
  const dt = ref(null)
  const filters = ref({})
  const submitted = ref(false)
  const unsetuserDialog=ref(false)
  const RequestDialog=ref(false)
  const assigner=ref([])
  const center =ref({ lat: 10, lng: 10 })

    const location = ref(
    {name: '', latitude: 31.984983325941823, longitude: 35.900908045672196, distance: 1000}
)
  // const productService = new ProductService();
  onBeforeMount(() => {
    initFilters()
  })

  const circle = computed(() => {
  console.log(location.value.distance)
  return {
    center: {lat: location.value.latitude, lng: location.value.longitude},
    radius: parseInt(location.value.distance),
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35
  }
});

  function handleMapClick(event) {
  const clickedLatLng = event.latLng; // LatLng object representing the clicked coordinates
  const lat = clickedLatLng.lat();
  const lng = clickedLatLng.lng();
  leave.value.lat = lat;
  leave.value.long = lng;
  console.log('Clicked coordinates:', lat, lng);
  // Do something with the latitude and longitude values
}

  const fetchData = () => {
    axios.get('/api/official-leaves').then((res) => {

      
      loading.value = false
      users.value = res.data.data
    
    })

    axios.get('/api/employees').then((res) => {
      assigner.value=res.data.data
      
    })
  }
   // delete
   const confirmDeleteUser=(id)=>{
    data_id.value=id
    unsetuserDialog.value=!( unsetuserDialog.value)
   }

   const deleteleave=()=>{
   
    axios.delete(`/api/official-leaves/${data_id.value}`).then((res) => {
      fetchData()
      unsetuserDialog.value=!( unsetuserDialog.value)
      
        
        })
   }
   //create
   const openNew=()=>{

    RequestDialog.value=!( RequestDialog.value)

  
   }
   const saveRequest=()=>{
    
    leave.value.end = moment(leave.value.end).format("YYYY-MM-DD HH:mm:ss");
    leave.value.start = moment(leave.value.start).format("YYYY-MM-DD HH:mm:ss");
 
    axios.post(`api/official-leaves`,leave.value).then((res) => {
      fetchData()
      RequestDialog.value=!( RequestDialog.value)
      toast.add({severity: 'success', summary: 'Successful', detail: 'Successful', life: 3000})  
        }).catch((el)=>{
          
       error.value = el.response.data.errors
      })
   }

 ////update
  const updateleave=(id)=>{
    data_id.value=id
    updata.value=!(updata.value) 

    axios.get(`/api/official-leaves/${id}`).then((res) => {
   
      leave.value.title=res.data.data.title
      leave.value.location=res.data.data.location
      leave.value.lat=res.data.data.lat
      leave.value.long=res.data.data.long
      leave.value.start=res.data.data.start
      leave.value.end=res.data.data.end
      location.value.latitude=res.data.data.lat
      location.value.longitude=res.data.data.long
     
     
      for(let i=0 ;i<res.data.data.assigners.length;i++){
        
         leave.value.assigners.push(res.data.data.assigners[i].employee_id)
    }
        })
  }

  const updatel=()=>{
    axios.put(`api/official-leaves/${data_id.value}`,leave.value).then((res) => {
      fetchData()
      updata.value=!( updata.value)
      toast.add({severity: 'success', summary: 'Successful', detail: 'Successful', life: 3000})
        
        }).catch((el)=>{
          
          error.value = el.response.data.errors
         })
  }


   const getmap=(e)=>{
    console.log(e)
 long.value= e.fi.x
lat.value =e.fi.y
console.log(e)
}

  onMounted(() => {
    // productService.getProducts().then((data) => (products.value = data));
    fetchData()
  })



  const hideDialog = () => {
    productDialog.value = false
    submitted.value = false
  }
  const exportCSV = () => {
    dt.value.exportCSV()
  }
  const initFilters = () => {
    filters.value = {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    }
  };
</script>