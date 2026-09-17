<script>
import axios from "axios";

export default {
  props: ["id"],
  data() {
    return {
      user_permissions: [],
      new_permissions: [],
    };
  },
  methods: {
    syncPermissions() {
      console.log(this.new_permissions);
      axios
        .post(`/api/users/${this.id}/sync-permissions`, {
          roles: this.new_permissions,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getUserPermissions() {
      axios
        .get(`/api/users/${this.id}/permissions`)
        .then((res) => {
          this.user_permissions = res.data.user_permissions;
          this.user_permissions.forEach((per) => {
            this.new_permissions.push(per);
          });
          console.log(this.user_permissions);
          console.log(this.new_permissions);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    removePer(per) {
      this.new_permissions.splice(this.new_permissions.indexOf(per), 1);
      this.user_permissions.splice(this.user_permissions.indexOf(per), 1);
    },
  },
  mounted() {
    this.getUserPermissions();
  },
};
</script>

<template>
  <div class="page">
    <div class="surface-card form-stack">
      <div class="chips">
        <Button v-for="per in user_permissions" :key="per.id ?? per.name" :label="per.name" icon="pi pi-times"
          iconPos="right" size="small" severity="secondary" rounded @click="removePer(per)" />
      </div>
      <div>
        <Button :label="$t('submit')" icon="pi pi-check" :disabled="new_permissions.length == 0" @click="syncPermissions" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-stack {
  display: grid;
  gap: 1rem;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  min-height: 40vh;
  align-content: flex-start;
}
</style>
