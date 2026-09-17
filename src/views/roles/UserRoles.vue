<script>
import axios from "axios";

export default {
  props: ["id"],
  data() {
    return {
      permissions: [],
      user_permissions: [],
      new_permissions: [],
      checked_permissions: [],
      permission_name: "",
      alert: {
        show: false,
        text: "",
        color: "",
      },
    };
  },
  methods: {
    getPermissions() {
      axios
        .post("/api/permissions", {
          name: this.permission_name,
          name: this.permission_name,
        })
        .then((res) => {
          this.permissions = res.data.permissions.data;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addPermissions() {
      console.log(this.checked_permissions);
      axios
        .post(`/api/users/${this.id}/add-permissions`, {
          roles: this.checked_permissions,
        })
        .then((res) => {
          this.alert.color = "success";
          this.alert.text = res.data.message;
          this.alert.show = true;
          setTimeout(() => {
            this.alert.show = false;
          }, 3000);
          console.log(res);
        })
        .catch((err) => {
          this.alert.color = "error";
          this.alert.text = err.response.data.message;
          this.alert.show = true;
          setTimeout(() => {
            this.alert.show = false;
          }, 3000);
          console.log(err);
        });
    },
    getUserPermissions() {
      axios
        .get(`/api/users/${this.id}/permissions`)
        .then((res) => {
          this.user_permissions = res.data.user_permissions;

          this.user_permissions.forEach((per) => {
            this.checked_permissions[per.id] = per.id;
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onCheckboxChange(index, e) {
      if (e === true) {
        this.checked_permissions.push(index);
      }
      console.log(index);
      console.log(e);
    },
  },
  mounted() {
    this.getUserPermissions();
    this.getPermissions();
  },
  watch: {
    permission_name() {
      this.getPermissions();
    },
  },
};
</script>

<template>
  <div class="page">
    <Message v-if="alert.show" :severity="alert.color === 'error' ? 'error' : 'success'">{{ alert.text }}</Message>
    <div class="surface-card form-stack">
      <IconField class="table-search">
        <InputIcon class="pi pi-search" />
        <InputText v-model="permission_name" :placeholder="$t('permission_name')" />
      </IconField>
      <div class="check-list">
        <label v-for="per in permissions" :key="per.id" class="check-item">
          <Checkbox v-model="checked_permissions[per.id]" binary :trueValue="per.id" :falseValue="undefined"
            @update:modelValue="onCheckboxChange(per.id, $event !== undefined)" />
          <span>{{ per.name }}</span>
        </label>
      </div>
      <div>
        <Button :label="$t('submit')" icon="pi pi-check" @click="addPermissions" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-stack {
  display: grid;
  gap: 1rem;
}
.check-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
}
.check-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
</style>
