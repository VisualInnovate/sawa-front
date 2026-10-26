<script setup>
// «أطفالي»: every child with their programs, evaluations and next session; from here a child is added and the
// free M-CHAT-R is opened.
import { computed, onMounted } from "vue";
import { useParentPortalStore } from "@/stores/ParentPortal";
import PageHead from "@/components/parent/PageHead.vue";
import ChildCard from "@/components/parent/ChildCard.vue";
import EmptyState from "@/components/parent/EmptyState.vue";

const portal = useParentPortalStore();
onMounted(() => portal.load());
const children = computed(() => portal.children);
</script>

<template>
  <div class="pp-page">
    <PageHead :title="$t('pp.my_children')" :lead="$t('pp.children_lead')" :kicker="$t('pp.brand')" icon="pi pi-users">
      <template #actions>
        <router-link :to="{ name: 'parent-mchat' }" class="pp-btn pp-btn--soft"><i class="pi pi-heart" /> {{ $t("pmchat.button") }}</router-link>
        <router-link :to="{ name: 'ReAction' }" class="pp-btn"><i class="pi pi-plus" /> {{ $t("Add_new_child") }}</router-link>
      </template>
    </PageHead>

    <div v-if="portal.loading && !portal.home" class="pp-grid pp-grid--2">
      <div v-for="i in 2" :key="i" class="pp-skeleton" style="height: 220px" />
    </div>
    <EmptyState v-else-if="!children.length" icon="pi pi-user-plus" :title="$t('pp.no_children_title')" :text="$t('pp.no_children_text')">
      <router-link :to="{ name: 'ReAction' }" class="pp-btn"><i class="pi pi-plus" /> {{ $t("Add_new_child") }}</router-link>
    </EmptyState>
    <div v-else class="pp-grid pp-grid--2">
      <ChildCard v-for="(child, i) in children" :key="child.id" :child="child" :index="i + 1" />
    </div>
  </div>
</template>
