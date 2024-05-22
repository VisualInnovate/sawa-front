<template>
    <Toolbar class="mb-4 shadow-md">
  <template #end>
    
   
        <router-link
          :to="{ name: 'milestone-evaluation' }"
          class="export px-4 py-2 mx-4 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('milestone evaluation') }}</router-link>
        <router-link
          :to="{ name: 'barrier-evaluation' }"
          class="export px-4 py-2 mx-4 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('barrier evaluation') }}</router-link>
      
  </template>
  
</Toolbar>

</template>
<style>
.router-link-active {
background-color: rgb(239, 80, 80) !important
}

</style>