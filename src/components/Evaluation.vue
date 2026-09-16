<template>
    <Toolbar class="mb-4 shadow-md">
  <template #end>
    
    <router-link
          v-can="'question type list'"
          :to="{ name: 'question-types' }"
          class="export px-4 py-2 mx-4 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('question_types') }}</router-link>
        <router-link
          v-can="'milestone question list'"
          :to="{ name: 'question' }"
          class="export px-4 py-2 mx-4 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('questions') }}</router-link>
        <router-link
          v-can="'milestone subtest list'"
          :to="{ name: 'milestone-subtest' }"
          class="export px-4 py-2 mx-4 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('Subtest') }}</router-link>
        <router-link
          v-can="'milestone level list'"
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