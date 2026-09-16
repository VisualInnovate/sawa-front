<template>
    <Toolbar class="mb-4 shadow-md">
  <template #end>
        <!-- <router-link
            :to="{ name: 'children-detailes' }"
            class="export px-4 py-2 mx-4 rounded-md text-sm text-white bg-indigo-400  border-b-2"
            > {{ $t('multiple') }}</router-link> -->
            <router-link
          v-can="'able category list'"
          :to="{ name: 'ablls' }"
          class="export px-4 py-2 mx-2 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('ablls') }}</router-link>
   
        <router-link
          v-can="'able mission list'"
          :to="{ name: 'missions' }"
          class="export px-4 py-2 mx-2 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('missions') }}</router-link>
      
        
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