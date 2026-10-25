<template>
  <Nave />
  <Toast />
  <div class="banner flex items-center h-[35vh] lg:h-[45vh] relative">
    <div class="absolute bg-gradient-to-r from-[#74dbc7] to-[#618990] opacity-40 w-full h-full z-50"></div>
    <img class="w-full absolute h-full" src="../image/112.png" alt="" />
    <div class="z-50 text-white m-auto w-[80%]">
      <h1 class="font-bold text-5xl text-white z-50">{{ $t("gen_parent_title") }}</h1>
    </div>
  </div>

  <div class="max-w-[1100px] mx-auto py-[4%] px-3">
    <p class="text-slate-600 mb-4">{{ $t("gen_parent_hint") }}</p>
    <div v-if="loading" class="py-10 text-center"><ProgressSpinner style="width: 40px; height: 40px" /></div>
    <div v-else-if="!rows.length" class="empty-state bg-white rounded-xl border"><i class="pi pi-home" /> {{ $t("gen_parent_empty") }}</div>
    <div v-else class="grid gap-3">
      <article v-for="(row, i) in rows" :key="row.id" class="gen-card bg-white rounded-xl border p-4" :style="{ '--d': `${i * 60}ms` }">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <b class="text-[#135C65] text-lg">{{ row.child?.name }}</b>
          <Tag :severity="SEVERITY[row.status]" :value="$t(`gen_status_${row.status}`)" />
        </div>
        <small class="text-slate-500 block mt-1">{{ row.goal?.domain }} · {{ row.goal?.general_goal }}</small>
        <p class="mt-2 mb-0 text-[#303843] leading-7">{{ row.goal?.goal }}</p>
        <p v-if="row.status === 'rejected' && row.note" class="mt-2 mb-0 text-red-700"><i class="pi pi-comment" /> {{ row.note }}</p>
        <div class="flex flex-wrap items-center justify-between gap-2 mt-3">
          <small class="text-slate-400" dir="ltr">{{ row.created_at }}</small>
          <Button v-if="row.status === 'pending'" icon="pi pi-check-square" :label="$t('decision_answer')" @click="current = row" />
        </div>
      </article>
    </div>
  </div>

  <DecisionDialog :visible="!!current" :title="$t('gen_home_decide')" :loading="deciding" @update:visible="current = null" @decide="decide">
    <template v-if="current">
      <p class="m-0"><b>{{ current.child?.name }}</b></p>
      <p class="mt-2 mb-0 text-slate-600">{{ current.goal?.goal }}</p>
    </template>
  </DecisionDialog>
  <About />
</template>

<script>
// The parents' portal: the goals the therapists ask to generalize at home. The parent approves or rejects each (with
// the reason); the therapist sees the answer in the session.
import axios from "axios";
import Nave from "../components/Nave.vue";
import About from "../components/About.vue";
import DecisionDialog from "@/components/sessions/DecisionDialog.vue";

export default {
  components: { Nave, About, DecisionDialog },
  data() {
    return { rows: [], loading: true, current: null, deciding: false, SEVERITY: { pending: "warn", approved: "success", rejected: "danger" } };
  },
  methods: {
    load() {
      this.loading = true;
      axios.get("/api/parent/goal-generalizations")
        .then((res) => { this.rows = res.data.data ?? []; })
        .catch(() => { this.rows = []; })
        .finally(() => { this.loading = false; });
    },
    decide(answer) {
      this.deciding = true;
      axios.post(`/api/parent/goal-generalizations/${this.current.id}/decide`, answer)
        .then(() => {
          this.$toast.add({ severity: "success", summary: this.$t("success_message"), detail: answer.approved ? this.$t("gen_approved_done") : this.$t("gen_rejected_done"), life: 2500 });
          this.current = null;
          this.load();
        })
        .catch((e) => this.$toast.add({ severity: "error", summary: this.$t("error"), detail: e.response?.data?.message ?? this.$t("mission_error"), life: 3000 }))
        .finally(() => { this.deciding = false; });
    },
  },
  mounted() {
    this.load();
  },
};
</script>

<style scoped>
.gen-card { animation: gen-in .35s var(--d) ease both; transition: box-shadow .2s, transform .2s; }
.gen-card:hover { box-shadow: 0 12px 26px -20px #135c65; transform: translateY(-2px); }
@keyframes gen-in { from { opacity: 0; transform: translateY(10px); } }
</style>
