<template>
    <Toolbar class="mb-4 shadow-md">
  <template #end>
        <!-- <router-link
            :to="{ name: 'children-detailes' }"
            class="export px-4 py-2 mx-4 rounded-md text-sm text-white bg-indigo-400  border-b-2"
            > {{ $t('multiple') }}</router-link> -->
            <router-link
          :to="{ name: 'pair' }"
          class="export px-4 py-2 mx-2 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('pair') }}</router-link>
   
        <router-link
          :to="{ name: 'reinforcers' }"
          class="export px-4 py-2 mx-2 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('Settings') }}</router-link>
        <router-link
          :to="{ name: 'return' }"
          class="export px-4 py-2 mx-2 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('return') }}</router-link>
        <router-link
          :to="{ name: 'without' }"
          class="export px-4 py-2 mx-2 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('without') }}</router-link>
        
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