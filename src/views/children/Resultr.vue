<template>
  <div class="page">
    <Toolbar>
      <template #start>
        <Button :label="$t('print')" icon="pi pi-print" severity="secondary" @click="goprint" />
      </template>
      <template #end>
        <BackButton />
      </template>
    </Toolbar>

    <DataTable :value="desserts" :loading="loading" sortField="evaluation_title" :sortOrder="1" paginator :rows="10" stripedRows>
      <template #empty>
        <div class="empty-state"><i class="pi pi-inbox" />{{ $t("no_data") }}</div>
      </template>
      <Column field="id" header="#" sortable />
      <Column field="side_profile_title" :header="$t('side_profile_title')" sortable />
      <Column field="evaluation_title" :header="$t('evaluation_title')" sortable />
      <Column field="child_age" :header="$t('child_age')" sortable />
      <Column field="diff_age" :header="$t('diff_age')" sortable />
      <Column field="grow_age" :header="$t('grow_age')" sortable />
      <Column field="late_percentage" :header="$t('late_percentage')" sortable>
        <template #body="{ data }">{{ Math.round(data.late_percentage) }} %</template>
      </Column>
      <Column field="result_created_at" :header="$t('result_created_at')" sortable />
    </DataTable>
  </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment';

  export default {
    data () {
      return {
        desserts: [],
        loading: true,
      }
    },
    
    methods: {
     async getruslte(){
       await axios.post("/api/child/results",{
          sideprofile_id:this.$route.params.sideProfile_id,child_id:this.$route.params.child_id
        }).then(res => {
          console.log(res.data.evaluation_results)
       this.desserts=res.data.evaluation_results
      })  
      this.loading = false
      for(var i=0; i<this.desserts.length;i++){
        this.desserts[i].result_created_at=moment(this.desserts[i].result_created_at).format('DD-MM-yy ')
      }      
      },
        goBack() {
        this.$router.go(-1)
      },
      goprint(){
        this.$router.push({name:'ResultPrint', params: this.$route.params})
      }
    },
    mounted() {
        
      this.getruslte()
    },
  }
</script>