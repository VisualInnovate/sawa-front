<template>
  <div>
    <ChildTaps></ChildTaps>
    <div class="sawa-card">
      <section v-if="currentProgram?.milestone_plan_goals?.length" class="p-4">
        <h2 class="font-bold mb-3">{{ $t("milestone_plan_goals") }}</h2>
        <ul class="list-disc ps-5 space-y-2">
          <li
            v-for="goal in currentProgram.milestone_plan_goals"
            :key="goal.id"
          >
            {{ goal.body }}
          </li>
        </ul>
      </section>

      <div v-else-if="!currentProgram" class="p-6 text-center text-gray-600">
        {{ $t("session_no_student_programs") }}
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-1 gap-4 p-4">
        <div class="shadow-md bg-slate-100 rounded-sm p-4 grid grid-cols-1">
          <div class="w-full">
            <div class="flex py-2">
              <h3 class="my-auto font-bold">{{ $t("child_name") }} :</h3>
              <p class="text-xl px-1 my-auto">{{ details?.name }}</p>
            </div>
            <div class="flex py-2">
              <h3 class="my-auto font-bold">{{ $t("ProgramType") }} :</h3>
              <p
                class="text-xl px-1 my-auto"
                v-if="programInfo?.program_type == 0"
              >
                {{ $t("diurnal") }}
              </p>
              <p
                class="text-xl px-1 my-auto"
                v-if="programInfo?.program_type == 1"
              >
                {{ $t("Clinics") }}
              </p>
              <p
                class="text-xl px-1 my-auto"
                v-if="programInfo?.program_type == 2"
              >
                {{ $t("house") }}
              </p>
            </div>
            <div class="flex py-2">
              <h3 class="my-auto font-bold">{{ $t("ProgramName") }} :</h3>
              <p class="text-xl px-1 my-auto">{{ programInfo?.name }}</p>
            </div>
            <div class="flex py-2">
              <h3 class="my-auto font-bold">{{ $t("price") }} :</h3>
              <p class="text-xl px-1 my-auto">{{ programInfo?.price }}</p>
            </div>
            <div class="flex py-2">
              <h3 class="my-auto font-bold">{{ $t("number_sessaion") }} :</h3>
              <p class="text-xl px-1 my-auto">
                {{ programInfo?.individual_sessions }}
              </p>
            </div>
            <div class="flex py-2">
              <h3 class="my-auto font-bold">{{ $t("gruop_sessaion") }} :</h3>
              <p class="text-xl px-1 my-auto">
                {{ programInfo?.collective_sessions }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useStorage } from "@vueuse/core";
import ChildTaps from "../../components/ChildTaps.vue";

export default {
  components: { ChildTaps },

  data() {
    return {
      child_id: useStorage("child_id", Number),
      details: {},
    };
  },

  computed: {
    studentPrograms() {
      const value = this.details?.student_program ?? [];
      if (Array.isArray(value)) return value;
      return value ? [value] : [];
    },
    currentProgram() {
      return this.studentPrograms[0] || null;
    },
    programInfo() {
      return this.currentProgram?.program || {};
    },
  },

  methods: {
    getusers() {
      axios
        .get(`api/program/programFor/${localStorage.getItem("child_id")}`)
        .then((response) => {
          const payload = response.data?.data || response.data || {};
          this.details = payload;
        })
        .catch((error) => {
          this.details = {};
        });
    },
  },

  mounted() {
    this.getusers();
    this.child_id = localStorage.getItem("child_id");
  },
};
</script>
