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
              <input class="input" type="text" :value="user.username" disabled="disabled" /><span class="icon is-small is-left"><i class="fas fa-user"></i></span>
            </div>
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
                <select v-model="user.role">
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div><span class="icon is-small is-left"><i class="fas fa-tag"></i></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Change password-->
      <hr>

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">Change password</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control is-expanded has-icons-left">
              <input class="input" type="password" /><span class="icon is-small is-left"><i class="fas fa-key"></i></span>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div class="buttons is-right">
        <span class="button" @click="cancel">Cancel</span>
        <span class="button is-success" @click="save">Save</span>
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
    }
  },

  data() {
    return {
      loading: false,
      showIndicator: {
        refresh: false
      }
    }
  },
  computed: {
    error() {
      if (this.loading) return null;
      if (!this.user) return 'No user selected!';
      return null;
    }
  },

  methods: {
    cancel() {
      this.$root.$refs.userList.selected = -1;
    },
    save() {
      alert('User editing is currently not implemented.'); // TODO: Implement user editing
    }
  }
};
</script>
