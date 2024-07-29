<template>
    <Toolbar class="mb-4 shadow-md">
  <template #end>

    <router-link
          :to="{ name: 'deduction' }"
          class="export px-4 py-2 mx-4 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('deduction') }}</router-link>
        <router-link
          :to="{ name: 'deduction-types' }"
          class="export px-4 py-2 mx-4 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('deduction-types') }}</router-link>
        
  </template>
  
</Toolbar>

</template>
<style>
.router-link-active {
background-color: rgb(239, 80, 80) !important
}

</style>