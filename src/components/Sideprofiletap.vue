<template>
    <Toolbar class="mb-4 shadow-md">
  <template #end>
        <!-- <router-link
            :to="{ name: 'children-detailes' }"
            class="export px-4 py-2 mx-4 rounded-md text-sm text-white bg-indigo-400  border-b-2"
            > {{ $t('multiple') }}</router-link> -->
       
   
      
        <router-link
          :to="{ name: 'Headers' }"
          class="export px-4 py-2 mx-2 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('headers') }}</router-link>
        <router-link
          :to="{ name: 'SideProfiles' }"
          class="export px-4 py-2 mx-2 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('side_profile') }}</router-link>
        
        <!-- <router-link
          :to="{ name: 'barrier-answer-type' }"
          class="export px-4 py-2 mx-4 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('tables') }}</router-link> -->
       
  </template>
  
</Toolbar>

</template>
<style>
.router-link-active {
background-color: rgb(239, 80, 80) !important
}

</style>