<script>
import axios from "axios";
import Sideprofiletap from "../../components/Sideprofiletap.vue";

// The side profile dimensions are the rows of the `evaluations` table (their questions hang off
// evaluations.id). `side_profile_types` is not used: it lacks the communication dimension and has no questions.
export default {
  components: { Sideprofiletap },
  data() {
    return {
      dimensions: [],
      loading: true,
      loadError: false,
    };
  },
  methods: {
    getDimensions() {
      this.loading = true;
      this.loadError = false;
      axios
        .get("/api/evaluations")
        .then((res) => {
          this.dimensions = (res.data.evaluations ?? []).filter((row) => row.type == null || Number(row.type) === 1);
        })
        .catch(() => {
          this.loadError = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    startEvaluation(id) {
      this.$router.push({ name: "ShowEvaluations", params: { id } });
    },
    editEvaluation(id) {
      this.$router.push({ name: "EditEvaluations", params: { id } });
    },
  },
  mounted() {
    this.getDimensions();
  },
};
</script>

<template>
  <div class="page">
    <Sideprofiletap />

    <Message v-if="loadError" severity="error" :closable="false">{{ $t("request_failed_retry") }}</Message>

    <DataTable :value="dimensions" :loading="loading" dataKey="id" stripedRows>
      <template #header>
        <div class="page-header">
          <div>
            <h1 class="page-title">{{ $t("side_profile_page_title") }}</h1>
            <p class="page-hint">{{ $t("side_profile_page_hint") }}</p>
          </div>
        </div>
      </template>
      <template #empty>
        <div class="empty-state"><i class="pi pi-inbox" />{{ $t("no_data") }}</div>
      </template>
      <Column :header="$t('index')" style="width: 4rem">
        <template #body="{ index }">{{ index + 1 }}</template>
      </Column>
      <Column field="title" :header="$t('side_profile_dimension')" sortable>
        <template #body="{ data }">
          <span class="font-semibold">{{ data.title }}</span>
        </template>
      </Column>
      <Column :header="$t('actions')" style="width: 10rem">
        <template #body="{ data }">
          <div class="table-actions">
            <Button v-can="'evaluation results create'" icon="pi pi-play" rounded variant="outlined" severity="success"
              v-tooltip.top="$t('start_evaluation')" :aria-label="$t('start_evaluation')" @click="startEvaluation(data.id)" />
            <Button v-can="'evaluations edit'" icon="pi pi-pencil" rounded variant="outlined" severity="info"
              v-tooltip.top="$t('edit_evaluation_questions')" :aria-label="$t('edit_evaluation_questions')"
              @click="editEvaluation(data.id)" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.page-hint {
  margin: 0.25rem 0 0;
  color: var(--sawa-muted);
  font-size: 0.9rem;
}
</style>
