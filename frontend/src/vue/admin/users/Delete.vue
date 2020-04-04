<template>
  <div>
    <div v-if="!loading">
      <p>
        Are you sure you want to delete the User <u>{{ user.username }}</u>? This action cannot be undone!
      </p>
      <hr>
      <div class="buttons is-right">
        <span class="button is-success" @click="cancel" :disabled="loading">Cancel</span>
        <span class="button is-danger" @click="deleteUser" :disabled="loading">Delete</span>
      </div>
    </div>

    <div class="loading" v-else>
      <span style="margin-right: 10px;">Loading...</span>
      <i class="fas fa-sync-alt fa-spin fa-lg"></i>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: 'UserDeletion',

  props: {
    user: Object
  },
  data() {
    return {
      loading: false
    }
  },

  methods: {
    cancel() {
      this.$emit('cancel');
    },
    deleteUser() {
      if (this.loading) return;

      this.loading = true;
      axios.post('/admin/user/delete', { id: this.user.id })
        .then(() => {
          alert('User has been deleted.');
          this.$emit('finish');
        })
        .catch(err => {
          alert(err.response.data);
          console.error(err);
          console.error(err.response);
        })
        .then(() => {
          this.loading = false;
        });
    }
  }
}
</script>
