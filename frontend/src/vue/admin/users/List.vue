<template>
  <div>

    <!-- filter-->
    <section class="section">
      <div class="columns">

        <!-- Search -->
        <div class="column is-4">
          <label class="label">Search</label>
          <div class="control">
            <input class="input" type="text" placeholder="enter a username or email" v-model="filter.username">
          </div>
        </div> <!-- end .column -->

        <!-- Filter by role -->
        <div class="column is-4">
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
        <div class="column is-4">
          <label class="label">Info</label>
          <p>
            Loaded {{ users.length }} users
          </p>
          <p v-if="!allShown">
            Showing {{ shown }} / {{ users.length }} users
          </p>
        </div>

      </div> <!-- end .columns -->

      <div class="columns">
        <div class="column is-4">
          <label class="label">Entries per page</label>
          <div class="select is-fullwidth">
            <select v-model="filter.entriesPerPage">
              <option>10</option>
              <option>20</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
        </div>
        <div class="column">
          <label class="label">Pagination</label>
          <paginate
            :page-count="pagination.max"
            :click-handler="changePage"
            prev-text="&lt;"
            next-text="&gt;"
            container-class="pagination"
            page-link-class="pagination-link"
            prev-link-class="button is-link is-outlined"
            next-link-class="button is-link is-outlined"
            active-class="is-current"
            disabled-class="is-disabled"
            :no-li-surround="true">
          </paginate>
        </div>
      </div>

    </section> <!-- end .section -->

    <hr>

    <!-- file tree-->
    <section class="section">
      <div class="container">
        <table class="table is-striped is-fullwidth is-hoverable" v-if="usersFiltered.length > 0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in usersFiltered" :key="user.id" @click="$emit('select', user.id)">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
            </tr>
          </tbody>
        </table>
        <div class="error-image" v-else>
          <img :src="path('img/illustrations/undraw_no_data_qbuo.svg')" style="width: 300px;">
          <span>No matching data found...</span>
        </div>
      </div> <!-- end .container -->
    </section> <!-- end .section -->

  </div> <!-- end wrapper -->
</template>

<script>
// Require modules
const Paginate = require('vuejs-paginate');

module.exports = {
  name: 'UserList',
  components: {
    'paginate': Paginate
  },

  props: {
    users: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      filter: null,
      page: 1,
      selected: -1
    };
  },
  computed: {
    pagination() {
      const entriesPerPage = this.filter.entriesPerPage;
      const amount = this.users.length;
      const start = entriesPerPage * (this.page - 1);
      let end = start + entriesPerPage - 1;
      if (end > amount) end = amount - 1;

      return {
        max: Math.ceil(amount / entriesPerPage),
        start, end
      };
    },
    usersFiltered() {
      let list = this.users;

      // filter by username or email
      list = list.filter(el => el.username.indexOf(this.filter.username) !== -1 || el.email.indexOf(this.filter.username) !== -1);

      // filter by role
      if (this.filter.role !== 'all') {
        list = list.filter(el => el.role.indexOf(this.filter.role) !== -1);
      }

      return list.slice(this.pagination.start, this.pagination.end + 1);
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
  },

  methods: {
    path(path) {
      return window.helpers.path(path);
    },
    reset() {
      this.filter = {
        username: '',
        role: 'all',
        entriesPerPage: 20
      };
      this.selected = -1;
    },
    changePage(num) {
      this.page = num;
    }
  },

  created() {
    this.reset();
  }
};
</script>
