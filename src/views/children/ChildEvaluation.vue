<script>
import axios from "axios";
import { FilterMatchMode } from "@primevue/core/api";

export default {
  data() {
    return {
      evaluations: [],
      loading: true,
      filters: { global: { value: null, matchMode: FilterMatchMode.CONTAINS } },
    };
  },
  methods: {
    getResults() {
      const { child_id, sideProfile_id } = this.$route.params;
      axios
        .get(`/api/evaluations/${child_id}/${sideProfile_id}/evaluations-child`)
        .then((res) => {
          this.evaluations = res.data.evaluations ?? [];
        })
        .finally(() => {
          this.loading = false;
        });
    },
    showItem(id) {
      this.$router.push({
        name: "showChildResult",
        params: { child_id: this.$route.params.child_id, sideProfile_id: this.$route.params.sideProfile_id, evaluation_id: id },
      });
    },
  },
  mounted() {
    this.getResults();
  },
};
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">{{ $t("evaluations") }}</h1>
      <BackButton />
    </div>
    <DataTable :value="evaluations" :loading="loading" dataKey="id" paginator :rows="10" :filters="filters"
      :globalFilterFields="['evaluation_title']" stripedRows>
      <template #header>
        <div class="page-header">
          <span />
          <IconField class="table-search">
            <InputIcon class="pi pi-search" />
            <InputText v-model="filters.global.value" :placeholder="$t('search')" />
          </IconField>
        </div>
      </template>
      <template #empty>
        <div class="empty-state"><i class="pi pi-inbox" />{{ $t("no_data") }}</div>
      </template>
      <Column :header="$t('index')" style="width: 4rem">
        <template #body="{ index }">{{ index + 1 }}</template>
      </Column>
      <Column field="evaluation_title" :header="$t('evaluation_title')" sortable />
      <Column :header="$t('actions')" style="width: 6rem">
        <template #body="{ data }">
          <Button icon="pi pi-eye" rounded variant="outlined" severity="secondary" v-tooltip.top="$t('view')"
            :aria-label="$t('view')" @click="showItem(data.id)" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>
