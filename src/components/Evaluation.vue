<template>
    <Toolbar class="mb-4 shadow-md">
  <template #end>
    
    <router-link
          v-can="'milestone domain list'"
          :to="{ name: 'milestone-domains' }"
          class="export px-4 py-2 mx-4 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('milestone_domain') }}</router-link>
        <router-link
          v-can="'milestone sub goal list'"
          :to="{ name: 'milestone-sub-goals' }"
          class="export px-4 py-2 mx-4 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('milestone_sub_goals') }}</router-link>
        <router-link
          v-can="'milestone general goal list'"
          :to="{ name: 'milestone-general-goals' }"
          class="export px-4 py-2 mx-4 rounded-md text-sm text-white bg-indigo-400  border-b-2"
        > {{ $t('milestone_general_goal') }}</router-link>
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
