<template>
    <Toolbar class="mb-4 shadow-md">
  <template #end>
        <!-- <router-link
            :to="{ name: 'children-detailes' }"
            class="export px-4 py-2 mx-4 rounded-md text-sm text-white bg-indigo-400  border-b-2"
            > {{ $t('multiple') }}</router-link> -->
        <router-link
          v-can="'carolina-age-range show'"
          :to="{ name: 'agerange' }"
          class="export px-4 py-2 mx-2 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('age_range') }}</router-link>
   
        <router-link
        v-can="'carolina-age-range show'"
          :to="{ name: 'category' }"
          class="export px-4 py-2 mx-2 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('category') }}</router-link>

        <router-link
      v-can="'carolina-age-range show'"
          :to="{ name: 'answer_type' }"
          class="export px-4 py-2 mx-2 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('answer_type') }}</router-link>
      
        <router-link
        v-can="'carolina-answer show'"
          :to="{ name: 'test' }"
          class="export px-4 py-2 mx-2 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('test') }}</router-link>
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