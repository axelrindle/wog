<template>
  <div>
    <list :users="users" @select="selected = $event" v-if="selected === -1 && !create"></list>
    <editor :user="selectedUser" @finish="onEditorFinish" :selected="selected" :create="create" v-else></editor>
  </div>
</template>

<script>
// Require components
const List = require('./List');
const Editor = require('./Editor');

module.exports = {
  name: 'UserManagement',
  components: { List, Editor },

  data: () => ({
    loading: true,
    create: false,
    users: [],
    selected: -1
  }),
  computed: {
    showActions() {
      return !this.loading && !this.create && this.selected === -1;
    },
    selectedUser() {
      return this.users.find(el => el.id === this.selected);
    }
  },

  methods: {
    refresh() {
      this.loading = true;
      this.users = [];
      axios.post('/admin/user/list')
        .then(response => {
          this.users = response.data;
        }).catch(err => {
          console.error(err);
          console.error(err.stack);
          alert(err);
        })
        .then(() => {
          this.loading = false;
        });
    },
    onEditorFinish() {
      this.selected = -1;
      this.create = false;
    }
  },

  mounted() {
    this.refresh();
  }
};
</script>
