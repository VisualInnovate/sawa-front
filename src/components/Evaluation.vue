<template>
    <Toolbar class="mb-4 shadow-md">
  <template #end>
    
    <router-link
          :to="{ name: 'question-types' }"
          class="export px-4 py-2 mx-4 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('question_types') }}</router-link>
        <router-link
          :to="{ name: 'question' }"
          class="export px-4 py-2 mx-4 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('questions') }}</router-link>
        <router-link
          :to="{ name: 'milestone-subtest' }"
          class="export px-4 py-2 mx-4 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('Subtest') }}</router-link>
        <router-link
          :to="{ name: 'levels' }"
          class="export px-4 py-2 mx-4 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('levels') }}</router-link>
  </template>
  
</Toolbar>

</template>
<style>
.router-link-active {
background-color: rgb(239, 80, 80) !important
}

</style>