// Require dependencies
require('./bootstrap');
const UserList = require('../vue/UserList');
const UserEditor = require('../vue/UserEditor');
const isMounted = require('vue-is-mounted');

// create vue app
new Vue({
  name: 'Overview',
  el: '#app',
  components: { UserList, UserEditor },
  mixins: [ isMounted ],

  data: {
    error: null,
    isLoading: false
  },
  computed: {
    theUser() {
      if(!this.isMounted) return null;
      return this.$refs.userList.theEntry;
    }
  },

  methods: {
    ready() {
      $('#fader').fadeOut(500, () => $('#fader').remove());
    }
  }
});
