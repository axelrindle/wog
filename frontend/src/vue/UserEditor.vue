<template lang="pug">
#content.small
  .card
    header.card-header
      p.card-header-title
        span.subtitle.is-6 User Editor

      // Refreshed indicator
      p.pointer(style="padding: .75rem;" v-if="showIndicator.refresh")
        span.has-text-success.icon
          i.fas.fa-sync-alt.fa-lg.fa-spin

    .card-content(v-if="showForm")
      // Username
      .field.is-horizontal
        .field-label.is-normal
          label.label Username
        .field-body
          .field
            .control.is-expanded.has-icons-left
              input.input(type="text" :value="user.username" disabled)
              span.icon.is-small.is-left
                i.fas.fa-user

      // Role
      .field.is-horizontal
        .field-label.is-normal
          label.label Role
        .field-body
          .field
            .control.is-expanded.has-icons-left
              .select
                select(v-model="user.role")
                  option(value="admin") Admin
                  option(value="user") User
              span.icon.is-small.is-left
                i.fas.fa-tag

      // Change password
      hr
      .field.is-horizontal
        .field-label.is-normal
          label.label Change password
        .field-body
          .field
            .control.is-expanded.has-icons-left
              input.input(type="password")
              span.icon.is-small.is-left
                i.fas.fa-key

      hr
      .buttons.is-right
        span.button(@click="cancel") Cancel
        span.button.is-success(@click="save") Save

    .card-content(v-else)
      .has-text-danger(v-if="error") {{ error }}
      .loading(v-else)
        span(style="margin-right: 10px;") Loading...
        i.fas.fa-sync-alt.fa-spin.fa-lg
</template>

<script>
module.exports = {
  name: 'UserEditor',

  props: {
    user: Object
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
      if (this.$root.error) return this.$root.error;
      if (this.loading) return null;
      if (!this.user) return 'No user selected!';
      return null;
    },
    showForm() {
      return !this.error && !this.loading;
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
