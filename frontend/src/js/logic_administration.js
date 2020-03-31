// Require dependencies
require('./util/bootstrap');
const isMounted = require('vue-is-mounted');

// create vue app
new Vue({
  name: 'Administration',
  el: '#app',
  mixins: [ isMounted ],

  data: {
    components: [
      {
        name: 'Users',
        description: 'Create, edit or delete users.',
        icon: 'fas fa-users',
        component: require('../vue/admin/users/List.vue')
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
    }
  },

  mounted() {
    $('.fader').fadeOut(500, () => $(this).remove());
  }
});
