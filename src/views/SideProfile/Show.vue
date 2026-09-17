<script>
import axios from "axios";
import { FilterMatchMode } from "@primevue/core/api";

export default {
  data() {
    return {
      evaluations: [],
      loading: true,
      deleting: null,
      filters: { global: { value: null, matchMode: FilterMatchMode.CONTAINS } },
    };
  },
  methods: {
    getEvaluations() {
      this.loading = true;
      axios
        .get(`/api/side-profiles/${this.$route.params.id}/evaluations`)
        .then((res) => {
          this.evaluations = res.data.evaluations ?? [];
        })
        .finally(() => {
          this.loading = false;
        });
    },
    editItem(id) {
      this.$router.push({ name: "EditEvaluations", params: { id } });
    },
    showItem(id) {
      this.$router.push({ name: "ShowEvaluations", params: { id } });
    },
    create() {
      this.$router.push({ name: "CreateEvaluations", params: { sideProfile_id: this.$route.params.id } });
    },
    deleteItem() {
      const id = this.deleting?.id;
      if (!id) return;
      axios.delete(`/api/evaluations/${id}/delete`).then(() => {
        this.deleting = null;
        this.$toast.add({ severity: "success", summary: this.$t("success_message"), detail: this.$t("successful"), life: 3000 });
        this.getEvaluations();
      });
    },
  },
  mounted() {
    this.getEvaluations();
  },
};
</script>

<template>
  <div class="page">
    <Toast />
    <Toolbar>
      <template #start>
        <Button v-can="'evaluations create'" :label="$t('create_button')" icon="pi pi-plus" @click="create" />
      </template>
      <template #end>
        <BackButton />
      </template>
    </Toolbar>

    <DataTable :value="evaluations" :loading="loading" dataKey="id" paginator :rows="10" :filters="filters"
      :globalFilterFields="['title']" stripedRows>
      <template #header>
        <div class="page-header">
          <h1 class="page-title">{{ $t("evaluations") }}</h1>
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
      <Column field="title" :header="$t('evaluation_title')" sortable />
      <Column :header="$t('actions')" style="width: 12rem">
        <template #body="{ data }">
          <div class="table-actions">
            <Button v-can="'evaluation results create'" icon="pi pi-play" rounded variant="outlined" severity="success"
              v-tooltip.top="$t('start_evaluation')" :aria-label="$t('start_evaluation')" @click="showItem(data.id)" />
            <Button v-can="'evaluations edit'" icon="pi pi-pencil" rounded variant="outlined" severity="info"
              v-tooltip.top="$t('edit')" :aria-label="$t('edit')" @click="editItem(data.id)" />
            <Button v-can="'evaluations delete'" icon="pi pi-trash" rounded variant="outlined" severity="danger"
              v-tooltip.top="$t('delete')" :aria-label="$t('delete')" @click="deleting = data" />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog :visible="Boolean(deleting)" modal :header="$t('confirmation')" :style="{ width: '420px', maxWidth: '95vw' }"
      @update:visible="deleting = null">
      <p class="m-0">{{ $t("remove_item") }} <b>{{ deleting?.title }}</b></p>
      <template #footer>
        <Button :label="$t('no')" severity="secondary" variant="text" @click="deleting = null" />
        <Button :label="$t('yes')" severity="danger" @click="deleteItem" />
      </template>
    </Dialog>
  </div>
</template>
