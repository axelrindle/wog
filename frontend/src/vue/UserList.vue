<template>
  <div>

    <!-- filter-->
    <section class="section">
      <div class="container">
        <p class="title">Search</p>
        <p class="subtitle">Find a user</p>
        <div class="field has-addons">
          <div class="control">
            <input class="input" type="text" placeholder="johndoe" v-model="filter">
          </div>
          <div class="control">
            <a class="button is-danger" @click="filter = ''">
              <span class="icon">
                <i class="fas fa-trash-alt"></i>
              </span>
            </a>
          </div>
        </div> <!-- end .field -->
      </div> <!-- end .container -->
    </section> <!-- end .section -->

    <hr>

    <!-- file tree-->
    <section class="section">
      <div class="container">
        <p class="title">
          Users
          <a class="button is-primary is-rounded is-pulled-right"
             @click="refresh()" v-if="selected.adapter">
            <span class="icon">
              <i class="fas fa-sync-alt"></i>
            </span>
          </a>
        </p> <!-- end .title -->
        <p class="subtitle" v-if="allShown">
          Loaded {{ shown }} users
        </p>
        <p class="subtitle" v-else>
          Showing {{ shown }} / {{ users.length }} users
        </p>

        <hr>

        <ul class="button-list">
          <li v-for="(user, index) in usersFiltered" :key="user.id">
            <a class="button" @click="selected = index" :class="{ 'is-link': selected === index }">
              {{ user.username }}
            </a>
          </li>
        </ul>
      </div> <!-- end .container -->
    </section> <!-- end .section -->

  </div> <!-- end wrapper -->
</template>

<script>
module.exports = {
  name: 'UserList',
  data() {
    return {
      loading: true,
      users: [],
      filter: '',
      selected: -1
    };
  },
  computed: {
    usersFiltered() {
      return this.users.filter(el => el.username.indexOf(this.filter) !== -1);
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
  methods: {
    refresh() {
      this.$root.error = null;
      this.loading = true;
      this.selected = -1;
      this.users = [];
      axios.post('/all/users')
        .then(response => {
          this.users = response.data;
        }).catch(err => {
          this.$root.error = err.message;
        })
        .then(() => {
          this.loading = false;
          this.$emit('ready');
        });
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

  mounted() {
    this.refresh();
  }
};
</script>
