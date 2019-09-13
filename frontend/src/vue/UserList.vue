<template lang="pug">
  div
    // filter
    section.section
      .container
        p.title Search
        p.subtitle Find a user
        .field.has-addons
          .control
            input.input(type='text', placeholder='johndoe' v-model="filter")
          .control
            a.button.is-danger(@click="filter = ''")
              span.icon
                i.fas.fa-trash-alt

    hr

    // file tree
    section.section
      .container
        p.title Users
          a(v-on:click="refresh()" v-if="selected.adapter").button.is-primary.is-rounded.is-pulled-right
            span.icon
              i.fas.fa-sync-alt

        p(v-if="allShown").subtitle Loaded {{ shown }} users
        p(v-else).subtitle Showing {{ shown }} / {{ users.length }} users
        hr
        ul.button-list
          li(v-for="(user, index) in usersFiltered")
            a.button(@click="selected = index" :class="{ 'is-link': selected === index }") {{ user.name }}
</template>

<script>
module.exports = {
  name: 'UserList',
  data() {
    return {
      loading: true,
      users: [{
        name: 'wog'
      }],
      filter: '',
      selected: -1
    };
  },
  computed: {
    usersFiltered() {
      return this.users.filter(el => el.name.indexOf(this.filter) !== -1);
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
      axios.post('/users')
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
          this.users[this.selected].name.indexOf(this.filter) === -1) {
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
