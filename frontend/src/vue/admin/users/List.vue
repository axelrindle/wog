<template>
  <div>

    <!-- filter-->
    <section class="section">
      <div class="columns">

        <!-- Search by username -->
        <div class="column">
          <label class="label">Search by Username</label>
          <div class="field has-addons">
            <div class="control">
              <input class="input" type="text" placeholder="johndoe" v-model="filter.username">
            </div>
            <div class="control">
              <button class="button is-danger is-fullwidth" @click="filter = ''">
                <span class="icon">
                  <i class="fas fa-trash-alt"></i>
                </span>
              </button>
            </div>
          </div>
        </div> <!-- end .column -->

        <!-- Filter by role -->
        <div class="column">
          <label class="label">Filter by Role</label>
          <div class="select is-fullwidth">
            <select v-model="filter.role">
              <option value="all">All</option>
              <option value="admin">Admins</option>
              <option value="user">Users</option>
            </select>
          </div>
        </div>

        <!-- Infos -->
        <div class="column">
          <p>
            Loaded {{ shown }} users
          </p>
          <p v-if="!allShown">
            Showing {{ shown }} / {{ users.length }} users
          </p>
        </div>

      </div> <!-- end .columns -->
    </section> <!-- end .section -->

    <hr>

    <!-- file tree-->
    <section class="section">
      <div class="container">
        <table class="table is-striped is-fullwidth is-hoverable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in usersFiltered" :key="user.id" @click="$emit('select', user.id)">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.role }}</td>
            </tr>
          </tbody>
        </table>
      </div> <!-- end .container -->
    </section> <!-- end .section -->

  </div> <!-- end wrapper -->
</template>

<script>
module.exports = {
  name: 'UserList',

  props: {
    users: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      filter: {
        username: '',
        role: 'all'
      },
      selected: -1
    };
  },
  computed: {
    usersFiltered() {
      let list = this.users;

      // filter by username
      list = list.filter(el => el.username.indexOf(this.filter.username) !== -1);

      // filter by role
      if (this.filter.role !== 'all') {
        list = list.filter(el => el.role.indexOf(this.filter.role) !== -1);
      }

      return list;
    },
    shown() {
      return this.usersFiltered.length;
    },
    allShown() {
      return this.shown === this.users.length;
    },
    theEntry() {
      return this.users[this.selected];
    }
  },
  watch: {
    filter() {
      if (this.selected !== -1 &&
          this.users[this.selected].username.indexOf(this.filter) === -1) {
        this.selected.file = -1;
      }
    },
    'selected': function() {
      localStorage.setItem('selectedUser', this.selected);
    }
  }
};
</script>
