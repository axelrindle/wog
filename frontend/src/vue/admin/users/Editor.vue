<template>
  <div>
    <div v-if="!loading">

      <!-- Username-->
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">Username</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control is-expanded has-icons-left">
              <input class="input" type="text" :value="user.username" disabled v-if="!create">
              <input class="input" type="text" v-model="user.username" :disabled="loading" v-else>
              <span class="icon is-small is-left">
                <i class="fas fa-user"></i>
              </span>
            </div>
            <p class="help is-danger" v-if="hasError('username')">{{ errors.username }}</p>
          </div>
        </div>
      </div>

      <!-- Role-->
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">Role</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control is-expanded has-icons-left">
              <div class="select">
                <select v-model="user.role" :disabled="loading">
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <span class="icon is-small is-left">
                <i class="fas fa-tag"></i>
              </span>
            </div> <!-- end .control -->
            <p class="help is-danger" v-if="hasError('role')">{{ errors.role }}</p>
          </div> <!-- end .field -->
        </div> <!-- end .field-body -->
      </div>

      <hr>

      <!-- Change password-->
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">Change password</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control is-expanded has-icons-left">
              <input class="input" type="password" v-model="user.password" :disabled="loading">
              <span class="icon is-small is-left">
                <i class="fas fa-key"></i>
              </span>
            </div>
            <p class="help is-danger" v-if="hasError('password')">{{ errors.password }}</p>
          </div> <!-- end .field -->
        </div> <!-- end .field-body -->
      </div> <!-- end .field -->

      <hr>

      <div class="buttons is-right">
        <span class="button" @click="cancel" :disabled="loading">Cancel</span>
        <span class="button is-success" @click="save" :disabled="loading">{{ create ? 'Create' : 'Save' }}</span>
      </div>
    </div> <!-- end .card-content -->

    <div class="loading" v-else>
      <span style="margin-right: 10px;">Loading...</span>
      <i class="fas fa-sync-alt fa-spin fa-lg"></i>
    </div>

  </div>
</template>

<script>
module.exports = {
  name: 'UserEditor',

  props: {
    user: {
      type: Object,
      default: () => ({})
    },
    create: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loading: false,
      errors: null
    }
  },

  methods: {
    hasError(property) {
      return this.errors && this.errors[property];
    },
    cancel() {
      this.$emit('finish');
    },
    filterUser() {
      const copy = this.user;
      delete copy.username;
      for (let property in this.user) {
        if (!copy[property]) {
          delete copy[property];
        }
      }
      return copy;
    },
    save() {
      if (this.loading) return;

      this.loading = true;
      const method = this.create ? 'put' : 'patch';
      const action = this.create ? 'create' : 'edit';
      const data = this.create ? this.user : this.filterUser();
      axios[method]('/admin/user/' + action, data)
        .then(response => {
          console.log(response);
          this.errors = null;
          this.$parent.refresh();
          this.cancel();
        })
        .catch(err => {
          switch (err.response.status) {
            case 422: // validation errors
              this.errors = err.response.data.errors;
              break;
            default: // default to just logging
              console.error(err.response);
              alert(err);
              break;
          }
        })
        .then(() => {
          this.loading = false;
        });
    }
  }
};
</script>
