// Require dependencies
require('./util/bootstrap');

// create vue app
new Vue({
  name: 'Administration',
  el: '#app',

  data: {
    components: [
      {
        name: 'Users',
        description: 'Create, edit or delete users.',
        icon: 'fas fa-users',
        component: require('../vue/admin/users/'),
        actions: [
          {
            name: 'Refresh',
            description: 'Reload the user list.',
            handler() {
              this.refresh();
            }
          },
          {
            name: 'Create a User',
            handler() {
              this.create = true;
            }
          }
        ]
      },
      {
        name: 'Config',
        description: 'Inspect configuration values.',
        icon: 'fas fa-cog',
      },
      {
        name: 'Statistics',
        description: 'View some general application statistics.',
        icon: 'fas fa-chart-bar',
      }
    ],
    selected: 0
  },
  computed: {
    theComponent() {
      return this.components[this.selected];
    },
    theActions() {
      return this.theComponent.actions || [];
    }
  },

  methods: {
    handleAction(index) {
      this.theActions[index].handler.call(this.$refs.theComponent);
    }
  },

  mounted() {
    $('.fader').fadeOut(500, () => $(this).remove());
  }
});
