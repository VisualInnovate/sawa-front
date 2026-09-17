<template>
  <div class="page">
    <Toast />
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ $t("Pages") }}</h1>
        <p class="page-subtitle">{{ $t("Pages_menu") }}</p>
      </div>
    </div>

    <DataTable :value="pages" :loading="loading" dataKey="id" stripedRows>
      <template #empty>
        <div class="empty-state"><i class="pi pi-inbox" />{{ $t("no_data") }}</div>
      </template>
      <Column field="title" :header="$t('title')" style="min-width: 12rem" />
      <Column field="description" :header="$t('description')" />
      <Column :header="$t('actions')" style="width: 6rem">
        <template #body="{ data }">
          <Button v-can="'pages edit'" icon="pi pi-pencil" rounded variant="outlined" severity="info"
            v-tooltip.top="$t('edit')" :aria-label="$t('edit')" @click="openModal(data)" />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="update_modal" modal :header="$t('edit_page')" :style="{ width: '640px', maxWidth: '95vw' }">
      <form id="page-form" class="dialog-form" @submit.prevent="updatePage">
        <div class="field">
          <label for="page_title">{{ $t("title") }}</label>
          <InputText id="page_title" v-model="page_model_title" fluid />
        </div>
        <div class="field">
          <label for="page_description">{{ $t("description") }}</label>
          <Textarea id="page_description" v-model="page_model_description" rows="5" autoResize fluid />
        </div>
      </form>
      <template #footer>
        <Button :label="$t('cancel')" severity="secondary" variant="text" @click="update_modal = false" />
        <Button type="submit" form="page-form" :label="$t('save')" icon="pi pi-check" />
      </template>
    </Dialog>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      pages: [],
      page_model_id: null,
      page_model_title: null,
      page_model_description: null,
      update_modal: false,
      loading: true,
    };
  },
  methods: {
    getPages() {
      axios
        .get("/api/site/pages")
        .then((res) => {
          this.pages = res.data.pages ?? [];
        })
        .finally(() => {
          this.loading = false;
        });
    },
    updatePage() {
      axios
        .post(`/api/site/pages/${this.page_model_id}`, {
          title: this.page_model_title,
          description: this.page_model_description,
        })
        .then((res) => {
          console.log(res);
          const index = this.pages.findIndex(
            (page) => page.id == res.data.pages.id
          );
          this.pages[index] = res.data.pages;
          this.update_modal = false;
          this.$toast.add({ severity: "success", summary: this.$t("success_message"), detail: this.$t("successful"), life: 3000 });
        })
        .catch((err) => {
          this.$toast.add({ severity: "error", summary: this.$t("error"), detail: err.response?.data?.message ?? this.$t("request_failed_retry"), life: 5000 });
        });
    },
    openModal(page) {
      this.page_model_id = page.id;
      this.page_model_title = page.title;
      this.page_model_description = page.description;
      this.update_modal = true;
    },
  },
  mounted() {
    this.getPages();
  },
};
</script>
<style scoped>
.page-subtitle {
  margin: 0.25rem 0 0;
  color: var(--sawa-muted);
}
.dialog-form {
  display: grid;
  gap: 1rem;
}
</style>
