<template>
    <Toolbar class="mb-4 shadow-md">
  <template #end>
    
   
        <router-link
          :to="{ name: 'doctors-show' }"
          class="export px-4 py-2 mx-4 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('student_details') }}</router-link>

        <router-link
          :to="{ name: 'doctors-programe' }"
          class="export px-4 py-2 mx-4 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('evaluation_order') }}</router-link>

        <router-link
          :to="{ name: 'doctors-evaluation' }"
          class="export px-4 py-2 mx-4 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('Consultations_evaluations') }}</router-link>
      
  </template>
  
</Toolbar>

</template>
<style>
.router-link-active {
background-color: rgb(239, 80, 80) !important
}

</style>