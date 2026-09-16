<template>
    <Toolbar class="mb-4 shadow-md">
  <template #end>

    <router-link
          v-can="'deduction list'"
          :to="{ name: 'deduction' }"
          class="export px-4 py-2 mx-4 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('deductions') }}</router-link>
        <router-link
          v-can="'deduction type list'"
          :to="{ name: 'deduction-types' }"
          class="export px-4 py-2 mx-4 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('deduction_types') }}</router-link>
        
  </template>
  
</Toolbar>

</template>
<style>
.router-link-active {
background-color: rgb(239, 80, 80) !important
}

</style>